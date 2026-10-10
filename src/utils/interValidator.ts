import * as v from 'valibot';

const newIntervalSchema = v.strictObject({
  startTime: v.number(),
  endTime: v.optional(v.number()),
  note: v.optional(v.string()),
  notWork: v.optional(v.boolean()),
});

const intervalSchema = v.strictObject({
  createdAt: v.number(),
  ...newIntervalSchema.entries,
  updatedAt: v.optional(v.number()),
  id: v.optional(v.string()),
});

export const userSettingsSchema = v.partial(
  v.strictObject({
    displayMonthReport: v.boolean(),
    displayNotifications: v.boolean(),
    displayPreviousIntervals: v.boolean(),
    displayName: v.string(),
    hoursInWeek: v.number(),
  }),
);

export type NewInterval = v.InferOutput<typeof newIntervalSchema>;
export type Interval = v.InferOutput<typeof intervalSchema>;
export type UserSettingsData = v.InferOutput<typeof userSettingsSchema>;

type Issue = v.BaseIssue<unknown>;

const isNotObject = (issue: Issue) => issue.type === 'strict_object' && !issue.path;
const isMissingKey = (issue: Issue) =>
  issue.type === 'strict_object' && issue.received === 'undefined';
const isExtraneousKey = (issue: Issue) =>
  issue.type === 'strict_object' && issue.expected === 'never';
const keyOf = (issue: Issue) => issue.path?.map(({ key }) => String(key)).join('.') ?? '';

// built from keys and types only: the issues carry the received value, which can be a note
function describe(issues: readonly Issue[]) {
  if (issues.some(isNotObject)) {
    return 'Data must be of type object';
  }

  const missing = issues.filter(isMissingKey);
  if (missing.length) {
    return `Missing required properties "${missing.map(keyOf).join(', ')}"`;
  }

  const wrongType = issues.filter((issue) => !isExtraneousKey(issue));
  if (wrongType.length) {
    return wrongType
      .map(
        (issue) => `"${keyOf(issue)}" should be "${issue.expected}" but is ${typeof issue.input}`,
      )
      .join('\n');
  }

  return `Not supported extraneous keys [${issues.filter(isExtraneousKey).map(keyOf).join(', ')}]`;
}

const createValidator =
  (schema: v.GenericSchema) =>
  (data: unknown): string | undefined => {
    const result = v.safeParse(schema, data);
    return result.success ? undefined : describe(result.issues);
  };

export const validateInterval = createValidator(intervalSchema);
export const validateNewInterval = createValidator(newIntervalSchema);

export const isInterval = (data: unknown): data is Interval => v.is(intervalSchema, data);
