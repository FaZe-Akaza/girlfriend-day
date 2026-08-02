/*==================================================
    GIFT SYSTEM
==================================================*/

const giftBoxes =
document.querySelectorAll(".giftBox");

const letterModal =
document.getElementById("letterModal");

const starsModal =
document.getElementById("starsModal");

const flowersModal =
document.getElementById("flowersModal");

const endingScreen =
document.getElementById("endingScreen");

const replayButton =
document.getElementById("replayStory");

const letterArea =
document.getElementById("letterTyping");

/*==================================================
SMALL HELPER
==================================================*/

function sleep(ms){

    return new Promise(resolve => setTimeout(resolve, ms));

}

/*==================================================
OPEN GIFTS
==================================================*/

giftBoxes.forEach(box=>{

box.onclick=()=>{

const gift=

box.dataset.gift;

if(gift==="letter"){

openLetter();

}

if(gift==="stars"){

openStars();

}

if(gift==="flowers"){

openFlowers();

}

}

});
/*==================================================
LETTER
==================================================*/

const letterText=`Hi Muffin,

Do you remember how we started talking?

Back then, you were just someone I enjoyed talking to.

Then somehow, talking to you became the best part of my day.

I never noticed when I started waiting for your messages, smiling at my phone because of you, or saving little stories just to tell you later.

It's strange...

Once, you were just someone I knew.
Now, you're the person I can't imagine my life without.

And honestly...

That thought scares me more than I can explain.

❤️`;

let letterTypingToken = 0;

async function openLetter(){

letterModal.classList.add("show");

letterArea.innerHTML="";

const myToken = ++letterTypingToken;

for(let i=0;i<letterText.length;i++){

if(myToken !== letterTypingToken) return;

letterArea.innerHTML+=letterText[i];

await sleep(25);

}

}
/*==================================================
STARS
==================================================*/

const facts=[

"⭐ There are more stars in the universe than grains of sand on every beach on Earth.",

"✨ Some of the starlight reaching us tonight left its star before humans existed.",

"🌌 Every atom in your body, other than hydrogen, was forged inside a star.",

"💫 The Milky Way alone holds somewhere between 100 and 400 billion stars.",

"🌠 Betelgeuse, a star you can see with the naked eye, is roughly 700 times wider than our Sun.",

"🌙 Polaris, the North Star, barely moves in our sky because it sits almost directly above Earth's axis.",

"🌟 The constellations we see shift with the seasons as Earth travels around the Sun.",

"❤️ Every time you look up at the stars, know that I'm somewhere wishing you're smiling."

];

function openStars(){

document.getElementById("factBox").innerHTML =
"Tap any star to reveal a fun fact 🌠";

starsModal.classList.add("show");

}

document

.querySelectorAll(".star")

.forEach((star,index)=>{

star.onclick=()=>{

document

.getElementById("factBox")

.innerHTML=facts[index];

}

});
/*==================================================
FLOWERS
==================================================*/

function openFlowers(){

flowersModal.classList.add("show");

}
/*==================================================
CLOSE
==================================================*/

document

.querySelectorAll(".closeGift")

.forEach(button=>{

button.onclick=()=>{

letterTypingToken++; // cancel any in-progress typing

letterModal.classList.remove("show");

starsModal.classList.remove("show");

flowersModal.classList.remove("show");

}

});
/*==================================================
ENDING
==================================================*/

let endingPetalsTimer = null;

document
.getElementById("closeFinalGift")
.onclick = () => {

    flowersModal.classList.remove("show");

    endingScreen.classList.add("show");

    const endingVideo =
    document.getElementById("endingFlowers");

    endingVideo.currentTime = 0;

    endingVideo.play().catch(() => {

        // no video asset available yet — the CSS petal
        // layer below still keeps the moment alive.

    });

    clearInterval(endingPetalsTimer);

    endingPetalsTimer = createPetals(
        document.getElementById("endingPetals")
    );

    replayButton.style.opacity = 0;

    replayButton.style.pointerEvents = "none";

    setTimeout(() => {

        replayButton.style.opacity = 1;

        replayButton.style.pointerEvents = "auto";

    }, 10000);

};
/*==================================================
REPLAY
==================================================*/

replayButton.onclick = () => {

    const endingVideo =
    document.getElementById("endingFlowers");

    endingVideo.pause();

    endingVideo.currentTime = 0;

    clearInterval(endingPetalsTimer);

    document.getElementById("endingPetals").innerHTML = "";

    endingScreen.classList.remove("show");

    document.getElementById("website").style.display = "none";

    document.getElementById("intro").style.display = "flex";

    document.getElementById("intro").style.opacity = "1";

    document.getElementById("intro").style.pointerEvents = "auto";

    document.body.style.overflowY = "hidden";

    window.scrollTo({

        top: 0,

        behavior: "instant"

    });

};
