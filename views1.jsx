/* ============================================================
   views1.jsx — Resumen ejecutivo · Valoración · Mapa del fundador
   ============================================================ */

/* ---------------- Resumen ejecutivo ---------------- */
function ResumenView({ data, patch, admin }) {
  const ix = data.indices;
  const v = data.valuation;
  const vc = computeValuation(v).scenarios;
  const topBlocker = data.blockers[0];
  const cards = [
    { l:'Índice de autonomía', v:ix.autonomy, suf:'/10', pct:ix.autonomy*10, d:'Qué tan independiente es el negocio del fundador.', icon:'branch' },
    { l:'Preparación para la venta', v:ix.saleReadiness, suf:'/100', pct:ix.saleReadiness, d:'Cómo de listo está para un comprador profesional.', icon:'shield' },
    { l:'Salud operativa', v:ix.optimization, suf:'/100', pct:ix.optimization, d:'Madurez y eficiencia global de las áreas.', icon:'gauge' },
  ];
  return (
    <div>
      <div className="view-head">
        <div className="eb">Fase 1 · Diagnóstico estratégico</div>
        <h2>{data.config.companyName} <em>· resumen ejecutivo</em></h2>
        <p>{data.config.sector} · {data.config.location} · desde {data.config.founded}</p>
      </div>

      <div className="grid g3" style={{marginBottom:'1.2rem'}}>
        {cards.map((c,i) => (
          <div className="statcard" key={i}>
            <div className="sl"><Icon name={c.icon} size={14}/> {c.l}</div>
            <div className={'sv ' + scoreClass(c.pct)}>{c.v}<small>{c.suf}</small></div>
            <div className="bar"><i className={scoreBar(c.pct)} style={{width:c.pct+'%'}}></i></div>
            <div className="sd">{c.d}</div>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-h"><Icon name="bulb" size={18}/> Tesis de valoración</div>
        <h3 style={{fontFamily:'Oswald',fontSize:'1.3rem',color:'#fff',margin:'0 0 1rem'}}>
          <EditableText tag="span" admin={admin} value={data.thesis.headline}
            onCommit={(t)=>patch(d=>{d.thesis.headline=t;})} />
        </h3>
        {data.thesis.paragraphs.map((p,i) => (
          <EditableText key={i} tag="p" admin={admin} value={p} className="muted"
            style={{fontSize:'.97rem',lineHeight:1.75,marginBottom:'.9rem'}}
            onCommit={(t)=>patch(d=>{d.thesis.paragraphs[i]=t;})} />
        ))}
      </div>

      <div className="grid g2" style={{marginTop:'1.2rem'}}>
        <div className="panel">
          <div className="panel-h"><Icon name="target" size={18}/> Valoración orientativa</div>
          <div className="vrow"><span>Mínimo viable</span><span>{fmtEur(vc.minimo.euros)}</span></div>
          <div className="vrow"><span>Realista (hoy)</span><span className="c-gold" style={{fontSize:'1.1rem'}}>{fmtEur(vc.realista.euros)}</span></div>
          <div className="vrow"><span>Objetivo (tras 90 días)</span><span>{fmtEur(vc.objetivo.euros)}</span></div>
          <p className="tiny muted" style={{marginTop:'.8rem'}}>Potencial sobre la mesa: <b className="c-gold">{fmtEur(vc.objetivo.euros - vc.realista.euros)}</b> al ejecutar la hoja de ruta.</p>
        </div>
        <div className="panel">
          <div className="panel-h"><Icon name="alertoct" size={18}/> Bloqueo #1</div>
          <h4 style={{fontFamily:'Oswald',fontSize:'1.15rem',color:'#fff',margin:'0 0 .4rem'}}>{topBlocker.title}</h4>
          <p className="tiny muted" style={{lineHeight:1.6}}>{topBlocker.description.slice(0,180)}…</p>
          <p className="tiny" style={{marginTop:'.7rem'}}>Coste de inacción: <b className="c-crit">{fmtEur(topBlocker.coiPerQuarter)}/trimestre</b></p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Valoración · 3 escenarios ---------------- */
function ValuationView({ data, patch, admin }) {
  const v = data.valuation;
  const [showRef, setShowRef] = useState(false);
  const comp = computeValuation(v);
  const sc = comp.scenarios;
  const lo = sc.minimo.euros, hi = sc.objetivo.euros, span = hi - lo || 1;
  const pinAt = (e) => clamp(((e - lo) / span) * 100, 4, 96);
  const order = [['minimo','Mínimo viable',false],['realista','Realista',true],['objetivo','Objetivo',false]];

  // mutadores
  const setFactor = (k, val) => patch(d => { d.valuation.factors[k].value = val; });
  const setEbitda = (n) => patch(d => { d.valuation.ebitda = n; });
  const setBase = (n) => patch(d => { d.valuation.multipleBase = n; });
  const setDep = (k, val) => patch(d => { d.valuation.scenarios[k].depFactor = val; });
  const pickSector = (name) => patch(d => {
    d.valuation.sector = name;
    const r = d.valuation.sectorRanges[name];
    if (r) d.valuation.multipleBase = Math.round(((r[0]+r[1])/2) * 100) / 100;
  });
  const pickGeo = (name) => patch(d => {
    d.valuation.geography = name;
    const g = d.valuation.geoPresets[name];
    if (g != null) d.valuation.factors.geography.value = g;
  });
  const range = (v.sectorRanges && v.sectorRanges[v.sector]) || null;

  return (
    <div>
      <div className="view-head">
        <div className="eb">Entregable · valoración</div>
        <h2>Cuánto vale <em>hoy</em> — y cuánto podría valer.</h2>
        <p>Tres escenarios con la metodología explícita de Dharma. El múltiplo no es fijo: es una mediana de mercado que ajustamos por geografía, ciclo, tamaño, calidad de ingresos y dependencia del fundador.{admin && <span> En modo admin, <b style={{color:'#fff'}}>cada palanca es editable</b> y todo se recalcula en vivo.</span>}</p>
      </div>

      <div className="val-scen">
        {order.map(([k,label,real]) => (
          <div className={'scen' + (real?' real':'')} key={k}>
            {real && <span className="badge ok tagm">Hoy</span>}
            <div className="st">{label}</div>
            <div className="sval">{fmtEur(sc[k].euros)}</div>
            <p>{sc[k].rationale}</p>
          </div>
        ))}
      </div>

      {/* range track */}
      <div className="panel" style={{marginTop:'1.2rem'}}>
        <div className="val-track">
          <div className="val-line"></div>
          {order.map(([k,label,real]) => (
            <div className="val-pin" key={k} style={{left:pinAt(sc[k].euros)+'%'}}>
              <div className="dot" style={{background: k==='minimo'?'var(--crit)':k==='realista'?'var(--gold)':'var(--ok)'}}></div>
              <div className="pl">{fmtEur(sc[k].euros)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ENGINE */}
      <div className="panel veng" style={{marginTop:'1.2rem'}}>
        <div className="panel-h"><Icon name="sliders" size={18}/> Motor de valoración{admin && <span className="veng-hint">editable</span>}</div>

        <div className="veng-selects">
          <div className="vs-field">
            <label>Sector</label>
            {admin
              ? <select className="vsel" value={v.sector} onChange={e=>pickSector(e.target.value)}>{Object.keys(v.sectorRanges).map(s=><option key={s} value={s}>{s}</option>)}</select>
              : <div className="vs-val">{v.sector}</div>}
            {range && <span className="vs-range">mercado {range[0].toFixed(1)}–{range[1].toFixed(1)}×</span>}
          </div>
          <div className="vs-field">
            <label>Geografía</label>
            {admin
              ? <select className="vsel" value={v.geography} onChange={e=>pickGeo(e.target.value)}>{Object.keys(v.geoPresets).map(g=><option key={g} value={g}>{g}</option>)}</select>
              : <div className="vs-val">{v.geography}</div>}
          </div>
        </div>

        <div className="veng-rows">
          <div className="vfrow">
            <div className="vfl"><b>EBITDA normalizado</b>{admin && <span>{v.ebitdaNote}</span>}</div>
            <div className="vfc">{admin
              ? <EditableText tag="span" admin={admin} value={String(v.ebitda)} className="vnum"
                  onCommit={(t)=>{const n=parseInt(String(t).replace(/\D/g,''),10); if(isFinite(n)&&n>0) setEbitda(n);}} />
              : <b>{fmtEur(v.ebitda)}</b>}</div>
          </div>
          <div className="vfrow">
            <div className="vfl"><b>Múltiplo base sector</b>{admin && <span>Mediana del sector{range?` (${range[0].toFixed(1)}–${range[1].toFixed(1)}×)`:''}. Ajústalo según geografía y momento de mercado.</span>}</div>
            <div className="vfc">{admin
              ? <Stepper value={v.multipleBase} step={0.1} min={1} max={20} onChange={setBase} fmt={n=>n.toFixed(2)+'×'} />
              : <b>{v.multipleBase.toFixed(2)}×</b>}</div>
          </div>
          {['geography','market','size','growth','years','recurrence','concentration','ebitdaQuality','margin','backlog','diversification','supplier'].map(k=>{
            const f=v.factors[k]; if(!f) return null;
            return (
              <div className="vfrow" key={k}>
                <div className="vfl"><b>{f.label}</b>{admin && <span>{f.note}</span>}</div>
                <div className="vfc">{admin
                  ? <Stepper value={f.value} step={0.01} min={0.4} max={2} onChange={(val)=>setFactor(k,val)} fmt={n=>'×'+n.toFixed(2)} />
                  : <b className={f.value>=1?'c-ok':'c-warn'}>×{f.value.toFixed(2)}</b>}</div>
              </div>
            );
          })}
        </div>

        <div className="veng-eff">
          <span>Múltiplo efectivo · realista <em>(base × ajustes × dependencia media)</em></span>
          <b>{sc.realista.mult.toFixed(2)}×</b>
        </div>
      </div>

      <div className="grid g2" style={{marginTop:'1.2rem'}}>
        <div className="panel">
          <div className="panel-h"><Icon name="branch" size={18}/> La palanca: dependencia</div>
          {[['minimo','Mínimo · dependencia alta'],['realista','Realista · dependencia media'],['objetivo','Objetivo · dependencia baja']].map(([k,lbl])=>(
            <div className="vrow" key={k}><span>{lbl}</span><span>{admin
              ? <Stepper value={v.scenarios[k].depFactor} step={0.01} min={0.3} max={1.2} onChange={(val)=>setDep(k,val)} fmt={n=>'×'+n.toFixed(2)} />
              : '×'+v.scenarios[k].depFactor.toFixed(2)}</span></div>
          ))}
          <div className="method" style={{marginTop:'1rem'}}>
            <code>Valoración = EBITDA × Múltiplo base × Ajustes × Dependencia</code><br/>
            Reducir la dependencia de alta a baja añade <b className="c-gold">{fmtEur(sc.objetivo.euros - sc.realista.euros)}</b> de valor — sin tocar la facturación.
          </div>
        </div>
        <div className="panel">
          <div className="panel-h"><Icon name="bars" size={18}/> Múltiplos de mercado por sector</div>
          <p className="tiny muted" style={{margin:'0 0 .7rem'}}>No son fijos: son una mediana que varía por geografía, tamaño y ciclo. Rango de referencia (mediana empresa europea, últimos 3 años):</p>
          {Object.entries(v.sectorRanges).map(([s,r])=>(
            <div className="vrow" key={s}><span style={{color: s===v.sector?'var(--gold)':undefined, fontWeight: s===v.sector?600:400}}>{s}</span><span>{r[0].toFixed(1)}–{r[1].toFixed(1)}×</span></div>
          ))}
          <p className="tiny muted" style={{marginTop:'.7rem'}}>{v.methodology}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Mapa del fundador ---------------- */
function FounderMapView({ data, patch, admin }) {
  const f = data.founder;
  const [viz, setViz] = useState('bars');
  const maxH = Math.max(...f.byArea.map(a => a.hours));
  const total = f.byArea.reduce((s,a)=>s+a.hours,0);

  return (
    <div>
      <div className="view-head">
        <div className="eb">Entregable · dependencia del fundador</div>
        <h2>Dónde se va el tiempo <em>del dueño</em>.</h2>
        <p>La cifra que descuentan los compradores. {f.hoursPerWeek} h/semana del CEO siguen atadas a la operativa — índice de dependencia {f.dependencyScore}/10.</p>
      </div>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1rem',flexWrap:'wrap',marginBottom:'1.2rem'}}>
        <div className="fm-toggle">
          <button className={viz==='bars'?'on':''} onClick={()=>setViz('bars')}><Icon name="bars" size={14}/> Ranking</button>
          <button className={viz==='gauge'?'on':''} onClick={()=>setViz('gauge')}><Icon name="gauge" size={14}/> Índice</button>
          <button className={viz==='graph'?'on':''} onClick={()=>setViz('graph')}><Icon name="share" size={14}/> Universo 3D</button>
        </div>
        <div className="tiny muted">{total} h/semana mapeadas en 5 áreas</div>
      </div>

      <div className="panel">
        {viz==='bars' && (
          <div>
            {f.byArea.slice().sort((a,b)=>b.hours-a.hours).map((a,i)=>(
              <div key={i}>
                <div className="fm-bar">
                  <span className="fa">{a.area}</span>
                  <span className="ft"><i style={{width:(a.hours/maxH*100)+'%'}}></i></span>
                  <span className="fh">{a.hours}<small> h</small></span>
                </div>
                <div className="fm-note">{a.note} <span className={'badge '+(a.criticality==='alta'?'crit':a.criticality==='media'?'warn':'low')} style={{marginLeft:'.4rem'}}>{a.criticality}</span></div>
              </div>
            ))}
          </div>
        )}

        {viz==='gauge' && <FounderGauge score={f.dependencyScore} hours={f.hoursPerWeek} />}

        {viz==='graph' && <FounderUniverse3D founder={f} patch={patch} admin={admin} />}
      </div>

      <div className="panel" style={{marginTop:'1.2rem'}}>
        <div className="panel-h"><Icon name="link" size={18}/> Relaciones críticas no documentadas</div>
        <p className="tiny muted" style={{margin:'0 0 .4rem'}}>Lo que se va con el fundador si se va. Lo primero que blinda un comprador.</p>
        {f.undocumentedRelationships.map((r,i)=>(
          <div className="rel-item" key={i}><Icon name="key" size={17}/>
            <EditableText tag="p" admin={admin} value={r} onCommit={(t)=>patch(d=>{d.founder.undocumentedRelationships[i]=t;})} />
          </div>
        ))}
      </div>
    </div>
  );
}

function FounderGauge({ score, hours }) {
  const pct = score/10;                       // 0..1
  const ang = -90 + pct*180;                  // semicircle
  const R=120, CX=150, CY=150, sw=22;
  const arc = (frac) => {
    const a0 = Math.PI, a1 = Math.PI*(1-frac);
    const x0=CX+R*Math.cos(a0), y0=CY+R*Math.sin(a0)*-1;
    const x1=CX+R*Math.cos(a1), y1=CY+R*Math.sin(a1)*-1;
    return `M ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1}`;
  };
  const col = score>=7?'var(--crit)':score>=4?'var(--warn)':'var(--ok)';
  return (
    <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:'1.5rem',alignItems:'center'}} className="fm-gauge-wrap">
      <svg width="300" height="180" viewBox="0 0 300 180">
        <path d={arc(1)} fill="none" stroke="var(--dark)" strokeWidth={sw} strokeLinecap="round"/>
        <path d={arc(pct)} fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round"/>
        <text x="150" y="135" textAnchor="middle" fontFamily="Oswald" fontWeight="800" fontSize="46" fill={col}>{score}</text>
        <text x="150" y="160" textAnchor="middle" fontFamily="Oswald" fontSize="13" fill="#888" letterSpacing="2">/10 DEPENDENCIA</text>
      </svg>
      <div>
        <div className="statcard" style={{marginBottom:'.8rem'}}>
          <div className="sl"><Icon name="clock" size={14}/> Horas del CEO / semana</div>
          <div className="sv c-crit">{hours}<small> h</small></div>
          <div className="sd">Tiempo del dueño atado a la operativa diaria.</div>
        </div>
        <p className="tiny muted">Un índice ≥ 7 indica alta dependencia: el negocio aún no funciona sin el fundador. El objetivo de la hoja de ruta es bajarlo por debajo de 4.</p>
      </div>
    </div>
  );
}

function FounderUniverse2D({ founder }) {
  const areas = founder.byArea;
  const maxH = Math.max(...areas.map(a=>a.hours));
  const W=820, H=680, CX=410, CY=340, RA=150, RC=122;
  const colFor=(d)=> d==='alta'?'var(--lane-ceo)': d==='media'?'var(--warn)':'var(--lane-team)';
  const n=areas.length;
  const links=[], nodes=[], labels=[], areaLabels=[];
  let depCount=0, critCount=0;

  areas.forEach((a,i)=>{
    const ang=-Math.PI/2 + (i/n)*Math.PI*2;
    const ax=CX+RA*Math.cos(ang), ay=CY+RA*Math.sin(ang);
    const ar=15+(a.hours/maxH)*13;
    links.push({k:'a'+i,x1:CX,y1:CY,x2:ax,y2:ay,c:colFor(a.criticality),w:2+(a.hours/maxH)*7,o:0.55});
    nodes.push({k:'an'+i,x:ax,y:ay,r:ar,c:colFor(a.criticality),area:true,hours:a.hours});
    // area label inward (toward center)
    const alr=RA-ar-11, alx=CX+alr*Math.cos(ang), aly=CY+alr*Math.sin(ang);
    areaLabels.push({k:'al'+i,x:alx,y:aly+4,t:a.area});
    const kids=a.nodes||[]; const m=kids.length;
    kids.forEach((k,j)=>{
      depCount++; if(k.critical) critCount++;
      const kang=ang + (j-(m-1)/2)*0.30;
      const kx=CX+(RA+RC)*Math.cos(kang), ky=CY+(RA+RC)*Math.sin(kang);
      const kr= k.dep==='alta'?9 : k.dep==='media'?7.5 : 6.5;
      links.push({k:'k'+i+j,x1:ax,y1:ay,x2:kx,y2:ky,c:colFor(k.dep),w:1.5,o:0.4});
      if(k.critical) links.push({k:'c'+i+j,x1:kx,y1:ky,x2:CX,y2:CY,c:'var(--lane-ceo)',w:1.3,o:0.55,dash:true});
      nodes.push({k:'kn'+i+j,x:kx,y:ky,r:kr,c:colFor(k.dep),critical:k.critical});
      const lr=RA+RC+kr+9, lx=CX+lr*Math.cos(kang), ly=CY+lr*Math.sin(kang);
      const anchor = Math.cos(kang)>0.25?'start' : Math.cos(kang)<-0.25?'end':'middle';
      labels.push({k:'kl'+i+j,x:lx,y:ly+3,t:k.label,anchor,crit:k.critical});
    });
  });

  return (
    <div>
      <div style={{overflowX:'auto'}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{maxWidth:'100%',display:'block',margin:'0 auto'}}>
          {links.map(l=>(
            <line key={l.k} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.c} strokeOpacity={l.o} strokeWidth={l.w}
              strokeDasharray={l.dash?'4 4':undefined} strokeLinecap="round"/>
          ))}
          {labels.map(l=>(
            <text key={l.k} x={l.x} y={l.y} textAnchor={l.anchor} fontFamily="Poppins" fontSize="8.6"
              fill={l.crit?'#ff9a9a':'#a8a39a'}>{l.t}</text>
          ))}
          {nodes.map(nd=> nd.area ? (
            <g key={nd.k}>
              <circle cx={nd.x} cy={nd.y} r={nd.r} fill={nd.c} fillOpacity="0.16" stroke={nd.c} strokeWidth="1.6"/>
              <text x={nd.x} y={nd.y+4} textAnchor="middle" fontFamily="Oswald" fontWeight="700" fontSize="11" fill="#fff">{nd.hours}h</text>
            </g>
          ) : (
            <circle key={nd.k} cx={nd.x} cy={nd.y} r={nd.r} fill={nd.c} fillOpacity={nd.critical?0.28:0.18}
              stroke={nd.c} strokeWidth={nd.critical?2:1.3} strokeDasharray={nd.critical?'3 3':undefined}/>
          ))}
          {areaLabels.map(l=>(
            <text key={l.k} x={l.x} y={l.y} textAnchor="middle" fontFamily="Oswald" fontWeight="700" fontSize="12.5" fill="#fff">{l.t}</text>
          ))}
          <circle cx={CX} cy={CY} r="36" fill="rgba(239,68,68,0.16)" stroke="var(--lane-ceo)" strokeWidth="2.5"/>
          <text x={CX} y={CY-2} textAnchor="middle" fontFamily="Oswald" fontWeight="800" fontSize="15" fill="#fff">CEO</text>
          <text x={CX} y={CY+14} textAnchor="middle" fontFamily="Poppins" fontSize="9" fill="#ff8585">fundador</text>
        </svg>
      </div>
      <div className="uni-legend">
        <span><i style={{background:'var(--lane-ceo)'}}></i> Alta dependencia</span>
        <span><i style={{background:'var(--warn)'}}></i> Media</span>
        <span><i style={{background:'var(--lane-team)'}}></i> Baja / delegable</span>
        <span><i className="dash"></i> Relación crítica no documentada</span>
        <span className="uni-count">{depCount} dependencias · {critCount} críticas</span>
      </div>
    </div>
  );
}

/* ---------- Build hierarchical graph from founder data ---------- */
function buildFounderGraph(founder) {
  const nodes = [], links = [];
  nodes.push({ id:'ceo', label:'CEO / Fundador', level:0, dep:'alta', kind:'person',
    spec:`${founder.hoursPerWeek} h/semana atadas a la operativa. Índice de dependencia ${founder.dependencyScore}/10. Todo lo crítico pasa por aquí.`, parent:null, hasChildren:true });
  (founder.byArea||[]).forEach((a,i)=>{
    const aid='a'+i;
    nodes.push({ id:aid, label:a.area, level:1, dep:a.criticality, kind:'area', spec:a.note, hours:a.hours, parent:'ceo', hasChildren:(a.nodes||[]).length>0 });
    links.push({ source:'ceo', target:aid });
    (a.nodes||[]).forEach((nd,j)=>{
      const nid='n'+i+'_'+j; const kids=nd.children||[];
      nodes.push({ id:nid, label:nd.label, level:2, dep:nd.dep, critical:!!nd.critical, kind:nd.kind, spec:nd.spec, parent:aid, hasChildren:kids.length>0 });
      links.push({ source:aid, target:nid });
      if(nd.critical) links.push({ source:nid, target:'ceo', critical:true });
      kids.forEach((c,k)=>{
        const cid='c'+i+'_'+j+'_'+k;
        nodes.push({ id:cid, label:c.label, level:3, dep:c.dep, kind:c.kind, spec:c.spec, parent:nid, hasChildren:false });
        links.push({ source:nid, target:cid });
      });
    });
  });
  return { nodes, links };
}

const KIND_LABEL = { area:'Área', process:'Proceso', person:'Persona', system:'Sistema', external:'Relación externa' };
const DEP_BADGE = { alta:'crit', media:'warn', baja:'low' };

function FounderUniverse3D({ founder, patch, admin }) {
  const wrapRef = useRef(null);
  const graphRef = useRef(null);
  const collapsedRef = useRef(new Set());
  const objFnRef = useRef(null);
  const model = useMemo(()=>buildFounderGraph(founder), [founder]);
  const [sel, setSel] = useState(null);
  const [collapsed, setCollapsed] = useState(()=>new Set());
  const [auto, setAuto] = useState(true);
  const libs = (typeof window!=='undefined') && window.ForceGraph3D && window.SpriteText;

  const parentOf = useMemo(()=>{ const p={}; model.nodes.forEach(n=>p[n.id]=n.parent); return p; }, [model]);

  // default: hide level-3 (collapse level-2 nodes that have children)
  useEffect(()=>{ const c=new Set(); model.nodes.forEach(n=>{ if(n.level===2 && n.hasChildren) c.add(n.id); }); setCollapsed(c); }, [model]);
  useEffect(()=>{ collapsedRef.current = collapsed; }, [collapsed]);

  const visibleData = () => {
    const vis = model.nodes.filter(n=>{ let p=n.parent; while(p){ if(collapsedRef.current.has(p)) return false; p=parentOf[p]; } return true; });
    const ids = new Set(vis.map(n=>n.id));
    const idOf = (x)=> (x && typeof x==='object') ? x.id : x;
    const links = model.links.filter(l=> ids.has(idOf(l.source)) && ids.has(idOf(l.target)))
      .map(l=>({ source:idOf(l.source), target:idOf(l.target), critical:l.critical }));
    return { nodes:vis, links };
  };

  // init once
  useEffect(()=>{
    if(!libs || !wrapRef.current) return;
    const el = wrapRef.current;
    const objFn = (n)=>{
      const hidden = n.hasChildren && collapsedRef.current.has(n.id);
      const s = new window.SpriteText((hidden?'+ ':'')+n.label);
      s.color = n.level<=1 ? '#ffffff' : '#d6d2c8';
      s.fontFace = 'Poppins, Arial, sans-serif';
      s.fontWeight = n.level<=1 ? '700' : '400';
      s.textHeight = n.level===0?7 : n.level===1?5.5 : n.level===2?4 : 3.2;
      s.position.set(0, (n.level===0?14 : n.level===1?9 : 6), 0);
      if(s.material) s.material.depthWrite = false;
      return s;
    };
    objFnRef.current = objFn;
    const G = window.ForceGraph3D()(el)
      .backgroundColor('rgba(0,0,0,0)')
      .showNavInfo(false)
      .nodeRelSize(4)
      .nodeColor(n=> n.level===0?'#FFD700' : n.dep==='alta'?'#ef4444' : n.dep==='media'?'#FFA500' : '#38bdf8')
      .nodeVal(n=> n.level===0?18 : n.level===1?7 : n.level===2?3 : 1.6)
      .nodeOpacity(0.92)
      .linkColor(l=> l.critical?'#ef4444':'rgba(255,215,0,0.5)')
      .linkWidth(l=> l.critical?0.9:0.5)
      .linkOpacity(0.55)
      .nodeThreeObjectExtend(true)
      .nodeThreeObject(objFn)
      .onNodeClick(n=>{
        setSel(n);
        if(n.hasChildren){
          setCollapsed(prev=>{ const c=new Set(prev); c.has(n.id)?c.delete(n.id):c.add(n.id); return c; });
        }
        const r = Math.hypot(n.x||0,n.y||0,n.z||0) || 1;
        const ratio = 1 + 90/r;
        G.cameraPosition({ x:(n.x||0)*ratio, y:(n.y||0)*ratio, z:(n.z||0)*ratio }, n, 700);
      })
      .onBackgroundClick(()=>setSel(null));
    graphRef.current = G;
    try{ window.__uniGraph = G; }catch(e){}
    try{ const c=G.controls(); c.autoRotate=true; c.autoRotateSpeed=0.55; }catch(e){}
    let stopped=false;
    G.onEngineStop(()=>{ if(!stopped){ stopped=true; try{ G.zoomToFit(500,80); }catch(e){} } });
    const ro = ()=>{ try{ G.width(el.clientWidth); G.height(el.clientHeight); }catch(e){} };
    ro(); window.addEventListener('resize', ro);
    return ()=>{ window.removeEventListener('resize', ro); try{ G._destructor&&G._destructor(); }catch(e){} if(el) el.innerHTML=''; graphRef.current=null; };
  }, [libs]);

  // re-apply on collapse changes
  useEffect(()=>{
    const G=graphRef.current; if(!G) return;
    collapsedRef.current = collapsed;
    if(objFnRef.current) G.nodeThreeObject(objFnRef.current);
    G.graphData(visibleData());
  }, [collapsed]);

  // toggle autorotate
  useEffect(()=>{ const G=graphRef.current; if(!G) return; try{ G.controls().autoRotate = auto; }catch(e){} }, [auto]);

  const reframe = ()=>{ const G=graphRef.current; if(G){ try{ G.zoomToFit(500,80); }catch(e){} } };
  const expandAll = ()=> setCollapsed(new Set());
  const collapseAll = ()=>{ const c=new Set(); model.nodes.forEach(n=>{ if(n.level===2 && n.hasChildren) c.add(n.id); }); setCollapsed(c); };

  const patchSpec = (id, text)=>{
    let m;
    if((m=id.match(/^a(\d+)$/))) patch(d=>{ d.founder.byArea[+m[1]].note=text; });
    else if((m=id.match(/^n(\d+)_(\d+)$/))) patch(d=>{ d.founder.byArea[+m[1]].nodes[+m[2]].spec=text; });
    else if((m=id.match(/^c(\d+)_(\d+)_(\d+)$/))) patch(d=>{ d.founder.byArea[+m[1]].nodes[+m[2]].children[+m[3]].spec=text; });
  };

  if(!libs){
    return (
      <div>
        <div className="callout callout--warn" style={{margin:'0 0 1rem'}}>
          <div className="ic"><Icon name="alert" size={18}/></div>
          <div><h5 style={{fontFamily:'Oswald',color:'#ff8585',margin:'0 0 .3rem'}}>Vista 3D no disponible</h5>
          <p style={{margin:0,fontSize:'.88rem',color:'var(--text-muted)'}}>No se pudo cargar el motor 3D (sin conexión). Mostrando el universo en 2D.</p></div>
        </div>
        <FounderUniverse2D founder={founder} />
      </div>
    );
  }

  const kids = sel ? model.nodes.filter(n=>n.parent===sel.id) : [];
  return (
    <div>
      <div className="uni3d-shell">
        <div className="uni3d-wrap" ref={wrapRef}></div>
        <div className="uni3d-hint"><Icon name="share" size={13}/> Arrastra para rotar · rueda para zoom · clic en un nodo para desplegarlo</div>
        <div className="uni3d-ctrls">
          <button onClick={()=>setAuto(a=>!a)} title="Girar automáticamente" className={auto?'on':''}><Icon name="reset" size={15}/></button>
          <button onClick={reframe} title="Reencuadrar"><Icon name="target" size={15}/></button>
          <button onClick={expandAll} title="Desplegar todo"><Icon name="plus" size={15}/></button>
          <button onClick={collapseAll} title="Plegar todo"><Icon name="branch" size={15}/></button>
        </div>

        {sel && (
          <div className="uni3d-spec">
            <button className="us-close" onClick={()=>setSel(null)}><Icon name="x" size={16}/></button>
            <div className="us-kind">{KIND_LABEL[sel.kind]||'Nodo'}{sel.hours!=null?` · ${sel.hours} h/sem`:''}</div>
            <h4>{sel.label}</h4>
            <div className="us-badges">
              <span className={'badge '+(DEP_BADGE[sel.dep]||'low')}>dependencia {sel.dep}</span>
              {sel.critical && <span className="badge crit">crítico</span>}
            </div>
            <EditableText tag="p" admin={admin} value={sel.spec||''} className="us-spec"
              onCommit={(t)=>patchSpec(sel.id,t)} />
            {sel.hasChildren && (
              <button className="us-toggle" onClick={()=>setCollapsed(prev=>{ const c=new Set(prev); c.has(sel.id)?c.delete(sel.id):c.add(sel.id); return c; })}>
                {collapsed.has(sel.id) ? <><Icon name="plus" size={13}/> Desplegar {kids.length} dependencia{kids.length!==1?'s':''}</> : <><Icon name="cdown" size={13}/> Plegar</>}
              </button>
            )}
            {kids.length>0 && (
              <div className="us-kids">
                {kids.map(k=>(
                  <button key={k.id} className="us-kid" onClick={()=>{ setSel(k); const G=graphRef.current; if(G&&k.x!=null){ const r=Math.hypot(k.x,k.y,k.z)||1, ratio=1+90/r; G.cameraPosition({x:k.x*ratio,y:k.y*ratio,z:k.z*ratio},k,600);} }}>
                    <span className="kd" style={{background: k.dep==='alta'?'#ef4444':k.dep==='media'?'#FFA500':'#38bdf8'}}></span>
                    {k.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="uni-legend">
        <span><i style={{background:'var(--lane-ceo)'}}></i> Alta</span>
        <span><i style={{background:'var(--warn)'}}></i> Media</span>
        <span><i style={{background:'var(--lane-team)'}}></i> Baja / delegable</span>
        <span><i style={{background:'var(--gold)'}}></i> Fundador</span>
        <span className="uni-count">{model.nodes.length-1} dependencias mapeadas</span>
      </div>
    </div>
  );
}

Object.assign(window, { ResumenView, ValuationView, FounderMapView });
