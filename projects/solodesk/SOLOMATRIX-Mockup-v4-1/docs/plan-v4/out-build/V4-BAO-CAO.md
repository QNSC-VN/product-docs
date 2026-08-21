# V4 — BÁO CÁO BUILD (PWA thật: manifest + service worker + icon)

Agent V4 · 20/08/2026. Sở hữu 3 file MỚI ở gốc `solomatrix-v3-gialai/` — **không đụng file nào khác,
không sửa mobile.html** (V1 lo phần chèn thẻ).

## 1. Đã làm gì (3 lần Write, không Edit file nào của người khác)

| File | Nội dung chính |
|---|---|
| `manifest.webmanifest` | name «SoloMatrix — Bán hàng và kê khai» · short_name «SoloMatrix» · start_url `mobile.html` · scope `.` · display `standalone` · orientation `portrait` · lang `vi` · theme_color `#0E6360` · background_color `#E3EEED` · icons → `icon.svg` (`sizes:"any"`, `type:"image/svg+xml"`, `purpose:"any maskable"`) |
| `icon.svg` | Vuông 512, nền `#0E6360`, chữ «SM» vẽ bằng path thuần (lưới ô 30px) — **không phụ thuộc font, không dùng logo QNSC**; nội dung nằm trong vùng an toàn maskable 80% giữa; nền full-bleed không bo góc để mask hệ thống (vòng tròn Android) không lộ mép trong suốt |
| `sw.js` | IIFE 'use strict', `CACHE/BO_NHO = 'solomatrix-v4-1'`. install: precache `mobile.html` + 11 file `js/` + `manifest.webmanifest` + `icon.svg` (mỗi file `c.add` riêng + catch — một file thiếu không làm vỡ install, tự lấp ở lượt fetch). activate: xoá mọi cache khác tên hiện tại + `clients.claim()`. fetch: bỏ qua non-GET (POST không cache), bỏ qua khác origin + protocol không http(s) (chặn cả `chrome-extension://`); **HTML = network-first** (sửa mã thấy ngay khi có mạng, mất mạng trả bản cache, fallback về `mobile.html` đã precache); **js/ + tĩnh = cache-first**, miss thì fetch + lưu lại. Khoá cache bỏ query `?v=…` nên mỗi file chỉ lưu một bản |

Màu lấy đúng biến CSS mobile.html (dòng 15): `--brand:#0E6360`, `--brand-soft:#E3EEED` — không chế màu mới.

**Lệch so với đề (nói thẳng):** đề ghi precache «10 file trong js/», nhưng Glob thật lúc build có **11 file**
(các agent song song W1/W4/W5 đã tạo `sm-onboard.js`, `sm-seed-b2g.js`, `sm-b2g.js`). Đã dùng danh sách
Glob thật (đúng luật «không đoán tên file»); nhờ precache per-file có catch nên nếu file nào chưa xong
ở khoá khác cũng không vỡ install.

## 2. HợP ĐỒNG CHO V1 (chèn vào mobile.html — không phải đoán gì thêm)

Cả 3 file nằm ở **cùng cấp mobile.html** (gốc `solomatrix-v3-gialai/`), đường dẫn tương đối:

```html
<link rel="manifest" href="manifest.webmanifest">
<meta name="theme-color" content="#0E6360">
<link rel="icon" href="icon.svg" type="image/svg+xml">
```

Đăng ký service worker (đặt cuối mobile.html, sau các thẻ script — không chặn tải trang):

```html
<script>
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(function(){
    /* mở bằng file:// hoặc trình duyệt không hỗ trợ — app vẫn chạy như web thường, không báo lỗi cho hộ */
  });
}
</script>
```

**Khi sửa mã để người dùng thấy ngay:** tăng số phiên bản trong `sw.js` (`BO_NHO = 'solomatrix-v4-1'` →
`'solomatrix-v4-2'`) — HTML là network-first nên tự mới, nhưng `js/` là cache-first nên phải bump phiên
bản (activate sẽ xoá bản cũ).

## 3. Tự soát cú pháp bằng cách nào

- `node --check` + `JSON.parse` + `xmllint`: **lệnh Bash bị chặn quyền trong phiên này** (báo "requires
  approval") — không lách sang cách khác, chuyển sang đường đọc.
- Đọc lại toàn bộ nội dung 3 file mình vừa Write, rà từng cặp ngoặc/dấu phẩy của 3 listener
  (install/activate/fetch), IIFE mở/đóng, chuỗi JSON không dấu phẩy cuối, thẻ SVG mở/đóng khớp.
- Quét ký tự CJK/Hán–Nhật–Hàn + fullwidth Latin bằng Grep trỏ thẳng từng file: **0 matches cả 3 file**.

## 4. Cảnh báo giới hạn (không giấu)

1. **Service worker chỉ chạy trên http(s)** — mở bản trong `~/Downloads` bằng file:// sẽ KHÔNG đăng ký
   được: trang vẫn chạy như web thường (đúng, không phải lỗi). Muốn thử offline thật: đứng ở gốc
   `solomatrix-v3-gialai/` mở máy chủ tĩnh rồi vào `mobile.html`.
2. **iOS chỉ cài qua Safari «Thêm vào Màn hình chính»**; iOS không dùng SVG làm icon màn hình chính —
   sẽ tự chụp màn hình làm icon (phiên bản sau cần PNG `apple-touch-icon` nếu muốn icon đẹp trên iOS;
   đề chỉ giao icon.svg nên chưa làm).
3. Icon manifest hiện chỉ có SVG (`purpose:"any maskable"`) — Chrome/Android hiện đại đủ để hiện nút cài;
   một số máy Android rất cũ muốn PNG 192/512 thì nút «Cài đặt» có thể không hiện (trang vẫn dùng và
   offline bình thường). Không tự mở rộng phạm vi.
4. Offline của **nghiệp vụ** (nhập đơn, gửi khi có mạng lại) do sm-core (`SM.enqueue`, `setOnline`) lo —
   sw.js chỉ giữ phần mã/giao diện; dữ liệu nằm localStorage `smv3:*` nên SW không đụng.

## 5. Chưa làm gì

- Không sửa mobile.html (đúng ranh giới — V1 chèn theo hợp đồng mục 2).
- Không làm PNG icon, không làm `apple-touch-icon` (ngoài đề, đã nêu ở mục 4.2–4.3 để quyết định sau).
- Không verify runtime thật trên Chrome (máy này không mở được máy chủ + Bash chặn quyền) — ai nghiệm
  thu: mở máy chủ tĩnh, vào mobile.html, DevTools → Application → Service Workers, tick Offline rồi
  tải lại trang.
