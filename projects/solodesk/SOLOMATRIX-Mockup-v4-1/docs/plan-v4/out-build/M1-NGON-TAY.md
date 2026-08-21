# M1 — NGÓN TAY VÀ MÀN HÌNH: bấm có trúng không, một tay có với tới không

Soát ngày 20/08/2026. Đối tượng: `mobile.html` (bản hiện hành 2586 dòng — V6 đang sửa song song,
thẻ script đã mang `?v=20260820c` + `sm-onboard.js` ở dòng 177; số dòng dưới đây là số của bản đo hôm nay,
có thể dịch sau). Nút «bấm giữ 5 giây» nằm trong `js/sm-onboard.js` của W1 — có đọc riêng để đánh giá.
Tôi KHÔNG sửa code — mọi con số dưới đều đo từ CSS/HTML/JS có sẵn, dán bằng chứng kèm.

Chuẩn đo: **44×44 px** = kích thước chạm tối thiểu cho ngón tay (Apple HIG / Material); ngón tay to, ướt
hoặc dính thì cần dự trữ thêm. Màn tham chiếu: Android 5,5" ≈ 360–412 px CSS rộng, ~660–740 px cao;
cầm một tay → vùng thoải mái của ngón cái = **nửa dưới màn hình**.

---

## 1. Vùng chạm — bảng đo toàn bộ loại nút

Chiều cao tính = `font-size × line-height (1.5) + padding dọc × 2 + border`; chỗ nào CSS cho
`min-height` sẵn thì lấy min-height.

| Loại nút | Nơi định nghĩa | Kích thước tính được | Đạt 44 px? |
|---|---|---|---|
| `.btn` (nút thường) | `mobile.html:65-66` `min-height:var(--tap)` với `--tap:48px` (:20) | **48 px** cao | ✅ đạt |
| `.btn.pri` / `.btn.dan` | :68-69 (chỉ đổi màu, giữ min-height 48) | 48 px | ✅ |
| `input, select, textarea` | :87-88 `min-height:var(--tap)` | 48 px | ✅ |
| `nav button` (thanh dưới) | :98-99 `min-height:58px`, rộng ≈ 1/5 màn (72–86 px) | 58×~80 px | ✅ |
| `#fab` (nút trò chuyện) | :105-107 `width:56px;height:56px` | 56×56 px | ✅ |
| `.mi` (mục menu Thêm) | :143-144 `padding:14px`, full-width | ~52–68 px cao | ✅ |
| **`.btn.sm`** (nút nhỏ) | :71 `min-height:38px;font-size:13.5px` | **38 px** | ❌ **dưới 6 px** |
| **`.chip`** (☰, Aa) | :42-43 `padding:6px 11px;font-size:12px` | **~32 px** | ❌ |
| **`#btnAir`** ✈ chế độ máy bay | :163 inline `style="padding:3px 10px;font-size:11.5px"` | **~25 px** | ❌ nhỏ nhất app |
| **`.seg button`** (chip lọc đơn) | :139-141 `padding:7px 13px;font-size:12.5px`, gap 6 px | **~34 px** | ❌ |
| `.tag` (nhãn trạng thái) | :74 `font-size:11px;padding:2px 8px` | ~21 px | không phải nút — không bấm được, khỏi áp |
| `nav button .bdg` (chấm số) | :102-103 `font-size:9.5px` | nhỏ | chỉ là chỉ báo, không bấm |

Điểm sáng: `--tap:48px` là biến sẵn — hạ tầng tốt, chỉ có các lớp «phụ» обход biến này.
Chế độ chữ to `body.simple` (:111-119) nâng `.btn` lên 64 px — và do `body.simple .btn` (độ đặc hiệu
0-2-1) thắng `.btn.sm` (0-2-0), nút `.sm` cũng được nâng lên 64 px trong chế độ này. NHƯNG `.chip`
và `.seg button` **không có luật simple** — tức người già đã bật «chữ to» thì nút ☰/Aa/✈ vẫn 25–32 px.

