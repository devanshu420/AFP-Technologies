export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
}

export function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(String(id));
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function sanitize(input) {
  if (typeof input !== 'string') return input;
  return input.replace(/[<>]/g, '');
}