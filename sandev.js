const enterBtn = document.getElementById("enterBtn");
const welcomeScreen = document.getElementById("welcomeScreen");
const bgVideo = document.getElementById("bgVideo");
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const statusMsg = document.getElementById("statusMsg");

enterBtn.addEventListener("click", async () => {
  welcomeScreen.classList.add("hidden");
  document.querySelector(".container").classList.remove("hidden");

  try {
    bgVideo.muted = false;
    await bgVideo.play();
  } catch {
    alert("⚠️ Aktifkan audio secara manual agar musik dapat diputar.");
  }
});

uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) {
    statusMsg.textContent = "❌ Silakan pilih file terlebih dahulu.";
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  statusMsg.textContent = "⏳ Mengunggah file...";

  try {
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const target = "https://fadzzzcloud.biz.id/upload.php";

    const response = await fetch(proxy + target, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.files) {
      statusMsg.style.color = "#7eff9b";
      statusMsg.innerHTML = `✅ File berhasil diunggah!<br>URL: <a href="${result.files}" target="_blank">${result.files}</a>`;
    } else {
      statusMsg.textContent = "⚠️ Upload gagal. Server tidak merespons.";
    }
  } catch (error) {
    console.error(error);
    statusMsg.textContent = "❌ Terjadi kesalahan koneksi atau proxy.";
  }
});
