export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { user_id, zone_id } = req.body;

    if (!user_id || !zone_id) {
        return res.status(400).json({ success: false, message: 'User ID dan Zone ID wajib diisi' });
    }

    // Validasi panjang ID standar Mobile Legends (User ID biasanya 8-10 digit, Zone ID 4 digit)
    if (user_id.length < 5 || zone_id.length < 3) {
        return res.status(200).json({ 
            success: false, 
            message: 'Format ID atau Server terlalu pendek!' 
        });
    }

    // Karena format ID sudah benar, kita tampilkan data akun siap transaksi
    return res.status(200).json({
        success: true,
        username: `Player (${user_id})`
    });
}
