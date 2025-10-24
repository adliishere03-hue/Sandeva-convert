const enterBtn = document.getElementById("enterBtn");
const welcomeScreen = document.getElementById("welcomeScreen");
const container = document.querySelector(".container");
const bgVideo = document.getElementById("bgVideo");
const fileInput = document.getElementById("fileInput");
const selectBtn = document.getElementById("selectBtn");
const uploadBtn = document.getElementById("uploadBtn");
const selectLoading = document.getElementById("selectLoading");
const loadingText = document.getElementById("loadingText");
const resultBox = document.getElementById("resultBox");
const fileUrl = document.getElementById("fileUrl");

let selectedFile = null;

// ✅ Sembunyikan tombol Upload di awal
uploadBtn.style.display = "none";

// 🚀 Halaman sambutan → masuk ke website
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

// 📁 Tombol Pilih File
selectBtn.addEventListener("click", () => fileInput.click());

// 🎬 Saat file dipilih
fileInput.addEventListener("change", () => {
  if (!fileInput.files.length) return;

  selectedFile = fileInput.files[0];

  // Sembunyikan tombol pilih
  selectBtn.style.display = "none";
  uploadBtn.style.display = "none";
  resultBox.classList.add("hidden");
  selectLoading.classList.remove("hidden");
  loadingText.textContent = "📥 Memasukkan file...";

  // Simulasi loading animasi
  setTimeout(() => {
    loadingText.textContent = "✅ File berhasil dimasukkan, silakan upload sekarang.";

    setTimeout(() => {
      selectLoading.classList.add("hidden");

      // 🌟 Munculkan tombol Upload
      uploadBtn.style.display = "inline-block";
      uploadBtn.style.opacity = "0";
      uploadBtn.style.transform = "scale(0.8)";
      setTimeout(() => {
        uploadBtn.style.transition = "all 0.5s ease";
        uploadBtn.style.opacity = "1";
        uploadBtn.style.transform = "scale(1)";
      }, 50);
    }, 1200);
  }, 2000);
});

// 🚀 Upload File ke GoFile.io
uploadBtn.addEventListener("click", async () => {
  if (!selectedFile) {
    alert("⚠️ Silakan pilih file terlebih dahulu.");
    return;
  }

  // Hilangkan tombol upload, tampilkan loading
  uploadBtn.style.display = "none";
  selectLoading.classList.remove("hidden");
  loadingText.textContent = "🚀 Mengunggah file ke GoFile.io...";

  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    const response = await fetch("https://api.gofile.io/uploadFile", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("GoFile response:", data);

    if (data.status === "ok") {
      const link = data.data.downloadPage;
      fileUrl.href = link;
      fileUrl.textContent = link;
      selectLoading.classList.add("hidden");
      resultBox.classList.remove("hidden");
      loadingText.textContent = "✅ Upload berhasil!";
    } else {
      throw new Error(data.status);
    }
  } catch (error) {
    console.error("Upload error:", error);
    selectLoading.classList.add("hidden");
    alert("❌ Gagal mengunggah file ke GoFile.io, coba lagi nanti.");
    selectBtn.style.display = "inline-block"; // tampilkan kembali tombol pilih file
  }
});

// ❄️ Efek salju cantik
const snowContainer = document.querySelector(".snow");
for (let i = 0; i < 50; i++) {
  const snow = document.createElement("span");
  snow.style.left = Math.random() * 100 + "vw";
  snow.style.animationDuration = 4 + Math.random() * 10 + "s";
  snow.style.width = snow.style.height = 4 + Math.random() * 6 + "px";
  snow.style.animationDelay = Math.random() * 5 + "s";
  snowContainer.appendChild(snow);
}
