# F4 — BÁO CÁO ĐỢT SỬA THEO INTERFACE-FIX · 20/08/2026

File sở hữu đã sửa: `js/sm-onboard.js` · `js/sm-ai.js`. `js/sm-nen.js`: soát lại, **không phải sửa chỗ nào** (mọi việc F4 chạm sm-nen đều hoá ra nằm ở mobile.html — xem mục 3).

## 1. Đã làm (14 chỗ sm-onboard.js + 7 chỗ sm-ai.js = 21 thay đổi)

### R4 V12 — 3 câu wizard thiếu phản hồi «đã chọn» (sm-onboard.js)
- `cauNganh` (~:1168) / `cauGiayTo` (~:1196) / `cauPos` (~:1239): bọc các nút vào `<div data-chonroi="1">` đúng mẫu câu 4; mỗi nút nhận `pri` ngay khi là câu đã trả lời (khởi tạo từ `traLoi` khi quay lại bằng «Sửa câu trước»); thêm dòng `<div class="muted" data-chondem>` «Đã chọn: **…**» (hoặc «Chưa chọn — …» khi chưa chọn); thêm nút `<button class="btn w" data-tiep>Tiếp tục</button>` — `w` chứ không `pri`, vì pri giờ là dấu «đã chọn» (đồng bộ câu 4).
- `ganBindCau` nhánh `[data-chonroi]` (~:1020): sau khi đổi `pri`, cập nhật dòng `data-chondem` = «Đã chọn: » + nhãn nút vừa bấm (`E(b.textContent.trim())`) — bấm nút khác là đổi được, đúng luật «sửa bấm nhầm» W0 4(d).
- `ganBindCau` thêm handler `[data-tiep]` (~:1048): chưa chọn gì mà bấm «Tiếp tục» → toast «Bấm chọn một câu bên trên đã…» (không chặn câm, theo triết lý «LUÔN SÁNG» W0 3(c)); đã chọn → `ob2.cau++`, `vongLaiCau`. Không đụng `#ob2-tiep` (câu kênh) và `#ob4-tiep` (câu 4) — hai luồng đã duyệt giữ nguyên.
- **Đổi kèm (có chủ đích, nêu rõ):** nút «Không nhớ — để cán bộ xem giúp» của câu giấy tờ bỏ `pri` cứng (W0 2(d) từng cho pri làm «nút to mặc định»). Lý do: khi pri đồng thời là dấu «đã chọn», pri cứng khiến hộ tưởng mình đã trả lời. Giữ «an toàn + to» bằng `margin-top:14px;font-size:17px`; bấm vào thì sáng pri như mọi đáp án.
- Đã đối chiếu `veCau`/`vongLaiCau`: câu 5 bấm Tiếp tục → `cau=6 > tongCau=5` → `xongPhanHoi` — đúng hành vi advance cũ. Luồng rút gọn (cauNguoiGiup) không chạm.

### M3 #6 — hỏi trước khi ngắt (sm-onboard.js ~:2011-2036)
- Nút «Ngắt kết nối này» trong sheet chi tiết «— đã nối»: `btn gh` → `btn dan` (đỏ), `margin-top:8px` → `16px` (cách nút cán bộ ≥16px theo quy ước).
- Bấm nút → mở sheet hỏi lại đúng TÊN + hậu quả bằng lời thường: «Ngắt {tên}? — Ngắt rồi thì {tên} không tự gửi gì về máy nữa — đơn, tiền, tin từ chỗ này dừng lại tới khi nối lại. Sổ đã ghi sẵn thì vẫn nguyên đó, không mất gì.» Hai nút: «Để nguyên — không ngắt» (pri — con đường an toàn là chính) và «Đồng ý ngắt {tên}» (dan, cách 16px). Chỉ nút «Đồng ý ngắt» mới gọi `datKetNoi(...,'bo_qua')`.
- Giữ nguyên rào nhóm LUẬT («không tự ngắt được, gọi cán bộ») và sheet xác nhận tay của cán bộ (đã có rào mã cán bộ + lý do — đạt đề xuất V5 từ lượt trước).

### V5 #4 — phí tin nói rõ (sm-onboard.js, 2 chỗ)
- Note phí trong sheet đăng ký Zalo OA (~:1617): «Phí khi dùng: trong 7 ngày khách vừa nhắn, được 8 tin trả lời miễn phí (tính trong 2 ngày); hết thì mỗi tin hỏi - trả lời tốn 55 đồng, mỗi tin chốt đơn tốn 165 đồng.» (trước: «8 tin miễn phí/48 giờ rồi 55đ/tin; tin Giao dịch 165đ/tin» — «48 giờ»/«đ/tin» là kiểu viết nội bộ). Số 8/2/55/165 giữ như chứng từ [Q-005] — comment `[Q-005]` giữ tại chỗ.
- Field `phi` của connector zalooa trong THAM_SO (~:58): viết lại cùng lời thường; nhãn `[Q-005]` giữ trong chuỗi gốc vì đường hiển thị chính đi qua `boNhan()` (cắt nhãn) còn bản RAW chỉ nằm trong khối «nguồn màn hình» gập.

