import type { Player, Academy, Game, FeedEvent, CriticalDate, DivisionStat, MockUser, RegistrationWindow } from './types';

const PHOTO_1 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa5fu9wZHoapvONTP-xVSTeFJcSHcmte9vTGoo0RbXUfz6B5XW6tFKJHvMK-rCrppgB3D7fIYKfKx5p3jxLOenM4T93SrYHGCYTiqnsf-SKOycrCeij1cdnGEhk_LWxfzbtad9Nyh4oDxO1Lze59xqpvwU0gI_3kW3yIJMqMOfMEN4HXqk3RJAQCFCVYtEV8y_c6f1WdrQUSh9vERpgcV-lZuKYoxuRPOATGG1t2qH8itA1f3Tv0WJvl0jiRtWVz9Vw27eklZnv-c';
const PHOTO_2 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-MkJR6gEU812qeoDx4Udnz-6D4syFwE33QhcyDKy5Omz7ccdWQ8rDop78Oh_YHgxfiEo3tY9szG4VqqOexAmL-kb_lZGHsSjkx64sfuskqdTVJcaXFc9SinKeStVmY_DkukXc2DvgFNM8MmaGL6gMTx-FiN6xjb6I5UH-DT2o66pPY3NWQrwAUGPK2PLQaG625Y5cM59qwcNv1qVuvGzvgKi_ivlyjMq1WlYE0CYCdJmrRQKcLwb2m59jmxIOQz2vzJVSz0cuhUA';
const PHOTO_3 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtgTJU_gsV5ahToEgrvbV7yE3lIJRVYX1zAR5P79jokKeRkgSQt1Tq4vi8JFSvBZsDmPIU0Xhi_isUfs8FKKYFlvPq3vGEhcRvRKgKGDTOHojKdLDK7J4xTvwVHDQ81iYOSc073VuJv4Cetj0kdS1eL98FHcpqNi_pwZtiuMEPpMj0foCrULUIJVC04CdXS2e5XrwJPf9qR309HntN206KvyWFdQwxBQJsibLTZtJGMmMm3sbxQTM6VGA9IK0FVzYbNe61wBqAKu8';

/* ── Mock Users ── */
export const MOCK_USERS: MockUser[] = [
  { id: 'u1', name: 'Admin John',       email: 'admin@prc.zm',          role: 'admin',  academyId: '',  academyName: '' },
  { id: 'u2', name: 'Victor Mwembe',    email: 'victor@victoriafalls.zm', role: 'member', academyId: '1', academyName: 'Victoria Falls FC' },
  { id: 'u3', name: 'James Luwi',       email: 'james@zambezioni.zm',    role: 'member', academyId: '2', academyName: 'Zambezi Lions Academy' },
  { id: 'u4', name: 'Christine Banda',  email: 'christine@riverside.zm', role: 'member', academyId: '3', academyName: 'Riverside United' },
  { id: 'u5', name: 'Robert Mwansa',    email: 'robert@luapula.zm',      role: 'member', academyId: '4', academyName: 'Luapula Stars' },
  { id: 'u6', name: 'Daniel Phiri',     email: 'daniel@copperbelt.zm',   role: 'member', academyId: '5', academyName: 'Copperbelt Elite FC' },
  { id: 'u7', name: 'Mary Sichone',     email: 'mary@southerncross.zm',  role: 'member', academyId: '6', academyName: 'Southern Cross Academy' },
  { id: 'u8', name: 'Thompson Njovu',   email: 'thompson@kafue.zm',      role: 'member', academyId: '7', academyName: 'Kafue River Youth FC' },
  { id: 'u9', name: 'Sarah Munthali',   email: 'sarah@northstar.zm',     role: 'member', academyId: '8', academyName: 'North Star Elite' },
];

/* ── Default Registration Window ── */
export const DEFAULT_REGISTRATION_WINDOW: RegistrationWindow = {
  isOpen: true,
  openDate: '2026-05-01',
  closeDate: '2026-05-31',
};

