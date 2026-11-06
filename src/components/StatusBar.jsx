import LanguagePicker from './LanguagePicker';
import './StatusBar.css';

export default function StatusBar({ cursor, zoom, language, onLangChange }) {
  const { line = 1, col = 1, selected = 0, chars = 0, words = 0 } = cursor || {};
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="statusbar" id="statusbar">
      <div className="statusbar__left">
        <span className="statusbar__item" id="status-cursor">
          Línea {line}, columna {col}
        </span>
        {selected > 0 && (
          <span className="statusbar__item statusbar__item--selected" id="status-selected">
            {selected} seleccionado(s)
          </span>
        )}
      </div>
      <div className="statusbar__right">
        <span className="statusbar__item" id="status-words">
          {words} palabra{words !== 1 ? 's' : ''}
        </span>
        <span className="statusbar__sep">|</span>
        <span className="statusbar__item" id="status-chars">
          {chars} car.
        </span>
        <span className="statusbar__sep">|</span>
        <span className="statusbar__item" id="status-encoding">
          UTF-8
        </span>
        <span className="statusbar__sep">|</span>
        <span className="statusbar__item" id="status-zoom">
          {zoomPercent}%
        </span>
        <span className="statusbar__sep">|</span>
        <LanguagePicker currentLang={language} onLangChange={onLangChange} />
      </div>
    </div>
  );
}
