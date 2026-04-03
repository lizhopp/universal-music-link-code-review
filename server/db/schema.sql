create extension if not exists pgcrypto;


create table platforms(
    id serial primary key,
    name VARCHAR(100) not null Unique, 
    slug VARCHAR(50) UNIQUE not null,
    base_url text not null, 
    is_active boolean not null default true,
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
    user_id uuid UNIQUE not null references users(id) on delete cascade,
    default_platform_id int not null references platforms(id),
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

CREATE TABLE song_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  platform_id INTEGER NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
  platform_track_id TEXT,
  url TEXT NOT NULL UNIQUE,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (song_id, platform_id)
);


create table conversions(
    id UUID primary key default gen_random_uuid(),
    user_id UUID references users(id) on delete set null,
    source_song_link_id UUID references song_link(id) on delete set null,
    target_song_link_id UUID REFERENCES song_links(id) ON DELETE SET NULL,
    source_url TEXT NOT NULL,
    requested_target_platform_id INTEGER REFERENCES platforms(id),
    status TEXT NOT NULL,
    confidence_score NUMERIC(4,3),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_saved_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  song_link_id UUID NOT NULL REFERENCES song_links(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, song_link_id)
);