'use client';
import { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  FolderOpen,
  CheckCircle2,
  Loader2,
  Check,
  X,
  Image as ImageIcon,
  HardDrive,
  Upload,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

const BASE_URL = 'http://127.0.0.1:8000';

const documentTypes = [
  { value: 'PRESCRIPTION', label: 'Prescription' },
  { value: 'REPORT', label: 'Medical Report' },
  { value: 'SCAN', label: 'Scan / Imaging' },
  { value: 'LAB', label: 'Lab Report' },
  { value: 'DISCHARGE', label: 'Discharge Summary' },
  { value: 'OTHER', label: 'Other' },
];

const stepLabels = ['Choose file', 'Add details', 'Done'];

const cardStyle = {
  background: '#fff',
  borderRadius: 16,
  padding: 32,
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
} as const;

const labelStyle = { fontSize: '0.85rem', fontWeight: 600, color: '#1a2332' } as const;

const inputStyle = {
  padding: '11px 14px',
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  fontSize: '0.9rem',
  color: '#1a2332',
  background: '#f8fafc',
  outline: 'none',
} as const;

const primaryBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  background: '#1a6fc4',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '11px 22px',
  fontSize: '0.88rem',
  fontWeight: 600,
  cursor: 'pointer',
  textDecoration: 'none',
} as const;

const secondaryBtn = {
  ...primaryBtn,
  background: '#fff',
  color: '#1a6fc4',
  border: '1.5px solid #1a6fc4',
  padding: '10px 22px',
} as const;

interface UploadedDocument {
  id: number;
  title: string;
  document_type: string;
  document_date: string | null;
  file_url: string;
  file_name: string;
  file_size: number;
  uploaded_at: string;
}

function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

