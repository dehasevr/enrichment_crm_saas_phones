document.addEventListener("DOMContentLoaded", function () {

  let modalMode = "advanced"; // default

  function applyMode() {

    const modal = document.querySelector(".v3-modal");
    const providersSection = document.querySelector(".providers-list");
    const sectionTitle = document.querySelector(".v3-section-title");
    const creditsSummary = document.querySelector(".credits-summary");
    const simpleRow = document.querySelector(".simple-providers-row");

    if (modalMode === "simple") {

      modal.classList.add("simple-mode");

      sectionTitle.style.display = "none";
      providersSection.style.display = "none";
      simpleRow.style.display = "flex";

      creditsSummary.textContent = "Up to 5 credits per result";

    } else {

      modal.classList.remove("simple-mode");

      sectionTitle.style.display = "block";
      providersSection.style.display = "flex";
      simpleRow.style.display = "none";

      updateAverage();
    }
  }

  let activeRows = [];

  const overlay = document.getElementById("v3Overlay");
  const closeBtn = document.getElementById("v3Close");
  const startBtn = document.getElementById("v3Start");
  const averageEl = document.getElementById("averageCredits");

  // =====================
  // OPEN MODAL
  // =====================

  document.addEventListener("click", function (e) {

    const btn = e.target.closest(".get-number");
    const bulkTrigger = e.target.closest("#bulkGetNumbersBtn");

    if (!btn && !bulkTrigger) return;

    // ===== Визначаємо активні рядки =====
    if (btn) {
      activeRows = [btn.closest(".row")];

      // 🔥 Визначаємо режим по типу профілю
      if (btn.closest(".row").dataset.type === "simple") {
        modalMode = "simple";
      } else {
        modalMode = "advanced";
      }
    }

    if (bulkTrigger) {
      activeRows = Array.from(
        document.querySelectorAll(".row-checkbox:checked")
      ).map(cb => cb.closest(".row"));

      // для bulk завжди advanced
      modalMode = "advanced";
    }

    // ===== Застосовуємо режим =====
    applyMode();

    // ===== Відкриваємо модалку =====
    overlay.style.display = "flex";
  });

  // =====================
  // CLOSE MODAL
  // =====================

  closeBtn?.addEventListener("click", function () {
    overlay.style.display = "none";
  });

  // =====================
  // TOGGLE LOGIC
  // =====================

  function updateAverage() {
    const cards = document.querySelectorAll(".provider-card");
    let total = 0;
    let count = 0;

    cards.forEach(card => {
      const isActive = card.querySelector(".toggle")
        .classList.contains("active");

      if (isActive) {
        total += parseInt(card.dataset.credits);
        count++;
      }
    });

    if (count === 0) {
      averageEl.textContent = "~0 per result";
    } else {
      averageEl.textContent =
        "~" + (total / count).toFixed(1) + " per result";
    }
  }

  document.querySelectorAll(".toggle").forEach(toggle => {
    toggle.addEventListener("click", function () {
      this.classList.toggle("active");
      updateAverage();
    });
  });

  updateAverage();

  // =====================
  // DRAG & DROP V3
  // =====================

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

  // =====================
  // START ENRICHMENT
  // =====================

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

  // =====================
  // RETRY
  // =====================

  document.addEventListener("click", function (e) {

    const retryBtn = e.target.closest(".retry-btn");
    if (!retryBtn) return;

    activeRows = [retryBtn.closest(".row")];
    overlay.style.display = "flex";
  });

  // =====================
  // BULK LOGIC
  // =====================

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

  // =====================
  // LAUNCH MODAL
  // =====================

  const launchOverlay = document.getElementById("launchOverlay");
  const launchTryBtn = document.getElementById("launchTryBtn");
  const launchLaterBtn = document.getElementById("launchLaterBtn");

  function closeLaunch() {
    launchOverlay.style.display = "none";
  }

  launchTryBtn?.addEventListener("click", closeLaunch);
  launchLaterBtn?.addEventListener("click", closeLaunch);

  const advancedToggle = document.getElementById("advancedToggle");
  const simpleBlock = document.getElementById("simpleMode");
  const advancedBlock = document.getElementById("advancedMode");

  advancedToggle.addEventListener("change", function () {
    advancedMode.style.display = this.checked ? "block" : "none";
  });

});