/* ── Players ── */
export const PLAYERS: Player[] = [
  /* Victoria Falls FC (academyId: '1') */
  {
    id: '1', prcId: 'ZF-2024-8849-MT',
    firstName: 'Marcus', lastName: 'Thorne', dob: '2011-05-14', gender: 'Male',
    division: 'U-14', grade: 'Grade 9', academy: 'Victoria Falls FC', academyId: '1',
    position: 'Attacking Midfield', status: 'Active',
    photo: PHOTO_1, nationality: 'Zambian', seasonRating: 8.4,
    coach: { name: 'Victor Mwembe' }, manager: { name: 'Sarah Lungu' },
    seasons: [{ year: '2023/24', matches: 22, goals: 9, assists: 7, rating: 8.4, cleanSheets: 0, tackles: 34 }],
    medical: { clearance: 'Cleared', bloodType: 'O+', height: '162cm', weight: '54kg', lastCheckup: '2024-08-15' },
  },
  {
    id: '2p', prcId: 'ZF-2024-3221-CM',
    firstName: 'Chanda', lastName: 'Mwansa', dob: '2013-03-22', gender: 'Male',
    division: 'U-12', grade: 'Grade 7', academy: 'Victoria Falls FC', academyId: '1',
    position: 'Central Midfield', status: 'Active',
    nationality: 'Zambian', seasonRating: 7.2,
    seasons: [{ year: '2023/24', matches: 16, goals: 3, assists: 8, rating: 7.2, tackles: 44 }],
    medical: { clearance: 'Cleared' },
  },
  {
    id: '3p', prcId: 'ZF-2024-5567-EB',
    firstName: 'Emmanuel', lastName: 'Banda', dob: '2009-07-11', gender: 'Male',
    division: 'U-16', grade: 'Grade 11', academy: 'Victoria Falls FC', academyId: '1',
    position: 'Goalkeeper', status: 'Pending',
    nationality: 'Zambian',
    medical: { clearance: 'Pending' },
  },

  /* Zambezi Lions Academy (academyId: '2') */
  {
    id: '4', prcId: 'ZF-2024-7234-LH',
    firstName: 'Leo', lastName: 'Hernandez', dob: '2013-02-20', gender: 'Male',
    division: 'U-12', grade: 'Grade 7', academy: 'Zambezi Lions Academy', academyId: '2',
    position: 'Central Midfield', status: 'Pending',
    photo: PHOTO_2, nationality: 'Zimbabwean', seasonRating: 7.1,
    seasons: [{ year: '2023/24', matches: 18, goals: 4, assists: 9, rating: 7.1, tackles: 51 }],
    medical: { clearance: 'Pending' },
  },
  {
    id: '5p', prcId: 'ZF-2024-4481-NL',
    firstName: 'Natasha', lastName: 'Lungu', dob: '2010-09-15', gender: 'Female',
    division: 'U-14', grade: 'Grade 9', academy: 'Zambezi Lions Academy', academyId: '2',
    position: 'Left Wing', status: 'Active',
    nationality: 'Zambian', seasonRating: 7.9,
    seasons: [{ year: '2023/24', matches: 19, goals: 6, assists: 5, rating: 7.9 }],
    medical: { clearance: 'Cleared' },
  },
  {
    id: '6p', prcId: 'ZF-2024-2093-PZ',
    firstName: 'Peter', lastName: 'Zulu', dob: '2015-01-08', gender: 'Male',
    division: 'U-10', grade: 'Grade 5', academy: 'Zambezi Lions Academy', academyId: '2',
    position: 'Centre Back', status: 'Active',
    nationality: 'Zambian',
    medical: { clearance: 'Cleared' },
  },

  /* Riverside United (academyId: '3') */
  {
    id: '7', prcId: 'ZF-2024-6601-SO',
    firstName: 'Samuel', lastName: 'Okoro', dob: '2011-08-09', gender: 'Male',
    division: 'U-14', grade: 'Grade 9', academy: 'Riverside United', academyId: '3',
    position: 'Centre Back', status: 'Active',
    photo: PHOTO_3, nationality: 'Zambian', seasonRating: 7.8,
    seasons: [{ year: '2023/24', matches: 20, goals: 2, assists: 3, rating: 7.8, cleanSheets: 8, tackles: 67 }],
    medical: { clearance: 'Cleared', bloodType: 'A+', height: '168cm', weight: '60kg', lastCheckup: '2024-07-20' },
  },
  {
    id: '8p', prcId: 'ZF-2024-1178-JP',
    firstName: 'Joshua', lastName: 'Phiri', dob: '2009-11-23', gender: 'Male',
    division: 'U-16', grade: 'Grade 11', academy: 'Riverside United', academyId: '3',
    position: 'Right Back', status: 'Active',
    nationality: 'Zambian', seasonRating: 7.5,
    seasons: [{ year: '2023/24', matches: 21, goals: 1, assists: 4, rating: 7.5, cleanSheets: 5, tackles: 72 }],
    medical: { clearance: 'Cleared' },
  },
  {
    id: '9p', prcId: 'ZF-2024-9043-GT',
    firstName: 'Grace', lastName: 'Tembo', dob: '2012-06-14', gender: 'Female',
    division: 'U-12', grade: 'Grade 7', academy: 'Riverside United', academyId: '3',
    position: 'Goalkeeper', status: 'Pending',
    nationality: 'Zambian',
    medical: { clearance: 'Pending' },
  },

  /* Luapula Stars (academyId: '4') */
  {
    id: '10p', prcId: 'ZF-2024-7756-DM',
    firstName: 'Daniel', lastName: 'Mulenga', dob: '2017-04-30', gender: 'Male',
    division: 'U-8',  grade: 'Grade 3', academy: 'Luapula Stars', academyId: '4',
    position: 'Centre Forward', status: 'Active',
    nationality: 'Zambian',
    medical: { clearance: 'Cleared' },
  },
  {
    id: '11p', prcId: 'ZF-2024-3312-FK',
    firstName: 'Faith', lastName: 'Kapulu', dob: '2015-08-19', gender: 'Female',
    division: 'U-10', grade: 'Grade 5', academy: 'Luapula Stars', academyId: '4',
    position: 'Right Midfield', status: 'Active',
    nationality: 'Zambian',
    medical: { clearance: 'Cleared' },
  },
  {
    id: '12p', prcId: 'ZF-2024-8801-SC',
    firstName: 'Simon', lastName: 'Chanda', dob: '2012-12-05', gender: 'Male',
    division: 'U-12', grade: 'Grade 7', academy: 'Luapula Stars', academyId: '4',
    position: 'Defensive Midfield', status: 'Active',
    nationality: 'Zambian', seasonRating: 7.3,
    seasons: [{ year: '2023/24', matches: 15, goals: 1, assists: 6, rating: 7.3, tackles: 55 }],
    medical: { clearance: 'Cleared' },
  },

  /* Copperbelt Elite FC (academyId: '5') */
  {
    id: '13p', prcId: 'ZF-2024-5523-VM',
    firstName: 'Victoria', lastName: 'Mwamba', dob: '2010-03-17', gender: 'Female',
    division: 'U-14', grade: 'Grade 9', academy: 'Copperbelt Elite FC', academyId: '5',
    position: 'Centre Forward', status: 'Active',
    nationality: 'Zambian', seasonRating: 8.1,
    seasons: [{ year: '2023/24', matches: 20, goals: 12, assists: 4, rating: 8.1 }],
    medical: { clearance: 'Cleared' },
  },
  {
    id: '14p', prcId: 'ZF-2024-6634-JM',
    firstName: 'James', lastName: 'Mutale', dob: '2008-07-25', gender: 'Male',
    division: 'U-16', grade: 'Grade 11', academy: 'Copperbelt Elite FC', academyId: '5',
    position: 'Right Wing', status: 'Pending',
    nationality: 'Zambian',
    medical: { clearance: 'Pending' },
  },
  {
    id: '15p', prcId: 'ZF-2024-2287-AN',
    firstName: 'Alice', lastName: 'Nkonde', dob: '2007-02-13', gender: 'Female',
    division: 'U-18', grade: 'Grade 12', academy: 'Copperbelt Elite FC', academyId: '5',
    position: 'Left Back', status: 'Active',
    nationality: 'Zambian', seasonRating: 7.6,
    seasons: [{ year: '2023/24', matches: 22, goals: 0, assists: 7, rating: 7.6, cleanSheets: 4, tackles: 58 }],
    medical: { clearance: 'Cleared' },
  },

  /* Southern Cross Academy (academyId: '6') */
  {
    id: '16p', prcId: 'ZF-2024-9910-MS',
    firstName: 'Michael', lastName: 'Siame', dob: '2014-10-01', gender: 'Male',
    division: 'U-10', grade: 'Grade 5', academy: 'Southern Cross Academy', academyId: '6',
    position: 'Centre Back', status: 'Active',
    nationality: 'Zambian',
    medical: { clearance: 'Cleared' },
  },
  {
    id: '17p', prcId: 'ZF-2024-4455-LP',
    firstName: 'Linda', lastName: 'Phiri', dob: '2012-04-28', gender: 'Female',
    division: 'U-12', grade: 'Grade 7', academy: 'Southern Cross Academy', academyId: '6',
    position: 'Attacking Midfield', status: 'Active',
    nationality: 'Zambian', seasonRating: 7.0,
    seasons: [{ year: '2023/24', matches: 14, goals: 5, assists: 3, rating: 7.0 }],
    medical: { clearance: 'Cleared' },
  },

  /* Kafue River Youth FC (academyId: '7') */
  {
    id: '18p', prcId: 'ZF-2024-7723-CB',
    firstName: 'Charles', lastName: 'Bwalya', dob: '2016-11-15', gender: 'Male',
    division: 'U-8',  grade: 'Grade 3', academy: 'Kafue River Youth FC', academyId: '7',
    position: 'Goalkeeper', status: 'Active',
    nationality: 'Zambian',
    medical: { clearance: 'Cleared' },
  },
  {
    id: '19p', prcId: 'ZF-2024-1199-PM',
    firstName: 'Patricia', lastName: 'Mbewe', dob: '2015-03-07', gender: 'Female',
    division: 'U-10', grade: 'Grade 5', academy: 'Kafue River Youth FC', academyId: '7',
    position: 'Left Midfield', status: 'Pending',
    nationality: 'Zambian',
    medical: { clearance: 'Pending' },
  },
  {
    id: '20p', prcId: 'ZF-2024-3344-DN',
    firstName: 'David', lastName: 'Nyambe', dob: '2011-09-18', gender: 'Male',
    division: 'U-14', grade: 'Grade 9', academy: 'Kafue River Youth FC', academyId: '7',
    position: 'Centre Back', status: 'Active',
    nationality: 'Zambian', seasonRating: 7.4,
    seasons: [{ year: '2023/24', matches: 18, goals: 3, assists: 2, rating: 7.4, tackles: 61 }],
    medical: { clearance: 'Cleared' },
  },

  /* North Star Elite (academyId: '8') — Demo Member's academy */
  {
    id: '21p', prcId: 'ZF-2024-8856-RC',
    firstName: 'Robert', lastName: 'Chileshe', dob: '2010-12-02', gender: 'Male',
    division: 'U-14', grade: 'Grade 9', academy: 'North Star Elite', academyId: '8',
    position: 'Central Midfield', status: 'Active',
    nationality: 'Zambian', seasonRating: 8.0,
    seasons: [{ year: '2023/24', matches: 21, goals: 5, assists: 10, rating: 8.0, tackles: 48 }],
    medical: { clearance: 'Cleared', bloodType: 'B+', height: '165cm', weight: '57kg', lastCheckup: '2024-08-01' },
  },
  {
    id: '22p', prcId: 'ZF-2024-2231-EM',
    firstName: 'Esther', lastName: 'Mutumba', dob: '2009-05-20', gender: 'Female',
    division: 'U-16', grade: 'Grade 11', academy: 'North Star Elite', academyId: '8',
    position: 'Right Wing', status: 'Pending',
    nationality: 'Zambian',
    medical: { clearance: 'Pending' },
  },
  {
    id: '23p', prcId: 'ZF-2024-5512-IM',
    firstName: 'Isaac', lastName: 'Moyo', dob: '2012-08-31', gender: 'Male',
    division: 'U-12', grade: 'Grade 7', academy: 'North Star Elite', academyId: '8',
    position: 'Centre Forward', status: 'Active',
    nationality: 'Zambian', seasonRating: 7.7,
    seasons: [{ year: '2023/24', matches: 17, goals: 8, assists: 2, rating: 7.7 }],
    medical: { clearance: 'Cleared' },
  },
  {
    id: '24p', prcId: 'ZF-2024-6678-AZ',
    firstName: 'Agnes', lastName: 'Zimba', dob: '2007-11-09', gender: 'Female',
    division: 'U-18', grade: 'Grade 12', academy: 'North Star Elite', academyId: '8',
    position: 'Left Back', status: 'Rejected',
    nationality: 'Zambian',
    rejectionNote: { note: 'Incomplete medical documentation. Please resubmit with updated clearance form.', by: 'Admin John', date: '2024-10-03' },
    medical: { clearance: 'Restricted', conditions: 'Incomplete documentation on file' },
  },
  {
    id: '25p', prcId: 'ZF-2024-4490-KB',
    firstName: 'Kevin', lastName: 'Banda', dob: '2011-02-14', gender: 'Male',
    division: 'U-14', grade: 'Grade 9', academy: 'North Star Elite', academyId: '8',
    position: 'Defensive Midfield', status: 'Pending',
    nationality: 'Zambian',
    medical: { clearance: 'Pending' },
  },
];

