# R1 — KIẾN TRÚC THÔNG TIN & ĐIỀU HƯỚNG: app có bị rối không, sắp lại thế nào

- Ngày 20/08/2026 · rà trên bản mobile.html sau đợt W6 (đã đăng ký view wizard + Trạm + Tạm dừng vào
  `VIEWS`, mobile.html:2498-2515). **Ghi chú «đang thi công»**: 4 agent sửa song song khi tôi rà
  (mobile.html, js/sm-ai.js, js/sm-b2g.js, js/sm-seed-b2g.js) — mọi kết luận dưới đây neo theo dòng
  đọc được tại thời điểm rà; chỗ nghi đang dở tôi ghi rõ.
- Câu hỏi trung tâm: **hộ kinh doanh mở app ra có biết đi đâu không, hay phải nhớ đường?**
  Trả lời ngắn: việc ở QUẦY (bán, thu tiền, tồn kho) đi rất gần — 1-2 chạm. Việc ở RANH GIỚI với
  bên ngoài (tiền về, đơn sàn, tin khách nhắn) buộc phải BIẾT RẰNG nó nằm sau menu «Thêm» → Hộp thư /
  Hội thoại. Người mù công nghệ không «nhớ đường» được chỗ đó.

## 1. Kiểm kê thật (grep + đọc, không đoán)

### 1.1 Màn đăng ký trong `VIEWS` (mobile.html:2498-2515) — 36 view

| Nhóm | Màn | Đường vào (đếm được trong code) |
|---|---|---|
| Tab dưới | `ban` `don` `tien` `them` | tab (mobile.html:207-208) |
| Tab 2 đổi theo ngành | `lich` (CD2) · `mua` (CD3) · `kho` (CD1) | tab (mobile.html:204-206); 2 view còn lại KHÔNG có đường vào với hộ đó (chủ ý «một gói chung, cấu hình được», mobile.html:200) |
| Trợ lý | `ai` | FAB (mobile.html:2555) + tab ở chế độ đơn giản (mobile.html:203) |
| Onboarding v4 | `obkichhoat` `obnhandien` `obdanhmuc` `obcon` | boot lần đầu (mobile.html:2569) · thẻ «Bắt đầu» tab Bán hộ trắng (mobile.html:287) · chỉ trong luồng wizard (sm-onboard.js:649,660,995,1141,1234,1280,1326) |
| Trạm kết nối | `ketnoi` | menu Thêm · thẻ cảnh báo đứt kênh (sm-domain.js:314) · wizard (sm-onboard.js:661,1251) |
| **Chỉ vào được từ menu Thêm** | `hoithoai` `khachhang` `trahang` `datcho` `hanghoa` `nhapkho` `huyhong` `truyxuat` `tainguyen` `khoanchi` `hoadondc` `giadoi` `chiphi` `nen` `phanquyen` `thietbi` `nhatky` `hoso` `dulieu` `tamdung` — **20 màn** | mỗi màn đúng 1 nút `data-go` ở mobile.html:916, handler mobile.html:928 |
| Vào được thêm đường khác | `hopthu` (menu + thẻ «Sáng nay» mobile.html:263-266 + nút tab Bán mobile.html:363 + sm-nen.js:213) · `congno` (menu + nút tab Tiền mobile.html:729 + thẻ nợ DICH, sm-domain.js:292) · `ketca` (menu + nút tab Tiền mobile.html:730) · `kho`/`mua` thêm thẻ cảnh báo (DICH `hoso`/`bangke`, sm-domain.js:292-293) | |

- **Màn mồ côi tuyệt đối: KHÔNG có.** Màn 20 mục «chỉ từ menu Thêm» vẫn có đường vào (1 đường).
- **Mồ côi theo cấu hình ngành**: mỗi hộ chỉ thấy 1 trong 3 `lich/mua/kho` làm tab; ví dụ CD1
  (không `resources`, không `purchases`, sm-seed-gialai.js:145-170) không vào được `mua` — an toàn vì
  nội dung rỗng, nhưng thẻ cảnh báo DICH vẫn có thể trỏ `mua`/`kho` cho hộ không dùng màn đó
  (sm-domain.js:292-293) — người dùng bấm «Xem» rơi vào màn không áp dụng.

### 1.2 Menu «Thêm» (mobile.html:878-911) — 24 mục, 4 nhóm (đề ghi ~18; W6 vừa thêm `nen`, `truyxuat`, `tamdung`)

