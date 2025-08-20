// Minimal XSS sanitizer that escapes angle brackets in strings.
// Designed to be Express 5–safe by mutating values in place without reassigning req.query/req.params.

const escapeString = (value) => {
  if (typeof value !== 'string') return value;
  return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

const sanitizeInPlace = (value) => {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      if (typeof value[i] === 'string') {
        value[i] = escapeString(value[i]);
      } else {
        sanitizeInPlace(value[i]);
      }
    }
    return;
  }

  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      if (typeof value[key] === 'string') {
        value[key] = escapeString(value[key]);
      } else {
        sanitizeInPlace(value[key]);
      }
    }
  }
};

export const xssSanitizeRequest = (req, res, next) => {
  try {
    if (req.body) sanitizeInPlace(req.body);
    if (req.query) sanitizeInPlace(req.query);
    if (req.params) sanitizeInPlace(req.params);
  } catch (_err) {
    // non-fatal
  }
  next();
};

export default xssSanitizeRequest;



