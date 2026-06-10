/* ============================================================
   Datos de demostración — Áurea Facility Services
   PYME ficticia · mantenimiento integral · Madrid
   Estructura = report.json del cliente (fuente única de verdad)
   v2 — contenido profundo + flujos realistas
   ============================================================ */
window.DEMO = {
  version: 7,
  config: {
    companyName: "Áurea Facility Services",
    sector: "Servicios profesionales",
    location: "Madrid, España",
    founded: 2016,
    access: { username: "aurea", password: "dharma" },
    consultant: "Dharma Brokers · Fase 1",
    closingDate: "Viernes · sesión de cierre"
  },

  indices: { autonomy: 3.2, saleReadiness: 41, optimization: 54 },

  thesis: {
    headline: "Negocio rentable y con marca, pero atado a su fundador.",
    paragraphs: [
      "Áurea Facility Services es una empresa madrileña de mantenimiento integral con 9 años de trayectoria, 1,6 M€ de facturación y un EBITDA normalizado del 15 %. Tiene contratos recurrentes, una cartera estable y reputación sólida en su nicho — los cimientos de un activo vendible. Su foso defensivo es la relación de confianza con clientes de larga duración y una tasa de renovación contractual superior al 85 %.",
      "El problema no es comercial, es estructural: el negocio depende del fundador en sus tres engranajes críticos. Cierra él las ventas relevantes, valida él la calidad de la operativa, y centraliza él la relación con el cliente que aporta el 28 % de la facturación. Un comprador profesional descuenta con fuerza esta dependencia, porque compra un activo que se va si se va el dueño — y porque cada uno de esos tres puntos es, además, un punto único de fallo operativo.",
      "La urgencia es de oportunidad, no de supervivencia. La empresa no corre peligro inmediato — genera caja y crece de forma plana pero estable. Sin embargo, está dejando entre un 25 % y un 30 % de su valoración sobre la mesa. La diferencia entre el escenario realista (≈740 k€) y el objetivo (≈945 k€) no depende de vender más, sino de transformar conocimiento tácito en activo transferible: documentar, delegar y automatizar lo que hoy pasa por el fundador. Esa es exactamente la hoja de ruta de 90 días."
    ]
  },

  valuation: {
    methodology: "Método de múltiplos de EBITDA. El múltiplo base es una mediana de mercado por sector, ajustada por geografía, momento de ciclo, tamaño, crecimiento, antigüedad, recurrencia y dependencia del fundador. Todas las palancas son editables.",
    ebitda: 240000,
    ebitdaNote: "EBITDA normalizado: ajustados 38 k€ de gastos personales del fundador imputados a la empresa y 21 k€ de ingresos no recurrentes de un proyecto puntual (Día 2).",
    sector: "Servicios profesionales",
    geography: "España",
    multipleBase: 5.0,
    // Rangos de mercado por sector (mediana de operaciones cerradas en mediana empresa europea, ült. 3 años).
    // Coherentes con la calculadora pública de Dharma. Editables según geografía y momento.
    sectorRanges: {
      "Inmobiliario / construcción": [3.5, 5.0],
      "Servicios profesionales":     [4.0, 6.0],
      "Retail / hostelería":         [3.0, 4.5],
      "Industrial / B2B":            [4.5, 6.0],
      "eCommerce / digital":         [4.5, 7.0],
      "SaaS":                        [5.0, 12.0]
    },
    // Presets de prima/descuento por geografía (sobre la mediana del sector, base España = 1,00).
    geoPresets: {
      "España": 1.00, "DACH / Alemania": 1.15, "Nórdicos": 1.12, "Reino Unido": 1.08,
      "Francia": 1.05, "Benelux": 1.06, "Italia": 0.96, "Portugal": 0.94,
      "Europa del Este": 0.85, "LATAM": 0.80, "EE.UU.": 1.20
    },
    // Palancas de ajuste — todas editables. Valor = multiplicador sobre el múltiplo base.
    factors: {
      geography:  { value: 1.00, label: "Geografía",   note: "Mercado España. DACH/Nórdicos pagan prima; sur de Europa y LATAM, descuento." },
      market:     { value: 0.97, label: "Momento de ciclo", note: "Apetito comprador y tipos de interés actuales: ligeramente por debajo de pico." },
      size:       { value: 0.92, label: "Tamaño",      note: "Descuento por tamaño: <2 M€ de facturación cotiza bajo la mediana sectorial." },
      growth:     { value: 0.90, label: "Crecimiento", note: "Crecimiento plano/estable, sin tracción acelerada." },
      years:      { value: 1.08, label: "Antigüedad",  note: "9 años de trayectoria consolidada y marca asentada." },
      recurrence: { value: 1.05, label: "Recurrencia", note: "Renovación >85 %: los ingresos recurrentes premian el múltiplo." },
      concentration: { value: 0.93, label: "Concentración de cliente", note: "Un cliente concentra el 28 % de la facturación: penaliza por riesgo de ingresos." },
      ebitdaQuality: { value: 0.97, label: "Calidad del EBITDA", note: "Verificabilidad y limpieza de las cuentas. Números dispersos restan confianza al comprador." },
      margin:        { value: 1.00, label: "Margen vs sector", note: "Margen EBITDA del 15 %, en línea con la mediana del sector: neutral." },
      backlog:       { value: 1.04, label: "Backlog contractual", note: "Cartera de contratos firmados a futuro: da visibilidad de ingresos y premia el múltiplo." },
      diversification:{ value: 0.95, label: "Diversificación de ingresos", note: "Concentración en un único sector/tipo de servicio: menor diversificación, ligero descuento." },
      supplier:      { value: 0.97, label: "Dependencia de proveedor", note: "Suministro clave con un único proveedor sin contrato formal: riesgo de cadena, penaliza." }
    },
    scenarios: {
      minimo:   { depFactor: 0.55, rationale: "Venta urgente, dependencia del fundador sin corregir. Suelo de negociación que aceptaría un comprador oportunista." },
      realista: { depFactor: 0.78, rationale: "Estado actual, dependencia media. La cifra de hoy ante un comprador informado." },
      objetivo: { depFactor: 1.00, rationale: "Tras ejecutar la hoja de ruta de 90 días y reducir la dependencia del fundador a baja. El premio de la transformación." }
    }
  },

  founder: {
    hoursPerWeek: 31,
    dependencyScore: 7.5,
    byArea: [
      { area: "Ventas",         hours: 12, criticality: "alta",  note: "Cierra personalmente todo trato > 15 k€ y mantiene en exclusiva la cuenta principal.",
        nodes: [
          { label: "Cierre de grandes cuentas", dep: "alta", kind: "process", spec: "El fundador lidera personalmente toda negociación por encima de 15 k€. Sin él, los tratos grandes se paran.",
            children: [
              { label: "Propuestas a medida", dep: "media", kind: "process", spec: "Redactadas por el fundador, sin plantilla reutilizable." },
              { label: "Negociación y descuentos", dep: "alta", kind: "process", spec: "Solo él autoriza condiciones especiales." }
            ] },
          { label: "Cuenta principal (28 %)", dep: "alta", critical: true, kind: "external", spec: "≈448 k€/año en un solo cliente. Relación personal del fundador, sin contrato de permanencia.",
            children: [
              { label: "Interlocutor único", dep: "alta", kind: "person", spec: "Solo el fundador trata con el cliente; el equipo no tiene relación." },
              { label: "Renovación verbal", dep: "alta", kind: "process", spec: "Acuerdo anual de palabra, sin permanencia firmada." }
            ] },
          { label: "Precios y descuentos", dep: "media", kind: "process", spec: "La política de precios vive en la cabeza del fundador.",
            children: [ { label: "Tarifa no documentada", dep: "media", kind: "system", spec: "No existe lista de precios oficial." } ] },
          { label: "Pipeline (sin CRM)", dep: "media", kind: "system", spec: "Oportunidades repartidas entre Excel y memoria.",
            children: [ { label: "Excel personal", dep: "media", kind: "system", spec: "Archivo local en el equipo del fundador, sin copia." } ] }
        ] },
      { area: "Delivery",       hours: 8,  criticality: "alta",  note: "Valida calidad final y resuelve las incidencias que el equipo no sabe escalar.",
        nodes: [
          { label: "Validación de calidad", dep: "alta", kind: "process", spec: "Cada entrega relevante pasa por su visto bueno antes de salir.",
            children: [ { label: "Checklist mental", dep: "alta", kind: "process", spec: "Criterios de calidad no escritos." } ] },
          { label: "Incidencias críticas", dep: "alta", kind: "process", spec: "Escaladas que el equipo no sabe resolver terminan en el fundador.",
            children: [ { label: "Gestión del cliente", dep: "alta", kind: "person", spec: "El fundador es quien calma al cliente enfadado." } ] },
          { label: "2 técnicos veteranos", dep: "media", kind: "person", spec: "El conocimiento operativo clave reside en dos personas.",
            children: [ { label: "Sin backup formado", dep: "alta", kind: "person", spec: "Riesgo alto si uno de los dos se marcha." } ] },
          { label: "Planificación de equipos", dep: "baja", kind: "process", spec: "Cuadrantes semanales, ya delegados al responsable de operaciones." }
        ] },
      { area: "Administración", hours: 6,  criticality: "media", note: "Aprueba todos los pagos y revisa la facturación antes de emitirla.",
        nodes: [
          { label: "Aprobación de pagos", dep: "alta", kind: "process", spec: "Todo pago, grande o pequeño, requiere su firma.",
            children: [ { label: "Sin umbral delegado", dep: "alta", kind: "process", spec: "No hay límite por debajo del cual el equipo pueda pagar." } ] },
          { label: "Línea de crédito personal", dep: "alta", critical: true, kind: "external", spec: "120 k€ de crédito avalados a título personal del fundador, no de la sociedad.",
            children: [ { label: "Aval personal", dep: "alta", kind: "person", spec: "El riesgo financiero recae sobre su patrimonio." } ] },
          { label: "Proveedor clave (verbal)", dep: "media", critical: true, kind: "external", spec: "Precio y crédito de pago pactados de palabra, sin contrato.",
            children: [ { label: "Sin contrato", dep: "media", kind: "system", spec: "Riesgo en la cadena de suministro si cambia el proveedor." } ] },
          { label: "Facturación", dep: "baja", kind: "process", spec: "Emitida por administración y al día; bajo riesgo." }
        ] },
      { area: "Marketing",      hours: 3,  criticality: "baja",  note: "Decide acciones y aprueba contenido; sin ejecución propia.",
        nodes: [
          { label: "Red de contactos personal", dep: "alta", kind: "person", spec: "≈70 % de los leads llegan por la red y reputación del fundador.",
            children: [ { label: "Recomendaciones", dep: "alta", kind: "person", spec: "Dependen de su prestigio personal, no de un sistema." } ] },
          { label: "Decisión de campañas", dep: "media", kind: "process", spec: "Aprueba qué se hace, sin proceso de marketing definido." },
          { label: "Contenido y web", dep: "baja", kind: "system", spec: "Producción externa puntual; bajo nivel de dependencia." }
        ] },
      { area: "Seguridad",      hours: 2,  criticality: "media", note: "Único con accesos a banca, dominios y sistemas críticos.",
        nodes: [
          { label: "Accesos a banca", dep: "alta", kind: "system", spec: "Único con las credenciales bancarias de la empresa.",
            children: [ { label: "Sin MFA compartido", dep: "alta", kind: "system", spec: "Punto único de fallo: nadie más puede operar." } ] },
          { label: "Dominios y cuentas", dep: "alta", kind: "system", spec: "Dominios y cuentas registrados a su nombre personal.",
            children: [ { label: "Titularidad personal", dep: "alta", kind: "person", spec: "No están a nombre de la sociedad." } ] },
          { label: "Continuidad / backups", dep: "media", kind: "system", spec: "Sin plan de continuidad ni copias verificadas." }
        ] }
    ],
    undocumentedRelationships: [
      "Cliente principal (28 % de la facturación) — relación personal y exclusiva del fundador, sin contrato de permanencia firmado.",
      "Proveedor de suministros clave — acuerdo de precio y crédito de pago negociado verbalmente, sin formalizar por escrito.",
      "Línea de crédito bancaria (120 k€) — negociada y avalada a título personal del fundador, no de la sociedad."
    ]
  },

  blockers: [
    {
      id: "b1", rank: 1, title: "Concentración de cliente", area: "Ventas",
      valuationImpact: "high", coiPerQuarter: 38000,
      description: "Un solo cliente concentra el 28 % de la facturación y su relación depende en exclusiva del fundador, sin contrato de permanencia. Es la primera bandera roja que identifica cualquier comprador: si ese cliente se va — o se va con el fundador tras la operación — el negocio pierde más de un cuarto de sus ingresos de golpe. No reduce la valoración por rentabilidad, sino por riesgo de ingresos: el múltiplo aplicable cae.",
      evidence: [
        "El cliente aporta ≈448 k€/año; el segundo mayor cliente no llega a 95 k€.",
        "No existe contrato de permanencia ni penalización por salida.",
        "El interlocutor único es el fundador; el equipo no tiene relación directa."
      ],
      recommendation: "Firmar un contrato a 24 meses e introducir un segundo interlocutor del equipo en la cuenta antes de cualquier proceso de venta."
    },
    {
      id: "b2", rank: 2, title: "Operativa sin documentar", area: "Delivery",
      valuationImpact: "high", coiPerQuarter: 30000,
      description: "El proceso de entrega de servicio funciona bien, pero vive en la cabeza del fundador y de dos responsables veteranos. No hay procedimientos escritos ni formación reglada. Esto pone un techo a la escala — no se puede crecer sin clonar al dueño — y representa un riesgo operativo que el due diligence sacaría a la luz de inmediato: la calidad no está garantizada por un sistema, sino por personas concretas.",
      evidence: [
        "0 de los 5 servicios principales tiene procedimiento operativo (SOP) escrito.",
        "La incorporación de un técnico nuevo depende de acompañamiento informal, sin material de formación.",
        "Dos personas concentran el conocimiento crítico de la operativa."
      ],
      recommendation: "Documentar los SOP de los 5 servicios core y formar al equipo. Es la palanca que más sube la valoración."
    },
    {
      id: "b3", rank: 3, title: "Información financiera dispersa", area: "Administración",
      valuationImpact: "medium", coiPerQuarter: 22000,
      description: "Los números existen pero están repartidos entre la gestoría, hojas de cálculo propias y el criterio del fundador. No hay un cuadro de mando con el margen real por línea de servicio, de modo que las decisiones de precio se toman por intuición. Un comprador serio interpreta la opacidad como riesgo y la castiga en el precio — muchas veces más que el propio resultado financiero, porque no puede confiar en lo que no puede verificar.",
      evidence: [
        "El margen por línea de servicio solo se conoce de forma agregada al cierre anual.",
        "Conviven tres fuentes de verdad: gestoría, Excel del fundador y banca.",
        "No hay previsión de tesorería más allá de 30 días."
      ],
      recommendation: "Implantar un cuadro de mando único con margen por línea, caja y antigüedad de cobros."
    }
  ],

  roadmap: [
    { id:"r1", window:"0-30", title:"Blindar el cliente principal", area:"Ventas", impact:"high", effort:"medium", status:"pending",
      kpi:"Contrato a 24 meses firmado", hoursSaved:0, valuationImpact:70000,
      description:"Formalizar un contrato de permanencia con el cliente que aporta el 28 % e introducir un segundo interlocutor del equipo en la relación, para diluir la dependencia personal del fundador y reducir el riesgo de ingresos percibido por un comprador." },
    { id:"r2", window:"0-30", title:"Cuadro de mando financiero", area:"Administración", impact:"high", effort:"low", status:"pending",
      kpi:"Margen por línea visible mensual", hoursSaved:8, valuationImpact:45000,
      description:"Montar un panel único con margen real por línea de servicio, caja y antigüedad de cobros. Cierra el bloqueo de opacidad y da munición objetiva para subir precios donde el margen es bajo." },
    { id:"r3", window:"30-60", title:"Documentar el proceso de entrega", area:"Delivery", impact:"high", effort:"high", status:"pending",
      kpi:"SOP de los 5 servicios core", hoursSaved:10, valuationImpact:90000,
      description:"Escribir los procedimientos operativos estándar de los servicios principales y formar al equipo. Es la palanca que más sube la valoración: convierte conocimiento tácito en activo transferible y elimina el techo de escala." },
    { id:"r4", window:"30-60", title:"Delegar el cierre comercial < 15 k€", area:"Ventas", impact:"medium", effort:"medium", status:"pending",
      kpi:"60 % de cierres sin el fundador", hoursSaved:7, valuationImpact:55000,
      description:"Crear un guion de venta y dar autonomía al equipo para cerrar operaciones por debajo de 15 k€. Libera al fundador de la mayoría del volumen comercial sin perder los tratos estratégicos." },
    { id:"r5", window:"60-90", title:"Automatizar captación y seguimiento", area:"Marketing", impact:"medium", effort:"medium", status:"pending",
      kpi:"CAC −20 % · seguimiento 100 % auto", hoursSaved:6, valuationImpact:40000,
      description:"Implantar captura y calificación de leads con IA y una secuencia de seguimiento automática, para que el pipeline deje de depender del empuje personal del fundador y la captación sea predecible." },
    { id:"r6", window:"60-90", title:"Regularizar accesos y relaciones críticas", area:"Seguridad", impact:"medium", effort:"low", status:"pending",
      kpi:"0 activos a nombre personal", hoursSaved:2, valuationImpact:35000,
      description:"Pasar a nombre de la empresa la línea de crédito, los dominios y los accesos clave hoy en manos del fundador. Elimina banderas rojas baratas de resolver y caras de ignorar en un due diligence." }
  ],

  auditGaps: [
    { id:"a1", document:"Cuentas anuales auditadas (3 ejercicios)", status:"partial",  impact:"high",   owner:"Gestoría",        note:"Existen sin auditar; un comprador medio exigirá auditoría." },
    { id:"a2", document:"Contratos con clientes top-5",             status:"missing",  impact:"high",   owner:"Dirección",       note:"Relaciones de palabra, sin permanencia." },
    { id:"a3", document:"Procedimientos operativos (SOP)",          status:"missing",  impact:"high",   owner:"Operaciones",     note:"Conocimiento no documentado." },
    { id:"a4", document:"Organigrama y descripciones de puesto",    status:"complete", impact:"low",    owner:"RRHH",            note:"Disponible y actualizado." },
    { id:"a5", document:"Registro de marca y dominios",             status:"partial",  impact:"medium", owner:"Dirección",       note:"Marca registrada; dominios a nombre personal." },
    { id:"a6", document:"Inventario de activos y leasings",         status:"partial",  impact:"medium", owner:"Administración",  note:"Parcial; faltan vehículos." },
    { id:"a7", document:"Cumplimiento RGPD y laboral",              status:"partial",  impact:"medium", owner:"Asesoría",        note:"Revisión pendiente desde 2023." }
  ],

  /* ---- diagnóstico por área (profundo) ---- */
  areas: [
    { id:"mkt", name:"Marketing", score:48, status:"warning",
      description:[
        "Áurea capta clientes sobre todo por recomendación y por el prestigio personal del fundador en el tejido empresarial madrileño. Es un motor real, pero no es propio ni predecible: no existe un sistema de captación que funcione sin la red de contactos del dueño, y la atribución de qué acción genera qué lead es prácticamente inexistente.",
        "La presencia digital es discreta para el tamaño de la empresa. Hay web y algo de actividad, pero sin estrategia de contenido orientada a conversión ni inversión sostenida. Para un comprador, esto significa que el crecimiento futuro no está sistematizado: depende de que el fundador siga abriendo puertas."
      ],
      keyFindings:[
        "≈70 % de los leads llegan por recomendación o contacto directo del fundador.",
        "Sin CRM ni atribución: no se sabe el coste real de adquisición (CAC).",
        "Web sin posicionamiento competitivo para búsquedas clave del sector.",
        "Marca local fuerte, presencia digital débil."
      ],
      processes:[
        { name:"Captación de leads", score:45, status:"warning", note:"Mayoría por recomendación; sin canal predecible ni medible.",
          metrics:[{label:"Leads/mes (media)", value:"14"},{label:"% por recomendación", value:"70 %"}] },
        { name:"Marca y contenido", score:52, status:"warning", note:"Reputación local sólida, poca presencia y producción digital.",
          metrics:[{label:"Inversión mkt/mes", value:"600 €"},{label:"Casos publicados", value:"1"}] }
      ] },

    { id:"ven", name:"Ventas", score:38, status:"critical",
      description:[
        "El proceso de venta es, literalmente, el fundador. Cierra él todos los tratos relevantes, fija él los precios y la información de clientes y oportunidades vive en su cabeza y en hojas de cálculo sueltas. La conversión es alta — porque vende bien — pero no es escalable ni transferible: nadie del equipo podría sostener el pipeline si él se ausentara.",
        "Esta es el área que más penaliza la valoración. La concentración de la cuenta principal (28 %) en manos del fundador convierte un buen negocio comercial en un riesgo de ingresos para cualquier comprador."
      ],
      keyFindings:[
        "100 % de los tratos > 15 k€ los cierra el fundador.",
        "Sin CRM: oportunidades y seguimiento dispersos.",
        "Cliente principal = 28 % de la facturación, sin contrato de permanencia.",
        "Ciclo de venta medio ≈6 semanas, sin proceso documentado."
      ],
      processes:[
        { name:"Pipeline y cierre", score:35, status:"critical", note:"Dependencia total del fundador en el cierre.",
          metrics:[{label:"Conversión", value:"34 %"},{label:"Cierres sin fundador", value:"0 %"}] },
        { name:"CRM y datos de cliente", score:40, status:"critical", note:"Sin sistema; información fragmentada y en riesgo.",
          metrics:[{label:"Sistema CRM", value:"No"},{label:"Datos centralizados", value:"Parcial"}] }
      ] },

    { id:"del", name:"Delivery", score:56, status:"warning",
      description:[
        "La operativa es competente y los clientes están satisfechos — la tasa de renovación supera el 85 %. Pero la calidad descansa en la supervisión personal del fundador y en dos responsables veteranos, no en un sistema documentado. Funciona, pero no se puede enseñar ni escalar con garantías.",
        "El techo de crecimiento es operativo: para atender más volumen habría que replicar un conocimiento que hoy no está escrito. Un comprador lo ve como riesgo de continuidad del servicio tras la salida del fundador."
      ],
      keyFindings:[
        "Renovación de contratos > 85 %: base recurrente sólida.",
        "0 procedimientos operativos (SOP) documentados.",
        "Calidad dependiente de 3 personas clave.",
        "Capacidad instalada cerca del límite sin reorganización."
      ],
      processes:[
        { name:"Ejecución del servicio", score:60, status:"warning", note:"Buena calidad sostenida sobre conocimiento tácito.",
          metrics:[{label:"Renovación", value:"85 %"},{label:"Incidencias/mes", value:"4"}] },
        { name:"Control de calidad", score:52, status:"warning", note:"Validación manual del fundador, sin checklist.",
          metrics:[{label:"QA documentado", value:"No"},{label:"Tiempo medio resolución", value:"48 h"}] }
      ] },

    { id:"adm", name:"Administración", score:58, status:"warning",
      description:[
        "La administración cumple con lo básico y la caja es sana, pero falta un cuadro de mando que dé visibilidad en tiempo real. No se conoce el margen real por línea de servicio hasta el cierre anual, lo que convierte las decisiones de precio en intuición. La facturación y los cobros están al día, pero se gestionan manualmente.",
        "La opacidad es el problema de valoración aquí: un comprador castiga lo que no puede verificar. Ordenar los números es de las acciones de mayor retorno y menor esfuerzo del diagnóstico."
      ],
      keyFindings:[
        "Margen por línea visible solo de forma agregada y anual.",
        "Tres fuentes de verdad (gestoría, Excel, banca) sin conciliar.",
        "Sin previsión de tesorería más allá de 30 días.",
        "Caja sana: ≈55 días de margen operativo."
      ],
      processes:[
        { name:"Finanzas y márgenes", score:55, status:"warning", note:"Sin cuadro de mando; decisiones de precio por intuición.",
          metrics:[{label:"Margen EBITDA", value:"15 %"},{label:"Días de caja", value:"55"}] },
        { name:"Facturación y cobros", score:62, status:"warning", note:"Manual pero al día; aprobación del fundador como cuello.",
          metrics:[{label:"Periodo medio cobro", value:"42 días"},{label:"Automatización", value:"Baja"}] }
      ] },

    { id:"seg", name:"Seguridad", score:50, status:"warning",
      description:[
        "El riesgo está concentrado en una sola persona: los accesos a banca, los dominios y la línea de crédito están a nombre del fundador, no de la sociedad. No existe plan de continuidad si él no está disponible. Son banderas rojas baratas de resolver pero caras de ignorar: en un due diligence aparecen de inmediato.",
        "El cumplimiento (RGPD, laboral) está en estado razonable pero con una revisión pendiente desde 2023 que conviene cerrar antes de cualquier proceso."
      ],
      keyFindings:[
        "Línea de crédito y dominios a nombre personal del fundador.",
        "Punto único de fallo en accesos críticos.",
        "Sin plan de continuidad ni copias de seguridad verificadas.",
        "Revisión RGPD pendiente desde 2023."
      ],
      processes:[
        { name:"Accesos e infraestructura", score:45, status:"critical", note:"Punto único de fallo: el fundador concentra las llaves.",
          metrics:[{label:"Accesos a nombre empresa", value:"Parcial"},{label:"Plan de continuidad", value:"No"}] },
        { name:"Cumplimiento", score:55, status:"warning", note:"Estado aceptable, revisión RGPD pendiente.",
          metrics:[{label:"RGPD", value:"Pendiente"},{label:"Contratos laborales", value:"Al día"}] }
      ] }
  ],

  /* ---- flujos (módulo BPMN) — to-be con presencia estratégica realista del CEO ---- */
  flows: {
    captacion: {
      id:"captacion", name:"Captación a cobro",
      asIs:[
        ["Entra lead (web / WhatsApp)","client","inicio"],
        ["Llamada de calificación","ceo","tarea"],
        ["¿Encaja el cliente?","ceo","decision"],
        ["Presupuesto a mano (Word)","ceo","tarea"],
        ["Seguimiento manual (se olvida)","ceo","tarea"],
        ["Emite factura","team","tarea"],
        ["Cobro","team","fin"]
      ],
      toBe:[
        ["Entra lead","client","inicio"],
        ["Captura + calificación con IA","auto","tarea"],
        ["¿Encaja el cliente?","auto","decision"],
        ["Reunión comercial (si encaja)","team","tarea"],
        ["Presupuesto desde CRM","auto","tarea"],
        ["Cierre estratégico (solo > 15 k€)","ceo","tarea"],
        ["Secuencia de seguimiento auto","auto","tarea"],
        ["Facturación y cobro auto","auto","fin"]
      ]
    },
    onboarding: {
      id:"onboarding", name:"Entrega de servicio",
      asIs:[
        ["Cliente firma","client","inicio"],
        ["Kickoff lo da el CEO","ceo","tarea"],
        ["Define alcance (en su cabeza)","ceo","tarea"],
        ["Ejecuta el equipo","team","tarea"],
        ["¿Revisión OK?","ceo","decision"],
        ["Correcciones validadas por el CEO","ceo","tarea"],
        ["Entrega","team","fin"]
      ],
      toBe:[
        ["Cliente firma","client","inicio"],
        ["Kickoff automatizado (form + checklist)","auto","tarea"],
        ["Alcance desde plantilla documentada","team","tarea"],
        ["Ejecuta el equipo","team","tarea"],
        ["Revisión con checklist QA","team","decision"],
        ["Visado final (solo cuentas clave)","ceo","tarea"],
        ["Correcciones según SOP","team","tarea"],
        ["Entrega + encuesta auto","auto","fin"]
      ]
    },
    marketing: {
      id:"marketing", name:"Generación de demanda",
      asIs:[
        ["Idea de campaña","ceo","inicio"],
        ["Define mensaje y oferta","ceo","tarea"],
        ["Encarga contenido a freelance","ceo","tarea"],
        ["¿Aprobado por el CEO?","ceo","decision"],
        ["Publica a mano","team","tarea"],
        ["Llega lead suelto, sin medir","client","fin"]
      ],
      toBe:[
        ["Calendario de contenidos","auto","inicio"],
        ["Brief desde plantilla","team","tarea"],
        ["Producción + aprobación ágil","team","decision"],
        ["Publicación programada multicanal","auto","tarea"],
        ["Captación medida (atribución)","auto","tarea"],
        ["Lead calificado al CRM","auto","fin"]
      ]
    },
    finanzas: {
      id:"finanzas", name:"Cierre financiero y cobros",
      asIs:[
        ["Fin de mes","team","inicio"],
        ["CEO revisa y aprueba pagos","ceo","tarea"],
        ["Concilia a mano (Excel)","ceo","tarea"],
        ["¿Cuadra?","ceo","decision"],
        ["Reclama cobros pendientes","team","tarea"],
        ["Cierre mensual lo cierra el CEO","ceo","fin"]
      ],
      toBe:[
        ["Fin de mes","team","inicio"],
        ["Gastos capturados auto (OCR)","auto","tarea"],
        ["Pagos aprobados por umbral","auto","decision"],
        ["Conciliación bancaria automática","auto","tarea"],
        ["Recordatorios de cobro auto","auto","tarea"],
        ["Cuadro de mando en vivo","auto","tarea"],
        ["Visado final del cierre","ceo","fin"]
      ]
    },
    seguridad: {
      id:"seguridad", name:"Altas, bajas y accesos",
      asIs:[
        ["Entra o sale una persona","team","inicio"],
        ["CEO crea o revoca accesos","ceo","tarea"],
        ["Comparte claves por WhatsApp","ceo","tarea"],
        ["¿Todo revocado?","ceo","decision"],
        ["Sin registro de quién accede","team","fin"]
      ],
      toBe:[
        ["Entra o sale una persona","team","inicio"],
        ["Alta/baja desde gestor de identidades","auto","tarea"],
        ["Accesos por rol (SSO)","auto","tarea"],
        ["Revisión trimestral de permisos","team","decision"],
        ["Registro de actividad y MFA","auto","tarea"],
        ["Continuidad garantizada","auto","fin"]
      ]
    }
  },

  meta: { lastUpdated:"Día 4 · síntesis", version:7 }
};
