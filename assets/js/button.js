// ================= RESET =================
document.getElementById("btnReset").onclick = () => {

  if (!confirm("Xóa toàn bộ hóa đơn hiện tại?")) return;

  invoice = [];
  congHienTai = 0;
  tienXang = 0;
  congSelectedId = null;

  document.getElementById("tenKhach").value = "";
  document.getElementById("soDienThoai").value = "";
  document.getElementById("ghiChu").value = "";
  document.getElementById("distance").value = "";
  document.getElementById("tienXang").innerText = "0đ";

  renderInvoice();
};

// ================= SAVE =================
document.getElementById("btnSave").onclick = () => {

  if (invoice.length === 0) {
    //alert("Chưa có dữ liệu hóa đơn!");
    showToast("Chưa Có Dữ Liệu Hoá Đơn!", "info");
    return;
  }

  const bill = {
    id: Date.now(),
    time: new Date().toISOString(),
    customer: {
      name: document.getElementById("tenKhach").value,
      phone: document.getElementById("soDienThoai").value
    },
    items: invoice,
    cong: congHienTai,
    xang: tienXang,
    total: calcTotal(),
    note: document.getElementById("ghiChu").value
  };

  let data = JSON.parse(localStorage.getItem("bills") || "[]");
  data.push(bill);

  localStorage.setItem("bills", JSON.stringify(data));

// ================= TRỪ KHO =================

let kho = JSON.parse(
localStorage.getItem("khoParts") || "[]"
);

invoice.forEach(item => {

const khoItem = kho.find(
x => x.ten === item.ten
);

if (khoItem) {

khoItem.soluong =
  Math.max(
    0,
    Number(khoItem.soluong || 0) - Number(item.qty || 1)
  );

}

});

localStorage.setItem(
"khoParts",
JSON.stringify(kho)
);

//NEW MỚI
let customers = JSON.parse(
localStorage.getItem("customers") || "[]"
);

const phone =
bill.customer.phone || "";

const name =
bill.customer.name || "Khách lẻ";

let customer =
customers.find(x => x.phone === phone);

if (customer) {

customer.totalBills += 1;
customer.totalMoney += bill.total;
customer.lastVisit = bill.time;

} else {

customers.push({
id: Date.now(),
name,
phone,
totalBills: 1,
totalMoney: bill.total,
lastVisit: bill.time
});

}

localStorage.setItem(
"customers",
JSON.stringify(customers)
);

// ================= NHẬT KÝ =================

let logs = JSON.parse(
localStorage.getItem("workLogs") || "[]"
);

logs.push({
id: Date.now(),
time: bill.time,
customer: name,
phone,
total: bill.total,
note: bill.note,
items: bill.items
});

localStorage.setItem(
"workLogs",
JSON.stringify(logs)
);
//NEW MỚI

//alert("Đã lưu hóa đơn!");
showToast("Đã Lưu Hoá Đơn", "success");

resetAll();

};

// ================= HISTORY =================
document.getElementById("btnHistory").onclick = () => {

  if (document.getElementById("historyModal")) return;

  const bills = JSON.parse(localStorage.getItem("bills") || "[]");

  const modal = document.createElement("div");
  modal.id = "historyModal";

  modal.className =
    "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50";

  modal.innerHTML = `
    <div class="bg-white w-full max-w-md rounded-2xl p-4 max-h-[80vh] overflow-y-auto">

      <div class="flex justify-between items-center mb-3">
        <h3 class="font-bold text-lg">Lịch sử hóa đơn</h3>
        <button onclick="this.closest('#historyModal').remove()">✕</button>
      </div>

      <div class="flex justify-end mb-2">
        <button id="clearHistory"
                class="text-sm bg-red-500 text-white px-3 py-1 rounded">
          Xóa lịch sử
        </button>
      </div>

      <div id="historyBox" class="space-y-2"></div>

    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector("#clearHistory").onclick = () => {
    if (!confirm("Xóa toàn bộ lịch sử?")) return;
    localStorage.removeItem("bills");
    modal.remove();
  };

  const box = modal.querySelector("#historyBox");

  if (bills.length === 0) {
    box.innerHTML = `<p class="text-gray-500">Chưa có hóa đơn</p>`;
    return;
  }

  bills.reverse().forEach(b => {
    box.innerHTML += `
      <div class="p-2 bg-slate-100 rounded-xl text-sm">
        <div class="font-bold">${b.customer?.name || "Không tên"}</div>
        <div class="text-gray-500">${new Date(b.time).toLocaleString()}</div>
        <div class="text-blue-600 font-bold">${b.total.toLocaleString()}đ</div>
      </div>
    `;
  });
};

// ================= CALC =================
function calcTotal() {
  let total = 0;

  invoice.forEach(i => {
    total += i.gia * i.qty;
  });

  return total + congHienTai + tienXang;
}

// ================= RESET LOGIC =================
function resetAll() {

  invoice = [];
  congHienTai = 0;
  tienXang = 0;
  congSelectedId = null;

  document.getElementById("tenKhach").value = "";
  document.getElementById("soDienThoai").value = "";
  document.getElementById("ghiChu").value = "";
  document.getElementById("distance").value = "";
  document.getElementById("tienXang").innerText = "0đ";

  renderInvoice();
}