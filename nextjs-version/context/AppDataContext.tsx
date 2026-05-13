'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type {
  Player, Academy, Game, RegistrationWindow, MockUser,
  TransferRequest, AuditEntry, AuditAction, MatchEvent,
} from '@/lib/types';
import { MAX_ACTIVE_PLAYERS_PER_ACADEMY } from '@/lib/types';
import {
  PLAYERS,
  ACADEMIES,
  GAMES,
  MOCK_USERS,
  DEFAULT_REGISTRATION_WINDOW,
} from '@/lib/mockData';

interface AppState {
  players:    Player[];
  academies:  Academy[];
  games:      Game[];
  registrationWindow: RegistrationWindow;
  users:      MockUser[];
  transfers:  TransferRequest[];
  audit:      AuditEntry[];
}

export type ActorContext = {
  actorId: string;
  actorName: string;
  actorRole: 'admin' | 'member';
  academyId?: string;
  academyName?: string;
};

type AppAction =
  | { type: 'ADD_PLAYER'; payload: Player; actor?: ActorContext }
  | { type: 'UPDATE_PLAYER'; payload: { id: string; updates: Partial<Player> }; actor?: ActorContext }
  | { type: 'DELETE_PLAYER'; payload: { id: string }; actor?: ActorContext }
  | { type: 'APPROVE_PLAYER'; payload: { id: string }; actor?: ActorContext }
  | { type: 'REJECT_PLAYER'; payload: { id: string; note: string; adminName: string }; actor?: ActorContext }
  | { type: 'ADD_ACADEMY'; payload: Academy }
  | { type: 'UPDATE_ACADEMY'; payload: { id: string; updates: Partial<Academy> } }
  | { type: 'ADD_GAME'; payload: Game; actor?: ActorContext }
  | { type: 'UPDATE_GAME'; payload: { id: string; updates: Partial<Game> }; actor?: ActorContext }
  | { type: 'DELETE_GAME'; payload: { id: string } }
  | { type: 'ADD_MATCH_EVENT'; payload: { gameId: string; event: MatchEvent }; actor?: ActorContext }
  | { type: 'REMOVE_MATCH_EVENT'; payload: { gameId: string; eventId: string } }
  | { type: 'SET_REGISTRATION_WINDOW'; payload: RegistrationWindow }
  | { type: 'ADD_USER'; payload: MockUser }
  | { type: 'UPDATE_USER'; payload: { id: string; updates: Partial<MockUser> } }
  | { type: 'DELETE_USER'; payload: { id: string } }
  | { type: 'CREATE_TRANSFER'; payload: TransferRequest; actor?: ActorContext }
  | { type: 'DECIDE_TRANSFER'; payload: { id: string; decision: 'Approved' | 'Rejected'; note?: string }; actor?: ActorContext }
  | { type: 'AUDIT_APPEND'; payload: AuditEntry };

export type CapValidation = { ok: true } | { ok: false; reason: string };

interface AppDataContextValue {
  data: AppState;
  addPlayer:           (player: Player, actor?: ActorContext) => CapValidation;
  updatePlayer:        (id: string, updates: Partial<Player>, actor?: ActorContext) => CapValidation;
  deletePlayer:        (id: string, actor?: ActorContext) => void;
  approvePlayer:       (id: string, actor?: ActorContext) => CapValidation;
  rejectPlayer:        (id: string, note: string, adminName: string, actor?: ActorContext) => void;
  addAcademy:          (academy: Academy) => void;
  updateAcademy:       (id: string, updates: Partial<Academy>) => void;
  addGame:             (game: Game, actor?: ActorContext) => void;
  updateGame:          (id: string, updates: Partial<Game>, actor?: ActorContext) => void;
  deleteGame:          (id: string) => void;
  addMatchEvent:       (gameId: string, event: MatchEvent, actor?: ActorContext) => void;
  removeMatchEvent:    (gameId: string, eventId: string) => void;
  setRegistrationWindow: (window: RegistrationWindow) => void;
  getAcademyPlayerCount: (academyId: string, division?: string) => number;
  getActivePlayerCount:  (academyId: string) => number;
  addUser:             (user: MockUser) => void;
  updateUser:          (id: string, updates: Partial<MockUser>) => void;
  deleteUser:          (id: string) => void;
  createTransfer:      (req: TransferRequest, actor?: ActorContext) => void;
  decideTransfer:      (id: string, decision: 'Approved' | 'Rejected', note: string | undefined, actor?: ActorContext) => void;
}

