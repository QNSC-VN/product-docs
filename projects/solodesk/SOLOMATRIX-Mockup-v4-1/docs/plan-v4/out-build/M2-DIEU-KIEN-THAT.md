# M2 — ĐIỀU KIỆN THẬT: máy yếu, mạng yếu, ngoài nắng

Vai: kỹ sư đi thực địa. Đầu bài THUMOI IV.4: vận hành ổn định trên điện thoại phổ thông,
sóng yếu miền núi, bán hàng phải chạy khi mất kết nối, tự đồng bộ khi có mạng lại.
Bối cảnh đo: hộ đứng ngoài trời nắng chói, Android 2–3 GB RAM, 3G chập chờn, pin 20%.

**Phương pháp**: mọi số dưới đây đếm/tính trực tiếp từ code và seed (dẫn `file:dòng`);
tỉ lệ tương phản tính theo công thức WCAG 2.1 (tuyến tính hoá sRGB, (L1+0,05)/(L2+0,05))
với đúng giá trị hex trong bảng màu `mobile.html:12–21`. Không phỏng đoán — chỗ nào ước
lượng thì ghi rõ cách ước. Ngày đo: 20/08/2026, bản build song song của W1–W9
(`sm-b2g.js`, `sm-seed-b2g.js`, `sm-onboard.js` đang được các agent sửa đồng thời —
số dòng dẫn có thể trôi vài dòng sau phiên này; tên hàm/vấn đề không đổi).

---

## 1. MÁY YẾU — TẢI RENDER

### 1.1. Số liệu seed (đếm từ `sm-seed-gialai.js`)

`genRevenue(seed, profile, cfg)` (sm-seed-gialai.js:68–118) sinh `docsPerMonth` chứng từ
mỗi tháng × 8 tháng; mỗi chứng từ là 1 hoá đơn (kênh b2b) hoặc 1 đơn (kênh còn lại).
Vì mỗi lượt chỉ chiếm 18–48% phần còn lại của mục tiêu tháng (dòng 85), vòng luôn chạy
đủ số lượt — số chứng từ là TÍNH XÁC ĐỊNH ĐƯỢC từ cấu hình:

| Tenant | cấu hình | chứng từ genRevenue | cộng thêm seed cứng | tổng ước tính |
|---|---|---|---|---|
| CD1 Biển Xanh | docsPerMonth 6, kênh 3/8 là b2b (dòng 136–137) | 48 (≈18 hoá đơn + ≈30 đơn) | +3 đơn mở (dòng 171–182) | **≈33 đơn + 18 hoá đơn** |
| CD2 Nhơn Lý | docsPerMonth 5, b2b 1/5 (dòng 278–279) | 40 (≈8 hoá đơn + ≈32 đơn) | — | **≈32 đơn + 8 hoá đơn** |
| CD3 Chư Păh | docsPerMonth 4, b2b 1/5 (dòng 393–394) | 32 (≈6 hoá đơn + ≈26 đơn) | +1 đơn, +1 hoá đơn (451–464) | **≈27 đơn + 7 hoá đơn** |

Kèm: danh mục hàng 4–5 mặt/tenant (126–132, 268–274, 384–389); lô 6–7; bảng kê 5;
đặt chỗ 7; tài nguyên 7 (309–327); tin nhắn 2–3.

### 1.2. Số phần tử DOM mỗi màn (đếm từ template từng hàm view)

Cách đếm: đếm thẻ trong chuỗi template của mỗi item × số item từ seed ở trên.

