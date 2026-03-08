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
-   YouTube Music

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
-   YouTube Music

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

-   User accounts
-   Preferences
-   Conversion history
-   Service data

------------------------------------------------------------------------

# Tech Stack

## Frontend

-   React
-   React Router
-   Axios
-   CSS / UI library

## Backend

-   Node.js
-   Express.js
-   JWT Authentication
-   REST API architecture

## Database

-   PostgreSQL
-   SQL relational modeling

## APIs

-   Spotify Web API
-   Apple Music API
-   YouTube Music search APIs

## Tools

-   Git / GitHub
-   Postman
-   Docker (optional)
-   Vercel / Netlify
-   Render / Railway

------------------------------------------------------------------------

# Database Design

## users

  column          type
  --------------- -----------
  id              UUID
  email           text
  password_hash   text
  created_at      timestamp

## preferences

  column            type
  ----------------- -----------
  user_id           UUID
  default_service   text
  updated_at        timestamp

## conversions

  column             type
  ------------------ -----------
  id                 UUID
  user_id            UUID
  source_url         text
  source_service     text
  target_service     text
  result_url         text
  confidence_score   float
  created_at         timestamp

## services (seeded)

  column     type
  ---------- ---------
  id         integer
  name       text
  base_url   text

Example services:

-   Spotify
-   Apple Music
-   YouTube Music

------------------------------------------------------------------------

# API Endpoints

## Authentication

### Register

POST /auth/register

Creates a new user account.

### Login

POST /auth/login

Returns a JWT token used for authenticated requests.

------------------------------------------------------------------------

## Preferences

### Get Preferences

GET /preferences

Returns the user's preferred music service.

### Update Preferences

PUT /preferences

Updates the default streaming service.

------------------------------------------------------------------------

## Conversion

### Convert Link

POST /convert

Request Example:

{ "sourceUrl": "spotify track url", "targetService": "apple_music" }

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

## Clone Repository

git clone https://github.com/yourusername/universal-music-link.git

------------------------------------------------------------------------

## Backend Setup

cd server\
npm install

Create `.env`:

DATABASE_URL=\
JWT_SECRET=\
SPOTIFY_CLIENT_ID=\
SPOTIFY_CLIENT_SECRET=

Run server:

npm run dev

------------------------------------------------------------------------

## Frontend Setup

cd client\
npm install\
npm start

------------------------------------------------------------------------

# Deployment

Example deployment architecture:

Frontend: - Vercel - Netlify

Backend: - Render - Railway - Fly.io

Database: - Hosted PostgreSQL

------------------------------------------------------------------------

# Future Improvements

## Additional Streaming Services

Support for:

-   Amazon Music
-   Deezer
-   Tidal

## Playlist Conversion

Convert entire playlists between platforms.

## Mobile Integration

Mobile app with:

-   Share sheet integration
-   Deep link handling

## Improved Matching

Enhancements such as:

-   ISRC-based matching
-   Machine learning ranking
-   User feedback corrections

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
