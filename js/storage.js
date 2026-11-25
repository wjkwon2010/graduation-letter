// 열린 편지만 탭에 임시 보관합니다. 입력한 개인정보는 저장하지 않습니다.
const LETTER = "letter";
const TRIES = "tries";
let memory = null;

export function saveLetter(letter) {
  memory = letter;
  try { sessionStorage.setItem(LETTER, JSON.stringify(letter)); } catch {}
}
export function loadLetter() {
  try { return JSON.parse(sessionStorage.getItem(LETTER)) || memory; } catch { return memory; }
}
export function clearLetter() {
  memory = null;
  try { sessionStorage.removeItem(LETTER); } catch {}
}
export function loadTries() {
  try { return JSON.parse(localStorage.getItem(TRIES)) || { count: 0, until: 0 }; }
  catch { return { count: 0, until: 0 }; }
}
export function saveTries(t) {
  try { localStorage.setItem(TRIES, JSON.stringify(t)); } catch {}
}
