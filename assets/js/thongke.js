document.addEventListener("DOMContentLoaded", () => {

const bills =
JSON.parse(
localStorage.getItem("bills") || "[]"
);

function money(v){
return Number(v || 0)
.toLocaleString("vi-VN") + "đ";
}

function render(list){

let doanhThu = 0;
let cong = 0;
let loiNhuan = 0;

list.forEach(bill => {

doanhThu += Number(
bill.total || 0
);

cong += Number(
bill.cong || 0
);

let profit =
Number(bill.cong || 0);

(bill.items || []).forEach(item => {

if(item.type === "part"){

profit +=
Number(item.gia || 0) *
Number(item.qty || 1);

}

});

loiNhuan += profit;

});

document.getElementById("tongHoaDon").innerText =
list.length;

document.getElementById("tongDoanhThu").innerText =
money(doanhThu);

document.getElementById("tongCong").innerText =
money(cong);

document.getElementById("tongLoiNhuan").innerText =
money(loiNhuan);

document.getElementById("tongDon").innerText =
list.length;

document.getElementById("giaTriTB").innerText =
list.length
? money(doanhThu / list.length)
: "0đ";

const detailBox =
document.getElementById("detailBox");

detailBox.innerHTML = "";

list.slice().reverse().forEach(bill => {

detailBox.innerHTML += `

<div class="bg-slate-100 rounded-xl p-3"><div class="font-bold">
${bill.customer?.name || "Khách lẻ"}
</div><div class="text-sm text-gray-500">
${new Date(bill.time)
.toLocaleString("vi-VN")}
</div><div class="text-blue-600 font-bold">
${money(bill.total)}
</div>${bill.note ?
`<div class="text-xs text-gray-500 mt-1">
📝 ${bill.note}

</div>`
: ""}</div>
`;});

}

function loc(){

let result = [...bills];

const type =
document.getElementById(
"filterType"
).value;

const date =
document.getElementById(
"filterDate"
).value;

const month =
document.getElementById(
"filterMonth"
).value;

const year =
document.getElementById(
"filterYear"
).value;

if(date){

result = result.filter(b => {

const d =
new Date(b.time)
.toISOString()
.slice(0,10);

return d === date;

});

}

else if(month){

result = result.filter(b => {

const d =
new Date(b.time);

const m =
d.getFullYear() +
"-" +
String(d.getMonth()+1)
.padStart(2,"0");

return m === month;

});

}

else if(year){

result = result.filter(b => {

return String(
new Date(b.time)
.getFullYear()
) === year;

});

}

else if(type === "today"){

const today =
new Date()
.toISOString()
.slice(0,10);

result = result.filter(b =>
new Date(b.time)
.toISOString()
.slice(0,10) === today
);

}

else if(type === "month"){

const now = new Date();

result = result.filter(b => {

const d =
new Date(b.time);

return d.getMonth() === now.getMonth()
&& d.getFullYear() === now.getFullYear();

});

}

else if(type === "year"){

const y =
new Date().getFullYear();

result = result.filter(b =>

new Date(b.time)
.getFullYear() === y

);

}

render(result);

}

document.getElementById("filterType")
.onchange = loc;

document.getElementById("filterDate")
.onchange = loc;

document.getElementById("filterMonth")
.onchange = loc;

document.getElementById("filterYear")
.oninput = loc;

render(bills);

});