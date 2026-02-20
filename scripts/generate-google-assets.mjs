#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const apiKey = process.env.GOOGLE_API_KEY || process.env.NANOBANANA_API_KEY || "";
const model = process.env.GOOGLE_IMAGE_MODEL || "gemini-3-pro-image-preview";
const assetFilterRaw = process.env.ASSET_KEYS || "";
const backgroundReferenceRaw = process.env.BACKGROUND_REFERENCE_FILES || "assets/reference/back_refer.jpeg";
const heroReferenceRaw = process.env.HERO_REFERENCE_FILES || "assets/reference/hero_refer.png";
const equipmentReferenceRaw =
  process.env.EQUIPMENT_REFERENCE_FILES || "assets/reference/hero_refer.png,assets/reference/back_refer.jpeg";

if (!apiKey) {
  console.error("[오류] GOOGLE_API_KEY(또는 NANOBANANA_API_KEY)가 필요합니다.");
  process.exit(1);
}

const rootDir = process.cwd();
const generatedDir = path.join(rootDir, "assets", "generated");
const PIXEL_STYLE_GUIDE =
  "공통 스타일: 동일한 세계관의 다크 고딕 픽셀 아트. 16-bit 픽셀 RPG 감성, 두꺼운 외곽선, 제한된 팔레트(먹색/보라/청록/불꽃 주황), 높은 명암 대비, 픽셀 계단 느낌 유지, 노이즈 최소화, 텍스트/로고/워터마크/글자 금지.";

