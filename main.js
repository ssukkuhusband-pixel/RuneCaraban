(() => {
  "use strict";

  const STAGE_W = 844;
  const STAGE_H = 390;
  const MAX_ACTIVE = 4;
  const TOTAL_NODES = 10;
  const NODE_PLAN = ["battle", "battle", "elite", "battle", "rest", "battle", "elite", "battle", "rest", "boss"];

  const byId = (id) => document.getElementById(id);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const randInt = (max) => Math.floor(Math.random() * max);
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const stage = byId("stage");
  const rotateOverlay = byId("rotateOverlay");
  const heroLane = byId("heroLane");
  const enemyLane = byId("enemyLane");
  const fxLayer = byId("fxLayer");
  const floatLayer = byId("floatLayer");
  const activeList = byId("activeList");
  const perkList = byId("perkList");
  const relicList = byId("relicList");
  const metaList = byId("metaList");
  const collectionStat = byId("collectionStat");
  const activeStat = byId("activeStat");
  const nodePill = byId("nodePill");
  const partyPill = byId("partyPill");
  const comboPill = byId("comboPill");
  const turnPill = byId("turnPill");
  const rulePill = byId("rulePill");
  const battleTopBar = byId("battleTopBar");
  const battleMainGrid = byId("battleMainGrid");
  const battleSlotBar = byId("battleSlotBar");
  const battleLog = byId("battleLog");
  const btnLogToggle = byId("btnLogToggle");
  const reelEls = [byId("reel0"), byId("reel1"), byId("reel2")];
  const btnSpin = byId("btnSpin");
  const btnRetry = byId("btnRetry");
  const btnPause = byId("btnPause");
  const modalLayer = byId("modalLayer");
  const modalTitle = byId("modalTitle");
  const modalBody = byId("modalBody");
  const modalFooter = byId("modalFooter");
  const btnModalClose = byId("btnModalClose");
  const battlefield = byId("battlefield");
  const skillCueLayer = byId("skillCueLayer");
  const lobbyLayer = byId("lobbyLayer");
  const lobbyMain = byId("lobbyMain");
  const lobbyHeroes = byId("lobbyHeroes");
  const lobbySummon = byId("lobbySummon");
  const lobbyScene = byId("lobbyScene");
  const lobbyShard = byId("lobbyShard");
  const lobbyOwned = byId("lobbyOwned");
  const lobbyEquipped = byId("lobbyEquipped");
  const chapterName = byId("chapterName");
  const chapterHint = byId("chapterHint");
  const btnLobbyHeroes = byId("btnLobbyHeroes");
  const btnLobbySummon = byId("btnLobbySummon");
  const btnResetData = byId("btnResetData");
  const btnChapterPrev = byId("btnChapterPrev");
  const btnChapterNext = byId("btnChapterNext");
  const btnChapterEnter = byId("btnChapterEnter");
  const btnHeroBack = byId("btnHeroBack");
  const btnSummonBack = byId("btnSummonBack");
  const heroRosterGrid = byId("heroRosterGrid");
  const heroDetail = byId("heroDetail");
  const summonShard = byId("summonShard");
  const summonRateInfo = byId("summonRateInfo");
  const summonResultList = byId("summonResultList");
  const btnSummon1 = byId("btnSummon1");
  const btnSummon10 = byId("btnSummon10");

  const HERO_LIBRARY = [
    {
      id: "H1",
      icon: "⚔",
      name: "란스",
      role: "공격수",
      baseHp: 48,
      baseAtk: 11,
      rarity: "R",
      summonWeight: 24,
      levelHp: 3,
      levelAtk: 1,
      attackStyle: "melee",
      targetRule: "front",
      passives: [
        { id: "H1_P1", unlockLevel: 2, name: "선봉 돌파", desc: "전열 적 대상 피해 +15%", effect: { type: "frontDamage", value: 0.15 } },
        { id: "H1_P2", unlockLevel: 5, name: "결의", desc: "체력 50% 이하 시 피해 +20%", effect: { type: "lowHpDamage", value: 0.2 } },
        { id: "H1_P3", unlockLevel: 8, name: "추격", desc: "처치 성공 시 에너지 +20", effect: { type: "killEnergy", value: 20 } },
      ],
    },
    {
      id: "H2",
      icon: "🗡",
      name: "베라",
      role: "결투가",
      baseHp: 42,
      baseAtk: 10,
      rarity: "SR",
      summonWeight: 14,
      levelHp: 2,
      levelAtk: 1,
      attackStyle: "melee",
      targetRule: "back",
      passives: [
        { id: "H2_P1", unlockLevel: 2, name: "암습", desc: "후열 적 대상 피해 +18%", effect: { type: "backDamage", value: 0.18 } },
        { id: "H2_P2", unlockLevel: 5, name: "예리함", desc: "치명타 확률 +10%", effect: { type: "critChance", value: 0.1 } },
        { id: "H2_P3", unlockLevel: 8, name: "빈틈 파고들기", desc: "치명타 피해 +20%", effect: { type: "critMult", value: 0.2 } },
      ],
    },
    {
      id: "H3",
      icon: "🔮",
      name: "미라",
      role: "마도사",
      baseHp: 38,
      baseAtk: 10,
      rarity: "SSR",
      summonWeight: 8,
      levelHp: 2,
      levelAtk: 2,
      attackStyle: "ranged",
      targetRule: "front",
      passives: [
        { id: "H3_P1", unlockLevel: 2, name: "잔류 마력", desc: "광역 효율 +15%", effect: { type: "aoePower", value: 0.15 } },
        { id: "H3_P2", unlockLevel: 5, name: "마력 순환", desc: "행동 시 에너지 추가 +8", effect: { type: "energyGainFlat", value: 8 } },
        { id: "H3_P3", unlockLevel: 8, name: "과충전", desc: "궁극기 피해 +20%", effect: { type: "ultDamage", value: 0.2 } },
      ],
    },
    {
      id: "H4",
      icon: "🛡",
      name: "브란",
      role: "수호자",
      baseHp: 56,
      baseAtk: 8,
      rarity: "R",
      summonWeight: 24,
      levelHp: 4,
      levelAtk: 1,
      attackStyle: "melee",
      targetRule: "front",
      passives: [
        { id: "H4_P1", unlockLevel: 2, name: "방패 숙련", desc: "전투 시작 시 보호막 +6", effect: { type: "startShield", value: 6 } },
        { id: "H4_P2", unlockLevel: 5, name: "수호 본능", desc: "피격 시 에너지 +6", effect: { type: "onHitEnergy", value: 6 } },
        { id: "H4_P3", unlockLevel: 8, name: "전열 지휘", desc: "수호자 스킬 보호막 +2", effect: { type: "shieldPowerFlat", value: 2 } },
      ],
    },
    {
      id: "H5",
      icon: "✨",
      name: "아이리스",
      role: "치유사",
      baseHp: 40,
      baseAtk: 7,
      rarity: "SSR",
      summonWeight: 8,
      levelHp: 3,
      levelAtk: 1,
      attackStyle: "ranged",
      targetRule: "lowest_hp",
      passives: [
        { id: "H5_P1", unlockLevel: 2, name: "치유 증폭", desc: "회복량 +4", effect: { type: "healPowerFlat", value: 4 } },
        { id: "H5_P2", unlockLevel: 5, name: "생명 순환", desc: "행동 후 가장 약한 아군 체력 +4", effect: { type: "actionHealLowest", value: 4 } },
        { id: "H5_P3", unlockLevel: 8, name: "정화", desc: "전투 시작 시 파티 체력 +6", effect: { type: "battleStartHealParty", value: 6 } },
      ],
    },
    {
      id: "H6",
      icon: "🏹",
      name: "킨",
      role: "궁수",
      baseHp: 44,
      baseAtk: 9,
      rarity: "SR",
      summonWeight: 14,
      levelHp: 2,
      levelAtk: 1,
      attackStyle: "ranged",
      targetRule: "back",
      passives: [
        { id: "H6_P1", unlockLevel: 2, name: "약점 저격", desc: "후열 적 대상 피해 +15%", effect: { type: "backDamage", value: 0.15 } },
        { id: "H6_P2", unlockLevel: 5, name: "속사", desc: "추가 사격 확률 +15%", effect: { type: "extraShot", value: 0.15 } },
        { id: "H6_P3", unlockLevel: 8, name: "집중", desc: "전투 시작 에너지 +20", effect: { type: "startEnergy", value: 20 } },
      ],
    },
  ];

  const TACTICS = [
    { id: "T_ASSIST", icon: "🤝", name: "협공" },
    { id: "T_BRACE", icon: "🧱", name: "방비" },
  ];

  const HERO_TRAITS = {
    H1: { icon: "🗡", name: "전선 압박", desc: "전열 대상 피해 +12%", effects: { frontBurst: 0.12 } },
    H2: { icon: "🩸", name: "처형자", desc: "체력 40% 이하 대상 피해 +18%", effects: { execute: 0.18 } },
    H3: { icon: "🔥", name: "원소 증폭", desc: "상태이상 대상 피해 +10%", effects: { statusHunter: 0.1 } },
    H4: { icon: "🛡", name: "선봉 방패", desc: "전투 시작 보호막 +2", effects: { startShield: 2 } },
    H5: { icon: "💧", name: "치유 공명", desc: "회복 스킬 고정 회복 +2", effects: { healBoostFlat: 2 } },
    H6: { icon: "🎯", name: "헌터 본능", desc: "전투 시작 집중 +1, 추가 사격 +6%", effects: { startFocus: 1, extraShot: 0.06 } },
  };

  const HERO_ATTACK_FEEL = {
    H1: { dashScale: 1.05, dashMs: 120, lungeMs: 110, contactMs: 100, recoverMs: 90, impactScale: 1.08, shake: 1.05 },
    H2: { dashScale: 1.26, dashMs: 92, lungeMs: 84, contactMs: 78, recoverMs: 64, impactScale: 1.12, shake: 0.95 },
    H3: { projectileLeadMs: 82, impactHoldMs: 86, impactScale: 1.08, shake: 0.9 },
    H4: { dashScale: 0.9, dashMs: 150, lungeMs: 132, contactMs: 118, recoverMs: 112, impactScale: 1.34, shake: 1.35 },
    H5: { projectileLeadMs: 102, impactHoldMs: 78, impactScale: 0.94, shake: 0.82 },
    H6: { projectileLeadMs: 68, impactHoldMs: 72, impactScale: 1.03, shake: 0.96 },
  };

  const ENEMY_ATTACK_FEEL = {
    desert_scorpion: { dashScale: 1.08, dashMs: 112, lungeMs: 104, contactMs: 86, recoverMs: 76, impactScale: 1.03, shake: 1 },
    shell_beetle: { dashScale: 0.86, dashMs: 145, lungeMs: 128, contactMs: 112, recoverMs: 108, impactScale: 1.26, shake: 1.22 },
    raider_wolf: { dashScale: 1.18, dashMs: 96, lungeMs: 88, contactMs: 80, recoverMs: 72, impactScale: 1.1, shake: 0.98 },
    bone_beast: { dashScale: 1.12, dashMs: 124, lungeMs: 116, contactMs: 94, recoverMs: 86, impactScale: 1.14, shake: 1.08 },
    boss_tyrant: { dashScale: 0.82, dashMs: 170, lungeMs: 140, contactMs: 130, recoverMs: 124, impactScale: 1.5, shake: 1.45 },
  };

  const BASE_WEIGHTS = {
    H1: 22,
    H2: 20,
    H3: 18,
    H4: 18,
    H5: 14,
    H6: 16,
    T_ASSIST: 8,
    T_BRACE: 8,
  };

  const ENEMY_INTENTS = [
    { id: "STRIKE", icon: "⚔", name: "강타", target: "single", mult: 1 },
    { id: "SWEEP", icon: "🌪", name: "휩쓸기", target: "all", mult: 0.74 },
    { id: "GUARD", icon: "🛡", name: "수비 반격", target: "single", mult: 0.86, selfShield: 6 },
  ];

  const BOSS_INTENTS = [
    { id: "CHARGE", icon: "🔥", name: "폭압 강타", target: "single", mult: 1.26 },
    { id: "DRAIN", icon: "🩸", name: "흡수 일격", target: "single", mult: 0.9, healRate: 0.55 },
  ];

  const RELIC_LIBRARY = [
    { id: "R_FANG", icon: "🦷", name: "포식자의 송곳니", desc: "전체 피해 +12%", apply: () => applyPerk({ type: "relicDmg", value: 0.12 }) },
    { id: "R_HELM", icon: "🪖", name: "수호 투구", desc: "전투 시작 시 아군 보호막 +3", apply: () => applyPerk({ type: "relicGuard", value: 3 }) },
    { id: "R_ORB", icon: "🔵", name: "공명 구슬", desc: "에너지 획득량 +25%", apply: () => applyPerk({ type: "relicEnergy", value: 0.25 }) },
    { id: "R_SCOPE", icon: "🧭", name: "매의 조준경", desc: "치명타 확률 +8%", apply: () => applyPerk({ type: "crit", value: 0.08 }) },
  ];

  const META_STORAGE_KEY = "rune_caravan_meta_v1";
  const STARTER_HERO_IDS = ["H1", "H3"];
  const HERO_PULL_COST = 24;
  const MAX_HERO_LEVEL = 10;
  const CHAPTER_CONFIG = {
    1: { label: "잿빛 입구", enemyHpMult: 1, enemyAtkMult: 1, shardMult: 1 },
    2: { label: "심연 회랑", enemyHpMult: 1.16, enemyAtkMult: 1.12, shardMult: 1.25 },
    3: { label: "붉은 제단", enemyHpMult: 1.3, enemyAtkMult: 1.24, shardMult: 1.55 },
  };
  const COMBAT_BALANCE = {
    enemyHpScale: 1.06,
    enemyHpPerNode: 0.022,
    enemyAtkScale: 0.88,
    enemyAtkPerNode: 0.015,
    bossHpScale: 1.08,
    bossAtkScale: 0.9,
    baseStartShield: 3,
  };
  const REWARD_BALANCE = {
    nodeBase: 6,
    nodeStep: 2,
    eliteBonus: 8,
    clearBonus: 26,
    defeatBase: 8,
    defeatStep: 1,
  };
  const generatedAssets = typeof window !== "undefined" && window.PROTO_ASSETS ? window.PROTO_ASSETS : {};

  const ASSET_MAP = {
    hero: generatedAssets.hero || {},
    enemy: generatedAssets.enemy || {},
    background: generatedAssets.background || {},
  };

  function visualPath(path) {
    if (!path || typeof path !== "string") return "";
    return path;
  }

  function chapterConfig(chapterId) {
    return CHAPTER_CONFIG[chapterId] || CHAPTER_CONFIG[1];
  }

  function chapterIds() {
    return Object.keys(CHAPTER_CONFIG)
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id))
      .sort((a, b) => a - b);
  }

  function nodeTypeOf(index) {
    return NODE_PLAN[index] || "battle";
  }

  function nodeTypeLabel(type) {
    if (type === "elite") return "정예";
    if (type === "rest") return "휴식";
    if (type === "boss") return "보스";
    return "전투";
  }

  function targetRuleLabel(rule, team = "enemy") {
    const targetWord = team === "hero" ? "아군" : "적";
    if (rule === "back") return `가장 뒤 ${targetWord}`;
    if (rule === "lowest_hp") return `체력 낮은 ${targetWord}`;
    if (rule === "random") return `무작위 ${targetWord}`;
    return `가장 앞 ${targetWord}`;
  }

  function targetRuleShort(rule) {
    if (rule === "back") return "후열";
    if (rule === "lowest_hp") return "저체력";
    if (rule === "random") return "무작위";
    return "전열";
  }

  function formationLabel(index, total) {
    if (!Number.isFinite(index) || index < 0 || index >= total) return "대기";
    return `${index + 1}/${total} (1=후열 → ${total}=전열)`;
  }

  function battlePositionTag(index, total) {
    if (!Number.isFinite(index) || index < 0 || index >= total) return "대기";
    if (index === total - 1) return "전열";
    if (index === 0) return "후열";
    return "중열";
  }

  function heroById(heroId) {
    return HERO_LIBRARY.find((hero) => hero.id === heroId) || null;
  }

  function heroTraitById(heroId) {
    return HERO_TRAITS[heroId] || null;
  }

  function unlockedPassiveList(hero, level) {
    if (!hero || !Array.isArray(hero.passives)) return [];
    return hero.passives.filter((passive) => level >= passive.unlockLevel);
  }

  function passiveEffectsByLevel(hero, level) {
    const effects = {};
    unlockedPassiveList(hero, level).forEach((passive) => {
      const type = passive?.effect?.type;
      const value = passive?.effect?.value;
      if (!type || !Number.isFinite(value)) return;
      effects[type] = (effects[type] || 0) + value;
    });
    return effects;
  }

  function heroTraitValue(hero, type) {
    if (!hero || !hero.traitEffects || !type) return 0;
    const value = hero.traitEffects[type];
    return Number.isFinite(value) ? value : 0;
  }

  function heroVisual(heroId) {
    return visualPath(ASSET_MAP.hero?.[heroId] || "");
  }

  function enemyVisual(enemyKey) {
    return visualPath(ASSET_MAP.enemy?.[enemyKey] || "");
  }

  function applyBattlefieldVisual() {
    if (!battlefield) return;
    const battlefieldImage = visualPath(ASSET_MAP.background?.battlefield || "");
    battlefield.style.backgroundImage = battlefieldImage
      ? `linear-gradient(180deg, rgba(16, 18, 33, 0.74), rgba(12, 13, 24, 0.82)), url("${battlefieldImage}")`
      : "linear-gradient(180deg, rgba(16, 18, 33, 0.9), rgba(12, 13, 24, 0.94))";
    if (battlefieldImage) {
      battlefield.style.backgroundSize = "cover";
      battlefield.style.backgroundPosition = "center";
    } else {
      battlefield.style.backgroundSize = "";
      battlefield.style.backgroundPosition = "";
    }
  }

  function applyLobbySceneVisual() {
    if (!lobbyScene) return;
    const lobbyImage = visualPath(ASSET_MAP.background?.lobby_campfire || "");
    lobbyScene.style.backgroundImage = lobbyImage
      ? `linear-gradient(180deg, rgba(11, 11, 19, 0.2), rgba(8, 9, 15, 0.72)), url("${lobbyImage}")`
      : "linear-gradient(180deg, rgba(16, 17, 30, 0.92), rgba(10, 11, 19, 0.96))";
    if (lobbyImage) {
      lobbyScene.style.backgroundSize = "cover";
      lobbyScene.style.backgroundPosition = "center";
    } else {
      lobbyScene.style.backgroundSize = "";
      lobbyScene.style.backgroundPosition = "";
    }
  }

  function rarityLabel(rarity) {
    if (rarity === "SSR") return "SSR";
    if (rarity === "SR") return "SR";
    return "R";
  }

  function rarityClass(rarity) {
    if (rarity === "SSR") return "ssr";
    if (rarity === "SR") return "sr";
    return "r";
  }

  function defaultRoster() {
    const roster = {};
    HERO_LIBRARY.forEach((hero) => {
      const starter = STARTER_HERO_IDS.includes(hero.id);
      roster[hero.id] = {
        owned: starter,
        level: 1,
        fragments: starter ? 4 : 0,
        pulls: 0,
      };
    });
    return roster;
  }

  function ensureMetaRoster(rawRoster = null) {
    const fallback = defaultRoster();
    HERO_LIBRARY.forEach((hero) => {
      const source = rawRoster && rawRoster[hero.id] ? rawRoster[hero.id] : null;
      const starter = STARTER_HERO_IDS.includes(hero.id);
      const owned = starter || Boolean(source?.owned);
      const level = owned
        ? clamp(Number.isFinite(source?.level) ? source.level : 1, 1, MAX_HERO_LEVEL)
        : 1;
      const fragments = clamp(Number.isFinite(source?.fragments) ? source.fragments : fallback[hero.id].fragments, 0, 999);
      const pulls = clamp(Number.isFinite(source?.pulls) ? source.pulls : 0, 0, 9999);
      fallback[hero.id] = { owned, level, fragments, pulls };
    });
    return fallback;
  }

  function defaultLoadout(roster) {
    const ownedIds = HERO_LIBRARY.filter((hero) => roster?.[hero.id]?.owned).map((hero) => hero.id);
    const ordered = [];
    STARTER_HERO_IDS.forEach((heroId) => {
      if (ownedIds.includes(heroId)) ordered.push(heroId);
    });
    ownedIds.forEach((heroId) => {
      if (!ordered.includes(heroId)) ordered.push(heroId);
    });
    return ordered.slice(0, Math.max(1, Math.min(MAX_ACTIVE, ordered.length)));
  }

  function ensureMetaLoadout(rawLoadout = null, roster = null) {
    const ownedIdSet = new Set(HERO_LIBRARY.filter((hero) => roster?.[hero.id]?.owned).map((hero) => hero.id));
    const filtered = [];
    if (Array.isArray(rawLoadout)) {
      rawLoadout.forEach((heroId) => {
        if (typeof heroId !== "string") return;
        if (!ownedIdSet.has(heroId)) return;
        if (filtered.includes(heroId)) return;
        filtered.push(heroId);
      });
    }
    if (filtered.length === 0) return defaultLoadout(roster);
    return filtered.slice(0, MAX_ACTIVE);
  }

  function sanitizeSummon(rawSummon) {
    if (!rawSummon || typeof rawSummon !== "object") return null;
    const heroId = typeof rawSummon.heroId === "string" ? rawSummon.heroId : "";
    if (!heroById(heroId)) return null;
    return {
      heroId,
      duplicate: Boolean(rawSummon.duplicate),
      gainFragments: clamp(Number.isFinite(rawSummon.gainFragments) ? rawSummon.gainFragments : 0, 0, 99),
      at: Number.isFinite(rawSummon.at) ? rawSummon.at : Date.now(),
    };
  }

  function loadMeta() {
    const fallbackRoster = defaultRoster();
    const fallback = {
      shards: 0,
      upgrades: { atk: 0, hp: 0, tactic: 0 },
      roster: fallbackRoster,
      loadout: defaultLoadout(fallbackRoster),
      summonPity: 0,
      lastSummon: null,
    };
    try {
      const raw = localStorage.getItem(META_STORAGE_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      const roster = ensureMetaRoster(parsed?.roster || null);
      return {
        shards: Number.isFinite(parsed?.shards) ? Math.max(0, parsed.shards) : 0,
        upgrades: {
          atk: Number.isFinite(parsed?.upgrades?.atk) ? clamp(parsed.upgrades.atk, 0, 5) : 0,
          hp: Number.isFinite(parsed?.upgrades?.hp) ? clamp(parsed.upgrades.hp, 0, 5) : 0,
          tactic: Number.isFinite(parsed?.upgrades?.tactic) ? clamp(parsed.upgrades.tactic, 0, 5) : 0,
        },
        roster,
        loadout: ensureMetaLoadout(parsed?.loadout || null, roster),
        summonPity: Number.isFinite(parsed?.summonPity) ? clamp(parsed.summonPity, 0, 99) : 0,
        lastSummon: sanitizeSummon(parsed?.lastSummon),
      };
    } catch {
      return fallback;
    }
  }

  function saveMeta(meta) {
    try {
      localStorage.setItem(META_STORAGE_KEY, JSON.stringify(meta));
    } catch {
      return;
    }
  }

  const state = {
    chapter: 1,
    nodeIndex: 0,
    currentNodeType: "battle",
    activeHeroes: [],
    enemies: [],
    perks: [],
    relics: [],
    phase: "idle", // idle | spin_ready | spinning | resolving | enemy | reward | end
    slotResult: [],
    comboStep: 0,
    runMetaGain: 0,
    teamGuardTurns: 0,
    teamGuardRate: 0,
    turnBuff: {
      label: "없음",
      damageMult: 1,
      critBonus: 0,
      tacticBonus: 0,
    },
    logCollapsed: false,
    meta: loadMeta(),
    ui: {
      screen: "main",
      selectedHeroId: null,
      summonResults: [],
      selectedChapter: 1,
    },
    modifiers: {
      atkFlat: 0,
      critBonus: 0,
      critMultBonus: 0,
      aoeBonus: 0,
      healBonus: 0,
      shieldBonus: 0,
      tacticBonus: 0,
      lifeSteal: 0,
      extraShotChance: 0,
      relicDamageMult: 0,
      energyGainMult: 0,
      relicGuardFlat: 0,
      skillDamageMult: 0,
      markDamageBonus: 0,
      burnBonusFlat: 0,
      regenBonusFlat: 0,
      guardRateBonus: 0,
      spinDoubleChance: 0,
      spinRerollChance: 0,
      specialRuneChance: 0,
      spinChargeChance: 0,
      spinEchoChance: 0,
      runeWeightDelta: {},
    },
  };

  let scaleRaf = 0;

  function viewportSize() {
    const visual = window.visualViewport;
    if (visual && Number.isFinite(visual.width) && Number.isFinite(visual.height) && visual.width > 0 && visual.height > 0) {
      return { width: visual.width, height: visual.height };
    }
    const doc = document.documentElement;
    return {
      width: doc?.clientWidth || window.innerWidth,
      height: doc?.clientHeight || window.innerHeight,
    };
  }

  function setScale() {
    const { width, height } = viewportSize();
    const scale = Math.min(1.5, Math.min(width / STAGE_W, height / STAGE_H));
    stage.style.transform = `scale(${scale})`;
    const portrait = height > width;
    rotateOverlay.classList.toggle("open", portrait);
    rotateOverlay.setAttribute("aria-hidden", portrait ? "false" : "true");
  }

  function scheduleScale() {
    if (scaleRaf) cancelAnimationFrame(scaleRaf);
    scaleRaf = requestAnimationFrame(() => {
      scaleRaf = 0;
      setScale();
    });
  }

  window.addEventListener("resize", scheduleScale, { passive: true });
  window.addEventListener("orientationchange", scheduleScale, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", scheduleScale, { passive: true });
  }
  setScale();

  document.addEventListener(
    "touchmove",
    (event) => {
      if (
        event.target &&
        event.target.closest &&
        event.target.closest(".battleLog, .modalBody, .heroRosterGrid, .summonResultList")
      )
        return;
      if (event.cancelable) event.preventDefault();
    },
    { passive: false }
  );

  function now() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(
      d.getSeconds()
    ).padStart(2, "0")}`;
  }

  function log(text, muted = false) {
    const line = document.createElement("div");
    line.className = "logLine";
    if (muted) line.classList.add("muted");

    const time = document.createElement("span");
    time.className = "logTime";
    time.textContent = now();
    const msg = document.createElement("span");
    msg.className = "logText";
    msg.textContent = text;

    line.appendChild(time);
    line.appendChild(msg);
    battleLog.prepend(line);
    while (battleLog.childElementCount > 45) {
      battleLog.removeChild(battleLog.lastElementChild);
    }
  }

  function clearLog() {
    battleLog.innerHTML = "";
  }

  function makeIconToken({ icon, label, tone = "", badge = "", dimmed = false }) {
    const token = document.createElement("div");
    token.className = `iconToken${tone ? ` ${tone}` : ""}${dimmed ? " dimmed" : ""}`;
    token.title = label;
    token.setAttribute("aria-label", label);

    const glyph = document.createElement("span");
    glyph.className = "iconGlyph";
    glyph.textContent = icon;
    token.appendChild(glyph);

    if (badge !== "" && badge !== null && badge !== undefined) {
      const badgeNode = document.createElement("span");
      badgeNode.className = "iconBadge";
      const badgeNumber = Number(badge);
      badgeNode.textContent = Number.isFinite(badgeNumber) && badgeNumber > 99 ? "99+" : String(badge);
      token.appendChild(badgeNode);
    }

    return token;
  }

  function appendEmptyToken(container, text) {
    const empty = document.createElement("div");
    empty.className = "iconEmpty";
    empty.textContent = text;
    container.appendChild(empty);
  }

  function heroProgress(heroId) {
    return state.meta?.roster?.[heroId] || { owned: false, level: 1, fragments: 0, pulls: 0 };
  }

  function heroOwnedCount() {
    return HERO_LIBRARY.filter((hero) => heroProgress(hero.id).owned).length;
  }

  function currentLoadout() {
    return Array.isArray(state.meta?.loadout) ? [...state.meta.loadout] : [];
  }

  function loadoutPosition(heroId) {
    const loadout = currentLoadout();
    const index = loadout.indexOf(heroId);
    if (index < 0) return null;
    return { index, total: loadout.length };
  }

  function isHeroEquipped(heroId) {
    return currentLoadout().includes(heroId);
  }

  function tryToggleLoadout(heroId) {
    const progress = heroProgress(heroId);
    if (!progress.owned) return { ok: false, reason: "미보유 영웅" };
    const loadout = currentLoadout();
    const index = loadout.indexOf(heroId);

    if (index >= 0) {
      if (loadout.length <= 1) return { ok: false, reason: "최소 1명 필요" };
      loadout.splice(index, 1);
      state.meta.loadout = loadout;
      saveMeta(state.meta);
      return { ok: true, equipped: false };
    }

    if (loadout.length >= MAX_ACTIVE) return { ok: false, reason: `최대 ${MAX_ACTIVE}명` };
    loadout.push(heroId);
    state.meta.loadout = loadout;
    saveMeta(state.meta);
    return { ok: true, equipped: true };
  }

  function tryShiftLoadout(heroId, delta) {
    const loadout = currentLoadout();
    const index = loadout.indexOf(heroId);
    if (index < 0) return { ok: false, reason: "출전중 아님" };
    const next = index + delta;
    if (next < 0 || next >= loadout.length) return { ok: false, reason: "이동 불가" };
    const copy = [...loadout];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    state.meta.loadout = copy;
    saveMeta(state.meta);
    return { ok: true, index: next };
  }

  function setBattleUIVisible(visible) {
    [battleTopBar, battleMainGrid, battleSlotBar].forEach((node) => {
      if (!node) return;
      node.classList.toggle("hidden", !visible);
    });
  }

  function setLobbyVisible(visible) {
    if (!lobbyLayer) return;
    lobbyLayer.classList.toggle("open", visible);
    lobbyLayer.classList.toggle("hidden", !visible);
  }

  function openLobbyScreen(screen) {
    state.ui.screen = screen;
    const map = {
      main: lobbyMain,
      heroes: lobbyHeroes,
      summon: lobbySummon,
    };
    [lobbyMain, lobbyHeroes, lobbySummon].forEach((node) => node && node.classList.remove("active"));
    if (map[screen]) map[screen].classList.add("active");
    renderLobby();
  }

  function renderLobbyMain() {
    if (lobbyShard) lobbyShard.textContent = `${state.meta.shards}`;
    if (lobbyOwned) lobbyOwned.textContent = `${heroOwnedCount()}/${HERO_LIBRARY.length}`;
    if (lobbyEquipped) lobbyEquipped.textContent = `${currentLoadout().length}/${MAX_ACTIVE}`;
    const ids = chapterIds();
    if (ids.length === 0) return;
    const minId = ids[0];
    const maxId = ids[ids.length - 1];
    const selected = clamp(Number(state.ui.selectedChapter) || state.chapter || minId, minId, maxId);
    state.ui.selectedChapter = selected;
    const selectedConfig = chapterConfig(selected);
    if (chapterName) chapterName.textContent = `챕터 ${selected} · ${selectedConfig.label}`;
    if (chapterHint)
      chapterHint.textContent = `난이도 배율  HP x${selectedConfig.enemyHpMult.toFixed(2)} · ATK x${selectedConfig.enemyAtkMult.toFixed(
        2
      )}`;
    if (btnChapterPrev) btnChapterPrev.disabled = selected <= minId;
    if (btnChapterNext) btnChapterNext.disabled = selected >= maxId;
  }

  function shiftLobbyChapter(delta) {
    const ids = chapterIds();
    if (ids.length === 0) return;
    const current = Number(state.ui.selectedChapter) || ids[0];
    const index = Math.max(0, ids.indexOf(current));
    const nextIndex = clamp(index + delta, 0, ids.length - 1);
    state.ui.selectedChapter = ids[nextIndex];
    renderLobbyMain();
  }

  function renderHeroDetail(heroId) {
    if (!heroDetail) return;
    const hero = heroById(heroId);
    if (!hero) {
      heroDetail.innerHTML = '<div class="heroDetailStat">🧙 우측 목록에서 영웅을 선택해주세요.</div>';
      return;
    }

    const progress = heroProgress(hero.id);
    const growth = heroLevelGrowth(hero, progress.level);
    const needFragments = progress.level >= MAX_HERO_LEVEL ? 0 : heroLevelCostFragments(progress.level);
    const needShards = progress.level >= MAX_HERO_LEVEL ? 0 : heroLevelCostShards(progress.level);
    const heroArt = heroVisual(hero.id);
    const equippedPos = loadoutPosition(hero.id);

    heroDetail.innerHTML = "";

    const head = document.createElement("div");
    head.className = "heroDetailHead";
    const rarity = rarityLabel(hero.rarity);
    const rarityTone = rarityClass(hero.rarity);
    head.innerHTML = `<div class="heroDetailArt">${
      heroArt
        ? `<img src="${heroArt}" alt="${hero.name}" loading="lazy" /><span class="heroSymbolBadge">${hero.icon}</span>`
        : hero.icon
    }</div><div class="heroDetailHeadText"><div class="heroDetailTitle"><span class="rarityBadge ${rarityTone}">${rarity}</span>${hero.name} <span class="heroLevelBadge">Lv.${progress.level}</span></div><div class="heroDetailSub">${hero.icon} ${hero.role}</div></div>`;
    heroDetail.appendChild(head);

    const stat = document.createElement("div");
    stat.className = "heroDetailStat";
    stat.innerHTML = `<div class="heroDetailStatGrid">
      <div class="heroStatLine"><span class="heroStatIcon">⚔️</span><span class="heroStatLabel">공격력</span><span class="heroStatValue main attack">${hero.baseAtk}</span><span class="heroStatValue growth">+${growth.atk}</span></div>
      <div class="heroStatLine"><span class="heroStatIcon">❤️</span><span class="heroStatLabel">체력</span><span class="heroStatValue main hp">${hero.baseHp}</span><span class="heroStatValue growth">+${growth.hp}</span></div>
      <div class="heroStatLine"><span class="heroStatIcon">🧩</span><span class="heroStatLabel">조각</span><span class="heroStatValue main resource">${progress.fragments}${
      progress.level >= MAX_HERO_LEVEL ? "" : ` / ${needFragments}`
    }</span></div>
      <div class="heroStatLine"><span class="heroStatIcon">🎯</span><span class="heroStatLabel">기본 타겟</span><span class="heroStatValue main target">${targetRuleLabel(
      hero.targetRule || "front",
      "enemy"
    )}</span></div>
    </div>`;
    heroDetail.appendChild(stat);

    const trait = heroTraitById(hero.id);
    if (trait) {
      const traitBox = document.createElement("div");
      traitBox.className = "heroTraitBox";
      traitBox.innerHTML = `<div class="heroTraitName">${trait.icon} 특성 · ${trait.name}</div><div class="heroTraitDesc">${trait.desc}</div>`;
      heroDetail.appendChild(traitBox);
    }

    const positionBox = document.createElement("div");
    positionBox.className = "heroPositionBox";
    const positionText = document.createElement("div");
    positionText.className = "heroPositionText";
    positionText.textContent = equippedPos ? `📍 출전 위치 ${formationLabel(equippedPos.index, equippedPos.total)}` : "🪑 현재 대기중";
    positionBox.appendChild(positionText);
    if (equippedPos) {
      const positionActions = document.createElement("div");
      positionActions.className = "heroPositionActions";
      const moveBack = document.createElement("button");
      moveBack.className = "btn tiny ghost";
      moveBack.type = "button";
      moveBack.textContent = "◀ 뒤로";
      moveBack.disabled = equippedPos.index <= 0;
      moveBack.addEventListener("click", () => {
        const result = tryShiftLoadout(hero.id, -1);
        if (!result.ok) return;
        renderLobby();
      });
      const moveFront = document.createElement("button");
      moveFront.className = "btn tiny ghost";
      moveFront.type = "button";
      moveFront.textContent = "앞으로 ▶";
      moveFront.disabled = equippedPos.index >= equippedPos.total - 1;
      moveFront.addEventListener("click", () => {
        const result = tryShiftLoadout(hero.id, 1);
        if (!result.ok) return;
        renderLobby();
      });
      positionActions.appendChild(moveBack);
      positionActions.appendChild(moveFront);
      positionBox.appendChild(positionActions);
    }
    heroDetail.appendChild(positionBox);

    const actions = document.createElement("div");
    actions.className = "heroDetailActions";
    const equipBtn = document.createElement("button");
    const equipped = isHeroEquipped(hero.id);
    equipBtn.className = `btn tiny ${equipped ? "ghost" : "primary"}`;
    equipBtn.textContent = equipped ? "🧳 출전 해제" : "⚔️ 출전 장착";
    if (equipped && currentLoadout().length <= 1) equipBtn.disabled = true;
    if (!equipped && currentLoadout().length >= MAX_ACTIVE) equipBtn.disabled = true;
    equipBtn.addEventListener("click", () => {
      const result = tryToggleLoadout(hero.id);
      if (!result.ok) return;
      renderLobby();
    });
    actions.appendChild(equipBtn);

    const levelBtn = document.createElement("button");
    levelBtn.className = "btn tiny primary";
    if (progress.level >= MAX_HERO_LEVEL) {
      levelBtn.textContent = "🏁 최대 레벨";
      levelBtn.disabled = true;
    } else {
      levelBtn.textContent = `⬆️ 레벨업 ${needShards}`;
      levelBtn.title = `필요: 조각 ${needFragments}, 결정 ${needShards}`;
      levelBtn.disabled = progress.fragments < needFragments || state.meta.shards < needShards;
    }
    levelBtn.addEventListener("click", () => {
      const result = tryHeroLevelUp(hero.id);
      if (!result.ok) return;
      log(`${hero.name} 성장 완료: Lv.${result.level}`, true);
      renderLobby();
    });
    actions.appendChild(levelBtn);
    heroDetail.appendChild(actions);

    const passiveTitle = document.createElement("div");
    passiveTitle.className = "heroDetailSubTitle";
    passiveTitle.textContent = "✨ 패시브 스킬";
    heroDetail.appendChild(passiveTitle);

    const passiveList = document.createElement("div");
    passiveList.className = "heroPassiveList";
    (hero.passives || []).forEach((passive) => {
      const unlocked = progress.level >= passive.unlockLevel;
      const item = document.createElement("div");
      item.className = `heroPassiveItem${unlocked ? " unlocked" : " locked"}`;
      item.innerHTML = `<div class="heroPassiveName">${unlocked ? "✅" : "🔒"} Lv.${passive.unlockLevel} ${
        passive.name
      }</div><div class="heroPassiveDesc">${passive.desc}</div>`;
      passiveList.appendChild(item);
    });
    heroDetail.appendChild(passiveList);
  }

  function renderHeroRoster() {
    if (!heroRosterGrid) return;
    heroRosterGrid.innerHTML = "";
    const heroes = HERO_LIBRARY.filter((hero) => heroProgress(hero.id).owned);
    if (heroes.length === 0) {
      heroRosterGrid.innerHTML = '<div class="iconEmpty">보유 영웅이 없습니다.</div>';
      renderHeroDetail("");
      return;
    }
    if (!state.ui.selectedHeroId || !heroProgress(state.ui.selectedHeroId).owned) state.ui.selectedHeroId = heroes[0].id;

    heroes.forEach((hero) => {
      const progress = heroProgress(hero.id);
      const heroArt = heroVisual(hero.id);
      const equippedPos = loadoutPosition(hero.id);
      const stateText = equippedPos ? `⚔️ 출전 ${equippedPos.index + 1}/${equippedPos.total}` : "🪑 대기";
      const rarity = rarityLabel(hero.rarity);
      const rarityTone = rarityClass(hero.rarity);
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = `heroChip${state.ui.selectedHeroId === hero.id ? " selected" : ""}`;
      chip.innerHTML = `<div class="heroChipTop"><div class="heroChipIcon">${
        heroArt
          ? `<img src="${heroArt}" alt="${hero.name}" loading="lazy" /><span class="heroSymbolBadge small">${hero.icon}</span>`
          : hero.icon
      }</div><div class="heroChipInfo"><div class="heroChipName">${hero.name}</div><div class="heroChipMeta">🆙 Lv.${progress.level} · ${stateText}</div></div><span class="heroChipRarity ${rarityTone}">${rarity}</span></div>`;
      chip.addEventListener("click", () => {
        state.ui.selectedHeroId = hero.id;
        renderHeroRoster();
        renderHeroDetail(hero.id);
      });
      heroRosterGrid.appendChild(chip);
    });

    renderHeroDetail(state.ui.selectedHeroId);
  }

  function renderSummonPanel() {
    if (summonShard) summonShard.textContent = `${state.meta.shards}`;
    if (summonRateInfo) {
      const pity = clamp(Number(state.meta.summonPity) || 0, 0, 99);
      const remain = Math.max(1, 10 - pity);
      summonRateInfo.textContent = `${summonRateSummary()} · SR+ 보장까지 ${remain}회`;
    }
    if (btnSummon1) btnSummon1.disabled = state.meta.shards < HERO_PULL_COST;
    if (btnSummon10) btnSummon10.disabled = state.meta.shards < HERO_PULL_COST * 10;
    if (!summonResultList) return;
    summonResultList.innerHTML = "";
    if (state.ui.summonResults.length === 0) {
      summonResultList.innerHTML = '<div class="iconEmpty">최근 뽑기 내역이 없습니다.</div>';
      return;
    }
    state.ui.summonResults.slice(0, 20).forEach((entry) => {
      const line = document.createElement("div");
      line.className = "summonLine";
      line.textContent = `${entry.icon} ${entry.name} [${entry.rarity}] ${entry.duplicate ? "중복" : "신규"} · 조각 +${
        entry.fragments
      }`;
      summonResultList.appendChild(line);
    });
  }

  function renderLobby() {
    applyLobbySceneVisual();
    renderLobbyMain();
    if (state.ui.screen === "heroes") renderHeroRoster();
    if (state.ui.screen === "summon") renderSummonPanel();
  }

  function startChapterRun(chapterId) {
    state.chapter = Number(chapterId) || 1;
    state.ui.selectedChapter = state.chapter;
    resetRun({ startBattle: true, chapter: state.chapter });
  }

  function runSummon(times) {
    const count = clamp(times, 1, 10);
    const results = [];
    for (let index = 0; index < count; index += 1) {
      const result = tryHeroSummon();
      if (!result.ok) break;
      if (result.guaranteeSrPlus) log("소환 보장 발동: 이번 뽑기에서 SR 이상이 확정됩니다.", true);
      results.push({
        icon: result.hero.icon,
        name: result.hero.name,
        rarity: rarityLabel(result.hero.rarity),
        duplicate: result.duplicate,
        fragments: result.gainFragments,
      });
      log(
        `소환 결과: ${result.hero.icon} ${result.hero.name} ${result.duplicate ? "(중복 조각)" : "(신규 해금)"} +${
          result.gainFragments
        }`,
        true
      );
    }
    if (results.length > 0) {
      state.ui.summonResults = [...results.reverse(), ...state.ui.summonResults].slice(0, 40);
    }
    renderLobby();
  }

  function heroLevelCostFragments(level) {
    return 5 + level * 2;
  }

  function heroLevelCostShards(level) {
    return 8 + level * 4;
  }

  function heroLevelGrowth(hero, level) {
    const step = Math.max(0, level - 1);
    return {
      atk: (hero.levelAtk || 1) * step,
      hp: (hero.levelHp || 2) * step,
    };
  }

  function makeHeroState(heroId) {
    const base = heroById(heroId);
    if (!base) return null;
    const trait = heroTraitById(heroId);
    const progress = heroProgress(heroId);
    const level = clamp(progress.level || 1, 1, MAX_HERO_LEVEL);
    const growth = heroLevelGrowth(base, level);
    const passiveEffects = passiveEffectsByLevel(base, level);
    const passiveUnlockedIds = unlockedPassiveList(base, level).map((passive) => passive.id);
    const hpBonus = (state.meta?.upgrades?.hp || 0) * 4;
    const atkBonus = state.meta?.upgrades?.atk || 0;
    const maxHpRaw = base.baseHp + hpBonus + growth.hp + (passiveEffects.hpFlat || 0);
    const maxHp = Math.max(1, Math.floor(maxHpRaw * (1 + (passiveEffects.hpMult || 0))));
    const atkRaw = base.baseAtk + atkBonus + growth.atk + (passiveEffects.atkFlat || 0);
    return {
      ...base,
      metaLevel: level,
      maxHp,
      hp: maxHp,
      atk: Math.max(1, Math.floor(atkRaw * (1 + (passiveEffects.atkMult || 0)))),
      shield: 0,
      energy: 0,
      focus: 0,
      regenTurns: 0,
      regenPower: 0,
      targetRule: base.targetRule || "front",
      trait,
      traitEffects: trait?.effects || {},
      passiveEffects,
      passiveUnlockedIds,
    };
  }

  function freshTurnBuff() {
    return {
      label: "없음",
      damageMult: 1,
      critBonus: 0,
      tacticBonus: 0,
    };
  }

  function resetTurnBuff() {
    state.turnBuff = freshTurnBuff();
  }

  function rollEnemyIntent(nodeIndex, isBoss = false) {
    const intentPool = [...ENEMY_INTENTS];
    if (isBoss || nodeIndex >= 2) intentPool.push(...BOSS_INTENTS);
    const picked = intentPool[randInt(intentPool.length)];
    return { ...picked };
  }

  function makeEnemySet(nodeIndex, nodeType = "battle") {
    const chapter = chapterConfig(state.chapter);
    const progressRate = nodeIndex / Math.max(1, TOTAL_NODES - 1);
    const hpScale = COMBAT_BALANCE.enemyHpScale * (1 + nodeIndex * COMBAT_BALANCE.enemyHpPerNode + progressRate * 0.06);
    const atkScale = COMBAT_BALANCE.enemyAtkScale * (1 + nodeIndex * COMBAT_BALANCE.enemyAtkPerNode + progressRate * 0.04);
    const bossNode = nodeType === "boss" || nodeIndex === TOTAL_NODES - 1;
    if (bossNode) {
      const bossHp = Math.floor((122 + nodeIndex * 8) * chapter.enemyHpMult * COMBAT_BALANCE.bossHpScale);
      const bossAtk = Math.max(1, Math.floor((12 + Math.floor(nodeIndex * 0.8)) * chapter.enemyAtkMult * COMBAT_BALANCE.bossAtkScale));
      return [
        {
          id: `BOSS_${nodeIndex}`,
          artKey: "boss_tyrant",
          icon: "👹",
          name: "재의 폭군",
          maxHp: bossHp,
          hp: bossHp,
          atk: bossAtk,
          shield: 0,
          enraged: false,
          intent: rollEnemyIntent(nodeIndex, true),
          elite: true,
          attackStyle: "melee",
          targetRule: "front",
          markTurns: 0,
          burnTurns: 0,
          burnPower: 0,
          weakenTurns: 0,
        },
      ];
    }

    const eliteNode = nodeType === "elite";
    const progressionTier = Math.floor(nodeIndex / 3);
    const count = eliteNode ? clamp(3 + progressionTier, 3, 5) : clamp(2 + progressionTier, 2, 4);
    const pool = [
      { artKey: "desert_scorpion", icon: "🦂", name: "사막 전갈", hp: 30, atk: 6, attackStyle: "melee", targetRule: "front" },
      { artKey: "shell_beetle", icon: "🪲", name: "갑각 벌레", hp: 34, atk: 7, attackStyle: "melee", targetRule: "front" },
      { artKey: "raider_wolf", icon: "🐺", name: "약탈 늑대", hp: 38, atk: 8, attackStyle: "melee", targetRule: "back" },
      { artKey: "bone_beast", icon: "🦴", name: "뼈 야수", hp: 33, atk: 7, attackStyle: "melee", targetRule: "lowest_hp" },
    ];
    const enemies = [];
    for (let index = 0; index < count; index += 1) {
      const sample = pool[randInt(pool.length)];
      const eliteBonusHp = eliteNode ? 8 : 0;
      const eliteBonusAtk = eliteNode ? 1 : 0;
      const hp = Math.floor((sample.hp + nodeIndex * 5 + randInt(4) + eliteBonusHp) * chapter.enemyHpMult * hpScale);
      const atk = Math.max(
        1,
        Math.floor((sample.atk + Math.floor(nodeIndex * 0.75) + randInt(2) + eliteBonusAtk) * chapter.enemyAtkMult * atkScale)
      );
      enemies.push({
        id: `EN_${nodeIndex}_${index}`,
        artKey: sample.artKey,
        icon: sample.icon,
        name: eliteNode ? `정예 ${sample.name}` : sample.name,
        maxHp: hp,
        hp,
        atk,
        shield: 0,
        enraged: false,
        intent: rollEnemyIntent(nodeIndex, false),
        elite: eliteNode,
        attackStyle: sample.attackStyle || "melee",
        targetRule: sample.targetRule || "front",
        markTurns: 0,
        burnTurns: 0,
        burnPower: 0,
        weakenTurns: 0,
      });
    }
    return enemies;
  }

  function openModal({ title, bodyNode, footerNode = null, closable = true }) {
    modalTitle.textContent = title;
    modalBody.innerHTML = "";
    modalBody.appendChild(bodyNode);
    modalFooter.innerHTML = "";
    if (footerNode) modalFooter.appendChild(footerNode);
    btnModalClose.hidden = !closable;
    modalLayer.classList.add("open");
    modalLayer.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modalLayer.classList.remove("open");
    modalLayer.setAttribute("aria-hidden", "true");
  }

  btnModalClose.addEventListener("click", () => {
    if (state.phase === "reward") return;
    closeModal();
  });

  function aliveHeroes() {
    return state.activeHeroes.filter((hero) => hero.hp > 0);
  }

  function aliveEnemies() {
    return state.enemies.filter((enemy) => enemy.hp > 0);
  }

  function frontAliveHero() {
    for (let index = state.activeHeroes.length - 1; index >= 0; index -= 1) {
      const hero = state.activeHeroes[index];
      if (hero.hp > 0) return hero;
    }
    return null;
  }

  function backAliveHero() {
    for (let index = 0; index < state.activeHeroes.length; index += 1) {
      const hero = state.activeHeroes[index];
      if (hero.hp > 0) return hero;
    }
    return null;
  }

  function frontAliveEnemy() {
    for (let index = 0; index < state.enemies.length; index += 1) {
      const enemy = state.enemies[index];
      if (enemy.hp > 0) return enemy;
    }
    return null;
  }

  function backAliveEnemy() {
    for (let index = state.enemies.length - 1; index >= 0; index -= 1) {
      const enemy = state.enemies[index];
      if (enemy.hp > 0) return enemy;
    }
    return null;
  }

  function lowestHpHero() {
    const list = aliveHeroes();
    if (list.length === 0) return null;
    return list.reduce((picked, hero) => (hero.hp / hero.maxHp < picked.hp / picked.maxHp ? hero : picked), list[0]);
  }

  function lowestHpEnemy() {
    const list = aliveEnemies();
    if (list.length === 0) return null;
    return list.reduce((picked, enemy) => (enemy.hp / enemy.maxHp < picked.hp / picked.maxHp ? enemy : picked), list[0]);
  }

  function randomAliveHero() {
    const list = aliveHeroes();
    if (list.length === 0) return null;
    return list[randInt(list.length)];
  }

  function randomAliveEnemy() {
    const list = aliveEnemies();
    if (list.length === 0) return null;
    return list[randInt(list.length)];
  }

  function randomAliveEnemyExcept(enemyId) {
    const list = aliveEnemies().filter((enemy) => enemy.id !== enemyId);
    if (list.length === 0) return null;
    return list[randInt(list.length)];
  }

  function selectEnemyTarget(rule = "front") {
    if (rule === "back") return backAliveEnemy();
    if (rule === "lowest_hp") return lowestHpEnemy();
    if (rule === "random") return randomAliveEnemy();
    return frontAliveEnemy();
  }

  function selectHeroTarget(rule = "front") {
    if (rule === "back") return backAliveHero();
    if (rule === "lowest_hp") return lowestHpHero();
    if (rule === "random") return randomAliveHero();
    return frontAliveHero();
  }

  function attackStyleOfHero(hero) {
    if (!hero) return "ranged";
    return hero.attackStyle === "melee" ? "melee" : "ranged";
  }

  function attackStyleOfEnemy(enemy) {
    if (!enemy) return "melee";
    return enemy.attackStyle === "ranged" ? "ranged" : "melee";
  }

  function attackFeelOfUnit(unit, team = "hero") {
    const base = {
      dashScale: 1,
      dashMs: 120,
      lungeMs: 115,
      contactMs: 90,
      recoverMs: 70,
      projectileLeadMs: 90,
      impactHoldMs: 90,
      impactScale: 1,
      shake: 1,
    };
    if (!unit) return base;
    const profile = team === "hero" ? HERO_ATTACK_FEEL[unit.id] : ENEMY_ATTACK_FEEL[unit.artKey];
    return {
      ...base,
      ...(profile || {}),
    };
  }

  function isFrontEnemy(enemy) {
    const front = frontAliveEnemy();
    return Boolean(front && enemy && front.id === enemy.id);
  }

  function isBackEnemy(enemy) {
    const back = backAliveEnemy();
    return Boolean(back && enemy && back.id === enemy.id);
  }

  function applyEnemyMark(enemy, turns = 2) {
    if (!enemy || enemy.hp <= 0) return;
    enemy.markTurns = Math.max(enemy.markTurns || 0, Math.floor(turns));
  }

  function applyEnemyBurn(enemy, turns = 2, power = 2) {
    if (!enemy || enemy.hp <= 0) return;
    enemy.burnTurns = Math.max(enemy.burnTurns || 0, Math.floor(turns));
    enemy.burnPower = Math.max(enemy.burnPower || 0, Math.floor(power));
  }

  function applyEnemyWeak(enemy, turns = 1) {
    if (!enemy || enemy.hp <= 0) return;
    enemy.weakenTurns = Math.max(enemy.weakenTurns || 0, Math.floor(turns));
  }

  function applyHeroRegen(hero, turns = 2, power = 4) {
    if (!hero || hero.hp <= 0) return;
    hero.regenTurns = Math.max(hero.regenTurns || 0, Math.floor(turns));
    hero.regenPower = Math.max(hero.regenPower || 0, Math.floor(power));
  }

  function enableTeamGuard(turns = 1, rate = 0.12, source = "가드") {
    state.teamGuardTurns = Math.max(state.teamGuardTurns, Math.floor(turns));
    state.teamGuardRate = Math.max(state.teamGuardRate, rate + state.modifiers.guardRateBonus);
    log(`${source}: 아군 피해 감소 ${(state.teamGuardRate * 100).toFixed(0)}%`, true);
  }

  function nodeByHero(heroId) {
    return heroLane.querySelector(`[data-hero-id="${heroId}"]`);
  }

  function nodeByEnemy(enemyId) {
    return enemyLane.querySelector(`[data-enemy-id="${enemyId}"]`);
  }

  function pointInRect(node, stageRelative = true) {
    if (!node) return null;
    const rect = node.getBoundingClientRect();
    const root = stageRelative ? stage.getBoundingClientRect() : stage.getBoundingClientRect();
    const scaleX = root.width > 0 ? root.width / STAGE_W : 1;
    const scaleY = root.height > 0 ? root.height / STAGE_H : 1;
    return {
      x: (rect.left - root.left + rect.width * 0.5) / scaleX,
      y: (rect.top - root.top + rect.height * 0.5) / scaleY,
    };
  }

  function rectInStage(node) {
    if (!node) return null;
    const rect = node.getBoundingClientRect();
    const root = stage.getBoundingClientRect();
    const scaleX = root.width > 0 ? root.width / STAGE_W : 1;
    const scaleY = root.height > 0 ? root.height / STAGE_H : 1;
    return {
      left: (rect.left - root.left) / scaleX,
      right: (rect.right - root.left) / scaleX,
      top: (rect.top - root.top) / scaleY,
      bottom: (rect.bottom - root.top) / scaleY,
      width: rect.width / scaleX,
      height: rect.height / scaleY,
    };
  }

  function flashBattlefield(heavy = false) {
    const field = battlefield;
    if (!field) return;
    field.classList.remove("flash");
    field.classList.remove("shake-soft");
    field.classList.remove("shake-hard");
    void field.offsetWidth;
    field.classList.add("flash");
    field.classList.add(heavy ? "shake-hard" : "shake-soft");
  }

  function meleeDashDistance(attackerNode, targetNode, team, feel = {}) {
    const attackerRect = rectInStage(attackerNode);
    const targetRect = rectInStage(targetNode);
    if (!attackerRect || !targetRect) return 0;
    const contactGap = clamp(Number.isFinite(feel.contactGap) ? feel.contactGap : 8, -10, 24);
    const dashScale = clamp(Number.isFinite(feel.dashScale) ? feel.dashScale : 1, 0.7, 1.45);
    if (team === "hero") {
      const desired = (targetRect.left - attackerRect.right - contactGap) * dashScale;
      return clamp(desired, 0, STAGE_W * 0.8);
    }
    const desired = (targetRect.right - attackerRect.left + contactGap) * dashScale;
    return clamp(desired, -STAGE_W * 0.8, 0);
  }

  function spawnHitBurst(targetNode, options = {}) {
    const point = pointInRect(targetNode);
    if (!point) return;
    const burstScale = clamp(Number.isFinite(options.impactScale) ? options.impactScale : 1, 0.7, 1.8);
    const burst = document.createElement("div");
    burst.className = "hitBurst";
    if (options.crit) burst.classList.add("crit");
    if (options.ultimate) burst.classList.add("ult");
    if (options.finisher) burst.classList.add("finisher");
    burst.style.setProperty("--burst-scale", `${burstScale}`);
    burst.style.left = `${point.x}px`;
    burst.style.top = `${point.y}px`;
    fxLayer.appendChild(burst);
    setTimeout(() => burst.remove(), 320);

    const shock = document.createElement("div");
    shock.className = "hitShock";
    if (options.ultimate || options.finisher) shock.classList.add("strong");
    shock.style.setProperty("--shock-scale", `${clamp(burstScale * 0.95, 0.7, 1.95)}`);
    shock.style.left = `${point.x}px`;
    shock.style.top = `${point.y}px`;
    fxLayer.appendChild(shock);
    setTimeout(() => shock.remove(), 300);
  }

  function spawnTargetPin(targetNode, options = {}) {
    const point = pointInRect(targetNode);
    if (!point) return () => {};
    const pin = document.createElement("div");
    pin.className = "targetPin";
    if (options.crit) pin.classList.add("crit");
    if (options.ultimate) pin.classList.add("ult");
    if (options.finisher) pin.classList.add("finisher");
    pin.style.left = `${point.x}px`;
    pin.style.top = `${point.y}px`;
    fxLayer.appendChild(pin);
    const ttl = clamp(Number.isFinite(options.duration) ? options.duration : 250, 120, 520);
    const timer = setTimeout(() => pin.remove(), ttl);
    return () => {
      clearTimeout(timer);
      pin.remove();
    };
  }

  function spawnTrail(attackerNode, targetNode, team, variant = "normal", options = {}) {
    const from = pointInRect(attackerNode);
    const to = pointInRect(targetNode);
    if (!from || !to) return;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const shotMs = clamp(Number.isFinite(options.projectileMs) ? options.projectileMs : 100, 56, 220);
    const clearPin = spawnTargetPin(targetNode, { ...options, duration: shotMs + 140 });

    const trail = document.createElement("div");
    trail.className = `trail ${team}`;
    if (variant === "crit") trail.classList.add("crit");
    if (variant === "ult") trail.classList.add("ult");
    trail.style.left = `${from.x}px`;
    trail.style.top = `${from.y}px`;
    trail.style.width = `${clamp(len * 0.56, 26, 120)}px`;
    trail.style.transform = `translateY(-50%) rotate(${angle}rad)`;
    fxLayer.appendChild(trail);
    setTimeout(() => trail.remove(), shotMs + 90);

    const shot = document.createElement("div");
    shot.className = `shotOrb ${team}`;
    if (variant === "crit") shot.classList.add("crit");
    if (variant === "ult") shot.classList.add("ult");
    shot.style.left = `${from.x}px`;
    shot.style.top = `${from.y}px`;
    shot.style.setProperty("--shot-dx", `${dx}px`);
    shot.style.setProperty("--shot-dy", `${dy}px`);
    shot.style.setProperty("--shot-ms", `${shotMs}ms`);
    fxLayer.appendChild(shot);
    requestAnimationFrame(() => shot.classList.add("fly"));
    setTimeout(() => {
      shot.remove();
      clearPin();
    }, shotMs + 150);

    const impact = document.createElement("div");
    impact.className = "impact";
    if (variant === "crit") impact.classList.add("crit");
    if (variant === "ult") impact.classList.add("ult");
    impact.style.left = `${to.x}px`;
    impact.style.top = `${to.y}px`;
    setTimeout(() => {
      fxLayer.appendChild(impact);
      setTimeout(() => impact.remove(), 260);
    }, Math.max(shotMs - 28, 24));
  }

  function floatNumber(node, text, tone = "damage") {
    const point = pointInRect(node);
    if (!point) return;
    const tag = document.createElement("div");
    tag.className = `floatNum ${tone}`;
    tag.style.left = `${point.x}px`;
    tag.style.top = `${point.y}px`;
    tag.textContent = text;
    floatLayer.appendChild(tag);
    setTimeout(() => tag.remove(), 780);
  }

  async function showUltimateCue(hero, attackerNode) {
    if (!hero) return;
    if (battlefield) battlefield.classList.add("ultimate-mode");
    if (attackerNode) attackerNode.classList.add("ultimate-casting");

    if (skillCueLayer) {
      const heroArt = heroVisual(hero.id);
      skillCueLayer.innerHTML = "";
      const cue = document.createElement("div");
      cue.className = "skillCue";
      cue.innerHTML = `<div class="skillCueFlash"></div>
        <div class="skillCueCard">
          <div class="skillCuePortrait">${
            heroArt
              ? `<img class="skillCuePortraitImage" src="${heroArt}" alt="${hero.name}" loading="lazy" />`
              : `<span class="skillCuePortraitIcon">${hero.icon}</span>`
          }</div>
          <div class="skillCueText">
            <div class="skillCueLabel">필살기 발동</div>
            <div class="skillCueName">${hero.name}</div>
            <div class="skillCueRole">${hero.role}</div>
          </div>
        </div>`;
      skillCueLayer.appendChild(cue);
      skillCueLayer.classList.add("show");
      skillCueLayer.setAttribute("aria-hidden", "false");
    }

    await wait(420);

    if (skillCueLayer) {
      skillCueLayer.classList.remove("show");
      skillCueLayer.setAttribute("aria-hidden", "true");
      skillCueLayer.innerHTML = "";
    }
    if (attackerNode) attackerNode.classList.remove("ultimate-casting");
    if (battlefield) battlefield.classList.remove("ultimate-mode");
  }

  async function animateHit(attackerNode, targetNode, team, options = {}) {
    if (!attackerNode || !targetNode) return;
    const variant = options.ultimate ? "ult" : options.crit ? "crit" : "normal";
    const attackStyle = options.attackStyle === "melee" ? "melee" : "ranged";
    const feel = {
      dashScale: 1,
      dashMs: 120,
      lungeMs: 115,
      contactMs: 90,
      recoverMs: 70,
      projectileLeadMs: 90,
      impactHoldMs: 90,
      impactScale: 1,
      shake: 1,
      ...(options.attackFeel || {}),
    };
    const attackerLane = attackerNode.closest(".lane");
    const targetLane = targetNode.closest(".lane");
    const prevAttackerLaneZ = attackerLane ? attackerLane.style.zIndex : "";
    const prevTargetLaneZ = targetLane ? targetLane.style.zIndex : "";
    if (attackerLane) attackerLane.style.zIndex = "6";
    if (targetLane && targetLane !== attackerLane) targetLane.style.zIndex = "3";
    attackerNode.classList.add("acting");
    targetNode.classList.add("targeted");
    targetNode.classList.add("hit-heavy");
    if (options.ultimate) attackerNode.classList.add("ultimate");
    if (options.ultimate) attackerNode.classList.add("ultimate-casting");
    if (options.crit) targetNode.classList.add("critical");
    if (options.ultimate) targetNode.classList.add("ultimate");
    if (options.ultimate) targetNode.classList.add("ultimate-target");
    if (options.finisher) targetNode.classList.add("finisher");
    let clearTargetPin = () => {};
    try {
      if (attackStyle === "melee") {
        clearTargetPin = spawnTargetPin(targetNode, {
          ...options,
          duration: clamp(feel.lungeMs + feel.contactMs + 170, 180, 520),
        });
        const dash = meleeDashDistance(attackerNode, targetNode, team, feel);
        attackerNode.style.setProperty("--dash-x", `${dash}px`);
        attackerNode.style.setProperty("--move-ms", `${clamp(feel.dashMs, 70, 220)}ms`);
        attackerNode.classList.add("dashing");
        await wait(clamp(feel.lungeMs, 70, 200));
        spawnHitBurst(targetNode, { ...options, impactScale: feel.impactScale });
        flashBattlefield(options.finisher || options.ultimate || feel.shake >= 1.2);
        await wait(clamp(feel.contactMs, 55, 170));
        attackerNode.classList.remove("dashing");
        attackerNode.style.removeProperty("--dash-x");
        await wait(clamp(feel.recoverMs, 48, 170));
        attackerNode.style.removeProperty("--move-ms");
      } else {
        const projectileMs = clamp(feel.projectileLeadMs, 56, 170);
        spawnTrail(attackerNode, targetNode, team, variant, { ...options, projectileMs });
        await wait(projectileMs);
        spawnHitBurst(targetNode, { ...options, impactScale: feel.impactScale });
        flashBattlefield(options.finisher || options.ultimate || feel.shake >= 1.2);
        await wait(clamp(feel.impactHoldMs, 56, 170));
      }
    } finally {
      clearTargetPin();
      attackerNode.classList.remove("acting");
      attackerNode.classList.remove("ultimate");
      attackerNode.classList.remove("ultimate-casting");
      targetNode.classList.remove("targeted");
      targetNode.classList.remove("hit-heavy");
      targetNode.classList.remove("critical");
      targetNode.classList.remove("ultimate");
      targetNode.classList.remove("ultimate-target");
      targetNode.classList.remove("finisher");
      if (attackerLane) attackerLane.style.zIndex = prevAttackerLaneZ;
      if (targetLane && targetLane !== attackerLane) targetLane.style.zIndex = prevTargetLaneZ;
    }
  }

  function damageEnemy(enemy, amount, label = "") {
    const aliveBefore = enemy.hp > 0;
    const shieldAbsorb = Math.min(enemy.shield || 0, amount);
    if (shieldAbsorb > 0) enemy.shield -= shieldAbsorb;
    const finalAmount = Math.max(0, amount - shieldAbsorb);
    enemy.hp = Math.max(0, enemy.hp - finalAmount);
    const node = nodeByEnemy(enemy.id);
    if (node) {
      floatNumber(node, `${label}${finalAmount}`, "damage");
      if (shieldAbsorb > 0) floatNumber(node, `보-${shieldAbsorb}`, "shield");
    }
    if (aliveBefore && enemy.hp <= 0) log(`${enemy.name} 처치!`);
  }

  function healEnemy(enemy, amount, label = "+") {
    const prev = enemy.hp;
    enemy.hp = Math.min(enemy.maxHp, enemy.hp + amount);
    const diff = enemy.hp - prev;
    if (diff <= 0) return;
    const node = nodeByEnemy(enemy.id);
    if (node) floatNumber(node, `${label}${diff}`, "heal");
  }

  function damageHero(hero, amount, label = "") {
    const guardedAmount =
      state.teamGuardTurns > 0 && state.teamGuardRate > 0 ? Math.max(1, Math.floor(amount * (1 - state.teamGuardRate))) : amount;
    const shieldAbsorb = Math.min(hero.shield, guardedAmount);
    if (shieldAbsorb > 0) hero.shield -= shieldAbsorb;
    const finalAmount = Math.max(0, guardedAmount - shieldAbsorb);
    hero.hp = Math.max(0, hero.hp - finalAmount);
    if (finalAmount > 0) {
      const onHitEnergy = heroPassiveValue(hero, "onHitEnergy");
      if (onHitEnergy > 0) gainHeroEnergy(hero, onHitEnergy);
    }
    const node = nodeByHero(hero.id);
    if (node) {
      floatNumber(node, `${label}${finalAmount}`, "damage");
      if (shieldAbsorb > 0) floatNumber(node, `보-${shieldAbsorb}`, "shield");
    }
  }

  function healHero(hero, amount, label = "+") {
    const prev = hero.hp;
    hero.hp = Math.min(hero.maxHp, hero.hp + amount);
    const diff = hero.hp - prev;
    if (diff <= 0) return;
    const node = nodeByHero(hero.id);
    if (node) floatNumber(node, `${label}${diff}`, "heal");
  }

  function healParty(amount, source) {
    state.activeHeroes.forEach((hero) => {
      if (hero.hp > 0) healHero(hero, amount, "+");
    });
    log(`${source}: 파티 체력 +${amount}`);
  }

  function shieldParty(amount, source) {
    state.activeHeroes.forEach((hero) => {
      if (hero.hp > 0) hero.shield += amount;
    });
    log(`${source}: 파티 보호막 +${amount}`);
  }

  function processStatusBeforeEnemyTurn() {
    let burnedTargets = 0;
    state.enemies.forEach((enemy) => {
      if (enemy.hp <= 0) return;
      if ((enemy.burnTurns || 0) <= 0) return;
      const damage = Math.max(1, (enemy.burnPower || 0) + state.modifiers.burnBonusFlat);
      damageEnemy(enemy, damage, "🔥");
      burnedTargets += 1;
    });
    if (burnedTargets > 0) log(`화상 피해 적용: ${burnedTargets}명`, true);

    let regenTargets = 0;
    state.activeHeroes.forEach((hero) => {
      if (hero.hp <= 0) return;
      if ((hero.regenTurns || 0) <= 0) return;
      const amount = Math.max(1, (hero.regenPower || 0) + state.modifiers.regenBonusFlat);
      healHero(hero, amount, "+");
      regenTargets += 1;
    });
    if (regenTargets > 0) log(`재생 회복 적용: ${regenTargets}명`, true);
  }

  function decayStatusTurn() {
    state.enemies.forEach((enemy) => {
      if ((enemy.markTurns || 0) > 0) enemy.markTurns -= 1;
      if ((enemy.burnTurns || 0) > 0) {
        enemy.burnTurns -= 1;
        if (enemy.burnTurns <= 0) enemy.burnPower = 0;
      }
      if ((enemy.weakenTurns || 0) > 0) enemy.weakenTurns -= 1;
    });
    state.activeHeroes.forEach((hero) => {
      if ((hero.regenTurns || 0) > 0) hero.regenTurns -= 1;
      if ((hero.regenTurns || 0) <= 0) hero.regenPower = 0;
    });
    if (state.teamGuardTurns > 0) state.teamGuardTurns -= 1;
    if (state.teamGuardTurns <= 0) state.teamGuardRate = 0;
  }

  function applyLifesteal(damage) {
    if (state.modifiers.lifeSteal <= 0) return;
    const heal = Math.floor(damage * state.modifiers.lifeSteal);
    if (heal <= 0) return;
    const target = randomAliveHero();
    if (!target) return;
    healHero(target, heal, "흡+");
  }

  function downedHeroCount() {
    return state.activeHeroes.filter((hero) => hero.hp <= 0).length;
  }

  function moraleBonusAtk() {
    return downedHeroCount() * 2;
  }

  function comboMultiplier() {
    return 1 + Math.min(state.comboStep, 4) * 0.08;
  }

  function heroPassiveValue(hero, effectType) {
    if (!hero || !hero.passiveEffects) return 0;
    const value = hero.passiveEffects[effectType];
    return Number.isFinite(value) ? value : 0;
  }

  function applyHeroDamagePassives(hero, target, damage, { ultimate = false } = {}) {
    let adjusted = Math.max(1, Math.floor(damage * (1 + state.modifiers.skillDamageMult)));
    if (target) {
      if (isFrontEnemy(target)) {
        adjusted = Math.floor(adjusted * (1 + heroPassiveValue(hero, "frontDamage") + heroTraitValue(hero, "frontBurst")));
      }
      if (isBackEnemy(target)) adjusted = Math.floor(adjusted * (1 + heroPassiveValue(hero, "backDamage")));
      if (target.hp <= Math.floor(target.maxHp * 0.4)) {
        adjusted = Math.floor(adjusted * (1 + heroTraitValue(hero, "execute")));
      }
      if ((target.markTurns || 0) > 0 || (target.burnTurns || 0) > 0 || (target.weakenTurns || 0) > 0) {
        adjusted = Math.floor(adjusted * (1 + heroTraitValue(hero, "statusHunter")));
      }
      if ((target.markTurns || 0) > 0) adjusted = Math.floor(adjusted * (1 + 0.12 + state.modifiers.markDamageBonus));
      if ((target.weakenTurns || 0) > 0) adjusted = Math.floor(adjusted * 1.06);
    }
    if (hero && hero.hp <= Math.floor(hero.maxHp * 0.5)) {
      adjusted = Math.floor(adjusted * (1 + heroPassiveValue(hero, "lowHpDamage")));
    }
    if (ultimate) adjusted = Math.floor(adjusted * (1 + heroPassiveValue(hero, "ultDamage")));
    return Math.max(1, adjusted);
  }

  function applyHeroKillPassive(hero, target, aliveBefore) {
    if (!hero || !target || !aliveBefore || target.hp > 0) return;
    const bonus = heroPassiveValue(hero, "killEnergy");
    if (bonus <= 0) return;
    gainHeroEnergy(hero, bonus);
    log(`${hero.name} 패시브 발동: 처치 에너지 +${Math.floor(bonus)}`, true);
  }

  function applyHeroActionSupportPassive(hero) {
    if (!hero || hero.hp <= 0) return;
    const heal = heroPassiveValue(hero, "actionHealLowest");
    if (heal <= 0) return;
    const target = lowestHpHero();
    if (!target) return;
    healHero(target, Math.max(1, Math.floor(heal)), "+");
  }

  function heroFocusMultiplier(hero) {
    const stacks = clamp(hero?.focus || 0, 0, 3);
    return 1 + stacks * 0.05;
  }

  function gainHeroFocus(hero, amount = 1) {
    if (!hero || hero.hp <= 0) return;
    hero.focus = clamp((hero.focus || 0) + amount, 0, 3);
  }

  function gainHeroEnergy(hero, amount) {
    if (!hero || hero.hp <= 0) return;
    const extraFlat = heroPassiveValue(hero, "energyGainFlat");
    const finalAmount = Math.max(1, Math.floor(amount * (1 + state.modifiers.energyGainMult) + extraFlat));
    hero.energy = clamp((hero.energy || 0) + finalAmount, 0, 100);
  }

  function resetHeroEnergy(hero) {
    if (!hero) return;
    hero.energy = 0;
  }

  function relicDamageMultiplier() {
    return 1 + state.modifiers.relicDamageMult;
  }

  async function runHeroUltimate(hero, attackerNode, turnMult, combo, moraleAtk) {
    if (!hero || hero.hp <= 0 || (hero.energy || 0) < 100) return false;
    await showUltimateCue(hero, attackerNode);
    log(`🌟 ${hero.name} 궁극기 발동!`);
    const baseRule = hero.targetRule || "front";
    const attackStyle = attackStyleOfHero(hero);
    const attackFeel = attackFeelOfUnit(hero, "hero");

    if (hero.id === "H1") {
      const target = selectEnemyTarget(baseRule);
      if (!target) return false;
      const targetNode = nodeByEnemy(target.id);
      const raw = Math.max(1, Math.floor((hero.atk + moraleAtk + 2) * 2.1 * combo * turnMult));
      const dmg = applyHeroDamagePassives(hero, target, raw, { ultimate: true });
      const aliveBefore = target.hp > 0;
      await animateHit(attackerNode, targetNode, "hero", { ultimate: true, finisher: target.hp <= dmg, attackStyle, attackFeel });
      damageEnemy(target, dmg, "🌟");
      applyEnemyWeak(target, 2);
      applyHeroKillPassive(hero, target, aliveBefore);
      applyHeroActionSupportPassive(hero);
      resetHeroEnergy(hero);
      return true;
    }

    if (hero.id === "H2") {
      const target = selectEnemyTarget(baseRule);
      if (!target) return false;
      const targetNode = nodeByEnemy(target.id);
      const raw = Math.max(1, Math.floor((hero.atk + moraleAtk) * (1.9 + state.modifiers.critMultBonus) * combo * turnMult));
      const dmg = applyHeroDamagePassives(hero, target, raw, { ultimate: true });
      const aliveBefore = target.hp > 0;
      await animateHit(attackerNode, targetNode, "hero", {
        ultimate: true,
        crit: true,
        finisher: target.hp <= dmg,
        attackStyle,
        attackFeel,
      });
      damageEnemy(target, dmg, "🌟");
      applyEnemyMark(target, 3);
      applyHeroKillPassive(hero, target, aliveBefore);
      applyHeroActionSupportPassive(hero);
      resetHeroEnergy(hero);
      return true;
    }

    if (hero.id === "H3") {
      const targets = aliveEnemies();
      if (targets.length === 0) return false;
      const aoePassive = heroPassiveValue(hero, "aoePower");
      const dmgRaw = Math.max(
        1,
        Math.floor((hero.atk + moraleAtk) * (1.1 + state.modifiers.aoeBonus + aoePassive) * combo * turnMult)
      );
      targets.forEach((enemy) => {
        const enemyNode = nodeByEnemy(enemy.id);
        if (enemyNode) {
          enemyNode.classList.add("targeted");
          if (attackerNode) spawnTrail(attackerNode, enemyNode, "hero", "ult");
        }
      });
      await wait(180);
      targets.forEach((enemy) => {
        const enemyNode = nodeByEnemy(enemy.id);
        if (enemyNode) enemyNode.classList.remove("targeted");
      });
      targets.forEach((enemy) => {
        const aliveBefore = enemy.hp > 0;
        const dmg = applyHeroDamagePassives(hero, enemy, dmgRaw, { ultimate: true });
        const enemyNode = nodeByEnemy(enemy.id);
        if (enemyNode) {
          enemyNode.classList.add("hit-heavy");
          spawnHitBurst(enemyNode, { ultimate: true, impactScale: attackFeel.impactScale });
          setTimeout(() => enemyNode.classList.remove("hit-heavy"), 180);
        }
        damageEnemy(enemy, dmg, "🌟");
        applyEnemyBurn(enemy, 3, Math.max(2, Math.floor(hero.atk * 0.4)));
        applyHeroKillPassive(hero, enemy, aliveBefore);
      });
      flashBattlefield(true);
      applyHeroActionSupportPassive(hero);
      resetHeroEnergy(hero);
      return true;
    }

    if (hero.id === "H4") {
      const target = selectEnemyTarget(baseRule);
      if (!target) return false;
      const targetNode = nodeByEnemy(target.id);
      const raw = Math.max(1, Math.floor((hero.atk + moraleAtk) * 1.2 * combo * turnMult));
      const dmg = applyHeroDamagePassives(hero, target, raw, { ultimate: true });
      const aliveBefore = target.hp > 0;
      await animateHit(attackerNode, targetNode, "hero", { ultimate: true, finisher: target.hp <= dmg, attackStyle, attackFeel });
      damageEnemy(target, dmg, "🌟");
      applyHeroKillPassive(hero, target, aliveBefore);
      shieldParty(10 + state.modifiers.shieldBonus + heroPassiveValue(hero, "shieldPowerFlat"), "수호자 궁극기");
      enableTeamGuard(2, 0.18, "수호자 궁극기");
      applyHeroActionSupportPassive(hero);
      resetHeroEnergy(hero);
      return true;
    }

    if (hero.id === "H5") {
      const target = selectEnemyTarget(baseRule);
      if (!target) return false;
      const targetNode = nodeByEnemy(target.id);
      const raw = Math.max(1, Math.floor((hero.atk + moraleAtk) * 0.95 * combo * turnMult));
      const dmg = applyHeroDamagePassives(hero, target, raw, { ultimate: true });
      const aliveBefore = target.hp > 0;
      await animateHit(attackerNode, targetNode, "hero", { ultimate: true, finisher: target.hp <= dmg, attackStyle, attackFeel });
      damageEnemy(target, dmg, "🌟");
      applyHeroKillPassive(hero, target, aliveBefore);
      healParty(12 + state.modifiers.healBonus + heroPassiveValue(hero, "healPowerFlat"), "치유사 궁극기");
      state.activeHeroes.forEach((ally) => applyHeroRegen(ally, 2, 6));
      applyHeroActionSupportPassive(hero);
      resetHeroEnergy(hero);
      return true;
    }

    if (hero.id === "H6") {
      let target = selectEnemyTarget(baseRule);
      if (!target) return false;
      for (let shot = 0; shot < 3; shot += 1) {
        const node = nodeByEnemy(target.id);
        const raw = Math.max(1, Math.floor((hero.atk + moraleAtk) * (1.12 - shot * 0.12) * combo * turnMult));
        const dmg = applyHeroDamagePassives(hero, target, raw, { ultimate: true });
        const aliveBefore = target.hp > 0;
        await animateHit(attackerNode, node, "hero", { ultimate: true, finisher: target.hp <= dmg, attackStyle, attackFeel });
        damageEnemy(target, dmg, "🌟");
        applyHeroKillPassive(hero, target, aliveBefore);
        gainHeroFocus(hero, 1);
        const next = randomAliveEnemyExcept(target.id);
        if (next) target = next;
      }
      applyHeroActionSupportPassive(hero);
      resetHeroEnergy(hero);
      return true;
    }

    return false;
  }

  function applyRuneSynergy(runes) {
    resetTurnBuff();
    if (!runes || runes.length !== 3) return;

    const counts = {};
    let allTactic = true;
    const heroIdSet = new Set();

    runes.forEach((rune) => {
      counts[rune.id] = (counts[rune.id] || 0) + 1;
      allTactic = allTactic && rune.kind === "tactic";
      if (rune.kind === "hero") heroIdSet.add(rune.id);
    });

    const maxCount = Math.max(...Object.values(counts));

    if (allTactic) {
      state.turnBuff = {
        label: "전술 공명",
        damageMult: 1.1,
        critBonus: 0,
        tacticBonus: 0.28,
      };
      shieldParty(3 + state.modifiers.shieldBonus, "전술 공명");
      healParty(2 + state.modifiers.healBonus, "전술 공명");
      log("전술 공명 발동: 방비/회복 강화");
      return;
    }

    if (maxCount === 3) {
      const matched = runes[0];
      state.turnBuff = {
        label: `삼중 공명 ${matched.icon}`,
        damageMult: 1.35,
        critBonus: matched.kind === "hero" ? 0.12 : 0.05,
        tacticBonus: matched.kind === "tactic" ? 0.12 : 0,
      };
      log(`삼중 공명 발동: ${matched.name}의 힘이 증폭됩니다`);
      return;
    }

    if (maxCount === 2) {
      state.turnBuff = {
        label: "쌍룬 공명",
        damageMult: 1.16,
        critBonus: 0.05,
        tacticBonus: 0.08,
      };
      log("쌍룬 공명 발동");
      return;
    }

    if (heroIdSet.size === 3) {
      state.turnBuff = {
        label: "연계 진형",
        damageMult: 1.08,
        critBonus: 0.08,
        tacticBonus: 0,
      };
      log("연계 진형 발동: 영웅 협력 강화");
    }
  }

  function intentDamage(enemy) {
    const intent = enemy.intent || ENEMY_INTENTS[0];
    return Math.max(1, Math.floor(enemy.atk * intent.mult));
  }

  function intentSummary(enemy) {
    const intent = enemy.intent || ENEMY_INTENTS[0];
    const targetLabel = intent.target === "all" ? "전체" : "단일";
    return `${intent.icon} ${intent.name} ${targetLabel} ${intentDamage(enemy)}`;
  }

  function computeRuneWeights() {
    const weights = { ...BASE_WEIGHTS };
    Object.entries(state.modifiers.runeWeightDelta).forEach(([id, delta]) => {
      weights[id] = Math.max(1, (weights[id] || 1) + delta);
    });

    const activeIds = new Set(state.activeHeroes.map((hero) => hero.id));
    HERO_LIBRARY.forEach((hero) => {
      if (!activeIds.has(hero.id)) weights[hero.id] = 0;
    });

    let removed = 0;
    state.activeHeroes.forEach((hero) => {
      if (hero.hp <= 0) {
        removed += weights[hero.id] || 0;
        weights[hero.id] = 0;
      }
    });

    if (removed > 0) {
      weights.T_ASSIST = (weights.T_ASSIST || 0) + removed * 0.5;
      weights.T_BRACE = (weights.T_BRACE || 0) + removed * 0.5;
    }

    return weights;
  }

  function pickWeighted(weights) {
    const entries = Object.entries(weights).filter(([, value]) => value > 0);
    const total = entries.reduce((sum, [, value]) => sum + value, 0);
    let threshold = Math.random() * total;
    for (const [id, value] of entries) {
      threshold -= value;
      if (threshold <= 0) return id;
    }
    return entries[entries.length - 1][0];
  }

  function runeById(id) {
    const hero = HERO_LIBRARY.find((entry) => entry.id === id);
    if (hero) return { id, icon: hero.icon, name: hero.name, kind: "hero" };
    const tactic = TACTICS.find((entry) => entry.id === id);
    if (tactic) return { id, icon: tactic.icon, name: tactic.name, kind: "tactic" };
    if (id === "S_WILD") return { id: "S_WILD", icon: "✶", name: "와일드 룬", kind: "special" };
    return { id: "T_ASSIST", icon: "🤝", name: "협공", kind: "tactic" };
  }

  function decorateRunesWithSpinEffects(runes) {
    const x2Chance = clamp(state.modifiers.spinDoubleChance || 0, 0, 0.85);
    const rerollChance = clamp(state.modifiers.spinRerollChance || 0, 0, 0.85);
    const specialChance = clamp(state.modifiers.specialRuneChance || 0, 0, 0.65);
    const chargeChance = clamp(state.modifiers.spinChargeChance || 0, 0, 0.6);
    const echoChance = clamp(state.modifiers.spinEchoChance || 0, 0, 0.5);
    const result = runes.map((rune) => ({
      ...rune,
      effects: {
        double: Math.random() < x2Chance,
        reroll: Math.random() < rerollChance,
        charge: Math.random() < chargeChance,
        echo: Math.random() < echoChance,
      },
    }));

    if (Math.random() < specialChance) {
      const index = randInt(result.length);
      result[index] = {
        ...runeById("S_WILD"),
        effects: {
          ...result[index].effects,
          special: true,
        },
      };
    }
    return result;
  }

  function ensurePlayableHeroRunes(runes) {
    const aliveIds = aliveHeroes().map((hero) => hero.id);
    if (aliveIds.length === 0 || !Array.isArray(runes) || runes.length === 0) return runes;
    const minHeroRunes = aliveIds.length <= 2 ? 2 : 1;
    let heroCount = runes.filter((rune) => rune.kind === "hero").length;
    if (heroCount >= minHeroRunes) return runes;

    const nonHeroIndices = runes
      .map((rune, index) => ({ rune, index }))
      .filter((entry) => entry.rune.kind !== "hero")
      .map((entry) => entry.index);

    while (heroCount < minHeroRunes && nonHeroIndices.length > 0) {
      const pick = randInt(nonHeroIndices.length);
      const targetIndex = nonHeroIndices.splice(pick, 1)[0];
      const pickedHeroId = aliveIds[randInt(aliveIds.length)];
      runes[targetIndex] = {
        ...runeById(pickedHeroId),
        effects: { ...(runes[targetIndex]?.effects || {}) },
      };
      heroCount += 1;
    }
    return runes;
  }

  function runeLabelWithEffects(rune) {
    if (!rune) return "?";
    const tags = [];
    if (rune.effects?.double) tags.push("x2");
    if (rune.effects?.reroll) tags.push("↺");
    if (rune.effects?.charge) tags.push("▲");
    if (rune.effects?.echo) tags.push("∞");
    return `${rune.icon}${tags.length > 0 ? `(${tags.join(",")})` : ""}`;
  }

  function rollRunes() {
    const weights = computeRuneWeights();
    const result = [];
    for (let idx = 0; idx < 3; idx += 1) result.push(runeById(pickWeighted(weights)));
    return ensurePlayableHeroRunes(decorateRunesWithSpinEffects(result));
  }

  function setReels(runes, spinning = false) {
    reelEls.forEach((reel, index) => {
      const rune = runes[index];
      reel.innerHTML = "";
      const glyph = document.createElement("span");
      glyph.className = "reelGlyph";
      glyph.textContent = rune ? rune.icon : "?";
      reel.appendChild(glyph);
      if (rune && !spinning) {
        const marks = document.createElement("span");
        marks.className = "reelMarks";
        if (rune.effects?.double) {
          const tag = document.createElement("span");
          tag.className = "reelMark double";
          tag.textContent = "x2";
          marks.appendChild(tag);
        }
        if (rune.effects?.reroll) {
          const tag = document.createElement("span");
          tag.className = "reelMark reroll";
          tag.textContent = "↺";
          marks.appendChild(tag);
        }
        if (rune.effects?.charge) {
          const tag = document.createElement("span");
          tag.className = "reelMark charge";
          tag.textContent = "▲";
          marks.appendChild(tag);
        }
        if (rune.effects?.echo) {
          const tag = document.createElement("span");
          tag.className = "reelMark echo";
          tag.textContent = "∞";
          marks.appendChild(tag);
        }
        if (rune.kind === "special") {
          const tag = document.createElement("span");
          tag.className = "reelMark special";
          tag.textContent = "★";
          marks.appendChild(tag);
        }
        if (marks.childElementCount > 0) reel.appendChild(marks);
      }
      reel.classList.toggle("spinning", spinning);
      reel.classList.toggle("locked", Boolean(rune) && !spinning);
      reel.classList.toggle("empowered", Boolean(rune?.effects?.charge) && !spinning);
    });
  }

  function setResolvingReel(activeIndex = -1) {
    reelEls.forEach((reel, index) => {
      reel.classList.toggle("active", activeIndex >= 0 && index === activeIndex);
      reel.classList.toggle("dimmed", activeIndex >= 0 && index !== activeIndex);
    });
  }

  function setPhase(phase) {
    state.phase = phase;
    const busy = ["spinning", "resolving", "enemy", "reward", "end"].includes(phase);
    btnSpin.disabled = busy;
    btnPause.disabled = busy;
  }

  function renderTopStats() {
    nodePill.textContent = `🗺️ C${state.chapter} ${state.nodeIndex + 1}/${TOTAL_NODES} · ${nodeTypeLabel(state.currentNodeType)}`;
    const hp = state.activeHeroes.reduce((sum, hero) => sum + Math.max(0, hero.hp), 0);
    const max = state.activeHeroes.reduce((sum, hero) => sum + hero.maxHp, 0);
    const readyCount = state.activeHeroes.filter((hero) => hero.hp > 0 && (hero.energy || 0) >= 100).length;
    partyPill.textContent = `❤️ ${hp}/${max}`;
    comboPill.textContent = `⚡ x${comboMultiplier().toFixed(2)} · 🌟 ${readyCount} · 🧿 ${state.relics.length}`;
    if (turnPill) turnPill.textContent = `🎁 ${state.turnBuff.label}`;
    const spinMarks = [];
    if (state.modifiers.spinDoubleChance > 0) spinMarks.push("x2");
    if (state.modifiers.spinRerollChance > 0) spinMarks.push("↺");
    if (state.modifiers.spinChargeChance > 0) spinMarks.push("▲");
    if (state.modifiers.spinEchoChance > 0) spinMarks.push("∞");
    if (state.modifiers.specialRuneChance > 0) spinMarks.push("★");
    const markLabel = spinMarks.length > 0 ? ` · 표식 ${spinMarks.join("/")}` : "";
    rulePill.textContent =
      state.teamGuardTurns > 0
        ? `🎰 룬=행동 · 🛡 ${(state.teamGuardRate * 100).toFixed(0)}%${markLabel}`
        : `🎰 룬=행동 · 🎯 기본타겟 전열${markLabel}`;
  }

  function makeStatusDot(icon, label) {
    const dot = document.createElement("span");
    dot.className = "statusDot";
    dot.textContent = icon;
    dot.title = label;
    dot.setAttribute("aria-label", label);
    return dot;
  }

  function renderHeroes() {
    heroLane.innerHTML = "";
    state.activeHeroes.forEach((hero, index) => {
      const card = document.createElement("div");
      card.className = `unit hero${hero.hp <= 0 ? " dead" : ""}`;
      card.dataset.heroId = hero.id;
      const heroArt = heroVisual(hero.id);

      const hpBar = document.createElement("div");
      hpBar.className = "hpBar";
      const hpFill = document.createElement("div");
      hpFill.className = "hpFill";
      const ratio = clamp(hero.hp / hero.maxHp, 0, 1);
      hpFill.style.width = `${ratio * 100}%`;
      if (ratio < 0.3) hpFill.classList.add("low");
      hpBar.appendChild(hpFill);

      const portrait = document.createElement("div");
      portrait.className = "unitPortrait";
      portrait.title = `${hero.name} ${Math.max(0, hero.hp)}/${hero.maxHp}`;
      portrait.innerHTML = heroArt
        ? `<img class="unitPortraitImage" src="${heroArt}" alt="${hero.name}" loading="lazy" />`
        : `<span class="unitPortraitIcon">${hero.icon}</span>`;
      if (heroArt) {
        const badge = document.createElement("span");
        badge.className = "heroSymbolBadge";
        badge.textContent = hero.icon;
        badge.title = `${hero.name} 스핀 심볼`;
        badge.setAttribute("aria-label", badge.title);
        portrait.appendChild(badge);
      }

      const statusRow = document.createElement("div");
      statusRow.className = "statusDots";
      if ((hero.focus || 0) > 0) statusRow.appendChild(makeStatusDot("🎯", `집중 ${hero.focus}`));
      if ((hero.regenTurns || 0) > 0) statusRow.appendChild(makeStatusDot("💧", `재생 ${hero.regenTurns}턴`));
      if ((hero.shield || 0) > 0) statusRow.appendChild(makeStatusDot("🛡", `보호막 ${hero.shield}`));
      if (state.teamGuardTurns > 0) statusRow.appendChild(makeStatusDot("🧱", `피해 감소 ${state.teamGuardTurns}턴`));
      if (statusRow.childElementCount === 0) statusRow.appendChild(makeStatusDot("·", "상태 없음"));

      const ultBar = document.createElement("div");
      ultBar.className = `ultBar${(hero.energy || 0) >= 100 ? " ready" : ""}`;
      const ultFill = document.createElement("div");
      ultFill.className = "ultFill";
      ultFill.style.width = `${clamp((hero.energy || 0) / 100, 0, 1) * 100}%`;
      ultBar.appendChild(ultFill);

      card.appendChild(hpBar);
      card.appendChild(portrait);
      card.appendChild(statusRow);
      card.appendChild(ultBar);
      heroLane.appendChild(card);
    });
  }

  function renderEnemies() {
    enemyLane.innerHTML = "";
    state.enemies.forEach((enemy) => {
      const card = document.createElement("div");
      card.className = `unit enemy${enemy.hp <= 0 ? " dead" : ""}${enemy.id.startsWith("BOSS_") ? " boss" : ""}${
        enemy.enraged ? " rage" : ""
      }${enemy.elite ? " elite" : ""}`;
      card.dataset.enemyId = enemy.id;
      const enemyArt = enemyVisual(enemy.artKey);

      const hpBar = document.createElement("div");
      hpBar.className = "hpBar";
      const hpFill = document.createElement("div");
      hpFill.className = "hpFill";
      const ratio = clamp(enemy.hp / enemy.maxHp, 0, 1);
      hpFill.style.width = `${ratio * 100}%`;
      if (ratio < 0.3) hpFill.classList.add("low");
      hpBar.appendChild(hpFill);

      const portrait = document.createElement("div");
      portrait.className = "unitPortrait";
      portrait.title = `${enemy.name} ${Math.max(0, enemy.hp)}/${enemy.maxHp}`;
      portrait.innerHTML = enemyArt
        ? `<img class="unitPortraitImage" src="${enemyArt}" alt="${enemy.name}" loading="lazy" />`
        : `<span class="unitPortraitIcon">${enemy.icon}</span>`;

      const statusRow = document.createElement("div");
      statusRow.className = "statusDots";
      if ((enemy.markTurns || 0) > 0) statusRow.appendChild(makeStatusDot("🎯", `표식 ${enemy.markTurns}턴`));
      if ((enemy.burnTurns || 0) > 0) statusRow.appendChild(makeStatusDot("🔥", `화상 ${enemy.burnTurns}턴`));
      if ((enemy.weakenTurns || 0) > 0) statusRow.appendChild(makeStatusDot("🕸", `약화 ${enemy.weakenTurns}턴`));
      if (statusRow.childElementCount === 0) statusRow.appendChild(makeStatusDot("·", "상태 없음"));

      const line3 = document.createElement("div");
      line3.className = "intentDot";
      line3.textContent = `${enemy.intent?.icon || "⚔"}`;
      line3.title = `의도 ${intentSummary(enemy)} · 타겟 ${targetRuleShort(enemy.targetRule || "front")}`;
      line3.setAttribute("aria-label", line3.title);

      card.appendChild(hpBar);
      card.appendChild(portrait);
      card.appendChild(statusRow);
      card.appendChild(line3);
      enemyLane.appendChild(card);
    });
  }

  function renderSide() {
    if (collectionStat) collectionStat.textContent = `${heroOwnedCount()} / ${HERO_LIBRARY.length}`;
    if (activeStat) activeStat.textContent = `${state.activeHeroes.length} / ${MAX_ACTIVE}`;

    if (perkList) {
      perkList.innerHTML = "";
      if (state.perks.length === 0) {
        appendEmptyToken(perkList, "없음");
      } else {
        const shown = state.perks.slice(0, 8);
        shown.forEach((perk) => {
          perkList.appendChild(makeIconToken({ icon: perk.icon, label: perk.name, tone: "perk" }));
        });
        if (state.perks.length > shown.length) {
          perkList.appendChild(
            makeIconToken({
              icon: "➕",
              label: `추가 특성 ${state.perks.length - shown.length}개`,
              tone: "perk",
              badge: state.perks.length - shown.length,
            })
          );
        }
      }
    }

    if (relicList) {
      relicList.innerHTML = "";
      if (state.relics.length === 0) {
        appendEmptyToken(relicList, "없음");
      } else {
        state.relics.forEach((relic) => {
          relicList.appendChild(makeIconToken({ icon: relic.icon, label: relic.name, tone: "relic" }));
        });
      }
    }
  }

  function renderAll() {
    applyBattlefieldVisual();
    renderTopStats();
    renderHeroes();
    renderEnemies();
    renderSide();
  }

  async function runHeroAction(hero, options = {}) {
    if (!hero || hero.hp <= 0) return;
    const attackerNode = nodeByHero(hero.id);
    const target = selectEnemyTarget(hero.targetRule || "front");
    if (!target) return;
    const targetNode = nodeByEnemy(target.id);
    const combo = comboMultiplier();
    const attackStyle = attackStyleOfHero(hero);
    const attackFeel = attackFeelOfUnit(hero, "hero");
    const powerMult = clamp(Number.isFinite(options.powerMult) ? options.powerMult : 1, 0.35, 3);
    const turnMult = (state.turnBuff.damageMult || 1) * powerMult;
    const relicMult = relicDamageMultiplier();
    const moraleAtk = moraleBonusAtk();

    const usedUltimate = await runHeroUltimate(hero, attackerNode, turnMult * relicMult, combo, moraleAtk);
    if (usedUltimate) return;

    if (hero.id === "H3") {
      const aoePassive = heroPassiveValue(hero, "aoePower");
      const dmg = Math.max(
        1,
        Math.floor((hero.atk + moraleAtk) * (0.55 + state.modifiers.aoeBonus + aoePassive) * combo * turnMult * relicMult)
      );
      if (attackerNode) attackerNode.classList.add("acting");
      const currentTargets = aliveEnemies();
      currentTargets.forEach((enemy) => {
        const enemyNode = nodeByEnemy(enemy.id);
        if (enemyNode) {
          enemyNode.classList.add("targeted");
          if (attackerNode) spawnTrail(attackerNode, enemyNode, "hero");
        }
      });
      await wait(150);
      if (attackerNode) attackerNode.classList.remove("acting");
      currentTargets.forEach((enemy) => {
        const enemyNode = nodeByEnemy(enemy.id);
        if (enemyNode) enemyNode.classList.remove("targeted");
      });
      aliveEnemies().forEach((enemy) => {
        const aliveBefore = enemy.hp > 0;
        const adjusted = applyHeroDamagePassives(hero, enemy, dmg);
        const enemyNode = nodeByEnemy(enemy.id);
        if (enemyNode) {
          enemyNode.classList.add("hit-heavy");
          spawnHitBurst(enemyNode, { impactScale: attackFeel.impactScale });
          setTimeout(() => enemyNode.classList.remove("hit-heavy"), 180);
        }
        damageEnemy(enemy, adjusted, `${hero.icon}`);
        applyEnemyBurn(enemy, 2, Math.max(2, Math.floor(hero.atk * 0.24)));
        applyHeroKillPassive(hero, enemy, aliveBefore);
      });
      flashBattlefield(false);
      applyLifesteal(dmg);
      log(`${hero.name}의 비전 폭발 (${dmg}씩)`);
      gainHeroEnergy(hero, 36);
      applyHeroActionSupportPassive(hero);
      return;
    }

    if (hero.id === "H4") {
      const raw = Math.max(1, Math.floor((hero.atk + moraleAtk) * 0.72 * combo * turnMult * relicMult));
      const dmg = applyHeroDamagePassives(hero, target, raw);
      const aliveBefore = target.hp > 0;
      const finisher = target.hp <= dmg;
      await animateHit(attackerNode, targetNode, "hero", { finisher, attackStyle, attackFeel });
      damageEnemy(target, dmg, "🛡");
      applyHeroKillPassive(hero, target, aliveBefore);
      shieldParty(4 + state.modifiers.shieldBonus + heroPassiveValue(hero, "shieldPowerFlat"), "수호 태세");
      enableTeamGuard(1, 0.12, "수호 태세");
      log(`${hero.name}이 타격 후 방어 태세를 전개합니다`);
      gainHeroEnergy(hero, 36);
      applyHeroActionSupportPassive(hero);
      return;
    }

    if (hero.id === "H5") {
      const raw = Math.max(1, Math.floor((hero.atk + moraleAtk) * 0.65 * combo * turnMult * relicMult));
      const dmg = applyHeroDamagePassives(hero, target, raw);
      const aliveBefore = target.hp > 0;
      const finisher = target.hp <= dmg;
      await animateHit(attackerNode, targetNode, "hero", { finisher, attackStyle, attackFeel });
      damageEnemy(target, dmg, "✨");
      applyHeroKillPassive(hero, target, aliveBefore);
      healParty(5 + state.modifiers.healBonus + heroPassiveValue(hero, "healPowerFlat") + heroTraitValue(hero, "healBoostFlat"), "치유");
      state.activeHeroes.forEach((ally) => applyHeroRegen(ally, 2, 3));
      log(`${hero.name}이 파티를 회복시켰습니다`);
      gainHeroEnergy(hero, 36);
      applyHeroActionSupportPassive(hero);
      return;
    }

    let damage = hero.atk + state.modifiers.atkFlat + moraleAtk;
    let crit = false;
    if (hero.id === "H2") {
      const chance = clamp(
        0.2 + state.modifiers.critBonus + (state.turnBuff.critBonus || 0) + heroPassiveValue(hero, "critChance"),
        0,
        0.95
      );
      crit = Math.random() < chance;
      const multiplier = 1.2 + state.modifiers.critMultBonus + heroPassiveValue(hero, "critMult") + (crit ? 0.4 : 0);
      damage = Math.max(1, Math.floor(damage * multiplier));
    }
    if (hero.id === "H6") {
      damage = Math.floor(damage * heroFocusMultiplier(hero));
    }
    damage = Math.max(1, Math.floor(damage * combo * turnMult * relicMult));
    damage = applyHeroDamagePassives(hero, target, damage);

    const aliveBefore = target.hp > 0;
    const finisher = target.hp <= damage;
    await animateHit(attackerNode, targetNode, "hero", { crit, finisher, attackStyle, attackFeel });
    damageEnemy(target, damage, hero.id === "H6" ? "🏹" : hero.icon);
    if (hero.id === "H2") applyEnemyMark(target, 2);
    if (hero.id === "H1") applyEnemyWeak(target, 1);
    applyHeroKillPassive(hero, target, aliveBefore);
    applyLifesteal(damage);
    log(`${hero.name}${crit ? " 치명타" : ""} → ${target.name} (-${damage})`);
    gainHeroEnergy(hero, 34);
    if (hero.id === "H6") gainHeroFocus(hero, 1);

    if (
      hero.id === "H6" &&
      Math.random() < state.modifiers.extraShotChance + heroPassiveValue(hero, "extraShot") + heroTraitValue(hero, "extraShot") &&
      aliveEnemies().length > 0
    ) {
      const extraTarget = selectEnemyTarget(hero.targetRule || "front");
      if (extraTarget) {
        const extraNode = nodeByEnemy(extraTarget.id);
        const rawExtra = Math.max(1, Math.floor(damage * 0.65));
        const extraDamage = applyHeroDamagePassives(hero, extraTarget, rawExtra);
        const extraAliveBefore = extraTarget.hp > 0;
        const extraFinish = extraTarget.hp <= extraDamage;
        await animateHit(attackerNode, extraNode, "hero", { finisher: extraFinish, attackStyle, attackFeel });
        damageEnemy(extraTarget, extraDamage, "⚡");
        applyHeroKillPassive(hero, extraTarget, extraAliveBefore);
        applyLifesteal(extraDamage);
        gainHeroFocus(hero, 1);
        log(`${hero.name} 추가 사격 → ${extraTarget.name} (-${extraDamage})`);
      }
    }

    if (hero.id === "H1" && isFrontEnemy(target)) {
      const splashTarget = randomAliveEnemyExcept(target.id);
      if (splashTarget) {
        const splashNode = nodeByEnemy(splashTarget.id);
        const splashDamage = Math.max(1, Math.floor(damage * 0.38));
        await animateHit(attackerNode, splashNode, "hero", { attackStyle, attackFeel });
        damageEnemy(splashTarget, splashDamage, "⚔");
      }
    }
    applyHeroActionSupportPassive(hero);
  }

  async function runTacticAction(tacticId, options = {}) {
    const powerMult = clamp(Number.isFinite(options.powerMult) ? options.powerMult : 1, 0.35, 3);
    if (tacticId === "T_BRACE") {
      const alive = aliveHeroes();
      alive.forEach((hero) => {
        const node = nodeByHero(hero.id);
        if (node) node.classList.add("targeted");
      });
      await wait(120);
      alive.forEach((hero) => {
        const node = nodeByHero(hero.id);
        if (node) node.classList.remove("targeted");
      });
      shieldParty(Math.max(1, Math.floor((4 + state.modifiers.shieldBonus) * powerMult)), "방비");
      healParty(Math.max(1, Math.floor((3 + state.modifiers.healBonus) * powerMult)), "방비");
      enableTeamGuard(1, 0.1 + Math.max(0, (powerMult - 1) * 0.05), "방비");
      return;
    }

    const hero = randomAliveHero();
    const enemy = selectEnemyTarget("front");
    if (!hero || !enemy) return;
    const heroNode = nodeByHero(hero.id);
    const enemyNode = nodeByEnemy(enemy.id);
    const supportStyle = attackStyleOfHero(hero);
    const supportFeel = attackFeelOfUnit(hero, "hero");
    const turnMult = state.turnBuff.damageMult || 1;
    const relicMult = relicDamageMultiplier();
    const damage = Math.max(
      1,
      Math.floor(
        (hero.atk + state.modifiers.atkFlat + moraleBonusAtk()) *
          (0.7 + state.modifiers.tacticBonus + (state.turnBuff.tacticBonus || 0)) *
          comboMultiplier() *
          turnMult *
          relicMult *
          powerMult
      )
    );
    const markedRate = (enemy.markTurns || 0) > 0 ? 1 + state.modifiers.markDamageBonus : 1;
    const finalDamage = Math.max(1, Math.floor(damage * markedRate));
    const finisher = enemy.hp <= finalDamage;
    await animateHit(heroNode, enemyNode, "hero", { finisher, attackStyle: supportStyle, attackFeel: supportFeel });
    damageEnemy(enemy, finalDamage, "🤝");
    applyLifesteal(finalDamage);
    log(`협공 발동: ${hero.name} → ${enemy.name} (-${finalDamage})`);
    gainHeroEnergy(hero, 18);
  }

  async function runSpecialRuneAction(rune, options = {}) {
    if (!rune || rune.id !== "S_WILD") return;
    const candidates = aliveHeroes().sort((left, right) => right.atk - left.atk);
    const picked = candidates[0];
    if (!picked) {
      log("✶ 와일드 룬이 발동했지만 행동 가능한 영웅이 없습니다.", true);
      return;
    }
    log(`✶ 와일드 룬 발동: ${picked.name} 추가 행동`);
    const prev = state.modifiers.skillDamageMult;
    const powerMult = clamp(Number.isFinite(options.powerMult) ? options.powerMult : 1, 0.35, 3);
    state.modifiers.skillDamageMult += 0.25 * powerMult;
    await runHeroAction(picked, { powerMult });
    state.modifiers.skillDamageMult = prev;
  }

  async function resolveRune(rune, options = {}) {
    if (aliveEnemies().length === 0) return;
    const allowEcho = options.allowEcho !== false;
    let powerMult = clamp(Number.isFinite(options.powerMult) ? options.powerMult : 1, 0.35, 3);
    if (rune?.effects?.charge) {
      powerMult *= 1.35;
      log(`▲ 과충전 표식: ${rune.name} 위력 강화`, true);
    }

    if (rune.kind === "special") {
      await runSpecialRuneAction(rune, { powerMult });
      if (allowEcho && rune?.effects?.echo && aliveEnemies().length > 0) {
        log(`∞ 메아리 표식: ${rune.name} 잔향 발동`, true);
        await runSpecialRuneAction(rune, { powerMult: powerMult * 0.6 });
      }
      return;
    }
    if (rune.kind === "tactic") {
      await runTacticAction(rune.id, { powerMult });
      if (allowEcho && rune?.effects?.echo && aliveEnemies().length > 0) {
        log(`∞ 메아리 표식: ${rune.name} 보조 발동`, true);
        await runTacticAction(rune.id, { powerMult: powerMult * 0.6 });
      }
      return;
    }

    const hero = state.activeHeroes.find((entry) => entry.id === rune.id);
    if (!hero || hero.hp <= 0) {
      log(`${rune.icon} ${rune.name} 룬은 현재 발동할 수 없습니다`, true);
      return;
    }
    await runHeroAction(hero, { powerMult });
    if (allowEcho && rune?.effects?.echo && aliveEnemies().length > 0) {
      log(`∞ 메아리 표식: ${hero.name} 후속 공격`, true);
      await runHeroAction(hero, { powerMult: powerMult * 0.6 });
    }
  }

  async function enemyTurn() {
    setPhase("enemy");
    const enemies = aliveEnemies();
    if (enemies.length === 0) return;
    log("적 턴 시작");
    for (const enemy of enemies) {
      if (enemy.id.startsWith("BOSS_") && !enemy.enraged && enemy.hp <= Math.floor(enemy.maxHp * 0.5)) {
        enemy.enraged = true;
        enemy.atk += 2;
        enemy.shield += 8;
        log(`${enemy.name}가 격노했습니다! (공격 상승 + 보호막)`);
      }

      const intent = enemy.intent || rollEnemyIntent(state.nodeIndex, enemy.id.startsWith("BOSS_"));
      const attackerNode = nodeByEnemy(enemy.id);
      const enemyAttackStyle = attackStyleOfEnemy(enemy);
      const enemyAttackFeel = attackFeelOfUnit(enemy, "enemy");
      const weakRate = (enemy.weakenTurns || 0) > 0 ? 0.82 : 1;
      const damage = Math.max(1, Math.floor(intentDamage(enemy) * weakRate));
      log(`${enemy.name} 의도 실행: ${intent.icon} ${intent.name}`);

      if (intent.target === "all") {
        const targets = aliveHeroes();
        for (const target of targets) {
          const targetNode = nodeByHero(target.id);
          const finisher = target.hp <= damage;
          await animateHit(attackerNode, targetNode, "enemy", {
            finisher,
            attackStyle: enemyAttackStyle,
            attackFeel: enemyAttackFeel,
          });
          damageHero(target, damage, "💢");
          renderAll();
          await wait(70);
        }
      } else {
        const target = selectHeroTarget(enemy.targetRule || "front");
        if (!target) return;
        const targetNode = nodeByHero(target.id);
        const finisher = target.hp <= damage;
        await animateHit(attackerNode, targetNode, "enemy", {
          finisher,
          attackStyle: enemyAttackStyle,
          attackFeel: enemyAttackFeel,
        });
        damageHero(target, damage, "💢");
      }

      if (intent.selfShield) {
        enemy.shield += intent.selfShield;
        log(`${enemy.name} 보호막 +${intent.selfShield}`);
      }
      if (intent.healRate) {
        const heal = Math.max(1, Math.floor(damage * intent.healRate));
        healEnemy(enemy, heal, "흡+");
        log(`${enemy.name} 흡수 회복 +${heal}`);
      }

      enemy.intent = rollEnemyIntent(state.nodeIndex, enemy.id.startsWith("BOSS_"));
      renderAll();
      await wait(100);
    }
  }

  function hasLost() {
    return aliveHeroes().length === 0;
  }

  function hasWonBattle() {
    return aliveEnemies().length === 0;
  }

  function applyPerk(effect) {
    if (effect.type === "atk") state.modifiers.atkFlat += effect.value;
    if (effect.type === "crit") state.modifiers.critBonus += effect.value;
    if (effect.type === "critMult") state.modifiers.critMultBonus += effect.value;
    if (effect.type === "aoe") state.modifiers.aoeBonus += effect.value;
    if (effect.type === "heal") state.modifiers.healBonus += effect.value;
    if (effect.type === "shield") state.modifiers.shieldBonus += effect.value;
    if (effect.type === "tactic") state.modifiers.tacticBonus += effect.value;
    if (effect.type === "lifesteal") state.modifiers.lifeSteal += effect.value;
    if (effect.type === "rapid") state.modifiers.extraShotChance += effect.value;
    if (effect.type === "relicDmg") state.modifiers.relicDamageMult += effect.value;
    if (effect.type === "relicEnergy") state.modifiers.energyGainMult += effect.value;
    if (effect.type === "relicGuard") state.modifiers.relicGuardFlat += effect.value;
    if (effect.type === "skillDmg") state.modifiers.skillDamageMult += effect.value;
    if (effect.type === "markDmg") state.modifiers.markDamageBonus += effect.value;
    if (effect.type === "burnPower") state.modifiers.burnBonusFlat += effect.value;
    if (effect.type === "regenPower") state.modifiers.regenBonusFlat += effect.value;
    if (effect.type === "guardRate") state.modifiers.guardRateBonus += effect.value;
    if (effect.type === "spinDouble") state.modifiers.spinDoubleChance += effect.value;
    if (effect.type === "spinReroll") state.modifiers.spinRerollChance += effect.value;
    if (effect.type === "specialRune") state.modifiers.specialRuneChance += effect.value;
    if (effect.type === "spinCharge") state.modifiers.spinChargeChance += effect.value;
    if (effect.type === "spinEcho") state.modifiers.spinEchoChance += effect.value;
    if (effect.type === "weight") {
      state.modifiers.runeWeightDelta[effect.id] = (state.modifiers.runeWeightDelta[effect.id] || 0) + effect.value;
    }
  }

  function grantMetaShards(amount, reason) {
    if (!Number.isFinite(amount) || amount <= 0) return;
    const chapterBonus = chapterConfig(state.chapter).shardMult || 1;
    const gained = Math.max(1, Math.floor(amount * chapterBonus));
    state.meta.shards += gained;
    state.runMetaGain += gained;
    saveMeta(state.meta);
    log(`${reason} (획득 ${gained})`);
  }

  function metaUpgradeCost(type) {
    const level = state.meta.upgrades[type] || 0;
    const base = type === "tactic" ? 13 : 10;
    return base + level * 7;
  }

  function tryBuyMetaUpgrade(type) {
    const level = state.meta.upgrades[type] || 0;
    if (level >= 5) return false;
    const cost = metaUpgradeCost(type);
    if (state.meta.shards < cost) return false;
    state.meta.shards -= cost;
    state.meta.upgrades[type] += 1;
    saveMeta(state.meta);
    return true;
  }

  function pullHero(guaranteeSrPlus = false) {
    const pool = guaranteeSrPlus ? HERO_LIBRARY.filter((hero) => hero.rarity !== "R") : HERO_LIBRARY;
    const activePool = pool.length > 0 ? pool : HERO_LIBRARY;
    const totalWeight = activePool.reduce((sum, hero) => sum + (hero.summonWeight || 1), 0);
    let threshold = Math.random() * totalWeight;
    for (const hero of activePool) {
      threshold -= hero.summonWeight || 1;
      if (threshold <= 0) return hero;
    }
    return activePool[activePool.length - 1];
  }

  function summonRateSummary() {
    const totals = { R: 0, SR: 0, SSR: 0 };
    let sum = 0;
    HERO_LIBRARY.forEach((hero) => {
      const weight = hero.summonWeight || 1;
      sum += weight;
      totals[rarityLabel(hero.rarity)] += weight;
    });
    if (sum <= 0) return "확률 정보 없음";
    const percent = (value) => `${((value / sum) * 100).toFixed(1)}%`;
    return `확률: R ${percent(totals.R)} · SR ${percent(totals.SR)} · SSR ${percent(totals.SSR)}`;
  }

  function tryHeroSummon() {
    if (state.meta.shards < HERO_PULL_COST) return { ok: false, reason: "결정 부족" };
    const pity = clamp(Number(state.meta.summonPity) || 0, 0, 99);
    const guaranteeSrPlus = pity >= 9;
    const hero = pullHero(guaranteeSrPlus);
    const progress = heroProgress(hero.id);
    const duplicate = progress.owned;
    const gainFragments = duplicate ? (hero.rarity === "SSR" ? 7 : 6) : 5;

    state.meta.shards -= HERO_PULL_COST;
    progress.owned = true;
    progress.level = clamp(progress.level || 1, 1, MAX_HERO_LEVEL);
    progress.fragments = clamp((progress.fragments || 0) + gainFragments, 0, 999);
    progress.pulls = clamp((progress.pulls || 0) + 1, 0, 9999);
    state.meta.roster[hero.id] = progress;
    state.meta.summonPity = hero.rarity === "R" ? clamp(pity + 1, 0, 99) : 0;
    state.meta.lastSummon = {
      heroId: hero.id,
      duplicate,
      gainFragments,
      at: Date.now(),
    };

    saveMeta(state.meta);
    return {
      ok: true,
      hero,
      duplicate,
      gainFragments,
      guaranteeSrPlus,
    };
  }

  function tryHeroLevelUp(heroId) {
    const hero = heroById(heroId);
    if (!hero) return { ok: false };
    const progress = heroProgress(heroId);
    if (!progress.owned) return { ok: false };
    if (progress.level >= MAX_HERO_LEVEL) return { ok: false };

    const needFragments = heroLevelCostFragments(progress.level);
    const needShards = heroLevelCostShards(progress.level);
    if (progress.fragments < needFragments) return { ok: false };
    if (state.meta.shards < needShards) return { ok: false };

    progress.fragments -= needFragments;
    state.meta.shards -= needShards;
    progress.level += 1;
    state.meta.roster[heroId] = progress;
    saveMeta(state.meta);
    return { ok: true, hero, level: progress.level };
  }

  function makeRewardOptions() {
    const options = [];
    const ownedPerkIds = new Set(state.perks.map((perk) => perk.id).filter(Boolean));
    const progressRate = state.nodeIndex / Math.max(1, TOTAL_NODES - 1);
    const eliteReward = state.currentNodeType === "elite";
    const ownedRelics = new Set(state.relics.map((relic) => relic.id));
    const relicPool = RELIC_LIBRARY.filter((relic) => !ownedRelics.has(relic.id));
    const relicChance = eliteReward ? 0.9 : 0.45 + progressRate * 0.35;
    if (relicPool.length > 0 && Math.random() < relicChance) {
      const relic = relicPool[randInt(relicPool.length)];
      options.push({
        id: `relic_${relic.id}`,
        icon: relic.icon,
        title: `유물: ${relic.name}`,
        desc: relic.desc,
        apply: () => {
          relic.apply();
          state.relics.push({ id: relic.id, icon: relic.icon, name: relic.name });
          log(`유물 획득: ${relic.name}`);
        },
      });
    }

    const perkPool = [
      {
        id: "perk_blade",
        icon: "⚔",
        title: "날 선 강철",
        desc: "파티 공격 +2.",
        apply: () => applyPerk({ type: "atk", value: 2 }),
        perkTag: { icon: "⚔", name: "공격 +2" },
      },
      {
        id: "perk_focus",
        icon: "🎯",
        title: "예리한 집중",
        desc: "치명타 확률 +10%.",
        apply: () => applyPerk({ type: "crit", value: 0.1 }),
        perkTag: { icon: "🎯", name: "치명타 +10%" },
      },
      {
        id: "perk_arc",
        icon: "🔮",
        title: "비전 메아리",
        desc: "광역 효율 +20%.",
        apply: () => applyPerk({ type: "aoe", value: 0.2 }),
        perkTag: { icon: "🔮", name: "광역 +20%" },
      },
      {
        id: "perk_ward",
        icon: "🧱",
        title: "암석 방호",
        desc: "보호막 효과 +2.",
        apply: () => applyPerk({ type: "shield", value: 2 }),
        perkTag: { icon: "🧱", name: "보호막 +2" },
      },
      {
        id: "perk_flow",
        icon: "🤝",
        title: "전술 흐름",
        desc: "협공/방비 위력 +15%.",
        apply: () => applyPerk({ type: "tactic", value: 0.15 }),
        perkTag: { icon: "🤝", name: "전술 +15%" },
      },
      {
        id: "perk_vamp",
        icon: "🩸",
        title: "붉은 낙인",
        desc: "흡혈 +8%.",
        apply: () => applyPerk({ type: "lifesteal", value: 0.08 }),
        perkTag: { icon: "🩸", name: "흡혈 +8%" },
      },
      {
        id: "perk_rapid",
        icon: "⚡",
        title: "연쇄 속사",
        desc: "궁수 추가 사격 확률 +20%.",
        apply: () => applyPerk({ type: "rapid", value: 0.2 }),
        perkTag: { icon: "⚡", name: "속사 +20%" },
      },
      {
        id: "perk_precise",
        icon: "🗡",
        title: "약점 추적",
        desc: "치명타 피해 배율 +18%.",
        apply: () => applyPerk({ type: "critMult", value: 0.18 }),
        perkTag: { icon: "🗡", name: "치피 +18%" },
      },
      {
        id: "perk_patch",
        icon: "💚",
        title: "전장 응급처치",
        desc: "출전 영웅 전체 체력 +12.",
        apply: () => healParty(12, "전장 응급처치"),
      },
      {
        id: "perk_revive",
        icon: "🕯",
        title: "재정비",
        desc: "전투 불능 영웅 1명을 체력 40%로 부활.",
        apply: () => {
          const downed = state.activeHeroes.filter((hero) => hero.hp <= 0);
          if (downed.length === 0) {
            healParty(6, "재정비");
            return;
          }
          const target = downed[randInt(downed.length)];
          target.hp = Math.max(1, Math.floor(target.maxHp * 0.4));
          target.shield = 0;
          target.energy = 35;
          log(`${target.name} 부활!`);
        },
      },
      {
        id: "perk_skill_core",
        icon: "🧠",
        title: "스킬 코어",
        desc: "영웅 스킬 피해 +12%.",
        apply: () => applyPerk({ type: "skillDmg", value: 0.12 }),
        perkTag: { icon: "🧠", name: "스킬 +12%" },
      },
      {
        id: "perk_mark_hunt",
        icon: "🎯",
        title: "표식 사냥",
        desc: "표식 대상 추가 피해 +18%.",
        apply: () => applyPerk({ type: "markDmg", value: 0.18 }),
        perkTag: { icon: "🎯", name: "표식 피해 +18%" },
      },
      {
        id: "perk_burn_engine",
        icon: "🔥",
        title: "화염 증폭",
        desc: "화상 지속 피해 +3.",
        apply: () => applyPerk({ type: "burnPower", value: 3 }),
        perkTag: { icon: "🔥", name: "화상 +3" },
      },
      {
        id: "perk_guard_line",
        icon: "🛡",
        title: "수호 전열",
        desc: "피해 감소 효과 +10%.",
        apply: () => applyPerk({ type: "guardRate", value: 0.1 }),
        perkTag: { icon: "🛡", name: "가드 +10%" },
      },
      {
        id: "perk_renewal",
        icon: "💧",
        title: "재생 회로",
        desc: "재생 회복량 +3.",
        apply: () => applyPerk({ type: "regenPower", value: 3 }),
        perkTag: { icon: "💧", name: "재생 +3" },
      },
      {
        id: "perk_spin_x2",
        group: "spin",
        icon: "✖",
        title: "x2 표식",
        desc: "심볼에 x2 표식 부착 확률 +16%. x2 심볼은 2회 행동.",
        apply: () => applyPerk({ type: "spinDouble", value: 0.16 }),
        perkTag: { icon: "✖", name: "x2 표식 +16%" },
      },
      {
        id: "perk_spin_reroll",
        group: "spin",
        icon: "↺",
        title: "리롤 표식",
        desc: "심볼에 리롤 표식 부착 확률 +12%. 발동 시 좌측부터 재해석(턴당 1회).",
        apply: () => applyPerk({ type: "spinReroll", value: 0.12 }),
        perkTag: { icon: "↺", name: "리롤 표식 +12%" },
      },
      {
        id: "perk_spin_special",
        group: "spin",
        icon: "★",
        title: "특수 심볼",
        desc: "룬 결과에 와일드 룬 등장 확률 +10%. 와일드 룬은 최고 공격 영웅 추가 행동.",
        apply: () => applyPerk({ type: "specialRune", value: 0.1 }),
        perkTag: { icon: "★", name: "와일드 룬 +10%" },
      },
      {
        id: "perk_spin_charge",
        group: "spin",
        icon: "▲",
        title: "과충전 표식",
        desc: "심볼에 과충전 표식 부착 확률 +14%. 발동 시 해당 심볼 위력 +35%.",
        apply: () => applyPerk({ type: "spinCharge", value: 0.14 }),
        perkTag: { icon: "▲", name: "과충전 +14%" },
      },
      {
        id: "perk_spin_echo",
        group: "spin",
        icon: "∞",
        title: "메아리 표식",
        desc: "심볼에 메아리 표식 부착 확률 +10%. 발동 시 같은 심볼이 60% 위력으로 1회 추가 발동.",
        apply: () => applyPerk({ type: "spinEcho", value: 0.1 }),
        perkTag: { icon: "∞", name: "메아리 +10%" },
      },
      {
        id: "perk_rune_hero",
        icon: "🎲",
        title: "영웅 편중",
        desc: "영웅 룬 확률 상승, 전술 룬 확률 감소.",
        apply: () => {
          ["H1", "H2", "H3", "H4", "H5", "H6"].forEach((id) => applyPerk({ type: "weight", id, value: 1 }));
          applyPerk({ type: "weight", id: "T_ASSIST", value: -3 });
          applyPerk({ type: "weight", id: "T_BRACE", value: -3 });
        },
        perkTag: { icon: "🎲", name: "영웅 룬 편향" },
      },
    ];

    const selectablePerks = perkPool.filter((candidate) => !ownedPerkIds.has(candidate.id));
    const premiumIds = new Set([
      "perk_skill_core",
      "perk_mark_hunt",
      "perk_burn_engine",
      "perk_guard_line",
      "perk_renewal",
      "perk_spin_charge",
      "perk_spin_echo",
      "perk_spin_special",
      "perk_rune_hero",
    ]);
    if (eliteReward || progressRate >= 0.66) {
      const premiumPool = selectablePerks.filter((candidate) => premiumIds.has(candidate.id));
      if (premiumPool.length > 0) {
        const premium = premiumPool[randInt(premiumPool.length)];
        options.push({ ...premium, premium: true });
      }
    }

    const basePool = selectablePerks.length > 0 ? selectablePerks : perkPool;
    let guard = 0;
    while (options.length < 3 && guard < 240) {
      guard += 1;
      const candidate = basePool[randInt(basePool.length)];
      if (options.some((option) => option.id === candidate.id)) continue;
      if (candidate.group && options.some((option) => option.group && option.group === candidate.group)) continue;
      options.push(candidate);
    }

    if (options.length < 3) {
      for (const candidate of perkPool) {
        if (options.some((option) => option.id === candidate.id)) continue;
        options.push(candidate);
        if (options.length >= 3) break;
      }
    }
    return options.slice(0, 3);
  }

  function showRewardModal() {
    const options = makeRewardOptions();
    const body = document.createElement("div");
    body.className = "rewardGrid";

    options.forEach((option, index) => {
      const card = document.createElement("div");
      card.className = "rewardCard skillCard";
      if (option.premium) card.classList.add("premium");
      card.style.setProperty("--entry-delay", `${index * 70}ms`);
      card.innerHTML = `<div class="skillCardIcon">${option.icon}</div><div class="skillCardName">${option.title}</div><div class="skillCardDesc">${option.desc}</div>`;
      card.addEventListener("click", async () => {
        if (card.classList.contains("selected")) return;
        body.querySelectorAll(".rewardCard").forEach((entry) => entry.classList.remove("selected"));
        card.classList.add("selected");
        await wait(120);
        option.apply();
        if (option.perkTag && !state.perks.some((perk) => perk.id === option.id)) {
          state.perks.push({ id: option.id, ...option.perkTag });
        }
        closeModal();
        moveToNextNode();
      });
      body.appendChild(card);
    });

    const footer = document.createElement("div");
    const giveUp = document.createElement("button");
    giveUp.className = "btn ghost";
    giveUp.textContent = "원정 종료";
    giveUp.addEventListener("click", () => {
      showForfeitModal("보상을 선택하지 않고 메인으로 돌아갑니다.");
    });
    footer.appendChild(giveUp);

    openModal({
      title: "전투 승리 - 보상 1개 선택",
      bodyNode: body,
      footerNode: footer,
      closable: false,
    });
  }

  function showForfeitModal(message = "현재 원정을 포기하고 메인 화면으로 돌아갑니다.") {
    const body = document.createElement("div");
    body.innerHTML = `<div class="rewardDesc">${message}</div>`;
    const footer = document.createElement("div");
    const cancel = document.createElement("button");
    cancel.className = "btn ghost";
    cancel.textContent = "취소";
    cancel.addEventListener("click", () => closeModal());
    const exit = document.createElement("button");
    exit.className = "btn danger";
    exit.textContent = "메인으로";
    exit.addEventListener("click", () => {
      resetRun({ startBattle: false, chapter: state.chapter });
    });
    footer.appendChild(cancel);
    footer.appendChild(exit);
    openModal({ title: "원정 종료", bodyNode: body, footerNode: footer, closable: true });
  }

  function showResetDataModal() {
    const body = document.createElement("div");
    body.innerHTML =
      '<div class="rewardDesc">저장된 메타 데이터(결정/영웅/레벨/편성/소환기록)를 모두 삭제하고 초기 상태로 되돌립니다.</div>';
    const footer = document.createElement("div");
    const cancel = document.createElement("button");
    cancel.className = "btn ghost";
    cancel.textContent = "취소";
    cancel.addEventListener("click", () => closeModal());
    const confirm = document.createElement("button");
    confirm.className = "btn danger";
    confirm.textContent = "초기화";
    confirm.addEventListener("click", () => {
      try {
        localStorage.removeItem(META_STORAGE_KEY);
      } catch {}
      state.meta = loadMeta();
      state.ui.summonResults = [];
      state.ui.selectedHeroId = null;
      state.ui.selectedChapter = 1;
      closeModal();
      resetRun({ startBattle: false, chapter: 1 });
      log("저장 데이터가 초기화되었습니다.", true);
    });
    footer.appendChild(cancel);
    footer.appendChild(confirm);
    openModal({ title: "데이터 초기화", bodyNode: body, footerNode: footer, closable: true });
  }

  function showPauseModal() {
    const body = document.createElement("div");
    body.innerHTML = `<div class="rewardDesc">프로토타입 런을 일시정지했습니다. 언제든 재시작할 수 있습니다.</div>`;
    const footer = document.createElement("div");
    const close = document.createElement("button");
    close.className = "btn ghost";
    close.textContent = "계속";
    close.addEventListener("click", () => closeModal());
    const restart = document.createElement("button");
    restart.className = "btn primary";
    restart.textContent = "재시작";
    restart.addEventListener("click", () => resetRun());
    const exit = document.createElement("button");
    exit.className = "btn danger";
    exit.textContent = "포기하고 메인";
    exit.addEventListener("click", () => {
      showForfeitModal("현재 원정을 포기하고 메인 화면으로 돌아갑니다.");
    });
    footer.appendChild(close);
    footer.appendChild(restart);
    footer.appendChild(exit);
    openModal({ title: "일시정지", bodyNode: body, footerNode: footer, closable: true });
  }

  function showEndModal(clear) {
    if (!clear) {
      const fallbackGain = Math.max(REWARD_BALANCE.defeatBase, state.nodeIndex * REWARD_BALANCE.defeatStep + REWARD_BALANCE.defeatBase);
      grantMetaShards(fallbackGain, `후퇴 보상 +${fallbackGain} 결정`);
    }
    const body = document.createElement("div");
    body.innerHTML = clear
      ? `<div class="rewardDesc">캐러밴 루트를 완주했습니다. 프로토타입 클리어!</div><div class="rewardDesc">이번 런 획득 유산 결정 +${state.runMetaGain}</div>`
      : `<div class="rewardDesc">파티가 전멸했습니다. 다른 편성/특성 조합으로 다시 도전해보세요.</div><div class="rewardDesc">이번 런 획득 유산 결정 +${state.runMetaGain}</div>`;
    const footer = document.createElement("div");
    const retry = document.createElement("button");
    retry.className = "btn primary";
    retry.textContent = "다시 도전";
    retry.addEventListener("click", () => resetRun());
    const goLobby = document.createElement("button");
    goLobby.className = "btn ghost";
    goLobby.textContent = "메인으로";
    goLobby.addEventListener("click", () => resetRun({ startBattle: false, chapter: state.chapter }));
    footer.appendChild(retry);
    footer.appendChild(goLobby);
    openModal({
      title: clear ? "챕터 클리어" : "게임 오버",
      bodyNode: body,
      footerNode: footer,
      closable: false,
    });
  }

  function applyBattleStartEffects() {
    if (COMBAT_BALANCE.baseStartShield > 0) {
      state.activeHeroes.forEach((hero) => {
        if (hero.hp > 0) hero.shield += COMBAT_BALANCE.baseStartShield;
      });
      log(`기본 전투 보호막 +${COMBAT_BALANCE.baseStartShield}`, true);
    }
    if (state.modifiers.relicGuardFlat > 0) {
      state.activeHeroes.forEach((hero) => {
        if (hero.hp > 0) hero.shield += state.modifiers.relicGuardFlat;
      });
      log(`유물 효과: 전투 시작 보호막 +${state.modifiers.relicGuardFlat}`, true);
    }
    let passivePartyHeal = 0;
    let traitShieldApplied = 0;
    state.activeHeroes.forEach((hero) => {
      if (hero.hp <= 0) return;
      const shieldBonus = heroPassiveValue(hero, "startShield");
      if (shieldBonus > 0) hero.shield += Math.floor(shieldBonus);
      const traitShield = heroTraitValue(hero, "startShield");
      if (traitShield > 0) {
        const gained = Math.floor(traitShield);
        hero.shield += gained;
        traitShieldApplied += gained;
      }
      const startEnergy = heroPassiveValue(hero, "startEnergy");
      if (startEnergy > 0) hero.energy = clamp(hero.energy + Math.floor(startEnergy), 0, 100);
      const startFocus = heroTraitValue(hero, "startFocus");
      if (startFocus > 0) hero.focus = clamp((hero.focus || 0) + Math.floor(startFocus), 0, 3);
      passivePartyHeal += Math.max(0, Math.floor(heroPassiveValue(hero, "battleStartHealParty")));
    });
    if (passivePartyHeal > 0) healParty(passivePartyHeal, "패시브 시작 효과");
    if (traitShieldApplied > 0) log(`영웅 특성: 시작 보호막 +${traitShieldApplied}`, true);
  }

  function enterCombatNode() {
    state.currentNodeType = nodeTypeOf(state.nodeIndex);
    state.enemies = makeEnemySet(state.nodeIndex, state.currentNodeType);
    state.teamGuardTurns = 0;
    state.teamGuardRate = 0;
    state.activeHeroes.forEach((hero) => {
      hero.regenTurns = 0;
      hero.regenPower = 0;
      hero.focus = 0;
    });
    applyBattleStartEffects();
    state.slotResult = [];
    state.comboStep = 0;
    resetTurnBuff();
    setReels([null, null, null], false);
    setResolvingReel(-1);
    setPhase("spin_ready");
    renderAll();
    log(`노드 ${state.nodeIndex + 1} (${nodeTypeLabel(state.currentNodeType)}) 전투 시작`, true);
  }

  function resolveRestNode(choice) {
    if (choice === "heal") {
      healParty(20 + state.modifiers.healBonus, "휴식 노드");
      shieldParty(6 + state.modifiers.shieldBonus, "휴식 노드");
      log("휴식 노드: 재정비로 체력/보호막 회복");
    } else {
      const downed = state.activeHeroes.filter((hero) => hero.hp <= 0);
      if (downed.length > 0) {
        const target = downed[randInt(downed.length)];
        target.hp = Math.max(1, Math.floor(target.maxHp * 0.6));
        target.energy = 45;
        log(`휴식 노드: ${target.name} 복귀`);
      } else {
        applyPerk({ type: "atk", value: 1 });
        log("휴식 노드: 전원 생존으로 공격 +1 획득");
      }
    }
    closeModal();
    state.nodeIndex += 1;
    if (state.nodeIndex >= TOTAL_NODES) {
      grantMetaShards(REWARD_BALANCE.clearBonus, `루트 완주 보너스 +${REWARD_BALANCE.clearBonus} 결정`);
      state.comboStep = 0;
      resetTurnBuff();
      setPhase("end");
      showEndModal(true);
      return;
    }
    enterCombatNode();
  }

  function showRestNodeModal() {
    const body = document.createElement("div");
    body.className = "rewardGrid";

    const options = [
      {
        id: "rest_heal",
        title: "🌿 캠프 정비",
        desc: "출전 영웅 체력 +20, 보호막 +6",
        apply: () => resolveRestNode("heal"),
      },
      {
        id: "rest_revive",
        title: "🕯 구조 작전",
        desc: "전투불능 1명 복귀(체력 60%). 전원 생존 시 공격 +1",
        apply: () => resolveRestNode("revive"),
      },
    ];

    options.forEach((option, index) => {
      const card = document.createElement("div");
      card.className = "rewardCard";
      card.style.setProperty("--entry-delay", `${index * 70}ms`);
      card.innerHTML = `<div class="rewardTitle">${option.title}</div><div class="rewardDesc">${option.desc}</div>`;
      card.addEventListener("click", async () => {
        if (card.classList.contains("selected")) return;
        body.querySelectorAll(".rewardCard").forEach((entry) => entry.classList.remove("selected"));
        card.classList.add("selected");
        await wait(130);
        option.apply();
      });
      body.appendChild(card);
    });

    openModal({
      title: "휴식 노드 - 캠프 선택",
      bodyNode: body,
      closable: false,
    });
  }

  function moveToNextNode() {
    const nodeMetaGain = REWARD_BALANCE.nodeBase + state.nodeIndex * REWARD_BALANCE.nodeStep;
    grantMetaShards(nodeMetaGain, `노드 보상 +${nodeMetaGain} 결정`);
    if (state.currentNodeType === "elite") {
      grantMetaShards(REWARD_BALANCE.eliteBonus, `정예 노드 보너스 +${REWARD_BALANCE.eliteBonus} 결정`);
    }
    state.nodeIndex += 1;
    if (state.nodeIndex >= TOTAL_NODES) {
      grantMetaShards(REWARD_BALANCE.clearBonus, `루트 완주 보너스 +${REWARD_BALANCE.clearBonus} 결정`);
      state.comboStep = 0;
      resetTurnBuff();
      setPhase("end");
      showEndModal(true);
      return;
    }
    state.currentNodeType = nodeTypeOf(state.nodeIndex);
    if (state.currentNodeType === "rest") {
      state.enemies = [];
      state.slotResult = [];
      setPhase("reward");
      renderAll();
      showRestNodeModal();
      return;
    }
    enterCombatNode();
  }

  async function resolveTurn() {
    if (state.slotResult.length === 0) {
      setResolvingReel(-1);
      return;
    }
    setPhase("resolving");
    state.comboStep = 0;
    applyRuneSynergy(state.slotResult);
    log("룬 해석 시작...");
    renderAll();

    let rerollUsed = false;
    let pass = 0;
    while (pass < 2) {
      let triggeredReroll = false;
      for (let runeIndex = 0; runeIndex < state.slotResult.length; runeIndex += 1) {
        const rune = state.slotResult[runeIndex];
        setResolvingReel(runeIndex);
        await wait(120);

        const hitCount = rune?.effects?.double ? 2 : 1;
        for (let hitIndex = 0; hitIndex < hitCount; hitIndex += 1) {
          await resolveRune(rune, { allowEcho: hitIndex === 0 });
          if (rune?.effects?.double && hitIndex === 0) {
            log(`x2 표식 발동: ${rune.name} 추가 1회`, true);
          }
          state.comboStep = Math.min(5, state.comboStep + 1);
          renderAll();
          await wait(120);
          if (hasWonBattle()) break;
        }
        if (hasWonBattle()) break;

        if (rune?.effects?.reroll && !rerollUsed) {
          rerollUsed = true;
          triggeredReroll = true;
          log(`↺ 리롤 표식 발동: 좌측부터 재해석`, true);
          break;
        }
      }
      if (!triggeredReroll || hasWonBattle()) break;
      pass += 1;
    }
    setResolvingReel(-1);

    renderAll();
    if (hasWonBattle()) {
      state.comboStep = 0;
      resetTurnBuff();
      setPhase("reward");
      showRewardModal();
      return;
    }

    processStatusBeforeEnemyTurn();
    renderAll();
    if (hasWonBattle()) {
      state.comboStep = 0;
      resetTurnBuff();
      setPhase("reward");
      showRewardModal();
      return;
    }

    await enemyTurn();
    decayStatusTurn();
    state.comboStep = 0;
    resetTurnBuff();
    renderAll();
    if (hasLost()) {
      setPhase("end");
      showEndModal(false);
      return;
    }
    setPhase("spin_ready");
  }

  function spin() {
    if (state.phase !== "spin_ready") return;
    state.slotResult = [];
    setResolvingReel(-1);
    setPhase("spinning");
    resetTurnBuff();
    const reelSeed = state.activeHeroes.slice(0, 3).map((hero) => runeById(hero.id));
    while (reelSeed.length < 3) reelSeed.push(runeById("T_ASSIST"));
    setReels(reelSeed, true);
    log("회전 시작", true);

    const duration = 700;
    const start = performance.now();
    const tick = () => {
      const elapsed = performance.now() - start;
      if (elapsed < duration) {
        setReels(
          [runeById(pickWeighted(BASE_WEIGHTS)), runeById(pickWeighted(BASE_WEIGHTS)), runeById(pickWeighted(BASE_WEIGHTS))],
          true
        );
        requestAnimationFrame(tick);
        return;
      }
      state.slotResult = rollRunes();
      setReels(state.slotResult, false);
      log(`결과 룬: ${state.slotResult.map((rune) => runeLabelWithEffects(rune)).join(" ")}`);
      void resolveTurn();
    };
    requestAnimationFrame(tick);
  }

  function initialActiveHeroIds() {
    const ownedIds = HERO_LIBRARY.filter((hero) => heroProgress(hero.id).owned).map((hero) => hero.id);
    const picked = ensureMetaLoadout(state.meta.loadout || null, state.meta.roster || null).filter((heroId) =>
      ownedIds.includes(heroId)
    );
    if (picked.length > 0) {
      state.meta.loadout = picked.slice(0, MAX_ACTIVE);
      return state.meta.loadout;
    }
    const fallback = defaultLoadout(state.meta.roster || null);
    state.meta.loadout = fallback;
    saveMeta(state.meta);
    return fallback;
  }

  function resetRun({ startBattle = true, chapter = state.chapter } = {}) {
    closeModal();
    clearLog();
    state.chapter = Number(chapter) || 1;
    state.ui.selectedChapter = state.chapter;
    state.nodeIndex = 0;
    state.currentNodeType = nodeTypeOf(0);
    const starterIds = initialActiveHeroIds();
    state.activeHeroes = starterIds.map((heroId) => makeHeroState(heroId)).filter(Boolean);
    state.enemies = makeEnemySet(0, state.currentNodeType);
    state.perks = [];
    state.relics = [];
    state.phase = "idle";
    state.slotResult = [];
    state.comboStep = 0;
    state.runMetaGain = 0;
    state.teamGuardTurns = 0;
    state.teamGuardRate = 0;
    resetTurnBuff();
    state.modifiers = {
      atkFlat: 0,
      critBonus: 0,
      critMultBonus: 0,
      aoeBonus: 0,
      healBonus: 0,
      shieldBonus: 0,
      tacticBonus: (state.meta.upgrades.tactic || 0) * 0.04,
      lifeSteal: 0,
      extraShotChance: 0,
      relicDamageMult: 0,
      energyGainMult: 0,
      relicGuardFlat: 0,
      skillDamageMult: 0,
      markDamageBonus: 0,
      burnBonusFlat: 0,
      regenBonusFlat: 0,
      guardRateBonus: 0,
      spinDoubleChance: 0,
      spinRerollChance: 0,
      specialRuneChance: 0,
      spinChargeChance: 0,
      spinEchoChance: 0,
      runeWeightDelta: {},
    };

    setReels([null, null, null], false);
    setResolvingReel(-1);
    applyBattleStartEffects();
    renderAll();
    log(`새 런 초기화 완료 · 챕터 ${state.chapter} (${chapterConfig(state.chapter).label})`, true);

    if (startBattle) {
      setBattleUIVisible(true);
      setLobbyVisible(false);
      setPhase("spin_ready");
      return;
    }

    setBattleUIVisible(false);
    setLobbyVisible(true);
    setPhase("idle");
    openLobbyScreen("main");
  }

  function syncLogVisibility() {
    battleLog.classList.toggle("collapsed", state.logCollapsed);
    btnLogToggle.textContent = state.logCollapsed ? "로그 보기" : "로그 숨김";
    btnLogToggle.setAttribute("aria-pressed", state.logCollapsed ? "false" : "true");
  }

  btnSpin.addEventListener("click", spin);
  btnRetry.addEventListener("click", () => resetRun({ startBattle: true, chapter: state.chapter }));
  btnPause.addEventListener("click", showPauseModal);
  btnLogToggle.addEventListener("click", () => {
    state.logCollapsed = !state.logCollapsed;
    syncLogVisibility();
  });

  btnLobbyHeroes.addEventListener("click", () => openLobbyScreen("heroes"));
  btnLobbySummon.addEventListener("click", () => openLobbyScreen("summon"));
  btnResetData.addEventListener("click", showResetDataModal);
  btnHeroBack.addEventListener("click", () => openLobbyScreen("main"));
  btnSummonBack.addEventListener("click", () => openLobbyScreen("main"));

  btnChapterPrev.addEventListener("click", () => shiftLobbyChapter(-1));
  btnChapterNext.addEventListener("click", () => shiftLobbyChapter(1));
  btnChapterEnter.addEventListener("click", () => startChapterRun(state.ui.selectedChapter || state.chapter || 1));

  btnSummon1.addEventListener("click", () => runSummon(1));
  btnSummon10.addEventListener("click", () => runSummon(10));

  syncLogVisibility();
  resetRun({ startBattle: false, chapter: 1 });
})();
