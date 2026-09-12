export const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // Replace spaces, non-word chars, dashes with a single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};