# R3 — SOÁT TÍNH NĂNG: thừa · thiếu · sai trọng số

Ngày 20/08/2026 · Người giữ phạm vi sản phẩm · KHÔNG sửa code, chỉ ghi file này.
Nguồn chuẩn đã đọc đủ: `opc-radar/CHARTER.md` (3 trục khoá) · `REQUIREMENTS.md` (R-A1/A2/A3) ·
`ANTI-SCOPE.md` (N-01…N-09) · `THUMOI.txt` (mục II, III, IV, V) · `CHOT-P1-P13.md` · `INTERFACE-V4.md`.

Code đã quét: `sm-domain.js` (đọc toàn văn) · `sm-ops.js` (toàn văn) · `sm-quyen.js` (toàn văn) ·
`sm-inbox.js` (toàn văn) · `sm-program.js` (phần lớn) · `sm-onboard.js` (mục lục + danhMucCho + hàm chính) ·
`sm-ai.js` (KB, SLA, ask) · `sm-b2g.js` (cấu trúc khối) · `sm-nen.js` (mục lục) ·
`mobile.html` (VIEWS 33 màn, viewBan/viewTien/viewThem/viewHoso/viewDulieu/viewKetnoi, sangNayCard, sheetNhacNo) ·
cấu trúc `index.html`, `web.html`, `b2g.html`.

**Trạng thái 4 file đang sửa song song lúc soát** (mốc giờ ghi file): `mobile.html` 18:26 ·
`sm-ai.js` 18:25 · `sm-seed-b2g.js` 18:26 · `sm-onboard.js` 14:03 — có dấu hiệu agent W6/W7/W4/V1
đang ghi trong lúc tôi đọc. Hệ quả: mọi số dòng nêu dưới đây là vị trí TẠI THỜI ĐIỂM đọc và có thể lệch
sau khi agent kia ghi tiếp. Tôi không chạy được `node --check` (lệnh cần quyền, sandbox từ chối) —
không kết luận gì về cú pháp file đang dở. Các phát hiện nêu dưới đây đều neo vào tên hàm/chuỗi hiển thị
(grep lại được) chứ không chỉ số dòng.

---

## 1. BẢNG KIỂM KÊ TÍNH NĂNG

Cột «Trục»: A1 kết nối · A2 trong tay · A3 24/7-realtime · CT tầng Chương trình (hội đồng dùng, hộ không) ·
BV nghiệp vụ vận hành hộ (đỡ lõi, không tự thành trục). Cột «Neo»: R-xx = REQUIREMENTS · IV.x/III/V.x = THUMOI ·
N-xx = ANTI-SCOPE · P-xx = CHOT · «tự đề xuất» = không có chữ nào đòi, đội tự nghĩ ra.

