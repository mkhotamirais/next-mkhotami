// Jalan di <head> sebelum body digambar. Membaca cookie hint yang ditulis proxy.
// Jangan pakai backtick atau ${ di dalamnya (ini template string).

// export const shopScript = `
// (function () {
//   try {
//     var root = document.documentElement;
//     var cookies = document.cookie;

//     function get(name) {
//       var m = cookies.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
//       return m ? decodeURIComponent(m[1]) : null;
//     }

//     var role = get("auth_hint");
//     if (role !== "user" && role !== "admin") {
//       root.dataset.auth = "0";
//       return;
//     }

//     root.dataset.auth = "1";
//     root.dataset.role = role;

//     var name = get("auth_name");
//     if (name) {
//       name = name.replace(/[\\u0000-\\u001f\\u007f]/g, "");
//       root.style.setProperty("--user-name", JSON.stringify(name));
//     }
//   } catch (e) {}
// })();
// `;

// Dijalankan di <head> sebelum cat pertama. Tidak boleh memakai backtick atau ${}.
// Dijalankan di <head> sebelum cat pertama. Tidak boleh memakai backtick atau ${}.
// Dijalankan di <head> sebelum cat pertama. Tidak boleh memakai backtick, ${}, atau backslash.

export const shopScript = `(function () {
  try {
    var r = document.documentElement;
    var c = document.cookie;

    function get(name) {
      var m = c.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
      if (!m) return null;
      try { return decodeURIComponent(m[1]); } catch (e) { return m[1]; }
    }

    function initials(t) {
      return t.split(" ").filter(Boolean).slice(0, 2)
        .map(function (w) { return Array.from(w)[0]; }).join("").toUpperCase();
    }

    var role = "guest";
    if (get("auth_hint") === "1") {
      var v = get("auth_role");
      role = v ? (v === "ADMIN" ? "ADMIN" : "USER") : "pending";

      var n = get("auth_name");
      if (n) {
        r.style.setProperty("--auth-name", JSON.stringify(n));
        r.style.setProperty("--auth-initials", JSON.stringify(initials(n)));
      }

      var img = get("auth_image");
      if (img && img.indexOf("https://") === 0) {
        r.style.setProperty("--auth-image", "url(" + JSON.stringify(img) + ")");
        // r.style.setProperty("--auth-image", img);
        // Mulai unduh foto lebih awal supaya siap saat avatar dicat
        var l = document.createElement("link");
        l.rel = "preload"; l.as = "image"; l.href = img;
        document.head.appendChild(l);
      }
    }
    r.dataset.role = role;
  } catch (e) {}
})();`;
