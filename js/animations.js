/* ==========================================
   INTRO
========================================== */

const intro = document.getElementById("intro");
const website = document.getElementById("website");
const enterBtn = document.getElementById("enterBtn");

enterBtn.addEventListener("click", () => {

    intro.style.opacity = "0";

    intro.style.pointerEvents = "none";

    setTimeout(() => {

        intro.style.display = "none";

        website.style.display = "block";

        document.body.style.overflowY = "auto";

        loadGallery();

        createPetals();

    }, 1000);

});

/* ==========================================
   SCROLL REVEAL
========================================== */

function observeFadeAnimations() {

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    }, {

        threshold: 0.15

    });

    document.querySelectorAll(".fadeUp").forEach(el => {

        observer.observe(el);

    });

}

/* ==========================================
   PETALS
========================================== */

const petalContainer =
document.getElementById("petal-container");

function createPetals(container = petalContainer) {

    return setInterval(() => {

        const petal = document.createElement("div");

        petal.className = "petal";

        const size = Math.random() * 18 + 10;

        petal.style.width = size + "px";
        petal.style.height = size + "px";

        petal.style.left =

            Math.random() * window.innerWidth + "px";

        petal.style.animationDuration =

            (Math.random() * 6 + 5) + "s";

        petal.style.opacity =

            Math.random();

        container.appendChild(petal);

        setTimeout(() => {

            petal.remove();

        },11000);

    },350);

}

/* ==========================================
   RELATIONSHIP TIMER
========================================== */

const countdown =
document.getElementById("countdown");

function updateTimer(){

const start =

new Date(CONFIG.relationshipDate);

const now = new Date();

let diff = now - start;

const days =
Math.floor(diff/86400000);

diff %=86400000;

const hours=
Math.floor(diff/3600000);

diff%=3600000;

const minutes=
Math.floor(diff/60000);

diff%=60000;

const seconds=
Math.floor(diff/1000);

countdown.innerHTML=`

<div class="time-box">

<h2>${days}</h2>

<span>Days</span>

</div>

<div class="time-box">

<h2>${hours}</h2>

<span>Hours</span>

</div>

<div class="time-box">

<h2>${minutes}</h2>

<span>Minutes</span>

</div>

<div class="time-box">

<h2>${seconds}</h2>

<span>Seconds</span>

</div>

`;

}

setInterval(updateTimer,1000);

updateTimer();

/* ==========================================
   MUSIC PLAYER
========================================== */

const musicButton =
document.getElementById("musicPlayBtn");

const music = new Audio(

"assets/music/love.mp3"

);

music.loop = true;

let playing = false;

musicButton.onclick = ()=>{

if(playing){

music.pause();

musicButton.innerHTML="▶";

}

else{

music.play();

musicButton.innerHTML="⏸";

}

playing=!playing;

};

/* ==========================================
   PAGE READY
========================================== */

window.addEventListener("load",()=>{

observeFadeAnimations();

});