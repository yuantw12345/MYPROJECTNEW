// File: api/topup.js
const crypto = require('crypto');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method tidak diizinkan' });
  }

  const { userId, zoneId, productSku } = req.body;

  // Data akun DigiFlazz kamu (Nanti diganti saat verifikasi selesai)
  const username = process.env.DIGIFLAZZ_USERNAME; // Simpan di Environment Variable Vercel
  const apiKey = process.env.DIGIFLAZZ_API_KEY;   // Simpan di Environment Variable Vercel
  
  // Format ref_id unik untuk setiap transaksi
  const refId = `TOPUPONE-${Date.now()}`;
  
  // Buat signature MD5 sesuai dokumentasi DigiFlazz (username + apiKey + refId)
  const signature = crypto
    .createHash('md5')
    .update(username + apiKey + refId)
    .digest('hex');

  const payload = {
    username: username,
    buyer_sku_code: productSku, // Contoh SKU: "ml_86" untuk 86 Diamond
    customer_no: `${userId}${zoneId}`, // Menggabungkan ID Game + Zone ID
    ref_id: refId,
    sign: signature
  };

  try {
    // Kirim perintah otomatis ke DigiFlazz
    const response = await fetch('https://api.digiflazz.com/v1/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menghubungkan ke server DigiFlazz', error: error.message });
  }
}
