export {};

interface MagneticElement extends HTMLElement {
  _magneticCleanups?: () => void;
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function initMagnetic(el: MagneticElement) {
  if (reducedMotion.matches || el._magneticCleanups) return;

  let animationFrameId: number | null = null;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let isHovered = false;

  const strength = parseFloat(el.dataset.magneticStrength || "0.35");
  const speed = 0.15; // lerp speed coefficient

  function render() {
    currentX += (targetX - currentX) * speed;
    currentY += (targetY - currentY) * speed;

    el.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;

    // Keep animating if hovered or until returned to resting position
    if (isHovered || Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      el.style.transform = "";
      animationFrameId = null;
    }
  }

  function onMouseMove(e: MouseEvent) {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    targetX = (e.clientX - centerX) * strength;
    targetY = (e.clientY - centerY) * strength;

    isHovered = true;

    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(render);
    }
  }

  function onMouseLeave() {
    targetX = 0;
    targetY = 0;
    isHovered = false;

    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(render);
    }
  }

  el.addEventListener("mousemove", onMouseMove, { passive: true });
  el.addEventListener("mouseleave", onMouseLeave, { passive: true });

  el._magneticCleanups = () => {
    el.removeEventListener("mousemove", onMouseMove);
    el.removeEventListener("mouseleave", onMouseLeave);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    el.style.transform = "";
    delete el._magneticCleanups;
  };
}

function setupAllMagnetic() {
  if (reducedMotion.matches) return;

  const selector = ".capsule-button, .round-link, .floating-wordmark, .floating-theme-control, [data-magnetic]";
  const elements = document.querySelectorAll<MagneticElement>(selector);

  elements.forEach(initMagnetic);
}

function cleanupAllMagnetic() {
  const selector = ".capsule-button, .round-link, .floating-wordmark, .floating-theme-control, [data-magnetic]";
  const elements = document.querySelectorAll<MagneticElement>(selector);

  elements.forEach((el) => el._magneticCleanups?.());
}

if (typeof window !== "undefined") {
  document.addEventListener("astro:page-load", setupAllMagnetic);
  document.addEventListener("astro:before-swap", cleanupAllMagnetic);
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) cleanupAllMagnetic();
    else setupAllMagnetic();
  });
}
