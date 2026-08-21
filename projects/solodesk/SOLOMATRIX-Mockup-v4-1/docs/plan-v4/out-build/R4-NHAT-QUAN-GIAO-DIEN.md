# R4 — NHẤT QUÁN GIAO DIỆN · cùng một thứ phải gọi và vẽ giống nhau ở mọi nơi

Soat ngày 20/08/2026 trên toàn bộ chuỗi hiển thị của `mobile.html` + `js/*.js` + `b2g.html` + `web.html` + `index.html`.
Mỗi kết luận VÊNH đều có ≥2 bằng chứng file:dòng thật (đã đọc lại ngữ cảnh từng dòng, không grep mù).
R4 không sửa code — file này là bản đề xuất quy ước + danh chỗ phải đổi cho W1–W7 gánh ở đợt sửa tiếp.

**Ghi chú file đang sửa song song (đề có dặn):** thấy 2 chỗ dở —
(1) `mobile.html:965` vẫn gọi `D.toggleConnector` nhưng hàm này đã bị W2 XOÁ khỏi `sm-domain.js`
(chỉ còn `datTrangThaiKetNoi` ở `js/sm-domain.js:980`). Hiện không vỡ runtime vì `VIEWS.ketnoi` đã trỏ
`ON.viewTram` (mobile.html:2503) nên `bindKetnoi` là code chết — nhưng ai routing lại `viewKetnoi` cũ là
vỡ ngay lúc bấm. Đúng INTERFACE mục 7-(7): W6 phải dọn chỗ gọi này.
(2) `js/sm-onboard.js:274` còn nhãn fallback «sm-domain.js chưa có datTrangThaiKetNoi (việc W2 — chưa xong
ở lượt build này)» — W2 đã có hàm rồi, nhãn đã stale, nên bỏ khi ghé sửa.

---

## 1. Từ điển khái niệm — một khái niệm, những tên đang dùng

