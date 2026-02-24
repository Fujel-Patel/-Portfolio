import { useRef, useMemo } from 'react';
import usePortfolioStore from '../../store/usePortfolioStore';

/**
 * DebugPanel — floating HUD that shows store state & render info.
 * Toggled by typing "debug" on the keyboard.
 *
 * @param {Object}  props
 * @param {boolean} props.visible
 * @param {string}  props.themeName - current easter-egg theme
 */
export default function DebugPanel({ visible, themeName }) {
  const activeSection = usePortfolioStore((s) => s.activeSection);
  const deviceTier = usePortfolioStore((s) => s.deviceTier);
  const isMobile = usePortfolioStore((s) => s.isMobile);
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);
  const selectedProject = usePortfolioStore((s) => s.selectedProject);

  if (!visible) return null;

  const entries = [
    ['Section', activeSection],
    ['Device Tier', deviceTier],
    ['Mobile', String(isMobile)],
    ['Reduced Motion', String(reducedMotion)],
    ['Project', selectedProject ?? 'none'],
    ['Theme', themeName],
    ['DPR', String(window.devicePixelRatio?.toFixed(2))],
    ['Viewport', `${window.innerWidth}×${window.innerHeight}`],
    ['React', 'v18'],
    ['Build', import.meta.env.MODE],
  ];

  return (
    <div
      className="fixed top-16 right-4 z-[9998] w-56 pointer-events-auto"
      role="complementary"
      aria-label="Debug panel"
    >
      <div className="glass-panel rounded-xl p-3 text-[11px] font-mono leading-relaxed border border-cyan-500/20 shadow-lg">
        <div className="flex items-center gap-1.5 mb-2 text-cyan-400 font-semibold text-xs tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Debug
        </div>
        <div className="space-y-0.5">
          {entries.map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="text-dark-100/50">{label}</span>
              <span className="text-cyan-300/90">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
