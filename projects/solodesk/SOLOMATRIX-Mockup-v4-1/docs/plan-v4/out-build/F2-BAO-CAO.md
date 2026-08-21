# F2 — BÁO CÁO ĐỢT SỬA THEO 8 BÁO CÁO REVIEW · 20/08/2026

File sở hữu: `js/sm-domain.js` · `js/sm-ops.js` · `js/sm-inbox.js`. Không đụng file nào khác.
Đối chiếu: `docs/plan-v4/INTERFACE-FIX.md` mục 1+2 (khối F2), mã theo R1–R4/M1–M4/V5.

## 1. Làm gì, ở đâu — 22 chỗ sửa

### sm-domain.js (12 chỗ)

| # | Vị trí | Việc | Mã |
|---|---|---|---|
| 1 | `deadlines()` ~:302 | Ngày hết hạn 30 ngày bọc `SM.fmt.dmy()` — hết nối chuỗi ISO vào câu hiển thị | R4 |
| 2 | `deadlines()` ~:308–319 | Thẻ «Việc cần để ý» `cho-cts`: đếm lượt hoãn phát hành chờ chữ ký số; đã nối xong thì đổi lời thành «vào việc là phát hành được», trỏ `dichDen` đúng chỗ (ban/ketnoi) | R2 #19 |
| 3 | `CHANNELS` ~:348 | Kênh mới `'goi-dien'` «Khách gọi điện đặt trước» 📞 — cho `taoDonTay` và tag đơn tay | R2 #01 |
| 4 | `addPurchase()` ~:421–432 | Chặn bảng kê trùng (cùng người bán + cùng hàng + cùng ngày) → trả `{ok:false, id, trung, lyDo}` bảo «mở bảng kê đó bổ sung giấy tờ thay vì lập mới»; lối thoát `p.boQuaTrung` cho lần giao thứ hai thật | R2 #06 |
| 5 | `addBooking()` ~:532–547 | Cọc vượt tổng tiền → chặn TRƯỚC khi ghi lượt đặt; cọc hợp lệ → `D.nhanCoc` ngay (vào `t.payments` qua `D.thuTien`) | R2 #05 |
| 6 | `qrPoints()` ~:608–617 | Cọc nhận trong ngày mà chưa qua dòng tiền (đường cũ ghi thẳng `b.coc`) vẫn cộng vào «Thu hôm nay»; loại trừ bằng `paymentId`/`daXuLyTien` — KHÔNG loại theo trạng thái huỷ (tiền chưa trả khách thì máy không giả sử đã hoàn) | R2 #05 |
| 7 | `chanPhatHanh(t)` mới ~:624–641 | Chưa nối chữ ký số → trả `{ok:false, choHoan, lyDo}` bằng lời nói thường, nêu tên cán bộ theo giúp (từ `t.onboarding.coCanBo.maCanBo`, không có thì «cán bộ hỗ trợ địa bàn»); đã nối → `null` | R2 #19 · chốt P1 |
| 8 | `issueInvoice()` ~:647–664 | Cổng chặn đầu hàm: bị chặn thì tăng `t.choCTS`, ghi nhật ký (mượn `SM.ops.ghiNhatKy`, chưa nạp thì tự ghi cùng hình dạng), trả lời chặn — KHÔNG tạo hoá đơn, KHÔNG enqueue | R2 #19 |
| 9 | `invoiceForOrg()` ~:949–951 | `inv.ok === false` (bị chặn CTS) → trả ngay, KHÔNG ghi công nợ cho hoá đơn chưa tồn tại, đơn giữ nguyên | R2 #19 |
| 10 | exports ~:1134 | Thêm `chanPhatHanh` vào `SM.dom` | — |
| 11 | **IIFE 3 mới** :1384–1593 | «ĐỢT F2 — DÒNG TIỀN & ĐƠN TAY»: `nhatKy` (fallback) · `HINH_THUC_THU` (4 hình thức, cờ `vaoNganKeo`) · **5 hàm hợp đồng mục 1** (`thuTien`, `taoDonTay`, `khopTienVaoDon`, `tienChuaKhop`, `huyDon` — đúng chữ ký) + `nhanCoc` + `suaBangKe`; export `Object.assign(D, …)` | mục 1 · R2 #01 #02 #03 #05 #06 · R4 V9 |
| 12 | `thuTien` :1432 | *(tự soát)* guard mảng `t.qrPoints` rỗng — `((t.qrPoints||[])[0]||{id:'q1'}).id` — khỏi văng TypeError | — |