| Khái niệm | Các tên đang dùng (file:dòng) | Chốt nên dùng | Chỗ phải đổi |
|---|---|---|---|
| Đường nối dữ liệu với bên ngoài (connector) | «kết nối/nối» (chuẩn, khắp nơi) · «kênh» trong nghĩa nối: sm-ai.js:313 «Các kênh đang nối», sm-nen.js:163 «chưa có kênh nào đã nối» · «dịch vụ»: sm-onboard.js:1309 «Không rõ dịch vụ cần nối», sm-onboard.js:2113 «Ngắt kết nối từng dịch vụ», mobile.html:940 «chưa có dịch vụ nào vận hành để nối» · «chỗ»: sm-ai.js:332-333 «đang nối N chỗ» · «đầu nối»: mobile.html:960, index.html:376 | **kết nối** (danh từ), **nối** (động từ). «Kênh» chỉ giữ cho nghĩa KÊNH BÁN (Shopee, Zalo, quầy). «chỗ» chỉ giữ khi nói chỗ BÁN của hộ (câu hỏi OB-2), không dùng cho connector | sm-ai.js:313, 332-333 · sm-onboard.js:1309, 2113 · mobile.html:940, 960 · index.html:376 |
| Màn quản lý kết nối (`ketnoi`) | «Kết nối kênh bán» (menu — mobile.html:902) · «Trạm kết nối» (tự xưng — sm-onboard.js:1251, 661) · «Trạm dữ liệu» (sm-inbox.js:286) | **Trạm kết nối** (PLAN B.9 đã đặt tên màn này là Trạm) | mobile.html:902 · sm-inbox.js:286 |
| Chủ thể dùng app | «nhà mình» (vật/nghề của hộ — mobile.html:285, sm-onboard.js:360, sm-b2g.js:335) · «cô chú» (người — mobile.html:351, sm-ai.js:381, sm-onboard.js:666) · «hộ kinh doanh/hộ» (ngôn ngữ thuế — mobile.html:781, 800) | **Giữ nguyên phân vai**: «nhà mình» = nghề/sổ, «cô chú» = người bấm, «hộ» = chỉ trong mối quan hệ thuế/chế độ. Không dùng «bạn», «quý khách», «người dùng» trước mặt hộ (hiện chưa thấy lọt) | không phải đổi — chỉ cần quy ước để agent mới không thêm tên thứ 4 |
| Khách của hộ (trong tin nhắn soạn hộ) | «anh chị» (sm-ops.js:318-327, sm-ai.js:383, sm-domain.js:1282) · «khách» (mobile.html:887 «N khách», sm-onboard.js:613) | **anh chị** trong tin nhắn gửi khách; **khách** trong app | đã nhất quán — giữ |
| Người trên hoá đơn | «người mua» (mobile.html:1961 «Tên người mua mới», sm-ops.js:154-155, sm-inbox.js:399) · «khách» | **người mua** — đúng chữ pháp lý hoá đơn, CHẤP NHẬN như biến thể có chủ đích của «khách» | không đổi |
| Phiếu bán | «đơn» (tab mobile.html:208, header «Đơn hàng» 442, sheet «Đơn XX» 473) · «đơn hàng» (web.html:118, b2g.html:244) · «lượt bán» (sm-onboard.js:2055 «Chốt lượt bán đầu tiên») | **đơn** · «đơn hàng» chấp nhận ở web/b2g (văn bản dài hơn) · «lượt bán» đổi thành «đơn đầu tiên» | sm-onboard.js:2055 (1 chỗ — gợn, không vênh vì chỉ xuất hiện 1 lần) |
| Hoá đơn điện tử | «hoá đơn điện tử» (khắp nơi — sm-onboard.js:1057, sm-b2g.js:45) · «hoá đơn điện tử của cơ quan thuế» (sm-onboard.js:1057, 372) · «HĐĐT» (chỉ trong comment — sm-onboard.js:1429, sm-program.js:129) | **hoá đơn điện tử**; cụm «của cơ quan thuế» giữ khi cần phân biệt với hoá đơn hãng khác (sm-onboard.js:1660) | đã ổn — HĐĐT chỉ nằm comment, đúng luật |
| Tiền ngân hàng nhận vào | «tiền về» (sm-inbox.js:334, sm-onboard.js:48, sm-nen.js:131) — nhất quán tuyệt đối | **tiền về** | không phải đổi (điểm TỐT của bản này) |
| «thanh toán» | nghĩa khác: cách trả tiền của đơn (mobile.html:402 label «Thanh toán», b2g.html:145 «thanh toán theo kết quả») | giữ «thanh toán» cho nghĩa trả tiền; KHÔNG dùng đồng nghĩa với «tiền về» | hiện chưa lẫn — chỉ quy ước |
| Chứng từ thu mua từ nông dân | «bảng kê (thu mua)» (mobile.html:642-655, sm-program.js:152) · «Sổ thu mua» (sm-nen.js:236) | **bảng kê thu mua**; «sổ thu mua» = toàn bộ các bảng kê (cấp sổ) — chấp nhận 2 cấp | không đổi |
| Ngày phải làm xong | «hạn» (mobile.html:246 «Hạn …», 243 tag «quá hạn», sm-b2g.js:382) · «mốc» chỉ dùng cho mốc đo lường «Mốc 90 ngày» (mobile.html:1036, b2g.html:157) | **hạn** cho nghĩa vụ; **mốc** cho thời điểm đo | đã ổn |
| Việc app nhắc hộ làm | «Việc cần để ý» (mobile.html:239) · «Sáng nay cần để ý» (mobile.html:268) · «Việc cần làm» (web.html:112) · đơn vị đếm «việc» (mobile.html:265 «N việc chờ gửi») | **Việc cần để ý** ở app hộ; web.html đổi theo | web.html:112 · mobile.html:268 (xem V8) |

## 2. Nhãn trạng thái (tag) và màu

Bộ màu 5 giá trị thống nhất hex ở mọi file (mobile.html:17-19 = b2g.html:13-15 = index.html:13-15 = web.html:10):
`ok` xanh · `warn` vàng · `crit` đỏ · `br` xanh brand · `gray` xám (b2g có thêm `.tag.no` — b2g.html:61 — cùng visually với gray nhưng khác tên class).

