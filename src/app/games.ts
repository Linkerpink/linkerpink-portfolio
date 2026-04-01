// Helper to format date as 'Month Year' or 'Not Released'
function formatDisplayDate(date: string): string {
  if (date.toLowerCase() === 'not released') return 'Not Released';
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleString('default', { month: 'long', year: 'numeric' });
}

export const firstRowGames = [
  {
    href: "https://lulaobobao.itch.io/robo-rebellion-dawn-of-the-machine",
    imgSrc: "/images/robo rebellion.png",
    title: "Robo Rebellion: Dawn of the Machine",
    date: "2024-07-10",
    displayDate: formatDisplayDate("2024-07-10"),
    technologies: [
      "/images/unity logo.png",
      "/images/c sharp logo.svg",
    ],
  },
  {
    href: "https://linkerpink.itch.io/not-suepr-maria-63",
    imgSrc: "/images/Not Suepr Maria 63.webp",
    title: "Not Suepr Maria 63",
    date: "2025-04-17",
    displayDate: formatDisplayDate("2025-04-17"),
    technologies: [
      "/images/unity logo.png",
      "/images/c sharp logo.svg",
    ],
  },
];

export const games = [
  {
    href: "https://linkerpink.itch.io/the-royal-spin",
    imgSrc: "/images/the royal spin logo.png",
    title: "The Royal Spin",
    date: "2025-7-11",
    displayDate: formatDisplayDate("2025-7-11"),
    technologies: [
      "/images/unity logo.png",
      "/images/c sharp logo.svg",
    ],
  },
  {
    href: "https://gx.games/games/ef2jjg/when-time-collides/",
    imgSrc: "/images/when time collides.webp",
    title: "When Time Collides",
    date: "2022-03-18",
    displayDate: formatDisplayDate("2022-03-18"),
    technologies: [
      "/images/gamemaker studio logo.svg",
    ],
  },
  {
    href: "https://linkerpink.itch.io/shy",
    imgSrc: "/images/SHYGame.jpg",
    title: "Shy",
    date: "2024-05-26",
    displayDate: formatDisplayDate("2024-05-26"),
    technologies: [
      "/images/unity logo.png",
      "/images/c sharp logo.svg",
    ],
  },
  {
    href: "https://github.com/Linkerpink/Open-Pixel-Art",
    imgSrc: "/images/open pixel art temp logo.png",
    title: "Open Pixel Art",
    date: "not released",
    displayDate: formatDisplayDate("not released"),
    technologies: [
      "/images/godot logo.svg",
      "/images/gdscript logo.webp",
    ],
  },
];
