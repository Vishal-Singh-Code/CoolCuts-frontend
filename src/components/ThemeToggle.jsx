import { useTheme } from "../context/ThemeContext";

const labelMap = {
  atelier: "Atelier",
  coast: "Coast",
  ember: "Ember",
};

const ThemeToggle = ({ compact = false }) => {
  const { theme, cycleTheme } = useTheme();

  return (
    <button
      onClick={cycleTheme}
      className={`${
        compact ? "w-full justify-start" : ""
      } inline-flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--ink-strong)] hover:bg-[var(--surface-hover)] transition`}
      type="button"
      aria-label="Change theme"
    >
      <span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--brand)]" />
      <span>{labelMap[theme]}</span>
    </button>
  );
};

export default ThemeToggle;
