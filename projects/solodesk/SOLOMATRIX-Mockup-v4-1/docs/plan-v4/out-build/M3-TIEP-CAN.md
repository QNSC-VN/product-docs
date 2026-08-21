# M3 — MẮT KÉM, TAY RUN, KHÔNG QUEN MÁY: khả năng tiếp cận trên điện thoại

*Agent M3 · 20/08/2026 · không sửa code, chỉ đo và đề xuất.*
*Người soi: **bà Nguyễn Thị Bảy 58 tuổi** (seed CD1 — mắt kém, kính lão, đọc chậm) và **ông Lê Văn Sáu 55 tuổi** (seed CD2 — tay chai, thao tác vội).*
*Mọi con số đo từ `mobile.html` (186.170 ký tự, 2.586 dòng, bản đang được W6/V1 sửa song song) + `js/sm-onboard.js` (W1) + `js/sm-nen.js` (V1) + `js/sm-domain.js`.*

Nhận định nhanh cho người chấm: phần khung đã có nhiều thứ đúng hướng — nút chuẩn cao 48px (`--tap`, mobile.html:20), câu wizard 17px, `docTo` phóng câu 21px, nhật ký «không xoá được» (mobile.html:2020), viewport **không** khoá zoom (mobile.html:5). Nhưng có một nghịch lý chạy xuyên suốt: **cái app dành chữ nhỏ nhất cho đúng những chỗ nói trạng thái quan trọng** — nhãn «còn 3 ngày / quá hạn / bắt buộc» đang 11px, nhãn tab chính 10.5px, còn chế độ «chữ to» thì lại giấu mất nút đường ra.

---

## 1. Cỡ chữ thật — bảng đo toàn app

### 1a. Các class dùng lại nhiều nơi (mức ảnh hưởng lớn nhất)

| Class | px | Dùng ở đâu (số chỗ đo được) | Dưới 14px? |
|---|---|---|---|
| `body` | 16 | toàn app (mobile.html:26) | — (chuẩn) |
| `nav button` | **10.5** | nhãn 5 tab dưới cùng — Bán/Kho/Đơn/Tiền/Thêm (mobile.html:99) | **CÓ — nhỏ nhất app** |
| `nav .bdg` | **9.5** | số đếm thông báo đỏ trên tab (mobile.html:103) | **CÓ** |
| `.tag` | **11** | nhãn trạng thái «còn N ngày / quá hạn / bắt buộc / chưa đạt / đạt» (mobile.html:74; 81 chỗ `class="…tag "` trong file) | **CÓ — đây là cảnh báo hạn + tiền** |
| `table.t th` | **10.5** | đầu cột mọi bảng — 27 bảng `<table class="t">` (mobile.html:134) | **CÓ** |
| `.hrow .who span` | 11.5 | dòng mã hộ + địa bàn dưới tên hộ (mobile.html:41) | CÓ |
| `.card>.hd .sub` | 11.5 | dòng giải thích tiêu đề mọi thẻ (mobile.html:54) | CÓ |
| `.muted` | 12.5 | dòng phụ toàn app — **163 chỗ** (mobile.html:57) | CÓ |
| `label` | 12 | nhãn trường nhập (mobile.html:90) | CÓ |
| `.chip` | 12 | nút ☰ / Aa / «Chế độ máy bay» (mobile.html:43, 163) | CÓ |
| `.netbar` | 12.5 | dòng «Có mạng / MẤT MẠNG — vẫn bán được» (mobile.html:45, 229) | CÓ |
| `.btn.sm` | 13.5 | nút nhỏ, gồm nút «Đóng» mọi sheet (mobile.html:71, 196) | CÓ |
| `.toast` | 13.5 | **thông báo «đã xong việc» duy nhất** (mobile.html:127) | CÓ |
| `table.t` | 13 | nội dung mọi bảng kê/hoá đơn (mobile.html:133) | CÓ |
| `.note` | 13 | khối cảnh báo (mobile.html:81) | CÓ |
| `.card>.hd h2` | 14 | tiêu đề thẻ (mobile.html:53) | ngang |
| `.mi .tx b` | 14.5 | mục menu «Thêm» (mobile.html:148) | — |
| `.big` / `.mid` | 30 / 20 | số tiền chính (mobile.html:58-59) | — (tốt) |

### 1b. Style inline nhỏ lẻ đáng chú ý