| # | Tính năng | Màn | Trục | Neo yêu cầu | Hộ dùng bao lâu 1 lần | Verdict |
|---|---|---|---|---|---|---|
| 1 | Bán tại quầy: giỏ, thu tiền QR, xuất hoá đơn | Bán | A2 | IV.4 bán hàng trọn trên điện thoại | nhiều lần/ngày | LÕI |
| 2 | Nói thay gõ (bóc bản thoại, chạm xác nhận từng dòng) | Bán + sm-nen §4 | A2 | IV.4 «giọng nói tiếng Việt» + R-A2-05 | mỗi ca bán | LÕI |
| 3 | Hoá đơn cho khách tổ chức (có MST) | sheet orgInvoice | A1 | III CD1/CD2/CD3 — động lực chuyển đổi | vài lần/tuần | LÕI |
| 4 | «Sáng nay cần để ý» (gom hạn + sự kiện + hàng đợi, 1 chạm đi thẳng) | đầu Bán | A2/A3 | R-A2-03 + IV.5 + D-#11 | mỗi sáng | LÕI |
| 5 | «Việc cần để ý» — deadlines (kê khai, nợ quá hạn, hoá đơn kẹt, ATTP) | Bán/Tiền | A3 | IV.5 cảnh báo trước mốc | mỗi ngày | LÕI |
| 6 | Thu hôm nay + hợp nhất doanh thu nhiều điểm QR realtime | Bán | A3 | III CD2 «hợp nhất về một màn hình» | mỗi ngày | LÕI |
| 7 | Canh ngưỡng 1 tỷ + đồng hồ 30 ngày đăng ký HĐĐT | Bán/Tiền/Trạm | A1 | R-A1-02 + Q-001 + P4 | khi gần ngưỡng | LÕI |
| 8 | Hoá đơn gần nhất + trạng thái truyền CQT | Bán | A1 | IV.1 | mỗi ngày | LÕI |
| 9 | Bán mất mạng: lập hoá đơn xếp hàng đợi, tự gửi khi có mạng | Bán | A2 | IV.4 «tối thiểu nghiệp vụ bán hàng hoạt động khi mất kết nối» | khi mất mạng | LÕI |
| 10 | Thẻ giải thích «Đơn từ kênh khác đến bằng cách nào» | cuối Bán | — (giải thích cơ chế) | feedback mockup lộ đường đi | người chấm 1 lần; hộ không bao giờ cần | TRÌNH DIỄN |
| 11 | Xử lý đơn 6 trạng thái + vận đơn + COD | Đơn | A1 | IV.4 «theo dõi đơn và vận chuyển» | mỗi ngày | LÕI |
| 12 | Chọn hãng vận chuyển + khuyến nghị hàng lạnh + mã vận đơn | Đơn | A1 | R-A1-07 + III CD1 «phương án phù hợp hàng khô, hàng lạnh» | mỗi đơn sàn | LÕI |
| 13 | Đơn định kỳ B2B từ mẫu | Đơn | BV | III CD1 «quản lý đơn hàng định kỳ» | theo chu kỳ giao | ĐỠ |
| 14 | Tồn kho đa kênh MỘT con số + chặn nhận đơn quá tồn | Kho/Đơn | A1 | III CD1 «không nhận đơn quá lượng hàng» | tự động mỗi đơn | LÕI |
| 15 | Tồn theo lô + chuỗi truy xuất hoá đơn→lô→bảng kê→nông dân | Kho/Mua | BV | III CD3 «tồn kho theo lô phục vụ truy xuất» | khi cần chứng minh | LÕI (CD3) |
| 16 | Bảng kê thu mua + kiểm đủ giấy tờ + chặn khoá kỳ khi thiếu | Thu mua | BV | III CD3 «chứng từ đầu vào thu mua nông dân nhỏ lẻ» | mỗi chuyến thu mua | LÕI (CD3) |
| 17 | Đặt chỗ theo tài nguyên: khung giờ, giới hạn chỗ, chống trùng | Lịch/Đặt chỗ | BV | III CD2 «tránh trùng đặt» | mỗi ngày (CD2) | LÕI (CD2) |
| 18 | Lịch tập trung 7 ngày mọi tài nguyên một màn | Lịch | BV | III CD2 «lịch phòng và lịch thuyền tập trung» | mỗi ngày (CD2) | LÕI (CD2) |
| 19 | Doanh thu mùa vụ (cao/thấp điểm, hệ số lệch) | số liệu trợ lý | BV | III CD2 «kê khai thuế doanh thu mùa vụ chênh lệch lớn» | mỗi kỳ | ĐỠ |
| 20 | Nhập kho 4 nguồn + kiểm kê bắt lý do lệch | Nhập kho | BV | tự đề xuất (soát 7 vai) | vài lần/tuần | ĐỠ |
| 21 | Huỷ lô hỏng + ước thiệt hại + gợi ý ghi chi | Huỷ hỏng | BV | tự đề xuất | thỉnh thoảng | ĐỠ |
| 22 | Danh mục hàng hoá + lịch sử giá để giải trình | Hàng hoá | BV | tự đề xuất | thỉnh thoảng | ĐỠ |
| 23 | Trả hàng, đổi hàng | Trả hàng | BV | tự đề xuất | thỉnh thoảng | ĐỠ |
| 24 | Mã truy xuất lô cho BÊN MUA quét (ẩn nông dân, giá mua) | Truy xuất | BV | III CD1/CD3 «truy xuất nguồn gốc cho khách tổ chức» + IV.8 PDPL | khi khách tổ chức hỏi | ĐỠ |
| 25 | Thuế tạm tính realtime tách nhóm ngành + định tuyến sổ S1a/S2a | Tiền | A3 | IV.5 + R-A1-01 + TT 152/2025 | nhìn mỗi ngày, dùng mỗi kỳ | LÕI |
| 26 | Đường kê khai 5 bước, bước 4 là RANH GIỚI (hộ tự bấm nộp) | Tiền | A1 | R-A1-01 + N-06 | mỗi quý | LÕI |
| 27 | Thuế sàn khấu trừ nộp thay — đối chiếu, không khai lại | Tiền | A1 | R-A1-06 + Q-019 (NĐ 117/2025 Đ11 k4) | mỗi kỳ | LÕI |
| 28 | Mở ca / kết ca / đếm tiền / lệch phải ghi lý do | Kết ca | BV | tự đề xuất (vai bà Bảy đếm tiền tối) | mỗi tối | ĐỠ |
| 29 | Công nợ: trả một phần, nợ khó đòi, đối soát B2B trừ chiết khấu | Công nợ | BV | III CD1 «công nợ khách nhà hàng — khách sạn» | mỗi tuần | LÕI (CD1) |
| 30 | Nhắc nợ qua tin nhắn + CỬA SỔ TIN Zalo hiện phí trước nút gửi | sheetNhacNo | A2/A1 | R-A1-08 + Q-005 + D-#4 + N-09 | mỗi tuần | ĐỠ |
| 31 | Khoản chi + cảnh báo thiếu chứng từ + trộn ví cá nhân | Khoản chi | BV | tự đề xuất (chuẩn bị lên doanh nghiệp) | mỗi ngày | ĐỠ |
| 32 | Đơn treo bị đổi giá — báo để hộ quyết | Đổi giá | BV | tự đề xuất (câu hỏi hội đồng) | khi đổi giá | ĐỠ |
| 33 | Hoá đơn điều chỉnh / thay thế / huỷ (không sửa đè) | Hoá đơn DC | A1 | IV.1 + nghiệp vụ hoá đơn điện tử — hình thức điều chỉnh là «tự đề xuất» | khi sai hoá đơn | LÕI |
| 34 | Chống phát hành hoá đơn trùng (vân tay giỏ + hàng đợi id) | trong luồng bán + Hộp thư | A3 | R-A3-07 idempotency + Q-006 at-least-once | tự động | LÕI |
| 35 | Chuyển chế độ tính HKD ↔ DN (đổi cách tính thuế) | Tiền | — | III «cho doanh nghiệp sau chuyển đổi» — nhưng chỉ là đổi công thức tính thử | hiếm (1 lần lúc so sánh) | TRÌNH DIỄN |
| 36 | «Tách tiền kinh doanh và tiền nhà» — hệ số 0,06 viết cứng | Tiền | — | tự đề xuất | hiếm | THỪA (dạng hiện tại) |
| 37 | «Chi phí của tôi» — lộ trình chi phí 3 năm | Chi phí | CT | IV.9 «biết trước toàn bộ lộ trình chi phí» | 1 lần khi vào chương trình | TRÌNH DIỄN (đúng nội dung, sai vị trí) |
| 38 | Trợ lý 3 lớp A/B/C + «tính từ đâu» + KB có nhãn phê duyệt | Trợ lý | A3 | IV.5 + R-A3-03 + R-A3-04 | mỗi ngày | LÕI |
| 39 | Trả lời khách ngoài giờ + soạn nội dung đăng bán | Trợ lý/Hội thoại | A3 | IV.5 cuối đoạn + III CD2 «trả lời khách ngoài giờ» | mỗi tối | LÕI |
| 40 | Lớp C chuyển người thật + đồng hồ SLA người | Trợ lý/Hồ sơ | A3 | IV.5 «thời gian phản hồi kênh có con người» | khi trợ lý chịu thua | LÕI |
| 41 | Card «Cam kết dịch vụ» hiện «99,5% sẵn sàng» trên tab Trợ lý | Trợ lý | CT (hồ sơ tỉnh) | KHÔNG CÓ — P7 đã chốt treo con số này cho Quang, mockup không bịa | hộ không bao giờ cần | THỪA + vi phạm P7 |
| 42 | Trợ lý chạy nền: việc đang canh, ai đánh thức, đếm bản trùng | Trợ lý nền | A3 | R-A3-01 «làm việc khi chủ ngủ» | thỉnh thoảng xem | ĐỠ |
| 43 | Hộp thư đến: sổ sự kiện, payload thô, «tạo ra cái gì» | Hộp thư | A1/A3 | R-A3-07 + feedback mockup-phai-lo-duong-di | hộ thỉnh thoảng; người chấm nhiều | LÕI |
| 44 | 14 kịch bản giả lập bấm được (đơn sàn, tiền trùng, kênh đứt…) | Hộp thư | — (công cụ demo) | tự đề xuất để người chấm tự bấm | chỉ người chấm | TRÌNH DIỄN |
| 45 | Chặn bản trùng theo id — «không cộng tiền lần hai» | Hộp thư | A3 | R-A3-02 + Q-006 | tự động | LÕI |
| 46 | Hội thoại khách + gợi ý trả lời tính từ dữ liệu + tạo đơn từ tin nhắn | Hội thoại | A2/A1 | III CD2 «nhận khách qua mạng xã hội» | mỗi ngày | ĐỠ |
| 47 | Khách hàng gom từ 4 nguồn (hoá đơn/đơn/đặt/công nợ) | Khách hàng | BV | tự đề xuất | thỉnh thoảng tra | ĐỠ |
| 48 | Wizard OB-1 kích hoạt: quét suất QR, câu 0 «ai dùng», đổi người | OB Kích hoạt | A2 | P2/P3 + R-A2-07 (TTFV) | 1 lần | LÕI |
| 49 | OB-2 nhận diện hộ: 5 câu nói thường, đọc to 🔊, ảnh giấy tờ nằm trong máy của hộ (P12) | OB Nhận diện | A2 | kim chỉ nam 20/08 mù công nghệ + P12 | 1 lần | LÕI |
| 50 | OB-3 danh mục 3 nhóm BẮT BUỘC (chỉ từ số thật) / NÊN CÓ / ĐỂ SAU | OB Danh mục | A1/A2 | B.7 + N-08 (TIEN_ICH không vào MUST) + P1 | 1 lần | LÕI |
| 51 | OB-4 luồng từng connector 3 kiểu (tự làm / đăng ký chờ duyệt / cán bộ) | OB Connector | A1 | B.8 + P1 «dùng trước, nối sau» | 1 lần mỗi kênh | LÕI |
| 52 | OB-5 Trạm dữ liệu: trạng thái + độ tươi công bố + cảnh báo đứt | Trạm (ketnoi) | A1/A3 | B.9 + D-#2/#5 + R-A3-02 + R-A3-05 | ngắm mỗi ngày | LÕI |
| 53 | Máy trạng thái kết nối 7 mức + xác nhận tay cán bộ (không nút «Nối» giả) | Toàn app | A1 | B.2/B.14 + W0 phản biện | tự động | LÕI |
| 54 | «Tạm dừng dùng OPC»: 4 bước, confirm 2 lần, gõ XOÁ | Tạm dừng | A2 | P13 «vào dễ thì ra cũng phải dễ» | hiếm (may là hiếm) | ĐỠ |
| 55 | Phân quyền 5 vai + bảng «ai làm được gì» | Phân quyền | A2 | tự đề xuất (hộ 3 thế hệ dùng chung) | 1 lần cấu hình | ĐỠ |
| 56 | Thiết bị + khôi phục + «mất máy không mất dữ liệu» (số đếm thật) | Thiết bị | A2 | tự đề xuất (câu hỏi hội đồng chắc chắn) | khi mất máy / khi nghi | ĐỠ |
| 57 | Chế độ đơn giản (chữ lớn, 3 tab) cho người lớn tuổi đứng quầy | Cài đặt | A2 | tự đề xuất + R-A2-06 «một tay» | khi bố mẹ đứng quầy | ĐỠ |
| 58 | Hồ sơ hộ + người hỗ trợ + 3 cửa ghi nhận + «Chương trình nhận gì, KHÔNG nhận gì» | Hồ sơ | CT + IV.8 | IV.6 + IV.7 + IV.8 PDPL | 1 lần, tra khi cần | ĐỠ |
| 59 | «Dữ liệu của tôi»: xuất toàn bộ CSV/JSON, không khoá | Dữ liệu | A1 | IV.3 «không khóa dữ liệu… chuyển nhà cung cấp khác» | khi cần rời đi | LÕI |
| 60 | Nhật ký thao tác không xoá được (ai sửa gì) | Nhật ký | BV | tự đề xuất + IV.8 tinh thần PDPL | tra khi tranh cãi | ĐỠ |
| 61 | Bảng điều khiển Chương trình: 3 cửa thanh toán theo kích hoạt thật | b2g | CT | IV.7 + II.3 «không thanh toán theo số tài khoản» | cán bộ định kỳ | TRÌNH DIỄN (đúng chỗ) |
| 62 | Sổ trực onboarding 6 khối + «Việc hôm nay của cán bộ» + ghi kết quả gọi | b2g | CT | IV.6 + P6 + W9 C4 | cán bộ mỗi ngày | TRÌNH DIỄN (đúng chỗ) |
| 63 | Suất QR GL26-XXXX-XXXX sinh + tra trạng thái | b2g | CT | P3 | mỗi khóa | ĐỠ |
| 64 | Định mức nhân sự tại chỗ + phân bố phút-tới-việc-đầu | b2g/index | CT | IV.6 + V.3 + R-A2-07 | hồ sơ + vận hành | TRÌNH DIỄN (đúng chỗ) |
| 65 | «Căn cứ hành vi» 4 con số kèm nhãn nguồn 2021 n=999 | b2g | CT | D-#12 + Q-004 | hồ sơ | TRÌNH DIỄN |
| 66 | Bảng giá 3 cột + tầng miễn phí quốc gia để 0đ | index/Chi phí | CT | IV.9 + II.2 | hồ sơ | TRÌNH DIỆN (đúng chỗ) |
| 67 | Bảng đối chiếu KiotViet 270k/330k/490k + 3 thứ kèm 0đ | index | CT | Q-007 + D-#9 + N-01 | hồ sơ | TRÌNH DIỆN (đúng chỗ) |
| 68 | Bản đồ chồng lấn với nền miễn phí quốc gia (tắt/giao/giữ) | index | CT | IV.2 | hồ sơ | TRÌNH DIỄN (đúng chỗ) |
| 69 | 8 nghề nhân rộng + chỉ số «sống» V.5 + cohort 12-24 tháng | index | CT | V.1 + V.5 + II.3 | hồ sơ | TRÌNH DIỄN (đúng chỗ) |
| 70 | web.html — góc kế toán chia sẻ + cán bộ địa bàn | web | CT | IV.6 | cán bộ | ĐỠ |

