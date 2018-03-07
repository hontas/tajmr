import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class AutoComplete extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      query: props.value || '',
      suggestions: []
    };
  }

  render() {
    const { query, suggestions } = this.state;
    const {
      className,
      label = '',
      placeholder = ''
    } = this.props;

    return (
      <div
        className={classNames('AutoComplete', className)}
        onKeyDown={this.onKeyDown}
        role="presentation"
      >
        <label className="AutoComplete__label">
          { label }
          <input
            type="text"
            value={query}
            placeholder={placeholder}
            className="AutoComplete__input"
            onBlur={this.onBlur}
            onChange={this.onChange}
          />
        </label>
        <ul className="AutoComplete__suggestions" ref={(node) => { this.suggestionsList = node; }}>
          {!!suggestions.length &&
            suggestions.map((note) => (
              <li key={note} className="AutoComplete__suggestion">
                <button
                  className="AutoComplete__suggestion__btn"
                  onClick={this.onSelect}
                  type="button"
                >
                  {note}
                </button>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }

  onKeyDown = (evt) => {
    const { suggestions } = this.state;
    if (['ArrowDown', 'ArrowUp'].includes(evt.key) && suggestions.length) {
      const delta = evt.key === 'ArrowUp' ? -1 : 1;
      const listElement = evt.target.parentNode;
      const currentIndex = [].indexOf.call(this.suggestionsList.childNodes, listElement);
      const nextIndex = currentIndex === -1 ? 0 : currentIndex + delta;
      if (nextIndex < 0 || nextIndex >= this.suggestionsList.childNodes.length) return;
      this.suggestionsList.childNodes[nextIndex].firstElementChild.focus();
      evt.preventDefault();
      return;
    }

    switch (evt.key) {
      case 'Enter':
        if (evt.target.classList.contains('AutoComplete__suggestion__btn')) {
          this.onSelect(evt);
        }
        break;
      case 'Escape':
        this.setState({ suggestions: [] });
        break;
      default:
    }
  };

  onSelect = (evt) => {
    evt.preventDefault();
    if (this.timeoutId) clearTimeout(this.timeoutId);
    const query = evt.target.textContent;
    this.setState({ query, suggestions: [] });
    this.props.onChange({ target: { value: query } });
  };

  onChange = ({ target }) => {
    const query = target.value.toLowerCase();
    const suggestions = this.props.notes.filter((note) => note.toLowerCase().startsWith(query));
    this.setState({
      query,
      suggestions: query ? suggestions : []
    });
  };

  onBlur = ({ target }) => {
    const value = target.value.toLowerCase();
    // don't blur if tabbed to selection list
    if (this.suggestionsList.hasChildNodes(target)) return;
    if (value === this.props.value) return;
    this.timeoutId = setTimeout(() => {
      this.props.onChange({ target: { value } });
      this.timeoutId = null;
    }, 1);
  }
}

AutoComplete.defaultProps = {
  notes: []
};

AutoComplete.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  notes: PropTypes.arrayOf(PropTypes.string)
};

export default AutoComplete;
