export default function AppToggle({ checked, onChange, ariaLabel, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-[clamp(1.55rem,1.95vw,1.75rem)] w-[clamp(2.65rem,3.35vw,3rem)] shrink-0 cursor-pointer items-center rounded-full border transition duration-200 hover:brightness-[1.04] disabled:cursor-not-allowed disabled:opacity-60 ${
        checked
          ? 'border-[#5B4BD7] bg-[#5B4BD7] shadow-[0_0.5rem_1.125rem_rgba(91,75,215,0.28)]'
          : 'border-[#D5CFF5] bg-[#C8BDEB]'
      }`.trim()}
    >
      <span
        className={`h-[clamp(1.1rem,1.4vw,1.25rem)] w-[clamp(1.1rem,1.4vw,1.25rem)] rounded-full bg-white shadow-[0_0.125rem_0.5rem_rgba(15,18,20,0.18)] transition duration-200 ${
          checked ? 'translate-x-[clamp(1.18rem,1.48vw,1.35rem)]' : 'translate-x-[clamp(0.12rem,0.18vw,0.15rem)]'
        }`.trim()}
      />
    </button>
  );
}
