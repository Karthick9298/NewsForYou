import { useRef } from 'react';

/**
 * OTPInput — six individual digit boxes wired together.
 * Handles typing, backspace, arrow-key navigation, and clipboard paste.
 *
 * @param {string}   value    - Current 1-6 char digit string
 * @param {function} onChange - Called with the new digit string on every change
 */
function OTPInput({ value, onChange }) {
  const inputsRef = useRef([]);
  const digits = value.padEnd(6, ' ').split('').slice(0, 6);

  function handleKey(e, idx) {
    if (e.key === 'Backspace') {
      const newVal = value.slice(0, idx === value.length ? value.length - 1 : idx);
      onChange(newVal);
      if (idx > 0) inputsRef.current[idx - 1]?.focus();
      return;
    }
    if (e.key === 'ArrowLeft' && idx > 0) { inputsRef.current[idx - 1]?.focus(); return; }
    if (e.key === 'ArrowRight' && idx < 5) { inputsRef.current[idx + 1]?.focus(); return; }
  }

  function handleChange(e, idx) {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    if (!char) return;
    const arr = value.padEnd(6, ' ').split('').slice(0, 6);
    arr[idx] = char;
    const newVal = arr.join('').trimEnd().slice(0, 6);
    onChange(newVal);
    if (idx < 5) inputsRef.current[idx + 1]?.focus();
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  }

  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {Array.from({ length: 6 }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => { inputsRef.current[idx] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[idx]?.trim() || ''}
          autoFocus={idx === 0}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKey(e, idx)}
          onPaste={handlePaste}
          className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-xl font-bold font-mono rounded-xl border-2 bg-background/60 text-foreground outline-none transition-all duration-150
            focus:border-primary focus:bg-primary/5 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.15)]
            ${digits[idx]?.trim() ? 'border-primary/60 bg-primary/5' : 'border-border hover:border-border/80'}`}
        />
      ))}
    </div>
  );
}

export default OTPInput;
