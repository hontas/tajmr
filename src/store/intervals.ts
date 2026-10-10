import * as Sentry from '@sentry/react';

import firebaseApi from '#/utils/firebaseApi.ts';
import {
  isInterval,
  validateInterval,
  validateNewInterval,
  type Interval,
  type NewInterval,
} from '#/utils/interValidator.ts';

import type { Action, Thunk } from './types.ts';

const INTERVAL_ADD = 'INTERVAL_ADD';
const INTERVAL_UPDATED = 'INTERVAL_UPDATED';
const INTERVAL_UPDATE_FAILED = 'INTERVAL_UPDATE_FAILED';
const INTERVAL_COMPLETE = 'INTERVAL_COMPLETE';
const INTERVAL_REMOVE = 'INTERVAL_REMOVE';
const INTERVALS_REQUEST = 'INTERVALS_REQUEST';
const INTERVALS_FETCHED = 'INTERVALS_FETCHED';
const INTERVALS_UPDATE_TIMESTAMP = 'INTERVALS_UPDATE_TIMESTAMP';
const REQUEST_INTERVAL_UPDATE = 'REQUEST_INTERVAL_UPDATE';
const RESET_STATE = 'INTERVAL RESET_STATE';

type IntervalsById = Record<string, Interval>;

export type IntervalsAction =
  | { type: typeof INTERVAL_ADD; interval: Interval }
  | { type: typeof INTERVAL_UPDATED; interval: Interval }
  | { type: typeof INTERVAL_COMPLETE; interval: Interval }
  | { type: typeof INTERVAL_UPDATE_FAILED; error: unknown }
  | { type: typeof INTERVAL_REMOVE; id: string }
  | { type: typeof INTERVALS_REQUEST }
  | { type: typeof INTERVALS_FETCHED; intervals: IntervalsById }
  | { type: typeof INTERVALS_UPDATE_TIMESTAMP; timestamp: number }
  | { type: typeof REQUEST_INTERVAL_UPDATE }
  | { type: typeof RESET_STATE };

export interface IntervalsState {
  timestamp: number;
  updatedAt: number;
  isFetching: boolean;
  isSaving: boolean;
  items: Interval[];
  error: unknown;
}

export function intervalAdded(interval: Interval): IntervalsAction {
  return {
    type: INTERVAL_ADD,
    interval,
  };
}

export function reset(): IntervalsAction {
  return { type: RESET_STATE };
}

export function requestIntervals(): IntervalsAction {
  return { type: INTERVALS_REQUEST };
}

export function requestIntervalUpdate(): IntervalsAction {
  return { type: REQUEST_INTERVAL_UPDATE };
}

export function intervalUpdated(interval: Interval): IntervalsAction {
  return {
    type: INTERVAL_UPDATED,
    interval,
  };
}

export function intervalsFetched(intervals: IntervalsById): IntervalsAction {
  return {
    type: INTERVALS_FETCHED,
    intervals,
  };
}

export function updateTimestamp(timestamp: number): IntervalsAction {
  return {
    type: INTERVALS_UPDATE_TIMESTAMP,
    timestamp,
  };
}

export function intervalUpdateFailed(error: unknown): IntervalsAction {
  return {
    type: INTERVAL_UPDATE_FAILED,
    error,
  };
}

export function intervalRemoved(id: string): IntervalsAction {
  return {
    type: INTERVAL_REMOVE,
    id,
  };
}

/**
 * Thunk Actions
 */

export const attemptRemove =
  (id: string): Thunk =>
  (dispatch) => {
    dispatch(requestIntervalUpdate());
    firebaseApi
      .removeInterval(id)
      .then(() => dispatch(intervalRemoved(id)))
      .catch((err: unknown) =>
        dispatch(intervalUpdateFailed(`Could not remove interval with id: ${id}. ${err}`)),
      );
  };

const hasId = (interval: NewInterval | Interval): interval is Interval & { id: string } =>
  'id' in interval && Boolean(interval.id);