const imageSpecs = [
  {
    bucket: "hero",
    key: "H1",
    file: "heroes/H1.png",
    prompt:
      "같은 픽셀 아트 세계관의 영웅 초상화 아이콘. 기사형 근접 딜러, 은빛 갑옷과 장검, 정면 상반신, 위엄 있는 표정, 아이콘 중심 구도, 배경은 어두운 단색.",
  },
  {
    bucket: "hero",
    key: "H2",
    file: "heroes/H2.png",
    prompt:
      "같은 픽셀 아트 세계관의 영웅 초상화 아이콘. 쌍검 결투가/암살자, 보라색 강조, 정면 상반신, 날카로운 눈빛, 아이콘 중심 구도, 배경은 어두운 단색.",
  },
  {
    bucket: "hero",
    key: "H3",
    file: "heroes/H3.png",
    prompt:
      "같은 픽셀 아트 세계관의 영웅 초상화 아이콘. 마도사, 후드 망토와 푸른 마력구, 정면 상반신, 신비로운 분위기, 아이콘 중심 구도, 배경은 어두운 단색.",
  },
  {
    bucket: "hero",
    key: "H4",
    file: "heroes/H4.png",
    prompt:
      "같은 픽셀 아트 세계관의 영웅 초상화 아이콘. 방패를 든 수호자 탱커, 두꺼운 갑옷, 정면 상반신, 단단한 인상, 아이콘 중심 구도, 배경은 어두운 단색.",
  },
  {
    bucket: "hero",
    key: "H5",
    file: "heroes/H5.png",
    prompt:
      "같은 픽셀 아트 세계관의 영웅 초상화 아이콘. 치유사, 빛나는 지팡이와 청록빛 오라, 정면 상반신, 차분한 표정, 아이콘 중심 구도, 배경은 어두운 단색.",
  },
  {
    bucket: "hero",
    key: "H6",
    file: "heroes/H6.png",
    prompt:
      "같은 픽셀 아트 세계관의 영웅 초상화 아이콘. 궁수, 장궁과 날렵한 실루엣, 정면 상반신, 사냥꾼 분위기, 아이콘 중심 구도, 배경은 어두운 단색.",
  },
  {
    bucket: "enemy",
    key: "desert_scorpion",
    file: "enemies/desert_scorpion.png",
    prompt:
      "같은 픽셀 아트 세계관의 몬스터 초상화 아이콘. 사막 전갈, 붉은 갈색 갑각, 위협적인 정면 포즈, 아이콘 중심 구도, 배경은 어두운 단색.",
  },
  {
    bucket: "enemy",
    key: "shell_beetle",
    file: "enemies/shell_beetle.png",
    prompt:
      "같은 픽셀 아트 세계관의 몬스터 초상화 아이콘. 갑각 벌레, 푸른 껍질과 단단한 인상, 정면 포즈, 아이콘 중심 구도, 배경은 어두운 단색.",
  },
  {
    bucket: "enemy",
    key: "raider_wolf",
    file: "enemies/raider_wolf.png",
    prompt:
      "같은 픽셀 아트 세계관의 몬스터 초상화 아이콘. 약탈 늑대, 날카로운 눈빛과 송곳니, 정면 포즈, 아이콘 중심 구도, 배경은 어두운 단색.",
  },
  {
    bucket: "enemy",
    key: "bone_beast",
    file: "enemies/bone_beast.png",
    prompt:
      "같은 픽셀 아트 세계관의 몬스터 초상화 아이콘. 뼈 야수, 해골 갑주 느낌, 정면 포즈, 아이콘 중심 구도, 배경은 어두운 단색.",
  },
  {
    bucket: "enemy",
    key: "boss_tyrant",
    file: "enemies/boss_tyrant.png",
    prompt:
      "같은 픽셀 아트 세계관의 보스 초상화 아이콘. 재의 폭군, 거대한 악마 군주, 암흑 불꽃 오라, 정면 포즈, 아이콘 중심 구도, 배경은 어두운 단색.",
  },
  {
    bucket: "background",
    key: "battlefield",
    file: "backgrounds/battlefield.png",
    prompt:
      "다크한 던전. 횡스크롤 배경. 캐릭터 없는. 픽셀아트. 던전 위에 뚫린 구멍을 통해 빛 줄기가 내려오고 있음. 가로형(16:9) 전투 배경, 낡은 석조 기둥과 아치형 천장, 횃불과 옅은 안개, 중앙 전투 공간은 비우고 양끝만 디테일, 사람/영웅/몬스터/실루엣/초상 전부 없음.",
  },
  {
    bucket: "background",
    key: "lobby_campfire",
    file: "backgrounds/lobby_campfire.png",
    prompt:
      "동일 세계관의 픽셀 아트 메인 로비 배경. 가로형(16:9), 전경에 모닥불 야영지와 실루엣 영웅들, 후경에 거대한 던전 입구, 중앙 UI가 잘 보이도록 중간 명도 대비 확보.",
  },
  {
    bucket: "equipment",
    key: "W_RUST",
    file: "equipment/W_RUST.png",
    prompt: "픽셀 아트 장비 아이콘. 녹슨 도끼. 낡은 철제 도끼날, 긁힌 자루, 어두운 배경 없는 투명 아이콘 느낌, 정면 3/4 각도.",
  },
  {
    bucket: "equipment",
    key: "W_EDGE",
    file: "equipment/W_EDGE.png",
    prompt: "픽셀 아트 장비 아이콘. 날선 단검. 보랏빛 반사광, 얇고 날카로운 칼날, 암살자 감성, 투명 배경 아이콘 느낌.",
  },
  {
    bucket: "equipment",
    key: "W_RUNE",
    file: "equipment/W_RUNE.png",
    prompt: "픽셀 아트 장비 아이콘. 룬 블레이드. 칼날에 빛나는 룬 각인, 고급 등급 무기, 청보라 오라, 투명 배경 아이콘 느낌.",
  },
  {
    bucket: "equipment",
    key: "H_HIDE",
    file: "equipment/H_HIDE.png",
    prompt: "픽셀 아트 장비 아이콘. 가죽 모자. 낡은 갈색 가죽 캡, 모험가 장비, 투명 배경 아이콘 느낌.",
  },
  {
    bucket: "equipment",
    key: "H_GUARD",
    file: "equipment/H_GUARD.png",
    prompt: "픽셀 아트 장비 아이콘. 수호 투구. 견고한 금속 헬름, 전면 보호대, 중갑 스타일, 투명 배경 아이콘 느낌.",
  },
  {
    bucket: "equipment",
    key: "H_CROWN",
    file: "equipment/H_CROWN.png",
    prompt: "픽셀 아트 장비 아이콘. 지휘 왕관. 어두운 금속 왕관에 보석 포인트, 지휘관 분위기, 투명 배경 아이콘 느낌.",
  },
  {
    bucket: "equipment",
    key: "A_CHAIN",
    file: "equipment/A_CHAIN.png",
    prompt: "픽셀 아트 장비 아이콘. 사슬 갑옷. 체인메일 상의, 금속 고리 질감이 보이는 정면 구도, 투명 배경 아이콘 느낌.",
  },
  {
    bucket: "equipment",
    key: "A_PLATE",
    file: "equipment/A_PLATE.png",
    prompt: "픽셀 아트 장비 아이콘. 철갑 흉갑. 두꺼운 판금 갑옷 흉부 파츠, 묵직한 방어형 디자인, 투명 배경 아이콘 느낌.",
  },
  {
    bucket: "equipment",
    key: "A_ABYSS",
    file: "equipment/A_ABYSS.png",
    prompt: "픽셀 아트 장비 아이콘. 심연 중갑. 어둠 오라가 새어 나오는 중갑 흉갑, 심연 룬 문양, 투명 배경 아이콘 느낌.",
  },
  {
    bucket: "equipment",
    key: "X_RING",
    file: "equipment/X_RING.png",
    prompt: "픽셀 아트 장비 아이콘. 예리한 반지. 푸른 보석이 박힌 금속 반지, 날카로운 인상, 투명 배경 아이콘 느낌.",
  },
  {
    bucket: "equipment",
    key: "X_CHARM",
    file: "equipment/X_CHARM.png",
    prompt: "픽셀 아트 장비 아이콘. 문양 부적. 매듭 끈과 마법 문양이 새겨진 부적, 신비로운 분위기, 투명 배경 아이콘 느낌.",
  },
  {
    bucket: "equipment",
    key: "X_CLOCK",
    file: "equipment/X_CLOCK.png",
    prompt: "픽셀 아트 장비 아이콘. 시공 펜던트. 작은 시계 장치가 달린 펜던트, 시간 왜곡 느낌, 투명 배경 아이콘 느낌.",
  },
];

