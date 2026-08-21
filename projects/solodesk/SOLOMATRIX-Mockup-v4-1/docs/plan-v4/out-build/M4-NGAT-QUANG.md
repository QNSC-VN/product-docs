# M4 — ĐỜI THẬT CẮT NGANG: quay lại thì còn nguyên hay mất trắng?

Soát vòng đời PHIÊN dùng trên điện thoại: khách gọi giữa lúc đang bán, chuyển app rồi quay lại, khoá màn,
trình duyệt tự tải lại tab, bấm Back, nhiều tab, PWA mở lại, nhắc việc khi không mở app.
**Không sửa code** — chỉ đọc và chứng minh bằng `file:dòng`. Mọi kết luận «mất»/«còn» đều chỉ ra chỗ có
hoặc không có `SM.save()` (kho bền `smv3:db` qua `localStorage`, `js/sm-core.js:117-120`).

Bản mobile.html được đọc: 2586 dòng, thay đổi lần cuối 20/08 18:28 (đang được V1/W6 sửa song song —
trong file đã thấy marker `V1 (D-#10)` mobile.html:679, `W6 (B.5)` mobile.html:2572, `W0 #1` mobile.html:282).
Số dòng dẫn dưới đây lấy theo đúng bản đã đọc; nếu agent khác Edit sau thời điểm đọc thì số dòng có thể xê dịch
vài dòng, tên hàm/neo không đổi.

## Cách đọc kết luận nhanh

- **CHẮN** — mất dữ liệu hoặc mất việc đang làm (thiệt hại thật cho hộ).
- **GẮT** — không mất dữ liệu bền nhưng phải làm lại từ đầu / mất dấu đang làm gì.
- **GỢN** — phiền vặt, dễ tự phục hồi.

Nền tảng đã chứng minh trước (dùng chung cho mọi dòng dưới):

- Kho bền: `SM.save()` ghi toàn bộ DB vào `localStorage['smv3:db']` — **js/sm-core.js:117-120**; `SM.ui()`
  đọc `smv3:ui` chỉ chứa `{tenant, mode}` (+ cờ `obDaChao`, `obConMa` v4) — **js/sm-core.js:127-133**.
- Hàng đợi gửi bền qua tải lại: `smv3:queue` — **js/sm-core.js:162-182**.
- Trạng thái màn hình app: `let TAB='ban', cart=[], chat=[], donLoc='all'` — **BIẾN RAM**,
  **mobile.html:189**. Đây là gốc của phần lớn mất mát dưới đây.

---

## 1. Việc dở có được giữ không — từng luồng

### a) Giỏ hàng đang bán dở (`cart`) — MẤT TRẮNG · CHẮN

- `cart` là biến RAM: **mobile.html:189**. Thêm món chỉ `cart.push`/`c.qty++` rồi `render()`, không có
  `SM.save()` ở giữa: **mobile.html:355, 358-362** (cả đường «Nói thay gõ» điền giỏ cũng chỉ push).
- `SM.save()` duy nhất của luồng này chạy khi HOÀN TẤT («Khách đã trả — xuất hoá đơn»):
  **mobile.html:382-387** (`SM.save();cart=[];closeSheet()`).
- Đổi chân dung hộ/chế độ cũng xoá sạch `cart` và `chat`: **mobile.html:2566**.
- **Hậu quả thật**: cô chủ đang bấm 8 món cho khách đứng ở quầy, điện thoại hiện thoại đến — khoá màn
  nghe, quay lại trình duyệt đã tải lại tab: giỏ 0 món, phải nhập lại từng món trước mặt khách. Với hộ
  bán dở từ giờ cao điểm, đây là khoảnh khắc «máy làm phiền đúng lúc bận nhất» — đúng cái thời điểm người
  ta quyết định thôi dùng.

### b) Wizard onboarding đang ở câu 3 — CÒN (chuẩn nhất app)

- Mỗi câu trả lời ghi thẳng tenant + save ngay: `traLoi(t, cau, giaTri)` → `SM.save()` —
  **js/sm-onboard.js:316-324**; câu đang xem lưu `ob.ob2.cau` + `SM.save()` — **js/sm-onboard.js:1039-1041**.
