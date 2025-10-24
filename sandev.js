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
    statusMsg.innerHTML = "❌ <b>Silakan pilih file terlebih dahulu.</b>";
    statusMsg.style.color = "#ff8a8a";
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  statusMsg.style.color = "#ffd6ff";
  statusMsg.innerHTML = "🚀 <b>Mengunggah file...</b> Harap tunggu.";

  // Dua proxy publik otomatis
  const proxies = [
    "https://api.allorigins.win/raw?url=",
    "https://thingproxy.freeboard.io/fetch/"
  ];
  const target = encodeURIComponent("https://fadzzzcloud.biz.id/upload.php");

  let success = false;

  for (const proxy of proxies) {
    try {
      const response = await fetch(proxy + target, {
        method: "POST",
        body: formData,
      });

      const text = await response.text();
      let result;

      try {
        result = JSON.parse(text);
      } catch {
        console.warn("Respon bukan JSON:", text);
        result = { raw: text };
      }

      if (result.files) {
        statusMsg.style.color = "#7eff9b";
        statusMsg.innerHTML = `✅ File berhasil diunggah!<br><a href="${result.files}" target="_blank" style="color:#9be7ff;">${result.files}</a>`;
        success = true;
        break;
      } else {
        statusMsg.style.color = "#ffd6ff";
        statusMsg.innerHTML = "⚠️ Upload gagal. Server tidak mengembalikan URL.";
      }
    } catch (err) {
      console.error("Proxy gagal:", proxy, err);
    }
  }

  if (!success) {
    statusMsg.style.color = "#ff8a8a";
    statusMsg.innerHTML = "❌ Upload gagal total. Semua proxy gagal atau server tidak merespons.";
  }
});
