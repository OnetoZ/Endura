import { useState, useCallback } from 'react';
import api from '../services/api';

export const useVaultScore = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [scoreData, setScoreData] = useState(null);

    const collectItem = useCallback(async (itemId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post(`/vault/${itemId}/collect`);
            setScoreData(response.data);

            // Sync with local storage if necessary, though dashboard should ideally refetch
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            if (userInfo) {
                userInfo.creditScore = response.data.newScore;
                userInfo.credits = response.data.newScore; // Sync older systems
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
            }

            return response.data;
        } catch (err) {
            const message = err.response?.data?.message || 'Collection failed';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { collectItem, scoreData, loading, error };
};
