import crypto from 'crypto';

/**
 * Verify Razorpay payment signature using HMAC-SHA256.
 * Returns true if the signature is valid.
 */
export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    console.error('[Razorpay] RAZORPAY_KEY_SECRET not set — cannot verify');
    return false;
  }

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}