- «Để sau» giữa chừng ghi đúng màn + câu dở: `boQuaTam(t, man)` → `SM.save()` —
  **js/sm-onboard.js:242-247**; mở lại đúng chỗ: `moLai(t)` — **js/sm-onboard.js:251-252**, nút
  «Đang làm dở — mở tiếp» ở Trạm — **js/sm-onboard.js:1297, 1782, 1869**.
- Tải lại giữa câu 3 → câu trả lời câu 1-2 còn nguyên, `ob2.cau` còn.
- **Nhưng có một GẮT bám theo** (dòng 3 của bảng tổng): sau khi bị chào 1 lần (cờ `obDaChao` ghi
  TRƯỚC khi mở wizard — **mobile.html:2572-2575**), lần mở lại app đứng ở tab Bán; thẻ «Bắt đầu —
  chừng 5 phút» chỉ hiện khi hộ TRỐNG (chưa có hàng, chưa có đơn) — **mobile.html:282-290**. Hộ CD1 đã
  có sẵn hàng hoá nên làm wizard dở mà bị cắt ngang → quay lại KHÔNG thấy dấu «nhà mình đang làm dở»
  ở màn đầu; phải biết mò sang tab Kết nối (Trạm) mới có nút mở tiếp.

### c) Form bảng kê thu mua đang nhập dở — MẤT TRẮNG · CHẮN (nặng nhất về tiền)

- Toàn bộ giá trị nằm trong DOM (`#pSeller`, `#pCccd`, `#pAddr`, `#pSku`, `#pQty`, `#pPrice`), chỉ được
  đọc lúc bấm Lưu: **mobile.html:692-694**. Cờ «đã chụp ảnh biên nhận»/«đã ký nhận tiền» là biến
  **closure** `let photo=false,sign=false`: **mobile.html:675-678** — không xuống được RAM khác.
- «Nói thay gõ» cho thu mua cũng chỉ ĐIỀN form, không tự lưu: **mobile.html:683-690**.
- Chỉ khi Lưu mới có nghiệp vụ + hàng đợi: **mobile.html:705** (`D.addPurchase` + `SM.enqueue`).
- **Hậu quả thật**: chú mua ở vườn, đã điền tên người bán + CCCD + ký tiền, điện thoại reo — hết pin
  hoặc chuyển sang Zalo bị tải lại tab: mất trắng phiếu, chụp lại, ký lại, hỏi lại người bán — đúng
  chỗ «bảng kê là chứng từ thay hoá đơn» mà app tự nói ở **mobile.html:703**.

### d) Sheet nhắc nợ đang soạn — mất PHẦN SỬA (bản nháp gốc còn) · GẮT (nhẹ)

- Lời nhắn nằm trong `textarea#nn-noi` trong sheet: **mobile.html:2324**; chỉ khi bấm «Gửi qua Zalo»
  mới lưu (`O.guiNhacNo` → `SM.save()` — **js/sm-ops.js:342, 358**): **mobile.html:2330-2334**.
- Bấm «Đóng», chạm nhầm nền tối (**mobile.html:197**), hoặc bị tải lại → mất phần hộ đã sửa tay
  (thêm ngày hẹn, đổi xưng hô…). Mở lại thì trợ lý soạn lại bản nháp MỚI cùng nội dung gốc
  (`O.soanNhacNo` — **js/sm-ops.js:307**) — thiệt hại là công sửa, không phải số nợ (khoản nợ nằm
  bền trong tenant).
- Ghi nhận điều tốt đã có: gửi lỗi chỉ toast, sheet không đóng, nội dung chưa mất — comment tự-sửa
  **mobile.html:2298** — đúng trong phạm vi sheet còn sống.

### e) Đơn đang chọn hãng vận chuyển — đơn CÒN, việc đang làm GỢN

- Đơn nằm bền trong `t.orders` (tenant trong `smv3:db`). Sheet chọn hãng là DOM thuần:
  **mobile.html:489-494**; mất mạng/khoá màn giữa lúc đang xem → mở lại sheet từ đầu (2 chạm).
- Nếu ĐÃ bấm chọn hãng thì bền ngay: `D.ship()` → `SM.save()` — **js/sm-domain.js:798-813**
  (save ở :809). Chuyển trạng thái đơn cũng bền: `advanceOrder` → `SM.save()` —
  **js/sm-domain.js:818-832** (save ở :829).
