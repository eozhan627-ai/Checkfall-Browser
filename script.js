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

const votes = {
    friends: Number(localStorage.getItem("friendsVotes")) || 0,
    clans: Number(localStorage.getItem("clansVotes")) || 0,
    ranked: Number(localStorage.getItem("rankedVotes")) || 0,
    replays: Number(localStorage.getItem("replaysVotes")) || 0,
};

Object.keys(votes).forEach((key) => {
    const el = document.getElementById(key);
    if (el) el.textContent = votes[key];
});

let pendingVote = null;

/* ================= POPUP ================= */

function showPopup(title, text) {
    document.getElementById("popup-title").textContent = title;
    document.getElementById("popup-text").textContent = text;

    document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
    document.getElementById("popup").classList.add("hidden");
    pendingVote = null;
}

/* ================= VOTE FLOW ================= */

function vote(option) {
    const alreadyVoted = localStorage.getItem("checkfallVote");

    if (alreadyVoted) {
        showPopup(
            "Vote already used",
            "You can only vote once. This action is final."
        );
        return;
    }

    pendingVote = option;

    showPopup(
        "Confirm vote",
        `Do you want to vote for "${option}"? This cannot be changed.`
    );

    const btn = document.getElementById("confirmVoteBtn");

    btn.onclick = confirmVote;
}

function confirmVote() {
    if (!pendingVote) return;

    votes[pendingVote]++;

    localStorage.setItem(`${pendingVote}Votes`, votes[pendingVote]);
    localStorage.setItem("checkfallVote", "true");

    const el = document.getElementById(pendingVote);
    if (el) el.textContent = votes[pendingVote];

    closePopup();
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