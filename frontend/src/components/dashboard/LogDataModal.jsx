import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { toast } from 'sonner';
import { X } from 'lucide-react';

export default function LogDataModal({ logType, onClose, onSuccess }) {
    const [value, setValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingEntry, setExistingEntry] = useState(null);

    // --- THIS IS THE FIX ---
    // We've added a 'noun' property to make the success message robust.
    const config = {
        steps: { title: 'Log Your Steps', unit: 'steps', endpoint: '/daily-data/steps/', field: 'step_count', noun: 'Steps' },
        water: { title: 'Log Water Intake', unit: 'glasses', endpoint: '/daily-data/water/', field: 'milliliters', multiplier: 250, noun: 'Water' },
        sleep: { title: 'Log Your Sleep', unit: 'hours', endpoint: '/daily-data/sleep/', field: 'duration_hours', noun: 'Sleep' },
        weight: { title: 'Log Your Weight', unit: 'kg', endpoint: '/daily-data/weight/', field: 'weight_kg', noun: 'Weight' },
    };

    const currentConfig = config[logType];
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchExistingData = async () => {
            try {
                const res = await apiClient.get(`${currentConfig.endpoint}?date=${today}`);
                if (res.data && res.data.length > 0) {
                    const entry = res.data[0];
                    setExistingEntry(entry);
                    let displayValue = entry[currentConfig.field];
                    if (logType === 'water') {
                        displayValue = Math.round(displayValue / currentConfig.multiplier);
                    }
                    setValue(displayValue);
                }
            } catch (err) {
                console.log(`No existing ${logType} entry for today.`);
            }
        };
        fetchExistingData();
    }, [logType]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        let payloadValue = value;
        if (logType === 'water') {
            payloadValue = value * currentConfig.multiplier;
        }

        const payload = {
            [currentConfig.field]: payloadValue,
            date: today,
        };

        try {
            if (existingEntry) {
                await apiClient.patch(`${currentConfig.endpoint}${existingEntry.id}/`, payload);
                // --- THIS IS THE FIX ---
                toast.success(`${currentConfig.noun} updated successfully!`);

            } else {
                await apiClient.post(currentConfig.endpoint, payload);
                // --- THIS IS THE FIX ---
                toast.success(`${currentConfig.noun} logged successfully!`);
            }
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1000); // A half-second delay is plenty of time.

            // onSuccess();
            // onClose();
        } catch (err) {
            toast.error('Failed to save data. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-bold">{currentConfig.title}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Today's {logType} ({currentConfig.unit})</label>
                        <input
                            type="number"
                            step={logType === 'sleep' || logType === 'weight' ? '0.1' : '1'}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500"
                            required
                            autoFocus
                        />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-2.5 text-white font-semibold bg-green-500 rounded-lg hover:bg-green-600 disabled:bg-gray-400">
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </form>
            </div>
        </div>
    );
}
