import { useEffect, useCallback, useRef, useState } from 'react';

/* ═══════════════════════════════════════════════════════
   useEasterEggs — fun hidden interactions
   ═══════════════════════════════════════════════════════
   1. Konami code   → toggle hidden scene (↑↑↓↓←→←→BA)
   2. Double-click   → cycle colour theme
   3. Type "debug"  → toggle stats/debug panel
   ═══════════════════════════════════════════════════════ */

const KONAMI = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

const THEMES = [
  { name: 'cyber',  bg: '#060810', cyan: '#06b6d4', purple: '#a855f7', pink: '#e94560' },
  { name: 'sunset', bg: '#1a0a0e', cyan: '#f59e0b', purple: '#ef4444', pink: '#f97316' },
  { name: 'forest', bg: '#061208', cyan: '#22c55e', purple: '#14b8a6', pink: '#84cc16' },
  { name: 'ocean',  bg: '#060d14', cyan: '#0ea5e9', purple: '#6366f1', pink: '#8b5cf6' },
];

/**
 * useEasterEggs — attach all easter-egg listeners to the window.
 * Returns current state so the caller can render accordingly.
 *
 * @returns {{
 *   konamiActive: boolean,
 *   debugActive: boolean,
 *   themeIndex: number,
 *   themeName: string,
 * }}
 */
export default function useEasterEggs() {
  const [konamiActive, setKonamiActive] = useState(false);
  const [debugActive, setDebugActive] = useState(false);
  const [themeIndex, setThemeIndex] = useState(0);

  /* ── Refs for sequence tracking ───────────────────── */
  const konamiProgress = useRef(0);
  const typedBuffer = useRef('');
  const typedTimer = useRef(null);

  /* ── 1. Konami Code  +  3. Type "debug" ───────────── */
  useEffect(() => {
    const handler = (e) => {
      /* ── Konami ─────────────────────────────────── */
      const expected = KONAMI[konamiProgress.current];
      if (e.key === expected || e.key.toLowerCase() === expected) {
        konamiProgress.current += 1;
        if (konamiProgress.current === KONAMI.length) {
          konamiProgress.current = 0;
          setKonamiActive((prev) => {
            const next = !prev;
            showToast(next ? '🎮 Secret scene unlocked!' : '🎮 Secret scene hidden');
            return next;
          });
        }
      } else {
        konamiProgress.current = 0;
      }

      /* ── Typed "debug" ─────────────────────────── */
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
      )
        return;

      if (e.key.length !== 1) return;

      typedBuffer.current += e.key.toLowerCase();
      clearTimeout(typedTimer.current);
      typedTimer.current = setTimeout(() => {
        typedBuffer.current = '';
      }, 1500);

      if (typedBuffer.current.endsWith('debug')) {
        typedBuffer.current = '';
        setDebugActive((prev) => {
          const next = !prev;
          showToast(next ? '🛠 Debug mode ON' : '🛠 Debug mode OFF');
          return next;
        });
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /* ── 2. Double-click → cycle theme ────────────────── */
  useEffect(() => {
    const handler = (e) => {
      // Only on background — skip interactive elements
      if (
        e.target.closest('button') ||
        e.target.closest('a') ||
        e.target.closest('nav') ||
        e.target.closest('[role="dialog"]')
      )
        return;

      setThemeIndex((prev) => {
        const nextIdx = (prev + 1) % THEMES.length;
        applyTheme(THEMES[nextIdx]);
        showToast(`🎨 Theme: ${THEMES[nextIdx].name}`);
        return nextIdx;
      });
    };

    window.addEventListener('dblclick', handler);
    return () => window.removeEventListener('dblclick', handler);
  }, []);

  return {
    konamiActive,
    debugActive,
    themeIndex,
    themeName: THEMES[themeIndex].name,
  };
}

/* ═══════════════════════════════════════════════════════
   Theme helpers (exported for reuse)
   ═══════════════════════════════════════════════════════ */
export { THEMES };

/** Apply CSS custom-property theme to :root */
function applyTheme(theme) {
  const root = document.documentElement.style;
  root.setProperty('--color-bg-primary', theme.bg);
  root.setProperty('--color-accent-cyan', theme.cyan);
  root.setProperty('--color-accent-purple', theme.purple);
  root.setProperty('--color-accent-pink', theme.pink);
}

/** Show a brief toast notification */
function showToast(message) {
  const existing = document.getElementById('ee-toast');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.id = 'ee-toast';
  el.textContent = message;
  Object.assign(el.style, {
    position: 'fixed',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    padding: '0.75rem 1.5rem',
    background: 'rgba(6, 182, 212, 0.15)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(6, 182, 212, 0.3)',
    borderRadius: '0.75rem',
    color: '#e2e8f0',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '0.8rem',
    letterSpacing: '0.05em',
    zIndex: '9999',
    opacity: '0',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    pointerEvents: 'none',
  });

  document.body.appendChild(el);

  requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => el.remove(), 350);
  }, 2200);
}
