/** Content is independent of UI and game rules. No lesson is enabled yet. */
export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
}

export interface LessonElement extends ElementData {
  familyId: string;
}

export interface Lesson {
  id: string;
  title: string;
  families: readonly { id: string; name: string }[];
  elements: readonly LessonElement[];
}