- Mức GỢN: thiệt hại = bấm lại vài nút, không mất số liệu.

### f) Hội thoại đang gõ trả lời khách — 2 trường hợp, khác nhau một trời một vực

- **Hội thoại với khách (màn `hoithoai`)**: tin nhắn lấy từ `D.messages(t)` — bền trong tenant
  (**mobile.html:2414-2440**); bản trả lời đang gõ nằm trong `textarea#tl-noi` — **mobile.html:2456-2458**;
  gửi xong lưu bền. Bị cắt ngang giữa lúc gõ → mất phần sửa của hộ, bản gợi ý của trợ lý soạn lại được
  (`D.goiYTraLoi` — **mobile.html:2455**). Mức GỢN.
- **Hội thoại với TRỢ LÝ (tab `ai`)**: `chat` là biến RAM — **mobile.html:189**; mỗi hỏi/đáp chỉ
  `chat.push(AI.ask(...))` — **mobile.html:848-851**; không có `SM.save()` nào trong luồng này.
  Tải lại tab → **mất TOÀN BỘ lịch sử hỏi đáp với trợ lý**, kể cả câu hỏi quan trọng đã trả lời xong
  sáng nay. Ô đang gõ dở `#q` cũng mất. Mức GẮT.

### g) Bổ sung: sheet «Nói thay gõ» đang xác nhận từng dòng — GỢN

- Các dòng đã bấm «Xác nhận» nằm trong mảng `chon` closure — **js/sm-nen.js:329-347**; bị cắt giữa chừng
  → mất các dòng đã lấy, mở lại sheet hiện lại kịch bản y nguyên (mô phỏng), bấm lại vài nút. Không mất
  nghiệp vụ (sheet không tự ghi sổ — đúng thiết kế **js/sm-nen.js:302**).

## 2. Trình duyệt tự tải lại tab (Android máy yếu) — về màn nào?

- Boot luôn khởi động `TAB='ban'` (**mobile.html:189**) rồi `SM.db();render()` — **mobile.html:2571**.
  Không có dòng nào đọc lại TAB cũ: kho `smv3:ui` chỉ `{tenant, mode}` — **js/sm-core.js:127-133**;
  toàn bộ lần grep `smv3:ui` trong mobile.html chỉ thấy ghi `obConMa` (**:2529**) và `obDaChao` (**:2574**).
- Ngoại lệ duy nhất: tenant chưa kích hoạt lần đầu → điều hướng `obkichhoat` đúng 1 lần —
  **mobile.html:2572-2575**.
- Kết luận: người đang ở giữa «Hội thoại» soạn trả lời, hoặc đang ở «Kết nối» làm dở, bị trình duyệt
  tải lại → **ném về tab Bán**, không có gợi nhớ «cứ làm tiếp việc cũ». Dữ liệu bền thì còn (trừ cart/
  chat/form ở mục 1), nhưng NGƯỜI mất dấu. `sessionStorage` chỉ dùng cho 1 lần hiện gợi ý cài PWA —
  **mobile.html:2576-2578** — không lưu trạng thái việc.

## 3. Nút Back Android / vuốt back iOS — THOÁT HẲN APP, không lùi màn · CHẮN

- Grep toàn `mobile.html`: `history|pushState|hashchange|popstate|beforeunload|pagehide|visibilitychange`
  → **0 kết quả**. App là trang đơn, đổi màn bằng biến `TAB` (**mobile.html:2530** `else TAB=di`),
  URL không đổi.
- Hệ quả: Back không có gì để «lùi» → trình duyệt thoát app (PWA standalone mở từ màn hình chính:
  `display:'standalone'` — **manifest.webmanifest:9**; history trống) hoặc nhảy về trang web trước đó
  (mở trong tab trình duyệt thường). Cả hai đều rời app.
- Với người mù công nghệ, phản xạ duy nhất khi thấy «sai màn» là bấm Back — và app biến mất. Đây là
  lỗi phá niềm tin lớn nhất của nhóm này, vì nó xảy ra VỚI CẢ NGƯỜI DÙNG GIỎI.
- Không có `beforeunload`/`pagehide` → cũng không có cơ hội lưu nháp khi hệ thống đóng tab.

