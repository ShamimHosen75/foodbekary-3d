import { SCENE_SPAN, sceneAt, sceneStart } from './heroTimeline'

describe('hero timeline', () => {
  it('splits the scene span evenly across scenes', () => {
    expect(sceneStart(0, 3)).toBe(0)
    expect(sceneStart(1, 3)).toBeCloseTo(SCENE_SPAN / 3)
    expect(sceneStart(2, 3)).toBeCloseTo((2 * SCENE_SPAN) / 3)
  })

  it('maps progress to the active scene and clamps the ends', () => {
    expect(sceneAt(-0.1, 3)).toBe(0)
    expect(sceneAt(0.1, 3)).toBe(0)
    expect(sceneAt(0.3, 3)).toBe(1)
    expect(sceneAt(0.7, 3)).toBe(2)
    expect(sceneAt(1, 3)).toBe(2) // outro keeps the last scene's copy
  })
})
