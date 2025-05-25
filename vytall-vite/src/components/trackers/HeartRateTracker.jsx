import React, { useState, useEffect } from 'react';
import TrackerChart from './common/TrackerChart';
import TrackerForm from './common/TrackerForm';
import TrackerList from './common/TrackerList';
import { heartRateService } from '../../services/trackers/heartRateService';

const formFields = [
    {
        name: 'rate',
        label: 'Heart Rate',
        type: 'number',
        required: true,
        min: 40,
        max: 200,
        helpText: 'Enter heart rate in bpm (40-200)'
    },
    {
        name: 'notes',
        label: 'Notes',
        type: 'textarea'
    },
    {
        name: 'isAfterMeal',
        label: 'After Meal',
        type: 'checkbox'
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
    },
    {
        name: 'isResting',
        label: 'Resting',
        type: 'checkbox'
    },
    {
        name: 'isSleeping',
        label: 'Sleeping',
        type: 'checkbox'
    }
];

const columns = [
    {
        key: 'readingDate',
        label: 'Date',
        render: (item) => new Date(item.readingDate).toLocaleString()
    },
    {
        key: 'rate',
        label: 'Heart Rate',
        render: (item) => `${item.rate} bpm`
    },
    {
        key: 'isAfterExercise',
        label: 'After Exercise',
        render: (item) => item.isAfterExercise ? 'Yes' : 'No'
    },
    {
        key: 'isResting',
        label: 'Resting',
        render: (item) => item.isResting ? 'Yes' : 'No'
    }
];

const HeartRateTracker = ({ patientId }) => {
    const [readings, setReadings] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedReading, setSelectedReading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadReadings();
    }, [patientId]);

    const loadReadings = async () => {
        try {
            const data = await heartRateService.getPatientReadings(patientId);
            setReadings(data);
        } catch (err) {
            setError('Failed to load heart rate readings');
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
                await heartRateService.deleteReading(reading.heartRateId);
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
                await heartRateService.updateReading(selectedReading.heartRateId, formData);
            } else {
                await heartRateService.createReading({ ...formData, patientId });
            }
            setIsFormOpen(false);
            loadReadings();
        } catch (err) {
            setError('Failed to save reading');
            console.error(err);
        }
    };

    const chartData = readings.map(reading => ({
        date: reading.readingDate,
        value: reading.rate
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
                title="Heart Rate Trend"
                yAxisLabel="Heart Rate (bpm)"
                color="rgb(255, 205, 86)"
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
                    title="Heart Rate Readings"
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

export default HeartRateTracker; 