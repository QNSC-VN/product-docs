/* F1 — công cụ tự soát mobile.html sau đợt sửa (giữ lại để lượt verify chạy lại được).
   Chạy: node solomatrix-v3-gialai/docs/plan-v4/out-build/F1-soat.js
   Soát 3 việc: (1) cú pháp mọi khối <script> inline, (2) ký tự Trung/Nhật/Hàn,
   (3) thuật ngữ kỹ thuật lọt vào chuỗi hiển thị cho hộ. */
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const F = path.join(__dirname, '..', '..', '..', 'mobile.html');
const s = fs.readFileSync(F, 'utf8');
const dong = s.split('\n');

console.log('=== 1. CU PHAP khoi <script> inline ===');
const re = /<script>([\s\S]*?)<\/script>/g;
let m, i = 0, loi = 0;
while ((m = re.exec(s))) {
  i++;
  const batDau = s.slice(0, m.index).split('\n').length;
  try {
    new vm.Script(m[1], { filename: 'inline#' + i });
    console.log('  khoi ' + i + ' (tu dong ' + batDau + ', ' + m[1].split('\n').length + ' dong): OK');
  } catch (e) { loi++; console.log('  khoi ' + i + ' (tu dong ' + batDau + '): LOI -> ' + e.message); }
}
console.log('  tong: ' + i + ' khoi, ' + loi + ' khoi loi');

console.log('=== 2. KY TU TRUNG/NHAT/HAN ===');
const cjk = /[぀-ヿ㐀-䶿一-鿿가-힯]/g;
let soCjk = 0;
dong.forEach((d, n) => {
  const h = d.match(cjk);
  if (h) { soCjk += h.length; console.log('  dong ' + (n + 1) + ': ' + h.join('') + ' | ' + d.trim().slice(0, 90)); }
});
console.log('  tong ky tu CJK: ' + soCjk);

console.log('=== 3. THUAT NGU KY THUAT (moi lan xuat hien, ke ca comment) ===');
const cam = /(webhook|endpoint|payload|API|SLA|Q-0|Lớp A|Lớp B|Lớp C|connector|polling|token)/gi;
let soCam = 0;
dong.forEach((d, n) => {
  const h = d.match(cam);
  if (!h) return;
  soCam += h.length;
  console.log('  dong ' + (n + 1) + ' [' + h.join(',') + '] ' + d.trim().slice(0, 140));
});
console.log('  tong lan dinh: ' + soCam + ' (phai doi chieu tay: comment / khoi <details> cho can bo thi khong tinh la loi)');