Ngữ nghĩa thực tế khi quét toàn bộ usage:

- **ok** — đã xong / khớp / còn chỗ / hợp lệ: «đã trả lời» mobile.html:2430 · «khớp tiền» 1877 · «đang hiệu lực» 2266 · «đã xong» sm-onboard.js:2065 · «Nhà nước cấp miễn phí» mobile.html:993. Nhất quán.
- **warn** — cần để ý nhưng chưa mất việc lớn: «phiếu chi» 1369 · «đã cọc» 1492 · «thừa tiền» 1879 · «chưa vận hành» 956 · «Chưa đo được» sm-onboard.js:1934 · «bài chưa được phê duyệt» 825.
- **crit** — quá hạn / thiếu tiền / đứt / vi phạm chứng từ: «quá hạn» mobile.html:773, 1450, 2470 · «THIẾU» 1878 · «không chứng từ» 1369 · «đứt — kiểm tra» sm-onboard.js:1931.
- **br** — nhãn thương hiệu + trạng thái trung tính: «giữ lạnh» 313 · «khách tổ chức» 1422 · «LUẬT ĐÒI» sm-onboard.js:1318 · «mình gửi» 2430.
- **gray** — chưa có / đã kết thúc / không áp dụng: «chưa xuất» 551 · «đã huỷ» 1490 · «trong hạn» 773 · «chưa gán» sm-b2g.js:585.

**Chỗ dùng sai hoặc vênh màu** (chi tiết bằng chứng ở bảng kết luận V1–V5):
- Trạng thái connector `dang_dang_ky`/`cho_duyet` vẽ **warn ở Trạm** (sm-onboard.js:1296-1297) nhưng **br ở Sổ trực** (sm-b2g.js:65) — PLAN B.2 chốt «thẻ xanh nhạt».
- Cùng một nhãn «có hoá đơn» vẽ ok ở mobile.html:551 nhưng br ở mobile.html:1491.
- Hạn 30 ngày: đỏ ở app hộ khi còn ≤14 ngày (sm-domain.js:305 → mobile.html:241 crit) nhưng xanh/vàng ở Sổ trực đến khi còn <7 ngày (sm-b2g.js:382).
- crit cho việc không phải lỗi của hộ: «hết hàng» mobile.html:314 · «chưa trả lời» 2430 (tin khách chưa trả lời — là việc churn, không phải lỗi) · «Đã quá ngày dự kiến» sm-onboard.js:1780 (bên thứ ba chậm, không phải lỗi hộ).

**Quy ước màu đề xuất (1 dòng mỗi màu):**
- `ok` = việc đã xong, số khớp, không cần làm gì thêm.
- `warn` = cần cô chú để ý trong mấy ngày tới, chưa mất tiền, chưa phạm luật.
- `crit` = đã mất tiền / sắp mất tiền / đã quá hạn nghĩa vụ / dữ liệu đứt — mức này PHẢI ít, thấy đỏ là phải hành động ngay được.
- `br` = thông tin định danh + trạng thái đang tiến triển BÌNH THƯỜNG (đang làm dở, đang chờ bên ngoài duyệt).
- `gray` = chưa có dữ liệu, đã kết thúc, không áp dụng — không mang nghĩa cảnh báo.

## 3. Mẫu tương tác

Thực trạng chung đã khá kỷ luật: **xem chi tiết = sheet** (mobile.html:473, 1537; sm-onboard.js:1970) · **nhập liệu = sheet có validate lỗi inline `note crit` + không đóng khi sai** (mobile.html:1974-1976, 1547-1553) · **thành công = toast 1 câu + render** (khắp nơi) · **đi trang ngoài = sheet cảnh báo «đang sang trang của NGÂN HÀNG»** (sm-onboard.js:1473) · không dùng `confirm()/prompt()/alert()` native nào (đã grep — 0 kết quả). Ba bản `sheet()` độc lập (mobile.html:194, sm-nen.js:38, sm-onboard.js:518) — cùng hình thức, chấp nhận được vì module rời.

Chỗ KHÔNG theo mẫu:

