import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clipboard,
  Code2,
  FileLock2,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  Menu,
  RotateCcw,
  Shield,
  ShieldCheck,
  Sparkles,
  UnlockKeyhole,
  X,
  Zap,
} from "lucide-react";
import { encryptMessage, decryptMessage } from "./utils/crypto";
import StrengthMeter from "./components/StrengthMeter";
import Toast from "./components/Toast";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function App() {
  const [mode, setMode] = useState("encrypt");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const notify = (type, message) => {
    setToast({ type, message });
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => setToast(null), 3600);
  };

  const reset = () => {
    setMessage("");
    setPassword("");
    setOutput("");
    setToast(null);
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    reset();
  };

  const processMessage = async () => {
    setBusy(true);
    setOutput("");
    setToast(null);
    try {
      const result =
        mode === "encrypt"
          ? await encryptMessage(message, password)
          : await decryptMessage(message, password);
      setOutput(result);
      notify("success", mode === "encrypt" ? "Your message is now encrypted." : "Message decrypted successfully.");
    } catch (error) {
      notify("error", error.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output);
      notify("success", "Copied to clipboard.");
    } catch {
      notify("error", "Clipboard access is unavailable in this browser context.");
    }
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = mode === "encrypt" ? "cryptotext-encrypted.json" : "cryptotext-decrypted.txt";
    anchor.click();
    URL.revokeObjectURL(url);
    notify("success", "Your file download has started.");
  };

  const useExample = () => {
    setMessage(
      mode === "encrypt"
        ? "The quick brown fox jumps over the lazy dog. This is a private message."
        : ""
    );
    setPassword("Example@2026Secure");
    setOutput("");
    notify("info", "Example content added. Use your own password for real data.");
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <Toast toast={toast} onClose={() => setToast(null)} />

      <header className="topbar">
        <a className="brand" href="#home" aria-label="CryptoText home">
          <span className="brand-mark"><LockKeyhole size={19} /></span>
          <span>crypto<span className="brand-accent">text</span><small>SECURE MESSAGE STUDIO</small></span>
        </a>

        <nav className={`nav-links ${mobileMenu ? "nav-open" : ""}`}>
          <a href="#workspace" onClick={() => setMobileMenu(false)}>Workspace</a>
          <a href="#how-it-works" onClick={() => setMobileMenu(false)}>How it works</a>
          <a href="#security" onClick={() => setMobileMenu(false)}>Security</a>
        </nav>

        <div className="topbar-right">
          <span className="secure-pill"><span className="pulse-dot" /> Local processing</span>
          {/* <button className="mobile-menu icon-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button> */}
        </div>
      </header>

      <main id="home">
        <section className="hero section-wrap">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.65 }}>
            <div className="eyebrow"><Sparkles size={14} /> PRIVATE BY DESIGN <span /></div>
            <h1>Your words.<br /><span>Under your control.</span></h1>
            <p className="hero-copy">
              A calmer, simpler way to protect sensitive text. Encrypt a message,
              keep the encrypted output, and unlock it whenever you need.
            </p>
            <div className="hero-actions">
              <a className="primary-link" href="#workspace">Start encrypting <ArrowRight size={17} /></a>
              <div className="hero-note"><ShieldCheck size={16} /> No account. No upload. No server storage.</div>
            </div>
          </motion.div>

          <motion.div
            className="hero-art"
            initial={{ opacity: 0, scale: 0.88, rotate: 3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          >
            <div className="orbit orbit-a" /><div className="orbit orbit-b" />
            <motion.div className="art-card art-card-back" animate={{ y: [0, -9, 0], rotate: [-7, -5, -7] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
              <div className="art-card-head"><span /><span /><span /></div>
              <div className="code-lines"><i /><i /><i /><i /><i /></div>
            </motion.div>
            <motion.div className="art-lock" animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
              <div className="lock-glow"><LockKeyhole size={54} strokeWidth={1.5} /></div>
              <span className="art-ring ring-one" /><span className="art-ring ring-two" />
            </motion.div>
            <motion.div className="art-card art-card-front" animate={{ y: [0, 8, 0], rotate: [5, 7, 5] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}>
              <div className="mini-shield"><ShieldCheck size={17} /> VERIFIED</div>
              <div className="encrypted-preview">8fA2...kP91<br />xQ7m...2L0v<br />••••••••••••</div>
              <div className="art-card-foot"><span /> ENCRYPTED DATA</div>
            </motion.div>
            <div className="float-chip chip-top"><Fingerprint size={15} /> AES-256</div>
            <div className="float-chip chip-bottom"><Zap size={15} /> INSTANT</div>
          </motion.div>
        </section>

        <section className="trust-strip section-wrap">
          <div><LockKeyhole size={17} /><span>AES-256-GCM encryption</span></div>
          <div><KeyRound size={17} /><span>Password-derived key</span></div>
          <div><Fingerprint size={17} /><span>Integrity verification</span></div>
          <div><Code2 size={17} /><span>Runs in your browser</span></div>
        </section>

        <section className="workspace-section section-wrap" id="workspace">
          <div className="section-heading">
            <div>
              <div className="eyebrow">THE WORKSPACE</div>
              <h2>Message protection, <span>made simple.</span></h2>
              <p>Choose a mode, enter your content and password, then let CryptoText do the rest.</p>
            </div>
            <div className="workspace-status"><span className="pulse-dot" /> READY TO PROCESS</div>
          </div>

          <motion.div className="workspace-card" initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.55 }}>
            <div className="workspace-topline">
              <div className="window-dots"><i /><i /><i /></div>
              <span>CRYPTO TEXT CONSOLE <span className="console-version">/ v1.0</span></span>
              <span className="live-indicator"><span /> LIVE</span>
            </div>

            <div className="mode-switch">
              <button className={mode === "encrypt" ? "mode-tab active" : "mode-tab"} onClick={() => changeMode("encrypt")}>
                <LockKeyhole size={17} /> Encrypt message
              </button>
              <button className={mode === "decrypt" ? "mode-tab active" : "mode-tab"} onClick={() => changeMode("decrypt")}>
                <UnlockKeyhole size={17} /> Decrypt message
              </button>
              <button className="example-button" onClick={useExample}>Use example <ArrowDownToLine size={14} /></button>
            </div>

            <div className="workspace-grid">
              <div className="editor-column">
                <div className="field-heading">
                  <label htmlFor="message-input">{mode === "encrypt" ? "YOUR MESSAGE" : "ENCRYPTED MESSAGE"}</label>
                  <span>{message.length.toLocaleString()} / 100,000</span>
                </div>
                <textarea
                  id="message-input"
                  className="message-input"
                  maxLength={100000}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={mode === "encrypt" ? "Type or paste the message you want to protect..." : "Paste the complete CryptoText encrypted JSON here..."}
                  spellCheck="false"
                />
                <div className="input-footer">
                  <span><Shield size={13} /> {mode === "encrypt" ? "Your original text stays in this browser." : "Use the complete encrypted output."}</span>
                  <button onClick={() => setMessage("")} className="text-button">Clear text</button>
                </div>

                <div className="password-block">
                  <div className="field-heading">
                    <label htmlFor="password-input">ENCRYPTION PASSWORD</label>
                    <span className="private-label"><LockKeyhole size={12} /> PRIVATE</span>
                  </div>
                  <div className="password-input-wrap">
                    <KeyRound size={17} />
                    <input
                      id="password-input"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter a strong password (8+ characters)"
                      autoComplete="off"
                    />
                    <button className="show-password" onClick={() => setShowPassword(!showPassword)} type="button">
                      {showPassword ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                  {mode === "encrypt" && <StrengthMeter password={password} />}
                  <p className="password-tip"><span>TIP</span> Use a unique passphrase. You will need the same password to decrypt.</p>
                </div>

                <button className="process-button" onClick={processMessage} disabled={busy || !message.trim() || !password}>
                  {busy ? <span className="spinner" /> : mode === "encrypt" ? <LockKeyhole size={18} /> : <UnlockKeyhole size={18} />}
                  {busy ? "PROCESSING..." : mode === "encrypt" ? "Encrypt message" : "Decrypt message"}
                  {!busy && <ArrowRight size={17} />}
                </button>
              </div>

              <div className="output-column">
                <div className="output-heading">
                  <div><span className="output-icon"><FileLock2 size={17} /></span><div><h3>{mode === "encrypt" ? "Encrypted output" : "Decrypted result"}</h3><p>{mode === "encrypt" ? "Your protected message appears here." : "Your original message appears here."}</p></div></div>
                  {output && <span className="complete-badge"><CheckCircle2 size={13} /> COMPLETE</span>}
                </div>

                <AnimatePresence mode="wait">
                  {output ? (
                    <motion.div key="output" className="result-panel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                      <pre>{output}</pre>
                      <div className="result-actions">
                        <button onClick={copyOutput}><Clipboard size={15} /> Copy output</button>
                        <button onClick={downloadOutput}><ArrowDownToLine size={15} /> Download</button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="empty" className="empty-output" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="empty-illustration"><div className="empty-orbit" /><LockKeyhole size={31} /></div>
                      <h3>Waiting for your message</h3>
                      <p>{mode === "encrypt" ? "Your encrypted content will appear in this space after processing." : "Your decrypted text will appear here once the password is verified."}</p>
                      <div className="empty-meta"><span /><span /><span /></div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="output-bottom">
                  <div><span className="status-dot" /> <span>{output ? "Output generated successfully" : "Output panel is ready"}</span></div>
                  <button onClick={reset}><RotateCcw size={13} /> Reset workspace</button>
                </div>
              </div>
            </div>
            <div className="workspace-foot"><ShieldCheck size={15} /><span>Encrypted locally using the browser's Web Crypto API. Your password is never sent to a server.</span></div>
          </motion.div>
        </section>

        <section className="how-section section-wrap" id="how-it-works">
          <div className="section-heading centered-heading">
            <div className="eyebrow">A SIMPLE PROCESS</div>
            <h2>Security without <span>the complexity.</span></h2>
            <p>Three steps from readable text to protected content.</p>
          </div>
          <div className="steps-grid">
            {[
              { icon: KeyRound, number: "01", title: "Choose a password", text: "Create a strong passphrase. PBKDF2 derives a cryptographic key from it using a fresh random salt." },
              { icon: LockKeyhole, number: "02", title: "Encrypt your text", text: "AES-256-GCM transforms your message into ciphertext and authenticates it against tampering." },
              { icon: UnlockKeyhole, number: "03", title: "Decrypt when needed", text: "Keep the encrypted output and use the same password to recover the original message." },
            ].map((step, index) => (
              <motion.article className="step-card" key={step.number} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.12 }}>
                <div className="step-top"><span>{step.number}</span><step.icon size={22} /></div>
                <h3>{step.title}</h3><p>{step.text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="security-section section-wrap" id="security">
          <div className="security-panel">
            <div className="security-copy">
              <div className="eyebrow"><ShieldCheck size={14} /> SECURITY DETAILS</div>
              <h2>Built on trusted<br /><span>browser cryptography.</span></h2>
              <p>CryptoText uses standard cryptographic primitives provided by the Web Crypto API. Encryption and decryption happen locally in your browser.</p>
              <div className="security-list">
                <div><Check size={15} /> AES-256-GCM authenticated encryption</div>
                <div><Check size={15} /> PBKDF2 with SHA-256 key derivation</div>
                <div><Check size={15} /> Random salt and 96-bit IV per encryption</div>
                <div><Check size={15} /> Authentication detects altered ciphertext</div>
              </div>
            </div>
            <div className="security-visual">
              <div className="security-ring ring-outer" /><div className="security-ring ring-inner" />
              <div className="security-core"><ShieldCheck size={54} strokeWidth={1.35} /><span>PROTECTED</span></div>
              <div className="security-tag tag-a"><span /> ENCRYPTED</div>
              <div className="security-tag tag-b"><Fingerprint size={14} /> VERIFIED</div>
              <div className="security-tag tag-c"><KeyRound size={14} /> PRIVATE KEY</div>
            </div>
          </div>
          <p className="security-disclaimer"><InfoIcon /> Educational project: do not use it as a replacement for a professionally audited secure messaging service. Anyone with the password and encrypted output can decrypt the message.</p>
        </section>

        <section className="final-cta section-wrap">
          <div className="cta-icon"><Sparkles size={22} /></div>
          <h2>Ready to keep your words <span>yours?</span></h2>
          <p>Start with a message. Leave with encrypted text you can keep.</p>
          <a className="primary-link" href="#workspace">Open CryptoText <ArrowRight size={17} /></a>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#home"><span className="brand-mark"><LockKeyhole size={17} /></span><span>crypto<span className="brand-accent">text</span></span></a>
        <span>Built as an Infosys Springboard learning project.</span>
        <a href="#home">Back to top ↑</a>
      </footer>
    </div>
  );
}

function InfoIcon() {
  return <span className="info-symbol">i</span>;
}
