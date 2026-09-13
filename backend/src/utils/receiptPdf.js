const PDFDocument = require('pdfkit');

function money(value) {
  return `EGP ${Number(value || 0).toFixed(2)}`;
}

function line(address) {
  if (!address) return '';
  return [address.fullName, address.phone, address.line1 || address.street, address.city, address.state, address.postalCode || address.zip, address.country]
    .filter(Boolean)
    .join(', ');
}

function receiptPdf(order) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 48 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(18).text('Compu-Aboali', { align: 'left' });
    doc.moveDown(0.3);
    doc.fontSize(12).text('Order receipt', { align: 'left' });
    doc.moveDown();
    doc.fontSize(10).text(`Order: ${order.orderNumber}`);
    if (order.invoiceNumber) doc.text(`Invoice: ${order.invoiceNumber}`);
    doc.text(`Date: ${new Date(order.paidAt || order.createdAt).toLocaleString('en-GB')}`);
    doc.text(`Status: ${order.status}`);
    doc.text(`Customer: ${order.user?.name || ''} <${order.user?.email || ''}>`);
    const ship = line(order.shippingAddress);
    if (ship) doc.text(`Ship to: ${ship}`);
    doc.moveDown();

    doc.fontSize(11).text('Items');
    doc.moveDown(0.4);
    for (const item of order.items || []) {
      doc.fontSize(10).text(`${item.quantity} × ${item.name}  (${item.sku || '—'})`, { continued: true });
      doc.text(money(item.lineTotal), { align: 'right' });
    }

    doc.moveDown();
    doc.text(`Subtotal: ${money(order.subtotal)}`);
    doc.text(`Tax: ${money(order.tax)}`);
    doc.text(`Shipping: ${money(order.shipping)}`);
    doc.fontSize(12).text(`Total: ${money(order.total)}`);
    doc.moveDown();
    doc.fontSize(9).fillColor('#555').text('This is a simulated receipt for Compu-Aboali.');
    doc.end();
  });
}

module.exports = { receiptPdf };
