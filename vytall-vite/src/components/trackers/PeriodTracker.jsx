import React, { useState, useEffect } from 'react';
import TrackerChart from './common/TrackerChart';
import TrackerForm from './common/TrackerForm';
import TrackerList from './common/TrackerList';
import { periodTrackerService } from '../../services/trackers/periodTrackerService';

const formFields = [
    { name: 'flowIntensity', label: 'Flow Intensity', type: 'number', required: true, min: 1, max: 10, helpText: 'Rate your flow intensity from 1 to 10' },
    { name: 'startDate', label: 'Start Date', type: 'datetime-local', required: true },
    { name: 'endDate', label: 'End Date', type: 'datetime-local', required: true },
    { name: 'notes', label: 'Notes', type: 'textarea' },
    { name: 'symptoms', label: 'Symptoms', type: 'text', helpText: 'List any symptoms experienced' },
    { name: 'isUsingContraception', label: 'Using Contraception', type: 'checkbox' },
    { name: 'contraceptionType', label: 'Contraception Type', type: 'text' },
    { name: 'isPregnant', label: 'Pregnant', type: 'checkbox' },
    { name: 'isBreastfeeding', label: 'Breastfeeding', type: 'checkbox' },
    { name: 'medicationsTaken', label: 'Medications Taken', type: 'text' },
    { name: 'cycleLength', label: 'Cycle Length (days)', type: 'number', min: 1 },
    { name: 'periodLength', label: 'Period Length (days)', type: 'number', min: 1 }
];

const columns = [
    { key: 'startDate', label: 'Start Date', render: (item) => new Date(item.startDate).toLocaleString() },
    { key: 'endDate', label: 'End Date', render: (item) => new Date(item.endDate).toLocaleString() },
    { key: 'flowIntensity', label: 'Flow Intensity', render: (item) => item.flowIntensity ? `${item.flowIntensity}/10` : 'N/A' },
    { key: 'cycleLength', label: 'Cycle Length', render: (item) => item.cycleLength ? `${item.cycleLength} days` : 'N/A' },
    { key: 'periodLength', label: 'Period Length', render: (item) => item.periodLength ? `${item.periodLength} days` : 'N/A' }
];

const PeriodTracker = ({ patientId }) => {
    const [periods, setPeriods] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadPeriods();
    }, [patientId]);

    const loadPeriods = async () => {
        try {
            const data = await periodTrackerService.getPatientPeriods(patientId);
            setPeriods(data);
        } catch (err) {
            setError('Failed to load periods');
            console.error(err);
        }
    };

    const handleAdd = () => {
        setSelectedPeriod(null);
        setIsFormOpen(true);
    };

    const handleEdit = (period) => {
        setSelectedPeriod(period);
        setIsFormOpen(true);
    };

    const handleDelete = async (period) => {
        if (window.confirm('Are you sure you want to delete this period?')) {
            try {
                await periodTrackerService.deletePeriod(period.periodTrackerId);
                loadPeriods();
            } catch (err) {
                setError('Failed to delete period');
                console.error(err);
            }
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedPeriod) {
                await periodTrackerService.updatePeriod(selectedPeriod.periodTrackerId, formData);
            } else {
                await periodTrackerService.createPeriod({ ...formData, patientId });
            }
            setIsFormOpen(false);
            loadPeriods();
        } catch (err) {
            setError('Failed to save period');
            console.error(err);
        }
    };

    const chartData = periods.map(period => ({
        date: period.startDate,
        value: period.flowIntensity || 0
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
                title="Period Flow Intensity Trend"
                yAxisLabel="Flow Intensity (1-10)"
                color="rgb(255, 99, 132)"
            />

            {isFormOpen ? (
                <TrackerForm
                    title={selectedPeriod ? 'Edit Period' : 'Add New Period'}
                    fields={formFields}
                    initialValues={selectedPeriod}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsFormOpen(false)}
                />
            ) : (
                <TrackerList
                    title="Period Records"
                    items={periods}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAdd={handleAdd}
                    addLabel="Add New Period"
                />
            )}
        </div>
    );
};

export default PeriodTracker; 