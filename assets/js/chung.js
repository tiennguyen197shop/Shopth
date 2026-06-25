function showToast(msg, type = "success") {

  const toast = document.createElement("div");

  let color = "bg-green-600";
  let icon = "✅";

  if (type === "warning") {
    color = "bg-yellow-500";
    icon = "⚠️";
  }

  if (type === "error") {
    color = "bg-red-600";
    icon = "❌";
  }

  if (type === "info") {
    color = "bg-blue-600";
    icon = "ℹ️";
  }

  toast.className =
    `fixed top-4 right-4 ${color}
    text-white px-4 py-3 rounded-xl shadow-lg
    z-[9999] transition-all duration-300`;

  toast.innerHTML = `
    <div class="flex items-center gap-2">
      <span>${icon}</span>
      <span>${msg}</span>
    </div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
  }, 2500);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}