| Loại hành động | Mẫu chung | Chỗ lệch |
|---|---|---|
| Huỷ nghiệp vụ sổ sách | bắt buộc lý do: huỷ lượt đặt (mobile.html:1534+1562), huỷ hàng hỏng (2098+2149), huỷ/thay thế hoá đơn (1959+1976), tạm dừng OPC (2 lần + gõ XOÁ + giữ 5 giây — sm-onboard.js:2168-2182) | **Huỷ đơn và trả hàng về kho bấm là chạy luôn, không hỏi, không lý do** — mobile.html:498+507-508 |
| Nút khó gỡ | class `dan` (đỏ đặc) — mobile.html:69, dùng ở 1242, 1536, 2099, 2243, 2370, sm-onboard.js:2172+2182 | Huỷ đơn dùng `gh` + tô màu text tay (mobile.html:498) — 2 kiểu nút huỷ trong app |
| Chọn đáp án wizard | chọn xong nút đổi thành `pri` (câu kênh sm-onboard.js:1192, câu doanh thu 1203-1204) | Câu ngành 1158, câu giấy tờ 1179, câu POS 1217 — chọn xong KHÔNG có phản hồi đã-chọn nào trên nút |
| Xác nhận 2 bước | xoá dữ liệu: 2 sheet + giữ 5 giây (sm-onboard.js:2168+) | xoá mặt hàng: KHÔNG bước nào (mobile.html:1259-1262) |

## 4. Trạng thái rỗng và trạng thái lỗi

Phần lớn danh sách ĐÃ có câu rỗng tốt — thậm chí mẫu tốt có sẵn: mobile.html:456 «Không có đơn nào ở trạng thái này» · 1486 «Chưa có lượt đặt nào» · 2038-2039 giá đổi (note ok GIẢI THÍCH luôn nguyên tắc) · sm-b2g.js:611/659/694/714/757 (mọi bảng b2g đều có câu hoặc «Đang nạp dữ liệu…») · sm-nen.js:236, 250 (kèm hướng dẫn xem hộ mẫu).

| Màn | Tình huống rỗng/lỗi | Đang hiện gì | Đề xuất |
|---|---|---|---|
| Khách hàng (mobile.html:1418-1427) | hộ chưa có khách nào | card «Khách hàng» + list trống trơn | «Chưa có khách nào trong sổ — bán đơn đầu tiên, khách tự vào đây» |
| Tồn kho (mobile.html:592-604) | chưa có mặt hàng | card «Tồn kho» thân trống | «Kho chưa có hàng — thêm mặt hàng đầu tiên ở mục Thêm» |
| Thu mua → Bảng kê đã lập (mobile.html:655-664) | 0 bảng kê | header đếm «0 lượt» + list trống | câu dẫn + nút «Lập bảng kê đầu tiên» |
| Khoản chi → Chi theo loại + Các khoản chi (mobile.html:1361-1374) | kỳ chưa có chi | 2 card trống | «Chưa ghi khoản chi nào kỳ này» |
| Hộp thư → xử lý sự kiện lỗi (sm-inbox.js:269) | bản ghi trùng tham chiếu hoá đơn đã xoá | ghiChu «Không tìm thấy hoá đơn X» — giọng dev | «Hoá đơn này đã không còn trong sổ — sự kiện bỏ qua, không ảnh hưởng gì» |
| Lỗi nối SePay (sm-onboard.js:1493) | bản thử không về | toast «Lỗi» — 1 chữ, máy móc nhất app | «Chưa nhận được dòng thử của SePay — thử lại, hoặc gọi cán bộ» |

## 5. Nút

