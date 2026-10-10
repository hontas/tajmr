import type { NewInterval } from '#/utils/interValidator.ts';

export interface CompleteInterval extends NewInterval {
  endTime: number;
}