Ghi chú bảng: bảng nháp lần đầu có 2 chỗ tôi gõ lẫn ký tự nước ngoài ở dòng 33 và 49 — đã sửa sạch
trong bản này (tự grep kiểm CJK trước khi chốt, xem cuối file).

---

## 2. THỪA VÀ TRÌNH DIỄN — ĐÍCH DANH

### 2.1. Nên BỎ hẳn khỏi bản chạy thật (2 mục)

**#41 — Con số «99,5% sẵn sàng»** (`sm-ai.js` SLA.uptime.camKet, hiển thị `mobile.html` viewAi,
chuỗi «Cam kết dịch vụ … % sẵn sàng»). P7 chốt: con số uptime cam kết GIỮ TREO cho Quang, mockup
KHÔNG bịa. Đây là bịa đúng nghĩa: hộ mở tab Trợ lý là thấy một cam kết availability mà chưa ai
có quyền hứa. Hội đồng chấm lập biên bản demo + hồ sơ nói hai số khác nhau là chết một câu hỏi lớn.
**Hành động:** bỏ dòng uptime khỏi card Trợ lý; muốn giữ khung «Cam kết dịch vụ» thì thay con số
bằng chỗ trống «[Quang chốt]» đúng chữ P7. Phần SLA người (15 phút/2 giờ) ĐƯỢC PHEP giữ nguyên.

