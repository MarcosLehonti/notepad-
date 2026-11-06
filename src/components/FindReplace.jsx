import { useState, useRef, useEffect } from 'react';
import './FindReplace.css';

export default function FindReplace({ visible, mode, onClose, editorRef }) {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [status, setStatus] = useState('');
  const findInputRef = useRef(null);

  useEffect(() => {
    if (visible && findInputRef.current) {
      findInputRef.current.focus();
      findInputRef.current.select();
    }
  }, [visible]);

  const getEditor = () => document.getElementById('main-editor');

  const doFind = (text, startFrom = 0) => {
    const ta = getEditor();
    if (!ta || !text) return false;

    let content = ta.value;
    let query = text;
    if (!matchCase) {
      content = content.toLowerCase();
      query = query.toLowerCase();
    }
    if (wholeWord) {
      query = `\\b${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`;
      const re = new RegExp(query, matchCase ? '' : 'i');
      const sub = ta.value.substring(startFrom);
      const m = re.exec(matchCase ? sub : sub.toLowerCase());
      if (m) {
        const idx = startFrom + m.index;
        ta.focus();
        ta.setSelectionRange(idx, idx + m[0].length);
        setStatus('');
        return idx;
      }
    } else {
      const idx = content.indexOf(query, startFrom);
      if (idx !== -1) {
        ta.focus();
        ta.setSelectionRange(idx, idx + query.length);
        setStatus('');
        return idx;
      }
    }
    setStatus('No se encontró el texto');
    return false;
  };

  const handleFind = () => {
    const ta = getEditor();
    let start = ta ? ta.selectionEnd : 0;
    const result = doFind(findText, start);
    if (result === false) doFind(findText, 0); // wrap around
  };

  const handleReplace = () => {
    const ta = getEditor();
    if (!ta) return;
    const sel = ta.value.substring(ta.selectionStart, ta.selectionEnd);
    const cmp = matchCase ? sel : sel.toLowerCase();
    const cmpFind = matchCase ? findText : findText.toLowerCase();
    if (cmp === cmpFind) {
      const start = ta.selectionStart;
      const newVal = ta.value.substring(0, start) + replaceText + ta.value.substring(ta.selectionEnd);
      ta.value = newVal;
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      doFind(findText, start + replaceText.length);
    } else {
      handleFind();
    }
  };

  const handleReplaceAll = () => {
    const ta = getEditor();
    if (!ta) return;
    const flags = matchCase ? 'g' : 'gi';
    let query = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (wholeWord) query = `\\b${query}\\b`;
    const re = new RegExp(query, flags);
    const before = ta.value;
    ta.value = before.replace(re, replaceText);
    const count = (before.match(re) || []).length;
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    setStatus(count ? `${count} reemplazo(s) realizados` : 'No se encontró el texto');
  };

  if (!visible) return null;

  return (
    <div className="find-replace" id="find-replace-panel" role="dialog" aria-label={mode === 'replace' ? 'Reemplazar' : 'Buscar'}>
      <div className="find-replace__header">
        <span className="find-replace__title">{mode === 'replace' ? 'Buscar y reemplazar' : 'Buscar'}</span>
        <button className="find-replace__close" onClick={onClose} id="btn-close-find">✕</button>
      </div>
      <div className="find-replace__body">
        <div className="find-replace__row">
          <label className="find-replace__label">Buscar</label>
          <input
            ref={findInputRef}
            className="find-replace__input"
            type="text"
            value={findText}
            onChange={e => { setFindText(e.target.value); setStatus(''); }}
            onKeyDown={e => e.key === 'Enter' && handleFind()}
            id="input-find"
            placeholder="Buscar..."
          />
          <button className="find-replace__btn find-replace__btn--primary" onClick={handleFind} id="btn-find-next">
            Buscar siguiente
          </button>
        </div>
        {mode === 'replace' && (
          <div className="find-replace__row">
            <label className="find-replace__label">Reemplazar</label>
            <input
              className="find-replace__input"
              type="text"
              value={replaceText}
              onChange={e => setReplaceText(e.target.value)}
              id="input-replace"
              placeholder="Reemplazar con..."
            />
            <div className="find-replace__btn-group">
              <button className="find-replace__btn" onClick={handleReplace} id="btn-replace">Reemplazar</button>
              <button className="find-replace__btn" onClick={handleReplaceAll} id="btn-replace-all">Reemplazar todo</button>
            </div>
          </div>
        )}
        <div className="find-replace__options">
          <label className="find-replace__check">
            <input type="checkbox" checked={matchCase} onChange={e => setMatchCase(e.target.checked)} id="chk-match-case"/>
            Distinguir mayúsculas
          </label>
          <label className="find-replace__check">
            <input type="checkbox" checked={wholeWord} onChange={e => setWholeWord(e.target.checked)} id="chk-whole-word"/>
            Palabras completas
          </label>
        </div>
        {status && <div className="find-replace__status">{status}</div>}
      </div>
    </div>
  );
}
