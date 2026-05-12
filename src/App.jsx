import { useState } from “react”;
import React from “react”;

const SYSTEM_PROMPT = `Eres un agente de inteligencia economica especializado en Ecuador. Tu funcion es monitorear, analizar y explicar el impacto de eventos economicos globales sobre la economia ecuatoriana.

PERFIL DEL USUARIO: Estudiante de economia con mencion en comercio exterior, trabaja en el area de compras e importaciones de una empresa ecuatoriana. Necesita analisis claros, concretos y accionables.

ESTRUCTURA DEL BRIEFING:

BRIEFING ECONOMICO ECUADOR - [FECHA]

TERMOMETRO DEL DIA: ESTABLE / ATENCION / ALERTA

INDICADORES CLAVE

- Petroleo WTI: $XX.XX
- Petroleo Brent: $XX.XX
- Dolar DXY: XXX.XX
- Oro: $X,XXX
- Riesgo Pais Ecuador: XXX puntos
- Tasas FED: X.XX%

NOTICIAS DE IMPACTO
TITULO DE LA NOTICIA
Impacto: ALTO/MEDIO/BAJO | Tipo: POSITIVO/NEGATIVO/MIXTO | Plazo: INMEDIATO/MEDIANO
Que paso: [explicacion clara]
Por que importa: [contexto]
Como afecta a Ecuador: [impacto especifico]
Sectores: [lista]

ALERTAS CRITICAS
[Solo eventos ALTO. Si no hay: Sin alertas criticas hoy.]

CONCLUSION DEL DIA
[Resume lo mas importante y que vigilar esta semana.]

REGLAS:

- Prioriza: petroleo, dolar, aranceles, FED, geopolitica, comercio exterior
- Especifico Ecuador: exportaciones (petroleo, banano, camaron, cacao, flores), importaciones (materias primas, maquinaria, combustibles)
- Sin tecnicismos innecesarios`;

const BRIEFING_PROMPT = `Genera el briefing economico completo para hoy. Busca en internet datos de las ultimas 24 horas sobre: precios petroleo WTI y Brent, dolar DXY, FED, oro, noticias geopoliticas, aranceles, comercio exterior Ecuador y Latinoamerica, riesgo pais Ecuador. Aplica la estructura indicada.`;

const ALERT_PROMPT = `Analiza si esta noticia es una alerta critica para Ecuador. Si el impacto es ALTO genera el analisis completo. Si es bajo, indicalo brevemente.\n\nNoticia:\n`;
const CUSTOM_PROMPT = `Analiza el siguiente tema con contexto economico para Ecuador:\n\n`;

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

