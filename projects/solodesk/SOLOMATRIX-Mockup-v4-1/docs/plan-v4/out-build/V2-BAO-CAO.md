# V2 — BÁO CÁO BUILD: dọn chữ trong trợ lý `js/sm-ai.js` cho người mù công nghệ

Lăng kính xuyên suốt: **bà Nguyễn Thị Bảy 58 tuổi, đứng quầy, ít chữ** (seed CD1 `chuHo`).
File sở hữu: `js/sm-ai.js` — **chỉ Edit từng chỗ, không Write đè, không đụng file khác**.
Tổng: **23 Edit**, không đổi bất kỳ chữ ký hàm / khoá dữ liệu nào (`SM.ai` export nguyên vẹn:
`KB, SLA, ask, suggestions, genListing, afterHoursReply, escalate, strip, CHUA_DO`).

## 1. Việc 1 — Xoá mã nội bộ khỏi chuỗi HIỂN THỊ

| # | Dòng | Chuỗi cũ | Chuỗi mới |
|---|---|---|---|
| 1 | 116 | `'chưa đo — radar đang hỏi Q-0xx'` | `'chưa đo được'` + comment `/* nguồn: Q-036/Q-037 — radar đang hỏi, chưa có số công bố */` |
| 2 | 59 | `nguon: '… — API-CONTRACT mục Hard limits'` | `'… — mục giới hạn cứng trong tài liệu vận hành của Chương trình'` |
| 3 | 71 | `…tạm tính luỹ kế realtime và nhắc trước mốc…` | `…tạm tính luỹ kế ngay từng ngày và nhắc trước mốc…` |
| 4 | ~332 | `Đang nối N kênh: X kênh có số đo, Y kênh «CHUA_DO». Chưa đo thì nói chưa đo — không hô realtime khi chưa có bằng chứng.` | `Nhà mình đang nối N chỗ. X chỗ app biết rõ dữ liệu mới tới lúc nào, Y chỗ «chưa đo được» — chưa có bằng chứng thì app không nói bừa.` (thêm nhánh Y=0: `…chỗ nào app cũng biết rõ…`) |
| 5 | 338 | `— lần cuối đồng bộ N phút trước` | `— app nhận số mới cách đây N phút` |
| 6 | 315 | `…kênh im quá lâu bị đánh dấu đứt và chờ bước đối soát kiểm tra lại.` | `…chỗ nào im quá lâu thì app đánh dấu đứt và nhắc kiểm tra lại.` |
| 7 | 340 | `Bảng ngân sách độ tươi từng kênh (cơ chế nào, công bố gì) cộng mốc lần đồng bộ cuối…` | `Từng chỗ nối đều ghi sẵn: dữ liệu tới bằng cách nào, app kiểm được tới đâu, cộng mốc lần cuối nhận số mới của chính chỗ đó.` |

**Grep toàn file sau sửa** (`Q-0, radar, webhook, polling, API, SLA, connector, endpoint, payload, idempotency, realtime, đồng bộ`):
còn đúng 8 chỗ, TẤT cả là comment code (dòng 10, 116, 394) hoặc tên biến/khoá dữ liệu
(`ev.payload` d.282, `D.connectors(t)` d.306/322, `SLA` d.398/411/478 — mobile đang render `AI.SLA`,
đổi khoá là vỡ). Không còn chuỗi hiển thị nào chứa mã nội bộ.

**Sửa lỗi thật trong lúc dọn (d.325-328):** đếm "kênh có số đo" cũ tính mọi dòng có `congBo`
— nhưng sm-domain điền `congBo` cho CẢ dòng chưa đo («chưa đo — radar…»), nên kết quả luôn sai
(Y=0, câu «8 chỗ chưa đo» không bao giờ ra). Đổi sang đếm tiền tố `'chưa đo'` — trùng quy ước
`sm-onboard.js:1927` đang dùng, tương thích cả chuỗi cũ của W2 lẫn nhãn mới.

## 2. Việc 2 — đọc lại bằng tai bà Bảy