| Màn | nguồn template | mỗi item | số item | tổng phần tử | nhận xét |
|---|---|---|---|---|---|
| Bán (viewBan) | mobile.html:278–341 | hàng hoá ~8; hoá đơn gần nhất 6 × ~7 | 4–5 hàng; 6 hoá đơn | **≈150–250** | nhẹ, máy rẻ chạy nổi |
| Đơn (viewDon) | mobile.html:442–457 | ~10/đơn + segment + định kỳ 3 × ~10 | CD1: ≈33 đơn | **≈380–400** | vừa; KHÔNG phân trang |
| Lịch (viewLich) | mobile.html:513–552 | khung lịch 5 ngày × (2 cano × 4 + lặn 3 + phòng có khách) hàng × ~5; đặt chỗ 8 × ~9 | 5 × ~11 + 8 | **≈330–400** | vừa |
| Hộp thư (viewHopThu) | mobile.html:1066–1135 | kịch bản ~5; sự kiện ~6 (KHÔNG giới hạn, dòng 1092); hàng đợi 8 × ~4 | 12–14 kịch bản + sự kiện tăng dần | ≈150 + **6/sự kiện, vô hạn** | dài dần theo thời gian dùng |
| **Sổ trực b2g** | sm-b2g.js:893–905 | bảng Hộ ai theo: ~11/hộ × **51 hộ** (48 mô phỏng sm-seed-b2g.js:20 + 3 thật); việc hôm nay ~7/việc × ~8–20 việc (hạn 30 + chờ quá hạn + hoãn luật, seed ép ≥2 + ≥2 + 1, sm-seed-b2g.js:108–118); suất QR + định mức + đợt OA + căn cứ | 51 + ~10–20 + kpis 5 × 4 | **≈1.200–1.800/lần render** | **nặng nhất toàn hệ thống** |

Kết luận mục 1: **không màn nào chạm mốc "nghìn nút" một ô nhập** ở phía HỘ — màn hộ
đềnh dưới ~400 phần tử, Android 2 GB vẫn mở được. Màn **Sổ trực b2g (cán bộ)** là màn
duy nhất cỡ ~1.500 phần tử — nhưng b2g có media riêng cho điện thoại cán bộ
(sm-b2g.js:880–889) nên vẫn chủ quan dùng được, chỉ giật khi bấm nút (mục 1.3).

### 1.3. Render lại TOÀN BỘ sau thao tác nhỏ — bằng chứng

- `render()` (mobile.html:2533–2542): `$('#view').innerHTML=v(t)` + **`window.scrollTo(0,0)`**
  — mọi thao tác đều dựng lại chuỗi HTML toàn màn RỒI nhảy về đầu trang.
- Bấm **＋** thêm 1 món vào giỏ (mobile.html:357–360) → `render()` → vẽ lại ~200 phần tử
  màn Bán + **cuộn nhảy về đầu**. Hộ đang cuộn xuống món thứ 5 để bấm + thì mất vị trí.
  Trong 1 phiên bán 20 món = 20 lần full re-render + 20 lần nhảy đầu trang. **Máy rẻ:
  giật; người bán: mất chỗ đang bấm.**
- Bấm lọc trạng thái đơn (mobile.html:461), bấm − món (362) — cùng cơ chế.
- `SM.on('queue:change')` (mobile.html:2562): mỗi việc trong hàng đợi gửi xong cách nhau
  250–500 ms (sm-core.js:212) đều `render()` lại màn ban/don → 10 việc chờ = ~20 lần
  vẽ lại toàn màn trong ~7 giây, đúng lúc hộ đang bán.
- b2g: `se.innerHTML = h` (sm-b2g.js:905) dựng lại TOÀN BỘ Sổ trực (~1.500 phần tử) sau
  MỖI bấm nút trạng thái việc (930), bấm sinh suất (956), đổi lựa chọn cán bộ (959);
  cộng thêm `SM.on('db:save')` (962) — hộ ở tab khác bấm gì đó, Sổ trực cán bộ cũng vẽ lại.

**Đề xuất**: (a) bớt ngay `window.scrollTo(0,0)` cho các render do thao tác cuộn-less
(giữ scroll cho `data-add/data-dec`, chỉ reset khi đổi TAB); (b) phần thân giỏ/đếm số
tăng giảm chỉ cập nhật node đó (`textContent`) thay vì cả màn; (c) Sổ trực chia panel
theo khối, bấm nút việc chỉ thay class dòng đó; (d) viewDon thêm phân trang 20 đơn/trang
hoặc nút "xem thêm".

## 2. MẠNG YẾU — chỗ nào chờ mạng, chỗ nào im lặng

### 2.1. Bản đồ chỗ chờ/phản ứng mạng (grep `SM.enqueue|isOnline|setOnline|drain`)

