/* ==========================================
   ADMIN PANEL
========================================== */

const adminPanel = document.getElementById("adminPanel");
const adminToggle = document.querySelector(".admin-toggle");

const adminLoginBox = document.getElementById("adminLoginBox");
const adminContentBox = document.getElementById("adminContentBox");
const adminPasswordInput = document.getElementById("adminPasswordInput");
const adminLoginBtn = document.getElementById("adminLoginBtn");
const adminLoginError = document.getElementById("adminLoginError");

const ADMIN_PASSWORD = "iloveyou";

let adminUnlocked = false;

const titleInput = document.getElementById("memoryTitle");
const descriptionInput = document.getElementById("memoryDescription");

const imageInput = document.getElementById("memoryImage");
const preview = document.getElementById("imagePreview");

const uploadBtn = document.getElementById("uploadBtn");

const memoryList = document.getElementById("memoryList");

/* ==========================================
   ADMIN OPEN/CLOSE
========================================== */

adminToggle.addEventListener("click", () => {

    adminPanel.style.display = "flex";

    if (adminUnlocked) {

        adminLoginBox.style.display = "none";

        adminContentBox.style.display = "block";

    } else {

        adminPasswordInput.value = "";

        adminLoginError.style.display = "none";

        adminContentBox.style.display = "none";

        adminLoginBox.style.display = "block";

        adminPasswordInput.focus();

    }

});

adminPanel.addEventListener("click", (e) => {

    if (e.target === adminPanel) {

        adminPanel.style.display = "none";

    }

});

/* ==========================================
   ADMIN LOGIN
========================================== */

function checkAdminPassword() {

    const entered = adminPasswordInput.value

        .trim()

        .toLowerCase()

        .replace(/\s+/g, "");

    if (entered === ADMIN_PASSWORD) {

        adminUnlocked = true;

        adminLoginError.style.display = "none";

        adminLoginBox.style.display = "none";

        adminContentBox.style.display = "block";

        loadMemoryManager();

    } else {

        adminLoginError.style.display = "block";

        adminPasswordInput.value = "";

        adminPasswordInput.focus();

    }

}

adminLoginBtn.addEventListener("click", checkAdminPassword);

adminPasswordInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        checkAdminPassword();

    }

});

/* ==========================================
   IMAGE PREVIEW
========================================== */

imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if (!file) return;

    if (!CONFIG.allowedImageTypes.includes(file.type)) {

        alert("Please choose a valid image.");

        imageInput.value = "";

        return;

    }

    if (file.size > CONFIG.maxImageSize) {

        alert("Image is too large.");

        imageInput.value = "";

        return;

    }

    const reader = new FileReader();

    reader.onload = function (e) {

        preview.src = e.target.result;

        preview.style.display = "block";

    };

    reader.readAsDataURL(file);

});

/* ==========================================
   CLEAR FORM
========================================== */

function clearForm() {

    titleInput.value = "";

    descriptionInput.value = "";

    imageInput.value = "";

    preview.src = "";

    preview.style.display = "none";

}

/* ==========================================
   SHOW STATUS
========================================== */

function showStatus(message, success = true) {

    uploadBtn.innerText = message;

    uploadBtn.style.opacity = ".8";

    if (!success) {

        uploadBtn.style.background = "#d63031";

    } else {

        uploadBtn.style.background = "";

    }

    setTimeout(() => {

        uploadBtn.innerText = "Upload Memory ❤️";

        uploadBtn.style.opacity = "1";

        uploadBtn.style.background = "";

    }, 2500);

}

/* ==========================================
   UPLOAD MEMORY
========================================== */

uploadBtn.addEventListener("click", async () => {

    const title = titleInput.value.trim();

    const description = descriptionInput.value.trim();

    const file = imageInput.files[0];

    if (!title || !description || !file) {

        alert("Please complete all fields.");

        return;

    }

    uploadBtn.disabled = true;

    uploadBtn.innerText = "Uploading...";

    /* Upload Image */

    const uploaded = await uploadImage(file);

    if (!uploaded.success) {

        showStatus("Upload Failed", false);

        uploadBtn.disabled = false;

        return;

    }

    /* Save Database */

    const saved = await saveMemory(

        title,

        description,

        uploaded.url,

        uploaded.path

    );

    if (!saved) {

        showStatus("Database Error", false);

        uploadBtn.disabled = false;

        return;

    }

    clearForm();

    await refreshGallery();

    await loadMemoryManager();

    uploadBtn.disabled = false;

    showStatus("Memory Saved ❤️");

});

/* ==========================================
   LOAD MEMORY MANAGER
========================================== */

async function loadMemoryManager() {

    memoryList.innerHTML = "";

    const memories = await getMemories();

    memories.forEach(memory => {

        const item = document.createElement("div");

        item.className = "memory-item";

        item.innerHTML = `

            <img src="${memory.image_url}">

            <div class="memory-info">

                <h4>${memory.title}</h4>

                <p>${memory.description}</p>

            </div>

            <div class="memory-actions">

                <button
                    class="edit-btn"
                    data-id="${memory.id}">

                    Edit

                </button>

                <button
                    class="delete-btn"
                    data-id="${memory.id}"
                    data-path="${memory.image_path}">

                    Delete

                </button>

            </div>

        `;

        memoryList.appendChild(item);

    });

    attachDeleteEvents();

    attachEditEvents();

}

/* ==========================================
   DELETE
========================================== */

function attachDeleteEvents() {

    document

    .querySelectorAll(".delete-btn")

    .forEach(btn => {

        btn.onclick = async () => {

            if (!confirm("Delete this memory?"))

                return;

            await deleteMemory(

                btn.dataset.id,

                btn.dataset.path

            );

            await refreshGallery();

            await loadMemoryManager();

        };

    });

}

/* ==========================================
   EDIT
========================================== */

function attachEditEvents() {

    document

    .querySelectorAll(".edit-btn")

    .forEach(btn => {

        btn.onclick = async () => {

            const title = prompt("New Title");

            if (title === null) return;

            const description = prompt("New Description");

            if (description === null) return;

            await updateMemory(

                btn.dataset.id,

                title,

                description

            );

            await refreshGallery();

            await loadMemoryManager();

        };

    });

}

/* ==========================================
   START
   loadMemoryManager now runs only after a
   correct password (see checkAdminPassword).
========================================== */