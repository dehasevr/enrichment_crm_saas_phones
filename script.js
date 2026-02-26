document.addEventListener("DOMContentLoaded", function () {

  // =========================
  // STATE
  // =========================
  let activeRow = null;
  let bulkRows = [];
  let isBulkMode = false;
  let popoverLocked = false;
  let isWaterfallAdvanced = false;
  let waterfallProviders = {
    wiza: {
      enabled: true,
      linkedin: true,
      email: true
    },
    zeliq: {
      enabled: true,
      linkedin: true,
      email: true
    },
    apollo: {
      enabled: true,
      linkedin: true,
      email: true
    },
    pdl: {
      enabled: true,
      linkedin: true,
      email: true
    }
  };
  let simpleSelectedProvider = "wiza";

  // =========================
  // ELEMENTS
  // =========================
  const modalOverlay = document.getElementById("modalOverlay");
  const waterfallOverlay = document.getElementById("waterfallModalOverlay");

  const simpleModal = document.getElementById("enrichmentModal");
  const simpleAdvancedToggle = document.getElementById("advancedToggle");

  const waterfallAdvancedToggle = document.getElementById("waterfallAdvancedToggle");
  const advancedList = document.querySelector(".advanced-providers-list");

  const startEnrichmentBtn = document.getElementById("startEnrichmentBtn");
  const waterfallCloseBtn = document.getElementById("waterfallCloseBtn");

  const providerIcons = document.querySelectorAll(".provider-icon-item");
  const popover = document.getElementById("providerPopover");

  const launchOverlay = document.getElementById("launchOverlay");
  const launchTryBtn = document.getElementById("launchTryBtn");
  const launchLaterBtn = document.getElementById("launchLaterBtn");

  const waterfallStartBtn = document.getElementById("waterfallStartBtn");

  // =========================
  // SIMPLE ADVANCED TOGGLE
  // =========================
  if (simpleAdvancedToggle) {
    simpleAdvancedToggle.addEventListener("change", function () {
      if (this.checked) {
        simpleModal.classList.add("advanced-on");
      } else {
        simpleModal.classList.remove("advanced-on");
      }
    });
  }

  const simpleProviderCards = document.querySelectorAll("#modalOverlay .provider-card");

  simpleProviderCards.forEach(card => {

    card.addEventListener("click", function () {

      simpleProviderCards.forEach(c => c.classList.remove("active"));

      this.classList.add("active");

      simpleSelectedProvider = this.dataset.provider;

    });

  });

  // =========================
  // WATERFALL ADVANCED TOGGLE
  // =========================
  if (waterfallAdvancedToggle) {

    waterfallAdvancedToggle.checked = false;
    advancedList.style.display = "none";

    waterfallAdvancedToggle.addEventListener("change", function () {

      isWaterfallAdvanced = this.checked;

      if (isWaterfallAdvanced) {
        advancedList.style.display = "block";
        hidePopover();
      } else {
        advancedList.style.display = "none";
      }
    });
  }

  // =========================
  // OPEN MODALS
  // =========================
  document.addEventListener("click", function (e) {

    const btn = e.target.closest(".get-number");
    if (!btn) return;

    activeRow = btn.closest(".row");
    const name = activeRow.querySelector(".name").textContent;

    // WATERFALL
    if (btn.dataset.waterfall === "true") {
      waterfallOverlay.style.display = "flex";
      return;
    }

    // SIMPLE
    document.querySelector("#modalOverlay .modal-header h2").textContent =
      `Find Phone number for ${name}`;

    modalOverlay.style.display = "flex";

    // reset state
    simpleModal.classList.remove("advanced-on");
    simpleAdvancedToggle.checked = false;
  });

  // =========================
  // CLOSE MODALS
  // =========================
  window.closeModal = function () {
    modalOverlay.style.display = "none";
  };

  waterfallCloseBtn?.addEventListener("click", function () {
    waterfallOverlay.style.display = "none";
    hidePopover();
  });

  // =========================
  // START ENRICHMENT (SIMPLE)
  // =========================
  startEnrichmentBtn?.addEventListener("click", function () {

    modalOverlay.style.display = "none";

    if (isBulkMode) {

      bulkRows.forEach(row => runEnrichment(row));

      document.querySelectorAll(".row-checkbox").forEach(cb => cb.checked = false);
      updateBulkUI();

      isBulkMode = false;
      bulkRows = [];
      return;
    }

    if (activeRow) {
      runEnrichment(activeRow);
    }

  });

  // =========================
  // START ENRICHMENT (WATERFALL)
  // =========================

  waterfallStartBtn?.addEventListener("click", function () {

    waterfallOverlay.style.display = "none";

    if (isBulkMode) {

      bulkRows.forEach(row => runEnrichment(row));

      document.querySelectorAll(".row-checkbox").forEach(cb => cb.checked = false);
      updateBulkUI();

      isBulkMode = false;
      bulkRows = [];
      return;
    }

    if (activeRow) {
      runEnrichment(activeRow);
    }

  });

  // =========================
  // ENRICHMENT SIMULATION
  // =========================
  function runEnrichment(row) {

    const phoneCell = row.children[4];

    phoneCell.innerHTML = `
      <div class="table-loading">
        <div class="spinner small"></div>
        <span>Searching...</span>
      </div>
    `;

    setTimeout(() => {

      const rand = Math.random();

      if (rand < 0.33) {
        phoneCell.innerHTML = `
          <div>+1 202 405 ${Math.floor(1000 + Math.random() * 9000)}</div>
        `;
      }
      else if (rand < 0.66) {
        phoneCell.innerHTML = `
          <div>+1 202 405 ${Math.floor(1000 + Math.random() * 9000)}</div>
          <div>+1 202 811 ${Math.floor(1000 + Math.random() * 9000)}</div>
        `;
      }
      else {
        phoneCell.innerHTML = `
          <span class="not-found">Not found</span>
          <button class="get-number">⚡ Retry</button>
        `;
      }

    }, 1500);
  }

  // =========================
  // POPOVER (WATERFALL)
  // =========================
  providerIcons.forEach(icon => {

    icon.addEventListener("mouseenter", function () {
      if (isWaterfallAdvanced || popoverLocked) return;
      showPopover(icon);
    });

    icon.addEventListener("click", function (e) {
      e.stopPropagation();
      if (isWaterfallAdvanced) return;

      popoverLocked = true;
      showPopover(icon);
    });

  });

  // 🔥 ДОДАЙ ОСЬ ЦЕ НИЖЧЕ
  providerIcons.forEach(icon => {
    const key = icon.dataset.provider;
    updateProviderVisual(icon, key);
  });

  document.addEventListener("click", function () {
    popoverLocked = false;
    hidePopover();
  });

  function showPopover(icon) {

    const providerKey = icon.dataset.provider;
    const providerState = waterfallProviders[providerKey];

    const rect = icon.getBoundingClientRect();

    popover.style.display = "block";
    popover.style.top = rect.bottom + 8 + "px";
    popover.style.left = rect.left + "px";

    popover.innerHTML = `
    <div class="popover-title">${providerKey.toUpperCase()}</div>
    <div class="popover-methods">

      <label>
        <input type="checkbox" data-type="enabled"
          ${providerState.enabled ? "checked" : ""}>
        Enabled
      </label>

      <label>
        <input type="checkbox" data-type="linkedin"
          ${providerState.linkedin ? "checked" : ""}>
        LinkedIn URL
      </label>

      <label>
        <input type="checkbox" data-type="email"
          ${providerState.email ? "checked" : ""}>
        Work Email
      </label>

    </div>
  `;

    // слухач для чекбоксів
    popover.querySelectorAll("input").forEach(input => {

      input.addEventListener("change", function () {

        const type = this.dataset.type;
        waterfallProviders[providerKey][type] = this.checked;

        updateProviderVisual(icon, providerKey);

      });

    });

  }

  function updateProviderVisual(icon, providerKey) {

    const state = waterfallProviders[providerKey];

    if (!state.enabled) {
      icon.style.opacity = "0.35";
      icon.style.filter = "grayscale(100%)";
    } else {
      icon.style.opacity = "1";
      icon.style.filter = "none";
    }

  }

  function hidePopover() {
    popover.style.display = "none";
  }

  // =========================
  // BULK SELECTION LOGIC
  // =========================

  const bulkHeader = document.getElementById("bulkHeader");
  const bulkSelectedCount = document.getElementById("bulkSelectedCount");
  const bulkGetNumbersBtn = document.getElementById("bulkGetNumbersBtn");
  const selectAllCheckbox = document.getElementById("selectAllCheckbox");
  // =========================
  // BULK START ENRICHMENT
  // =========================

  bulkGetNumbersBtn?.addEventListener("click", function () {

    const selected = document.querySelectorAll(".row-checkbox:checked");
    if (selected.length === 0) return;

    bulkRows = [];
    selected.forEach(cb => {
      bulkRows.push(cb.closest(".row"));
    });

    isBulkMode = true;

    document.querySelector("#modalOverlay .modal-header h2").textContent =
      `Find phone numbers for ${bulkRows.length} prospects`;

    modalOverlay.style.display = "flex";

  }); const rowCheckboxes = document.querySelectorAll(".row-checkbox");

  function updateBulkUI() {

    const checked = document.querySelectorAll(".row-checkbox:checked").length;

    if (checked > 0) {
      bulkHeader.style.display = "flex";
      bulkSelectedCount.textContent = checked;
      bulkGetNumbersBtn.disabled = false;
    } else {
      bulkHeader.style.display = "none";
      bulkGetNumbersBtn.disabled = true;
    }
  }

  rowCheckboxes.forEach(cb => {
    cb.addEventListener("change", updateBulkUI);
  });

  selectAllCheckbox?.addEventListener("change", function () {

    rowCheckboxes.forEach(cb => {
      cb.checked = this.checked;
    });

    updateBulkUI();
  });


  // =========================
  // LAUNCH MODAL
  // =========================
  function closeLaunch() {
    launchOverlay.style.display = "none";
  }

  launchTryBtn?.addEventListener("click", closeLaunch);
  launchLaterBtn?.addEventListener("click", closeLaunch);

});