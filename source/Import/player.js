import { DisTube } from "distube";
import { SoundCloudPlugin } from "@distube/soundcloud";
import { SpotifyPlugin } from "@distube/spotify";
import { YtDlpPlugin } from "@distube/yt-dlp";
import client from "../index.js";
const player = new DisTube(client, {
  leaveOnEmpty: false,
  leaveOnStop: false,
  leaveOnFinish: false,
  emitNewSongOnly: false,
  nsfw: true,
  plugins: [
    new YtDlpPlugin({ update: true }),
    new SpotifyPlugin(),
    new SoundCloudPlugin(),
  ],
});
export { player };
