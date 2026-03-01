/*
 * Runtime design extender: injects a large set of kid-friendly coloring designs.
 * This keeps base packs intact while expanding available templates.
 */
(function () {
  function round(value) {
    return Math.round(value * 100) / 100;
  }

  function point(x, y) {
    return `${round(x)},${round(y)}`;
  }

  function rect(x, y, w, h) {
    return `M${point(x, y)} L${point(x + w, y)} L${point(x + w, y + h)} L${point(x, y + h)} Z`;
  }

  function triangle(ax, ay, bx, by, cx, cy) {
    return `M${point(ax, ay)} L${point(bx, by)} L${point(cx, cy)} Z`;
  }

  function circle(cx, cy, r) {
    return `M${point(cx - r, cy)} A${round(r)},${round(r)} 0 1,1 ${point(cx + r, cy)} A${round(r)},${round(r)} 0 1,1 ${point(cx - r, cy)} Z`;
  }

  function ellipse(cx, cy, rx, ry) {
    return `M${point(cx - rx, cy)} A${round(rx)},${round(ry)} 0 1,1 ${point(cx + rx, cy)} A${round(rx)},${round(ry)} 0 1,1 ${point(cx - rx, cy)} Z`;
  }

  function fill(id, path) {
    return { id, path, defaultColor: "#f0f0f0" };
  }

  function stroke(id, path, strokeWidth) {
    return { id, path, defaultColor: "#d0d0d0", isStroke: true, strokeWidth: strokeWidth || 4 };
  }

  function pick(base, delta, variant) {
    return base + delta * variant;
  }

  function catFace(variant) {
    var shift = variant * 2;
    return [
      fill("face", circle(160, 175, pick(86, 2, variant))),
      fill("ear-l", triangle(95 + shift, 112, 128 + shift, 52, 148 + shift, 120)),
      fill("ear-r", triangle(225 - shift, 112, 192 - shift, 52, 172 - shift, 120)),
      fill("eye-l", circle(132, 172, 10 + (variant % 2))),
      fill("eye-r", circle(188, 172, 10 + (variant % 2))),
      fill("nose", triangle(160, 192, 148, 210, 172, 210)),
      stroke("mouth", `M${point(140, 220)} Q${point(160, 236)} ${point(180, 220)}`, 4),
    ];
  }

  function dogFace(variant) {
    var r = pick(82, 2, variant);
    return [
      fill("ear-l", ellipse(96, 160, 32, 52)),
      fill("ear-r", ellipse(224, 160, 32, 52)),
      fill("face", ellipse(160, 176, r, r - 6)),
      fill("eye-l", circle(132, 170, 9)),
      fill("eye-r", circle(188, 170, 9)),
      fill("snout", ellipse(160, 212, 38, 26)),
      fill("nose", ellipse(160, 204, 12, 8)),
      stroke("mouth", `M${point(160, 212)} L${point(160, 226)} M${point(160, 226)} Q${point(147, 236)} ${point(136, 228)} M${point(160, 226)} Q${point(173, 236)} ${point(184, 228)}`, 4),
    ];
  }

  function rabbit(variant) {
    return [
      fill("ear-l", ellipse(132, 84, 20 + variant, 52)),
      fill("ear-r", ellipse(188, 84, 20 + variant, 52)),
      fill("head", circle(160, 182, 82 + variant)),
      fill("eye-l", circle(136, 178, 8)),
      fill("eye-r", circle(184, 178, 8)),
      fill("nose", triangle(160, 194, 150, 208, 170, 208)),
      fill("tooth-l", rect(150, 216, 9, 20)),
      fill("tooth-r", rect(161, 216, 9, 20)),
      stroke("mouth", `M${point(148, 214)} Q${point(160, 224)} ${point(172, 214)}`, 4),
    ];
  }

  function bear(variant) {
    return [
      fill("ear-l", circle(112, 106, 24 + variant)),
      fill("ear-r", circle(208, 106, 24 + variant)),
      fill("head", circle(160, 176, 88)),
      fill("eye-l", circle(132, 170, 9)),
      fill("eye-r", circle(188, 170, 9)),
      fill("snout", ellipse(160, 206, 34, 24)),
      fill("nose", ellipse(160, 198, 11, 8)),
      stroke("mouth", `M${point(146, 214)} Q${point(160, 224)} ${point(174, 214)}`, 4),
    ];
  }

  function fish(variant) {
    var bodyW = pick(112, 4, variant);
    return [
      fill("body", ellipse(162, 176, bodyW, 66)),
      fill("tail", triangle(258, 176, 300, 148, 300, 204)),
      fill("fin-top", triangle(146, 124, 178, 152, 130, 154)),
      fill("fin-bottom", triangle(146, 228, 178, 200, 130, 198)),
      fill("eye", circle(110, 166, 9)),
      fill("stripe-1", rect(156, 128, 14, 96)),
      fill("stripe-2", rect(188, 136, 14, 80)),
    ];
  }

  function turtle(variant) {
    return [
      fill("shell", ellipse(162, 176, 94, 72)),
      fill("head", circle(258, 176, 26 + variant)),
      fill("leg-lf", ellipse(106, 228, 24, 16)),
      fill("leg-lb", ellipse(136, 238, 24, 16)),
      fill("leg-rf", ellipse(214, 228, 24, 16)),
      fill("leg-rb", ellipse(188, 238, 24, 16)),
      fill("tail", triangle(68, 176, 88, 166, 88, 186)),
      fill("pattern-1", circle(132, 164, 16)),
      fill("pattern-2", circle(188, 164, 16)),
      fill("pattern-3", circle(160, 196, 16)),
    ];
  }

  function butterfly(variant) {
    var wing = pick(52, 3, variant);
    return [
      fill("wing-tl", ellipse(120, 142, wing, 58)),
      fill("wing-tr", ellipse(200, 142, wing, 58)),
      fill("wing-bl", ellipse(124, 212, wing - 4, 44)),
      fill("wing-br", ellipse(196, 212, wing - 4, 44)),
      fill("body", rect(152, 126, 16, 112)),
      stroke("antenna-l", `M${point(160, 126)} Q${point(144, 102)} ${point(132, 96)}`, 4),
      stroke("antenna-r", `M${point(160, 126)} Q${point(176, 102)} ${point(188, 96)}`, 4),
      fill("dot-l", circle(104, 146, 8)),
      fill("dot-r", circle(216, 146, 8)),
    ];
  }

  function flower(variant) {
    var petal = pick(32, 2, variant);
    return [
      fill("petal-1", circle(160, 108, petal)),
      fill("petal-2", circle(118, 132, petal)),
      fill("petal-3", circle(202, 132, petal)),
      fill("petal-4", circle(118, 182, petal)),
      fill("petal-5", circle(202, 182, petal)),
      fill("petal-6", circle(160, 210, petal)),
      fill("center", circle(160, 160, 28)),
      fill("stem", rect(152, 210, 16, 84)),
      fill("leaf-l", ellipse(128, 248, 22, 14)),
      fill("leaf-r", ellipse(192, 258, 22, 14)),
    ];
  }

  function tree(variant) {
    return [
      fill("trunk", rect(142, 176, 36, 118)),
      fill("leaf-1", circle(130, 138, 42 + variant)),
      fill("leaf-2", circle(190, 138, 42 + variant)),
      fill("leaf-3", circle(160, 104, 46 + variant)),
      fill("fruit-1", circle(128, 142, 8)),
      fill("fruit-2", circle(184, 154, 8)),
      fill("fruit-3", circle(160, 122, 8)),
    ];
  }

  function house(variant) {
    return [
      fill("roof", triangle(72, 136, 160, 66 - variant * 2, 248, 136)),
      fill("wall", rect(88, 136, 144, 130)),
      fill("door", rect(146, 188, 28, 78)),
      fill("window-l", rect(108, 156, 30, 30)),
      fill("window-r", rect(182, 156, 30, 30)),
      fill("chimney", rect(198, 86, 18, 36)),
      fill("sun", circle(68, 74, 20)),
    ];
  }

  function car(variant) {
    var y = 186 + variant;
    return [
      fill("body", rect(86, y, 150, 54)),
      fill("roof", triangle(122, y, 188, y, 166, y - 36)),
      fill("window", rect(134, y + 8, 42, 20)),
      fill("wheel-l", circle(120, y + 56, 18)),
      fill("wheel-r", circle(206, y + 56, 18)),
      fill("light", circle(234, y + 16, 8)),
    ];
  }

  function bus(variant) {
    var y = 170 + variant;
    return [
      fill("body", rect(72, y, 184, 76)),
      fill("window-1", rect(92, y + 14, 32, 24)),
      fill("window-2", rect(130, y + 14, 32, 24)),
      fill("window-3", rect(168, y + 14, 32, 24)),
      fill("door", rect(208, y + 12, 30, 52)),
      fill("wheel-l", circle(116, y + 78, 18)),
      fill("wheel-r", circle(214, y + 78, 18)),
    ];
  }

  function rocket(variant) {
    var tipY = 54 - variant * 2;
    return [
      fill("body", rect(138, 88, 44, 152)),
      fill("nose", triangle(138, 88, 182, 88, 160, tipY)),
      fill("fin-l", triangle(138, 210, 114, 238, 138, 238)),
      fill("fin-r", triangle(182, 210, 206, 238, 182, 238)),
      fill("window", circle(160, 140, 16)),
      fill("flame", triangle(144, 240, 176, 240, 160, 286)),
    ];
  }

  function balloons(variant) {
    return [
      fill("balloon-1", ellipse(126, 118, 34, 44)),
      fill("balloon-2", ellipse(190, 112, 34, 44)),
      fill("balloon-3", ellipse(160, 154, 34, 44)),
      stroke("string-1", `M${point(126, 162)} L${point(146, 232)}`, 3),
      stroke("string-2", `M${point(190, 156)} L${point(174, 232)}`, 3),
      stroke("string-3", `M${point(160, 198)} L${point(160, 236)}`, 3),
      fill("basket", rect(138, 236, 44, 30 + variant * 2)),
    ];
  }

  function icecream(variant) {
    return [
      fill("cone", triangle(160, 270, 118, 158, 202, 158)),
      fill("scoop-1", circle(140, 150, 30 + variant)),
      fill("scoop-2", circle(180, 150, 30 + variant)),
      fill("scoop-3", circle(160, 120, 30 + variant)),
      fill("cherry", circle(160, 82, 12)),
      stroke("cone-line-1", `M${point(138, 188)} L${point(182, 230)}`, 3),
      stroke("cone-line-2", `M${point(182, 188)} L${point(138, 230)}`, 3),
    ];
  }

  function cupcake(variant) {
    return [
      fill("cup", triangle(160, 274, 114, 176, 206, 176)),
      fill("cream-1", circle(132, 164, 30 + variant)),
      fill("cream-2", circle(188, 164, 30 + variant)),
      fill("cream-3", circle(160, 132, 34 + variant)),
      fill("sprinkle-1", circle(140, 140, 6)),
      fill("sprinkle-2", circle(176, 150, 6)),
      fill("sprinkle-3", circle(160, 168, 6)),
    ];
  }

  function castle(variant) {
    return [
      fill("wall", rect(92, 150, 136, 118)),
      fill("tower-l", rect(62, 124, 36, 144)),
      fill("tower-r", rect(222, 124, 36, 144)),
      fill("roof-l", triangle(62, 124, 98, 124, 80, 82 - variant * 2)),
      fill("roof-r", triangle(222, 124, 258, 124, 240, 82 - variant * 2)),
      fill("roof-c", triangle(132, 150, 188, 150, 160, 96 - variant * 2)),
      fill("door", rect(148, 208, 24, 60)),
      fill("window-l", rect(72, 156, 16, 20)),
      fill("window-r", rect(232, 156, 16, 20)),
    ];
  }

  function robot(variant) {
    return [
      fill("head", rect(104, 80, 112, 82)),
      fill("eye-l", circle(138, 114, 10 + (variant % 2))),
      fill("eye-r", circle(182, 114, 10 + (variant % 2))),
      fill("body", rect(110, 168, 100, 90)),
      fill("arm-l", rect(76, 176, 26, 68)),
      fill("arm-r", rect(218, 176, 26, 68)),
      fill("leg-l", rect(126, 258, 24, 46)),
      fill("leg-r", rect(170, 258, 24, 46)),
      stroke("antenna", `M${point(160, 80)} L${point(160, 56)}`, 4),
      fill("antenna-ball", circle(160, 48, 8)),
    ];
  }

  function unicorn(variant) {
    return [
      fill("head", ellipse(162, 176, 84, 78)),
      fill("ear", triangle(134, 104, 154, 74 - variant * 2, 168, 116)),
      fill("horn", triangle(160, 88, 178, 40, 190, 98)),
      fill("mane-1", circle(114, 128, 22)),
      fill("mane-2", circle(108, 168, 20)),
      fill("mane-3", circle(116, 206, 18)),
      fill("eye", circle(186, 172, 9)),
      fill("nose", ellipse(196, 206, 12, 8)),
      stroke("smile", `M${point(188, 220)} Q${point(198, 226)} ${point(208, 220)}`, 3),
    ];
  }

  function dinosaur(variant) {
    return [
      fill("body", ellipse(154, 188, 92, 66)),
      fill("neck", ellipse(212, 152, 34, 24)),
      fill("head", ellipse(242, 144, 34, 24)),
      fill("tail", triangle(64, 190, 26, 160, 26, 220)),
      fill("leg-l", rect(118, 234, 24, 54)),
      fill("leg-r", rect(162, 234, 24, 54)),
      fill("spike-1", triangle(112, 128, 128, 96, 144, 128)),
      fill("spike-2", triangle(146, 118, 162, 88, 178, 118)),
      fill("spike-3", triangle(180, 124, 196, 92, 212, 124)),
      fill("eye", circle(252, 140, 6)),
    ];
  }

  function starCharacter(variant) {
    var cx = 160;
    var cy = 170;
    var outer = 82 + variant;
    var inner = 36 + variant;
    var points = [];
    for (var i = 0; i < 10; i += 1) {
      var angle = -Math.PI / 2 + i * Math.PI / 5;
      var radius = i % 2 === 0 ? outer : inner;
      points.push(point(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius));
    }
    return [
      fill("star", `M${points[0]} L${points.slice(1).join(" L")} Z`),
      fill("eye-l", circle(138, 166, 10)),
      fill("eye-r", circle(182, 166, 10)),
      stroke("smile", `M${point(134, 198)} Q${point(160, 220)} ${point(186, 198)}`, 4),
      fill("cheek-l", circle(122, 188, 8)),
      fill("cheek-r", circle(198, 188, 8)),
    ];
  }

  function cloudTrain(variant) {
    var y = 198;
    return [
      fill("cloud-1", circle(104, 116, 32 + variant)),
      fill("cloud-2", circle(156, 106, 40 + variant)),
      fill("cloud-3", circle(214, 120, 34 + variant)),
      fill("train-body", rect(82, y, 156, 56)),
      fill("train-window-1", rect(98, y + 14, 24, 20)),
      fill("train-window-2", rect(128, y + 14, 24, 20)),
      fill("train-window-3", rect(158, y + 14, 24, 20)),
      fill("train-window-4", rect(188, y + 14, 24, 20)),
      fill("wheel-l", circle(122, y + 58, 14)),
      fill("wheel-r", circle(198, y + 58, 14)),
    ];
  }

  function planetScene(variant) {
    return [
      fill("planet", circle(160, 170, 86 + variant)),
      fill("ring", ellipse(160, 170, 128, 34 + variant)),
      fill("crater-1", circle(132, 152, 14)),
      fill("crater-2", circle(184, 188, 16)),
      fill("star-1", circle(72, 92, 8)),
      fill("star-2", circle(246, 84, 8)),
      fill("star-3", circle(256, 244, 8)),
      fill("rocket", triangle(72, 250, 98, 234, 94, 270)),
    ];
  }

  var motifList = [
    { key: "cat", name: "고양이 얼굴", emoji: "🐱", build: catFace },
    { key: "dog", name: "강아지 얼굴", emoji: "🐶", build: dogFace },
    { key: "rabbit", name: "토끼", emoji: "🐰", build: rabbit },
    { key: "bear", name: "곰", emoji: "🐻", build: bear },
    { key: "fish", name: "물고기", emoji: "🐟", build: fish },
    { key: "turtle", name: "거북이", emoji: "🐢", build: turtle },
    { key: "butterfly", name: "나비", emoji: "🦋", build: butterfly },
    { key: "flower", name: "꽃", emoji: "🌸", build: flower },
    { key: "tree", name: "나무", emoji: "🌳", build: tree },
    { key: "house", name: "집", emoji: "🏠", build: house },
    { key: "car", name: "자동차", emoji: "🚗", build: car },
    { key: "bus", name: "버스", emoji: "🚌", build: bus },
    { key: "rocket", name: "로켓", emoji: "🚀", build: rocket },
    { key: "balloon", name: "풍선", emoji: "🎈", build: balloons },
    { key: "icecream", name: "아이스크림", emoji: "🍦", build: icecream },
    { key: "cupcake", name: "컵케이크", emoji: "🧁", build: cupcake },
    { key: "castle", name: "성", emoji: "🏰", build: castle },
    { key: "robot", name: "로봇", emoji: "🤖", build: robot },
    { key: "unicorn", name: "유니콘", emoji: "🦄", build: unicorn },
    { key: "dino", name: "공룡", emoji: "🦖", build: dinosaur },
    { key: "star", name: "별 친구", emoji: "⭐", build: starCharacter },
    { key: "cloudtrain", name: "구름 기차", emoji: "🚂", build: cloudTrain },
    { key: "planet", name: "행성 놀이터", emoji: "🪐", build: planetScene },
  ];

  function buildGeneratedKidsDesigns() {
    var designs = [];
    motifList.forEach(function (motif) {
      for (var v = 0; v < 12; v += 1) {
        var regions = motif.build(v).map(function (region, index) {
          return Object.assign({}, region, { id: "region-" + (index + 1) });
        });
        designs.push({
          id: "kids-" + motif.key + "-" + (v + 1),
          name: motif.name + " " + (v + 1),
          emoji: motif.emoji,
          width: 320,
          height: 320,
          regions: regions,
        });
      }
    });
    return designs;
  }

  function ensureDesignPack() {
    if (!window.DESIGN_PACK || typeof window.DESIGN_PACK !== "object") {
      window.DESIGN_PACK = {
        name: "kids-generated-pack",
        palette: ["#FF6B9A", "#FFB347", "#FFE066", "#7CD67C", "#68C6FF", "#8FA8FF", "#B28DFF", "#FF9ED6", "#F5F5F5", "#1F2937"],
        stickers: [],
        coloringDesigns: [],
      };
    } else if (!Array.isArray(window.DESIGN_PACK.coloringDesigns)) {
      window.DESIGN_PACK.coloringDesigns = [];
    }
  }

  ensureDesignPack();

  var generatedDesigns = buildGeneratedKidsDesigns();
  var byId = new Set(window.DESIGN_PACK.coloringDesigns.map(function (d) { return d.id; }));
  generatedDesigns.forEach(function (design) {
    if (!byId.has(design.id)) {
      window.DESIGN_PACK.coloringDesigns.push(design);
      byId.add(design.id);
    }
  });

  window.KIDS_GENERATED_DESIGNS_COUNT = generatedDesigns.length;
})();

