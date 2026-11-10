import { ShieldCheck } from "lucide-react";

export default function StrengthMeter({ password }) {
  if (!password) {
    return (
      <div className="strength strength-empty">
        <span className="strength-label"><ShieldCheck size={14} /> Password strength</span>
        <span className="strength-hint">Enter a password to check it</span>
      </div>
    );
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const level = score <= 2 ? "Weak" : score <= 3 ? "Fair" : score <= 4 ? "Good" : "Strong";
  const color = score <= 2 ? "weak" : score <= 3 ? "fair" : score <= 4 ? "good" : "strong";

  return (
    <div className="strength">
      <div className="strength-top">
        <span className="strength-label"><ShieldCheck size={14} /> Password strength</span>
        <span className={`strength-value ${color}`}>{level}</span>
      </div>
      <div className="strength-bars">
        {[1, 2, 3, 4, 5].map((item) => (
          <span key={item} className={item <= score ? `bar-fill ${color}` : ""} />
        ))}
      </div>
      <p className="strength-hint">Use 12+ characters with a mix of letters, numbers and symbols.</p>
    </div>
  );
}
