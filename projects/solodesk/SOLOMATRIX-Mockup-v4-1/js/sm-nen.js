/**
 * sm-nen.js — TRỢ LÝ CHẠY NỀN + «NÓI THAY GÕ» (V4 đề V1).
 *
 * Vì sao có file này: câu hỏi thật của hộ là «app làm việc lúc tôi ngủ thì nó làm gì,
 * ai đánh thức nó?» — không được nói suông. Mọi dòng trong màn này TÍNH từ kho thật:
 * đồng hồ 30 ngày (D.mocVuotNguong), hạn kê khai (D.deadlines), máy trạng thái từng kênh
 * (t.onboarding.ketNoi), hàng đợi (SM.queueCount), bộ đếm bản trùng (t.trungBoDem).
 *
 * Nửa thứ hai (THUMOI IV.4 / D-#10): nút «Nói thay gõ» — sheet MÔ PHỎNG nhận dạng giọng
 * nói tiếng Việt; bóc bản thoại thành từng dòng, hộ chạm xác nhận từng dòng; xác nhận xong
 * CHỈ trả dữ liệu về cho nơi gọi (callback) — nơi gọi quyết định ghi sổ hay điền form.
 *
 * MỤC LỤC
 *   §0  Tiện ích trình bày (toast/sheet cùng markup mobile.html) + docSo (đọc số thành lời)
 *   §1  NEN.viecDangCho(t)  — việc nền đang canh, tính từ kho
 *   §2  NEN.nguonDanhThuc(t) — 3 nhóm cái gì đánh thức
 *   §3  NEN.viewNen/bindNen — màn «Trợ lý chạy nền» (D-#3)
 *   §4  NEN.sheetNoi(t, boiCanh) — sheet «Nói thay gõ» theo ngành của hộ
 *   §5  Xuất SM.nen
 *
 * Không đăng ký router — mobile.html (V1 việc 3) tự đăng ký theo INTERFACE.
 */
