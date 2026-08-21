/**
 * sm-seed-b2g.js — 48 HỘ MÔ PHỎNG cho Sổ trực onboarding của b2g [CHOT P2 · PLAN B.11].
 *
 * Chỉ b2g đọc qua SM.seedB2G() — phía hộ KHÔNG thấy các hộ này.
 * KHÔNG tên người thật: hộ chỉ có mã suất, «Hộ số N — ngành», cán bộ CB-01…CB-06.
 * Sinh bằng LCG XÁC ĐỊNH mượn pattern của sm-seed-gialai.js — không Math.random:
 * chạy lại bao nhiêu lần cũng ra đúng 48 hộ y hệt; cache localStorage sinh 1 lần.
 *
 * Ranh giới IV.8 giữ nguyên: mỗi hộ chỉ có TRẠNG THÁI + NGÀY, không doanh thu chi tiết.
 *
 * Nâng cấp V3 (20/08/2026): mỗi hộ thêm `ketNoi` CHI TIẾT cùng shape hộ thật
 * (PLAN B.2/B.3 — trước đây chỉ có `ketNoiTom` đếm theo trạng thái nên Sổ trực
 * không suy ra việc nào được) + `viecHoanLuat` (shape như onboarding hộ thật)
 * + `vuotLuc` cho hộ >1 tỷ, rải cố ý đủ 3 màu của khối «Hạn 30 ngày».
 * Bump khoá cache sang -v3 để bản cũ (chỉ có ketNoiTom) không kẹt lại.
 * Soát lại V3 (20/08/2026): trạng thái `chua_co_tk` trước đó KHÔNG đường nào sinh ra
 * (chỉ có ô đếm bằng 0) — thẻ «Chưa có tài khoản» của b2g thành chữ chết; nay ép cứng
 * 2 hộ có kênh chua_co_tk + đưa vào bảng rút, đủ cả 7 mức của sm-domain HOP_LE.
 */
