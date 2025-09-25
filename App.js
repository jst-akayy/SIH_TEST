import React, { useState } from "react";
import "./App.css";

const languages = {
  en: { label: "English", education: "Education", skills: "Skills", sector: "Sector", location: "Location", mode: "Mode", submit: "Find Internships" },
  hi: { label: "हिंदी", education: "शिक्षा", skills: "कौशल", sector: "क्षेत्र", location: "स्थान", mode: "मोड", submit: "इंटर्नशिप खोजें" },
};

const sectors = ["IT", "Finance", "Healthcare", "Education", "Engineering"];
const modes = ["On-site", "Remote", "Hybrid"];

function App() {
  const [step, setStep] = useState("welcome"); // welcome -> ageVerify -> finder
  const [dob, setDob] = useState("");
  const [ageValid, setAgeValid] = useState(true);
  
  const [form, setForm] = useState({ education: "", skills: [], sector: "", location: "", mode: "" });
  const [language, setLanguage] = useState("en");
  const [recommendations, setRecommendations] = useState([]);

  function calculateAge(birthDate) {
    const today = new Date();
    const dobDate = new Date(birthDate);
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    return age;
  }

  function handleDobSubmit(e) {
    e.preventDefault();
    const age = calculateAge(dob);
    if (age >= 21 && age <= 24) {
      setAgeValid(true);
      setStep("finder");
    } else {
      setAgeValid(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSkillAdd(skill) {
    if (skill && !form.skills.includes(skill)) setForm({ ...form, skills: [...form.skills, skill] });
  }

  function handleSkillRemove(skill) {
    setForm({ ...form, skills: form.skills.filter(s => s !== skill) });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("https://api.example.com/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setRecommendations(data.cards || []);
  }

  const t = languages[language];

  if (step === "welcome") {
    return (
      <div className="welcome-page">
        <div className="header">
  <button className="auth-btn" onClick={() => setStep("ageVerify")}>Proceed</button>
</div>
        <div className="center-content">
          <h1>CAREER NEST</h1>
          <i>Connecting Ambition with Opportunity</i>
          <p>Find the right internship NOW.</p>
        </div>
        <div className="terms">
          <h3>TERMS & CONDITIONS</h3>
          <ul>
            <li>Must be an Indian citizen between 21 and 24 years old.</li>
            <li>Must have completed Class 10, Class 12, a diploma, or a bachelor's degree (excluding premier institutions like IITs/IIMs).</li>
            <li>Family income must be below ₹8 lakh annually.</li>
            <li>Must not be engaged in full-time work or studies.</li>
          </ul>
        </div>
      </div>
    );
  }

  if (step === "ageVerify") {
    return (
      <div className="age-verify-page">
        <h2>Enter Your Date of Birth</h2>
        <form onSubmit={handleDobSubmit}>
          <input
            type="date"
            value={dob}
            onChange={e => setDob(e.target.value)}
            max={new Date().toISOString().slice(0, 10)} // no future date
            required
          />
          <button type="submit">Verify Age</button>
        </form>
        {!ageValid && <p className="error-text">Invalid age. Must be between 21 and 24 years old.</p>}
      </div>
    );
  }

  if (step === "finder") {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundImage: "url('/background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="app-center-wrapper">
          <div className="modal-card">
            <header>
              <h1>CareerNest Internship Finder</h1>
              <select value={language} onChange={e => setLanguage(e.target.value)}>
                {Object.entries(languages).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </header>
            <form className="input-form" onSubmit={handleSubmit}>
              <div className="form-tile">
                <label>{t.education}</label>
                <input name="education" value={form.education} onChange={handleChange} />
              </div>
              <div className="form-tile">
                <label>{t.skills}</label>
                <div className="skills-chip">
                  {form.skills.map(skill =>
                    <span key={skill} onClick={() => handleSkillRemove(skill)} className="skill-chip">{skill} ❌</span>
                  )}
                  <input placeholder="Add skill..." onKeyDown={e => { if (e.key === "Enter") { handleSkillAdd(e.target.value); e.target.value = ""; e.preventDefault(); } }} />
                </div>
              </div>
              <div className="form-tile">
                <label>{t.sector}</label>
                <select name="sector" value={form.sector} onChange={handleChange}>
                  <option value="">Select</option>
                  {sectors.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-tile">
                <label>{t.location}</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="City / State" />
              </div>
              <div className="form-tile">
                <label>{t.mode}</label>
                <select name="mode" value={form.mode} onChange={handleChange}>
                  <option value="">Select</option>
                  {modes.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-tile">
                <button type="submit">{t.submit}</button>
              </div>
            </form>
          </div>
        </div>
        <main>
          <h2>Recommendations</h2>
          <div className="cards-list">
            {recommendations.map(card => (
              <div key={card.id} className="internship-card">
                <h3>{card.title}</h3>
                <p>{card.company} • {card.location}</p>
                <div>Skills matched: {card.skills.join(", ")}</div>
                <div>Mode: {card.mode}</div>
                <button>Save</button>
                <button>Not Interested</button>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }
}

export default App;







