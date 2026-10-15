import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { user_id, zone_id, buyer_sku_code } = req.body;

    if (!user_id || !buyer_sku_code) {
        return res.status(400).json({ success: false, message: 'Data transaksi tidak lengkap' });
    }

    // Kredensial dari Vercel Environment Variables
    const apiKey = process.env.DIGIFLAZZ_USERNAME; // Berisi API Key: A2H-4ZCEP7JGUX6FDPCEQNY6MVXFBPXFJHBF
    const secretKey = process.env.DIGIFLAZZ_API_KEY; // Berisi Secret Key: akK1HPlJqt1opBupibo6q6lSVrDTBXJVqYwgU5Pybq0C1dCjAhUxHR5dNHSbKaj

    // Format nomor tujuan (untuk Mobile Legends biasanya user_id + zone_id)
    const customerNo = zone_id ? `${user_id}${zone_id}` : user_id;
    const refId = `TOPUPONE-${Date.now()}`;
    const timestamp = Math.floor(Date.now() / 1000).toString();

    // Pembuatan Signature HMAC-SHA256 sesuai aturan AgenH2H: timestamp + api_key + ref_id
    const signaturePayload = timestamp + apiKey + refId;
    const signature = crypto
        .createHmac('sha256', secretKey)
        .update(signaturePayload)
        .digest('hex');

    try {
        // Request transaksi ke endpoint AgenH2H
        const apiResponse = await fetch('https://agenh2h.com/api/v1/transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey,
                'X-Timestamp': timestamp,
                'X-Signature': signature
            },
            body: JSON.stringify({
                ref_id: refId,
                buyer_sku_code: buyer_sku_code,
                customer_no: customerNo
            })
        });

        const result = await apiResponse.json();
        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