function renderLines(text) {
return text.split(”\n”).map((line, i) => {
const clean = line.replace(/**/g, “”).replace(/*/g, “”).trim();
if (!clean) return <div key={i} style={{ height: 8 }} />;
if (clean.match(/^(BRIEFING|TERMOMETRO|INDICADORES|NOTICIAS|ALERTAS|CONCLUSION)/i)) {
return <div key={i} style={{ fontSize: 13, fontWeight: 700, color: “#64b5f6”, letterSpacing: 2, marginTop: 20, marginBottom: 6, borderBottom: “1px solid #1e3a5f”, paddingBottom: 4, textTransform: “uppercase” }}>{clean}</div>;
}
if (clean.match(/^(Que paso|Por que importa|Como afecta|Sectores|Impacto|Tipo|Plazo):/i)) {
return <div key={i} style={{ fontSize: 12, color: “#90b4d4”, marginBottom: 3, marginTop: 6 }}>{clean}</div>;
}
if (clean.startsWith(”-”) || clean.startsWith(”•”)) {
return <div key={i} style={{ paddingLeft: 14, color: “#b8c8d8”, marginBottom: 3, fontSize: 13 }}>{clean}</div>;
}
return <div key={i} style={{ marginBottom: 5, fontSize: 13, color: “#c8d8e8”, lineHeight: 1.75 }}>{clean}</div>;
});
}

const modes = [
{ id: “briefing”, label: “Briefing Diario”, desc: “Reporte del dia” },
{ id: “alert”, label: “Analizar Alerta”, desc: “Evalua una noticia” },
{ id: “custom”, label: “Consulta Libre”, desc: “Pregunta lo que necesites” }
];

return (
<div style={{ minHeight: “100vh”, background: “#0a0e1a”, color: “#e8eaf0”, fontFamily: “Georgia, serif”, margin: 0, padding: 0 }}>
<div style={{ background: “linear-gradient(135deg, #0d1b2a, #1a2744, #0d1b2a)”, borderBottom: “1px solid #1e3a5f”, padding: “24px 28px” }}>
<div style={{ display: “flex”, alignItems: “center”, gap: 8, marginBottom: 6 }}>
<div style={{ width: 9, height: 9, borderRadius: “50%”, background: “#22c55e”, boxShadow: “0 0 8px #22c55e” }} />
<span style={{ fontSize: 11, letterSpacing: 3, color: “#64b5f6”, fontFamily: “monospace”, textTransform: “uppercase” }}>AGENTE ACTIVO</span>
</div>
<h1 style={{ fontSize: 24, fontWeight: 700, margin: “4px 0 2px”, color: “#fff” }}>Inteligencia Economica Ecuador</h1>
<div style={{ fontSize: 12, color: “#7b9cbf”, fontFamily: “monospace” }}>{today.charAt(0).toUpperCase() + today.slice(1)}</div>
</div>

```
  <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 20px" }}>

    <div style={{ marginBottom: 20, padding: "16px", borderRadius: 8, border: "1px solid #1e3a5f", background: "rgba(13,27,42,0.6)" }}>
      <div style={{ fontSize: 11, color: "#64b5f6", fontFamily: "monospace", letterSpacing: 1, marginBottom: 8 }}>API KEY (solo tu la ves)</div>
      <div style={{ display: "flex", gap: 8 }}>
        <input type={showKey ? "text" : "password"} value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-ant-..."
          style={{ flex: 1, padding: "10px 12px", background: "rgba(10,14,26,0.9)", border: apiKey ? "1px solid #22c55e" : "1px solid #1e3a5f", borderRadius: 6, color: "#e8eaf0", fontSize: 13, fontFamily: "monospace", outline: "none" }} />
        <button onClick={() => setShowKey(!showKey)}
          style={{ padding: "10px 14px", borderRadius: 6, border: "1px solid #1e3a5f", background: "transparent", color: "#7b9cbf", fontSize: 12, cursor: "pointer" }}>
          {showKey ? "Ocultar" : "Ver"}
        </button>
      </div>
      {apiKey && <div style={{ fontSize: 11, color: "#22c55e", fontFamily: "monospace", marginTop: 6 }}>Lista para usar</div>}
    </div>

    <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
      {modes.map(m => (
        <button key={m.id} onClick={() => { setMode(m.id); setResult(""); setError(""); setInput(""); }}
          style={{ flex: 1, minWidth: 140, padding: "12px 14px", borderRadius: 8, textAlign: "left", cursor: "pointer",
            border: mode === m.id ? "1px solid #3b82f6" : "1px solid #1e3a5f",
            background: mode === m.id ? "linear-gradient(135deg,#1e3a5f,#1a2e50)" : "rgba(13,27,42,0.6)",
            color: mode === m.id ? "#e8eaf0" : "#7b9cbf" }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{m.label}</div>
          <div style={{ fontSize: 11, opacity: 0.65, fontFamily: "monospace" }}>{m.desc}</div>
        </button>
      ))}
    </div>

    {(mode === "alert" || mode === "custom") && (
      <textarea value={input} onChange={e => setInput(e.target.value)}
        placeholder={mode === "alert" ? "Pega aqui la noticia..." : "Escribe tu consulta economica..."}
        style={{ width: "100%", minHeight: 90, background: "rgba(13,27,42,0.8)", border: "1px solid #1e3a5f", borderRadius: 8, color: "#e8eaf0", padding: "12px 14px", fontSize: 14, fontFamily: "Georgia, serif", resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: 1.6, marginBottom: 14 }} />
    )}

    <button onClick={handleRun} disabled={loading}
      style={{ width: "100%", padding: "15px", borderRadius: 8, border: "none", background: loading ? "rgba(59,130,246,0.3)" : "linear-gradient(135deg, #1d4ed8, #2563eb)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", marginBottom: 20 }}>
      {loading ? "Analizando mercados..." : mode === "briefing" ? "Generar Briefing de Hoy" : mode === "alert" ? "Analizar Alerta" : "Consultar Agente"}
    </button>

    {error && <div style={{ padding: "12px 14px", borderRadius: 8, marginBottom: 14, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", fontSize: 13 }}>{error}</div>}

    {result && (
      <div style={{ background: "rgba(13,27,42,0.8)", border: "1px solid #1e3a5f", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 18px", borderBottom: "1px solid #1e3a5f", background: "rgba(30,58,95,0.3)" }}>
          <span style={{ fontSize: 11, color: "#64b5f6", letterSpacing: 2, fontFamily: "monospace", textTransform: "uppercase" }}>Analisis</span>
          <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #1e3a5f", background: copied ? "rgba(34,197,94,0.2)" : "transparent", color: copied ? "#22c55e" : "#7b9cbf", fontSize: 12, cursor: "pointer" }}>
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
        <div style={{ padding: "22px", fontSize: 14, lineHeight: 1.9, color: "#d1d9e6", fontFamily: "Georgia, serif", maxHeight: "65vh", overflowY: "auto" }}>
          {renderLines(result)}
        </div>
      </div>
    )}
  </div>
  <style>{"body{margin:0}"}</style>
</div>
```

);
}
