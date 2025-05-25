import React, { useState, useEffect } from 'react';
import { stressLevelService } from '../../services/trackers/stressLevelService';
import TrackerChart from './common/TrackerChart';
import TrackerForm from './common/TrackerForm';
import TrackerList from './common/TrackerList';

const StressLevelTracker = ({ patientId }) => {
    const [readings, setReadings] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedReading, setSelectedReading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadReadings();
    }, [patientId]);

    const loadReadings = async () => {
        try {
            const data = await stressLevelService.getPatientReadings(patientId);
            setReadings(data);
        } catch (err) {
            setError('Failed to load stress level readings');
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
                await stressLevelService.deleteReading(reading.stressLevelId);
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
                await stressLevelService.updateReading(selectedReading.stressLevelId, formData);
            } else {
                await stressLevelService.createReading({ ...formData, patientId });
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
            name: 'level',
            label: 'Stress Level',
            type: 'number',
            required: true,
            min: 1,
            max: 10,
            helpText: 'Rate your stress level from 1 (lowest) to 10 (highest)'
        },
        {
            name: 'notes',
            label: 'Notes',
            type: 'textarea'
        },
        {
            name: 'trigger',
            label: 'Trigger',
            type: 'text',
            helpText: 'What triggered this stress level?'
        },
        {
            name: 'copingMechanism',
            label: 'Coping Mechanism',
            type: 'text',
            helpText: 'How did you cope with this stress?'
        },
        {
            name: 'isAfterExercise',
            label: 'Exercise',
            type: 'checkbox'
        },
        {
            name: 'isAfterMeditation',
            label: 'Meditation',
            type: 'checkbox'
        },
        {
            name: 'isAfterSleep',
            label: 'Sleep',
            type: 'checkbox'
        },
        {
            name: 'medicationsTaken',
            label: 'Medications Taken',
            type: 'text'
        },
        {
            name: 'sleepHours',
            label: 'Sleep Hours',
            type: 'number',
            min: 0,
            max: 24,
            helpText: 'How many hours did you sleep?'
        },
        {
            name: 'isWorkDay',
            label: 'Work Day',
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
            key: 'level',
            label: 'Stress Level',
            render: (item) => `${item.level}/10`
        },
        {
            key: 'trigger',
            label: 'Trigger'
        },
        {
            key: 'copingMechanism',
            label: 'Coping Mechanism'
        },
        {
            key: 'isWorkDay',
            label: 'Work Day',
            render: (item) => item.isWorkDay ? 'Yes' : 'No'
        }
    ];

    const chartData = readings.map(reading => ({
        date: reading.readingDate,
        value: reading.level
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
                title="Stress Level Trend"
                yAxisLabel="Stress Level (1-10)"
                color="rgb(255, 159, 64)"
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
                    title="Stress Level Readings"
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

export default StressLevelTracker; 