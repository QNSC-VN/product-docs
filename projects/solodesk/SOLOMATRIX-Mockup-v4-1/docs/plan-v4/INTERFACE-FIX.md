# HỢP ĐỒNG ĐỢT SỬA (F1–F4) — theo 8 báo cáo review · 20/08/2026

Nguồn lệnh: `out-build/R1..R4`, `out-build/M1..M4`, `out-build/V5-SOAT-CHU.md`.
Quang chốt 20/08: **đặt mình là end user mù công nghệ**. R2 kết luận app «chưa dùng hằng ngày được» vì
4 chỗ đứt trên DÒNG TIỀN — đợt này sửa dứt điểm phần đó trước, phần đẹp-mắt sau.

## 0. Quyền sở hữu file (TUYỆT ĐỐI không đụng file ngoài phần mình)
| Agent | Được GHI |
|---|---|
| F1 | `mobile.html` (Edit từng chỗ — CẤM Write đè) |
| F2 | `js/sm-domain.js` · `js/sm-ops.js` · `js/sm-inbox.js` |
| F3 | `js/sm-core.js` · `sw.js` · `manifest.webmanifest` |
| F4 | `js/sm-onboard.js` · `js/sm-nen.js` · `js/sm-ai.js` |
| — | `js/sm-b2g.js`, `js/sm-seed-b2g.js`, `js/sm-seed-gialai.js`, `b2g.html`, `index.html`, `web.html`: **KHÔNG AI ĐỤNG** đợt này (agent V3 đang giữ; phần b2g để đợt sau) |

## 1. HÀM MỚI F2 phải làm — F1 gọi theo đúng chữ ký này
```js
// js/sm-domain.js
D.thuTien(t, {soTien, hinhThuc, orderId?, ghiChu?})
//   hinhThuc: 'tien-mat' | 'chuyen-khoan' | 'qr' | 'the'  ← BỎ ghi cứng 'QR' (R2 #02)
//   → đẩy vào t.payments {date, point, amount, method: hinhThuc, orderId, ghiChu}
//   → trả {ok, phieu} ; sai tham số trả {ok:false, lyDo}
D.taoDonTay(t, {khach, sdt?, lines:[{sku,qty,price?}], kenh:'goi-dien'|'quay'|'zalo', giaoNgay?, ghiChu?})
//   Đơn khách gọi điện/đặt trước (R2 #01) — dùng lại đường kiểm tồn của checkOrder;
//   → {ok, order} | {ok:false, lyDo} (hết hàng thì nói rõ còn bao nhiêu)
D.khopTienVaoDon(t, paymentId, orderId)   // R2 #03 — gán tiền đã về cho đơn, cập nhật trạng thái đơn
D.tienChuaKhop(t)                          // → mảng payment chưa gắn đơn (cho màn khớp tay)
D.huyDon(t, orderId, lyDo)                 // R4 V9 — BẮT BUỘC lyDo, không có thì {ok:false}
// sm-domain: addBooking phải ghi cọc vào t.payments qua D.thuTien (R2 #05) — cọc là tiền thật
// sm-domain: KHÔNG nối chuỗi ngày ISO vào chuỗi hiển thị (R4, sm-domain.js:302) — bọc F.dmy
```

## 2. Việc CHẶN — chia sẵn cho từng agent (mã theo báo cáo gốc)
**F1 (mobile.html):** R2 #02 UI chọn hình thức thu tiền · R2 #01 nút «Tạo đơn cho khách gọi điện» ·
R2 #03 sheet khớp tiền-đơn + nút «đã nhận tiền» · R4 V9 huỷ đơn hỏi lý do · R3 bỏ số «99,5% sẵn sàng»
(vi phạm P7 — Quang chưa chốt số cam kết) · R3 bỏ hệ số 0,06 «phát hiện tiền nhà» (số bịa) ·
V5 #1/#2 giấu `endpoint`/payload JSON/chữ «webhook» khỏi màn hộ (đưa vào khối «cài đặt nâng cao» đã có mẫu) ·
V5 #9 bug `cqtState === 'đã gửi'` phải là `'sent'` (tag luôn vàng + lộ chữ «sent») ·
R1 #3/#1 xoá nút chết · R1 #7/#8 gộp 2 thẻ cảnh báo trùng trên tab Bán (2 số công nợ khác nhau) ·
R3 dọn dead code `viewKetnoi`/`bindKetnoi` gọi `toggleConnector` đã xoá ·
M1 nút <44px (dùng `--tap`) + tách nút nguy hiểm khỏi nút thường ≥16px + ô tiền `inputmode="numeric"` ·
M2 #1 bỏ `window.scrollTo(0,0)` khi ±món · M2 #13 `--ink3` → `#5F6B6E` (đọc ngoài nắng) ·
M2 #16 `padding-top:env(safe-area-inset-top)` cho header ·
M3 #3/#1/#2 gói chữ to `body.simple` + `.tag` 13px + số tiền trong «Việc cần để ý» 14px đậm ·
M3 #5 «Nạp lại dữ liệu mẫu» hỏi 2 lần · M3 #7 toast ≥6 giây + bấm để đóng · M3 #11 chạm nền KHÔNG đóng sheet ·
M3 #14 kèm chữ cho ☰ 💬 🎤 Aa + `aria-label`.

