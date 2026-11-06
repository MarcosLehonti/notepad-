import './ToolBar.css';

const tools = [
  {
    id: 'new',
    title: 'Nuevo (Ctrl+N)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <path d="M2.5 1.5h7l3.5 3.5V14a1 1 0 0 1-1 1h-9.5a1 1 0 0 1-1-1V2.5a1 1 0 0 1 1-1z" stroke="#cbd5e1" strokeWidth="1.2" fill="#1e293b"/>
        <path d="M9.5 1.5v3.5H13" stroke="#cbd5e1" strokeWidth="1.2" fill="none"/>
        <circle cx="11.5" cy="11.5" r="3.5" fill="#38bdf8"/>
        <path d="M11.5 9.5v4M9.5 11.5h4" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'open',
    title: 'Abrir (Ctrl+O)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <path d="M1.5 4.5A1 1 0 0 1 2.5 3.5h3.8l1.5 1.5H13.5a1 1 0 0 1 1 1v1.5H1.5v-3z" fill="#f59e0b" stroke="#f59e0b" strokeWidth="0.8"/>
        <path d="M1 7.5h14l-1.5 6.5a1 1 0 0 1-1 .8H3.5a1 1 0 0 1-1-.8L1 7.5z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8"/>
      </svg>
    ),
  },
  {
    id: 'save',
    title: 'Guardar (Ctrl+S)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="1.5" width="13" height="13" rx="1.5" stroke="#38bdf8" strokeWidth="1.2" fill="#0f172a"/>
        <rect x="4" y="1.5" width="8" height="4.5" stroke="#38bdf8" strokeWidth="1" fill="#e2e8f0"/>
        <rect x="9" y="2.5" width="2" height="2.5" fill="#0f172a"/>
        <rect x="3.5" y="8" width="9" height="5.5" rx="0.5" stroke="#38bdf8" strokeWidth="1" fill="#1e293b"/>
      </svg>
    ),
  },
  {
    id: 'save-all',
    title: 'Guardar todo (Ctrl+Shift+S)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <rect x="3.5" y="0.5" width="11" height="11" rx="1" stroke="#38bdf8" strokeWidth="1" fill="#0f172a"/>
        <rect x="1" y="3.5" width="11" height="11" rx="1" stroke="#38bdf8" strokeWidth="1.2" fill="#1e293b"/>
        <rect x="3" y="3.5" width="6.5" height="3.5" fill="#e2e8f0"/>
        <rect x="2.5" y="9" width="8" height="4.5" fill="#0f172a"/>
      </svg>
    ),
  },
  {
    id: 'close',
    title: 'Cerrar actual (Ctrl+W)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="2" width="13" height="12" rx="1" stroke="#cbd5e1" strokeWidth="1.2" fill="#1e293b"/>
        <line x1="5.5" y1="5.5" x2="10.5" y2="10.5" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="10.5" y1="5.5" x2="5.5" y2="10.5" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'close-all',
    title: 'Cerrar todo',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <rect x="3.5" y="1" width="11" height="10.5" rx="1" stroke="#cbd5e1" strokeWidth="1" fill="#0f172a"/>
        <rect x="1" y="3.5" width="11" height="10.5" rx="1" stroke="#cbd5e1" strokeWidth="1.2" fill="#1e293b"/>
        <line x1="4.5" y1="7" x2="8.5" y2="11" stroke="#f43f5e" strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="8.5" y1="7" x2="4.5" y2="11" stroke="#f43f5e" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'print',
    title: 'Imprimir (Ctrl+P)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <rect x="4" y="1.5" width="8" height="4" stroke="#cbd5e1" strokeWidth="1" fill="#e2e8f0"/>
        <path d="M2 5.5h12a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-2v3H4v-3H2a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z" stroke="#cbd5e1" strokeWidth="1.2" fill="#1e293b"/>
        <circle cx="12" cy="8" r="0.8" fill="#22c55e"/>
        <line x1="5.5" y1="12.5" x2="10.5" y2="12.5" stroke="#38bdf8" strokeWidth="1"/>
      </svg>
    ),
  },
  { separator: true },
  {
    id: 'cut',
    title: 'Cortar (Ctrl+X)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <circle cx="4.5" cy="12.5" r="2" stroke="#38bdf8" strokeWidth="1.2"/>
        <circle cx="11.5" cy="12.5" r="2" stroke="#38bdf8" strokeWidth="1.2"/>
        <line x1="4.5" y1="12.5" x2="8" y2="8" stroke="#38bdf8" strokeWidth="1.2"/>
        <line x1="11.5" y1="12.5" x2="8" y2="8" stroke="#38bdf8" strokeWidth="1.2"/>
        <line x1="3" y1="2" x2="13" y2="7" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="13" y1="2" x2="3" y2="7" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'copy',
    title: 'Copiar (Ctrl+C)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <rect x="5.5" y="1.5" width="8" height="10" rx="1" stroke="#38bdf8" strokeWidth="1.2" fill="#1e293b"/>
        <rect x="2.5" y="4.5" width="8" height="10" rx="1" stroke="#38bdf8" strokeWidth="1.2" fill="#0f172a"/>
      </svg>
    ),
  },
  {
    id: 'paste',
    title: 'Pegar (Ctrl+V)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <rect x="4" y="1" width="8" height="13" rx="1" stroke="#cbd5e1" strokeWidth="1" fill="#1e293b"/>
        <rect x="6" y="0.5" width="4" height="2" rx="0.5" fill="#f59e0b" stroke="#d97706" strokeWidth="0.8"/>
        <rect x="2" y="4" width="8.5" height="10.5" rx="1" stroke="#38bdf8" strokeWidth="1.2" fill="#0f172a"/>
        <line x1="3.5" y1="7" x2="8" y2="7" stroke="#38bdf8" strokeWidth="1"/>
        <line x1="3.5" y1="9.5" x2="8" y2="9.5" stroke="#38bdf8" strokeWidth="1"/>
      </svg>
    ),
  },
  { separator: true },
  {
    id: 'undo',
    title: 'Deshacer (Ctrl+Z)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <path d="M3 7.5C3 5 5 3 8 3c2.5 0 4.5 1.5 5 4" stroke="#38bdf8" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
        <polyline points="2,4.5 3,7.5 6,6.5" stroke="#38bdf8" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'redo',
    title: 'Rehacer (Ctrl+Y)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <path d="M13 7.5C13 5 11 3 8 3c-2.5 0-4.5 1.5-5 4" stroke="#38bdf8" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
        <polyline points="14,4.5 13,7.5 10,6.5" stroke="#38bdf8" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  { separator: true },
  {
    id: 'find',
    title: 'Buscar (Ctrl+F)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <circle cx="6.5" cy="6.5" r="4.5" stroke="#38bdf8" strokeWidth="1.4"/>
        <line x1="10" y1="10" x2="14.5" y2="14.5" stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'replace',
    title: 'Reemplazar (Ctrl+H)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <circle cx="6.5" cy="6.5" r="4.5" stroke="#38bdf8" strokeWidth="1.2"/>
        <line x1="10" y1="10" x2="14.5" y2="14.5" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M4.5 5.5A2.5 2.5 0 0 1 8.5 4.5l-0.5 1" stroke="#22c55e" strokeWidth="1" fill="none"/>
        <path d="M8.5 7.5A2.5 2.5 0 0 1 4.5 8.5l0.5-1" stroke="#22c55e" strokeWidth="1" fill="none"/>
      </svg>
    ),
  },
  { separator: true },
  {
    id: 'zoom-in',
    title: 'Acercar zoom (Ctrl+Num +)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <circle cx="6.5" cy="6.5" r="4.5" stroke="#38bdf8" strokeWidth="1.3"/>
        <line x1="10" y1="10" x2="14.5" y2="14.5" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="4.5" y1="6.5" x2="8.5" y2="6.5" stroke="#cbd5e1" strokeWidth="1.2"/>
        <line x1="6.5" y1="4.5" x2="6.5" y2="8.5" stroke="#cbd5e1" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    id: 'zoom-out',
    title: 'Alejar zoom (Ctrl+Num -)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <circle cx="6.5" cy="6.5" r="4.5" stroke="#38bdf8" strokeWidth="1.3"/>
        <line x1="10" y1="10" x2="14.5" y2="14.5" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="4.5" y1="6.5" x2="8.5" y2="6.5" stroke="#cbd5e1" strokeWidth="1.2"/>
      </svg>
    ),
  },
  { separator: true },
  {
    id: 'wordwrap',
    title: 'Ajuste de línea',
    toggle: true,
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <line x1="2" y1="3.5" x2="14" y2="3.5" stroke="#38bdf8" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M2 7.5h9a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2H6" stroke="#38bdf8" strokeWidth="1.3" strokeLinecap="round"/>
        <polyline points="7.5,10 6,11.5 7.5,13" stroke="#38bdf8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="2" y1="11.5" x2="3.5" y2="11.5" stroke="#38bdf8" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'show-all-chars',
    title: 'Mostrar todos los caracteres (¶)',
    toggle: true,
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <path d="M10 2.5H6a3.5 3.5 0 0 0 0 7h2" stroke="#38bdf8" strokeWidth="1.3"/>
        <line x1="8" y1="2.5" x2="8" y2="13.5" stroke="#38bdf8" strokeWidth="1.3"/>
        <line x1="10.5" y1="2.5" x2="10.5" y2="13.5" stroke="#38bdf8" strokeWidth="1.3"/>
      </svg>
    ),
  },
  { separator: true },
  {
    id: 'code-comment',
    title: 'Bloque de comentarios (<>)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="1" stroke="#cbd5e1" strokeWidth="1" fill="#0f172a"/>
        <polyline points="5.5,5 3.5,8 5.5,11" stroke="#38bdf8" strokeWidth="1.2"/>
        <polyline points="10.5,5 12.5,8 10.5,11" stroke="#38bdf8" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    id: 'function-list',
    title: 'Lista de funciones (fx)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <text x="2" y="12" fill="#38bdf8" fontSize="11" fontFamily="serif" fontStyle="italic" fontWeight="bold">fx</text>
      </svg>
    ),
  },
  {
    id: 'doc-map',
    title: 'Mapa del documento',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="1.5" width="13" height="13" rx="1" stroke="#cbd5e1" strokeWidth="1.2" fill="#0f172a"/>
        <line x1="9.5" y1="1.5" x2="9.5" y2="14.5" stroke="#38bdf8" strokeWidth="1"/>
        <line x1="3" y1="4" x2="7.5" y2="4" stroke="#cbd5e1" strokeWidth="1"/>
        <line x1="3" y1="6.5" x2="7.5" y2="6.5" stroke="#cbd5e1" strokeWidth="1"/>
        <line x1="3" y1="9" x2="6.5" y2="9" stroke="#cbd5e1" strokeWidth="1"/>
        <line x1="11" y1="4" x2="13" y2="4" stroke="#38bdf8" strokeWidth="0.8"/>
        <line x1="11" y1="6" x2="13" y2="6" stroke="#38bdf8" strokeWidth="0.8"/>
        <line x1="11" y1="8" x2="12.5" y2="8" stroke="#38bdf8" strokeWidth="0.8"/>
      </svg>
    ),
  },
  { separator: true },
  {
    id: 'macro-start',
    title: 'Iniciar grabación (Ctrl+Shift+R)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="#38bdf8" strokeWidth="1.2"/>
        <circle cx="8" cy="8" r="3.5" fill="#38bdf8"/>
      </svg>
    ),
  },
  {
    id: 'macro-stop',
    title: 'Detener grabación',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="#64748b" strokeWidth="1.2"/>
        <rect x="5.5" y="5.5" width="5" height="5" fill="#64748b"/>
      </svg>
    ),
  },
  {
    id: 'macro-play',
    title: 'Reproducir macro (Ctrl+Shift+P)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <polygon points="5.5,3.5 12.5,8 5.5,12.5" fill="#38bdf8"/>
      </svg>
    ),
  },
  {
    id: 'macro-multiple',
    title: 'Ejecutar macro múltiples veces...',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <polygon points="4,3.5 9,8 4,12.5" fill="#38bdf8"/>
        <polygon points="8.5,3.5 13.5,8 8.5,12.5" fill="#38bdf8"/>
      </svg>
    ),
  },
  { separator: true },
  {
    id: 'asm-solver',
    title: 'ASM Solver — Gemini AI',
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5C4.96 1.5 2.5 3.96 2.5 7c0 1.8.87 3.4 2.2 4.4V13a.5.5 0 0 0 .5.5h5.6a.5.5 0 0 0 .5-.5v-1.6A5.48 5.48 0 0 0 13.5 7c0-3.04-2.46-5.5-5.5-5.5z" stroke="#a78bfa" strokeWidth="1.2" fill="none"/>
        <path d="M6 14.5h4" stroke="#a78bfa" strokeWidth="1" strokeLinecap="round"/>
        <path d="M5.5 6.5c.5-.8 1.3-1.2 2.5-1.2s2 .4 2.5 1.2" stroke="#a78bfa" strokeWidth="1" strokeLinecap="round"/>
        <circle cx="6.5" cy="8" r="0.7" fill="#a78bfa"/>
        <circle cx="9.5" cy="8" r="0.7" fill="#a78bfa"/>
        <path d="M6.5 10c.4.5 1 .7 1.5.7s1.1-.2 1.5-.7" stroke="#a78bfa" strokeWidth="0.8" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function ToolBar({ onAction, wordWrap, showStatusBar }) {
  return (
    <div className="toolbar" role="toolbar">
      {tools.map((tool, idx) => {
        if (tool.separator) {
          return <div className="toolbar__sep" key={`sep-${idx}`} role="separator" />;
        }

        const isActive =
          (tool.id === 'wordwrap' && wordWrap) ||
          (tool.id === 'statusbar' && showStatusBar);

        return (
          <button
            key={tool.id}
            className={`toolbar__btn ${isActive ? 'toolbar__btn--active' : ''}`}
            onClick={() => onAction(tool.id)}
            title={tool.title}
            id={`tool-${tool.id}`}
            aria-label={tool.title}
          >
            {tool.icon}
          </button>
        );
      })}
    </div>
  );
}
