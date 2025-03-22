import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function MedicationAdherence() {
  // 🔹 Static data (Replace with real data later)
  const totalDoses = 20;
  const takenDoses = 18;
  const adherenceRate = Math.round((takenDoses / totalDoses) * 100);

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-2">Your Medication Adherence</h2>
      <div className="flex items-center space-x-4">
        {/* Circular Progress Indicator */}
        <div className="w-16 h-16">
          <CircularProgressbar
            value={adherenceRate}
            text={`${adherenceRate}%`}
            styles={buildStyles({
              textColor: '#1d5b91',
              pathColor: adherenceRate >= 80 ? '#1e5631' : '#f7a541', // Green if good, orange if moderate
              trailColor: '#e0e0e0',
            })}
          />
        </div>

        {/* Text Summary */}
        <div>
          <p className="text-gray-700">{`Taken ${takenDoses} of ${totalDoses} doses this month`}</p>
          <p className={`text-sm font-semibold ${adherenceRate >= 80 ? 'text-[#1e5631]' : 'text-[#f7a541]'}`}>
            {adherenceRate >= 80 ? 'Great job! Keep it up!' : 'Try to stay on track!'}
          </p>
        </div>
      </div>
    </div>
  );
}