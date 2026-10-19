// Типы данных для игры СОЦИУМ

export interface Character {
  name: string;
  gender: string;
  age: number;
  district: string;
  family: string;
}

export interface Resources {
  income: number;
  education: number;
  prestige: number;
  power: number;
  socialConnections: number;
  familyWellbeing: number;
  innerStability: number;
  reputation: number;
}

export interface GameState {
  character: Character | null;
  resources: Resources;
  currentAct: number;
  currentScene: string;
  sceneHistory: string[];
  flags: Record<string, boolean | string | number>;
  statuses: { prescribed: string[]; achieved: string[] };
  roles: string[];
  journal: string[];
  achievements: string[];
  conflicts: { id: string; resolution: string }[];
  mobilityEvents: string[];
  socialLifts: string[];
  strata: string;
  ending: string | null;
  textSpeed: number;
  reducedAnimation: boolean;
  soundEnabled: boolean;
  studentCode?: string;
  completionTime?: number;
  minigameScores?: Record<string, number>;
}

export interface StudentResult {
  code: string;
  name: string;
  grade: number;
  comment: string;
  progress: GameState;
  importedAt: string;
}

export interface SceneChoice {
  text: string;
  next: string;
  effects?: Partial<Resources>;
  flags?: Record<string, boolean | string | number>;
  addStatus?: string;
  addRole?: string;
  addJournal?: string;
  addAchievement?: string;
  addConflict?: string;
  addMobility?: string;
  addLift?: string;
  minigame?: string;
}

export interface Scene {
  id: string;
  act: number;
  title: string;
  text: string;
  illustration: string;
  choices: SceneChoice[];
  autoNext?: string;
  conceptNote?: string;
}

export const DEFAULT_RESOURCES: Resources = {
  income: 30,
  education: 20,
  prestige: 10,
  power: 5,
  socialConnections: 25,
  familyWellbeing: 50,
  innerStability: 60,
  reputation: 30,
};

export const DISTRICT_BONUSES: Record<string, Partial<Resources>> = {
  'Рабочий район': { income: -10, prestige: -5, innerStability: 10, socialConnections: 10 },
  'Спальный район': { income: 0, education: 5, familyWellbeing: 10, innerStability: 5 },
  'Центр': { income: 10, prestige: 10, education: 5, socialConnections: 5 },
  'Приморский район': { income: 5, innerStability: 15, socialConnections: 5, reputation: 5 },
};

export const FAMILY_BONUSES: Record<string, Partial<Resources>> = {
  'Рабочая семья': { income: -5, socialConnections: 15, innerStability: 5, prestige: -5 },
  'Семья учителей/врачей': { education: 15, prestige: 10, income: 5, reputation: 10 },
  'Семья предпринимателей': { income: 20, power: 10, prestige: 10, socialConnections: 5 },
  'Неполная семья': { innerStability: -10, familyWellbeing: -10, reputation: 5, power: 5 },
  'Семья мигрантов': { socialConnections: -5, innerStability: 10, reputation: 5, income: -10 },
};
