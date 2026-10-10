export interface Interval {
  id?: string;
  startTime: number;
  endTime?: number;
  note?: string;
  notWork?: boolean;
}

export interface CompleteInterval extends Interval {
  endTime: number;
}
