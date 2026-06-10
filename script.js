const API_URL = "https://checkfall-browser-server.onrender.com";

function toggleMenu() {
    const nav = document.getElementById("navLinks");
    if (nav) nav.classList.toggle("active");
}

/* ================= NAV ACTIVE STATE ================= */

const sections = document.querySelectorAll("section, header");
const navLinks = document.querySelectorAll(".nav-links a");

function setActiveNav() {
    let current = "";

    sections.forEach((section) => {
        const top = section.offsetTop - 160;

        if (window.scrollY >= top) {
            current = section.id;
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
}

window.addEventListener("scroll", setActiveNav);

window.addEventListener("load", () => {
    setActiveNav();
});

/* ================= VOTING SYSTEM ================= */
fetch(`${API_URL}/votes`)
    .then(res => res.json())
    .then(data => {
        Object.keys(data).forEach(key => {
            const el = document.getElementById(key);

            if (el) {
                el.textContent = data[key];
            }
        });
    })
    .catch(err => {
        console.error("Could not load votes:", err);
    });

let pendingVote = null;

/* ================= POPUP ================= */

function showPopup(title, text) {
    document.getElementById("popup-title").textContent = title;
    document.getElementById("popup-text").textContent = text;

    document.getElementById("popup").classList.remove("hidden");
}
function closePopup() {
    document.getElementById("popup")
        .classList.add("hidden");

    document.getElementById("confirmVoteBtn")
        .style.display = "block";

    pendingVote = null;
}

/* ================= VOTE FLOW ================= */
function vote(option) {
    const alreadyVoted = localStorage.getItem("checkfallVote") === "true";

    if (alreadyVoted) {
        showPopup(
            "Vote already used",
            "You can only vote once."
        );

        document.getElementById("confirmVoteBtn").style.display = "none";

        return;
    }

    pendingVote = option;

    showPopup(
        "Confirm vote",
        `Vote for "${option}"? This cannot be changed.`
    );

    document.getElementById("confirmVoteBtn").onclick = confirmVote;
}
function confirmVote() {
    if (!pendingVote) return;

    const option = pendingVote;

    const el = document.getElementById(option);

    // optimistic update
    if (el) {
        el.textContent = Number(el.textContent) + 1;
    }

    localStorage.setItem("checkfallVote", "true");

    closePopup();
    pendingVote = null;

    fetch(`${API_URL}/vote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ option })
    })
        .then(res => res.json())
        .then(data => {
            Object.keys(data).forEach(key => {
                const element = document.getElementById(key);

                if (element) {
                    element.textContent = data[key];
                }
            });
        })
        .catch(err => {
            console.error("Vote sync failed:", err);
        });
}
/* ================= OPTIONAL: SMOOTH SCROLL SAFETY ================= */

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            e.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});