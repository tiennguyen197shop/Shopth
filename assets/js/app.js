let jobs = [];
let parts = [];

let invoice = [];

let congList = [
  { id: 1, label: "50K", value: 50000 },
  { id: 2, label: "100K", value: 100000 },
  { id: 3, label: "150K", value: 150000 },
  { id: 4, label: "200K", value: 200000 }
];

let congSelectedId = null;
let congHienTai = 0;
let tienXang = 0;

// ================= LOAD DATA =================

fetch("assets/data/congviec.json")
.then(r => r.json())
.then(data => {
  jobs = data;
});

fetch("assets/data/linhkien.json")
.then(r => r.json())
.then(data => {
  parts = data;
});

// ================= OPEN MODAL =================

document.getElementById("btnOpenJob").onclick =
() => openModal("job");

document.getElementById("btnOpenPart").onclick =
() => openModal("part");

// ================= CLOSE MODAL =================

window.closeModal = (id) => {
  const modal = document.getElementById(id);

  if(modal){
    modal.remove();
  }
};

// ================= OPEN MODAL =================

function openModal(type){

  if(document.getElementById(type + "Modal"))
    return;

  const data =
    type === "job"
      ? jobs
      : parts;

  const title =
    type === "job"
      ? "Công việc"
      : "Linh kiện";

  const modal =
    document.createElement("div");

  modal.id =
    type + "Modal";

  modal.className =
    "fixed inset-0 bg-black/60 flex items-end justify-center p-3 z-50";

  modal.innerHTML = `
    <div class="bg-white w-full max-w-md rounded-t-2xl p-4 max-h-[80vh]">

      <div class="flex justify-between items-center mb-3">

        <h3 class="font-bold text-lg">
          ${title}
        </h3>

        <button
          onclick="closeModal('${type}Modal')">
          ✕
        </button>

      </div>

      <input
        id="${type}Search"
        class="w-full border rounded-xl p-3 mb-3"
        placeholder="Tìm kiếm...">

      <div
        id="${type}Box"
        class="space-y-2 overflow-y-auto max-h-[60vh]">
      </div>

    </div>
  `;

  document.body.appendChild(modal);

  renderList(type, data);

  modal.onclick = (e)=>{
    if(e.target === modal){
      modal.remove();
    }
  };

  document.getElementById(
    type + "Search"
  ).oninput = (e)=>{

    const key =
      e.target.value
      .toLowerCase()
      .trim();

    const result =
      data.filter(item =>
        item.ten
          .toLowerCase()
          .includes(key)
      );

    renderList(type, result);
  };
}

// ================= RENDER LIST =================

function renderList(type,list){

  const box =
    document.getElementById(
      type + "Box"
    );

  if(!box) return;

  box.innerHTML = "";

  list.forEach(item=>{

    const selected =
      invoice.some(
        x =>
          x.id === item.id &&
          x.type === type
      );

    const gia =
      type === "part"
        ? item.giaBan
        : item.gia;

    box.innerHTML += `
      <div
        onclick="addItem('${type}',${item.id})"
        class="flex justify-between items-center p-3 rounded-xl cursor-pointer
        ${
          selected
          ? 'bg-green-200'
          : 'bg-slate-100'
        }">

        <span>
          ${item.ten}
        </span>

        <b>
          ${Number(gia).toLocaleString()}đ
        </b>

      </div>
    `;
  });
}

// ================= ADD ITEM =================

window.addItem = (type,id)=>{

  const source =
    type === "job"
      ? jobs
      : parts;

  const item =
    source.find(
      x => x.id === id
    );

  if(!item) return;

  const index =
    invoice.findIndex(
      x =>
        x.id === id &&
        x.type === type
    );

  if(index !== -1){

    invoice.splice(index,1);

  }else{

    invoice.push({

      ...item,

      type,

      qty : 1,

      gia :
        type === "part"
          ? Number(item.giaBan || 0)
          : Number(item.gia || 0),

      giaNhap :
        Number(item.giaNhap || 0)

    });
  }

  renderList(type,source);

  renderInvoice();
};