| Chỗ | file:dòng | hành vi khi mất mạng |
|---|---|---|
| Thu tiền tại quầy (doPay) | mobile.html:370+ | **không kiểm mạng** — ghi thẳng tenant + `SM.save()` (sm-core.js:146–150), dòng tiền vào sổ ngay |
| Xuất hoá đơn POS | mobile.html:379, 387 | tạo hoá đơn `cqtState:'queued'` + `SM.enqueue('einvoice',…)` (sm-domain.js:607–622); có note «Đang mất mạng. Vẫn thu tiền và lập hoá đơn được» + toast «chờ có mạng» |
| Hoá đơn điều chỉnh/nhắc nợ | sm-ops.js:178–182, 357 | tương tự — offline vẫn lập, xếp hàng đợi |
| Bảng kê tại vườn | mobile.html:642, 705 | «mất mạng — vẫn lập được», enqueue 'report' |
| Gửi đăng ký Zalo OA / HĐĐT (wizard) | sm-onboard.js:1603, 1669 | KHÔNG chặn — `datKetNoi` ghi ngay + enqueue 'dangky' |
| Nút máy bay | mobile.html:2558–2559 | bật/tắt mô phỏng + toast dặn «Cứ bán tiếp» |
| Thanh trạng thái | mobile.html:228–231 | netbar đỏ «MẤT MẠNG — vẫn bán được, gửi lên sau» + badge «N chờ gửi» |

**Trả lời câu hỏi đề**:
- **Bán hàng có làm trọn khi mất mạng không?** — CÓ. Toàn bộ nghiệp vụ ghi cục bộ trước,
  gửi sau (nguyên tắc sm-core.js:146–150). Không phát hiện chỗ nào bắt `isOnline()` mới
  cho làm — grep mọi nhánh `isOnline` đều chỉ để ĐỔI CHỮ/ĐỔI TRẠNG THÁI hiển thị.
  → **không có chỗ "chặn oan"** ở phiên bản đo.
- **Xuất hoá đơn thì sao?** — lập hoá đơn offline ĐƯỢC (queued + hàng đợi); mã cơ quan
  thuế chỉ về khi có mạng (applyAck sm-core.js:217–236). Đúng lời hứa IV.4.

### 2.2. Chỗ mất mạng mà KHÔNG nói gì (người dùng bấm rồi tưởng hỏng)

- **`SM.inbox.simulate()`** (sm-inbox.js:462–476): comment khối (dòng 463–465) hứa «Nếu
  đang mất mạng thì sự kiện vẫn vào sổ nhưng ghi rõ là nhận được khi có mạng lại» —
  nhưng THÂN HÀM KHÔNG hề đọc `SM.isOnline()`. Đang bật chế độ máy bay mà bấm giả lập
  «Khách đặt hàng trên sàn» → sự kiện "từ sàn đến" hiện NGAY như thể mạng đang sống.
  Người dùng không phân biệt được mô phỏng và thực tế — sai lệch giữa chữ và hành vi, dễ khiến
  hộ tin "mạng có mà sao không gửi được".
- **Việc chờ gửi nằm im**: mở lại app khi hàng đợi còn việc — không có dòng chủ động nào
  nói «còn N việc chờ gửi» cho tới khi vào màn có `sangNayCard` (mục 3.2). Toast không
  hiện. Nhẹ hơn trường hợp trên nhưng cùng họ "im lặng".

### 2.3. Lỗi hẹn drain khi mở lại app

`drain()` chỉ được gọi từ 2 chỗ: `setOnline(true)` (sm-core.js:158) và `enqueue` khi
đang online (sm-core.js:180). Boot của mobile.html (2571: `SM.db();render();`) và
b2g.html KHÔNG gọi `drain()`. Hệ quả: hộ tắt máy khi còn 3 hoá đơn chờ gửi, hôm sau mở
app có mạng → **3 việc nằm chờ vô hạn** cho tới khi hộ bấm máy bay 2 lần hoặc làm một
nghiệp vụ mới. Đây là lỗi thật của luồng "tự đồng bộ khi có mạng trở lại" (IV.4).

## 3. ĐỒNG BỘ LẠI KHI CÓ MẠNG

### 3.1. Tắt máy / đóng trình duyệt giữa lúc hàng đợi còn việc — việc có mất không?

**KHÔNG mất.** Hàng đợi nằm trong `localStorage 'smv3:queue'` (sm-core.js:16, 162),
ghi qua `writeRaw` sau mỗi bước drain (210) — tắt máy giữa chừng, việc đang `pending`
vẫn nguyên trong kho. Nhưng như mục 2.3: việc không mất mà nằm im — **chữ "tự đồng bộ
khi có mạng trở lại" chỉ đúng khi có ai chạm tới công tắc mạng hoặc nghiệp vụ mới.**