(function (global) {
  'use strict';

  const N = 48;                     // [CHOT P2] — 48 hộ mô phỏng cho b2g
  const KEY = 'smv3:b2g-hos-v3';    // V3: đổi tên khoá mỗi lần đổi cách sinh — bỏ cache bản cũ
  const AB = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // bỏ I, O, 0, 1 — dễ đọc nhầm khi gõ tay

  /* bộ sinh xác định — giống hệt sm-seed-gialai.js */
  function rng(seed) {
    let s = seed >>> 0;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }
  function pick(r, arr) { return arr[Math.floor(r() * arr.length)]; }

  /* 7 mức máy trạng thái tiến trình onboarding (PLAN B.1) */
  const BUOC = ['chua_kich_hoat', 'kich_hoat', 'da_tra_loi', 'da_sinh_danh_muc',
                'dang_noi', 'du_toi_thieu', 'xong_viec_dau'];
  const NGANH = [
    { ma: 'dac-san',  ten: 'Đặc sản' },
    { ma: 'du-lich',  ten: 'Du lịch' },
    { ma: 'nong-san', ten: 'Nông sản' },
  ];
  const CAN_BO = ['CB-01', 'CB-02', 'CB-03', 'CB-04', 'CB-05', 'CB-06'];

  /* đợt nộp hồ sơ Zalo OA theo tuần [Q-004 — hộ nộp cùng lúc nên nhóm theo đợt];
     nopTu = ngày nộp đại diện giữa tuần, làm mốc tính hạn duyệt */
  const DOT_OA = [
    { ten: 'Tuần nộp 1 (10/08–16/08)', nopTu: '2026-08-12' },
    { ten: 'Tuần nộp 2 (17/08–23/08)', nopTu: '2026-08-19' },
    { ten: 'Tuần nộp 3 (24/08–30/08)', nopTu: '2026-08-26' },
    { ten: 'Tuần nộp 4 (31/08–06/09)', nopTu: '2026-09-02' },
  ];

  /* ═══ V3 — danh mục + trạng thái chi tiết theo PLAN B.2/B.7 ═══
     lõi mọi hộ: tiền về + Zalo OA (B.1 gọi là «tối thiểu bank + zalooa»);
     nhóm LUẬT (hddt/cts/etax) CHỈ sinh cho hộ >1 tỷ — đúng B.7 */
  const MA_NEN = ['bank', 'zalooa'];
  const MA_THEM = ['pos', 'shopee', 'tiktok', 'ghn'];
  const MA_LUAT = ['hddt', 'cts', 'etax'];

  /* lý do hộ nói khi hoãn / bỏ — chữ đời thường, không bịa dẫn luật */
  const LY_DO_HOAN = [
    'Chủ hộ vắng nhà mấy ngày, hẹn tuần sau làm tiếp',
    'Đang chờ người trong nhà cùng đi ký',
    'Hộ xin để cuối tháng làm nốt một thể',
  ];
  const LY_DO_BO = 'Chủ hộ chưa muốn nối lúc này — việc không bắt buộc, để hộ tự quyết';
  const LY_DO_LOI = 'Bên thứ ba trả lời chưa duyệt — cần cán bộ xem lại hồ sơ';
  const LY_DO_CHUA_TK = 'Hộ chưa có tài khoản kênh này — cán bộ cần hướng dẫn hộ đăng ký trước';

  /* cộng n NGÀY LỊCH — UTC an toàn múi giờ, cùng nghĩa SM.dayOffset của sm-core.js */
  function congNgay(iso, n) {
    const p = String(iso).slice(0, 10).split('-');
    const d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }

  /* cộng n NGÀY LÀM VIỆC (bỏ T7/CN) — cùng nghĩa ON.congNgayLamViec của sm-onboard.js */
  function congNgayLamViec(iso, n) {
    const d = new Date(iso + 'T00:00:00Z');
    let them = n;
    while (them > 0) {
      d.setUTCDate(d.getUTCDate() + 1);
      const w = d.getUTCDay();            // 0 = chủ nhật, 6 = thứ bảy
      if (w !== 0 && w !== 6) them -= 1;
    }
    return d.toISOString().slice(0, 10);
  }

  function sinhHo() {
    const r = rng(482048);        // hạt giống cố định — đổi số này là đổi cả bảng
    const rand = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    /* «hôm nay» của demo — CLOCK cố định sm-core.js; nạp trước sm-core thì dùng mốc chốt */
    const HOM_NAY = (global.SM && global.SM.CLOCK && global.SM.CLOCK.today) || '2026-08-17';

    /* vòng 1 — xương mỗi hộ; kèm bảo hiểm cho 7 mức B.1 đều có mặt */
    const xuong = [];
    for (let i = 1; i <= N; i++) {
      xuong.push({
        so: i,
        buoc: pick(r, BUOC),
        nganh: pick(r, NGANH),
        canBo: pick(r, CAN_BO),
        dotOA: pick(r, DOT_OA),
        cungCanBo: r() < 0.4,   // hộ làm cùng cán bộ ngay từ đầu — để b2g vẽ định mức 2 nhóm
        vuotNguong: r() < 0.15, // hộ >1 tỷ — thức dòng «Hạn 30 ngày» của Sổ trực [Q-001]
      });
    }
    BUOC.forEach((b, i) => { if (!xuong.some(h => h.buoc === b)) xuong[i].buoc = b; });

    /* bảo hiểm dữ liệu cho Sổ trực (V3) — gắn CỨNG thay vì trông chờ may rủi của LCG:
       (a) ≥2 hộ «đang nối» là hộ >1 tỷ → khối hoãn LUẬT + hạn 30 ngày đỏ/vàng có dòng;
       (b) 2 hộ >1 tỷ đang nối đầu tiên gắn cờ hoãn hoá đơn điện tử (kèm viecHoanLuat);
       (c) hộ «đang nối» đầu tiên nộp thuộc đợt 1 (tuần trước) → khối «chờ duyệt quá hạn» có dòng. */
    let soHoan = 0, soVuotDangNoi = xuong.filter(h => h.buoc === 'dang_noi' && h.vuotNguong).length;
    let soChuaTk = 0;
    xuong.forEach(h => {
      if (h.buoc !== 'dang_noi') return;
      if (!h.vuotNguong && soVuotDangNoi < 2) { h.vuotNguong = true; soVuotDangNoi++; }
      if (h.vuotNguong && soHoan < 2) { h.coHoan = true; soHoan++; }
      /* (d) 2 hộ chắc chắn có việc «hộ chưa có tài khoản kênh này» — trạng thái chua_co_tk
         nằm trong 7 mức hợp lệ (sm-domain HOP_LE) và b2g có sẵn thẻ «Chưa có tài khoản»,
         nhưng LCG có thể không rơi vào lần nào nên ép cứng, không trông may rủi */
      if (soChuaTk < 2) { h.epChuaCoTk = true; soChuaTk++; }
    });
    const dauTien = xuong.find(h => h.buoc === 'dang_noi');
    if (dauTien) { dauTien.dotOA = DOT_OA[0]; dauTien.epChoDuyet = true; }

    /* vòng 2 — đắp DANH SÁCH kết nối chi tiết (cùng shape onboarding.ketNoi của hộ thật,
       PLAN B.2/B.3), suy từ buoc để không tự mâu thuẫn; ketNoiTom đếm lại TỪ danh sách
       này nên hai nguồn không bao giờ lệch nhau */
    const maDaDung = {};
    const ds = xuong.map(x => {
      const kn = {};
      const dat = (ma, trangThai, extra) => { kn[ma] = Object.assign({ trangThai: trangThai }, extra || {}); };

      // ngày nộp hồ sơ trong đợt + hạn duyệt 2–3 ngày làm việc [Q-004];
      // hộ bị ép chờ duyệt (bảo hiểm vòng 1) lấy CỨNG +2 để chắc chắn đã quá hạn hôm nay
      const nopLuc = x.dotOA.nopTu;
      const hanDuyet = congNgayLamViec(nopLuc, x.epChoDuyet ? 2 : 2 + Math.floor(r() * 2));

      // danh mục của hộ: lõi mọi hộ; việc thêm theo ngành chỉ khi đã qua phần hỏi;
      // nhóm LUẬT chỉ sinh cho hộ >1 tỷ (B.7) — mọi connector của hộ >1 tỷ đều có mặt
      const danhMuc = MA_NEN.slice();
      if (x.buoc !== 'chua_kich_hoat' && x.buoc !== 'kich_hoat' && x.buoc !== 'da_tra_loi') {
        const soThem = 1 + Math.floor(r() * 2);
        for (let i = 0; i < soThem; i++) {
          const m = MA_THEM[(x.so + i * 2 + Math.floor(r() * MA_THEM.length)) % MA_THEM.length];
          if (danhMuc.indexOf(m) < 0) danhMuc.push(m);
        }
      }
      if (x.vuotNguong) danhMuc.push.apply(danhMuc, MA_LUAT);

      if (x.buoc === 'dang_noi') {
        // tiền về trước (B.0 iv); Zalo OA nộp theo đợt; LUẬT còn dở — hộ hoãn thì hddt đang làm dở
        /* GIỮ ĐÚNG 7 phần tử: pick() rút r() một lần rồi lấy theo chỉ số, đổi ĐỘ DÀI mảng là
           đổi luôn kết quả của mọi hộ phía sau; thay tại chỗ 1 trong 3 ô 'chua_hoi' bằng
           'chua_co_tk' nên chỉ hộ nào trước đây rơi vào ô đó mới đổi */
        const ttThem = ['chua_hoi', 'chua_hoi', 'chua_co_tk', 'dang_dang_ky', 'da_ket_noi', 'loi', 'bo_qua'];
        let daChuaTk = false;   // mỗi hộ chỉ ép 1 kênh chua_co_tk, các kênh còn lại rút bình thường
        danhMuc.forEach(ma => {
          if (ma === 'bank') {
            dat(ma, r() < 0.85 ? 'da_ket_noi' : 'dang_dang_ky', { batDauLuc: congNgay(nopLuc, -2) });
          } else if (ma === 'zalooa') {
            if (x.epChoDuyet || r() < 0.4) dat(ma, 'cho_duyet', { batDauLuc: nopLuc, hanDuKien: hanDuyet, hoSoDaNop: ['don-dang-ky-zalo-oa', 'anh-gpkd'] });
            else dat(ma, r() < 0.6 ? 'da_ket_noi' : 'dang_dang_ky', { batDauLuc: nopLuc });
          } else if (MA_LUAT.indexOf(ma) >= 0) {
            if (x.coHoan && ma === 'hddt') dat(ma, 'dang_dang_ky', { batDauLuc: nopLuc });
            else if (r() < 0.35) dat(ma, 'cho_duyet', { batDauLuc: nopLuc, hanDuKien: hanDuyet });
            else dat(ma, pick(r, ['chua_hoi', 'chua_hoi', 'dang_dang_ky']));
          } else {
            /* vẫn rút r() đúng 1 lần kể cả khi ép — để dòng số của các hộ sau không lệch */
            const rut = pick(r, ttThem);
            const ep = x.epChuaCoTk && !daChuaTk;
            if (ep) daChuaTk = true;
            const tt = ep ? 'chua_co_tk' : rut;
            dat(ma, tt, tt === 'bo_qua' ? { lyDo: LY_DO_BO } : tt === 'loi' ? { lyDo: LY_DO_LOI }
              : tt === 'chua_co_tk' ? { lyDo: LY_DO_CHUA_TK }
              : tt === 'da_ket_noi' ? { batDauLuc: congNgay(nopLuc, -3) } : null);
          }
        });
      } else if (x.buoc === 'du_toi_thieu' || x.buoc === 'xong_viec_dau') {
        // đạt tối thiểu (B.1): bank + zalooa đã nối; LUẬT của hộ >1 tỷ buộc đã nối
        const coBoQua = x.buoc === 'xong_viec_dau' && r() < 0.3;
        let daBo = false;
        danhMuc.forEach(ma => {
          if (ma === 'bank' || ma === 'zalooa' || MA_LUAT.indexOf(ma) >= 0) {
            dat(ma, 'da_ket_noi', { batDauLuc: congNgay(nopLuc, -(2 + Math.floor(r() * 4))) });
          } else if (coBoQua && !daBo) {
            daBo = true; dat(ma, 'bo_qua', { lyDo: LY_DO_BO });
          } else {
            const tt = pick(r, ['da_ket_noi', 'da_ket_noi', 'da_ket_noi', 'chua_hoi', 'cho_duyet']);
            dat(ma, tt, tt === 'da_ket_noi' ? { batDauLuc: congNgay(nopLuc, -3) }
              : tt === 'cho_duyet' ? { batDauLuc: nopLuc, hanDuKien: hanDuyet } : null);
          }
        });
      } else {
        // chua_kich_hoat → mọi connector «chưa hỏi»; các bước trước dang_noi cũng vậy
        danhMuc.forEach(ma => dat(ma, 'chua_hoi'));
      }

      // hoãn nhóm LUẬT — cùng shape ob.viecHoanLuat của sm-onboard.js {ma, ngay, nguoi, lyDo}
      const viecHoanLuat = [];
      if (x.coHoan) viecHoanLuat.push({
        ma: 'hddt', ngay: congNgay(HOM_NAY, -(1 + Math.floor(r() * 5))),
        nguoi: 'Chủ hộ', lyDo: pick(r, LY_DO_HOAN),
      });

      // đếm lại theo trạng thái — W5/W9 vẫn đọc ketNoiTom, giờ là dẫn xuất của ketNoi
      const kt = { chua_hoi: 0, chua_co_tk: 0, dang_dang_ky: 0, cho_duyet: 0, da_ket_noi: 0, loi: 0, bo_qua: 0 };
      Object.keys(kn).forEach(ma => { if (kt[kn[ma].trangThai] !== undefined) kt[kn[ma].trangThai] += 1; });

      // phút tới việc đầu (đích đo R-A2-07) — chỉ hộ đã xong việc đầu có số;
      // hộ làm cùng cán bộ thì nhanh hơn (5–15 phút) so với tự làm (16–40 phút)
      const phut = x.buoc === 'xong_viec_dau' ? (x.cungCanBo ? rand(5, 15) : rand(16, 40)) : null;

      // mã suất GL26-XXXX-XXXX [P3] — sinh lại tới khi không trùng trong bảng
      let ma;
      do {
        ma = 'GL26';
        for (let g = 0; g < 2; g++) {
          let nhom = '';
          for (let k = 0; k < 4; k++) nhom += AB[Math.floor(r() * AB.length)];
          ma += '-' + nhom;
        }
      } while (maDaDung[ma]);
      maDaDung[ma] = 1;

      return {
        ma, ten: 'Hộ số ' + x.so + ' — ' + x.nganh.ten, nganh: x.nganh.ma, so: x.so,
        buoc: x.buoc, ketNoi: kn, ketNoiTom: kt, viecHoanLuat,
        canBo: x.canBo, dotOA: x.dotOA.ten,
        cungCanBo: x.cungCanBo, vuotNguong: x.vuotNguong, vuotLuc: null,
        phutTuKichHoat: phut,
      };
    });

    /* vòng 3 — mốc vượt 1 tỷ (t.vuotLuc [Q-001]) rải CỐ Ý theo «hôm nay» của CLOCK
       để khối «Hạn 30 ngày» có đủ 3 màu: 2 hộ ĐÃ QUÁ HẠN (đỏ — ưu tiên hộ đang nối,
       cặp với chuyện hoãn nên cháy hạn), 2 hộ còn <7 ngày (vàng), còn lại đếm
       bình thường; hộ đã đăng ký xong thì mốc gần → đồng hồ vẫn dương, không hiện đỏ */
    const chuaNoiHDDT = ds.filter(h => h.vuotNguong && !(h.ketNoi.hddt && h.ketNoi.hddt.trangThai === 'da_ket_noi'));
    chuaNoiHDDT.sort((a, b) => (a.buoc === 'dang_noi' ? 0 : 1) - (b.buoc === 'dang_noi' ? 0 : 1) || a.so - b.so);
    chuaNoiHDDT.forEach((h, i) => {
      const conLai = i === 0 ? -3 : i === 1 ? -9 : i === 2 ? 2 : i === 3 ? 5 : 12 + (i - 4) * 3;
      h.vuotLuc = congNgay(HOM_NAY, conLai - 30);      // hạn = luc + 30 → còn đúng conLai ngày
    });
    ds.forEach((h, i) => {
      if (h.vuotNguong && h.vuotLuc === null) h.vuotLuc = congNgay(HOM_NAY, -(6 + Math.min(i, 12)));
    });
    return ds;
  }

  function seedB2G() {
    try {
      const s = localStorage.getItem(KEY);
      if (s) { const hos = JSON.parse(s); if (hos && hos.length === N) return hos; }
    } catch (e) { /* kho hỏng — sinh lại bên dưới */ }
    const hos = sinhHo();
    try { localStorage.setItem(KEY, JSON.stringify(hos)); } catch (e) { /* không ghi được cache vẫn dùng được */ }
    return hos;
  }

  global.SM_SEED_B2G = { soHo: N, sinhHo };        // dự phòng khi nạp trước sm-core.js
  (global.SM = global.SM || {}).seedB2G = seedB2G; // SM.seedB2G() — nạp SAU sm-core.js
})(window);
