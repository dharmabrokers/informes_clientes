/* ============================================================
   views2.jsx — Diagnóstico por área · Bloqueos · Hoja de ruta · Pre-auditoría
   ============================================================ */

/* ---------------- Diagnóstico por área ---------------- */
function AreasView({ data, patch, admin }) {
  const [open, setOpen] = useState(data.areas[0].id);
  return (
    <div>
      <div className="view-head">
        <div className="eb">Entregable · diagnóstico</div>
        <h2>Las cinco áreas, <em>sin maquillaje</em>.</h2>
        <p>Marketing, Ventas, Delivery, Administración y Seguridad. Cada una con su puntuación de madurez y los procesos que más pesan.</p>
      </div>
      {data.areas.map((a, ai) => {
        const desc = Array.isArray(a.description) ? a.description : [a.description];
        return (
        <div className={'area' + (open===a.id?' open':'')} key={a.id}>
          <div className="area-head" onClick={()=>setOpen(open===a.id?null:a.id)}>
            <div className={'ascore ' + scoreClass(a.score)}>{a.score}</div>
            <div className="ai">
              <h4>{a.name} <span className={'badge '+statusBadge(a.status)}>{a.status==='critical'?'crítico':a.status==='warning'?'atención':'ok'}</span></h4>
              <p style={{margin:'.25rem 0 0',fontSize:'.85rem',color:'var(--text-muted)',lineHeight:1.5}}>{desc[0]}</p>
            </div>
            <Icon name="cdown" size={20} className="ax" />
          </div>
          <div className="area-body">
            {desc.map((p,pi)=>(
              <EditableText key={pi} tag="p" admin={admin} value={p} className="muted"
                style={{fontSize:'.92rem',lineHeight:1.7,margin:'0 0 .8rem'}}
                onCommit={(t)=>patch(d=>{ if(Array.isArray(d.areas[ai].description)) d.areas[ai].description[pi]=t; else d.areas[ai].description=t; })} />
            ))}
            {a.keyFindings && (
              <div className="findings">
                <div className="findings-h"><Icon name="alert" size={13}/> Hallazgos clave</div>
                <ul>{a.keyFindings.map((k,ki)=><li key={ki}>{k}</li>)}</ul>
              </div>
            )}
            <div className="proc-h">Procesos</div>
            {a.processes.map((p,pi)=>(
              <div className="proc" key={pi}>
                <div className={'pscore ' + scoreClass(p.score)}>{p.score}</div>
                <div className="pi" style={{flex:1}}>
                  <b>{p.name}</b><p>{p.note}</p>
                  {p.metrics && (
                    <div className="proc-metrics">
                      {p.metrics.map((m,mi)=>(
                        <span className="pmetric" key={mi}>{m.label}: <b>{m.value}</b></span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );})}
    </div>
  );
}

/* ---------------- Bloqueos críticos ---------------- */
function BlockersView({ data, patch, admin }) {
  const totalCoi = data.blockers.reduce((s,b)=>s+b.coiPerQuarter,0);
  return (
    <div>
      <div className="view-head">
        <div className="eb">Entregable · bloqueos críticos</div>
        <h2>Los 3 que más <em>frenan el valor</em>.</h2>
        <p>Ordenados por impacto en valoración, no por urgencia operativa. Cada uno con su coste de inacción (COI): euros de valoración que se pierden cada trimestre que no se resuelve.</p>
      </div>

      <div className="statcard" style={{marginBottom:'1.2rem'}}>
        <div className="sl"><Icon name="alert" size={14}/> Coste de inacción combinado</div>
        <div className="sv c-crit">{fmtEur(totalCoi)}<small> / trimestre</small></div>
        <div className="sd">Lo que cuesta no hacer nada. Equivale a <b className="c-gold">{fmtEur(totalCoi*4)}</b> de valor erosionado al año.</div>
      </div>

      {data.blockers.map((b, bi) => (
        <div className="blocker" key={b.id}>
          <div className="brank">{b.rank}</div>
          <div>
            <h4>{b.title}</h4>
            <div className="bmeta">
              <span className="badge low">{b.area}</span>
              <span className={'badge '+b.valuationImpact}>impacto {b.valuationImpact==='high'?'alto':b.valuationImpact==='medium'?'medio':'bajo'}</span>
            </div>
            <EditableText tag="p" admin={admin} value={b.description} onCommit={(t)=>patch(d=>{d.blockers[bi].description=t;})} />
            {b.evidence && (
              <div className="b-evidence">
                <div className="be-h">Evidencia</div>
                <ul>{b.evidence.map((e,ei)=><li key={ei}>{e}</li>)}</ul>
              </div>
            )}
            {b.recommendation && (
              <div className="b-rec"><Icon name="arrowright" size={14}/> <span><b>Recomendación:</b> {b.recommendation}</span></div>
            )}
          </div>
          <div className="bcoi">
            <div className="cl">COI</div>
            <div className="cv">{fmtEur(b.coiPerQuarter)}</div>
            <div className="cs">/ trimestre</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Hoja de ruta 90 días ---------------- */
const RM_STATUS = { pending:{c:'',i:null}, 'in-progress':{c:'prog',i:'clock'}, completed:{c:'done',i:'check'} };
const RM_NEXT = { pending:'in-progress', 'in-progress':'completed', completed:'pending' };
function RoadmapView({ data, patch, admin }) {
  const wins = ['0-30','30-60','60-90'];
  const totalVal = data.roadmap.reduce((s,r)=>s+r.valuationImpact,0);
  const totalHrs = data.roadmap.reduce((s,r)=>s+r.hoursSaved,0);
  const done = data.roadmap.filter(r=>r.status==='completed').length;
  const cycle = (id)=> patch(d=>{ const it=d.roadmap.find(x=>x.id===id); it.status = RM_NEXT[it.status]||'pending'; });
  return (
    <div>
      <div className="view-head">
        <div className="eb">Entregable · hoja de ruta</div>
        <h2>90 días. <em>Accionable, no genérica.</em></h2>
        <p>Priorizada por impacto y esfuerzo. Marca el avance haciendo clic en cada casilla — el progreso se guarda y queda vivo entre Fase 1 y Fase 2.</p>
      </div>

      <div className="grid g3" style={{marginBottom:'.6rem'}}>
        <div className="statcard"><div className="sl"><Icon name="trendup" size={14}/> Valor potencial</div><div className="sv c-gold">{fmtEur(totalVal)}</div><div className="sd">Suma del impacto en valoración de las 6 acciones.</div></div>
        <div className="statcard"><div className="sl"><Icon name="clock" size={14}/> Horas/mes liberadas</div><div className="sv">{totalHrs}<small> h</small></div><div className="sd">Tiempo del equipo y del fundador recuperado al mes.</div></div>
        <div className="statcard"><div className="sl"><Icon name="check" size={14}/> Progreso</div><div className="sv">{done}<small>/{data.roadmap.length}</small></div><div className="sd">Acciones completadas.</div></div>
      </div>

      {wins.map(w => {
        const items = data.roadmap.filter(r=>r.window===w);
        if (!items.length) return null;
        return (
          <div key={w}>
            <div className="rm-win">Días {w}</div>
            {items.map((r,ri) => {
              const st = RM_STATUS[r.status]||RM_STATUS.pending;
              return (
                <div className="rm-item" key={r.id}>
                  <div className="rm-top">
                    <div className={'rm-check '+st.c} onClick={()=>cycle(r.id)} title="Cambiar estado">{st.i && <Icon name={st.i} size={14}/>}</div>
                    <h4>{r.title}</h4>
                    <span className="badge low">{r.area}</span>
                    <span className={'badge '+r.impact}>impacto {r.impact==='high'?'alto':r.impact==='medium'?'medio':'bajo'}</span>
                  </div>
                  <p>{r.description}</p>
                  <div className="rm-stats">
                    <span className="rs"><Icon name="target" size={12} style={{verticalAlign:'-1px',color:'var(--gold)'}}/> KPI: <b>{r.kpi}</b></span>
                    <span className="rs">Esfuerzo: <b>{r.effort==='high'?'alto':r.effort==='medium'?'medio':'bajo'}</b></span>
                    {r.hoursSaved>0 && <span className="rs">Ahorro: <b>{r.hoursSaved} h/mes</b></span>}
                    <span className="rs val">Valor: <b>+{fmtEur(r.valuationImpact)}</b></span>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Pre-auditoría ---------------- */
const AU_STATUS = { complete:{c:'complete',i:'check',l:'completo'}, partial:{c:'partial',i:'pencil',l:'parcial'}, missing:{c:'missing',i:'x',l:'falta'} };
const AU_NEXT = { missing:'partial', partial:'complete', complete:'missing' };
function AuditView({ data, patch, admin }) {
  const counts = data.auditGaps.reduce((a,g)=>{a[g.status]=(a[g.status]||0)+1;return a;},{});
  const ready = Math.round(100 * ((counts.complete||0) + (counts.partial||0)*0.5) / data.auditGaps.length);
  const cycle = (id)=> patch(d=>{ const it=d.auditGaps.find(x=>x.id===id); it.status = AU_NEXT[it.status]||'missing'; });
  return (
    <div>
      <div className="view-head">
        <div className="eb">Entregable · pre-auditoría de compra</div>
        <h2>Lo que pediría <em>un comprador serio</em>.</h2>
        <p>Auditoría rápida de la documentación clave. Los huecos identificados ahora, antes de que sean factores decisivos en una negociación. Haz clic para actualizar el estado.</p>
      </div>

      <div className="grid g3" style={{marginBottom:'1rem'}}>
        <div className="statcard"><div className="sl"><Icon name="shield" size={14}/> Preparación documental</div><div className={'sv '+scoreClass(ready)}>{ready}<small>%</small></div><div className="bar"><i className={scoreBar(ready)} style={{width:ready+'%'}}></i></div></div>
        <div className="statcard"><div className="sl"><Icon name="check" size={14}/> Completos</div><div className="sv c-ok">{counts.complete||0}<small>/{data.auditGaps.length}</small></div></div>
        <div className="statcard"><div className="sl"><Icon name="alert" size={14}/> Huecos críticos</div><div className="sv c-crit">{data.auditGaps.filter(g=>g.status==='missing'&&g.impact==='high').length}</div><div className="sd">Documentos de alto impacto aún sin resolver.</div></div>
      </div>

      <div className="panel">
        {data.auditGaps.map(g => {
          const st = AU_STATUS[g.status]||AU_STATUS.missing;
          return (
            <div className="audit-row" key={g.id}>
              <div className={'audit-check '+st.c} onClick={()=>cycle(g.id)} title="Cambiar estado"><Icon name={st.i} size={14}/></div>
              <div className="ad"><b>{g.document}</b><span>{g.note} · resp. {g.owner}</span></div>
              <span className={'badge '+g.impact}>{g.impact==='high'?'alto':g.impact==='medium'?'medio':'bajo'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { AreasView, BlockersView, RoadmapView, AuditView });
