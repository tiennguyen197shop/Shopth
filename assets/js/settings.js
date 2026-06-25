document.addEventListener("DOMContentLoaded", () => {

let SETTINGS = JSON.parse(
  localStorage.getItem("settings") || "{}"
);

// ================= DEFAULT =================

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

if (!SETTINGS.jobList) {

  SETTINGS.jobList = [
    {
      id: 1,
      ten: "Thay tụ quạt",
      gia: 50000
    }
  ];

}

// ================= SAVE =================

function saveSettings() {

  localStorage.setItem(
    "settings",
    JSON.stringify(SETTINGS)
  );

}

// ================= RENDER =================

function renderSettings() {

  document.getElementById("shopName").value =
    SETTINGS.shopName;

  document.getElementById("shopPhone").value =
    SETTINGS.shopPhone;

  document.getElementById("kmPrice").value =
    SETTINGS.kmPrice;

  document.getElementById("defaultCong").value =
    SETTINGS.defaultCong;

  renderCongList();
  renderJobList();
}

// ================= TIỀN CÔNG =================

function renderCongList() {

  const box =
    document.getElementById("congList");

  if (!box) return;

  box.innerHTML = "";

  SETTINGS.congList.forEach((item,index)=>{

    box.innerHTML += `
      <div class="flex justify-between items-center bg-slate-100 p-3 rounded-xl">

        <div>

          <div class="font-medium">
            ${item.label}
          </div>

          <div class="text-blue-600 font-bold">
            ${Number(item.value).toLocaleString()}đ
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

  showConfirm(
    "Xóa mức công này?",
    () => {

      SETTINGS.congList.splice(index,1);

      saveSettings();
      renderSettings();

      showToast(
        "Đã xóa mức công",
        "success"
      );

    }
  );

};

// ================= THÊM TIỀN CÔNG =================

const btnAddCong =
  document.getElementById("btnAddCong");

if (btnAddCong) {

  btnAddCong.onclick = () => {

    const modal =
      document.createElement("div");

    modal.className =
      "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999]";

    modal.innerHTML = `
      <div class="bg-white w-full max-w-sm rounded-2xl p-4">

        <h3 class="font-bold text-lg mb-3">
          Thêm tiền công
        </h3>

        <input
          id="newCongName"
          class="w-full border rounded-xl p-3 mb-3"
          placeholder="Tên công">

        <input
          id="newCongPrice"
          type="number"
          class="w-full border rounded-xl p-3 mb-3"
          placeholder="Giá tiền">

        <button
          id="saveCongModal"
          class="w-full bg-blue-600 text-white py-3 rounded-xl">

          Lưu

        </button>

      </div>
    `;

    document.body.appendChild(modal);

    modal.onclick = (e) => {
      if (e.target === modal)
        modal.remove();
    };

    document.getElementById(
      "saveCongModal"
    ).onclick = () => {

      const label =
        document.getElementById(
          "newCongName"
        ).value.trim();

      const value =
        Number(
          document.getElementById(
            "newCongPrice"
          ).value
        );

      if (!label || !value) {

        showToast(
          "Nhập đầy đủ thông tin",
          "warning"
        );

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

      showToast(
        "Đã thêm mức công",
        "success"
      );

    };

  };

}

// ================= CÔNG VIỆC =================

function renderJobList() {

  const box =
    document.getElementById("jobList");

  if (!box) return;

  box.innerHTML = "";

  SETTINGS.jobList.forEach(
    (job,index) => {

      box.innerHTML += `
        <div class="flex justify-between items-center bg-slate-100 p-3 rounded-xl">

          <div>

            <div class="font-medium">
              ${job.ten}
            </div>

            <div class="text-blue-600 font-bold">
              ${Number(job.gia).toLocaleString()}đ
            </div>

          </div>

          <div class="flex gap-2">

            <button
              onclick="editJob(${index})"
              class="bg-yellow-500 text-white px-3 py-1 rounded-lg">

              Sửa

            </button>

            <button
              onclick="deleteJob(${index})"
              class="bg-red-600 text-white px-3 py-1 rounded-lg">

              Xóa

            </button>

          </div>

        </div>
      `;
    }
  );
}

// ================= THÊM JOB =================

const btnAddJob =
  document.getElementById("btnAddJob");

if (btnAddJob) {

  btnAddJob.onclick = () => {

    showJobModal();

  };

}

// ================= MODAL JOB =================

function showJobModal(index = null) {

  const item =
    index !== null
      ? SETTINGS.jobList[index]
      : {
          ten: "",
          gia: 0
        };

  const modal =
    document.createElement("div");

  modal.className =
    "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999]";

  modal.innerHTML = `
    <div class="bg-white rounded-2xl p-4 w-full max-w-sm">

      <h3 class="font-bold text-lg mb-3">

        ${index === null
          ? "Thêm công việc"
          : "Sửa công việc"}

      </h3>

      <input
        id="jobName"
        class="w-full border rounded-xl p-3 mb-3"
        value="${item.ten}"
        placeholder="Tên công việc">

      <input
        id="jobPrice"
        type="number"
        class="w-full border rounded-xl p-3 mb-3"
        value="${item.gia}"
        placeholder="Giá">

      <button
        id="saveJobBtn"
        class="w-full bg-green-600 text-white py-3 rounded-xl">

        Lưu

      </button>

    </div>
  `;

  document.body.appendChild(modal);

  modal.onclick = (e) => {
    if (e.target === modal)
      modal.remove();
  };

  document.getElementById(
    "saveJobBtn"
  ).onclick = () => {

    const ten =
      document.getElementById(
        "jobName"
      ).value.trim();

    const gia =
      Number(
        document.getElementById(
          "jobPrice"
        ).value || 0
      );

    if (!ten) {

      showToast(
        "Nhập tên công việc",
        "warning"
      );

      return;
    }

    if (index === null) {

      SETTINGS.jobList.push({
        id: Date.now(),
        ten,
        gia
      });

    } else {

      SETTINGS.jobList[index].ten =
        ten;

      SETTINGS.jobList[index].gia =
        gia;

    }

    saveSettings();
    renderSettings();

    modal.remove();

    showToast(
      "Đã lưu công việc",
      "success"
    );

  };

}

// ================= EDIT JOB =================

window.editJob = (index) => {

  showJobModal(index);

};

// ================= DELETE JOB =================

window.deleteJob = (index) => {

  showConfirm(
    "Xóa công việc này?",
    () => {

      SETTINGS.jobList.splice(
        index,
        1
      );

      saveSettings();
      renderSettings();

      showToast(
        "Đã xóa công việc",
        "success"
      );

    }
  );

};

// ================= SAVE SETTINGS =================

document.getElementById("btnSave").onclick = () => {

  SETTINGS.shopName =
    document.getElementById(
      "shopName"
    ).value;

  SETTINGS.shopPhone =
    document.getElementById(
      "shopPhone"
    ).value;

  SETTINGS.kmPrice =
    Number(
      document.getElementById(
        "kmPrice"
      ).value || 5000
    );

  SETTINGS.defaultCong =
    Number(
      document.getElementById(
        "defaultCong"
      ).value || 50000
    );

  saveSettings();

  showToast(
    "Đã lưu cài đặt",
    "success"
  );

};

// ================= INIT =================

renderSettings();

});