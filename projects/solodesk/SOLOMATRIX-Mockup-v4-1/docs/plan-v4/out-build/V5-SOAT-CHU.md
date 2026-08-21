# V5 — SOÁT CHỮ HIỂN THỊ, ĐỌC TO QUA TAI NGƯỜI MÙ CÔNG NGHỆ

**Cách làm:** đọc to từng chuỗi hiển thị cho **bà Nguyễn Thị Bảy (58 tuổi, chế biến, đứng quầy khi con đi giao hàng)** và **ông Lê Văn Sáu (55 tuổi, quản thuyền và hoạt động trên biển)** — hai tên lấy từ `js/sm-seed-gialai.js:151` và `:293`, không tự bịa nhân vật. Chỗ nào hai ông bà phải hỏi lại «nó nói cái gì?» = CHẮN; đoán được một nửa hoặc hỏi «có phải ý nó là…?» = GẮT; hơi văn nhưng cứ thế dùng được = NHẸ.

**Phạm vi đã quét:** `mobile.html` (toàn bộ view + VIEWS), `js/sm-domain.js` (deadlines, filingSteps, GATES), `js/sm-onboard.js` (wizard, Trạm, Tạm dừng, phí tin), `js/sm-ai.js` (Trợ lý, KB, SLA, genListing, afterHoursReply), `js/sm-ops.js` (soanNhacNo, LOAI_DIEU_CHINH), `js/sm-quyen.js` (VAI, nơi lưu dữ liệu), `js/sm-inbox.js` (NGUON, endpoint), `js/sm-seed-gialai.js` (chỉ lấy tên người), soi nhẹ `js/sm-b2g.js` (màn cán bộ, tiêu chuẩn nhẹ, mục riêng).

**Lưu ý số dòng:** `mobile.html` đang được agent khác sửa SONG SONG trong lúc quét (cùng một chuỗi trượt từ dòng 2278 → 2304 giữa hai lần grep). Số dòng dưới đây là của lần chốt cuối cùng. Khi đọc mà lệch vài dòng — tìm theo chuỗi nguyên văn, chuỗi là chuẩn.

**Đã bỏ qua đúng luật:** chuỗi trong comment/tên biến; khối `<details>` «Nguồn màn hình — cho người chấm demo» (sm-onboard.js:1245-1248) và «Cài đặt nâng cao — cho cán bộ» (sm-onboard.js:1357+) là chuẩn gập đúng, không tính là lỗi; mọi chuỗi đã qua `boNhan()` (sm-onboard.js:607) coi như sạch nhãn [Q-0xx].

---

## BẢNG KẾT QUẢ — CHẮN trước, rồi GẮT, rồi NHẸ