// ================= CHANGE QTY =================

window.changeQty = (index,val)=>{

  invoice[index].qty += val;

  if(invoice[index].qty < 1){
    invoice[index].qty = 1;
  }

  renderInvoice();
};

// ================= REMOVE =================

window.removeItem = (index)=>{

  invoice.splice(index,1);

  renderInvoice();
};

// ================= RENDER INVOICE =================

function renderInvoice(){

  const box =
    document.getElementById(
      "invoiceDetail"
    );

  if(!box) return;

  box.innerHTML = "";

  let total = 0;

  let loiNhuan = 0;

  invoice.forEach((item,index)=>{

    const thanhTien =
      item.gia * item.qty;

    total += thanhTien;

    if(item.type === "part"){

      loiNhuan +=
        (
          item.gia -
          item.giaNhap
        ) * item.qty;
    }

    box.innerHTML += `
      <div class="bg-slate-50 rounded-xl p-3 flex justify-between items-center">

        <div>

          <div>
            ${item.ten}
          </div>

          <div class="text-blue-600 font-bold">
            ${thanhTien.toLocaleString()}đ
          </div>

        </div>

        <div class="flex gap-2 items-center">

          <button
            onclick="changeQty(${index},-1)"
            class="w-7 h-7 bg-red-500 text-white rounded">

            -

          </button>

          <span>
            ${item.qty}
          </span>

          <button
            onclick="changeQty(${index},1)"
            class="w-7 h-7 bg-green-500 text-white rounded">

            +

          </button>

          <button
            onclick="removeItem(${index})"
            class="w-7 h-7 bg-gray-800 text-white rounded">

            ✕
          </button>

        </div>

      </div>
    `;
  });

  total += congHienTai + tienXang;

  document.getElementById(
    "tongTien"
  ).innerText =
    total.toLocaleString() + "đ";

  document.getElementById(
    "invoiceCount"
  ).innerText =
    invoice.length + " mục";

  const loiNhuanBox =
    document.getElementById(
      "loiNhuanTamTinh"
    );

  if(loiNhuanBox){

    loiNhuanBox.innerText =
      (
        loiNhuan +
        congHienTai
      ).toLocaleString() + "đ";
  }
}

// ================= CONG =================

function renderCong(){

  const box =
    document.getElementById(
      "congBox"
    );

  if(!box) return;

  box.innerHTML = "";

  congList.forEach(c=>{

    const active =
      congSelectedId === c.id;

    box.innerHTML += `
      <button
        onclick="setCong(${c.id})"
        class="p-2 rounded-xl
        ${
          active
          ? 'bg-blue-300'
          : 'bg-slate-100'
        }">

        ${c.label}

      </button>
    `;
  });

  box.innerHTML += `
    <button
      onclick="addCong()"
      class="bg-blue-600 text-white p-2 rounded-xl">

      + Thêm

    </button>
  `;
}

window.setCong = (id)=>{

  const item =
    congList.find(
      x => x.id === id
    );

  if(congSelectedId === id){

    congSelectedId = null;
    congHienTai = 0;

  }else{

    congSelectedId = id;
    congHienTai = item.value;
  }

  renderCong();
  renderInvoice();
};

// ================= ADD CONG =================