## 4. Sheet và lớp phủ

Cơ chế: `sheet(title,html,after)` — **mobile.html:194-199**; `closeSheet()` — **mobile.html:199**.

| Câu hỏi | Kết quả | Bằng chứng |
|---|---|---|
| Vuốt xuống để đóng? | **Không** — listener duy nhất là `click` | mobile.html:197 (chỉ `w.addEventListener('click',…)`) |
| Bấm ra ngoài (nền tối) đóng? | **Có** | mobile.html:197 (`e.target===w`) |
| Nút «Đóng» hiển thị? | **Có** (mọi sheet đều có nút `data-x` ở đầu) | mobile.html:196 |
| Chồng sheet lên sheet? | **Không** — mở sheet mới tự đóng sheet cũ (`sheet()` gọi `closeSheet()` trước tiên) | mobile.html:194 |
| Mở sheet rồi bấm Back? | **Không đóng sheet — thoát app luôn** (sheet không tạo history entry, không popstate) | mobile.html:194-199 + mục 3 |
| Sheet sống qua tải lại? | **Không** — sheet là node DOM `document.body.appendChild` | mobile.html:198 |

Ghi chú: «không chồng sheet» phần lớn là chủ đích tốt (luồng đơn giản, hết bị mất sheet cha), nhưng có
tác dụng phụ ở mục 6-d: đóng sheet là mất nội dung đang soạn vì không có tầng nháp nào giữ.

## 5. Nhiều tab / nhiều thiết bị

- **Cùng máy, 2 tab**: có bus thật — listener `storage` cập nhật DB + phát sự kiện
  (**js/sm-core.js:287-293**), mobile.html nghe `db:external` để render lại (**mobile.html:2565**) và
  `ui:change` (**:2566**). Nên đổi tenant/mạng ở tab này, tab kia thấy gần như ngay. **NHƯNG**:
  `SM.save()` ghi **CẢ CỤM DB từ biến RAM của tab mình** (**js/sm-core.js:117-120**); không có số
  phiên bản, không merge. Hai tab cùng sửa trong khoảng thời gian ngang nhau (ví dụ cùng thu tiền hai
  quầy) → **ai save sau cùng đè toàn bộ**, thay đổi của tab kia biến mất không tiếng động. Mức GẮT
  (demo 1 tab là an toàn; 2 tab cùng sửa là mất dữ liệu thật).
- **Hai thiết bị (điện thoại + máy kế toán)**: `smv3:*` chỉ là `localStorage` — mỗi máy một kho riêng,
  không có lớp đồng bộ chéo máy nào trong mockup (grep toàn lõi: chỉ `localStorage`, hàng đợi
  `drain()` là mô phỏng nội bộ — **js/sm-core.js:184-215**). Hai máy = hai sổ riêng từ cùng seed.
  Đây là giới hạn phải nói thật (mục «nói thật» dưới).

## 6. PWA vừa thêm — cache CÓ THỂ VÊNH, người dùng không có nút «tải bản mới»

Chiến lược trong `sw.js`:

- Trang HTML: **mạng trước**, khi mất mạng mới trả bản đã lưu — **sw.js:65-79**.
- `js/` và tài nguyên tĩnh: **CACHE TRƯỚC** — đã có trong kho là dùng, không bao giờ ra mạng lấy bản
  mới — **sw.js:83-95**. Kho cache đặt tên cứng `BO_NHO='solomatrix-v4-1'` — **sw.js:8**.

Hệ quả khi `js/` đổi mà `BO_NHO` chưa đổi (đúng tình huống các agent đang sửa song song tonight):

1. Trình duyệt có mạng → HTML mới về, nhưng script vẫn là bản cũ từ cache → HTML v4 tham chiếu hàm
   chưa có trong js cũ. Ví dụ cụ thể: `VIEWS` đăng ký `ketnoi:[ON.viewTram,…]`
   (**mobile.html:2508**) — nếu js cũ thiếu `viewTram`, mảng là `[undefined,undefined]`, render tự
   suy về `'ban'` nhờ phép phòng hựng `if(!VIEWS[TAB]||!VIEWS[TAB][0]) TAB='ban'`
   (**mobile.html:2535**) — không trắng màn, nhưng màn Kết nối / wizard mới «biến mất» một cách
   khó hiểu. Tệ hơn nếu view cũ gọi hàm helper mới → lỗi runtime ngay trong màn.
