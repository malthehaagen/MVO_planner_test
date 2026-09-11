interface ChipSetProps {
  label: string;
  items: ReadonlyArray<string>;
  onSelect: (item: string) => void;
  /** Items already used, shown as selected. */
  selected?: ReadonlyArray<string>;
  describedById?: string;
}

/**
 * Example suggestions. Selecting one fills a field; nothing is written
 * into the plan until the person chooses it.
 */
export function ChipSet({
  label,
  items,
  onSelect,
  selected = [],
  describedById,
}: ChipSetProps) {
  return (
    <div className="examples">
      <p className="examples__label" id={describedById}>
        {label}
      </p>
      <ul className="chip-set">
        {items.map((item) => (
          <li key={item}>
            <button
              type="button"
              className="chip"
              aria-pressed={selected.includes(item)}
              onClick={() => onSelect(item)}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
