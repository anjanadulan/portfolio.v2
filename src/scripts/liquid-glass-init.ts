export {};

interface GlassHandle {
  supported: boolean;
  refresh: () => void;
  destroy: () => void;
}

interface GlassOptions {
  scale: number;
  chroma: number;
  border: number;
  mapBlur: number;
  blur: number;
  saturate: number;
  fallbackBlur: number;
}

declare global {
  interface Window {
    liquidGlass?: (element: HTMLElement, options: GlassOptions) => GlassHandle;
  }
}

const navDesktop: GlassOptions = { scale: -42, chroma: 3, border: 0.1, mapBlur: 8, blur: 10, saturate: 1.3, fallbackBlur: 18 };
const navMobile: GlassOptions = { scale: -38, chroma: 2, border: 0.09, mapBlur: 7, blur: 8, saturate: 1.28, fallbackBlur: 16 };
const sectionStrip: GlassOptions = { scale: -38, chroma: 2, border: 0.045, mapBlur: 12, blur: 7, saturate: 1.2, fallbackBlur: 18 };
const sectionPanel: GlassOptions = { scale: -42, chroma: 2, border: 0.045, mapBlur: 14, blur: 7, saturate: 1.22, fallbackBlur: 20 };

const active = new Set<HTMLElement>();
const handles = new WeakMap<HTMLElement, GlassHandle>();
const reducedTransparency = window.matchMedia("(prefers-reduced-transparency: reduce)");
const forcedColors = window.matchMedia("(forced-colors: active)");
const sectionBreakpoint = window.matchMedia("(max-width: 900px)");
const mobileBreakpoint = window.matchMedia("(max-width: 639px)");
let observer: IntersectionObserver | null = null;
let setupTimer: number | null = null;

function shouldReduce() {
  return reducedTransparency.matches || forcedColors.matches;
}

function isSection(element: HTMLElement) {
  return element.dataset.liquidGlass !== "nav";
}

function destroy(element: HTMLElement) {
  handles.get(element)?.destroy();
  handles.delete(element);
  active.delete(element);
  element.classList.remove("lg-static", "lg-fallback");
  delete element.dataset.liquidGlassReady;
}

function destroyAll() {
  observer?.disconnect();
  observer = null;
  [...active].forEach(destroy);
}

function destroyDisconnected() {
  [...active].forEach((element) => {
    if (!element.isConnected) destroy(element);
  });
}

function optionsFor(element: HTMLElement) {
  if (element.dataset.liquidGlass === "nav") return mobileBreakpoint.matches ? navMobile : navDesktop;
  return element.dataset.liquidGlass === "strip" ? sectionStrip : sectionPanel;
}

function attach(element: HTMLElement) {
  if (handles.has(element) || element.classList.contains("lg-static")) return;

  if (shouldReduce()) {
    element.dataset.liquidGlassReady = "reduced";
    return;
  }

  if (isSection(element) && sectionBreakpoint.matches) {
    element.classList.add("lg-static");
    element.dataset.liquidGlassReady = "frosted";
    return;
  }

  if (!window.liquidGlass) return;

  try {
    const handle = window.liquidGlass(element, optionsFor(element));
    handles.set(element, handle);
    active.add(element);
    element.dataset.liquidGlassReady = handle.supported ? "refracted" : "frosted";
  } catch {
    element.classList.add("lg-static");
    element.dataset.liquidGlassReady = "frosted";
  }
}

function setup() {
  destroyDisconnected();
  const surfaces = [...document.querySelectorAll<HTMLElement>("[data-liquid-glass]")];
  if (shouldReduce()) {
    surfaces.forEach((element) => {
      destroy(element);
      element.dataset.liquidGlassReady = "reduced";
    });
    return;
  }

  observer?.disconnect();
  observer = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            attach(entry.target as HTMLElement);
            observer?.unobserve(entry.target);
          }
        });
      }, { rootMargin: "300px 0px" })
    : null;

  surfaces.forEach((element) => {
    if (!isSection(element)) {
      attach(element);
    } else if (observer) {
      observer.observe(element);
    } else {
      attach(element);
    }
  });
}

function rebuild() {
  destroyAll();
  setup();
}

document.addEventListener("astro:after-swap", () => {
  destroyDisconnected();
});
function scheduleSetup() {
  if (setupTimer !== null) window.clearTimeout(setupTimer);
  setupTimer = window.setTimeout(() => {
    setupTimer = null;
    setup();
  }, 400);
}

document.addEventListener("astro:page-load", scheduleSetup);
reducedTransparency.addEventListener("change", rebuild);
forcedColors.addEventListener("change", rebuild);
sectionBreakpoint.addEventListener("change", rebuild);
mobileBreakpoint.addEventListener("change", rebuild);
