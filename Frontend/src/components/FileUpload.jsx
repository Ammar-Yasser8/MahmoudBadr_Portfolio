import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import API_BASE_URL from '../config';

const FileUpload = ({ onUploadSuccess, accept = "image/*", label = "Upload File" }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      let base64Data = '';
      let uploadFileName = file.name;

      if (file.type.startsWith('image/')) {
        // Dynamic client-side WebP converter & scaler!
        const webpDataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 1920;
              const MAX_HEIGHT = 1080;
              let width = img.width;
              let height = img.height;

              if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                if (width > height) {
                  height = Math.round((height * MAX_WIDTH) / width);
                  width = MAX_WIDTH;
                } else {
                  width = Math.round((width * MAX_HEIGHT) / height);
                  height = MAX_HEIGHT;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);
              
              // 82% quality WebP compression
              const dataUrl = canvas.toDataURL('image/webp', 0.82);
              resolve(dataUrl);
            };
            img.onerror = reject;
            img.src = event.target.result;
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        base64Data = webpDataUrl.split(',')[1];
        
        // Rewrite filename extension to .webp
        const lastDot = file.name.lastIndexOf('.');
        const nameWithoutExt = lastDot !== -1 ? file.name.substring(0, lastDot) : file.name;
        uploadFileName = nameWithoutExt + '.webp';
      } else {
        // Standard base64 read for video/audio showreels
        base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: uploadFileName,
          base64Data: base64Data
        })
      });

      if (res.ok) {
        const data = await res.json();
        onUploadSuccess(data.url);
        setSuccess(true);
      } else {
        const errText = await res.text();
        setError('Upload failed: ' + errText);
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      border: '2px dashed var(--border-color)', 
      padding: '1.5rem 1rem', 
      borderRadius: '8px', 
      textAlign: 'center', 
      background: 'rgba(255, 255, 255, 0.02)', 
      cursor: 'pointer', 
      position: 'relative',
      transition: 'border-color 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      <input 
        type="file" 
        accept={accept} 
        onChange={handleChange} 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          opacity: 0, 
          cursor: 'pointer' 
        }} 
        disabled={loading} 
      />
      {loading ? (
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Uploading media...</span>
      ) : success ? (
        <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', fontWeight: '500' }}>
          <CheckCircle size={18} /> Uploaded Successfully!
        </span>
      ) : (
        <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <Upload size={18} color="var(--accent-red)" /> {label}
        </span>
      )}
      {error && (
        <span style={{ color: 'var(--accent-red)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <AlertCircle size={14} /> {error}
        </span>
      )}
    </div>
  );
};

export default FileUpload;