**#36 — «Tách tiền kinh doanh và tiền nhà» với hệ số 0,06** (`viewTien`, phép nhân
`payments * 0.06` viết cứng, không nhãn nguồn). Nội dung cảnh báo (tách bạch tài sản khi lên DN)
có giá trị thật, nhưng con số «phát hiện khoảng X đồng» là bịa — vi phạm cả luật «mọi số là hàm
tính từ kho» lẫn R-A3-04 «mọi con số truy được về nguồn». Hội đồng hỏi «sao biết 6%?» — không có
câu trả lời. **Hành động:** hoặc tính từ dữ liệu thật (khoản chi loại «điện nước/mặt bằng» đã có
trong LOAI_CHI) hoặc bỏ con số, giữ câu cảnh báo định tính + nhãn «tự đề xuất».

### 2.2. Giữ nhưng CHUYỂN CHẾ ĐỘ DEMO / chuyển chỗ (4 mục)

**#44 — 14 kịch bản giả lập trong Hộp thư đến.** Công cụ tốt cho phiên đối thoại (người chấm tự bấm
thấy webhook chảy vào) nhưng hộ thật không nên có nút «Khách đặt VƯỢT số hàng còn lại» — bấm nhầm
là sinh dữ liệu rác trong sổ thật của mình. **Hành động:** gom các nút này vào một khối «Thử nghiệm
(bản demo)» chỉ hiện khi bật cờ demo (biến chế độ đã có sẵn `SM.mode` hoặc cờ trong `smv3:ui`);
bản chạy thật chỉ hiện sự kiện thật.

