/* ============================================================
   flows.jsx — Módulo de Flujos (BPMN ligero) como componente
   El diagrama se genera desde datos. Sin lienzo libre.
   ============================================================ */
const FLANES = [
  { key:'client', name:'Cliente',        cap:'externo',       color:'var(--lane-client)', icon:'building' },
  { key:'ceo',    name:'Fundador / CEO',  cap:'a reducir',     color:'var(--lane-ceo)',    icon:'user' },
  { key:'team',   name:'Equipo',          cap:'delegable',     color:'var(--lane-team)',   icon:'users' },
  { key:'auto',   name:'Automatización',  cap:'IA / sistemas', color:'var(--lane-auto)',   icon:'cpu' },
];
const fLaneIdx = (k) => FLANES.findIndex(l => l.key === k);
const fLaneColor = (k) => (FLANES.find(l => l.key === k) || {}).color || '#888';
const FTYPES = { inicio:{label:'Inicio',icon:'play'}, tarea:{label:'Tarea',icon:'task'}, decision:{label:'Decisión',icon:'branch'}, fin:{label:'Fin',icon:'flag'} };
const FLANE_H = 98, FLABEL_W = 132, FSTART_X = 222, FCOL_W = 190, FNODE_W = 152;
const fnodeX = (i) => FSTART_X + i * FCOL_W;
const flaneY = (k) => fLaneIdx(k) * FLANE_H + FLANE_H / 2;
const fuid = () => 's' + Math.random().toString(36).slice(2, 8);

