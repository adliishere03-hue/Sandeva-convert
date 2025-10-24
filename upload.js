import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    const boundary = req.headers["content-type"].split("boundary=")[1];
    const bodyString = buffer.toString("binary");
    const start = bodyString.indexOf("\r\n\r\n") + 4;
    const end = bodyString.lastIndexOf("\r\n------" + boundary);
    const fileBuffer = buffer.slice(start, end);

    const tempPath = path.join("/tmp", "upload_" + Date.now());
    fs.writeFileSync(tempPath, fileBuffer);

    const formData = new FormData();
    formData.append("file", fs.createReadStream(tempPath));

    const response = await axios.post("https://fadzzzcloud.biz.id/upload.php", formData, {
      headers: formData.getHeaders(),
    });

    fs.unlinkSync(tempPath);
    res.status(200).json({ success: true, url: response.data.files });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Gagal mengunggah file." });
  }
}
