# Universal Music Link

A full-stack application that converts music links between streaming
platforms so users can open songs in their **preferred music service**.

Instead of forcing someone to open a Spotify link in Spotify or an Apple
Music link in Apple Music, this app detects the song behind the link and
generates the equivalent link for another platform.

Example:

Spotify Link → Universal Music Link → Apple Music Link

This project demonstrates a **complete Software Development Lifecycle
(SDLC)** implementation including frontend development, backend API
design, database modeling, authentication, deployment, and client
integrations.

------------------------------------------------------------------------

# Table of Contents

-   Overview
-   Problem
-   Solution
-   Features
-   Architecture
-   Tech Stack
-   Database Design
-   API Endpoints
-   Extension Client
-   Installation
-   Deployment
-   Future Improvements

------------------------------------------------------------------------

# Overview

Universal Music Link is a **full-stack web application** that allows
users to convert music track links between streaming services such as:

-   Spotify
-   Apple Music

MVP support includes Spotify and Apple Music.

Users can paste a song link and instantly receive a playable version of
that song in their **preferred streaming service**.

The application also allows users to:

-   Save conversion history
-   Set default streaming preferences
-   Quickly open songs in their favorite platform

An optional **browser extension** integrates with the system to convert
links directly from webpages.

------------------------------------------------------------------------

# Problem

Music sharing across platforms is fragmented.

If someone sends a Spotify link to a user who primarily uses Apple
Music, the link forces them to open Spotify or a browser player.

There is currently **no universal way to open a song link in a user's
preferred service automatically.**

This leads to:

-   Friction when sharing music
-   Platform lock-in
-   Poor cross-platform user experience

------------------------------------------------------------------------

# Solution

Universal Music Link solves this by acting as a **link translation
layer**.

The system:

1.  Accepts a music link
2.  Identifies the source platform
3.  Retrieves song metadata via API
4.  Searches the target platform
5.  Returns the best matching link

This allows users to open music in **any supported streaming service**
regardless of the original link.

------------------------------------------------------------------------

# Features

## Link Conversion

Convert track links between supported platforms.

Example flow:

Input: Spotify track URL\
Output: Apple Music equivalent link

------------------------------------------------------------------------

## User Accounts

Users can create accounts to:

-   Save conversion history
-   Set default music service
-   Manage preferences

------------------------------------------------------------------------

## Conversion History

Authenticated users can:

-   View previously converted links
-   Reopen songs quickly
-   Delete old history entries

------------------------------------------------------------------------

## Preferred Streaming Service

Users can set a default service such as:

-   Spotify
-   Apple Music

Conversions will automatically target the selected service.

------------------------------------------------------------------------

## Browser Extension (Optional Client)

The browser extension allows users to:

-   Right-click a music link
-   Select **Open in My Preferred Service**
-   Automatically redirect to the converted link

------------------------------------------------------------------------

# Architecture

The project follows a **full-stack client-server architecture**.

Browser Extension → React Frontend → Express API → Streaming APIs\
                                     ↓\
                               PostgreSQL Database

### Frontend

Handles user interface and user interactions.

Responsibilities:

-   Authentication
-   Submitting conversion requests
-   Displaying results
-   Rendering user history

### Backend

Handles application logic.

Responsibilities:

-   API routing
-   Authentication
-   Link parsing
-   Metadata retrieval
-   Matching algorithm
-   Database interaction

### Database

Stores:

-   Canonical songs
-   Platform-specific song links
-   User accounts and preferences
-   Conversion history
-   Saved links

------------------------------------------------------------------------

# Tech Stack

## Frontend

-   React
-   Vite
-   React Router
-   Axios
-   CSS / UI library

## Backend

-   Node.js
-   Express.js
-   PostgreSQL client (`pg`)
-   bcrypt
-   JWT Authentication
-   REST API architecture

## Database

-   PostgreSQL
-   SQL relational modeling

## APIs

-   Spotify Web API
-   Apple Music API

## Tools

-   Git / GitHub
-   Postman
-   Docker (optional)
-   Vercel / Netlify
-   Render / Railway

------------------------------------------------------------------------

# Database Design

The schema lives in `server/db/schema.sql`.

## platforms

  column      type
  ----------- -----------
  id          serial
  name        varchar(100) unique
  slug        varchar(50) unique
  base_url    text
  is_active   boolean
  created_at  timestamp

## songs

  column          type
  --------------- -----------
  id              UUID
  title           text
  primary_artist  text
  album_name      text
  duration_ms     integer
  isrc            text unique
  created_at      timestamp
  updated_at      timestamp

## users

  column          type
  --------------- -----------
  id              UUID
  email           text unique
  password_hash   text
  created_at      timestamp
  updated_at      timestamp

## preferences

  column               type
  -------------------- -----------
  id                   UUID
  user_id              UUID unique
  default_platform_id  integer
  created_at           timestamp
  updated_at           timestamp