Nút `.btn.sm` (38 px) đang dùng ở **22+ chỗ** — nhiều chỗ là thao tác chính, không phụ:
- `mobile.html:315-316` nút **−** và **＋** thêm/bớt món khi bán hàng (dùng liên tục cả ngày);
- :247, :273 nút «Xem» trong thẻ việc «Sáng nay cần gì»/hạn chót;
- :308 nút «🎤 Nói thay gõ» — cửa ngõ quan trọng nhất cho hộ mù công nghệ;
- :321 nút «Xoá» giỏ hàng (xem mục 3 — nguy hiểm);
- :671 nút «Truy xuất» lô hàng; :957 nút «Nối» kết nối kênh; :1297 «Ghi điều chỉnh» kiểm kê;
- :196 nút «Đóng» mọi sheet; :1079 nút giả lập hộp thư.

## 2. Vùng ngón cái với tới

Đã đúng vị trí (nửa dưới): thanh nav 5 nút, `#fab` (bottom 76 px — :105), nút «Thu tiền QR» trong
footer giỏ (:322), nút ＋ mỗi món nằm giữa màn. Phần này thiết kế ổn.

Đang nằm ở NỬA TRÊN nhưng dùng thường xuyên:

| Hành động | Vị trí hiện nay | Tần suất dùng | Đề xuất |
|---|---|---|---|
| 🎤 «Nói thay gõ» | đầu trang tab Bán, kẹt trong tiêu đề card :308 | mỗi khách khó gõ | nhân đôi: khi giỏ trống, thay dòng chữ «Chạm ＋ để thêm món» (:324) bằng nút 🎤 to (`.btn pri w`) — đúng chỗ tay đang nằm |
| `Aa` đổi cỡ chữ | góc phải trên cùng :159 | 1 lần/quá trình, nhưng người 55–60 tuổi cần thấy NGAY | thêm mục «Chữ to hơn» vào tab Thêm (nhóm Hệ thống) + gợi ý bật ở cuối wizard onboard |
| Seg lọc đơn | đầu tab Đơn :426 | mỗi lần tra đơn | đã gần đầu nội dung — chấp nhận; chỉ cần tăng cỡ chip (mục 1) |
| ☰ đổi chân dung :157, ✈ chế độ máy bay :163 | netbar/đầu trang | ☰ = công cụ demo; ✈ = mô phỏng | giữ nguyên (không phải thao tác của hộ), chỉ cần đạt chuẩn 44 px để bấm demo không vấp |
| Nút «Xem» trong thẻ hạn :247, :273 | đầu trang tab Bán | vài lần/ngày | đạt chuẩn 44 px là đủ, không cần dời |

## 3. Nút nguy hiểm cạnh nút an toàn — chỗ mất tiền thật