/* ── Academies ── */
export const ACADEMIES: Academy[] = [
  {
    id: '1', name: 'Victoria Falls FC', location: 'Victoria Falls',
    assignedMemberId: 'u2', rep: 'Victor Mwembe', email: 'victor@victoriafalls.zm',
    playerCount: 3, divisions: ['U-12', 'U-14', 'U-16'],
    divisionCounts: { 'U-12': 1, 'U-14': 1, 'U-16': 1 },
  },
  {
    id: '2', name: 'Zambezi Lions Academy', location: 'Lusaka',
    assignedMemberId: 'u3', rep: 'James Luwi', email: 'james@zambezioni.zm',
    playerCount: 3, divisions: ['U-10', 'U-12', 'U-14'],
    divisionCounts: { 'U-10': 1, 'U-12': 1, 'U-14': 1 },
  },
  {
    id: '3', name: 'Riverside United', location: 'Livingstone',
    assignedMemberId: 'u4', rep: 'Christine Banda', email: 'christine@riverside.zm',
    playerCount: 3, divisions: ['U-12', 'U-14', 'U-16'],
    divisionCounts: { 'U-12': 1, 'U-14': 1, 'U-16': 1 },
  },
  {
    id: '4', name: 'Luapula Stars', location: 'Mansa',
    assignedMemberId: 'u5', rep: 'Robert Mwansa', email: 'robert@luapula.zm',
    playerCount: 3, divisions: ['U-8', 'U-10', 'U-12'],
    divisionCounts: { 'U-8': 1, 'U-10': 1, 'U-12': 1 },
  },
  {
    id: '5', name: 'Copperbelt Elite FC', location: 'Kitwe',
    assignedMemberId: 'u6', rep: 'Daniel Phiri', email: 'daniel@copperbelt.zm',
    playerCount: 3, divisions: ['U-14', 'U-16', 'U-18'],
    divisionCounts: { 'U-14': 1, 'U-16': 1, 'U-18': 1 },
  },
  {
    id: '6', name: 'Southern Cross Academy', location: 'Choma',
    assignedMemberId: 'u7', rep: 'Mary Sichone', email: 'mary@southerncross.zm',
    playerCount: 2, divisions: ['U-10', 'U-12'],
    divisionCounts: { 'U-10': 1, 'U-12': 1 },
  },
  {
    id: '7', name: 'Kafue River Youth FC', location: 'Kafue',
    assignedMemberId: 'u8', rep: 'Thompson Njovu', email: 'thompson@kafue.zm',
    playerCount: 3, divisions: ['U-8', 'U-10', 'U-14'],
    divisionCounts: { 'U-8': 1, 'U-10': 1, 'U-14': 1 },
  },
  {
    id: '8', name: 'North Star Elite', location: 'Ndola',
    assignedMemberId: 'u9', rep: 'Sarah Munthali', email: 'sarah@northstar.zm',
    playerCount: 5, divisions: ['U-12', 'U-14', 'U-16', 'U-18'],
    divisionCounts: { 'U-12': 1, 'U-14': 2, 'U-16': 1, 'U-18': 1 },
  },
];