- Nhóm «Bán hàng và khách»: `hopthu` `hoithoai` `khachhang` `trahang` (+`datcho` khi có lịch) — 4-5 mục.
- Nhóm «Hàng hoá và kho»: `hanghoa` `nhapkho` `huyhong` `truyxuat` (+`tainguyen` khi có lịch) — 1-5 mục theo ngành.
- Nhóm «Tiền và sổ sách»: `ketca` `congno` `khoanchi` `hoadondc` (`giadoi` khi có) `chiphi` — 5-6 mục.
- Nhóm «Hệ thống và dữ liệu»: `ketnoi` `nen` `phanquyen` `thietbi` `nhatky` `hoso` `dulieu` `tamdung` — **8 mục**.

### 1.3 Sheet: ~24 (đếm `sheet('` mobile.html:367→2540): thu tiền, hoá đơn MST, chi tiết đơn, đặt chỗ,
truy xuất lô, nộp thuế, bài đăng, trả khách ngoài giờ, chi tiết sự kiện, sửa/thêm tài nguyên, sửa/thêm
gói giá, hoá đơn/điều chỉnh, ghi khoản chi, đổi vai, thu hồi máy, bên mua thấy gì, nhắc nợ, nợ, tin
nhắn, chọn chân dung, + các sheet của sm-onboard/sm-nen. Chọn chân dung hộ (☰) là sheet riêng
(mobile.html:2539-2550) — đường vào thay đổi TOÀN BỘ app nằm sau nút ☰ không chữ giải thích.

## 2. Đếm số chạm tới việc hằng ngày (3 chân dung CD1/CD2/CD3)

| Việc | Đường hiện nay | Số chạm | Phán |
|---|---|---|---|
| Bán 1 đơn tại quầy | mở app → tab Bán sẵn → nút + từng món → Thu tiền (mobile.html:308-320,367) | ~3 | đạt |
| Ghi bảng kê thu mua (CD3) | tab Thu mua → form lập ngay đầu màn (mobile.html:642-653) | 1-2 | đạt |
| Xem nợ | Tiền → Công nợ (mobile.html:729) hoặc thẻ cảnh báo | 2 | đạt |
| Kết ca | Tiền → Kết ca (mobile.html:730); từ màn Bán là 2 chạm sau khi đổi tab | 2 | đạt, GỢN: đáng có nút cuối màn Bán (việc cuối quầy) |
| Xuất hoá đơn (b2b) | Đơn → mở đơn → «Xuất hoá đơn» (mobile.html:497,506) | 3 | đạt |
| Xem tiền về (CK/ngân hàng) | Thêm → Hộp thư → sự kiện (mobile.html:916,1066); tab Tiền KHÔNG có tổng tiền về — chỉ có thuế + nợ (mobile.html:732-774) | 3-4 | **VẤN ĐỀ**: hằng ngày mà không có chỗ 1-chạm xem «hôm nay tiền về bao nhiêu» |
| Trả lời khách | Thêm → Hội thoại → tin → Gửi (mobile.html:916,2414,2443) | 4 | **VẤN ĐỀ nặng nhất**: việc hằng ngày, đường vào duy nhất là mục số 2 của menu Thêm |
| Nhận đơn sàn | Thêm → Hộp thư → sự kiện → «Nhận và xử lý» (mobile.html:1181-1201); badge tab Đơn chỉ sáng SAU khi xử lý (mobile.html:212) | 4 | **VẤN ĐỀ**: đơn mới nằm khuất trong hộp thư chung; thẻ «Sáng nay» chỉ ghi chung «N sự kiện mới» |

## 3. Menu «Thêm» có phải bãi rác không

Nhóm đã chia 4 (mobile.html:876-877) — tốt hơn menu phẳng 22 cũ. Vấn đề còn lại là NHÓM 4 và trộn
độ tần suất trong nhóm 3. Đánh giá từng mục theo tần suất dùng thật:

| Mục | Tần suất thật | Đề xuất |
|---|---|---|
| `hoithoai` | hằng ngày | **ra khỏi menu Thêm** — đưa vào Trợ lý (FAB) xem chi tiết dưới |
| `hopthu` | hằng ngày (tiền về, đơn sàn) | giữ + thêm đường ngắn (thẻ «Sáng nay» đã có; thêm dòng tiền về ở tab Tiền) |
| `khachhang` `trahang` `datcho` `hanghoa` `nhapkho` `ketca` `congno` `khoanchi` | hằng tuần / theo đợt | giữ ở menu Thêm |
| `huyhong` `truyxuat` `tainguyen` `giadoi` `hoadondc` | vài lần một năm / theo sự kiện | các mục «theo sự kiện» (`giadoi`, `truyxuat`, `huyhong`) nên chỉ hiện khi CÓ việc (mẫu `giadoi` đã vậy, mobile.html:898) — áp cùng quy tắc |
| `chiphi` («Chi phí của tôi — lộ trình 3 năm») | chỉ để trình bày hội đồng | chuyển vào màn «Cài đặt và dữ liệu» (dưới) |
| `ketnoi` (Trạm) `nen` | theo đợt onboarding / tra cứu khi nghi đứt | giữ (Trạm) — thêm đường từ Trợ lý |
| `phanquyen` `thietbi` `nhatky` `hoso` `dulieu` `tamdung` | vài lần một năm / người nhà làm giúp | **gộp 1 màn cha «Cài đặt và dữ liệu»** — menu Thêm còn 1 dòng duy nhất cho cả nhóm |

