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

// === Welcome Screen ===
const welcomeScreen = document.getElementById("welcome-screen");
const enterBtn = document.getElementById("enter-btn");
const bgVideo = document.getElementById("bg-video");

enterBtn.addEventListener("click", async () => {
  welcomeScreen.classList.add("hidden");
  document.querySelector('.container').classList.remove('hidden'); // ✅ Tambahkan baris ini

  try {
    bgVideo.muted = false;
    await bgVideo.play();
  } catch {
    alert("⚠️ Aktifkan audio secara manual agar musik dapat diputar.");
  }
});


// === File Upload langsung ke FadzzzCloud ===
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

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('file', file);

  resultDiv.textContent = 'Mengunggah file...';
  progressBar.style.display = 'block';
  progress.style.width = '0%';

  try {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://fadzzzcloud.biz.id/upload.php', true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = (event.loaded / event.total) * 100;
        progress.style.width = `${percent.toFixed(0)}%`;
      }
    };

    xhr.onload = () => {
      progressBar.style.display = 'none';
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        if (data.files) {
          resultDiv.innerHTML = `✅ File berhasil diunggah!<br><a href="${data.files}" target="_blank">${data.files}</a>`;
        } else resultDiv.textContent = '❌ Gagal mendapatkan URL dari server.';
      } else resultDiv.textContent = '❌ Gagal mengunggah file.';
    };

    xhr.onerror = () => {
      progressBar.style.display = 'none';
      resultDiv.textContent = '❌ Terjadi kesalahan koneksi.';
    };

    xhr.send(formData);
  } catch (err) {
    progressBar.style.display = 'none';
    resultDiv.textContent = '❌ Kesalahan internal.';
  }
});
