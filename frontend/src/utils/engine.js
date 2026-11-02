/**
 * Pure business logic and calculation engine for MindMesh
 * Decoupled for fast-feedback deterministic unit testing.
 */

/**
 * SuperMemo SM-2 spaced repetition algorithm
 * @param {{ interval: number, repetitions: number, easeFactor: number }} card 
 * @param {'again'|'hard'|'good'|'easy'} rating 
 * @returns {{ interval: number, repetitions: number, easeFactor: number, nextReviewDays: number }}
 */
export function calculateNextReview(card, rating) {
  let { interval = 1, repetitions = 0, easeFactor = 2.5 } = card;

  let quality = 3;
  if (rating === 'again') quality = 0;
  else if (rating === 'hard') quality = 2;
  else if (rating === 'good') quality = 4;
  else if (rating === 'easy') quality = 5;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  return {
    interval,
    repetitions,
    easeFactor: Number(easeFactor.toFixed(2)),
    nextReviewDays: interval,
  };
}

/**
 * Validates GPS latitude and longitude coordinates
 * @param {number|string} lat 
 * @param {number|string} lng 
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validateCoordinates(lat, lng) {
  const nLat = Number(lat);
  const nLng = Number(lng);

  if (isNaN(nLat) || isNaN(nLng)) {
    return { isValid: false, error: 'Latitude and Longitude must be valid decimal numbers.' };
  }
  if (nLat < -90 || nLat > 90) {
    return { isValid: false, error: 'Latitude must be between -90 and +90 degrees.' };
  }
  if (nLng < -180 || nLng > 180) {
    return { isValid: false, error: 'Longitude must be between -180 and +180 degrees.' };
  }
  return { isValid: true };
}

/**
 * Validates an email address
 * @param {string} email 
 * @returns {boolean}
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/**
 * Evaluates whether an automation trigger matches an event
 * @param {{ trigger: string, active: boolean }} workflow 
 * @param {{ type: string }} event 
 * @returns {boolean}
 */
export function evaluateWorkflowTrigger(workflow, event) {
  if (!workflow || !workflow.active) return false;
  return workflow.trigger === event.type;
}

/**
 * Keyword + token overlap search used by Hybrid Search.
 * @param {string} query
 * @param {Array<{ id: string, title: string, snippet?: string, content?: string, type: string, date?: string, viewTarget?: string }>} items
 */
export function hybridSearch(query, items) {
  const q = (query || '').toLowerCase().trim();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);

  return items
    .map((item) => {
      const hay = `${item.title || ''} ${item.snippet || ''} ${item.content || ''} ${item.type || ''}`.toLowerCase();
      const hits = tokens.filter((token) => hay.includes(token)).length;
      const score = hits / tokens.length;
      return {
        ...item,
        score: Number(Math.min(0.99, 0.62 + score * 0.37).toFixed(2)),
        matchRatio: score,
      };
    })
    .filter((item) => item.matchRatio > 0)
    .sort((a, b) => b.score - a.score);
}

/**
 * Builds a lightweight graph from live records (real-time mode).
 */
export function buildGraphFromRecords(notes = [], meetings = [], contacts = []) {
  const nodes = [];
  const edges = [];
  let x = 80;
  let y = 90;

  notes.slice(0, 12).forEach((note, index) => {
    nodes.push({
      id: note.id,
      label: note.title?.slice(0, 28) || 'Note',
      category: 'Personal Ideas',
      x: x + (index % 4) * 140,
      y: y + Math.floor(index / 4) * 110,
      radius: 18,
    });
  });

  meetings.slice(0, 8).forEach((meeting, index) => {
    nodes.push({
      id: meeting.id,
      label: meeting.title?.slice(0, 28) || 'Meeting',
      category: 'Product Strategy',
      x: 120 + (index % 3) * 160,
      y: 360 + Math.floor(index / 3) * 90,
      radius: 16,
    });
    if (notes[0]) {
      edges.push({ from: meeting.id, to: notes[0].id });
    }
  });

  contacts.slice(0, 6).forEach((contact, index) => {
    nodes.push({
      id: contact.id,
      label: contact.name,
      category: 'Market Research',
      x: 520 + (index % 2) * 130,
      y: 120 + Math.floor(index / 2) * 90,
      radius: 15,
    });
  });

  return { nodes, edges };
}
