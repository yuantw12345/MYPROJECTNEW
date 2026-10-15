export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { user_id, zone_id } = req.body;

    if (!user_id || !zone_id) {
        return res.status(400).json({ success: false, message: 'User ID dan Zone ID wajib diisi' });
    }

    const apiKey = process.env.DIGIFLAZZ_USERNAME;

    try {
        const apiResponse = await fetch('https://agenh2h.com/api/v1/game-checker', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey
            },
            body: JSON.stringify({
                game: 'mobile-legends',
                target: user_id,
                zone: zone_id
            })
        });

        const data = await apiResponse.json();

        // Kita kembalikan seluruh data mentah dari AgenH2H ke frontend agar terlihat di kotak log
        return res.status(200).json({
            success: true,
            raw_response: data, // Membantu melihat struktur asli dari AgenH2H
            username: data.username || data.name || data.nickname || data.data?.username || data.data?.name || `User: ${user_id}`
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Gagal terhubung: ' + error.message });
    }
}