Chi tiết 5 hàm hợp đồng (đã đúng chữ ký INTERFACE-FIX mục 1):
- `thuTien(t,{soTien,hinhThuc,orderId?,ghiChu?})` — `hinhThuc ∈ 'tien-mat'|'chuyen-khoan'|'qr'|'the'` (hết ghi cứng 'QR'); phiếu `PT-yymmdd-NNN` đẩy vào `t.payments` đủ trường `{id,date,point,amount,method,orderId,ghiChu,noiDung,luc}`; thu kèm đơn hợp lệ thì đơn → `paid`; trả `{ok,phieu}` | `{ok:false,lyDo}`.
- `taoDonTay(t,{khach,sdt?,lines,kenh,giaoNgay?,ghiChu?})` — dựng lines (giá fallback theo danh mục), đi qua `D.checkOrder`: hết hàng nói rõ «tên hàng chỉ còn X (khách đặt Y)»; đơn `DH-yymm-8xx`, `tuTay:true`, `synced:true`.
- `tienChuaKhop(t)` — payments có `choKhop` và chưa có `orderId`.
- `khopTienVaoDon(t,paymentId,orderId)` — đủ 4 chặn (không thấy tiền/đơn, tiền đã gắn đơn khác, đơn đã huỷ); gán xong đơn → `paid`.
- `huyDon(t,orderId,lyDo)` — `lyDo` BẮT BUỘC; đã xuất hoá đơn thì chặn, bảo xử lý hoá đơn trước; trả hàng về lô như `advanceOrder`; ghi `huyNgay`/`huyLyDo` + nhật ký + báo kênh.

### sm-ops.js (4 chỗ)