| Vị trí | px | Chứa gì |
|---|---|---|
| mobile.html:559 | **9** | lịch mini tháng — dòng «n» ngày còn |
| mobile.html:561 | **9.5** | lịch mini — tên mục trông trẻ em |
| mobile.html:523-524 | 11.5 | bảng phân vai: **tên người chịu trách nhiệm** + số máy/khoá của họ |
| mobile.html:526 | 12 | ô phân vai `3/3` — trạng thái hết chỗ |
| mobile.html:245 | 12.5 (qua class `muted num`) | **SỐ TIỀN trong thẻ «Việc cần để ý»** — dòng tiền của cảnh báo hạn |
| mobile.html:1057, 1081, 1130, 1178 | 10.5-11 | khối kỹ thuật (CSV, payload JSON, nguồn/endpoint) — chấp nhận được vì dành cho người chấm demo |

### 1c. Tỉ lệ chữ nhỏ trên toàn app

Đếm 85 khai báo `font-size` trong file (class + inline):

| Dải | Số khai báo | Tỉ lệ |
|---|---|---|
| < 12px (gần như không đọc được ở 58 tuổi) | 10 | ~12% |
| 12-13.9px (phải nheo mắt) | 33 | ~39% |
| ≥ 14px | 42 | ~49% |

Tỉ lệ khai báo chỉ nói nửa sự thật: các khai báo lớn đa số là inline dùng 1 lần, còn **các class nhỏ dùng lại phủ rộng hơn hẳn** — riêng `muted` 12.5px xuất hiện 163 chỗ và `.tag` 11px 81 chỗ, tức ~244 vị trí render quan trọng nằm dưới 13px.

### 1d. Chỉ đích danh: thông tin QUAN TRỌNG bị đặt chữ nhỏ

1. **Số tiền trong cảnh báo hạn** — thẻ «Việc cần để ý» in số tiền bằng `class="muted num"` 12.5px (mobile.html:245). Đây là con số quyết định «nộp bao nhiêu, chừng nào» — bà Bảy phải cầm máy sát mắt mới đọc được.
2. **Nhãn ngày còn lại** — «quá hạn»/«N ngày» trong cùng thẻ là `.tag` 11px (mobile.html:243, class 74).
3. **Nhãn «bắt buộc»/«chưa đạt»** trong Trạm kết nối — `.tag` 11px (mobile.html:946, 952).
4. **Số đơn chờ xử lý trên tab Đơn** — badge đỏ 9.5px (mobile.html:103, 219-221).
5. **Tên người chịu trách nhiệm bán/kho** — 11.5px (mobile.html:523) — sai một người là lộn sổ.
6. **Nội dung bảng kê thu mua / hoá đơn** — 13px, đầu cột 10.5px (mobile.html:133-134) — đây là chứng từ pháp lý hộ phải SOÁT.

---

## 2. Chế độ `Aa` (chữ to / đơn giản) — cơ chế thật

Cơ chế (đo từ code): nút `#btnMode` chữ «Aa» (mobile.html:159) → đổi `SM.mode()` full/simple (mobile.html:2556-2557; `js/sm-core.js:127,143-144` — mặc định `full`, lưu bền trong kho ui) → gắn class `body.simple` (mobile.html:233) → áp 9 rule CSS (mobile.html:111-119).

### 2a. Bật lên thì chữ to thêm bao nhiêu — có đủ không?

| Thứ | Thường | Chế độ đơn giản | Tăng | Đủ cho 58 tuổi? |
|---|---|---|---|---|
| Chữ nền | 16 | 19 | +3px | gần đủ |
| Nút | 15 / cao 48 | 19 / cao 64 | +4px/+16px | đủ |
| `.big` (số tiền) | 30 | 38 | +8px | đủ |
| `.muted` | 12.5 | 15 | +2,5px | tạm được |
| Nhãn tab dưới | **10.5** | **13** | +2,5px | **vẫn dưới 14px** |
| Tiêu đề thẻ | 14 | 17 | +3px | đủ |

**Không được nâng lúc nào** (không có rule `body.simple` tương ứng, grep mobile.html:111-119 chỉ 9 rule trên): `.tag` **vẫn 11px**, `.bdg` **vẫn 9.5px**, `.note` vẫn 13px, `label` vẫn 12px, `.chip` vẫn 12px, `table.t` vẫn 13/10.5px, `.toast` vẫn 13.5px, `.btn.sm` vẫn 13.5px, `.seg` vẫn 12.5px. Nghĩa là: **người cần chữ to nhất được nâng đúng những thứ ít quan trọng, còn nhãn cảnh báo hạn, số đếm thông báo, bảng chứng từ — nguyên xi chữ nhỏ.** Bà Bảy bật chế độ này để đọc «còn 3 ngày» thì vẫn phải nheo mắt đúng như trước.

### 2b. Ẩn mất những gì — có ẩn nhầm không?

Chế độ đơn giản thu app còn 3 tab Bán/Tiền/Trợ lý (mobile.html:203-204) và ép TAB về 3 màn đó (mobile.html:2567-2568). Biến mất:

