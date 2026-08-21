# R2 — MỘT NGÀY CỦA HỘ: nhật ký 3 chân dung và chỗ đứt gãy

Ngày mô phỏng: **17/08/2026** (mốc `TODAY` của seed — `js/sm-seed-gialai.js:17`). Tôi nhập vai chính chủ hộ,
cầm điện thoại đi trọn một ngày làm việc, từng bước ghi: **hộ cần gì → app bắt làm gì (màn, mấy chạm, file:dòng) →
trơn hay vấp**. Mọi tình huống, tên người, con số đều lấy từ seed; mọi đường đi đối chiếu code hiện có
(`mobile.html`, `js/sm-domain.js`, `js/sm-ops.js`, `js/sm-inbox.js`).

> ⚠️ File đang bị 8 agent sửa song song (`mobile.html`, `sm-ai.js`, `sm-seed-*.js`…). Mọi số dòng dưới đây đúng với
> bản tôi đọc hôm 20/08; nếu W6/W7 dịch dòng thì neo theo tên hàm. Các chỗ tôi thấy còn «dở» giữa chừng đã ghi chú
> ở cuối (mục Ghi chú song song).

4 loại đứt gãy: **ĐỨT** (không có chỗ làm — phải ra ngoài app) · **VÒNG** (được nhưng đi qua nhiều màn không liên quan) ·
**NGƯỢC** (thứ tự app khác thứ tự đời) · **MÙ** (không biết việc đã xong chưa).

---

## KHỐI 1 — CD1 «Hộ Đặc sản Biển Xanh» (bà Nguyễn Thị Bảy + chị Hà)

Hộ đã vượt 1 tỷ (doanh thu 8 tháng ~1,02 tỷ — `sm-seed-gialai.js:135`), bán tại 2 quầy + 3 sàn + khách sạn,
đang nối dở onboarding (hddt/zalooa `cho_duyet`, cts `dang_dang_ky` — `js/sm-seed-gialai.js:241-260`).

### 06:30 — Mở quầy, mở hàng sáng

- **Hộ cần**: mở cửa, bắt đầu bán ở quầy q1 (chợ đêm q2 chỉ mở chiều).
- **App bắt làm**: không cần làm gì — mở app là thấy «Thu hôm nay» tăng dần theo QR (`mobile.html:293-297`).
  Thẻ «Sáng nay cần để ý» (`mobile.html:253-275`) gom các việc đến hạn lên đầu: khoản nợ quá hạn (Hải Âu +
  Gành Ráng), số đơn chờ xử lý, hạn kê khai Q3, đồng hồ «còn 74 ngày đăng ký hoá đơn điện tử» (tính từ
  `vuotLuc 2026-09-30` → hết 30/10), ATTP hết hạn 05/11. Mỗi mục có nút «Xem» đi thẳng (`data-di`) —
  **trơn, 0 chạm thừa**.
- **Vấp [NGƯỢC · #07]**: app có «Mở ca bán hàng» (đếm tiền đầu ngăn kéo — `js/sm-ops.js:37-47`,
  `mobile.html:1818-1821`) nhưng **không ai nhắc mở ca buổi sáng** — không nằm trong `deadlines()`
  (`js/sm-domain.js:223-326`) lẫn «Sáng nay cần để ý». Bà mở ca lúc 6:30 thì phải tự nhớ; quên thì tối
  mới «mở ca» — lúc đó tiền đầu ca hỏi đếm lại vô nghĩa vì đã bán cả ngày (máy vẫn tính đủ vì `tinhCa`
  lọc theo ngày — `js/sm-ops.js:50-59` — nhưng nghi thức «đếm tiền đầu ca» bị ngược đời).

### 07:00 — Nhà hàng Sao Biển gọi điện: «chiều gửi 10kg mực khô một nắng»

- **Hộ cần**: ghi nhận một ĐƠN BÁN cho khách quen gọi điện, giao chiều, cuối tuần mới tính tiền.
- **App bắt làm**: không có màn «lập đơn bán ra» cho khách tổ chức ngoài khách định kỳ. Hai đường đều sai lệch:
  1. Giỏ hàng tab Bán → «Xuất hoá đơn cho khách có mã số thuế» (`mobile.html:323,360`) — nhưng nó **xuất hoá đơn
     ngay** (trừ kho, truyền thuế — `js/sm-domain.js:587-626`) trong khi hàng chưa giao, khách chưa trả tiền.
  2. Tab Đơn → «Tạo đơn hôm nay» chỉ tồn tại cho 3 khách ĐỊNH KỲ seed (`mobile.html:425-434` gọi
     `orderFromRecurring` — `js/sm-domain.js:835-853`); Nhà hàng Sao Biển (có trong `b2bBuyers` seed
     `js/sm-seed-gialai.js:141`) không có mẫu định kỳ → không tạo được đơn.
