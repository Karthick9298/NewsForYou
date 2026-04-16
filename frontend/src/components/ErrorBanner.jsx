/**
 * ErrorBanner — displays a styled destructive alert for form errors.
 * Renders nothing when msg is falsy.
 *
 * @param {string | null | undefined} msg - Error message to display.
 */
function ErrorBanner({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-start gap-2.5 text-sm bg-destructive/10 border border-destructive/25 text-destructive-foreground rounded-xl px-3.5 py-3">
      <span className="text-base leading-none mt-px">⚠</span>
      <span className="leading-snug">{msg}</span>
    </div>
  );
}

export default ErrorBanner;