- **Chỉ có icon**: mobile.html:157 (☰ có aria-label «Đổi chân dung hộ») · 159 (Aa ✓) · 168 (💬 FAB ✓) · 819 (🎤 ✓). Đều có aria-label — chấp nhận; GỢN: FAB 💬 nên kèm chữ «Trợ lý» ở chế độ chữ to (người mù công nghệ không đoán được icon trái tim/chat).
- **Cụt nghĩa**: «Xem» mobile.html:247 + 273 (2 thẻ việc — hàng đã có tên việc nên đọc được, nhưng 2 nút «Xem» cạnh nhau 2 thẻ khác tiêu đề thì vẫn mơ hồ) · «Chi tiết» sm-onboard.js:1827 · «Lưu» mobile.html:1241 (lưu CÁI GÌ — sheet sửa mặt hàng). Đối chiếu mẫu TỐT đã có: «Lưu bảng kê và vào lô» (mobile.html:652), «Lưu mã biên nhận và đóng sổ kỳ» (797), «Chuyển sang: Đã gửi» (496) — nút nêu đích đến. Quy ước: nút hành động nêu đối tượng khi màn có nhiều đối tượng.
- **Nguy hiểm cạnh an toàn**: sheet Sửa mặt hàng — «Lưu» (pri) và «Xoá mặt hàng» (dan) xếp kề nhau full-width (mobile.html:1241-1242), chỉ cách 8px; bấm nhầm xuống nút đỏ là mất mặt hàng NGAY không hỏi (1259-1262). Đề xuất: dời nút xoá vào «…»/cuối sheet + thêm 1 bước xác nhận. Cùng họ: sheet đặt chỗ có 3 khối hành động (cọc/đổi lịch/huỷ) — tách biệt bằng card riêng, ổn hơn.
- **2 primary trở lên cùng màn**:
  - Sheet đặt chỗ: «Ghi nhận đã cọc» (pri, mobile.html:1520) + «Đổi lịch» (pri, 1532) — 2 xanh đậm full-width trong 1 sheet.
  - Câu doanh thu: đáp án đang chọn thành pri (1203) + «Tôi chắc cả năm bán trên 1 tỷ» luôn pri (1206) → chọn đáp án nào là 2 pri.
  - Tab Bán: «Thu tiền QR» pri (322) là nút chính duy nhất — đạt mẫu.
  - Quy ước: 1 màn/sheet tối đa 1 nút pri = con đường chính; lựa chọn thể hiện bằng tick/viền, không bằng pri (trừ chip chọn — đang dùng pri nhất quán ở 2 câu, nên mở rộng cho cả 3 câu còn lại).

## 6. Số và định dạng

