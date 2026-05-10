'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  RotateCcw,
  Trash2,
  Printer,
} from 'lucide-react';

interface OrderCustomer {
  full_name: string;
  email: string;
  phone: string;
}

interface AdminOrder {
  id: string;
  order_number: string;
  status: string;
  subtotal: number;
  shipping_fee: number;
  discount: number;
  total: number;
  payment_method: string;
  payment_status: string;
  razorpay_payment_id: string;
  created_at: string;
  shipping_address: {
    fullName: string;
    phone: string;
    city: string;
    state: string;
    pincode: string;
    addressLine1: string;
    addressLine2?: string;
  };
  customers: OrderCustomer;
  order_items: {
    id: string;
    product_name: string;
    sku: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    product_image: string;
  }[];
}

const STATUS_OPTIONS = ['all', 'placed', 'confirmed', 'processing', 'shipped', 'delivered'];
const STATUS_FLOW = ['placed', 'confirmed', 'processing', 'shipped', 'delivered'];

const statusColors: Record<string, string> = {
  placed: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  processing: 'bg-indigo-50 text-indigo-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
};

const adminStatusNames: Record<string, string> = {
  placed: 'Received',
  confirmed: 'Confirmed',
  processing: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

function formatCurrency(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminOrdersPage() {
  const { session } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [itemsPreview, setItemsPreview] = useState<AdminOrder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);

    const params = new URLSearchParams({
      page: String(page),
      limit: '15',
      status: statusFilter,
    });
    if (searchQuery) params.set('search', searchQuery);

    try {
      const res = await fetch(`/api/admin/orders?${params}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error('[Admin Orders] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [session?.access_token, page, statusFilter, searchQuery]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    if (!session?.access_token) return;
    setUpdatingId(orderId);

    try {
      const res = await fetch(`/api/admin/orders/${orderId.trim()}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        // Refetch orders to keep list in sync with current filter
        await fetchOrders();
      }
    } catch (err) {
      console.error('[Admin] Status update error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteOrder = async (orderId: string, orderNumber: string) => {
    if (!session?.access_token) return;
    if (!confirm(`Are you sure you want to completely delete order ${orderNumber}? This action cannot be undone.`)) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        setTotal((prev) => Math.max(0, prev - 1));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
      } else {
        alert('Failed to delete order. It might have related records preventing deletion.');
      }
    } catch (err) {
      console.error('[Admin] Delete error:', err);
      alert('An error occurred while deleting.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePrintInvoice = (order: AdminOrder) => {
    // Helper for number to words
    const numberToWords = (num: number) => {
      const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
      const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
      const inWords = (n: number) => {
        const nStr = n.toString();
        if (nStr.length > 9) return 'Overflow';
        const nArray = ('000000000' + nStr).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!nArray) return '';
        let str = '';
        str += (nArray[1] !== '00') ? (a[Number(nArray[1])] || b[Number(nArray[1][0])] + ' ' + a[Number(nArray[1][1])]) + 'Crore ' : '';
        str += (nArray[2] !== '00') ? (a[Number(nArray[2])] || b[Number(nArray[2][0])] + ' ' + a[Number(nArray[2][1])]) + 'Lakh ' : '';
        str += (nArray[3] !== '00') ? (a[Number(nArray[3])] || b[Number(nArray[3][0])] + ' ' + a[Number(nArray[3][1])]) + 'Thousand ' : '';
        str += (nArray[4] !== '0') ? (a[Number(nArray[4])] || b[Number(nArray[4][0])] + ' ' + a[Number(nArray[4][1])]) + 'Hundred ' : '';
        str += (nArray[5] !== '00') ? ((str !== '') ? 'and ' : '') + (a[Number(nArray[5])] || b[Number(nArray[5][0])] + ' ' + a[Number(nArray[5][1])]) : '';
        return str.trim() || 'Zero';
      };
      return 'Rupees ' + inWords(Math.floor(num)) + ' Only';
    };

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${order.order_number}</title>
          <style>
            @page { size: A4; margin: 10mm; }
            body { 
              font-family: Arial, Helvetica, sans-serif; 
              color: #000; 
              background: #fff;
              margin: 0;
              padding: 0;
              font-size: 11px;
            }
            .invoice-wrapper {
              max-width: 800px;
              margin: auto;
              padding: 0;
            }
            .main-border {
              border: 2px solid #000;
            }
            .title-box {
              text-align: center;
              padding: 10px 0;
            }
            .title-box h2 {
              margin: 0;
              font-size: 16px;
              text-transform: uppercase;
              text-decoration: underline;
              letter-spacing: 1px;
            }
            .header-grid {
              display: grid;
              grid-template-columns: 1fr 150px;
              border-top: 1px solid #000;
              border-bottom: 2px solid #000;
            }
            .header-left {
              padding: 10px;
            }
            .header-right {
              padding: 10px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            .header-right img {
              max-height: 50px;
              width: auto;
              object-fit: contain;
              margin-bottom: 5px;
            }
            .header-right .brand {
              font-weight: bold;
              font-size: 14px;
            }
            .underline-label {
              text-decoration: underline;
              font-weight: bold;
              margin-bottom: 5px;
              font-size: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #000;
              padding: 6px;
              text-align: left;
            }
            th {
              font-weight: bold;
              font-size: 10px;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .bold { font-weight: bold; }
            .uppercase { text-transform: uppercase; }
            
            .row-no-border-bottom td { border-bottom: none; }
            .row-no-border-top td { border-top: none; }
            
            .meta-table td { padding: 8px 10px; }
            .meta-table .label { font-size: 9px; margin-bottom: 4px; }
            .meta-table .val { font-size: 13px; font-weight: bold; }

            .billing-table td { padding: 8px 10px; vertical-align: top; }
            .billing-table .label { font-size: 9px; margin-bottom: 4px; }
            .billing-table .val { font-size: 12px; font-weight: bold; margin-bottom: 2px; }
            .billing-table .address { font-size: 10px; line-height: 1.4; font-weight: bold; }

            .items-table th { border-bottom: 2px solid #000; }
            .items-table td { border-bottom: none; border-top: none; padding-top: 8px; padding-bottom: 8px; }
            .items-table tr.last-item td { border-bottom: 1px solid #000; }
            .spacer-row td { height: 350px; } /* Force height for empty space */

            .footer-grid {
              display: grid;
              grid-template-columns: 60% 40%;
            }
            .footer-left { border-right: 1px solid #000; }
            .footer-box { border-bottom: 1px solid #000; padding: 6px 10px; }
            .footer-box:last-child { border-bottom: none; }
            
            .totals-table td { border: none; border-bottom: 1px solid #eee; padding: 5px 10px; }
            .totals-table tr:last-child td { border-bottom: none; }
            .totals-table .grand-total td {
              border-top: 1px solid #000;
              border-bottom: 2px solid #000;
              font-weight: bold;
              font-size: 12px;
              background-color: #f0f0f0;
            }

            .terms-text { font-size: 9px; line-height: 1.3; }
            
            .signature-box {
              height: 100px;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              align-items: center;
              padding-bottom: 10px;
            }
            .signature-line {
              width: 80%;
              border-top: 1px solid #000;
              margin-bottom: 5px;
            }
            .signature-text { font-size: 9px; font-weight: bold; }
            .page-number { text-align: right; font-size: 9px; font-weight: bold; margin-top: 5px; }

            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-wrapper">
            <div class="main-border">
              <div class="title-box">
                <h2>TAX INVOICE</h2>
              </div>
              
              <div class="header-grid">
                <div class="header-left">
                  <div class="underline-label">REGISTERED OFFICE:</div>
                  <div style="font-weight: bold; font-size: 10px; line-height: 1.4;">
                    Alluri Trade Centre, 5th Floor Flat number 406, Bhagyanagar Colony, Near<br>
                    KPHB Metro Station, Opposite to Metro Station Pillar #761<br>
                    GSTIN: 36AGLPN7778F1ZR<br>
                    Email: tvanamm@gmail.com
                  </div>
                </div>
                <div class="header-right">
                  <img src="${window.location.origin}/images/logo.png" alt="T VANAMM Logo" />
                  <div class="brand">T VANAMM</div>
                </div>
              </div>

              <table class="meta-table">
                <tr>
                  <td width="50%" style="border-top: none; border-left: none;">
                    <div class="label">INVOICE NO:</div>
                    <div class="val uppercase">#${order.order_number.replace('TV-', '')}</div>
                  </td>
                  <td width="50%" style="border-top: none; border-right: none;">
                    <div class="label">INVOICE DATE:</div>
                    <div class="val">${new Date(order.created_at).toLocaleDateString('en-GB')}</div>
                  </td>
                </tr>
              </table>

              <table class="billing-table">
                <tr>
                  <td width="70%" style="border-left: none;">
                    <div class="label">BILL TO:</div>
                    <div class="val uppercase">${order.shipping_address?.fullName || order.customers?.full_name}</div>
                    <div class="address uppercase">
                      ${order.shipping_address?.addressLine1 || ''}
                      ${order.shipping_address?.addressLine2 ? ', ' + order.shipping_address.addressLine2 : ''}<br>
                      ${order.shipping_address?.city || ''}, ${order.shipping_address?.state || ''} - ${order.shipping_address?.pincode || ''}
                    </div>
                  </td>
                  <td width="30%" style="border-right: none;">
                    <div style="display: flex; gap: 5px; margin-bottom: 5px;">
                      <div class="label" style="width: 20px;">ID:</div>
                      <div class="val">TV-${order.id.slice(0, 4).toUpperCase()}</div>
                    </div>
                    <div style="display: flex; gap: 5px;">
                      <div class="label" style="width: 20px;">Ph:</div>
                      <div class="val">${order.shipping_address?.phone || order.customers?.phone || ''}</div>
                    </div>
                  </td>
                </tr>
              </table>
              
              <table class="items-table">
                <thead>
                  <tr>
                    <th width="5%" class="text-center">S.No</th>
                    <th width="55%">Item Description</th>
                    <th width="10%" class="text-center">Qty</th>
                    <th width="15%" class="text-right">Rate</th>
                    <th width="15%" class="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${(order.order_items || []).map((item, i) => `
                    <tr>
                      <td class="text-center bold">${i + 1}</td>
                      <td class="bold uppercase">${item.product_name}</td>
                      <td class="text-center bold">${item.quantity} pkt</td>
                      <td class="text-right bold">₹${(item.unit_price / 100).toFixed(2)}</td>
                      <td class="text-right bold">₹${(item.total_price / 100).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                  <tr class="spacer-row last-item">
                    <td></td><td></td><td></td><td></td><td></td>
                  </tr>
                </tbody>
              </table>

              <div class="footer-grid">
                <div class="footer-left">
                  <div class="footer-box">
                    <div class="label" style="font-size: 9px; font-weight: bold; margin-bottom: 2px;">TOTAL AMOUNT IN WORDS:</div>
                    <div style="font-size: 11px; font-weight: bold; font-style: italic;">${numberToWords(order.total / 100)}</div>
                  </div>
                  <div class="footer-box" style="border-bottom: none;">
                    <div class="underline-label">TERMS & CONDITIONS:</div>
                    <div class="terms-text">
                      1) Goods once sold will not be taken back or exchanged.<br>
                      2) Payments terms: 100% advance payments.<br>
                      3) Once placed order cannot be cancelled.<br>
                      4) All legal matters are subject to Hyderabad jurisdiction only.<br>
                      5) Delivery may take time upto 3-5 working days.
                    </div>
                  </div>
                </div>
                
                <div class="footer-right" style="display: flex; flex-direction: column;">
                  <table class="totals-table" style="flex-grow: 1;">
                    <tr><td>Subtotal</td><td class="text-right">₹${(order.subtotal / 100).toFixed(2)}</td></tr>
                    <tr><td>Transportation</td><td class="text-right">₹${(order.shipping_fee / 100).toFixed(2)}</td></tr>
                    <tr class="grand-total"><td>TOTAL</td><td class="text-right">₹${(order.total / 100).toFixed(2)}</td></tr>
                  </table>
                  <div class="signature-box">
                    <div class="signature-line"></div>
                    <div class="signature-text">AUTHORIZED SIGNATURE</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="page-number">Page 1 of 1</div>
          </div>
          
          <script>
            window.onload = function() { 
              setTimeout(function() {
                window.print(); 
              }, 500);
            }
          </script>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank', 'width=800,height=800');
    if (printWindow) {
      printWindow.document.write(invoiceHtml);
      printWindow.document.close();
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{total} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order number..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006437]/20 focus:border-[#006437]"
          />
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-[#006437] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? 'All' : adminStatusNames[s] || s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-[#006437]" size={28} />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <Package size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <>
          {/* ── Mobile Card Layout (below lg) ── */}
          <div className="lg:hidden space-y-3">
            {orders.map((order) => {
              const currentIndex = STATUS_FLOW.indexOf(order.status);
              const itemCount = order.order_items?.length || 0;
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden"
                >
                  {/* Tappable card body — fixed height */}
                  <button
                    type="button"
                    onClick={() => setItemsPreview(order)}
                    className="w-full text-left p-4 h-[120px] flex flex-col justify-between active:bg-gray-50 transition-colors"
                  >
                    {/* Top row: Order number + Total */}
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-900 text-sm">{order.order_number}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{order.customers?.full_name || 'N/A'}</p>
                      </div>
                      <p className="font-bold text-gray-900 text-sm ml-3">{formatCurrency(order.total)}</p>
                    </div>

                    {/* Bottom row: Status + Date + Item count */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {adminStatusNames[order.status] || order.status}
                        </span>
                        <span className="text-[11px] text-gray-400">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                      </div>
                      <span className="text-[11px] text-gray-400">{formatDate(order.created_at)}</span>
                    </div>
                  </button>

                  {/* Status update buttons */}
                  {currentIndex !== -1 && (currentIndex < STATUS_FLOW.length - 1 || currentIndex > 0) && (
                    <div className="flex items-center gap-2 px-4 pb-3">
                      {currentIndex < STATUS_FLOW.length - 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); updateStatus(order.id, STATUS_FLOW[currentIndex + 1]); }}
                          disabled={updatingId === order.id}
                          className="flex-1 px-3 py-2 rounded-lg bg-[#006437] text-white text-xs font-semibold hover:bg-[#005530] transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                        >
                          Move to {adminStatusNames[STATUS_FLOW[currentIndex + 1]]} <ChevronRight size={14} />
                        </button>
                      )}
                      {currentIndex > 0 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); updateStatus(order.id, STATUS_FLOW[currentIndex - 1]); }}
                          disabled={updatingId === order.id}
                          className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                          title={`Undo to ${adminStatusNames[STATUS_FLOW[currentIndex - 1]]}`}
                        >
                          <RotateCcw size={12} /> Undo
                        </button>
                      )}
                    </div>
                  )}

                  {/* Action buttons row */}
                  <div className="flex items-center border-t border-gray-100">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-500 hover:text-[#006437] hover:bg-green-50 transition-colors border-r border-gray-100"
                    >
                      <Eye size={14} /> Details
                    </button>
                    <button
                      onClick={() => handlePrintInvoice(order)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-500 hover:text-[#006437] hover:bg-green-50 transition-colors border-r border-gray-100"
                    >
                      <Printer size={14} /> Invoice
                    </button>
                    <button
                      onClick={() => deleteOrder(order.id, order.order_number)}
                      disabled={isDeleting}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Desktop Table Layout (lg and above) ── */}
          <div className="hidden lg:block bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Order</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Customer</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Total</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const currentIndex = STATUS_FLOW.indexOf(order.status);
                  return (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{order.order_number}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-900">{order.customers?.full_name || 'N/A'}</p>
                        <p className="text-xs text-gray-400">{order.customers?.phone || ''}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col items-start gap-1.5">
                          <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-lg ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                            {adminStatusNames[order.status] || order.status}
                          </span>
                          {currentIndex !== -1 && (
                            <div className="flex items-center gap-1.5 mt-1">
                              {currentIndex > 0 && (
                                <button
                                  onClick={() => updateStatus(order.id, STATUS_FLOW[currentIndex - 1])}
                                  disabled={updatingId === order.id}
                                  className="px-2 py-1 rounded bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-[10px] font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                                  title={`Undo back to ${adminStatusNames[STATUS_FLOW[currentIndex - 1]]}`}
                                >
                                  <RotateCcw size={10} /> Undo
                                </button>
                              )}
                              {currentIndex < STATUS_FLOW.length - 1 && (
                                <button
                                  onClick={() => updateStatus(order.id, STATUS_FLOW[currentIndex + 1])}
                                  disabled={updatingId === order.id}
                                  className="px-2 py-1 rounded bg-[#006437] text-white hover:bg-[#005530] text-[10px] font-semibold transition-colors disabled:opacity-50 flex items-center gap-0.5 shadow-sm"
                                >
                                  Move to {adminStatusNames[STATUS_FLOW[currentIndex + 1]]} <ChevronRight size={12} />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-gray-900">{formatCurrency(order.total)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-500 text-xs">{formatDate(order.created_at)}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handlePrintInvoice(order)}
                            className="p-1.5 text-gray-400 hover:text-[#006437] hover:bg-green-50 rounded-lg transition-colors"
                            title="Print Invoice"
                          >
                            <Printer size={16} />
                          </button>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 text-gray-400 hover:text-[#006437] hover:bg-green-50 rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => deleteOrder(order.id, order.order_number)}
                            disabled={isDeleting}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete Order"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 mt-3 bg-white rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Items Preview Popup (mobile card tap) */}
      {itemsPreview && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={() => setItemsPreview(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-xl max-h-[70vh] flex flex-col animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-base">{itemsPreview.order_number}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{itemsPreview.customers?.full_name} · {formatDate(itemsPreview.created_at)}</p>
              </div>
              <button
                onClick={() => setItemsPreview(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* Items Table */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {itemsPreview.order_items && itemsPreview.order_items.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">Item</th>
                      <th className="text-center py-2 text-xs font-semibold text-gray-500 uppercase w-12">Qty</th>
                      <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase w-20">Rate</th>
                      <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase w-20">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsPreview.order_items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-50">
                        <td className="py-3">
                          <p className="font-medium text-gray-900 text-sm">{item.product_name}</p>
                        </td>
                        <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                        <td className="py-3 text-right text-gray-600">{formatCurrency(item.unit_price)}</td>
                        <td className="py-3 text-right font-semibold text-gray-900">{formatCurrency(item.total_price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400 text-center py-6">No items in this order</p>
              )}
            </div>

            {/* Footer with totals */}
            <div className="border-t border-gray-100 px-5 py-4 space-y-1.5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(itemsPreview.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span>{formatCurrency(itemsPreview.shipping_fee)}</span>
              </div>
              {itemsPreview.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(itemsPreview.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-gray-900 pt-1.5 border-t border-gray-200">
                <span>Total</span>
                <span className="text-[#006437]">{formatCurrency(itemsPreview.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-4 sm:p-6 m-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">{selectedOrder.order_number}</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrintInvoice(selectedOrder)}
                  className="p-1 text-gray-400 hover:text-[#006437] transition-colors"
                  title="Print Invoice"
                >
                  <Printer size={20} />
                </button>
                <button
                  onClick={() => deleteOrder(selectedOrder.id, selectedOrder.order_number)}
                  disabled={isDeleting}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  title="Delete Order"
                >
                  <Trash2 size={20} />
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs mb-1">Status</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${statusColors[selectedOrder.status]}`}>
                    {adminStatusNames[selectedOrder.status] || selectedOrder.status}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs mb-1">Total</p>
                  <p className="font-bold text-[#006437]">{formatCurrency(selectedOrder.total)}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs mb-1">Customer</p>
                <p className="font-medium text-gray-900">{selectedOrder.customers?.full_name}</p>
                <p className="text-gray-500">{selectedOrder.customers?.email}</p>
                <p className="text-gray-500">{selectedOrder.customers?.phone}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs mb-1">Shipping Address</p>
                <p className="font-medium text-gray-900">{selectedOrder.shipping_address?.fullName}</p>
                <p className="text-gray-500">
                  {selectedOrder.shipping_address?.addressLine1}
                  {selectedOrder.shipping_address?.addressLine2 && `, ${selectedOrder.shipping_address.addressLine2}`}
                </p>
                <p className="text-gray-500">
                  {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} - {selectedOrder.shipping_address?.pincode}
                </p>
                <p className="text-gray-500">📞 {selectedOrder.shipping_address?.phone}</p>
              </div>

              {selectedOrder.razorpay_payment_id && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs mb-1">Payment ID</p>
                  <p className="font-mono text-xs text-gray-900">{selectedOrder.razorpay_payment_id}</p>
                </div>
              )}

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs mb-1">Date</p>
                <p className="text-gray-900">{formatDate(selectedOrder.created_at)}</p>
              </div>

              {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs mb-2">Order Items ({selectedOrder.order_items.length})</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {selectedOrder.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded border border-gray-100 shadow-sm">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-xs">{item.product_name}</p>
                          <p className="text-gray-500 text-[10px]">Qty: {item.quantity} × {formatCurrency(item.unit_price)}</p>
                        </div>
                        <div className="font-semibold text-gray-900 text-xs text-right">
                          {formatCurrency(item.total_price)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Status Update */}
              <div>
                <p className="text-gray-500 text-xs mb-2">Advance Order Status</p>
                <div className="flex gap-1.5 flex-wrap">
                  {(() => {
                    const currentIndex = STATUS_FLOW.indexOf(selectedOrder.status);
                    if (currentIndex === -1) return null;
                    return (
                      <div className="flex flex-col sm:flex-row gap-2 w-full">
                        {currentIndex < STATUS_FLOW.length - 1 ? (
                          <button
                            onClick={() => updateStatus(selectedOrder.id, STATUS_FLOW[currentIndex + 1])}
                            disabled={updatingId === selectedOrder.id}
                            className="flex-1 px-4 py-2 bg-[#006437] text-white rounded-lg text-sm font-semibold hover:bg-[#005530] transition-colors disabled:opacity-50"
                          >
                            Mark as {adminStatusNames[STATUS_FLOW[currentIndex + 1]]}
                          </button>
                        ) : (
                          <div className="flex-1 px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-semibold text-center">
                            Order Fully Delivered
                          </div>
                        )}
                        {currentIndex > 0 && (
                          <button
                            onClick={() => updateStatus(selectedOrder.id, STATUS_FLOW[currentIndex - 1])}
                            disabled={updatingId === selectedOrder.id}
                            className="px-3 py-2 bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                            title={`Undo to ${adminStatusNames[STATUS_FLOW[currentIndex - 1]]}`}
                          >
                            <RotateCcw size={16} />
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
