// 정규화 규칙은 Private 저장소의 scripts/common.py와 반드시 같아야 합니다.
const enc = new TextEncoder();
const FIELDS = ["name", "phone", "birthday", "favoriteNumber", "department"];

export function normalize(v) {
  const name = v.name.normalize("NFC").replace(/\s+/g, "");
  if (!/^[0-9+\-().\s]+$/.test(v.phone)) throw new Error("format");
  let phone = v.phone.replace(/[^0-9+]/g, "");
  if (phone.startsWith("+82")) phone = "0" + phone.slice(3).replace(/^0+/, "");
  const md = v.birthday.trim().match(/^(?:([0-9]{1,2})[/.\-]([0-9]{1,2})|([0-9]{2})([0-9]{2}))$/);
  const birthday = md ? `${(md[1] || md[3]).padStart(2, "0")}-${(md[2] || md[4]).padStart(2, "0")}` : "";
  const number = v.favoriteNumber.trim();
  const department = v.department.trim();
  if (!name || !department || !/^01[0-9]{8,9}$/.test(phone) ||
      !birthday || !/^[0-9]{1,10}$/.test(number)) {
    throw new Error("format");
  }
  return { name, phone, birthday, favoriteNumber: number.replace(/^0+/, "") || "0", department };
}

const sha256 = async (bytes) => new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
const concat = (a, b) => new Uint8Array([...a, ...b]);
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

// 맞는 편지가 없으면 null
export async function openLetter(values, bundle) {
  const n = normalize(values);
  const salt = await sha256(concat(unb64(bundle.salt), enc.encode(n.name)));
  const base = await crypto.subtle.importKey(
    "raw", enc.encode(FIELDS.map((f) => n[f]).join("\x1f")), "PBKDF2", false, ["deriveBits"]);
  const master = new Uint8Array(await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: bundle.iterations }, base, 256));
  const id = [...(await sha256(concat(enc.encode("id:"), master)))]
    .map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
  const record = bundle.records[id];
  if (!record) return null;
  const key = await crypto.subtle.importKey(
    "raw", await sha256(concat(enc.encode("key:"), master)), "AES-GCM", false, ["decrypt"]);
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: unb64(record.iv), additionalData: enc.encode(id) }, key, unb64(record.data));
  return JSON.parse(new TextDecoder().decode(plain));
}
