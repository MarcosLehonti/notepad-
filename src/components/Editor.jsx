import { useRef, useEffect, useCallback } from 'react';
import './Editor.css';

export default function Editor({ value, onChange, wordWrap, zoom, onCursorChange, font }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const updateCursor = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta || !onCursorChange) return;

    const pos = ta.selectionStart;
    const text = ta.value.substring(0, pos);
    const lines = text.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    const selected = Math.abs(ta.selectionEnd - ta.selectionStart);
    const chars = ta.value.length;
    const words = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0;

    onCursorChange({ line, col, selected, chars, words });
  }, [onCursorChange]);

  const handleChange = (e) => {
    onChange(e.target.value);
    updateCursor();
  };

  const handleKeyDown = (e) => {
    // Tab key inserts spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newVal = ta.value.substring(0, start) + '    ' + ta.value.substring(end);
      onChange(newVal);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 4;
        updateCursor();
      });
    }
  };

  const fontSize = Math.round(15 * zoom);

  return (
    <div className="editor-wrapper">
      <textarea
        ref={textareaRef}
        className="editor"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={updateCursor}
        onClick={updateCursor}
        onSelect={updateCursor}
        spellCheck={false}
        style={{
          whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
          overflowX: wordWrap ? 'hidden' : 'auto',
          fontSize: `${fontSize}px`,
          fontFamily: font || 'Consolas, "Courier New", monospace',
        }}
        id="main-editor"
        aria-label="Editor de texto"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
}
