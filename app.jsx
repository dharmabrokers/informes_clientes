/* ============================================================
   app.jsx — Shell del Panel de Control "documento vivo"
   ============================================================ */
/* ---------- Carga de datos: Gist (?id=) en producción · demo local sin id ---------- */
const GID = (function(){ try { return new URLSearchParams(location.search).get('id'); } catch(e){ return null; } })();
const PKEY = GID ? ('dharma_panel_' + GID) : 'dharma_panel_demo';
const nuid = () => 's' + Math.random().toString(36).slice(2, 8);

// Normaliza el JSON crudo: los pasos de flujo [texto,carril,tipo] → objeto con id
function buildData(raw) {
  const d = JSON.parse(JSON.stringify(raw));
  Object.values(d.flows || {}).forEach(f => ['asIs','toBe'].forEach(k => {
    if (Array.isArray(f[k])) f[k] = f[k].map(s => Array.isArray(s) ? { id: nuid(), label: s[0], lane: s[1], type: s[2] } : s);
  }));
  return d;
}
function readLocal() {
  try { const raw = localStorage.getItem(PKEY); if (raw) return JSON.parse(raw); } catch (e) {}
  return null;
}
function demoData() { return buildData(window.DEMO); }
// Estado inicial SIN id = demo (con migración por versión). CON id = null hasta que llega el Gist.
function initData() {
  if (GID) return null;
  const s = readLocal();
  if (s && s.version === window.DEMO.version) return s;
  return demoData();
}
const gistApi = (id) => 'https://api.github.com/gists/' + encodeURIComponent(id);

const TABS = [
  { id:'resumen',    label:'Resumen',        icon:'dashboard' },
  { id:'valoracion', label:'Valoración',     icon:'target' },
  { id:'founder',    label:'Mapa del fundador', icon:'branch' },
  { id:'areas',      label:'Por área',       icon:'grid' },
  { id:'flows',      label:'Flujos',         icon:'workflow' },
  { id:'blockers',   label:'Bloqueos',       icon:'alertoct' },
  { id:'roadmap',    label:'Hoja de ruta',   icon:'route' },
  { id:'audit',      label:'Pre-auditoría',  icon:'filesearch' },
  { id:'narrative',  label:'Informe',        icon:'filetext' },
];

