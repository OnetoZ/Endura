/**
 * LAYER 3: Frontend Checkout Orchestrator Hook
 * Purpose: Manage the sequential steps of the payment pipeline with strict validation
 * and exhaustive logging.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../context/StoreContext';
import { validateCheckoutPayload } from '../utils/validateCheckoutPayload';
import { handlePayment } from '../utils/payment';
import { orderService } from '../services/api';

export const useCheckout = () => {
    const { currentUser } = useStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const startCheckout = async (orderItems, shippingAddress) => {
        setLoading(true);
        setError(null);

        console.log('[ENDURA-PAY] 🚀 Initializing Checkout Pipeline');

        try {
            // 1. Auth Guard - prevent anonymous checkout
            if (!currentUser) {
                console.warn('[ENDURA-PAY] 🛑 Auth Failure: No user session found.');
                navigate('/login');
                return;
            }

            // 2. Pre-flight Validation - ensure payload structure is correct
            const validation = validateCheckoutPayload(orderItems, shippingAddress);
            if (!validation.valid) {
                console.error('[ENDURA-PAY] 🛑 Validation Failure:', validation.errors);
                setError(validation.errors.join(' | '));
                setLoading(false);
                return;
            }
            console.log('[ENDURA-PAY] ✅ Payload Validated');

            // 3. Cookie/Session Integrity Check
            // Backend Render needs withCredentials for cross-site cookies
            if (axios.defaults.withCredentials !== true) {
                console.warn('[ENDURA-PAY] 🍪 Warning: axios.defaults.withCredentials was false. Enforcing true now.');
                axios.defaults.withCredentials = true;
            }

            // 4. Delegate to handlePayment utility for Razorpay Modal logic
            await handlePayment({
                createOrder: () => orderService.createRazorpayOrder({
                    orderItems, // These now use 'asset' key after pre-validation
                    shippingAddress
                }),
                verifyPayment: (payload) => orderService.verifyPayment(payload),
                customer: {
                    name: shippingAddress.fullName,
                    email: currentUser.email,
                    contact: shippingAddress.phone || currentUser.phone
                },
                onSuccess: ({ orderResponse }) => {
                    console.log('[ENDURA-PAY] 🎉 Checkout Pipeline Complete');
                    const brandedOrderId = orderResponse?.orderId || orderResponse?.order_id;
                    const paidAmount = Number(orderResponse?.amount || 0) / 100;
                    navigate('/order-success', {
                        state: {
                            orderId: brandedOrderId,
                            amount: paidAmount,
                        },
                    });
                },
                onFailure: ({ stage, error: err }) => {
                    console.error(`[ENDURA-PAY] ❌ Pipeline Failed at Stage: ${stage}`, err);
                    setError(err?.response?.data?.message || err.message || 'Checkout failed');
                    if (stage === 'payment_failed') {
                        navigate('/order-failed');
                    }
                }
            });

        } catch (err) {
            console.error('[ENDURA-PAY] 💥 Unexpected Pipeline Exception:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { startCheckout, loading, error };
};
