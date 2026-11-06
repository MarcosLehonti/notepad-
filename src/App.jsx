import { useState, useEffect, useCallback, useMemo } from 'react';
import TitleBar from './components/TitleBar';
import MenuBar from './components/MenuBar';
import TabBar from './components/TabBar';
import ToolBar from './components/ToolBar';
import CodeEditor, { assemblyLanguage } from './components/CodeEditor';
import StatusBar from './components/StatusBar';
import AsmSolver from './components/AsmSolver';
import { LANGUAGES } from './components/LanguagePicker';

// Language extension resolver
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { sql } from '@codemirror/lang-sql';
import { json } from '@codemirror/lang-json';
import { xml } from '@codemirror/lang-xml';
import { markdown } from '@codemirror/lang-markdown';

import './App.css';

const FONTS = [
  { label: 'Consolas', value: 'Consolas, "Courier New", monospace' },
  { label: 'Courier New', value: '"Courier New", monospace' },
  { label: 'Cascadia Code', value: '"Cascadia Code", Consolas, monospace' },
  { label: 'Segoe UI', value: '"Segoe UI", sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
];

function getLangExtension(langId) {
  switch (langId) {
    case 'asm':   return assemblyLanguage;
    case 'js':    return javascript({ jsx: false });
    case 'jsx':   return javascript({ jsx: true });
    case 'ts':    return javascript({ typescript: true });
    case 'tsx':   return javascript({ jsx: true, typescript: true });
    case 'py':    return python();
    case 'html':  return html();
    case 'css':   return css();
    case 'c':
    case 'cpp':
    case 'cs':    return cpp();
    case 'sql':   return sql();
    case 'json':  return json();
    case 'xml':   return xml();
    case 'md':    return markdown();
    default:      return null;
  }
}

let tabCounter = 2;
const createTab = (name = null, content = '', langId = 'asm') => {
  tabCounter++;
  return { id: `tab-${tabCounter}`, name: name || `nuevo${tabCounter}`, content, modified: false, fileHandle: null, langId };
};

const SAMPLE_ASM = `;%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
;assemble and link with:
;assemble: --> nasm -f win64 -o P1.o P1.asm -l P1.lst
;link:     --> gcc -o P1 P1.o
;run:      --> P1
;debugger: --> x64dbg P1
;%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
;----------------------------------------

;file: P1.asm (nombre programa)
;registro:
;nombres y apellidos:

global main
extern printf, scanf

segment .data
;aqui se declaran variables inicializadas

segment .bss
;Block Started by Symbol(BSS)

segment .text
main:
    push rbp
    mov rbp, rsp
    sub rsp, 32

    ; limpiar registros al iniciar
    xor rax, rax
    xor rbx, rbx
    xor rcx, rcx
    xor rdx, rdx
    xor rsi, rsi
    xor rdi, rdi
    xor r8, r8
    xor r9, r9
    xor r10, r10
    xor r11, r11
    xor r12, r12
    xor r13, r13
    xor r14, r14
    xor r15, r15

    ; tu codigo aqui

    xor eax, eax
    add rsp, 32
    pop rbp
    ret
`;

const INITIAL_TABS = [
  { id: 'tab-1', name: 'change.log', content: '# Notepad++ Web Edition Change Log\n\n- Added Notepad++ titlebar & icon\n- Added complete menu bar\n- Added toolbar with Notepad++ icons\n- Added tabs with status icons\n- Added line numbers with change history margin bar\n- Added Assembly syntax highlighting\n', modified: false, fileHandle: null, langId: 'md' },
  { id: 'tab-2', name: 'nuevo1', content: SAMPLE_ASM, modified: false, fileHandle: null, langId: 'asm' },
];

export default function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('notepad-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [tabs, setTabs] = useState(INITIAL_TABS);
  const [activeTabId, setActiveTabId] = useState('tab-2');
  const [wordWrap, setWordWrap] = useState(false);
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [zoom, setZoom] = useState(() => parseFloat(localStorage.getItem('notepad-zoom') || '1'));
  const [cursor, setCursor] = useState({ line: 1, col: 1, selected: 0, chars: 0, words: 0 });
  const [font, setFont] = useState(FONTS[0].value);
  const [showFontDialog, setShowFontDialog] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showAsmSolver, setShowAsmSolver] = useState(false);
  const [asmLoading, setAsmLoading] = useState(false);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const handleCursorChange = useCallback((info) => setCursor(info), []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('notepad-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('notepad-zoom', zoom);
  }, [zoom]);

  const updateActiveTab = useCallback((updates) => {
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, ...updates } : t));
  }, [activeTabId]);

  const handleEditorChange = useCallback((value) => {
    updateActiveTab({ content: value, modified: true });
  }, [updateActiveTab]);

  const handleLangChange = useCallback((langId) => {
    updateActiveTab({ langId });
  }, [updateActiveTab]);

  const handleNewTab = useCallback(() => {
    const tab = createTab();
    setTabs(prev => [...prev, tab]);
    setActiveTabId(tab.id);
  }, []);

  const handleCloseTab = useCallback((id) => {
    setTabs(prev => {
      if (prev.length === 1) return prev;
      const idx = prev.findIndex(t => t.id === id);
      const newTabs = prev.filter(t => t.id !== id);
      if (id === activeTabId) {
        setActiveTabId(newTabs[Math.min(idx, newTabs.length - 1)].id);
      }
      return newTabs;
    });
  }, [activeTabId]);

  const fallbackSave = (content, name) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: (name || 'nuevo1') + '.txt' });
    a.click(); URL.revokeObjectURL(a.href);
  };

  const handleSave = useCallback(async () => {
    try {
      if (activeTab.fileHandle) {
        const w = await activeTab.fileHandle.createWritable();
        await w.write(activeTab.content); await w.close();
        updateActiveTab({ modified: false });
      } else { await handleSaveAs(); }
    } catch (e) { if (e.name !== 'AbortError') fallbackSave(activeTab.content, activeTab.name); }
  }, [activeTab]);

  const handleSaveAs = useCallback(async () => {
    try {
      if ('showSaveFilePicker' in window) {
        const handle = await window.showSaveFilePicker({ suggestedName: activeTab.name + '.txt', types: [{ description: 'Archivos', accept: { 'text/plain': ['.txt', '.asm', '.js', '.py', '.html', '.css', '.json'] } }] });
        const w = await handle.createWritable(); await w.write(activeTab.content); await w.close();
        updateActiveTab({ name: handle.name.replace(/\.[^.]+$/, ''), fileHandle: handle, modified: false });
      } else { fallbackSave(activeTab.content, activeTab.name); }
    } catch (e) { if (e.name !== 'AbortError') fallbackSave(activeTab.content, activeTab.name); }
  }, [activeTab]);

  const handleSaveAll = useCallback(async () => {
    for (const t of tabs) {
      if (t.modified) {
        fallbackSave(t.content, t.name);
      }
    }
    setTabs(prev => prev.map(t => ({ ...t, modified: false })));
  }, [tabs]);

  const handleOpen = useCallback(async () => {
    try {
      if ('showOpenFilePicker' in window) {
        const [handle] = await window.showOpenFilePicker({ types: [{ description: 'Archivos', accept: { 'text/*': ['.txt', '.asm', '.s', '.js', '.jsx', '.ts', '.tsx', '.py', '.html', '.css', '.json', '.xml', '.md', '.c', '.cpp', '.h', '.sql', '.csv'] } }] });
        const file = await handle.getFile();
        const text = await file.text();
        const baseName = file.name.replace(/\.[^.]+$/, '');
        const ext = file.name.split('.').pop()?.toLowerCase();
        const langId = LANGUAGES.find(l => l.ext === ext)?.id || 'asm';
        const tab = createTab(baseName, text, langId);
        tab.fileHandle = handle;
        setTabs(prev => [...prev, tab]); setActiveTabId(tab.id);
      } else {
        const input = Object.assign(document.createElement('input'), { type: 'file', accept: '.txt,.asm,.s,.js,.jsx,.ts,.tsx,.py,.html,.css,.json,.xml,.md,.c,.cpp,.h,.sql' });
        input.onchange = async (e) => {
          const file = e.target.files[0]; if (!file) return;
          const text = await file.text();
          const ext = file.name.split('.').pop()?.toLowerCase();
          const langId = LANGUAGES.find(l => l.ext === ext)?.id || 'asm';
          const tab = createTab(file.name.replace(/\.[^.]+$/, ''), text, langId);
          setTabs(prev => [...prev, tab]); setActiveTabId(tab.id);
        };
        input.click();
      }
    } catch (e) { if (e.name !== 'AbortError') console.error(e); }
  }, []);

  const handleAction = useCallback((id) => {
    if (id.startsWith('lang-')) {
      handleLangChange(id.replace('lang-', ''));
      return;
    }

    switch (id) {
      case 'new': case 'new-tab': handleNewTab(); break;
      case 'open': handleOpen(); break;
      case 'save': handleSave(); break;
      case 'save-as': handleSaveAs(); break;
      case 'save-all': handleSaveAll(); break;
      case 'close': handleCloseTab(activeTabId); break;
      case 'close-all': {
        const fresh = createTab('nuevo1');
        setTabs([fresh]);
        setActiveTabId(fresh.id);
        break;
      }
      case 'print': window.print(); break;
      case 'wordwrap': setWordWrap(w => !w); break;
      case 'font': setShowFontDialog(true); break;
      case 'zoom-in': setZoom(z => Math.min(parseFloat((z + 0.1).toFixed(1)), 4)); break;
      case 'zoom-out': setZoom(z => Math.max(parseFloat((z - 0.1).toFixed(1)), 0.3)); break;
      case 'zoom-reset': setZoom(1); break;
      case 'statusbar': setShowStatusBar(s => !s); break;
      case 'about': setShowAbout(true); break;
      case 'fullscreen': {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.();
        } else {
          document.exitFullscreen?.();
        }
        break;
      }
      case 'tab-next': {
        const idx = tabs.findIndex(t => t.id === activeTabId);
        setActiveTabId(tabs[(idx + 1) % tabs.length].id);
        break;
      }
      case 'tab-prev': {
        const idx = tabs.findIndex(t => t.id === activeTabId);
        setActiveTabId(tabs[(idx - 1 + tabs.length) % tabs.length].id);
        break;
      }
      case 'select-all': {
        document.querySelector('.cm-content')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', ctrlKey: true, bubbles: true }));
        break;
      }
      case 'asm-solver': setShowAsmSolver(true); break;
      default: break;
    }
  }, [activeTabId, handleNewTab, handleOpen, handleSave, handleSaveAs, handleSaveAll, handleCloseTab, handleLangChange, tabs]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && (e.key === 'n' || e.key === 't')) { e.preventDefault(); handleNewTab(); }
      if (e.ctrlKey && e.key === 'o') { e.preventDefault(); handleOpen(); }
      if (e.ctrlKey && e.key === 's' && !e.shiftKey) { e.preventDefault(); handleSave(); }
      if (e.ctrlKey && e.key === 'S') { e.preventDefault(); handleSaveAs(); }
      if (e.ctrlKey && e.key === '=') { e.preventDefault(); setZoom(z => Math.min(parseFloat((z + 0.1).toFixed(1)), 4)); }
      if (e.ctrlKey && e.key === '-') { e.preventDefault(); setZoom(z => Math.max(parseFloat((z - 0.1).toFixed(1)), 0.3)); }
      if (e.ctrlKey && e.key === '0') { e.preventDefault(); setZoom(1); }
      if (e.ctrlKey && e.key === 'w') { e.preventDefault(); handleCloseTab(activeTabId); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleNewTab, handleOpen, handleSave, handleSaveAs, handleCloseTab, activeTabId]);

  const solveAsm = useCallback(async (problem) => {
    setAsmLoading(true);
    try {
      // Use the current tab content as skeleton
      const skeleton = activeTab.content || SAMPLE_ASM;

      // Try Vercel endpoint first, then Netlify endpoint
      let res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem, skeleton }),
      });

      if (!res.ok && res.status === 404) {
        // Fallback to Netlify Functions if /api/gemini is 404
        res = await fetch('/.netlify/functions/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ problem, skeleton }),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        alert(`Error: ${data.error || 'Error desconocido'}`);
        return;
      }

      if (data.code) {
        // Replace active tab content with the solved code
        updateActiveTab({ content: data.code, modified: true });
        setShowAsmSolver(false);
      }
    } catch (err) {
      alert(`Error de conexión: ${err.message}`);
    } finally {
      setAsmLoading(false);
    }
  }, [activeTab, updateActiveTab]);

  // ── Inline prompt detection ────────────────────────────────────────────────
  // Detecta si el contenido tiene "; prompt:" y extrae lo que esté estrictamente entre comillas "..."
  const promptInfo = useMemo(() => {
    const content = activeTab?.content || '';
    const MARKER = '; prompt:';
    const idx = content.toLowerCase().indexOf(MARKER.toLowerCase());
    if (idx === -1) return null;

    const afterMarker = content.slice(idx + MARKER.length);
    // Buscar la primera comilla después del marcador
    const quoteRegex = /["“”]/;
    const matchOpen = afterMarker.match(quoteRegex);

    if (!matchOpen) {
      // Hay "; prompt:" pero aún no se abrieron comillas
      return {
        hasMarker: true,
        hasOpeningQuote: false,
        isClosed: false,
        text: '',
      };
    }

    const openQuoteIdx = idx + MARKER.length + matchOpen.index;
    const rest = content.slice(openQuoteIdx + 1);
    const matchClose = rest.match(quoteRegex);

    if (!matchClose) {
      // Se abrió comilla pero aún no se ha cerrado con comilla final
      const rawSoFar = rest;
      const lines = rawSoFar.split('\n').map(l => l.replace(/^[\t ]*;?[\t ]*/, ''));
      const preview = lines.join(' ').trim();
      return {
        hasMarker: true,
        hasOpeningQuote: true,
        isClosed: false,
        text: preview,
      };
    }

    const closeQuoteIdx = openQuoteIdx + 1 + matchClose.index;
    const rawText = content.slice(openQuoteIdx + 1, closeQuoteIdx);

    // Limpiar cada línea: remover posibles ';' de comentarios ASM y espacios iniciales
    const lines = rawText.split('\n').map(l => l.replace(/^[\t ]*;?[\t ]*/, ''));
    const cleanedText = lines.join('\n').trim();

    // Rango a remover del código al enviar: desde el inicio de la línea de "; prompt:" hasta la comilla de cierre
    const prevNewline = content.lastIndexOf('\n', idx);
    const lineStart = prevNewline === -1 ? 0 : prevNewline + 1;
    const isLineStartBlank = content.slice(lineStart, idx).trim() === '';
    const removeStart = isLineStartBlank ? lineStart : idx;

    let removeEnd = closeQuoteIdx + 1;
    if (content[removeEnd] === '\r') removeEnd++;
    if (content[removeEnd] === '\n') removeEnd++;

    return {
      hasMarker: true,
      hasOpeningQuote: true,
      isClosed: true,
      text: cleanedText,
      removeStart,
      removeEnd,
    };
  }, [activeTab]);

  const handleInlinePrompt = useCallback(() => {
    if (!promptInfo || !promptInfo.isClosed || !promptInfo.text || asmLoading) return;
    const content = activeTab?.content || '';
    const cleanedContent = content.slice(0, promptInfo.removeStart) + content.slice(promptInfo.removeEnd);
    updateActiveTab({ content: cleanedContent.trimEnd() + '\n', modified: true });
    solveAsm(promptInfo.text);
  }, [promptInfo, asmLoading, activeTab, updateActiveTab, solveAsm]);

  const langExtension = getLangExtension(activeTab.langId);

  return (
    <div className="app" data-theme={theme}>
      <TitleBar
        title={activeTab.name}
        isModified={activeTab.modified}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      />
      <MenuBar onAction={handleAction} wordWrap={wordWrap} showStatusBar={showStatusBar} />
      <ToolBar onAction={handleAction} wordWrap={wordWrap} showStatusBar={showStatusBar} />
      <TabBar tabs={tabs} activeTab={activeTabId} onTabSelect={setActiveTabId} onTabClose={handleCloseTab} onNewTab={handleNewTab} />
      <div className="app__content">
        <CodeEditor
          key={activeTabId}
          value={activeTab.content}
          onChange={handleEditorChange}
          theme={theme}
          wordWrap={wordWrap}
          zoom={zoom}
          onCursorChange={handleCursorChange}
          language={langExtension}
          font={font}
        />
        {/* Inline Prompt Bar — aparece cuando hay "; prompt:" en el código */}
        {promptInfo && (
          <div className="prompt-bar" data-theme={theme}>
            <div className="prompt-bar__label">
              <span className="prompt-bar__icon">▶</span>
              <span className="prompt-bar__prefix">; prompt:</span>
              {promptInfo.isClosed ? (
                <span className="prompt-bar__text">
                  "{promptInfo.text.replace(/\n/g, ' ').length > 70 
                    ? promptInfo.text.replace(/\n/g, ' ').slice(0, 70) + '…' 
                    : promptInfo.text.replace(/\n/g, ' ')}"
                </span>
              ) : (
                <span className="prompt-bar__text prompt-bar__text--waiting">
                  {promptInfo.hasOpeningQuote
                    ? `"${promptInfo.text.slice(0, 50)}" ➔ (Cierra con " para enviar)`
                    : 'Escribe tu solicitud entre comillas: "tu prompt aquí"'}
                </span>
              )}
            </div>
            <button
              className="prompt-bar__btn"
              onClick={handleInlinePrompt}
              disabled={asmLoading || !promptInfo.isClosed || !promptInfo.text}
              id="inline-prompt-send-btn"
            >
              {asmLoading ? (
                <><span className="prompt-bar__spinner" /> Resolviendo...</>
              ) : !promptInfo.isClosed ? (
                <>Esperando comilla "</>
              ) : (
                <>▶ Enviar Prompt</>
              )}
            </button>
          </div>
        )}
      </div>
      {showStatusBar && (
        <StatusBar
          cursor={cursor}
          zoom={zoom}
          language={activeTab.langId}
          onLangChange={handleLangChange}
        />
      )}

      {/* Font Dialog */}
      {showFontDialog && (
        <div className="dialog-overlay" onClick={() => setShowFontDialog(false)}>
          <div className="dialog" onClick={e => e.stopPropagation()} id="font-dialog">
            <div className="dialog__header">
              <span>Estilo y Fuente</span>
              <button className="dialog__close" onClick={() => setShowFontDialog(false)}>✕</button>
            </div>
            <div className="dialog__body">
              {FONTS.map(f => (
                <button key={f.value} className={`dialog__option ${font === f.value ? 'dialog__option--active' : ''}`}
                  style={{ fontFamily: f.value }}
                  onClick={() => { setFont(f.value); setShowFontDialog(false); }}
                  id={`font-opt-${f.label.toLowerCase().replace(/\s/g, '-')}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* About Dialog */}
      {showAbout && (
        <div className="dialog-overlay" onClick={() => setShowAbout(false)}>
          <div className="dialog" onClick={e => e.stopPropagation()} id="about-dialog">
            <div className="dialog__header">
              <span>Acerca de Notepad++ Web</span>
              <button className="dialog__close" onClick={() => setShowAbout(false)}>✕</button>
            </div>
            <div className="dialog__body dialog__body--about">
              <div className="about__icon">
                <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                  <path d="M6 3h14l8 8v17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="#f8fafc" stroke="#334155" strokeWidth="1.5"/>
                  <path d="M20 3v8h8" fill="#cbd5e1" stroke="#334155" strokeWidth="1.5"/>
                  <path d="M6 3h14v5H6z" fill="#22c55e"/>
                  <line x1="8" y1="12" x2="18" y2="12" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="8" y1="16" x2="24" y2="16" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
                  <g transform="rotate(-35 20 18)">
                    <rect x="12" y="10" width="18" height="5" rx="1" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8"/>
                    <rect x="27" y="10" width="3" height="5" fill="#f87171" rx="0.5"/>
                    <path d="M12 10l-4 2.5 4 2.5z" fill="#fed7aa" stroke="#d97706" strokeWidth="0.8"/>
                  </g>
                </svg>
              </div>
              <div className="about__info">
                <h2>Notepad++ Web Edition</h2>
                <p>Versión 8.6.2 (Dark Mode & Syntax Highlighting)</p>
                <p>Resaltador para Assembly, C/C++, Python, JS y más</p>
                <p style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 11 }}>
                  Inspirado en Notepad++ de Don Ho
                </p>
              </div>
              <button className="dialog__btn-ok" onClick={() => setShowAbout(false)}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ASM Solver Dialog */}
      <AsmSolver
        isOpen={showAsmSolver}
        onClose={() => setShowAsmSolver(false)}
        onSolve={solveAsm}
        isLoading={asmLoading}
      />
    </div>
  );
}
