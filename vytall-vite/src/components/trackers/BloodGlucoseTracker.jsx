import React, { useState, useEffect } from 'react';
import { bloodGlucoseService } from '../../services/trackers/bloodGlucoseService';
import TrackerChart from './common/TrackerChart';
import TrackerForm from './common/TrackerForm';
import TrackerList from './common/TrackerList';

const BloodGlucoseTracker = ({ patientId }) => {
    const [readings, setReadings] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedReading, setSelectedReading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadReadings();
    }, [patientId]);

    const loadReadings = async () => {
        try {
            const data = await bloodGlucoseService.getPatientReadings(patientId);
            setReadings(data);
        } catch (err) {
            setError('Failed to load blood glucose readings');
            console.error(err);
        }
    };

    const handleAdd = () => {
        setSelectedReading(null);
        setIsFormOpen(true);
    };

    const handleEdit = (reading) => {
        setSelectedReading(reading);
        setIsFormOpen(true);
    };

    const handleDelete = async (reading) => {
        if (window.confirm('Are you sure you want to delete this reading?')) {
            try {
                await bloodGlucoseService.deleteReading(reading.bloodGlucoseId);
                loadReadings();
            } catch (err) {
                setError('Failed to delete reading');
                console.error(err);
            }
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedReading) {
                await bloodGlucoseService.updateReading(selectedReading.bloodGlucoseId, formData);
            } else {
                await bloodGlucoseService.createReading({ ...formData, patientId });
            }
            setIsFormOpen(false);
            loadReadings();
        } catch (err) {
            setError('Failed to save reading');
            console.error(err);
        }
    };

    const formFields = [
        {
            name: 'glucoseLevel',
            label: 'Glucose Level',
            type: 'number',
            required: true,
            min: 40,
            max: 600,
            helpText: 'Enter glucose level in mg/dL (40-600)'
        },
        {
            name: 'mealTiming',
            label: 'Meal Timing',
            type: 'select',
            required: true,
            options: [
                { value: 'fasting', label: 'Fasting' },
                { value: 'beforeMeal', label: 'Before Meal' },
                { value: 'afterMeal', label: 'After Meal' },
                { value: 'beforeBed', label: 'Before Bed' },
                { value: 'random', label: 'Random' }
            ]
        },
        {
            name: 'notes',
            label: 'Notes',
            type: 'textarea'
        },
        {
            name: 'lastMealTime',
            label: 'Last Meal Time',
            type: 'datetime-local'
        },
        {
            name: 'medicationsTaken',
            label: 'Medications Taken',
            type: 'text'
        },
        {
            name: 'isAfterExercise',
            label: 'After Exercise',
            type: 'checkbox'
        },
        {
            name: 'exerciseType',
            label: 'Exercise Type',
            type: 'text'
        },
        {
            name: 'exerciseDuration',
            label: 'Exercise Duration (minutes)',
            type: 'number',
            min: 0
        }
    ];

    const columns = [
        {
            key: 'readingDate',
            label: 'Date',
            render: (item) => new Date(item.readingDate).toLocaleString()
        },
        {
            key: 'glucoseLevel',
            label: 'Glucose Level',
            render: (item) => `${item.glucoseLevel} mg/dL`
        },
        {
            key: 'mealTiming',
            label: 'Meal Timing',
            render: (item) => {
                const timing = item.mealTiming || (item.isBeforeMeal ? 'Before Meal' : item.isAfterMeal ? 'After Meal' : 'N/A');
                return timing.charAt(0).toUpperCase() + timing.slice(1);
            }
        }
    ];

    const chartData = readings.map(reading => ({
        date: reading.readingDate,
        value: reading.glucoseLevel
    }));

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <TrackerChart
                data={chartData}
                title="Blood Glucose Trend"
                yAxisLabel="Glucose Level (mg/dL)"
                color="rgb(153, 102, 255)"
            />

            {isFormOpen ? (
                <TrackerForm
                    title={selectedReading ? 'Edit Reading' : 'Add New Reading'}
                    fields={formFields}
                    initialValues={selectedReading}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsFormOpen(false)}
                />
            ) : (
                <TrackerList
                    title="Blood Glucose Readings"
                    items={readings}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAdd={handleAdd}
                    addLabel="Add New Reading"
                />
            )}
        </div>
    );
};

export default BloodGlucoseTracker; 