export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { user_id, zone_id } = req.body;

    if (!user_id || !zone_id) {
        return res.status(400).json({ success: false, message: 'User ID dan Zone ID wajib diisi' });
    }

    try {
        // Menggunakan layanan pengecekan game publik untuk mengambil data nickname asli
        const response = await fetch(`https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store?productId=1&itemId=2&paymentId=353&gameId=${user_id}&zoneId=${zone_id}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Referer': 'https://duniagames.co.id/'
            }
        });

        const result = await response.json();

        if (result && result.data && result.data.gameDetail) {
            const nickname = result.data.gameDetail.userName;
            return res.status(200).json({
                success: true,
                username: nickname
            });
        } else {
            return res.status(200).json({
                success: false,
                message: 'ID atau Server salah / Akun tidak ditemukan'
            });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Gagal mengecek akun: ' + error.message });
    }
}