function FlowModule({ flows, onChange, admin }) {
  const ids = Object.keys(flows);
  const [flowId, setFlowId] = useState(ids[0]);
  const [variant, setVariant] = useState('asIs');
  const [selId, setSelId] = useState(null);
  const flow = flows[flowId] || flows[ids[0]];
  const steps = flow[variant] || [];

  // Dependencia: % de pasos en carril CEO. Sin pasos → null (muestra "—"), nunca 0 espurio.
  const dep = (arr) => (arr && arr.length) ? Math.round(100 * arr.filter(s => s.lane === 'ceo').length / arr.length) : null;
  const depAsIs = dep(flow.asIs), depToBe = dep(flow.toBe);
  const delta = (depAsIs != null && depToBe != null) ? depAsIs - depToBe : null;

  const commit = (newSteps) => onChange({ ...flows, [flowId]: { ...flow, [variant]: newSteps } });
  const updateStep = (id, patch) => commit(steps.map(s => s.id === id ? { ...s, ...patch } : s));
  const deleteStep = (id) => { commit(steps.filter(s => s.id !== id)); setSelId(null); };
  const moveStep = (id, dir) => {
    const i = steps.findIndex(s => s.id === id), j = i + dir;
    if (j < 0 || j >= steps.length) return;
    const arr = steps.slice(); [arr[i], arr[j]] = [arr[j], arr[i]]; commit(arr);
  };
  const addStep = (afterIndex) => {
    const ns = { id: fuid(), label: 'Nuevo paso', lane: 'team', type: 'tarea' };
    const arr = steps.slice(); arr.splice(afterIndex == null ? arr.length : afterIndex + 1, 0, ns);
    commit(arr); setSelId(ns.id);
  };

  const sel = steps.find(s => s.id === selId) || null;
  const canvasW = Math.max(780, FSTART_X + steps.length * FCOL_W + 80);
  const canvasH = FLANES.length * FLANE_H;

  const paths = [];
  for (let i = 0; i < steps.length - 1; i++) {
    const a = steps[i], b = steps[i + 1];
    const x1 = fnodeX(i) + FNODE_W / 2 - 4, y1 = flaneY(a.lane);
    const x2 = fnodeX(i + 1) - FNODE_W / 2 + 4, y2 = flaneY(b.lane);
    const dx = Math.max(34, (x2 - x1) * 0.45);
    paths.push({ d: `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`, key: a.id + b.id });
  }

  return (
    <div className="flowmod">
      {/* controls */}
      <div className="fb-controls">
        <div className="fb-select">
          {ids.map(id => <button key={id} className={id === flowId ? 'on' : ''} onClick={() => { setFlowId(id); setSelId(null); }}>{flows[id].name}</button>)}
        </div>
        <div className="fb-variant">
          <button className={'asis' + (variant === 'asIs' ? ' on' : '')} onClick={() => { setVariant('asIs'); setSelId(null); }}>Actual (as-is)</button>
          <button className={'tobe' + (variant === 'toBe' ? ' on' : '')} onClick={() => { setVariant('toBe'); setSelId(null); }}>Optimizado (to-be)</button>
        </div>
      </div>

      {/* dependency meter */}
      <div className="dep-meter">
        <div className="dep-side asis">
          <div className="dl">Dependencia del fundador · Actual</div>
          <div className="dv">{depAsIs == null ? '—' : depAsIs + '%'}</div>
          <div className="ds">de los pasos recaen en el CEO</div>
        </div>
        <div className="dep-arrow">
          <div className="da">{delta == null ? '—' : (delta >= 0 ? '−' + delta : '+' + (-delta)) + ' pts'}</div>
          <div className="dlbl">tras Fase 2</div>
        </div>
        <div className="dep-side tobe">
          <div className="dl">Optimizado · to-be</div>
          <div className="dv">{depToBe == null ? '—' : depToBe + '%'}</div>
          <div className="ds">liberando al fundador del día a día</div>
        </div>
      </div>

      {/* canvas */}
      <div className="canvas-wrap">
        <div className="canvas-scroll">
          <div className="canvas" style={{ width: canvasW, height: canvasH }}
               onClick={(e) => { if (e.target.classList.contains('canvas')) setSelId(null); }}>
            {FLANES.map((l, i) => (
              <div key={l.key} className="lane-row" style={{ top: i * FLANE_H, height: FLANE_H }}>
                <div className="lane-label">
                  <span className="ln"><span className="dot" style={{ background: l.color }}></span>{l.name}</span>
                  <span className="lc">{l.cap}</span>
                </div>
              </div>
            ))}
            <svg className="connectors" width={canvasW} height={canvasH}>
              <defs>
                <marker id="parr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0 1L9 5L0 9z" fill="var(--gold)" opacity="0.55" />
                </marker>
              </defs>
              {paths.map(p => <path key={p.key} d={p.d} fill="none" stroke="var(--gold)" strokeOpacity="0.38" strokeWidth="2" markerEnd="url(#parr)" />)}
            </svg>
            {steps.map((s, i) => {
              const t = FTYPES[s.type] || FTYPES.tarea;
              return (
                <div key={s.id} className={`node l-${s.lane} t-${s.type}${admin ? ' editable' : ''}${selId === s.id ? ' sel' : ''}`}
                     style={{ left: fnodeX(i), top: flaneY(s.lane) }}
                     onClick={(e) => { e.stopPropagation(); if (admin) setSelId(s.id === selId ? null : s.id); }}>
                  <div className="node-inner">
                    <div className="ntop">
                      <span className="nicon" style={{ color: fLaneColor(s.lane) }}><Icon name={t.icon} size={14} /></span>
                      <span className="ntype">{t.label}</span>
                    </div>
                    <div className="nlabel">{s.label}</div>
                    {admin && selId === s.id && (
                      <div className="nctrl">
                        <button title="Mover izquierda" onClick={(e) => { e.stopPropagation(); moveStep(s.id, -1); }}><Icon name="cleft" size={13} /></button>
                        <button title="Mover derecha" onClick={(e) => { e.stopPropagation(); moveStep(s.id, 1); }}><Icon name="cright" size={13} /></button>
                        <button className="del" title="Eliminar" onClick={(e) => { e.stopPropagation(); deleteStep(s.id); }}><Icon name="trash" size={13} /></button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {admin && (
              <div className="add-col" style={{ left: fnodeX(steps.length), top: canvasH / 2 }}>
                <button title="Añadir paso" onClick={(e) => { e.stopPropagation(); addStep(null); }}><Icon name="plus" size={18} /></button>
              </div>
            )}
          </div>
        </div>
      </div>

      {admin && sel && (
        <div className="editor">
          <h4><Icon name="pencil" size={17} /> Editar paso</h4>
          <div className="ed-field">
            <label>Descripción</label>
            <input className="ed-input" value={sel.label} autoFocus onChange={(e) => updateStep(sel.id, { label: e.target.value })} placeholder="Qué ocurre en este paso" />
          </div>
          <div className="ed-field">
            <label>Carril · quién lo ejecuta</label>
            <div className="chips">
              {FLANES.map(l => (
                <button key={l.key} className={'chip' + (sel.lane === l.key ? ' on' : '')} onClick={() => updateStep(sel.id, { lane: l.key })}>
                  <span className="cdot" style={{ background: l.color }}></span>{l.name}
                </button>
              ))}
            </div>
          </div>
          <div className="ed-field">
            <label>Tipo</label>
            <div className="chips">
              {Object.entries(FTYPES).map(([k, t]) => (
                <button key={k} className={'chip' + (sel.type === k ? ' on' : '')} onClick={() => updateStep(sel.id, { type: k })}>
                  <Icon name={t.icon} size={13} /> {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="ed-actions">
            <button className="fb-btn ghost" onClick={() => addStep(steps.indexOf(sel))}><Icon name="insert" size={15} /> Insertar después</button>
            <div style={{ flex: 1 }}></div>
            <button className="fb-btn" onClick={() => setSelId(null)}><Icon name="check" size={15} /> Hecho</button>
          </div>
        </div>
      )}
    </div>
  );
}
window.FlowModule = FlowModule;
