import { useState } from “react”;

const SYSTEM_PROMPT = `Eres un agente de inteligencia económica especializado en Ecuador. Tu función es monitorear, analizar y explicar el impacto de eventos económicos globales sobre la economía ecuatoriana.

PERFIL DEL USUARIO: Estudiante de economía con mención en comercio exterior, trabaja en el área de compras e importaciones de una empresa ecuatoriana. Conoce conceptos económicos básicos pero necesita análisis claros, concretos y accionables.

TU ROL:

- Actúas como un analista económico que simplifica información compleja
- No copias noticias, las interpretas y priorizas
- Siempre conectas los eventos globales con el impacto real en Ecuador
- Eres especialmente sensible a temas de importaciones, comercio exterior y materias primas

ESTRUCTURA OBLIGATORIA DEL BRIEFING:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 BRIEFING ECONÓMICO ECUADOR
[FECHA Y HORA]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌡️ TERMÓMETRO DEL DÍA
Una línea con el estado general: ESTABLE / ATENCIÓN / ALERTA

📈 INDICADORES CLAVE
• Petróleo WTI: $XX.XX (▲/▼ X%)
• Petróleo Brent: $XX.XX (▲/▼ X%)
• Índice Dólar DXY: XXX.XX
• Oro: $X,XXX
• Riesgo País Ecuador: XXX puntos
• Tasas FED: X.XX%

🌍 NOTICIAS DE IMPACTO
Para CADA noticia relevante:

[EMOJI] TÍTULO
Nivel de impacto: 🔴 ALTO / 🟡 MEDIO / 🟢 BAJO
Tipo: POSITIVO / NEGATIVO / MIXTO
Plazo: INMEDIATO / MEDIANO PLAZO

¿Qué pasó? [1-2 oraciones]
¿Por qué importa? [1-2 oraciones]
¿Cómo afecta a Ecuador? [2-3 oraciones]
Sectores afectados: [lista]

⚡ ALERTAS CRÍTICAS
Solo si hay eventos de impacto ALTO. Si no: “Sin alertas críticas hoy.”

🎯 CONCLUSIÓN DEL DÍA
3-4 oraciones con lo más importante y qué vigilar esta semana.

REGLAS:

- Prioriza: comercio exterior, petróleo, dólar, aranceles, FED, geopolítica
- Sé específico para Ecuador: exportaciones (petróleo, banano, camarón, cacao, flores), importaciones (materias primas, maquinaria, combustibles)
- Sin tecnicismos innecesarios
- Si algo es incierto, dilo`;

const BRIEFING_PROMPT = `Genera el briefing económico completo para hoy. Busca en internet las noticias y datos más recientes de las últimas 24 horas sobre:

1. Precios del petróleo WTI y Brent
1. Índice dólar DXY
1. Decisiones o declaraciones de la FED
1. Precio del oro
1. Noticias geopolíticas con impacto económico
1. Aranceles o cambios en política comercial internacional
1. Noticias de comercio exterior para Latinoamérica y Ecuador
1. Riesgo país Ecuador

Aplica la estructura indicada en tus instrucciones.`;

const ALERT_PROMPT = `Analiza la siguiente noticia y determina si es una alerta crítica para Ecuador. Si el impacto es ALTO o CRÍTICO, genera el análisis completo. Si es bajo, indícalo brevemente.\n\nNoticia:\n`;
const CUSTOM_PROMPT = `Analiza el siguiente tema con contexto económico para Ecuador, usando la estructura del briefing:\n\n`;

export default function App() {
const [mode, setMode] = useState(“briefing”);
const [input, setInput] = useState(””);
const [result, setResult] = useState(””);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(””);
const [copied, setCopied] = useState(false);
const [apiKey, setApiKey] = useState(””);
const [showKey, setShowKey] = useState(false);

const today = new Date().toLocaleDateString(“es-EC”, {
weekday: “long”, year: “numeric”, month: “long”, day: “numeric”
});

async function runAgent(userMessage) {
if (!apiKey.trim()) { setError(“Ingresa tu API Key primero.”); return; }
setLoading(true); setResult(””); setError(””);
try {
const res = await fetch(“https://api.anthropic.com/v1/messages”, {
method: “POST”,
headers: {
“Content-Type”: “application/json”,
“x-api-key”: apiKey.trim(),
“anthropic-version”: “2023-06-01”,
“anthropic-dangerous-direct-browser-access”: “true”
},
body: JSON.stringify({
model: “claude-haiku-4-5-20251001”,
max_tokens: 2000,
system: SYSTEM_PROMPT,
tools: [{ type: “web_search_20250305”, name: “web_search” }],
messages: [{ role: “user”, content: userMessage }]
})
});
const data = await res.json();
if (data.error) throw new Error(data.error.message);
const text = data.content.filter(b => b.type === “text”).map(b => b.text).join(”\n”);
setResult(text || “Sin respuesta.”);
} catch (e) {
setError(“Error: “ + e.message);
} finally {
setLoading(false);
}
}