**F2 (domain/ops/inbox):** 5 hàm mục 1 · cọc vào dòng tiền · ngày ISO bọc `F.dmy` ·
R2 #06 cho sửa bổ sung giấy tờ bảng kê thiếu (đang chặn khoá kỳ mà không cho sửa) ·
R2 #19 thực thi chốt P1: chặn phát hành hoá đơn khi chưa có chữ ký số, **bằng lời nói thường** +
«cán bộ sẽ theo giúp» (KHÔNG chặn câm) · V5 #5 câu «khấu trừ nộp thay» viết lại cho khỏi hiểu thành
app nộp thuế thay (rủi ro N-06).

**F3 (core/sw/manifest):** M2 #6 gọi `SM.drain()` ngay sau `SM.db()` lúc boot — **app đang hứa
«tự đồng bộ khi có mạng» mà không làm** (IV.4) · M2 #10/#11 id sự kiện/hàng đợi phải độc nhất ·
M2 #8 `writeRaw` thất bại → cảnh báo «máy nhớ đầy — dữ liệu chưa lưu được» thay vì im lặng ·
M2 #20 `sw.js` thêm `b2g.html`/`index.html`/`web.html` vào precache + fallback theo pathname ·
M4 nút «tải bản mới» khi service worker có bản mới (đừng bắt gỡ app cài lại) ·
M3 #7 hàm toast (nếu nằm ở core) ≥6 giây + bấm đóng.

**F4 (onboard/nen/ai):** V5 #3 bỏ «Lớp A/B/C» khỏi màn Trợ lý · V5 #4 phí tin nói rõ ràng (đây là
chồng tiền, sai một chữ là khiếu nại) · V5 #6 viết tắt GTGT/TNDN/TNCN phải có chú thích lần đầu ·
V5 #7 «Định tuyến vào sổ»/«đóng sổ kỳ» trên đường nộp thuế 5 bước → lời thường ·
V5 #8 «ngưỡng» → «mốc 1 tỷ» (8 chỗ) · V5 #10 chữ build nội bộ «việc W2/W4» lọt màn ·
M3 #6 «Đã nối» hiện thành cặp «Nối / Ngắt nối» + hỏi trước khi ngắt ·
M3 #4 đường ra khỏi chế độ đơn giản (giữ mục Cài đặt + chỉ đường về) ·
R4 V12 3 câu wizard thiếu phản hồi «đã chọn» · M1 #12 nút «Nói thay gõ» 48px xuống chân giỏ.

## 3. Bộ quy ước bắt buộc (R4 + M1 + M3) — mọi agent theo
- **Tên gọi**: kết nối/Trạm kết nối · «nhà mình» (nghề, sổ) + «cô chú» (người) · «đơn» (không «lượt bán») ·
  «tiền về» · «bảng kê» · «hạn» (nghĩa vụ) / «mốc» (thời điểm) · «Việc cần để ý».
- **Màu tag**: `ok` xong · `warn` để ý vài ngày · `crit` CHỈ khi đã/sắp mất tiền hoặc quá hạn (phải luôn
  bấm được để xử lý) · `br` đang tiến triển bình thường · `gray` chưa có/không áp dụng.
- **Kích thước**: nút ≥44px (nút dùng liên tục ≥48px); 2 nút cùng hàng cách ≥12px, nút nguy hiểm cách ≥16px
  và luôn có bước hỏi lại; chữ nội dung ≥13px, body ≥16px; số tiền quan trọng ≥14px đậm.
- **Định dạng**: tiền `F.d()` / `F.dShort()`, ngày `F.dmy()`/`F.dm()`, giờ `F.hm()`, `%` `F.pct()` —
  cấm tự chế format, cấm nối chuỗi ISO vào câu hiển thị.
- **Hành động khó gỡ**: luôn 1 bước hỏi nêu TÊN đối tượng + hậu quả bằng lời thường.
- **Icon**: mọi nút icon phải kèm ≥1 từ + `aria-label`. Màu chỉ là phụ, luôn kèm chữ.
- **Chữ cho hộ**: cấm `webhook/polling/API/SLA/endpoint/payload/connector/token/Q-0xx/Lớp A-B-C` —
  chỉ được nằm trong khối «cài đặt nâng cao», khối «nguồn màn hình cho người chấm», hoặc comment.

## 4. Luật chung
Không CJK · không viết cứng kết quả (mọi số tính từ kho) · Edit từng chỗ có neo, không Write đè file cũ ·
mọi hàm mới đặt cạnh code cùng loại · xong thì Write `out-build/<ID>-BAO-CAO.md` (làm gì, ở đâu, tự soát
thế nào, còn gì chưa làm — nói thật) + in dòng cuối `BUILD-AGENT-DONE <ID> <số thay đổi>`.