| # | Dòng | Chuỗi cũ | Chuỗi mới |
|---|---|---|---|
| 8 | 58 | `Nền tảng chuẩn bị số, lập tờ khai nháp…` | `Nền tảng chuẩn bị số liệu, lập tờ khai nháp…` |
| 9 | 58 | `ranh giới trách nhiệm cố ý` | `ranh giới trách nhiệm chủ đích` |
| 10 | 84 | `các cấu phần chồng lấn sẽ tắt hoặc giao lại` | `phần nào trùng nhau sẽ tắt hoặc giao lại` |
| 11 | 211 | `đặt thêm vào đó sẽ bị chặn` | `không đặt thêm được vào khung đó` |
| 12 | 214 | `theo từng tài nguyên và từng khung giờ` | `theo từng chỗ cho thuê và từng khung giờ` |
| 13 | 230 | `theo danh mục mục bắt buộc` | `theo danh mục giấy tờ bắt buộc` |
| 14 | 277 | `Chưa có đơn nào về trong hộp thư — sổ sự kiện đang trống đơn.` | `Chưa có đơn nào và cũng chưa có khoản tiền nào về trong hộp thư của app.` |
| 15 | 278 | (chiTiet rỗng) | `Muốn xem trực tiếp, cô chú mở mục «Hộp thư đến» trong app — tin nào tới thì nằm ngay trong đó.` (đúng tên tab mobile `hopthu`) |
| 16 | 299 | `Sổ hộp thư đến ghi lại từng sự kiện… nguồn nào gửi, giờ nào tới, bản tin nói gì.` | `Hộp thư trong app ghi lại từng tin NGAY KHI nó tới: bên nào gửi, giờ nào tới, tin nói gì.` |
| 17 | 279 | `Đọc sổ hộp thư đến: nơi ghi lại từng sự kiện các kênh đẩy vào…` | `Hộp thư trong app ghi lại từng tin các kênh gửi tới, kèm giờ tới.` |
| 18 | 381 | `Ngoài giờ làm việc — trợ lý trả lời thay, chủ hộ xem lại sáng mai` | `Ngoài giờ làm việc — app soạn sẵn câu trả lời, cô chú đọc rồi bấm gửi, tin mới đi` (câu cũ nói trái với cơ chế N-06: tin KHÔNG tự đi) |
| 19 | 389 | `Trợ lý chỉ báo chỗ trống… vẫn do người quyết.` | `App chỉ báo chỗ trống và giữ tạm. Chốt đơn và nhận tiền vẫn do cô chú quyết.` |

Phần «Tính từ đâu» của các handler thuần số liệu (doanh thu, thuế, tồn kho, công nợ, kênh bán,
máy tính tiền) giữ nguyên — câu đã rõ, không đụng. Nhãn chuyên môn thuế (GTGT, TNCN, biểu tỷ lệ,
kê khai) GIỮ — bà Bảy gặp các chữ này trên giấy tờ thuế, không phải tiếng máy.

## 3. Việc 3 — khi KHÔNG biết phải nói «chưa có»

| # | Dòng | Chuỗi cũ | Chuỗi mới |
|---|---|---|---|
| 20 | 457 | `Câu này chưa có trong bộ nội dung được Chương trình phê duyệt, và cũng không tính được từ dữ liệu của hộ. Em đã chuyển cho cán bộ hỗ trợ.` | `Câu này app chưa có số liệu để trả lời ngay — app không đoán bừa. App đã ghi lại và chuyển cho cán bộ hỗ trợ: cô chú xem phiếu bên dưới, trả lời đầu tiên trong {slaTraLoiDau()}.` |
| 21 | 409-413, 420 | `phanHoiDauTien: '2 giờ'` (viết cứng) | hàm mới `slaTraLoiDau()` lấy từ bảng `SLA.doTre` (hàng «Hỏi nghiệp vụ…»), fallback `'trong ngày làm việc'` — số hiển thị là hàm tính từ kho, đúng luật |

Mọi nhánh rỗng của A-handler đều `return null` → rơi xuống lớp B rồi C (đã có câu «chưa có + chuyển
người + phiếu xem được»); nhánh «không có đơn/tiền» (d.276-280) giờ kèm gợi ý chỗ xem.

## 4. Việc 4 — suggestions bằng lời hộ hỏi

| # | Thay đổi |
|---|---|
| 22 | BỎ `'Kết nối các kênh có ổn không?'` và `'Dữ liệu tươi tới đâu rồi?'` (giọng kỹ thuật) → THÊM `'Có ai chuyển tiền chưa?'`, `'Kênh nào đang trục trặc?'`, `'Bao giờ phải làm hoá đơn?'` (đúng 3 câu đề yêu cầu). 3 câu mới đặt ĐẦU `extra` kèm comment lý do: mobile chỉ render 8 chip (simple mode 4) — đứng sau các câu điều kiện thì có tenant không bao giờ thấy. |

Để nút bấm ra câu trả lời ĐÚNG (suggestion đi nguyên văn qua `ask()`), thêm khoá bắt câu:
- handler đơn-mới: `co ai chuyen tien chua`, `tien ve chua`, `tien ve luc nao` — và **mở rộng handler**
  tìm tin mới nhất trong 2 loại `don-moi` | `tien-ve` (`list()` đã sort mới nhất trước), trả lời
  riêng cho tiền về: giờ tới, số tiền, nội dung «…», mã giao dịch, tình trạng («đã vào sổ thu» /
  «bản trùng theo mã — đã bỏ, không cộng tiền lần hai») — tránh câu hộ hỏi xong trợ lý ngơ;
