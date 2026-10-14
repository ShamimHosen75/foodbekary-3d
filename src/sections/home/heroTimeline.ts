/**
 * Maps overall hero scroll progress (0–1) to scenes. The first SCENE_SPAN of the
 * pinned section plays the scenes; the remainder dissolves the hero into the page.
 */
export const SCENE_SPAN = 0.86

/** Progress value at which scene `i` of `n` takes over. */
export const sceneStart = (i: number, n: number) => (i / n) * SCENE_SPAN

/** Half-width of the crossfade window around each scene boundary. */
export const FADE = 0.05

export function sceneAt(progress: number, n: number): number {
  const i = Math.floor((progress / SCENE_SPAN) * n)
  return Math.max(0, Math.min(n - 1, i))
}
