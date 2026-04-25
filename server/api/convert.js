import express from "express";
import {
  getSpotifyTrackById,
  normalizeSpotifyTrack,
  extractSpotifyTrackId,
  detectSourceService,
  searchSpotifyForTrack,
} from "#utils/spotify";
import {
  searchYouTubeForTrack,
  extractYouTubeVideoId,
  getYouTubeVideoById,
  normalizeYouTubeTrack,
} from "#utils/youtube";

import requireBody from "#middleware/requireBody";

const router = express.Router();
export default router;

router.post("/", requireBody(["sourceUrl", "targetService"]),
  async (req, res) => {
    try {
      const { sourceUrl, targetService } = req.body;

      const sourceService = detectSourceService(sourceUrl);

      let sourceTrack;
      let targetTrack;

      if (sourceService === "spotify" && targetService === "youtube") {
        const trackId = extractSpotifyTrackId(sourceUrl);
        const rawTrack = await getSpotifyTrackById(trackId);
        sourceTrack = normalizeSpotifyTrack(rawTrack);
        targetTrack = await searchYouTubeForTrack(sourceTrack);
      } else if (sourceService === "youtube" && targetService === "spotify") {
        const videoId = extractYouTubeVideoId(sourceUrl);
        const rawVideo = await getYouTubeVideoById(videoId);
        sourceTrack = normalizeYouTubeTrack(rawVideo);
        targetTrack = await searchSpotifyForTrack(sourceTrack);
      } else {
        return res.status(400).json({
          message: "Unsupported conversion direction.",
        });
      }

      return res.status(200).json({
        sourceService,
        targetService,
        sourceTrack,
        targetTrack,
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }
);
