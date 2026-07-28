const VISITOR_STORAGE_KEY = "mehmetanil-visitor-id";

export function getVisitorId() {
  let visitorId = window.localStorage.getItem(VISITOR_STORAGE_KEY);

  if (!visitorId) {
    visitorId = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_STORAGE_KEY, visitorId);
  }

  return visitorId;
}
