import express from "express";
import {
  getSpotifyAccessToken,
  getSpotifyTrackById,
  normalizeSpotifyTrack,
  extractSpotifyTrackId,
  detectSourceService,
} from "#utils/spotify";

const router = express.Router();
export default router;

// router.post('/', async (req, res) =>{
//     const token = await getSpotifyAccessToken();

//     res.status(200).json({
//         token,
//     })
// })

router.post("/", async (req, res) => {
  const trackId =
    "https://open.spotify.com/track/5aE6I8Q3rCgTT31lZSzFZT?si=de5ab461fd174f0f";
  // const track = await getSpotifyTrackById(trackId);
  const normalized = detectSourceService(trackId);

  res.status(200).json({normalized,});
});
