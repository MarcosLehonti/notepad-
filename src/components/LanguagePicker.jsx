import { useState, useRef, useEffect } from 'react';
import './LanguagePicker.css';

export const LANGUAGES = [
  { id: 'plain', label: 'Texto plano', ext: null },
  { id: 'asm', label: 'Assembly', ext: 'asm' },
  { id: 'js', label: 'JavaScript', ext: 'js' },
  { id: 'jsx', label: 'JSX', ext: 'jsx' },
  { id: 'ts', label: 'TypeScript', ext: 'ts' },
  { id: 'tsx', label: 'TSX', ext: 'tsx' },
  { id: 'py', label: 'Python', ext: 'py' },
  { id: 'html', label: 'HTML', ext: 'html' },
  { id: 'css', label: 'CSS', ext: 'css' },
  { id: 'c', label: 'C', ext: 'c' },
  { id: 'cpp', label: 'C++', ext: 'cpp' },
  { id: 'cs', label: 'C#', ext: 'cs' },
  { id: 'sql', label: 'SQL', ext: 'sql' },
  { id: 'json', label: 'JSON', ext: 'json' },
  { id: 'xml', label: 'XML', ext: 'xml' },
  { id: 'md', label: 'Markdown', ext: 'md' },
];

export default function LanguagePicker({ currentLang, onLangChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  const current = LANGUAGES.find(l => l.id === currentLang) || LANGUAGES[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = LANGUAGES.filter(l =>
    l.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="lang-picker" ref={ref}>
      <button
        className="lang-picker__btn"
        onClick={() => { setOpen(o => !o); setSearch(''); }}
        id="btn-lang-picker"
        title="Cambiar lenguaje de resaltado"
      >
        {current.label}
        <span className="lang-picker__arrow">▲</span>
      </button>
      {open && (
        <div className="lang-picker__dropdown" id="lang-picker-dropdown">
          <input
            className="lang-picker__search"
            placeholder="Buscar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
            id="lang-picker-search"
          />
          <div className="lang-picker__list">
            {filtered.map(lang => (
              <button
                key={lang.id}
                className={`lang-picker__item ${currentLang === lang.id ? 'lang-picker__item--active' : ''}`}
                onClick={() => { onLangChange(lang.id); setOpen(false); }}
                id={`lang-opt-${lang.id}`}
              >
                {lang.label}
                {currentLang === lang.id && <span className="lang-picker__check">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