### 3.2. «Còn N việc chờ gửi» có dễ thấy không?

CÓ — 3 chỗ: netbar đầu màn `#qCount` «N chờ gửi / đã gửi hết» (mobile.html:230–231),
thẻ «Sáng nay cần để ý» mục «N việc chờ gửi khi có mạng» bấm đi thẳng Hộp thư
(mobile.html:265–266), và bảng hàng đợi trong Hộp thư (mobile.html:1115–1134, hiện 8
việc đầu + nút dọn việc đã gửi). Thiết kế đạt.

### 3.3. Có bị gửi trùng khi vào mạng lại không?

- **Bản ĐẾN từ ngoài**: có chống trùng đúng chỗ — `khoaDuyNhat()` (sm-inbox.js:143–147)
  tra mã giao dịch `transaction_id|id|maGiaoDich|maDon|maVanDon|maDat`; bản trùng bị
  đánh `trung-bo`, KHÔNG cộng tiền lần hai (sm-inbox.js:165–183), kịch bản demo
  `tien-ve-trung` bắn đúng payload cũ (sm-inbox.js:408–422). Đạt.
- **Hoá đơn phát hành trùng khi offline**: có khoá dấu vân giỏ `vanTayGio + kiemTrung`
  (sm-ops.js:192–204) — đúng giỏ + đúng ngày thì trả lại hoá đơn cũ. Đạt.
- **Hàng đợi GỬI ĐI**: 2 điểm yếu thực measurement được:
  1. **ID việc trùng**: id = `'J' + (q.length + 1)` (sm-core.js:172). Nút «Dọn việc đã
     gửi» (`clearQueueDone`, sm-core.js:246–249) XOÁ các việc done → `q.length` giảm →
     việc enqueue tiếp nhận lại id đã dùng. Hai việc cùng id trong hàng đợi: hiển thị
     nhầm việc, đối chiếu về sau không tin được. Nghiệp vụ không sai (applyAck đi qua
     `ref`, sm-core.js:218–236) nhưng sổ journal mất chuẩn.
  2. **EV id trùng chéo tenant**: id sự kiện = `'EV' + (l.length+1)` (sm-inbox.js:55)
     trong khi `clear()` XOÁ theo tenant (sm-inbox.js:478–481) → sau khi xoá hộ A, sự
     kiện mới của A có thể trùng id với sự kiện cũ còn sống của hộ B; `process(evId)`
     dò `all().find(x => x.id === evId)` (sm-inbox.js:155) trả bản ĐẦU TIÊN tìm thấy →
     có thể xử lý NHẦM sự kiện của hộ B. Chỉ xảy ra khi dùng đa tenant trên một máy
     (đúng cách demo này chạy) — mức gợn, nhưng sửa một dòng (id theo `Date.now()` hoặc
     UUID con đếm toàn cục) là hết.
  3. **Hai tab cùng drain**: cờ `draining` là biến từng tab (sm-core.js:184), không chia
     sẻ qua storage — 2 tab mở cùng lúc đều drain, mỗi việc có thể bị 2 tab cùng nhặt
     trong cửa sổ 250–500 ms (tries tăng 2 lần, phát 2 dòng nhật ký queue). Hộ thật
     1 tab ít gặp — ghi để biết.

## 4. NGOÀI NẮNG — TƯƠNG PHẢN

Bảng màu (mobile.html:12–21): `--ink:#14191B · --ink2:#4A5457 · --ink3:#788386 ·
--card:#FFFFFF · --bg:#F2F4F3 · --sunk:#E9ECEB · --brand:#0E6360 · --crit:#A32E24…`
Tỉ lệ tính WCAG 2.1 (ngưỡng: 4,5:1 chữ thường, 3:1 chữ to ≥18pt/14pt đậm):

