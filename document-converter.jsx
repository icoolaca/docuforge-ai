import { useState, useRef, useCallback } from "react";

/* ─── defaults ─── */
const DEF_HEADER = { companyName: "Your Company Name", tagline: "Document Report", logo: "" };
const DEF_FOOTER = { line1: "Company Address • City, State ZIP", line2: "Phone: (000) 000-0000 • Email: info@company.com" };
const DEF_COLORS = { primary: "#1e3a5f", accent: "#2b6cb0", accentLight: "#e8f1fb", surface: "#f5f7fa", text: "#1a2332", text2: "#4a5568", text3: "#8896a6", border: "#dfe4ec" };

const PRESETS = [
  { label: "Spec Sheet", prompt: "Organize this as a product specification sheet. Group features separately from technical specs. Use spec-type sections with label/value pairs for all numerical data." },
  { label: "Financial Report", prompt: "Organize this as a financial report. Highlight monetary values, group by categories, and add a summary section at top." },
  { label: "Inventory List", prompt: "Treat this as an inventory/parts list. Create a comprehensive table with all items and highlight key columns." },
  { label: "General Extract", prompt: "Extract all information and organize into the most logical sections. Detect the document type automatically." },
];

/* ─── tiny SVG icons ─── */
const Ico = ({ children, size = 16, sw = 2, stroke = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const UploadIco = () => <Ico size={42} sw={1.5} stroke="#2b6cb0"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></Ico>;
const FileIco = () => <Ico><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></Ico>;
const BoltIco = () => <Ico><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Ico>;
const PrintIco = () => <Ico size={15}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></Ico>;
const RefreshIco = () => <Ico size={14}><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></Ico>;
const DlIco = () => <Ico size={15}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></Ico>;
const PalIco = () => <Ico size={15}><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></Ico>;
const ImgIco = () => <Ico size={15}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></Ico>;

/* shared CSS */
function getSharedCSS() {
  return `
*{box-sizing:border-box;margin:0;padding:0}
.dc-page{max-width:960px;width:100%;margin:0 auto;background:#fff;border-radius:10px;box-shadow:0 2px 12px rgba(0,0,0,.07);overflow:hidden}
.dc-header{padding:24px 5%;border-bottom:3px solid var(--c-primary);display:flex;align-items:center;gap:14px;position:relative}
.dc-header-logo{height:44px;width:auto;max-width:120px;object-fit:contain;border-radius:4px;flex-shrink:0}
.dc-header-company{font-size:clamp(17px,2.5vw,22px);font-weight:700;color:var(--c-primary);letter-spacing:-.3px}
.dc-header-tagline{font-size:clamp(11px,1.4vw,13px);color:var(--c-text3);margin-top:2px;font-weight:500;text-transform:uppercase;letter-spacing:.5px}
.dc-doc-title{padding:clamp(16px,3vw,24px) 5% 4px;font-size:clamp(16px,2.2vw,20px);font-weight:700;color:var(--c-text)}
.dc-doc-summary{padding:0 5% clamp(14px,2vw,20px);font-size:clamp(12px,1.5vw,14px);color:var(--c-text2);line-height:1.55}
.dc-section{padding:0 5% clamp(20px,3vw,28px)}
.dc-section-heading{display:inline-block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:var(--c-accent);border:1.5px solid var(--c-accent);border-radius:4px;padding:4px 14px;margin-bottom:14px}
.dc-features{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:6px 28px}
.dc-feature-item{font-size:14px;color:var(--c-text);padding:5px 0 5px 18px;position:relative;line-height:1.45}
.dc-feature-item::before{content:'•';position:absolute;left:0;color:var(--c-accent);font-weight:700}
.dc-spec-wrap{overflow-x:auto}
.dc-spec-table{width:100%;border-collapse:collapse;min-width:400px}
.dc-spec-table tr{border-bottom:1px solid var(--c-border)}
.dc-spec-table tr:nth-child(even){background:var(--c-surface)}
.dc-spec-table tr:last-child{border-bottom:none}
.dc-spec-table td{padding:10px clamp(10px,2vw,16px);font-size:14px;vertical-align:middle}
.dc-spec-label{font-weight:600;color:var(--c-text);text-transform:uppercase;font-size:12px;letter-spacing:.4px;width:35%}
.dc-spec-value{color:var(--c-accent);font-weight:600;font-family:'JetBrains Mono',monospace;font-size:14px;text-align:right;width:15%;padding-right:clamp(12px,3vw,28px)}
@media(max-width:600px){.dc-spec-table{min-width:0}.dc-spec-table tr{display:flex;flex-wrap:wrap;padding:6px 0}.dc-spec-table td{width:auto!important;padding:4px 12px}.dc-spec-label{flex:1 1 55%}.dc-spec-value{flex:1 1 45%;text-align:left;padding-right:0}}
.dc-table-wrap{overflow-x:auto;border:1px solid var(--c-border);border-radius:6px;-webkit-overflow-scrolling:touch}
.dc-data-table{width:100%;border-collapse:collapse;font-size:13px;min-width:360px}
.dc-data-table thead th{background:var(--c-accent);color:#fff;padding:10px 14px;text-align:left;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.4px;white-space:nowrap;position:sticky;top:0}
.dc-data-table tbody td{padding:9px 14px;border-bottom:1px solid var(--c-border);color:var(--c-text)}
.dc-data-table tbody tr:nth-child(even){background:var(--c-surface)}
.dc-data-table tbody tr:hover{background:var(--c-accent-light)}
.dc-text-body{font-size:14px;line-height:1.7;color:var(--c-text2)}
.dc-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:6px 20px}
.dc-kv-item{display:flex;justify-content:space-between;padding:8px 12px;border-radius:4px;font-size:14px;gap:12px}
.dc-kv-item:nth-child(odd){background:var(--c-surface)}
.dc-kv-key{font-weight:600;color:var(--c-text)}
.dc-kv-val{color:var(--c-accent);font-weight:500;font-family:'JetBrains Mono',monospace;text-align:right}
.dc-notes{background:#fffbeb;border-left:3px solid #dd6b20;border-radius:0 6px 6px 0;padding:14px 18px;list-style:none}
.dc-notes li{font-size:13px;color:var(--c-text2);margin-bottom:4px;padding-left:18px;position:relative}
.dc-notes li::before{content:'⚠';position:absolute;left:0;font-size:11px}
.dc-img-placeholder{border:2px dashed var(--c-border);border-radius:8px;padding:24px;text-align:center;color:var(--c-text3);font-size:13px;background:var(--c-surface);margin-bottom:8px}
.dc-footer{padding:20px 5%;border-top:2px solid var(--c-border);background:var(--c-surface);text-align:center;position:relative}
.dc-footer p{font-size:12px;color:var(--c-text3);line-height:1.6}
`;
}

export default function DocumentConverter() {
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [progress, setProgress] = useState("");
  const [sections, setSections] = useState(null);
  const [error, setError] = useState("");
  const [header, setHeader] = useState(DEF_HEADER);
  const [footer, setFooter] = useState(DEF_FOOTER);
  const [colors, setColors] = useState(DEF_COLORS);
  const [editingHeader, setEditingHeader] = useState(false);
  const [editingFooter, setEditingFooter] = useState(false);
  const [showBranding, setShowBranding] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [activePreset, setActivePreset] = useState(null);
  const pageRef = useRef();

  const cssVars = {
    "--c-primary": colors.primary, "--c-accent": colors.accent, "--c-accent-light": colors.accentLight,
    "--c-surface": colors.surface, "--c-text": colors.text, "--c-text2": colors.text2,
    "--c-text3": colors.text3, "--c-border": colors.border,
  };

  const onDrop = useCallback((e) => {
    e.preventDefault(); e.currentTarget.classList.remove("dragover");
    const f = e.dataTransfer?.files?.[0]; if (f) handleFile(f);
  }, []);

  const handleFile = (f) => {
    const ext = f.name.split(".").pop().toLowerCase();
    if (!["csv", "pdf"].includes(ext)) { setError("Please upload a CSV or PDF file."); return; }
    setError(""); setFile(f); setSections(null);
  };

  const handleLogoUpload = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setHeader(h => ({ ...h, logo: reader.result }));
    reader.readAsDataURL(f);
  };

  const processFile = async () => {
    if (!file) return;
    setParsing(true); setProgress("Reading file…"); setError("");
    try {
      const ext = file.name.split(".").pop().toLowerCase();
      let userContent;
      if (ext === "csv") {
        const text = await file.text();
        userContent = [{ type: "text", text: `CSV file "${file.name}":\n\n${text}` }];
      } else {
        const b64 = await new Promise((res, rej) => {
          const r = new FileReader(); r.onload = () => res(r.result.split(",")[1]); r.onerror = () => rej(new Error("Read failed")); r.readAsDataURL(file);
        });
        userContent = [
          { type: "document", source: { type: "base64", media_type: "application/pdf", data: b64 } },
          { type: "text", text: `PDF file "${file.name}". Extract every piece of information.` },
        ];
      }
      const extra = customPrompt.trim() ? `\n\nUSER INSTRUCTIONS: ${customPrompt.trim()}` : "";
      setProgress("AI is analyzing your document…");
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 4096,
          system: `You are a document parsing engine. Extract ALL information and return ONLY valid JSON (no markdown fences, no preamble):
{"title":"...","summary":"...","sections":[{"id":"<unique>","type":"features"|"specs"|"table"|"text"|"key-values"|"notes"|"images","heading":"...","content":<by type>}]}
Types: features:{"items":[]} specs:{"rows":[{"label":"","value":""}]} table:{"headers":[],"rows":[[]]} text:{"body":""} key-values:{"pairs":[{"key":"","value":""}]} notes:{"items":[]} images:{"descriptions":[{"alt":"","caption":""}]}
Rules: Extract EVERY detail. CSVs→table with ALL rows. Preserve numbers/units. Return raw JSON only.${extra}`,
          messages: [{ role: "user", content: userContent }],
        }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      const raw = data.content.filter(b => b.type === "text").map(b => b.text).join("").replace(/```json|```/g, "").trim();
      setSections(JSON.parse(raw)); setProgress("");
    } catch (err) { setError("Parsing failed — " + err.message); }
    finally { setParsing(false); }
  };

  const exportHTML = () => {
    const el = pageRef.current; if (!el) return;
    const cv = Object.entries(cssVars).map(([k,v]) => `${k}:${v}`).join(";");
    const cleaned = el.outerHTML.replace(/<button[^>]*class="[^"]*no-print[^"]*"[^>]*>[\s\S]*?<\/button>/g, "");
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${sections?.title||"Document"}</title><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"><style>:root{${cv}}body{font-family:'DM Sans',system-ui,sans-serif;color:var(--c-text);background:var(--c-surface);margin:0;padding:clamp(12px,3vw,32px)}${getSharedCSS()}@media print{body{background:#fff!important;padding:0}.dc-page{box-shadow:none!important;border-radius:0!important;max-width:100%!important}.dc-section{break-inside:avoid}}</style></head><body>${cleaned}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `${(sections?.title||"document").replace(/[^a-z0-9 ]/gi,"").replace(/\s+/g,"-").toLowerCase()}.html`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const pickPreset = (i) => { setActivePreset(i); setCustomPrompt(PRESETS[i].prompt); };
  const reset = () => { setFile(null); setSections(null); setError(""); setProgress(""); setCustomPrompt(""); setActivePreset(null); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=JetBrains+Mono:wght@400;500&display=swap');
        :root{${Object.entries(cssVars).map(([k,v])=>`${k}:${v}`).join(";")}}
        ${getSharedCSS()}
        .dc-root{font-family:'DM Sans',system-ui,sans-serif;color:var(--c-text);min-height:100vh;padding:clamp(10px,2vw,20px)}
        .dc-upload-area{max-width:640px;margin:24px auto 0}
        .dc-upload-zone{border:2px dashed var(--c-border);border-radius:14px;padding:44px 32px;text-align:center;background:#fff;transition:all .2s;cursor:pointer}
        .dc-upload-zone:hover,.dc-upload-zone.dragover{border-color:var(--c-accent);background:var(--c-accent-light)}
        .dc-upload-zone h2{font-size:17px;font-weight:600;margin:10px 0 4px;color:var(--c-text)}
        .dc-upload-zone p{color:var(--c-text3);font-size:13px}
        .dc-prompt-section{margin-top:18px;background:#fff;border:1px solid var(--c-border);border-radius:10px;padding:16px 18px}
        .dc-prompt-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--c-text3);margin-bottom:8px;display:flex;align-items:center;gap:6px}
        .dc-prompt-presets{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
        .dc-preset{padding:5px 13px;border-radius:20px;border:1px solid var(--c-border);background:#fff;font-family:inherit;font-size:12px;font-weight:500;color:var(--c-text2);cursor:pointer;transition:all .15s}
        .dc-preset:hover{border-color:var(--c-accent);color:var(--c-accent)}
        .dc-preset.active{background:var(--c-accent);color:#fff;border-color:var(--c-accent)}
        .dc-prompt-input{width:100%;border:1px solid var(--c-border);border-radius:8px;padding:10px 14px;font-family:inherit;font-size:13px;color:var(--c-text);resize:vertical;min-height:52px;outline:none;transition:border-color .15s}
        .dc-prompt-input:focus{border-color:var(--c-accent)}
        .dc-prompt-input::placeholder{color:var(--c-text3)}
        .dc-file-row{display:flex;align-items:center;justify-content:space-between;margin-top:14px;gap:12px;flex-wrap:wrap}
        .dc-file-pill{display:inline-flex;align-items:center;gap:8px;background:var(--c-accent-light);border-radius:20px;padding:5px 16px;font-size:13px;font-weight:500;color:var(--c-accent)}
        .dc-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border:none;border-radius:6px;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;white-space:nowrap}
        .dc-btn-primary{background:var(--c-accent);color:#fff}
        .dc-btn-primary:hover{filter:brightness(.88)}
        .dc-btn-primary:disabled{opacity:.4;cursor:not-allowed}
        .dc-btn-secondary{background:#fff;color:var(--c-text);border:1px solid var(--c-border)}
        .dc-btn-secondary:hover{background:var(--c-surface)}
        .dc-btn-ghost{background:none;color:var(--c-accent);padding:4px 8px;font-size:12px;border-radius:4px}
        .dc-btn-ghost:hover{background:var(--c-accent-light)}
        .dc-toolbar{max-width:960px;margin:0 auto 12px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}
        .dc-tb-group{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
        .dc-brand-panel{max-width:960px;margin:0 auto 12px;background:#fff;border:1px solid var(--c-border);border-radius:10px;padding:18px 22px;animation:dc-slideD .2s ease}
        @keyframes dc-slideD{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        .dc-brand-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:12px;margin-top:12px}
        .dc-cf label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--c-text3);margin-bottom:3px}
        .dc-cf-row{display:flex;align-items:center;gap:6px}
        .dc-swatch{width:30px;height:30px;border-radius:6px;border:2px solid var(--c-border);cursor:pointer;overflow:hidden;position:relative;flex-shrink:0}
        .dc-swatch input[type="color"]{opacity:0;position:absolute;inset:0;width:100%;height:100%;cursor:pointer}
        .dc-hex{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--c-text2);width:72px;padding:5px 6px;border:1px solid var(--c-border);border-radius:4px;outline:none}
        .dc-hex:focus{border-color:var(--c-accent)}
        .dc-logo-row{display:flex;align-items:center;gap:12px;margin-top:14px;padding-top:14px;border-top:1px solid var(--c-border)}
        .dc-logo-prev{width:48px;height:48px;border-radius:8px;border:1px solid var(--c-border);object-fit:contain;background:#fff}
        .dc-brand-title{font-size:13px;font-weight:700;color:var(--c-text);display:flex;align-items:center;gap:6px}
        .dc-progress{max-width:600px;margin:48px auto;text-align:center}
        .dc-spinner{width:34px;height:34px;border:3px solid var(--c-border);border-top-color:var(--c-accent);border-radius:50%;animation:dc-spin .75s linear infinite;margin:0 auto 14px}
        @keyframes dc-spin{to{transform:rotate(360deg)}}
        .dc-error{max-width:640px;margin:12px auto;background:#fff5f5;color:#c53030;padding:10px 16px;border-radius:8px;font-size:13px;border:1px solid #fed7d7}
        .dc-overlay{position:fixed;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;z-index:999}
        .dc-modal{background:#fff;border-radius:14px;padding:26px;width:440px;max-width:92vw;box-shadow:0 20px 50px rgba(0,0,0,.18)}
        .dc-modal h3{font-size:16px;font-weight:700;margin-bottom:14px;color:var(--c-text)}
        .dc-modal label{display:block;font-size:11px;font-weight:600;color:var(--c-text3);text-transform:uppercase;letter-spacing:.5px;margin:12px 0 4px}
        .dc-modal input[type="text"]{width:100%;padding:8px 12px;border:1px solid var(--c-border);border-radius:6px;font-family:inherit;font-size:14px;color:var(--c-text);outline:none}
        .dc-modal input:focus{border-color:var(--c-accent)}
        .dc-modal-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:18px}
        @media print{body{background:#fff!important}.dc-root{padding:0!important}.dc-toolbar,.dc-upload-area,.dc-brand-panel,.no-print,.dc-prompt-section{display:none!important}.dc-page{box-shadow:none!important;border-radius:0!important;max-width:100%!important}.dc-section{break-inside:avoid}.dc-data-table thead th,.dc-spec-table tr:nth-child(even),.dc-data-table tbody tr:nth-child(even),.dc-header,.dc-footer{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
      `}</style>

      <div className="dc-root" style={cssVars}>
        {!sections && !parsing && (
          <div className="dc-upload-area">
            <div className="dc-upload-zone" onDrop={onDrop} onDragOver={e=>{e.preventDefault();e.currentTarget.classList.add("dragover")}} onDragLeave={e=>e.currentTarget.classList.remove("dragover")} onClick={()=>document.getElementById("dc-fi").click()}>
              <input id="dc-fi" type="file" accept=".csv,.pdf" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])} />
              <UploadIco /><h2>Upload CSV or PDF</h2><p>Drag & drop or click to browse</p>
            </div>
            <div className="dc-prompt-section">
              <div className="dc-prompt-label"><BoltIco /> AI Instructions</div>
              <div className="dc-prompt-presets">{PRESETS.map((p,i)=><button key={i} className={`dc-preset${activePreset===i?" active":""}`} onClick={()=>pickPreset(i)}>{p.label}</button>)}</div>
              <textarea className="dc-prompt-input" placeholder="e.g. 'Focus on pricing and sort by category'…" value={customPrompt} onChange={e=>{setCustomPrompt(e.target.value);setActivePreset(null)}} />
            </div>
            {file && <div className="dc-file-row"><div className="dc-file-pill"><FileIco /> {file.name}</div><button className="dc-btn dc-btn-primary" onClick={processFile}><BoltIco /> Parse & Generate</button></div>}
            {error && <div className="dc-error">{error}</div>}
          </div>
        )}

        {parsing && <div className="dc-progress"><div className="dc-spinner"/><p style={{color:"var(--c-text2)",fontSize:14,fontWeight:500}}>{progress}</p></div>}

        {sections && !parsing && (
          <>
            <div className="dc-toolbar no-print">
              <div className="dc-tb-group"><button className="dc-btn dc-btn-secondary" onClick={reset}><RefreshIco/> New File</button><button className="dc-btn dc-btn-secondary" onClick={()=>setShowBranding(!showBranding)}><PalIco/> Branding</button><span style={{fontSize:12,color:"var(--c-text3)"}}>{file?.name}</span></div>
              <div className="dc-tb-group"><button className="dc-btn dc-btn-secondary" onClick={exportHTML}><DlIco/> Download HTML</button><button className="dc-btn dc-btn-primary" onClick={()=>window.print()}><PrintIco/> Print / PDF</button></div>
            </div>
            {showBranding && (
              <div className="dc-brand-panel no-print">
                <div className="dc-brand-title"><PalIco/> Branding & Colors</div>
                <div className="dc-brand-grid">
                  {[["primary","Primary"],["accent","Accent"],["accentLight","Accent Light"],["surface","Background"],["text","Text"],["text2","Text 2nd"],["border","Borders"]].map(([k,l])=>(
                    <div key={k} className="dc-cf"><label>{l}</label><div className="dc-cf-row"><div className="dc-swatch" style={{background:colors[k]}}><input type="color" value={colors[k]} onChange={e=>setColors(c=>({...c,[k]:e.target.value}))}/></div><input className="dc-hex" value={colors[k]} onChange={e=>setColors(c=>({...c,[k]:e.target.value}))}/></div></div>
                  ))}
                </div>
                <div className="dc-logo-row">
                  <label style={{fontSize:12,fontWeight:600,color:"var(--c-text2)",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}><ImgIco/> Upload Logo<input type="file" accept="image/*" style={{display:"none"}} onChange={handleLogoUpload}/></label>
                  {header.logo && <img src={header.logo} alt="Logo" className="dc-logo-prev"/>}
                  {header.logo && <button className="dc-btn dc-btn-ghost" onClick={()=>setHeader(h=>({...h,logo:""}))}>Remove</button>}
                </div>
              </div>
            )}
            <div className="dc-page" ref={pageRef} style={cssVars}>
              <div className="dc-header">
                {header.logo && <img src={header.logo} alt="Logo" className="dc-header-logo"/>}
                <div style={{flex:1}}><div className="dc-header-company">{header.companyName}</div><div className="dc-header-tagline">{header.tagline}</div></div>
                <button className="dc-btn dc-btn-ghost no-print" onClick={()=>setEditingHeader(true)}>✏️ Edit</button>
              </div>
              <div className="dc-doc-title">{sections.title}</div>
              {sections.summary && <div className="dc-doc-summary">{sections.summary}</div>}
              {sections.sections?.map(sec=>(
                <div key={sec.id} className="dc-section">
                  <div className="dc-section-heading">{sec.heading}</div>
                  {sec.type==="features" && <div className="dc-features">{sec.content.items?.map((it,i)=><div key={i} className="dc-feature-item">{it}</div>)}</div>}
                  {sec.type==="specs" && <div className="dc-spec-wrap"><table className="dc-spec-table"><tbody>{(()=>{const r=sec.content.rows||[];const p=[];for(let i=0;i<r.length;i+=2)p.push([r[i],r[i+1]||null]);return p.map(([l,rt],i)=><tr key={i}><td className="dc-spec-label">{l.label}</td><td className="dc-spec-value">{l.value}</td>{rt?<><td className="dc-spec-label">{rt.label}</td><td className="dc-spec-value">{rt.value}</td></>:<><td/><td/></>}</tr>)})()}</tbody></table></div>}
                  {sec.type==="table" && <div className="dc-table-wrap"><table className="dc-data-table"><thead><tr>{sec.content.headers?.map((h,i)=><th key={i}>{h}</th>)}</tr></thead><tbody>{sec.content.rows?.map((row,ri)=><tr key={ri}>{row.map((c,ci)=><td key={ci}>{c}</td>)}</tr>)}</tbody></table></div>}
                  {sec.type==="text" && <div className="dc-text-body">{sec.content.body}</div>}
                  {sec.type==="key-values" && <div className="dc-kv-grid">{sec.content.pairs?.map((p,i)=><div key={i} className="dc-kv-item"><span className="dc-kv-key">{p.key}</span><span className="dc-kv-val">{p.value}</span></div>)}</div>}
                  {sec.type==="notes" && <ul className="dc-notes">{sec.content.items?.map((n,i)=><li key={i}>{n}</li>)}</ul>}
                  {sec.type==="images" && sec.content.descriptions?.map((img,i)=><div key={i} className="dc-img-placeholder"><ImgIco/><div style={{fontWeight:600,marginTop:8}}>{img.alt}</div>{img.caption&&<div style={{fontSize:12,marginTop:4}}>{img.caption}</div>}</div>)}
                </div>
              ))}
              <div className="dc-footer"><p>{footer.line1}</p><p>{footer.line2}</p><button className="dc-btn dc-btn-ghost no-print" style={{position:"absolute",top:8,right:14}} onClick={()=>setEditingFooter(true)}>✏️ Edit</button></div>
            </div>
          </>
        )}

        {editingHeader && <div className="dc-overlay" onClick={()=>setEditingHeader(false)}><div className="dc-modal" onClick={e=>e.stopPropagation()}><h3>Edit Header</h3><label>Company Name</label><input type="text" value={header.companyName} onChange={e=>setHeader(h=>({...h,companyName:e.target.value}))}/><label>Tagline</label><input type="text" value={header.tagline} onChange={e=>setHeader(h=>({...h,tagline:e.target.value}))}/><div className="dc-modal-actions"><button className="dc-btn dc-btn-primary" onClick={()=>setEditingHeader(false)}>Done</button></div></div></div>}
        {editingFooter && <div className="dc-overlay" onClick={()=>setEditingFooter(false)}><div className="dc-modal" onClick={e=>e.stopPropagation()}><h3>Edit Footer</h3><label>Line 1</label><input type="text" value={footer.line1} onChange={e=>setFooter(f=>({...f,line1:e.target.value}))}/><label>Line 2</label><input type="text" value={footer.line2} onChange={e=>setFooter(f=>({...f,line2:e.target.value}))}/><div className="dc-modal-actions"><button className="dc-btn dc-btn-primary" onClick={()=>setEditingFooter(false)}>Done</button></div></div></div>}
      </div>
    </>
  );
}
