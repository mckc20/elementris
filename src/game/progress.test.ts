import { afterEach, expect, it, vi } from 'vitest';
import { firstLesson as lesson } from '../content/lessons';
import { startLesson, updateGame } from './rules';
import { clearProgress, emptyProgress, parseProgress, readProgress, recordProgress, reviewElements, writeProgress } from './progress';

afterEach(() => vi.unstubAllGlobals());

it('keeps actual partial placements and resolves review only after an unaided practice answer', () => {
  let game = startLesson(lesson, 'practice', () => 0, [3]);
  game = updateGame(lesson, game, { type: 'hint' });
  let progress = recordProgress(emptyProgress(), game, game);
  expect(progress.lessons).toEqual({});
  const placed = updateGame(lesson, game, { type: 'place', familyId: 'alkali' });
  progress = recordProgress(progress, game, placed);
  expect(reviewElements(progress.lessons[lesson.id])).toEqual([3]);
  const complete = updateGame(lesson, placed, { type: 'next' });
  expect(complete.status).toBe('complete');
  progress = recordProgress(progress, placed, complete);
  expect(progress.lessons[lesson.id].practiceComplete).toBe(false);
  expect(parseProgress(JSON.stringify(progress))).toEqual(progress);
  let guided = startLesson(lesson);
  const guidedPlaced = updateGame(lesson, guided, { type: 'place', familyId: 'alkali' });
  progress = recordProgress(progress, guided, guidedPlaced);
  expect(reviewElements(progress.lessons[lesson.id])).toEqual([3]);
  expect(progress.lessons[lesson.id].guided).toEqual([3]);
  game = startLesson(lesson, 'practice', () => 0, [3]);
  progress = recordProgress(progress, game, updateGame(lesson, game, { type: 'place', familyId: 'alkali' }));
  expect(reviewElements(progress.lessons[lesson.id])).toEqual([]);
  expect(progress.lessons[lesson.id].answers).toEqual({ 3: true });
  // Guided completion is only earned by explicitly finishing the entire lesson.
  guided = guidedPlaced;
  for (let index = 0; index < 6; index++) {
    const next = updateGame(lesson, guided, { type: 'next' });
    progress = recordProgress(progress, guided, next);
    guided = next;
    if (guided.status !== 'complete') {
      const placed = updateGame(lesson, guided, { type: 'place', familyId: lesson.elements[guided.order[guided.elementIndex]].familyId });
      progress = recordProgress(progress, guided, placed);
      guided = placed;
    }
  }
  expect(progress.lessons[lesson.id].guidedComplete).toBe(true);
  expect(parseProgress(JSON.stringify(progress))).toEqual(progress);
});

it('selects a unique shuffled subset and handles correction records', () => {
  let game = startLesson(lesson, 'practice', () => 0, [3, 3, 10, 999]);
  expect(game.records.map(record => record.atomicNumber).sort((a, b) => a - b)).toEqual([3, 10]);
  const element = lesson.elements[game.order[0]];
  game = updateGame(lesson, game, { type: 'place', familyId: element.familyId === 'alkali' ? 'noble' : 'alkali' });
  const progress = recordProgress(emptyProgress(), game, updateGame(lesson, game, { type: 'place', familyId: element.familyId }));
  expect(reviewElements(progress.lessons[lesson.id])).toEqual([element.atomicNumber]);
  expect(() => startLesson(lesson, 'practice', Math.random, [])).toThrow();
});

it('rejects absent, malformed, incompatible and invalid saved progress', () => {
  for (const raw of [null, '{', 'null', '[]', '{"version":2,"lessons":{}}', '{"version":1,"lessons":[]}']) {
    expect(parseProgress(raw)).toEqual(emptyProgress());
  }
  const valid = { guided: [3], guidedComplete: false, practiceComplete: false, answers: { 3: false } };
  for (const entry of [{ ...valid, guided: [999] }, { ...valid, guided: [3, 3] }, { ...valid, guidedComplete: true }, { ...valid, practiceComplete: true }, { ...valid, answers: { 3: 'false' } }, { ...valid, answers: [] }]) {
    expect(parseProgress(JSON.stringify({ version: 1, lessons: { [lesson.id]: entry } }))).toEqual(emptyProgress());
  }
});

it('does not throw when storage reads, writes, or reset fail', () => {
  vi.stubGlobal('localStorage', { getItem() { throw Error(); }, setItem() { throw Error(); }, removeItem() { throw Error(); } });
  expect(readProgress()).toEqual(emptyProgress());
  expect(writeProgress(emptyProgress())).toBe(false);
  expect(clearProgress()).toBe(false);
});