function handleRun() {
if (mode === “briefing”) runAgent(BRIEFING_PROMPT);
else if (mode === “alert”) { if (!input.trim()) { setError(“Ingresa la noticia.”); return; } runAgent(ALERT_PROMPT + input); }
else { if (!input.trim()) { setError(“Ingresa tu consulta.”); return; } runAgent(CUSTOM_PROMPT + input); }
}

const s = {
page: { minHeight: “100vh”, background: “#0a0e1a”, color: “#e8eaf0”, fontFamily: “Georgia, serif”, margin: 0, padding: 0 },
header: { background: “linear-gradient(135deg, #0d1b2a, #1a2744, #0d1b2a)”, borderBottom: “1px solid #1e3a5f”, padding: “24px 28px” },
dot: { width: 9, height: 9, borderRadius: “50%”, background: “#22c55e”, boxShadow: “0 0 8px #22c55e”, display: “inline-block”, marginRight: 8 },
h1: { fontSize: 24, fontWeight: 700, margin: “4px 0 2px”, color: “#fff” },
date: { fontSize: 12, color: “#7b9cbf”, fontFamily: “monospace” },
body: { maxWidth: 820, margin: “0 auto”, padding: “24px 20px” },
keyBox: { marginBottom: 20, padding: “16px”, borderRadius: 8, border: “1px solid #1e3a5f”, background: “rgba(13,27,42,0.6)” },
keyLabel: { fontSize: 11, color: “#64b5f6”, fontFamily: “monospace”, letterSpacing: 1, marginBottom: 8 },
keyRow: { display: “flex”, gap: 8 },
keyInput: { flex: 1, padding: “10px 12px”, background: “rgba(10,14,26,0.9)”, border: “1px solid #1e3a5f”, borderRadius: 6, color: “#e8eaf0”, fontSize: 13, fontFamily: “monospace”, outline: “none” },
modes: { display: “flex”, gap: 8, marginBottom: 20, flexWrap: “wrap” },
textarea: { width: “100%”, minHeight: 90, background: “rgba(13,27,42,0.8)”, border: “1px solid #1e3a5f”, borderRadius: 8, color: “#e8eaf0”, padding: “12px 14px”, fontSize: 14, fontFamily: “Georgia, serif”, resize: “vertical”, outline: “none”, boxSizing: “border-box”, lineHeight: 1.6, marginBottom: 14 },
btn: { width: “100%”, padding: “15px”, borderRadius: 8, border: “none”, background: “linear-gradient(135deg, #1d4ed8, #2563eb)”, color: “#fff”, fontSize: 15, fontWeight: 700, cursor: “pointer”, marginBottom: 20 },
btnDisabled: { width: “100%”, padding: “15px”, borderRadius: 8, border: “none”, background: “rgba(59,130,246,0.3)”, color: “#fff”, fontSize: 15, fontWeight: 700, cursor: “not-allowed”, marginBottom: 20 },
error: { padding: “12px 14px”, borderRadius: 8, marginBottom: 14, background: “rgba(239,68,68,0.1)”, border: “1px solid rgba(239,68,68,0.3)”, color: “#fca5a5”, fontSize: 13 },
resultBox: { background: “rgba(13,27,42,0.8)”, border: “1px solid #1e3a5f”, borderRadius: 10, overflow: “hidden” },
resultHeader: { display: “flex”, justifyContent: “space-between”, alignItems: “center”, padding: “10px 18px”, borderBottom: “1px solid #1e3a5f”, background: “rgba(30,58,95,0.3)” },
resultText: { padding: “22px”, fontSize: 14, lineHeight: 1.9, color: “#d1d9e6”, fontFamily: “Georgia, serif”, maxHeight: “65vh”, overflowY: “auto” },
};

function renderResult(text) {
const lines = text.split(”\n”);
return lines.map((line, i) => {
const clean = line.replace(/**/g, “”).replace(/*/g, “”).trim();
if (!clean) return <div key={i} style={{ height: 8 }} />;
if (clean.match(/^[━─]{3,}/)) return <hr key={i} style={{ border: “none”, borderTop: “1px solid #1e3a5f”, margin: “10px 0” }} />;
if (clean.match(/^(📊|🌡️|📈|🌍|⚡|🎯)/)) return <div key={i} style={{ fontSize: 16, fontWeight: 700, color: “#ffffff”, margin: “18px 0 6px”, letterSpacing: 0.3 }}>{clean}</div>;
if (clean.match(/^(🛢️|💵|🏦|🌐|📉|📦|🔔|⚠️|💡|🗺️|📌)/)) return <div key={i} style={{ fontSize: 14, fontWeight: 700, color: “#e2e8f0”, margin: “12px 0 4px” }}>{clean}</div>;
if (clean.match(/^(Nivel|Tipo|Plazo|Sectores):/)) return <div key={i} style={{ fontSize: 12, color: “#64b5f6”, fontFamily: “monospace”, marginBottom: 3 }}>{clean}</div>;
if (clean.match(/^(¿Qué pasó|¿Por qué importa|¿Cómo afecta)/)) return <div key={i} style={{ fontSize: 13, fontWeight: 700, color: “#90b4d4”, marginTop: 8, marginBottom: 2 }}>{clean}</div>;
if (clean.startsWith(”•”) || clean.startsWith(”-”)) return <div key={i} style={{ paddingLeft: 16, color: “#b8c8d8”, marginBottom: 3, fontSize: 13 }}>{clean}</div>;
return <div key={i} style={{ marginBottom: 4, fontSize: 13, color: “#c8d8e8”, lineHeight: 1.75 }}>{clean}</div>;
});
}

const modes = [
{ id: “briefing”, label: “📊 Briefing Diario”, desc: “Reporte completo del día” },
{ id: “alert”, label: “⚡ Analizar Alerta”, desc: “Evalúa una noticia” },
{ id: “custom”, label: “🔍 Consulta Libre”, desc: “Pregunta lo que necesites” },
];

return (
<div style={s.page}>
<div style={s.header}>
<div><span style={s.dot} />
<span style={{ fontSize: 11, letterSpacing: 3, color: “#64b5f6”, fontFamily: “monospace”, textTransform: “uppercase” }}>AGENTE ACTIVO</span>
</div>
<h1 style={s.h1}>Inteligencia Económica Ecuador</h1>
<div style={s.date}>{today.charAt(0).toUpperCase() + today.slice(1)}</div>
</div>

```
  <div style={s.body}>
    {/* API Key */}
    <div style={s.keyBox}>
      <div style={s.keyLabel}>🔑 API KEY (solo tú la ves)</div>
      <div style={s.keyRow}>
        <input type={showKey ? "text" : "password"} value={apiKey} onChange={e => setApiKey(e.target.value)}
          placeholder="sk-ant-..." style={{ ...s.keyInput, border: apiKey ? "1px solid #22c55e" : "1px solid #1e3a5f" }} />
        <button onClick={() => setShowKey(!showKey)}
          style={{ padding: "10px 14px", borderRadius: 6, border: "1px solid #1e3a5f", background: "transparent", color: "#7b9cbf", fontSize: 12, cursor: "pointer" }}>
          {showKey ? "Ocultar" : "Ver"}
        </button>
      </div>
      {apiKey && <div style={{ fontSize: 11, color: "#22c55e", fontFamily: "monospace", marginTop: 6 }}>✓ Lista para usar</div>}
    </div>

    {/* Modes */}
    <div style={s.modes}>
      {modes.map(m => (
        <button key={m.id} onClick={() => { setMode(m.id); setResult(""); setError(""); setInput(""); }}
          style={{ flex: 1, minWidth: 160, padding: "12px 14px", borderRadius: 8, textAlign: "left", cursor: "pointer", transition: "all 0.2s",
            border: mode === m.id ? "1px solid #3b82f6" : "1px solid #1e3a5f",
            background: mode === m.id ? "linear-gradient(135deg,#1e3a5f,#1a2e50)" : "rgba(13,27,42,0.6)",
            color: mode === m.id ? "#e8eaf0" : "#7b9cbf" }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{m.label}</div>
          <div style={{ fontSize: 11, opacity: 0.65, fontFamily: "monospace" }}>{m.desc}</div>
        </button>
      ))}
    </div>

    {/* Text input */}
    {(mode === "alert" || mode === "custom") && (
      <textarea value={input} onChange={e => setInput(e.target.value)} style={s.textarea}
        placeholder={mode === "alert" ? "Pega aquí la noticia a analizar..." : "Escribe tu consulta económica..."} />
    )}

    {/* Button */}
    <button onClick={handleRun} disabled={loading} style={loading ? s.btnDisabled : s.btn}>
      {loading ? "⟳  Analizando mercados..." : mode === "briefing" ? "▶  Generar Briefing de Hoy" : mode === "alert" ? "⚡  Analizar Alerta" : "🔍  Consultar Agente"}
    </button>

    {error && <div style={s.error}>{error}</div>}

    {result && (
      <div style={s.resultBox}>
        <div style={s.resultHeader}>
          <span style={{ fontSize: 11, color: "#64b5f6", letterSpacing: 2, fontFamily: "monospace", textTransform: "uppercase" }}>Análisis</span>
          <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #1e3a5f", background: copied ? "rgba(34,197,94,0.2)" : "transparent", color: copied ? "#22c55e" : "#7b9cbf", fontSize: 12, cursor: "pointer" }}>
            {copied ? "✓ Copiado" : "Copiar"}
          </button>
        </div>
        <div style={s.resultText}>{renderResult(result)}</div>
      </div>
    )}
  </div>
  <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}} body{margin:0}`}</style>
</div>
```

);
}
