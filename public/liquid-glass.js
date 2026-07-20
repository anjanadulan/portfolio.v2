/* Apple-style liquid glass refraction runtime for bounded portfolio surfaces. */
(function (global) {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  let uid = 0;
  let svgDefs = null;
  let svgRoot = null;

  const supported = (() => {
    const ua = navigator.userAgent;
    const isSafari = /Safari/.test(ua) && !/Chrome|Chromium|Edg/.test(ua);
    const isFirefox = /Firefox/.test(ua);
    if (isSafari || isFirefox || !global.CSS?.supports("backdrop-filter", "url(#lg)")) return false;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 4;
      return Boolean(canvas.getContext("2d")?.getImageData(0, 0, 1, 1));
    } catch (_) {
      return false;
    }
  })();

  function ensureDefs() {
    const persistentDefs = document.querySelector("[data-liquid-glass-defs]");
    if (persistentDefs) {
      svgDefs = persistentDefs;
      svgRoot = persistentDefs.closest("svg");
      return svgDefs;
    }
    if (svgDefs && svgRoot?.isConnected) return svgDefs;

    svgRoot = document.createElementNS(SVG_NS, "svg");
    svgRoot.setAttribute("width", "0");
    svgRoot.setAttribute("height", "0");
    svgRoot.setAttribute("aria-hidden", "true");
    svgRoot.style.position = "absolute";
    svgDefs = document.createElementNS(SVG_NS, "defs");
    svgDefs.setAttribute("data-liquid-glass-defs", "");
    svgRoot.appendChild(svgDefs);
    document.body.appendChild(svgRoot);
    return svgDefs;
  }

  function makeMap(w, h, radius, border, mapBlur) {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    const gx = ctx.createLinearGradient(0, 0, w, 0);
    gx.addColorStop(0, "rgb(0,0,0)");
    gx.addColorStop(1, "rgb(255,0,0)");
    ctx.fillStyle = gx;
    ctx.fillRect(0, 0, w, h);

    const gy = ctx.createLinearGradient(0, 0, 0, h);
    gy.addColorStop(0, "rgb(0,0,0)");
    gy.addColorStop(1, "rgb(0,0,255)");
    ctx.globalCompositeOperation = "difference";
    ctx.fillStyle = gy;
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = "source-over";
    const inset = Math.min(Math.max(border, 0), 0.45) * Math.min(w, h);
    ctx.filter = "blur(" + mapBlur + "px)";
    ctx.fillStyle = "rgba(128,128,128,0.93)";
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(inset, inset, w - inset * 2, h - inset * 2, Math.max(radius - inset, 2));
    } else {
      ctx.rect(inset, inset, w - inset * 2, h - inset * 2);
    }
    ctx.fill();
    ctx.filter = "none";
    return canvas.toDataURL();
  }

  function buildFilter(id, scales) {
    const filter = document.createElementNS(SVG_NS, "filter");
    filter.setAttribute("id", id);
    filter.setAttribute("x", "0");
    filter.setAttribute("y", "0");
    filter.setAttribute("width", "100%");
    filter.setAttribute("height", "100%");
    filter.setAttribute("color-interpolation-filters", "sRGB");

    const feImage = document.createElementNS(SVG_NS, "feImage");
    feImage.setAttribute("x", "0");
    feImage.setAttribute("y", "0");
    feImage.setAttribute("result", "map");
    feImage.setAttribute("preserveAspectRatio", "none");
    filter.appendChild(feImage);

    const keep = [
      "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
      "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
      "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
    ];
    const channels = [];
    scales.forEach((scale, index) => {
      const displacement = document.createElementNS(SVG_NS, "feDisplacementMap");
      displacement.setAttribute("in", "SourceGraphic");
      displacement.setAttribute("in2", "map");
      displacement.setAttribute("scale", scale);
      displacement.setAttribute("xChannelSelector", "R");
      displacement.setAttribute("yChannelSelector", "B");
      displacement.setAttribute("result", "d" + index);
      filter.appendChild(displacement);

      const matrix = document.createElementNS(SVG_NS, "feColorMatrix");
      matrix.setAttribute("in", "d" + index);
      matrix.setAttribute("type", "matrix");
      matrix.setAttribute("values", keep[index]);
      matrix.setAttribute("result", "c" + index);
      filter.appendChild(matrix);
      channels.push("c" + index);
    });

    const blendOne = document.createElementNS(SVG_NS, "feBlend");
    blendOne.setAttribute("in", channels[0]);
    blendOne.setAttribute("in2", channels[1]);
    blendOne.setAttribute("mode", "screen");
    blendOne.setAttribute("result", "c01");
    filter.appendChild(blendOne);

    const blendTwo = document.createElementNS(SVG_NS, "feBlend");
    blendTwo.setAttribute("in", "c01");
    blendTwo.setAttribute("in2", channels[2]);
    blendTwo.setAttribute("mode", "screen");
    filter.appendChild(blendTwo);

    ensureDefs().appendChild(filter);
    return { filter, feImage };
  }

  function resolveRadius(el, w, h, override) {
    if (override != null) return override;
    const raw = getComputedStyle(el).borderTopLeftRadius || "0px";
    const value = parseFloat(raw) || 0;
    return raw.trim().endsWith("%") ? (value / 100) * Math.min(w, h) : value;
  }

  function liquidGlass(el, opts) {
    if (!(el instanceof HTMLElement)) throw new TypeError("liquidGlass expects an HTMLElement");
    const options = Object.assign({
      scale: -112,
      chroma: 6,
      border: 0.07,
      mapBlur: 12,
      blur: 3,
      saturate: 1.5,
      radius: null,
      fallbackBlur: 16
    }, opts);

    if (!supported || !global.ResizeObserver) {
      const frosted = "blur(" + options.fallbackBlur + "px) saturate(" + options.saturate + ")";
      el.style.backdropFilter = frosted;
      el.style.webkitBackdropFilter = frosted;
      el.classList.add("lg-fallback");
      return {
        supported: false,
        refresh() {},
        destroy() {
          el.style.backdropFilter = "";
          el.style.webkitBackdropFilter = "";
          el.classList.remove("lg-fallback");
        }
      };
    }

    const id = "lg-filter-" + (++uid);
    const scales = [options.scale, options.scale + options.chroma, options.scale + options.chroma * 2];
    const parts = buildFilter(id, scales);

    function refresh() {
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      if (!width || !height) return;
      const radius = resolveRadius(el, width, height, options.radius);
      const map = makeMap(width, height, radius, options.border, options.mapBlur);
      if (!map) return;
      parts.feImage.setAttribute("href", map);
      parts.feImage.setAttribute("width", width);
      parts.feImage.setAttribute("height", height);
    }

    refresh();
    el.style.backdropFilter = "url(#" + id + ") blur(" + options.blur + "px) saturate(" + options.saturate + ")";
    el.style.webkitBackdropFilter = el.style.backdropFilter;

    let timer = null;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(refresh, 120);
    });
    resizeObserver.observe(el);

    return {
      supported: true,
      refresh,
      destroy() {
        resizeObserver.disconnect();
        clearTimeout(timer);
        parts.filter.remove();
        el.style.backdropFilter = "";
        el.style.webkitBackdropFilter = "";
      }
    };
  }

  global.liquidGlass = liquidGlass;
})(window);