/* ── Past Games ── */
export const GAMES: Game[] = [
  {
    id: '1',
    teamA: 'Victoria Falls FC', teamB: 'Zambezi Lions Academy',
    fixture: 'Victoria Falls FC vs Zambezi Lions Academy',
    date: '2024-10-05',
    scoreA: 2, scoreB: 1, score: '2-1', result: 'W',
    matchType: 'League Match',
    scorers: [
      { playerId: '1',  playerName: 'Marcus Thorne',  team: 'A', minute: 23 },
      { playerId: '2p', playerName: 'Chanda Mwansa',  team: 'A', minute: 67 },
      { playerId: '4',  playerName: 'Leo Hernandez',  team: 'B', minute: 44 },
    ],
  },
  {
    id: '2',
    teamA: 'Victoria Falls FC', teamB: 'Riverside United',
    fixture: 'Victoria Falls FC vs Riverside United',
    date: '2024-09-28',
    scoreA: 0, scoreB: 1, score: '0-1', result: 'L',
    matchType: 'League Match',
    scorers: [
      { playerId: '7', playerName: 'Samuel Okoro', team: 'B', minute: 71 },
    ],
  },
  {
    id: '3',
    teamA: 'Victoria Falls FC', teamB: 'Luapula Stars',
    fixture: 'Victoria Falls FC vs Luapula Stars',
    date: '2024-09-14',
    scoreA: 3, scoreB: 3, score: '3-3', result: 'D',
    matchType: 'Friendly',
    scorers: [
      { playerId: '1',   playerName: 'Marcus Thorne',  team: 'A', minute: 12 },
      { playerId: '2p',  playerName: 'Chanda Mwansa',  team: 'A', minute: 38 },
      { playerId: '1',   playerName: 'Marcus Thorne',  team: 'A', minute: 80 },
      { playerId: '10p', playerName: 'Daniel Mulenga', team: 'B', minute: 25 },
      { playerId: '12p', playerName: 'Simon Chanda',   team: 'B', minute: 55 },
      { playerId: '10p', playerName: 'Daniel Mulenga', team: 'B', minute: 88 },
    ],
  },
  {
    id: '4',
    teamA: 'Zambezi Lions Academy', teamB: 'North Star Elite',
    fixture: 'Zambezi Lions Academy vs North Star Elite',
    date: '2024-10-12',
    scoreA: 1, scoreB: 0, score: '1-0', result: 'W',
    matchType: 'Qualifier',
    scorers: [
      { playerId: '5p', playerName: 'Natasha Lungu', team: 'A', minute: 62 },
    ],
  },
  {
    id: '5',
    teamA: 'Riverside United', teamB: 'Copperbelt Elite FC',
    fixture: 'Riverside United vs Copperbelt Elite FC',
    date: '2024-10-08',
    scoreA: 2, scoreB: 2, score: '2-2', result: 'D',
    matchType: 'League Match',
    scorers: [
      { playerId: '7',   playerName: 'Samuel Okoro',     team: 'A', minute: 19 },
      { playerId: '8p',  playerName: 'Joshua Phiri',     team: 'A', minute: 73 },
      { playerId: '13p', playerName: 'Victoria Mwamba', team: 'B', minute: 45 },
      { playerId: '13p', playerName: 'Victoria Mwamba', team: 'B', minute: 81 },
    ],
  },
  {
    id: '6',
    teamA: 'North Star Elite', teamB: 'Kafue River Youth FC',
    fixture: 'North Star Elite vs Kafue River Youth FC',
    date: '2024-10-01',
    scoreA: 4, scoreB: 1, score: '4-1', result: 'W',
    matchType: 'League Match',
    scorers: [
      { playerId: '21p', playerName: 'Robert Chileshe', team: 'A', minute: 15 },
      { playerId: '23p', playerName: 'Isaac Moyo',      team: 'A', minute: 33 },
      { playerId: '21p', playerName: 'Robert Chileshe', team: 'A', minute: 58 },
      { playerId: '23p', playerName: 'Isaac Moyo',      team: 'A', minute: 76 },
      { playerId: '20p', playerName: 'David Nyambe',    team: 'B', minute: 49 },
    ],
  },
  {
    id: '7',
    teamA: 'Copperbelt Elite FC', teamB: 'Southern Cross Academy',
    fixture: 'Copperbelt Elite FC vs Southern Cross Academy',
    date: '2024-09-21',
    scoreA: 3, scoreB: 0, score: '3-0', result: 'W',
    matchType: 'Tournament',
    scorers: [
      { playerId: '13p', playerName: 'Victoria Mwamba', team: 'A', minute: 14 },
      { playerId: '15p', playerName: 'Alice Nkonde',    team: 'A', minute: 41 },
      { playerId: '13p', playerName: 'Victoria Mwamba', team: 'A', minute: 79 },
    ],
  },
  {
    id: '8',
    teamA: 'Luapula Stars', teamB: 'Kafue River Youth FC',
    fixture: 'Luapula Stars vs Kafue River Youth FC',
    date: '2024-09-15',
    scoreA: 1, scoreB: 2, score: '1-2', result: 'L',
    matchType: 'Friendly',
    scorers: [
      { playerId: '12p', playerName: 'Simon Chanda', team: 'A', minute: 36 },
      { playerId: '20p', playerName: 'David Nyambe', team: 'B', minute: 22 },
      { playerId: '20p', playerName: 'David Nyambe', team: 'B', minute: 84 },
    ],
  },
];

