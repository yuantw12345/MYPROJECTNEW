import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 1. Konfigurasi Firebase (Baru & Bersih)
const firebaseConfig = {
  apiKey: "AIzaSyDJSbXvoVqSPFbgwhRZzM4utTuJNgYsxb0",
  authDomain: "tibatibaturnament.firebaseapp.com",
  projectId: "tibatibaturnament",
  storageBucket: "tibatibaturnament.firebasestorage.app",
  messagingSenderId: "626781978918",
  appId: "1:626781978918:web:cd36017e37f9f0193541e7",
  measurementId: "G-C4GVSE0H90"
};

// 2. Inisialisasi Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. Nama Koleksi untuk Diskusi XAUUSD
const XAU_COLLECTION_NAME = "xausd_chats";

// 4. Inisialisasi Realtime Chat Analisa
function initXauLiveChat() {
  const chatBox = document.getElementById('xauChatBox');
  if (!chatBox) return;

  const q = query(
    collection(db, XAU_COLLECTION_NAME),
    orderBy('createdAt', 'asc'),
    limit(50)
  );

  onSnapshot(q, (snapshot) => {
    chatBox.innerHTML = '';
    if (snapshot.empty) {
      chatBox.innerHTML = `<div class="text-center text-slate-500 py-6 text-[11px]">Belum ada pesan analisa. Jadilah yang pertama berdiskusi!</div>`;
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      const name = data.username || 'Trader Anonymous';
      const msg = data.message || '';
      
      const timeStr = data.createdAt ? new Date(data.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Baru saja';

      const msgEl = document.createElement('div');
      msgEl.className = "bg-obsidian/60 border border-obsidian-border p-2.5 rounded-xl space-y-1";
      msgEl.innerHTML = `
        <div class="flex justify-between items-center text-[10px]">
          <span class="font-bold text-amber-400">${escapeHtml(name)}</span>
          <span class="text-slate-500">${timeStr}</span>
        </div>
        <p class="text-slate-200 text-xs break-words">${escapeHtml(msg)}</p>
      `;
      chatBox.appendChild(msgEl);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
  }, (error) => {
    console.error("Error fetching chats:", error);
    chatBox.innerHTML = `<div class="text-center text-rose-400 py-4 text-[11px]">Gagal memuat chat. Periksa koneksi internet.</div>`;
  });
}

// 5. Fungsi Kirim Pesan Analisa
window.handleSendXauChat = async function(event) {
  event.preventDefault();
  const nameInput = document.getElementById('xauUsername');
  const msgInput = document.getElementById('xauMessage');

  const username = nameInput.value.trim();
  const message = msgInput.value.trim();

  if (!username || !message) return;

  try {
    await addDoc(collection(db, XAU_COLLECTION_NAME), {
      username: username,
      message: message,
      createdAt: serverTimestamp()
    });

    msgInput.value = '';
  } catch (error) {
    console.error("Gagal mengirim pesan:", error);
    alert("Gagal mengirim pesan analisa!");
  }
};

// Helper keamanan
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// Jalankan saat halaman siap
document.addEventListener('DOMContentLoaded', () => {
  initXauLiveChat();
});