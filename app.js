const grid = document.querySelector("#video-grid");
const template = document.querySelector("#video-card-template");
const search = document.querySelector("#search");
const count = document.querySelector("#result-count");
const dialog = document.querySelector("#video-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const player = document.querySelector("#player");
const closeDialog = document.querySelector("#close-dialog");
const levelButtons = Array.from(document.querySelectorAll("[data-level]"));

let videos = [];
let activeLevel = "all";

const fallbackVideos = [
  {
    title: "Warmup Groove",
    description: "A short pocket-building loop for getting hands and feet moving.",
    youtubeId: "M7lc1UVf-VE",
    level: "beginner",
    tempo: "90 BPM",
    duration: "3:33"
  },
  {
    title: "Subdivision Drill",
    description: "Practice switching subdivisions while keeping the pulse steady.",
    youtubeId: "M7lc1UVf-VE",
    level: "intermediate",
    tempo: "110 BPM",
    duration: "3:33"
  },
  {
    title: "Accent Control",
    description: "Build dynamic control with alternating accents around the kit.",
    youtubeId: "M7lc1UVf-VE",
    level: "advanced",
    tempo: "120 BPM",
    duration: "3:33"
  }
];

async function loadVideos() {
  try {
    const response = await fetch("./videos.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Video data request failed: ${response.status}`);
    }

    const data = await response.json();
    videos = Array.isArray(data.videos) && data.videos.length > 0 ? data.videos : fallbackVideos;
  } catch {
    videos = fallbackVideos;
  }

  renderVideos();
}

function renderVideos() {
  const query = search.value.trim().toLowerCase();
  const filtered = videos.filter((video) => {
    const matchesLevel = activeLevel === "all" || video.level === activeLevel;
    const text = `${video.title} ${video.description} ${video.tempo} ${video.level}`.toLowerCase();
    return matchesLevel && text.includes(query);
  });

  grid.replaceChildren();
  count.textContent = `${filtered.length} ${filtered.length === 1 ? "video" : "videos"}`;

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No videos match the current filters.";
    grid.append(empty);
    return;
  }

  filtered.forEach((video) => {
    const card = template.content.firstElementChild.cloneNode(true);
    const img = card.querySelector("img");
    const title = card.querySelector("h3");
    const duration = card.querySelector(".duration");
    const description = card.querySelector(".description");
    const level = card.querySelector(".level");
    const tempo = card.querySelector(".tempo");
    const button = card.querySelector(".thumbnail-button");

    title.textContent = video.title;
    duration.textContent = video.duration || "";
    description.textContent = video.description || "";
    level.textContent = video.level || "practice";
    tempo.textContent = video.tempo || "";
    img.src = video.thumbnail || getDefaultThumbnail(video);
    img.alt = `${video.title} thumbnail`;
    button.addEventListener("click", () => openVideo(video));

    grid.append(card);
  });
}

function getDefaultThumbnail(video) {
  if (video.youtubeId) {
    return `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
  }

  return "./assets/images/rwb-video-placeholder.svg";
}

function openVideo(video) {
  dialogTitle.textContent = video.title;
  player.innerHTML = "";

  if (video.src) {
    const videoEl = document.createElement("video");
    videoEl.src = video.src;
    videoEl.poster = video.thumbnail || "";
    videoEl.controls = true;
    videoEl.autoplay = true;
    videoEl.playsInline = true;
    player.append(videoEl);
  } else if (video.youtubeId) {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`;
    iframe.title = video.title;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    player.append(iframe);
  }

  dialog.showModal();
}

function closeVideo() {
  dialog.close();
  player.innerHTML = "";
}

search.addEventListener("input", renderVideos);
closeDialog.addEventListener("click", closeVideo);
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    closeVideo();
  }
});

levelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeLevel = button.dataset.level;
    levelButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    renderVideos();
  });
});

loadVideos();