- handler kênh đứt: `truc trac`, `kenh nao loi`. Lưu ý bẫy: `strip('trục trặc')` → `truc trac`
  (chữ «ặc» bóc dấu thành «ac») — khoá đầu tôi viết `truc tre` là SAI, bắt được khi đọc lại, đã sửa;
- handler máy-tính-tiền: `phai lam hoa don`, `dang ky hoa don` — cũng phục vụ nghiệm thu D-#1
  («hỏi trợ lý "bao giờ phải đăng ký hoá đơn" trả lời kèm "tính từ đâu"»);
- handler dữ liệu tươi: `so moi ve`;
- KB-09 thêm từ khoá `miễn phí phần mềm kế toán`: câu gợi ý «Nhà nước đã cấp miễn phí phần mềm kế
  toán, sao vẫn phải mua thêm?» từ TRƯỚC tới giờ KHÔNG khớp từ khoá nào của KB-09 (rơi lớp C dù
  app có bài) — tiền tồn, nay bấm ra đúng bài.

Mic demo mobile dùng `suggestions(t)[0..2]` = 3 câu base (nguyên vẹn) — không đổi hành vi cũ.

## 5. Việc 5 — afterHoursReply

- `choHo`: `'Trợ lý soạn sẵn trong 1 phút, cô chú đọc rồi tự bấm gửi — tin chỉ đi khi cô chú bấm.'`
  — GIỮ NGUYÊN: đúng cam kết N-06, đã là lời thường, KHÔNG có chữ «SLA». Không câu nào trong file
  dùng chữ «SLA» trước mặt hộ (chỉ nằm trong comment/tên khoá).
- `guiLuc` cũ «trợ lý trả lời thay, chủ hộ xem lại sáng mai» nói TRÁI với N-06 (tin không tự đi)
  → đã sửa (bảng trên, dòng 18). `ranhGioi` → «do cô chú quyết» (dòng 19).

## 6. Tự soát cú pháp bằng cách nào

1. `node --check` **không chạy được** — bị chặn theo quyền sandbox của phiên (báo thật, không lách
   công cụ khác).
2. Phương án thay đúng INTERFACE mục 9: **đọc lại toàn bộ phần file đã sửa** (dòng 110–480 sau
   chỉnh) — soát từng khối: ngoặc `{}()/[]`, dấu phẩy, backtick template (đóng mở `${}` đúng chỗ),
   chuỗi đơn/nhép. Không phát hiện lệch.
3. Grep kiểm: **0 ký tự CJK** (pattern `U+4E00–9FFF, 3040–30FF, AC00–D7AF` — không match);
   grep jargon (mục 1) chỉ còn comment/tên biến.
4. Mô phỏng tay bộ `strip()` cho 13 câu suggestions + 2 câu nghiệm thu PLAN («bao giờ phải đăng ký
   hoá đơn», «kênh nào trục trặc») — mỗi câu đều khớp đúng handler/bài KB như ý (chi tiết mục 4);
   phát hiện và sửa 2 lỗi mô phỏng: khoá `truc tre` sai bóc dấu, từ khoá KB-09 thiếu.

## 7. Còn gì chưa làm được / để ý giúp

- **Không chạy được app thật** (node/Chrome bị chặn quyền) — các sửa đều là chuỗi hiển thị + khối
  logic nhỏ đã đọc lại tay; ai có quyền chạy nên mở tab Trợ lý bấm lần lượt 8 chip + gõ «bao giờ
  phải đăng ký hoá đơn» để nghiệm thu D-#1.
- **File người khác vẫn còn chuỗi «chưa đo — radar đang hỏi Q-0xx»** hiện ra màn: `sm-domain.js:906`
  (helper CHUA_DO riêng của W2, đang sinh chuỗi cũ), `sm-inbox.js` NGUON (`doTuoi: 'nguồn này chưa
  đo — Q-036'…` và cột `endpoint: 'POST /webhooks/…'`), `index.html:358` (fallback literal). Tôi
  không được đụng — **đề nghị W2/W7 dọn tiếp cùng hướng**; bên tôi đã giữ nhãn `SM.ai.CHUA_DO` làm
  mốc quy ước mới ('chưa đo được', tiền tố 'chưa đo' tương thích `sm-onboard.js:1927`).
- `sm-domain.js:1267` gọi `afterHoursReply` và mobile render `guiLuc/than/ranhGioi` — mọi khoá
  trả về giữ nguyên, không vỡ chỗ gọi.

BUILD-AGENT-DONE V2 23
