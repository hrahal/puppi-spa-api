import { Injectable } from '@nestjs/common';
import { PuppyRequest } from '../../types/puppy-requests.entity';
import { PuppyRepository } from 'src/modules/puppy-requests/puppy-requests.repository';
import { ChangeOrder } from 'src/types/puppy-requests.entity';

function formatDate(isoString) {
  return isoString.split('T')[0];
}

@Injectable()
export class PuppyRequestsService {
  constructor(private readonly puppyRepository: PuppyRepository) { }

  async findAll(date: string): Promise<PuppyRequest[]> {
    const data = await this.puppyRepository.getAll(date);
    return data;
  }

  async findOne(id: number): Promise<PuppyRequest> {
    return this.puppyRepository.getOne(id);
  }

  async deleteOne(id: number): Promise<any> {
    const [reqTodelete] = await this.puppyRepository.getOne(id);
    
    let allRequests = await this.puppyRepository.getAll(
      formatDate(reqTodelete.date.toISOString()),
    );

    if (allRequests.length == 1) {
      await this.puppyRepository.deleteOne(id);
      return reqTodelete;
    }

    const reorderedRequests = allRequests
      .filter((request) => request.id != id && !request.is_served)
      .sort((a, b) => a.order_number - b.order_number)
      .map((request, index) => ({ id: request.id, order: index + 1 }));

    await Promise.all([
      this.puppyRepository.updateOrder(reorderedRequests),
      this.puppyRepository.deleteOne(id),
    ]);

    return reqTodelete;
  }

  async updateOne(
    id: number,
    puppyRequest: PuppyRequest,
  ): Promise<PuppyRequest> {
    if (puppyRequest.is_served) {
      return this.editAndReorder(id, puppyRequest);
    }
    return this.puppyRepository.editOne(id, puppyRequest);
  }

  async editAndReorder(
    id: number,
    puppyRequest: PuppyRequest,
  ): Promise<PuppyRequest> {
    const editCustomer = await this.puppyRepository.editOne(id, {
      ...puppyRequest,
    });
    let allRequests = await this.puppyRepository.getAll(formatDate(puppyRequest.date));
    const custumerOrder = puppyRequest.order_number;

    if (allRequests.length == 1) {
      return editCustomer;
    }
    
    const reorderedRequests = this.reOrderRequests(allRequests, custumerOrder, puppyRequest);
    await this.puppyRepository.updateOrder(reorderedRequests);

    return editCustomer;
  }

  private reOrderRequests(allRequests: any, custumerOrder: number, puppyRequest: PuppyRequest) {
    return allRequests
      .filter((request) => !request.is_served)
      .sort((a, b) => a.order_number - b.order_number)
      .slice(custumerOrder - 1)
      .map((request) => {
        return { id: request.id, order: request.order_number - 1 };
      })
      .concat({ id: puppyRequest.id, order: -1 });
  }

  async createOne(puppyRequest: PuppyRequest): Promise<PuppyRequest> {
    let orderNumber = await this.getLastOrderNumber(puppyRequest);
    return this.puppyRepository.createOne({
      ...puppyRequest,
      order_number: orderNumber,
    });
  }

  private async getLastOrderNumber(puppyRequest: PuppyRequest) {
    const lastOrder = await this.getLastOrder(puppyRequest.date);

    if (lastOrder.length > 0) {
      return lastOrder[0].order_number + 1;
    } else {
      return 1;
    }
  }

  async search(query: string): Promise<PuppyRequest[]> {
    return this.puppyRepository.search(query);
  }

  async getLastOrder(date: string): Promise<PuppyRequest[]> {
    return this.puppyRepository.getLastOrder(date);
  }

  async changeOrder(changeOrderData: ChangeOrder): Promise<PuppyRequest[]> {
    console.log(changeOrderData);

    const list = (await this.puppyRepository.getAll(changeOrderData.date))
      .filter(request => !request.is_served)
      .sort((a, b) => a.order_number - b.order_number);

    const from = list.find(request => request.id === changeOrderData.fromId);
    const to = list.find(request => request.id === changeOrderData.toId);

    if (!from || !to) {
      console.error("One or both requests not found.");
      return [];
    }

    const affectedRequests = this.calculateAffectedRequests(list, from, to);

    await this.puppyRepository.updateOrder(
      affectedRequests.map(req => ({ id: req.id, order: req.order_number }))
    );

    return [];
  }

  private calculateAffectedRequests(list: PuppyRequest[], from: PuppyRequest, to: PuppyRequest): PuppyRequest[] {
    const fromNumber = from.order_number;
    const toNumber = to.order_number;

    if (fromNumber > toNumber) {
      return list
        .slice(toNumber - 1, fromNumber - 1)
        .map(request => ({ ...request, order_number: request.order_number + 1 }))
        .concat({ ...from, order_number: toNumber });
    } else {
      return list
        .slice(fromNumber, toNumber)
        .map(request => ({ ...request, order_number: request.order_number - 1 }))
        .concat({ ...from, order_number: toNumber });
    }
  }
}
