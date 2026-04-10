const RAZORPAY_SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

export const loadRazorpayCheckoutScript = async () => {
    if (typeof window !== 'undefined' && window.Razorpay) {
        console.log('[Razorpay] Checkout script already loaded');
        return true;
    }

    console.log('[Razorpay] Loading checkout script dynamically...');

    return new Promise((resolve) => {
        const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT_SRC}"]`);
        if (existing) {
            existing.addEventListener('load', () => resolve(true), { once: true });
            existing.addEventListener('error', () => resolve(false), { once: true });
            return;
        }

        const script = document.createElement('script');
        script.src = RAZORPAY_SCRIPT_SRC;
        script.async = true;
        script.onload = () => {
            console.log('[Razorpay] Checkout script loaded');
            resolve(true);
        };
        script.onerror = () => {
            console.error('[Razorpay] Failed to load checkout script');
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

export const handlePayment = async ({
    createOrder,
    verifyPayment,
    customer,
    onSuccess,
    onFailure,
    onDismiss,
    name = 'Endura',
    description = 'Complete your purchase',
    themeColor = '#000000',
}) => {
    console.log('[Payment] Step 1/4: ensuring Razorpay script is available');
    const scriptLoaded = await loadRazorpayCheckoutScript();
    if (!scriptLoaded) {
        throw new Error('Unable to load Razorpay checkout script');
    }

    console.log('[Payment] Step 2/4: creating backend order');
    const orderResponse = await createOrder();
    console.log('[Payment] create-order response:', orderResponse);

    const orderId = orderResponse?.orderId || orderResponse?.order_id;
    const amount = Number(orderResponse?.amount);
    const currency = orderResponse?.currency || 'INR';
    const key = orderResponse?.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;
    const dbOrderId = orderResponse?.dbOrderId || orderResponse?.db_order_id;

    if (!orderId || !Number.isFinite(amount) || amount <= 0 || !key) {
        throw new Error('Invalid create-order response. Missing orderId, amount, currency or key');
    }

    console.log('[Payment] Step 3/4: opening Razorpay modal', {
        orderId,
        amount,
        currency,
        hasDbOrderId: Boolean(dbOrderId),
    });

    const options = {
        key,
        amount,
        currency,
        name,
        description,
        order_id: orderId,
        prefill: {
            name: customer?.name || '',
            email: customer?.email || '',
            contact: customer?.contact || '',
        },
        theme: {
            color: themeColor,
        },
        handler: async (response) => {
            try {
                console.log('[Payment] Step 4/4: verifying payment signature', response);
                const verifyPayload = {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    db_order_id: dbOrderId,
                };

                const verifyResponse = await verifyPayment(verifyPayload);
                console.log('[Payment] Verification success:', verifyResponse);
                onSuccess?.({ orderResponse, verifyResponse, verifyPayload });
            } catch (error) {
                console.error('[Payment] Verification failed:', error);
                onFailure?.({
                    stage: 'verify',
                    error,
                });
            }
        },
        modal: {
            ondismiss: () => {
                console.log('[Payment] Razorpay modal dismissed by user');
                onDismiss?.();
            },
        },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
        console.error('[Payment] Razorpay payment.failed:', response?.error || response);
        onFailure?.({
            stage: 'payment_failed',
            error: response?.error || response,
        });
    });

    rzp.open();
    return orderResponse;
};