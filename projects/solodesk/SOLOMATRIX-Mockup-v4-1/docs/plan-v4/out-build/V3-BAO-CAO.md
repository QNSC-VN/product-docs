# V3 — 48 HỘ MÔ PHỎNG PHẢI SINH ĐƯỢC VIỆC CHO CÁN BỘ — BÁO CÁO BUILD

Agent: V3 · File sở hữu: `js/sm-b2g.js` + `js/sm-seed-b2g.js` (chỉ 2 file này, Edit từng chỗ, không Write đè).
Đồng hồ demo neo `SM.CLOCK.today = '2026-08-17'` (sm-core.js) — mọi hạn/số ngày suy từ nó, xác định.

Báo cáo này gồm **2 lượt**: lượt 1 (22 thay đổi) dựng phần chính; lượt 2 (6 Edit, mục 3) là lượt SOÁT LẠI —
đã tìm và vá được 1 lỗi thật mà lượt 1 bỏ sót, và siết lại mấy con số lượt 1 nói quá.

---

## 1. Lượt 1 — 22 thay đổi (14 seed + 8 b2g)

### `js/sm-seed-b2g.js` — 14 Edit
| # | Vị trí | Nội dung |
|---|---|---|
| 1 | :21 | Khoá cache → `'smv3:b2g-hos-v2'` — máy đang giữ bản cũ (chỉ `ketNoiTom`) tự sinh lại |
| 2 | :53–55 | Hằng nhóm connector: `MA_NEN` [bank, zalooa] · `MA_THEM` [pos, shopee, tiktok, ghn] · `MA_LUAT` [hddt, cts, etax] |
| 3 | :58–64 | `LY_DO_HOAN` (3 câu) + `LY_DO_BO` + `LY_DO_LOI` — chữ đời thường, không tên người thật |
| 4 | :67 | `congNgay(iso, n)` cộng ngày lịch UTC-an toàn (cùng nghĩa `SM.dayOffset`) |
| 5 | :90 | `HOM_NAY` đọc `SM.CLOCK.today`, fallback `'2026-08-17'` |
| 6 | :111–118 | Bảo hiểm vòng 1: ép ≥2 hộ `dang_noi` có `vuotNguong`; 2 cờ `coHoan`; hộ `dang_noi` đầu tiên `dotOA = DOT_OA[0]` + `epChoDuyet` |
| 7–12 | :126–218 | Vòng 2 sinh `ketNoi` dict cùng shape hộ thật `{trangThai, batDauLuc?, hanDuKien?, hoSoDaNop?, lyDo?}`; danh mục theo ngành + LUẬT chỉ cho hộ >1 tỷ (B.7); nhánh `dang_noi` / `du_toi_thieu`+`xong_viec_dau` / còn lại; `viecHoanLuat` cùng shape `ob.viecHoanLuat`; `ketNoiTom` ĐẾM LẠI TỪ dict (W5/W9 đọc tom không phải đổi); `phutTuKichHoat` |
| 13 | :224–229 | Vòng 3 — `vuotLuc` rải cố ý theo HOM_NAY: 2 hộ quá hạn (−3/−9), 2 hộ vàng (2/5), còn lại 12+ |
| 14 | :230–232 | Hộ vượt ngưỡng còn lại: `vuotLuc` lùi 6–18 ngày |

### `js/sm-b2g.js` — 8 Edit
| # | Vị trí | Nội dung |
|---|---|---|
| 1 | :117–146 | **`chuanHoaHo(g)` MỚI** — MỘT hàm chuẩn hoá cho 2 loại hộ → `{that, dayDu, id, ma, ten, diaBan, nganh, buoc, canBo, cungCanBo, vuotLuc, ketNoi, hoanLuat, nhatKy, phut, dot, onb}` |
| 2 | :148–176 | `hoThat()` → adapter mỏng rồi gọi `chuanHoaHo` |
| 3 | :178–205 | `hoMoPhong()` → adapter mỏng rồi gọi `chuanHoaHo` — hết 2 nhánh shape song song lệch nhau (lỗ W9 gốc) |
| 4 | :412–436 | `viecCuaHo` — nhánh hoãn đọc `h.hoanLuat`, khoá `h.id+'\|hoan\|'+v.ma` |
| 5 | :440–458 | `phanBoPhut` phân nhóm theo `h.cungCanBo` (trước theo `h.canBo` → cột «tự làm» trống sai) |
| 6 | :703–722 | `khungHoanLuat` đọc `h.hoanLuat` (code cũ đọc `trangThai==='hoan'` — không đường nào ghi) |
| 7 | :653–680, :781–811 | `khungHan30` thêm tag ok «đã đăng ký hoá đơn điện tử»; `sheetHo` ghiChu thêm nhánh hoãn |
| 8 | :966–970 | Export `chuanHoaHo` vào `SM.b2g` |