| Cặp | Bằng chứng | Khoảng cách | Mức |
|---|---|---|---|
| **«Xoá» giỏ ↔ «Thu tiền QR»** | :320-322 cùng hàng `.row` `gap:8px`; «Xoá» là `.btn gh sm` 38 px; handler :363 `cart=[];render()` — **MỘT CHẠM, KHÔNG HỎI LẠI** | ngang 8 px | 🔴 **CHẶN** — tay định bấm thu tiền trượt sang trái 1 cm là mất cả giỏ đang bán |
| **«Xoá mặt hàng»** | :1242 nút `.btn dan w` cuối form sửa hàng; handler :1259-1262 gọi `D.deleteSku` rồi đóng sheet — **một chạm, không xác nhận** | đứng cuối, không kề nút nào | 🔴 **CHẶN** — sửa giá xong lỡ tay cuộn xuống bấm đúng nó là mất mặt hàng |
| «−» ↔ «＋» thêm/bớt món | :314-316 `gap:6px`, cả hai 38 px | ngang 6 px | 🟠 **GẮT** — bấm nhầm giảm món, khách nhận thiếu; sửa lại được nhưng lúc đông khách là rối |
| «Thu hồi» thiết bị | :2233 `.btn dan sm` — nút đỏ 38 px, kề nhãn «đang dùng» | — | 🟠 **GẮT** — may là có sheet xác nhận lý do :2243; chỉ cần nút to lên |
| «Ghi nhận đã trả» ↔ «Ghi nợ khó đòi» | :2368 `.btn pri w` và :2370 `.btn dan w`, giữa 2 nút là 1 ô nhập lý do (~70 px dọc) | dọc ~70 px | 🟡 **GỢN** — hai hành động đối lập trong một sheet; đã có «lý do bắt buộc» chặn :2382 — thiết kế chữ tốt, giữ |
| «Huỷ» ↔ «Khách đã trả — xuất hoá đơn» | :380-381 `gap:8px`, cả hai 48 px | ngang 8 px | 🟡 **GỢN** — «Huỷ» chỉ đóng sheet, không mất dữ liệu |
| «Huỷ lượt đặt» | :1533-1536 | — | ✅ **MẪU TỐT để noi**: lý do bắt buộc :1534 + cảnh báo tiền cọc :1535 + nút đỏ riêng cuối card. Mọi nút huỷ/xoá nên theo khuôn này |

## 4. Bàn phím che màn

**(a) Ô nhập số có đặt bàn phím số đúng — điểm sáng, gần như đầy đủ:**
- Có `inputmode="numeric"`: MST :400, số khách :535, CCCD :645, số lượng/giá mua :648-649, cọc :1519,
  sức chứa :1613/:1644, giá mới :1677/:1693, trả hàng :1760, kết ca :1825/:1836, nợ :1916/:2366,
  huỷ hỏng :2097.
- `type="number"` không kèm inputmode (:1232, :1281, :1382) vẫn mở được bàn phím số — đạt.
- Ô chữ đúng loại chữ: tên/địa chỉ :398-401, câu hỏi trợ lý :818, mã biên nhận :796 (mã có cả chữ).
- **Không có ô nhập số điện thoại nào trong `mobile.html`** (khách lấy từ seed) — không có lỗi sai loại bàn phím nào phát hiện được.

**(b) Bàn phím bung lên che nút xác nhận — lỗi HỆ THỐNG chung của mọi sheet:**
`.sheet .inner` (:123-124) là `max-height:92vh;overflow:auto`, nút hành động luôn nằm SAU ô nhập cuối.
Trên Android khi bàn phím mở, khung nhìn co lại, đám nút cuối rơi xuống dưới vành bàn phím. Màn dính:
- Nhập kho/điều chỉnh :1281-1288 · Khoản chi :1378-1385 · Ghi cọc :1519-1520 · Kết ca :1825+:1836
- Công nợ: nhận tiền :1916 · trả tiền + nợ khó đòi :2366-2370 · Hoá đơn điều chỉnh :1959-1962
- Huỷ hàng hỏng :2097-2099 · Mua nông sản :644-649 · Nộp thuế mã biên lai :796
Người trẻ biết cuộn/đóng bàn phím; hộ 55–60 tuổi hay kết luận «nút biến mất». Sửa một chỗ chữa cả hệ thống:
nút hành động chính trong sheet đặt `position:sticky;bottom:0` với nền đặc.

**(c) autofocus:** quét toàn file — không có attribute `autofocus`, không có lời gọi `.focus()` tay nào. ✅ sạch.

## 5. Danh sách dài và cuộn