2. **Không có đường «tải bản mới» cho người dùng**: không có nút nào, không có cơ chế thông báo bản
   mới (grep `registration.update|SKIP_WAITING|message` trong mobile.html → không có; `sw.js` chỉ
   `skipWaiting()` lúc install — **sw.js:43** — mà service worker mới chỉ được cài khi chính byte
   `sw.js` đổi, tức khi người làm web tăng `BO_NHO` — lời ghi trong comment **sw.js:12**).
   Trước giờ đó, người dùng chỉ có 2 lựa chọn: chờ, hoặc gỡ app cài lại (xoá cache tay qua trình duyệt).
3. Trạng thái dữ liệu thì AN TOÀN: service worker không đụng `localStorage` (ghi rõ **sw.js:1-5**),
   nên «vênh» chỉ là mã + giao diện, không phải sổ sách.

## 7. Chuông và nhắc — lời nhắc có tới được khi KHÔNG mở app không?

**Không.** Bằng chứng:

- Grep toàn repo (`mobile.html`, `sw.js`, `manifest.webmanifest`, `js/*.js`) với
  `Notification|pushManager|showNotification|requestPermission` → **0 kết quả**. Không có web push,
  không có thông báo hệ thống, service worker không có handler `push`/`notificationclick`.
- Thẻ «Sáng nay cần để ý» (**mobile.html:268**) là hàm tính lại từ kho MỖI LẦN MỞ APP
  (`D.deadlines` + hộp thư + hàng đợi — **mobile.html:255-274**) — mở app mới thấy.
- «Ngân sách 1 tin/ngày/hộ» (`ON.duocDayTin` — **js/sm-onboard.js:468-469**) là quy tắc ĐẨY TIN
  Zalo mô phỏng trong hộp thư in-app (chốt P9: «hộp thư in-app») — tin «đi» nằm trong
  `D.messages(t)` của tenant, KHÔNG ra khỏi máy.

Đề xuất trình bày trung thực với hội đồng: nói rõ «trong bản trình diễn, mọi lời nhắc nằm bên trong
app; bản thật cần kênh đẩy thật (Zalo OA / thông báo hệ thống) và hạ tầng máy chủ — đó là hạng mục
riêng, chưa hứa». Đặc biệt KHÔNG demo «chuông nhắc» bằng cách giả thông báo — sẽ tạo kỳ vọng không
đúng.

---

## Bảng tổng — 18 tình huống cắt ngang