---

## 2. Lượt 2 — soát lại: 1 lỗi THẬT đã vá + 2 con số lượt 1 nói quá

### 2.1 Lỗi thật: trạng thái `chua_co_tk` là chữ chết — KHÔNG đường nào sinh ra

Đề bài liệt kê 7 trạng thái phải sinh: `chua_hoi | chua_co_tk | dang_dang_ky | cho_duyet | da_ket_noi | loi | bo_qua`.
Soát lại thì **`chua_co_tk` chỉ tồn tại ở ô ĐẾM, không có dòng nào đặt nó**:

| Nơi | Có gì | Thực tế |
|---|---|---|
| `sm-domain.js:981` | nằm trong `HOP_LE` | hợp lệ |
| `sm-b2g.js:64` | `knThe` có thẻ warn «Chưa có tài khoản» | **không hộ nào chạm tới** |
| `sm-seed-b2g.js:192` | ô `chua_co_tk: 0` trong `ketNoiTom` | **luôn bằng 0** |

Nghĩa là cán bộ dẫn khoá không bao giờ thấy tình huống «hộ chưa có tài khoản kênh này» — đúng loại việc
phải hướng dẫn hộ đăng ký, khác hẳn «chưa hỏi». Chỉ sinh 6/7 mức.

**Cách vá (6 Edit, đều trong `js/sm-seed-b2g.js`):**

| # | Vị trí | Nội dung |
|---|---|---|
| 1 | :11–15 | Ghi chú đầu file: nêu rõ lỗ `chua_co_tk` và cách vá |
| 2 | :21 | Khoá cache `-v2` → **`'smv3:b2g-hos-v3'`** (bảng sinh đã đổi, không để bản v2 kẹt lại) |
| 3 | :65 | Thêm `LY_DO_CHUA_TK` = «Hộ chưa có tài khoản kênh này — cán bộ cần hướng dẫn hộ đăng ký trước» |
| 4 | :116–124 | Bảo hiểm (d): `soChuaTk` ép **2 hộ `dang_noi` đầu** mang cờ `epChuaCoTk` — không trông may rủi LCG |
| 5 | :156–160 | `ttThem` thay **tại chỗ** 1 trong 3 ô `'chua_hoi'` thành `'chua_co_tk'` (GIỮ ĐÚNG 7 phần tử) + `daChuaTk` |
| 6 | :171–179 | Nhánh việc-thêm: hộ có cờ thì kênh thêm ĐẦU TIÊN thành `chua_co_tk` kèm lý do; **vẫn rút `r()` đúng 1 lần** |

Hai chi tiết cố ý, để bảng 48 hộ không bị xáo:
- `pick(r, arr)` rút `r()` **một lần rồi lấy theo chỉ số** — đổi ĐỘ DÀI mảng là remap toàn bộ hộ phía sau.
  Vì vậy thay **tại chỗ** (7 → vẫn 7 phần tử), chỉ hộ nào trước đây rơi đúng ô đó mới đổi.
- Nhánh ép vẫn gọi `pick` rồi mới bỏ kết quả, nên dòng số LCG của các hộ sau **không lệch một nhịp nào**:
  mã suất `GL26-…`, `phutTuKichHoat`, `vuotLuc` của cả bảng giữ nguyên → khoá việc C4 không mồ côi.

Bảo đảm sinh ra: 2 hộ `epChuaCoTk` đều là `dang_noi`, mà hộ `dang_noi` luôn có `soThem ≥ 1` kênh trong
`MA_THEM` (dòng :146–150) nên chắc chắn đi qua nhánh việc-thêm ít nhất 1 lần. Hiện lên màn ở «Xem hộ»
(`sheetHo` :799 tag warn + :803 cột ghi chú lấy `k.lyDo`).

### 2.2 Hai con số lượt 1 nói quá — đính chính