### V5 #6 — GTGT/TNDN/TNCN chú thích lần đầu (sm-ai.js :142, :146, :147)
- Câu thuế tạm tính theo nhóm: «GTGT 1% = X» → «thuế giá trị gia tăng 1% là X»; «TNCN» → «thuế thu nhập cá nhân».
- Chế độ doanh nghiệp: «gồm GTGT … và TNDN … (thuế suất X%)» → «gồm thuế giá trị gia tăng (GTGT) … và thuế thu nhập doanh nghiệp (TNDN) …»; nhánh hộ: «thuế giá trị gia tăng (GTGT) … thuế thu nhập cá nhân (TNCN)».

### V5 #8 — «ngưỡng» → «mốc» (sm-ai.js, 7 điểm — sạch trong file F4)
- :38 KB-02: «chạm ngưỡng» → «chạm mốc 1 tỷ đồng»; :148: «vượt ngưỡng miễn thuế» → «vượt mốc miễn thuế»; :255 «vượt ngưỡng» → «vượt mốc»; :257 «trên ngưỡng» → «trên mốc»; :258 «dưới ngưỡng» → «dưới mốc»; :259 «Ngưỡng áp dụng:» → «Mốc áp dụng:» (đối chiếu `D.TAX.nguong.posInvoice.ten` = «Doanh thu trên 1 tỷ đồng/năm — thuộc diện…» đọc xuôi).

