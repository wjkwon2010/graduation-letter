import { initVerify } from "./auth.js";
import { initCommon, initLetter } from "./cards.js";
import { initTransitions } from "./animation.js";

initTransitions();

const config = await (await fetch("data/public-config.json", { cache: "no-store" })).json();
for (const el of document.querySelectorAll("[data-config]")) el.textContent = config[el.dataset.config];

const pages = { verify: initVerify, common: initCommon, letter: initLetter };
pages[document.body.dataset.page]?.(config);

// 배경음악: 설정에 파일이 있을 때만 버튼 표시, 직접 눌러야 재생
if (config.music) {
  const audio = new Audio(config.music);
  audio.loop = true;
  const button = Object.assign(document.createElement("button"), { type: "button", className: "button ghost music", textContent: "음악 켜기" });
  button.addEventListener("click", async () => {
    if (audio.paused) await audio.play(); else audio.pause();
    button.textContent = audio.paused ? "음악 켜기" : "음악 끄기";
  });
  document.body.append(button);
}
