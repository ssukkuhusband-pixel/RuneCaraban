#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const apiKey = process.env.GOOGLE_API_KEY || process.env.NANOBANANA_API_KEY || "";
const model = process.env.GOOGLE_IMAGE_MODEL || "gemini-2.0-flash-exp-image-generation";

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
      "동일 세계관의 픽셀 아트 전투 배경. 가로형(16:9) 다크 고딕 전장, 폐허/황혼 하늘/먼 안개, 좌우 유닛 대치가 잘 보이도록 중앙 공간을 비우고 디테일은 가장자리 위주로 배치.",
  },
  {
    bucket: "background",
    key: "lobby_campfire",
    file: "backgrounds/lobby_campfire.png",
    prompt:
      "동일 세계관의 픽셀 아트 메인 로비 배경. 가로형(16:9), 전경에 모닥불 야영지와 실루엣 영웅들, 후경에 거대한 던전 입구, 중앙 UI가 잘 보이도록 중간 명도 대비 확보.",
  },
];

function endpointFor(modelName) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
}

async function generateOne(spec) {
  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${spec.prompt}\n\n${PIXEL_STYLE_GUIDE}`,
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
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

  const parts = json?.candidates?.[0]?.content?.parts || [];
  const inline = parts.find((part) => part?.inlineData?.data);
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
  const existing = { hero: {}, enemy: {}, background: {} };
  try {
    const raw = await readFile(manifestJson, "utf8");
    const parsed = JSON.parse(raw);
    existing.hero = parsed?.hero || {};
    existing.enemy = parsed?.enemy || {};
    existing.background = parsed?.background || {};
  } catch {
    // ignore missing manifest
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    model,
    hero: { ...existing.hero },
    enemy: { ...existing.enemy },
    background: { ...existing.background },
  };

  for (const spec of imageSpecs) {
    process.stdout.write(`[생성] ${spec.bucket}.${spec.key} ... `);
    try {
      const result = await generateOne(spec);
      manifest[result.bucket][result.key] = result.relativePath;
      process.stdout.write("완료\n");
    } catch (error) {
      process.stdout.write(`실패\n`);
      console.error(error instanceof Error ? error.message : error);
    }
  }

  await mkdir(generatedDir, { recursive: true });
  const manifestJs = path.join(generatedDir, "assets-manifest.js");

  await writeFile(manifestJson, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  await writeFile(manifestJs, `window.PROTO_ASSETS = ${JSON.stringify(manifest, null, 2)};\n`, "utf8");

  console.log(`\n[완료] 매니페스트 저장: ${manifestJson}`);
  console.log(`[완료] 프로토 연동 파일: ${manifestJs}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
