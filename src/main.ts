import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let server;

async function bootstrap() {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('Puppy Spa API')
    .setDescription('The Puppy spa API description')
    .setVersion('1.0')
    .addTag('puppy')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);


  //app.enableCors(); // Enable CORS if needed
  await app.init();
  return expressApp;
  //await app.listen(process.env.PORT ?? 8080);
}
//bootstrap();

module.exports = async (req, res) => {
  if (!server) {
    server = await bootstrap();
  }
  return server(req, res);
};

