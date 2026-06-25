document.addEventListener("DOMContentLoaded", async () => {

let KHO = JSON.parse(localStorage.getItem("khoParts") || "[]");

// ================= SAVE =================

function saveKho() {
  localStorage.setItem("khoParts", JSON.stringify(KHO));
}

// ================= LOAD =================

try {

  const res = await fetch("assets/data/linhkien.json");
  const data = await res.json();

  if (KHO.length === 0) {

    KHO = data.map(item => ({
      id: item.id,
      ten: item.ten,
      giaNhap: Number(item.giaNhap || 0),
      giaBan: Number(item.giaBan || item.gia || 0),
      soluong: 0
    }));

    saveKho();

  } else {

    KHO = KHO.map(old => {

      const goc = data.find(x => x.id == old.id);

      return {
        id: old.id,
        ten: old.ten,

        giaNhap:
          Number(old.giaNhap ??
          goc?.giaNhap ??
          Math.round((old.gia || goc?.giaBan || 0) * 0.7)),

        giaBan:
          Number(old.giaBan ??
          old.gia ??
          goc?.giaBan ??
          0),

        soluong:
          Number(old.soluong || 0)
      };
    });

    saveKho();
  }

} catch(err){
  console.error(err);
}

// ================= RENDER =================

function renderKho(list = KHO){

  const box = document.getElementById("khoList");
  if(!box) return;

  box.innerHTML = "";

  let tongTon = 0;
  let tongNhap = 0;
  let tongBan = 0;

  list.forEach(item => {

    const qty = Number(item.soluong || 0);

    tongTon += qty;
    tongNhap += qty * Number(item.giaNhap || 0);
    tongBan += qty * Number(item.giaBan || 0);

    const index = KHO.findIndex(x => x.id === item.id);

    let statusClass = "text-green-600";
    let statusText = `Tồn kho: ${qty}`;

    if(qty === 0){
      statusClass = "text-red-600 font-bold";
      statusText = "❌ Hết hàng";
    }
    else if(qty === 1){
      statusClass = "text-yellow-600 font-bold";
      statusText = "⚠️ Sắp hết hàng";
    }

    box.innerHTML += `
      <div
        onclick="editPart(${index})"
        class="bg-slate-100 rounded-xl p-3 cursor-pointer">

        <div class="font-bold">${item.ten}</div>

        <div class="text-sm">
          Giá nhập:
          ${Number(item.giaNhap).toLocaleString()}đ
        </div>

        <div class="text-blue-600 font-bold">
          Giá bán:
          ${Number(item.giaBan).toLocaleString()}đ
        </div>

        <div class="${statusClass} text-sm">
          ${statusText}
        </div>

      </div>
    `;
  });

  document.getElementById("tongMatHang").innerText = KHO.length;
  document.getElementById("tongTonKho").innerText = tongTon;

  const nhap = document.getElementById("tongGiaTriNhap");
  if(nhap){
    nhap.innerText = tongNhap.toLocaleString() + "đ";
  }

  const ban = document.getElementById("tongGiaTriBan");
  if(ban){
    ban.innerText = tongBan.toLocaleString() + "đ";
  }
}

// ================= SEARCH =================

const search = document.getElementById("searchKho");

if(search){
  search.oninput = () => {

    const key = search.value.toLowerCase().trim();

    renderKho(
      KHO.filter(x =>
        x.ten.toLowerCase().includes(key)
      )
    );
  };
}

// ================= EDIT =================

window.editPart = (index) => {

const item = KHO[index];

if(!item) return;

const modal = document.createElement("div");

modal.className =
"fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50";

modal.innerHTML = `
<div class="bg-white w-full max-w-sm rounded-2xl p-4">

<h3 class="font-bold text-lg mb-3">
Chỉnh sửa linh kiện
</h3>

<input id="editName"
class="w-full border rounded-xl p-3 mb-2"
value="${item.ten}">

<input id="editNhap"
type="number"
class="w-full border rounded-xl p-3 mb-2"
value="${item.giaNhap}">

<input id="editBan"
type="number"
class="w-full border rounded-xl p-3 mb-2"
value="${item.giaBan}">

<input id="editQty"
type="number"
class="w-full border rounded-xl p-3 mb-3"
value="${item.soluong}">

<div class="grid grid-cols-2 gap-2">

<button id="saveBtn"
class="bg-green-600 text-white py-3 rounded-xl">
Lưu
</button>

<button id="deleteBtn"
class="bg-red-600 text-white py-3 rounded-xl">
Xóa
</button>

</div>

</div>
`;

document.body.appendChild(modal);

modal.onclick = (e)=>{
if(e.target===modal) modal.remove();
};

document.getElementById("saveBtn").onclick = ()=>{

item.ten =
document.getElementById("editName").value.trim();

item.giaNhap =
Number(document.getElementById("editNhap").value||0);

item.giaBan =
Number(document.getElementById("editBan").value||0);

item.soluong =
Number(document.getElementById("editQty").value||0);

saveKho();
renderKho();

modal.remove();
};

document.getElementById("deleteBtn").onclick = ()=>{

if(!confirm("Xóa linh kiện này?"))
return;

KHO.splice(index,1);

saveKho();
renderKho();

modal.remove();

};

};

// ================= THÊM =================

const btnAdd =
document.getElementById("btnAddPart");

if(btnAdd){

btnAdd.onclick = ()=>{

const modal =
document.createElement("div");

modal.className =
"fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50";

modal.innerHTML = `
<div class="bg-white w-full max-w-sm rounded-2xl p-4">

<h3 class="font-bold text-lg mb-3">
Thêm linh kiện
</h3>

<input id="newName"
class="w-full border rounded-xl p-3 mb-2"
placeholder="Tên linh kiện">

<input id="newNhap"
type="number"
class="w-full border rounded-xl p-3 mb-2"
placeholder="Giá nhập">

<input id="newBan"
type="number"
class="w-full border rounded-xl p-3 mb-2"
placeholder="Giá bán">

<input id="newQty"
type="number"
class="w-full border rounded-xl p-3 mb-3"
placeholder="Số lượng">

<button id="saveNew"
class="w-full bg-blue-600 text-white py-3 rounded-xl">

Thêm linh kiện

</button>

</div>
`;

document.body.appendChild(modal);

modal.onclick = (e) => {
  if (e.target === modal) {
    modal.remove();
  }
};

document.getElementById("saveNew").onclick = ()=>{

const ten =
document.getElementById("newName").value.trim();

if(!ten){
alert("Nhập tên linh kiện");
return;
}

KHO.push({
id: Date.now(),
ten: ten,
giaNhap: Number(document.getElementById("newNhap").value||0),
giaBan: Number(document.getElementById("newBan").value||0),
soluong: Number(document.getElementById("newQty").value||0)
});

saveKho();
renderKho();

modal.remove();

};

};

}

renderKho();

});