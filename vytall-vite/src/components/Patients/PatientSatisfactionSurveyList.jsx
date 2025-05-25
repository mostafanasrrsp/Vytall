import React, { useEffect, useState } from 'react';
import { fetchSurveys } from '../../api/surveys';

export default function PatientSatisfactionSurveyList({ patientId }) {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchSurveys({ patientId })
      .then(setSurveys)
      .catch(() => setError('Failed to load surveys.'))
      .finally(() => setLoading(false));
  }, [patientId]);

  if (loading) return <div>Loading surveys...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!surveys.length) return <div>No surveys submitted yet.</div>;

  return (
    <div className="mt-6">
      <h3 className="text-md font-semibold mb-2">Patient Satisfaction Surveys</h3>
      <ul className="divide-y divide-gray-200">
        {surveys.map(survey => (
          <li key={survey.surveyId} className="py-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{survey.surveyType}</span>
              <span className="text-yellow-500">{'★'.repeat(survey.rating)}{'☆'.repeat(5-survey.rating)}</span>
              <span className="text-xs text-gray-500">{new Date(survey.dateSubmitted).toLocaleDateString()}</span>
            </div>
            {survey.comments && <div className="text-gray-700 mt-1">{survey.comments}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
} 