**#10 — Thẻ «Đơn từ kênh khác đến bằng cách nào»** cố định trên màn Bán. Mỗi lần hộ mở app bán
hàng đều đọc lại một bài giải thích cơ chế — người mù công nghệ không cần hiểu webhook, chỉ cần
đơn tự vào. **Hành động:** chỉ hiện khi có sự kiện chưa đọc trong Hộp thư (đã có số đếm), hoặc dời
vào trong màn Hộp thư đến. Nội dung thẻ giữ nguyên — nó là vũ khí demo tốt, chỉ sai chỗ đứng.

**#35 — Nút chuyển chế độ HKD ↔ DN.** Chuyển đổi pháp lý là thủ tục tại cơ quan đăng ký kinh doanh;
nút này chỉ đổi công thức tính thuế `t.regime` trong kho. Nếu demo cho hộ thấy, nguy cơ hiểu
«app cho mình thành công ty». **Hành động:** giữ (hội đồng cần thấy hai chế độ — III «cho doanh
nghiệp sau chuyển đổi») nhưng đổi nhãn nút thành «Xem thử nếu lên doanh nghiệp thì thuế tính sao»
+ dòng nhỏ «chuyển đổi thật làm tại cơ quan đăng ký — app chỉ tính thử».

**#37 — «Chi phí của tôi» lộ trình 3 năm** nằm trong menu «Tiền và sổ sách» của HỘ. Nội dung đúng
IV.9 nhưng hộ không mở mục này hằng ngày — nó là tài liệu tham gia chương trình. **Hành động:**
dời vào nhóm «Hệ thống và dữ liệu» cạnh «Hồ sơ hộ», hoặc vào màn Hồ sơ; để nhóm Tiền cho việc
động tiền hằng ngày.

### 2.3. Dead code phải dọn (1 mục — dành W6)

`viewKetnoi` + `bindKetnoi` cũ còn nguyên trong `mobile.html` (đoạn quanh dòng 939-968 lúc tôi đọc),
`bindKetnoi` vẫn gọi `D.toggleConnector` — hàm mà W2 đã XOÁ khỏi sm-domain.js theo INTERFACE mục 2.
Màn này không còn đăng ký trong `VIEWS` (đã thay bằng `ON.viewTram`) nên hộ không thấy, nhưng nếu
ai renders lại hoặc gọi nhầm sẽ văng lỗi runtime. INTERFACE mục 7(7) đã giao W6 thay mọi chỗ gọi
`toggleConnector` — ghi lại đây để W6/W7 đối chiếu: hiện còn đúng MỘT chỗ gọi, trong dead code này.

### 2.4. Không có gì neo được nhưng đã thấy và THA (ghi để sau)

Không có mục nào khác rơi vào «THỪA thật sự». Danh mục 12 connector gọn (đã gộp shipper/booking),
menu Thêm đã chia nhóm và ẩn theo ngành — dấu hiệu v3 «22 mục phẳng là bãi rác» đã được sửa.
Khen có bằng chứng: `danhMucCho` sinh nhóm BẮT BUỘC chỉ từ số bán thật + luật (vuotLuc/thuế sàn),
không từ câu hỏi đoán — đúng N-08.

---

## 3. THIẾU GÌ NGHIỆP VỤ THẬT CẦN

Xếp theo «mất bao nhiêu điểm nếu hội đồng hỏi mà không có» (cao nhất trước). Đối chiếu REQUIREMENTS
(cột v2 đã cũ — tôi đối chiếu lại theo hiện trạng v4) + THUMOI mục IV.

