// Heuristic only - in-app webview UA strings aren't standardised and change
// with app updates, so this strengthens the always-visible print notice
// rather than replacing it. False negatives are fine (the always-on banner
// still covers them); a false positive just shows an extra warning.
const IN_APP_WEBVIEW_PATTERN =
  /FBAN|FBAV|Instagram|Line\/|MicroMessenger|TikTok|GSA\/.*Mobile|; ?wv\)/i;

export function isLikelyInAppBrowser() {
  if (typeof navigator === "undefined") return false;
  return IN_APP_WEBVIEW_PATTERN.test(navigator.userAgent || "");
}
