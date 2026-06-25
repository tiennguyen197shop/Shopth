document.addEventListener("DOMContentLoaded", () => {

  // ================= LOAD =================
  function loadBills() {
    return JSON.parse(localStorage.getItem("bills") || "[]");
  }

  let bills = loadBills();

  // ================= RENDER LIST =================
  function render(list = bills) {

    const box = document.getElementById("billList");
    box.innerHTML = "";

    if (!list.length) {
      box.innerHTML = `
        <div class="text-center text-gray-500 py-8">
          Chưa có hóa đơn
        </div>
      `;
      return;
    }

    list.slice().reverse().forEach(b => {

      box.innerHTML += `
        <div onclick="viewBill(${b.id})"
             class="bg-slate-100 p-3 rounded-xl cursor-pointer">

          <div class="font-bold">
            ${b.customer?.name || "Không tên"}
          </div>

          <div class="text-sm text-gray-500">
            ${new Date(b.time).toLocaleString()}
          </div>

          <div class="text-blue-600 font-bold mt-1">
            ${Number(b.total || 0).toLocaleString()}đ
          </div>

          ${b.note ? `
            <div class="text-xs text-gray-500 mt-1 truncate">
              📝 ${b.note}
            </div>
          ` : ""}

        </div>
      `;
    });
  }

  // ================= VIEW DETAIL =================
  window.viewBill = (id) => {

    bills = loadBills(); // luôn đồng bộ

    const bill = bills.find(x => x.id === id);
    if (!bill) return;

    let itemsHtml = "";

    bill.items.forEach(i => {
      itemsHtml += `
        <div class="flex justify-between py-1">
          <span>${i.ten} x${i.qty}</span>
          <span>${(i.gia * i.qty).toLocaleString()}đ</span>
        </div>
      `;
    });

    const modal = document.createElement("div");

    modal.className =
      "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50";

    modal.innerHTML = `
      <div class="bg-white w-full max-w-md rounded-2xl p-4 max-h-[85vh] overflow-y-auto">

        <div class="flex justify-between mb-3">
          <h3 class="font-bold text-lg">Chi tiết hóa đơn</h3>
          <button onclick="this.closest('.fixed').remove()">✕</button>
        </div>

        <div class="text-sm space-y-1 mb-3">
          <div><b>Khách:</b> ${bill.customer?.name || ""}</div>
          <div><b>SĐT:</b> ${bill.customer?.phone || ""}</div>
          <div><b>Ngày:</b> ${new Date(bill.time).toLocaleString()}</div>

          ${bill.note ? `
            <div><b>Ghi chú:</b> ${bill.note}</div>
          ` : ""}
        </div>

        <hr class="my-2">

        ${itemsHtml}

        <hr class="my-2">

        <div class="text-sm space-y-1">

          <div>Tiền công: ${Number(bill.cong || 0).toLocaleString()}đ</div>
          <div>Tiền xăng: ${Number(bill.xang || 0).toLocaleString()}đ</div>

          <div class="font-bold text-blue-600 mt-2">
            Tổng: ${Number(bill.total || 0).toLocaleString()}đ
          </div>

        </div>

        <button onclick="deleteBill(${bill.id})"
                class="w-full mt-4 bg-red-600 text-white py-2 rounded-xl">
          Xóa hóa đơn
        </button>

      </div>
    `;

    document.body.appendChild(modal);
  };

  // ================= DELETE BILL =================
  window.deleteBill = (id) => {

    if (!confirm("Xóa hóa đơn này?")) return;

    let data = loadBills();

    data = data.filter(x => x.id !== id);

    localStorage.setItem("bills", JSON.stringify(data));

    bills = data;
    render();

    document.querySelectorAll(".fixed.inset-0").forEach(e => e.remove());
  };

  // ================= SEARCH =================
  document.getElementById("searchBill").oninput = (e) => {

    const key = e.target.value.toLowerCase();

    const result = bills.filter(b =>
      (b.customer?.name || "").toLowerCase().includes(key) ||
      (b.note || "").toLowerCase().includes(key)
    );

    render(result);
  };

  // ================= CLEAR ALL =================
  document.getElementById("btnClearBills").onclick = () => {

    if (!confirm("Xóa toàn bộ hóa đơn?")) return;

    localStorage.removeItem("bills");

    bills = [];

    render();
  };

  // ================= SYNC =================
  window.addEventListener("storage", () => {
    bills = loadBills();
    render();
  });

  // ================= INIT =================
  render();

});