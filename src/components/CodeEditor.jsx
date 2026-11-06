import { useEffect, useRef, useCallback } from 'react';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLineGutter,
  drawSelection,
  dropCursor,
  rectangularSelection,
  highlightActiveLine,
} from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import {
  syntaxHighlighting,
  HighlightStyle,
  indentOnInput,
  bracketMatching,
  foldGutter,
  foldKeymap,
  StreamLanguage,
} from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';

import './CodeEditor.css';

// ── Assembly language definition (StreamLanguage) ─────────────────────────────
const assemblyLanguage = StreamLanguage.define({
  name: 'assembly',
  startState: () => ({}),
  token(stream) {
    // Line comments ;
    if (stream.match(/^;.*/)) return 'comment';
    // Strings
    if (stream.match(/^"[^"]*"/)) return 'string';
    if (stream.match(/^'[^']*'/)) return 'string';
    // Numbers: hex, binary suffix, decimal
    if (stream.match(/^(0x[\da-fA-F]+|[01]+[bB]|\d+[hH]|\d+)/)) return 'number';
    // Registers (x86 / x64)
    if (stream.match(/^\b(r(?:ax|bx|cx|dx|si|di|sp|bp|8|9|10|11|12|13|14|15)|e(?:ax|bx|cx|dx|si|di|sp|bp|ip)|[abcd][xhl]|si|di|sp|bp|ip|xmm\d+|ymm\d+|zmm\d+)\b/i)) return 'variableName.special';
    // Directives & Keywords (segment, global, extern, section, etc.)
    if (stream.match(/^\b(segment|section|global|globl|extern|bits|org|use16|use32|use64|align|db|dw|dd|dq|dt|resb|resw|resd|resq|equ|times)\b/i)) return 'keyword';
    // Instructions
    if (stream.match(/^\b(mov|movsx|movzx|push|pop|call|ret|retn|jmp|je|jne|jz|jnz|jg|jge|jl|jle|ja|jae|jb|jbe|jo|jno|js|jns|add|sub|mul|imul|div|idiv|and|or|xor|not|shl|shr|sal|sar|rol|ror|rcl|rcr|lea|cmp|test|inc|dec|nop|int|iret|hlt|syscall|sysret)\b/i)) return 'operatorKeyword';
    // Assembler directives starting with .
    if (stream.match(/^\.(text|data|bss|rodata|global|globl|section|byte|word|long|quad|ascii|asciz|string)\b/i)) return 'definitionKeyword';
    // Labels (identifier followed by colon)
    if (stream.match(/^\w+(?=:)/)) return 'labelName';
    // Skip whitespace
    if (stream.eatSpace()) return null;
    // Advance one character
    stream.next();
    return null;
  },
});

// ── Notepad++ Syntax Highlighting Theme ─────────────────────────────────────────
const notepadDarkHighlightStyle = HighlightStyle.define([
  { tag: t.comment, color: '#7ec699', fontStyle: 'italic' }, // Soft green comments
  { tag: t.keyword, color: '#9cdcfe', fontWeight: 'bold' }, // Blue keywords (global, segment)
  { tag: t.operatorKeyword, color: '#dcdcaa' }, // Instruction keywords (mov, push, pop)
  { tag: t.definitionKeyword, color: '#4ec9b0', fontWeight: 'bold' }, // .data, .bss, .text
  { tag: t.special(t.variableName), color: '#c586c0' }, // Registers (rax, rbp, rsp)
  { tag: t.labelName, color: '#dcdcaa', fontWeight: 'bold' }, // Labels (main:)
  { tag: t.string, color: '#ce9178' }, // Strings
  { tag: t.number, color: '#b5cea8' }, // Numbers
  { tag: t.operator, color: '#d4d4d4' },
  { tag: t.variableName, color: '#9cdcfe' },
]);

const notepadLightHighlightStyle = HighlightStyle.define([
  { tag: t.comment, color: '#008000', fontStyle: 'italic' }, // Green comments
  { tag: t.keyword, color: '#0000ff', fontWeight: 'bold' }, // Blue keywords
  { tag: t.operatorKeyword, color: '#795e26' }, // Instructions
  { tag: t.definitionKeyword, color: '#267f99', fontWeight: 'bold' },
  { tag: t.special(t.variableName), color: '#af00db' },
  { tag: t.labelName, color: '#001080', fontWeight: 'bold' },
  { tag: t.string, color: '#a31515' },
  { tag: t.number, color: '#098658' },
]);

// ── Light theme ────────────────────────────────────────────────────────────────
const notepadLightTheme = EditorView.theme({
  '&': {
    height: '100%',
    backgroundColor: '#ffffff',
    color: '#000000',
  },
  '.cm-content': { caretColor: '#0078d4' },
  '.cm-cursor': { borderLeftColor: '#0078d4', borderLeftWidth: '2px' },
  '&.cm-focused .cm-selectionBackground, ::selection': {
    backgroundColor: 'rgba(0,120,212,0.25) !important',
  },
  '.cm-selectionBackground': { backgroundColor: 'rgba(0,120,212,0.15) !important' },
  '.cm-line': { padding: '0' },
  '.cm-matchingBracket': { backgroundColor: '#cce8ff', outline: 'none' },
  '.cm-searchMatch': { backgroundColor: '#ffdd99' },
  '.cm-searchMatch.cm-searchMatch-selected': { backgroundColor: '#ff9a00' },
  '.cm-scroller': { lineHeight: '1.5', fontFamily: 'Consolas, "Courier New", monospace' },
}, { dark: false });

// ── Dark theme ─────────────────────────────────────────────────────────────────
const notepadDarkTheme = EditorView.theme({
  '&': {
    height: '100%',
    backgroundColor: '#2b2b2b',
    color: '#e0e0e0',
  },
  '.cm-content': { caretColor: '#ffffff' },
  '.cm-cursor': { borderLeftColor: '#ffffff', borderLeftWidth: '2px' },
  '&.cm-focused .cm-selectionBackground, ::selection': {
    backgroundColor: 'rgba(65,132,228,0.4) !important',
  },
  '.cm-selectionBackground': { backgroundColor: 'rgba(65,132,228,0.25) !important' },
  '.cm-line': { padding: '0' },
  '.cm-matchingBracket': { backgroundColor: 'rgba(255,255,255,0.15)', outline: '1px solid #7ec699' },
  '.cm-searchMatch': { backgroundColor: 'rgba(255,200,0,0.3)' },
  '.cm-searchMatch.cm-searchMatch-selected': { backgroundColor: 'rgba(255,150,0,0.6)' },
  '.cm-scroller': { lineHeight: '1.5', fontFamily: 'Consolas, "Courier New", monospace' },
}, { dark: true });

// ── Compartments ───────────────────────────────────────────────────────────────
const themeCompartment    = new Compartment();
const highlightCompartment = new Compartment();
const languageCompartment = new Compartment();
const lineWrapCompartment = new Compartment();
const fontSizeCompartment = new Compartment();

// ── Component ─────────────────────────────────────────────────────────────────
export default function CodeEditor({ value, onChange, theme, wordWrap, zoom, onCursorChange, language }) {
  const containerRef = useRef(null);
  const viewRef      = useRef(null);
  const onChangeRef  = useRef(onChange);
  const onCursorRef  = useRef(onCursorChange);
  const skipSync     = useRef(false);

  useEffect(() => { onChangeRef.current = onChange; },        [onChange]);
  useEffect(() => { onCursorRef.current = onCursorChange; }, [onCursorChange]);

  const updateListener = useCallback(() =>
    EditorView.updateListener.of((update) => {
      if (update.docChanged && !skipSync.current) {
        onChangeRef.current?.(update.state.doc.toString());
      }
      skipSync.current = false;

      const sel  = update.state.selection.main;
      const line = update.state.doc.lineAt(sel.head);
      const text = update.state.doc.toString();
      onCursorRef.current?.({
        line:     line.number,
        col:      sel.head - line.from + 1,
        selected: Math.abs(sel.to - sel.from),
        chars:    update.state.doc.length,
        words:    text.trim() ? text.trim().split(/\s+/).length : 0,
      });
    })
  , []);

  // ── Build editor once ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const fontSize = Math.round(15 * (zoom ?? 1));

    const state = EditorState.create({
      doc: value ?? '',
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        foldGutter(),
        drawSelection(),
        dropCursor(),
        indentOnInput(),
        bracketMatching(),
        rectangularSelection(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          ...searchKeymap,
          ...foldKeymap,
          indentWithTab,
        ]),
        themeCompartment.of(
          theme === 'dark' ? notepadDarkTheme : notepadLightTheme
        ),
        highlightCompartment.of(
          syntaxHighlighting(theme === 'dark' ? notepadDarkHighlightStyle : notepadLightHighlightStyle, { fallback: true })
        ),
        languageCompartment.of(language ? [language] : []),
        lineWrapCompartment.of(wordWrap ? EditorView.lineWrapping : []),
        fontSizeCompartment.of(
          EditorView.theme({ '&': { fontSize: `${fontSize}px` } })
        ),
        updateListener(),
      ],
    });

    const view = new EditorView({ state, parent: containerRef.current });
    viewRef.current = view;

    return () => { view.destroy(); viewRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sync value (tab switch / file open) ───────────────────────────────────
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const cur = view.state.doc.toString();
    if (cur !== value) {
      skipSync.current = true;
      view.dispatch({ changes: { from: 0, to: cur.length, insert: value ?? '' } });
    }
  }, [value]);

  // ── Dynamic reconfiguration ───────────────────────────────────────────────
  useEffect(() => {
    viewRef.current?.dispatch({
      effects: [
        themeCompartment.reconfigure(theme === 'dark' ? notepadDarkTheme : notepadLightTheme),
        highlightCompartment.reconfigure(
          syntaxHighlighting(theme === 'dark' ? notepadDarkHighlightStyle : notepadLightHighlightStyle, { fallback: true })
        ),
      ],
    });
  }, [theme]);

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: languageCompartment.reconfigure(language ? [language] : []),
    });
  }, [language]);

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: lineWrapCompartment.reconfigure(wordWrap ? EditorView.lineWrapping : []),
    });
  }, [wordWrap]);

  useEffect(() => {
    const fontSize = Math.round(15 * (zoom ?? 1));
    viewRef.current?.dispatch({
      effects: fontSizeCompartment.reconfigure(
        EditorView.theme({ '&': { fontSize: `${fontSize}px` } })
      ),
    });
  }, [zoom]);

  return <div ref={containerRef} className="code-editor" id="cm-editor-root" />;
}

export { assemblyLanguage };