const assetFilter = new Set(
  assetFilterRaw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
);

const targetSpecs =
  assetFilter.size === 0
    ? imageSpecs
    : imageSpecs.filter((spec) => assetFilter.has(spec.key) || assetFilter.has(`${spec.bucket}.${spec.key}`));

function mimeTypeFromFilePath(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
}

async function loadReferencePartsFromRaw(referenceRaw) {
  const refPaths = referenceRaw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => (path.isAbsolute(entry) ? entry : path.join(rootDir, entry)));

  const parts = [];
  for (const refPath of refPaths) {
    try {
      const binary = await readFile(refPath);
      parts.push({
        inlineData: {
          mimeType: mimeTypeFromFilePath(refPath),
          data: binary.toString("base64"),
        },
      });
    } catch (error) {
      console.warn(`[경고] 레퍼런스 로드 실패: ${refPath} (${error instanceof Error ? error.message : error})`);
    }
  }
  return parts;
}

function endpointFor(modelName) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
}

async function generateOne(spec, referenceParts = []) {
  const promptText =
    spec.bucket === "background"
      ? `${spec.prompt}\n\n레퍼런스 이미지의 색감/광원/질감 분위기를 최대한 참고하되, 인물/캐릭터는 새로 그리지 말고 배경만 생성.\n\n${PIXEL_STYLE_GUIDE}`
      : spec.bucket === "hero"
      ? `${spec.prompt}\n\n레퍼런스 이미지의 아트 스타일(픽셀 밀도/명암/외곽선/색감/분위기)을 우선 반영하되, 캐릭터 정체성(직업/장비/실루엣)은 현재 프롬프트 기준으로 생성.\n\n${PIXEL_STYLE_GUIDE}`
      : spec.bucket === "equipment"
      ? `${spec.prompt}\n\n레퍼런스 이미지와 동일 세계관의 인벤토리 장비 아이콘으로 제작. 정사각형 구도, 배경 요소 최소화, 아이콘 자체가 선명하게 구분되도록 생성.\n\n${PIXEL_STYLE_GUIDE}`
      : `${spec.prompt}\n\n${PIXEL_STYLE_GUIDE}`;
  const requestParts = [];
  if ((spec.bucket === "background" || spec.bucket === "hero" || spec.bucket === "equipment") && referenceParts.length > 0) {
    requestParts.push(...referenceParts);
  }
  requestParts.push({ text: promptText });

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: requestParts,
      },
    ],
    generationConfig: {
      responseModalities: ["IMAGE"],
    },
  };

  const response = await fetch(endpointFor(model), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const raw = await response.text();
  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error(`응답 파싱 실패: ${raw.slice(0, 300)}`);
  }

  if (!response.ok) {
    throw new Error(`API 오류(${response.status}): ${json?.error?.message || raw.slice(0, 300)}`);
  }

  const responseParts = json?.candidates?.[0]?.content?.parts || [];
  const inline = responseParts.find((part) => part?.inlineData?.data);
  if (!inline) {
    throw new Error(`이미지 데이터 없음: ${JSON.stringify(json).slice(0, 500)}`);
  }

  const imageData = inline.inlineData.data;
  const outputPath = path.join(generatedDir, spec.file);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, Buffer.from(imageData, "base64"));

  return {
    bucket: spec.bucket,
    key: spec.key,
    relativePath: `./assets/generated/${spec.file.replaceAll("\\", "/")}`,
  };
}

