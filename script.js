document.addEventListener("DOMContentLoaded", function () {

let modalMode = "advanced";
let activeRows = [];

// =================
// ELEMENTS
// =================

const overlay = document.getElementById("v3Overlay");
const closeBtn = document.getElementById("v3Close");
const startBtn = document.getElementById("v3Start");

const simpleRow = document.querySelector(".simple-providers-row");
const advancedBlock = document.getElementById("advancedMode");

const sectionTitle = document.querySelector(".v3-section-title");
const averageEl = document.getElementById("averageCredits");

// =================
// MODE SWITCH
// =================

function applyMode() {

if (modalMode === "simple") {

sectionTitle.style.display = "none";
advancedBlock.style.display = "none";
simpleRow.style.display = "flex";

averageEl.textContent = "Up to 5 credits per result";

} else {

sectionTitle.style.display = "block";
advancedBlock.style.display = "block";
simpleRow.style.display = "none";

updateAverage();

}

}

// =================
// OPEN MODAL
// =================

document.addEventListener("click", function (e) {

const btn = e.target.closest(".get-number");
const bulkTrigger = e.target.closest("#bulkGetNumbersBtn");

if (!btn && !bulkTrigger) return;

// single
if (btn) {

activeRows = [btn.closest(".row")];

if (btn.closest(".row").dataset.type === "simple") {
modalMode = "simple";
} else {
modalMode = "advanced";
}

}

// bulk
if (bulkTrigger) {

activeRows = Array.from(
document.querySelectorAll(".row-checkbox:checked")
).map(cb => cb.closest(".row"));

modalMode = "advanced";

}

advancedToggle.checked = modalMode === "advanced";

applyMode();
overlay.style.display = "flex";

});

// =================
// CLOSE MODAL
// =================

closeBtn?.addEventListener("click", function () {
overlay.style.display = "none";
});

// =================
// CREDITS CALC
// =================

function updateAverage() {

const providers = document.querySelectorAll(".provider-card");

let total = 0;
let active = 0;

providers.forEach(provider => {

const toggle = provider.querySelector(".toggle");

if (toggle.classList.contains("active")) {

const credits = Number(provider.dataset.credits);

total += credits;
active++;

}

});

const result = active ? (total / active).toFixed(1) : 0;

averageEl.textContent = `~${result} per result`;

}

// =================
// TOGGLE PROVIDERS
// =================

document.querySelectorAll(".toggle").forEach(toggle => {

toggle.addEventListener("click", function () {

this.classList.toggle("active");

updateAverage();

});

});

// =================
// DRAG & DROP
// =================

let draggedCard = null;

document.querySelectorAll(".provider-card").forEach(card => {

card.setAttribute("draggable", true);

card.addEventListener("dragstart", function () {

draggedCard = this;
this.style.opacity = "0.5";

});

card.addEventListener("dragend", function () {

this.style.opacity = "1";
draggedCard = null;

});

card.addEventListener("dragover", function (e) {

e.preventDefault();

});

card.addEventListener("drop", function (e) {

e.preventDefault();

if (draggedCard === this) return;

const container = this.parentNode;
const cards = Array.from(container.children);

const draggedIndex = cards.indexOf(draggedCard);
const targetIndex = cards.indexOf(this);

if (draggedIndex < targetIndex) {

container.insertBefore(draggedCard, this.nextSibling);

} else {

container.insertBefore(draggedCard, this);

}

updateAverage();

});

});

// =================
// START ENRICHMENT
// =================

startBtn?.addEventListener("click", function () {

overlay.style.display = "none";

activeRows.forEach(row => {

const phoneCell = row.children[4];

phoneCell.innerHTML = `
<div class="phone progress">
<div class="spinner small"></div>
In progress
</div>
`;

setTimeout(() => {

const rand = Math.random();

if (rand < 0.3) {

phoneCell.innerHTML = `
<div class="phone notfound">
Not found
<button class="icon-btn retry-btn">↻</button>
</div>
`;

return;

}

if (rand < 0.7) {

phoneCell.innerHTML = `
<div class="phone">
+1 202 ${Math.floor(1000000 + Math.random() * 9000000)}
</div>
`;

return;

}

phoneCell.innerHTML = `
<div class="phone">
+1 202 ${Math.floor(1000000 + Math.random() * 9000000)}
</div>
<div class="phone">
+1 415 ${Math.floor(1000000 + Math.random() * 9000000)}
</div>
`;

}, 1500);

});

});

// =================
// RETRY
// =================

document.addEventListener("click", function (e) {

const retryBtn = e.target.closest(".retry-btn");
if (!retryBtn) return;

activeRows = [retryBtn.closest(".row")];

overlay.style.display = "flex";

});

// =================
// BULK
// =================

const bulkHeader = document.getElementById("bulkHeader");
const bulkSelectedCount = document.getElementById("bulkSelectedCount");
const bulkBtn = document.getElementById("bulkGetNumbersBtn");
const selectAllCheckbox = document.getElementById("selectAllCheckbox");

function updateBulkState() {

const checked = document.querySelectorAll(".row-checkbox:checked");
const count = checked.length;

if (count > 0) {

bulkHeader.style.display = "flex";
bulkSelectedCount.textContent = count;
bulkBtn.disabled = false;

} else {

bulkHeader.style.display = "none";
bulkBtn.disabled = true;

}

}

document.querySelectorAll(".row-checkbox")
.forEach(cb => cb.addEventListener("change", updateBulkState));

selectAllCheckbox?.addEventListener("change", function () {

document.querySelectorAll(".row-checkbox")
.forEach(cb => cb.checked = this.checked);

updateBulkState();

});

// =================
// LAUNCH MODAL
// =================

const launchOverlay = document.getElementById("launchOverlay");
const launchTryBtn = document.getElementById("launchTryBtn");
const launchLaterBtn = document.getElementById("launchLaterBtn");

function closeLaunch() {
launchOverlay.style.display = "none";
}

launchTryBtn?.addEventListener("click", closeLaunch);
launchLaterBtn?.addEventListener("click", closeLaunch);

// =================
// INIT
// =================

updateAverage();

const advancedToggle = document.getElementById("advancedToggle");

advancedToggle?.addEventListener("change", function () {

  if (this.checked) {
    modalMode = "advanced";
  } else {
    modalMode = "simple";
  }

  applyMode();

});

});