export default function UploadPrescriptionPage() {
  const [step, setStep] = useState<'upload' | 'form' | 'processing' | 'result'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState('PRESCRIPTION');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [uploadedDoc, setUploadedDoc] = useState<UploadedDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentStep = step === 'upload' ? 0 : step === 'result' ? 2 : 1;

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setTitle(selected.name);
    setStep('form');
  }

  async function handleUpload(e: React.FormEvent) {
  e.preventDefault();
  const token = localStorage.getItem('medaxis_token');
  if (!token || !file) {
    setError('You must be logged in and select a file.');
    return;
  }

  setStep('processing');
  setError('');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  formData.append('document_type', documentType);
  formData.append('description', description);

  try {
    const res = await fetch(`${BASE_URL}/accounts/upload/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const result = await res.json();

    if (res.ok) {
      setUploadedDoc(result.document);
      setStep('result');
    } else {
      setError(
        res.status === 401
          ? 'Session expired. Please log in again.'
          : result?.error || 'Upload failed. Please try again.'
      );
      setStep('form');
    }
  } catch (err) {
    console.error('Upload request failed:', err);
    setError('Could not reach the server. Please try again.');
    setStep('form');
  }
}

  function resetFlow() {
    setFile(null);
    setTitle('');
    setDocumentType('PRESCRIPTION');
    setDescription('');
    setError('');
    setUploadedDoc(null);
    setStep('upload');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', padding: '40px 40px 60px', fontFamily: "'Segoe UI', Inter, sans-serif" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: '#e3f2fd', color: '#1a6fc4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UploadCloud size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a2332', margin: '0 0 4px' }}>Upload Document</h1>
            <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0 }}>Upload a prescription, report or scan to keep it with your records</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          {stepLabels.map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: i <= currentStep ? '#1a6fc4' : '#e2e8f0',
                color: i <= currentStep ? '#fff' : '#94a3b8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700,
              }}>
                {i < currentStep ? <Check size={14} /> : i + 1}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: i <= currentStep ? '#1a2332' : '#94a3b8' }}>{label}</span>
              {i < stepLabels.length - 1 && (
                <div style={{ width: 40, height: 2, background: i < currentStep ? '#1a6fc4' : '#e2e8f0' }} />
              )}
            </div>
          ))}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileSelected}
          style={{ display: 'none' }}
        />

        {step === 'upload' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, alignItems: 'stretch' }}>

            <div
              onClick={() => fileInputRef.current?.click()}
              style={{ ...cardStyle, border: '2px dashed #bfdbfe', padding: '56px 32px', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <div style={{ width: 84, height: 84, borderRadius: '50%', background: '#e3f2fd', color: '#1a6fc4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <UploadCloud size={40} />
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a2332', margin: '0 0 8px' }}>Click to choose a file</h2>
              <p style={{ fontSize: '0.87rem', color: '#64748b', margin: '0 0 24px' }}>Supports JPG, PNG, PDF — up to 10MB</p>
              <button style={primaryBtn}><FolderOpen size={17} /> Choose File</button>
            </div>

            <div style={cardStyle}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a2332', margin: '0 0 20px' }}>Accepted files</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {[
                  { icon: <FileText size={20} />, title: 'PDF documents', text: 'Reports, prescriptions, discharge summaries' },
                  { icon: <ImageIcon size={20} />, title: 'JPG or PNG images', text: 'Photos of prescriptions or scans' },
                  { icon: <HardDrive size={20} />, title: 'Up to 10MB', text: 'Per file' },
                ].map((item) => (
                  <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: '#f0f4f8', color: '#1a6fc4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a2332' }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'form' && file && (
          <form onSubmit={handleUpload} style={{ ...cardStyle, maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 14 }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#f0f4f8', borderRadius: 12, padding: '12px 16px' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#e3f2fd', color: '#1a6fc4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a2332', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{formatSize(file.size)}</div>
              </div>
              <button type="button" onClick={resetFlow} aria-label="Remove file"
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>

            <label style={labelStyle}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />

            <label style={labelStyle}>Document Type</label>
            <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} style={inputStyle}>
              {documentTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>

            <label style={labelStyle}>Notes (optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              style={{ ...inputStyle, resize: 'vertical' }} />

            {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', margin: 0 }}>{error}</p>}

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="button" onClick={resetFlow} style={secondaryBtn}>Cancel</button>
              <button type="submit" style={primaryBtn}><Upload size={17} /> Upload</button>
            </div>
          </form>
        )}

        {step === 'processing' && (
          <div style={{ ...cardStyle, padding: '64px 40px', textAlign: 'center', maxWidth: 560 }}>
            <div style={{ color: '#1a6fc4', display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <Loader2 size={52} style={{ animation: 'spin 0.9s linear infinite' }} />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a2332', margin: '0 0 8px' }}>Uploading your document…</h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>Please wait while we save it to your records</p>
          </div>
        )}

        {step === 'result' && uploadedDoc && (
          <div style={{ ...cardStyle, maxWidth: 560 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#e8f5e9', color: '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a2332', margin: '0 0 2px' }}>Upload Successful</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Your document has been saved to your records</p>
              </div>
            </div>

            {[
              { label: 'Title', value: uploadedDoc.title },
              { label: 'Type', value: uploadedDoc.document_type },
              { label: 'File', value: uploadedDoc.file_name },
              { label: 'Size', value: formatSize(uploadedDoc.file_size) },
            ].map((row) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500 }}>{row.label}</span>
                <span style={{ fontSize: '0.88rem', color: '#1a2332', fontWeight: 600, textAlign: 'right', wordBreak: 'break-word' }}>{row.value}</span>
              </div>
            ))}

            <a href={uploadedDoc.file_url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, color: '#1a6fc4', fontSize: '0.87rem', fontWeight: 600, textDecoration: 'none' }}>
              View Document <ExternalLink size={15} />
            </a>

            <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
              <a href="/user/health_records" style={secondaryBtn}>
                Go to Health Records <ArrowRight size={16} />
              </a>
              <button onClick={resetFlow} style={primaryBtn}>
                <Upload size={17} /> Upload Another
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}