# R1 — BÁO CÁO BUILD (kiến trúc thông tin & điều hướng)

## Đã làm gì
Rà kiến trúc thông tin mobile.html (sau đợt W6 đăng ký view onboarding/Trạm/Tạm dừng vào `VIEWS`,
mobile.html:2498-2515 — ghi chú «đang thi công» ở đầu file vì 4 agent sửa song song lúc rà). KHÔNG sửa
bất kỳ file code nào. Sản phẩm: **`R1-IA-DIEU-HUONG.md`** gồm:
- Kiểm kê thật 36 view trong `VIEWS` + 24 mục menu «Thêm» (4 nhóm) + 5 tab (tab 2 đổi theo ngành:
  CD1→`kho`, CD2→`lich`, CD3→`mua`) + ~24 sheet — mỗi màn ghi rõ đường vào; kết luận: 20 màn chỉ vào
  được từ menu Thêm, không màn mồ côi tuyệt đối, có mồ côi-theo-ngành.
- Đếm chạm 8 việc hằng ngày: bán 1 đơn ~3 chạm (đạt); trả lời khách 4 chạm + nhận đơn sàn 4 chạm +
  không có chỗ 1-chạm xem tiền về — 3 việc hằng ngày vượt ngưỡng, nêu đường tắt.
- Đánh giá menu Thêm theo tần suất thật + đề xuất sắp lại (giữ ràng buộc tối đa 5 tab, tab 2 theo ngành).
- 6 cặp trùng chức năng/thông tin (nổi bật: 2 thẻ cảnh báo cùng nguồn trên cùng màn Bán; công nợ 2 số
  khác nhau cùng tên — amount vs conNo).
- Chế độ `Aa`: phát hiện nút «Xem» của «Sáng nay cần để ý» bấm chết với hộ simple (TAB bị reset ở
  mobile.html:2563) + mất đường tới Hộp thư/Hội thoại/Đơn.
- Bảng kết luận **15 vấn đề** (mỗi dòng: mô tả · bằng chứng file:dòng · mức · đề xuất · chi phí S/M/L)
  + sơ đồ điều hướng đề xuất (cây chữ) + top-7 việc sắp trước nhất.

## Ghi / sửa ở đâu
- Write mới `out-build/R1-IA-DIEU-HUONG.md` (sản phẩm chính).
- Edit 1 chỗ trong chính file đó: bỏ ký tự CJK 「＋」dòng bảng đếm chạm (phát hiện lúc tự soát).

## Tự soát bằng cách nào
- Mọi khẳng định điều hướng neo file:dòng đọc thật (VIEWS mobile.html:2498-2515; tabsFor 200-223;
  NHOM menu 878-911; render/reset TAB 2528-2537, 2563; DICH sm-domain.js:292-318; data-di trong
  sm-onboard.js/sm-nen.js; seed CD1/CD2/CD3 sm-seed-gialai.js:145,287,402).
- Soát CJK bằng ripgrep (lớp `\p{Han}\p{Hiragana}\p{Katakana}\p{Hangul}` + khối fullwidth): lượt 1 bắt
  1 lỗi ở dòng 49 → đã Edit → lượt 2 xác nhận 0 match. Không cần `node --check` (không đụng JS).

## Chưa làm được / để lại
- Không thể xác nhận bằng cách bấm chạy (đề cấm sửa code, chỉ rà tĩnh) — kết luận «nút chết» #1/#3 suy
  từ luồng render() đọc được; nên verify nhanh trên trình duyệt khi W6 gộp.
- #1 (`dichDen:'thue'`) khả năng W2/W6 đang thi công dở — đã ghi chú trong file, không kết luận vội.
- Đề ghi menu «Thêm ~18 mục»; thực tế đếm được 24 mục (W6 vừa thêm `nen`/`truyxuat`/`tamdung`) — báo cáo
  dùng con số đo thật.

BUILD-AGENT-DONE R1 15
