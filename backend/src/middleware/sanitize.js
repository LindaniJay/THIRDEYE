// Custom sanitizer compatible with Express 5 request objects

const isPlainObject = (value) => {
  return (
    value !== null &&
    typeof value === 'object' &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
};

const shouldDeleteKey = (key) => {
  return key.startsWith('$') || key.includes('.');
};

const sanitizeInPlace = (value) => {
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      sanitizeInPlace(value[index]);
    }
    return;
  }

  if (!isPlainObject(value)) {
    return;
  }

  for (const key of Object.keys(value)) {
    if (shouldDeleteKey(key)) {
      delete value[key];
      continue;
    }
    sanitizeInPlace(value[key]);
  }
};

export const sanitizeRequest = (req, res, next) => {
  try {
    if (req.body) sanitizeInPlace(req.body);
    if (req.query) sanitizeInPlace(req.query);
    if (req.params) sanitizeInPlace(req.params);
  } catch (_err) {
    // Non-fatal; proceed without blocking the request
  }
  next();
};

export default sanitizeRequest;



