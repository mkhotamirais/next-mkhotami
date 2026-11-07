// Dijalankan di <head> sebelum cat pertama. Tidak boleh memakai backtick, ${}, atau backslash.
export const appwriteScript = `(function () {
  function initials(t) {
    return t.split(" ").filter(Boolean).slice(0, 2)
      .map(function (w) { return Array.from(w)[0]; }).join("").toUpperCase();
  }

  try {
    var r = document.documentElement;

    // 1. Sudah login? Cari sesi aktif di cookieFallback.
    //    Saat logout isinya [] (array), jadi hanya objek yang dihitung.
    var loggedIn = false;
    var raw = localStorage.getItem("cookieFallback");
    var data = raw ? JSON.parse(raw) : null;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      for (var k in data) {
        if (
          k.indexOf("a_session_") === 0 &&
          typeof data[k] === "string" &&
          data[k] !== "" &&
          data[k] !== "deleted"
        ) {
          loggedIn = true;
          break;
        }
      }
    }

    var role = "guest";
    if (loggedIn) {
      // Belum ada data tampilan = pending (tidak ada tombol yang tampil)
      role = "pending";

      // 2. Data tampilan yang disimpan useAuth
      var u = JSON.parse(localStorage.getItem("aw_user") || "null");
      if (u && u.role) {
        role = u.role === "ADMIN" ? "ADMIN" : "USER";

        if (u.name) {
          r.style.setProperty("--aw-name", JSON.stringify(u.name));
          r.style.setProperty("--aw-initials", JSON.stringify(initials(u.name)));
        }
        if (typeof u.image === "string" && u.image.indexOf("https://") === 0) {
          r.style.setProperty("--aw-image", "url(" + JSON.stringify(u.image) + ")");
        }
      }
    }

    r.dataset.awRole = role;
  } catch (e) {}
})();`;
