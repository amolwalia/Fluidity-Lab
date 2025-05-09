(function () {
  const nails = document.querySelectorAll(".nail");
  const designData = JSON.parse(localStorage.getItem("nailDesignData"));

  if (designData && designData.length === nails.length) {
    designData.forEach((data, index) => {
      nails[index].style.background = data.background;

      if (data.hasTip) {
        const tip = document.createElement("div");
        tip.className = "french-tip-overlay";
        nails[index].appendChild(tip);
      }
    });
  }
})();

let draggedItem = null;
let selectedDecor = null;
let history = [];

function drag(ev) {
  draggedItem = ev.target.cloneNode(true);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  if (!draggedItem) return;
  const nail = ev.currentTarget;
  const rect = nail.getBoundingClientRect();
  const x = ev.clientX - rect.left;
  const y = ev.clientY - rect.top;

  draggedItem.style.position = "absolute";
  draggedItem.style.left = `${x - 15}px`;
  draggedItem.style.top = `${y - 15}px`;
  draggedItem.style.cursor = "move";
  draggedItem.setAttribute("data-scale", "1");

  draggedItem.classList.add("decor-item");
  draggedItem.setAttribute("draggable", "false");

  draggedItem.onclick = (e) => {
    e.stopPropagation();
    selectDecor(draggedItem);
  };

  makeDraggable(draggedItem);

  nail.appendChild(draggedItem);
  history.push({ nail: nail, decor: draggedItem });
  selectDecor(draggedItem);
  draggedItem = null;
}

function makeDraggable(el) {
  let isDragging = false;
  let offsetX, offsetY;

  el.onmousedown = function (e) {
    selectDecor(el);
    isDragging = true;
    const rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    document.onmousemove = function (e) {
      if (!isDragging) return;
      el.style.left = `${
        e.clientX - el.parentElement.getBoundingClientRect().left - offsetX
      }px`;
      el.style.top = `${
        e.clientY - el.parentElement.getBoundingClientRect().top - offsetY
      }px`;
    };

    document.onmouseup = function () {
      isDragging = false;
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
}

function resizeSelected(delta) {
  if (selectedDecor) {
    let scale = parseFloat(selectedDecor.getAttribute("data-scale")) || 1;
    scale = Math.max(0.2, scale + delta);
    selectedDecor.setAttribute("data-scale", scale.toFixed(2));
    let rotation = selectedDecor.style.transform.match(/rotate\(([^)]*)\)/);
    let angle = rotation ? parseInt(rotation[1]) : 0;
    selectedDecor.style.transform = `rotate(${angle}deg) scale(${scale})`;
    selectedDecor.style.transformOrigin = "center center";
  }
}

function selectDecor(item) {
  document
    .querySelectorAll(".nail .decor-item")
    .forEach((el) => el.classList.remove("selected-decor"));
  item.classList.add("selected-decor");
  selectedDecor = item;
}

function rotateSelected() {
  if (selectedDecor) {
    let currentTransform = selectedDecor.style.transform || "";
    let currentScale =
      parseFloat(selectedDecor.getAttribute("data-scale")) || 1;
    let currentRotation = currentTransform.match(/rotate\(([^)]*)\)/);
    let angle = currentRotation ? parseInt(currentRotation[1]) : 0;
    angle = (angle + 45) % 360;
    selectedDecor.style.transform = `rotate(${angle}deg) scale(${currentScale})`;
    selectedDecor.style.transformOrigin = "center center";
  }
}

function undoDecor() {
  const last = history.pop();
  if (last) {
    last.nail.removeChild(last.decor);
    if (selectedDecor === last.decor) selectedDecor = null;
  }
}

function resetDecor() {
  document.querySelectorAll(".nail").forEach((nail) => (nail.innerHTML = ""));
  history = [];
  selectedDecor = null;
}

function saveAndGoToResults() {
  const nails = document.querySelectorAll(".nail");
  const designData = Array.from(nails).map((nail) => {
    const styles = getComputedStyle(nail);
    const bg = styles.backgroundColor;
    const decorations = Array.from(nail.children).map((decor) => ({
      content: decor.outerHTML,
      left: decor.style.left,
      top: decor.style.top,
      transform: decor.style.transform,
    }));
    return {
      background: bg,
      decorations,
      hasTip: nail.querySelector(".french-tip-overlay") !== null,
    };
  });
  localStorage.setItem("finalNailDesign", JSON.stringify(designData));
  location.href = "results.html";
}

window.onload = function () {
  const designData = JSON.parse(localStorage.getItem("nailDesignData"));
  const nails = document.querySelectorAll(".nail");
  if (designData && Array.isArray(designData)) {
    nails.forEach((nail, index) => {
      const nailData = designData[index];
      if (nailData) {
        nail.style.background = nailData.background;
        if (nailData.hasTip) {
          const tip = document.createElement("div");
          tip.className = "french-tip-overlay";
          tip.style.position = "absolute";
          tip.style.top = "0";
          tip.style.left = "0";
          tip.style.width = "100%";
          tip.style.height = "100%";
          tip.style.pointerEvents = "none";
          tip.style.zIndex = "2";
          tip.style.background =
            "url('./Asset 1.svg') top center / 100% auto no-repeat";
          tip.style.opacity = "1";
          nail.appendChild(tip);
        }
      }
    });
  }
};