- **Tab «Thêm» cả cụm** — mất luôn: Nhật ký thao tác, Hồ sơ hộ, Dữ liệu của tôi, **Cài đặt** (mobile.html:906-915). Ẩn nhầm: đây là nơi duy nhất có cặp nút «Chế độ đầy đủ / Chế độ đơn giản» (mobile.html:925-926).
- **Nút trợ lý nổi 💬** (mobile.html:119) — nhưng vẫn có tab Trợ lý, chấp nhận được.
- **12+ thẻ `hide-simple`** (mobile.html:328, 337, 556, 601-602, 667, 740, 750, 776, 780, 834, 837, 839): hoá đơn gần nhất, đơn từ kênh khác, doanh thu theo mùa, tồn chi tiết, truy xuất nguồn gốc, tính ra sao, sổ kế toán, tách tiền, chế độ, soạn bài đăng, trả khách ngoài giờ, cam kết dịch vụ. **Ẩn nhầm 1 thứ:「Hoá đơn gần nhất — trạng thái truyền cơ quan thuế」(mobile.html:328)** — đây là trạng thái PHÁP LÝ (hoá đơn đã lên cơ quan thuế chưa), hộ nào cũng phải trả lời được khi khách đòi hoá đơn. Sổ-sách đã xong thì giấu được; trạng thái truyền thuế thì không nên giấu.

### 2c. Người bật có bị kẹt không?

- Đường ra VẬT LÝ còn: nút Aa vẫn hiển thị ở chế độ đơn giản (mobile.html:159 không thuộc `hide-simple`), bấm lần nữa là về đầy đủ.
- Nhưng đường ra NHẬN THỨC không có: (i) toast báo «Chế độ đơn giản — chữ lớn, chỉ Bán, Tiền và Trợ lý.» (mobile.html:2557) **không nói bấm Aa lần nữa để quay lại**, tự tắt 2,6 giây; (ii) **nút Aa không có trạng thái nhìn thấy được** — không đổi màu, không chấm báo đang bật (mobile.html:159, CSS 42-44 không có `.chip.on` cho nút này), người không quen máy không biết mình đang ở chế độ nào; (iii) cặp nút «Chế độ đầy đủ» nằm trong tab «Thêm» **đã bị chính chế độ này xoá mất** (mobile.html:925 vs 203-204). Ông Sáu bật thử rồi muốn quay lại: phải nhớ đúng cái nút bé 12px mang tên hai chữ cái «Aa».
- Thêm một kẹt đã được W8 phát hiện và ghi chú: ở chế độ đơn giản, wizard onboarding **không đánh thức được** vì mobile.html ép TAB (js/sm-onboard.js:545-554) — hộ mắt kém chọn «chế độ dễ» lại mất cửa làm thủ tục lần đầu. Đã ghi chờ W6 sửa danh sách màn được phép (W8-BAO-CAO).

### 2d. Nhãn nút

«Aa» là tên kiểu ngành thiết kế — không phải từ tiếng Việt. Người 55-58 tuổi chưa chắc liên hệ «Aa» với «chữ to». Đề xuất: nhãn «**Chữ to**» (kèm chấm xanh khi đang bật), giữ «Aa» làm phụ. Nhãn 2 từ vẫn vừa chip.

---

## 3. Trạng thái nhìn thấy được — «việc đó xong chưa?»

Cơ chế phản hồi hiện có đúng 2 loại: (a) **toast** — 161 lời gọi trên app (mobile.html 103 + sm-onboard.js 56 + sm-nen.js 2), hàm duy nhất mobile.html:191-193: hiện rồi `setTimeout(()=>el.remove(), ms||2600)`; (b) **render lại danh sách** sau mỗi nghiệp vụ (`render()` đi kèm gần hết).

### 3a. Hành động quan trọng — phản hồi hôm nay

