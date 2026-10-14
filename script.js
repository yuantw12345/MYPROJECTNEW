// Konfigurasi SDK Firebase kamu
const firebaseConfig = {
  apiKey: "AIzaSy...", 
  authDomain: "xauusd-analisis.firebaseapp.com",
  projectId: "tibatibaturnament",
  storageBucket: "tibatibaturnament.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

// Inisialisasi Firebase & Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Menggunakan koleksi 'chats' yang sudah ada di database kamu
const chatRef = db.collection('chats');

const chatContainer = document.getElementById('chatContainer');
const chatForm = document.getElementById('chatForm');
const usernameInput = document.getElementById('usernameInput');
const messageInput = document.getElementById('messageInput');

// Muat nama tersimpan dari LocalStorage jika ada
if (localStorage.getItem('xauusd_username')) {
  usernameInput.value = localStorage.getItem('xauusd_username');
}

// Dengarkan pesan real-time berdasarkan field 'time'
chatRef.orderBy('time', 'asc').onSnapshot((snapshot) => {
  chatContainer.innerHTML = '';
  
  if (snapshot.empty) {
    chatContainer.innerHTML = '<div style="text-align: center; color: #787b86; font-size: 12px; margin-top: 20px;">Belum ada pesan analisa. Jadilah yang pertama berdiskusi!</div>';
    return;
  }

  snapshot.forEach((doc) => {
    const data = doc.data();
    // Menyesuaikan format waktu dari database kamu
    const timeStr = data.time ? new Date(data.time.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    
    const messageCard = document.createElement('div');
    messageCard.className = 'message-card';
    messageCard.innerHTML = `
      <div class="message-meta">
        <span class="sender-name">${escapeHTML(data.username || 'Anonim')}</span>
        <span class="message-time">${timeStr}</span>
      </div>
      <div class="message-text">${escapeHTML(data.message || '')}</div>
    `;
    
    chatContainer.appendChild(messageCard);
  });

  // Scroll otomatis ke pesan terbaru
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

// Kirim pesan baru
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const sender = usernameInput.value.trim();
  const message = messageInput.value.trim();

  if (!sender || !message) return;

  // Simpan nama ke local storage
  localStorage.setItem('xauusd_username', sender);

  chatRef.add({
    username: sender,
    message: message,
    time: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    messageInput.value = '';
  })
  .catch((error) => {
    console.error("Gagal mengirim pesan: ", error);
  });
});

// Fungsi untuk mencegah XSS Script Injection
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
