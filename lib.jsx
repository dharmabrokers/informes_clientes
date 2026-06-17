/* ============================================================
   lib.jsx — iconos, helpers y componentes compartidos
   Exporta a window para los demás scripts babel
   ============================================================ */
const { useState, useEffect, useRef, useMemo, useCallback } = React;

const ICONS = {
  dashboard:'<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>',
  branch:'<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
  workflow:'<rect x="3" y="3" width="8" height="8" rx="2"/><path d="M7 11v3a2 2 0 0 0 2 2h4"/><rect x="13" y="13" width="8" height="8" rx="2"/>',
  alertoct:'<path d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  route:'<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
  filesearch:'<path d="M5 3h9l6 6v3M5 3v18h6"/><circle cx="16" cy="17" r="3"/><path d="M21.5 22.5L19 20"/>',
  filetext:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8M8 9h2"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  pencil:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  check:'<path d="M20 6L9 17l-5-5"/>',
  trash:'<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  cleft:'<path d="M15 18l-6-6 6-6"/>', cright:'<path d="M9 18l6-6-6-6"/>',
  cdown:'<polyline points="6 9 12 15 18 9"/>',
  x:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  building:'<path d="M4 21V5l8-3 8 3v16"/><path d="M2 21h20"/><path d="M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01"/>',
  user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  cpu:'<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M19 9h3M19 14h3M2 9h3M2 14h3"/>',
  play:'<polygon points="6 4 20 12 6 20" fill="currentColor" stroke="none"/>',
  task:'<rect x="5" y="6" width="14" height="12" rx="2"/>',
  flag:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
  eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  reset:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  link:'<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
  key:'<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.5 12.5L20 3l1.5 1.5-2 2 1.5 1.5-2 2"/>',
  alert:'<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  bulb:'<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/>',
  clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  trendup:'<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  gauge:'<path d="M12 13l4-4"/><path d="M3.5 18a10 10 0 1 1 17 0"/>',
  bars:'<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
  share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/>',
  banknote:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  insert:'<path d="M12 5v14M5 12h14"/>',
  save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
  megaphone:'<path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  arrowright:'<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
};
function Icon({ name, size = 16, style, className }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={style} dangerouslySetInnerHTML={{ __html: ICONS[name] || '' }} />;
}

/* ---------- format helpers ---------- */
function fmtEur(n) {
  if (!isFinite(n) || n <= 0) return '—';
  if (n >= 1e6) return (n / 1e6).toFixed(2).replace('.', ',') + ' M€';
  if (n >= 1e3) return Math.round(n / 1e3) + ' K€';
  return Math.round(n) + ' €';
}
function fmtEurFull(n) {
  try { return new Intl.NumberFormat('es-ES', { style:'currency', currency:'EUR', maximumFractionDigits:0 }).format(n); }
  catch(e){ return Math.round(n) + ' €'; }
}
const clamp = (n,a,b) => Math.max(a, Math.min(b, n));
function scoreClass(s){ return s >= 70 ? 'c-ok' : s >= 50 ? 'c-warn' : 'c-crit'; }
function scoreBar(s){ return s >= 70 ? 'bg-ok' : s >= 50 ? 'bg-warn' : 'bg-crit'; }
function statusBadge(st){ return st==='optimized'?'ok':st==='warning'?'warn':st==='critical'?'crit':'warn'; }

/* ---------- EditableText: contentEditable que persiste en blur ---------- */
function EditableText({ value, onCommit, admin, tag = 'div', className = '', style, placeholder }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value || '';
    }
  }, [value]);
  const Tag = tag;
  if (!admin) return <Tag className={className} style={style}>{value}</Tag>;
  return (
    <Tag ref={ref} className={`editable on ${className}`} style={style}
      contentEditable suppressContentEditableWarning
      data-ph={placeholder || ''}
      onBlur={(e) => { const t = e.currentTarget.textContent; if (t !== value) onCommit(t); }}
    >{value}</Tag>
  );
}

/* ---------- Valuation engine (compartido panel + resumen) ---------- */
const VAL_FACTOR_KEYS = ['geography','market','size','growth','years','recurrence','concentration','ebitdaQuality','margin','backlog','diversification','supplier'];
/* Respaldos para report.json que no incluyen estas tablas (p.ej. cargados de Gist) */
const SECTOR_RANGES = {
  "Inmobiliario / construcción": [3.5, 5.0],
  "Servicios profesionales":     [4.0, 6.0],
  "Retail / hostelería":         [3.0, 4.5],
  "Industrial / B2B":            [4.5, 6.0],
  "eCommerce / digital":         [4.5, 7.0],
  "SaaS":                        [5.0, 12.0]
};
const GEO_PRESETS = { "España":1.00,"DACH / Alemania":1.15,"Nórdicos":1.12,"Reino Unido":1.08,"Francia":1.05,"Benelux":1.06,"Italia":0.96,"Portugal":0.94,"Europa del Este":0.85,"LATAM":0.80,"EE.UU.":1.20 };
const VAL_METHODOLOGY = "Método de múltiplos de EBITDA. El múltiplo base es una mediana de mercado por sector, ajustada por geografía, momento de ciclo, tamaño, crecimiento, antigüedad, recurrencia y dependencia del fundador. Todas las palancas son editables.";
function computeValuation(v) {
  const f = v.factors || {};
  const nonDep = VAL_FACTOR_KEYS.reduce((p,k)=> p * (f[k] ? f[k].value : 1), v.multipleBase || 0);
  const sc = {};
  ['minimo','realista','objetivo'].forEach(k => {
    const s = (v.scenarios && v.scenarios[k]) || { depFactor: 1 };
    const mult = nonDep * s.depFactor;
    sc[k] = { euros: (v.ebitda||0) * mult, mult, depFactor: s.depFactor, rationale: s.rationale };
  });
  return { nonDep, scenarios: sc };
}

/* ---------- Stepper numérico (admin) ---------- */
function Stepper({ value, step = 0.01, min = 0.1, max = 20, onChange, fmt }) {
  const set = (nv) => onChange(Math.round(clamp(nv, min, max) * 100) / 100);
  const show = fmt ? fmt(value) : value.toFixed(2);
  return (
    <span className="stepper">
      <button onClick={() => set(value - step)} aria-label="menos">−</button>
      <span className="sv">{show}</span>
      <button onClick={() => set(value + step)} aria-label="más">+</button>
    </span>
  );
}

Object.assign(window, { Icon, EditableText, Stepper, computeValuation, fmtEur, fmtEurFull, clamp, scoreClass, scoreBar, statusBadge, SECTOR_RANGES, GEO_PRESETS, VAL_METHODOLOGY });
