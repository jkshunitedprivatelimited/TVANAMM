import resend from '@/lib/email/resend';

const FROM_EMAIL = process.env.SES_FROM_EMAIL || 'no-reply@tvanamm.com';
const ADMIN_EMAIL = process.env.SES_TO_EMAIL || 'tvanamm@gmail.com';

interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price: number; // paise
  total_price: number; // paise
  sku: string;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

interface OrderData {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  items: OrderItem[];
  subtotal: number; // paise
  shipping_fee: number; // paise
  total: number; // paise
  shipping_address: ShippingAddress;
  created_at: string;
  payment_status: string;
  razorpay_payment_id?: string;
}

function formatCurrency(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 0 })}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Build HTML for the order confirmation email sent to the customer.
 */
function buildCustomerEmailHtml(order: OrderData): string {
  const itemRows = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151;">${item.product_name}</td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151; text-align: right;">${formatCurrency(item.unit_price)}</td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151; text-align: right; font-weight: 600;">${formatCurrency(item.total_price)}</td>
    </tr>`
    )
    .join('');

  const addr = order.shipping_address;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #006437, #004d2a); padding: 32px; text-align: center;">
      <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 4px 0;">T VANAMM</h1>
      <p style="color: #C8A96E; font-size: 12px; letter-spacing: 2px; margin: 0; text-transform: uppercase;">Order Confirmation</p>
    </div>

    <!-- Greeting -->
    <div style="padding: 32px 24px 16px;">
      <p style="font-size: 16px; color: #111827; margin: 0 0 8px;">Hello ${order.customer_name},</p>
      <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin: 0;">
        Thank you for your order! We have received your payment and your order is now being processed.
      </p>
    </div>

    <!-- Order Info -->
    <div style="padding: 0 24px 24px;">
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="font-size: 13px; color: #6b7280; padding: 4px 0;">Order Number</td>
            <td style="font-size: 14px; font-weight: 700; color: #006437; text-align: right; padding: 4px 0;">${order.order_number}</td>
          </tr>
          <tr>
            <td style="font-size: 13px; color: #6b7280; padding: 4px 0;">Order Date</td>
            <td style="font-size: 14px; color: #111827; text-align: right; padding: 4px 0;">${formatDate(order.created_at)}</td>
          </tr>
          <tr>
            <td style="font-size: 13px; color: #6b7280; padding: 4px 0;">Payment ID</td>
            <td style="font-size: 14px; color: #111827; text-align: right; padding: 4px 0;">${order.razorpay_payment_id || 'N/A'}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Items Table -->
    <div style="padding: 0 24px 24px;">
      <h3 style="font-size: 16px; color: #111827; margin: 0 0 12px;">Order Items</h3>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="padding: 10px 16px; font-size: 12px; text-transform: uppercase; color: #6b7280; text-align: left; font-weight: 600;">Item</th>
            <th style="padding: 10px 16px; font-size: 12px; text-transform: uppercase; color: #6b7280; text-align: center; font-weight: 600;">Qty</th>
            <th style="padding: 10px 16px; font-size: 12px; text-transform: uppercase; color: #6b7280; text-align: right; font-weight: 600;">Price</th>
            <th style="padding: 10px 16px; font-size: 12px; text-transform: uppercase; color: #6b7280; text-align: right; font-weight: 600;">Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
    </div>

    <!-- Totals -->
    <div style="padding: 0 24px 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Subtotal</td>
          <td style="padding: 6px 0; font-size: 14px; color: #111827; text-align: right;">${formatCurrency(order.subtotal)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Shipping</td>
          <td style="padding: 6px 0; font-size: 14px; color: #111827; text-align: right;">${formatCurrency(order.shipping_fee)}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0 6px; font-size: 18px; font-weight: 700; color: #006437; border-top: 2px solid #e5e7eb;">Total</td>
          <td style="padding: 10px 0 6px; font-size: 18px; font-weight: 700; color: #006437; text-align: right; border-top: 2px solid #e5e7eb;">${formatCurrency(order.total)}</td>
        </tr>
      </table>
      <p style="font-size: 11px; color: #9ca3af; margin: 8px 0 0;">* All prices are inclusive of GST</p>
    </div>

    <!-- Shipping Address -->
    <div style="padding: 0 24px 24px;">
      <h3 style="font-size: 16px; color: #111827; margin: 0 0 12px;">Delivery Address</h3>
      <div style="background: #f9fafb; border-radius: 8px; padding: 16px;">
        <p style="font-size: 14px; font-weight: 600; color: #111827; margin: 0 0 4px;">${addr.fullName}</p>
        <p style="font-size: 13px; color: #6b7280; margin: 0; line-height: 1.5;">
          ${addr.addressLine1}${addr.addressLine2 ? ', ' + addr.addressLine2 : ''}<br>
          ${addr.city}, ${addr.state} - ${addr.pincode}<br>
          Phone: ${addr.phone}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 13px; color: #6b7280; margin: 0 0 4px;">Need help? Reply to this email or reach us at</p>
      <a href="mailto:tvanamm@gmail.com" style="font-size: 13px; color: #006437; text-decoration: none; font-weight: 600;">tvanamm@gmail.com</a>
      <p style="font-size: 11px; color: #9ca3af; margin: 16px 0 0;">© ${new Date().getFullYear()} T VANAMM. A brand of JKSH United Private Limited.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Build HTML for the admin notification email.
 */
function buildAdminEmailHtml(order: OrderData): string {
  const itemList = order.items
    .map(
      (item) =>
        `<li style="font-size:14px;color:#374151;padding:4px 0;">${item.product_name} × ${item.quantity} = ${formatCurrency(item.total_price)} (SKU: ${item.sku})</li>`
    )
    .join('');

  const addr = order.shipping_address;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, sans-serif; background: #f9fafb; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
    <div style="background: #006437; padding: 20px; text-align: center;">
      <h2 style="color: #fff; margin: 0;">🛒 New Order Received!</h2>
    </div>
    <div style="padding: 24px;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        <tr><td style="font-weight:600;padding:6px 0;color:#111;">Order:</td><td style="padding:6px 0;">${order.order_number}</td></tr>
        <tr><td style="font-weight:600;padding:6px 0;color:#111;">Customer:</td><td style="padding:6px 0;">${order.customer_name} (${order.customer_email})</td></tr>
        <tr><td style="font-weight:600;padding:6px 0;color:#111;">Phone:</td><td style="padding:6px 0;">${order.customer_phone}</td></tr>
        <tr><td style="font-weight:600;padding:6px 0;color:#111;">Total:</td><td style="padding:6px 0;font-weight:700;color:#006437;">${formatCurrency(order.total)}</td></tr>
        <tr><td style="font-weight:600;padding:6px 0;color:#111;">Payment ID:</td><td style="padding:6px 0;">${order.razorpay_payment_id || 'N/A'}</td></tr>
      </table>
      <h3 style="font-size: 15px; margin: 16px 0 8px;">Items:</h3>
      <ul style="margin: 0; padding-left: 20px;">${itemList}</ul>
      <h3 style="font-size: 15px; margin: 16px 0 8px;">Ship To:</h3>
      <p style="font-size:14px;color:#374151;line-height:1.5;margin:0;">
        ${addr.fullName}<br>${addr.addressLine1}${addr.addressLine2 ? ', ' + addr.addressLine2 : ''}<br>
        ${addr.city}, ${addr.state} - ${addr.pincode}<br>Phone: ${addr.phone}
      </p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Send order confirmation email to the customer.
 */
export async function sendOrderConfirmationEmail(order: OrderData): Promise<void> {
  try {
    await resend.emails.send({
      from: `T VANAMM <${FROM_EMAIL}>`,
      to: order.customer_email,
      subject: `Order Confirmed — ${order.order_number} | T VANAMM`,
      html: buildCustomerEmailHtml(order),
    });
    console.log(`[Email] Customer confirmation sent to ${order.customer_email}`);
  } catch (error) {
    console.error('[Email] Failed to send customer confirmation:', error);
  }
}

/**
 * Send admin notification email about a new order.
 */
export async function sendAdminNewOrderEmail(order: OrderData): Promise<void> {
  try {
    await resend.emails.send({
      from: `T VANAMM Orders <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `🛒 New Order ${order.order_number} — ${formatCurrency(order.total)}`,
      html: buildAdminEmailHtml(order),
    });
    console.log(`[Email] Admin notification sent for ${order.order_number}`);
  } catch (error) {
    console.error('[Email] Failed to send admin notification:', error);
  }
}

