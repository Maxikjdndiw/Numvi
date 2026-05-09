import { useState, useEffect, useRef } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#f5f5f7;--surface:#fff;--s2:#f0f0f5;--s3:#e8e8ed;
    --ink:#1a1a2e;--ink2:#6e6e80;--ink3:#aeaeb8;
    --green:#34c759;--red:#ff3b30;--gold:#ff9f0a;--blue:#007aff;
    --r:18px;--rsm:12px;--rlg:24px;
    --head:'Syne',sans-serif;--body:'DM Sans',sans-serif;
    --sh:0 1px 3px rgba(0,0,0,0.06),0 4px 20px rgba(0,0,0,0.05);
    --sh2:0 8px 32px rgba(0,0,0,0.1);
  }
  body{font-family:var(--body);background:#e5e5ea;display:flex;align-items:center;justify-content:center;min-height:100vh;overflow:hidden}
  .phone{width:390px;height:844px;background:var(--bg);border-radius:40px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 30px 80px rgba(0,0,0,0.25),0 0 0 1px rgba(0,0,0,0.08);position:relative}
  .nav{height:58px;background:rgba(245,245,247,0.92);backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,0.07);display:flex;align-items:center;justify-content:space-between;padding:0 20px;flex-shrink:0;z-index:20}
  .logo{font-family:var(--head);font-size:20px;font-weight:800;color:var(--ink);letter-spacing:-0.5px}
  .logo em{color:var(--ink3);font-style:normal;font-weight:700}
  .pills{display:flex;gap:6px}
  .pill{display:flex;align-items:center;gap:4px;background:var(--surface);border:1px solid rgba(0,0,0,0.08);border-radius:20px;padding:5px 10px;font-size:11px;font-weight:600;color:var(--ink2);box-shadow:var(--sh)}
  .pill b{color:var(--ink)}
  .scroll{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch}
  .scroll::-webkit-scrollbar{display:none}
  .tabbar{height:72px;background:rgba(255,255,255,0.95);backdrop-filter:blur(20px);border-top:1px solid rgba(0,0,0,0.07);display:flex;flex-shrink:0;z-index:20;padding-bottom:4px}
  .ti{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;cursor:pointer;border:none;background:none;transition:transform 0.1s}
  .ti:active{transform:scale(0.9)}
  .ti-ico{font-size:22px;line-height:1;transition:transform 0.2s}
  .ti.active .ti-ico{transform:scale(1.15)}
  .ti-lbl{font-size:10px;font-weight:600;color:var(--ink3);letter-spacing:0.2px;transition:color 0.2s}
  .ti.active .ti-lbl{color:var(--ink)}
  .screen{padding:20px;display:flex;flex-direction:column;gap:14px;padding-bottom:24px}
  .slbl{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--ink3)}
  .card{background:var(--surface);border-radius:var(--r);border:1px solid rgba(0,0,0,0.07);box-shadow:var(--sh)}
  .btn{width:100%;padding:14px;background:var(--ink);color:#fff;border:none;border-radius:var(--rsm);font-family:var(--body);font-size:15px;font-weight:600;cursor:pointer;transition:opacity 0.15s,transform 0.1s,background 0.2s}
  .btn:hover{opacity:0.9}.btn:active{transform:scale(0.98)}.btn:disabled{opacity:0.3;cursor:default;transform:none}
  .btn.green{background:var(--green)}.btn.outline{background:transparent;color:var(--ink);border:1.5px solid rgba(0,0,0,0.12)}

  /* HOME */
  .hero{background:var(--ink);border-radius:var(--r);padding:18px;color:#fff;display:flex;gap:14px;align-items:center}
  .hero-left .num{font-family:var(--head);font-size:36px;font-weight:800;line-height:1}
  .hero-left .lbl{font-size:11px;opacity:0.5;margin-top:2px}
  .hero-right{flex:1}
  .hero-top{display:flex;justify-content:space-between;margin-bottom:6px}
  .hero-top span{font-size:11px;opacity:0.5}
  .hero-top b{font-size:11px;font-weight:600}
  .xpbar{height:5px;background:rgba(255,255,255,0.15);border-radius:3px;overflow:hidden}
  .xpfill{height:100%;background:#fff;border-radius:3px;transition:width 0.8s cubic-bezier(0.4,0,0.2,1)}
  .hero-badges{display:flex;gap:6px;margin-top:10px}
  .hbadge{background:rgba(255,255,255,0.1);border-radius:8px;padding:5px 9px;font-size:11px;font-weight:600}

  .tgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .tcard{background:var(--surface);border:1px solid rgba(0,0,0,0.07);border-radius:var(--r);padding:16px;cursor:pointer;transition:transform 0.18s,box-shadow 0.18s;box-shadow:var(--sh);position:relative;overflow:hidden}
  .tcard:active:not(.locked){transform:scale(0.96);box-shadow:none}
  .tcard.locked{opacity:0.45;cursor:default}
  .tcard::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--ink);opacity:0}
  .tcard.active-track::before{opacity:1}
  .t-ico{font-size:24px;margin-bottom:10px}
  .t-name{font-size:13px;font-weight:700;margin-bottom:2px}
  .t-desc{font-size:11px;color:var(--ink2);margin-bottom:11px;line-height:1.4}
  .tprog{height:3px;background:var(--s3);border-radius:2px;overflow:hidden}
  .tpfill{height:100%;background:var(--ink);border-radius:2px;transition:width 1s ease}
  .lock-ico{position:absolute;top:10px;right:10px;font-size:13px;opacity:0.4}

  .daily{background:var(--surface);border:1px solid rgba(0,0,0,0.07);border-radius:var(--r);padding:18px;box-shadow:var(--sh)}
  .daily-row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px}
  .daily-title{font-family:var(--head);font-size:17px;font-weight:800;margin-bottom:3px;letter-spacing:-0.3px}
  .daily-sub{font-size:12px;color:var(--ink2)}
  .xpbadge{background:var(--ink);color:#fff;font-size:10px;font-weight:700;padding:5px 10px;border-radius:20px;white-space:nowrap}
  .meta{display:flex;gap:10px;margin-bottom:14px}
  .metaitem{font-size:11px;color:var(--ink2);display:flex;align-items:center;gap:3px}

  /* LEARN */
  .ltrack-card{background:var(--surface);border:1px solid rgba(0,0,0,0.07);border-radius:var(--r);padding:18px;cursor:pointer;box-shadow:var(--sh);transition:transform 0.15s;display:flex;align-items:center;gap:14px}
  .ltrack-card:active{transform:scale(0.97)}
  .ltrack-ico-big{font-size:32px}
  .ltrack-info{flex:1}
  .ltrack-name{font-family:var(--head);font-size:16px;font-weight:800;margin-bottom:3px}
  .ltrack-meta{font-size:12px;color:var(--ink2);margin-bottom:8px}
  .ltrack-prog-wrap{display:flex;align-items:center;gap:8px}
  .ltrack-prog{flex:1;height:4px;background:var(--s3);border-radius:2px;overflow:hidden}
  .ltrack-pfill{height:100%;background:var(--ink);border-radius:2px}
  .ltrack-pct{font-size:11px;font-weight:600;color:var(--ink2)}
  .ltrack-arrow{font-size:18px;color:var(--ink3)}

  /* TRACK DETAIL */
  .tdetail{display:flex;flex-direction:column;height:100%}
  .tdhdr{padding:16px 20px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(0,0,0,0.07);background:var(--bg);flex-shrink:0}
  .back{width:36px;height:36px;border-radius:50%;border:1.5px solid rgba(0,0,0,0.1);background:var(--surface);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;box-shadow:var(--sh);font-family:var(--body);color:var(--ink)}
  .tdhdr-ico{font-size:34px}
  .tdhdr-info h2{font-family:var(--head);font-size:20px;font-weight:800}
  .tdhdr-info p{font-size:12px;color:var(--ink2);margin-top:2px}

  .llist{padding:12px 16px;display:flex;flex-direction:column;gap:2px}
  .lrow{display:flex;align-items:center;gap:12px;padding:13px 12px;border-radius:var(--rsm);cursor:pointer;transition:background 0.12s}
  .lrow:hover:not(.locked){background:var(--s2)}
  .lrow.locked{opacity:0.4;cursor:default}
  .lrow.next{background:rgba(26,26,46,0.04)}
  .ldot{width:36px;height:36px;border-radius:50%;border:2px solid rgba(0,0,0,0.1);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;background:var(--surface);font-weight:700;color:var(--ink2)}
  .ldot.done{background:var(--ink);border-color:var(--ink);color:#fff}
  .ldot.next-dot{background:var(--ink);border-color:var(--ink);color:#fff}
  .lrow-info{flex:1}
  .lrow-title{font-size:14px;font-weight:600}
  .lrow-meta{font-size:11px;color:var(--ink2);margin-top:2px}
  .lrow-xp{font-size:11px;font-weight:700;color:var(--ink2)}

  /* LESSON */
  .lshell{display:flex;flex-direction:column;height:100%}
  .lnav{padding:14px 18px;display:flex;align-items:center;gap:10px;border-bottom:1px solid rgba(0,0,0,0.07);background:var(--bg);flex-shrink:0}
  .lprog{flex:1}
  .lprog-lbl{font-size:10px;color:var(--ink2);margin-bottom:5px;font-weight:500}
  .lbar{height:5px;background:var(--s3);border-radius:3px;overflow:hidden}
  .lbarfill{height:100%;background:var(--ink);border-radius:3px;transition:width 0.6s cubic-bezier(0.4,0,0.2,1)}
  .lxpchip{font-size:11px;font-weight:700;background:var(--surface);border:1px solid rgba(0,0,0,0.08);border-radius:20px;padding:5px 10px;white-space:nowrap;box-shadow:var(--sh)}

  .lbody{flex:1;overflow-y:auto;padding:20px 18px;display:flex;flex-direction:column;gap:12px}
  .lbody::-webkit-scrollbar{display:none}

  .qcard{background:var(--surface);border:1px solid rgba(0,0,0,0.07);border-radius:var(--r);padding:20px;box-shadow:var(--sh)}
  .qtype{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--ink3);margin-bottom:8px}
  .qtext{font-family:var(--head);font-size:18px;font-weight:800;line-height:1.3;margin-bottom:6px;letter-spacing:-0.3px}
  .qsub{font-size:13px;color:var(--ink2);line-height:1.5}

  .answers{display:flex;flex-direction:column;gap:8px}
  .abtn{background:var(--surface);border:1.5px solid rgba(0,0,0,0.08);border-radius:var(--rsm);padding:13px 14px;display:flex;align-items:center;gap:11px;cursor:pointer;transition:all 0.15s;text-align:left;width:100%;font-family:var(--body);box-shadow:var(--sh)}
  .abtn:hover:not(:disabled):not(.cor):not(.wrg){border-color:rgba(0,0,0,0.18);background:var(--s2)}
  .abtn:active:not(:disabled){transform:scale(0.98)}
  .abtn.sel{border-color:var(--ink);background:rgba(26,26,46,0.04)}
  .abtn.cor{border-color:var(--green);background:rgba(52,199,89,0.07);animation:pop 0.3s ease}
  .abtn.wrg{border-color:var(--red);background:rgba(255,59,48,0.05)}
  @keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.02)}100%{transform:scale(1)}}
  .aletter{width:28px;height:28px;border-radius:7px;background:var(--s3);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;color:var(--ink2);transition:all 0.2s}
  .abtn.sel .aletter{background:var(--ink);color:#fff}
  .abtn.cor .aletter{background:var(--green);color:#fff}
  .abtn.wrg .aletter{background:var(--red);color:#fff}
  .atext{font-size:13px;color:var(--ink);font-weight:500;line-height:1.4}

  .feedback{border-radius:var(--rsm);padding:13px 15px;font-size:13px;line-height:1.55;font-weight:500}
  .feedback.cor{background:rgba(52,199,89,0.08);border:1.5px solid rgba(52,199,89,0.2);color:#1b5e35}
  .feedback.wrg{background:rgba(255,59,48,0.06);border:1.5px solid rgba(255,59,48,0.18);color:#7a1f18}

  .lfooter{padding:14px 18px;border-top:1px solid rgba(0,0,0,0.07);flex-shrink:0;background:var(--bg)}

  /* COMPLETE */
  .done-screen{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:36px 22px;gap:18px}
  .done-ico{font-size:72px;animation:bounce 0.6s ease}
  @keyframes bounce{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
  .done-title{font-family:var(--head);font-size:28px;font-weight:800;letter-spacing:-0.5px}
  .done-sub{font-size:14px;color:var(--ink2)}
  .rewards{display:flex;gap:10px;width:100%}
  .rchip{flex:1;background:var(--surface);border:1px solid rgba(0,0,0,0.07);border-radius:var(--rsm);padding:14px;box-shadow:var(--sh);text-align:center}
  .rval{font-family:var(--head);font-size:26px;font-weight:800}
  .rlbl{font-size:10px;color:var(--ink2);margin-top:2px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px}

  /* PORTFOLIO */
  .pgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .mcard{background:var(--surface);border:1px solid rgba(0,0,0,0.07);border-radius:var(--r);padding:15px;box-shadow:var(--sh)}
  .mlbl{font-size:10px;font-weight:700;color:var(--ink3);letter-spacing:0.5px;text-transform:uppercase;margin-bottom:4px}
  .mval{font-family:var(--head);font-size:23px;font-weight:800}
  .mchg{font-size:11px;margin-top:3px;font-weight:600}
  .up{color:var(--green)}.dn{color:var(--red)}

  .chart-wrap{background:var(--surface);border:1px solid rgba(0,0,0,0.07);border-radius:var(--r);padding:16px;box-shadow:var(--sh)}
  .chart-ttl{font-size:10px;font-weight:700;color:var(--ink3);letter-spacing:0.5px;text-transform:uppercase;margin-bottom:12px}
  .mini-chart{display:flex;align-items:flex-end;gap:5px;height:64px}
  .bar{flex:1;border-radius:4px 4px 0 0;background:var(--s3);transition:height 0.6s ease,background 0.2s;cursor:pointer;position:relative}
  .bar:hover{background:var(--ink3)}
  .bar.last{background:var(--ink)}
  .bar-lbl{display:flex;gap:5px;margin-top:6px}
  .bl{flex:1;font-size:9px;color:var(--ink3);text-align:center}

  .hlist{display:flex;flex-direction:column;gap:8px}
  .hrow{background:var(--surface);border:1px solid rgba(0,0,0,0.07);border-radius:var(--rsm);padding:12px 14px;display:flex;align-items:center;gap:11px;box-shadow:var(--sh);cursor:pointer;transition:transform 0.15s}
  .hrow:active{transform:scale(0.98)}
  .hico{width:40px;height:40px;border-radius:10px;color:#fff;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;flex-shrink:0;letter-spacing:0.5px}
  .hinfo{flex:1}.hname{font-size:13px;font-weight:600}.hshares{font-size:11px;color:var(--ink2);margin-top:1px}
  .hright{text-align:right}.hval{font-size:14px;font-weight:700}.hchg{font-size:11px;margin-top:1px;font-weight:600}

  .trade-card{background:var(--surface);border:1px solid rgba(0,0,0,0.07);border-radius:var(--r);padding:18px;box-shadow:var(--sh)}
  .trade-select{display:flex;gap:6px;margin-bottom:14px;overflow-x:auto}
  .tsel-btn{padding:6px 12px;border-radius:20px;border:1.5px solid rgba(0,0,0,0.1);background:var(--surface);font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;transition:all 0.15s;font-family:var(--body);color:var(--ink2)}
  .tsel-btn.active{background:var(--ink);color:#fff;border-color:var(--ink)}
  .trade-price{font-family:var(--head);font-size:28px;font-weight:800;margin-bottom:2px}
  .trade-change{font-size:12px;font-weight:600;margin-bottom:14px}
  .trade-inputs{display:flex;gap:8px;margin-bottom:10px}
  .tinput{flex:1;background:var(--s2);border:1.5px solid rgba(0,0,0,0.08);border-radius:var(--rsm);padding:10px 13px;font-family:var(--body);font-size:15px;font-weight:600;color:var(--ink);outline:none;transition:border-color 0.15s}
  .tinput:focus{border-color:var(--ink)}
  .trade-btns{display:flex;gap:8px}
  .buybtn{flex:1;padding:12px;background:var(--green);color:#fff;border:none;border-radius:var(--rsm);font-weight:700;font-size:14px;cursor:pointer;font-family:var(--body);transition:opacity 0.15s}
  .buybtn:active{opacity:0.8}
  .sellbtn{flex:1;padding:12px;background:rgba(255,59,48,0.08);color:var(--red);border:1.5px solid rgba(255,59,48,0.2);border-radius:var(--rsm);font-weight:700;font-size:14px;cursor:pointer;font-family:var(--body)}
  .paper-note{font-size:10px;color:var(--ink3);text-align:center;margin-top:8px}
  .trade-toast{background:var(--ink);color:#fff;border-radius:var(--rsm);padding:10px 14px;font-size:12px;font-weight:600;text-align:center;animation:fadeUp 0.3s ease}

  /* LEAGUE */
  .lhdr-card{background:var(--ink);color:#fff;border-radius:var(--r);padding:18px}
  .lhdr-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}
  .lhdr-name{font-family:var(--head);font-size:18px;font-weight:800}
  .lhdr-div{font-size:11px;opacity:0.55;margin-top:2px}
  .lhdr-timer{background:rgba(255,255,255,0.1);border-radius:8px;padding:5px 10px;font-size:11px;font-weight:600}
  .lhdr-prog{margin-top:12px}
  .lhdr-plbl{display:flex;justify-content:space-between;font-size:11px;opacity:0.55;margin-bottom:5px}
  .lhdr-bar{height:4px;background:rgba(255,255,255,0.15);border-radius:2px;overflow:hidden}
  .lhdr-fill{height:100%;background:#fff;border-radius:2px;width:52%}

  .lbrows{display:flex;flex-direction:column;gap:6px}
  .lbrow{background:var(--surface);border:1px solid rgba(0,0,0,0.07);border-radius:var(--rsm);padding:11px 13px;display:flex;align-items:center;gap:10px;box-shadow:var(--sh)}
  .lbrow.you{border-color:var(--ink);border-width:2px;background:rgba(26,26,46,0.03)}
  .lbrow.promote{border-color:rgba(52,199,89,0.3);background:rgba(52,199,89,0.03)}
  .lbrank{font-family:var(--head);font-weight:800;font-size:14px;width:20px;color:var(--ink3);flex-shrink:0;text-align:center}
  .lbrank.gold{color:var(--gold)}.lbrank.silver{color:#8e8e93}.lbrank.bronze{color:#a05c34}
  .lbav{width:32px;height:32px;border-radius:50%;background:var(--s3);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;color:var(--ink2)}
  .lbrow.you .lbav{background:var(--ink);color:#fff}
  .lbinfo{flex:1}.lbname{font-size:13px;font-weight:600}.lbdetail{font-size:10px;color:var(--ink2);margin-top:1px}
  .lbxp{font-size:13px;font-weight:700;color:var(--ink)}

  /* ANIMATIONS */
  @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideRight{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
  @keyframes slideLeft{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
  .afu{animation:fadeUp 0.3s ease both}
  .afi{animation:fadeIn 0.25s ease both}
  .asl{animation:slideLeft 0.25s ease both}
  .asr{animation:slideRight 0.25s ease both}
  .stagger>*{animation:fadeUp 0.3s ease both}
  .stagger>*:nth-child(1){animation-delay:0ms}
  .stagger>*:nth-child(2){animation-delay:50ms}
  .stagger>*:nth-child(3){animation-delay:100ms}
  .stagger>*:nth-child(4){animation-delay:150ms}
  .stagger>*:nth-child(5){animation-delay:200ms}
  .stagger>*:nth-child(6){animation-delay:250ms}
`;

// ─── DATA ────────────────────────────────────────────────────────────────────

const TRACKS = [
  { id:"investing", title:"Investing", emoji:"📈", desc:"Stocks, ETFs & compound growth", progress:40, unlocked:true,
    lessons:[
      { id:"inv-1", title:"What is investing?", xp:30, dur:"3 min", done:true },
      { id:"inv-2", title:"Stocks vs bonds", xp:40, dur:"5 min", done:true },
      { id:"inv-3", title:"Compound interest", xp:50, dur:"5 min", done:false,
        questions:[
          { type:"Concept check", text:"You invest £1,000 at 8% annual return. With compound interest, what do you earn interest on in year 2?", sub:"Think about what makes compounding different from simple interest.",
            answers:["Only the original £1,000","£1,000 + the interest from year 1","Only the interest earned so far","8% of your total withdrawals"], correct:1,
            exp:"Compound interest earns you returns on both your original principal AND the interest already earned — that snowball effect is the entire foundation of long-term wealth." },
          { type:"Quick maths", text:"Investing £200/month from age 18 to 30 at 7% annual return gives you roughly...", sub:"Assume monthly compounding.",
            answers:["£28,800 (no growth)","~£41,000","~£34,000","~£60,000"], correct:1,
            exp:"~£41,000 — you put in £28,800 but compound growth added over £12,000 on top. Starting at 18 vs 28 can mean 2–3× the final pot." },
          { type:"Real world", text:"Warren Buffett earned 99% of his wealth after age 52. This best illustrates...", sub:"Connect the concept to a famous investor.",
            answers:["Getting lucky with one big bet","The power of compounding over decades","Timing the market perfectly","Avoiding all losses"], correct:1,
            exp:"Buffett's fortune came from letting compounding run for 70+ years, not from genius stock picks alone. Time in the market beats timing the market." },
        ]
      },
      { id:"inv-4", title:"What is an ETF?", xp:40, dur:"4 min", done:false,
        questions:[
          { type:"Definition", text:"ETF stands for Exchange-Traded Fund. What does that mean in practice?", sub:"Think about how it trades vs a regular fund.",
            answers:["A fund you can only buy directly from a bank","A basket of assets that trades on a stock exchange like a single share","A savings account with a fixed return","A government bond fund"], correct:1,
            exp:"An ETF bundles many assets (e.g. the top 500 US companies) into one instrument you buy and sell on an exchange like a normal share. You get instant diversification." },
          { type:"Comparison", text:"What is the main advantage of a low-cost index ETF over picking individual stocks?", sub:"Think about effort, cost, and risk.",
            answers:["You always beat the market","Lower fees and automatic diversification across hundreds of companies","You can withdraw your money any time","You pay no tax on gains"], correct:1,
            exp:"Index ETFs typically charge 0.03–0.2% per year vs 1–2% for active funds. Over 30 years, that fee difference alone can cost you tens of thousands of pounds." },
          { type:"Example", text:"The S&P 500 ETF (e.g. VOO) tracks the 500 largest US companies. If Apple makes up 7% of the index, what happens to your ETF when Apple rises 10%?", sub:"Work through the maths.",
            answers:["Your ETF rises 10%","Your ETF rises ~0.7%","Nothing — ETFs don't track individual stocks","Your ETF rises exactly 7%"], correct:1,
            exp:"Apple is ~7% of the index, so a 10% Apple gain adds 0.7% to the ETF. That's diversification working: no single stock can destroy your portfolio." },
        ]
      },
      { id:"inv-5", title:"Risk & return", xp:50, dur:"6 min", done:false, locked:true },
    ]
  },
  { id:"budgeting", title:"Budgeting", emoji:"💰", desc:"50/30/20 rule & beyond", progress:15, unlocked:true,
    lessons:[
      { id:"bud-1", title:"The 50/30/20 rule", xp:30, dur:"4 min", done:true,
        questions:[
          { type:"Rule check", text:"According to the 50/30/20 rule, what percentage of take-home pay should go to 'needs'?", sub:"Needs = rent, food, transport, utilities.",
            answers:["20%","30%","50%","70%"], correct:2,
            exp:"50% for needs — the non-negotiables you can't easily cut. The rule gives you a simple starting point; your actual split will depend on your city and income." },
        ]
      },
      { id:"bud-2", title:"Tracking your spending", xp:40, dur:"5 min", done:false,
        questions:[
          { type:"Scenario", text:"You earn £1,200/month. Using the 50/30/20 rule, how much should go to wants (dining, subscriptions, fun)?", sub:"Wants are nice-to-haves you could live without.",
            answers:["£240","£360","£600","£960"], correct:1,
            exp:"30% of £1,200 = £360 for wants. That's your guilt-free spending budget — but tracking it is the only way to know if you're staying within it." },
          { type:"True or false", text:"Spotify, Netflix, and gym membership all count as 'needs' in the 50/30/20 framework.", sub:"Could you survive without them?",
            answers:["True — they're essential modern expenses","False — they are wants","It depends on the person","Only gym membership is a need"], correct:1,
            exp:"False. Subscriptions are wants — enjoyable and worth budgeting for, but not essential. The 50/30/20 rule only counts true needs like rent and food in the 50%." },
          { type:"Action", text:"You discover you're spending £480/month on 'wants' on a £1,200 salary. You want to fix this. What's the first step?", sub:"Think practically.",
            answers:["Cancel everything immediately","List every subscription and categorise each one","Switch banks","Ask for a pay rise"], correct:1,
            exp:"Audit first. You can't optimise what you can't see. List everything, then cut the ones with the worst value-per-use. Small cuts compound just like interest." },
        ]
      },
      { id:"bud-3", title:"Emergency funds", xp:50, dur:"5 min", done:false,
        questions:[
          { type:"Rule of thumb", text:"Most financial advisors recommend keeping how many months of expenses in an emergency fund?", sub:"Enough to cover job loss, medical bills, etc.",
            answers:["1 month","3–6 months","12 months","2 years"], correct:1,
            exp:"3–6 months is the standard advice. Too little and one bad month wipes you out; too much and you're leaving money in a low-interest account instead of investing it." },
          { type:"Where to keep it", text:"Where should you keep your emergency fund?", sub:"Think about access speed and return.",
            answers:["Invested in stocks for maximum growth","In a high-interest easy-access savings account","Under the mattress","In a 5-year fixed bond"], correct:1,
            exp:"Easy-access savings account — you need it instantly when crisis hits. Stocks can drop 40% right when you need the money most. Safety and liquidity beat returns here." },
        ]
      },
    ]
  },
  { id:"trading", title:"Trading", emoji:"⚡", desc:"Charts, patterns & execution", progress:0, unlocked:false, unlockLevel:10 },
  { id:"macro", title:"Macro", emoji:"🌍", desc:"Interest rates, inflation & cycles", progress:0, unlocked:false, unlockLevel:15 },
];

const HOLDINGS = [
  { ticker:"AAPL", name:"Apple Inc.", shares:5, price:177.24, cost:162.0, color:"#1a1a2e" },
  { ticker:"MSFT", name:"Microsoft", shares:3, price:368.0, cost:340.0, color:"#2c2c54" },
  { ticker:"TSLA", name:"Tesla", shares:2, price:190.5, cost:220.0, color:"#0f3460" },
  { ticker:"VOO", name:"Vanguard S&P 500", shares:4, price:420.0, cost:400.0, color:"#533483" },
];

const CHART = [9800,9950,9700,10200,10500,10680,10847];
const DAYS = ["M","T","W","T","F","S","S"];

const STOCKS = [
  { ticker:"AAPL", name:"Apple Inc.", price:177.24, change:2.1 },
  { ticker:"MSFT", name:"Microsoft", price:368.0, change:1.4 },
  { ticker:"TSLA", name:"Tesla", price:190.5, change:-3.2 },
  { ticker:"VOO", name:"Vanguard S&P 500", price:420.0, change:0.8 },
  { ticker:"NVDA", name:"Nvidia", price:875.0, change:4.3 },
];

const LEAGUE = [
  { rank:1, initials:"JH", name:"James H.", year:"Year 13", xp:2840 },
  { rank:2, initials:"PK", name:"Priya K.", year:"Year 13", xp:2415 },
  { rank:3, initials:"OM", name:"Oliver M.", year:"Year 12", xp:1980 },
  { rank:4, initials:"AW", name:"Alex W.", year:"Year 12", xp:1240, isYou:true },
  { rank:5, initials:"BT", name:"Ben T.", year:"Year 12", xp:1105 },
  { rank:6, initials:"SC", name:"Sophie C.", year:"Year 11", xp:940 },
  { rank:7, initials:"LN", name:"Luca N.", year:"Year 11", xp:810 },
];

// ─── MINI CHART ──────────────────────────────────────────────────────────────
function MiniChart({ data, days }) {
  const min = Math.min(...data), max = Math.max(...data), range = max - min;
  return (
    <div>
      <div className="mini-chart">
        {data.map((v,i) => (
          <div key={i} className={`bar${i===data.length-1?" last":""}`}
            style={{ height: `${((v-min)/range)*80+20}%` }} />
        ))}
      </div>
      <div className="bar-lbl">{days.map((d,i)=><span key={i} className="bl">{d}</span>)}</div>
    </div>
  );
}

// ─── HOME SCREEN ─────────────────────────────────────────────────────────────
function HomeScreen({ onStartLesson, onOpenTrack }) {
  return (
    <div className="screen stagger">
      <div>
        <div style={{fontSize:12,color:"var(--ink2)",marginBottom:3}}>Good morning 👋</div>
        <div style={{fontFamily:"var(--head)",fontSize:28,fontWeight:800,letterSpacing:"-0.5px"}}>Alex</div>
      </div>

      <div className="hero">
        <div className="hero-left">
          <div className="num">🔥 12</div>
          <div className="lbl">day streak</div>
        </div>
        <div className="hero-right">
          <div className="hero-top"><span>Level 8</span><b>1,240 / 1,500 xp</b></div>
          <div className="xpbar"><div className="xpfill" style={{width:"82%"}}/></div>
          <div className="hero-badges">
            <div className="hbadge">📚 12 lessons</div>
            <div className="hbadge">🏅 Silver league</div>
          </div>
        </div>
      </div>

      <div className="slbl">Your tracks</div>
      <div className="tgrid">
        {TRACKS.map(t => (
          <div key={t.id} className={`tcard${!t.unlocked?" locked":""}`} onClick={()=>t.unlocked&&onOpenTrack(t)}>
            {!t.unlocked && <span className="lock-ico">🔒</span>}
            <div className="t-ico">{t.emoji}</div>
            <div className="t-name">{t.title}</div>
            <div className="t-desc">{t.unlocked ? t.desc : `Unlock at Level ${t.unlockLevel}`}</div>
            <div className="tprog"><div className="tpfill" style={{width:`${t.progress}%`}}/></div>
          </div>
        ))}
      </div>

      <div className="slbl">Today's challenge</div>
      <div className="daily">
        <div className="daily-row">
          <div>
            <div className="daily-title">Compound interest</div>
            <div className="daily-sub">Investing · Lesson 3</div>
          </div>
          <div className="xpbadge">+50 XP</div>
        </div>
        <div className="meta">
          <span className="metaitem">⏱ 5 min</span>
          <span className="metaitem">⭐ 3 questions</span>
          <span className="metaitem">🔥 Streak bonus</span>
        </div>
        <button className="btn" onClick={()=>onStartLesson(TRACKS[0].lessons[2])}>Start lesson</button>
      </div>
    </div>
  );
}

// ─── LEARN SCREEN ─────────────────────────────────────────────────────────────
function LearnScreen({ onOpenTrack }) {
  return (
    <div className="screen stagger">
      <div style={{fontFamily:"var(--head)",fontSize:26,fontWeight:800,letterSpacing:"-0.5px"}}>Learn</div>
      {TRACKS.filter(t=>t.unlocked).map(t => {
        const done = t.lessons?.filter(l=>l.done).length || 0;
        const total = t.lessons?.length || 0;
        return (
          <div key={t.id} className="ltrack-card" onClick={()=>onOpenTrack(t)}>
            <div className="ltrack-ico-big">{t.emoji}</div>
            <div className="ltrack-info">
              <div className="ltrack-name">{t.title}</div>
              <div className="ltrack-meta">{done}/{total} lessons complete</div>
              <div className="ltrack-prog-wrap">
                <div className="ltrack-prog"><div className="ltrack-pfill" style={{width:`${t.progress}%`}}/></div>
                <span className="ltrack-pct">{t.progress}%</span>
              </div>
            </div>
            <div className="ltrack-arrow">›</div>
          </div>
        );
      })}
      {TRACKS.filter(t=>!t.unlocked).map(t => (
        <div key={t.id} className="ltrack-card locked" style={{cursor:"default",opacity:0.45}}>
          <div className="ltrack-ico-big">{t.emoji}</div>
          <div className="ltrack-info">
            <div className="ltrack-name">{t.title}</div>
            <div className="ltrack-meta">🔒 Unlock at Level {t.unlockLevel}</div>
            <div className="ltrack-prog-wrap"><div className="ltrack-prog"><div className="ltrack-pfill" style={{width:"0%"}}/></div><span className="ltrack-pct">0%</span></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── TRACK DETAIL ─────────────────────────────────────────────────────────────
function TrackDetail({ track, onBack, onStartLesson }) {
  const done = track.lessons?.filter(l=>l.done).length||0;
  const total = track.lessons?.length||0;
  return (
    <div className="tdetail asl">
      <div className="tdhdr">
        <button className="back" onClick={onBack}>←</button>
        <div className="tdhdr-ico">{track.emoji}</div>
        <div className="tdhdr-info"><h2>{track.title}</h2><p>{done}/{total} lessons · {track.progress}% complete</p></div>
      </div>
      <div className="scroll">
        <div className="llist stagger">
          {track.lessons?.map((lesson,i) => {
            const isNext = !lesson.done && !lesson.locked && (i===0 || track.lessons[i-1].done);
            return (
              <div key={lesson.id} className={`lrow${lesson.locked?" locked":""}${isNext?" next":""}`}
                onClick={()=>!lesson.locked && onStartLesson(lesson)}>
                <div className={`ldot${lesson.done?" done":""}${isNext?" next-dot":""}`}>
                  {lesson.done?"✓":lesson.locked?"🔒":isNext?"▶":`${i+1}`}
                </div>
                <div className="lrow-info">
                  <div className="lrow-title">{lesson.title}</div>
                  <div className="lrow-meta">{lesson.dur} · {lesson.questions?.length||0} questions</div>
                </div>
                <div className="lrow-xp">+{lesson.xp} xp</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── LESSON SCREEN ────────────────────────────────────────────────────────────
function LessonScreen({ lesson, onBack, onComplete }) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [done, setDone] = useState(false);
  const qs = lesson.questions || [];
  const q = qs[qIdx];
  const pct = ((qIdx + (checked?1:0)) / Math.max(qs.length,1)) * 100;

  function check() {
    if (!checked && selected !== null) { setChecked(true); return; }
    if (checked) {
      if (qIdx < qs.length-1) { setQIdx(qIdx+1); setSelected(null); setChecked(false); }
      else setDone(true);
    }
  }

  if (done) return (
    <div className="lshell">
      <div className="lnav">
        <button className="back" onClick={onBack}>←</button>
        <div className="lprog"><div className="lbar"><div className="lbarfill" style={{width:"100%"}}/></div></div>
      </div>
      <div className="done-screen">
        <div className="done-ico">🏆</div>
        <div className="done-title">Lesson complete!</div>
        <div className="done-sub">You mastered {lesson.title.toLowerCase()}</div>
        <div className="rewards">
          <div className="rchip"><div className="rval">+{lesson.xp}</div><div className="rlbl">XP earned</div></div>
          <div className="rchip"><div className="rval">🔥 13</div><div className="rlbl">Day streak</div></div>
          <div className="rchip"><div className="rval">✓</div><div className="rlbl">Complete</div></div>
        </div>
        <button className="btn" style={{marginTop:4}} onClick={onComplete}>Back to track</button>
      </div>
    </div>
  );

  if (!q) return null;
  return (
    <div className="lshell asl">
      <div className="lnav">
        <button className="back" onClick={onBack}>←</button>
        <div className="lprog">
          <div className="lprog-lbl">Question {qIdx+1} of {qs.length}</div>
          <div className="lbar"><div className="lbarfill" style={{width:`${pct}%`}}/></div>
        </div>
        <div className="lxpchip">+{lesson.xp} xp</div>
      </div>
      <div className="lbody">
        <div className="qcard afu">
          <div className="qtype">{q.type}</div>
          <div className="qtext">{q.text}</div>
          <div className="qsub">{q.sub}</div>
        </div>
        <div className="answers">
          {q.answers.map((ans,i) => {
            let cls = checked ? (i===q.correct?"cor":i===selected?"wrg":"") : (i===selected?"sel":"");
            return (
              <button key={i} className={`abtn ${cls}`} onClick={()=>!checked&&setSelected(i)} disabled={checked}>
                <div className="aletter">{["A","B","C","D"][i]}</div>
                <div className="atext">{ans}</div>
              </button>
            );
          })}
        </div>
        {checked && (
          <div className={`feedback ${selected===q.correct?"cor":"wrg"} afu`}>
            {selected===q.correct?"✓ ":"✗ "}{q.exp}
          </div>
        )}
      </div>
      <div className="lfooter">
        <button className="btn" onClick={check} disabled={selected===null&&!checked}>
          {!checked ? (selected===null?"Choose an answer":"Check answer") : (qIdx<qs.length-1?"Next question →":"Finish lesson 🎉")}
        </button>
      </div>
    </div>
  );
}

// ─── PORTFOLIO ────────────────────────────────────────────────────────────────
function PortfolioScreen() {
  const [shares, setShares] = useState(1);
  const [selStock, setSelStock] = useState(0);
  const [cash, setCash] = useState(7153);
  const [holdings, setHoldings] = useState(HOLDINGS);
  const [toast, setToast] = useState(null);

  const stock = STOCKS[selStock];
  const totalValue = holdings.reduce((a,h)=>a+h.shares*h.price,0);
  const totalCost = holdings.reduce((a,h)=>a+h.shares*h.cost,0);
  const gain = totalValue - totalCost;
  const gainPct = ((gain/totalCost)*100).toFixed(1);

  function showToast(msg) { setToast(msg); setTimeout(()=>setToast(null),2000); }

  function buy() {
    const cost = stock.price * shares;
    if (cost > cash) { showToast("Not enough cash 💸"); return; }
    setCash(c => +(c - cost).toFixed(2));
    setHoldings(h => {
      const existing = h.find(x=>x.ticker===stock.ticker);
      if (existing) return h.map(x=>x.ticker===stock.ticker?{...x,shares:x.shares+shares}:x);
      return [...h, {ticker:stock.ticker,name:stock.name,shares,price:stock.price,cost:stock.price,color:"#533483"}];
    });
    showToast(`Bought ${shares} × ${stock.ticker} ✓`);
  }

  function sell() {
    const existing = holdings.find(x=>x.ticker===stock.ticker);
    if (!existing || existing.shares < shares) { showToast("Not enough shares 📉"); return; }
    const proceeds = stock.price * shares;
    setCash(c => +(c + proceeds).toFixed(2));
    setHoldings(h => h.map(x=>x.ticker===stock.ticker?{...x,shares:x.shares-shares}:x).filter(x=>x.shares>0));
    showToast(`Sold ${shares} × ${stock.ticker} ✓`);
  }

  return (
    <div className="screen stagger">
      <div className="pgrid">
        <div className="mcard">
          <div className="mlbl">Portfolio</div>
          <div className="mval">£{Math.round(totalValue+cash).toLocaleString()}</div>
          <div className={`mchg ${gain>=0?"up":"dn"}`}>{gain>=0?"+":""}£{Math.round(gain).toLocaleString()} ({gainPct}%)</div>
        </div>
        <div className="mcard">
          <div className="mlbl">Cash</div>
          <div className="mval">£{Math.round(cash).toLocaleString()}</div>
          <div className="mchg" style={{color:"var(--ink2)"}}>Ready to invest</div>
        </div>
      </div>

      <div className="chart-wrap">
        <div className="chart-ttl">This week</div>
        <MiniChart data={CHART} days={DAYS}/>
      </div>

      <div className="slbl">Holdings</div>
      <div className="hlist">
        {holdings.map(h=>{
          const val = h.shares*h.price;
          const chg = ((h.price-h.cost)/h.cost*100).toFixed(1);
          return (
            <div key={h.ticker} className="hrow">
              <div className="hico" style={{background:h.color}}>{h.ticker}</div>
              <div className="hinfo">
                <div className="hname">{h.name}</div>
                <div className="hshares">{h.shares} shares · £{h.price.toFixed(2)}</div>
              </div>
              <div className="hright">
                <div className="hval">£{Math.round(val).toLocaleString()}</div>
                <div className={`hchg ${h.price>=h.cost?"up":"dn"}`}>{h.price>=h.cost?"+":""}{chg}%</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="slbl">Paper trade</div>
      <div className="trade-card">
        <div className="trade-select">
          {STOCKS.map((s,i)=>(
            <button key={s.ticker} className={`tsel-btn${selStock===i?" active":""}`} onClick={()=>setSelStock(i)}>{s.ticker}</button>
          ))}
        </div>
        <div className="trade-price">£{stock.price.toFixed(2)}</div>
        <div className={`trade-change ${stock.change>=0?"up":"dn"}`}>{stock.name} · {stock.change>=0?"+":""}{stock.change}% today</div>
        <div className="trade-inputs">
          <input className="tinput" type="number" min={1} value={shares}
            onChange={e=>setShares(Math.max(1,parseInt(e.target.value)||1))}/>
          <div style={{fontSize:12,color:"var(--ink2)",alignSelf:"center",minWidth:80}}>
            = £{(stock.price*shares).toFixed(2)}
          </div>
        </div>
        <div className="trade-btns">
          <button className="buybtn" onClick={buy}>Buy {shares} share{shares>1?"s":""}</button>
          <button className="sellbtn" onClick={sell}>Sell</button>
        </div>
        {toast && <div className="trade-toast">{toast}</div>}
        <div className="paper-note">💡 Paper money only — zero real risk</div>
      </div>
    </div>
  );
}

// ─── LEAGUE SCREEN ────────────────────────────────────────────────────────────
function LeagueScreen() {
  const rc = r => r===1?"gold":r===2?"silver":r===3?"bronze":"";
  return (
    <div className="screen stagger">
      <div className="lhdr-card">
        <div className="lhdr-top">
          <div><div className="lhdr-name">Eton College</div><div className="lhdr-div">Silver Division</div></div>
          <div className="lhdr-timer">⏳ 4 days left</div>
        </div>
        <div className="lhdr-prog">
          <div className="lhdr-plbl"><span>Your position: 4th</span><span>3rd place: 1,980 xp</span></div>
          <div className="lhdr-bar"><div className="lhdr-fill"/></div>
        </div>
      </div>

      <div style={{background:"rgba(52,199,89,0.08)",border:"1.5px solid rgba(52,199,89,0.2)",borderRadius:"var(--rsm)",padding:"11px 14px",fontSize:12,color:"#1b5e35",fontWeight:500}}>
        🏅 Top 3 promote to Gold League. You need <b>740 more XP</b> to promote.
      </div>

      <div className="slbl">Ranking</div>
      <div className="lbrows stagger">
        {LEAGUE.map(e=>(
          <div key={e.rank} className={`lbrow${e.isYou?" you":""}${e.rank<=3?" promote":""}`}>
            <div className={`lbrank ${rc(e.rank)}`}>{e.rank<=3?"🥇🥈🥉".split("")[e.rank-1]:e.rank}</div>
            <div className="lbav">{e.initials}</div>
            <div className="lbinfo"><div className="lbname">{e.name}{e.isYou?" (you)":""}</div><div className="lbdetail">{e.year}</div></div>
            <div className="lbxp">{e.xp.toLocaleString()} xp</div>
          </div>
        ))}
      </div>

      <div className="card" style={{padding:16,textAlign:"center"}}>
        <div style={{fontSize:12,color:"var(--ink2)",marginBottom:12}}>Complete 2 more lessons to close the gap 💪</div>
        <button className="btn">Keep learning →</button>
      </div>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
const TABS = [
  {id:"home",label:"Home",ico:"🏠"},
  {id:"learn",label:"Learn",ico:"📚"},
  {id:"portfolio",label:"Portfolio",ico:"📈"},
  {id:"league",label:"League",ico:"🏆"},
];

export default function App() {
  const [tab, setTab] = useState("home");
  const [activeTrack, setActiveTrack] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  function openTrack(t) { setActiveTrack(t); setTab("learn"); }
  function startLesson(l) { if(l.questions?.length) setActiveLesson(l); }
  function back() { if(activeLesson) setActiveLesson(null); else if(activeTrack) setActiveTrack(null); }
  function lessonDone() { setActiveLesson(null); }

  const hideTabs = !!activeLesson || !!activeTrack;

  function content() {
    if (activeLesson) return <LessonScreen lesson={activeLesson} onBack={back} onComplete={lessonDone}/>;
    if (activeTrack) return <TrackDetail track={activeTrack} onBack={back} onStartLesson={startLesson}/>;
    if (tab==="home") return <HomeScreen onStartLesson={startLesson} onOpenTrack={openTrack}/>;
    if (tab==="learn") return <LearnScreen onOpenTrack={openTrack}/>;
    if (tab==="portfolio") return <PortfolioScreen/>;
    if (tab==="league") return <LeagueScreen/>;
  }

  return (
    <>
      <style>{css}</style>
      <div className="phone">
        <nav className="nav">
          <div className="logo">num<em>vi</em></div>
          <div className="pills">
            <div className="pill">🔥 <b>12</b></div>
            <div className="pill">⚡ <b>1,240</b> xp</div>
          </div>
        </nav>
        <div className="scroll">{content()}</div>
        {!hideTabs && (
          <nav className="tabbar">
            {TABS.map(t=>(
              <button key={t.id} className={`ti${tab===t.id?" active":""}`}
                onClick={()=>{setTab(t.id);setActiveTrack(null);setActiveLesson(null);}}>
                <div className="ti-ico">{t.ico}</div>
                <div className="ti-lbl">{t.label}</div>
              </button>
            ))}
          </nav>
        )}
      </div>
    </>
  );
}
