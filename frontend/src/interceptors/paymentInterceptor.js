/**
 * LAYER 2: Frontend Axios Interceptor
 * Purpose: Automatically diagnose and explain payment flow failures in the console.
 */

import api from '../services/api'; // Adjust path if necessary

export const setupPaymentInterceptor = () => {
    // Request Interceptor: Debugging what we send
    api.interceptors.request.use((config) => {
        if (config.url.includes('/api/payment')) {
            console.log('[ENDURA-PAY 📡] Outgoing Request:', {
                url: config.url,
                method: config.method,
                body: config.data,
                withCredentials: config.withCredentials || false
            });

            // Warn if session auth credentials are missing
            if (!config.withCredentials) {
                console.warn('[ENDURA-PAY ⚠️] Warning: withCredentials is set to false. Session cookies will not be sent!');
            }
        }
        return config;
    });

    // Response Interceptor: Diagnosing failures
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.config?.url.includes('/api/payment')) {
                const status = error.response?.status;
                const message = error.response?.data?.message || '';
                
                let diagnosis = 'Unknown failure in payment pipeline.';
                let fix = 'Check backend logs for more details.';

                // Map specific Endura backend triggers to diagnoses
                if (status === 401) {
                    diagnosis = 'Session not attached / Unauthorized.';
                    fix = 'Ensure user is logged in and withCredentials is set to true in Axios config.';
                } else if (status === 400) {
                    if (message.includes('No order items')) {
                        diagnosis = 'Empty cart sent to server.';
                        fix = 'Check checkoutItems array before calling createOrder.';
                    } else if (message.includes('asset')) {
                        diagnosis = "Payload contains 'product' key instead of 'asset'.";
                        fix = "Update mapping in confirmOrder to use asset: item.id.";
                    } else if (message.includes('shipping')) {
                        diagnosis = 'Required shipping fields missing.';
                        fix = 'Ensure all 5 address fields (fullName, address, city, postalCode, country) are filled.';
                    } else if (message.includes('stock')) {
                        diagnosis = 'Inventory mismatch.';
                        fix = 'The item was sold out between cart addition and checkout.';
                    }
                } else if (status === 404) {
                    diagnosis = 'Invalid Asset ID.';
                    fix = 'The Asset ID in the cart no longer exists in the database.';
                } else if (status === 500) {
                    diagnosis = 'Backend configuration or Razorpay error.';
                    fix = 'Check RAZORPAY_KEY_ID/SECRET on Render. Ensure Razorpay Instance is initialized.';
                }

                console.error(`[ENDURA-PAY ❌] Failure at: ${error.config.url}`);
                console.error(`[ENDURA-PAY 🔍] Diagnosis: ${diagnosis}`);
                console.error(`[ENDURA-PAY 🔧] Fix: ${fix}`);
            }
            return Promise.reject(error);
        }
    );
};
