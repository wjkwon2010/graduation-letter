import { openLetter } from "./crypto.js";
import { saveLetter, clearLetter, loadTries, saveTries } from "./storage.js";
import { go } from "./animation.js";

const FAIL = "입력한 정보를 다시 확인해 주세요.";

export function initVerify(config) {
  const form = document.getElementById("verify-form");
  const error = document.getElementById("form-error");
  const button = form.querySelector("button");
  for (const d of config.departments) form.department.add(new Option(d, d));
  clearLetter();
  let tries = loadTries();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    // 화면에서의 시도 제한일 뿐이며 보안 장치는 아닙니다.
    const wait = Math.ceil((tries.until - Date.now()) / 1000);
    if (wait > 0) { error.textContent = `${wait}초 뒤에 다시 시도해 주세요.`; return; }
    error.textContent = "";
    button.disabled = true;
    button.textContent = "편지를 찾는 중…";
    try {
      const response = await fetch("data/encrypted-messages.json", { cache: "no-store" });
      if (!response.ok || !window.isSecureContext) throw new Error("load");
      const bundle = await response.json();
      let letter = null;
      try { letter = await openLetter(Object.fromEntries(new FormData(form)), bundle); }
      catch (e) { if (e.message !== "format") throw e; }
      if (letter) {
        saveTries({ count: 0, until: 0 });
        saveLetter(letter);
        form.reset();
        go("common.html");
        return;
      }
      const count = tries.count + 1;
      tries = count >= 5 ? { count: 0, until: Date.now() + 60000 } : { count, until: 0 };
      saveTries(tries);
      error.textContent = FAIL;
    } catch {
      error.textContent = "편지를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";
    }
    button.disabled = false;
    button.textContent = "확인하기";
  });
}