| Cặp màu | tỉ lệ | đạt? | chỗ dùng |
|---|---|---|---|
| `--ink` #14191B trên #FFFFFF | 16,6:1 | đạt | chữ chính |
| `--ink2` #4A5457 trên #FFFFFF | **7,8:1** | đạt | tên hàng, nhãn input (90) |
| trắng trên `--brand` #0E6360 | 7,1:1 | đạt | header, nút chính |
| trắng 85% (opacity .85) trên `--brand` | 5,6:1 | đạt | dòng phụ header (.hrow .who span, 41) |
| trắng trên `--crit` #A32E24 | 7,1:1 | đạt | netbar «MẤT MẠNG» (47) |
| `--crit` trên `--crit-soft` #F9E7E4 | 5,9:1 | đạt | tag đỏ (77) |
| `--warn` trên `--warn-soft` | 5,2:1 | đạt | tag vàng (76) |
| `--ok` trên `--ok-soft` | 6,1:1 | đạt | tag xanh (75) |
| **`--ink3` #788386 trên #FFFFFF** | **3,90:1** | **TRƯỢT 4,5** | `.muted` 12,5px (57), `.sub` 11,5px (54), nhãn nav 10,5px (99) — chữ phụ khắp mọi màn |
| **`--ink3` trên `--bg` #F2F4F3** | **3,53:1** | **TRƯỢT** | muted nằm trên nền trang |
| **`--ink3` trên `--sunk` #E9ECEB** | **3,28:1** | **TRƯỢT** | `tag.gray` (79) — nhãn «chưa xuất», «giữ N», «đã gửi» cỡ 10–11px |
| b2g `--ink3` #76817E trên trắng | 4,0:1 | TRƯỢT | tiêu đề KPI/bảng b2g 10,5px (b2g.html:33, 41, 46, 54) |

Đáng chú ý nhất: **biểu đồ mùa ở màn Lịch vẽ GIÁ TRỊ bằng chữ 9px màu `--ink3`**
(mobile.html:559–561) — 9px + 3,9:1: trong nhà còn phải nheo mắt, ngoài nắng là KHÔNG
ĐỌC ĐƯỢC — vi phạm luôn quy ước «số trên cột phải đọc được» của dashboard.

**Chỗ chỉ dùng MÀU để phân biệt**: rà hết — không tìm thấy chỗ nào phân biệt trạng thái
CHỈ bằng màu không kèm chữ/số: netbar có chấm màu + chữ «Có mạng/MẤT MẠNG» (229);
thanh lịch đầy chuyển đỏ + con số `used/cap` đổi đỏ kèm (522–526); mọi tag đều có chữ.
Thiết kế phần này đạt.

**Đề xuất**: tối `--ink3` từ #788386 → khoảng #5F6B6E (đạt ≥4,6:1 trên trắng), giữ
nghĩa "mực phụ"; riêng biểu đồ mùa tăng cỡ 9px → 11px và dùng `--ink2`; tag.gray dùng
`--ink2`. Đây là sửa 1 dòng CSS cho cả app.

## 5. TỐN DỮ LIỆU VÀ PIN

- **Không tải gì từ ngoài**: grep toàn repo `@font-face|@import|<img|base64|cdn|https?://`
  chỉ ra icon.svg nội bộ + chuỗi tài liệu — không font web, không ảnh ngoài, không CDN.
  Font dùng hệ thống (mobile.html:25). Lần đầu nạp ≈ 186KB (mobile.html) + ~400KB js
  ≈ **600KB — nhẹ hơn 1 ảnh mạng xã hội**; các lần sau service worker lấy từ cache
  (sw.js:83–96). Đạt tốt cho 3G chập chờn.
- **Không vòng lặp chạy nền**: KHÔNG có `setInterval` thường trú, KHÔNG `@keyframes`/
  `animation` nào trong mobile.html. `setInterval` duy nhất là đồng hồ đếm giây khi
  GIỮ nút xoá dữ liệu (sm-onboard.js:2210–2215) — có `clearInterval` khi thả nút hoặc
  hoàn tất. Toast 5,2 giây một lần đúng lúc mở đầu (mobile.html:2576–2578). Máy không
  nóng vì app.
- **Điểm cần biết (không phải lỗi mockup)**: `SM.save()` ghi lại TOÀN BỘ DB JSON
  (sm-core.js:117–120) mỗi nghiệp vụ — với seed hiện tại ước 40–60KB/lần ghi (3 tenant
  × ~50 chứng từ + nhật ký; ước từ literal trong sm-seed-gialai.js) — localStorage là
  kho ĐỒNG BỘ nên ghi chặn luồng UI; nhật ký + sự kiện dài dần theo năm tháng thì mỗi
  lần bấm chậm thêm. Sản phẩm thật phải chuyển IndexedDB + ghi theo từng tenant/đợt.
