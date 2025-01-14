function selector() {
  const artistValue = document
    .getElementById("artist")
    .value.trim()
    .toLowerCase();
  const artistSelect = document.getElementById("selector");
  if (artistValue) {
    artistSelect.style.display = "block";
    artistSelect.innerHTML = "";

    if (artistValue) {
      artistResult.forEach((artist) => {
        if (
          artist &&
          artist.artist &&
          artist.artist.toLowerCase().includes(artistValue)
        ) {
          const span = document.createElement("span")
          span.className = "artist-name";
          span.textContent = artist.artist;
          span.onclick = function () {
            document.getElementById("artist").value = artist.artist;
            artistSelect.style.display = "none";
          };
          artistSelect.appendChild(span);
        }
      });
    } else {
      artistSelect.innerHTML = "";
    }
  } else {
    artistSelect.style.display = "none";
  }
}
