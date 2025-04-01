CREATE TYPE puppy_service_enum AS ENUM (
    'grooming',
    'training',
    'walking',
    'daycare'
);

CREATE TABLE puppy_requests (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    dog_name VARCHAR(255) NOT NULL,
    service puppy_service_enum[] NOT NULL,
    price NUMERIC NOT NULL,
    arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_served BOOLEAN NOT NULL,
    order_number INTEGER 
);

INSERT INTO puppy_requests (
    date,
    first_name,
    last_name,
    dog_name,
    service,
    price,
    arrival_time,
    is_served,
    order_number
) VALUES
    ('2025-03-29T09:29:00Z', 'Alice', 'Smith', 'Buddy', ARRAY['grooming', 'training']::puppy_service_enum[], 50.00, '2025-03-29T09:30:00Z', false, 1),
    ('2025-03-29T09:29:00Z', 'Bob', 'Johnson', 'Max', ARRAY['walking']::puppy_service_enum[], 30.00, '2025-03-27T09:30:00Z', false, 2),
    ('2025-03-29T09:29:00Z', 'Charlie', 'Williams', 'Bella', ARRAY['daycare']::puppy_service_enum[], 40.00, '2025-03-27T09:30:00Z', false, 3),
    ('2025-03-29T09:29:00Z', 'David', 'Brown', 'Rocky', ARRAY['grooming']::puppy_service_enum[], 55.00, '2025-03-27T09:30:00Z', false, 4),
    ('2025-03-29T09:29:00Z', 'Eve', 'Davis', 'Luna', ARRAY['training', 'walking']::puppy_service_enum[], 45.00, '2025-03-27T09:30:00Z', false, 5);
