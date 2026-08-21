"use client";
import { useEffect, useRef, useState } from "react";

// Custom dropdown instead of a native <select>. A <select>'s open option list is
// drawn by the browser itself, not from our CSS, so it can't be reliably
// dark-themed across browsers (it shows up white / unreadable on the dark page).
// Building it from a plain button + div keeps every part of it styled by our own
// Tailwind classes, so it always matches the theme.
//
// Props: label (text shown before the value), value (currently selected value),
// options (array of strings, or of {value, label} objects), onChange (called
// with the new value).
export default function FilterDropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close the menu when the user clicks anywhere outside this dropdown.
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    // Remove the listener when the component unmounts so it doesn't pile up.
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Options come in two shapes. Role type / Workplace pass plain strings, where
  // the enum value is also what the user reads ("Remote"). Sort passes
  // {value, label} objects, because it stores a short key ("match") but has to
  // show a different label ("Best Match"). Normalise both to {value, label}.
  const choices = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option
  );

  // Plain-string options are optional filters, so they get an "All" entry that
  // clears them ("" is the page's convention for no filter). Object options
  // always have one choice active, so they supply their own complete list.
  if (typeof options[0] === "string") {
    choices.unshift({ value: "", label: "All" });
  }

  // Show the label of whatever is selected, not the raw stored value.
  const selected = choices.find((choice) => choice.value === value);

  return (
    <div ref={containerRef} className="relative">
      {/* The closed control - same size/border as the other filter controls. */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 items-center gap-2 rounded-md border border-border-dark bg-transparent px-3 text-sm font-medium text-text-muted hover:text-text-light focus:outline-none focus:ring-2 focus:ring-slate-400"
      >
        {label}: {selected ? selected.label : "All"}
        <span className="text-xs">▾</span>
      </button>

      {/* The open list - only in the DOM while open is true. */}
      {open && (
        <div className="absolute left-0 z-10 mt-1 w-44 rounded-md border border-border-dark bg-surface-dark py-1 shadow-lg">
          {choices.map((choice) => (
            <button
              key={choice.value || "all"}
              type="button"
              onClick={() => {
                onChange(choice.value);
                setOpen(false);
              }}
              className={`block w-full px-3 py-2 text-left text-sm hover:bg-background-dark ${
                choice.value === value ? "text-primary font-medium" : "text-text-muted"
              }`}
            >
              {choice.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