| Hành động | Phản hồi | Đủ rõ? |
|---|---|---|
| Thêm món vào giỏ | toast «Đã thêm N món vào giỏ — cô chú kiểm tra rồi thu tiền» (mobile.html:356) + giỏ render | Tốt — câu nói thường ✅ |
| Xuất hoá đơn | toast «Đã xuất {id} cho {khách}…» (417) + hoá đơn vào danh sách | Tốt |
| Thu tiền/trả nợ | toast «Đã trả hết nợ / còn nợ …» (2378) + số đổi | Tốt |
| Gửi nhắc nợ | toast «Đã gửi nhắc nợ, lần thứ N» (2334) | Tốt |
| Chuyển trạng thái đơn | toast «Đơn … → …» (505) | Được |
| Kết ca | bắt buộc đếm tiền nhập số thực tế trước (1887) → «Kết ca xong, lệch …» (1891) | Tốt — có bước số học buộc xác nhận |
| Gửi yêu cầu hẹn cán bộ | toast «Đã gửi… phản hồi trong 1 ngày làm việc» (1045) | Tốt |
| Xử lý tin hộp thư | toast «Đã xử lý — …» (1199) | Được |
| Đổi chế độ Aa | toast 2,6s một lần duy nhất (2557), sau đó không dấu vết | **Không rõ** — xem mục 2c |
| Đổi vai người dùng | toast «Đã đổi vai» (2211) — không nói đổi THÀNH gì, ở đâu | **Không rõ** |
| Nghe tiếng nói nhận dạng | toast «Đã nghe: …» (349) — nội dung biến mất sau 2,6s, không chép vào ô nào | **Người đọc chậm mất nội dung** |
| Gửi đăng ký/đơn trong wizard | toast (sm-onboard.js:593-594) — có bản vẫn lộ chữ kỹ thuật «(chờ W3)» | **Chữ kỹ thuật lọt ra mặt hộ** |

### 3b. Vấn đề thời gian tự tắt

Toàn 161 toast, **160 cái dùng mặc định 2.600 ms**; duy nhất 1 lời gọi đặt 5.200 ms — hướng dẫn «Thêm vào Màn hình chính» (mobile.html:2578). Tác giả đã tự chứng minh 2,6 giây là đủ ngắn phải nhân đôi khi câu dài — nhưng 160 toast còn lại, trong đó có mọi thông báo «đã nộp / đã xuất / đã gửi», vẫn 2,6 giây. Bà Bảy đọc một câu mất 4-6 giây: toast tắt trước khi đọc hết, và **không có cách xem lại** (toast không bấm-giữ, không nút đóng, không lịch sử toast; bù trừ một phần bởi màn «Nhật ký thao tác — Ai đã làm gì, lúc nào», mobile.html:1998-2020, nhưng phải nhớ đường Thêm → Nhật ký). Phản hồi biến mất quá nhanh = phản hồi không tồn tại với người đọc chậm.

---

## 4. Sai rồi sửa được không — từng hành động khó gỡ

Đo bằng grep: **0 lời gọi `confirm(`** trong mobile.html. Không có hộp hỏi hệ thống nào; chỉ các bước-nhập-lý-do đóng vai trò phanh.

| Hành động | Hỏi trước? | Sửa lại được? | Nói trước hậu quả? | Mức |
|---|---|---|---|---|
| «Nạp lại dữ liệu mẫu» = `SM.resetAll()` (mobile.html:928, 935) — XOÁ SẠCH mọi thứ hộ đã làm trong demo | **Không** — 1 chạm chạy ngay | Không (không hoàn tác) | Không — chỉ dòng nhỏ màu đỏ trên nút | **CHẶN** |
| Nút «Đã nối» trên Trạm (mobile.html:957, xử lý 964-967) — bấm = **ngắt kết nối ngay** | Không | Được (bấm nối lại) nhưng dữ liệu kéo dở | Không — nhãn nói hiện trạng, không nói «bấm để ngắt» | **CHẶN** |
| «Huỷ đơn và trả hàng về kho» (mobile.html:498, 507-508) | Không — 1 chạm | Không hoàn tác đơn (phải lập lại) | Một phần — chính nhãn nút mô tả hậu quả | **GẮT** |
| «Xoá mặt hàng» (mobile.html:1242, 1259-1263) | Không — 1 chạm | Hàng thêm lại được; **được chặn an toàn 2 lớp**: còn tồn → từ chối; đã từng bán → từ chối kèm lý do «xoá sẽ mất dấu vết sổ sách» (js/sm-domain.js:1104-1113) | Chặn rồi hiện lý do — tốt | GẮT (nhẹ — chỉ hàng mới chưa bán mới xoá được, thiệt hại nhỏ) |
| Huỷ lượt đặt (mobile.html:1562-1565) | Có — **bắt nhập lý do** mới cho huỷ | — | Nhắc cả tiền cọc «Nhớ xử lý tiền cọc đã nhận» | Chuẩn ✅ |
| Huỷ lô nhập (mobile.html:2144-2153) | Có — bắt chọn lô + số lượng + lý do | — | Có | Chuẩn ✅ |
| Trả hàng (mobile.html:1776-1784) | Có — bắt lý do, chặn số âm/số vượt | Nhập lại kho được | Có (1811) | Chuẩn ✅ |
| Thu hồi máy của người dùng (mobile.html:2247-2249) | Có — bắt lý do | — | — | Chuẩn ✅ |
| Kết ca (mobile.html:1887-1891) | Có — bắt đếm tiền, nhập số thực tế | — | Lệch hiện số | Chuẩn ✅ |
| «Tạm dừng dùng OPC» (mục menu mobile.html:914) | Theo PLAN B.15: confirm 2 lần + gõ «XOÁ» — làm trong sm-onboard.js (W1), đây là chuẩn vàng để nhân rộng | — | — | Chuẩn ✅ |
| Đóng sheet bằng chạm nền tối (mobile.html:197) | Không — chạm hụt ra ngoài = mất ngay form đang điền dở (thêm mặt hàng, phiếu nhập, lý do huỷ…) | Phải điền lại từ đầu | Không | **GẮT** — chính xác kiểu «tay run bấm nhầm là mất» |

