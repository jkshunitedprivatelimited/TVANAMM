import Razorpay from 'razorpay';

let _razorpay: Razorpay | null = null;

/**
 * Lazy-initialized server-side Razorpay instance.
 * ONLY use in API routes — never expose key_secret to client.
 * 
 * Lazy init prevents build-time crashes when env vars
 * are not yet available (e.g. during Vercel static generation).
 */
export function getRazorpay(): Razorpay {
  if (!_razorpay) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error(
        '[Razorpay] Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET. Payments cannot be processed.'
      );
    }

    _razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return _razorpay;
}
