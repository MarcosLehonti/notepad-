import { useState, useRef, useEffect } from 'react';
import './MenuBar.css';

const MENUS = {
  archivo: {
    label: 'Archivo',
    items: [
      { id: 'new', label: 'Nuevo', shortcut: 'Ctrl+N' },
      { id: 'new-tab', label: 'Nueva pestaña', shortcut: 'Ctrl+T' },
      { id: 'open', label: 'Abrir...', shortcut: 'Ctrl+O' },
      { id: 'sep1', separator: true },
      { id: 'save', label: 'Guardar', shortcut: 'Ctrl+S' },
      { id: 'save-as', label: 'Guardar como...', shortcut: 'Ctrl+Alt+S' },
      { id: 'save-all', label: 'Guardar todo', shortcut: 'Ctrl+Shift+S' },
      { id: 'sep2', separator: true },
      { id: 'close', label: 'Cerrar', shortcut: 'Ctrl+W' },
      { id: 'close-all', label: 'Cerrar todo' },
      { id: 'sep3', separator: true },
      { id: 'print', label: 'Imprimir...', shortcut: 'Ctrl+P' },
      { id: 'sep4', separator: true },
      { id: 'exit', label: 'Salir', shortcut: 'Alt+F4' },
    ],
  },
  editar: {
    label: 'Editar',
    items: [
      { id: 'undo', label: 'Deshacer', shortcut: 'Ctrl+Z' },
      { id: 'redo', label: 'Rehacer', shortcut: 'Ctrl+Y' },
      { id: 'sep1', separator: true },
      { id: 'cut', label: 'Cortar', shortcut: 'Ctrl+X' },
      { id: 'copy', label: 'Copiar', shortcut: 'Ctrl+C' },
      { id: 'paste', label: 'Pegar', shortcut: 'Ctrl+V' },
      { id: 'delete', label: 'Eliminar', shortcut: 'Supr' },
      { id: 'select-all', label: 'Seleccionar todo', shortcut: 'Ctrl+A' },
      { id: 'sep2', separator: true },
      { id: 'uppercase', label: 'A MAYÚSCULAS', shortcut: 'Ctrl+Shift+U' },
      { id: 'lowercase', label: 'a minúsculas', shortcut: 'Ctrl+U' },
      { id: 'duplicate-line', label: 'Duplicar línea actual', shortcut: 'Ctrl+D' },
      { id: 'sep3', separator: true },
      { id: 'time', label: 'Fecha y hora', shortcut: 'F5' },
    ],
  },
  buscar: {
    label: 'Buscar',
    items: [
      { id: 'find', label: 'Buscar...', shortcut: 'Ctrl+F' },
      { id: 'find-next', label: 'Buscar siguiente', shortcut: 'F3' },
      { id: 'find-prev', label: 'Buscar anterior', shortcut: 'Shift+F3' },
      { id: 'replace', label: 'Reemplazar...', shortcut: 'Ctrl+H' },
      { id: 'goto', label: 'Ir a la línea...', shortcut: 'Ctrl+G' },
    ],
  },
  vista: {
    label: 'Vista',
    items: [
      { id: 'zoom-in', label: 'Acercar zoom', shortcut: 'Ctrl+Num +' },
      { id: 'zoom-out', label: 'Alejar zoom', shortcut: 'Ctrl+Num -' },
      { id: 'zoom-reset', label: 'Restaurar zoom', shortcut: 'Ctrl+Num /' },
      { id: 'sep1', separator: true },
      { id: 'wordwrap', label: 'Ajuste de línea', toggle: true },
      { id: 'statusbar', label: 'Barra de estado', toggle: true },
      { id: 'fullscreen', label: 'Pantalla completa', shortcut: 'F11' },
    ],
  },
  codificacion: {
    label: 'Codificación',
    items: [
      { id: 'enc-utf8', label: 'Codificar en UTF-8' },
      { id: 'enc-utf8-bom', label: 'Codificar en UTF-8-BOM' },
      { id: 'enc-ansi', label: 'Codificar en ANSI' },
      { id: 'enc-ucs2le', label: 'Codificar en UCS-2 LE' },
      { id: 'enc-ucs2be', label: 'Codificar en UCS-2 BE' },
    ],
  },
  lenguaje: {
    label: 'Lenguaje',
    items: [
      { id: 'lang-asm', label: 'Assembly (Ensamblador)' },
      { id: 'lang-c', label: 'C / C++' },
      { id: 'lang-cs', label: 'C#' },
      { id: 'lang-css', label: 'CSS' },
      { id: 'lang-html', label: 'HTML' },
      { id: 'lang-js', label: 'JavaScript' },
      { id: 'lang-json', label: 'JSON' },
      { id: 'lang-md', label: 'Markdown' },
      { id: 'lang-py', label: 'Python' },
      { id: 'lang-sql', label: 'SQL' },
      { id: 'lang-ts', label: 'TypeScript' },
      { id: 'lang-xml', label: 'XML' },
      { id: 'sep1', separator: true },
      { id: 'lang-plain', label: 'Texto plano' },
    ],
  },
  configuracion: {
    label: 'Configuración',
    items: [
      { id: 'font', label: 'Estilo y Fuente...' },
      { id: 'shortcuts', label: 'Configuración de atajos...' },
      { id: 'preferences', label: 'Preferencias...' },
    ],
  },
  herramientas: {
    label: 'Herramientas',
    items: [
      { id: 'md5', label: 'Generar resumen MD5' },
      { id: 'sha256', label: 'Generar resumen SHA-256' },
      { id: 'hex-convert', label: 'Conversor Hexadecimal' },
    ],
  },
  macro: {
    label: 'Macro',
    items: [
      { id: 'macro-start', label: 'Iniciar grabación', shortcut: 'Ctrl+Shift+R' },
      { id: 'macro-stop', label: 'Detener grabación', shortcut: 'Ctrl+Shift+R' },
      { id: 'macro-play', label: 'Reproducir macro', shortcut: 'Ctrl+Shift+P' },
      { id: 'macro-multiple', label: 'Ejecutar macro múltiples veces...' },
    ],
  },
  ejecutar: {
    label: 'Ejecutar',
    items: [
      { id: 'run-cmd', label: 'Ejecutar...', shortcut: 'F5' },
      { id: 'run-browser', label: 'Abrir en navegador' },
    ],
  },
  complementos: {
    label: 'Complementos',
    items: [
      { id: 'plugins-admin', label: 'Gestor de complementos...' },
      { id: 'plugins-open-dir', label: 'Abrir carpeta de complementos' },
    ],
  },
  pestanas: {
    label: 'Pestañas',
    items: [
      { id: 'tab-next', label: 'Pestaña siguiente', shortcut: 'Ctrl+PageDown' },
      { id: 'tab-prev', label: 'Pestaña anterior', shortcut: 'Ctrl+PageUp' },
      { id: 'tab-move-right', label: 'Mover pestaña a la derecha' },
      { id: 'tab-move-left', label: 'Mover pestaña a la izquierda' },
    ],
  },
  ayuda: {
    label: '?',
    items: [
      { id: 'about', label: 'Acerca de Notepad++' },
      { id: 'help', label: 'Ayuda en línea', shortcut: 'F1' },
    ],
  },
};

