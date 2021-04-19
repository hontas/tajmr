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

  const typeErrors = keys
    .filter((prop) => data[prop])
    .reduce((acc, prop) => {
      const type = data[prop];
      const validType = properties[prop];

      if (!validType) return acc; // no type validation for this prop
      // eslint-disable-next-line valid-typeof
      if (typeof type === validType) return acc;

      return [...acc, `"${prop}" should be "${validType}" but is ${type}`];
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

  if (errors) {
    console.log('Interval validation failed for', interval, errors);
    return errors;
  }
};
export const validateInterval = createValidator(intervalSchema);
export const validateNewInterval = createValidator(newIntervalSchema);