Kết luận mục 4: app đã có 5 mẫu tốt (bắt lý do / bắt đếm tiền / gõ XOÁ) — rào cản không phải thiếu ý tưởng mà là **3 nút phá hủy lớn nhất lại không dùng mẫu đó**: nạp lại dữ liệu, ngắt kết nối, huỷ đơn.

---

## 5. Màu và biểu tượng

### 5a. Chỉ dùng màu để nói trạng thái (không kèm chữ/icon)

| Chỗ | Bằng chứng | Vấn đề |
|---|---|---|
| Ô phân vai đầy `3/3` | mobile.html:526 — chỉ đổi `color:var(--crit)`, không icon ⚠, không chữ «đầy» | mù màu xanh-đỏ / ngoài nắng: thấy như thường |
| Tồn kho về 0 | mobile.html:599 — số đỏ thay đen, không nhãn «hết» | idem |
| Thanh tiến độ đầy chuyển đỏ `.bar.full>i` | mobile.html:130-132 | idem |

Nhãn `.tag ok/warn/crit` thì LUÔN kèm chữ («còn 3 ngày», «chưa đạt») — đúng ✅. Netbar mất mạng đổi nền đỏ **kèm** chữ «MẤT MẠNG — vẫn bán được, gửi lên sau» (mobile.html:47, 229) — đúng ✅. Quy tắc rút ra: chỗ nào đã kèm chữ thì an toàn; ba chỗ trên là ngoại lệ còn sót.

### 5b. Emoji/icon đứng một mình (không nhãn nhìn thấy được)

| Nút | Vị trí | aria-label có? | Người 55-58 tuổi đoán ra? |
|---|---|---|---|
| ☰ | mobile.html:157 | «Đổi chân dung hộ» ✅ | Hay — ☰ thường hiểu là «danh sách»; «chân dung hộ» thì bất ngờ |
| «Aa» | mobile.html:159 | «Đổi cỡ chữ» ✅ | Không — xem mục 2d |
| 💬 (nút nổi) | mobile.html:168 | «Hỏi trợ lý» ✅ | Tạm — nên kèm chữ «Hỏi» |
| 🎤 | mobile.html:819 | «Nói thay gõ» ✅ | Không — đề xuất chữ «Nói» cạnh mic |

Ghi nhận: cả 4 nút đều CÓ `aria-label` (grep `aria-` ra đúng 4 chỗ) — máy đọc màn hình không bỏ sót, nhưng người NHÌN thấy vẫn phải đoán. ✈︎ «Chế độ máy bay», ⋯ «Thêm», 🌙 «Trợ lý chạy nền» đều đã kèm chữ ✅ (mobile.html:163, 209, 908).

---

## 6. Đọc màn hình & phóng to hệ thống

- **Khoá zoom: KHÔNG.** `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` (mobile.html:5) — không có `user-scalable=no`, không `maximum-scale`; grep toàn file + js/ không thấy `text-size-adjust`/`touch-action` chặn. Người mắt kém vẫn pinch-zoom được bằng chính hệ thống. ✅ Đây là điểm app làm đúng — giữ nguyên, cấm ai thêm `maximum-scale` về sau.
- **`aria-label`:** 4/4 nút icon thuần có nhãn (mobile.html:157, 159, 168, 819). Thiếu: các nút render động (`data-con`, `data-go`, `data-car`…) không có aria — nhưng chúng đều CÓ chữ nhìn thấy nên mức GỢN; sheet/overlay không `role="dialog"`/focus-trap — máy đọc màn hình đọc đè nội dung phía sau (GỢN, mockup chấp nhận).
- **Không có nút phóng to nội dung riêng** ngoài chế độ Aa — đã xử lý ở mục 2.

---

## 7. Nút «đọc to» 🔊 vừa thêm (W1/W8)

