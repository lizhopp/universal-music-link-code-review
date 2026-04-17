import express from "express";
import {
  getSpotifyTrackById,
  normalizeSpotifyTrack,
  extractSpotifyTrackId,
  detectSourceService,
} from "#utils/spotify";

import requireBody from "#middleware/requireBody";

const router = express.Router();
export default router;

router.post("/", requireBody(["sourceUrl", "requestedTargetPlatformId"]),
  async (req, res) => {
    try {
      const { sourceUrl, requestedTargetPlatformId } = req.body;

      const sourceService = detectSourceService(sourceUrl);

      if (sourceService !== 'spotify') {
        return res.status(400).json({
          message: "Currently can only convert spotify urls",
        });
      }

      const trackId = extractSpotifyTrackId(sourceUrl);
      const rawTrack = await getSpotifyTrackById(trackId);
      const normalizedTrack = normalizeSpotifyTrack(rawTrack);

      return res.status(200).json({
        sourceService,
        requestedTargetPlatformId, normalizedTrack,
      });

    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }
);
