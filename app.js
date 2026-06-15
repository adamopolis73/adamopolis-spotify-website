// Turns the playlists you listed in playlists.js into embedded Spotify players.
// You shouldn't need to edit this file.

(function () {
  // Fill in the header text.
  if (typeof PAGE_INFO === "object") {
    document.getElementById("title").textContent =
      (PAGE_INFO.name ? PAGE_INFO.name + "'s" : "My") + " Spotify Playlists";
    document.getElementById("tagline").textContent = PAGE_INFO.tagline || "";
  }

  // Pull the playlist ID out of any normal Spotify share link.
  function playlistId(url) {
    if (!url) return null;
    var m = String(url).match(/playlist[/:]([A-Za-z0-9]+)/);
    return m ? m[1] : null;
  }

  var container = document.getElementById("playlists");
  var list = typeof MY_PLAYLISTS !== "undefined" ? MY_PLAYLISTS : [];

  if (!list.length) {
    document.getElementById("empty").hidden = false;
    return;
  }

  list.forEach(function (p) {
    var id = playlistId(p.url);
    var card = document.createElement("section");
    card.className = "card";

    var h2 = document.createElement("h2");
    h2.textContent = p.title || "Untitled playlist";
    card.appendChild(h2);

    if (p.note) {
      var note = document.createElement("p");
      note.className = "note";
      note.textContent = p.note;
      card.appendChild(note);
    }

    if (id) {
      var iframe = document.createElement("iframe");
      iframe.src =
        "https://open.spotify.com/embed/playlist/" + id + "?utm_source=generator";
      iframe.width = "100%";
      iframe.height = "420";
      iframe.frameBorder = "0";
      iframe.loading = "lazy";
      iframe.allow =
        "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
      iframe.style.borderRadius = "12px";
      card.appendChild(iframe);
    } else {
      var warn = document.createElement("p");
      warn.className = "warn";
      warn.textContent =
        "⚠️ Couldn't read this Spotify link. Make sure it looks like https://open.spotify.com/playlist/...";
      card.appendChild(warn);
    }

    container.appendChild(card);
  });
})();
