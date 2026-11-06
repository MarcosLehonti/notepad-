import { useState, useRef, useEffect } from 'react';
import './AsmSolver.css';

export default function AsmSolver({ isOpen, onClose, onSolve, isLoading }) {
  const [problem, setProblem] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!problem.trim() || isLoading) return;
    onSolve(problem.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog asm-solver" onClick={e => e.stopPropagation()} id="asm-solver-dialog">
        <div className="dialog__header">
          <div className="asm-solver__title">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5S11.59 1.5 8 1.5z" stroke="#a78bfa" strokeWidth="1.2" fill="none"/>
              <path d="M5 8.5l2.5-4 2.5 4" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="5.8" y1="7.5" x2="9.2" y2="7.5" stroke="#a78bfa" strokeWidth="1" strokeLinecap="round"/>
              <circle cx="7.5" cy="11" r="0.6" fill="#a78bfa"/>
            </svg>
            <span>ASM Solver — Gemini AI</span>
          </div>
          <button className="dialog__close" onClick={onClose}>✕</button>
        </div>
        <div className="dialog__body asm-solver__body">
          <p className="asm-solver__hint">
            Describe el ejercicio de ensamblador y el código se generará en tu nota actual usando el esqueleto base.
          </p>
          <textarea
            ref={textareaRef}
            className="asm-solver__input"
            placeholder="Ej: Escribe un programa que lea dos números enteros del teclado, los sume y muestre el resultado..."
            value={problem}
            onChange={e => setProblem(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={5}
            disabled={isLoading}
            id="asm-solver-input"
          />
          <div className="asm-solver__footer">
            <span className="asm-solver__shortcut">Ctrl+Enter para enviar</span>
            <div className="asm-solver__actions">
              <button
                className="asm-solver__btn asm-solver__btn--cancel"
                onClick={onClose}
                disabled={isLoading}
                id="asm-solver-cancel"
              >
                Cancelar
              </button>
              <button
                className="asm-solver__btn asm-solver__btn--solve"
                onClick={handleSubmit}
                disabled={!problem.trim() || isLoading}
                id="asm-solver-submit"
              >
                {isLoading ? (
                  <>
                    <span className="asm-solver__spinner" />
                    Resolviendo...
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <polygon points="3,2 13,8 3,14" fill="currentColor"/>
                    </svg>
                    Resolver
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
