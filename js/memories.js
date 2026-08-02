/* ==========================================
   MEMORY SLIDESHOW
   Borderless tilted photo + typewriter story,
   alternating sides, auto-advancing.
========================================== */

const memoryGrid = document.getElementById("memoryGrid");
const memoryProgress = document.getElementById("memoryProgress");

const MEMORY_TYPE_SPEED = 40;       // ms per character
const MEMORY_HOLD_AFTER_TYPE = 4000; // ms to hold once fully typed
const MEMORY_FADE_MS = 1100;        // must match CSS transition on .memory-slide

let slideshowMemories = [];
let currentSlide = 0;
let memoryTypeTimer = null;
let memoryAdvanceTimer = null;
let slideshowStarted = false;
let slideshowDataReady = false;

/* ==========================================
   LOADING
========================================== */

function showLoader() {

    memoryGrid.innerHTML = `
        <div class="loader"></div>
    `;

    memoryProgress.innerHTML = "";

}

/* ==========================================
   EMPTY STATE
========================================== */

function showEmptyGallery() {

    memoryGrid.innerHTML = `

        <div class="glass-card">

            <h2>No memories yet ❤️</h2>

            <p>

                Upload your first memory from
                the Admin Panel.

            </p>

        </div>

    `;

    memoryProgress.innerHTML = "";

}

/* ==========================================
   BUILD A SINGLE SLIDE
========================================== */

function buildMemorySlide(memory, index) {

    const slide = document.createElement("div");

    slide.className = "memory-slide" + (index % 2 === 1 ? " side-right" : "");

    slide.style.setProperty("--tilt", index % 2 === 0 ? "-5deg" : "5deg");

    const hasDate = !!memory.created_at;

    const date = hasDate ? new Date(memory.created_at) : null;

    const safeStory = (memory.description || "").replace(/"/g, "&quot;");

    slide.innerHTML = `

        <div class="memory-photo-wrap">

            <div class="memory-photo">

                <img
                    src="${memory.image_url}"
                    alt="${memory.title || ""}"
                    loading="lazy">

            </div>

        </div>

        <div class="memory-text-wrap">

            <div class="memory-meta">

                <span class="memory-title">${memory.title || ""}</span>

                ${hasDate ? `<span class="dot">·</span><span>${date.toLocaleDateString()}</span>` : ""}

            </div>

            <div class="memory-story" data-full="${safeStory}"><span class="cursor"></span></div>

        </div>

    `;

    return slide;

}

/* ==========================================
   RENDER ALL SLIDES + PROGRESS TRACK
========================================== */

function renderSlideshow() {

    memoryGrid.innerHTML = "";

    memoryProgress.innerHTML = "";

    slideshowMemories.forEach((memory, index) => {

        memoryGrid.appendChild(buildMemorySlide(memory, index));

        const seg = document.createElement("div");

        seg.className = "seg";

        memoryProgress.appendChild(seg);

    });

}

/* ==========================================
   TYPEWRITER EFFECT
========================================== */

function typeStory(slide, onDone) {

    const storyEl = slide.querySelector(".memory-story");

    const full = storyEl.getAttribute("data-full") || "";

    storyEl.innerHTML = '<span class="cursor"></span>';

    clearInterval(memoryTypeTimer);

    if (!full) {

        onDone();

        return;

    }

    let i = 0;

    memoryTypeTimer = setInterval(() => {

        i++;

        storyEl.innerHTML = full.slice(0, i) + '<span class="cursor"></span>';

        if (i >= full.length) {

            clearInterval(memoryTypeTimer);

            onDone();

        }

    }, MEMORY_TYPE_SPEED);

}

/* ==========================================
   PLAY A SLIDE, THEN QUEUE THE NEXT
========================================== */

function playSlide(index) {

    const slides = memoryGrid.querySelectorAll(".memory-slide");

    const segs = memoryProgress.querySelectorAll(".seg");

    if (!slides.length) return;

    slides.forEach((slide, i) => slide.classList.toggle("active", i === index));

    segs.forEach((seg, i) => {

        seg.classList.remove("filling");

        seg.classList.toggle("done", i < index);

        void seg.offsetWidth; // restart CSS animation

    });

    const storyEl = slides[index].querySelector(".memory-story");

    const full = storyEl.getAttribute("data-full") || "";

    const estTypeMs = full.length * MEMORY_TYPE_SPEED;

    const totalMs = estTypeMs + MEMORY_HOLD_AFTER_TYPE;

    segs[index].style.setProperty("--dur", totalMs + "ms");

    segs[index].classList.add("filling");

    typeStory(slides[index], () => {

        clearTimeout(memoryAdvanceTimer);

        memoryAdvanceTimer = setTimeout(() => {

            currentSlide = (index + 1) % slides.length;

            setTimeout(() => playSlide(currentSlide), MEMORY_FADE_MS);

        }, MEMORY_HOLD_AFTER_TYPE);

    });

}

/* ==========================================
   LOAD GALLERY
========================================== */

async function loadGallery() {

    showLoader();

    clearInterval(memoryTypeTimer);

    clearTimeout(memoryAdvanceTimer);

    const memories = await getMemories();

    if (!memories || memories.length === 0) {

        slideshowMemories = [];

        slideshowDataReady = false;

        showEmptyGallery();

        return;

    }

    // Supabase returns newest first; tell the story chronologically instead.
    slideshowMemories = memories.slice().reverse();

    renderSlideshow();

    currentSlide = 0;

    slideshowDataReady = true;

    // If the section was already visible (or already played before this
    // refresh), keep it playing with the fresh data. Otherwise it waits
    // for the person to actually scroll to it.
    if (slideshowStarted) {

        playSlide(0);

    }

}

/* ==========================================
   START PLAYBACK ONCE SCROLLED INTO VIEW
========================================== */

const memorySectionObserver = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting && !slideshowStarted) {

            slideshowStarted = true;

            if (slideshowDataReady) {

                playSlide(currentSlide);

            }

        }

    });

}, { threshold: 0.35 });

const gallerySectionEl = document.getElementById("gallery");

if (gallerySectionEl) {

    memorySectionObserver.observe(gallerySectionEl);

}

/* ==========================================
   REFRESH GALLERY
   Used by the admin panel right after an
   upload/edit/delete, so it always reloads.
========================================== */

async function refreshGallery() {

    await loadGallery();

}

/* ==========================================
   POLL FOR UPDATES
   Used by the 30s background timer. Only
   restarts the slideshow if the memory count
   actually changed, so it never interrupts
   someone mid-story.
========================================== */

async function checkForMemoryUpdates() {

    const memories = await getMemories();

    if (!memories) return;

    if (memories.length !== slideshowMemories.length) {

        await loadGallery();

    }

}

/* ==========================================
   START
========================================== */

window.addEventListener(

    "load",

    loadGallery

);