- **Rủi ro âm thầm lớn nhất**: localStorage giới hạn ~5MB; khi tràn, `writeRaw` chỉ
  `console.warn` và TRẢ FALSE (sm-core.js:87–90) — **không một dòng nào báo cho hộ**:
  hộ bán tiếp, máy nhận bấm, dữ liệu không vào kho. Ở địa bàn thật dùng 2–3 năm là kịch
  bản có thật. Mockup chưa thấy vì dữ liệu nhỏ.

## 6. MÀN NHỎ VÀ TAY CẦM

- **viewport**: `width=device-width, initial-scale=1, viewport-fit=cover` (mobile.html:5) — đạt.
- **Tai thỏ**: nav dưới đã chừa `padding-bottom:env(safe-area-inset-bottom)` (mobile.html:96),
  thân `main` chừa sẵn `padding:12px 12px 100px` (mobile.html:50) nên nav không che nút.
  NHƯNG header trên KHÔNG có `env(safe-area-inset-top)` (mobile.html:37 — grep toàn file
  chỉ 1 chỗ safe-area) → cài PWA standalone trên máy tai thỏ, chữ «tên hộ + nút máy bay»
  nằm sát mép dưới tai thỏ/notch, có thể bị che một phần.
- **b2g.html**: `viewport` CHỈ `width=device-width, initial-scale=1` (b2g.html:5) — thiếu
  `viewport-fit=cover`; Sổ trực có media riêng ≤480px (sm-b2g.js:880–889: nút ≥44px,
  bảng cuộn ngang, KPI 2 cột) — tốt cho điện thoại cán bộ, chỉ thiếu hai cái safe-area.
- **Xoay ngang**: mọi media query đều `min-width:900px` (mobile.html:29, 97, 108, 122,
  128) — điện thoại ngang (~740–860px) không khớp nhánh nào → app giữ khung dọc
  `max-width:430px` (mobile.html:27) nằm giữa, hai bên trống nền sáng. KHÔNG vỡ layout,
  chỉ phí nửa màn — người bán ít xoay ngang, chấp nhận được.
- **Cỡ chữ hệ thống 200%**: mọi cỡ chữ là px (không rem) — Chrome Android «phóng chữ
  trợ năng» vẫn nhân mọi px. Thử suy diễn từ CSS: nav label 10,5px→21px làm nav cao
  thêm ~20px (main đang chừa 100px — đủ); bảng `table.t` 13px→26px giãn DỌC (word-wrap
  có sẵn trong table thường), khối `.row` flex-wrap có chỗ có chỗ không — chữ tên hàng
  dài có thể đè nhẹ số tiền bên phải. Không có màn nào CHE NÚT bấm chính. Chế độ «Aa»
  sẵn có (body.simple 19px, nút 64px — mobile.html:111–119) là đường chính cho người
  lớn tuổi, an toàn hơn phóng chữ hệ thống.
