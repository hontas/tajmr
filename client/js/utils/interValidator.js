const intervalSchema = {
  properties: {
    createdAt: 'number',
    updatedAt: 'number',
    startTime: 'number',
    endTime: 'number',
    notWork: 'boolean',
    note: 'string',
    user: 'string',
    id: 'string',
  },
  required: ['createdAt', 'startTime', 'user'],
};

const newIntervalSchema = {
  properties: {
    startTime: 'number',
    endTime: 'number',
    note: 'string',
    notWork: 'boolean',
  },
  required: ['startTime'],
};

function validate(schema, data) {
  const { properties, required = [] } = schema;

  if (typeof data !== 'object') return { errors: 'Data must be of type object' };

  const keys = Object.keys(data);

  const missingRequired = required.filter((reqProp) => keys.includes(reqProp) === false);
  if (missingRequired.length) {
    return { errors: `Missing required properties "${missingRequired.join(', ')}"` };
  }

  const typeErrors = keys.reduce((acc, prop) => {
    const expectedType = properties[prop];
    const actualType = typeof data[prop];

    if (!expectedType) return acc; // no type validation for this prop
    if (actualType === expectedType) return acc;

    return [...acc, `"${prop}" should be "${expectedType}" but is ${actualType}`];
  }, []);

  if (typeErrors.length) {
    return { errors: typeErrors.join('\n') };
  }

  const extraneousKeys = keys.filter((key) => !properties[key]);
  if (extraneousKeys.length) {
    return { errors: `Not supported extraneous keys [${extraneousKeys.join(', ')}]` };
  }

  return {};
}

const createValidator = (schema) => (interval) => {
  const { errors } = validate(schema, interval);

  if (errors) return errors;
  return undefined;
};
export const validateInterval = createValidator(intervalSchema);
export const validateNewInterval = createValidator(newIntervalSchema);
