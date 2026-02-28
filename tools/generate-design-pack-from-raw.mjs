import fs from "node:fs";
import path from "node:path";

const ROOT = "C:/Users/zagan/Desktop/kids-learning-app";
const RAW_DIR = path.join(ROOT, "assets", "design-pack", "raw");
const OUT_FILE = path.join(ROOT, "js", "design-pack.js");

const META = {
  "openmoji-rocket-color.svg": { id: "openmoji-rocket", name: "로켓", emoji: "🚀" },
  "openmoji-rabbit-face-color.svg": { id: "openmoji-rabbit-face", name: "토끼 얼굴", emoji: "🐰" },
  "openmoji-castle-color.svg": { id: "openmoji-castle", name: "성", emoji: "🏰" },
  "openmoji-whale-color.svg": { id: "openmoji-whale", name: "고래", emoji: "🐳" },
  "openmoji-cupcake-color.svg": { id: "openmoji-cupcake", name: "컵케이크", emoji: "🧁" },
  "openmoji-rainbow-color.svg": { id: "openmoji-rainbow", name: "무지개", emoji: "🌈" },
  "openmoji-turtle-color.svg": { id: "openmoji-turtle", name: "거북이", emoji: "🐢" },
  "openmoji-balloon-color.svg": { id: "openmoji-balloon", name: "풍선", emoji: "🎈" }
};

const PALETTE = [
  "#FF6B9A",
  "#FFB347",
  "#FFE066",
  "#7CD67C",
  "#68C6FF",
  "#8FA8FF",
  "#B28DFF",
  "#FF9ED6",
  "#F5F5F5",
  "#1F2937"
];

const STICKERS = ["🌸", "⭐", "🦋", "🐰", "🐢", "🐳", "🎈", "🧁", "🌈", "🏰", "🚀", "✨"];

function attrsFromTag(tag) {
  const attrs = {};
  const attrRe = /([A-Za-z_:][-A-Za-z0-9_:.]*)\s*=\s*"([^"]*)"/g;
  let m = null;
  while ((m = attrRe.exec(tag))) {
    attrs[m[1]] = m[2];
  }
  return attrs;
}

function num(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function rectToPath(a) {
  const x = num(a.x);
  const y = num(a.y);
  const w = num(a.width);
  const h = num(a.height);
  return `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`;
}

function circleToPath(a) {
  const cx = num(a.cx);
  const cy = num(a.cy);
  const r = num(a.r);
  return `M${cx - r},${cy} A${r},${r} 0 1,1 ${cx + r},${cy} A${r},${r} 0 1,1 ${cx - r},${cy} Z`;
}

function ellipseToPath(a) {
  const cx = num(a.cx);
  const cy = num(a.cy);
  const rx = num(a.rx);
  const ry = num(a.ry);
  return `M${cx - rx},${cy} A${rx},${ry} 0 1,1 ${cx + rx},${cy} A${rx},${ry} 0 1,1 ${cx - rx},${cy} Z`;
}

function polygonToPath(a) {
  const points = (a.points || "").trim().split(/\s+/).filter(Boolean);
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  const lines = rest.map((p) => `L${p}`).join(" ");
  return `M${first} ${lines} Z`;
}

function lineToPath(a) {
  return `M${num(a.x1)},${num(a.y1)} L${num(a.x2)},${num(a.y2)}`;
}

function styleValue(attrs, name) {
  if (attrs[name]) return attrs[name];
  const style = attrs.style || "";
  const re = new RegExp(`${name}\\s*:\\s*([^;]+)`, "i");
  const m = style.match(re);
  return m ? m[1].trim() : "";
}

function isNone(v) {
  return !v || v.toLowerCase() === "none";
}

function parseViewBox(svg) {
  const m = svg.match(/viewBox="([^"]+)"/);
  if (!m) return { width: 300, height: 300 };
  const parts = m[1].trim().split(/\s+/).map(Number);
  if (parts.length !== 4 || parts.some((x) => !Number.isFinite(x))) {
    return { width: 300, height: 300 };
  }
  return { width: parts[2], height: parts[3] };
}

function toRegions(svg) {
  const tags = [...svg.matchAll(/<(path|rect|circle|ellipse|polygon|line)\b[^>]*>/g)];
  const regions = [];
  let idx = 1;

  for (const t of tags) {
    const tagName = t[1];
    const rawTag = t[0];
    const attrs = attrsFromTag(rawTag);

    let pathData = "";
    if (tagName === "path") pathData = attrs.d || "";
    if (tagName === "rect") pathData = rectToPath(attrs);
    if (tagName === "circle") pathData = circleToPath(attrs);
    if (tagName === "ellipse") pathData = ellipseToPath(attrs);
    if (tagName === "polygon") pathData = polygonToPath(attrs);
    if (tagName === "line") pathData = lineToPath(attrs);
    if (!pathData) continue;

    const fill = styleValue(attrs, "fill");
    const stroke = styleValue(attrs, "stroke");
    const strokeWidth = Number(styleValue(attrs, "stroke-width") || 4);
    const strokeLike = tagName === "line" || (isNone(fill) && !isNone(stroke));

    regions.push({
      id: `region-${idx++}`,
      path: pathData,
      defaultColor: strokeLike ? "#d0d0d0" : "#f0f0f0",
      isStroke: strokeLike,
      strokeWidth: strokeLike ? (Number.isFinite(strokeWidth) ? strokeWidth : 4) : undefined
    });
  }

  return regions;
}

function buildDesign(filename) {
  const meta = META[filename];
  if (!meta) return null;
  const full = path.join(RAW_DIR, filename);
  const svg = fs.readFileSync(full, "utf8");
  const view = parseViewBox(svg);
  const regions = toRegions(svg);
  if (regions.length === 0) return null;
  return {
    id: meta.id,
    name: meta.name,
    emoji: meta.emoji,
    previewSrc: `assets/design-pack/raw/${filename}`,
    width: Math.round(view.width),
    height: Math.round(view.height),
    regions: regions.map((r) => {
      const out = {
        id: r.id,
        path: r.path,
        defaultColor: r.defaultColor
      };
      if (r.isStroke) {
        out.isStroke = true;
        out.strokeWidth = r.strokeWidth;
      }
      return out;
    })
  };
}

function main() {
  const files = fs.readdirSync(RAW_DIR).filter((f) => f.endsWith(".svg") && !!META[f]);
  const designs = files.map(buildDesign).filter(Boolean);

  const pack = {
    name: "openmoji-raw-pack-v1",
    palette: PALETTE,
    stickers: STICKERS,
    coloringDesigns: designs,
    sources: [
      {
        name: "OpenMoji",
        url: "https://openmoji.org",
        license: "CC BY-SA 4.0",
        downloadedAt: "2026-02-28",
        usage: "raw black SVG imported from openmoji.org/data/black/svg"
      }
    ]
  };

  const out = [
    "/*",
    " * AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.",
    " * Generated by: tools/generate-design-pack-from-raw.mjs",
    " */",
    `window.DESIGN_PACK = ${JSON.stringify(pack, null, 2)};`,
    ""
  ].join("\n");

  fs.writeFileSync(OUT_FILE, out, "utf8");
  console.log(`Generated ${OUT_FILE}`);
  console.log(`Imported designs: ${designs.length}`);
}

main();