## song_links

  column            type
  ----------------- -----------
  id                UUID
  song_id           UUID
  platform_id       integer
  platform_track_id text
  url               text unique
  is_verified       boolean
  created_at        timestamp
  updated_at        timestamp

Unique pair: `(song_id, platform_id)` to prevent duplicate link rows per song+platform.

## conversions

  column                        type
  ----------------------------- -----------
  id                            UUID
  user_id                       UUID nullable
  source_song_link_id           UUID nullable
  target_song_link_id           UUID nullable
  source_url                    text
  requested_target_platform_id  integer nullable
  status                        text
  confidence_score              numeric(4,3)
  created_at                    timestamp

## user_saved_links

  column        type
  ------------- -----------
  id            UUID
  user_id       UUID
  song_link_id  UUID
  created_at    timestamp

Unique pair: `(user_id, song_link_id)` to prevent duplicate saves.

## Relationship Map

-   `preferences.user_id -> users.id` (one preference row per user)
-   `preferences.default_platform_id -> platforms.id`
-   `song_links.song_id -> songs.id`
-   `song_links.platform_id -> platforms.id`
-   `conversions.user_id -> users.id` (nullable)
-   `conversions.source_song_link_id -> song_links.id` (nullable)
-   `conversions.target_song_link_id -> song_links.id` (nullable)
-   `conversions.requested_target_platform_id -> platforms.id` (nullable)
-   `user_saved_links.user_id -> users.id`
-   `user_saved_links.song_link_id -> song_links.id`

## Schema Change Byproducts

-   `services` became `platforms` with explicit `slug` and `is_active`.
-   Preferences now store `default_platform_id` instead of a service name string.
-   Conversion linkage is now FK-based (`source_song_link_id`, `target_song_link_id`) instead of only raw source/target service fields.
-   Canonical `songs` + `song_links` enables cross-platform mapping around one song identity.
-   `user_saved_links` now models saved links as a proper join table.

------------------------------------------------------------------------

# API Endpoints

## Authentication

### Register

POST /users/register

Creates a new user account.

### Login

POST /users/login

Returns a JWT token used for authenticated requests.

------------------------------------------------------------------------

## Preferences

### Get Preferences

GET /preferences

Returns the user's preferred platform setting.

### Update Preferences

PUT /preferences

Updates the user's default platform (mapped to `preferences.default_platform_id`).

------------------------------------------------------------------------

## Conversion

### Convert Link

POST /convert

Request Example:

{ "sourceUrl": "spotify track url", "requestedTargetPlatformId": 2 }

Response Example:

{ "sourceService": "spotify", "targetService": "apple_music",
"trackTitle": "Blinding Lights", "artist": "The Weeknd", "resultUrl":
"...", "confidenceScore": 0.94 }

### Conversion History

GET /conversions

Returns previously converted links.

### Delete Conversion

DELETE /conversions/:id

Removes a conversion entry.

------------------------------------------------------------------------

# Matching Algorithm

To find equivalent songs across platforms the system:

1.  Extracts metadata from the source platform
2.  Searches the target platform API
3.  Scores results based on:
    -   Title similarity
    -   Artist similarity
    -   Track duration
4.  Returns the highest confidence match.

------------------------------------------------------------------------

# Installation

Node requirement (from `engines`): `>=22 <25`.

## Clone Repository

git clone https://github.com/yourusername/universal-music-link.git

------------------------------------------------------------------------

## Backend Setup

cd server\
npm install

Create `.env`:

DATABASE_URL=postgresql://<user>@localhost:5432/universal_music_link\
JWT_SECRET=\
SPOTIFY_CLIENT_ID=\
SPOTIFY_CLIENT_SECRET=

Apply schema:

createdb universal_music_link\
psql -d universal_music_link -f db/schema.sql

Run server:

npm run dev

------------------------------------------------------------------------

## Frontend Setup

cd client/Universal-Music-Link\
npm install\
npm run dev

------------------------------------------------------------------------

# Deployment

Example deployment architecture:

Frontend: - Vercel - Netlify

Backend: - Render - Railway - Fly.io

Database: - Hosted PostgreSQL

------------------------------------------------------------------------

# Future Improvements

## Future Implementations (Post-MVP)

Additional streaming service support:

-   YouTube Music
-   Amazon Music
-   Deezer
-   Tidal

## Stretch Goals

-   Playlist conversion between platforms
-   Mobile integration (share sheet + deep link handling)
-   Improved matching (ISRC-first matching, ML ranking, user feedback corrections)

------------------------------------------------------------------------

# Capstone Learning Objectives

This project demonstrates:

-   Full-stack web development
-   REST API design
-   Authentication and authorization
-   Relational database modeling
-   Integration with third-party APIs
-   Software Development Lifecycle implementation
-   Collaborative development with Git