- **Cơ chế thật:** `docTo(cau)` (js/sm-onboard.js:597-601) mở sheet: câu được phóng lên **21px, đậm**, dòng giãn 1.5, kèm nhãn `.tag warn` «MÔ PHỎNG đọc — bản thật dùng giọng máy». Nhãn mô phỏng rõ ràng, không hứa suông. ✅
- **Đặt chỗ:** nút «🔊 Đọc to câu này» full-width 16px, nằm ngay dưới câu — đúng chuẩn W0 điểm soi #1: câu 0 (sm-onboard.js:826), câu 0 phụ (844), khung câu chung (1149), dòng phụ dài nhất (1211-1212); handler gắn đủ (853, 884, 1089 — W8 đã vá chỗ câu 0 chết). So với bản trước (chip nhỏ góc màn) là bước tiến đúng.
- **Chưa đủ:** nút đọc to CHỈ tồn tại trong wizard onboarding. Câu dài NGOÀI wizard — thẻ «Việc cần để ý», note cảnh báo pháp lý (mobile.html:703), dòng P12 «Ảnh giấy tờ nằm trong máy của hộ», tin nhắn tiền về trong hộp thư — không có gì đọc to cả. Bà Bảy đọc chậm NHẤT là khi dùng app HẰNG NGÀY, không phải 5 phút đầu. Đề xuất nhân mẫu này ra: mọi thẻ cảnh báo (`.note.warn/.crit`) + mọi câu > 60 ký tự trong hộp thư có nút cùng kiểu.
- Nhãn nút 🔊 có kèm chữ «Đọc to câu này» — không phải icon một mình ✅.

---

## BẢNG TỔNG — rào cản, ai bị, bằng chứng, mức, sửa đề xuất

