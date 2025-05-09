let selectedNail = null;

function selectNail(el) {
  document
    .querySelectorAll(".nail")
    .forEach((nail) => (nail.style.borderColor = "#000"));
  selectedNail = el;
  el.style.borderColor = "deeppink";
}

function setColor(color, isFrenchTip = false) {
  if (selectedNail) {
    selectedNail.style.background = color;
    const existingTip = selectedNail.querySelector(".french-tip-overlay");
    if (existingTip) existingTip.remove();
    if (isFrenchTip) {
      const tip = document.createElement("div");
      tip.className = "french-tip-overlay";
      selectedNail.appendChild(tip);
    }
  }
}

function resetColors() {
  document.querySelectorAll(".nail").forEach((nail) => {
    nail.style.background = "white";
    const tip = nail.querySelector(".french-tip-overlay");
    if (tip) tip.remove();
  });
}

function saveNailColorsAndGoNext() {
  const nails = document.querySelectorAll(".nail");
  const designData = Array.from(nails).map((nail) => {
    return {
      background: nail.style.background,
      hasTip: !!nail.querySelector(".french-tip-overlay"),
    };
  });
  localStorage.setItem("nailDesignData", JSON.stringify(designData));
  location.href = "decorate.html";
}
