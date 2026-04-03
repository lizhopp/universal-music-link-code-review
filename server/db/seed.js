import db from "./client.js";
import { addPlatform } from "./queries/platforms.js";
async function seed() {
    const spotify = {
        name: "Spotify",
        slug: "spotify",
        baseUrl: "https://open.spotify.com",
    };

    const appleMusic = {
        name: "Apple Music",
        slug: "apple-music",
        baseUrl: "https://music.apple.com",
    };

    await addPlatform(spotify);
    await addPlatform(appleMusic);
}

await db.connect();
await seed();
await db.end();
console.log("Seeding complete.");