| # | Vị trí | Nguyên văn (trích) | Tai bà Bảy / ông Sáu nghe thấy gì | Câu viết lại (lời quê, giữ nguyên nghĩa) | Mức |
|---|---|---|---|---|---|
| 1 | mobile.html:338 | «Khách đặt trên sàn thì sàn **đẩy đơn về qua webhook**; hệ thống kiểm tồn rồi mới nhận, thiếu hàng là từ chối.» | «vét-búc» là tiếng nước ngoài; «kiểm tồn» cũng chẳng phải tiếng Việt | «Khách đặt trên sàn thì sàn tự gửi đơn về máy mình. App xem còn hàng không: còn thì nhận vào, hết thì từ chối, không để bán lố. Muốn thấy từng đơn, mở mục Hộp thư đến.» | CHẮN |
| 2 | mobile.html:1076 | `{nguon.ten} · {nguon.endpoint}` → hiện «Shopee · POST /webhooks/ecommerce/orders» | Cả dòng là mật mã; bà Bảy tưởng máy hỏng chữ | Chỉ hiện: «Shopee gửi về». Đường gửi chi tiết xếp vào khối gập «cho người chấm demo». | CHẮN |
| 3 | mobile.html:1170 | «Địa chỉ nhận» + giá trị `POST /webhooks/…` | «Địa chỉ nhận» gì? Đây là đường truyền của máy, không phải địa chỉ nhà | «Sàn gửi về bằng đường riêng của sàn — cán bộ biết đường này, nhà mình không cần nhớ.» | CHẮN |
| 4 | mobile.html:1173 | «Nội dung thô nhận được» + khối `JSON.stringify(payload)` | «Thô» là sao? Cả bảng chữ mật ai đọc nổi | Gập mặc định, đổi tên: «Bản gốc sàn gửi (dành cho cán bộ)» — muốn thấy thì bấm mở. | CHẮN |
| 5 | mobile.html:1098, 1169 | `{ng.kenh}` → «Đến bằng đường nào: webhook» | Hỏi «đường nào» mà trả lời bằng tiếng nước ngoài | «Đến bằng đường nào: sàn tự gửi về» / «ngân hàng tự gửi về». | CHẮN |
| 6 | mobile.html:808-810, 818 | «Lớp A · dữ liệu của hộ» · «Lớp B · nghiệp vụ v0.3 chưa phê duyệt» · «Lớp C · chuyển người thật» | Lớp học à? A B C là gì, ai xếp lớp cho mình? | «Trả lời bằng số của nhà mình» · «Trả lời theo bài đã duyệt (bài còn nháp — thẻ vàng)» · «Việc này app không làm thay — chuyển cho người». | CHẮN |
| 7 | mobile.html:732 | «sàn **đã khấu trừ nộp thay** … — app chỉ đối chiếu, nhà mình không khai lại phần này» | Nguy hiểm hơn không hiểu: ông Sáu có thể hiểu «thôi, khỏi nộp gì hết» | «Đơn bán trên sàn: sàn đã trừ sẵn tiền thuế trong tiền về và nộp hộ rồi. Nhà mình KHÔNG nộp thêm lần nữa — app chỉ giúp đối lại cho khớp sổ.» | CHẮN |
| 8 | mobile.html:780 | «Đang tính theo doanh nghiệp: GTGT khấu trừ X% trừ thuế đầu vào, TNDN Y% trên lợi nhuận…» | Bốn tên thuế viết tắt dồn trong một câu | «Đang tính kiểu công ty: thuế trên giá bán trừ đi thuế đã trả lúc mua hàng; cộng thuế tính trên phần lãi.» (chữ đầy đủ: thuế giá trị gia tăng, thuế thu nhập doanh nghiệp). | CHẮN |
| 9 | mobile.html:1929 | `i.cqtState === 'đã gửi' ? 'ok' : 'warn'` + hiện nguyên `E(i.cqtState)` | Toàn app dùng `'sent'` (sm-core.js:226, sm-domain.js:607) nên ô này LUÔN vàng và hiện nguyên chữ **«sent»** tiếng Anh | So với `'sent'` như mobile.html:330; chữ hiển thị dùng bảng dịch sẵn «đã truyền / đang truyền / chờ có mạng / lỗi». *(Lỗi mã, nhưng hậu quả là chữ lộ — ghi ở đây cho W6 thấy.)* | CHẮN |
| 10 | mobile.html:2304, 2309 | «…hết cửa sổ miễn phí, gửi kiểu Giao dịch 165đ/tin **[Q-005]**» · «…gửi tin Tư vấn 55đ/tin **[Q-005]**» | «[Q-005]» là mã nội bộ lộ ra màn hộ (mobile.html không dùng boNhan) — duy nhất 2 chỗ rò trong toàn app | «Hết 8 tin miễn phí rồi — mỗi tin chốt đơn tốn 165 đồng» / «Mỗi tin hỏi - trả lời tốn 55 đồng». Bỏ mã [Q-005] khỏi chữ, đưa xuống comment code. | CHẮN |
| 11 | mobile.html:2264 | «Bên mua quét mã thấy đủ đường đi của hàng để yên tâm **đưa vào chuỗi**…» | «Chuỗi» gì? Chuỗi xích à? (ý là chuỗi cung ứng) | «…để khách sạn, nhà hàng yên tâm đưa hàng của mình vào bếp, vào kho của họ.» | CHẮN |
| 12 | sm-onboard.js:1342 | «**Tiên quyết**» | Từ pháp lý, ông Sáu nghe thành «tiền quyết»? | «Phải làm cái này trước đã» — hoặc «Điều kiện đi trước». | CHẮN |
| 13 | sm-onboard.js:689, 274, 1685 | «Chưa có hộ demo cd4-moi trong kho — **cần seed v4 (việc W4)**» · «sm-domain.js chưa có datTrangThaiKetNoi (**việc W2** — chưa xong ở lượt build này)» · «Đồng hồ 30 ngày cần hàm D.mocVuotNguong (**việc W2**).» | Chữ của người build app, lộ ra máy hộ — bà Bảy đọc «uê-bờ-bốn» gì đó rồi lo | «Máy này chưa có hộ mẫu để bấm thử — nhờ cán bộ kỹ thuật xem giúp.» Mọi chữ tên hàm/việc W-x chỉ nằm trong console hoặc comment. | CHẮN |
| 14 | sm-domain.js:637 | «**Định tuyến vào sổ**» (bước 2/5 kê khai) | Kỹ thuật thuần — hai ông bà không đoán nổi | «Ghi vào đúng sổ sách» | CHẮN |
| 15 | mobile.html:305-306, 733, 2547 + sm-ai.js:148, 257-259 | «trên **ngưỡng** …» · «Sắp tới **ngưỡng**.» · «chưa vượt **ngưỡng miễn thuế**» · «Dưới **ngưỡng** 1 tỷ» · «**Ngưỡng** áp dụng: …» | «Ngưỡng» là mép cửa — ông Sáu: «ngưỡng cái gì, ở đâu?» | Đổi nhất quán thành «mốc»: «vượt mốc 1 tỷ đồng» / «sắp chạm mốc 1 tỷ» / «mốc miễn thuế». Một chữ, sửa 8 chỗ. | GẮT |
| 16 | mobile.html:635, 699 + sm-ai.js:44 | «phần chi phí đó không **hạch toán** được» · «điều kiện **hạch toán** cần đối chiếu văn bản thuế hiện hành» | «Hạch toán» là tiếng kế toán | «khoản chi đó không trừ được vào thuế — mất tiền thật» / «cách ghi sổ chi này phải soát lại theo văn bản thuế mới nhất». | GẮT |
| 17 | mobile.html:743 + sm-ai.js:150 | «Biểu tỷ lệ đang dùng **bản nháp** — cần **đối chiếu văn bản hiện hành**» | «Nháp» của ai? «Hiện hành» là chạy bộ à? | «Con số % thuế đang là bản dự thảo — cán bộ soát lại theo văn bản mới nhất rồi mới dùng vào hồ sơ thật.» | GẮT |
| 18 | mobile.html:758, 787 | «Bước 4 là **ranh giới cố ý**» · «Đây là **ranh giới trách nhiệm**.» | «Ranh giới» nghe như ranh đất | «Bước 4 là cố tình để người bấm: app làm sẵn tới đó, còn bấm nộp là việc của chính hộ — theo luật.» | GẮT |
| 19 | mobile.html:792, 798 + sm-domain.js:648 | «Lưu mã biên nhận và **đóng sổ kỳ**» · «Đã **đóng sổ kỳ** với mã …» | «Đóng sổ» kiểu kế toán, «kỳ» là kỳ gì | «Lưu mã biên nhận và chốt xong quý này» / «Đã chốt xong quý này, mã số …». | GẮT |
| 20 | mobile.html:834-836 + sm-ai.js:399-406 | «Cam kết dịch vụ — **99,5% sẵn sàng**» · «**Mức việc** · **Phản hồi đầu** · Xử lý» | 99,5% của cái gì? «Phản hồi đầu» là tin nhắn đầu à? | Giữ nguyên con số 99,5% (P7), thêm một câu: «nghĩa là 100 buổi máy chỉ hỏng dưới nửa buổi». Đổi cột: «Việc gì» · «Trả lời sớm nhất» · «Xong trong». | GẮT |
| 21 | mobile.html:902 | «…nhóm chưa đủ **danh mục tối thiểu**» | «Danh mục» như catalog — tối thiểu theo ai? | «còn thiếu X mục bắt buộc theo luật». | GẮT |
| 22 | mobile.html:1024 | «…nếu **liên quan kỳ kê khai**» | «Kê khai» nhiều người biết, «kỳ» làm câu cụt | «nếu việc đó dính tới khai thuế quý». | GẮT |
| 23 | mobile.html:1026 | «Chương trình ghi nhận hộ tới đâu — **ba cửa**» | Ba cửa nhà à? | «Chương trình nhìn thấy gì của nhà mình — 3 mức» | GẮT |
| 24 | mobile.html:1031 | «**Mốc 90 ngày**: … — đã tới / chưa tới» | 90 ngày kể từ ngày nào, của việc gì? | «Hạn 90 ngày kể từ khi được cấp giấy bán lẻ: ngày X — đã tới / còn N ngày» (ghi rõ mốc gốc của con số). | GẮT |
| 25 | mobile.html:328, 1943 | «trạng thái **truyền** cơ quan thuế» · «Trạng thái **truyền** thuế» | «Truyền» như truyền điện, truyền bệnh? | «hoá đơn đã gửi cơ quan thuế chưa» | GẮT |
| 26 | mobile.html:451 | «Không có đơn nào ở **trạng thái** này.» | «Trạng thái» là từ máy móc | «Lọc này không có đơn nào» → «Không có đơn nào loại này.» | GẮT |
| 27 | mobile.html:968 | «**Ràng buộc của Chương trình**: hộ phải biết trước toàn bộ lộ trình chi phí…» | «Ràng buộc», «lộ trình» — văn chương hành chính | «Chương trình hứa thế này: nhà mình biết trước TẤT CẢ khoản phải trả ngay từ ngày vào. Bảng này chính là lời hứa đó.» | GẮT |
| 28 | mobile.html:990 + sm-ai.js:84 | «Hộ trả cho **tầng vận hành và bán hàng**, không trả cho **tầng tuân thủ**.» | «Tầng» như tầng nhà; «tuân thủ» là giữ trật tự à? | «Hộ trả cho phần bán hàng, giữ hàng, có người hướng dẫn — KHÔNG trả cho phần khai thuế, ký số Nhà nước đã cấp miễn phí.» | GẮT |
| 29 | mobile.html:2221 | «**Trên máy chủ**, mất máy vẫn còn» | «Máy chủ» — chủ nào? | «Mất điện thoại, số liệu vẫn còn nguyên — nhà nước chương trình giữ giúp trong máy của họ.» | GẮT |
| 30 | mobile.html:2540, 2548 | «Chọn **chân dung hộ**» · «Ba chân dung dùng cùng một bộ khung, khác nhau ở **cấu hình**» | «Chân dung» là vẽ mặt người; «cấu hình» là mật mã | «Chọn hộ mẫu để bấm thử» / «Ba hộ mẫu dùng chung một app, chỉ khác ngành — thanh dưới tự đổi theo ngành.» | GẮT |
| 31 | sm-onboard.js:1416, 1420, 1422, 1433 | «chưa có tài liệu rõ — đang kiểm tra» · «chờ xác nhận **cơ chế**» · «**Cơ chế** chuyển/ghép nối từng nhà cung cấp» | «Cơ chế» là từ kỹ thuật | «cách làm đúng thế nào chưa chắc — đang hỏi lại Zalo, có cán bộ theo» / «chuyển sang nhà cung cấp này có thông suốt không: chưa kiểm được, app không nói bừa». | GẮT |
| 32 | sm-onboard.js:1921, 1935 | «**Dữ liệu tươi** tới đâu» · «**Độ tươi:**» | «Tươi» như rau tươi? Ông Sáu: «cá tươi hả?» | «Số mới về tới đâu» / «Số mới nhất:» | GẮT |
| 33 | sm-onboard.js:1585 | «trả lời khách trong **cửa sổ 7 ngày**, 8 tin miễn phí/48 giờ rồi 55đ/tin; tin Giao dịch 165đ/tin» | «Cửa sổ» ở đâu ra? 4 con số dồn một câu | «Trong 7 ngày khách vừa nhắn, được 8 tin miễn phí (tính trong 2 ngày); vượt thì 55 đồng/tin, tin chốt đơn 165 đồng/tin.» | GẮT |
| 34 | sm-domain.js:303 | «Đã quá hạn N ngày — **cần cán bộ**» | Cụt lủn — cần cán bộ làm gì? | «Đã trễ N ngày — bấm đây, cán bộ gọi lại giúp ngay.» | GẮT |
| 35 | sm-ai.js:142 | «GTGT 1% = …, TNCN 3% = … (ghi sổ)» trong câu trả lời Trợ lý | Viết tắt liên hoàn trong chat — đọc to rất khó | «thuế giá trị gia tăng 1% là … đồng; thuế thu nhập cá nhân 3% là … đồng (đã ghi vào sổ)». | GẮT |
| 36 | sm-ai.js:164 | «Đếm từ hôm nay tới ngày **cuối tháng đầu quý sau**.» | Vặn óc mới ra tháng 10 | «Từ hôm nay tới cuối tháng mở đầu quý sau (quý 3 thì hết hạn cuối tháng 10).» | GẮT |
| 37 | sm-ai.js:32 | «…phản ánh qua hoá đơn điện tử, **dòng tiền và dữ liệu giao dịch**.» | «Dòng tiền», «dữ liệu giao dịch» — từ báo cáo | «…tính theo hoá đơn điện tử, tiền vào - ra ngân hàng và từng đơn bán thật.» | GẮT |
| 38 | sm-ai.js:27 | «Bản nháp do đơn vị đề xuất soạn, CHƯA trình phê duyệt. Bài chưa phê duyệt hiện nhãn vàng.» | «Phê duyệt» là từ cơ quan — giữ ý minh bạch nhưng đổi giọng | «Bài này còn là bản soạn, chưa duyệt chính thức — thẻ vàng để cô chú biết mà hỏi lại cán bộ.» | GẮT |
| 39 | mobile.html:640, 648 | «Số giấy tờ **định danh**» | Khá phổ biến trên giấy tờ nhà nước nhưng bà Bảy quen nói «số CCCD» | «Số CCCD (in trên thẻ căn cước)» | NHẸ |
| 40 | mobile.html:1228 | «**Nhóm thuế**» (nhãn select mặt hàng) | «Nhóm» + «thuế» ghép mơ hồ | «Loại thuế của mặt hàng» | NHẸ |
| 41 | sm-domain.js:232 | «**Kê khai** và nộp thuế quý X/Y» | «Khai thuế» quen hơn «kê khai» | «Khai và nộp thuế quý X/Y» | NHẸ |
| 42 | sm-domain.js:315 | «Kênh X **không gửi dữ liệu** N ngày — có thể kết nối đứt» | Câu tốt, chỉ «dữ liệu» hơi khô | «N ngày rồi {sàn} chưa gửi đơn về — dây có thể đứt, kiểm tra lại» | NHẸ |
| 43 | sm-ai.js:260 | «Doanh thu **luỹ kế** từ 01/01, chia theo số ngày đã qua rồi nhân 365…» | «Luỹ kế» là từ kế toán | «Cộng tiền bán từ đầu năm tới nay, chia cho số ngày đã qua, nhân 365 — ra ước cả năm.» | NHẸ |
| 44 | sm-ai.js:180 | «Tổng tồn **các lô** trừ đi phần đang **giữ chỗ** cho đơn chưa giao.» | «Lô», «giữ chỗ» — người biển hiểu lô tàu cá, may là ý gần | «Số hàng trong kho, trừ hàng khách đã đặt nhưng chưa lấy.» | NHẸ |
| 45 | mobile.html:806 + sm-ai.js:406 | «trực **24/7**» | Người lớn tuổi đọc «hai mươi tư trên bảy» khó | «trực cả ngày lẫn đêm» + dòng dưới ghi rõ «giờ có người nghe máy: 7 giờ sáng – 9 giờ tối». | NHẸ |
| 46 | mobile.html:1066 | «**Giả lập** sự kiện bên ngoài» | Khối demo nằm giữa màn thật — hộ tưởng phải bấm | Gập vào khối «dành cho người xem demo» đúng chuẩn «Nguồn màn hình», mặc định đóng. | NHẸ |
| 47 | mobile.html:1896 | «Khoản **khó đói**» | LỖI CHÍNH TẢ — đúng là «khó đòi»; đọc to thành «khó đói» ông Sáu nghĩ thiếu ăn | «Khoản khó đòi» (sửa 1 chữ — tag ở dòng dưới trong cùng màn đang viết đúng). | NHẸ |
| 48 | js/sm-b2g.js:847 | «Sổ trực **onboarding**» (màn cán bộ) | Cán bộ tỉnh quen nói «hộ mới vào chương trình» | «Sổ trực hộ mới vào chương trình» | NHẸ |
| 49 | js/sm-b2g.js:542 | «mã mô phỏng định dạng GL26-XXXX-XXXX, **lưu ở kho «smv3:b2g-suat» của máy này**» (màn cán bộ) | Tên kho localStorage lộ trong câu chữ | «…lưu ngay trên máy này» (tên kho chỉ nằm trong comment code). | NHẸ |