| # | Tình huống cắt ngang | Hậu quả (mất gì) | Bằng chứng | Mức | Sửa đề xuất |
|---|---|---|---|---|---|
| 1 | Đang bán dở giỏ 8 món, khách gọi → khoá màn/kill tab/tự reload | Mất trắng giỏ, nhập lại trước mặt khách | mobile.html:189, 355, 360, 386 | **CHẮN** | Lưu `cart` vào `smv3:ui` mỗi lần render; khôi phục ở boot; xoá khi hoàn tất đơn |
| 2 | Wizard câu 3, thoát giữa chừng | Còn nguyên câu trả lời + đúng câu dở | sm-onboard.js:316-324, 1039-1041, 242-247 | Còn | (đã tốt) |
| 3 | Hộ có sẵn hàng làm wizard dở, reload → đứng tab Bán | Không thấy đường «làm tiếp» ở màn đầu, phải mò sang Trạm | mobile.html:282-290, 2572-2575; sm-onboard.js:1782, 1869 | **GẮT** | Khi `onboarding` dở, hiện 1 thẻ mỏng «Nhà mình đang làm dở bước N — làm tiếp» đầu viewBan (không chỉ hộ trắng) |
| 4 | Form bảng kê thu mua nhập dở (đã chụp ảnh, đã ký) | Mất trắng phiếu + 2 cờ chứng từ | mobile.html:675-678, 692-694, 705 | **CHẮN** | Nháp tự lưu `localStorage('smv3:nhap-thumua')` mỗi `input`; khôi phục khi vào màn mua; xoá khi Lưu |
| 5 | Sheet «Nói thay gõ» đã xác nhận 3/5 dòng | Mất các dòng đã bấm xác nhận (kịch bản y nguyên, bấm lại) | sm-nen.js:329-347 | GỢN | Chấp nhận cho demo; bản thật lưu phiên nói |
| 6 | Sheet nhắc nợ đang sửa lời | Mất phần sửa tay; bản nháp gốc soạn lại được | mobile.html:2324, 2329-2335; sm-ops.js:307, 342, 358 | GẮT (nhẹ) | Lưu giá trị textarea vào nháp theo `khoanId` mỗi lần gõ (input event) |
| 7 | Hội thoại hộp thư đang gõ trả lời khách | Mất phần sửa; tin nhắn + bản gợi ý còn | mobile.html:2455-2458 | GỢN | Nháp `#tl-noi` theo `m.id`, giống dòng 6 |
| 8 | Đơn đang mở sheet chọn hãng vận chuyển | Đơn còn nguyên; mất đúng sheet đang xem | mobile.html:470-503; sm-domain.js:798-813, 818-832 | GỢN | Chấp nhận |
| 9 | Trợ lý: lịch sử hỏi đáp sau reload | Mất TOÀN BỘ hội thoại với trợ lý + ô đang gõ | mobile.html:189, 848-851 | **GẮT** | Lưu `chat` vào tenant (`t.hoiThoaiTroLy`) qua `SM.save()` sau mỗi lượt hỏi |
| 10 | Trình duyệt tự tải lại tab | Về tab Bán, mất dấu màn đang mở | mobile.html:189, 2571; sm-core.js:127-133 | **GẮT** | Lưu `TAB` vào `smv3:ui` ở `bindNhac` (mobile.html:2530), đọc lại lúc boot (:2571) |
| 11 | Bấm Back Android / vuốt back iOS | Thoát hẳn app (không lùi màn) | grep `history\|pushState\|hashchange\|popstate` = 0; mobile.html:2530 | **CHẮN** | `history.pushState({tab:TAB},'','#'+TAB)` mỗi lần đổi màn + `popstate` lùi màn |
| 12 | Đang mở sheet bấm Back | Không đóng sheet — thoát app luôn | mobile.html:194-199 + dòng 11 | **CHẮN** | `popstate` ưu tiên: có sheet → đóng sheet; không → lùi TAB |
| 13 | Thói quen vuốt xuống để đóng sheet | Không có; phải bấm nền/nút Đóng | mobile.html:197 (chỉ listener click) | GỢN | Thêm nút tay cầm «⌃ Kéo xuống để đóng» + touchmove quá ngưỡng → closeSheet |
| 14 | Mở sheet B từ sheet A | A tự đóng (không chồng) — ngữ cảnh A mất | mobile.html:194 | GỢN | Giữ nguyên (luồng đơn giản là chủ đích tốt); chỉ cần nháp theo dòng 6/7 |
| 15 | 2 tab cùng máy, cùng sửa gần đồng thời | Tab save sau đè TOÀN BỘ thay đổi của tab kia (không merge) | sm-core.js:117-120, 287-293 | **GẮT** | Demo mở 1 tab/hộ; về lâu: khoá optimistic (số phiên bản + từ chối ghi đè mờ mịt) |
| 16 | Điện thoại + máy kế toán (2 thiết bị) | KHÔNG đồng bộ chéo máy — mỗi máy một sổ riêng | sm-core.js:14 (chỉ localStorage), 184-215 (queue mô phỏng) | NÓI THẬT | Trình bày giới hạn; bản thật cần tài khoản + máy chủ đồng bộ |
| 17 | PWA mở lại sau khi `js/` đã đổi | HTML mới + js cũ (cache-first) → màn mới «biến mất»/lỗi runtime; không có nút «tải bản mới» | sw.js:8, 12, 65-95; mobile.html:2508, 2535, 2583 | **GẮT** | Thêm mục menu «Có bản mới — tải lại»: `registration.update()` + xoá `caches` + reload; ghi quy trình tăng `BO_NHO` cạnh sw.js:12 |
| 18 | Không mở app cả ngày — lời nhắc có tới không? | KHÔNG — không có Notification/push nào trong repo | grep toàn repo = 0; mobile.html:268; sm-onboard.js:468-469 | NÓI THẬT | Nói rõ với hội đồng: nhắc trong-app; đẩy thật là hạng mục riêng có server |