/**
 * Send order status update email to the customer.
 */
export async function sendOrderStatusEmail(
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  newStatus: string
): Promise<void> {
  const statusMessages: Record<string, string> = {
    confirmed: 'Your order has been confirmed and is being prepared.',
    processing: 'Your order is being packed and prepared for shipment.',
    shipped: 'Your order has been shipped and is on its way!',
    delivered: 'Your order has been delivered. Enjoy your T VANAMM products!',
    cancelled: 'Your order has been cancelled. If you were charged, a refund will be processed.',
  };

  const message = statusMessages[newStatus] || `Your order status has been updated to: ${newStatus}`;

  try {
    await resend.emails.send({
      from: `T VANAMM <${FROM_EMAIL}>`,
      to: customerEmail,
      subject: `Order ${orderNumber} — ${newStatus === 'processing' ? 'Packed' : newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} | T VANAMM`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, sans-serif; background: #f9fafb; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #006437, #004d2a); padding: 32px; text-align: center;">
      <h1 style="color: #fff; font-size: 22px; margin: 0;">T VANAMM</h1>
      <p style="color: #C8A96E; font-size: 12px; letter-spacing: 2px; margin: 4px 0 0; text-transform: uppercase;">Order Update</p>
    </div>
    <div style="padding: 32px 24px;">
      <p style="font-size: 16px; color: #111827;">Hello ${customerName},</p>
      <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">${message}</p>
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <p style="margin: 0; font-size: 14px;"><strong>Order:</strong> ${orderNumber}</p>
        <p style="margin: 4px 0 0; font-size: 14px;"><strong>Status:</strong> ${newStatus === 'processing' ? 'Packed' : newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</p>
      </div>
      <p style="font-size: 13px; color: #9ca3af;">Need help? Email us at <a href="mailto:tvanamm@gmail.com" style="color: #006437;">tvanamm@gmail.com</a></p>
    </div>
    <div style="background: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 11px; color: #9ca3af; margin: 0;">© ${new Date().getFullYear()} T VANAMM. A brand of JKSH United Private Limited.</p>
    </div>
  </div>
</body>
</html>`,
    });
    console.log(`[Email] Status update (${newStatus}) sent to ${customerEmail}`);
  } catch (error) {
    console.error(`[Email] Failed to send status update:`, error);
  }
}

/**
 * Master function: Notify all parties about a newly placed order.
 */
export async function notifyOrderPlaced(order: OrderData): Promise<void> {
  await Promise.allSettled([
    sendOrderConfirmationEmail(order),
    sendAdminNewOrderEmail(order),
  ]);
}

export type { OrderData, OrderItem, ShippingAddress };