| # | Vị trí | Việc | Mã |
|---|---|---|---|
| 13 | `tinhCa()` :49–69 | Chia bucket theo hình thức: `TRONG_NGAN_KEO=['Tiền mặt','tien-mat']`, `VAO_TAI_KHOAN=['QR','qr','chuyen-khoan','the','Tiền thu hộ']` — nhận cả mã cũ lẫn mã mới của `thuTien`; **sửa thêm (ngoài hợp đồng, thấy khi làm #02):** COD «Tiền thu hộ» trước đây bị đếm vào NGĂN KÉO dù tiền về thẳng tài khoản (bảng C.15 mục Đơn vị vận chuyển) — chuyển sang bucket tài khoản; cộng `cocMat` (cọc tiền mặt đường cũ) vào `tienMat` + `duKienTrongKet` | R2 #02 + #05 |
| 14 | `noShow()` :229–250 | Cọc 2 đường: qua `nhanCoc` (có `paymentId`) thì giữ cọc KHÔNG ghi thêm (đã trong sổ), hoàn cọc ghi dòng ÂM; đường cũ (không `paymentId`) giữ cọc thì ghi thu MỘT lần. Xong luôn đặt `b.coc.daXuLyTien=true` để các chỗ đếm cọc rời dừng đếm | R2 #05 |
| 15 | `traNoMotPhan()` :107–110 | Payment thu nợ gắn `veKhoanNo: r.id` — khỏi lọt màn khớp tiền-đơn | R2 #03 |
| 16 | `dieuChinhHoaDon()` :172–175 | Cổng CTS (P1) áp cả điều chỉnh/thay thế — chưa nối chữ ký số thì không phát hành hoá đơn mới dưới mọi hình thức | R2 #19 |

### sm-inbox.js (5 chỗ)

| # | Vị trí | Việc | Mã |
|---|---|---|---|
| 17 | `NGUON` :34 | Nguồn mới `'cts-ncc'` «Nhà cung cấp chữ ký số» (cùng hình dạng các nguồn kia — khối nguồn màn hình cho người chấm) | R2 #19 |
| 18 | `process()` don-moi :215–219 | moTa viết lại: «sàn đã trừ sẵn tiền thuế X trong tiền về và nộp hộ rồi, nhà mình không nộp thêm lần nữa (số do sàn gửi kèm đơn)» — bỏ «khấu trừ nộp thay», bỏ «(nguồn: payload sàn)»; chủ ngữ rõ là SÀN | V5 #5 |
| 19 | `process()` tien-ve :222–235 | Payment dựng qua biến `pm`, `method:'chuyen-khoan'` (hết 'QR' cứng); khớp được mã đơn → `pm.orderId` + đơn `paid`; không khớp → `pm.choKhop=true` cho màn `D.tienChuaKhop`; moTa mới «máy để sẵn trong mục khớp tiền, cô chú gán cho đúng đơn giúp máy» | R2 #02 #03 |
| 20 | `process()` van-don COD :257–260 | Payment thu hộ gắn `orderId: o.id` — tiền COD không lọt màn khớp tay | R2 #03 |
| 21 | `KICH_BAN` sanTMDT :322–325 | tieuDe viết lại cùng tinh thần #18 | V5 #5 |
| 22 | `KICH_BAN` cts-duyet-xong :459–464 | Kịch bản «Chữ ký số của hộ kích hoạt xong» → sự kiện `ket-noi-duyet` kênh `cts` → `duyetKetNoi` → `datTrangThaiKetNoi('da_ket_noi')` → `connectors().noi=true` → **cổng chặn tự mở, phát hành lại được ngay**. Đây là đường ra thật của cảnh báo «hoá đơn đang chờ» (không chặn câm) | R2 #19 |

*(Bảng trên 22 dòng = «số thay đổi» in ở dòng cuối.)*

## 2. Tự soát — kết quả dán nguyên

1. **Ký tự Trung/Nhật/Hàn**: grep `[\x{4E00}-\x{9FFF}\x{3040}-\x{30FF}\x{AC00}-\x{D7AF}]` trên cả 3 file = **0 kết quả**.
2. **Từ cấm trong chuỗi hiển thị** (`webhook|endpoint|payload|API|SLA|Q-0|Lớp A|Lớp B|Lớp C`, không phân biệt hoa/thường): các kết quả grep còn lại đều thuộc 3 nhóm được phép:
   - **Comment**: sm-domain.js:75,89,93,96,98,126,296,983,1089,1099,1113 · sm-ops.js:363 · sm-inbox.js:9,142,211–212,309,322,439,479.
   - **Khối «nguồn màn hình cho người chấm» / dữ liệu nội bộ**: `NGUON` (sm-inbox:24–34, gồm dòng mới `'cts-ncc'` cùng hình dạng các dòng cũ), `payload:` là TRƯỜNG DỮ LIỆU của sự kiện (không phải câu hiển thị), `KICH_BAN.moTa` mô tả kịch bản demo (cùng block với các moTa cũ có «webhook»), `CONNECTORS.doTuoi.coChe` (sm-domain, có sẵn từ trước, F1 giữ nhiệm vụ ẩn V5 #1/#2).
   - **Chuỗi F2 mới thêm: 0 từ cấm** — tất cả câu hộ đọc đều lời thường.
   - **Cờ còn lại, nói thẳng**: sm-domain.js:1118 `nhom: 'Theo LUẬT — đã vượt 1 tỷ [Q-001]'` — nhãn `[Q-0xx]` có sẵn từ v3, F2 không thêm và không được giao dọn mục này; nếu chuỗi này hiện ở màn onboarding thì đề xuất đợt sau bỏ nhãn (thuộc F4/sm-onboard hoặc F1 tùy nơi render). Tương tự `filingSteps` bước 2 «Định tuyến vào sổ»/bước 5 «đóng sổ kỳ» (V5 #7 = việc F4, nằm trong file F2 — **F4 không sửa được file này**, đề xuất bàn lại quyền sở hữu đợt sau).
3. **Đối chiếu hợp đồng mục 2 (khối F2)**: 6/6 mục làm xong — 5 hàm mục 1 ✓ · cọc vào dòng tiền ✓ · F.dmy ✓ · R2 #06 (nghiệp vụ `suaBangKe` + chặn trùng) ✓ · R2 #19 (3 lớp: cổng `chanPhatHanh` + thẻ nhắc `cho-cts` + kịch bản mở khoá) ✓ · V5 #5 (cả 2 chỗ trong sm-inbox) ✓.
4. **Cú pháp**: `node --check` **bị từ chối quyền** trong môi trường này (đã thử 3 dạng lệnh — báo thiếu quyền, không lách sang cách chạy khác). Sốt bằng đường hợp đồng cho phép thay thế: **đọc lại TOÀN BỘ cả 3 file sau chỉnh sửa** (sm-domain.js 1593 dòng ×2 lượt, sm-ops.js 410, sm-inbox.js 501) — cả 3 IIFE chính + 2 IIFE bổ sung đều mở/đóng đủ, các hàm mới đóng ngoặc đủ, không thấy lỗi cú pháp. **Chưa chạy được runtime** (không có quyền thực thi node) — smoke test Runtime để lượt tích hợp.

## 3. Chưa làm / để lại — nói thật

1. **V5 #5 chỗ chính (mobile.html:732/737)**: chữ «khấu trừ nộp thay» trên màn nằm ở file F1; F1 đợt này KHÔNG được giao V5 #5 → **chưa ai sửa chỗ đó**. F2 đã sửa hết mọi instance trong phạm vi mình (sm-inbox #18, #21).
2. **R2 #06 phần giao diện**: sheet «bổ sung giấy tờ bảng kê» phải nằm ở mobile.html; F1 không được giao #06 → nghiệp vụ `D.suaBangKe` + chặn trùng `addPurchase` đã sẵn, **chờ lượt sau wired**. Tương tự UI của #01 (nút tạo đơn gọi điện), #02 (chọn hình thức thu), #03 (màn khớp tiền) là việc F1 theo hợp đồng.
3. **Biến dạng đã biết ở file F1**: khi CTS chặn, toast cũ `mobile.html:383/414` (`'Đã xuất '+inv.id`) sẽ in «Đã xuất undefined». F1 được giao viết lại vùng doPay (#02) — **cần verify tích hợp** rằng bản F1 xử lý `inv.ok===false`.
4. **Đườngghi cọc trực tiếp của F1** (mobile.html ~:1505–1570 ghi `b.coc` thẳng, huỷ lượt đặt đổi state trực tiếp): F2 không sửa được file đó nên chọn **fallback đọc-thời-điểm** (`tinhCa.cocMat`, `qrPoints`) với quy ước `paymentId`/`daXuLyTien` — kết ca/«Thu hôm nay» đúng kể cả khi F1 chưa chuyển qua `D.nhanCoc`. Lượt sau nên đưa F1 dùng `D.nhanCoc`.
5. **Idiom có sẵn `(t.qrPoints || [{id:'q1'}])[0].id`** ở sm-ops.js:107/237/245: cùng rủi ro mảng rỗng như chỗ F2 đã guard (#12), nhưng là code cũ ngoài phạm vi các mục được giao — để nguyên theo luật «Edit có neo, đụng tối thiểu», ghi lại đây cho đợt sau.
6. **Không chạy được node** ( Quyền ) — mọi kiểm tra là tĩnh: grep + đọc lại. Không có bằng chứng chạy thật.

## 4. API mới F1 nên biết (đầy đủ chữ ký)

- `D.thuTien(t,{soTien,hinhThuc,orderId?,ghiChu?,diem?,loai?,veDatCho?})` → `{ok,phieu}` — `diem` = điểm thu (màn nhiều điểm); `loai:'coc'`+`veDatCho:<bookingId>` cho cọc.
- `D.taoDonTay(t,{khach,sdt?,lines:[{sku,qty,price?}],kenh:'goi-dien'|'quay'|'zalo',giaoNgay?,ghiChu?})` → `{ok,order}`.
- `D.tienChuaKhop(t)` → mảng payment chờ gán · `D.khopTienVaoDon(t,paymentId,orderId)` → `{ok,phieu,order}`.
- `D.huyDon(t,orderId,lyDo)` — lyDo bắt buộc.
- Ngoài hợp đồng: `D.nhanCoc(t,bookingId,{soTien,hinhThuc?,ghiChu?})` · `D.suaBangKe(t,id,{cccd?,diaChi?,anhBienNhan?,kyNhan?,lyDo})` (lyDo bắt buộc, trả kèm `conThieu`) · `D.chanPhatHanh(t)` (null = được phát hành) · `D.HINH_THUC_THU` · `addPurchase` nhận `p.boQuaTrung` · `addBooking` nhận `req.coc={soTien,hinhThuc?,ghiChu?}` · `CHANNELS['goi-dien']`.
- Dữ liệu mới trên store: `t.choCTS` (đếm lượt hoãn), `payment.choKhop/orderId/veKhoanNo/veDatCho/loai:'coc'`, `b.coc.paymentId|daXuLyTien`, purchase `boSungLuc/boSungLyDo`.

BUILD-AGENT-DONE F2 22
