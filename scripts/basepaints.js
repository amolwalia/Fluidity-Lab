let selectedNail = null;

function selectNail(el) {
  document
    .querySelectorAll(".nail")
    .forEach((nail) => (nail.style.borderColor = "#000"));
  selectedNail = el;
  el.style.borderColor = "deeppink";
}

function setColor(color) {
  if (selectedNail) {
    selectedNail.style.background = color;
  }
}

function resetColors() {
  document
    .querySelectorAll(".nail")
    .forEach((nail) => (nail.style.background = "white"));
}
function saveNailColorsAndGoNext() {
  const colors = Array.from(document.querySelectorAll(".nail")).map(
    (nail) => nail.style.background
  );
  localStorage.setItem("nailColors", JSON.stringify(colors));
  location.href = "decorate.html";
}