function nextId(prefix: string) { return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`; }

function makeAudit(
  action: AuditAction,
  actor: ActorContext | undefined,
  target?: { id?: string; label?: string },
  detail?: string,
): AuditEntry {
  return {
    id:          nextId('a'),
    action,
    actorId:     actor?.actorId   ?? 'system',
    actorName:   actor?.actorName ?? 'System',
    actorRole:   actor?.actorRole ?? 'admin',
    academyId:   actor?.academyId,
    academyName: actor?.academyName,
    targetId:    target?.id,
    targetLabel: target?.label,
    detail,
    timestamp:   new Date().toISOString(),
  };
}

const initialState: AppState = {
  players:   PLAYERS,
  academies: ACADEMIES,
  games:     GAMES,
  registrationWindow: DEFAULT_REGISTRATION_WINDOW,
  users:     MOCK_USERS,
  transfers: [],
  audit:     [],
};

function countActive(players: Player[], academyId: string): number {
  return players.filter((p) => p.academyId === academyId && p.status === 'Active').length;
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_PLAYER': {
      const next = { ...state, players: [...state.players, action.payload] };
      const audit = makeAudit('player_created', action.actor, { id: action.payload.id, label: `${action.payload.firstName} ${action.payload.lastName}` });
      return { ...next, audit: [audit, ...state.audit] };
    }

    case 'UPDATE_PLAYER': {
      const before = state.players.find((p) => p.id === action.payload.id);
      const updates = action.payload.updates;
      let blocked: string | null = null;

      /* Enforce the 20-active cap on status promotions */
      if (before && updates.status === 'Active' && before.status !== 'Active') {
        const active = countActive(state.players, before.academyId);
        if (active >= MAX_ACTIVE_PLAYERS_PER_ACADEMY) {
          blocked = `Active player limit reached (${active}/${MAX_ACTIVE_PLAYERS_PER_ACADEMY}). Deactivate a player before activating another.`;
        }
      }
      if (blocked) {
        const audit = makeAudit('player_updated', action.actor, { id: action.payload.id }, `Blocked: ${blocked}`);
        return { ...state, audit: [audit, ...state.audit] };
      }

      const players = state.players.map((p) =>
        p.id === action.payload.id ? { ...p, ...updates } : p
      );
      const action_kind: AuditAction =
        updates.status === 'Active'   && before?.status !== 'Active'   ? 'player_activated'
        : updates.status === 'Inactive' && before?.status !== 'Inactive' ? 'player_deactivated'
        : 'player_updated';
      const audit = makeAudit(action_kind, action.actor, { id: action.payload.id, label: before ? `${before.firstName} ${before.lastName}` : action.payload.id });
      return { ...state, players, audit: [audit, ...state.audit] };
    }

    case 'DELETE_PLAYER': {
      const before = state.players.find((p) => p.id === action.payload.id);
      const players = state.players.filter((p) => p.id !== action.payload.id);
      const audit = makeAudit('player_deleted', action.actor, { id: action.payload.id, label: before ? `${before.firstName} ${before.lastName}` : action.payload.id });
      return { ...state, players, audit: [audit, ...state.audit] };
    }

    case 'APPROVE_PLAYER': {
      const before = state.players.find((p) => p.id === action.payload.id);
      if (!before) return state;
      const active = countActive(state.players, before.academyId);
      if (active >= MAX_ACTIVE_PLAYERS_PER_ACADEMY) {
        const audit = makeAudit('player_updated', action.actor, { id: before.id, label: `${before.firstName} ${before.lastName}` },
          `Blocked: Active player limit reached (${active}/${MAX_ACTIVE_PLAYERS_PER_ACADEMY}).`);
        return { ...state, audit: [audit, ...state.audit] };
      }
      const players = state.players.map((p) =>
        p.id === action.payload.id ? { ...p, status: 'Active' as const, rejectionNote: undefined } : p
      );
      const audit = makeAudit('player_approved', action.actor, { id: before.id, label: `${before.firstName} ${before.lastName}` });
      return { ...state, players, audit: [audit, ...state.audit] };
    }

    case 'REJECT_PLAYER': {
      const before = state.players.find((p) => p.id === action.payload.id);
      const players = state.players.map((p) =>
        p.id === action.payload.id
          ? {
              ...p,
              status: 'Rejected' as const,
              rejectionNote: {
                note: action.payload.note,
                by: action.payload.adminName,
                date: new Date().toISOString().split('T')[0],
              },
            }
          : p
      );
      const audit = makeAudit('player_rejected', action.actor, { id: action.payload.id, label: before ? `${before.firstName} ${before.lastName}` : action.payload.id }, action.payload.note);
      return { ...state, players, audit: [audit, ...state.audit] };
    }

    case 'ADD_ACADEMY':
      return { ...state, academies: [...state.academies, action.payload] };

    case 'UPDATE_ACADEMY':
      return {
        ...state,
        academies: state.academies.map((a) =>
          a.id === action.payload.id ? { ...a, ...action.payload.updates } : a
        ),
      };

    case 'ADD_GAME': {
      const games = [...state.games, action.payload];
      const audit = makeAudit('game_created', action.actor, { id: action.payload.id, label: action.payload.fixture });
      return { ...state, games, audit: [audit, ...state.audit] };
    }

    case 'UPDATE_GAME': {
      const games = state.games.map((g) =>
        g.id === action.payload.id ? { ...g, ...action.payload.updates } : g
      );
      const audit = makeAudit('game_updated', action.actor, { id: action.payload.id });
      return { ...state, games, audit: [audit, ...state.audit] };
    }

    case 'DELETE_GAME':
      return { ...state, games: state.games.filter((g) => g.id !== action.payload.id) };

    case 'ADD_MATCH_EVENT': {
      const games = state.games.map((g) => {
        if (g.id !== action.payload.gameId) return g;
        const events = [...(g.events ?? []), action.payload.event];
        /* Update score if goal event */
        let scoreA = g.scoreA ?? 0;
        let scoreB = g.scoreB ?? 0;
        if (action.payload.event.type === 'goal') {
          if (action.payload.event.team === 'A') scoreA += 1;
          else scoreB += 1;
        }
        const score = `${scoreA}-${scoreB}`;
        const result = scoreA > scoreB ? 'W' : scoreB > scoreA ? 'L' : 'D';
        return { ...g, events, scoreA, scoreB, score, result: result as Game['result'] };
      });
      const audit = makeAudit('game_event_logged', action.actor, { id: action.payload.gameId, label: action.payload.event.type });
      return { ...state, games, audit: [audit, ...state.audit] };
    }

    case 'REMOVE_MATCH_EVENT':
      return {
        ...state,
        games: state.games.map((g) =>
          g.id === action.payload.gameId
            ? { ...g, events: (g.events ?? []).filter((e) => e.id !== action.payload.eventId) }
            : g
        ),
      };

    case 'SET_REGISTRATION_WINDOW':
      return { ...state, registrationWindow: action.payload };

    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };

    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map((u) =>
          u.id === action.payload.id ? { ...u, ...action.payload.updates } : u
        ),
      };

    case 'DELETE_USER':
      return { ...state, users: state.users.filter((u) => u.id !== action.payload.id) };

    case 'CREATE_TRANSFER': {
      const transfers = [action.payload, ...state.transfers];
      const audit = makeAudit('transfer_requested', action.actor, { id: action.payload.id, label: action.payload.playerName }, `to ${action.payload.toAcademyName}`);
      return { ...state, transfers, audit: [audit, ...state.audit] };
    }

    case 'DECIDE_TRANSFER': {
      const t = state.transfers.find((x) => x.id === action.payload.id);
      if (!t) return state;
      const transfers = state.transfers.map((x) =>
        x.id === action.payload.id
          ? { ...x, status: action.payload.decision, decisionAt: new Date().toISOString(), decisionBy: action.actor?.actorName, decisionNote: action.payload.note }
          : x
      );
      let players = state.players;
      if (action.payload.decision === 'Approved') {
        players = state.players.map((p) =>
          p.id === t.playerId
            ? { ...p, academyId: t.toAcademyId, academy: t.toAcademyName }
            : p
        );
      }
      const audit = makeAudit(
        action.payload.decision === 'Approved' ? 'transfer_approved' : 'transfer_rejected',
        action.actor,
        { id: t.id, label: t.playerName },
        `${t.fromAcademyName} → ${t.toAcademyName}${action.payload.note ? ` · ${action.payload.note}` : ''}`,
      );
      return { ...state, transfers, players, audit: [audit, ...state.audit] };
    }

    case 'AUDIT_APPEND':
      return { ...state, audit: [action.payload, ...state.audit] };

    default:
      return state;
  }
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addPlayer = useCallback((player: Player, actor?: ActorContext): CapValidation => {
    dispatch({ type: 'ADD_PLAYER', payload: player, actor });
    return { ok: true };
  }, []);

  const updatePlayer = useCallback((id: string, updates: Partial<Player>, actor?: ActorContext): CapValidation => {
    /* Pre-check: if attempting to activate, validate cap up-front */
    if (updates.status === 'Active') {
      const before = state.players.find((p) => p.id === id);
      if (before && before.status !== 'Active') {
        const active = state.players.filter((p) => p.academyId === before.academyId && p.status === 'Active').length;
        if (active >= MAX_ACTIVE_PLAYERS_PER_ACADEMY) {
          return { ok: false, reason: `Active player limit reached (${active}/${MAX_ACTIVE_PLAYERS_PER_ACADEMY}). Deactivate a player before activating another.` };
        }
      }
    }
    dispatch({ type: 'UPDATE_PLAYER', payload: { id, updates }, actor });
    return { ok: true };
  }, [state.players]);

  const deletePlayer = useCallback((id: string, actor?: ActorContext) => {
    dispatch({ type: 'DELETE_PLAYER', payload: { id }, actor });
  }, []);

  const approvePlayer = useCallback((id: string, actor?: ActorContext): CapValidation => {
    const before = state.players.find((p) => p.id === id);
    if (before) {
      const active = state.players.filter((p) => p.academyId === before.academyId && p.status === 'Active').length;
      if (active >= MAX_ACTIVE_PLAYERS_PER_ACADEMY) {
        return { ok: false, reason: `Active player limit reached (${active}/${MAX_ACTIVE_PLAYERS_PER_ACADEMY}). Deactivate a player before activating another.` };
      }
    }
    dispatch({ type: 'APPROVE_PLAYER', payload: { id }, actor });
    return { ok: true };
  }, [state.players]);

  const rejectPlayer = useCallback((id: string, note: string, adminName: string, actor?: ActorContext) => {
    dispatch({ type: 'REJECT_PLAYER', payload: { id, note, adminName }, actor });
  }, []);

  const addAcademy = useCallback((academy: Academy) => dispatch({ type: 'ADD_ACADEMY', payload: academy }), []);
  const updateAcademy = useCallback((id: string, updates: Partial<Academy>) => dispatch({ type: 'UPDATE_ACADEMY', payload: { id, updates } }), []);

  const addGame = useCallback((game: Game, actor?: ActorContext) => dispatch({ type: 'ADD_GAME', payload: game, actor }), []);
  const updateGame = useCallback((id: string, updates: Partial<Game>, actor?: ActorContext) =>
    dispatch({ type: 'UPDATE_GAME', payload: { id, updates }, actor }), []);
  const deleteGame = useCallback((id: string) => dispatch({ type: 'DELETE_GAME', payload: { id } }), []);
  const addMatchEvent = useCallback((gameId: string, event: MatchEvent, actor?: ActorContext) =>
    dispatch({ type: 'ADD_MATCH_EVENT', payload: { gameId, event }, actor }), []);
  const removeMatchEvent = useCallback((gameId: string, eventId: string) =>
    dispatch({ type: 'REMOVE_MATCH_EVENT', payload: { gameId, eventId } }), []);

  const setRegistrationWindow = useCallback((window: RegistrationWindow) =>
    dispatch({ type: 'SET_REGISTRATION_WINDOW', payload: window }), []);

  const addUser = useCallback((user: MockUser) => dispatch({ type: 'ADD_USER', payload: user }), []);
  const updateUser = useCallback((id: string, updates: Partial<MockUser>) => dispatch({ type: 'UPDATE_USER', payload: { id, updates } }), []);
  const deleteUser = useCallback((id: string) => dispatch({ type: 'DELETE_USER', payload: { id } }), []);

  const createTransfer = useCallback((req: TransferRequest, actor?: ActorContext) =>
    dispatch({ type: 'CREATE_TRANSFER', payload: req, actor }), []);
  const decideTransfer = useCallback((id: string, decision: 'Approved' | 'Rejected', note: string | undefined, actor?: ActorContext) =>
    dispatch({ type: 'DECIDE_TRANSFER', payload: { id, decision, note }, actor }), []);

  const getAcademyPlayerCount = useCallback(
    (academyId: string, division?: string) =>
      state.players.filter(
        (p) =>
          p.academyId === academyId &&
          (division ? p.division === division : true) &&
          p.status !== 'Rejected'
      ).length,
    [state.players],
  );

  const getActivePlayerCount = useCallback(
    (academyId: string) =>
      state.players.filter((p) => p.academyId === academyId && p.status === 'Active').length,
    [state.players],
  );

  return (
    <AppDataContext.Provider
      value={{
        data: state,
        addPlayer,
        updatePlayer,
        deletePlayer,
        approvePlayer,
        rejectPlayer,
        addAcademy,
        updateAcademy,
        addGame,
        updateGame,
        deleteGame,
        addMatchEvent,
        removeMatchEvent,
        setRegistrationWindow,
        getAcademyPlayerCount,
        getActivePlayerCount,
        addUser,
        updateUser,
        deleteUser,
        createTransfer,
        decideTransfer,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used inside <AppDataProvider>');
  return ctx;
}