### V5 #10 (+ M3 #18 cùng lớp) — chữ build nội bộ lọt màn (sm-onboard.js, 6 chỗ)
- :273 guard `datKetNoi`: «sm-domain.js chưa có datTrangThaiKetNoi (việc W2 — chưa xong ở lượt build này)» → «Máy này chưa có phần nối — nhờ cán bộ kỹ thuật xem giúp» + comment ghi rõ đây là nhánh phòng hờ (hàm đã có từ W2).
- :588-594 `moPhong` 3 toast: «Chưa nạp sm-inbox.js» → «Máy thiếu phần hộp thư — nhờ cán bộ kỹ thuật xem giúp»; bỏ «(W3 bổ sung)», bỏ «(chờ W3)» → «Sự kiện đã vào hộp thư nhưng máy chưa xử lý được: …»; lý do kỹ thuật chuyển hết vào comment.
- :690 nút «Xem thử» của buổi tập: «Chưa có hộ demo cd4-moi trong kho — cần seed v4 (việc W4)» → «Máy này chưa có hộ mẫu để bấm thử — nhờ cán bộ kỹ thuật xem giúp» (đúng câu V5 #13 gợi ý) + comment.
- :1717 `dongHo30Ngay`: «Đồng hồ 30 ngày cần hàm D.mocVuotNguong (việc W2)» → «Đồng hồ 30 ngày chưa chạy được trên máy này — nhờ cán bộ kỹ thuật xem giúp, đừng để trễ hạn» + comment.

## 2. Tự soát (4 bước theo đề)

1. **CJK = 0**: grep `[\x{4E00}-\x{9FFF}\x{3040}-\x{30FF}\x{AC00}-\x{D7AF}]` trên cả 3 file sm-onboard/sm-ai/sm-nen → không kết quả.
2. **Chuỗi cấm trong hiển thị**: grep `webhook|endpoint|payload|API|SLA|Q-0..|Lớp A|Lớp B|Lớp C|việc W..` → mọi kết quả còn lại chỉ nằm ở: **comment** (sm-ai :4,:7,:10,:394,:430; sm-onboard :49,:180,…); **khối «Cài đặt nâng cao — cho cán bộ»** (sm-onboard :1389-1392, chữ Webhooks/webhook); **khối «nguồn màn hình» gập** (sm-onboard :1379 hiện RAW ts.* có [Q-0xx] — chuẩn W0 #13); và **mã nguồn không hiển thị** (`ev.payload`, hằng `SLA` nội bộ sm-ai). Các đường hiển thị trước hộ đều qua `boNhan()` (cắt [Q-0xx]/(Q-0xx)). Sau đợt sửa: 0 chỗ «việc Wx» hiển thị.
3. **Đối chiếu từng mục hợp đồng**: mục 1 ở trên; mục 3 dưới nêu rõ mục nào KHÔNG thuộc file mình.
4. **Cú pháp**: `node --check` **bị chặn ở chế độ phê duyệt của máy** (lần chạy đầu báo «requires approval» — job nền không ai duyệt) — không tự vượt, soát thay thế bằng: đọc lại toàn bộ vùng sửa ±(vùng lân cận) kiểm tra cấu trúc chuỗi/ngoặc (kết quả trong mục «đã làm» đều là literal nối chuỗi hoàn chỉnh theo đúng pattern code chạy được liền kề); đối chiếu chéo `veCau`/`vongLaiCau`/`khungCau`/`sheet()` để chắc handler mới khớp luồng cũ. Đề nghị ai có terminal đủ quyền chạy lại `node --check js/sm-onboard.js js/sm-ai.js` trước khi build.

## 3. Chưa làm được — nói thật: 4/10 mục hợp đồng F4 có code nằm NGOÀI file F4 (không đụng theo luật mục 0)

| Mục hợp đồng | Chỗ sửa thật | Chủ file |
|---|---|---|
| V5 #3 bỏ «Lớp A/B/C» khỏi màn Trợ lý | `mobile.html:813-815` (3 dòng tĩnh «Lớp A · …») + `mobile.html:823` (map `lt={A:[…],B:[…],C:[…]}` từ `m.lop`). sm-ai.js chỉ còn «Lớp» trong comment + giá trị `lop:'A'` nội bộ (không tự hiển thị); nhãn `nhan` đã thân thiện sẵn | **F1** |
| V5 #7 «Định tuyến vào sổ»/«đóng sổ kỳ» → lời thường | `sm-domain.js:637` («Định tuyến vào sổ») và `:648` («đóng sổ kỳ») trên đường nộp thuế 5 bước; thêm `mobile.html:803` («Đã đóng sổ kỳ với mã…»). Không có ở cả 3 file F4 | **F2** (+ F1) |
| M3 #4 đường ra khỏi chế độ đơn giản | Toàn bộ ở `mobile.html`: nav 3 tab (:203-204, không có mục Cài đặt), toast :2557, ép TAB :2566-2568. sm-onboard chỉ có guard `danhThucMobile` (:545) vốn đúng chức năng (comment đã ghi «sửa gốc nằm ở mobile.html — W8») | **F1** |
| M1 #12 nút «Nói thay gõ» 48px + nhân đôi chân giỏ | `mobile.html:308` (`#noiQuay` .btn.sm 38px trong tab Bán), `:819` (`#mic`), `:324` (chân giỏ trống). sm-nen.js chỉ chứa LOGIC sheet «Nói thay gõ», không chứa nút nào | **F1** |

Ghi chú riêng cho M3 #6 phần «Đã nối»: nhãn sai «Đã nối» 1-chạm nằm ở `mobile.html:957` — dead code của `viewKetnoi` cũ, R3 đã giao F1 xoá; phần F4 (sheet «— đã nối» thật) đã sửa ở mục 1.

**Rơi giữa các agent — đề nghị chủ chiến dịch phân lại:** chuỗi phí tin [Q-005] lộ ở `mobile.html:2309/:2314` (sheet Nhắc nợ D-#4, gọi hàm `SM.onb.cuaSoTin` của F4 nhưng chuỗi hiển thị nằm trong template mobile.html) — không thuộc danh mục F1 lẫn F4 trong INTERFACE-FIX; F4 không đụng file người khác, ghi lại đây để lượt gộp xử lý.

**Phát hiện ngoài phạm vi (chỉ flag, không sửa — không tự chế việc ngoài hợp đồng):**
- `sm-onboard.js:105-106` field leadTime/xacNhan connector sàn chứa «Open Platform cấp token»/«Token 4 giờ» — chữ «token» thuộc danh cấm quy ước mục 3, hiện qua `boNhan()` ở sheet chi tiết connector (chỉ cắt được nhãn Q-0xx, không cắt chữ «token»).
- `sm-onboard.js:2068` lyDo «Poll đối soát 24h phát hiện…» → ghi nhật ký, chữ «Poll» thuộc họ «polling» cấm.
Hai chỗ này tồn tại từ lượt trước, không có trong 8 báo cáo; để lượt soát chữ kế tiếp quyết.

## 4. Kết luận
21 thay đổi điểm-sửa (16 lệnh Edit có neo), 0 Write đè file cũ (chỉ Write duy nhất file báo cáo này). Wizard 5 câu giờ đồng bộ một cơ chế «chọn — thấy ngay đã chọn gì — Tiếp tục»; ngắt kết nối có bước hỏi đúng tên + hậu quả; phí tin và thuế nói bằng lời thường; sạch chữ build nội bộ khỏi màn hộ trong phạm vi file F4.