- **Đánh dấu [ĐỨT · #01]**: đơn bán ra cho khách gọi điện phải ghi giấy/nhớ đầu — nguy hiểm nhất trong ngày
  (quên = mất 6,2 triệu tiền mực: 10kg × 620.000đ giá MK theo seed). Đau hơn: `O.donTuTinNhan` («đơn từ tin
  nhắn») **đã có sẵn API** (`js/sm-ops.js:249-268`) nhưng không màn nào gọi (grep `donTuTinNhan` trong
  `mobile.html`: 0 kết quả) — chức năng mồ côi, UI thiếu đúng chỗ hộ cần.

### 08:00 — Đơn b2b Khách sạn Hải Âu (9,5tr, đang chờ) + mẫu định kỳ Thứ Ba

- **Hộ cần**: hôm nay thứ Hai — mẫu định kỳ của Hải Âu là Thứ Ba & Thứ Sáu (`js/sm-seed-gialai.js:191-193`),
  nên hôm nay chỉ cần theo dõi đơn sẵn `DH-2608-203` (Khách sạn Hải Âu, 9,5tr, đang chờ —
  `js/sm-seed-gialai.js:179-181`), mai mới tới lượt tạo đơn định kỳ.
- **App bắt làm**: tab Đơn có badge số đếm (đếm `new|picking` — `mobile.html:213`) dẫn thẳng tới đơn — **trơn**.
  «Tạo đơn hôm nay» chỉ hiện khi đúng chu kỳ — đúng đời, không hiện nút vô nghĩa ngày sai chu kỳ.
- **Vấp [VÒNG · #12]**: nếu khách nhắn Zalo dời lịch, hộ phải «Thêm → Hội thoại với khách» (`mobile.html:881`)
  trả lời, rồi **thoát sang tab Đơn** lục mẫu rồi thao tác — tin nhắn và đơn định kỳ không liên kết với nhau;
  tên khách vừa đọc trong tin phải tìm lại ở màn khác.

### 09:30 — Đơn Shopee về (khách đặt trên sàn)

- **Hộ cần**: biết có đơn mới, gói hàng, giao.
- **App bắt làm**: sự kiện vào «Hộp thư đến» ở trạng thái «mới» → bấm mở → «Nhận và xử lý sự kiện này»
  (`mobile.html:1174-1198`; nghiệp vụ `js/sm-inbox.js:185-216` kiểm tồn rồi mới nhận) → đơn vào tab Đơn
  `state:new` → mở đơn → «Chuyển sang: Đang lấy hàng» → chọn đơn vị vận chuyển (GHN/GHTK… —
  `mobile.html:484-489`) → có mã vận đơn. Thẻ «Sáng nay cần để ý» có mục đi thẳng `hopthu`, tab Đơn có badge.
- **Đánh giá**: **trơn về logic**, nhưng đi qua 2 màn + 1 sheet cho mỗi đơn. Đơn TikTok `DH-2608-202`
  đang `synced:false` (`js/sm-seed-gialai.js:176-178`) — trên màn không có chỗ nào nói cho hộ biết
  «đơn này chưa đồng bộ xong» → **[MÙ · #17]** nhẹ.

### 10:00 — Khách chuyển khoản trả tiền đơn hôm qua (khách quên ghi nội dung)

- **Hộ cần**: biết tiền về, trừ nợ đơn.
- **App bắt làm**: SePay đẩy «Tiền về» vào Hộp thư → xử lý. Máy chỉ khớp đơn **khi nội dung chuyển khoản có mã
  đơn** (`js/sm-inbox.js:224-225`); không có mã thì trả «Ghi nhận tiền về, chưa khớp đơn nào»
  (`js/sm-inbox.js:227-228`) — và **thế là hết**: không có màn nào cho hộ khớp tay tiền-về với đơn.
  Trong sheet đơn cũng không có nút «khách đã chuyển khoản» (`mobile.html:490-503` chỉ có Chuyển-trạng-thái /
  Xuất hoá đơn / Huỷ); trạng thái `paid` chỉ sinh ra từ webhook tự khớp.
- **Đánh dấu [ĐỨT · #03]**: tiền đã vào sổ thanh toán nhưng đơn treo «mới» mãi → cuối tuần thanh minh với
  khách sạn bằng sổ ngoài. Với hộ bán công nợ 30 ngày thì đây là việc NGÀY nào cũng gặp.

### 11:00 — Xuất hoá đơn cho công ty (đơn DH-2608-203)

- **Hộ cần**: hoá đơn đỏ điện tử cho Khách sạn Hải Âu để được đưa vào danh sách nhà cung cấp.
- **App bắt làm**: tab Đơn → mở đơn → «Xuất hoá đơn» (`mobile.html:492`) → sheet điền tên + MST + hình thức trả
  (`orgInvoiceSheet` — `mobile.html:385-413`). Chỗ gợi ý tên có «Khách sạn Hải Âu» (lấy từ công nợ/định kỳ —
  `mobile.html:387-388`) nhưng **MST phải gõ lại tay** dù máy đã lưu MST của khách này trong sổ khách
  (`js/sm-domain.js:1228` — `customers()` gom `mst` từ hoá đơn cũ). Công nợ 30 ngày được ghi tự động
  (`js/sm-domain.js:875-883`) — **trơn**.
- **Vấp [VÒNG · #08]**: app CÓ sẵn MST của khách mà bắt hộ gõ lại — đúng kiểu «dữ liệu tự chảy bị đứt».
- **Vấp [MÙ · #09]**: sau khi xuất hoá đơn, đơn **vẫn giữ `state:'new'`** (`invoiceForOrg` chỉ gán
  `invoiceId` — `js/sm-domain.js:873`) → tab Đơn vẫn hiện badge «chưa xử lý», bà tưởng còn việc.
- **Ghi chú lệch chốt [GẮT · #19]**: CD1 đang `hddt: cho_duyet`, `cts: dang_dang_ky` (seed), nhưng
  `issueInvoice()` không kiểm tra trạng thái nối/CTS — vẫn sinh hoá đơn và truyền cơ quan thuế bình thường
  (`js/sm-domain.js:587-626`). Chốt P1 («chưa CTS → KHÔNG phát hành HĐĐT») chưa thấy thực thi ở code
  đang chạy. Có thể W2/W6 đang xử — xem Ghi chú song song.

### 14:00 — Bán lẻ tại quầy: khách mua nước mắm trả TIỀN MẶT

- **Hộ cần**: bán 2 chai, khách đưa tờ 200.000 tiền giấy.
- **App bắt làm**: tab Bán → chạm + món → «Thu tiền QR» (`mobile.html:322`) → sheet hiện mã QR + nút duy nhất
  «Khách đã trả — xuất hoá đơn» (`mobile.html:365-382`). **Không có lựa chọn «khách trả tiền mặt»**; khi bấm,
  máy ghi cứng `method:'QR'` (`mobile.html:380`). Seed chứng minh nghiệp vụ tiền mặt có thật hôm nay
  (2 dòng «Tiền mặt» 95.000đ + 185.000đ — `js/sm-seed-gialai.js:219,221`).
- **Đánh dấu [NGƯỢC · #02 — nặng nhất CD1]**: khách trả mặt mà sổ ghi QR → tối kết ca máy báo «Tiền mặt bán
  được: 0đ, trong ngăn kéo phải có: thiếu» (`tinhCa` chia theo `method` — `js/sm-ops.js:53-55`) → bà đối tiền
  lệch, mất niềm tin ngay ngày đầu. Việc này xảy ra MỖI ngày.

### 16:00 — Gói hàng chờ ship (đơn Shopee `DH-2608-201` đang «lấy hàng»)

- **App bắt làm**: tab Đơn → lọc «Đang lấy hàng» → mở đơn → chọn hãng → gửi. Hàng khô không lạnh nên đủ hãng;
  nếu là cá mắm giữ lạnh thì danh sách tự lọc hãng lạnh (`needsCold` — `mobile.html:478`). **Trơn**.

### 20:30 — Kết ca, đếm tiền hai quầy

- **Hộ cần**: đếm tiền ngăn kéo 2 điểm, đối với máy, biết chênh bao nhiêu.
- **App bắt làm**: tab Tiền → «Mở ca» (vì sáng không ai mở — xem #07) → nhập «tiền đầu ca» lúc 20:30 → «Kết ca»
  → nhập tiền đếm được → máy so `duKienTrongKet = tiền đầu + tiền mặt` (`js/sm-ops.js:58`), lệch thì bắt lý do
  — đúng đời. Nhưng tiền mặt trong ngăn kéo bị lệch vì #02 (tiền mặt bị ghi QR). «Doanh thu các điểm» hợp nhất
  theo điểm hiển thị ở tab Bán (`mobile.html:298-303`, `qrPoints` — `js/sm-domain.js:568-578`) — **trơn và hay**.
- Kết ca xong thấy «2 khoản công nợ quá hạn» (Hải Âu 18,4tr hạn 05/08, Gành Ráng 9,25tr hạn 12/08 —
  `js/sm-seed-gialai.js:185-186`) → «Xem» nhảy thẳng Công nợ → mở khoản → «Nhắc nợ qua tin nhắn»
  (`mobile.html:2359`) → sheet soạn sẵn + **lộ phí trước nút gửi** (khách im lặng >7 ngày → tin Tư vấn 55đ/tin,
  khách Chị Sáu im từ 05/08 — `js/sm-seed-gialai.js:234`; `mobile.html:2298-2310`) — **trơn, đúng chốt P9/D-#4**.

### Trả lời 3 câu — CD1

1. **Màn đã mở trong ngày**: Bán · Đơn · Hộp thư · Tiền (kết ca + công nợ) · Hội thoại — **5 màn**; qua menu
   «Thêm»: **2 lần** (Hộp thư, Hội thoại — cả hai chỉ vào được từ «Thêm»).
2. **App có dữ liệu mà bắt hộ tự làm**: MST khách tổ chức đã lưu trong sổ khách nhưng sheet xuất hoá đơn bắt gõ
   lại (#08); nội dung tin nhắn khách (tên, món, số lượng) không chảy sang form đặt đơn/đặt chỗ (#12); tiền về
   ngân hàng đã có trong sổ nhưng khớp đơn phải «nhớ đầu» (#03).
3. **Nếu bà chỉ dùng 3 màn Bán–Đơn–Tiền**: sự kiện Hộp thư nằm chờ «mới» không ai mở (badge ở tab Thêm dễ bỏ
   qua vì «Thêm» là tab dừng chân cuối) → **đơn sàn mới treo không gói được — mất đơn âm thầm**; khách sạn
   chuyển khoản không mã đơn → đơn không bao giờ sang «đã thu». Hạn kê khai Q3 thì thẻ «Sáng nay» có nhắc —
   không bỏ sót.

---

## KHỐI 2 — CD2 «Hộ Du lịch Nhơn Lý» (anh Lê Minh Duy, 27 tuổi)

780tr/8 tháng, đà vượt 1 tỷ (`sapVuot` — `js/sm-domain.js:193-200`); quán + homestay + 2 cano; CD2 là tenant
demo wizard (onboarding trống — `js/sm-seed-gialai.js:374-375`).

### 06:30 — Lần đầu mở app

- **App bắt làm**: boot thấy `chua_kich_hoat` → tự mở màn chào OB-1 đúng 1 lần (`mobile.html:2567-2570`);
  «Để sau, dùng app trước» vẫn vào app bình thường (thẻ chào còn ở tab Bán — `mobile.html:283-290`).
- **Ghi chú tính trung thực demo [NHẸ · #18]**: wizard hỏi các câu làm quen trong khi seed đã đầy 4 phòng,
  2 cano, các lượt đặt, doanh thu các tháng — người xem tinh sẽ thấy mâu thuẫn. Không phải lỗi luồng; ghi lại
  cho W4 biết.

### 07:00 — Xem lịch hôm nay và ngày mai

- **Hộ cần**: biết sáng mai (18/08) có đoàn nào, cano còn chỗ không.
- **App bắt làm**: tab giữa chính là «Lịch» (thanh tab đổi theo ngành — `mobile.html:202-210`): thanh chỗ
  `used/cap` từng khung 5 ngày (`mobile.html:507-522`). Thấy 18/08 Cano 1 khung 07:30 đã 12/12 (seed cố tình —
  `js/sm-seed-gialai.js:320-321`). **Trơn, 1 màn**.

### 08:00 — Chị Thu nhắn Zalo: «mai bên mình còn cho đi cano không em» (TN1, chưa trả lời)

- **App bắt làm**: «Thêm → Hội thoại» → mở tin → trợ lý soạn câu trả lời **tính từ lịch thật** (đếm chỗ còn
  theo khung — `js/sm-domain.js:1264-1269`) → hộ đọc, bấm gửi (`mobile.html:2450-2454`). **Trọn vẹn — điểm sáng.**
- **Vấp [VÒNG · #12]**: khách đồng ý lấy chỗ → phải thoát sheet, sang tab Lịch, điền lại 6 ô (ngày, tài nguyên,
  khung, số khách, tên «Chị Thu», gói) — `mobile.html:524-535`. Tên và ý định vừa nằm trong tin nhắn không
  chảy sang form.

### 09:00 — Nhận cọc cho đoàn đã đặt cano sáng mai (18/08, khung 07:30)

- **Hộ cần**: thu cọc 2 triệu tiền mặt, ghi lại là của đoàn nào.
- **App bắt làm**: «Thêm → Lượt đặt: đổi, huỷ, cọc» (`mobile.html:884`) → bấm đúng lượt → «Ghi cọc» nhập số
  tiền (`mobile.html:1510-1516`) → máy lưu `b.coc={soTien,ngay}` (`mobile.html:1539`).
- **Đánh dấu [ĐỨT dòng tiền · #05]**: cọc **không được ghi vào `t.payments`** — hai triệu tiền mặt trong ngăn kéo
  mà tab Bán «Thu hôm nay» và kết ca không thấy (`qrPoints`/`tinhCa` chỉ đọc `payments` —
  `js/sm-domain.js:571-575`, `js/sm-ops.js:50-59`). Tối đối tiền lại lệch đúng số cọc. «Nhận cọc» là việc
  thường ngày của hộ du lịch mùa cao điểm — đứt này to hơn vẻ ngoài.

### 11:30 — Khách đoàn tới quán ăn, trả tiền mặt 6 suất

- Cùng chỗ đứt **[NGƯỢC · #02]** như CD1: «Thu tiền QR» ghi cứng `method:'QR'` — tiền mặt thành chuyển khoản.
  Món ANUONG có tồn theo suất (lô 400 suất — `js/sm-seed-gialai.js:306`) nên kiểm tồn khi bán vẫn ổn.

### 14:00 — Công ty Lữ hành Đất Võ nhắn: «Đoàn 20 khach ngay 22/8 con nhan khong» (TN2, chưa trả lời)

- **Hộ cần**: trả lời NGAY dựa trên chỗ còn, và nếu nhận thì GIỮ CHỖ luôn.
- **App bắt làm — 2 vấp liên hoàn**:
  1. Trợ lý soạn trả lời không khớp mẫu nào (tin không có từ khoá cano/phòng/giá — `js/sm-domain.js:1264-1283`)
     → chỉ còn câu chào chung. Hộ tự tính: 2 cano 12+8=20 chỗ → «nhận được».
  2. Sang tab Lịch ghi nhận: **form «Nhận đặt chỗ» chỉ cho 5 ngày tới (17–21/08)** — `calendar(...,5)`
     (`mobile.html:508`) và `#bDate` render từ đúng 5 ngày đó (`mobile.html:527`). **Ngày 22/08 không tồn tại
     trong ô «Ngày»** → [ĐỨT · #04]. Form «Đổi lịch» cũng chỉ 7 ngày (`mobile.html:1520`). Họ phải hẹn khách
     «gần ngày nhắc em», ghi giấy — đúng loại mất đơn âm thầm.
  3. Nếu ngày có trong tầm: đoàn 20 phải đặt THÀNH HAI LƯỢT (Cano 1 khung nào đó 12 chỗ + Cano 2 cùng khung
     8 chỗ), mỗi lượt điền lại full form → [VÒNG · #11]; máy không hiểu «đây là một đoàn».

### 20:00 — Tối chốt doanh thu 4 điểm (bến thuyền, quán, homestay, điểm lặn)

- **App bắt làm**: tab Bán mục «Doanh thu các điểm» liệt kê 4 điểm QR + tổng thu hôm nay
  (`mobile.html:298-303`; seed 8 giao dịch — `js/sm-seed-gialai.js:341-350`). **Trơn, 1 màn, đúng đề bài.**
- Nhẹ [NHẸ · #16]: muốn cắt «điểm × hình thức thanh toán» (tiền từng điểm nào là mặt, nào là QR) thì không có
  bảng chéo — kết ca chỉ gộp theo hình thức.

### Trả lời 3 câu — CD2

1. **Màn đã mở**: Lịch · Bán (quán + chốt 4 điểm) · Hội thoại · Lượt đặt · (wizard) — **5 màn**; qua «Thêm»:
   **2 lần** (Hội thoại, Lượt đặt).
2. **App làm hộ được mà chưa làm**: câu trả lời «còn chỗ không» đã tính được (từ lịch) nhưng KHÔNG tự chảy sang
   giữ chỗ (#12); đặt đoàn 20 người máy có đủ dữ liệu 2 cano để tự tách nhưng bắt hộ đặt 2 lượt (#11).
3. **Nếu chỉ dùng Bán–Lịch–Tiền**: tin Zalo chưa trả lời nằm im (chỉ thấy qua «Thêm» — mất khách); đơn 22/08
   không thể ghi nhận trong app → **double-booking với khách sau nếu chủ hộ quên giấy nháp**; cọc thu rồi
   máy không biết → sổ tiền sai âm thầm (#05).

---

## KHỐI 3 — CD3 «Hộ Nông sản Chư Păh» (anh Nguyễn Thành Bình, 32 tuổi)

535tr/8 tháng — dưới ngưỡng; bài toán nằm ở chứng từ đầu vào. Onboarding `xong_viec_dau` (việc đầu 14 phút —
`js/sm-seed-gialai.js:506`).

### 05:30 — Ra vườn thu mua của 3 nông dân (Ông Rơ Chăm Hlum, Bà Siu H Blan, Ông Trần Văn Lợi — đều quen, đã bán lần trước)

- **Hộ cần**: tại vườn, lập bảng kê từng người: tên, CCCD, địa chỉ, hàng, số lượng, giá, chụp biên nhận, ký nhận.
- **App bắt làm**: tab giữa chính là «Thu mua» — form đầy đủ, chặn ngay khi thiếu CCCD/địa chỉ kèm giải thích
  «vì sao bắt buộc» (`mobile.html:686-701`; `checkPurchase` — `js/sm-domain.js:431-440`); mất mạng vẫn lập
  (2 bảng kê seed sinh offline — `js/sm-seed-gialai.js:426,432`). Lưu xong tự vào lô
  (`addPurchase` — `js/sm-domain.js:406-430`). **Trọn vẹn — điểm sáng của app.**
- **Vấp [VÒNG · #13]**: 3 người = 3 lượt điền-lưu đầy đủ form (~8 ô/lượt). «Nói thay gõ» bóc được chùm người
  nhưng cũng «mỗi người một lượt lưu» (`mobile.html:676-685` — đúng comment code). Mùa thu hoạch 10 người/buổi
  thì 10 lượt điền liền nhau. Chấp nhận được nhưng mỏi tay.

### 08:00 — Về kho, ghi mẻ phơi/rang hôm qua

- **Hộ cần**: nhập kho mẻ CFR rang mộc từ lô cà phê nhân.
- **App bắt làm**: «Thêm → Hàng hoá và kho → Nhập kho, kiểm kê» → chọn nguồn «Mẻ tự chế biến»
  (`NGUON_NHAP` — `js/sm-domain.js:1117-1122`) → tạo lô riêng giữ truy xuất (`mobile.html:1268-1307`).
  **Trơn**, nhưng việc NHẬT KÝ hằng ngày của hộ chế biến lại không có chỗ trên thanh tab (tab giữa đã dành cho
  «Thu mua») → mỗi ngày 2 chạm qua «Thêm» [NHẸ · #14].

### 09:30 — Công ty Vĩnh Hiệp gọi: đặt thêm 2 tấn cà phê nhân, giao tuần sau, đòi hoá đơn + giấy truy xuất

- **Hộ cần**: ghi nhận ĐƠN ĐẶT (chưa xuất hàng), chuẩn bị hoá đơn gắn lô + giấy truy xuất theo lô.
- **App bắt làm**: giống CD1 [#01] — không có màn «lập đơn bán ra» cho doanh nghiệp. Đường duy nhất: giỏ tab Bán
  → «Xuất hoá đơn cho khách có mã số thuế» — nghĩa là **xuất luôn hôm nay**, hàng chưa giao mà kho đã trừ,
  công nợ đã ghi. Không có trạng thái «đã nhận đặt — chờ giao» [ĐỨT · #01 + NGƯỢC · #10].
- **Phần truy xuất thì ĐẠT**: hoá đơn seed HD-2608-901 bán 750kg gắn 2 lô truy ngược tới đúng nông dân
  (`js/sm-seed-gialai.js:456-464`); `issueInvoice` tự gắn lô khi trừ kho (`js/sm-domain.js:611-616`);
  nút «Truy xuất» ngay trong tab Thu mua (`mobile.html:661-666`) và «Truy xuất lô cho bên mua» trong «Thêm»
  (`mobile.html:2254-2265`) — xem đúng cái khách quét thấy, che tên nông dân + giá mua. **Điểm sáng.**
- **Vấp [MÙ · #15]**: chị Nga (Vĩnh Hiệp) nhắn Zalo hỏi giấy truy xuất (TN2 seed, chưa trả lời) — trả lời được,
  nhưng không có đường **gửi mã truy xuất cho khách** từ trong app (không nút «gửi mã này cho khách»); mã nằm
  trong app chờ khách «tự biết đường mà quét».

### 11:00 — Hai bảng kê tuần trước thiếu giấy tờ (BK-0814-04 thiếu CCCD + ảnh; BK-0816-05 thiếu địa chỉ + ảnh + chưa ký nhận)

- **App bắt làm**: tab Thu mua hiện ngay «2 bảng kê thiếu giấy tờ» + thẻ «Chưa khoá được kỳ» giải thích chặn
  (`mobile.html:634-635`, `deadlines` thẻ `bangke` — `js/sm-domain.js:264-269`). **Nhìn thấy — tốt.**
- **Đánh dấu [ĐỨT · #06]**: thấy thiếu nhưng **không có nút «sửa/bổ sung bảng kê»** — danh sách bảng kê chỉ đọc
  (`mobile.html:650-658`, `bindMua` không có handler sửa). Người nông dân đã về — gặp lại phải… lập BẢNG KÊ MỚI
  (dòng trùng trong sổ — chi phí bị đếm hai lần nếu người soát không để ý) hoặc sửa trong… kho dữ
  liệu thô. Đúng kiểu «cảnh báo rồi bỏ mặc».

### 14:00 — Chốt lô giao cho lô đã hẹn; 16:00 — Công ty Vĩnh Hiệp chuyển tiền đợt cà phê tuần trước

- **Hộ cần**: ghi nhận đã thu (một phần) công nợ 72tr (hạn 14/09 — `js/sm-seed-gialai.js:465-467`).
- **App bắt làm**: tab Tiền → thẻ công nợ → hoặc Thêm → Công nợ → mở khoản CN-01 → «Ghi nhận đã trả» nhập số
  tiền + hình thức (`mobile.html:2361-2374`; `traNoMotPhan` ghi lịch sử trả VÀ đẩy vào `payments` —
  `js/sm-ops.js:86-103`). **Trơn — mẫu thức đúng cho cả #03.**
- Sự kiện SePay «Tiền về» nếu khách chuyển KHÔNG kèm mã đơn thì lại rơi #03 (tiền vào sổ, công nợ không trừ).

### Tối — Đơn từ buổi live tối 16/08 (DH-2608-301, 30 gói CFR) còn «Đang lấy hàng»

- **App bắt làm**: tab Đơn badge đếm nhắc; mở đơn → gói → chọn «Hộ tự giao trong tỉnh» hoặc GHTK. **Trơn.**
  Nếu khách trả tiền khi nhận: giống #02/#03.

### Trả lời 3 câu — CD3

1. **Màn đã mở**: Thu mua · Bán (xuất hoá đơn DN) · Đơn · Tiền/Công nợ · Nhập kho (Thêm) · Hội thoại (Thêm) —
   **6 màn, nhiều nhất ba hộ**; qua «Thêm»: **3 lần** (Nhập kho, Hội thoại, Truy xuất lô — công nợ đi được từ
   tab Tiền nên thường khỏi cần Thêm).
2. **App làm hộ được**: MST + tên công ty đã trong sổ khách (từ hoá đơn tuần trước) — vẫn bắt gõ lại (#08);
   bảng kê đã có đủ dữ liệu người bán, chỉ thiếu trường cuối — máy phải gợi «gặp lại người bán ngày N: bổ sung
   đúng trường thiếu» thay vì chỉ đỏ; mã truy xuất đã sinh mà không gửi được cho khách (#15).
3. **Nếu chỉ dùng Thu mua–Bán–Tiền**: «2 bảng kê thiếu giấy tờ» sẽ nổi ở tab Thu mua (có alertsCard) nên không
   bỏ sót hoàn toàn, NHƯNG không sửa được trong app (#06) → cuối quý kỳ vẫn không khoá được — **chặn kê khai
   đúng lúc nông dân đã xa**. Đơn đặt 2 tấn không ghi được → quên giao trừ phi nhớ điện thoại.

---

## BẢNG GỘP MỌI ĐỨT GÃY

| # | Chân dung | Bước trong ngày | Loại | Bằng chứng (file:dòng) | Đề xuất sửa | Mức |
|---|---|---|---|---|---|---|
| 01 | CD1+CD3 | Khách gọi điện/Zalo đặt hàng — không có màn lập đơn bán ra thủ công | ĐỨT | `mobile.html:416-464` (chỉ đơn định kỳ `data-rec`); `O.donTuTinNhan` mồ côi `js/sm-ops.js:249` không UI gọi | Nút «Tạo đơn cho khách này» từ hội thoại + nút «Đơn mới» đầu tab Đơn (dùng sẵn `checkOrder`/`advanceOrder`) | CHẶN |
| 02 | CD1+CD2 | Thu tiền mặt tại quầy bị ghi cứng `method:'QR'` — không có lựa chọn hình thức | NGƯỢC | `mobile.html:365-382` (nút duy nhất, `:380` push QR); phân loại `js/sm-ops.js:53-55` | Sheet thu tiền thêm 2 nút to «Khách quét mã» / «Khách đưa tiền mặt» — chọn nào ghi nấy | CHẶN |
| 03 | CD1+CD3 | Tiền chuyển khoản về không kèm mã đơn → không khớp đơn được; không nút «khách đã trả» trong sheet đơn | ĐỨT | `js/sm-inbox.js:224-228` (chỉ khớp tự động); `mobile.html:490-503` không có nút thu | Sự kiện tiền-về «chưa khớp» thêm bước «chọn đơn này trả cho đơn nào» (chips các đơn đang mở); sheet đơn thêm «Đã nhận tiền chuyển khoản» → `state:'paid'` | CHẶN |
| 04 | CD2 | Form đặt chỗ chỉ tới 5 ngày — đoàn 20 khách ngày 22/08 không thể ghi nhận | ĐỨT | `mobile.html:508` (`calendar(...,5)`), `:527` (`#bDate` từ cal); đổi lịch `:1520` (7 ngày) | Ô ngày đổi thành `input type=date` tự do (giữ quick-chips 5 ngày cho quen); kiểm trùng vẫn chạy | CHẶN |
| 05 | CD2 | Cọc ghi trong lượt đặt nhưng KHÔNG vào dòng tiền → kết ca/tổng thu sai | ĐỨT | `mobile.html:1539` (chỉ set `b.coc`); `js/sm-ops.js:50-59` + `js/sm-domain.js:571-575` chỉ đọc `payments` | Ghi cọc → push `payments` (method theo thực thu) + note «Cọc cho lượt đặt»; hoàn/huỷ cọc ghi dòng trừ | CHẶN |
| 06 | CD3 | Bảng kê thiếu giấy tờ: cảnh báo nhưng không có đường bổ sung trong app | ĐỨT | `mobile.html:650-658` + `bindMua:686-701` (không handler sửa); cảnh báo `js/sm-domain.js:264-269` | Bấm vào bảng kê thiếu → sheet sửa đúng trường thiếu (ghi nhật ký lí do); KHÔNG cho lập bảng kê trùng người+lô | CHẶN |
| 07 | CD1 | Không ai nhắc «Mở ca» buổi sáng; mở ca tối mới thì «tiền đầu ca» vô nghĩa | NGƯỢC | `js/sm-ops.js:37-47`; không có trong `deadlines()` `js/sm-domain.js:223-326` lẫn `sangNayCard` `mobile.html:253-275` | Mục «Mở ca bán hàng» vào thẻ «Sáng nay cần để ý» khi chưa có ca và đã đến giờ mở (theo ngày); hoặc tự mở ca khi phát sinh giao dịch đầu tiên trong ngày | GẮT |
| 08 | CD1+CD3 | Xuất hoá đơn cho khách quen: MST đã lưu trong sổ khách mà bắt gõ lại | VÒNG | `mobile.html:387-401` (goiY chỉ điền tên); MST có sẵn `js/sm-domain.js:1228` | Gợi-y đặt theo `customers()`: chạm tên → điền TÊN + MST + địa chỉ; chỉ khách lạ mới gõ tay | GẮT |
| 09 | CD1 | Đơn đã xuất hoá đơn vẫn `state:'new'` → badge «chưa xử lý» không hết | MÙ | `js/sm-domain.js:873` (chỉ gán `invoiceId`); badge `mobile.html:213` | `invoiceForOrg` hoàn đơn: nếu `state==='new'` → `picking` (hoặc `done` khi trả ngay) | GẮT |
| 10 | CD3 | «Đặt 2 tấn giao tuần sau» buộc xuất hoá đơn NGAY (trừ kho trước khi giao) | NGƯỢC | chỉ đường `payOrg` `mobile.html:323,360`; `issueInvoice` trừ kho ngay `js/sm-domain.js:611-616` | Chồng lên #01: đơn bán ra có trạng thái «đã nhận — chờ giao», hoá đơn xuất khi giao (nút trong sheet đơn đã có sẵn) | GẮT |
| 11 | CD2 | Đoàn 20 khách phải tự tách 2 cano, điền form 2 lượt, máy không biết là một đoàn | VÒNG | form 1 tài nguyên/lượt `mobile.html:527-533`; `addBooking` 1 bản ghi `js/sm-domain.js:503-518` | Nhập «tổng khách» → máy tự tách theo tài nguyên còn chỗ và gom tên đoàn; mỗi lượt con vẫn là 1 booking (giữ đối soát) | GẮT |
| 12 | CD1+CD2 | Từ hội thoại không tách được sang việc: trả lời xong phải sang màn khác gõ lại tên/khối lượng | VÒNG | sheet hội thoại chỉ trả lời + nhắc nợ `mobile.html:2445-2472` | Nút theo ngữ cảnh trong sheet tin: «Giữ chỗ cho khách này» (CD2) / «Tạo đơn cho khách này» (CD1/CD3) — điền sẵn tên | GẮT |
| 13 | CD3 | Thu mua 3 người = 3 lượt điền form đầy đủ | VÒNG | `mobile.html:637-648`; nói thay gõ cũng «mỗi người một lượt lưu» `:676-685` | Chấp nhận từng người nhưng sau Lưu không xoá form — giữ nguyên người trước làm nền, chỉ đổi tên/CCCD/số kg (địa chỉ thường trùng làng) | NHẸ |
| 14 | CD3 | «Nhập kho mẻ chế biến» là việc hằng ngày nhưng chỉ vào được từ menu «Thêm» | NHẸ | tab giữa CD3 = Thu mua `mobile.html:205-207`; mục nhapkho `mobile.html:888` | Gợi ý cho W6/R1: khi `lots` có nguồn `che-bien` xuất hiện thường xuyên, đề xuất thêm mục tắt «Nhập kho» trên tab Bán (đúng kiểu tab đổi theo ngành) | NHẸ |
| 15 | CD3 | Mã truy xuất đã sinh nhưng không có đường gửi cho khách doanh nghiệp | MÙ | `mobile.html:2254-2265` (chỉ xem); không nút gửi | Nút «Gửi mã này cho khách qua Zalo» (đi qua `replyMessage`, kèm cửa sổ tin P9/D-#4) | NHẸ |
| 16 | CD2 | Chốt 4 điểm không cắt được «điểm × hình thức thanh toán» | NHẸ | `mobile.html:298-303` (chỉ theo điểm); `tinhCa` chỉ theo hình thức `js/sm-ops.js:50-59` | Trong card «Doanh thu các điểm» thêm dòng phụ «trong đó tiền mặt: X» mỗi điểm (dữ liệu đã có trong `payments`) | NHẸ |
| 17 | CD1 | Đơn TikTok `synced:false` không có chỗ nào báo cho hộ | MÙ | seed `js/sm-seed-gialai.js:176-178`; `donSheet`/`viewDon` không đọc `synced` | Dòng đơn thêm nhãn «đang chờ đồng bộ» nhỏ, hết khi `synced` | NHẸ |
| 18 | CD2 | Wizard hỏi từ đầu trong khi seed đã đầy dữ liệu — người xem tinh thấy mâu thuẫn | NHẸ | `js/sm-seed-gialai.js:374-375` (onboarding trống) vs bookings/orders đầy `:305-370` | Ghi chú cho W4: hoặc seed CD2 gác bớt dữ liệu lịch tương lai, hoặc wizard có câu «máy đã thấy mấy dữ liệu cũ, cô chú kiểm lại giúp» (trung thực hơn) | NHẸ |
| 19 | CD1 | `hddt` đang `cho_duyet`, `cts` đang `dang_dang_ky` nhưng vẫn phát hành + truyền hoá đơn bình thường — lệch chốt P1 | NGƯỢC | `js/sm-domain.js:587-626` (`issueInvoice` không kiểm onboarding); seed `js/sm-seed-gialai.js:251-253` | Theo P1: khi `cts` chưa `da_ket_noi` và hoá đơn là HĐĐT chính thức → chặn phát hành với lời thường («chờ chữ ký số — cán bộ CB-02 đang theo, dự kiến N ngày»), đơn vẫn tạo, bán thường không vướng | GẮT |
| 20 | CD1 | «Mở ca/Kết ca» và «Hộp thư/Hội thoại» chỉ tới từ «Thêm» — việc nền ngày phải qua menu tổng | VÒNG | `mobile.html:894` (ketca), `:880-881` (hopthu/hoithoai) | Tab Tiền đã có 2 nút nhanh (`:723-726`) — đủ; gợi ý W6 thêm chấm đỏ lên mục «Thêm» khi có sự kiện mới (đã có badge số — giữ, tô đậm hơn) | NHẸ |

### TOP-8 SỬA TRƯỚC NHẤT (theo thứ tự tiền-tiếc cho hộ)

1. **#02** — chọn hình thức khi thu tiền tại quầy (mỗi ngày sai sổ một lần; sửa ~10 dòng).
2. **#01** — «Tạo đơn bán ra» cho khách gọi điện/đặt trước, API đã có mồi (`donTuTinNhan`, `orderFromRecurring`).
3. **#03** — khớp tay tiền-về với đơn + nút «đã nhận tiền» trong sheet đơn (hộ công nợ 30 ngày sống nhờ đó).
4. **#04** — thả phạm vi ngày đặt chỗ (đoàn 22/08 đang phải ghi giấy — mất khách).
5. **#05** — cọc phải vào dòng tiền (kết ca lệch bằng đúng số cọc mỗi mùa cao điểm).
6. **#06** — bổ sung giấy tờ bảng kê thiếu (đang chặn khoá kỳ mà không cho sửa).
7. **#19** — thực thi chốt P1: chặn phát hành HĐĐT khi chưa CTS (bằng lời nói thường, kèm cán bộ theo).
8. **#12** — nút ngữ cảnh «Giữ chỗ / Tạo đơn cho khách này» từ hội thoại (đưa #11/#08 theo sau vì cùng nền).

### Trả lời thẳng: «app này dùng hằng ngày được chưa, hay mới là bản để đi trình?»

**CHƯA dùng hằng ngày được — đang là bản rất tốt để đi trình.** Cột sống đúng hướng: nhận đơn webhook có kiểm
tồn, thu mua tại vườn có chặn giấy tờ, truy xuất lô tới nông dân, kết ca bắt lý do lệch, trả lời khách tính từ
dữ liệu thật, «Sáng nay cần để ý» mỗi việc một chạm. Nhưng 4 việc RẤT THƯỜNG NGÀY của hộ thật đang đứt hoặc ghi
sai: **thu tiền mặt (#02), nhận cọc (#05), ghi đơn khách gọi điện (#01), khớp tiền chuyển khoản (#03)** — cả bốn
đều kẹt ở chỗ «tiền/đơn đến ngoài kịch bản demo». Sửa xong top-8 (đa số là UI đi trên API đã có) thì chuyển từ
«đẹp khi chấm» sang «dùng được thật»; để còn #07–#17 là độ mượt.

---

## GHI CHÚ SONG SONG (nhìn thấy giữa lúc 8 agent đang sửa)

- `mobile.html` bản tôi đọc đã có `sangNayCard` (D-#11), VIEWS đã trỏ `ketnoi` sang `ON.viewTram`, đã có màn
  `tamdung`, script `sm-onboard.js`/`sm-nen.js` đã gắn — W6/W1 đang làm tới nơi tới chốn. Không thấy chỗ dở dang
  về cú pháp; chỉ lưu ý `js/sm-domain.js` bản tôi đọc đã có `mocVuotNguong`/`chuyenId` (W2 xong phần lớn).
  Đề nghị người verify đếm lại số dòng khi mọi agent nộp.
- `sm-b2g.js`, `sm-seed-b2g.js` chưa thấy lúc tôi đọc (W4/W5 chưa nộp hoặc đang viết) — không ảnh hưởng R2.
- Phát hiện #19 (chưa thực thi chốt P1) có thể đã nằm trong việc W2/W6 đang làm — ghi vào đây để budget verify,
  không phải cáo buộc ai bỏ sót.

Số đứt gãy ghi nhận: 20 (#01–#20).

BUILD-AGENT-DONE R2 20
