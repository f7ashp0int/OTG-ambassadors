import React, { useRef, useState, useEffect } from "react";
import "./App.css";

// Paths to your assets (update as needed)
const TEMPLATE_URL = "/template.png"; // Your design with transparent green area
const AVATAR_PRESETS = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  // Add more preset avatar paths here
];
const WEBSITE_LINK = "https://otgstats.xyz";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [templateImg, setTemplateImg] = useState<HTMLImageElement | null>(null);
  const [avatarImg, setAvatarImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [fontFile, setFontFile] = useState<File | null>(null);
  const [fontName, setFontName] = useState("VT323"); // fallback default
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Load template on mount
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = TEMPLATE_URL;
    img.onload = () => setTemplateImg(img);
  }, []);

  // Load custom font if uploaded
  useEffect(() => {
    if (!fontFile) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const font = new FontFace("UserFont", e.target?.result as ArrayBuffer);
      font.load().then(f => {
        (document as any).fonts.add(f);
        setFontName("UserFont");
      });
    };
    reader.readAsArrayBuffer(fontFile);
  }, [fontFile]);

  // Draw everything on canvas
  useEffect(() => {
    if (!templateImg) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw template
    ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

    // Draw avatar in green area (update coords as per your template)
    const avatarArea = { x: 50, y: 170, w: 670, h: 370 }; // Adjust these!
    if (avatarImg) {
      // Cover mode
      const ratio = Math.max(
        avatarArea.w / avatarImg.width,
        avatarArea.h / avatarImg.height
      );
      const dw = avatarImg.width * ratio;
      const dh = avatarImg.height * ratio;
      ctx.save();
      ctx.beginPath();
      ctx.rect(avatarArea.x, avatarArea.y, avatarArea.w, avatarArea.h);
      ctx.clip();
      ctx.drawImage(
        avatarImg,
        avatarArea.x + (avatarArea.w - dw) / 2,
        avatarArea.y + (avatarArea.h - dh) / 2,
        dw,
        dh
      );
      ctx.restore();
    }

    // Draw name and role
    ctx.save();
    ctx.font = `bold 38px '${fontName}'`;
    ctx.fillStyle = "#fff";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    // Name
    ctx.fillText(
      name,
      90, // x (adjust)
      610 // y (adjust)
    );
    // Role
    ctx.font = `bold 32px '${fontName}'`;
    ctx.fillText(
      role,
      90, // x (adjust)
      660 // y (adjust)
    );
    ctx.restore();
  }, [templateImg, avatarImg, name, role, fontName]);

  // Generate download URL
  useEffect(() => {
    if (!canvasRef.current) return;
    setDownloadUrl(canvasRef.current.toDataURL("image/png"));
  }, [templateImg, avatarImg, name, role, fontName]);

  // Avatar upload handler
  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new window.Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => setAvatarImg(img);
  }

  // Avatar preset choose
  function handlePresetAvatar(path: string) {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = path;
    img.onload = () => setAvatarImg(img);
  }

  // Font upload handler
  function handleFontUpload(e: React.ChangeEvent<HTMLInputElement>) {
    setFontFile(e.target.files?.[0] || null);
  }

  // Share to X (Twitter)
  function shareToX() {
    const text = encodeURIComponent(
      `I am an OTG Ambassador!\nName: ${name}\nRole: ${role}\n${WEBSITE_LINK}`
    );
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, "_blank");
  }

  return (
    <div className="container">
      <h1>OTG Ambassador Card Generator</h1>
      <div className="card-preview">
        <canvas ref={canvasRef} width={768} height={960} />
      </div>
      <div className="controls">
        <div>
          <label>Upload Avatar:</label>
          <input type="file" accept="image/*" onChange={handleAvatarUpload} />
        </div>
        <div>
          <label>Or choose avatar:</label>
          <div className="preset-avatars">
            {AVATAR_PRESETS.map((url, i) => (
              <img
                src={url}
                alt={`preset-avatar-${i}`}
                key={i}
                onClick={() => handlePresetAvatar(url)}
                style={{
                  width: 48,
                  height: 48,
                  cursor: "pointer",
                  border: avatarImg?.src === url ? "2px solid #0f0" : "",
                  marginRight: 8,
                }}
              />
            ))}
          </div>
        </div>
        <div>
          <label>
            Name:
            <input
              type="text"
              maxLength={24}
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Role:
            <input
              type="text"
              maxLength={24}
              value={role}
              onChange={e => setRole(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>Upload Custom Font (.ttf):</label>
          <input type="file" accept=".ttf" onChange={handleFontUpload} />
        </div>
        <div className="action-row">
          {downloadUrl && (
            <a
              href={downloadUrl}
              download={`OTG-ambassador-${name || "card"}.png`}
              className="download-btn"
            >
              Download Card
            </a>
          )}
          <button onClick={shareToX} className="share-btn">
            Share to X
          </button>
        </div>
        <p>
          <small>
            Your card will be shared with the website link:{" "}
            <a href={WEBSITE_LINK}>{WEBSITE_LINK}</a>
          </small>
        </p>
      </div>
    </div>
  );
}

export default App;