window.addCong = () => {

  const modal = document.createElement("div");

  modal.className =
    "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50";

  modal.innerHTML = `
    <div class="bg-white w-full max-w-sm rounded-2xl p-4">

      <h3 class="font-bold text-lg mb-3">
        Thêm tiền công
      </h3>

      <input
        id="congName"
        class="w-full border rounded-xl p-3 mb-3"
        placeholder="Ví dụ: Thay tụ">

      <input
        id="congPrice"
        type="number"
        class="w-full border rounded-xl p-3 mb-3"
        placeholder="Số tiền">

      <div class="grid grid-cols-2 gap-2">

        <button
          id="saveCong"
          class="bg-green-600 text-white py-3 rounded-xl">
          Lưu
        </button>

        <button
          id="cancelCong"
          class="bg-gray-500 text-white py-3 rounded-xl">
          Hủy
        </button>

      </div>

    </div>
  `;

  document.body.appendChild(modal);

  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };

  document.getElementById("cancelCong").onclick = () => {
    modal.remove();
  };

  document.getElementById("saveCong").onclick = () => {

    const name =
      document.getElementById("congName")
      .value.trim();

    const value =
      Number(
        document.getElementById("congPrice")
        .value || 0
      );

    if (!name || value <= 0) {
      alert("Nhập đầy đủ thông tin");
      return;
    }

    congList.push({
      id: Date.now(),
      label: name,
      value: value
    });

    renderCong();

    modal.remove();
  };
};

// ================= XĂNG =================

document.getElementById(
  "btnTinhXang"
).onclick = ()=>{

  const km =
    Number(
      document.getElementById(
        "distance"
      ).value || 0
    );

  tienXang =
    km * 5000;

  document.getElementById(
    "tienXang"
  ).innerText =
    tienXang.toLocaleString() + "đ";

  renderInvoice();
};

// ================= TOTAL =================

function calcTotal(){

  let total = 0;

  invoice.forEach(item=>{

    total +=
      item.gia * item.qty;
  });

  return (
    total +
    congHienTai +
    tienXang
  );
}

// ================= SAVE BILL =================

document.getElementById(
  "btnSave"
).onclick = ()=>{

  if(invoice.length === 0){

    alert(
      "Chưa có dữ liệu!"
    );

    return;
  }

  let loiNhuan = congHienTai;

  invoice.forEach(item=>{

    if(item.type === "part"){

      loiNhuan +=
        (
          item.gia -
          item.giaNhap
        ) * item.qty;
    }
  });

  const bill = {

    id : Date.now(),

    time :
      new Date()
      .toISOString(),

    customer : {

      name :
        document.getElementById(
          "tenKhach"
        ).value,

      phone :
        document.getElementById(
          "soDienThoai"
        ).value
    },

    items : invoice,

    cong : congHienTai,

    xang : tienXang,

    total : calcTotal(),

    loiNhuan,

    note :
      document.getElementById(
        "ghiChu"
      ).value
  };

  let bills =
    JSON.parse(
      localStorage.getItem(
        "bills"
      ) || "[]"
    );

  bills.push(bill);

  localStorage.setItem(
    "bills",
    JSON.stringify(bills)
  );

  // ====== TRỪ KHO ======

  let kho =
    JSON.parse(
      localStorage.getItem(
        "khoParts"
      ) || "[]"
    );

  invoice.forEach(item=>{

    if(item.type !== "part")
      return;

    const khoItem =
      kho.find(
        x =>
          x.ten === item.ten
      );

    if(khoItem){

      khoItem.soluong =
        Math.max(
          0,
          Number(
            khoItem.soluong || 0
          ) - item.qty
        );
    }
  });

  localStorage.setItem(
    "khoParts",
    JSON.stringify(kho)
  );

  alert(
    "Đã lưu hóa đơn!"
  );

  resetAll();
};

// ================= RESET =================

function resetAll(){

  invoice = [];

  congHienTai = 0;

  tienXang = 0;

  congSelectedId = null;

  document.getElementById(
    "tenKhach"
  ).value = "";

  document.getElementById(
    "soDienThoai"
  ).value = "";

  document.getElementById(
    "ghiChu"
  ).value = "";

  document.getElementById(
    "distance"
  ).value = "";

  document.getElementById(
    "tienXang"
  ).innerText = "0đ";

  renderInvoice();
  renderCong();
}

// ================= NÚT RESET =================

document.getElementById(
  "btnReset"
).onclick = ()=>{

  if(
    !confirm(
      "Xóa hóa đơn hiện tại?"
    )
  ) return;

  resetAll();
};

// ================= INIT =================

renderCong();
renderInvoice();