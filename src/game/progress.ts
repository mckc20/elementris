import { lessons } from '../content/lessons';
import type { GameState } from './types';

export const progressKey = 'elementris.progress';
export interface LessonProgress {
  guided: number[];
  guidedComplete: boolean;
  practiceComplete: boolean;
  answers: Record<string, boolean>;
}
export interface Progress { version: 1; lessons: Record<string, LessonProgress> }
export const emptyProgress = (): Progress => ({ version: 1, lessons: {} });
export const emptyLessonProgress = (): LessonProgress => ({ guided: [], guidedComplete: false, practiceComplete: false, answers: {} });

// Reject incompatible or inconsistent data instead of displaying invented progress.
export function parseProgress(raw: string | null): Progress {
  try {
    if (!raw) return emptyProgress();
    const value = JSON.parse(raw);
    if (value.version !== 1 || !value.lessons || typeof value.lessons !== 'object' || Array.isArray(value.lessons)) return emptyProgress();
    const progress = emptyProgress();
    for (const [id, entry] of Object.entries(value.lessons)) {
      const lesson = lessons.find(item => item.id === id);
      if (!lesson || !entry || typeof entry !== 'object') return emptyProgress();
      const data = entry as LessonProgress;
      const numbers = lesson.elements.map(item => item.atomicNumber);
      if (!Array.isArray(data.guided) || data.guided.some(number => !numbers.includes(number)) || new Set(data.guided).size !== data.guided.length
        || typeof data.guidedComplete !== 'boolean' || typeof data.practiceComplete !== 'boolean'
        || (data.guidedComplete && data.guided.length !== numbers.length)
        || !data.answers || typeof data.answers !== 'object' || Array.isArray(data.answers)
        || Object.entries(data.answers).some(([number, answer]) => !numbers.map(String).includes(number) || typeof answer !== 'boolean')
        || (data.practiceComplete && Object.keys(data.answers).length !== numbers.length)) return emptyProgress();
      progress.lessons[id] = { guided: [...data.guided], guidedComplete: data.guidedComplete, practiceComplete: data.practiceComplete, answers: { ...data.answers } };
    }
    return progress;
  } catch { return emptyProgress(); }
}

export function readProgress(): Progress {
  try { return parseProgress(localStorage.getItem(progressKey)); } catch { return emptyProgress(); }
}
export function writeProgress(progress: Progress): boolean {
  try { localStorage.setItem(progressKey, JSON.stringify(progress)); return true; } catch { return false; }
}
export function clearProgress(): boolean {
  try { localStorage.removeItem(progressKey); return true; } catch { return false; }
}

export function recordProgress(progress: Progress, previous: GameState, game: GameState): Progress {
  const placed = game.placed.length > previous.placed.length;
  const completed = previous.status !== 'complete' && game.status === 'complete';
  if (!placed && !completed) return progress;
  const old = progress.lessons[game.lessonId] ?? emptyLessonProgress();
  const entry = { ...old, guided: [...old.guided], answers: { ...old.answers } };
  if (placed) {
    const record = game.records[game.elementIndex];
    if (game.mode === 'guided') entry.guided = [...new Set([...entry.guided, record.atomicNumber])];
    else entry.answers[record.atomicNumber] = record.firstAttemptCorrect === true && record.hints === 0;
  }
  if (completed) {
    if (game.mode === 'guided') entry.guidedComplete = true;
    // A targeted subset does not count as completing full practice.
    else if (game.order.length === lessons.find(item => item.id === game.lessonId)?.elements.length) entry.practiceComplete = true;
  }
  return { version: 1, lessons: { ...progress.lessons, [game.lessonId]: entry } };
}

export function reviewElements(progress: LessonProgress): number[] {
  return Object.entries(progress.answers).filter(([, unaided]) => !unaided).map(([number]) => Number(number));
}
