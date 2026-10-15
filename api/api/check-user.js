export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { user_id, zone_id } = req.body;

    if (!user_id || !zone_id) {
        return res.status(400).json({ error: 'User ID dan Zone ID wajib diisi' });
    }

    try {
        // Contoh integrasi request cek ID ke provider game / H2H 
        // (Sesuaikan endpoint API check game dari provider AgenH2H jika mereka menyediakannya)
        const apiResponse = await fetch('https://agenh2h.com/api/v1/game-checker', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': process.env.DIGIFLAZZ_USERNAME, // Menyesuaikan variabel environment yang kamu pakai
                'X-Signature': '...' // Jika menggunakan tanda tangan HMAC sesuai dokumentasi AgenH2H
            },
            body: JSON.stringify({
                target: user_id,
                zone: zone_id,
                game: 'mobile-legends'
            })
        });

        const data = await apiResponse.json();
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
