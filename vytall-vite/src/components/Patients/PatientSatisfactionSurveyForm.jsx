import React, { useState } from 'react';
import { submitSurvey } from '../../api/surveys';

const surveyTypes = [
  { value: 'Medication', label: 'Medication' },
  { value: 'Delivery', label: 'Delivery' },
  { value: 'General', label: 'General' },
];

export default function PatientSatisfactionSurveyForm({ patientId, onSubmitted }) {
  const [surveyType, setSurveyType] = useState('Medication');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await submitSurvey({
        patientId,
        surveyType,
        rating: Number(rating),
        comments,
      });
      setSuccess(true);
      setComments('');
      setRating(5);
      setSurveyType('Medication');
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setError('Failed to submit survey.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow max-w-md mx-auto">
      <h2 className="text-lg font-semibold">Patient Satisfaction Survey</h2>
      <div>
        <label className="block mb-1 font-medium">Survey Type</label>
        <select
          value={surveyType}
          onChange={e => setSurveyType(e.target.value)}
          className="w-full border rounded px-2 py-1"
        >
          {surveyTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">Rating</label>
        <select
          value={rating}
          onChange={e => setRating(e.target.value)}
          className="w-full border rounded px-2 py-1"
        >
          {[1,2,3,4,5].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">Comments (optional)</label>
        <textarea
          value={comments}
          onChange={e => setComments(e.target.value)}
          className="w-full border rounded px-2 py-1"
          rows={3}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Survey'}
      </button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      {success && <div className="text-green-600 mt-2">Survey submitted! Thank you.</div>}
    </form>
  );
} 