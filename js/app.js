/* ==========================================
   APP.JS
   Main Application Controller
========================================== */

const App = {

    initialized: false,

    async init() {

        if (this.initialized) return;

        this.initialized = true;

        console.log("❤️ Love Website Started");

        await this.checkSupabase();

        this.initializeEvents();

        await this.loadEverything();

    },

    async checkSupabase() {

        try {

            const { error } = await db
                .from(CONFIG.tableName)
                .select("id")
                .limit(1);

            if (error) {

                console.error(error);

                this.showError(
                    "Couldn't connect to Supabase."
                );

                return;

            }

            console.log("✅ Connected to Supabase");

        }

        catch (err) {

            console.error(err);

            this.showError(
                "Supabase connection failed."
            );

        }

    },

    initializeEvents() {

        window.addEventListener(

            "online",

            () => {

                console.log("🌍 Internet Connected");

            }

        );

        window.addEventListener(

            "offline",

            () => {

                this.showError(

                    "No internet connection."

                );

            }

        );

    },

    async loadEverything() {

        try {

            await loadGallery();

            await loadMemoryManager();

        }

        catch (err) {

            console.error(err);

        }

    },

    showError(message) {

        const div = document.createElement("div");

        div.className = "error";

        div.innerHTML = message;

        document.body.appendChild(div);

        setTimeout(() => {

            div.remove();

        },4000);

    }

};

/* ==========================================
   PRELOAD IMAGES
========================================== */

async function preloadImages(){

    const memories = await getMemories();

    memories.forEach(memory=>{

        const img = new Image();

        img.src = memory.image_url;

    });

}

/* ==========================================
   KEYBOARD SHORTCUT
========================================== */

document.addEventListener(

    "keydown",

    e=>{

        if(

            e.ctrlKey &&

            e.shiftKey &&

            e.key==="A"

        ){

            adminPanel.style.display="flex";

        }

    }

);

/* ==========================================
   ESC CLOSES ADMIN
========================================== */

document.addEventListener(

    "keydown",

    e=>{

        if(

            e.key==="Escape"

        ){

            adminPanel.style.display="none";

        }

    }

);

/* ==========================================
   AUTO REFRESH
========================================== */

setInterval(

    async()=>{

        await checkForMemoryUpdates();

    },

    30000

);

/* ==========================================
   PRELOAD ON START
========================================== */

window.addEventListener(

    "load",

    preloadImages

);

/* ==========================================
   START APPLICATION
========================================== */

window.addEventListener(

    "load",

    ()=>{

        App.init();

    }

);