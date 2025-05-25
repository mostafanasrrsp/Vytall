import React, { useState, useEffect } from 'react';
import TrackerChart from './common/TrackerChart';
import TrackerForm from './common/TrackerForm';
import TrackerList from './common/TrackerList';
import { weightService } from '../../services/trackers/weightService';

const WeightTracker = ({ patientId }) => {
    const [readings, setReadings] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedReading, setSelectedReading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadReadings();
    }, [patientId]);

    const loadReadings = async () => {
        try {
            const data = await weightService.getPatientReadings(patientId);
            setReadings(data);
        } catch (err) {
            setError('Failed to load weight readings');
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
                await weightService.deleteReading(reading.weightId);
                loadReadings();
            } catch (err) {
                setError('Failed to delete reading');
                console.error(err);
            }
        }
    };

    const handleSubmit = async (formData) => {
        try {
            const submitData = {
                ...formData,
                readingDate: formData.readingDate ? new Date(formData.readingDate).toISOString() : undefined,
                value: parseFloat(formData.value)
            };
            if (selectedReading) {
                await weightService.updateReading(selectedReading.weightId, submitData);
            } else {
                await weightService.createReading({ ...submitData, patientId });
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
            name: 'readingDate',
            label: 'Date',
            type: 'datetime-local',
            required: true,
            getInitialValue: (reading) => reading && reading.readingDate ? new Date(reading.readingDate).toISOString().slice(0, 16) : ''
        },
        {
            name: 'value',
            label: 'Weight (kg)',
            type: 'number',
            required: true,
            min: 0,
            step: 0.1
        },
        {
            name: 'notes',
            label: 'Notes',
            type: 'textarea'
        }
    ];

    const columns = [
        {
            key: 'readingDate',
            label: 'Date',
            render: (item) => new Date(item.readingDate).toLocaleString()
        },
        {
            key: 'value',
            label: 'Weight (kg)'
        },
        {
            key: 'notes',
            label: 'Notes'
        }
    ];

    const chartData = readings.map(reading => ({
        date: reading.readingDate,
        value: reading.value
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
                title="Weight Trend"
                yAxisLabel="Weight (kg)"
                color="rgb(54, 162, 235)"
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
                    title="Weight Readings"
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

export default WeightTracker; 