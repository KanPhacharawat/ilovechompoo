/**
 * ============================================================
 *  EDIT THIS FILE TO PERSONALISE THE WHOLE SITE.
 * ============================================================
 *  Every name, caption, photo and line of copy lives here — no
 *  component holds hardcoded content. Change a value below and
 *  it updates everywhere.
 *
 *  Image / video / audio paths are relative to the `public/`
 *  folder, so `"/her.jpg"` means `public/her.jpg`.
 * ============================================================
 */

export type Profile = {
  id: string;
  name: string;
  image: string;
  /** Fallback tint shown if the image file is missing. */
  fallbackColor: string;
  fallbackLabel: string;
};

export type Memory = {
  id: string;
  image: string;
  caption: string;
};

export type Episode = {
  id: string;
  number: number;
  title: string;
  description: string;
  /** Still shown in the row — also what opens if there's no video yet. */
  poster: string;
  /**
   * Optional. Drop an .mp4 into `public/` and point `video` at it, and this
   * episode becomes a real playable clip with a video player. Leave it out
   * and the episode simply opens its poster full-screen.
   */
  video?: string;
};

/* ---------- 1. WHO'S WATCHING ---------- */

export const profiles: Profile[] = [
  {
    id: "her",
    name: "nongcarrot🥕",
    image: "/her.jpg",
    fallbackColor: "#f4a7be",
    fallbackLabel: "HER",
  },
  {
    id: "him",
    name: "nongkan🐇",
    image: "/him.jpg",
    fallbackColor: "#3b82f6",
    fallbackLabel: "HIM",
  },
];

/* ---------- 2. HERO / BILLBOARD ---------- */

export const hero = {
  badge: "SERIES",
  kicker: "Loveflix Original",
  title: "OUR STORY: SEASON 2026",
  match: "100% Match",
  rating: "18+",
  seasons: "1 Season",
  quality: "Ultra HD",
  synopsis:
    "เรื่องราวแสนสนุกของพี่ชมพูกับน้องกันต์ ที่ได้ร่วมกันสร้างเรื่องราวความรักสุดแสนวายป่วง เมื่อต่างคนต่างมีพื้นหลังสุดแสนแตกต่างกัน เรื่องราวจะเป็นยังไงโปรดติดตาม ซีซั่นต่อไป",
  backgroundImage: "/5.jpg",
  /**
   * Which part of the hero photo to keep in frame. A portrait photo in a wide
   * desktop banner crops hard, so the two are tuned separately — nudge the
   * second number up/down (0% = top of the photo, 100% = bottom) until your
   * faces sit nicely in the frame.
   */
  backgroundPosition: {
    mobile: "center",
    desktop: "center 15%",
  },
};

/* ---------- 3. TRENDING MEMORIES ROW ---------- */

export const memoriesRowTitle = "Trending Memories";

// Captions are a starting point based on each photo — make them yours ❤️
export const memories: Memory[] = [
  { id: "m1", image: "/6.jpg", caption: "First date @CentralWorld" },
  { id: "m2", image: "/12.jpg", caption: "Siriraj date @WangLangMarket" },
  { id: "m3", image: "/7.jpg", caption: "New semester @MarketPlace" },
  { id: "m4", image: "/8.jpg", caption: "Sushi date @CentralRama3" },
  { id: "m5", image: "/9.jpg", caption: "MELAND double date @SiamParagon" },
];

/* ---------- 4. EPISODES OF US ---------- */

export const episodesRowTitle = "Episodes of Us";

export const episodes: Episode[] = [
  {
    id: "e1",
    number: 1,
    title: "The Beginning",
    description: "จุดเริ่มต้นของเรื่องราวทั้งหมด",
    poster: "/11.jpg",
    // video: "/6.mp4",
  },
  {
    id: "e2",
    number: 2,
    title: "Museum ",
    description: "กิจกรรมของคนอายุ 20",
    poster: "/10.jpg",
    // video: "/7.mp4",
  },
  {
    id: "e3",
    number: 3,
    title: "First Junior Year ",
    description: "เปิดเทอมวันแรก",
    poster: "/13.jpg",
    // video: "/7.mp4",
  },
  {
    id: "e4",
    number: 4,
    title: "Moo Krata Dinner",
    description: "หมูกระทะมื้อแรก",
    poster: "/14.jpg",
    // video: "/7.mp4",
  },
  {
    id: "e5",
    number: 5,
    title: "Spidy Chompoo",
    description: "ดูหนังด้วยกันอีกแล้ว",
    poster: "/15.jpg",
    // video: "/7.mp4",
  },
  {
    id: "e6",
    number: 6,
    title: "Marketplace again",
    description: "เรารัก Shinkanzen!",
    poster: "/16.jpg",
    // video: "/7.mp4",
  },
  {
    id: "e7",
    number: 7,
    title: "Ramyon",
    description: "มาม่ามื้อดึก",
    poster: "/17.jpg",
    // video: "/7.mp4",
  },
  {
    id: "e8",
    number: 8,
    title: "MELAND",
    description: "ย้อนวัยเด็ก",
    poster: "/18.jpg",
    // video: "/7.mp4",
  },
];

/* ---------- 5. "MORE INFO" LOVE NOTE ---------- */
export const infoModal = {
  title: "A little surprise for you 🤍",
  body: `
    I just wanted to leave you a little message.

    Thank you for being in my life.
    I really appreciate all the little moments we share,
    even the simple, everyday ones.

    You make my days feel a little better just by being around,
    and I'm really glad I get to have you in my life.

    I don't always know how to say these things,
    but I hope you know how much you mean to me.

    I love you, baby. 🤍

    Take care of yourself, okay?
    And no matter what, I hope you keep being you.
  `,
  closeLabel: "Close",
};

/* ---------- 6. CHROME & COPY ---------- */

export const site = {
  brand: "LOVEFLIX",
  tagline: "LOVEFLIX special edition for nong Kan and P Chompoo",
  tapHint: "Tap anywhere to start",
  whosWatching: "Who's watching?",
  manageProfiles: "Manage Profiles",
};

/* ---------- 7. MUSIC ---------- */

export const music = {
  /** Plays on the intro / profile screen, starting from the first tap. */
  intro: "/tiktok.mp3",
  /** Cross-fades in once a profile is chosen. */
  home: "/song.mp3",
};