| Lượt 1 nói | Thực tế sau khi truy code |
|---|---|
| «2 đỏ + 2 vàng — bảo đảm thiết kế» | **2 đỏ bảo đảm** (vòng 1 ép ≥2 hộ `dang_noi`+`vuotNguong`, mà hộ `dang_noi` không bao giờ có `hddt='da_ket_noi'` → chắc chắn lọt `chuaNoiHDDT`, nhận i=0 → −3 và i=1 → −9). **2 vàng KHÔNG bảo đảm**: i=2/i=3 chỉ có nếu `chuaNoiHDDT.length ≥ 4`, mà số này phụ thuộc `r() < 0.15` của `vuotNguong` — rất nhiều khả năng đủ nhưng không có ràng buộc cứng nào |
| «KPI sau ≥ 5» | Sàn cứng đếm lại được là **≥ 6 việc / ≥ 3 cấp bách** (mục 3 dưới) |

Tôi **không** ép thêm 2 hộ vàng: sẽ phải đụng vòng 3, mà vòng 3 lượt 1 làm đúng ý đồ; rủi ro xáo bảng
cao hơn lợi. Ghi ra đây để người soát biết đó là chỗ dựa xác suất, không phải ràng buộc.

---

## 3. KPI trước / sau — sàn ĐẾM TAY được, không phải ước lượng

Số dưới là **sàn cứng**: mỗi dòng truy ngược tới một ràng buộc trong code, không phụ thuộc LCG.

| KPI (bộ lọc «Tất cả cán bộ») | TRƯỚC | SAU (sàn cứng) | Ràng buộc bảo đảm |
|---|---|---|---|
| Việc hôm nay | **1** | **≥ 6** | 2 crit hạn 30 ngày + 1 crit chờ duyệt quá hạn + 2 warn hoãn luật + 1 br của CD1 |
| — trong đó hộ mô phỏng | **0** | **≥ 5** | cả 5 việc trên trừ CD1 đều của hộ mô phỏng |
| Việc cấp bách (crit) | 0 | **≥ 3** | 2 hộ hạn 30 ngày `conLai` −3/−9 + 1 hộ `epChoDuyet` |
| Khối 4 «Hạn 30 ngày» | chỉ xanh | **2 đỏ** + vàng/xanh còn lại | 2 đỏ cứng; vàng phụ thuộc LCG (mục 2.2) |
| Khối 5 «Chờ duyệt quá 3 ngày làm việc» | 0 dòng | **≥ 1 dòng** | tính tay bên dưới |
| Khối 6 «Hoãn nhóm LUẬT» | 0 dòng | **2 dòng** có lý do + ngày | `soHoan < 2` ép 2 cờ `coHoan` → 2 mục `viecHoanLuat` |
| Trạng thái kết nối sinh ra | 6/7 mức | **7/7 mức** | vá mục 2.1 |
| Phân bố phút-tới-việc-đầu | cột «tự làm» trống sai | đủ 2 nhóm (5–15' / 16–40') | `phanBoPhut` nhóm theo `cungCanBo` |

**Tính tay khối 5** (chỗ lượt 1 chỉ nói «chắc là được», nay đã đếm):
hộ `dang_noi` đầu tiên có `dotOA = DOT_OA[0]` → `nopLuc = 2026-08-12`. Ngày 12/08/2026 là **thứ Tư**
(01/01/2026 là thứ Năm, lệch 223 ngày, 223 mod 7 = 6). `congNgayLamViec('2026-08-12', 2)`: +1 → 13/08 (T5),
+1 → 14/08 (T6) ⇒ `hanDuKien = 2026-08-14`. `qua = soNgay('2026-08-14', '2026-08-17') = 3 > 0` ⇒ **1 dòng crit**. ✔

**Việc 3 của đề — KPI có đếm ĐÚNG số dòng hiện bên dưới không:** có.
`kpisDau` (:506–508) và `khungViecHomNay` (:527–531) dùng **cùng một biểu thức lọc**
`chonCB === 'tatca' ? hs : hs.filter(h => h.canBo === chonCB)` và **cùng một nguồn** `viecCuaHo(h)`;
nhánh render (:552–563) `.map` toàn bộ `dong`, **không cắt `slice`/`head` chỗ nào** ⇒ số KPI = số dòng.
Lọc CB-xx đúng theo: `dsCB` sinh từ `danhSachCB(hs)` (:600–604) nên mọi mã trong ô chọn đều có hộ thật sự.

