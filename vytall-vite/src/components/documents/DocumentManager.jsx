import React, { useRef, useState } from 'react';
import { uploadDocument, downloadDocument } from '../../api/documents';

export default function DocumentManager({ patientId }) {
  const [files, setFiles] = useState([]); // { name, url }
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef();

  const handleUpload = async (e) => {
    setError('');
    setSuccess('');
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadDocument(file, patientId);
      setFiles(prev => [...prev, { name: res.fileName }]);
      setSuccess('File uploaded successfully!');
    } catch (err) {
      setError('Upload failed. Only PDF and image files are allowed.');
    } finally {
      setUploading(false);
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = async (fileName) => {
    try {
      const res = await downloadDocument(fileName);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError('Download failed.');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Document Upload/Download</h2>
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleUpload}
        ref={fileInputRef}
        disabled={uploading}
        className="mb-2"
      />
      {uploading && <div className="text-blue-600">Uploading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Uploaded Files</h3>
        {files.length === 0 && <div className="text-gray-500">No files uploaded yet.</div>}
        <ul>
          {files.map((file, idx) => (
            <li key={idx} className="mb-1">
              <button
                className="text-blue-700 underline hover:text-blue-900"
                onClick={() => handleDownload(file.name)}
              >
                {file.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 