*(49 dòng bảng.)*

---

## CHỮ SỐ VÀ ĐƠN VỊ — chỗ nào số đứng một mình không nói «của cái gì»

| Vị trí | Hiện thị | Chỗ vướng | Nên ghi rõ |
|---|---|---|---|
| mobile.html:2306 | «Tin nhắn miễn phí (còn X/8 **trong 48 giờ**)» | 48 giờ tính từ lúc nào? Của ai? | «8 tin miễn phí tính trong 2 ngày, tính từ lúc khách nhắn gần nhất» (mốc gốc là tin của KHÁCH, không phải của hộ) |
| mobile.html:1031 | «Mốc 90 ngày: {date}» | 90 ngày kể từ sự kiện nào? | Ghi mốc gốc: «90 ngày kể từ ngày được cấp giấy bán lẻ» (đối chiếu sm-domain.js:89 — đồng hồ 30 ngày đăng ký HĐĐT đã ghi mốc rõ, lấy làm mẫu) |
| mobile.html:834 | «99,5% sẵn sàng» | Phần trăm của thời gian gì, ai cam kết | Giữ số (P7), thêm «trong 1 tháng, do Chương trình cam kết» — câu gốc có ở sm-ai.js:399 nhưng chưa xuống tới màn |
| mobile.html:986 | «Năm 3 hộ trả» | Năm thứ 3 tính từ khi nào? | «Năm thứ 3 tính từ ngày vào chương trình» |
| mobile.html:780 | «GTGT khấu trừ X%» | % tính trên giá bán hay trên lãi? | «thuế giá trị gia tăng X% tính trên tiền bán» |
| mobile.html:305 | «trên ngưỡng {số}» | Có in số 1 tỷ nhưng chữ «ngưỡng» không nói đó là mốc LUẬT | «vượt mốc 1 tỷ đồng theo luật» (gộp với dòng #14) |
| mobile.html:2304, 2309 + sm-onboard.js:1585 | «165đ/tin», «55đ/tin» | Đ có phải đồng? mỗi tin gì? | «165 đồng mỗi tin chốt đơn», «55 đồng mỗi tin hỏi - trả lời» |

**Làm gương đối chiếu (không cần sửa):** sm-domain.js:302 «Còn N ngày đăng ký hoá đơn điện tử — hết ngày {date}» — số + mốc + việc, chuẩn; sm-ai.js:338 «app nhận số mới cách đây N phút» — rõ.

---

## NÚT VÀ ĐƯỜNG LUI

| Vị trí | Nút | Chỗ vướng | Đề xuất |
|---|---|---|---|
| mobile.html:157 | «☰» | Chỉ có aria-label «Đổi chân dung hộ» — trên màn là ký tự lạ; ông Sáu bấm thử vì tò mò | Thêm chữ dưới ký hiệu hoặc đổi «☰ Hộ mẫu»; lần đầu mở app hiện 1 dòng giải thích |
| mobile.html:159 | «Aa» | Tương tự — «Aa» là gì? | Đổi «Chữ to/nhỏ» — đây lại là nút CẦN cho người lớn tuổi, càng phải rõ |
| mobile.html:247, 273 | «Xem» | Xem cái gì — nút mờ nghĩa, 2 màn khác nhau cùng một chữ | «Xem việc này» hoặc gọi tên việc: «Xem hạn thuế», «Xem tin» |
| mobile.html:1237 | «Xoá mặt hàng» | Bấm là xoá NGAY, không hỏi lại — hàng hoá là dữ liệu thật | Hỏi 1 lần: «Xoá hẳn {tên mặt hàng}? Trong kho còn N» |
| mobile.html:923 | «Nạp lại dữ liệu mẫu» | Nút HUỶ dữ liệu thật (gọi `SM.resetAll()`) nằm cuối menu Cài đặt; chữ «nạp lại» nghe vô hại — người nóng tính bấm xem là mất số | Đổi chữ «Xoá hết số liệu của nhà mình, về dữ liệu mẫu» + 2 bước hỏi (mẫu 2-bước + gõ XOÁ đã có sẵn ở màn Tạm dừng — sm-onboard.js:2167+, dùng lại) |
| sm-onboard.js (sheet «Đã nối xong», khối sheetDaXong ≈1966-1994) | «Tôi là cán bộ — xác nhận đã nối…» | Nút quyền lực cán bộ nằm ngay màn hộ, ai bấm cũng được | Thêm 1 câu hỏi chốt «Bạn là cán bộ hỗ trợ địa bàn?» hoặc cán bộ gõ mã của mình; giữ đúng chủ đích «người bấm phải là người thật» |
| sm-onboard.js:728, 784 + mobile.html:1066 | «Mô phỏng quét QR (điền mã demo)», «Bản demo: chuỗi nào cũng vào được», «Giả lập sự kiện bên ngoài» | Nút/khối DEMO nằm giữa màn thật | Gộp về một khối gập «dành cho người xem demo», đóng mặc định — đúng chuẩn khối «Nguồn màn hình» đã có |
| Đường lui — làm gương (không cần sửa) | wizard OB-3 (sm-onboard.js:1234-1235) có «Đổi người bấm» + «Để sau»; màn Tạm dừng có 2 lần hỏi + GIỮ 5 giây; sheet phí tin hiện tiền TRƯỚC nút gửi (D-#4) | | |

---

## MÀN CÁN BỘ (b2g — tiêu chuẩn nhẹ, soi nhanh)

Chuỗi cán bộ nhìn chung tốt («Sinh mã suất, cán bộ in ra mang đi — hộ quét mã là kích hoạt ngay» giải thích ngay chữ khó). Hai chỗ đáng đổi: #48 «Sổ trực onboarding», #49 tên kho localStorage lộ trong câu. Không phát hiện webhook/endpoint/payload nào lộ trên màn cán bộ ngoài chủ đích demo.

---

## 10 CHỖ NÊN SỬA TRƯỚC NHẤT (xếp hạng)

1. **Hộp thư đến (mobile.html:1076, 1098/1169, 1170, 1173)** — endpoint + payload JSON + chữ «webhook» lộ nguyên — dày nhất app, đúng khu cần «cửa sổ kỹ thuật» của Quang.
2. **mobile.html:338** — câu «webhook» đầu tab Bán: màn đầu tiên ai mở cũng đọc phải.
3. **mobile.html:808-810, 818** — «Lớp A/B/C» hiện 3 lần mỗi màn Trợ lý, đổi một hàm là sạch cả màn.
4. **mobile.html:2304, 2309** — [Q-005] lộ + phí tin nói mơ — đây là CHỒNG TIỀN, sai một chữ là khiếu nại.
5. **mobile.html:732** — «khấu trừ nộp thay»: hiểu SAI là chuyện nộp thuế — rủi ro pháp lý, không chỉ là chữ.
6. **mobile.html:780 + sm-ai.js:142** — GTGT/TNDN/TNCN viết tắt dồn dập ở tab Tiền và trong chat Trợ lý.
7. **sm-domain.js:637 + mobile.html:792/798** — «Định tuyến vào sổ», «đóng sổ kỳ» nằm trên ĐƯỜNG NỘP THUẾ 5 bước — chỗ hộ sợ nhất phải dễ nhất.
8. **Chữ «ngưỡng» → «mốc 1 tỷ»** (mobile.html:305-306, 733, 2547 + sm-ai.js:148, 257-259) — một từ điền được 8 chỗ, ai đang sửa file đó sửa luôn thể.
9. **Nút an toàn**: «Nạp lại dữ liệu mẫu» (mobile.html:923), «Xoá mặt hàng» (1237), «Tôi là cán bộ» (sm-onboard sheetDaXong) — ba nút mất dữ liệu / vượt quyền không có chặn.
10. **Chữ build nội bộ + danh từ khô**: sm-onboard.js:689/274/1685 (việc W2/W4, tên hàm), «Tiên quyết» (1342), «Dữ liệu tươi» (1921/1935), «cơ chế» (1416-1433).

---

## PHỤ CHÚ (không phải chữ — nêu để agent chủ file biết)

- **mobile.html:1929**: so sánh `i.cqtState === 'đã gửi'` trong khi toàn hệ thống dùng `'sent'` (sm-core.js:226, sm-domain.js:607, sm-ops.js:178, sm-inbox.js:270, seed:98/463) — tag luôn vàng VÀ hiện nguyên chữ «sent» (đã tính là dòng #9).
- **mobile.html đang bị W6 sửa song song trong lúc quét** — số dòng có thể trượt vài dòng lúc đọc; chuỗi nguyên văn mới là neo.
- Các chỗ đã đúng chuẩn, KHÔNG đụng: `boNhan()` cắt nhãn (sm-onboard.js:607-609); khối «Nguồn màn hình — cho người chấm demo» (sm-onboard.js:1245-1248); «Cài đặt nâng cao — cho cán bộ» (sm-onboard.js:1357+); DONG_ANH_GIAY_TO P12 (sm-onboard.js:602-604); màn Tạm dừng 2-bước (2167+); soanNhacNo lời nhắc nợ (sm-ops.js:316-327) — viết chuẩn giọng quê, nên lấy làm văn phong mẫu cho các câu viết lại ở trên.
- Đề V5 không cho sửa code — mọi đề xuất trong file này chỉ là ĐỀ XUẤT, chưa dòng code nào được đụng.

BUILD-AGENT-DONE V5 49
