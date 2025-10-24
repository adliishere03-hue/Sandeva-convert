const UPLOADCARE_PUBLIC_KEY = "demopublickey12345"; // ganti dengan key kamu

const script = document.createElement("script");
script.src = "https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js";
document.head.appendChild(script);

script.onload = () => {
  uploadcare.start({ publicKey: UPLOADCARE_PUBLIC_KEY });
};

// Elemen DOM
const enterBtn = document.getElementById("enterBtn");
const welcomeScreen = document.getElementById("welcomeScreen");
const container = document.querySelector(".container");
const bgVideo = document.getElementById("bgVideo");
const selectBtn = document.getElementById("selectBtn");
const uploadBtn = document.getElementById("uploadBtn");
const resultBox = document.getElementById("resultBox");
const fileUrl = document.getElementById("fileUrl");
const selectLoading = document.getElementById("selectLoading");
const loadingText = document.getElementById("loadingText");

// Masuk Website
enterBtn.addEventListener("click", async () => {
  welcomeScreen.classList.add("hidden");
  setTimeout(() => {
    welcomeScreen.style.display = "none";
    container.classList.add("active");
    container.classList.remove("hidden");
  }, 400);

  try {
    bgVideo.muted = false;
    await bgVideo.play();
  } catch {
    alert("🎵 Aktifkan audio manual jika musik tidak terdengar.");
  }
});

let selectedFile = null;

// Pilih File + Loading Visual
selectBtn.addEventListener("click", () => {
  selectLoading.classList.remove("hidden");
  loadingText.textContent = "Memasukkan gambar...";

  uploadcare.openDialog(null, { publicKey: UPLOADCARE_PUBLIC_KEY })
    .done(file => {
      selectedFile = file;
      setTimeout(() => {
        loadingText.textContent = "✅ Memasukkan gambar selesai, silakan tekan Upload Sekarang.";
        setTimeout(() => {
          selectLoading.classList.add("hidden");
          selectBtn.textContent = "📂 File Dipilih ✅";
        }, 1500);
      }, 2000);
    })
    .fail(() => {
      selectLoading.classList.add("hidden");
      alert("❌ Tidak ada file yang dipilih.");
    });
});

// Upload
uploadBtn.addEventListener("click", () => {
  if (!selectedFile) {
    alert("⚠️ Silakan pilih file terlebih dahulu.");
    return;
  }

  resultBox.classList.add("hidden");
  selectLoading.classList.remove("hidden");
  loadingText.textContent = "🚀 Mengunggah file Anda...";

  selectedFile.promise()
    .then(info => {
      const cdnUrl = `https://ucarecdn.com/${info.uuid}/`;
      fileUrl.href = cdnUrl;
      fileUrl.textContent = cdnUrl;
      selectLoading.classList.add("hidden");
      resultBox.classList.remove("hidden");
    })
    .catch(() => {
      selectLoading.classList.add("hidden");
      alert("❌ Gagal mengunggah file, coba lagi nanti.");
    });
});

// Efek salju
const snowContainer = document.querySelector(".snow");
for (let i = 0; i < 50; i++) {
  const snow = document.createElement("span");
  snow.style.left = Math.random() * 100 + "vw";
  snow.style.animationDuration = 4 + Math.random() * 10 + "s";
  snow.style.width = snow.style.height = 4 + Math.random() * 6 + "px";
  snow.style.animationDelay = Math.random() * 5 + "s";
  snowContainer.appendChild(snow);
}
