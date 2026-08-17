'use client';

import { useState } from 'react';
import {
  UploadCloud,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Save,
} from 'lucide-react';

export default function AdminProductForm({ initialProduct = {}, onSave }) {
  const [formData, setFormData] = useState({
    name: initialProduct.name || '',
    slug: initialProduct.slug || '',
    shortDescription: initialProduct.shortDescription || '',
    description: initialProduct.description || '',
    application: initialProduct.application || '',
    capacities: initialProduct.capacities || [],
    advantages: initialProduct.advantages || [],
    features: initialProduct.features || [],
    specifications: initialProduct.specifications || [],
    processFlow: initialProduct.processFlow || [],
    images: initialProduct.images || [],
    active: initialProduct.active ?? true,
  });

  const [newCapacity, setNewCapacity] = useState('');
  const [newAdvantage, setNewAdvantage] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newStep, setNewStep] = useState('');
  const [uploading, setUploading] = useState(false);

  // Multi-image upload handler via ImageKit
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const data = new FormData();
    files.forEach((file) => data.append('images', file));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/upload-images`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: data,
      });
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        const currentLength = formData.images.length;
        const formatted = json.data.map((img, idx) => ({
          ...img,
          order: currentLength + idx,
        }));
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...formatted],
        }));
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const moveImage = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= formData.images.length) return;
    const newImages = [...formData.images];
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;
    newImages.forEach((img, i) => (img.order = i));
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Basic Info */}
      <div className="admin-card">
        <h3>Basic Information</h3>
        <label>Product Name</label>
        <input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <label>Slug (URL key)</label>
        <input
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="e.g. potato-chips-line"
        />

        <label>Short Description</label>
        <textarea
          rows={2}
          value={formData.shortDescription}
          onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
        />

        <label>Full Description</label>
        <textarea
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      {/* Multiple Image Management */}
      <div className="admin-card">
        <h3>Product Images ({formData.images.length})</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {formData.images.map((img, idx) => (
            <div key={idx} className="image-preview-card">
              <img src={img.url} alt={img.alt || 'preview'} />
              <input
                placeholder="Alt text"
                value={img.alt || ''}
                onChange={(e) => {
                  const updated = [...formData.images];
                  updated[idx].alt = e.target.value;
                  setFormData({ ...formData, images: updated });
                }}
              />
              <div className="img-actions">
                <button type="button" onClick={() => moveImage(idx, -1)} disabled={idx === 0}>
                  <ArrowUp size={14} />
                </button>
                <button type="button" onClick={() => moveImage(idx, 1)} disabled={idx === formData.images.length - 1}>
                  <ArrowDown size={14} />
                </button>
                <button type="button" className="danger" onClick={() => removeImage(idx)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <label className="upload-btn">
          <UploadCloud size={16} /> {uploading ? 'Uploading...' : 'Upload Images'}
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} hidden />
        </label>
      </div>

      {/* Process Flow */}
      <div className="admin-card">
        <h3>Process Flow</h3>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
          <input
            placeholder="Add Step (e.g. Destoning & Washing)"
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
          />
          <button
            type="button"
            onClick={() => {
              if (!newStep.trim()) return;
              setFormData({
                ...formData,
                processFlow: [
                  ...formData.processFlow,
                  { title: newStep.trim(), order: formData.processFlow.length },
                ],
              });
              setNewStep('');
            }}
          >
            <Plus size={16} /> Add Step
          </button>
        </div>

        <ol>
          {formData.processFlow.map((step, idx) => (
            <li key={idx} style={{ marginBottom: '6px' }}>
              <span>{typeof step === 'string' ? step : step.title}</span>
              <button
                type="button"
                style={{ marginLeft: '12px', background: 'none', border: 'none', color: '#ef4444' }}
                onClick={() =>
                  setFormData({
                    ...formData,
                    processFlow: formData.processFlow.filter((_, i) => i !== idx),
                  })
                }
              >
                ×
              </button>
            </li>
          ))}
        </ol>
      </div>

      <button type="submit" className="save-btn">
        <Save size={16} /> Save Product Changes
      </button>

      <style jsx>{`
        .admin-card {
          background: #071526;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 1.5rem;
        }
        input, textarea {
          width: 100%;
          background: #020617;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
          padding: 0.6rem;
          border-radius: 6px;
          margin-bottom: 1rem;
        }
        .image-preview-card {
          width: 150px;
          background: #020617;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 8px;
        }
        .image-preview-card img {
          width: 100%;
          height: 90px;
          object-fit: cover;
          border-radius: 4px;
        }
        .img-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 6px;
        }
        .upload-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0.65rem 1.25rem;
          background: #0284c7;
          color: #fff;
          border-radius: 6px;
          cursor: pointer;
        }
        .save-btn {
          padding: 0.85rem 2rem;
          background: #10b981;
          color: #fff;
          font-weight: bold;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          align-self: flex-start;
        }
      `}</style>
    </form>
  );
}