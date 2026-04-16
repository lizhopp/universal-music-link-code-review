import axios from "axios";

//helper function to gain a token from Spotify in order to be able to view their track meta data.
export async function getSpotifyAccessToken() {
  //these two variables are being read from .env
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  //makes sure the function fails if the two variables above don't exist
  if (!clientId || !clientSecret) {
    throw new Error("Missing Spotify credentials.");
  }

  const credentials = `${clientId}:${clientSecret}`;
  const encodedCredentials = Buffer.from(credentials).toString("base64");

  const body = new URLSearchParams({
    grant_type: "client_credentials",
  });

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      body,
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    const spotifyError = error.response?.data;
    const message =
      spotifyError?.error_description || spotifyError?.error || error.message;

    throw new Error(`Failed to get Spotify access token: ${message}`);
  }
}

export async function getSpotifyTrackById(trackId) {
  if (!trackId) {
    throw new Error("Spotify track ID is required.");
  }
  try {
    const accessToken = await getSpotifyAccessToken();

    const url = `https://api.spotify.com/v1/tracks/${trackId}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    const spotifyError = error.response?.data;
    const message =
      spotifyError?.error?.message ||
      spotifyError?.error_description ||
      error.message;

    throw new Error(`Failed to fetch Spotify track: ${message}`);
  }
}

export function normalizeSpotifyTrack(track) {
  if (!track) {
    throw new Error("Spotify track data is required.");
  }

  const platformTrackId = track.id;
  const sourceUrl = track.external_urls?.spotify;
  const title = track.name;
  const primaryArtist = track.artists?.[0]?.name;
  const albumName = track.album?.name;
  const durationMs = track.duration_ms;
  const isrc = track.external_ids?.isrc;

  return {
    sourcePlatformSlug: "spotify",
    platformTrackId,
    sourceUrl,
    title,
    primaryArtist,
    albumName,
    durationMs,
    isrc,
  };
}

export function extractSpotifyTrackId(url) {
  if (!url) {
    throw new Error("Spotify URL is required.");
  }

  try {
    const parsedUrl = new URL(url);

    if (!parsedUrl.hostname.includes("spotify.com")) {
      throw new Error("Not a spotify URL.");
    }

    const pathParts = parsedUrl.pathname.split("/");
    const resourceType = pathParts[1];
    const trackId = pathParts[2];

    if (resourceType !== "track" || !trackId) {
      throw new Error("Invalid Spotify track ");
    }

    return trackId;
  } catch (error) {
    throw new Error(`Failed to extract Spotify track ID: ${error.message}`);
  }
}

export function detectSourceService(url) {
  if (!url) {
    throw new Error("URL is required.");
  }

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    if (hostname.includes("spotify.com")) {
      return "spotify";
    }

    if (hostname.includes("music.apple.com")) {
      return "apple-music";
    }

    throw new Error("Unsupported music service URL.");
  } catch (error) {
    throw new Error(`Failed to detect source service: ${error.message}`);
  }
}
