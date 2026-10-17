export const FPS = 30;
export const DURATION = 900;

// Beat starts sit on a 120 BPM grid (one beat every 15 frames), so camera
// moves and sound hits line up with the music.
export const BEAT_STARTS = [0, 120, 270, 420, 600, 750] as const;
export const BEAT_COUNT = BEAT_STARTS.length;

// Frames the camera takes to glide from one beat to the next.
export const CAMERA_MOVE = 33;
