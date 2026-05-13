export type UserRole = 'public' | 'member' | 'admin';

export type PlayerStatus = 'Active' | 'Pending' | 'Inactive' | 'Rejected';

export type Division = 'U-8' | 'U-10' | 'U-12' | 'U-14' | 'U-16' | 'U-18';

export const DIVISIONS: Division[] = ['U-8', 'U-10', 'U-12', 'U-14', 'U-16', 'U-18'];

export type Gender = 'Male' | 'Female';

export const GENDERS: Gender[] = ['Male', 'Female'];

/* Player grade — academic year level (required on registration) */
export type PlayerGrade = 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4' | 'Grade 5' | 'Grade 6'
  | 'Grade 7' | 'Grade 8' | 'Grade 9' | 'Grade 10' | 'Grade 11' | 'Grade 12';
export const PLAYER_GRADES: PlayerGrade[] = [
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12',
];

/* Document categorisation for uploads */
export type DocumentType =
  | 'National ID'
  | 'Birth Certificate'
  | 'Passport'
  | 'School Letter'
  | 'Medical Clearance'
  | 'Other';
export const DOCUMENT_TYPES: DocumentType[] = [
  'National ID', 'Birth Certificate', 'Passport', 'School Letter', 'Medical Clearance', 'Other',
];

export interface PlayerDocument {
  id: string;
  type: DocumentType;
  fileName: string;
  url?: string;
  uploadedAt: string;
  uploadedBy?: string;
}

/* Limits — exposed so UI and validation use the same source of truth */
export const MAX_ACTIVE_PLAYERS_PER_ACADEMY = 20;
export const MAX_PLAYERS_PER_DIVISION       = 15;

export const POSITIONS = [
  'Goalkeeper',
  'Right Back', 'Left Back', 'Centre Back',
  'Right Wing Back', 'Left Wing Back',
  'Defensive Midfield', 'Central Midfield', 'Attacking Midfield',
  'Right Midfield', 'Left Midfield',
  'Right Wing', 'Left Wing',
  'Centre Forward', 'Second Striker',
] as const;

export type Position = typeof POSITIONS[number];

export type MatchResult = 'W' | 'L' | 'D';
export type FeedEventType = 'approval' | 'registration' | 'update' | 'info';

export interface Session {
  userId: string;
  role: UserRole;
  academyName: string;
  academyId: string;
  displayName: string;
}

export interface RegistrationWindow {
  isOpen: boolean;
  openDate: string;
  closeDate: string;
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: Exclude<UserRole, 'public'>;
  academyId: string;
  academyName: string;
}

export interface RejectionNote {
  note: string;
  by: string;
  date: string;
}

export interface PlayerSeason {
  year: string;
  matches: number;
  goals: number;
  assists: number;
  rating: number;
  cleanSheets?: number;
  tackles?: number;
}

export interface PlayerMedical {
  clearance: 'Cleared' | 'Pending' | 'Restricted';
  bloodType?: string;
  height?: string;
  weight?: string;
  allergies?: string[];
  lastCheckup?: string;
  conditions?: string;
  clinicalNotes?: string;
}

export interface Official {
  name: string;
  photo?: string;
  role?: string;
}

export interface Player {
  id: string;
  prcId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  gender: Gender;
  /** Required academic grade level */
  grade: PlayerGrade;
  /** Optional jersey number used on team sheets */
  jerseyNumber?: number;
  division: Division;
  academy: string;
  academyId: string;
  position: string;
  status: PlayerStatus;
  photo?: string;
  nationality?: string;
  seasonRating?: number;
  coach?: Official;
  manager?: Official;
  seasons?: PlayerSeason[];
  medical?: PlayerMedical;
  documents?: PlayerDocument[];
  rejectionNote?: RejectionNote;
}

/* Transfer request — academy reps request, admins approve */
export type TransferStatus = 'Pending' | 'Approved' | 'Rejected';

export interface TransferRequest {
  id: string;
  playerId: string;
  playerName: string;
  fromAcademyId: string;
  fromAcademyName: string;
  toAcademyId: string;
  toAcademyName: string;
  requestedBy: string;
  requestedAt: string;
  status: TransferStatus;
  reason?: string;
  decisionBy?: string;
  decisionAt?: string;
  decisionNote?: string;
}

/* Audit log — admin-visible record of mutations */
export type AuditAction =
  | 'player_created'
  | 'player_updated'
  | 'player_deleted'
  | 'player_approved'
  | 'player_rejected'
  | 'player_activated'
  | 'player_deactivated'
  | 'transfer_requested'
  | 'transfer_approved'
  | 'transfer_rejected'
  | 'game_created'
  | 'game_updated'
  | 'game_event_logged';

export interface AuditEntry {
  id: string;
  action: AuditAction;
  actorId: string;
  actorName: string;
  actorRole: Exclude<UserRole, 'public'>;
  academyId?: string;
  academyName?: string;
  targetId?: string;
  targetLabel?: string;
  detail?: string;
  timestamp: string;
}

export interface Academy {
  id: string;
  name: string;
  location: string;
  logo?: string;
  assignedMemberId?: string;
  rep?: string;
  email?: string;
  playerCount?: number;
  divisions?: Division[];
  divisionCounts?: Partial<Record<Division, number>>;
}

export type MatchType = 'Friendly' | 'Qualifier' | 'Tournament' | 'League Match' | 'Final';
export const MATCH_TYPES: MatchType[] = ['Friendly', 'Qualifier', 'Tournament', 'League Match', 'Final'];

export interface GoalScorer {
  playerId: string;
  playerName: string;
  team: 'A' | 'B';
  minute?: number;
}

export type MatchEventType =
  | 'goal'
  | 'assist'
  | 'yellow_card'
  | 'red_card'
  | 'substitution'
  | 'kickoff'
  | 'halftime'
  | 'fulltime';

export interface MatchEvent {
  id: string;
  type: MatchEventType;
  team: 'A' | 'B';
  minute: number;
  playerId?: string;
  playerName?: string;
  /** For substitutions: the player coming on */
  secondaryPlayerId?: string;
  secondaryPlayerName?: string;
  note?: string;
  timestamp: string;
}

export type MatchPhase = 'scheduled' | 'live' | 'finished';

export interface Game {
  id: string;
  teamA?: string;
  teamB?: string;
  fixture: string;
  date: string;
  scoreA?: number;
  scoreB?: number;
  score: string;
  result: MatchResult;
  matchType?: MatchType;
  notes?: string;
  scorers?: GoalScorer[];
  /** Live match tracking */
  phase?: MatchPhase;
  events?: MatchEvent[];
}

export interface FeedEvent {
  id: string;
  type: FeedEventType;
  message: string;
  detail: string;
  time: string;
  iconBg: string;
  iconColor: string;
  icon: string;
}

export interface CriticalDate {
  id: string;
  month: string;
  day: string;
  title: string;
  subtitle?: string;
  variant?: 'primary' | 'secondary';
}

export interface DivisionStat {
  division: Division;
  percentage: number;
}