Bộ format trung tâm `SM.fmt` (sm-core.js:22-43): `d()` «1.020.000đ» · `dShort()` «1,25tr/45tr/12k» · `num()` · `pct()` «1,5%» (phẩy thập phân) · `dmy()` «17/08/2026» · `dm()` «17/08» · `hm()». Toàn app hầu như đi qua bộ này.

Vi phạm:

- **Tiền có khoảng trắng trước «đ»**: mobile.html:1835 «… đ», 1878 «THIẾU … đ», 1879 «THỪA … đ», 1899-1900 (kết ca/công nợ) tự ghép `F.num(...) + ' đ'`, trong khi chuẩn `F.d()` không khoảng trắng (sm-core.js:29; vd mobile.html:734). Cùng file 2 kiểu.
- **Ngày ISO lộ ra trước mặt hộ**: chuỗi tiêu đề thẻ hạn 30 ngày nhúng thẳng `moc30.han` (ISO «2026-09-29») — sm-domain.js:302 «hết ngày ${moc30.han}» — hiển thị nguyên tại mobile.html:244 và 271 (ten không qua dmy), trong khi Sổ trực cùng mốc ghi đúng «hết 29/09/2026» (sm-b2g.js:382 dùng F.dmy). Mọi nơi khác đều dmy.
- **Phần trăm**: F.pct dùng phẩy — nhất quán (mobile.html:834, 745-746); sm-program.js:215-220 «≥ 60%» số nguyên — chấp nhận được (ngưỡng chỉ tiêu, không phải số đo).
- Quy ước chốt: tiền đầy đủ = `F.d()` không khoảng trắng; thẻ số nhỏ = `F.dShort()`; mọi ngày ra màn = `F.dmy()/F.dm()`, cấm nối chuỗi ISO trực tiếp vào câu hiển thị; % = `F.pct()`.

## 7. Bảng kết luận

| # | Loại vênh | Bằng chứng (≥2 file:dòng) | Quy ước nên chốt | Mức | Chi phí sửa |
|---|---|---|---|---|---|
| V1 | Màu trạng thái connector đang tiến triển: vàng ở app hộ, xanh ở Sổ trực | sm-onboard.js:1296-1297 (`dang_dang_ky`/`cho_duyet` = warn) · sm-b2g.js:65 (cùng 2 trạng thái = br) — PLAN B.2 chốt «thẻ xanh nhạt» | `dang_dang_ky`/`cho_duyet` = `br` ở MỌI bề mặt; warn chỉ cho việc hộ phải tự làm | **VÊNH NẶNG** (cán bộ nhìn Sổ trực thấy «bình thường» đúng lúc hộ thấy vàng đầy Trạm — 2 bên hiểu 2 mức báo động khác nhau) | nhỏ: đổi 2 entry trong map sm-onboard.js:1297 |
| V2 | 2 bộ nhãn + tên connector khác nhau giữa Trạm và Sổ trực | sm-onboard.js:1298 «Đã nối + số liệu đã chảy»/«Lỗi» vs sm-b2g.js:66-67 «Đã nối»/«Bị lỗi» · sm-onboard.js:104 «Gian hàng Shopee» vs sm-b2g.js:52 «Sàn Shopee» · sm-onboard.js:96 «Sổ kế toán (nền tảng Nhà nước)» vs sm-b2g.js:53 «Phần mềm kế toán Nhà nước» | 1 bảng tên + nhãn duy nhất (đặt trong D hoặc hằng chung), b2g được rút gọn NHƯNG giữ cùng từ khoá («Đã nối», «Gian hàng») | VÊNH VỪA | nhỏ |
| V3 | Nhãn «có hoá đơn» 2 màu | mobile.html:551 (`tag ok`) · mobile.html:1491 (`tag br`) | «có hoá đơn» = `ok` mọi nơi (đơn/booking cùng ý nghĩa) | VÊNH VỪA | 1 dòng |
| V4 | Thang đỏ hạn 30 ngày khác nhau giữa app hộ và Sổ trực | sm-domain.js:305 (todo khi còn ≤14 ngày) → mobile.html:241 vẽ crit · sm-b2g.js:382 (warn khi <7 ngày, còn lại br) | cùng 1 hàm mốc cho 2 bề mặt: ≤14 ngày = warn, ≤7 ngày hoặc âm = crit — hoặc cắt ngưỡng sm-domain.js:305 về ≤7 | **VÊNH NẶNG** (hộ thấy đỏ 14 ngày trong khi màn cán bộ vẫn xanh — việc b2g P6 «thấy ai đang kẹt» bị phá) | nhỏ: chỉnh 1 hằng + 1 điều kiện |
| V5 | crit cho trạng thái không phải lỗi/hành động | mobile.html:314 «hết hàng» · mobile.html:2430 «chưa trả lời» · sm-onboard.js:1780 «Đã quá ngày dự kiến» | hết hàng → gray; chưa trả lời >7 ngày → warn; chờ bên thứ ba quá hạn → warn + nhãn «cán bộ theo» | VÊNH VỪA (đỏ bị pha loãng, mất tín hiệu «đỏ = phải làm ngay») | nhỏ |
| V6 | Màn ketnoi có 3 tên | mobile.html:902 (menu «Kết nối kênh bán») · sm-onboard.js:1251 («Trạm kết nối») · sm-inbox.js:286 («Trạm dữ liệu») | tên màn = «Trạm kết nối»; menu đổi «Kết nối kênh bán» → «Trạm kết nối»; sm-inbox.js:286 sửa theo | VÊNH VỪA | nhỏ |
| V7 | Connector gọi 5 tên trước mặt hộ | sm-ai.js:313 «kênh» + sm-ai.js:332 «chỗ» · sm-onboard.js:1309 + mobile.html:940 «dịch vụ» · mobile.html:960 «đầu nối» | «kết nối/nối»; «kênh» chỉ cho kênh bán; «dịch vụ» chỉ khi nói với HÃNG (dịch vụ của SePay) | VÊNH VỪA | vừa: rải ~10 chỗ |
| V8 | Thẻ việc trùng nội dung + trùng tên họ hàng trên cùng màn | mobile.html:291+292 (tab Bán render CẢ sangNayCard LẪN alertsCard, cùng đọc D.deadlines) · tên «Việc cần để ý» 239 vs «Sáng nay cần để ý» 268 vs «Việc cần làm» web.html:112 | Bán chỉ giữ «Sáng nay cần để ý» (gom đủ); «Việc cần để ý» giữ ở Tiền/Lịch/Kho; web.html:112 đổi «Việc cần để ý» | VÊNH VỪA (hộ thấy 2 thẻ việc na na, tưởng 2 loại việc) | nhỏ: bỏ 1 dòng gọi hàm |
| V9 | Huỷ đơn 1 chạm không xác nhận | mobile.html:507-508 (bấm «Huỷ đơn và trả hàng về kho» chạy ngay) · đối lập mẫu: mobile.html:1562 (huỷ đặt phải lý do), 2148-2149 (huỷ hàng phải lý do), 1975-1976 (điều chỉnh hoá đơn phải lý do) | mọi huỷ nghiệp vụ: bắt buộc 1 ô lý do (kể cả 1 từ), nút `dan`, sau xác nhận mới chạy | **VÊNH NẶNG** (mất đơn + tồn kho chạy ngược chỉ vì chạm nhầm — đúng nhóm «hành động khó gỡ») | nhỏ: thêm 1 sheet hỏi lý do |
| V10 | Nút xoá không xác nhận + nằm cạnh nút lưu | mobile.html:1241-1242 (Lưu pri ↔ Xoá dan kề nhau 8px) · mobile.html:1259-1262 (bấm xoá chạy ngay) | nút huỷ/xoá luôn có 1 bước xác nhận; không đặt cạnh nút lưu chính | VÊNH VỪA | nhỏ |
| V11 | Tiền «… đ» có khoảng trắng, lệch chuẩn F.d | mobile.html:1835 · mobile.html:1878-1879 · mobile.html:1899-1900 — so với sm-core.js:29 và cách dùng toàn app (vd mobile.html:734) | cấm ghép tay `' đ'`; mọi tiền qua F.d/F.dShort | VÊNH VỪA | nhỏ: 5 chỗ |
| V12 | Chọn đáp án wizard: 2 câu có phản hồi, 3 câu im lặng | có pri: sm-onboard.js:1192, 1203-1204 · không: sm-onboard.js:1158 (ngành), 1179 (giấy tờ), 1217 (POS) | mọi ô chọn 1 chạm: chọn xong đổi `pri`/viền + dòng «Đã chọn: …» (mẫu câu kênh) | **VÊNH NẶNG** (wizard là màn ĐẦU TIÊN của người mù công nghệ — không thấy mình đã trả lời chưa là bấm lại/tắc) | nhỏ: thêm điều kiện class ở 3 map |
| V13 | 2 nút primary cùng sheet/màn | mobile.html:1520+1532 (sheet đặt chỗ) · sm-onboard.js:1203+1206 (câu doanh thu) | 1 primary = 1 con đường chính/hành vi khẳng định; hành động phụ = `btn` thường | VÊNH VỪA | nhỏ |
| V14 | 4 danh sách không có trạng thái rỗng | mobile.html:1418-1427 (Khách hàng) · mobile.html:592-604 (Tồn kho) · mobile.html:655-664 (Bảng kê đã lập) · mobile.html:1361-1374 (Chi theo loại/Các khoản chi) | mỗi list PHẢI có câu rỗng theo mẫu mobile.html:456/1486 + đường đi tiếp | VÊNH VỪA | nhỏ: 4 câu |
| V15 | Lỗi «máy móc» + 2 tên class cùng nghĩa xám | sm-onboard.js:1493 toast «Lỗi» · b2g.html:61 `.tag.no` vs mobile.html:79 `.tag.gray` | thông báo lỗi luôn nói việc gì hỏng + bước kế tiếp; chuẩn hoá `.tag.gray` (b2g alias no giữ tạm) | GỢN | nhỏ |
| V16 | «lượt bán» lạc loài giữa nền «đơn» | sm-onboard.js:2055 «Chốt lượt bán đầu tiên» · sm-onboard.js:2069 «Việc đầu tiên của nhà mình» (cùng khối, không dùng lại «lượt bán») · chuẩn «đơn»: mobile.html:208, 442 | «đơn đầu tiên» | GỢN | 1 chỗ |

## Bộ quy ước 1 trang — agent dựng màn mới đọc trước khi gõ chữ

**Tên gọi** — connector = «kết nối» (nối = động từ) · màn quản lý = «Trạm kết nối» · hộ = «nhà mình» (nghề/sổ) + «cô chú» (người) · khách trong tin = «anh chị», trong app = «khách» · bán = «đơn» · hoá đơn = «hoá đơn điện tử» · tiền ngân hàng về = «tiền về» · thu mua = «bảng kê» · nghĩa vụ = «hạn», thời điểm đo = «mốc» · việc app nhắc = «Việc cần để ý». Không đặt tên thứ hai cho khái niệm đã có tên.

**Màu tag** — `ok` xong rồi/khớp · `warn` để ý trong vài ngày, chưa mất gì · `crit` đã/sắp mất tiền, quá hạn, đứt — PHẢI ít và luôn hành động được · `br` định danh + đang tiến triển bình thường (làm dở, chờ duyệt) · `gray` chưa có/đã hết/không áp dụng. Một nhãn — một màu, toàn app.

**Mẫu tương tác** — xem chi tiết = sheet · nhập liệu = sheet, lỗi hiện `note crit` ngay trong sheet, không đóng · thành công = toast 1 câu nêu kết quả · mọi huỷ/xoá nghiệp vụ = lý do bắt buộc + nút `dan`, không bao giờ cạnh nút lưu chính · đi trang ngoài = sheet nói rõ đang sang trang AI + đường về · 1 sheet/1 màn tối đa 1 nút `pri`; ô chọn thể hiện trạng thái đã chọn bằng `pri`/viền + dòng đếm «Đã chọn».

**Định dạng** — tiền: `F.d()` «1.020.000đ» (không khoảng trắng); thẻ số nhỏ: `F.dShort()` «1,25tr» · ngày: `F.dmy()` (bảng, hạn) / `F.dm()` (chật chỗ) — cấm nối chuỗi ISO vào câu hiển thị · giờ `F.hm()` · % `F.pct()` «1,5%». Không tự chế format tay.

**Trạng thái rỗng** — mọi danh sách có câu rỗng kiểu «Chưa có X nào — làm Y đầu tiên, X tự vào đây» (mẫu: mobile.html:456, 1486; sm-b2g.js:611).

## Top-8 chỗ nên sửa trước

1. **V12** — 3 câu wizard thêm phản hồi đã chọn (người mù công nghệ ở màn đầu đời).
2. **V9** — huỷ đơn thêm sheet lý do (duy nhất hành động khó gỡ còn 1 chạm).
3. **V1** — thống nhất `dang_dang_ky`/`cho_duyet` = br cả Trạm lẫn Sổ trực (đúng PLAN B.2).
4. **V4** — thống nhất thang đỏ hạn 30 ngày app hộ ↔ Sổ trực (một hàm mốc, một ngưỡng).
5. **V6** — menu mobile.html:902 đổi «Trạm kết nối» + sm-inbox.js:286 bỏ «Trạm dữ liệu».
6. **V8** — tab Bán bỏ 1 trong 2 thẻ việc trùng nguồn (giữ «Sáng nay cần để ý»).
7. **V3+V5** — rà 4 nhãn sai màu («có hoá đơn» br→ok; hết hàng/chưa trả lời đỏ→xám/vàng).
8. **V11 + ngày ISO sm-domain.js:302** — 5 chỗ `' đ'` về F.d; chuỗi hạn 30 ngày bọc F.dmy trước khi ghép vào ten.

BUILD-AGENT-DONE R4 16