Sau sắp lại: menu Thêm chỉ còn ~3 nhóm VIỆC KINH DOANH (12-14 mục) + 1 dòng «Cài đặt và dữ liệu».
Ràng buộc giữ nguyên: tab dưới vẫn 5 mục (ban · lich/mua/kho · don · tien · them), tab 2 vẫn theo ngành.

## 4. Trùng chức năng / trùng thông tin

| Cặp trùng | Bằng chứng | Giữ / bỏ |
|---|---|---|
| «Sáng nay cần để ý» + «Việc cần để ý» trên CÙNG màn Bán, cùng đọc `D.deadlines` | mobile.html:253+291-292 | gộp 1 thẻ duy nhất (sangNay đã có nút đi thẳng); alertsCard giữ ở Lịch/Mua/Tiền cắt 2 mục |
| Công nợ: card «Công nợ chưa thu» trong tab Tiền vs màn Công nợ | mobile.html:766-774 vs sm-ops.js:115-125 | **2 nguồn cùng `t.receivables` nhưng tính khác nhau**: card Tiền cộng `r.amount`, màn Công nợ tính `conNo` (đã trừ trả một phần) — trước mặt hộ là 2 số khác nhau cùng gọi «còn nợ». Giữ màn Công nợ; card Tiền đổi sang `O.noSummary().tongConNo` |
| Trả lời khách: «Trợ lý trả khách ngoài giờ» (Trợ lý) vs màn Hội thoại | mobile.html:864-867 vs 2443-2473 | 2 luồng cùng việc, không liên kết chéo. Giữ Hội thoại là NƠI trả lời; nút ở Trợ lý đổi thành «xem N tin chưa trả lời →» dẫn sang (`data-di`) |
| Nhắc việc: alertsCard (4 màn) + «Trợ lý chạy nền» | mobile.html:236, sm-nen.js §1-3 | chấp nhận (2 mục đích khác nhau: đi thẳng vs giải thích) — nhưng tên nên phân biệt rõ («Việc hôm nay» vs «App canh gì khi mình tắt máy») |
| Hàng đợi gửi đi: `qCount` header + card trong Hộp thư + thẻ «Sáng nay» | mobile.html:229-230, 1115-1134, 265-266 | giữ nguyên; chỉ cần `qCount` bấm được (xem #13) |
| Hộp thư chứa khối «Giả lập sự kiện bên ngoài» (demo) cạnh sự kiện thật + hàng đợi | mobile.html:1070-1085 | khối demo tách hẳn (chỉ hiện khi bật cờ demo / `?demo=1`) — người mù công nghệ không phân biệt nút nào là việc thật |

## 5. Chế độ đơn giản (`Aa`)

- Bộ lọc cứng: simple chỉ cho `ban/tien/ai`, mọi TAB khác bị reset về `ban` (mobile.html:2563);
  nav 3 tab (mobile.html:202-203); FAB ẩn (mobile.html:222).
- **Hộ simple BỊ MẤT đường tới việc họ CẦN**: Hội thoại (khách nhắn Zalo không thấy đâu trả lời),
  Hộp thư (tiền về, đơn sàn, xác nhận kết nối), Đơn. Nguy hiểm hơn: nút «Xem» trong thẻ
  «Sáng nay cần để ý» (mobile.html:273) với hộ simple bấm vào thì `TAB='hopthu'` bị render() reset
  về `ban` ngay sau đó (mobile.html:2563) — **nút hiện ra mà bấm không đi đâu** (xác nhận cùng cơ chế
  cho thẻ `dichDen` bất kỳ ngoài 3 tab).
- Ngược lại, màn quá phức tạp vẫn lọt vào: tab Tiền simple vẫn hiện nguyên «Kê khai và nộp thuế» +
  nút «Mở ứng dụng thuế điện tử để nộp» (mobile.html:756-764, không có `hide-simple`) — bố mẹ đứng
  quầy không cần chỗ này hằng ngày; chỉ vài card đã gắn `hide-simple` (mobile.html:740,750,776,780).
- Đề xuất: simple thêm đường vào `hopthu` `hoithoai` (dạng thẻ 1 dòng ở đầu tab Bán, chữ to);
  thẻ thuế/«Sáng nay» ở simple chỉ trỏ tới 3 tab được phép hoặc tự tắt lọc để đi — chặn nửa chừng
  là mất niềm tin (đúng tinh thần P13 «vào dễ thì ra cũng phải dễ»).

## 6. Bảng kết luận

| # | Vấn đề | Bằng chứng | Mức | Đề xuất | Sửa |
|---|---|---|---|---|---|
| 1 | Nút «Xem» thẻ đồng hồ 30 ngày trỏ `dichDen:'thue'` — không có view `thue`, render() âm thầm về tab Bán | sm-domain.js:300 + mobile.html:247,2530 | RỐI VỪA | trỏ về `tien` (màn kê khai) hoặc thêm nhánh đặc biệt dẫn Trạm; có thể W2/W6 đang thi công phần này — cần chốt trước nghiệm thu | S |
| 2 | Trả lời khách 4 chạm, đường vào duy nhất từ menu Thêm; không badge báo «chưa trả lời» ngoài mô tả mục menu | mobile.html:881,2414-2421 | RỐI NẶNG | đưa Hội thoại vào Trợ lý (FAB) + thẻ «N tin chưa trả lời» trên «Sáng nay» + badge Trợ lý | M |
| 3 | Chế độ đơn giản khoá hết màn ngoài `ban/tien/ai` — mất Hộp thư/Hội thoại/Đơn; nút «Xem» của «Sáng nay» bấm chết với hộ simple | mobile.html:2563,273 | RỐI NẶNG | simple cho phép `hopthu` `hoithoai`; hoặc mọi nút đi-đến tự nhận biết simple để đổi đích/thông báo | M |
| 4 | Hộp thư là xương sống vận hành nhưng chỉ vào qua menu Thêm; đơn sàn mới nằm khuất, badge tab Đơn sáng sau khi xử lý | mobile.html:212,880,1066 | RỐI VỪA | thẻ «Sáng nay» tách riêng mục «N đơn sàn chờ nhận» → 1 chạm tới hộp thư và lọc sẵn; thêm mục Hộp thư dạng nút gần đầu tab Bán | S |
| 5 | Không có chỗ 1-chạm xem «tiền về hôm nay» (quầy + CK hợp nhất) | mobile.html:724-787 (tab Tiền chỉ thuế/nợ) | RỐI VỪA | card «Tiền về hôm nay» đầu tab Tiền = payments hôm nay + sự kiện tiền-về đã xử lý (hàm tính từ kho) | M |
| 6 | Khối «Giả lập sự kiện» (demo cho hội đồng) trộn trong màn vận hành Hộp thư | mobile.html:1070-1085 | RỐI VỪA | ẩn sau cờ demo (`?demo=1`), mặc định không hiện trước mặt hộ | S |
| 7 | Hai thẻ cảnh báo cùng nguồn trên cùng màn Bán («Sáng nay» + «Việc cần để ý») | mobile.html:253-275,291-292 | RỐI VỪA | gộp làm một; alertsCard chỉ giữ ở Lịch/Mua/Tiền | S |
| 8 | Công nợ hai số khác nhau cùng tên «còn nợ» (amount vs conNo) | mobile.html:766-774 vs sm-ops.js:120-122 | RỐI VỪA | card tab Tiền dùng `O.noSummary().tongConNo` | S |
| 9 | Trợ lý và Hội thoại cùng việc «trả lời khách», không liên kết | mobile.html:837-838,864 vs 2443 | RỘI VỪA→GỢN | nút Trợ lý dẫn sang Hội thoại; một nơi duy nhất để bấm Gửi (N-06 giữ người bấm) | S |
| 10 | Nhóm «Hệ thống và dữ liệu» 8 mục chiếm 1/3 menu Thêm, toàn việc vài-lần-một-năm | mobile.html:901-910 | RỐI VỪA | gộp màn cha «Cài đặt và dữ liệu»; menu Thêm còn nhóm việc kinh doanh + 1 dòng cài đặt | M |
| 11 | `chiphi` («lộ trình 3 năm») là mục trình-bày-hội đồng nằm lẫn nhóm sổ sách | mobile.html:899 | GỢN | chuyển vào «Cài đặt và dữ liệu» | S |
| 12 | Thẻ cảnh báo có thể trỏ tới màn không áp dụng cho ngành của hộ (`kho`/`mua` với hộ không có tab đó) | sm-domain.js:292-293, mobile.html:204-206 | GỢN | DICH thêm điều kiện theo cấu hình hộ, hoặc màn đích hiện dòng «việc này không dùng với ngành nhà mình» | S |
| 13 | «N chờ gửi» ở thanh trạng thái là chữ chết — không bấm được | mobile.html:229-230 | GỢN | gắn onclick mở Hộp thư (cuộn tới hàng đợi) | S |
| 14 | Kết ca là việc cuối quầy nhưng chỉ vào từ tab Tiền | mobile.html:730 | GỢN | nút «Kết ca» cuối màn Bán khi đang mở ca | S |
| 15 | Đổi chân dung (☰) không nhãn — nút thay đổi toàn bộ app mà chỉ có icon | mobile.html:157 | GỢN | thêm chữ «Hộ» cạnh ☰ hoặc aria + tooltip; demo hội đồng cần đổi hộ liên tục | S |

Không đề xuất nào phá N-01/N-06/N-07/N-08/N-09 (không đụng tầng kế toán, người bấm vẫn là hộ, không
giữ tiền, không thêm tính năng TIEN_ICH, không dùng broadcast Zalo). Mọi nghiệp vụ hằng ngày vẫn
trọn trên điện thoại (THUMOI IV.4) — các đề xuất chỉ RÚT NGẮN đường đi, không dời việc sang máy tính.

## Sơ đồ điều hướng đề xuất (dạng chữ)

```
Tab dưới:  Bán · (Lịch|Thu mua|Kho theo ngành) · Đơn · Tiền · Thêm        Trợ lý (nút nổi 💬)
Bán       ├ «Sáng nay cần để ý» (gộp 2 thẻ cũ, mỗi mục 1 chạm đi thẳng)
          ├ Bán tại quầy → Thu tiền → (nút Kết ca khi mở ca)
          └ thẻ «N tin khách chưa trả lời» → Hội thoại
Đơn       └ mở đơn → xuất hoá đơn / vận chuyển / huỷ
Tiền      ├ Tiền về hôm nay (quầy + CK — mới)
          ├ Công nợ · Kết ca · Thuế tạm tính · Kê khai và nộp
Trợ lý    ├ hỏi-đáp 3 lớp + «N tin chưa trả lời → Hội thoại»
          └ «App canh gì khi mình tắt máy» (Trợ lý chạy nền — nay từ đây vào được)
Thêm      ├ Bán hàng và khách: Hộp thư · Khách hàng · Trả hàng · (Đặt chỗ)
          ├ Hàng hoá và kho: Hàng hoá · Nhập kho · Huỷ hỏng* · Truy xuất* · Tài nguyên*
          ├ Tiền và sổ sách: Kết ca · Công nợ · Khoản chi · Hoá đơn điều chỉnh* · (Đổi giá*)
          └ Cài đặt và dữ liệu (màn cha): Hồ sơ · Phân quyền · Thiết bị · Nhật ký ·
             Chi phí 3 năm · Dữ liệu của tôi · Tạm dừng dùng OPC
Hộp thư   = Sự kiện đã đến + Hàng đợi gửi đi (khối «giả lập» chỉ hiện khi bật demo)
Wizard    obkichhoat → obnhandien → obdanhmuc → Trạm (đang chờ ai) → obcon
(*) mục theo sự kiện — chỉ hiện khi có việc thật
```

## Top-7 việc nên sắp lại trước nhất

1. **#3 + #1** — xoá nút chết (simple-mode reset, `dichDen:'thue'`): nút bấm không đi đâu là mất
   niềm tin của người sợ máy; sửa 2 chỗ nhỏ, làm ngay trước nghiệm thu.
2. **#2** — Hội thoại + badge «chưa trả lời» lên đường 1 chạm (Trợ lý/FAB + thẻ Sáng nay).
3. **#4** — đơn sàn chờ nhận thành mục riêng 1-chạm trên «Sáng nay».
4. **#5** — card «Tiền về hôm nay» đầu tab Tiền.
5. **#6** — tách khối «giả lập sự kiện» khỏi mắt hộ (cờ demo).
6. **#7 + #8** — gộp 2 thẻ cảnh báo trên màn Bán + thống nhất số công nợ (2 sửa nhỏ, đỡ hỏi «sao
   hai chỗ hai số»).
7. **#10** — nhóm «Hệ thống và dữ liệu» gộp thành màn cha «Cài đặt và dữ liệu», menu Thêm chỉ còn
   việc kinh doanh.
