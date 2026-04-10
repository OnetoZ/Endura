/**
 * LAYER 1: Frontend Pre-flight Validator
 * Purpose: Prevent 400 Bad Request errors by ensuring the payload matches exactly 
 * what the Backend createOrder controller expects.
 */

export const validateCheckoutPayload = (orderItems, shippingAddress) => {
    const errors = [];

    // 1. Validate orderItems structure
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
        errors.push('CRITICAL: orderItems must be a non-empty array.');
    } else {
        orderItems.forEach((item, index) => {
            // Check for 'asset' field (ENDURA uses Asset model, not Product)
            if (!item.asset) {
                errors.push(`item[${index}] missing 'asset' field. (Detected 'product' field instead? Fix mapping)`);
            }
            // Check quantity logic
            if (!item.quantity || item.quantity <= 0) {
                errors.push(`item[${index}] has invalid quantity: ${item.quantity}`);
            }
        });
    }

    // 2. Validate shippingAddress fields
    const requiredAddressFields = ['fullName', 'address', 'city', 'postalCode', 'country'];
    if (!shippingAddress) {
        errors.push('CRITICAL: shippingAddress is missing entirely.');
    } else {
        requiredAddressFields.forEach(field => {
            if (!shippingAddress[field] || String(shippingAddress[field]).trim() === '') {
                errors.push(`missing: shippingAddress.${field}`);
            }
        });
    }

    return {
        valid: errors.length === 0,
        errors
    };
};
