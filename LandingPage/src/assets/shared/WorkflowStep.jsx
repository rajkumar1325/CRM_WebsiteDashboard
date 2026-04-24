// ─── WorkflowStep.jsx ─────────────────────────────────────────────────────────
// Single step node used in the WorkflowSection chain.
// Props: icon, label, sub, color, index, total

export default function WorkflowStep({ icon, label, sub, color, index, total }) {
  const isLast = index >= total - 1;

  return (
    <div className="flex flex-col items-center relative">
      {/* Icon bubble */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2 shadow-lg"
        style={{
          background: `${color}18`,
          border:     `1px solid ${color}40`,
          color,
        }}
      >
        {icon}
      </div>

      {/* Label */}
      <p className="text-xs font-bold text-white/80 text-center">{label}</p>
      <p className="text-[10px] text-white/35 text-center mt-0.5 max-w-[80px]">{sub}</p>

      {/* Connector arrow to next step */}
      {!isLast && (
        <div
          className="absolute top-6 left-[calc(100%+4px)] w-8 flex items-center"
          style={{ color: `${color}50` }}
        >
          <div
            className="w-full h-px"
            style={{ background: `linear-gradient(90deg, ${color}60, transparent)` }}
          />
          <svg
            width="8" height="8" viewBox="0 0 8 8"
            fill={`${color}60`}
            className="flex-shrink-0 -ml-1"
          >
            <polygon points="0,0 8,4 0,8" />
          </svg>
        </div>
      )}
    </div>
  );
}
