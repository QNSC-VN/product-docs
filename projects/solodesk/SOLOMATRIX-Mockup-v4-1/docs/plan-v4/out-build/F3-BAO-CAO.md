# F3 — BÁO CÁO ĐỢT SỬA THEO 8 BÁO CÁO REVIEW

Agent F3 · 20/08/2026 · sở hữu `js/sm-core.js` · `sw.js` · `manifest.webmanifest`.
Nguồn việc: INTERFACE-FIX mục 2 khối F3 (M2 #6 · #8 · #10/#11 · #20 · M4 «tải bản mới» · M3 #7).
Không đụng bất kỳ file nào ngoài 3 file trên.

## Đã làm gì — đối chiếu từng việc hợp đồng

| Việc | Làm ở đâu | Cách làm |
|---|---|---|
| **M2 #6** mở lại app không tự drain | sm-core.js:336-343 (khối «MỞ LẠI APP») | `setTimeout(function(){ drain(); }, 0)` chạy ngay khi lõi nạp. Làm ở lõi thay vì thêm 1 dòng ở boot từng trang vì sm-core được CẢ 4 bề mặt nạp (mobile.html:172, b2g.html:119, index.html:133, web.html:103 — đã grep chứng minh) → mobile, Sổ trực cán bộ, console đều tự gửi hàng đợi khi mở lại; mobile.html (file F1) không phải đụng. `drain()` tự check `isOnline()`; hàng đợi rỗng thì return ngay — vô hại. setTimeout cho listener của bề mặt kịp gắn trước khi `queue:change` phát. |
| **M2 #10** id việc trùng sau «Dọn việc đã gửi» | sm-core.js:72-80 (`uid`) · :213 | Bộ sinh `uid(prefix)` = `prefix + Date.now().toString(36) + '-' + đếm-không-giảm` — theo đúng hướng đề xuất của M2 (Date.now/đếm không giảm), lấy cả hai để khỏi trùng khi enqueue nhiều việc trong cùng một mili-giây. `enqueue` đổi từ `'J'+(q.length+1)` sang `uid('J')`. Đã grep toàn repo `job\.id|j\.id|'J0` = 0 chỗ khác phụ thuộc format id cũ → an toàn đổi. |
| **M2 #11** EV id trùng chéo tenant | sm-core.js:72-80, :405 (xuất `SM.uid`) | **Nói thật: mới xong một nửa.** Chỗ sinh EV id là `sm-inbox.js:55` (`'EV'+(l.length+1)`) — file thuộc quyền **F2** (INTERFACE-FIX mục 0, «TUYỆT ĐỐI không đụng file ngoài phần mình»). Tôi làm phần hạ tầng trong file mình: `SM.uid()` đã công khai; **đề xuất F2 đổi 1 dòng** `sm-inbox.js:55` thành `id: SM.uid('EV'),` là hết #11 (hàm `process` tìm theo id — sm-inbox.js:155 — sẽ không còn nhầm sự kiện hộ khác). Không tự sửa vì 8 agent chạy song song trên cùng cây file — đụng file người khác là mismatch Edit, vỡ cả chiến dịch. |
| **M2 #8** ghi mất âm thầm khi kho đầy | sm-core.js:97-131 (`baoKhoDay` + `writeRaw` mới) | `writeRaw` thất bại → `emit('store:full')` + treo 1 dòng cảnh báo đỏ cố định dưới màn, đúng nguyên văn tinh thần M2 «máy nhớ đầy — dữ liệu chưa lưu được»: «Máy nhớ đã đầy — dữ liệu vừa nhập CHƯA lưu được. Hãy xuất dữ liệu ra ngoài để giữ sổ, rồi nhờ cán bộ kỹ thuật kiểm tra giúp máy.» — lời cán bộ nói với cô chú, không thuật ngữ. Chỉ 1 dòng (không nhắc lại từng lần ghi hỏng); có nút «Đã biết» cao ≥44px đóng được; **khi sổ chính (KEY_DB) ghi lại được → banner tự hạ + `emit('store:ok')`**. Làm ở lõi nên cả 4 bề mặt đều được báo. |
| **M2 #20** sw precache + fallback sai vai khi offline | sw.js:8, 16-34, 40-47, 94-102 | TAP_TIN thêm đủ `b2g.html`, `index.html`, `web.html`; hàm mới `trangLuuSan(pathname)` — mất mạng thì `/b2g*` → b2g.html, `/web*` → web.html, `/` hoặc `/index*` → index.html, còn lại mới về mobile.html; nâng `BO_NHO` → `'solomatrix-v4-2'` đúng quy trình ghi cạnh khai báo (byte sw.js + nội dung cache đều đổi). Cán bộ mất mạng mở Sổ trực giờ thấy đúng Sổ trực. |
| **M4 #17** không có nút «tải bản mới» | sw.js:73-76 · sm-core.js:345-401 | sw.js nghe `message` `'SKIP_WAITING'` → `self.skipWaiting()`. sm-core thêm `giamSatBanMoi()`: hỏi máy chủ ngay khi mở app (`reg.update()`, mất mạng thì im), phát hiện bản mới (updatefound → worker mới `installed`, hoặc `reg.waiting` còn chờ từ lượt trước) → treo thanh cố định trên cùng «App đã có bản mới — tải lại để dùng đúng bản nhất.» + nút «Tải bản mới» (bảo bản mới nhận việc rồi `location.reload()` đúng 1 lần) + nút «Để sau». Thanh không tự tắt, nút cao ≥44px, chữ 14px đậm, chừa `env(safe-area-inset-top)` — đúng bộ quy ước mục 3. Bề mặt muốn vẽ nút riêng nghe `sw:banmoi` hoặc gọi `SM.taiBanMoi()`. Hộ không còn phải gỡ app cài lại. |
| **M3 #7** toast ≥6 giây + bấm đóng (nếu nằm ở core) | — | **Không có việc:** hàm toast duy nhất nằm ở `mobile.html:191-193` — không thuộc core; việc này đã được giao F1 ngay trong khối F1 của hợp đồng («M3 #7 toast ≥6 giây + bấm để đóng»). Core không có toast nào trước đây. Hai thông báo mới do core treo (kho đầy, bản mới) đều **không tự tắt** — cảnh báo tồn tại tới khi người dùng xử lý/xem xong — nên không rơi vào lỗi «2,6 giây người đọc chậm không kịp». |

`manifest.webmanifest`: **không sửa** — không việc nào trong khối F3 chạm manifest. (M2 #21 «icon PNG 192/512» không được hợp đồng giao, và cũng không thể sinh file nhị phân PNG bằng công cụ chữ của đợt này — để lỡ sau nếu Quang chốt.)

## Vị trí từng thay đổi (10 Edit code, không Write đè file cũ nào)

`js/sm-core.js` — 5 Edit:
1. :72-80 — khối `uid()` (mới).
2. :97-131 — khối `baoKhoDay()` + `writeRaw()` (thay hàm cũ 4 dòng).
3. :213 — id việc trong `enqueue` dùng `uid('J')`.
4. :336-401 — khối «MỞ LẠI APP: TỰ ĐỒNG BỘ + CÓ BẢN MỚI»: tự drain, `nutBanMoi`/`thanhBanMoi`/`taiBanMoi`/`giamSatBanMoi` (mới).
5. :405-406 — xuất thêm `uid`, `taiBanMoi` vào `SM` (chữ ký cũ giữ nguyên hết — module khác đang gọi không đổi).

`sw.js` — 5 Edit:
6. :8, :12-15, :16-21 — `BO_NHO` v4-2 + TAP_TIN 4 html + comment quy trình.
7. :40-47 — hàm `trangLuuSan()` (mới).
8. :73-76 — listener `message` SKIP_WAITING (mới).
9. :78-79 — phục hồi xuống dòng chỗ Edit 8 làm dính (đã đọc lại, sửa ngay).
10. :94-102 — fallback HTML theo pathname (thay dòng `co \|\| caches.match('mobile.html')`).

`manifest.webmanifest` — 0 thay đổi (không việc giao).

## Tự soát

1. **Ký tự Trung/Nhật/Hàn** (grep `[\x{4E00}-\x{9FFF}\x{3040}-\x{30FF}\x{31F0}-\x{31FF}\x{AC00}-\x{D7AF}\x{3000}-\x{303F}]` trên sm-core.js và sw.js) = **0 kết quả**.
2. **Từ cấm trong chuỗi hiển thị** (grep `webhook|endpoint|payload|API|SLA|Q-0|Lớp A|Lớp B|Lớp C` trên cả 2 file) = **0 kết quả** — cũng không có chỗ nào cần giữ lại từ cấm. Hai chuỗi hiển thị mới («Máy nhớ đã đầy…», «App đã có bản mới…») thuần lời nói thường, không số bịa (không hiện số nào), không thuật ngữ.
3. **Đối chiếu đủ việc hợp đồng mục 2**: bảng trên — 5/7 việc xong trọn; #11 xong nửa hạ tầng (lý do + đề xuất 1 dòng cho F2); M3 #7 không phát sinh cho core (điều kiện «nếu nằm ở core» không đúng).
4. **Cú pháp**: `node --check` bị môi trường từ chối quyền (kể đúng sự thật: lệnh trả «requires approval»). Theo phương án dự phòng của đề, đã **Read lại 100% sm-core.js (419 dòng) và sw.js (122 dòng) sau khi sửa**: mọi khối mở/đóng ngoặc khớp, IIFE + 'use strict' nguyên vẹn, không thay đổi chữ ký hàm đang có (chỉ thêm `uid`, `taiBanMoi` vào object xuất). Hạn chế biết rõ: soát bằng mắt không bằng chạy máy.

## Chưa làm được (nói thật)

1. **#11 dòng `sm-inbox.js:55`** — file F2, mục 0 cấm đụng; đã để sẵn `SM.uid()` + đề xuất 1 dòng trong bảng trên.
2. **Không chạy thử trên trình duyệt thật** — không mở được PWA offline trên máy thật trong phiên này; hành vi «cán bộ offline mở /b2g thấy đúng Sổ trực», «thanh Tải bản mới hiện khi sw đổi byte» suy từ code theo đường fetch/registration chuẩn, chưa chứng minh bằng bấm thử. Ai verify nên: chạy http server, cài PWA, đổi BO_NHO → v4-3, bấm mở lại.
3. **node --check không chạy được** — thiếu quyền; đành soát lại bằng mắt (mục Tự soát mục 4).
4. **Thanh «Tải bản mới» nằm phủ trên đầu màn hình** (chọn top để không đè thanh điều hướng dưới — thứ hộ dùng liên tục; thanh chỉ xuất hiện khi thật sự có bản mới và có nút «Để sau»). Nếu F1 muốn đưa nút này vào menu «Thêm» cho hợp khối riêng thì lõi đã xuất sẵn `SM.taiBanMoi()` — chỉ cần thay thế, không đụng lõi nữa.

BUILD-AGENT-DONE F3 10
