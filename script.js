async function checkNickname() {
    const userIdInput = document.getElementById('user_id') || document.querySelector('input[name="user_id"]');
    const zoneIdInput = document.getElementById('zone_id') || document.querySelector('input[name="zone_id"]');

    const userId = userIdInput ? userIdInput.value.trim() : '';
    const zoneId = zoneIdInput ? zoneIdInput.value.trim() : '';

    if (!userId || !zoneId) {
        alert('User ID dan Zone ID wajib diisi!');
        return;
    }

    try {
        const response = await fetch('/api/check-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
                zone_id: zoneId
            })
        });

        const result = await response.json();

        if (result.success) {
            alert('Nickname ditemukan: ' + result.username);
        } else {
            alert(result.message || 'ID atau Server salah / Akun tidak ditemukan!');
        }
    } catch (error) {
        alert('Terjadi kesalahan sistem: ' + error.message);
    }
}