| Màn | Bằng chứng | Độ dài tính | Mức |
|---|---|---|---|
| **Tab Đơn** | :442-457 render TOÀN BỘ `loc` không giới hạn (`loc.map` hết, không slice); seed sinh mỗi tháng tối đa 6 chứng từ × 8 tháng (sm-seed-gialai.js:74-116 `docsPerMonth:6`, vòng 1→8) ≈ **30–40 đơn/hoá đơn** | mỗi dòng ~64–80 px (:446-455) → 2.100–2.900 px ≈ **3,2–4 màn hình** cuộn | 🟠 **GẮT** — đề xuất: mặc định hiện 14 ngày gần + nút «Xem cả tháng/cả năm», hoặc gom tiêu đề theo tháng (cuộn vẫn dài nhưng có mốc) |
| Menu Thêm | :883-912 ~20 mục `.mi` chia 4 nhóm có tiêu đề | ~1.400 px ≈ 2 màn | 🟡 GỢN — đã phân nhóm tốt (comment :881 nói rõ), giữ nguyên |
| Hộp thư «Sự kiện đã đến» | :1092-1111 vòng for toàn bộ `SM.inbox.list` không giới hạn | tăng dần theo số lần bấm giả lập | 🟡 GỢN — thêm «7 ngày gần nhất» khi quá ~30 dòng |
| Danh mục món bán tại quầy | CD1 5 mặt hàng (sm-seed-gialai.js:126-132), các chân dung tương tự 5–8 | ngắn | ✅ |
| 48 hộ ở b2g | sm-b2g.js:450-478 đã gom nhóm theo cán bộ + đợt nộp OA, có cột «dở ở câu mấy» | — | ✅ không phải bãi 48 dòng phẳng (ngoài phạm vi mobile.html, kiểm nhanh) |
| Các danh sách khác | đều có `slice`: :254 (3), :327 (6), :542/:581/:1057 (8), :1300/:1455/:1459 (5), :1485 (12), :1922/:1939 (15) | | ✅ chỗ khác đã biết tiết chế |

## 6. Thao tác đòi độ chính xác cao

- **Kéo-thả / bấm đúp / vuốt: KHÔNG có** — quét `touchstart|touchmove|dblclick|drag|swipe|pointerdown|mousedown` toàn `mobile.html`: không kết quả nào (chỉ nút giữ của W1 dùng pointer). ✅ đúng triết lý người mù công nghệ.
- **Bấm giữ 5 giây — màn Tạm dừng (sm-onboard.js:2178-2220, của W1):** giữ nguyên, không đề bỏ.
  Đánh giá: 5 giây là hợp lý — đã có 2 lần xác nhận trước đó, có thanh đổ màu :2183-2184 + đếm
  «x/5 giây» :2213, thả sớm có lời trấn an «Thả sớm — chưa xoá gì cả» :2192. 3 giây sẽ quá dễ,
  7 giây sẽ khiến hộ tưởng máy treo. Hai chỗ nên tinh chỉnh (đề xuất cho W1, không phải bỏ):
  1. Nút giữ chỉ cao `min-height` 48 px (:2182 dùng `.btn dan w` + font 17) — với việc phải GIỮ NGUYÊN MỘT CHỖ, 48 px mỏng; đề xuất `min-height:72px` inline.
  2. `pointerleave` (:2218) reset ngay khi ngón trượt ra mép nút 2–3 px — tay ướt/dính gần như chắc chắn trượt. Thêm `nut.setPointerCapture(e.pointerId)` trong pointerdown :2206 để trượt nhẹ trong nút không bị coi là thả.
- **Chạm vùng nhỏ:** ô nhập số lượng trả hàng trong bảng :1760 `style="width:64px"` — ô 64 px rộng (cao vẫn 48) với ngón to là chật; hai ô kề nhau «Số đếm thực tế» + «Lý do» trong `.grid2` :1296 dễ nhầm ô số với ô chữ — GẮT nhẹ, đề xuất tách thành 2 dòng có nhãn.
- Chữ nhỏ: nhãn thanh nav 10,5 px (:99) — nút to nên chấp nhận; chữ mô tả `muted` 12,5 px (:57) đọc được. Không thấy chữ nào làm «link bấm được» cả — mọi thứ bấm đều là nút. ✅

---

## Bảng kết luận tổng

