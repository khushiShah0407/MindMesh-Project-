export const setNotePinned = (note, pinned) => ({
  ...note,
  pinned: Boolean(pinned),
});

export const addNoteTag = (note, draft) => {
  const tag = draft.trim().replace(/^#+/, '').trim().slice(0, 40);
  if (!tag) return null;

  const tags = Array.isArray(note.tags) ? note.tags : [];
  if (tags.some((existing) => existing.replace(/^#+/, '').trim().toLowerCase() === tag.toLowerCase())) return null;
  return { ...note, tags: [...tags, tag] };
};

export const filterNotes = (notes, searchQuery = '', pinnedOnly = false) => {
  const query = searchQuery.toLowerCase();
  return (Array.isArray(notes) ? notes : [])
    .filter((note) => {
      if (pinnedOnly && note.pinned !== true) return false;
      return (
        (note.title || '').toLowerCase().includes(query) ||
        (typeof note.content === 'string' && note.content.toLowerCase().includes(query)) ||
        (Array.isArray(note.tags) && note.tags.some(
          (tag) => typeof tag === 'string' && tag.toLowerCase().includes(query),
        ))
      );
    })
    .sort((left, right) => Number(Boolean(right.pinned)) - Number(Boolean(left.pinned)));
};

const getTimestamp = (value) => {
  const date = value?.toDate?.() ?? (value instanceof Date ? value : null);
  const timestamp = date ? date.getTime() : typeof value === 'number' ? value : Date.parse(value);
  return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : null;
};

export const getRediscoveryNote = (notes, now = Date.now()) => {
  const candidates = (Array.isArray(notes) ? notes : [])
    .map((note, index) => ({
      note,
      index,
      timestamp: getTimestamp(note.updatedAt) ?? getTimestamp(note.createdAt),
    }))
    .filter(({ note, timestamp }) => timestamp !== null && (note.title?.trim() || note.content?.trim()))
    .sort((left, right) => left.timestamp - right.timestamp || left.index - right.index);

  if (!candidates.length) return null;

  const { note, timestamp } = candidates[0];
  return {
    note,
    daysSinceUpdate: Math.max(0, Math.floor((now - timestamp) / 86_400_000)),
  };
};
