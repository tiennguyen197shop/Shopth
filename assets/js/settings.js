document.addEventListener("DOMContentLoaded", () => {

let SETTINGS = JSON.parse(
localStorage.getItem("settings") || "{}"
);

if (!SETTINGS.shopName)
SETTINGS.shopName = "QUÁN ĐIỆN TIẾN";

if (!SETTINGS.shopPhone)
SETTINGS.shopPhone = "";

if (!SETTINGS.kmPrice)
SETTINGS.kmPrice = 5000;

if (!SETTINGS.defaultCong)
SETTINGS.defaultCong = 50000;

if (!SETTINGS.congList) {
SETTINGS.congList = [
{ id: 1, label: "50K", value: 50000 },
{ id: 2, label: "100K", value: 100000 },
{ id: 3, label: "150K", value: 150000 },
{ id: 4, label: "200K", value: 200000 }
];
}

function saveSettings() {
localStorage.setItem(
"settings",
JSON.stringify(SETTINGS)
);
}

function renderSettings() {

document.getElementById("shopName").value =
  SETTINGS.shopName;

document.getElementById("shopPhone").value =
  SETTINGS.shopPhone;

document.getElementById("kmPrice").value =
  SETTINGS.kmPrice;

document.getElementById("defaultCong").value =
  SETTINGS.defaultCong;

const box =
  document.getElementById("congList");

box.innerHTML = "";

SETTINGS.congList.forEach((item,index)=>{

  box.innerHTML += `
    <div class="flex justify-between items-center bg-slate-100 p-3 rounded-xl">

      <div>
        <div class="font-medium">
          ${item.label}
        </div>

        <div class="text-blue-600 font-bold">
          ${item.value.toLocaleString()}đ
        </div>
      </div>

      <button
        onclick="deleteCong(${index})"
        class="bg-red-500 text-white px-3 py-1 rounded-lg">
        Xóa
      </button>

    </div>
  `;
});

}

window.deleteCong = (index) => {

if (!confirm("Xóa mức công này?"))
  return;

SETTINGS.congList.splice(index,1);

saveSettings();
renderSettings();

};

document.getElementById("btnAddCong").onclick = () => {

if (document.getElementById("congModal")) return;

const modal = document.createElement("div");

modal.id = "congModal";

modal.className =
"fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50";

modal.innerHTML = `
<div class="bg-white w-full max-w-sm rounded-2xl p-4 shadow-xl">

  <div class="flex justify-between items-center mb-4">
    <h3 class="font-bold text-lg">
      Thêm tiền công
    </h3>

    <button id="closeCongModal"
            class="text-xl">
      ✕
    </button>
  </div>

  <input
    id="newCongName"
    class="w-full border rounded-xl p-3 mb-3"
    placeholder="Tên công (VD: 250K)">

  <input
    id="newCongPrice"
    type="number"
    class="w-full border rounded-xl p-3 mb-4"
    placeholder="Giá tiền">

  <button
    id="saveCongModal"
    class="w-full bg-blue-600 text-white py-3 rounded-xl">
    Lưu
  </button>

</div>

`;

document.body.appendChild(modal);

document.getElementById("closeCongModal").onclick = () => {
modal.remove();
};

modal.onclick = (e) => {
if (e.target === modal) modal.remove();
};

document.getElementById("saveCongModal").onclick = () => {

const label =
  document.getElementById("newCongName").value.trim();

const value =
  Number(document.getElementById("newCongPrice").value);

if (!label || !value) {
  alert("Nhập đầy đủ thông tin");
  return;
}

SETTINGS.congList.push({
  id: Date.now(),
  label,
  value
});

saveSettings();
renderSettings();

modal.remove();

};
};


document.getElementById("btnSave").onclick = () => {

SETTINGS.shopName =
  document.getElementById("shopName").value;

SETTINGS.shopPhone =
  document.getElementById("shopPhone").value;

SETTINGS.kmPrice =
  Number(document.getElementById("kmPrice").value || 5000);

SETTINGS.defaultCong =
  Number(document.getElementById("defaultCong").value || 50000);

saveSettings();

alert("Đã lưu cài đặt");

};

renderSettings();

});