| # | Vấn đề | Bằng chứng (file:dòng + số đo) | Mức | Sửa đề xuất |
|---|---|---|---|---|
| 1 | Xoá giỏ 1 chạm không xác nhận, kề nút thu tiền | mobile.html:320-322 (gap 8 px, nút 38 px) + :363 (`cart=[]`) | 🔴 CHẶN | đổi thành `.btn` 48 px + sheet hỏi «Bỏ cả giỏ N món?» ; hoặc tách xuống dòng riêng |
| 2 | `.btn.sm` 38 px dùng cho 22+ nút thao tác chính | :71; :315-316; :247/:273; :308; :957… | 🔴 CHẶN | nâng `min-height:44px` (giữ tên lớp, sửa 1 dòng CSS :71); nút thao tác liên tục (± món) dùng `.btn` 48 |
| 3 | «Xoá mặt hàng» một chạm không hỏi lại | :1242 + :1259-1262 | 🔴 CHẶN | theo khuôn «Huỷ lượt đặt» :1533-1536: sheet lý do bắt buộc |
| 4 | Bàn phím che nút hành động trong mọi sheet | :123-124 cấu trúc sheet; 10+ màn liệt kê mục 4b | 🔴 CHẶN | nút chính `position:sticky;bottom:0` trong `.inner`, nền đục |
| 5 | Tab Đơn cuộn 3–4 màn không giới hạn | :442-457 + seed docsPerMonth 6×8 ≈ 30–40 đơn | 🟠 GẮT | mặc định 14 ngày + nút «xem tất cả», hoặc gom theo tháng |
| 6 | `#btnAir` ✈ ~25 px — nút nhỏ nhất app | :163 inline padding 3/10, font 11,5 | 🟠 GẮT | bỏ inline style, cho `padding:8px 12px` (~38 px) — netbar vẫn vừa 1 dòng |
| 7 | Chip ☰/Aa ~32 px, không được chế độ chữ to cover | :42-43; không có luật `body.simple .chip` | 🟠 GẮT | thêm `body.simple .chip{font-size:14px;padding:10px 13px}`; Aa thêm lối vào tab Thêm |
| 8 | Chip lọc đơn `.seg` ~34 px, gap 6 px | :139-141 | 🟠 GẮT | `padding:10px 14px` (~44 px), gap 8 px |
| 9 | Nút giữ 5 giây: trượt mép là mất tiến trình; nút mỏng | sm-onboard.js:2182, :2206, :2218 | 🟠 GẮT | `setPointerCapture` + `min-height:72px` (cho W1) |
| 10 | Nút − / ＋ cách 6 px, 38 px | :314-316 | 🟠 GẮT | theo #2 thành 44 px + gap 10 px |
| 11 | «Thu hồi» thiết bị — nút đỏ 38 px | :2233 | 🟠 GẮT | dùng `.btn dan` 48 px (bỏ `sm`) |
| 12 | «Nói thay gõ» kẹt đầu trang, 38 px | :308 | 🟠 GẮT | nút 48 px + nhân đôi tại chân giỏ khi giỏ trống (:324) |
| 13 | Ô nhập 64 px trong bảng trả hàng | :1760 `width:64px` | 🟡 GỢN | `width:88px` hoặc cho cả hàng thành nút bấm mở sheet |
| 14 | Hai ô kề nhau «số đếm» + «lý do» dễ nhầm | :1296 grid2 | 🟡 GỢN | tách 2 dòng có nhãn rõ |
| 15 | Hộp thư «Sự kiện đã đến» không giới hạn | :1092-1111 | 🟡 GỢN | quá 30 dòng thì gọn «7 ngày gần nhất» |
| 16 | «Ghi nhận đã trả» và «Ghi nợ khó đòi» cùng sheet | :2368-2370 | 🟡 GỢN | đã có validate lý do — giữ; có thể đẩy «khó đòi» vào «cài đặt nâng cao» |
| 17 | «Huỷ» kề «Khách đã trả — xuất hoá đơn» gap 8 px | :380-381 | 🟡 GỢN | «Huỷ» đổi chữ «Đóng» (bớt cảm giác nguy hiểm) — việc của V5 về chữ, nhưng nút nên tách nhóm |
| 18 | Nhãn thanh nav 10,5 px | :99 | 🟡 GỢN | 11,5 px vẫn vừa 5 tab; người nào khó đọc có chế độ chữ to (:115 nâng 13 px) ✅ đã lo |
| 19 | Menu Thêm ~20 mục ≈ 2 màn cuộn | :883-912 | 🟡 GỢN | đã nhóm 4 — giữ; có thể thêm 4 chip nhảy nhóm ở đầu |
| 20 | Toast 13,5 px tự ẩn — thông báo kết quả đọc vội không kịp | :126-127 | 🟡 GỢN | kéo dài thời gian hiển thị cho chế độ chữ to |