| # | Thiếu | Mất điểm nếu hỏi | Neo | Đề xuất |
|---|---|---|---|---|
| 1 | **Connector «ứng dụng giao đồ ăn» cho ngành đồ ăn - đồ uống.** IV.3 đích danh «riêng ngành đồ ăn - đồ uống tối thiểu 01 ứng dụng giao đồ ăn». Hiện `food` chỉ là kênh đơn (CHANNELS) + nguồn sự kiện trong sm-inbox, KHÔNG có connector riêng trong 12 connector, `connectorSummary` không đếp nhóm này — đối chiếu từng dòng IV.3 sẽ thiếu ngay câu này | NHIỀU — IV.3 là mục ràng buộc, hội đồng đối chiếu dòng-by-dòng | IV.3 | Thêm connector `food` (nhóm «App giao đồ ăn», chỉ hiện ngành ĐAĐồ) — W2/W1 nâng cấp nhỏ theo bảng C.15 nhãn CHUA_DO(Q-042) |
| 2 | **Chữ «tối thiểu 02 nền tảng đặt phòng» (IV.3 ngành du lịch).** Connector `booking` đại diện nhóm, `toiThieu` nhóm = 1 connector. Về cấu trúc gộp là hợp lý (C.0), nhưng bảng Danh mục tối thiểu đang in «cần tối thiểu 1» — dễ bị đọc thành «chỉ cần 1 nền tảng», trái chữ IV.3 «tối thiểu 02 nền tảng» | TRUNG BÌNH — câu hỏi lần đầu mở màn b2g/Trạm | IV.3 + C.0 | Không thêm connector; sửa NHÃN nhóm thành «1 đầu nối đại diện Booking/Agoda/Traveloka — tỉnh đòi tối thiểu 2 nền tảng (IV.3)» |
| 3 | **Kênh vào KHÔNG cần cài app** (R-A2-02 «kênh trước, app sau»). Mọi cảnh báo/tin nhắc hiện chỉ sống trong app + hộp thư in-app (P9 đúng N-09); chưa có một kịch bản/màn nào cho thấy hộ chưa cài app vẫn nhận được gì qua Zalo OA (ví dụ: chủ hộ nhận cảnh báo hạn kê khai bằng tin Tư vấn, bấm vào mới mở web) | TRUNG BÌNH — CHARTER A2 xếp đây là MUST («bắt cài app là vách chuyển đổi») | R-A2-01/02/03 + Q-005 | Thêm 1 kịch bản hộp thư «chủ hộ chưa mở app — tin Zalo đẩy ra ngoài» + 1 dòng giải thích ở Trạm; đừng xây luồng thật (mockup đủ) |
| 4 | **«Chuẩn kết nối» báo cáo định kỳ cho bảng điều khiển Chương trình** (IV.8: «theo chuẩn kết nối được thống nhất»). programBoard có số liệu nhưng chưa có bản mô tả định dạng xuất (API/file) mà chương trình sẽ nhận | ÍT — câu hỏi kỹ thuật của Tổ công tác | IV.8 | 1 khối nhỏ ở index.html: bảng mô tả các trường tổng hợp + tần suất — nửa ngày công |
| 5 | **Độ tươi phần lớn còn «chưa đo»** (Q-036/037/042/045). Không phải thiếu tính năng — R-A3-04 bắt nói «chưa có số», app đã làm đúng (nhãn CHUA_DO). Ghi lại để hồ sơ đừng tự hứa «realtime toàn bộ»: chỉ TIỀN VỀ có số công bố (giây-phút, Q-006) | KHÔNG MẤT nếu nói thật; MẤT NẶNG nếu hồ sơ nói «toàn bộ realtime» | R-A3-02 | Giữ nguyên nhãn; hồ sơ index nên có 1 câu «hiện chỉ tiền về là đo được, còn lại đang đo» |

Đã kiểm các mục hay bị thiếu NHƯNG ĐÃ CÓ (kê để ai soát lại khỏi làm trùng): giọng nói VN (IV.4) — có
sm-nen §4; bán offline tự đồng bộ (IV.4) — có hàng đợi + netbar; cảnh báo trước mốc (IV.5) — deadlines
+ Sáng nay; tạo nội dung đăng bán (IV.5) — genListing; hoá đơn khách đoàn tại chỗ (CD2) — orgInvoiceSheet;
hồ sơ ATTP/nhãn mác (CD1) — compliance + KB-06 + deadlines ATTP; «hỏi gì là có» trên dữ liệu hộ (IV.5a) —
lớp A; SLA kênh người (IV.5) — có (P7 cho phép); cầm tay chỉ việc (IV.6) — Hồ sơ + định mức + Sổ trực;
thanh toán theo kích hoạt (IV.7) — 3 cửa; dữ liệu thuộc hộ (IV.8) — Dữ liệu của tôi + khối «KHÔNG nhận»;
giá 3 cột (IV.9) — có; TTFV/activation (R-A2-07) — CD3 viecDauTien + b2g định mức phút.

---

## 4. SAI TRỌNG SỐ — tính năng phụ đứng to hơn tính năng chính

