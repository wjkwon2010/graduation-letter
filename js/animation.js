const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function go(url) {
  if (reduced()) { location.href = url; return; }
  document.body.classList.add("leaving");
  setTimeout(() => { location.href = url; }, 250);
}

export function initTransitions() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href$='.html']");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    go(a.getAttribute("href"));
  });
  // 뒤로 가기로 돌아왔을 때 화면이 투명하게 남지 않도록
  addEventListener("pageshow", () => document.body.classList.remove("leaving"));
}

export function confetti() {
  if (reduced()) return;
  const canvas = document.createElement("canvas");
  canvas.className = "confetti";
  canvas.setAttribute("aria-hidden", "true");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  document.body.append(canvas);
  const ctx = canvas.getContext("2d");
  const colors = ["#8c2f39", "#b8914a", "#26324a", "#d98c8c"];
  const bits = Array.from({ length: 110 }, (_, i) => ({
    x: Math.random() * canvas.width, y: -Math.random() * canvas.height * 0.6,
    v: 2 + Math.random() * 3, s: 5 + Math.random() * 6, c: colors[i % colors.length], a: Math.random() * 6,
  }));
  const start = performance.now();
  (function frame(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const b of bits) {
      b.y += b.v; b.a += 0.08; b.x += Math.sin(b.a);
      ctx.fillStyle = b.c;
      ctx.fillRect(b.x, b.y, b.s, b.s * 0.5 * Math.abs(Math.cos(b.a)) + 1);
    }
    if (now - start < 3500) requestAnimationFrame(frame); else canvas.remove();
  })(start);
}
