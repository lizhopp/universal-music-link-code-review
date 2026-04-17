Nice. That means #18 is effectively proven too.

Your backend progression is getting really solid:

#16 Setup Spotify API client
#19 Fetch track metadata from Spotify
#20 Normalize Spotify track data
#18 Extract Spotify track ID from URL
The best next issue is #17 Detect source service from URL.

Why #17 next:

it pairs naturally with #18
right now you can extract a Spotify track ID once you already know it’s a Spotify track URL
#17 is the step that answers: “what kind of URL did the user give me?”
That gets /convert closer to a real flow:

receive a music URL
detect source service
if Spotify, extract track ID
fetch Spotify track
normalize it
A clean helper for #17 would be something like:

detectSourceService(url)
And for now it can return something very small, like:

"spotify"
or throw if unsupported.

For the first version, I’d keep it narrow:

detect Spotify URLs
maybe recognize Apple Music URLs if you want to future-proof
throw on anything else
If you want, we can start planning detectSourceService(url) block by block next.


6:39 PM
ok
6:44 PM


Great. For #17, keep the first version simple.

Goal:

take a URL
determine what music service it belongs to
return the service name in a consistent format
A good helper name is:

detectSourceService(url)
And for now, I’d have it return strings like:

"spotify"
"apple-music"
or throw an error if unsupported.

Why this helper matters:

later /convert should not assume the input is Spotify
it should inspect the URL first, then decide which extraction/fetch logic to use
The cleanest approach again is the URL class.

The mental flow is:

receive url
fail if missing
parse with new URL(url)
inspect hostname
match known services
return the correct slug
For the first pass, your detection logic can be based mostly on hostname.

Examples:

Spotify:

open.spotify.com
Apple Music:

music.apple.com
So the helper can think like:

if hostname contains spotify.com → return "spotify"
if hostname contains apple.com and likely music.apple.com → return "apple-music"
otherwise throw "Unsupported music service URL."
That’s enough for a first version.

The important design choice here is:
return a normalized internal service slug, not the raw hostname.

So instead of returning:

"open.spotify.com"
return:

"spotify"
That makes your later routing logic cleaner.

A good eventual /convert flow will become:

const service = detectSourceService(url);

if (service === "spotify") {
  const trackId = extractSpotifyTrackId(url);
  const rawTrack = await getSpotifyTrackById(trackId);
  const normalizedTrack = normalizeSpotifyTrack(rawTrack);
}
That’s why #17 is the right next step.

If you want, next I can walk you through detectSourceService(url) block by block in the same style as the other helpers.


6:44 PM
yes please
6:45 PM


Absolutely. Here’s detectSourceService(url) block by block.

Block 1

Function skeleton:

export function detectSourceService(url) {

}
Why:

this is just a pure helper
no network call
no async needed
Block 2

Guard against missing input:

export function detectSourceService(url) {
  if (!url) {
    throw new Error("URL is required.");
  }
}
Why:

fail early if nothing was passed in
keeps the rest of the function simpler
Block 3

Parse the URL:

export function detectSourceService(url) {
  if (!url) {
    throw new Error("URL is required.");
  }

  const parsedUrl = new URL(url);
}
Why:

new URL(url) gives you clean access to things like:
hostname
pathname
search
Block 4

Read the hostname:

export function detectSourceService(url) {
  if (!url) {
    throw new Error("URL is required.");
  }

  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname;
}
For example:

https://open.spotify.com/track/... → open.spotify.com
https://music.apple.com/us/song/... → music.apple.com
Block 5

Check for Spotify first:

export function detectSourceService(url) {
  if (!url) {
    throw new Error("URL is required.");
  }

  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname;

  if (hostname.includes("spotify.com")) {
    return "spotify";
  }
}
Why:

this gives you a normalized internal slug
later your app can branch on "spotify" instead of raw hostnames
Block 6

Add Apple Music support:

export function detectSourceService(url) {
  if (!url) {
    throw new Error("URL is required.");
  }

  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname;

  if (hostname.includes("spotify.com")) {
    return "spotify";
  }

  if (hostname.includes("music.apple.com")) {
    return "apple-music";
  }
}
Why:

even if you’re not using Apple Music yet, this makes the helper future-friendly
still keeps the logic simple
Block 7

Handle unsupported URLs:

export function detectSourceService(url) {
  if (!url) {
    throw new Error("URL is required.");
  }

  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname;

  if (hostname.includes("spotify.com")) {
    return "spotify";
  }

  if (hostname.includes("music.apple.com")) {
    return "apple-music";
  }

  throw new Error("Unsupported music service URL.");
}
Why:

if it’s not a supported hostname, the helper should say so clearly
Block 8

Wrap parsing in try/catch for friendlier invalid-URL errors:

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
Why:

invalid URL strings become easier to understand
your errors stay consistent with your other helpers
Full first version

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
This is a strong first version for #17.

A simple test plan:

Spotify URL → returns "spotify"
Apple Music URL → returns "apple-music"
random URL → throws unsupported error
invalid string like "hello" → throws invalid/detect error
If you want, next I can help you think through the temporary /convert test for this helper.


