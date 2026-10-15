import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { user_id, zone_id } = req.body;

    if (!user_id || !zone_id) {
        return res.status(400).json({ success: false, message: 'User ID dan Zone ID wajib diisi' });
    }

    const merchantId = process.env.APIGAMES_MERCHANT_ID;
    const secretKey = process.env.APIGAMES_SECRET_KEY;

    if (!merchantId || !secretKey) {
        return res.status(500).json({ 
            success: false, 
            message: 'Konfigurasi APIGAMES_MERCHANT_ID dan APIGAMES_SECRET_KEY belum diisi di Vercel' 
        });
    }

    // Formula Signature MD5 APIGames: md5(merchant_id + secret_key)
    const signature = crypto.createHash('md5').update(merchantId + secretKey).digest('hex');

    try {
        const targetId = `${user_id}${zone_id}`;
        const url = `https://v1.apigames.id/merchant/${merchantId}/cek-username/mobilelegend?user_id=${targetId}&signature=${signature}`;

        const response = await fetch(url);
        const data = await response.json();

        // APIGames umumnya mengembalikan struktur data seperti { status, data: { username }, message } atau langsung { is_valid, username }
        const nickname = data.data?.username || data.username;

        if ((data.status === 200 || data.is_valid || data.success) && nickname) {
            return res.status(200).json({
                success: true,
                username: nickname
            });
        } else {
            return res.status(400).json({
                success: false,
                message: data.message || 'ID atau Server salah / Akun tidak ditemukan!'
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal terhubung ke server APIGames: ' + error.message
        });
    }
}
