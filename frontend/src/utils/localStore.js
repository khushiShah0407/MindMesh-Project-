export function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`Could not read local MindMesh data for "${key}".`, error);
    return fallback;
  }
}

export function saveJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Could not save local MindMesh data for "${key}".`, error);
  }
}

export function loadText(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch (error) {
    console.warn(`Could not read local MindMesh data for "${key}".`, error);
    return fallback;
  }
}

export function saveText(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Could not save local MindMesh data for "${key}".`, error);
  }
}
