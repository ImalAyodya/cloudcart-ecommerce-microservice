const emailService = require('../utils/emailService');

const getRecipient = (requestedEmail) => {
	return requestedEmail || process.env.STOCK_ALERT_EMAIL || process.env.EMAIL_USER;
};

// POST /api/notifications/product/low-stock
const sendLowStockAlert = async (req, res) => {
	try {
		const recipientEmail = getRecipient(req.body.recipientEmail);
		const payload = Array.isArray(req.body.products) ? req.body.products : [req.body];

		if (!recipientEmail) {
			return res.status(400).json({ success: false, message: 'Recipient email is required' });
		}

		if (!payload.length || !payload[0].name) {
			return res.status(400).json({ success: false, message: 'No product data provided' });
		}

		const itemsHtml = payload.map((p) => `
			<tr>
				<td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0;">${p.name}</td>
				<td style="padding: 8px 12px; text-align: center; border-bottom: 1px solid #e2e8f0;">${p.stock}</td>
				<td style="padding: 8px 12px; text-align: center; border-bottom: 1px solid #e2e8f0;">${p.threshold ?? 'n/a'}</td>
				<td style="padding: 8px 12px; text-align: center; border-bottom: 1px solid #e2e8f0;">${p.status || 'Active'}</td>
				<td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0;">${p.category || 'General'}</td>
			</tr>
		`).join('');

		await emailService.sendGenericEmail({
			to: recipientEmail,
			subject: 'Low stock alert',
			html: `
				<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #f8fafc; padding: 16px;">
					<h2 style="margin: 0 0 12px; color: #0f172a;">Products nearing stock limits</h2>
					<p style="margin: 0 0 16px; color: #475569;">These products are at or below the configured threshold.</p>
					<table style="width: 100%; border-collapse: collapse; background: #ffffff; border-radius: 8px; overflow: hidden;">
						<thead style="background: #e2e8f0; color: #0f172a; text-align: left;">
							<tr>
								<th style="padding: 10px 12px;">Product</th>
								<th style="padding: 10px 12px; text-align: center;">Stock</th>
								<th style="padding: 10px 12px; text-align: center;">Threshold</th>
								<th style="padding: 10px 12px; text-align: center;">Status</th>
								<th style="padding: 10px 12px;">Category</th>
							</tr>
						</thead>
						<tbody>${itemsHtml}</tbody>
					</table>
					<p style="margin: 16px 0 0; color: #94a3b8; font-size: 12px;">Generated at ${new Date().toISOString()}</p>
				</div>
			`,
		});

		res.status(200).json({ success: true, message: 'Low stock alert sent' });
	} catch (error) {
		console.error('Failed to send low stock alert:', error.message);
		res.status(500).json({ success: false, message: 'Failed to send low stock alert' });
	}
};

// POST /api/notifications/product/stock-snapshot
const sendStockSnapshot = async (req, res) => {
	try {
		const recipientEmail = getRecipient(req.body.recipientEmail);
		const { summary = {}, lowStockProducts = [], generatedAt } = req.body;

		if (!recipientEmail) {
			return res.status(400).json({ success: false, message: 'Recipient email is required' });
		}

		const itemsHtml = lowStockProducts.map((p) => `
			<tr>
				<td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0;">${p.name}</td>
				<td style="padding: 8px 12px; text-align: center; border-bottom: 1px solid #e2e8f0;">${p.stock}</td>
				<td style="padding: 8px 12px; text-align: center; border-bottom: 1px solid #e2e8f0;">${p.status || 'Active'}</td>
				<td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0;">${p.category || 'General'}</td>
			</tr>
		`).join('') || '<tr><td colspan="4" style="padding: 12px; text-align: center; color: #94a3b8;">No low stock items</td></tr>';

		await emailService.sendGenericEmail({
			to: recipientEmail,
			subject: 'Stock snapshot',
			html: `
				<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #f8fafc; padding: 16px;">
					<h2 style="margin: 0 0 12px; color: #0f172a;">Inventory snapshot</h2>
					<p style="margin: 0 0 16px; color: #475569;">High-level stock summary with low-stock items highlighted.</p>
					<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; margin-bottom: 16px;">
						<div style="background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
							<div style="color: #475569; font-size: 12px;">Total</div>
							<div style="color: #0f172a; font-weight: 700; font-size: 18px;">${summary.total ?? 0}</div>
						</div>
						<div style="background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
							<div style="color: #475569; font-size: 12px;">Active</div>
							<div style="color: #0f172a; font-weight: 700; font-size: 18px;">${summary.active ?? 0}</div>
						</div>
						<div style="background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
							<div style="color: #475569; font-size: 12px;">Low stock</div>
							<div style="color: #b45309; font-weight: 700; font-size: 18px;">${summary.lowStock ?? 0}</div>
						</div>
						<div style="background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
							<div style="color: #475569; font-size: 12px;">Out of stock</div>
							<div style="color: #dc2626; font-weight: 700; font-size: 18px;">${summary.outOfStock ?? 0}</div>
						</div>
					</div>
					<table style="width: 100%; border-collapse: collapse; background: #ffffff; border-radius: 8px; overflow: hidden;">
						<thead style="background: #e2e8f0; color: #0f172a; text-align: left;">
							<tr>
								<th style="padding: 10px 12px;">Product</th>
								<th style="padding: 10px 12px; text-align: center;">Stock</th>
								<th style="padding: 10px 12px; text-align: center;">Status</th>
								<th style="padding: 10px 12px;">Category</th>
							</tr>
						</thead>
						<tbody>${itemsHtml}</tbody>
					</table>
					<p style="margin: 16px 0 0; color: #94a3b8; font-size: 12px;">Generated at ${generatedAt || new Date().toISOString()}</p>
				</div>
			`,
		});

		res.status(200).json({ success: true, message: 'Stock snapshot sent' });
	} catch (error) {
		console.error('Failed to send stock snapshot:', error.message);
		res.status(500).json({ success: false, message: 'Failed to send stock snapshot' });
	}
};

module.exports = {
	sendLowStockAlert,
	sendStockSnapshot,
};
