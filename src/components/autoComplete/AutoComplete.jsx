import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './AutoComplete.module.css';

const noNotes = [];

const AutoComplete = ({
  className,
  label = '',
  placeholder = '',
  dataTestId,
  value,
  notes = noNotes,
  onChange,
}) => {
  const [query, setQuery] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const [previousValue, setPreviousValue] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  if (value !== previousValue) {
    setPreviousValue(value);
    if (!isFocused) setQuery(value || '');
  }

  const suggestionsList = useRef(null);
  const timeoutId = useRef(null);

  const handleKeyDown = (evt) => {
    const list = suggestionsList.current;
    if (['ArrowDown', 'ArrowUp'].includes(evt.key) && suggestions.length) {
      const delta = evt.key === 'ArrowUp' ? -1 : 1;
      const currentIndex = [].indexOf.call(list.childNodes, evt.target.parentNode);
      const nextIndex = currentIndex === -1 ? 0 : currentIndex + delta;
      if (nextIndex < 0 || nextIndex >= list.childNodes.length) return;
      list.childNodes[nextIndex].firstElementChild.focus();
      evt.preventDefault();
      return;
    }

    switch (evt.key) {
      case 'Enter':
        if (evt.target.classList.contains(styles.suggestionBtn)) {
          handleSelect(evt);
        }
        break;
      case 'Escape':
        setSuggestions([]);
        break;
      default:
    }
  };

  const handleSelect = (evt) => {
    evt.preventDefault();
    if (timeoutId.current) clearTimeout(timeoutId.current);
    const selected = evt.target.textContent;
    setQuery(selected);
    setSuggestions([]);
    onChange({ target: { value: selected } });
  };

  const handleChange = ({ target }) => {
    const nextQuery = target.value.toLowerCase();
    setQuery(nextQuery);
    setSuggestions(
      nextQuery ? notes.filter((note) => note.toLowerCase().startsWith(nextQuery)) : [],
    );
  };

  const handleBlur = ({ target }) => {
    setIsFocused(false);
    const nextValue = target.value.toLowerCase();
    // don't blur if tabbed to selection list
    if (suggestionsList.current.hasChildNodes()) return;
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

AutoComplete.propTypes = {
  className: PropTypes.string,
  dataTestId: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  notes: PropTypes.arrayOf(PropTypes.string),
};

export default AutoComplete;