/* ── Live Feed ── */
export const FEED_EVENTS: FeedEvent[] = [
  {
    id: '1', type: 'approval', message: 'Marcus Thorne Approved',
    detail: 'by Admin John • 2m ago', time: '2m ago',
    iconBg: 'bg-success-subtle', iconColor: 'text-success', icon: 'check_circle',
  },
  {
    id: '2', type: 'update', message: 'Academy Profile Updated',
    detail: 'Victoria Falls FC • 14m ago', time: '14m ago',
    iconBg: 'bg-warning-subtle', iconColor: 'text-warning', icon: 'edit',
  },
  {
    id: '3', type: 'registration', message: 'New Registration: Leo Hernandez',
    detail: 'Pending Review • 45m ago', time: '45m ago',
    iconBg: 'bg-light', iconColor: 'text-muted', icon: 'person_add',
  },
];

/* ── Critical Dates ── */
export const CRITICAL_DATES: CriticalDate[] = [
  { id: '1', month: 'Oct', day: '12', title: 'U-14 Regional Finals Registration', subtitle: 'Closes in 4 days', variant: 'primary' },
  { id: '2', month: 'Oct', day: '28', title: 'Coaching Staff Certification', subtitle: 'Annual renewal deadline', variant: 'secondary' },
  { id: '3', month: 'Nov', day: '05', title: 'Summer Camp Early Bird', subtitle: 'Marketing window opens', variant: 'secondary' },
];

/* ── Division mix (league-wide) ── */
export const DIVISION_MIX: DivisionStat[] = [
  { division: 'U-14', percentage: 42 },
  { division: 'U-12', percentage: 35 },
  { division: 'U-10', percentage: 23 },
];

/* ── Summary stats ── */
export const STATS = {
  totalPlayers:    5402,
  activeAcademies: 52,
  pendingCount:    124,
  totalCoaches:    316,
  activeTeams:     200,
};