- **PWA khi mất mạng** (manifest.webmanifest + sw.js):
  - Cài từ CHAY-DEMO (http://localhost) → service worker đăng ký (mobile.html:2583);
    `install` tải sẵn 13 file (sw.js:13–28); mở offline sau lần online đầu: mobile.html
    lấy từ cache (sw.js:67–80), js cache-first (83–96) → **app HỘ mở được offline**. Đúng
    lời hứa.
  - **NHƯNG** `b2g.html / index.html / web.html` KHÔNG nằm trong TAP_TIN (sw.js:13–28)
    và fallback trang HTML luôn rơi về `mobile.html` (sw.js:76) → **cán bộ mất mạng mở
    Sổ trực sẽ thấy… app của hộ**. Sai người dùng, sai dữ liệu hiển thị.
  - Icon khai báo DUY NHẤT icon.svg `purpose:"any maskable"` (manifest.webmanifest:14–19)
    — Chrome Android một số launcher không duyệt SVG maskable → ô trắng; máy thật nên
    kèm PNG 192/512.
  - Mở bằng `file://` thì sw không đăng ký (sw.js:4–5 ghi rõ) — app vẫn chạy như web
    thường; đây là giới hạn nền tảng, đã ghi thẳng trong code.

---

## BẢNG TỔNG KẾT

| # | điều kiện | vấn đề | bằng chứng | mức | sửa đề xuất |
|---|---|---|---|---|---|
| 1 | máy yếu | mọi thao tác nhỏ (＋/− món, lọc) render lại toàn màn + `scrollTo(0,0)` nhảy về đầu trang — giật máy rẻ + mất vị trí bán hàng | mobile.html:2538,2541,360 | **GẮT** | bỏ scrollTo cho render tại chỗ; cập nhật node giỏ bằng textContent |
| 2 | máy yếu | Sổ trực b2g ~1.200–1.800 phần tử, bấm 1 nút việc = vẽ lại TOÀN BỘ | sm-b2g.js:905,930,956,962 | **GẮT** | render từng khối; nút việc chỉ đổi class dòng |
| 3 | máy yếu | viewDon render toàn bộ đơn không phân trang (CD1 ≈33; dữ liệu thật sẽ ×10) | mobile.html:443 | GỢN | phân trang 20 + «xem thêm» |
| 4 | máy yếu | Hộp thư render vô hạn sự kiện (hàng đợi đã slice 8, sự kiện thì không) | mobile.html:1092 vs 1121 | GỢN | slice 20 + đếm «còn N» |
| 5 | máy yếu | mỗi việc drain xong (250–500ms) render lại màn bán/đơn — bùng nổ khi hàng đợi dài | mobile.html:2562 + sm-core.js:212 | GỢN | queue:change chỉ renderHead + badge |
| 6 | mạng yếu | mở lại app KHÔNG tự drain — việc chờ nằm im vô hạn dù có mạng | sm-core.js:158,180; boot mobile.html:2571 | **GẮT** | gọi `SM.drain()` ngay sau `SM.db()` |
| 7 | mạng yếu | `simulate()` không kiểm isOnline dù comment hứa «ghi rõ nhận khi có mạng lại» — sự kiện ngoài hiện ngay khi offline | sm-inbox.js:463–476 | GẮT | thêm nhánh offline đúng như comment |
| 8 | mạng yếu/pin | localStorage tràn ~5MB → ghi MẤT ÂM THẦM (writeRaw trả false, chỉ console.warn) | sm-core.js:87–90 | **CHẶN dài hạn** | báo «máy đầy — xuất dữ liệu + liên hệ cán bộ»; roadmap IndexedDB |
| 9 | pin | save() ghi lại toàn DB JSON (~40–60KB theo seed) mỗi nghiệp vụ, chặn luồng UI | sm-core.js:117–120 | GỢN | roadmap IndexedDB, ghi theo tenant |
| 10 | đồng bộ | id việc `J+(q.length+1)` trùng sau «Dọn việc đã gửi» | sm-core.js:172, 246–249 | GỢN | id = `'J'+Date.now()` hoặc đếm không giảm |
| 11 | đồng bộ | EV id trùng chéo tenant sau clear() → process() có thể nhầm sự kiện hộ khác | sm-inbox.js:55,155,478–481 | GỢN | id duy nhất toàn cục |
| 12 | đồng bộ | 2 tab cùng drain đua nhau (draining cục bộ từng tab) | sm-core.js:184–215 | GỢN | khoá qua localStorage |
| 13 | nắng | `--ink3` 3,90:1 trên trắng / 3,53:1 trên nền / 3,28:1 trong tag.gray — dưới 4,5:1 cho chữ phụ 10,5–12,5px | mobile.html:14, 54, 57, 79, 99 | **GẮT** | `--ink3:#5F6B6E` |
| 14 | nắng | số trên biểu đồ mùa 9px màu --ink3 — không đọc nổi ngoài nắng | mobile.html:559–561 | **GẮT** | 11px + --ink2 |
| 15 | nắng | b2g --ink3 #76817E = 4,0:1 cho chữ KPI/bảng 10,5px cán bộ | b2g.html:10,33,46,54 | GỢN | cùng bộ sửa #13 |
| 16 | màn nhỏ | header không chừa `safe-area-inset-top` — PWA máy tai thỏ che chữ header | mobile.html:37 (chỉ 96 có safe-area) | **GẮT** | `padding-top:env(safe-area-inset-top)` |
| 17 | màn nhỏ | b2g.html viewport thiếu `viewport-fit=cover` | b2g.html:5 | GỢN | thêm như mobile |
| 18 | màn nhỏ | xoay ngang <900px: khung dọc 430px giữa màn, hai bên trống (không vỡ) | mobile.html:27–32, media 900px duy nhất | GỢN | chấp nhận hoặc media landscape 2 cột |
| 19 | màn nhỏ | chữ hệ thống 200%: nav cao thêm, hàng flex chữ đè nhẹ — không che nút chính (chế độ Aa sẵn 19px/64px là đường chính) | mobile.html:50,96,111–119 | GỢN | khuyến cáo địa bàn dùng chế độ Aa thay vì phóng chữ hệ thống |
| 20 | offline PWA | b2g/index/web KHÔNG trong TAP_TIN + fallback HTML luôn về mobile.html — cán bộ offline mở Sổ trực ra app hộ | sw.js:13–28, 69–78 | **GẮT** | thêm 3 file vào TAP_TIN, fallback theo pathname |
| 21 | offline PWA | icon chỉ SVG maskable — một số launcher Android vẽ ô trắng | manifest.webmanifest:14–19 | GỢN | kèm PNG 192/512 |
| 22 | dữ liệu | tổng nạp lần đầu ~600KB, không CDN/font/ảnh ngoài, không animation/setInterval nền — ĐẠT (ghi để biết chuẩn đã tốt) | grep toàn repo; sw.js:83–96 | đạt | — |

Ghi «đạt» thêm cho: bán + xuất hoá đơn trọn offline (mục 2.1), không chỗ nào chặn oan,
hàng đợi sống qua tắt máy, badge «N chờ gửi» 3 chỗ, chống trùng bản đến theo mã giao
dịch, chống trùng hoá đơn theo dấu vân giỏ, mọi trạng thái màu đều kèm chữ.

## TRẢ LỜI THẲNG: mai đem Android 3 triệu ra chợ Nhơn Lý, cái gì hỏng trước tiên?

Thứ tự hỏng theo chiều thời gian của buổi bán:
1. **Ngay phút đầu, đứng ngoài trời**: đọc tiền dòng phụ và nhãn trạng thái xám
   (3,3–3,9:1) phải lấy tay che nắng — số tiền «còn 4 kg» mờ nhạt. Chữ chính và nút
   vẫn đọc được.
2. **Buổi bán đầu tiên**: bấm ＋ món thứ ba trở đi thấy giật + trang nhảy về đầu, cô
   bán phải cuộn tìm lại món — không hỏng nhưng bực, người lớn tuổi dễ bỏ tay.
3. **Ngày đầu mất sóng (rất thường ở Nhơn Lý)**: bán VẪN trọn (điểm mạnh thật của app);
   NHƯNG nếu hôm đó tắt máy giữa chừng rồi mở lại khi có sóng — hàng đợi nằm im không
   tự gửi (lỗi #6). Hộ tưởng «gửi rồi», hoá đơn không có mã cơ quan thuế.
4. **Ngày đầu-can bộ**: cán bộ cài PWA mở Sổ trực ngoài sóng → ra app của hộ (lỗi #20).
5. **Năm thứ hai**: kho đầy 5MB → ghi mất âm thầm (lỗi #8) — nguy hiểm nhất nhưng muộn nhất.

Tóm một câu: **phần SỐNG được offline đã đúng thiết kế; phần "quay lại online" và
"đọc ngoài nắng" là hai mảng hỏng trước tiên.**

## TOP-8 SỬA TRƯỚC NHẤT (đề xuất cho đợt tích hợp)

1. Gọi `SM.drain()` ngay sau `SM.db()` lúc boot (sửa 1 dòng, hết lỗi #6 — đúng lời hứa IV.4).
2. `--ink3` → #5F6B6E (sửa 1 dòng CSS, hết #13, sửa luôn b2g #15) + cỡ chữ biểu đồ mùa 11px --ink2 (#14).
3. Bỏ `window.scrollTo(0,0)` cho render do ＋/− món; cập nhật giỏ tại chỗ (#1).
4. `simulate()` thêm nhánh offline đúng như comment đã hứa (#7).
5. sw.js: thêm `b2g.html`, `index.html`, `web.html` vào TAP_TIN + fallback theo pathname (#20).
6. header `padding-top:env(safe-area-inset-top)`; b2g viewport-fit=cover (#16, #17).
7. id việc/EV độc nhất (Date.now/UUID) — hết nguy cơ nhầm khi dọn hàng đợi (#10, #11).
8. `writeRaw` thất bại → hiện cảnh báo đỏ «máy nhớ đầy — dữ liệu chưa lưu được» (#8);
   song song roadmap IndexedDB (#9).

— hết —
BUILD-AGENT-DONE M2 22
