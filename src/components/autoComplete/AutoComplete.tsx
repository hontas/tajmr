import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
} from 'react';
import classNames from 'classnames';

import styles from './AutoComplete.module.css';

const noNotes: string[] = [];

interface AutoCompleteProps {
  className?: string;
  label?: string;
  placeholder?: string;
  'data-testid'?: string;
  value?: string;
  notes?: string[];
  onChange: (value: string) => void;
}

const AutoComplete = ({
  className,
  label = '',
  placeholder = '',
  'data-testid': testId,
  value,
  notes = noNotes,
  onChange,
}: AutoCompleteProps) => {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (evt: KeyboardEvent<HTMLDivElement>) => {
    const { target } = evt;
    if (!(target instanceof HTMLElement)) return;

    switch (evt.key) {
      case 'ArrowUp':
      case 'ArrowDown': {
        evt.preventDefault();
        if (suggestions.length === 0) return;
        showPopover(popoverRef.current, inputRef.current);
        const buttons = [
          ...(popoverRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []),
        ];
        if (buttons.length === 0) return;
        const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
        if (evt.key === 'ArrowDown') {
          (buttons[current + 1] ?? buttons[0]).focus();
        } else if (current <= 0) {
          inputRef.current?.focus();
        } else {
          buttons[current - 1].focus();
        }
        break;
      }
      case 'Escape':
        hidePopover(popoverRef.current);
        inputRef.current?.focus();
        break;
      default:
    }
  };

  const openSuggestions = () => {
    if (suggestions.length > 0) {
      showPopover(popoverRef.current, inputRef.current);
    }
  };

  const handleSelect = (note: string) => {
    setQuery(note);
    setSuggestions([]);
    onChange(note);
  };

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const nextQuery = target.value.toLowerCase();
    setQuery(target.value);
    const matches = nextQuery
      ? notes.filter((note) => note.toLowerCase().startsWith(nextQuery))
      : [];
    setSuggestions(matches);
  };

  const handleContainerBlur = (evt: FocusEvent<HTMLDivElement>) => {
    if (evt.currentTarget.contains(evt.relatedTarget)) return;
    hidePopover(popoverRef.current);
    const nextValue = (inputRef.current?.value ?? '').toLowerCase();
    if (nextValue !== value) onChange(nextValue);
  };

  useEffect(() => {
    if (suggestions.length > 0 && containerRef.current?.matches(':focus-within')) {
      showPopover(popoverRef.current, inputRef.current);
    } else {
      hidePopover(popoverRef.current);
    }
  }, [suggestions]);

  useEffect(() => {
    // sync state unless editing
    if (!containerRef.current?.matches(':focus-within')) {
      setQuery(value || '');
    }
  }, [value]);

  return (
    <div
      className={classNames(styles.container, className)}
      onKeyDown={handleKeyDown}
      role="presentation"
      ref={containerRef}
      onBlur={handleContainerBlur}
    >
      <label className={styles.label}>
        {label}
        <input
          data-testid={testId}
          ref={inputRef}
          type="text"
          value={query}
          placeholder={placeholder}
          className={styles.input}
          onFocus={openSuggestions}
          onClick={openSuggestions}
          onChange={handleChange}
        />
      </label>
      <div popover="manual" ref={popoverRef} className={styles.popover}>
        <ul className={styles.suggestions}>
          {suggestions.map((note) => (
            <li key={note}>
              <button
                className={styles.suggestionBtn}
                onClick={() => handleSelect(note)}
                type="button"
                onMouseDown={(evt) => evt.preventDefault()}
              >
                {note}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

function showPopover(popover: HTMLDivElement | null, source: HTMLElement | null) {
  if (!popover || popover.matches(':popover-open')) return;
  popover.showPopover({ source: source ?? undefined });
}
function hidePopover(popover: HTMLDivElement | null) {
  if (!popover || !popover.matches(':popover-open')) return;
  popover.hidePopover();
}

export default AutoComplete;