export default function MenuBar({ onAction, wordWrap, showStatusBar }) {
  const [openMenu, setOpenMenu] = useState(null);
  const barRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleMenuClick = (key) => {
    setOpenMenu(openMenu === key ? null : key);
  };

  const handleItemClick = (id) => {
    setOpenMenu(null);
    onAction(id);
  };

  return (
    <div className="menubar" ref={barRef} role="menubar">
      {Object.entries(MENUS).map(([key, menu]) => (
        <div className="menubar__item" key={key}>
          <button
            className={`menubar__btn ${openMenu === key ? 'menubar__btn--active' : ''}`}
            onClick={() => handleMenuClick(key)}
            onMouseEnter={() => openMenu !== null && setOpenMenu(key)}
            id={`menu-${key}`}
            role="menuitem"
            aria-haspopup="true"
            aria-expanded={openMenu === key}
          >
            {menu.label}
          </button>
          {openMenu === key && (
            <div className="menubar__dropdown" role="menu">
              {menu.items.map((item, idx) =>
                item.separator ? (
                  <div className="menubar__sep" key={`${key}-sep-${idx}`} role="separator" />
                ) : (
                  <button
                    key={item.id}
                    className="menubar__dropdown-item"
                    onClick={() => handleItemClick(item.id)}
                    id={`menu-item-${item.id}`}
                    role="menuitem"
                  >
                    <span className="menubar__dropdown-label">
                      {item.toggle && (
                        <span className="menubar__check">
                          {(item.id === 'wordwrap' && wordWrap) ||
                          (item.id === 'statusbar' && showStatusBar)
                            ? '✓'
                            : ' '}
                        </span>
                      )}
                      {item.label}
                    </span>
                    {item.shortcut && (
                      <span className="menubar__shortcut">{item.shortcut}</span>
                    )}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
