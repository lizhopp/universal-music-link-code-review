create extension if not exists pgcrypto;


create table services(
    id serial primary key,
    slug VARCHAR(50) UNIQUE not null,
    display_name VARCHAR(100) not null, 
    base_url text not null, 
    is_active boolean default true,
    created_at timestamp not null default now()
);

create table users(
    id UUID primary key default gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash text not null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

create table preferences(
    id uuid primary key default gen_random_uuid(),
    user_id uuid UNIQUE not null references users(id),
    default_service_id int not null references services(id),
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);


create table conversions(
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id),
    source_service_id int not null references services(id),
    target_service_id int not null references services(id),
    source_url text not null ,
    result_url text,
    source_track_id VARCHAR(255),
    target_track_id VARCHAR(255),
    track_title VARCHAR(255),
    primary_artist VARCHAR(255),
    album_name VARCHAR(255),
    duration_ms int,
    confidence_score numeric(4,3),
    status VARCHAR(50) not null default 'success',
    created_at timestamp not null default now()
);