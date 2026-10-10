import {
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type SyntheticEvent,
} from 'react';
import classNames from 'classnames';

import styles from './AutoComplete.module.css';

const noNotes: string[] = [];

interface AutoCompleteProps {
  className?: string;
  label?: string;
  placeholder?: string;
  dataTestId?: string;
  value?: string;
  notes?: string[];
  onChange: (evt: { target: { value: string } }) => void;
}

const AutoComplete = ({
  className,
  label = '',
  placeholder = '',
  dataTestId,
  value,
  notes = noNotes,
  onChange,
}: AutoCompleteProps) => {
  const [query, setQuery] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const [previousValue, setPreviousValue] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  if (value !== previousValue) {
    setPreviousValue(value);
    if (!isFocused) setQuery(value || '');
  }

  const suggestionsList = useRef<HTMLUListElement>(null);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleKeyDown = (evt: KeyboardEvent<HTMLDivElement>) => {
    const list = suggestionsList.current;
    const { target } = evt;
    if (!(target instanceof HTMLElement)) return;
    if (list && ['ArrowDown', 'ArrowUp'].includes(evt.key) && suggestions.length) {
      const delta = evt.key === 'ArrowUp' ? -1 : 1;
      const currentIndex = Array.from(list.children).findIndex(
        (child) => child === target.parentNode,
      );
      const nextIndex = currentIndex === -1 ? 0 : currentIndex + delta;
      if (nextIndex < 0 || nextIndex >= list.children.length) return;
      const nextButton = list.children[nextIndex]?.firstElementChild;
      if (nextButton instanceof HTMLElement) nextButton.focus();
      evt.preventDefault();
      return;
    }

    switch (evt.key) {
      case 'Enter':
        if (target.classList.contains(styles.suggestionBtn)) {
          handleSelect(evt);
        }
        break;
      case 'Escape':
        setSuggestions([]);
        break;
      default:
    }
  };

  const handleSelect = (evt: SyntheticEvent) => {
    evt.preventDefault();
    if (!(evt.target instanceof HTMLElement)) return;
    if (timeoutId.current) clearTimeout(timeoutId.current);
    const selected = evt.target.textContent ?? '';
    setQuery(selected);
    setSuggestions([]);
    onChange({ target: { value: selected } });
  };

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const nextQuery = target.value.toLowerCase();
    setQuery(nextQuery);
    setSuggestions(
      nextQuery ? notes.filter((note) => note.toLowerCase().startsWith(nextQuery)) : [],
    );
  };

  const handleBlur = ({ target }: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    const nextValue = target.value.toLowerCase();
    // don't blur if tabbed to selection list
    if (suggestionsList.current?.hasChildNodes()) return;
    if (nextValue === value) return;
    timeoutId.current = setTimeout(() => {
      onChange({ target: { value: nextValue } });
      timeoutId.current = null;
    }, 1);
  };

  return (
    <div
      className={classNames(styles.container, className)}
      onKeyDown={handleKeyDown}
      role="presentation"
    >
      <label className={styles.label}>
        {label}
        <input
          data-testid={dataTestId}
          type="text"
          value={query}
          placeholder={placeholder}
          className={styles.input}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </label>
      <ul className={styles.suggestions} ref={suggestionsList}>
        {suggestions.map((note) => (
          <li key={note}>
            <button className={styles.suggestionBtn} onClick={handleSelect} type="button">
              {note}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AutoComplete;
