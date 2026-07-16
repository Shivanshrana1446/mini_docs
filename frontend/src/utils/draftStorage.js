export const getDraft = (documentId) => {
  if (!documentId) return null;

  try {
    return JSON.parse(localStorage.getItem(`mini-docs-draft-${documentId}`));
  } catch {
    return null;
  }
};

export const saveDraft = (documentId, draft) => {
  if (!documentId) return;

  try {
    localStorage.setItem(`mini-docs-draft-${documentId}`, JSON.stringify(draft));
  } catch {
    // Ignore localStorage failures in private mode or when disabled.
  }
};

export const removeDraft = (documentId) => {
  if (!documentId) return;

  try {
    localStorage.removeItem(`mini-docs-draft-${documentId}`);
  } catch {
    // Ignore localStorage failures.
  }
};
