import axios from 'axios';

const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_VIDEO_URL = "https://www.googleapis.com/youtube/v3/videos";

export function extractYouTubeVideoId(url) {
    if (!url) {
        throw new Error("YouTube URL is required.");
    }

    try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname.toLowerCase();

        if (hostname === "youtu.be") {
            const videoId = parsedUrl.pathname.split("/")[1];

            if (!videoId) {
                throw new Error("Invalid YouTube short URL.");
            }

            return videoId;
        }

        if (
            hostname.includes("youtube.com") ||
            hostname.includes("music.youtube.com")
        ) {
            const videoId = parsedUrl.searchParams.get("v");

            if (!videoId) {
                throw new Error("Invalid YouTube video URL.");
            }

            return videoId
        }
        throw new Error("Not a YouTube URL.");
    } catch (error) {
        throw new Error(`Failed to extract YouTube video ID: ${error.message}`);
    }
}


export function buildYouTubeSearchQuery(track) {
    const artistNames = track.artistNames?.filter(Boolean) ?? [];

    if (!track?.title || artistNames.length === 0) {
        throw new Error("Track title and artist are required for YouTube conversion.");
    }

    return `${track.title} ${artistNames.join(" ")}`;
}

function scoreYouTubeCandidate(result, track) {
    const title = result.snippet?.title?.toLowerCase() ?? "";
    const channelTitle = result.snippet?.channelTitle?.toLowerCase() ?? "";
    const trackTitle = track.title?.toLowerCase() ?? "";
    const baseTrackTitle = trackTitle
        .replace(/\s[-–—]\s+(live|acoustic|remaster(?:ed)?|version).*$/i, "")
        .trim();
    const artistNames = track.artistNames?.map((artist) => artist.toLowerCase()) ?? [];
    const matchedArtists = artistNames.filter(
        (artist) => title.includes(artist) || channelTitle.includes(artist)
    );
    const titleHasArtist = artistNames.some((artist) => title.includes(artist));
    const channelHasArtist = artistNames.some((artist) => channelTitle.includes(artist));
    const titleHasExactTrack = title.includes(trackTitle);
    const titleHasBaseTrack =
        baseTrackTitle.length > 0 &&
        baseTrackTitle !== trackTitle &&
        title.includes(baseTrackTitle);

    let score = 0;

    if (titleHasExactTrack) score += 5;
    if (titleHasBaseTrack) score += 8;
    score += matchedArtists.length * 4;

    if (titleHasArtist) score += 3;
    if (channelHasArtist) score += 3;

    if (title.includes("official audio")) score += 6;
    if (title.includes("official video")) score += 5;
    if (channelHasArtist && channelTitle.includes("topic")) score += 4;

    if (!titleHasArtist && !channelHasArtist) score -= 12;
    if (title.includes("live") && !titleHasExactTrack && !titleHasBaseTrack) score -= 5;
    if (title.includes("cover") && !titleHasBaseTrack) score -= 6;
    if (title.includes("karaoke")) score -= 8;
    if (title.includes("reaction")) score -= 8;
    if (title.includes("remix")) score -= 5;
    if (title.includes("sped up")) score -= 8;
    if (title.includes("slowed")) score -= 8;
    if (title.includes("lyrics")) score -= 3;

    return score;
}


export async function getYouTubeVideoById(videoId) {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
        throw new Error("Missing YouTube API key.");
    }

    if (!videoId) {
        throw new Error("YouTube video ID is required.");
    }

    try {
        const response = await axios.get(YOUTUBE_VIDEO_URL, {
            params: {
                key: apiKey,
                part: "snippet",
                id: videoId,
            },
        });

        const [video] = response.data.items ?? [];

        if (!video) {
            throw new Error("YouTube video not found.");
        }

        return video;
    } catch (error) {
        const youtubeMessage = error.response?.data?.error?.message || error.message;
        throw new Error(`Failed to fetch YouTube video: ${youtubeMessage}`);
    }
}


function cleanYouTubeText(value) {
    if (!value) {
        return "";
    }

    return value
        .replace(/\([^)]*(official|original|lyrics?|audio|video)[^)]*\)/gi, "")
        .replace(/\[[^\]]*(official|original|lyrics?|audio|video)[^\]]*\]/gi, "")
        .replace(/\s{2,}/g, " ")
        .trim();
}

function parseYouTubeArtistAndTitle(rawTitle) {
    const cleanedTitle = cleanYouTubeText(rawTitle);
    const parts = cleanedTitle
        .split(/\s[-–—]\s/)
        .map((part) => part.trim())
        .filter(Boolean);

    if (parts.length >= 2) {
        const leftSide = parts[0];
        const rightSide = parts.slice(1).join(" - ");

        const leftWordCount = leftSide.split(/\s+/).filter(Boolean).length;
        const rightWordCount = rightSide.split(/\s+/).filter(Boolean).length;

        if (leftWordCount > 3 && rightWordCount <= 3) {
            return {
                artistFromTitle: rightSide,
                titleFromTitle: leftSide,
            };
        }

        return {
            artistFromTitle: leftSide,
            titleFromTitle: rightSide,
        };
    }

    return {
        artistFromTitle: "",
        titleFromTitle: cleanedTitle,
    };
}



function cleanYouTubeChannelArtist(channelTitle) {
    if (!channelTitle) {
        return "";
    }

    return channelTitle
        .replace(/vevo$/i, "")
        .replace(/\s*-\s*topic$/i, "")
        .replace(/\s+official$/i, "")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\s{2,}/g, " ")
        .trim();
}




export function normalizeYouTubeTrack(video) {
    if (!video) {
        throw new Error("YouTube video data is required.");
    }

    const platformTrackId = video.id;
    const rawTitle = video.snippet?.title ?? "";
    const rawChannelTitle = video.snippet?.channelTitle ?? "";
    const { artistFromTitle, titleFromTitle } = parseYouTubeArtistAndTitle(rawTitle);
    const channelTitle = cleanYouTubeChannelArtist(rawChannelTitle);
    const primaryArtist = artistFromTitle || channelTitle;

    const sourceUrl = `https://www.youtube.com/watch?v=${platformTrackId}`;

    return {
        sourcePlatformSlug: "youtube",
        platformTrackId,
        sourceUrl,
        title: titleFromTitle,
        channelTitle,
        primaryArtist,
        artistNames: [primaryArtist].filter(Boolean),
    };
}


export async function searchYouTubeForTrack(track) {
    const apiKey = process.env.YOUTUBE_API_KEY;


    if (!apiKey) {
        throw new Error("Missing YouTube API key.");
    }

    const query = buildYouTubeSearchQuery(track);

    const response = await axios.get(YOUTUBE_SEARCH_URL, {
        params: {
            key: apiKey,
            part: "snippet",
            type: "video",
            videoCategoryId: "10",
            maxResults: 5,
            q: query,
        },
    });

    const candidates = response.data.items ?? [];

    if (candidates.length === 0) {
        throw new Error("No YouTube match found.");
    }

    const rankedCandidates = candidates.map((result) => ({
        result, score: scoreYouTubeCandidate(result, track),
    })).sort((a, b) => b.score - a.score);

    const bestCandidate = rankedCandidates[0]?.result;


    if (!bestCandidate?.id?.videoId) {
        throw new Error("No YouTube match found.")
    }

    const videoId = bestCandidate.id.videoId

    return {
        targetPlatformSlug: 'youtube',
        platformTrackId: videoId,
        title: bestCandidate.snippet?.title,
        channelTitle: bestCandidate.snippet?.channelTitle,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        searchQuery: query,
    };
}