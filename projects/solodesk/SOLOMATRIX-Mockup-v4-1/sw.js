/* sw.js — SoloMatrix v4: service worker giữ phần MÃ và GIAO DIỆN chạy lại được khi mất mạng.
 * Dữ liệu nghiệp vụ (đơn hàng, hộ, nhật ký…) nằm trong localStorage của trang, các kho 'smv3:*' —
 * service worker KHÔNG đụng tới localStorage, chỉ lo cache mã nguồn và tài nguyên.
 * Chỉ hoạt động khi mở qua http(s); mở bằng file:// trình duyệt không đăng ký được — app vẫn
 * chạy như web thường, đó là giới hạn của nền tảng, không phải lỗi của app. */
'use strict';
(function(){
  var BO_NHO = 'solomatrix-v4-4';

  /* Danh sách tập tin cần có sẵn để mở lại khi mất mạng.
   * js/ lấy bằng Glob thật ngày 20/08/2026 (11 file — sm-onboard, sm-seed-b2g, sm-b2g do các agent song song dựng).
   * 20/08 đợt sửa F: thêm đủ 4 trang html — cán bộ mất mạng mở Sổ trực phải thấy đúng
   * Sổ trực, không rơi về app của hộ (M2 #20).
   * Sửa mã xong muốn mọi máy thấy ngay: tăng số phiên bản BO_NHO (vd 'solomatrix-v4-3') — bản cũ tự xoá
   * ở activate; máy đã cài sẽ hiện nút «Tải bản mới» (sm-core.js tự treo khi phát hiện bản mới). */
  var TAP_TIN = [
    'mobile.html',
    'b2g.html',
    'index.html',
    'web.html',
    'manifest.webmanifest',
    'icon.svg',
    'js/sm-ai.js',
    'js/sm-b2g.js',
    'js/sm-core.js',
    'js/sm-domain.js',
    'js/sm-inbox.js',
    'js/sm-onboard.js',
    'js/sm-ops.js',
    'js/sm-program.js',
    'js/sm-quyen.js',
    'js/sm-seed-b2g.js',
    'js/sm-seed-gialai.js'
  ];

  function chua(req){ // khoá cache đồng nhất: bỏ query (?v=…) để mỗi tập tin chỉ lưu một bản
    return new URL(req.url).pathname;
  }

  /* 🔴 Claude verify 20/08 — LỖI ĐÃ DÍNH THẬT LÚC NGHIỆM THU:
     `chua()` cắt bỏ `?v=` + nhánh js/ lấy bản trong bộ nhớ trước ⇒ đổi số phiên bản trên thẻ script
     KHÔNG có tác dụng, máy người dùng giữ mã cũ vĩnh viễn (phải gỡ app cài lại mới thấy bản mới).
     Cách chữa: mã trong `js/` đi đường "dùng bản cũ ngay, tải bản mới ngầm cho lần sau"
     (stale-while-revalidate) và khoá cache GIỮ NGUYÊN `?v=` để mỗi phiên bản là một bản riêng.
     Mất mạng vẫn mở được vì bản cũ còn nguyên trong bộ nhớ. */
  function laMa(pathname){ return /\/js\/[^/]+\.js$/.test(pathname); }
  function khoaMa(req){ return req.url; }   // giữ cả ?v= — mỗi phiên bản một bản riêng

  /* Trang lưu sẵn tương ứng đường đang mở (M2 #20): mất mạng thì mỗi vai vẫn thấy
   * đúng app của vai — cán bộ mở Sổ trực không bị rơi về app của hộ. */
  function trangLuuSan(pathname){
    if (/^\/b2g/.test(pathname)) return 'b2g.html';
    if (/^\/web/.test(pathname)) return 'web.html';
    if (pathname === '/' || /^\/index/.test(pathname)) return 'index.html';
    return 'mobile.html';
  }

  self.addEventListener('install', function(e){
    e.waitUntil(
      caches.open(BO_NHO).then(function(c){
        return Promise.all(TAP_TIN.map(function(f){
          return c.add(f).catch(function(){
            /* tập tin chưa kịp có trên máy chủ (đang dựng song song) — bỏ qua,
             * lượt fetch sau có mạng sẽ tự lấp vào bộ nhớ */
          });
        }));
      }).then(function(){ return self.skipWaiting(); })
    );
  });

  self.addEventListener('activate', function(e){
    e.waitUntil(
      caches.keys().then(function(ds){
        return Promise.all(
          ds.filter(function(k){ return k !== BO_NHO; })
            .map(function(k){ return caches.delete(k); })
        );
      }).then(function(){ return self.clients.claim(); })
    );
  });

  self.addEventListener('message', function(e){
    /* nút «Tải bản mới» (sm-core.js) bảo bản mới nhận việc ngay, không đợi mọi tab đóng */
    if (e.data === 'SKIP_WAITING') self.skipWaiting();
  });

  self.addEventListener('fetch', function(e){
    var req = e.request;
    if (req.method !== 'GET') return; // POST là dữ liệu gửi đi — không cache
    var url = new URL(req.url);
    if (url.origin !== self.location.origin) return; // ngoài trang (CDN, tiện ích mở rộng…) — không đụng
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    var laTrang = req.mode === 'navigate' || /\.html$/.test(url.pathname);

    if (laTrang) {
      /* trang HTML: mạng trước — sửa mã là thấy ngay khi có mạng; mất mạng thì trả bản đã lưu */
      e.respondWith(
        fetch(req).then(function(res){
          var banSao = res.clone();
          caches.open(BO_NHO).then(function(c){ c.put(chua(req), banSao); });
          return res;
        }).catch(function(){
          return caches.match(chua(req)).then(function(co){
            if (co) return co;
            /* mất mạng: trả đúng trang theo đường đang mở, đỡ nhất mới về mobile.html (M2 #20) */
            return caches.match(trangLuuSan(url.pathname)).then(function(cu){
              return cu || caches.match('mobile.html');
            });
          });
        })
      );
      return;
    }

    /* mã js/: dùng bản đã lưu cho nhanh NHƯNG luôn tải bản mới ngầm để lần mở sau có mã mới
       (Claude verify 20/08 — xem ghi chú ở hàm khoaMa: nếu chỉ lấy bản cũ thì đổi mã không bao giờ tới máy hộ) */
    if (laMa(url.pathname)) {
      e.respondWith(
        caches.match(khoaMa(req)).then(function(co){
          var tuMang = fetch(req).then(function(res){
            if (res && res.ok) {
              var banSao = res.clone();
              caches.open(BO_NHO).then(function(c){ c.put(khoaMa(req), banSao); });
            }
            return res;
          /* mất mạng: bản cũ vẫn chạy. Bản nạp sẵn lúc cài lưu theo đường KHÔNG kèm ?v=,
             nên phải thử tiếp `chua(req)` — thiếu bước này thì lần đầu mất mạng app trắng màn. */
          }).catch(function(){ return co || caches.match(chua(req)); });
          return co || tuMang;
        })
      );
      return;
    }

    /* tài nguyên tĩnh còn lại: bản trong bộ nhớ trước, thiếu thì ra mạng và lưu lại để dùng cho lần mất mạng */
    e.respondWith(
      caches.match(chua(req)).then(function(co){
        if (co) return co;
        return fetch(req).then(function(res){
          if (res && res.ok) {
            var banSao = res.clone();
            caches.open(BO_NHO).then(function(c){ c.put(chua(req), banSao); });
          }
          return res;
        });
      })
    );
  });
})();