| # | Chỗ | Sai thế nào | Đề xuất đảo |
|---|---|---|---|
| 1 | Tab **Trợ lý** của HỘ mang card «Cam kết dịch vụ» (SLA đầy đủ + uptime) | Cam kết B2B nằm trên mặt hàng của hộ; hộ cần biết «gọi ai, bao lâu có người» chứ không cần bảng 4 mức độ trễ | Card SLA đầy đủ dời sang index.html (hồ sơ); tab Trợ lý chỉ giữ 1 dòng: «Gọi cán bộ: 15 phút nếu đang chặn bán» |
| 2 | Màn **Bán** dựng thẻ giải thích cơ chế (#10) cố định | Chỗ đẹp nhất của màn bán (cuối dải, nhưng vẫn quấy mỗi lần mở) cho nội dung 0 lần dùng | Chỉ hiện khi có sự kiện mới; đã nêu mục 2.2 |
| 3 | Menu **Thêm** nhóm «Tiền và sổ sách» chứa «Chi phí của tôi» (lộ trình 3 năm) cạnh Công nợ/Kết ca | Mục dùng 1 lần trộn cùng mục dùng mỗi ngày | Dời sang nhóm Hệ thống (đã nêu 2.2); nhóm Tiền chỉ còn việc động tiền |
| 4 | Badge trên **tab Tiền** = tổng mọi cảnh báo `deadlines` todo (kể cả «N đơn chưa xử lý») | Cảnh báo ĐƠN chưa xử lý đổ về tab Tiền trong khi việc xử lý ở tab Đơn — hộ bấm Tiền tìm mãi không thấy đơn | Badge tab Tiền chỉ đếm loại `thue`/`no`/`hoadon`; badge tab Đơn đã đếm đơn đúng rồi |
| 5 | Menu **Thêm» nhóm «Hệ thống»: «Nhật ký thao tác» (tra cứu hiếm) đứng trước «Trợ lý chạy nền» (câu chuyện bán hàng A3 «app làm gì lúc tôi ngủ») | Mục kể được chuyện giá trị nằm dưới mục khô khan | Đưa «Trợ lý chạy nền» lên đầu nhóm Hệ thống; nặng về niềm tin của hộ |
| 6 | Bảng **Danh mục tối thiểu** in «cần tối thiểu 1» cho nhóm đặt phòng | Trọng số ngược với IV.3 (tối thiểu 2 nền) — nhỏ hơn đầu bài tỉnh | Sửa nhãn (đã nêu mục 3 dòng 2) |

Nhìn tổng thể trọng số đang TỐT ở chỗ quan trọng nhất: màn Bán mở bằng Sáng nay cần để ý → cảnh báo →
tiền hôm nay → bán tại quầy (đúng nhịp một buổi sáng của hộ); wizard nằm sau otp QR đúng kiểu «dùng
trước nối sau» P1; b2g mở bằng «Việc hôm nay của cán bộ». Sáu điểm trên là vết còn lại, không phải bệnh.

---

## 5. RỦI RO HỨA QUÁ TAY — rà theo N-06 / N-07

Kết luận chung trước: **ranh giới pháp lý đang được xử ĐẸP.** Bước 4/5 đường kê khai ghi rõ «người
chịu trách nhiệm tự bấm nộp» + «Nền tảng chỉ lưu mã biên nhận do hộ nhập. Không tự nộp thay hộ»
(đúng N-06, đúng KB-05); thuế sàn chỉ ĐỐI CHIẾU số payload, không khai thay; cọc no-show là HỘ giữ,
app ghi nhận; phí tin Zalo 55đ/165đ hiện TRƯỚC nút gửi kèm nhãn Q-005 (không hứa nhắn miễn phí);
KB lớp B toàn `pheDuyet:false` hiện nhãn vàng (R-A3-04 đạt); «không khóa dữ liệu» đúng IV.3.
Bốn chỗ còn rủi ro, theo thứ tự nguy hiểm:

| # | Chỗ | Nguy cơ | Hành động |
|---|---|---|---|
| 1 | «99,5% sẵn sàng» (đã nêu 2.1) | Cam kết uptime không ai có quyền hứa — P7 treo; nếu hồ sơ tỉnh nói số khác là tự mâu thuẫn trước hội đồng | Bỏ con số / thay chỗ trống «[Quang chốt]» |
| 2 | Hệ số 0,06 «tiền nhà» (đã nêu 2.1) | «Phát hiện khoảng X» — ngụ ý máy ĐO được trong khi là hệ số bịa; hội đồng hỏi cách đo là cụt | Bỏ con số hoặc tính từ LOAI_CHI thật |
| 3 | Chuỗi «tiền thu hộ đã về» trong sự kiện vận đơn (sm-inbox `van-don`: «Đơn chuyển sang đã giao xong, tiền thu hộ đã về») + moTa connector shipper «tiền thu hộ về thẳng tài khoản của hộ» | Đọc nhanh dễ thành «app giữ/giải quyết tiền COD hộ» — chạm mép N-07 (giữ tiền khách). Thực chất app chỉ GHI NHẬN vào bảng thanh toán | Sửa câu thành «hãng đã chuyển tiền thu hộ vào TÀI KHOẢN NGÂN HÀNG của hộ — app ghi sổ theo» cho khỏi hiểu app là trung gian tiền |
| 4 | Toast «Đã gửi yêu cầu hẹn xuống cơ sở — phản hồi trong 1 ngày làm việc» (bindHoso) + SLA 15 phút/2 giờ | Cam kết thời gian phục vụ chưa qua Quang (P7 chỉ cho phép HIỆN SLA kênh người có sẵn — 15 phút/2 giờ đúng cái được phép; câu «1 ngày làm việc» là thêm) | Giữ 15 phút/2 giờ (P7 cho phép); câu «1 ngày làm việc» thêm nhãn hoặc bỏ |

Không tìm thấy chỗ nào app ngụ ý KÝ THAY (chữ ký số luôn mô tả «chữ ký này của cô/chú, không ai khác
dùng được»), KHAI THAY (bước 4 ranh giới), hay VÍ/GIỮ TIỀN của hộ.

---

## 6. BẢNG KẾT LUẬN + HAI DANH SÁCH CUỐI

Bảng kết luận (chỉ các mục có hành động; còn lại «giữ nguyên»):

| # | Tính năng | Verdict | Lý do 1 dòng | Hành động |
|---|---|---|---|---|
| 41 | Card uptime «99,5%» | THỪA + lỗi P7 | Bịa cam kết Quang chưa chốt | **BỎ ngay** |
| 36 | «Tách tiền» hệ số 6% | THỪA (dạng hiện tại) | Số bịa không nhãn nguồn | **BỎ số**, giữ cảnh báo định tính |
| 44 | 14 kịch bản giả lập | TRÌNH DIỄN | Dành người chấm, hộ bấm nhầm sinh rác | Giữ, đưa sau cờ «chế độ demo» |
| 10 | Thẻ «Đơn từ kênh khác…» | TRÌNH DIỄN | Giải thích 0 lần dùng cho hộ | Chỉ hiện khi có sự kiện mới |
| 35 | Chuyển chế độ HKD/DN | TRÌNH DIỄN | Hội đồng cần, hộ hiểu nhầm «app làm công ty» | Giữ + nhãn «tính thử» |
| 37 | «Chi phí của tôi» | TRÌNH DIỄN sai chỗ | Dùng 1 lần, đứng nhóm việc mỗi ngày | Dời nhóm Hệ thống/Hồ sơ |
| — | viewKetnoi cũ + toggleConnector | dead code | Gọi hàm W2 đã xoá | W6 dọn theo INTERFACE 7(7) |
| — | Connector food ngành ĐAĐồ | THIẾU | IV.3 đích danh mà chưa có | **THÊM** (W2/W1) |
| — | Nhãn nhóm đặt phòng | THIẾU chữ | IV.3 «tối thiểu 02 nền» | Sửa nhãn, không thêm connector |
| — | Kênh không-cài-app (Zalo đẩy ra ngoài) | THIẾU một phần | R-A2-02 MUST của CHARTER | THÊM 1 kịch bản demo |
| — | Badge tab Tiền | SAI TRỌNG SỐ | Cảnh báo đơn đổ nhầm tab | Lọc loại thue/no/hoadon |
| — | SLA đầy đủ trên tab Trợ lý | SAI TRỌNG SỐ | Cam kết B2B trên mặt hộ | Dời sang index, để lại 1 dòng |
| — | «Tiền thu hộ đã về» | rủi ro N-07 đọc nhầm | Nghe như app trung gian tiền | Sửa câu chữ |

### 12 LÕI tối thiểu — nếu chỉ được giữ 12

1. Bán tại quầy + thu QR + hoá đơn (#1) — 2. Nói thay gõ (#2) — 3. Trạm dữ liệu 12 connector +
trạng thái + độ tươi (#52/#53) — 4. Hộp thư đến: đơn sàn/tiền về TỰ CHẢY vào (#43) — 5. Thuế tạm
tính realtime + đồng hồ 30 ngày (#25/#7) — 6. Đường kê khai 5 bước với ranh giới tự nộp (#26) —
7. Trợ lý 3 lớp biết nói «chưa có số» (#38) — 8. Sáng nay cần để ý + deadlines (#4/#5) — 9. Wizard
kích hoạt + nhận diện hộ (#48/#49) — 10. Danh mục 3 nhóm chống phình (#50) — 11. Bán offline tự
đồng bộ (#9) — 12. Dữ liệu của tôi — xuất toàn bộ (#59).
(Lý do: 1-2-9-10-11 là A2 đúng kim chỉ nam mù công nghệ; 3-4-5-6-7-8 là A1+A3 đúng CHARTER;
12 là điều khoản IV.3 không được rơi.)

### Top-5 nên bỏ ngay

1. Con số «99,5% sẵn sàng» (#41) — vi phạm P7, tự mâu thuẫn với hồ sơ.
2. Hệ số 0,06 «phát hiện tiền nhà» (#36) — số bịa trên mặt hộ.
3. Thẻ «Đơn từ kênh khác đến bằng cách nào» cố định trên màn Bán (#10) — nội dung người chấm,
đứng chỗ hộ bán hàng.
4. Khối kịch bản giả lập lộ cho hộ bấm tự do (#44) — đưa sau cờ demo (bỏ KHÔNG, giấu CÓ).
5. viewKetnoi/bindKetnoi cũ + lời gọi `D.toggleConnector` — dead code gọi hàm đã xoá, dọn cho
sạch bản trình (cấm Write đè — W6 Edit từng chỗ).

---
*Số tính năng đã soát: 70 dòng bảng mục 1 + 5 mục đích danh mục 2-5 có hành động.*

BUILD-AGENT-DONE R3 70
