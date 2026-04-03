# Universal Music Link ERD

This ERD reflects the current relational schema defined in `server/db/schema.sql`.

```mermaid
erDiagram
    PLATFORMS {
        int id PK
        string name UK
        string slug UK
        string base_url
        boolean is_active
        timestamp created_at
    }

    SONGS {
        uuid id PK
        string title
        string primary_artist
        string album_name
        int duration_ms
        string isrc UK
        timestamp created_at
        timestamp updated_at
    }

    USERS {
        uuid id PK
        string email UK
        string password_hash
        timestamp created_at
        timestamp updated_at
    }

    PREFERENCES {
        uuid id PK
        uuid user_id UK,FK
        int default_platform_id FK
        timestamp created_at
        timestamp updated_at
    }

    SONG_LINKS {
        uuid id PK
        uuid song_id FK
        int platform_id FK
        string platform_track_id
        string url UK
        boolean is_verified
        timestamp created_at
        timestamp updated_at
    }

    CONVERSIONS {
        uuid id PK
        uuid user_id FK
        uuid source_song_link_id FK
        uuid target_song_link_id FK
        string source_url
        int requested_target_platform_id FK
        string status
        numeric confidence_score
        timestamp created_at
    }

    USER_SAVED_LINKS {
        uuid id PK
        uuid user_id FK
        uuid song_link_id FK
        timestamp created_at
    }

    USERS ||--|| PREFERENCES : "has one"
    PLATFORMS ||--o{ PREFERENCES : "default for"

    SONGS ||--o{ SONG_LINKS : "has links on"
    PLATFORMS ||--o{ SONG_LINKS : "hosts links for"

    USERS ||--o{ CONVERSIONS : "creates"
    SONG_LINKS ||--o{ CONVERSIONS : "source in"
    SONG_LINKS ||--o{ CONVERSIONS : "target in"
    PLATFORMS ||--o{ CONVERSIONS : "requested target"

    USERS ||--o{ USER_SAVED_LINKS : "saves"
    SONG_LINKS ||--o{ USER_SAVED_LINKS : "saved as"
```

## Constraint Notes

- `preferences.user_id` is unique (one preference row per user).
- `song_links.url` is unique.
- `song_links` has composite unique key: `(song_id, platform_id)`.
- `user_saved_links` has composite unique key: `(user_id, song_link_id)`.