(function (global) {
  'use strict';
  const SM = global.SM;
  if (!SM || !SM.dom) throw new Error('sm-nen.js cần sm-core.js và sm-domain.js');
  const D = SM.dom, F = SM.fmt, E = F.esc;

  /* ═══════════ §0. TIỆN ÍCH — tái dùng markup .toast/.sheet của mobile.html ═══════════ */
  function toast(m, ms) {
    let el = document.querySelector('.toast');
    if (el) el.remove();
    el = document.createElement('div'); el.className = 'toast'; el.textContent = m;
    document.body.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.remove(); }, ms || 3000);
  }
  function closeSheet() { const s = document.querySelector('.sheet'); if (s) s.remove(); }
  function sheet(title, html, after) {
    closeSheet();
    const w = document.createElement('div'); w.className = 'sheet';
    w.innerHTML = '<div class="inner"><div class="row"><h3 style="flex:1">' + E(title) + '</h3>' +
      '<button class="btn sm gh" data-x>Đóng</button></div>' + html + '</div>';
    w.addEventListener('click', e => { if (e.target === w || e.target.hasAttribute('data-x')) closeSheet(); });
    document.body.appendChild(w);
    if (after) after(w);
    return w;
  }

  /* Đọc số thành lời Việt — CHỈ dùng để dựng câu thoại mô phỏng; con số chính xác
     hiển thị cho hộ vẫn lấy từ F.num/F.d trên giá trị gốc của kho. */
  const SO = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  function docDu(n) { // 10..99
    if (n < 20) return n === 10 ? ['mười'] : ['mười', n === 15 ? 'lăm' : SO[n - 10]];
    const chuc = Math.floor(n / 10), du = n % 10, out = [SO[chuc] + ' mươi'];
    if (du === 1) out.push('mốt'); else if (du === 5) out.push('lăm'); else if (du) out.push(SO[du]);
    return out;
  }
  function docBa(n) { // 0..999
    if (n < 10) return SO[n];
    const tram = Math.floor(n / 100), du = n % 100, m = [];
    if (tram) m.push(SO[tram] + ' trăm');
    if (!du) return m.join(' ');
    if (du < 10) m.push('lẻ ' + SO[du]); else m.push(...docDu(du));
    return m.join(' ');
  }
  function docSo(n) {
    n = Math.round(Math.abs(n));
    if (n === 0) return 'không';
    const trieu = Math.floor(n / 1e6), nghin = Math.floor((n % 1e6) / 1e3), du = n % 1e3, m = [];
    if (trieu) m.push(docBa(trieu) + ' triệu');
    if (nghin) m.push(docBa(nghin) + ' nghìn');
    if (du || (!trieu && !nghin)) m.push(docBa(du));
    return m.join(' ');
  }
  const DV_CHU = { kg: 'ký', chai: 'chai', hộp: 'hộp', gói: 'gói', suất: 'suất', khách: 'khách', đêm: 'đêm', lượt: 'lượt' };
  const donViChu = u => DV_CHU[u] || u || '';
  const GIO_CHU = { // giờ đặt chỗ của tài nguyên — chỉ để dựng câu thoại tự nhiên
    '07:30': 'bảy giờ rưỡi', '09:30': 'chín giờ rưỡi', '13:30': 'một giờ rưỡi chiều',
    '15:30': 'ba giờ rưỡi chiều', '08:00': 'tám giờ', '10:00': 'mười giờ', '14:00': 'hai giờ chiều',
  };
  const gioChu = s => GIO_CHU[s] || s;

  /* ═══════════ §1. VIỆC ĐANG CHỜ — hàm thuần từ kho (D-#3) ═══════════
     Mỗi phần tử: {ten, moTa, dienRa, danhThucBoi, nguon} — nguon là nhãn nguồn
     màn hình theo quy ước sẵn có của repo, không in ra trước mặt hộ. */
  function viecDangCho(t) {
    const v = [];

    // (a) đồng hồ 30 ngày đăng ký hoá đơn điện tử [Q-001] — hạn = luc + 30 ngày lịch
    if (typeof D.mocVuotNguong === 'function') {
      const m = D.mocVuotNguong(t);
      if (m) v.push({
        ten: 'Đồng hồ 30 ngày đăng ký hoá đơn điện tử',
        moTa: m.conLai >= 0 ? 'Canh tới ngày ' + F.dmy(m.han) : 'Đã quá hạn ngày ' + F.dmy(m.han),
        dienRa: m.conLai >= 0 ? 'còn ' + m.conLai + ' ngày' : 'quá hạn ' + (-m.conLai) + ' ngày',
        danhThucBoi: 'đồng hồ hẹn giờ',
        nguon: 'Q-001 — D.mocVuotNguong',
      });
    }

    // (b) hạn kê khai — thẻ thuế trong D.deadlines; thẻ nguong-30n bỏ vì khối (a) đã nói
    if (typeof D.deadlines === 'function') {
      D.deadlines(t).forEach(x => {
        if (x.dichDen !== 'thue' || x.id === 'nguong-30n') return;
        v.push({
          ten: 'Hạn kê khai thuế',
          moTa: x.ten,
          dienRa: (x.conLai === null || x.conLai === undefined) ? 'theo kỳ của cơ quan thuế'
            : x.conLai >= 0 ? 'còn ' + x.conLai + ' ngày' : 'quá hạn ' + (-x.conLai) + ' ngày',
          danhThucBoi: 'đồng hồ hẹn giờ',
          nguon: 'D.deadlines — thẻ ' + x.id,
        });
      });
    }

    // (c)+(e) từng kênh: chờ duyệt thì canh trả lời; đã nối thì nghe tiền về/đơn về.
    //     etax/cts/ketoan không có luồng dữ liệu tự chảy (bảng C.15) nên không nằm đây.
    const knAll = ((t.onboarding || {}).ketNoi) || {};
    D.connectors(t).forEach(c => {
      const k = knAll[c.id];
      if (k && k.trangThai === 'cho_duyet') v.push({
        ten: 'Chờ ' + c.ten + ' duyệt hồ sơ',
        moTa: 'Hồ sơ đã gửi đi' + (k.batDauLuc ? ' ngày ' + F.dmy(k.batDauLuc) : '') +
              (k.hanDuKien ? ', bên đó hẹn khoảng ' + F.dmy(k.hanDuKien) : ''),
        dienRa: 'chờ ' + c.ten + ' trả lời',
        danhThucBoi: 'tin từ bên đó gửi về',
        nguon: 't.onboarding.ketNoi.' + c.id,
      });
      const daNoi = (k && k.trangThai === 'da_ket_noi') || c.noi;
      if (daNoi && ['etax', 'cts', 'ketoan'].indexOf(c.id) < 0) v.push({
        ten: 'Nghe ' + c.ten + (c.id === 'bank' ? ' — tiền về tới là biết' : ' — đơn về tới là biết'),
        moTa: 'Kênh đã nối, dữ liệu tự chảy về',
        dienRa: 'đang nối, chờ sự kiện',
        danhThucBoi: 'sự kiện từ ' + c.ten + ' gửi tới',
        nguon: 'connector ' + c.id + ' đang nối',
      });
    });

    // (d) hàng đợi gửi đi — việc làm khi mất mạng
    const q = typeof SM.queueCount === 'function' ? SM.queueCount() : 0;
    if (q > 0) v.push({
      ten: q + ' việc đã làm xong, chờ gửi lên',
      moTa: 'Lập khi mất mạng — dữ liệu nằm trong máy, không mất',
      dienRa: 'chờ có mạng',
      danhThucBoi: 'mạng quay lại',
      nguon: 'SM.queueCount()',
    });
    return v;
  }

  /* ═══════════ §2. NGUỒN ĐÁNH THỨC — 3 nhóm (D-#3) ═══════════ */
  function nguonDanhThuc(t) {
    const knAll = ((t.onboarding || {}).ketNoi) || {};
    // kênh đang nối và CÓ luồng dữ liệu tự chảy (C.15) — nhóm «tin từ bên ngoài»
    const dangNoi = D.connectors(t).filter(c => {
      const k = knAll[c.id];
      return ((k && k.trangThai === 'da_ket_noi') || c.noi) && ['etax', 'cts', 'ketoan'].indexOf(c.id) < 0;
    });
    return [
      { // webhook — từ chỉ nằm trong comment, không in ra màn
        id: 'tin-ngoai', ten: 'Tin từ bên ngoài gửi về',
        moTa: 'Có tin mới từ kênh đã nối — tiền về, đơn về, duyệt xong — hệ thống nhận ngay.',
        muc: dangNoi.length ? dangNoi.map(c => c.ten) : ['chưa có kênh nào đã nối — xem Trạm kết nối'],
      },
      { // poll đối soát ≥ 24 giờ [Q-003]
        id: 'tu-hoi', ten: 'App tự hỏi lại theo giờ',
        moTa: 'Ngày nào cũng tự đối chiếu lại tiền, đơn, đặt chỗ — nhặt của rơi rớt.',
        muc: ['đối soát tiền về, đơn bán, đặt chỗ — ít nhất mỗi ngày một lần'],
      },
      {
        id: 'ho-mo', ten: 'Hộ mở app',
        moTa: 'Cô chú mở máy lên là mọi việc chờ hiện ra ngay — không cần nhớ gì cả.',
        muc: ['việc chờ hiện ở thẻ «Sáng nay cần gì»', 'hàng đợi tự trôi đi khi có mạng'],
      },
    ];
  }

  /* ═══════════ §3. MÀN «TRỢ LÝ CHẠY NỀN» — D-#3, trục A3 R-A3-01/06/07 ═══════════ */
  function viewNen(t) {
    const vc = viecDangCho(t);
    const nguon = nguonDanhThuc(t);
    const nTrung = t.trungBoDem || 0; // W3 sm-inbox đếm mỗi lần chặn bản trùng theo id
    let h = `<div class="card"><div class="bd">
      <div style="font-weight:700;font-size:16px">🌙 Trợ lý chạy nền</div>
      <div style="margin-top:6px;font-size:14px;line-height:1.6">Cô chú tắt máy đi ngủ thì app vẫn trực. Dưới đây là những việc nó đang canh, và cái gì làm nó thức dậy.</div>
    </div></div>`;

    h += `<div class="card"><div class="hd"><h2>Việc đang chờ</h2><span class="sub">${E(String(vc.length))} việc · tính từ sổ của hộ</span></div>
      <div class="bd tight scrollx"><table class="t">
      <thead><tr><th>Việc đang canh</th><th>Tới khi nào / chờ ai</th><th>Cái gì đánh thức</th></tr></thead>
      <tbody>${vc.length ? vc.map(x => `<tr>
        <td><b>${E(x.ten)}</b><div class="muted">${E(x.moTa)}</div></td>
        <td>${E(x.dienRa)}</td><td>${E(x.danhThucBoi)}</td></tr>`).join('')
        : '<tr><td colspan="3" class="muted">Không có việc nào đang chờ — mọi kênh yên ổn.</td></tr>'}
      </tbody></table></div></div>`;

    h += `<div class="card"><div class="hd"><h2>Cái gì đánh thức nó dậy</h2><span class="sub">3 đường</span></div>
      <div class="bd tight">${nguon.map((g, i) => `<div style="padding:9px 0;${i ? 'border-top:1px solid var(--line);' : ''}">
        <div style="font-weight:640;font-size:14px">${E(g.ten)}</div>
        <div class="muted" style="margin:3px 0 6px">${E(g.moTa)}</div>
        <div class="row wrap" style="gap:5px">${g.muc.map(m => `<span class="tag br">${E(m)}</span>`).join('')}</div>
      </div>`).join('')}</div></div>`;

    // nền bằng chứng Q-003: trạng thái nằm ở bộ nhớ bền — không tốn tài nguyên khi chờ
    h += `<div class="card"><div class="hd"><h2>Lúc ngủ có tốn gì không</h2></div><div class="bd">
      <div style="font-size:14px;line-height:1.6">Không tốn gì — việc nằm chờ trong máy chủ, không chạy vòng vòng. Chỉ khi có tin về hoặc tới giờ hẹn thì nó mới thức dậy làm.</div>
    </div></div>`;

    h += `<div class="card"><div class="hd"><h2>Nhận trùng thì sao</h2></div><div class="bd">
      <div style="font-size:14px;line-height:1.6">${nTrung > 0
        ? `Đã tự bỏ <b>${E(String(nTrung))} lần</b> dữ liệu gửi trùng — tiền không bị cộng hai lần.`
        : 'Chưa gặp lần nào.'}</div>
      <button class="btn w sm" data-di="hopthu" style="margin-top:10px">Xem hộp thư đến</button>
    </div></div>`;
    return h;
  }
  /* mọi nút của màn đều đi data-di — mobile.html tự bind trong bindNhac; giữ đúng chữ ký hợp đồng */
  function bindNen() {}

  /* ═══════════ §4. «NÓI THAY GÕ» — mô phỏng nhận dạng giọng nói (D-#10, THUMOI IV.4) ═══════════
     Kịch bản chọn theo ngành của hộ; tên người/mặt hàng/số liệu LẤY TỪ KHO (seed),
     không bịa thêm. Xác nhận xong chỉ trả dữ liệu qua boiCanh.onXong — không tự ghi sổ. */
  function kichBanTheoNganh(t) {
    const n = String(t.nganh || '');
    if (n.indexOf('Nông sản') >= 0) return 'thu-mua';   // «Nông sản đặc sản» phải xét trước «đặc sản»
    if (n.indexOf('đặc sản') >= 0) return 'quay';
    if (n.indexOf('du lịch') >= 0) return 'datcho';
    return 'quay';
  }

  /** Dựng kịch bản: {rong, thongBao} | {thoai, truong, dong:[{duLieu, giaTri}], ghiChu} */
  function dungKichBan(t, loai) {
    if (loai === 'thu-mua') {
      // chùm nông dân thu mua — đúng D-#10 «chùm 5 nông dân giá khác nhau», giá mỗi người từ sổ
      const ps = (t.purchases || []).slice(-5);
      if (!ps.length) return { rong: true, thongBao: 'Sổ thu mua của hộ này chưa có dòng nào — quay lại sau lượt mua đầu tiên, hoặc xem thử hộ Nông sản Chư Păh (nút ☰ trên cùng).' };
      return {
        thoai: ps.map(p => `${p.seller} ${docSo(p.qty)} ${donViChu(p.unit)} ${String(p.item || '').toLowerCase()}, giá ${docSo(p.price)}`).join('. ') + '.',
        truong: ['Người bán', 'Số lượng', 'Đơn giá', 'Thành tiền'],
        dong: ps.map(p => ({
          duLieu: { seller: p.seller, sku: p.sku, item: p.item, qty: p.qty, unit: p.unit, price: p.price, diaChi: p.diaChi, cccd: p.cccd },
          giaTri: [E(p.seller), E(F.num(p.qty) + ' ' + p.unit), E(F.d(p.price)), E(F.d(p.qty * p.price))],
        })),
        ghiChu: 'Chùm nhiều người — mỗi dòng một người, xác nhận đến đâu đưa người đó lên phiếu nhập đến đó.',
      };
    }
    if (loai === 'datcho') {
      // khách đặt chỗ trên tài nguyên có lịch (ca nô, lặn…) — ngày mai tính từ đồng hồ app
      const boats = (t.resources || []).filter(r => r.kind === 'boat');
      if (!boats.length) return { rong: true, thongBao: 'Hộ này chưa có tài nguyên đặt chỗ (ca nô, lặn, phòng) trong sổ — không có gì để nghe.' };
      const b = boats[0], slot = (b.slots || [])[0] || '07:30';
      const ngayMai = typeof D.congNgay === 'function' ? D.congNgay(SM.CLOCK.today, 1) : SM.CLOCK.today;
      const daDat = (t.bookings || [])
        .filter(k => k.resource === b.id && k.date === ngayMai && k.slot === slot)
        .reduce((s, k) => s + (k.pax || 0), 0);
      const conCho = Math.max(0, (b.capacity || 0) - daDat);
      return {
        thoai: `hai người, ngày mai, ${gioChu(slot)}, ${String(b.ten).toLowerCase()}.`,
        truong: ['Buổi / tài nguyên', 'Khách', 'Ngày', 'Còn chỗ'],
        dong: [{
          duLieu: { resource: b.id, ten: b.ten, slot, pax: 2, date: ngayMai },
          giaTri: [E(b.ten + ' — ' + slot), E('2 khách'), E(F.dmy(ngayMai)), E(conCho + ' chỗ')],
        }],
        ghiChu: 'Số chỗ còn lại tính từ bảng đặt chỗ thật của hộ — đủ chỗ mới hiện số dương.',
      };
    }
    if (loai === 'tro-ly') {
      // câu hỏi cho ô nhập của Trợ lý — chữ hỏi theo ngành; số đáp do Lớp A tính từ kho
      const ps = (t.purchases || []);
      const skus = (t.skus || []).filter(s => !s.dichVu);
      const boats = (t.resources || []).filter(r => r.kind === 'boat');
      let cau = 'hôm nay bán được bao nhiêu tiền?';
      if (ps.length) cau = `tháng này mua của ${ps[ps.length - 1].seller} bao nhiêu tiền rồi?`;
      else if (boats.length) cau = `buổi ${(boats[0].slots || ['07:30'])[0]} ngày mai trên ${boats[0].ten} còn chỗ không?`;
      else if (skus.length) cau = `trong kho còn bao nhiêu ${String(skus[0].name).toLowerCase()}?`;
      return {
        thoai: cau,
        truong: ['Câu hỏi nghe được'],
        dong: [{ duLieu: { cauHoi: cau }, giaTri: [E(cau)] }],
        ghiChu: 'Xác nhận xong câu này được điền vào ô hỏi của Trợ lý — trợ lý trả lời bằng số tính từ sổ.',
      };
    }
    // mặc định: bán tại quầy — 2 mặt hàng đầu của kho, số lượng 2 và 1 (dữ liệu tự chảy).
    // Hộ chỉ có dịch vụ đặt trước (du lịch) thì «bán tại quầy» chính là nhận khách đặt —
    // rơi về kịch bản đặt chỗ ở trên cho đúng ngành (đề V1: du lịch → «hai người ngày mai bảy giờ rưỡi ca nô»).
    const skus = (t.skus || []).filter(s => !s.dichVu).slice(0, 2);
    if (!skus.length) return dungKichBan(t, 'datcho');
    const chon = skus.map((s, i) => ({ s, qty: i === 0 ? 2 : 1 }));
    return {
      thoai: chon.map(x => `${docSo(x.qty)} ${donViChu(x.s.unit)} ${String(x.s.name).toLowerCase()}`).join(', ') + '.',
      truong: ['Món', 'Số lượng', 'Đơn giá', 'Thành tiền'],
      dong: chon.map(x => ({
        duLieu: { sku: x.s.sku, name: x.s.name, unit: x.s.unit, qty: x.qty, price: x.s.price },
        giaTri: [E(x.s.name), E(F.num(x.qty) + ' ' + x.s.unit), E(F.d(x.s.price)), E(F.d(x.qty * x.s.price))],
      })),
      ghiChu: 'Xác nhận xong các món được xếp vào giỏ bán tại quầy — cô chú kiểm tra rồi mới thu tiền.',
    };
  }

  /**
   * NEN.sheetNoi(t, boiCanh) — boiCanh: {noi:'thu-mua'|'quay'|'datcho'|'tro-ly' (mặc định theo
   * ngành), onXong:function(dongDuLieu)}. Sheet KHÔNG tự ghi sổ — chỉ trả dữ liệu về nơi gọi.
   */
  function sheetNoi(t, boiCanh) {
    boiCanh = boiCanh || {};
    const loai = boiCanh.noi || kichBanTheoNganh(t);
    const kb = dungKichBan(t, loai);

    let h = `<div class="note warn"><b>MÔ PHỎNG nhận dạng giọng nói — bản thật cần máy nghe tiếng Việt.</b> Bản demo này chạy theo kịch bản ghép từ sổ thật của hộ.</div>`;
    if (kb.rong) {
      h += `<div class="card" style="margin-top:12px"><div class="bd">${E(kb.thongBao)}</div></div>`;
      sheet('🎤 Nói thay gõ', h);
      return;
    }
    h += `<div class="card" style="margin-top:12px"><div class="hd"><h2>Bản nghe được</h2><span class="sub">câu thoại thô</span></div>
      <div class="bd"><div style="font-size:15px;line-height:1.6">«${E(kb.thoai)}»</div></div></div>`;
    h += `<div class="card"><div class="hd"><h2>Bóc ra từng dòng</h2><span class="sub">mỗi dòng 1 chạm xác nhận</span></div>
      <div class="bd tight scrollx"><table class="t">
      <thead><tr>${kb.truong.map(u => `<th>${E(u)}</th>`).join('')}<th></th></tr></thead>
      <tbody>${kb.dong.map((d, i) => `<tr id="nd-${i}">${d.giaTri.map(u => `<td>${u}</td>`).join('')}
        <td><button class="btn sm" id="nx-${i}">Xác nhận</button></td></tr>`).join('')}</tbody>
      </table></div>
      ${kb.ghiChu ? `<div class="bd muted">${E(kb.ghiChu)}</div>` : ''}</div>`;
    h += `<div class="card"><div class="bd">
      <button class="btn pri w" id="nDung" disabled>Dùng các dòng đã xác nhận</button>
      <div class="muted" style="margin-top:8px">Xác nhận xong dữ liệu mới đi tiếp — app không tự ghi sổ thay cô chú.</div>
    </div></div>`;

    sheet('🎤 Nói thay gõ', h, w => {
      const chon = [];
      const nutDung = w.querySelector('#nDung');
      const capNhat = () => {
        nutDung.disabled = chon.length === 0;
        nutDung.textContent = chon.length ? `Dùng ${chon.length} dòng đã xác nhận` : 'Dùng các dòng đã xác nhận';
      };
      kb.dong.forEach((d, i) => {
        const b = w.querySelector('#nx-' + i);
        if (!b) return;
        b.onclick = () => {
          const vt = chon.indexOf(i);
          if (vt >= 0) { chon.splice(vt, 1); b.className = 'btn sm'; b.textContent = 'Xác nhận'; }
          else { chon.push(i); b.className = 'btn sm pri'; b.textContent = 'Đã lấy ✓'; }
          capNhat();
        };
      });
      if (nutDung) nutDung.onclick = () => {
        const rows = chon.slice().sort((a, b2) => a - b2).map(i => kb.dong[i].duLieu);
        if (!rows.length) return;
        closeSheet();
        if (typeof boiCanh.onXong === 'function') boiCanh.onXong(rows);
        else toast('Đã xác nhận ' + rows.length + ' dòng — màn hình này chưa nối chỗ nhận dữ liệu');
      };
    });
  }

  /* ═══════════ §5. XUẤT ═══════════ */
  global.SM.nen = {
    viecDangCho, nguonDanhThuc,
    viewNen, bindNen,
    sheetNoi, kichBanTheoNganh, dungKichBan, docSo,
    toast, sheet,
  };
})(window);
