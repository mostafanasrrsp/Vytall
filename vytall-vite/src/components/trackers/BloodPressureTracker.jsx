import React, { useState, useEffect } from 'react';
import { bloodPressureService } from '../../services/trackers/bloodPressureService';
import TrackerChart from './common/TrackerChart';
import TrackerForm from './common/TrackerForm';
import TrackerList from './common/TrackerList';

const BloodPressureTracker = ({ patientId }) => {
    const [readings, setReadings] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedReading, setSelectedReading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadReadings();
    }, [patientId]);

    const loadReadings = async () => {
        try {
            const data = await bloodPressureService.getPatientReadings(patientId);
            setReadings(data);
        } catch (err) {
            setError('Failed to load blood pressure readings');
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
                await bloodPressureService.deleteReading(reading.bloodPressureId);
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
                await bloodPressureService.updateReading(selectedReading.bloodPressureId, formData);
            } else {
                await bloodPressureService.createReading({ ...formData, patientId });
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
            name: 'systolic',
            label: 'Systolic Pressure',
            type: 'number',
            required: true,
            min: 60,
            max: 250,
            helpText: 'Enter systolic pressure in mmHg (60-250)'
        },
        {
            name: 'diastolic',
            label: 'Diastolic Pressure',
            type: 'number',
            required: true,
            min: 40,
            max: 150,
            helpText: 'Enter diastolic pressure in mmHg (40-150)'
        },
        {
            name: 'heartRate',
            label: 'Heart Rate',
            type: 'number',
            required: true,
            min: 40,
            max: 200,
            helpText: 'Enter heart rate in bpm (40-200)'
        },
        {
            name: 'armUsed',
            label: 'Arm Used',
            type: 'select',
            required: true,
            options: [
                { value: 'left', label: 'Left' },
                { value: 'right', label: 'Right' }
            ]
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
            name: 'isAfterExercise',
            label: 'After Exercise',
            type: 'checkbox'
        },
        {
            name: 'isAfterMedication',
            label: 'After Medication',
            type: 'checkbox'
        },
        {
            name: 'medicationTaken',
            label: 'Medication Taken',
            type: 'text'
        }
    ];

    const columns = [
        {
            key: 'readingDate',
            label: 'Date',
            render: (item) => new Date(item.readingDate).toLocaleString()
        },
        {
            key: 'systolic',
            label: 'Systolic',
            render: (item) => `${item.systolic} mmHg`
        },
        {
            key: 'diastolic',
            label: 'Diastolic',
            render: (item) => `${item.diastolic} mmHg`
        },
        {
            key: 'heartRate',
            label: 'Heart Rate',
            render: (item) => `${item.heartRate} bpm`
        },
        {
            key: 'armUsed',
            label: 'Arm Used'
        }
    ];

    const chartData = readings.map(reading => ({
        date: reading.readingDate,
        value: reading.systolic
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
                title="Blood Pressure Trend"
                yAxisLabel="Systolic Pressure (mmHg)"
                color="rgb(255, 99, 132)"
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
                    title="Blood Pressure Readings"
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

export default BloodPressureTracker; 