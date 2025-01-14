function search(type) {
  const searchValue = document.getElementById("search").value.trim();
  const searchDiv = document.getElementById("searchResult");

  // Clear previous search results
  searchDiv.innerHTML = "";

  let data;
  let key;
  switch (type) {
    case "genre":
      data = genres;
      key = "genre";
      break;
    case "artist":
      data = artists;
      key = "artist";
      break;
    case "song":
      data = songs;
      key = "song";
      break;
    default:
      console.error("Invalid search type");
      return;
  }

  const searchResult = data.filter((item) => {
    const value = item[key];
  
    if (Array.isArray(value)) {
      // Check if any item in the array matches the search value
      return value.some((genre) =>
        genre.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    
    // For non-array values (strings)
    return typeof value === "string" && value.toLowerCase().includes(searchValue.toLowerCase());
  });

  if (searchResult.length === 0) {
    const message = document.createElement("div");
    message.className = "one_searchbar-history_item";
    message.textContent = `${searchValue} is not existed`;
    searchDiv.appendChild(message);
  } else {
    const fragment = document.createDocumentFragment();

    searchResult.forEach((item) => {
      const ul = document.createElement("ul");
      ul.className = "one_searchbar-history_list";
      const li = document.createElement("li");
      li.className = "one_searchbar-history_item";
      const link = document.createElement("a");
      link.href = `/${type}/${item.title}`;
      link.innerHTML = `
        <span>
          <img src="/images/${item.title}.jpg" onerror="this.onerror=null; this.src='/images/null.png'" style="width: 50px; height: 50px" alt="${item.title}" />
        </span>
        <span>${item[key]}</span><br>`;
      li.appendChild(link);
      ul.appendChild(li);
      fragment.appendChild(ul);
    });

    searchDiv.appendChild(fragment);
  }

  if (!searchValue) {
    searchDiv.innerHTML = "";
  }
}