async function main() {
  const manifestJson = path.join(generatedDir, "manifest.json");
  const existing = { generatedAt: "", model: "", hero: {}, enemy: {}, background: {}, equipment: {} };
  try {
    const raw = await readFile(manifestJson, "utf8");
    const parsed = JSON.parse(raw);
    existing.generatedAt = parsed?.generatedAt || "";
    existing.model = parsed?.model || "";
    existing.hero = parsed?.hero || {};
    existing.enemy = parsed?.enemy || {};
    existing.background = parsed?.background || {};
    existing.equipment = parsed?.equipment || {};
  } catch {
    // ignore missing manifest
  }

  const manifest = {
    generatedAt: existing.generatedAt || "",
    model: existing.model || "",
    hero: { ...existing.hero },
    enemy: { ...existing.enemy },
    background: { ...existing.background },
    equipment: { ...existing.equipment },
  };

  if (targetSpecs.length === 0) {
    console.error("[오류] ASSET_KEYS 필터에 해당하는 에셋이 없습니다.");
    process.exit(1);
  }

  const backgroundReferenceParts = await loadReferencePartsFromRaw(backgroundReferenceRaw);
  const heroReferenceParts = await loadReferencePartsFromRaw(heroReferenceRaw);
  const equipmentReferenceParts = await loadReferencePartsFromRaw(equipmentReferenceRaw);
  let successCount = 0;
  let failCount = 0;

  for (const spec of targetSpecs) {
    process.stdout.write(`[생성] ${spec.bucket}.${spec.key} ... `);
    try {
      const referenceParts =
        spec.bucket === "background"
          ? backgroundReferenceParts
          : spec.bucket === "hero"
          ? heroReferenceParts
          : spec.bucket === "equipment"
          ? equipmentReferenceParts
          : [];
      const result = await generateOne(spec, referenceParts);
      manifest[result.bucket][result.key] = result.relativePath;
      successCount += 1;
      process.stdout.write("완료\n");
    } catch (error) {
      failCount += 1;
      process.stdout.write(`실패\n`);
      console.error(error instanceof Error ? error.message : error);
    }
  }

  if (successCount === 0) {
    throw new Error(`[오류] 요청한 ${targetSpecs.length}개 이미지 생성이 모두 실패했습니다.`);
  }

  manifest.generatedAt = new Date().toISOString();
  manifest.model = model;

  await mkdir(generatedDir, { recursive: true });
  const manifestJs = path.join(generatedDir, "assets-manifest.js");

  await writeFile(manifestJson, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  await writeFile(manifestJs, `window.PROTO_ASSETS = ${JSON.stringify(manifest, null, 2)};\n`, "utf8");

  if (failCount > 0) {
    console.warn(`[경고] 일부 실패: ${failCount}개 실패, ${successCount}개 성공`);
  }
  console.log(`\n[완료] 매니페스트 저장: ${manifestJson}`);
  console.log(`[완료] 프로토 연동 파일: ${manifestJs}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