## Top-8 sửa trước nhất (đề xuất cho đợt thi công kế tiếp, mockup tĩnh làm được cả)

1. **Lưu + khôi phục `TAB`** qua `smv3:ui` (đổi ở `bindNhac` mobile.html:2530, đọc ở boot :2571) —
   nhỏ nhất, hết nạn «ném về tab Bán» (dòng 10).
2. **Back không thoát app**: `pushState` theo màn + `popstate` lùi màn, đóng sheet trước
   (dòng 11, 12) — sửa một chỗ trong `bindNhac`/`sheet()`, hiệu ứng niềm tin lớn nhất.
3. **Giỏ cart bền**: lưu `smv3:ui.cart` mỗi render của bindBan, khôi phục boot, xoá khi hoàn tất
   (dòng 1) — hết mất trắng giữa quầy.
4. **Nháp form thu mua** (`smv3:nhap-thumua`, kèm cờ photo/sign) (dòng 4) — trọng tiền nhất.
5. **Lịch sử trợ lý lưu vào tenant** (dòng 9) — một `SM.save()` sau mỗi `chat.push`.
6. **Thẻ «đang làm dở» đầu viewBan cho MỌI hộ có onboarding dở**, không chỉ hộ trắng (dòng 3).
7. **Nút «Có bản mới — tải lại»** trong menu Thêm + quy trình `BO_NHO` (dòng 17) — cứu demo trên
   máy hội đồng đã cài PWA từ hôm trước.
8. **Nháp textarea** cho sheet nhắc nợ và trả lời khách theo id đối tượng (dòng 6, 7).

## Thứ phải nói thật với hội đồng (giới hạn mockup tĩnh — không giấu, không hứa quá)

1. **Không có nhắc thật khi app đóng** — mọi «Sáng nay cần để ý», «1 tin/ngày» chỉ tồn tại trong app;
   bản thật cần Zalo OA/đẩy hệ thống + máy chủ (P9 đã chốt mô phỏng in-app).
2. **Không có đồng bộ nhiều thiết bị** — dữ liệu nằm trong trình duyệt của chính máy đó; đổi máy/máy
   khác là sổ khác. Có sẵn đường xuất JSON/CSV (`SM.exportTenant` — sm-core.js:256-284) — nên demo
   đường xuất này như lời cam kết dữ liệu thuộc về hộ.
3. **Dữ liệu sống trong trình duyệt** — xoá dữ liệu trình duyệt = mất sổ (demo có nút nạp lại mẫu,
   mobile.html:935); nói rõ khi ai đó «cài thử rồi gỡ».
4. **2 tab cùng sửa có thể đè nhau** — demo nên mở một tab một hộ.
5. **«Nói thay gõ» là mô phỏng** theo kịch bản ghép từ sổ thật (nhãn đã in sẵn trong sheet,
   sm-nen.js:309); hàng đợi «gửi khi có mạng» cũng là mô phỏng nội bộ, không có máy chủ thật.
6. **PWA bản demo tự cập nhật không tức thì** — cần người làm web tăng phiên bản bộ nhớ; nút «tải
   bản mới» ở top-8 sẽ đỡ, nhưng với hội đồng nên nói thẳng «bản trên máy anh/chị giữ tới khi bấm
   tải lại».

## Phạm vi công việc của M4

- Không sửa bất kỳ file nào ngoài báo cáo này (đúng đề: «KHÔNG sửa code»).
- Tự soát: mọi kết luận đều dẫn `file:dòng` đã đọc trực tiếp; các khẳng định «không có» đều xuất phát
  từ grep có kết quả rỗng (dẫn cụ thể từ khoá + phạm vi grep trong từng mục); không đoán nguyên nhân
  ngoài những gì đọc được.
- Chưa làm được: không chạy được app thật trên điện thoại để xác nhận hành vi Back từng loại máy
  (iOS/Android từng phiên bản) — phần đó kết luận từ code (không có history API) chứ không phải từ
  thử máy; nếu cần đo thật, phải dựng trên điện thoại và bấm thử — ngoài phạm vi mockup tĩnh ở máy này.

BUILD-AGENT-DONE M4 18
