/**
 * sm-core.js — LÕI DÙNG CHUNG cho 3 bề mặt (mobile / b2g / console)
 * SoloMatrix v3 "Gia Lai" — bám Bài toán đặt hàng Kế nghiệp số Gia Lai.
 *
 * Toàn bộ nội dung hiển thị: TIẾNG VIỆT CÓ DẤU. KHÔNG chứa ký tự CJK.
 *
 * Chứa: kho bền (localStorage) · hàng đợi đồng bộ offline (ràng buộc IV.4)
 *        · bus sự kiện đa tab · tiện ích định dạng.
 * KHÔNG chứa nghiệp vụ — nghiệp vụ ở sm-domain.js.
 */
(function (global) {
  'use strict';

  const NS = 'smv3:';
  const KEY_DB = NS + 'db';
  const KEY_Q = NS + 'queue';
  const KEY_NET = NS + 'net';
  const KEY_UI = NS + 'ui';

  /* ---------------------------------------------------------------- tiện ích */

  const fmt = {
    /** 1234567 -> "1.234.567" */
    num(n) {
      if (n === null || n === undefined || isNaN(n)) return '0';
      return Math.round(n).toLocaleString('vi-VN');
    },
    /** 1234567 -> "1.234.567đ" */
    d(n) { return fmt.num(n) + 'đ'; },
    /** gọn cho thẻ số: 1.250.000 -> "1,25tr" ; 45.000.000 -> "45tr" */
    dShort(n) {
      const a = Math.abs(n || 0);
      if (a >= 1e9) return (n / 1e9).toFixed(a >= 1e10 ? 0 : 1).replace('.', ',') + ' tỷ';
      if (a >= 1e6) return (n / 1e6).toFixed(a >= 1e7 ? 0 : 1).replace('.', ',') + 'tr';
      if (a >= 1e3) return Math.round(n / 1e3) + 'k';
      return fmt.num(n);
    },
    pct(n, digits) { return (n || 0).toFixed(digits === undefined ? 1 : digits).replace('.', ',') + '%'; },
    /** '2026-08-17' -> '17/08' */
    dm(iso) { if (!iso) return ''; const p = iso.slice(0, 10).split('-'); return p[2] + '/' + p[1]; },
    /** '2026-08-17' -> '17/08/2026' */
    dmy(iso) { if (!iso) return ''; const p = iso.slice(0, 10).split('-'); return p[2] + '/' + p[1] + '/' + p[0]; },
    hm(iso) { return iso ? String(iso).slice(11, 16) : ''; },
    esc(s) {
      return String(s === null || s === undefined ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },
    /** số thứ tự ngắn cho id: SM-2608-01 */
    seq(prefix, n) { return prefix + '-' + String(n).padStart(3, '0'); },
  };

  /* --------------------------------------------------- đồng hồ demo cố định */
  /* Mockup phải tái lập được: mọi "hôm nay" đều tính từ mốc này, không dùng Date.now
     cho dữ liệu nghiệp vụ (chỉ dùng cho dấu thời gian hàng đợi đồng bộ). */
  const CLOCK = { today: '2026-08-17', quarter: 3, year: 2026 };

  /**
   * Cộng/trừ ngày, AN TOÀN VỚI MÚI GIỜ.
   * Bản cũ dùng `new Date(iso+'T00:00:00')` (giờ địa phương) rồi `toISOString()`
   * (giờ UTC) — ở UTC+7 kết quả bị tụt đúng 1 ngày. Lỗi này làm lịch bắt đầu từ
   * hôm qua và làm MỐC 90 NGÀY lệch 1 ngày, mà mốc đó là căn cứ thanh toán (IV.7).
   * Nay tính hoàn toàn trong UTC nên không phụ thuộc máy chạy ở đâu.
   */
  function dayOffset(iso, n) {
    const p = String(iso).slice(0, 10).split('-');
    const d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }

  /* --------------------------------------------------- id độc nhất (M2 #10/#11)
     Id đếm theo độ dài mảng ('J0001', 'EV0001') sẽ TRÙNG sau khi dọn việc đã gửi
     hay xoá sự kiện theo tenant — sổ nhật ký mất chuẩn, đối chiếu không tin được.
     Sinh theo thời gian + đếm không giảm của phiên thì không lặp lại trong một kho. */
  let UID_SEQ = 0;
  function uid(prefix) {
    UID_SEQ += 1;
    return (prefix || 'ID') + '-' + Date.now().toString(36) + '-' + String(UID_SEQ).padStart(3, '0');
  }

  /* --------------------------------------------------------------- bus & kho */

  const listeners = {};
  function on(evt, fn) { (listeners[evt] = listeners[evt] || []).push(fn); return fn; }
  function emit(evt, payload) {
    (listeners[evt] || []).forEach(fn => { try { fn(payload); } catch (e) { console.error('[SM]', evt, e); } });
    (listeners['*'] || []).forEach(fn => { try { fn(evt, payload); } catch (e) { console.error(e); } });
  }

  function readRaw(key, fallback) {
    try {
      const s = localStorage.getItem(key);
      return s === null ? fallback : JSON.parse(s);
    } catch (e) { return fallback; }
  }
  /* ------------------------------- KHO ĐẦY — hết ghi mất âm thầm (M2 #8, IV.3)
     Khi máy nhớ đầy, ghi thất bại mà không ai hay — hộ bán tiếp, dữ liệu không vào
     kho. Nay mỗi lần ghi hỏng treo 1 dòng cảnh báo đỏ bằng lời nói thường (chỉ 1
     dòng, không nhắc lại từng lần); khi sổ chính ghi lại được thì tự hạ. */
  let nodeBaoDay = null;
  function baoKhoDay() {
    emit('store:full');
    if (nodeBaoDay || !global.document || !global.document.body) return;
    const d = global.document.createElement('div');
    d.setAttribute('role', 'alert');
    d.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483647;display:flex;gap:12px;align-items:center;background:#A32E24;color:#fff;border-radius:12px;padding:14px;font:600 14px/1.45 system-ui,-apple-system,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.25)';
    const tx = global.document.createElement('span');
    tx.style.cssText = 'flex:1';
    tx.textContent = 'Máy nhớ đã đầy — dữ liệu vừa nhập CHƯA lưu được. Hãy xuất dữ liệu ra ngoài để giữ sổ, rồi nhờ cán bộ kỹ thuật kiểm tra giúp máy.';
    const b = global.document.createElement('button');
    b.type = 'button';
    b.textContent = 'Đã biết';
    b.setAttribute('aria-label', 'Đóng cảnh báo máy nhớ đầy');
    b.style.cssText = 'min-height:44px;min-width:64px;padding:0 14px;border:0;border-radius:10px;background:rgba(255,255,255,.16);color:#fff;font:600 14px system-ui,-apple-system,sans-serif;cursor:pointer';
    b.addEventListener('click', function () { if (nodeBaoDay) { nodeBaoDay.remove(); nodeBaoDay = null; } });
    d.appendChild(tx); d.appendChild(b);
    global.document.body.appendChild(d);
    nodeBaoDay = d;
  }
  function writeRaw(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      if (nodeBaoDay && key === KEY_DB) { nodeBaoDay.remove(); nodeBaoDay = null; emit('store:ok'); }
      return true;
    } catch (e) {
      console.warn('[SM] không ghi được kho:', e);
      baoKhoDay();
      return false;
    }
  }

  /** DB = { tenants: { id: {...} }, meta: {...} } — nạp seed nếu trống */
  let DB = null;

  function db() {
    if (DB) return DB;
    DB = readRaw(KEY_DB, null);
    if (!DB) DB = reseed();
    return DB;
  }

  function reseed() {
    if (!global.SM_SEED_GIALAI) {
      console.error('[SM] thiếu sm-seed-gialai.js');
      DB = { tenants: {}, meta: {} };
      return DB;
    }
    DB = JSON.parse(JSON.stringify(global.SM_SEED_GIALAI));
    DB.meta = DB.meta || {};
    DB.meta.seededAt = CLOCK.today;
    writeRaw(KEY_DB, DB);
    writeRaw(KEY_Q, []);
    emit('db:reseed', DB);
    return DB;
  }

  function save() {
    writeRaw(KEY_DB, DB);
    emit('db:save', DB);
  }

  function tenantIds() { return Object.keys(db().tenants); }
  function tenant(id) { return db().tenants[id] || null; }

  /* ------------------------------------------------------- tenant đang chọn */

  function ui() { return readRaw(KEY_UI, { tenant: null, mode: 'full' }); }
  function setUi(patch) {
    const u = Object.assign(ui(), patch);
    writeRaw(KEY_UI, u);
    emit('ui:change', u);
    return u;
  }
  function current() {
    const u = ui();
    const id = u.tenant && db().tenants[u.tenant] ? u.tenant : tenantIds()[0];
    if (u.tenant !== id) writeRaw(KEY_UI, Object.assign(u, { tenant: id }));
    return db().tenants[id];
  }
  function switchTenant(id) { if (db().tenants[id]) setUi({ tenant: id }); return current(); }

  /** chế độ giao diện: 'simple' cho bố mẹ lớn tuổi · 'full' cho thế hệ kế cận (ràng buộc IV.4 + II.4) */
  function mode() { return ui().mode === 'simple' ? 'simple' : 'full'; }
  function setMode(m) { return setUi({ mode: m === 'simple' ? 'simple' : 'full' }); }

  /* ------------------------------------------- MẠNG & HÀNG ĐỢI ĐỒNG BỘ (IV.4)
     Ràng buộc: "tối thiểu nghiệp vụ bán hàng phải hoạt động được khi mất kết nối
     và tự đồng bộ khi có mạng trở lại".
     Cách làm: mọi nghiệp vụ ghi thẳng vào kho cục bộ (nên luôn chạy được), rồi
     đẩy một "việc cần gửi lên" vào hàng đợi. Hàng đợi sống qua F5.               */

  function netState() { return readRaw(KEY_NET, { online: true }); }
  function isOnline() { return netState().online !== false; }

  function setOnline(v) {
    writeRaw(KEY_NET, { online: !!v });
    emit('net:change', { online: !!v });
    if (v) drain();
    return !!v;
  }

  function queue() { return readRaw(KEY_Q, []); }
  function queueCount() { return queue().filter(j => j.state !== 'done').length; }

  /**
   * Xếp một việc cần gửi lên hệ thống ngoài (cơ quan thuế, sàn, ngân hàng...).
   * kind: 'einvoice' | 'tax' | 'channel' | 'bank' | 'report'
   */
  function enqueue(kind, label, ref) {
    const q = queue();
    q.push({
      id: uid('J'), // M2 #10 — không đếm theo q.length: việc đã gửi bị dọn xong id không lặp lại
      kind, label, ref: ref || null,
      state: 'pending',
      at: new Date().toISOString(),
      tries: 0,
    });
    writeRaw(KEY_Q, q);
    emit('queue:change', { count: queueCount() });
    if (isOnline()) setTimeout(drain, 400);
    return q[q.length - 1].id;
  }

  let draining = false;
  /** Đẩy hàng đợi. Mô phỏng: mỗi việc mất 250–500ms, có thể lỗi nếu bật chế độ lỗi. */
  function drain() {
    if (draining || !isOnline()) return;
    const pend = queue().filter(j => j.state === 'pending' || j.state === 'error');
    if (!pend.length) return;
    draining = true;

    const step = () => {
      const q = queue();
      const job = q.find(j => j.state === 'pending' || j.state === 'error');
      if (!job || !isOnline()) { draining = false; emit('queue:change', { count: queueCount() }); return; }

      job.tries += 1;
      const failRate = readRaw(NS + 'failRate', 0);
      const failed = Math.random() < failRate && job.tries < 3;

      if (failed) {
        job.state = 'error';
        job.note = 'Hệ thống ngoài chưa nhận — sẽ thử lại';
      } else {
        job.state = 'done';
        job.doneAt = new Date().toISOString();
        job.note = null;
        applyAck(job);
      }
      writeRaw(KEY_Q, q);
      emit('queue:change', { count: queueCount(), job });
      setTimeout(step, 250 + Math.random() * 250);
    };
    setTimeout(step, 300);
  }

  /** Khi việc đã gửi xong: cập nhật trạng thái đối tượng nghiệp vụ tương ứng. */
  function applyAck(job) {
    if (!job.ref) return;
    const t = tenant(job.ref.tenant);
    if (!t) return;

    if (job.kind === 'einvoice') {
      const inv = (t.invoices || []).find(i => i.id === job.ref.id);
      if (inv) {
        inv.cqtState = 'sent';
        inv.cqtCode = 'M' + CLOCK.year + '-' + String(Math.abs(hash(inv.id)) % 900000 + 100000);
        inv.cqtAt = job.doneAt;
        save();
      }
    }
    if (job.kind === 'channel') {
      const o = (t.orders || []).find(x => x.id === job.ref.id);
      if (o) { o.synced = true; save(); }
    }
  }

  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < String(s).length; i++) { h ^= String(s).charCodeAt(i); h = (h * 16777619) >>> 0; }
    return h >>> 0;
  }

  function setFailRate(r) { writeRaw(NS + 'failRate', r); emit('net:failRate', r); }

  function clearQueueDone() {
    writeRaw(KEY_Q, queue().filter(j => j.state !== 'done'));
    emit('queue:change', { count: queueCount() });
  }

  /* ------------------------------------------- KHÔNG KHOÁ DỮ LIỆU (IV.3 cuối)
     "hộ có quyền xuất toàn bộ dữ liệu của mình theo định dạng thông dụng để
      chuyển sang nhà cung cấp khác khi kết thúc sử dụng."
     Đây là CAM KẾT HỢP ĐỒNG, không phải nút demo — nên đặt trong lõi.          */

  function exportTenant(id) {
    const t = tenant(id || current().id);
    if (!t) return null;
    return {
      dinhDang: 'SoloMatrix-export/v1',
      chuanMo: 'JSON UTF-8; kèm bản CSV cho từng bảng khi tải về',
      xuatLuc: new Date().toISOString(),
      thuocVe: { hoKinhDoanh: t.name, maSoThue: t.mst || null, diaBan: t.diaBan },
      ghiChu: 'Toàn bộ dữ liệu chi tiết thuộc về hộ kinh doanh. Bản xuất này đủ để chuyển sang nhà cung cấp khác.',
      duLieu: t,
    };
  }

  function exportCsvTables(id) {
    const t = tenant(id || current().id);
    if (!t) return {};
    const out = {};
    const mk = (rows, cols) => [cols.join(','), ...rows.map(r => cols.map(c => {
      const v = r[c] === null || r[c] === undefined ? '' : String(r[c]);
      return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
    }).join(','))].join('\n');

    if (t.invoices) out['hoa_don.csv'] = mk(t.invoices, ['id', 'date', 'buyer', 'total', 'vat', 'kind', 'cqtState', 'cqtCode']);
    if (t.orders) out['don_hang.csv'] = mk(t.orders, ['id', 'date', 'channel', 'buyer', 'total', 'state']);
    if (t.skus) out['hang_hoa.csv'] = mk(t.skus, ['sku', 'name', 'unit', 'price', 'taxGroup']);
    if (t.purchases) out['bang_ke_thu_mua.csv'] = mk(t.purchases, ['id', 'date', 'seller', 'cccd', 'item', 'qty', 'unit', 'price', 'total', 'lot']);
    if (t.bookings) out['dat_cho.csv'] = mk(t.bookings, ['id', 'date', 'slot', 'resource', 'pax', 'guest', 'total', 'state']);
    return out;
  }

  /* ---------------------------------------------------- đồng bộ giữa các tab */
  global.addEventListener('storage', (e) => {
    if (!e.key || e.key.indexOf(NS) !== 0) return;
    if (e.key === KEY_DB) { DB = readRaw(KEY_DB, DB); emit('db:external', DB); }
    if (e.key === KEY_Q) emit('queue:change', { count: queueCount() });
    if (e.key === KEY_NET) emit('net:change', netState());
    if (e.key === KEY_UI) emit('ui:change', ui());
  });

  /* --------------------- MỞ LẠI APP: TỰ ĐỒNG BỘ + CÓ BẢN MỚI (M2 #6 · M4 #17)
     - Hàng đợi việc chờ phải tự gửi ngay khi mở lại app (IV.4), không đợi hộ
       bật/tắt mạng hay làm nghiệp vụ mới. Lõi nạp trên mọi bề mặt nên đặt ở đây;
       setTimeout cho các listener của bề mặt kịp gắn trước khi phát sự kiện.
     - App cài trên máy hội đồng phải tự có đường nâng cấp: hỏi máy chủ xem có
       bản mới, có thì treo thanh «Tải bản mới» — không bắt ai gỡ app cài lại. */

  setTimeout(function () { drain(); }, 0);

  let nodeBanMoi = null;
  function nutBanMoi(nhan, nen, chu, fn) {
    const b = global.document.createElement('button');
    b.type = 'button';
    b.textContent = nhan;
    b.setAttribute('aria-label', nhan);
    b.style.cssText = 'min-height:44px;padding:0 14px;border:0;border-radius:10px;background:' + nen + ';color:' + chu + ';font:600 14px system-ui,-apple-system,sans-serif;cursor:pointer';
    b.addEventListener('click', fn);
    return b;
  }
  /** Bản mới đã cài xong và chờ → thanh thông báo cố định, không tự tắt, bấm được. */
  function thanhBanMoi() {
    if (nodeBanMoi || !global.document || !global.document.body) return;
    const d = global.document.createElement('div');
    d.setAttribute('role', 'alert');
    d.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:2147483647;display:flex;gap:10px;align-items:center;padding:10px 12px;padding-top:calc(10px + env(safe-area-inset-top));background:#0E6360;color:#fff;font:600 14px/1.4 system-ui,-apple-system,sans-serif;box-shadow:0 2px 12px rgba(0,0,0,.2)';
    const tx = global.document.createElement('span');
    tx.style.cssText = 'flex:1';
    tx.textContent = 'App đã có bản mới — tải lại để dùng đúng bản nhất.';
    const bTai = nutBanMoi('Tải bản mới', '#fff', '#0E6360', taiBanMoi);
    const bSau = nutBanMoi('Để sau', 'rgba(255,255,255,.16)', '#fff', function () {
      if (nodeBanMoi) { nodeBanMoi.remove(); nodeBanMoi = null; }
    });
    d.appendChild(tx); d.appendChild(bTai); d.appendChild(bSau);
    global.document.body.appendChild(d);
    nodeBanMoi = d;
    emit('sw:banmoi');
  }
  /** Nút «Tải bản mới»: bảo bản mới nhận việc ngay rồi mở lại trang một lần. */
  function taiBanMoi() {
    let daTaiLai = false;
    const taiLai = function () { if (!daTaiLai) { daTaiLai = true; global.location.reload(); } };
    if (global.navigator && global.navigator.serviceWorker) {
      global.navigator.serviceWorker.getRegistration().then(function (r) {
        if (r && r.waiting) r.waiting.postMessage('SKIP_WAITING');
        setTimeout(taiLai, 400);
      }).catch(taiLai);
    } else taiLai();
  }
  /** Hỏi máy chủ ngay khi mở app; phát hiện bản mới cài xong thì treo thanh. */
  function giamSatBanMoi() {
    if (!global.navigator || !global.navigator.serviceWorker) return;
    global.navigator.serviceWorker.getRegistration().then(function (reg) {
      if (!reg) return;
      /* mở lại app khi bản mới đã chờ sẵn từ lượt trước */
      if (reg.waiting && global.navigator.serviceWorker.controller) thanhBanMoi();
      reg.addEventListener('updatefound', function () {
        const w = reg.installing;
        if (!w) return;
        w.addEventListener('statechange', function () {
          if (w.state === 'installed' && global.navigator.serviceWorker.controller) thanhBanMoi();
        });
      });
      reg.update().catch(function () { /* mất mạng — lượt mở sau có mạng sẽ hỏi lại */ });
    }).catch(function () { });
  }
  giamSatBanMoi();

  /* ----------------------------------------------------------------- xuất ra */
  global.SM = {
    NS, CLOCK, fmt, dayOffset, hash, uid,
    on, emit, taiBanMoi,
    db, reseed, save, tenantIds, tenant, current, switchTenant,
    ui, setUi, mode, setMode,
    isOnline, setOnline, queue, queueCount, enqueue, drain, setFailRate, clearQueueDone,
    exportTenant, exportCsvTables,
    /** đặt lại toàn bộ để demo lại từ đầu */
    resetAll() {
      [KEY_DB, KEY_Q, KEY_NET, KEY_UI, NS + 'failRate'].forEach(k => localStorage.removeItem(k));
      DB = null; db();
      emit('db:reseed', DB);
    },
  };
})(window);
