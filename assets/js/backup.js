// ================= EXPORT =================

document.getElementById("btnExportData")
?.addEventListener("click", () => {

  const backup = {

    bills: JSON.parse(
      localStorage.getItem("bills") || "[]"
    ),

    settings: JSON.parse(
      localStorage.getItem("settings") || "{}"
    ),

    khoParts: JSON.parse(
      localStorage.getItem("khoParts") || "[]"
    ),

    jobs: JSON.parse(
      localStorage.getItem("jobs") || "[]"
    ),

    backupDate: new Date().toISOString()

  };

  const blob = new Blob(
    [JSON.stringify(backup, null, 2)],
    {
      type: "application/json"
    }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download =
    "backup-quandientien-" +
    new Date().toISOString().slice(0,10) +
    ".json";

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  URL.revokeObjectURL(url);

  if (typeof showToast === "function") {
    showToast("Đã tạo file backup", "success");
  }

});

// ================= IMPORT =================

document.getElementById("importDataFile")
?.addEventListener("change", (e) => {

  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {

    try {

      const data = JSON.parse(
        event.target.result
      );

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

      if (data.khoParts) {

        localStorage.setItem(
          "khoParts",
          JSON.stringify(data.khoParts)
        );

      }

      if (data.jobs) {

        localStorage.setItem(
          "jobs",
          JSON.stringify(data.jobs)
        );

      }

      if (typeof showToast === "function") {
        showToast(
          "Khôi phục dữ liệu thành công",
          "success"
        );
      }

      setTimeout(() => {
        location.reload();
      }, 1000);

    }
    catch {

      if (typeof showToast === "function") {
        showToast(
          "File backup không hợp lệ",
          "error"
        );
      }

    }

  };

  reader.readAsText(file);

});

// ================= CLEAR =================

document.getElementById("btnClearAllData")
?.addEventListener("click", () => {

  if (
    !confirm(
      "Xóa toàn bộ hóa đơn, kho, công việc và cài đặt?"
    )
  ) return;

  localStorage.removeItem("bills");

  localStorage.removeItem("settings");

  localStorage.removeItem("khoParts");

  localStorage.removeItem("jobs");

  if (typeof showToast === "function") {
    showToast(
      "Đã xóa toàn bộ dữ liệu",
      "warning"
    );
  }

  setTimeout(() => {
    location.reload();
  }, 1000);

});