function App() {
  const [auth, setAuth] = useState(false);
  const [admin, setAdmin] = useState(true);
  const [tab, setTab] = useState('resumen');
  const [data, setData] = useState(initData);
  const [saved, setSaved] = useState(true);
  const [loadErr, setLoadErr] = useState(null);

  // Producción: si hay ?id=, carga el report.json desde el Gist (con respaldo demo)
  useEffect(() => {
    if (!GID) return;
    let cancelled = false;
    fetch(gistApi(GID), { headers: { 'Accept': 'application/vnd.github+json' } })
      .then(r => { if (!r.ok) throw new Error('No se pudo acceder al Gist (' + r.status + ')'); return r.json(); })
      .then(g => {
        const file = g.files && (g.files['report.json'] || Object.values(g.files)[0]);
        if (!file || !file.content) throw new Error('El Gist no contiene report.json');
        const gist = JSON.parse(file.content);
        const tag = (gist.version || 0) + '|' + ((gist.meta && gist.meta.lastUpdated) || '');
        const local = readLocal();
        let use;
        if (local && local._src === tag) { use = local; }        // ediciones del cliente desde la última publicación
        else { use = buildData(gist); use._src = tag; }            // primera carga o el consultor publicó cambios
        if (!cancelled) setData(use);
      })
      .catch(err => { if (!cancelled) { setLoadErr(err.message); setData(demoData()); } });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!data) return;
    try { localStorage.setItem(PKEY, JSON.stringify(data)); setSaved(true); } catch (e) {}
  }, [data]);

  const patch = (fn) => { setSaved(false); setData(prev => { const c = JSON.parse(JSON.stringify(prev)); fn(c); return c; }); };
  const setFlows = (flows) => { setSaved(false); setData(prev => ({ ...prev, flows })); };

  const exportJSON = () => {
    const out = JSON.parse(JSON.stringify(data)); delete out._src;
    const blob = new Blob([JSON.stringify(out, null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = (data.config.companyName||'informe').replace(/\s+/g,'-').toLowerCase() + '.json';
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };
  const resetAll = () => {
    var msg = GID ? '¿Recargar los datos publicados desde el Gist? Se descartarán las ediciones locales no publicadas.' : '¿Restablecer la demo a su estado original? Se perderán tus ediciones.';
    if (!window.confirm(msg)) return;
    try { localStorage.removeItem(PKEY); } catch (e) {}
    if (GID) { location.reload(); } else { setData(demoData()); }
  };

  if (!data) return <Splash error={loadErr} />;
  if (!auth) return <Login data={data} onEnter={(isAdmin)=>{ setAuth(true); setAdmin(isAdmin); }} />;

  const props = { data, patch, admin };
  return (
    <div>
      <div className="pn-bg"></div>

      <nav className="pn-nav">
        <div className="brand"><img src="assets/logo-compass-white.png" alt="Dharma Brokers" /><span className="wm">DHARMA BROKERS</span></div>
        <div className="pn-co"><b>{data.config.companyName}</b><span>{data.config.consultant}</span></div>
        <div className="spacer"></div>
        <div className="pn-actions">
          <span className="pn-save"><span className="d" style={{background: saved?'var(--ok)':'var(--warn)'}}></span>{saved?'Guardado':'Guardando…'}</span>
          <span className={'pn-chip mode'+(admin?' on':'')} onClick={()=>setAdmin(a=>!a)}>
            <Icon name={admin?'pencil':'eye'} size={14}/> {admin?'Modo admin':'Vista cliente'}
          </span>
          {admin && <span className="pn-chip" onClick={exportJSON}><Icon name="download" size={14}/> Exportar JSON</span>}
          {admin && <span className="pn-chip" onClick={resetAll}><Icon name="reset" size={14}/></span>}
          <span className="pn-chip" onClick={()=>setAuth(false)}><Icon name="logout" size={14}/></span>
        </div>
      </nav>

      <div className="pn-tabs">
        {TABS.map(t => (
          <button key={t.id} className={'pn-tab'+(tab===t.id?' on':'')} onClick={()=>setTab(t.id)}>
            <Icon name={t.icon} size={15}/> {t.label}
          </button>
        ))}
      </div>

      <main className="pn-main">
        {tab==='resumen'    && <ResumenView {...props} />}
        {tab==='valoracion' && <ValuationView {...props} />}
        {tab==='founder'    && <FounderMapView {...props} />}
        {tab==='areas'      && <AreasView {...props} />}
        {tab==='flows'      && <FlowsTab data={data} setFlows={setFlows} admin={admin} />}
        {tab==='blockers'   && <BlockersView {...props} />}
        {tab==='roadmap'    && <RoadmapView {...props} />}
        {tab==='audit'      && <AuditView {...props} />}
        {tab==='narrative'  && <NarrativeView {...props} />}

        {tab!=='narrative' && <Fase2CTA />}
      </main>
    </div>
  );
}

function FlowsTab({ data, setFlows, admin }) {
  return (
    <div>
      <div className="view-head">
        <div className="eb">Entregable · flujos de proceso</div>
        <h2>Cómo trabaja hoy — y cómo <em>debería</em>.</h2>
        <p>El diagrama se genera desde los datos: tú describes pasos y carriles, nunca dibujas flechas. El índice de dependencia se recalcula solo. Compara el flujo actual con el optimizado.</p>
      </div>
      <FlowModule flows={data.flows} onChange={setFlows} admin={admin} />
    </div>
  );
}

function Fase2CTA() {
  return (
    <div className="cta-fase2">
      <h3>¿Listo para <em>ejecutar la hoja de ruta?</em></h3>
      <p>Este diagnóstico es 100 % tuyo y autónomo. Si quieres, lo ejecutamos juntos en la Fase 2 — y el coste de la Fase 1 se descuenta al completo.</p>
      <button className="btn" onClick={()=>alert('Demo: aquí enlazaría con la reserva de Fase 2.')}>Hablar de la Fase 2 <Icon name="arrowright" size={15} style={{verticalAlign:'-2px'}}/></button>
    </div>
  );
}

/* ---------------- Informe narrativo (vista lectura) ---------------- */
function NarrativeView({ data }) {
  const v = data.valuation, f = data.founder;
  const vc = computeValuation(v).scenarios;
  const uplift = vc.objetivo.euros - vc.realista.euros;
  return (
    <div className="narrative">
      <div className="view-head">
        <div className="eb">Entregable · informe escrito</div>
        <h2>{data.config.companyName}</h2>
        <p>Informe de diagnóstico estratégico · Fase 1 · {data.config.consultant}</p>
      </div>

      <div className="book-launch">
        <div className="bl-icon"><Icon name="filetext" size={26}/></div>
        <div className="bl-txt">
          <h3>Informe en formato libro digital</h3>
          <p>La versión premium, paginada y navegable — pensada para presentar y compartir. Pasa las páginas como un documento impreso.</p>
        </div>
        <a className="bl-btn" href="informe.html"><Icon name="arrowright" size={16}/> Abrir libro</a>
      </div>

      <div className="nv-doc">
        <h3>1 · Resumen ejecutivo</h3>
        <p className="nv-lead">{data.thesis.headline}</p>
        {data.thesis.paragraphs.map((p,i)=><p key={i}>{p}</p>)}

        <h3>2 · Valoración</h3>
        <p>Aplicando múltiplos de EBITDA del sector {data.config.sector.toLowerCase()} ({v.multipleBase.toFixed(1)}× base, ajustado por geografía, ciclo, tamaño y recurrencia) sobre un EBITDA normalizado de {fmtEur(v.ebitda)}, la valoración realista actual se sitúa en torno a <b>{fmtEur(vc.realista.euros)}</b>. El suelo en una venta urgente sería {fmtEur(vc.minimo.euros)}; el techo alcanzable tras la hoja de ruta, <b className="nv-gold">{fmtEur(vc.objetivo.euros)}</b>. La diferencia — {fmtEur(uplift)} — es valor que hoy está sobre la mesa.</p>

        <h3>3 · Dependencia del fundador</h3>
        <p>El fundador dedica {f.hoursPerWeek} horas semanales a la operativa, con un índice de dependencia de {f.dependencyScore}/10. La concentración es máxima en Ventas y Delivery. Existen además {f.undocumentedRelationships.length} relaciones críticas sin documentar — empezando por el cliente que aporta el 28 % de la facturación — que un comprador exigiría blindar antes de cerrar.</p>

        <h3>4 · Bloqueos críticos</h3>
        {data.blockers.map(b=>(
          <p key={b.id}><b>{b.rank}. {b.title}.</b> {b.description} <span className="nv-coi">Coste de inacción: {fmtEur(b.coiPerQuarter)}/trimestre.</span></p>
        ))}

        <h3>5 · Hoja de ruta de 90 días</h3>
        <p>Se proponen {data.roadmap.length} acciones estructurales en ventanas de 30 días, con un impacto agregado estimado de <b className="nv-gold">+{fmtEur(data.roadmap.reduce((s,r)=>s+r.valuationImpact,0))}</b> en valoración y la liberación de {data.roadmap.reduce((s,r)=>s+r.hoursSaved,0)} horas mensuales. La prioridad inmediata es blindar el cliente principal y dar visibilidad financiera; la palanca de mayor valor es documentar la operativa.</p>

        <h3>6 · Conclusión</h3>
        <p>Áurea es un negocio sano y con marca, pero hoy es una extensión de su fundador. La oportunidad no es arreglar algo roto, sino convertir un activo personal en un activo transferible — y capturar el 25-30 % de valoración que esa transformación libera. El siguiente paso natural es ejecutar la hoja de ruta.</p>

        <div className="nv-sign">Dharma Brokers · Operaciones confidenciales · {data.config.closingDate}</div>
      </div>
    </div>
  );
}

/* ---------------- Splash (carga desde Gist) ---------------- */
function Splash({ error }) {
  return (
    <div className="login">
      <div className="login-card" style={{textAlign:'center'}}>
        <img src="assets/logo-compass-white.png" alt="" />
        <div className="wm">DHARMA BROKERS</div>
        {error
          ? <><h2 style={{color:'#ff8585'}}>No se pudo cargar</h2>
              <p>{error}. Mostrando la demo. Revisa que el enlace <code>?id=</code> sea correcto y que el Gist sea accesible.</p></>
          : <><h2>Cargando diagnóstico…</h2>
              <p>Recuperando los datos confidenciales del cliente.</p></>}
      </div>
    </div>
  );
}

/* ---------------- Login ---------------- */
function Login({ data, onEnter }) {
  const [u, setU] = useState(''); const [p, setP] = useState(''); const [err, setErr] = useState('');
  const ac = data.config.access;
  const go = () => {
    if (u==='admin' && p==='dharma') return onEnter(true);
    if (u===ac.username && p===ac.password) return onEnter(false);
    setErr('Credenciales incorrectas.');
  };
  return (
    <div className="login">
      <div className="login-card">
        <img src="assets/logo-compass-white.png" alt="" />
        <div className="wm">DHARMA BROKERS</div>
        <h2>Panel de Control</h2>
        <p>Acceso confidencial al diagnóstico de <b style={{color:'#fff'}}>{data.config.companyName}</b>.</p>
        <input placeholder="Usuario" value={u} onChange={e=>setU(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()} />
        <input type="password" placeholder="Contraseña" value={p} onChange={e=>setP(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()} />
        <div className="err">{err}</div>
        <button className="btn" style={{width:'100%',background:'linear-gradient(135deg,var(--gold),var(--gold-soft))',color:'var(--dark)',border:'none',padding:'.85rem',borderRadius:'50px',fontWeight:700,fontFamily:'Poppins',cursor:'pointer'}} onClick={go}>Entrar</button>
        <div className="hint">Demo · cliente: <b>aurea / dharma</b> · admin: <b>admin / dharma</b></div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
