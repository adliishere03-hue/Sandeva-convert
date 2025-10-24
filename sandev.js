// === STARFIELD ===
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

for (let i = 0; i < 180; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    z: Math.random() * 2 + 0.2,
    radius: Math.random() * 1.5,
  });
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fill();
    s.y += s.z;
    if (s.y > canvas.height) s.y = 0;
  });
  requestAnimationFrame(drawStars);
}
drawStars();

// === Welcome Screen Logic ===
const welcomeScreen = document.getElementById("welcome-screen");
const enterBtn = document.getElementById("enter-btn");
const bgVideo = document.getElementById("bg-video");

enterBtn.addEventListener("click", () => {
  // Minta izin audio
  bgVideo.muted = false;
  bgVideo.play().catch(() => {
    alert("Aktifkan audio di browser Anda untuk memutar musik.");
  });

  welcomeScreen.classList.add("hidden");
});

// === File Upload ===
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('fileInput');
  const resultDiv = document.getElementById('result');
  const progressBar = document.getElementById('progress-bar');
  const progress = document.getElementById('progress');

  if (!fileInput.files.length) {
    resultDiv.textContent = '⚠️ Pilih file terlebih dahulu!';
    return;
  }

  const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  resultDiv.textContent = 'Mengunggah file...';
  progressBar.style.display = 'block';
  progress.style.width = '0%';

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/upload', true);

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      const percent = (event.loaded / event.total) * 100;
      progress.style.width = `${percent.toFixed(0)}%`;
    }
  };

  xhr.onload = () => {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      if (data.success) {
        resultDiv.innerHTML = `
          ✅ File berhasil diunggah!<br>
          <a href="${data.url}" target="_blank">${data.url}</a>
        `;
      } else resultDiv.textContent = '❌ Gagal mengunggah file.';
    } else resultDiv.textContent = '❌ Terjadi kesalahan server.';
    progressBar.style.display = 'none';
  };

  xhr.onerror = () => {
    progressBar.style.display = 'none';
    resultDiv.textContent = '❌ Koneksi gagal.';
  };

  xhr.send(formData);
});
