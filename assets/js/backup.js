// ================= EXPORT =================

document.getElementById("btnExportData")?.addEventListener("click", () => {

  const backup = {

    bills: JSON.parse(
      localStorage.getItem("bills") || "[]"
    ),

    settings: JSON.parse(
      localStorage.getItem("settings") || "{}"
    ),

    kho: JSON.parse(
      localStorage.getItem("kho") || "[]"
    ),

    backupDate: new Date().toISOString()
  };

  const blob = new Blob(
    [JSON.stringify(backup, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download =
    "backup-quandientien-" +
    new Date().toISOString().slice(0,10) +
    ".json";

alert("Đang tạo file backup...");

  a.click();

  URL.revokeObjectURL(url);

});

// ================= IMPORT =================

document.getElementById("importDataFile")
?.addEventListener("change", (e) => {

  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {

    try {

      const data = JSON.parse(event.target.result);

      if (data.bills) {
        localStorage.setItem(
          "bills",
          JSON.stringify(data.bills)
        );
      }

      if (data.settings) {
        localStorage.setItem(
          "settings",
          JSON.stringify(data.settings)
        );
      }

      if (data.kho) {
        localStorage.setItem(
          "kho",
          JSON.stringify(data.kho)
        );
      }

      alert("Khôi phục dữ liệu thành công!");

      location.reload();

    } catch {

      alert("File không hợp lệ!");

    }

  };

  reader.readAsText(file);

});

// ================= CLEAR =================

document.getElementById("btnClearAllData")
?.addEventListener("click", () => {

  if (
    !confirm(
      "Xóa toàn bộ hóa đơn, kho và cài đặt?"
    )
  ) return;

  localStorage.removeItem("bills");
  localStorage.removeItem("settings");
  localStorage.removeItem("kho");

  alert("Đã xóa toàn bộ dữ liệu");

  location.reload();

});