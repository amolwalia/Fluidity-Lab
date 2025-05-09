const saved = JSON.parse(localStorage.getItem("finalNailDesign"));
const container = document.getElementById("resultsContainer");

if (saved && Array.isArray(saved)) {
  saved.forEach((nailData) => {
    const nail = document.createElement("div");
    nail.classList.add("nail");
    nail.style.background = nailData.background;
    if (nailData.hasTip) {
      const tip = document.createElement("div");
      tip.className = "french-tip-overlay";
      nail.appendChild(tip);
    }

    nailData.decorations.forEach((decor) => {
      const deco = document.createElement("div");
      deco.classList.add("decor-item");
      const wrapper = document.createElement("div");
      wrapper.className = "decor-item";
      wrapper.style.left = decor.left;
      wrapper.style.top = decor.top;
      wrapper.style.transform = decor.transform;
      wrapper.style.transformOrigin = "center center";
      wrapper.innerHTML = decor.content;
      nail.appendChild(wrapper);
      deco.style.left = decor.left;
      deco.style.top = decor.top;
      deco.style.transform = decor.transform;
      deco.style.transformOrigin = "center center";
      nail.appendChild(deco);
    });

    container.appendChild(nail);
  });
} else {
  container.innerHTML = "<p>No design found. Go back and decorate first!</p>";
}

function downloadImage() {
  const target = document.getElementById("nailScreenshot");
  html2canvas(target).then((canvas) => {
    const link = document.createElement("a");
    link.download = "my-nail-design.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}

function shareDesign() {
  const shareText = `Check out my custom nail design! 💅\nCreate your own here: https://your-nail-app-url.com`;
  if (navigator.share) {
    navigator
      .share({
        title: "My Nail Design",
        text: shareText,
        url: window.location.href,
      })
      .catch(console.error);
  } else {
    alert("Sharing not supported. You can copy and share the link instead!");
  }
}
