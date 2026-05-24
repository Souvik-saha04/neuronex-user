// FILE: app/user/upload-prescription/page.tsx
'use client';
import { useState } from 'react';

const mockExtracted = {
  medicines: ['Amlodipine 5mg – 1 tab daily', 'Atorvastatin 10mg – 1 tab at night', 'Aspirin 75mg – 1 tab after breakfast'],
  diagnosis: 'Hypertension with mild dyslipidaemia',
  doctor: 'Dr. Priya Menon',
  date: '22 Apr 2025',
  duration: '30 days',
  aiSummary: 'Your doctor prescribed medicines to control your blood pressure and cholesterol levels. Amlodipine helps relax blood vessels, Atorvastatin reduces cholesterol, and Aspirin prevents blood clots. Take them consistently every day. Avoid salty food and monitor your BP at home.',
};

const howSteps = [
  { num: '1', icon: '📤', label: 'Upload prescription image or PDF' },
  { num: '2', icon: '🔍', label: 'AI scans and reads the text' },
  { num: '3', icon: '💊', label: 'Medicines & diagnosis extracted' },
  { num: '4', icon: '🧠', label: 'AI summary in simple language' },
];

const processingSteps = ['Detecting text regions', 'Reading handwriting & print', 'Identifying medicines', 'Generating AI summary'];

const infoRows = [
  { label: 'Diagnosis', value: mockExtracted.diagnosis },
  { label: 'Doctor', value: mockExtracted.doctor },
  { label: 'Date', value: mockExtracted.date },
  { label: 'Duration', value: mockExtracted.duration },
];

export default function UploadPrescriptionPage() {
  const [step, setStep] = useState<'upload' | 'processing' | 'result'>('upload');

  function simulate() {
    setStep('processing');
    setTimeout(() => setStep('result'), 2200);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', padding: '32px 40px 60px', fontFamily: "'Segoe UI', Inter, sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a2332', margin: '0 0 6px' }}>📤 Upload Prescription</h1>
        <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0 }}>Take a photo or upload a file — our AI extracts the details for you</p>
      </div>

      {/* STEP: Upload */}
      {step === 'upload' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 28, alignItems: 'start' }}>

          {/* Drop Zone */}
          <div
            onClick={simulate}
            style={{ background: '#fff', border: '2.5px dashed #bfdbfe', borderRadius: 20, padding: '64px 40px', textAlign: 'center', cursor: 'pointer' }}
          >
            <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>📄</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a2332', margin: '0 0 8px' }}>Drag & drop your prescription here</h2>
            <p style={{ fontSize: '0.87rem', color: '#64748b', margin: '0 0 28px' }}>Supports JPG, PNG, PDF — up to 10MB</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
              <button onClick={simulate} style={{ background: '#1a6fc4', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 22px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>📁 Choose File</button>
              <button onClick={simulate} style={{ background: '#fff', color: '#1a6fc4', border: '1.5px solid #1a6fc4', borderRadius: 10, padding: '10px 22px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>📷 Take Photo</button>
            </div>
          </div>

          {/* How It Works */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a2332', margin: '0 0 18px' }}>How OCR Extraction Works</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {howSteps.map((s) => (
                <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ background: '#1a6fc4', color: '#fff', fontSize: '0.75rem', fontWeight: 700, borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.num}</div>
                  <span style={{ fontSize: '1.1rem' }}>{s.icon}</span>
                  <p style={{ fontSize: '0.83rem', color: '#334155', margin: 0, lineHeight: 1.4 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP: Processing */}
      {step === 'processing' && (
        <div style={{ background: '#fff', borderRadius: 20, padding: '64px 40px', textAlign: 'center', maxWidth: 540, margin: '0 auto', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ width: 64, height: 64, border: '5px solid #e3f2fd', borderTopColor: '#1a6fc4', borderRadius: '50%', animation: 'spin 0.9s linear infinite', margin: '0 auto 24px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a2332', margin: '0 0 8px' }}>Scanning your prescription…</h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 28px' }}>Our AI is reading the text and extracting details</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left', maxWidth: 300, margin: '0 auto' }}>
            {processingSteps.map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: '#475569' }}>
                <span style={{ width: 8, height: 8, background: '#1a6fc4', borderRadius: '50%', flexShrink: 0, display: 'inline-block' }} />
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP: Result */}
      {step === 'result' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Result Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '0.9rem', fontWeight: 700, padding: '8px 18px', borderRadius: 20 }}>✅ Extraction Successful</span>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{ background: '#fff', color: '#1a6fc4', border: '1.5px solid #1a6fc4', borderRadius: 10, padding: '10px 22px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>💾 Save to Records</button>
              <button onClick={() => setStep('upload')} style={{ background: '#1a6fc4', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 22px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>📤 Upload Another</button>
            </div>
          </div>

          {/* Result Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            {/* Extracted Info */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a2332', margin: '0 0 18px' }}>📋 Extracted Information</h3>
              {infoRows.map((row) => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500 }}>{row.label}</span>
                  <span style={{ fontSize: '0.88rem', color: '#1a2332', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{row.value}</span>
                </div>
              ))}
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a2332', margin: '18px 0 10px' }}>💊 Medicines Prescribed</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {mockExtracted.medicines.map((m) => (
                  <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.87rem', color: '#334155', background: '#f0f4f8', padding: '10px 14px', borderRadius: 8 }}>
                    <span style={{ width: 8, height: 8, background: '#1a6fc4', borderRadius: '50%', flexShrink: 0, display: 'inline-block' }} />
                    {m}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Summary */}
            <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a5f)', borderRadius: 16, padding: 24, boxShadow: '0 6px 24px rgba(15,23,42,0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ background: 'rgba(255,255,255,0.15)', fontSize: '0.8rem', fontWeight: 700, padding: '4px 12px', borderRadius: 20, color: '#fff' }}>🧠 AI</span>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>Summary in Simple Language</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.65, margin: '0 0 20px' }}>{mockExtracted.aiSummary}</p>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: 'rgba(255,200,0,0.12)', border: '1px solid rgba(255,200,0,0.25)', borderRadius: 10, padding: '12px 14px', fontSize: '0.8rem', color: 'rgba(255,220,100,0.95)', lineHeight: 1.5 }}>
                <span>⚠️</span>
                <span>Always follow your doctor's advice. This is an AI-generated summary for reference only.</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}