| # | Rào cản | Ai bị | Bằng chứng (file:dòng) | Mức | Sửa đề xuất cụ thể |
|---|---|---|---|---|---|
| 1 | Nhãn trạng thái hạn/pháp lý `.tag` 11px — 81 chỗ | mắt kém | mobile.html:74, 243, 946, 952 | **CHẶN** | nâng `.tag` lên 13px; hoặc tối thiểu các tag mang ngày/tiền (`quá hạn`, `N ngày`) in 13px đậm |
| 2 | Nhãn 5 tab điều hướng 10.5px + badge 9.5px | mắt kém, không quen máy | mobile.html:99, 103 | **CHẶN** | nhãn tab ≥ 12px (thường) / 14px (chế độ đơn giản); badge ≥ 11px; nếu sợ vỡ hàng thì giảm số tab chữ xuống 1 từ |
| 3 | Chế độ `Aa` không nâng `.tag`/`.bdg`/`table`/`label`/`.toast` — cảnh báo vẫn nhỏ nguyên | mắt kém | mobile.html:111-119 (chỉ 9 rule) | **CHẶN** | thêm `body.simple .tag{font-size:14px}`, `.bdg`, `table.t`, `label`, `.note`, `.toast` tương ứng |
| 4 | Chế độ đơn giản XOÁ tab «Thêm» → mất Cài đặt + nút «Chế độ đầy đủ» + Nhật ký + Tạm dừng; toast không chỉ đường về | không quen máy | mobile.html:203-204 vs 925, 2557, 2567-2568 | **CHẶN** | giữ 1 mục «Cài đặt» trong nav đơn giản (hoặc sheet «Thêm» tối giản 3 mục: Cài đặt / Nhật ký / Tạm dừng); toast đổi thành «Đã bật chữ to — bấm lại nút Chữ to để về như cũ» |
| 5 | «Nạp lại dữ liệu mẫu» = xoá sạch 1 chạm không hỏi | tay run, không quen máy | mobile.html:928, 935 | **CHẶN** | nhân mẫu «Tạm dừng»: sheet xác nhận bắt bấm 2 lần (hoặc gõ NAP LAI) + nút đổi chỗ sâu hơn trong màn «Dữ liệu của tôi» |
| 6 | Nút «Đã nối» bấm = ngắt kết nối ngay, nhãn không nói, không hỏi | tay run | mobile.html:957, 964-967 | **CHẶN** | đổi nhãn 2 nút rõ ý:「Nối」/「Ngắt nối»; ngắt phải qua bước hỏi «Ngắt {tên} — tiền về sẽ không tự hiện nữa. Ngắt nhé?» (W2 đang thay toggleConnector — kẹp yêu cầu này vào luôn) |
| 7 | Toast 2,6s × 160/161 lời gọi — người đọc chậm không kịp, không xem lại được | mắt kém | mobile.html:191-193, 2578 (1 ngoại lệ 5,2s) | **GẮT** | toast báo KẾT QUẢ nghiệp vụ ≥ 6s + bấm vào toast để đóng (không tự tắt khi đang chạm); thêm dòng «Việc vừa xong» ghim đầu màn Bán |
| 8 | `.muted` 12.5px phủ 163 chỗ, gồm cả SỐ TIỀN trong thẻ «Việc cần để ý» | mắt kém | mobile.html:57, 245 | **GẮT** | tách biến thể `.muted.viec` 14px cho số tiền + ngày hạn trong thẻ cảnh báo; phần mô tả giữ nguyên |
| 9 | Bảng chứng từ 13px / đầu cột 10.5px — 27 bảng | mắt kém | mobile.html:133-134 | **GẮT** | bảng ≥ 13,5px nội dung, đầu cột ≥ 11,5px bỏ UPPERCASE chữ hẹp |
| 10 | «Huỷ đơn và trả hàng về kho» 1 chạm, không hỏi | tay run | mobile.html:498, 507-508 | **GẮT** | thêm sheet hỏi 1 lần: «Huỷ đơn {id}? Hàng {n} món trả về kho.» + nút đỏ «Đồng ý huỷ» |
| 11 | Chạm nền tối ngoài sheet = đóng, mất form đang điền dở | tay run | mobile.html:197 | **GẮT** | chỉ đóng khi bấm «Đóng»/data-x; hoặc chạm nền hiện toast «Chạm ngoài — bấm Đóng nếu muốn thoát, việc đang làm vẫn còn» lần đầu |
| 12 | «Xoá mặt hàng» 1 chạm không hỏi (đã có 2 lớp chặn domain) | tay run | mobile.html:1242, 1259-1263; sm-domain.js:1104-1113 | **GẮT** | thêm 1 bước hỏi «Xoá {sku}?» — hàng đã bán thì domain đã chặn sẵn |
| 13 | Ba chỗ chỉ-dùng-màu: ô đầy 3/3, tồn =0, thanh đầy đỏ | mù màu, nhìn ngoài nắng | mobile.html:526, 599, 130-132 | **GẮT** | kèm chữ: «đầy»/「hết hàng」/thanh đầy thêm icon ⚠ — quy tắc: màu chỉ được PHỤ thêm chữ |
| 14 | Icon một mình: ☰ · 💬 · 🎤 · «Aa» | không quen máy | mobile.html:157, 168, 819, 159 | **GẮT** | kèm chữ ngắn: «Menu» / «Hỏi» / «Nói» / «Chữ to»; giữ icon làm điểm nhìn nhanh |
| 15 | Nút Aa không có trạng thái nhìn thấy được (đang bật hay tắt) | không quen máy | mobile.html:159, 44 | **GẶT** | khi simple: nút đổi nền trắng chữ brand + chấm xanh (dùng sẵn `.chip.on`, mobile.html:44) |
| 16 | Chế độ đơn giản chặn luôn wizard onboarding | mắt kém + mới đăng ký | sm-onboard.js:545-554; mobile.html:2567-2568 | **GẮT** | đúng như W8 đã báo: W6 cho ob* vào danh sách màn được phép của simple |
| 17 | Nội dung nghe-về từ mic hiện trong toast rồi mất (không chép vào ô) | mắt kém + tay run | mobile.html:349 | **GẶT** | chép kết quả nhận dạng vào ô/sheet để đọc lại được |
| 18 | Toast lộ chữ kỹ thuật «(chờ W3)» hiện ra trước mặt hộ | không quen máy | sm-onboard.js:593 | **GẶT** | bỏ mã việc nội bộ khỏi chuỗi hộp thư; chỉ «Đã vào hộp thư, máy chưa xử lý được» |
| 19 | Đổi vai: toast không nói đổi thành gì | không quen máy | mobile.html:2211 | **GẶT** | «Đã đổi {tên} làm {vai}» + dòng vai hiện trong màn |
| 20 | Nút đọc-to chỉ trong wizard; câu dài hằng ngày không đọc to được | mắt kém | sm-onboard.js:597-601, 826-1212 | **GỢN** | nhân mẫu `docTo`: mọi `.note.warn/.crit` + tin hộp thư > 60 ký tự có «Đọc to dòng này» |
| 21 | Inline 9-9.5px lịch mini; 11.5px tên người chịu trách nhiệm phân vai | mắt kém | mobile.html:559, 561, 523-524 | **GỢN** | nâng lịch mini ≥ 11px; bảng phân vai in tên người 13px đậm |
| 22 | Nút render động (`data-con`, `data-go`…) chưa có aria; sheet chưa `role="dialog"` | dùng máy đọc màn hình | mobile.html:933, 964 (grep `aria-` = 4) | **GỢN** | nhân quy tắc: mọi nút không-chữ phải `aria-label`; sheet gán role + aria-modal |
| 23 | Phản hồi chạm chỉ co 1.5% (`.btn:active{transform:scale(.985)}`) — khó biết bấm ăn chưa | tay run | mobile.html:67 | **GỢN** | thêm đổi nền `.btn:active` rõ hơn; các nút nghiệp vụ ưu tiên phản hồi tức thì bằng đổi chữ nút («Đã thêm ✓» nhấp 0.8s) |