Điểm đã ĐẠT (không cần đụng): `--tap:48px` cho nút/input chính · nav 58 px · FAB 56 px · `.mi` full-width
· không autofocus · không kéo-thả/vuốt/bấm-đúp · `inputmode` đặt đủ · nút đỏ nguy hiểm đa số đã có bước 2 ·
«Huỷ lượt đặt» là khuôn chuẩn · b2g 48 hộ đã gom nhóm.

## Top-8 sửa trước nhất

1. **#1** Xoá giỏ — thêm xác nhận, tách khỏi nút Thu tiền (mất việc đang bán giữa chừng).
2. **#4** Sticky footer cho sheet — một sửa chữa cả 10+ màn «nút biến mất» khi gõ số tiền.
3. **#2** `.btn.sm` 38→44 px — một dòng CSS :71, chữa 22+ nút cùng lúc.
4. **#3** «Xoá mặt hàng» thêm bước xác nhận theo khuôn :1533.
5. **#5** Tab Đơn: mặc định 14 ngày + nút «xem tất cả».
6. **#9** Nút giữ 5 giây: pointer capture + nút cao 72 px (bàn cho W1).
7. **#7+6** Chip ☰/Aa/✈ đạt chuẩn và được chế độ chữ to cover.
8. **#12** «Nói thay gõ» xuống chân giỏ, nút 48 px — cửa ngõ chính của người mù công nghệ.

## Bộ chuẩn tối thiểu khi dựng màn mới

- **Nút:** mọi nút ≥ 44×44 px; nút thao tác liên tục (bán hàng, ± món, thu tiền) ≥ 48 px (= `--tap`).
  Không dùng `.sm` cho nút ai đó bấm hơn 2 lần/ngày.
- **Khoảng cách:** 2 nút cùng hàng cách nhau ≥ 12 px; nút nguy hiểm (xoá/huỷ/ngắt/gửi tốn phí) không
  đứng kề nút thường — xuống dòng riêng hoặc cách ≥ 16 px, và LUÔN có bước 2 (sheet lý do/xác nhận).
- **Chữ:** chữ nội dung nhỏ nhất 13 px; nhãn trạng thái (tag) 11 px chỉ dành cho thứ không bấm;
  nhãn thanh nav ≥ 11,5 px.
- **Ô nhập:** min-height 48 px; trường tiền/số lượng luôn `inputmode="numeric"` + `type="number"`;
  không bao giờ `autofocus`; nút xác nhận chính dính đáy sheet (sticky).
- **Danh sách:** quá ~25 dòng phải có giới hạn mặc định + nút «xem thêm», hoặc gom nhóm có tiêu đề.
- **Cử chỉ:** chỉ chạm đơn. Bấm-giữ duy nhất cho việc phá dữ liệu (theo khuôn sm-onboard.js:2178+,
  kèm thanh tiến trình + đếm giây). Không kéo-thả, không vuốt, không bấm đúp.

---

*Tự soát: toàn bộ số liệu trên lấy trực tiếp từ CSS/HTML/JS trích dẫn; đã grep kiểm tra không ký tự
Trung/Nhật/Hàn trong file này; tiếng Việt có dấu toàn bộ. Không sửa bất kỳ file code nào.*
