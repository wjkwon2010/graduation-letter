import { loadLetter, clearLetter } from "./storage.js";
import { confetti, go } from "./animation.js";

export function initCommon(config) {
  const letter = loadLetter();
  if (letter) document.getElementById("greeting").textContent = `${letter.name}, 졸업을 축하해`;

  const box = document.getElementById("common-message");
  for (const line of config.commonMessage) {
    box.append(Object.assign(document.createElement("p"), { textContent: line }));
  }
  const gallery = document.getElementById("gallery");
  if (!config.gallery.length) {
    gallery.append(Object.assign(document.createElement("p"), { className: "small", textContent: "사진을 준비하고 있어요." }));
  }
  for (const photo of config.gallery) {
    const figure = document.createElement("figure");
    const img = Object.assign(document.createElement("img"), { src: photo.src, alt: photo.caption || "학생회 활동 사진", loading: "lazy" });
    figure.append(img);
    if (photo.caption) figure.append(Object.assign(document.createElement("figcaption"), { textContent: photo.caption }));
    gallery.append(figure);
  }
}

export function initLetter(config) {
  const letter = loadLetter();
  if (!letter) { location.replace("verify.html"); return; }
  const $ = (id) => document.getElementById(id);
  $("greeting").textContent = `${letter.name}에게 도착한 편지`;
  $("to").textContent = `${letter.name}에게`;
  $("message").textContent = letter.message;
  $("closing").textContent = config.closing;

  $("envelope").addEventListener("click", () => {
    $("envelope").classList.add("open");
    $("hint").hidden = true;
    setTimeout(() => {
      $("envelope").hidden = true;
      $("card").hidden = false;
      $("actions").hidden = false;
      confetti();
    }, 1500);
  }, { once: true });

  $("save").addEventListener("click", () => saveImage(letter, config));
  $("leave").addEventListener("click", () => { clearLetter(); go("index.html"); });
}

function wrap(ctx, text, width) {
  const lines = [];
  for (const paragraph of text.split("\n")) {
    let line = "";
    for (const ch of paragraph) {
      if (line && ctx.measureText(line + ch).width > width) { lines.push(line); line = ""; }
      line += ch;
    }
    lines.push(line);
  }
  return lines;
}

async function saveImage(letter, config) {
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const font = (px) => `${px}px "Gowun Batang", serif`;
  ctx.font = font(38);
  const lines = wrap(ctx, letter.message, 880);
  canvas.width = 1080;
  canvas.height = Math.max(1350, 480 + lines.length * 66);
  ctx.fillStyle = "#fffdf8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#b8914a";
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
  ctx.fillStyle = "#26324a";
  ctx.font = font(52);
  ctx.fillText(`${letter.name}에게`, 100, 180);
  ctx.font = font(38);
  lines.forEach((line, i) => ctx.fillText(line, 100, 290 + i * 66));
  ctx.fillStyle = "#8c2f39";
  ctx.textAlign = "right";
  ctx.fillText(config.closing, 980, canvas.height - 120);
  canvas.toBlob((blob) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "graduation-card.png";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
}