Đếm: **6 CHẶN** (#1-6) · **8 GẮT** (#7-14) · **9 GẶT/GỢN** (#15-23) — 23 rào cản.

---

## TOP-8 SỬA TRƯỚC NHẤT

1. **#3 + #1 + #2 (gói chữ to đúng chỗ):** thêm 6 dòng CSS `body.simple` nâng `.tag` 14px, `.bdg`, `table.t`, `label`, `.note`, `.toast`; nâng `.tag` thường lên 13px; nhãn tab 12px/14px. ~10 dòng CSS, không đụng logic — lợi ích lớn nhất/bạn-lề nhỏ nhất cho bà Bảy.
2. **#5 «Nạp lại dữ liệu mẫu»:** thêm bước hỏi 2 lần như màn Tạm dừng đã có sẵn mẫu.
3. **#6 «Đã nối» = ngắt ngầm:** đổi cặp nhãn «Nối / Ngắt nối» + 1 sheet hỏi — kẹp vào việc W2 đang thay `toggleConnector`.
4. **#4 đường ra khỏi chế độ đơn giản:** giữ mục «Cài đặt» trong nav 3 tab + toast chỉ đường về + #15 chấm trạng thái trên nút Aa.
5. **#7 toast 2,6s:** kết quả nghiệp vụ ≥ 6s và bấm-để-đóng; hoặc ghim «việc vừa xong» đầu màn Bán.
6. **#11 chạm nền đóng sheet:** rút quyền đóng của nền tối — tay run không còn mất form dở.
7. **#8 số tiền trong «Việc cần để ý» 14px đậm** — 1 dòng CSS, đổi đúng chỗ người mù công nghệ nhìn đầu tiên mỗi sáng.
8. **#14 kèm chữ cho ☰ 💬 🎤 Aa** — 4 nhãn ngắn, người chưa từng dùng điện thoại hiểu ngay.

## BỘ TỐI THIỂU VỀ TIẾP CẬN — dựng màn mới cứ theo

**Cỡ chữ sàn:** body ≥ 16px; mọi chữ trạng thái/cảnh báo/nhãn nút chính ≥ 13px; KHÔNG cái gì dưới 12px ngoài khối kỹ thuật «cài đặt nâng cao»; số tiền & ngày hạn trong thẻ cảnh báo ≥ 14px đậm; bảng chứng từ ≥ 13,5px. Chế độ chữ to phải nâng ĐÚNG các class trạng thái, không chỉ body/nút.

**Quy tắc phản hồi:** mọi nghiệp vụ = toast nói lời người (chủ-ngữ + đã-làm-gì + số-thứ) ≥ 6 giây HOẶC dòng ghim đầu màn; toast bấm để đóng; nội dung tạm thời (nhận dạng giọng) phải chép lại được vào màn; tiếng kỹ thuật (mã việc, trạng thái hệ thống) cấm xuất hiện trong chữ hộ nhìn thấy.

**Quy tắc hành động khó gỡ:** mọi nút phá hủy/đảo ngược (xoá, huỷ, nạp lại, ngắt, thu hồi) phải qua 1 bước hỏi nêu tên đối tượng + hậu quả bằng lời thường, nút xác nhận đỏ tách khỏi nút thường; hành động bắt lý do (huỷ lô, trả hàng) là mẫu chuẩn đã có — nhân rộng; chạm ngoài sheet không được phép đóng form đang điền.

**Quy tắc màu/icon/biểu tượng:** màu chỉ được PHỤ (luôn kèm chữ hoặc icon nghĩa); mọi nút icon phải kèm chữ ≥ 1 từ + `aria-label`; trạng thái ON/OFF phải thấy được trên chính nút.

**Ghi chú trạng thái file song song:** mobile.html đang bị W6 sửa (đã thấy trước mắt: VIEWS + script sm-onboard đã nạp, mục 914 «Tạm dừng dùng OPC» đã vào menu) và `viewKetnoi` cũ vẫn còn gọi `D.toggleConnector` đúng chỗ W2 báo — các dòng lẻ ở mục 1/4 có thể lệch vài dòng sau W6 commit, nhưng class CSS (111-151) và cơ chế toast/Aa chắc không đổi. Báo cáo này đo trên bản 20/08 lúc build M3.

BUILD-AGENT-DONE M3 23
