resultText: { padding: "22px", fontSize: 13, lineHeight: 1.9, whiteSpace: "pre-wrap", color: "#d1d9e6", fontFamily: "monospace", maxHeight: "65vh", overflowY: "auto" },
  };

  const modes = [
    { id: "briefing", label: "📊 Briefing Diario", desc: "Reporte completo del día" },
    { id: "alert", label: "⚡ Analizar Alerta", desc: "Evalúa una noticia" },
    { id: "custom", label: "🔍 Consulta Libre", desc: "Pregunta lo que necesites" },
  ];

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div><span style={s.dot} />
          <span style={{ fontSize: 11, letterSpacing: 3, color: "#64b5f6", fontFamily: "monospace", textTransform: "uppercase" }}>AGENTE ACTIVO</span>
        </div>
        <h1 style={s.h1}>Inteligencia Económica Ecuador</h1>
        <div style={s.date}>{today.charAt(0).toUpperCase() + today.slice(1)}</div>
      </div>

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
            <div style={s.resultText}>{result}</div>
          </div>
        )}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}} body{margin:0}`}</style>
    </div>
  );
}
