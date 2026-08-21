# V1 — BÁO CÁO BUILD (mockup SoloMatrix v4)

Agent: V1 · Phạm vi sở hữu: `js/sm-nen.js` (MỚI) + `mobile.html` (chỉ Edit từng chỗ) · Ngày: 2026-08-20.

## Đã làm gì

### Việc 1 — `js/sm-nen.js` (file MỚI, 363 dòng) — màn «Trợ lý chạy nền» (D-#3)
Namespace `SM.nen`, IIFE `'use strict'` theo mẫu sm-onboard.js (tự dựng toast/sheet cùng markup
`.toast`/`.sheet` vì đây là hàm cục bộ của IIFE mobile.html). Export đúng chữ ký đề:

- `NEN.viecDangCho(t)` → `{ten, moTa, dienRa, danhThucBoi, nguon}`, tính từ 5 nguồn:
  (a) đồng hồ 30 ngày qua `D.mocVuotNguong(t)` («canh tới ngày {han}», đánh thức «đồng hồ hẹn giờ»);
  (b) hạn kê khai = `D.deadlines(t)` lọc `dichDen==='thue'` **bỏ thẻ `nguong-30n`** — khối (a) đã nói
  việc đó rồi, tránh 1 việc hiện 2 dòng; (c) connector `cho_duyet` trong `t.onboarding.ketNoi`
  («chờ {tên kênh} trả lời», đánh thức «tin từ bên đó gửi về»); (d) `SM.queueCount()` («chờ có mạng»,
  đánh thức «mạng quay lại»); (e) connector `da_ket_noi`/`noi` («nghe tiền về/đơn về», đánh thức
  «sự kiện từ {tên kênh}») — loại `etax`/`cts`/`ketoan` khỏi (e) vì bảng C.15 ghi chúng không có
  luồng dữ liệu tự chảy.
- `NEN.nguonDanhThuc(t)` → 3 nhóm: tin từ bên ngoài (liệt kê tên connector đang nối) · app tự hỏi lại
  theo giờ (đối soát, «ít nhất mỗi ngày một lần») · hộ mở app.
- `NEN.viewNen/bindNen` — 4 khối đúng nguyên văn câu chữ đề: mở mộc · bảng 3 cột (việc đang canh ·
  tới khi nào/chờ ai · cái gì đánh thức) · «Lúc ngủ có tốn gì không» (comment `[Q-003]`, không in mã Q
  ra màn) · «Nhận trùng thì sao» (`t.trungBoDem||0`, 0 lần hiện «Chưa gặp lần nào.», nút
  `data-di="hopthu"`).

### Việc 2 — `NEN.sheetNoi(t, boiCanh)` — «Nói thay gõ» (D-#10, THUMOI IV.4)
- Nhãn đậm đầu sheet: «MÔ PHỎNG nhận dạng giọng nói — bản thật cần máy nghe tiếng Việt».
- Hiện «bản nghe được» (câu thoại thô dựng bằng `docSo` — hàm đọc số thành lời Việt tự viết, chỉ dùng
  cho thoại; số nghiệp vụ hiển thị vẫn `F.num`/`F.d` từ giá trị gốc) → bảng bóc ra → **mỗi dòng 1 nút
  chạm xác nhận** → nút «Dùng N dòng đã xác nhận» → **chỉ gọi `boiCanh.onXong(rows)`, không tự ghi sổ**.
