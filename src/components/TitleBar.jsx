import { useState } from 'react';
import './TitleBar.css';

export default function TitleBar({ title, isModified, theme, onToggleTheme }) {
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <div className="titlebar" data-theme={theme}>
      <div className="titlebar__left">
        <div className="titlebar__icon" title="Notepad++">
          {/* Notepad++ styled Notepad & Pencil SVG Icon */}
          <svg width="17" height="17" viewBox="0 0 32 32" fill="none">
            {/* Notepad sheet with folded corner */}
            <path d="M6 3h14l8 8v17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="#f8fafc" stroke="#334155" strokeWidth="1.5"/>
            <path d="M20 3v8h8" fill="#cbd5e1" stroke="#334155" strokeWidth="1.5"/>
            {/* Notepad top green banner */}
            <path d="M6 3h14v5H6z" fill="#22c55e"/>
            {/* Grid / Code lines on pad */}
            <line x1="8" y1="12" x2="18" y2="12" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="8" y1="16" x2="24" y2="16" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="8" y1="20" x2="20" y2="20" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="8" y1="24" x2="16" y2="24" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
            {/* Yellow Pencil across */}
            <g transform="rotate(-35 20 18)">
              <rect x="12" y="10" width="18" height="5" rx="1" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8"/>
              <rect x="27" y="10" width="3" height="5" fill="#f87171" rx="0.5"/>
              <path d="M12 10l-4 2.5 4 2.5z" fill="#fed7aa" stroke="#d97706" strokeWidth="0.8"/>
              <polygon points="8,12.5 10,11.5 10,13.5" fill="#1e293b"/>
            </g>
          </svg>
        </div>
        <span className="titlebar__title">
          {isModified ? '*' : ''}{title} - Notepad++
        </span>
      </div>

      <div className="titlebar__controls">
        <button
          className="titlebar__btn titlebar__btn--theme"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          id="btn-toggle-theme"
        >
          {theme === 'dark' ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
        <button className="titlebar__btn titlebar__btn--min" title="Minimizar" id="btn-minimize">
          <svg width="10" height="1" viewBox="0 0 10 1"><rect width="10" height="1" fill="currentColor"/></svg>
        </button>
        <button
          className="titlebar__btn titlebar__btn--max"
          title={isMaximized ? 'Restaurar' : 'Maximizar'}
          id="btn-maximize"
          onClick={() => setIsMaximized(!isMaximized)}
        >
          {isMaximized ? (
            <svg width="10" height="10" viewBox="0 0 10 10">
              <rect x="2" y="0" width="8" height="8" rx="0.5" stroke="currentColor" strokeWidth="1" fill="none"/>
              <rect x="0" y="2" width="8" height="8" rx="0.5" stroke="currentColor" strokeWidth="1" fill="var(--bg-titlebar)"/>
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10">
              <rect x="0.5" y="0.5" width="9" height="9" rx="0.5" stroke="currentColor" strokeWidth="1" fill="none"/>
            </svg>
          )}
        </button>
        <button className="titlebar__btn titlebar__btn--close" title="Cerrar" id="btn-close">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" strokeWidth="1.2"/>
            <line x1="10" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
