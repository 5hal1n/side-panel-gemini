import React, { useState } from "react";

interface RegistrationFormProps {
  onRegister: (data: { email: string; company: string }) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister }) => {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && company) {
      onRegister({ email, company });
    } else {
      alert("メールアドレスと会社名を両方入力してください。");
    }
  };

  return (
    <div className="registration-container">
      <h2>Gemini Side Panel への登録</h2>
      <p>ご利用にはメールアドレスと会社名の入力が必要です。</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">メールアドレス:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="company">会社名:</label>
          <input
            type="text"
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="register-btn">利用開始</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