**Việc 4 của đề — nút 3 trạng thái C4 với hộ mô phỏng:** chạy được, **không phải sửa gì**.
Khoá việc = `h.id + '|' + loai`, mà hộ mô phỏng `h.id = lay(r, ['id','ma'])` → mã `GL26-…` (:188), ổn định
nhờ cache. `ghiTrangThaiViec` lưu `khoa@today` vào `smv3:b2g-viec` (:340–345); handler `[data-viec-trang]`
(:927–932) là handler chung, không phân biệt loại hộ; 3 nút render cho **mọi** dòng (:558–560).
Đã truy hết đường đi, không có nhánh nào loại hộ mô phỏng ra.

---

## 4. Tự soát cú pháp bằng cách nào — nói thật

`node` **và** `python3` đều bị môi trường chặn ở phiên không tương tác này (`node --check`, `node -e`,
`python3 -c`, kể cả gọi bằng đường dẫn tuyệt đối `/Users/quangle/.local/node/bin/node` — đều trả
«This command requires approval»). Không có `bun`/`deno`/`qjs` trên máy. Không tìm đường lách. Thay bằng:

1. **Cân bằng ngoặc** đếm bằng `grep -oF | wc -l` sau khi sửa: `(` 199 = `)` 199 · `{` 73 = `}` 73 ·
   `[` 36 = `]` 36 · tổng nháy đơn 220 (chẵn ⇒ không chuỗi hở).
2. **CJK + nháy cong** quét regex `[\x{2018}\x{2019}\x{201C}\x{201D}\x{4E00}-\x{9FFF}\x{3040}-\x{30FF}\x{AC00}-\x{D7AF}]`
   trên cả 2 file: **0 khớp**.
3. **Đọc lại nguyên vùng sửa** (:110–179) sau khi Edit xong, không đọc mỗi diff.
4. **Truy tay đường dữ liệu** thay cho chạy thật: 12/08/2026 ra thứ mấy (mục 3), `pick()` rút mấy lần,
   `chuanHoaHo` nhận gì từ 2 adapter, `lay()` trả gì khi gặp `false` và `null`
   (`cungCanBo: lay(...) === true` — `false` không bị `lay` bỏ qua nên vẫn đúng), `SM.hash` có âm không
   (`h >>> 0` ⇒ không âm ⇒ `1 + SM.hash(...) % 5` luôn 1..5, dòng :249 an toàn).

## 5. Còn gì chưa làm được — nói thật

- **Chưa mở browser xác nhận bằng mắt.** Node/python bị chặn nên mọi số ở mục 3 là truy code + tính tay,
  chưa thấy trên màn. Cần người mở `b2g.html` → «Sổ trực» kiểm: KPI «Việc hôm nay» ≥ 6, «Việc cấp bách» ≥ 3,
  khối 4 có 2 dòng đỏ, khối 5 ≥ 1 dòng, khối 6 đúng 2 dòng, «Xem hộ» của hộ `dang_noi` đầu có thẻ vàng
  «Chưa có tài khoản», bấm 3 nút trạng thái trên một dòng việc của hộ `GL26-…` thấy đổi và giữ sau F5.
- **2 hộ vàng của khối 4 là chỗ dựa xác suất**, không phải ràng buộc cứng (mục 2.2). Nếu mở lên thấy thiếu
  vàng thì đó là chỗ cần ép, không phải lỗi mới.
- **Kênh trạng thái `loi` không sinh ra việc cho cán bộ.** `viecCuaHo` chỉ quét 3 nguồn (hạn 30 ngày ·
  chờ duyệt quá hạn · hoãn luật) đúng như đề và đúng nhãn KPI «gộp hạn 30 ngày + chờ quá hạn + hoãn luật».
  Nhưng hộ có kênh `loi` («Bên thứ ba trả lời chưa duyệt — cần cán bộ xem lại hồ sơ») rõ ràng là việc phải
  làm mà Sổ trực không nổi lên. **Không tự thêm** vì sẽ lệch nhãn KPI và vượt 6 khối của PLAN B.11 —
  đề xuất để Quang/W5 quyết có mở khối thứ 7 hay không.
- Máy người xem đang giữ `smv3:b2g-hos` hoặc `-v2`: đã bump `-v3` nên tự hết; vẫn thấy 1 việc thì kiểm khoá.

BUILD-AGENT-DONE V3 28