- Kịch bản theo `t.nganh` (`kichBanTheoNganh`: xét «Nông sản» TRƯỚC «đặc sản» vì CD3 là «Nông sản đặc sản»):
  nông sản → chùm thu mua 5 nông dân từ `t.purchases` (tên/sku/số lượng/giá nguyên gốc seed — đúng
  D-#10 «chùm 5 nông dân giá khác nhau», «bà Siu H Blan» nằm trong số đó); đặc sản → bán quầy 2 mặt đầu
  của kho («hai ký cá cơm khô loại 1, một ký mực khô một nắng» với seed hiện tại); du lịch → khách đặt
  («hai người, ngày mai, bảy giờ rưỡi, cano 1» — ngày mai = `D.congNgay(CLOCK.today,1)`, còn chỗ tính
  từ `t.bookings` thật). Hộ chỉ có dịch vụ mà bấm nút quầy → tự rơi về kịch bản đặt chỗ cho đúng ngành.
- Thiếu dữ liệu (không purchases/kho trống/không tài nguyên) → sheet hiện lời giải thích, không bịa.

### Việc 3 — nối mobile.html (12 Edit nhỏ có neo, KHÔNG Write đè)
| # | Vị trí (dòng sau edit) | Nội dung |
|---|---|---|
| 1 | 178 | `<script src="js/sm-nen.js?v=20260820c">` ngay sau sm-onboard.js |
| 2 | 187 | alias `const NN=SM.nen\|\|{}` cạnh alias ON sẵn có |
| 3 | 2522 | VIEWS thêm `nen:[NN.viewNen,NN.bindNen]` đặt cạnh `tamdung` |
| 4 | 908 | menu «Thêm»: `{id:'nen',ic:'🌙',ten:'Trợ lý chạy nền',mo:'app canh gì khi mình tắt máy'}` cùng nhóm «Kết nối kênh bán» |
| 5 | 651 | nút 🎤 «Nói thay gõ» trong hàng nút của «Lập bảng kê tại vườn» (chỉ hiện khi có `t.purchases`) |
| 6 | 681 | bindMua: xác nhận xong CHỈ điền phiếu nhập (seller/cccd/địa chỉ/sku/số lượng/giá), toast nhắc mỗi người lưu một lượt |
| 7 | 308 | nút 🎤 trong header thẻ «Bán tại quầy» |
| 8 | 344 | bindBan: dòng có `sku` → xếp vào giỏ (vẫn kiểm tồn như bán tay); dòng đặt chỗ (hộ du lịch) → toast tóm tắt + mở màn Đặt chỗ |
| 9 | 800 | nút mic Trợ lý: icon 🎙→🎤, aria-label «Nói thay gõ» |
| 10 | 854 | bindAi: thay handler «đang nghe...» một chiều của v3 bằng `sheetNoi('tro-ly')` — xác nhận câu xong mới điền ô hỏi và gửi |
| 11 | 7 | `<link rel="manifest" href="manifest.webmanifest">` trong `<head>` |
| 12 | 2581 | khối đăng ký service worker cuối file (đúng nguyên văn đề + try/catch, hỏng thì im lặng) |

Tổng thao tác ghi: **19** = 1 Write (sm-nen.js) + 4 Edit tinh chỉnh trên sm-nen.js sau tự soát
(sửa 1 đoạn comment dính ký tự lạ, «form»→«phiếu nhập», thêm nhánh du lịch cho kịch bản quầy, bỏ 1
dòng dead-code) + 14 Edit trên mobile.html (12 chỗ trên + 2 tinh chỉnh: «form»→«phiếu nhập», bindBan
xử lý dòng đặt chỗ).

## Tự soát cú pháp bằng cách nào
- `node --check` **không chạy được** — lệnh `node` bị harness chặn quyền (đã thử 3 dạng gọi, đều
  «requires approval»). Theo phương án dự phòng chính của INTERFACE mục 9: **đọc lại 100% sm-nen.js
  sau khi sửa** (soát ngoặc/template lồng/phẩy — các hàm `sheetNoi`, `dungKichBan` đóng đủ ngoặc;
  template lồng trong `.map().join('')` khớp dấu huyền), và **đọc lại cả 4 vùng edit dễ vỡ cấu trúc
  nhất của mobile.html** (bindBan 342–356, bindMua 678–690, bindAi 848–857, cuối file 2579–2586):
  code gốc phía sau mỗi khối chèn còn nguyên.
- Grep CJK + Kirin (dải CJK/hiragana/hangul/Cyrillic) trên cả 2 file: **0 match**.
- Grep thuật ngữ cấm (`webhook|polling|agent|API|SLA|Q-0`) trong sm-nen.js: chỉ nằm trong comment
  (dòng 89, 160, 165, 204) và trong trường `nguon` — trường này **không render** trong viewNen và
  đúng quy ước «chuỗi nguồn màn hình» của INTERFACE luật chung.
- Mọi số trên màn là hàm từ kho: hạn/conLai từ `mocVuotNguong`/`deadlines`, đếm trùng từ
  `trungBoDem`, queue từ `queueCount`, giá/thành tiền/còn chỗ từ purchases/skus/bookings. Ngoại lệ
 duy nhất: `pax=2`, `qty 2/1`, «hai tạ»-kiểu số lượng và slot đầu tiên là **tham số thoại mô phỏng** (đầu
  vào giọng nói khách nói — đúng tinh thần nhãn MÔ PHỎNG), không phải số nghiệp vụ bịa.

## Lệch đề + việc chưa làm được (nói thật)
1. **Không thêm `<meta name="theme-color" content="#1f6f5c">`**: mobile.html dòng 6 đã có
   `theme-color #0E6360` và `manifest.webmanifest` (file V4 làm) cũng là `#0E6360`. Thẻ thứ hai sẽ
   ghi đè màu thanh PWA và lệch manifest. Tôi chỉ thêm link manifest (thứ thực thiếu).
   `apple-mobile-web-app-capable` cũng đã có sẵn dòng 7 — không đẻ thẻ trùng.
2. **Nút 🎤 ở Trợ lý là nút mic sẵn có của v3** (đã đổi icon/aria-label + thay handler) chứ không
   thêm nút thứ hai cạnh ô nhập — hai nút cạnh nhau làm ô nhập chật, và đề yêu cầu «gắn nút vào ô
   nhập», nút mic chính là nút ấy.
3. **Kịch bản «khách đặt» không có nút riêng ở màn Đặt chỗ** — đề chỉ giao gắn 3 chỗ (Thu mua/Bán
   quầy/Trợ lý). Hộ du lịch chạm 🎤 ở quầy hoặc Trợ lý sẽ gặp kịch bản đặt chỗ; nếu sau này muốn nút
   ở màn `datcho`, chỉ cần 1 dòng gọi `NN.sheetNoi(t,{noi:'datcho',...})`.
4. **Chưa chạy thử trên trình duyệt thật** (môi trường này không mở được Chrome) — cú pháp đã soát
   tay như trên; mức độ chắc chắn: đọc-cấu-trúc, chưa phải chạy-chạy.
5. W2/W3/W6 đã làm xong phần của họ trước lúc tôi vào (`mocVuotNguong`, `trungBoDem`, ON views,
   manifest/sw.js đều đã có mặt) — tôi gọi đúng qua interface, có guard `typeof ... === 'function'`
   với `mocVuotNguong`/`deadlines`/`congNgay`/`queueCount` phòng file chưa nạp.