export function attemptUpdate(interval: NewInterval | Interval): Thunk<Promise<unknown>> {
  return (dispatch) => {
    const handleSuccess = (updatedInterval: Interval) => dispatch(intervalUpdated(updatedInterval));
    const handleFailure = (err: unknown) => dispatch(intervalUpdateFailed(err));

    dispatch(requestIntervalUpdate());

    if (!hasId(interval)) {
      const errors = validateNewInterval(interval);
      if (errors) {
        handleFailure(errors);
        return Promise.reject(errors);
      }

      // firebase also fires child_added event that we handle
      return firebaseApi.createInterval(interval).then(handleSuccess).catch(handleFailure);
    }

    const errors = validateInterval(interval);
    if (errors) {
      handleFailure(errors);
      return Promise.reject(errors);
    }
    // firebase also fires child_changed event that we handle
    return firebaseApi.updateInterval(interval).then(handleSuccess).catch(handleFailure);
  };
}

export function fetchIntervalsForUser(): Thunk<Promise<unknown>> {
  return (dispatch) => {
    dispatch(requestIntervals());

    return firebaseApi
      .fetchIntervalsForUser()
      .then(filterBadApples)
      .then(({ intervals }) => dispatch(intervalsFetched(intervals)))
      .catch((error) => {
        Sentry.captureException(error);
        dispatch(intervalsFetched({}));
      });
  };
}

function filterBadApples(intervals: Record<string, unknown>) {
  const damagedIntervals: Record<string, unknown> = {};
  const validIntervals: IntervalsById = {};
  const keys = Object.keys(intervals);
  keys.forEach((key) => {
    const value = intervals[key];
    if (isInterval(value)) {
      validIntervals[key] = value;
    } else {
      damagedIntervals[key] = value;
    }
  });
  const damagedKeys = Object.keys(damagedIntervals);
  if (damagedKeys.length) {
    Sentry.captureMessage(
      `Ignored ${damagedKeys.length} invalid interval(s): ${damagedKeys.join(', ')}`,
    );
  }
  return { intervals: validIntervals, damagedIntervals };
}

const initialState: IntervalsState = {
  timestamp: Date.now(),
  updatedAt: 0,
  isFetching: true,
  isSaving: false,
  items: [],
  error: '',
};

export default function intervalsReducer(state = initialState, action: Action): IntervalsState {
  switch (action.type) {
    case RESET_STATE:
      return {
        ...state,
        updatedAt: Date.now(),
        isFetching: false,
        items: [],
      };

    case INTERVALS_UPDATE_TIMESTAMP:
      return {
        ...state,
        timestamp: action.timestamp,
      };

    case INTERVALS_REQUEST:
      return {
        ...state,
        updatedAt: Date.now(),
        isFetching: true,
      };

    case INTERVALS_FETCHED: {
      return {
        ...state,
        isFetching: false,
        updatedAt: Date.now(),
        items: Object.entries(action.intervals).map(([id, interval]) => ({ ...interval, id })),
      };
    }

    case REQUEST_INTERVAL_UPDATE:
      return {
        ...state,
        updatedAt: Date.now(),
        isSaving: true,
      };

    // add and update are upserts: the success handler and the Firebase listener
    // report the same interval, so the second must not create a duplicate
    case INTERVAL_ADD:
    case INTERVAL_UPDATED:
    case INTERVAL_COMPLETE: {
      const items = state.items.filter(({ id }) => action.interval.id !== id);
      items.push(action.interval);
      return {
        ...state,
        updatedAt: Date.now(),
        isSaving: false,
        items,
      };
    }

    case INTERVAL_UPDATE_FAILED:
      return {
        ...state,
        updatedAt: Date.now(),
        error: action.error,
        isSaving: false,
      };

    case INTERVAL_REMOVE: {
      return {
        ...state,
        updatedAt: Date.now(),
        isSaving: false,
        items: state.items.filter(({ id }) => action.id !== id),
      };
    }

    default:
      return state;
  }
}
