(function () {
  function markLoaded(shell) {
    shell.classList.add("is-loaded");
  }

  function wrapImage(img) {
    if (!img || img.closest(".media-shell")) {
      return;
    }

    var shell = document.createElement("span");
    shell.className = "media-shell";

    if (img.classList.contains("profile-shot")) {
      shell.classList.add("media-shell-profile");
    } else if (img.classList.contains("project-logo") || img.classList.contains("career-logo")) {
      shell.classList.add("media-shell-logo");
    } else {
      shell.classList.add("media-shell-image");
    }

    img.parentNode.insertBefore(shell, img);
    shell.appendChild(img);
    img.loading = img.loading || "lazy";
    img.decoding = img.decoding || "async";

    if (img.complete) {
      markLoaded(shell);
      return;
    }

    img.addEventListener("load", function () {
      markLoaded(shell);
    }, { once: true });

    img.addEventListener("error", function () {
      shell.classList.add("is-error");
      markLoaded(shell);
    }, { once: true });
  }

  function wrapObject(doc) {
    if (!doc || doc.closest(".media-shell")) {
      return;
    }

    var shell = document.createElement("div");
    shell.className = "media-shell media-shell-document";
    var loader = document.createElement("div");
    loader.className = "media-loader-copy";
    loader.textContent = "Loading document";

    doc.parentNode.insertBefore(shell, doc);
    shell.appendChild(doc);
    shell.appendChild(loader);

    doc.addEventListener("load", function () {
      markLoaded(shell);
    }, { once: true });

    window.setTimeout(function () {
      markLoaded(shell);
    }, 4000);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var images = document.querySelectorAll("img");
    var documents = document.querySelectorAll("object[type='application/pdf']");

    images.forEach(wrapImage);
    documents.forEach(wrapObject);
  });
})();
