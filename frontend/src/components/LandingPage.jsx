import React, { useState, useEffect, useRef } from 'react';

const __CSS__ = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

:root{
  --ink:#0A1F36;          /* deep navy — 30% */
  --ink-soft:#163055;
  --bg:#F4F7FB;           /* light blue-white — 60% */
  --bg-alt:#EAF0F8;
  --accent:#2D6CDF;       /* vivid blue — 10% */
  --accent-soft:#5C8DEE;
  --accent-dim:rgba(45,108,223,0.12);
  --muted:#5C7188;
  --line:rgba(10,31,54,0.10);
  --line-strong:rgba(10,31,54,0.18);
  --white:#FFFFFF;
  --radius:18px;
  --display:'Sora', sans-serif;
  --body:'Inter', sans-serif;
  --mono:'JetBrains Mono', monospace;
}
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{
  background:var(--bg);
  color:var(--ink);
  font-family:var(--body);
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}
img,svg{display:block;}
.container{
  max-width:1180px;
  margin:0 auto;
  padding:0 32px;
}
@media (max-width:640px){ .container{padding:0 20px;} }

a{color:inherit;text-decoration:none;}
button{font-family:var(--body);cursor:pointer;border:none;background:none;}

/* ===== Reduced motion ===== */
@media (prefers-reduced-motion: reduce){
  *{animation-duration:0.001ms !important; transition-duration:0.001ms !important;}
}

/* ===== NAV ===== */
.nav{
  position:sticky;top:0;z-index:50;
  background:rgba(244,247,251,0.85);
  backdrop-filter:blur(14px);
  border-bottom:1px solid var(--line);
}
.nav-inner{
  display:flex;align-items:center;justify-content:space-between;
  padding:18px 32px;max-width:1180px;margin:0 auto;
}
.logo{
  display:flex;align-items:center;gap:10px;
  font-family:var(--display);font-weight:700;font-size:18px;letter-spacing:-0.01em;
}
.logo-mark{
  width:30px;height:30px;border-radius:8px;
  background:linear-gradient(135deg,var(--accent),var(--ink));
  position:relative;flex:none;
}
.logo-mark::after{
  content:'';position:absolute;inset:8px;
  border:1.5px solid rgba(255,255,255,0.85);
  border-radius:3px;
}
.nav-links{display:flex;gap:36px;font-size:14px;font-weight:500;color:var(--muted);}
.nav-links a:hover{color:var(--ink);}
.nav-cta{
  background:var(--ink);color:#fff;padding:10px 20px;border-radius:10px;
  font-size:14px;font-weight:600;
  transition:background 0.2s ease;
}
.nav-cta:hover{background:var(--accent);}
@media (max-width:860px){ .nav-links{display:none;} }

/* ===== HERO — minimalist ===== */
.hero{
  padding:120px 0 100px;
  text-align:center;
  position:relative;
  overflow:hidden;
}
.hero::before{
  content:'';
  position:absolute;
  top:-220px;left:50%;
  width:1100px;height:680px;
  transform:translateX(-50%);
  background:radial-gradient(closest-side, rgba(45,108,223,0.16), rgba(45,108,223,0.06) 55%, transparent 80%);
  pointer-events:none;
  z-index:0;
}
.hero::after{
  content:'';
  position:absolute;
  inset:0;
  background:
    linear-gradient(180deg, rgba(244,247,251,0) 0%, var(--bg) 92%),
    repeating-linear-gradient(0deg, rgba(10,31,54,0.025) 0px, rgba(10,31,54,0.025) 1px, transparent 1px, transparent 64px),
    repeating-linear-gradient(90deg, rgba(10,31,54,0.025) 0px, rgba(10,31,54,0.025) 1px, transparent 1px, transparent 64px);
  -webkit-mask-image:radial-gradient(closest-side, rgba(0,0,0,0.9), transparent 75%);
  mask-image:radial-gradient(closest-side, rgba(0,0,0,0.9), transparent 75%);
  pointer-events:none;
  z-index:0;
}
.hero .container{position:relative;z-index:1;}
.eyebrow{
  display:inline-flex;align-items:center;gap:8px;
  font-family:var(--mono);font-size:12px;letter-spacing:0.08em;text-transform:uppercase;
  color:var(--accent);background:var(--accent-dim);
  padding:7px 14px;border-radius:100px;margin-bottom:28px;
}
.eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.35;}}
.hero h1{
  font-family:var(--display);
  font-weight:700;
  font-size:clamp(40px,6vw,68px);
  line-height:1.06;
  letter-spacing:-0.02em;
  max-width:840px;margin:0 auto 24px;
}
.hero h1 em{
  font-style:normal;color:var(--accent);
}
.hero p{
  max-width:540px;margin:0 auto 40px;
  font-size:17px;line-height:1.6;color:var(--muted);
}
.hero-actions{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}
.btn-primary{
  background:var(--accent);color:#fff;padding:14px 28px;border-radius:12px;
  font-size:15px;font-weight:600;
  box-shadow:0 8px 24px rgba(45,108,223,0.28);
  transition:transform 0.18s ease, box-shadow 0.18s ease;
}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(45,108,223,0.36);}
.btn-secondary{
  background:transparent;color:var(--ink);padding:14px 26px;border-radius:12px;
  font-size:15px;font-weight:600;border:1.5px solid var(--line-strong);
  transition:border-color 0.18s ease, background 0.18s ease;
}
.btn-secondary:hover{border-color:var(--accent);background:var(--accent-dim);}
.hero-note{
  margin-top:22px;font-size:13px;color:var(--muted);
}

/* ===== DASHBOARD SHOWCASE (iCMP-style light app) ===== */
.dash-section{padding:0 0 120px;}
.dash-frame{
  max-width:1080px;margin:0 auto;
  border-radius:24px;
  background:#fff;
  box-shadow:0 40px 90px -30px rgba(10,31,54,0.32);
  overflow:hidden;
  border:1px solid var(--line);
  opacity:0;
  transform:translateY(40px);
  transition:opacity 0.7s ease, transform 0.7s ease;
  --icmp-green:#1AA260;
  --icmp-pink:#F0285C;
  --icmp-orange:#F5A623;
  --icmp-slate:#6B7B92;
  --icmp-purple:#6E5BEF;
  --icmp-purple-dim:#EFEBFE;
  --icmp-text:#0F1B2D;
  --icmp-sub:#6B7B92;
  --icmp-line:#E7EAF0;
  --icmp-bg:#FAFBFD;
}
.dash-frame.visible{opacity:1;transform:translateY(0);}

/* top chrome bar (app topbar, not browser chrome) */
.dash-topbar{
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  padding:14px 22px;border-bottom:1px solid var(--icmp-line);
  background:#fff;
}
.dash-top-left{display:flex;align-items:center;gap:12px;}
.dash-brand{display:flex;align-items:center;gap:8px;font-family:var(--display);font-weight:700;font-size:15px;color:var(--icmp-text);}
.dash-brand-mark{
  width:26px;height:26px;border-radius:8px;background:var(--icmp-text);
  display:flex;align-items:center;justify-content:center;flex:none;
  transition:transform 0.35s cubic-bezier(.3,.8,.3,1);
}
.dash-brand-mark svg{width:14px;height:14px;color:#fff;}
.dash-topbar:hover .dash-brand-mark{transform:rotate(-8deg) scale(1.06);}
.dash-collapse{
  width:26px;height:26px;border-radius:7px;border:1px solid var(--icmp-line);
  display:flex;align-items:center;justify-content:center;color:var(--icmp-purple);
  transition:background 0.2s ease, border-color 0.2s ease;
}
.dash-collapse:hover{background:var(--icmp-purple-dim);border-color:var(--icmp-purple);}
.dash-collapse svg{width:13px;height:13px;}
.dash-top-divider{width:1px;height:22px;background:var(--icmp-line);}
.dash-title{font-size:13.5px;color:var(--icmp-text);font-weight:600;}
.dash-top-right{display:flex;align-items:center;gap:14px;}
.dash-bell{
  width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  color:var(--icmp-sub);transition:background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}
.dash-bell svg{width:16px;height:16px;}
.dash-bell:hover{background:var(--icmp-bg);color:var(--icmp-text);transform:scale(1.08);}
.dash-avatar{
  width:30px;height:30px;border-radius:50%;background:var(--icmp-purple);color:#fff;
  display:flex;align-items:center;justify-content:center;font-family:var(--display);font-size:12.5px;font-weight:700;
  transition:box-shadow 0.25s ease, transform 0.2s ease;
}
.dash-avatar-wrap{display:flex;align-items:center;gap:4px;cursor:pointer;}
.dash-avatar-wrap:hover .dash-avatar{box-shadow:0 0 0 4px var(--icmp-purple-dim);transform:scale(1.05);}
.dash-avatar-wrap svg{width:11px;height:11px;color:var(--icmp-sub);}

.dash-body{
  display:grid;grid-template-columns:212px 1fr;
  min-height:560px;
}
@media (max-width:760px){ .dash-body{grid-template-columns:1fr;} .dash-sidebar{display:none;} }

/* sidebar */
.dash-sidebar{
  border-right:1px solid var(--icmp-line);
  padding:18px 12px;display:flex;flex-direction:column;gap:2px;
  background:#fff;
}
.dash-nav-group-label{
  font-family:var(--mono);font-size:10px;letter-spacing:0.07em;color:#9AA7B8;
  text-transform:uppercase;padding:12px 12px 6px;
}
.dash-nav-group-label:first-child{padding-top:4px;}
.dash-nav-item{
  display:flex;align-items:center;gap:10px;
  padding:9px 12px;border-radius:8px;
  font-size:13px;color:#4A5A70;font-weight:500;
  position:relative;
  transition:background 0.18s ease, color 0.18s ease, padding-left 0.18s ease;
}
.dash-nav-item svg{width:15px;height:15px;flex:none;color:#8A97A8;transition:color 0.18s ease, transform 0.18s ease;}
.dash-nav-item:hover{background:var(--icmp-bg);color:var(--icmp-text);padding-left:15px;}
.dash-nav-item:hover svg{color:var(--icmp-purple);transform:scale(1.08);}
.dash-nav-item.active{background:var(--icmp-purple-dim);color:var(--icmp-purple);font-weight:600;}
.dash-nav-item.active svg{color:var(--icmp-purple);}
.dash-nav-item.active::before{
  content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);
  width:3px;height:16px;border-radius:0 3px 3px 0;background:var(--icmp-purple);
}
.dash-sidebar-divider{height:1px;background:var(--icmp-line);margin:10px 4px;}
.dash-plan-card{
  margin:10px 4px 0;padding:11px 13px;border-radius:11px;
  background:var(--icmp-purple-dim);
  transition:box-shadow 0.25s ease, transform 0.2s ease;
}
.dash-plan-card:hover{box-shadow:0 8px 18px -8px rgba(110,91,239,0.35);transform:translateY(-1px);}
.dash-plan-label{font-family:var(--mono);font-size:9px;letter-spacing:0.06em;color:#8E7FF0;text-transform:uppercase;margin-bottom:2px;}
.dash-plan-value{font-family:var(--display);font-size:13.5px;font-weight:700;color:var(--icmp-text);}

/* main content */
.dash-main{padding:26px 30px 30px;background:var(--icmp-bg);}
.dash-welcome h2{font-family:var(--display);font-size:23px;font-weight:700;letter-spacing:-0.01em;color:var(--icmp-text);margin-bottom:5px;}
.dash-welcome p{font-size:13px;color:var(--icmp-sub);margin-bottom:20px;}

.dash-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px;}
@media (max-width:900px){ .dash-stats{grid-template-columns:repeat(2,1fr);} }
@media (max-width:560px){ .dash-stats{grid-template-columns:1fr;} }
.stat-card{
  background:#fff;
  border:1px solid var(--icmp-line);
  border-left:3px solid var(--stat-c, var(--icmp-slate));
  border-radius:12px;padding:14px 16px 16px;
  display:flex;flex-direction:column;gap:10px;
  transition:box-shadow 0.25s ease, transform 0.22s ease, border-color 0.25s ease;
}
.stat-card:hover{box-shadow:0 14px 28px -16px rgba(10,31,54,0.18);transform:translateY(-3px);}
.stat-top{display:flex;align-items:flex-start;justify-content:space-between;}
.stat-label{font-size:10.5px;color:var(--icmp-sub);text-transform:uppercase;letter-spacing:0.05em;font-weight:600;padding-top:3px;}
.stat-icon{
  width:30px;height:30px;border-radius:9px;background:var(--stat-icon-bg,#EEF1F5);
  display:flex;align-items:center;justify-content:center;flex:none;color:var(--stat-c,var(--icmp-slate));
  transition:transform 0.3s cubic-bezier(.3,.8,.3,1), background 0.25s ease;
}
.stat-icon svg{width:14px;height:14px;}
.stat-card:hover .stat-icon{transform:scale(1.1) rotate(-4deg);}
.stat-value{font-family:var(--display);font-size:26px;font-weight:700;color:var(--icmp-text);letter-spacing:-0.01em;}
.stat-value.plan{font-size:21px;}

.dash-panels{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
@media (max-width:860px){ .dash-panels{grid-template-columns:1fr;} }
.dash-panel{
  background:#fff;
  border:1px solid var(--icmp-line);
  border-radius:14px;padding:20px 22px 0;
  display:flex;flex-direction:column;
  transition:box-shadow 0.25s ease;
}
.dash-panel:hover{box-shadow:0 16px 32px -20px rgba(10,31,54,0.16);}
.panel-head h4{color:var(--icmp-text);font-size:15px;font-weight:700;font-family:var(--display);margin-bottom:3px;}
.panel-head p{font-size:12px;color:var(--icmp-sub);margin-bottom:6px;}
.panel-foot{
  border-top:1px solid var(--icmp-line);margin:14px -22px 0;padding:14px 22px;
  display:flex;align-items:center;gap:10px;
}
.panel-foot-icon{
  width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex:none;
  background:rgba(26,162,96,0.12);color:var(--icmp-green);
  transition:transform 0.3s ease;
}
.panel-foot-icon svg{width:10px;height:10px;}
.dash-panel:hover .panel-foot-icon{transform:scale(1.15);}
.panel-foot-text strong{display:block;font-size:12.5px;color:var(--icmp-text);font-weight:600;}
.panel-foot-text span{font-size:11.5px;color:var(--icmp-sub);}

/* radar chart */
.radar-wrap{flex:1;display:flex;align-items:center;justify-content:center;padding:14px 0 6px;}
.radar-svg{width:100%;max-width:360px;height:auto;}
.radar-axis-line{stroke:var(--icmp-line);stroke-width:1;}
.radar-grid{fill:none;stroke:var(--icmp-line);stroke-width:1;}
.radar-shape{
  fill:rgba(26,162,96,0.12);stroke:var(--icmp-green);stroke-width:2;stroke-linejoin:round;
  transform-origin:center;transform:scale(0.85);opacity:0;
  transition:transform 0.6s cubic-bezier(.2,.8,.2,1), opacity 0.6s ease;
}
.dash-frame.visible .radar-shape{transform:scale(1);opacity:1;}
.radar-pt{r:4;transition:r 0.2s ease, filter 0.2s ease;cursor:pointer;}
.radar-pt:hover{r:6;filter:drop-shadow(0 0 6px currentColor);}
.radar-axis-label{font-family:var(--body);font-size:11.5px;font-weight:700;}

/* grouped bar chart */
.barchart-wrap{flex:1;display:flex;flex-direction:column;padding-top:10px;}
.barchart-grid{position:relative;height:170px;display:flex;}
.barchart-yaxis{display:flex;flex-direction:column;justify-content:space-between;font-size:10.5px;color:var(--icmp-sub);padding-right:8px;height:100%;text-align:right;width:24px;}
.barchart-plot{position:relative;flex:1;border-left:1px solid var(--icmp-line);}
.barchart-hline{position:absolute;left:0;right:0;border-top:1px solid var(--icmp-line);}
.barchart-groups{position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:space-around;padding:0 18px;}
.barchart-group{display:flex;align-items:flex-end;gap:6px;height:100%;}
.bar2{
  width:20px;border-radius:4px 4px 0 0;
  transform:scaleY(0);transform-origin:bottom;
  transition:transform 0.9s cubic-bezier(.2,.8,.2,1), filter 0.2s ease, opacity 0.2s ease;
  cursor:pointer;
}
.dash-frame.visible .bar2{transform:scaleY(1);}
.bar2:hover{filter:brightness(1.12);opacity:0.92;}
.barchart-xlabels{display:flex;justify-content:space-around;padding:8px 18px 0 32px;font-size:11.5px;color:var(--icmp-sub);font-weight:600;}
.barchart-legend{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;padding:14px 0 16px;}
.legend-item{display:flex;align-items:center;gap:6px;font-size:11.5px;color:#4A5A70;font-weight:500;transition:opacity 0.2s ease;cursor:default;}
.legend-item:hover{opacity:0.65;}
.legend-swatch{width:9px;height:9px;border-radius:2.5px;flex:none;}

/* ===== SECTION HEADERS ===== */
.section{padding:110px 0;}
.section-tight{padding-top:0;}
.sec-head{max-width:620px;margin:0 auto 64px;text-align:center;}
.sec-eyebrow{
  font-family:var(--mono);font-size:12px;letter-spacing:0.08em;text-transform:uppercase;
  color:var(--accent);margin-bottom:14px;display:block;
}
.sec-head h2{
  font-family:var(--display);font-weight:700;font-size:clamp(30px,4vw,42px);
  letter-spacing:-0.015em;line-height:1.15;margin-bottom:14px;
}
.sec-head p{color:var(--muted);font-size:16px;line-height:1.6;}

/* ===== HOW IT WORKS ===== */
.flow-outer{position:relative;max-width:1180px;margin:0 auto;}
.flow-svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;z-index:1;}
.flow-seg-base{
  fill:none;stroke:var(--line-strong);stroke-width:1.5;
  stroke-dasharray:1 7;stroke-linecap:round;
  animation:dashflow 1.1s linear infinite;
}
.flow-seg-glow{
  fill:none;stroke:var(--accent);stroke-width:2;opacity:0;
  stroke-dasharray:5 7;stroke-linecap:round;
  filter:drop-shadow(0 0 4px rgba(45,108,223,0.6));
  animation:dashflow 0.6s linear infinite;
  transition:opacity 0.3s ease;
}
.flow-seg-glow.active{opacity:1;}
@keyframes dashflow{ to{ stroke-dashoffset:-32px; } }

.flow{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:28px 22px;
  position:relative;z-index:2;
  padding:34px 6px 54px;
}
.flow .lnode:nth-child(odd){ transform:translateY(0); }
.flow .lnode:nth-child(even){ transform:translateY(52px); }
@media (max-width:860px){
  .flow{grid-template-columns:repeat(2,minmax(0,1fr));}
  .flow .lnode:nth-child(odd){ transform:translateY(0); }
  .flow .lnode:nth-child(even){ transform:translateY(36px); }
}
@media (max-width:560px){
  .flow{grid-template-columns:1fr;gap:54px;padding:24px 0 24px;}
  .flow .lnode:nth-child(n){ transform:translateY(0); }
}

.link-label{
  position:absolute;z-index:3;
  background:var(--ink);color:#fff;
  font-family:var(--mono);font-size:10px;font-weight:600;
  padding:5px 11px;border-radius:100px;white-space:nowrap;
  box-shadow:0 4px 10px -2px rgba(10,31,54,0.35);
  transform:translate(-50%,-50%);
  transition:background 0.25s ease, transform 0.25s ease;
}
.link-label.active{background:var(--accent);transform:translate(-50%,-50%) scale(1.08);}
.lnode{
  position:relative;
  background:var(--white);
  border:1px solid var(--line);
  border-radius:14px;
  padding:18px 18px 16px;
  box-shadow:0 6px 20px -10px rgba(10,31,54,0.12);
  opacity:0;
  transition:opacity 0.6s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.3s ease;
}
.lnode.visible{opacity:1;}
.lnode:hover{border-color:var(--accent);box-shadow:0 18px 34px -14px rgba(45,108,223,0.32);}
.flow .lnode:nth-child(odd):hover{transform:translateY(-4px);}
.flow .lnode:nth-child(even):hover{transform:translateY(48px);}
@media (max-width:560px){ .lnode:hover{transform:translateY(-4px) !important;} }
.lnode-badge{
  position:absolute;top:-11px;right:14px;
  font-family:var(--mono);font-size:10px;font-weight:600;letter-spacing:0.02em;
  padding:4px 10px;border-radius:100px;
  white-space:nowrap;
}
.lnode-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:2px;}
.lnode-title{font-family:var(--display);font-size:15px;font-weight:700;letter-spacing:-0.01em;}
.lnode-chevron{
  width:20px;height:20px;border-radius:6px;background:var(--bg-alt);
  display:flex;align-items:center;justify-content:center;flex:none;color:var(--muted);
  transform:rotate(180deg);
}
.lnode-chevron svg{width:10px;height:10px;}
.lnode-sub{
  font-family:var(--mono);font-size:11px;color:var(--muted);margin-bottom:14px;
}
.lnode-divider{border-top:1px solid var(--line);margin:0 -18px 12px;}
.lnode-stage{
  margin-top:13px;position:relative;height:46px;
  border-radius:9px;background:var(--bg-alt);border:1px solid var(--line);
  overflow:hidden;
}
/* collect: chips + scanning line */
.lstage-chips{display:flex;gap:6px;align-items:center;height:100%;padding:0 10px;}
.lchip{
  font-family:var(--mono);font-size:9px;color:var(--muted);
  background:#fff;border:1px solid var(--line);border-radius:6px;padding:4px 7px;
  transition:border-color 0.3s ease, color 0.3s ease;
}
.lscan{
  position:absolute;top:0;bottom:0;width:2px;left:-5%;
  background:linear-gradient(180deg,transparent,var(--accent),transparent);
  box-shadow:0 0 12px 2px rgba(45,108,223,0.7);
  transition:left 1.2s cubic-bezier(.3,.7,.3,1);
}
.lnode:hover .lscan{left:105%;}
.lnode:hover .lchip{border-color:var(--accent);color:var(--ink);}

/* validate: toggles */
.lstage-toggles{display:flex;flex-direction:column;gap:5px;justify-content:center;height:100%;padding:0 10px;}
.ltg-row{display:flex;align-items:center;justify-content:space-between;font-family:var(--mono);font-size:8.5px;color:var(--muted);}
.ltg{width:20px;height:11px;border-radius:6px;background:var(--line-strong);position:relative;transition:background 0.4s ease;}
.ltg::after{content:'';position:absolute;top:1.5px;left:1.5px;width:8px;height:8px;border-radius:50%;background:#fff;transition:transform 0.4s cubic-bezier(.3,.8,.3,1);}
.lnode:hover .ltg{background:var(--accent);}
.lnode:hover .ltg::after{transform:translateX(9px);}
.lnode:hover .ltg-row:nth-child(2) .ltg{transition-delay:0.1s;}

/* preferences: sliders */
.lstage-sliders{display:flex;flex-direction:column;gap:7px;justify-content:center;height:100%;padding:0 10px;}
.lsl-track{height:3px;border-radius:3px;background:var(--line-strong);}
.lsl-fill{height:100%;border-radius:3px;background:var(--accent);width:18%;transition:width 1s cubic-bezier(.3,.8,.3,1);}
.lnode:hover .lsl-fill{width:var(--w,70%);}

/* audit: log ticks */
.lstage-log{display:flex;flex-direction:column;justify-content:center;height:100%;padding:6px 10px;gap:2px;}
.llog-row{display:flex;align-items:center;gap:6px;font-family:var(--mono);font-size:8.5px;color:var(--muted);opacity:0;transform:translateX(-6px);transition:opacity 0.4s ease, transform 0.4s ease;}
.lnode:hover .llog-row{opacity:1;transform:translateX(0);}
.lnode:hover .llog-row:nth-child(2){transition-delay:0.1s;}
.llog-dot{width:4px;height:4px;border-radius:50%;background:#67D896;flex:none;}
.lnode-rows{display:flex;flex-direction:column;gap:9px;}
.lnode-row{display:flex;justify-content:space-between;gap:10px;font-size:12px;}
.lnode-row span:first-child{color:var(--muted);}
.lnode-row span:last-child{color:var(--ink);font-weight:600;text-align:right;}
.lnode-row .status-live{color:var(--accent);}


@media (max-width:1080px){
  .flow{justify-content:flex-start;}
}

/* ===== BENTO FEATURES — 3x3 grid ===== */
.bento{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  grid-template-rows:repeat(3,1fr);
  gap:18px;
}
@media (max-width:900px){ .bento{grid-template-columns:repeat(2,1fr); grid-template-rows:none;} }
@media (max-width:620px){ .bento{grid-template-columns:1fr; grid-template-rows:none;} }

.bcard{
  position:relative;
  background:var(--white);
  border:1px solid var(--line);
  border-radius:var(--radius);
  padding:24px;
  overflow:hidden;
  min-height:300px;
  display:flex;flex-direction:column;
  transition:border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
}
.bcard:hover{
  border-color:var(--accent);
  box-shadow:0 24px 48px -24px rgba(45,108,223,0.28);
  transform:translateY(-3px);
}

.bc-head{margin-bottom:16px;}
.bcard h3{font-family:var(--display);font-size:16.5px;font-weight:700;margin-bottom:6px;letter-spacing:-0.01em;}
.bcard p{font-size:12.5px;color:var(--muted);line-height:1.55;max-width:46ch;}

.bc-stage{
  position:relative;flex:1;margin-top:auto;
  min-height:148px;
  border-radius:13px;
  background:linear-gradient(165deg,var(--bg-alt) 0%, #fff 120%);
  border:1px solid var(--line);
  overflow:hidden;
}

/* ============================================================
   CARD 1 — Consent capture scanning: document stack + scan beam
   ============================================================ */
.stage-capture{position:relative;height:100%;padding:20px 22px;display:flex;flex-direction:column;justify-content:center;gap:10px;}
.cap-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;}
.cap-status{
  display:flex;align-items:center;gap:6px;
  font-family:var(--mono);font-size:9.5px;color:var(--muted);
  background:#fff;border:1px solid var(--line);border-radius:100px;padding:4px 10px;
}
.cap-status-dot{width:5px;height:5px;border-radius:50%;background:var(--line-strong);transition:background 0.3s ease, box-shadow 0.3s ease;}
.bcard:hover .cap-status-dot{background:#67D896;box-shadow:0 0 0 3px rgba(103,216,150,0.18);}
.cap-pct{font-family:var(--mono);font-size:9.5px;color:var(--accent);font-weight:600;}
.cap-files{display:flex;flex-direction:column;gap:6px;}
.cap-file{
  position:relative;
  display:flex;align-items:center;gap:8px;
  background:#fff;border:1px solid var(--line);border-radius:8px;
  padding:7px 10px;
  font-family:var(--mono);font-size:10px;color:var(--muted);
  overflow:hidden;
  transition:border-color 0.35s ease, color 0.35s ease;
}
.cap-file svg{width:11px;height:11px;flex:none;color:var(--muted);transition:color 0.35s ease;}
.cap-file-name{flex:1;}
.cap-file-check{
  width:13px;height:13px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  background:var(--line-strong);flex:none;
  transition:background 0.3s ease, transform 0.3s ease;
  transform:scale(0.8);
}
.cap-file-check svg{width:7px;height:7px;color:#fff;opacity:0;transition:opacity 0.25s ease;}
.bcard:hover .cap-file-check{background:#67D896;transform:scale(1);}
.bcard:hover .cap-file-check svg{opacity:1;}
.bcard:hover .cap-file:nth-child(1) .cap-file-check{transition-delay:0.25s;}
.bcard:hover .cap-file:nth-child(2) .cap-file-check{transition-delay:0.55s;}
.bcard:hover .cap-file:nth-child(3) .cap-file-check{transition-delay:0.85s;}
.bcard:hover .cap-file{border-color:rgba(103,216,150,0.4);color:var(--ink);}
.bcard:hover .cap-file svg{color:#67D896;}
.cap-beam{
  position:absolute;top:0;bottom:0;width:64px;left:-20%;
  background:linear-gradient(90deg,transparent,rgba(45,108,223,0.16),transparent);
  transition:left 1.6s cubic-bezier(.3,.7,.3,1);
  pointer-events:none;
}
.bcard:hover .cap-beam{left:120%;}

/* ============================================================
   CARD 2 — Real-time validation: orbiting regulation nodes
   ============================================================ */
.stage-validate{position:relative;height:100%;display:flex;align-items:center;justify-content:center;}
.val-orbit-ring{
  position:absolute;border-radius:50%;border:1px dashed var(--line-strong);
}
.val-ring-1{width:84px;height:84px;}
.val-ring-2{width:128px;height:128px;}
.val-hub{
  position:relative;z-index:3;
  width:46px;height:46px;border-radius:50%;
  background:linear-gradient(150deg,var(--accent),var(--ink));
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 8px 20px -6px rgba(45,108,223,0.5);
}
.val-hub svg{width:19px;height:19px;color:#fff;}
.val-node{
  position:absolute;
  width:38px;height:22px;border-radius:7px;
  background:#fff;border:1px solid var(--line);
  display:flex;align-items:center;justify-content:center;
  font-family:var(--mono);font-size:8px;font-weight:700;color:var(--muted);
  box-shadow:0 6px 14px -6px rgba(10,31,54,0.18);
  transition:border-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease;
}
.val-orbit-a{animation:orbitA 7s linear infinite;}
.val-orbit-b{animation:orbitB 9s linear infinite reverse;}
.val-orbit-c{animation:orbitC 11s linear infinite;}
@keyframes orbitA{ from{ transform:rotate(0deg) translateX(42px) rotate(0deg); } to{ transform:rotate(360deg) translateX(42px) rotate(-360deg); } }
@keyframes orbitB{ from{ transform:rotate(120deg) translateX(64px) rotate(-120deg); } to{ transform:rotate(480deg) translateX(64px) rotate(-480deg); } }
@keyframes orbitC{ from{ transform:rotate(240deg) translateX(64px) rotate(-240deg); } to{ transform:rotate(600deg) translateX(64px) rotate(-600deg); } }
.bcard:hover .val-node{border-color:var(--accent);color:var(--accent);box-shadow:0 10px 18px -6px rgba(45,108,223,0.35);}
.bcard .val-orbit-a, .bcard .val-orbit-b, .bcard .val-orbit-c{animation-play-state:paused;}
.bcard:hover .val-orbit-a, .bcard:hover .val-orbit-b, .bcard:hover .val-orbit-c{animation-play-state:running;}
.val-pulse-ring{position:absolute;width:46px;height:46px;border-radius:50%;border:1.5px solid var(--accent);opacity:0;}
.bcard:hover .val-pulse-ring{animation:valpulse 1.8s ease-out infinite;}
@keyframes valpulse{0%{opacity:0.55;transform:scale(1);}100%{opacity:0;transform:scale(2.5);}}

/* ============================================================
   CARD 3 — Preference center: consent-score gauge
   ============================================================ */
.stage-gauge{position:relative;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:14px;}
.gauge-wrap{position:relative;width:120px;height:68px;}
.gauge-wrap svg{width:100%;height:100%;}
.gauge-track{fill:none;stroke:var(--line-strong);stroke-width:8;stroke-linecap:round;}
.gauge-fill{
  fill:none;stroke:var(--accent);stroke-width:8;stroke-linecap:round;
  stroke-dasharray:144;stroke-dashoffset:144;
  transition:stroke-dashoffset 1.1s cubic-bezier(.3,.8,.3,1);
}
.bcard:hover .gauge-fill{stroke-dashoffset:32;}
.gauge-needle{
  position:absolute;left:50%;bottom:2px;width:2px;height:46px;
  background:var(--ink);transform-origin:bottom center;
  transform:rotate(-78deg);
  transition:transform 1.1s cubic-bezier(.3,.8,.3,1);
  border-radius:2px;
}
.bcard:hover .gauge-needle{transform:rotate(28deg);}
.gauge-needle::after{content:'';position:absolute;bottom:-4px;left:50%;width:9px;height:9px;border-radius:50%;background:var(--ink);transform:translateX(-50%);}
.gauge-readout{font-family:var(--display);font-size:19px;font-weight:700;color:var(--ink);}
.gauge-label{font-family:var(--mono);font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:0.04em;}
.gauge-pref-rows{display:flex;gap:6px;margin-top:2px;}
.gauge-tag{font-family:var(--mono);font-size:8px;color:var(--muted);background:#fff;border:1px solid var(--line);border-radius:100px;padding:3px 8px;transition:border-color 0.3s ease, color 0.3s ease;}
.bcard:hover .gauge-tag{border-color:var(--accent);color:var(--accent);}

/* ============================================================
   CARD 4 — Immutable audit trail: ledger / timeline ticks
   ============================================================ */
.stage-audit{position:relative;height:100%;padding:18px 20px;display:flex;flex-direction:column;justify-content:center;}
.audit-line{position:relative;padding-left:18px;}
.audit-spine{position:absolute;left:4px;top:4px;bottom:4px;width:1.5px;background:var(--line-strong);}
.audit-row{position:relative;display:flex;flex-direction:column;gap:1px;padding:7px 0;}
.audit-row::before{
  content:'';position:absolute;left:-18px;top:13px;width:9px;height:9px;border-radius:50%;
  background:var(--bg-alt);border:1.5px solid var(--line-strong);
  transition:background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
.audit-time{font-family:var(--mono);font-size:8.5px;color:var(--muted);}
.audit-event{font-family:var(--mono);font-size:10px;color:var(--ink);font-weight:600;opacity:0.35;transition:opacity 0.4s ease;}
.bcard:hover .audit-event{opacity:1;}
.bcard:hover .audit-row::before{background:#67D896;border-color:#67D896;box-shadow:0 0 0 3px rgba(103,216,150,0.18);}
.bcard:hover .audit-row:nth-child(1)::before{transition-delay:0.05s;}
.bcard:hover .audit-row:nth-child(2)::before{transition-delay:0.3s;}
.bcard:hover .audit-row:nth-child(3)::before{transition-delay:0.55s;}
.bcard:hover .audit-row:nth-child(1) .audit-event{transition-delay:0.05s;}
.bcard:hover .audit-row:nth-child(2) .audit-event{transition-delay:0.3s;}
.bcard:hover .audit-row:nth-child(3) .audit-event{transition-delay:0.55s;}
.audit-lock{
  position:absolute;top:14px;right:18px;
  display:flex;align-items:center;gap:5px;
  font-family:var(--mono);font-size:8.5px;color:var(--muted);
  background:#fff;border:1px solid var(--line);border-radius:100px;padding:4px 9px;
}
.audit-lock svg{width:9px;height:9px;}

/* ============================================================
   CARD 5 — Cross-border coverage: region map with pulses
   ============================================================ */
.stage-map2{position:relative;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;}
.map-grid{position:relative;width:160px;height:84px;}
.map-dot{
  position:absolute;width:7px;height:7px;border-radius:50%;background:var(--line-strong);
  transition:background 0.3s ease;
}
.map-dot::after{content:'';position:absolute;inset:-7px;border-radius:50%;border:1.5px solid var(--accent);opacity:0;transform:scale(0.5);}
.bcard:hover .map-dot{background:var(--accent);}
.bcard:hover .map-dot::after{animation:mapripple 1.6s ease-out infinite;}
@keyframes mapripple{0%{opacity:0.6;transform:scale(0.5);}100%{opacity:0;transform:scale(2.6);}}
.map-region-tags{display:flex;gap:6px;}
.map-region-tag{font-family:var(--mono);font-size:8px;color:var(--muted);background:#fff;border:1px solid var(--line);border-radius:100px;padding:3px 8px;transition:border-color 0.3s ease, color 0.3s ease;}
.bcard:hover .map-region-tag{border-color:var(--accent);color:var(--accent);}

/* ============================================================
   CARD 6 — Developer-first APIs: console / request-response
   ============================================================ */
.stage-api2{position:relative;height:100%;padding:16px 18px;display:flex;flex-direction:column;gap:8px;justify-content:center;}
.api-console{
  background:var(--ink);border-radius:10px;padding:12px 14px;
  font-family:var(--mono);font-size:10px;color:rgba(255,255,255,0.55);
  display:flex;flex-direction:column;gap:6px;
}
.api-console-top{display:flex;gap:5px;margin-bottom:4px;}
.api-console-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.18);}
.api-line{display:flex;gap:6px;opacity:0;transform:translateY(3px);transition:opacity 0.4s ease, transform 0.4s ease;}
.bcard:hover .api-line{opacity:1;transform:translateY(0);}
.bcard:hover .api-line:nth-child(2){transition-delay:0.12s;}
.bcard:hover .api-line:nth-child(3){transition-delay:0.28s;}
.bcard:hover .api-line:nth-child(4){transition-delay:0.46s;}
.api-line .api-method{color:var(--accent-soft);font-weight:700;}
.api-line .api-200{color:#67D896;font-weight:700;}
.api-cursor{display:inline-block;width:5px;height:11px;background:var(--accent-soft);margin-left:1px;animation:apicursor 1s steps(2) infinite;}
@keyframes apicursor{50%{opacity:0;}}

/* ============================================================
   CARD 7 — Data subject requests: queue rows resolving with SLA bars
   ============================================================ */
.stage-dsar{position:relative;height:100%;padding:18px 20px;display:flex;flex-direction:column;justify-content:center;gap:12px;}
.dsar-rows{display:flex;flex-direction:column;gap:9px;}
.dsar-row{display:grid;grid-template-columns:64px 1fr auto;align-items:center;gap:8px;}
.dsar-type{font-family:var(--mono);font-size:9.5px;color:var(--muted);}
.dsar-bar-track{height:5px;border-radius:4px;background:var(--line);overflow:hidden;}
.dsar-bar-fill{display:block;height:100%;border-radius:4px;background:var(--accent);width:0%;transition:width 1s cubic-bezier(.3,.8,.3,1);}
.bcard:hover .dsar-bar-fill{width:var(--w,50%);}
.dsar-state{font-family:var(--mono);font-size:8.5px;font-weight:700;padding:3px 7px;border-radius:100px;white-space:nowrap;transition:transform 0.3s ease;}
.dsar-state.done{background:rgba(103,216,150,0.15);color:#1AA260;}
.dsar-state.pending{background:rgba(244,180,82,0.15);color:#B8860B;}
.dsar-state.queued{background:var(--line);color:var(--muted);}
.bcard:hover .dsar-state{transform:scale(1.05);}
.dsar-sla{
  display:flex;align-items:center;gap:6px;
  font-family:var(--mono);font-size:9px;color:var(--muted);
  border-top:1px solid var(--line);padding-top:10px;
}
.dsar-sla svg{width:11px;height:11px;color:var(--accent);transition:transform 0.6s ease;}
.bcard:hover .dsar-sla svg{transform:rotate(220deg);}

/* ============================================================
   CARD 8 — Granular cookie categories: switches flipping on in sequence
   ============================================================ */
.stage-cookie{position:relative;height:100%;padding:18px 20px;display:flex;flex-direction:column;justify-content:center;gap:9px;}
.cookie-cats{display:flex;flex-direction:column;gap:9px;}
.cookie-cat{
  display:flex;align-items:center;gap:8px;
  font-size:11px;color:var(--ink);font-weight:500;
  background:#fff;border:1px solid var(--line);border-radius:8px;padding:7px 10px;
  transition:border-color 0.3s ease;
}
.bcard:hover .cookie-cat{border-color:rgba(45,108,223,0.25);}
.cookie-dot{width:8px;height:8px;border-radius:50%;flex:none;}
.cookie-dot.necessary{background:#8A97A8;}
.cookie-dot.analytics{background:var(--accent);}
.cookie-dot.marketing{background:#F0285C;}
.cookie-dot.functional{background:#F5A623;}
.cookie-lock{margin-left:auto;color:var(--muted);display:flex;}
.cookie-lock svg{width:11px;height:11px;}
.cookie-switch{
  margin-left:auto;width:24px;height:13px;border-radius:8px;background:var(--line-strong);position:relative;
  transition:background 0.4s ease;
}
.cookie-switch::after{content:'';position:absolute;top:1.5px;left:1.5px;width:10px;height:10px;border-radius:50%;background:#fff;transition:transform 0.4s cubic-bezier(.3,.8,.3,1);}
.bcard:hover .cookie-switch{background:var(--accent);}
.bcard:hover .cookie-switch::after{transform:translateX(11px);}
.bcard:hover .cookie-cat:nth-child(2) .cookie-switch{transition-delay:0.05s;}
.bcard:hover .cookie-cat:nth-child(3) .cookie-switch{transition-delay:0.2s;}
.bcard:hover .cookie-cat:nth-child(4) .cookie-switch{transition-delay:0.35s;}

/* ============================================================
   CARD 9 — Webhooks & alerts: event packet travelling from bell to targets
   ============================================================ */
.stage-webhook{position:relative;height:100%;padding:20px;display:flex;align-items:center;gap:10px;}
.webhook-source{
  width:34px;height:34px;border-radius:10px;flex:none;
  background:var(--accent-dim);color:var(--accent);
  display:flex;align-items:center;justify-content:center;
  transition:transform 0.3s ease;
}
.webhook-source svg{width:16px;height:16px;}
.bcard:hover .webhook-source{transform:scale(1.08) rotate(-6deg);}
.webhook-path{position:relative;flex:1;height:2px;background:var(--line);border-radius:2px;overflow:visible;}
.webhook-packet{
  position:absolute;top:50%;left:0;width:7px;height:7px;border-radius:50%;
  background:var(--accent);transform:translate(-4px,-50%);
  box-shadow:0 0 8px 1px rgba(45,108,223,0.6);
  opacity:0;transition:left 1.1s cubic-bezier(.3,.7,.3,1), opacity 0.2s ease;
}
.bcard:hover .webhook-packet{left:100%;opacity:1;}
.webhook-targets{display:flex;flex-direction:column;gap:6px;flex:none;}
.webhook-target{
  font-family:var(--mono);font-size:9px;color:var(--muted);
  background:#fff;border:1px solid var(--line);border-radius:100px;padding:3px 9px;
  transition:border-color 0.3s ease, color 0.3s ease;
}
.bcard:hover .webhook-target{border-color:var(--accent);color:var(--ink);}
.bcard:hover .webhook-target:nth-child(1){transition-delay:0.35s;}
.bcard:hover .webhook-target:nth-child(2){transition-delay:0.55s;}
.bcard:hover .webhook-target:nth-child(3){transition-delay:0.75s;}

@media (max-width:480px){
  .bc-stage{min-height:130px;}
}

/* ===== CONTACT ===== */
.contact-wrap{
  max-width:920px;margin:0 auto;
  background:var(--ink);
  border-radius:28px;
  padding:64px 56px;
  display:grid;grid-template-columns:1fr 1fr;gap:48px;
  color:#fff;
  position:relative;
  overflow:hidden;
}
.contact-wrap::before{
  content:'';position:absolute;top:-80px;right:-80px;width:280px;height:280px;
  background:radial-gradient(circle,rgba(45,108,223,0.35),transparent 70%);
}
@media (max-width:760px){ .contact-wrap{grid-template-columns:1fr;padding:44px 28px;} }
.contact-left h2{font-family:var(--display);font-size:30px;font-weight:700;margin-bottom:14px;letter-spacing:-0.01em;}
.contact-left p{color:rgba(255,255,255,0.6);font-size:14.5px;line-height:1.65;margin-bottom:26px;}
.contact-points{display:flex;flex-direction:column;gap:14px;}
.contact-point{display:flex;gap:10px;align-items:flex-start;font-size:13.5px;color:rgba(255,255,255,0.75);}
.contact-point svg{width:16px;height:16px;color:var(--accent-soft);flex:none;margin-top:1px;}
.form-field{margin-bottom:14px;}
.form-field label{display:block;font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:6px;font-family:var(--mono);}
.form-field input,.form-field textarea,.form-field select{
  width:100%;background:rgba(255,255,255,0.06);
  border:1px solid rgba(255,255,255,0.12);
  border-radius:10px;padding:11px 13px;color:#fff;font-size:14px;font-family:var(--body);
  outline:none;transition:border-color 0.2s ease, background 0.2s ease;
}
.form-field input::placeholder, .form-field textarea::placeholder{color:rgba(255,255,255,0.32);}
.form-field input:focus,.form-field textarea:focus,.form-field select:focus{border-color:var(--accent-soft);background:rgba(255,255,255,0.09);}
.form-field select option{color:#000;}
.contact-submit{
  width:100%;background:var(--accent);color:#fff;padding:13px;border-radius:10px;
  font-size:14.5px;font-weight:600;margin-top:6px;
  transition:background 0.2s ease, transform 0.15s ease;
}
.contact-submit:hover{background:var(--accent-soft);transform:translateY(-1px);}
.form-success{font-size:13px;color:#67D896;margin-top:10px;font-family:var(--mono);}

/* ===== FOOTER ===== */
.footer{border-top:1px solid var(--line);padding:56px 0 32px;}
.footer-top{display:flex;justify-content:space-between;gap:40px;flex-wrap:wrap;margin-bottom:48px;}
.footer-brand{max-width:280px;}
.footer-brand .logo{margin-bottom:14px;}
.footer-brand p{font-size:13.5px;color:var(--muted);line-height:1.6;}
.footer-cols{display:flex;gap:56px;flex-wrap:wrap;}
.footer-col h5{font-family:var(--display);font-size:13px;margin-bottom:14px;color:var(--ink);}
.footer-col a{display:block;font-size:13.5px;color:var(--muted);margin-bottom:10px;transition:color 0.15s ease;}
.footer-col a:hover{color:var(--accent);}
.footer-bottom{
  display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;
  padding-top:28px;border-top:1px solid var(--line);
  font-size:12.5px;color:var(--muted);
}
.footer-badges{display:flex;gap:10px;}
.footer-badge{
  font-family:var(--mono);font-size:11px;padding:5px 10px;border-radius:7px;
  background:var(--accent-dim);color:var(--accent);
}

/* reveal helper */
.reveal{opacity:0;transform:translateY(24px);transition:opacity 0.7s ease, transform 0.7s ease;}
.reveal.visible{opacity:1;transform:translateY(0);}

<<<<<<< HEAD
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --bg-color: #ffffff;
  --accent-color: #44bcf3;
  --accent-rgb: 68, 188, 243;
  --text-primary: #111111;
  --text-secondary: #666666;
  --border-color: #eaeaea;
  --border-hover: #d2d2d2;
  --card-bg: #ffffff;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.02), 0 4px 12px rgba(0, 0, 0, 0.03);
  --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.02), 0 12px 32px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.02), 0 24px 64px rgba(0, 0, 0, 0.06);
  --shadow-accent: 0 8px 24px rgba(68, 188, 243, 0.15);
  --radius-lg: 32px;
  --radius-md: 24px;
  --radius-sm: 12px;
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.icmp-root, .icmp-root *, .icmp-root *::before, .icmp-root *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.icmp-root {
  scroll-behavior: smooth;
  background-color: var(--bg-color);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--bg-color);
  overflow-x: hidden;
  line-height: 1.5;
}

/* Dotted Grid Background */
.icmp-root .dotted-bg {
  background-image: radial-gradient(rgba(0, 0, 0, 0.06) 1.5px, transparent 1.5px);
  background-size: 24px 24px;
}

.icmp-root .fade-mask {
  mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%);
}

/* Typography & Layout Utilities */
.icmp-root h1, .icmp-root h2, .icmp-root h3, .icmp-root h4 {
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--text-primary);
}

.icmp-root p {
  color: var(--text-secondary);
}

.icmp-root .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
}

.icmp-root .section {
  padding: 120px 0;
  border-bottom: 1px solid var(--border-color);
}

.icmp-root .section-header {
  max-width: 680px;
  margin: 0 auto 64px auto;
  text-align: center;
}

.icmp-root .section-header h2 {
  font-size: 2.75rem;
  line-height: 1.15;
  margin-bottom: 16px;
}

.icmp-root .section-header p {
  font-size: 1.125rem;
  line-height: 1.6;
}

/* Navigation Header */
.icmp-root .header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border-color);
  transition: var(--transition);
}

.icmp-root .header.scrolled {
  box-shadow: var(--shadow-sm);
  background: rgba(255, 255, 255, 0.95);
}

.icmp-root .header-container {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icmp-root .logo-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.icmp-root .logo-text {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--text-primary);
}

.icmp-root .logo-accent {
  color: var(--accent-color);
}

.icmp-root .nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

.icmp-root .nav-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: var(--transition);
}

.icmp-root .nav-link:hover {
  color: var(--text-primary);
}

/* Primary CTA Button */
.icmp-root .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  cursor: pointer;
  text-decoration: none;
  transition: var(--transition);
}

.icmp-root .btn-primary {
  background: var(--text-primary);
  color: #ffffff;
  box-shadow: var(--shadow-sm);
}

.icmp-root .btn-primary:hover {
  background: #222222;
  transform: translateY(-1px);
}

.icmp-root .btn-accent {
  background: var(--accent-color);
  color: #ffffff;
  box-shadow: var(--shadow-accent);
}

.icmp-root .btn-accent:hover {
  background: #36aee6;
  transform: translateY(-1px);
  box-shadow: 0 10px 28px rgba(68, 188, 243, 0.25);
}

.icmp-root .btn-outline {
  background: #ffffff;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.icmp-root .btn-outline:hover {
  border-color: var(--border-hover);
  background: #fafafa;
}

.icmp-root .btn-large {
  padding: 16px 36px;
  font-size: 1rem;
  border-radius: var(--radius-sm);
}

/* Hero Section */
.icmp-root .hero {
  position: relative;
  padding: 180px 0 100px 0;
  overflow: hidden;
  border-bottom: 1px solid var(--border-color);
}

.icmp-root .hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 64px auto;
  position: relative;
  z-index: 2;
}

.icmp-root .hero-headline {
  font-size: 4.5rem;
  line-height: 1.05;
  font-weight: 800;
  margin-bottom: 24px;
  letter-spacing: -0.04em;
}

.icmp-root .hero-headline span {
  color: var(--accent-color);
  position: relative;
}

.icmp-root .hero-subheadline {
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Interactive Dashboard & Canvas Wrapper */
.icmp-root .hero-canvas {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 720px;
}

/* SVG Connection Lines in Background */
.icmp-root .canvas-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.icmp-root .connector-line {
  fill: none;
  stroke: var(--border-color);
  stroke-dasharray: 4 4;
  transition: stroke 0.4s ease, stroke-width 0.4s ease;
}

.icmp-root .connector-line.active {
  fill: none;
  stroke: var(--accent-color);
  stroke-width: 2px;
  stroke-dasharray: none;
}

/* Hero Center Dashboard */
.icmp-root .dashboard-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 720px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: 2;
  overflow: hidden;
  transition: var(--transition);
}

.icmp-root .dashboard-container:hover {
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.08);
}

/* Dashboard Mockup Parts */
.icmp-root .db-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fbfbfc;
}

.icmp-root .db-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icmp-root .db-dots {
  display: flex;
  gap: 6px;
}

.icmp-root .db-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e5e5e5;
}

.icmp-root .db-dot:nth-child(1) { background: #ff5f56; }
.icmp-root .db-dot:nth-child(2) { background: #ffbd2e; }
.icmp-root .db-dot:nth-child(3) { background: #27c93f; }

.icmp-root .db-title-text {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.icmp-root .db-badge {
  background: rgba(68, 188, 243, 0.08);
  border: 1px solid rgba(68, 188, 243, 0.2);
  color: var(--accent-color);
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 99px;
  font-weight: 500;
}

.icmp-root .db-content {
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.icmp-root .db-full-width {
  grid-column: span 2;
}

.icmp-root .db-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 20px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.icmp-root .db-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icmp-root .db-card-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.icmp-root .db-stat {
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.icmp-root .db-trend {
  font-size: 0.75rem;
  color: #27c93f;
  background: rgba(39, 201, 63, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
}

/* Compliance Monitoring Log */
.icmp-root .compliance-log {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 120px;
  overflow-y: hidden;
}

.icmp-root .log-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  padding: 8px 12px;
  border-radius: 6px;
  background: #fafafa;
  border: 1px solid var(--border-color);
}

.icmp-root .log-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icmp-root .log-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #27c93f;
}

.icmp-root .log-indicator.warning {
  background: #ffbd2e;
}

.icmp-root .log-ip {
  font-family: monospace;
  color: var(--text-secondary);
}

.icmp-root .log-time {
  color: #aaaaaa;
}

/* Floating Cards Layout (Hero) */
.icmp-root .floating-card {
  position: absolute;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 16px;
  box-shadow: var(--shadow-sm);
  z-index: 3;
  width: 200px;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.icmp-root .floating-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: var(--shadow-md);
  border-color: var(--accent-color);
}

.icmp-root .fc-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.icmp-root .fc-title svg {
  color: var(--accent-color);
}

/* Floating Card-Specific Designs */
.icmp-root .fc-cookie { top: 40px; left: 15px; width: 230px; }
.icmp-root .cookie-mini-banner {
  border: 1px solid var(--border-color);
  padding: 10px;
  border-radius: var(--radius-sm);
  background: #fbfbfc;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.icmp-root .cookie-mini-text {
  font-size: 0.6875rem;
  color: var(--text-secondary);
  line-height: 1.4;
}
.icmp-root .cookie-mini-buttons {
  display: flex;
  gap: 6px;
}
.icmp-root .cookie-mini-btn {
  font-size: 0.625rem;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background: #fff;
  cursor: pointer;
  flex: 1;
  text-align: center;
  font-weight: 600;
}
.icmp-root .cookie-mini-btn.active {
  background: var(--accent-color);
  color: #fff;
  border-color: var(--accent-color);
}

/* 2. User Preferences (Switches) */
.icmp-root .fc-pref { top: 270px; left: 5px; width: 220px; }
.icmp-root .pref-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.icmp-root .pref-name {
  font-size: 0.75rem;
  color: var(--text-secondary);
}
.icmp-root .pref-switch {
  position: relative;
  display: inline-block;
  width: 28px;
  height: 16px;
}
.icmp-root .pref-switch input { opacity: 0; width: 0; height: 0; }
.icmp-root .pref-slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}
.icmp-root .pref-slider:before {
  position: absolute;
  content: "";
  height: 10px; width: 10px;
  left: 3px; bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}
.icmp-root .pref-switch input:checked + .pref-slider { background-color: var(--accent-color); }
.icmp-root .pref-switch input:checked + .pref-slider:before { transform: translateX(12px); }

/* 3. Audit Logs (Ticking) */
.icmp-root .fc-audit { top: 500px; left: 15px; width: 240px; }
.icmp-root .audit-mini-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.icmp-root .audit-mini-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.6875rem;
  padding: 6px 8px;
  background: #fbfbfc;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: monospace;
}
.icmp-root .audit-mini-status {
  color: #27c93f;
  font-weight: bold;
}

/* 4. Global Compliance (GDPR, CCPA) */
.icmp-root .fc-global { top: 40px; right: 15px; width: 240px; }
.icmp-root .global-badge-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}
.icmp-root .global-badge-item {
  padding: 6px 4px;
  border: 1px solid var(--border-color);
  background: #fafafa;
  border-radius: 6px;
  font-size: 0.6875rem;
  text-align: center;
  font-weight: 600;
  color: var(--text-secondary);
}
.icmp-root .global-badge-item.active {
  border-color: var(--accent-color);
  background: rgba(68, 188, 243, 0.05);
  color: var(--accent-color);
}

/* 5. Analytics (Mini Chart) */
.icmp-root .fc-analytics { top: 270px; right: 5px; width: 220px; }
.icmp-root .analytics-mini-chart {
  height: 60px;
  width: 100%;
}

/* 6. Legal Compliance */
.icmp-root .fc-legal { top: 480px; right: 15px; width: 220px; }
.icmp-root .legal-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.icmp-root .legal-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: var(--text-secondary);
}
.icmp-root .legal-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-color);
}

/* Feature Grid Styles */
.icmp-root .features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.icmp-root .feature-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.icmp-root .feature-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
  border-color: var(--accent-color);
}

.icmp-root .feature-illustration-container {
  height: 180px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  background-color: #fafafa;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icmp-root .feature-card h3 {
  font-size: 1.125rem;
  margin-bottom: 8px;
}

.icmp-root .feature-card p {
  font-size: 0.875rem;
  line-height: 1.5;
}

/* Feature 1: Consent Lifecycle Diagram */
.icmp-root .lifecycle-step {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: #ffffff;
  font-size: 0.625rem;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
  position: relative;
}
.icmp-root .lifecycle-step.active {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

/* Feature 2: Cookie UI Banner */
.icmp-root .cookie-card-ui {
  width: 190px;
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 12px;
  box-shadow: var(--shadow-sm);
}
.icmp-root .cookie-card-ui-actions {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}
.icmp-root .cookie-card-ui-btn {
  font-size: 0.5625rem;
  padding: 4px;
  flex: 1;
  text-align: center;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  font-weight: 600;
}
.icmp-root .cookie-card-ui-btn.primary {
  background: var(--accent-color);
  color: #fff;
  border-color: var(--accent-color);
}

/* Feature 3: API Console */
.icmp-root .api-console {
  width: 90%;
  height: 80%;
  background: #111;
  border-radius: 8px;
  padding: 12px;
  font-family: monospace;
  font-size: 0.625rem;
  color: #3bca3b;
  overflow: hidden;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.8);
}
.icmp-root .api-console .line {
  margin-bottom: 4px;
}
.icmp-root .api-console .blue { color: var(--accent-color); }
.icmp-root .api-console .white { color: #fff; }

/* Feature 4: User Dashboard Mini */
.icmp-root .db-mini {
  width: 85%;
  height: 80%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 8px;
}
.icmp-root .db-mini-card {
  border: 1px solid var(--border-color);
  background: #fff;
  border-radius: 6px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Feature 5: DSAR Cards */
.icmp-root .dsar-card-stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 80%;
}
.icmp-root .dsar-card-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 500;
}

/* Feature 6: Immutable Log Link */
.icmp-root .log-chain {
  display: flex;
  align-items: center;
  gap: 8px;
}
.icmp-root .log-chain-node {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5rem;
  font-weight: 700;
  color: var(--accent-color);
}
.icmp-root .log-chain-link {
  width: 16px;
  height: 2px;
  background: var(--border-color);
  position: relative;
}

/* Feature 7: Role Permission Hierachy */
.icmp-root .role-hierarchy {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 75%;
}
.icmp-root .role-node {
  padding: 6px 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: #fff;
  font-size: 0.6875rem;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
}
.icmp-root .role-node.admin { border-left: 3px solid var(--accent-color); }

/* Feature 8: User Rights Matrix */
.icmp-root .rights-matrix {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  width: 80%;
}
.icmp-root .right-box {
  padding: 6px;
  border: 1px solid var(--border-color);
  background: #fff;
  border-radius: 6px;
  font-size: 0.625rem;
  font-weight: 600;
  text-align: center;
}

/* How It Works - Connected Architecture Ecosystem */
.icmp-root .archi-section {
  position: relative;
}

.icmp-root .archi-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 48px;
  align-items: center;
}

.icmp-root .archi-canvas-container {
  height: 520px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  position: relative;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: var(--shadow-sm);
}

.icmp-root .archi-cards-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.icmp-root .archi-node {
  position: absolute;
  padding: 12px 18px;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: var(--transition);
}

.icmp-root .archi-node:hover, .icmp-root .archi-node.active {
  border-color: var(--accent-color);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.icmp-root .archi-node-center {
  background: var(--text-primary);
  color: #ffffff;
  z-index: 4;
}

.icmp-root .archi-node-center:hover, .icmp-root .archi-node-center.active {
  background: var(--accent-color);
  border-color: var(--accent-color);
  color: #ffffff;
}

/* Visible Connection Dots styled at card borders */
.icmp-root .node-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 2px solid var(--border-color);
  z-index: 10;
  transition: var(--transition);
  pointer-events: none;
}

/* Position mapping around the edges of cards */
.icmp-root .dot-b { bottom: -5px; left: 50%; transform: translateX(-50%); }
.icmp-root .dot-t { top: -5px; left: 50%; transform: translateX(-50%); }
.icmp-root .dot-r { right: -5px; top: 50%; transform: translateY(-50%); }
.icmp-root .dot-l { left: -5px; top: 50%; transform: translateY(-50%); }
.icmp-root .dot-br { bottom: -4px; right: -4px; }
.icmp-root .dot-tr { top: -4px; right: -4px; }
.icmp-root .dot-tl { top: -4px; left: -4px; }
.icmp-root .dot-bl { bottom: -4px; left: -4px; }

/* Connection states */
.icmp-root .archi-node:hover .node-dot,
.icmp-root .archi-node.active .node-dot,
.icmp-root .floating-card:hover .node-dot,
.icmp-root .floating-card.active .node-dot {
  background-color: var(--accent-color);
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(68, 188, 243, 0.25);
  transform: scale(1.25);
}

/* Archi Detail Card Panel */
.icmp-root .archi-detail-panel {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 32px;
  box-shadow: var(--shadow-sm);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.icmp-root .archi-detail-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  background: rgba(68, 188, 243, 0.08);
  border: 1px solid rgba(68, 188, 243, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-color);
  margin-bottom: 24px;
}

.icmp-root .archi-detail-title {
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.icmp-root .archi-detail-desc {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Pricing Grid */
.icmp-root .pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  align-items: stretch;
}

.icmp-root .pricing-card {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 40px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  position: relative;
  transition: var(--transition);
}

.icmp-root .pricing-card.popular {
  border-color: var(--accent-color);
  box-shadow: var(--shadow-lg);
}

.icmp-root .pricing-card:hover {
  transform: translateY(-6px);
}

.icmp-root .popular-badge {
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(68, 188, 243, 0.08);
  color: var(--accent-color);
  border: 1px solid rgba(68, 188, 243, 0.2);
  padding: 6px 12px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
}

.icmp-root .pricing-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.icmp-root .pricing-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.icmp-root .pricing-price {
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  margin-bottom: 8px;
}

.icmp-root .pricing-price span {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.icmp-root .pricing-features {
  list-style: none;
  margin: 32px 0;
  flex: 1;
}

.icmp-root .pricing-features li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.icmp-root .pricing-features li svg {
  color: var(--accent-color);
  flex-shrink: 0;
}

/* FAQ Accordions */
.icmp-root .faq-grid {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.icmp-root .faq-item {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  overflow: hidden;
  transition: var(--transition);
}

.icmp-root .faq-item:hover {
  border-color: var(--accent-color);
}

.icmp-root .faq-header {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.icmp-root .faq-question {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--text-primary);
}

.icmp-root .faq-toggle-icon {
  width: 20px;
  height: 20px;
  transition: var(--transition);
  color: var(--text-secondary);
}

.icmp-root .faq-item.active .faq-toggle-icon {
  transform: rotate(45deg);
  color: var(--accent-color);
}

.icmp-root .faq-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.icmp-root .faq-answer {
  padding: 0 24px 24px 24px;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* CTA Footer Visual Mapping Section */
.icmp-root .cta-section {
  position: relative;
  padding: 120px 0;
  overflow: hidden;
  border-bottom: 1px solid var(--border-color);
}

.icmp-root .cta-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 64px;
  align-items: center;
}

.icmp-root .cta-visual-container {
  height: 480px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  position: relative;
  overflow: hidden;
  background: #ffffff;
  box-shadow: var(--shadow-sm);
}

/* Footer styling */
.icmp-root .footer {
  padding: 80px 0 48px 0;
  background: #ffffff;
}

.icmp-root .footer-grid {
  display: grid;
  grid-template-columns: 1.5fr repeat(4, 1fr);
  gap: 48px;
  margin-bottom: 64px;
}

.icmp-root .footer-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.icmp-root .footer-tagline {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.icmp-root .footer-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.icmp-root .footer-badge {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  background: #fafafa;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.icmp-root .footer-col h4 {
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-primary);
  margin-bottom: 24px;
}

.icmp-root .footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.icmp-root .footer-link {
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: var(--transition);
}

.icmp-root .footer-link:hover {
  color: var(--text-primary);
}

.icmp-root .footer-bottom {
  border-top: 1px solid var(--border-color);
  padding-top: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icmp-root .footer-copyright {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

/* Demo Modal Styling */
.icmp-root .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.icmp-root .modal-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

.icmp-root .modal-container {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
  transform: scale(0.95);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.icmp-root .modal-overlay.active .modal-container {
  transform: scale(1);
}

.icmp-root .modal-close {
  position: absolute;
  top: 24px;
  right: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  transition: var(--transition);
}

.icmp-root .modal-close:hover {
  color: var(--text-primary);
}

.icmp-root .modal-title {
  font-size: 1.75rem;
  margin-bottom: 8px;
}

.icmp-root .modal-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.icmp-root .form-group {
  margin-bottom: 20px;
}

.icmp-root .form-label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.icmp-root .form-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  font-family: var(--font-sans);
  font-size: 0.875rem;
  transition: var(--transition);
}

.icmp-root .form-input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(68, 188, 243, 0.15);
}

/* Toast Notification */
.icmp-root .toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #111;
  color: #fff;
  padding: 16px 24px;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
  font-size: 0.875rem;
  font-weight: 600;
  z-index: 1001;
  display: flex;
  align-items: center;
  gap: 12px;
  transform: translateY(100px);
  opacity: 0;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}

.icmp-root .toast.active {
  transform: translateY(0);
  opacity: 1;
}

.icmp-root .toast-success-icon {
  color: #27c93f;
}

/* Responsiveness adjustments */
@media (max-width: 1024px) {
  .icmp-root .hero-canvas {
    min-height: 920px;
  }
  .icmp-root .dashboard-container {
    width: 600px;
    top: 450px;
  }
  .icmp-root .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .icmp-root .pricing-grid {
    grid-template-columns: 1fr;
    max-width: 450px;
    margin: 0 auto;
  }
  .icmp-root .archi-layout {
    grid-template-columns: 1fr;
  }
  .icmp-root .archi-detail-panel {
    order: -1;
  }
  .icmp-root .cta-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .icmp-root .hero-headline {
    font-size: 3rem;
  }
  .icmp-root .section-header h2 {
    font-size: 2.25rem;
  }
  .icmp-root .header-container {
    height: 70px;
    justify-content: space-between;
  }
  .icmp-root .nav {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background: var(--bg-color);
    padding: 24px;
    border-bottom: 1px solid var(--border-color);
    box-shadow: var(--shadow-md);
    gap: 16px;
    align-items: flex-start;
  }
  .icmp-root .nav.open {
    display: flex;
  }
  .icmp-root .mobile-menu-btn {
    display: block;
    background: none;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
  }
  .icmp-root .features-grid {
    grid-template-columns: 1fr;
  }
  .icmp-root .footer-grid {
    grid-template-columns: 1fr;
  }
  .icmp-root .hero-canvas {
    min-height: auto;
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding-top: 40px;
  }
  .icmp-root .dashboard-container {
    position: static;
    transform: none;
    width: 100%;
  }
  .icmp-root .floating-card {
    position: static;
    width: 100%;
    margin-bottom: 12px;
  }
  .icmp-root .canvas-lines {
    display: none;
  }
}
=======
>>>>>>> 7a314aec0b17b3ba2fd5c936a6d010f2b375fe12
`;

function GlobalStyles(){
  return <style dangerouslySetInnerHTML={{ __html: __CSS__ }} />;
}


/* ---------- generic reveal-on-scroll hook ---------- */
function useReveal(){
  const ref = useRef(null);
  const [vis,setVis] = useState(false);
  useEffect(()=>{
    const el = ref.current;
    if(!el) return;
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting) setVis(true); });
    },{threshold:0.2});
    obs.observe(el);
    return ()=>obs.disconnect();
  },[]);
  return [ref,vis];
}

/* ---------- ICONS ---------- */
const Icon = {
  scan: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M4 7V5a1 1 0 0 1 1-1h2M20 7V5a1 1 0 0 0-1-1h-2M4 17v2a1 1 0 0 0 1 1h2M20 17v2a1 1 0 0 1-1 1h-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M4 12h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>),
  shield: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M9.5 12l1.8 1.8L14.5 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  sliders: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M4 6h10M17 6h3M7 18h13M4 18h0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="14" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.6"/><circle cx="6" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.6"/></svg>),
  log: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M5 4h14v16H5z" stroke="currentColor" strokeWidth="1.6"/><path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>),
  globe: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M3 12h18M12 3a13 13 0 0 1 0 18 13 13 0 0 1 0-18z" stroke="currentColor" strokeWidth="1.6"/></svg>),
  key: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="8" cy="15" r="4" stroke="currentColor" strokeWidth="1.6"/><path d="M11 12l9-9M16 7l3 3M13 10l2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>),
  doc: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M6 2h9l3 3v17H6z" stroke="currentColor" strokeWidth="1.4"/><path d="M9 11h6M9 14h6M9 17h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>),
  arrowDown: (p)=>(<svg viewBox="0 0 14 34" fill="none" {...p}><path d="M7 0v28M1 22l6 8 6-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  arrowRight: (p)=>(<svg viewBox="0 0 34 14" fill="none" {...p}><path d="M0 7h28M22 1l8 6-8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  chevron: (p)=>(<svg viewBox="0 0 12 8" fill="none" {...p}><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  check: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M5 12l5 5 9-10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  mail: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M4 5h16v14H4z" stroke="currentColor" strokeWidth="1.6"/><path d="M4 6l8 7 8-7" stroke="currentColor" strokeWidth="1.6"/></svg>),
  pin: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.6"/></svg>),
  chat: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M4 5h16v11H9l-5 4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>),
  lock: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.6"/></svg>),
  /* dashboard-specific icon set */
  grid: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7"/></svg>),
  collapse: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="M9 4v16" stroke="currentColor" strokeWidth="1.6"/></svg>),
  scanner: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M5 9V6a1 1 0 0 1 1-1h3M19 9V6a1 1 0 0 0-1-1h-3M5 15v3a1 1 0 0 0 1 1h3M19 15v3a1 1 0 0 1-1 1h-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>),
  versions: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><rect x="4" y="8" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M8 8V5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-3" stroke="currentColor" strokeWidth="1.6"/></svg>),
  warning: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 4l9 16H3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M12 10v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="currentColor"/></svg>),
  dataRights: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>),
  renewal: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M18 4v4h-4M6 20v-4h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  bell: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M6 10a6 6 0 1 1 12 0c0 3 1 5 1.5 6H4.5C5 15 6 13 6 10z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>),
  approvals: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M8.5 12.5l2.2 2.2L16 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  validation: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M8.5 12l2 2 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  audit: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M6 2h9l3 3v17H6z" stroke="currentColor" strokeWidth="1.4"/><path d="M9 11h6M9 14h6M9 17h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>),
  analytics: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M4 20V10M11 20V4M18 20v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  retention: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M8 9h8M8 12h8M8 15h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>),
  pulse: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M3 12h4l2 6 4-14 2 8h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  db: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M4 10h16M4 15h16" stroke="currentColor" strokeWidth="1.7"/></svg>),
  planIcon: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M4 10h16" stroke="currentColor" strokeWidth="1.7"/></svg>),
  trendUp: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M3 16l6-6 4 4 8-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 5h5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  chevronDown: (p)=>(<svg viewBox="0 0 12 8" fill="none" {...p}><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>),
};

<<<<<<< HEAD
const FAQ_ITEMS = [
  {
    q: "What is a Consent Management Platform?",
    a: "A Consent Management Platform (CMP) is a tool that helps organizations legally collect, document, and manage user preferences and consents regarding cookies and data tracking, ensuring global compliance with regulations like GDPR, CCPA, and LGPD.",
  },
  {
    q: "Which privacy regulations are supported?",
    a: "iCMP supports all major worldwide data compliance frameworks, including the EU\u2019s GDPR, California's CCPA/CPRA, Brazil's LGPD, Singapore's PDPA, Canada\u2019s PIPEDA, and various state-level privacy acts in the US.",
  },
  {
    q: "How does Consent Validation API work?",
    a: "The Consent Validation API acts as an inline gateway. When your site or mobile application initiates scripts, it queries iCMP's edge validation node. The script executes only if a verified, unexpired consent token is returned, preventing accidental compliance breaches.",
  },
  {
    q: "Can I manage multiple websites?",
    a: "Yes. You can manage and monitor your entire domain network from a single dashboard. Settings can be inherited globally or customized on a per-site basis depending on country-specific regulatory needs.",
  },
  {
    q: "How are audit logs stored?",
    a: "All consent states are compiled into a cryptographic hash ledger where each change links back to the prior entry in an immutable chain. This ledger is cryptographically secured, ensuring that logs are audit-ready and tamper-proof.",
  },
  {
    q: "Does iCMP support DSAR workflows?",
    a: "Yes, our Professional and Enterprise plans feature a dedicated DSAR (Data Subject Access Request) portal. This automates validation, correction, and deletion SLAs by integrating directly with your backend database structures.",
  },
  {
    q: "Is the platform enterprise-ready?",
    a: "Absolutely. We provide SSO SAML authentication, role-based access controls, comprehensive uptime SLAs (99.99%), isolated cloud tenants, and end-to-end encryption for the most demanding enterprise deployments.",
  },
  {
    q: "Can I integrate with existing systems?",
    a: "Yes. iCMP features direct, pre-built integrations with Google Tag Manager, HubSpot, Segment, Salesforce, Shopify, WordPress, and standard web application frameworks (React, Next.js, Vue).",
  },
];

const IP_LIST = ["103.49.20.14", "74.125.19.147", "210.33.109.82", "8.8.8.8", "192.168.1.1"];
const REGIONS = ["DPDPA"];
const ACTIONS = ["Consent Approved", "Consent Custom", "Consent Rejected"];

let logIdCounter = 1;

export default function ICMPLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* ---------------- Header scroll effect ---------------- */
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------------- Hero canvas connector lines ---------------- */
  const heroLinesRef = useRef(null);
  const [hoveredHeroNode, setHoveredHeroNode] = useState(null); // data-target name while hovered
  const [heroLineCoords, setHeroLineCoords] = useState({});

  const drawHeroLines = useCallback(() => {
    if (window.innerWidth <= 768) return;
    const canvasEl = heroLinesRef.current;
    if (!canvasEl) return;
    const canvasRect = canvasEl.getBoundingClientRect();
    const coords = {};

    HERO_CONNECTIONS.forEach((conn) => {
      const fromEl = document.getElementById(conn.from);
      const toEl = document.getElementById(conn.to);
      if (fromEl && toEl) {
        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();
        coords[conn.lineId] = {
          x1: fromRect.left + fromRect.width / 2 - canvasRect.left,
          y1: fromRect.top + fromRect.height / 2 - canvasRect.top,
          x2: toRect.left + toRect.width / 2 - canvasRect.left,
          y2: toRect.top + toRect.height / 2 - canvasRect.top,
        };
      }
    });
    setHeroLineCoords(coords);
  }, []);

  useEffect(() => {
    const t = setTimeout(drawHeroLines, 100);
    window.addEventListener("resize", drawHeroLines);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", drawHeroLines);
    };
  }, [drawHeroLines]);

  /* ---------------- Compliance telemetry / preferences ---------------- */
  const [analyticsChecked, setAnalyticsChecked] = useState(true);
  const [marketingChecked, setMarketingChecked] = useState(false);
  const [cookieChoice, setCookieChoice] = useState("accept"); // 'accept' | 'reject' | null
  const [optInRate, setOptInRate] = useState(94.2);
  const [activeView, setActiveView] = useState("Overview Dashboard");
  const [activeViewHighlighted, setActiveViewHighlighted] = useState(false);
  const [highlightedDbSection, setHighlightedDbSection] = useState(null);

  const [complianceLogs, setComplianceLogs] = useState([
    { id: "init-1", type: "Consent Approved", regulation: "DPDPA", ip: "182.29.192.12", time: "Just Now", state: "success" },
    { id: "init-2", type: "Consent Custom", regulation: "DPDPA", ip: "92.110.231.42", time: "1s ago", state: "success" },
    { id: "init-3", type: "Consent Rejected", regulation: "DPDPA", ip: "203.20.144.91", time: "2s ago", state: "warning" },
  ]);
  const [auditFeed, setAuditFeed] = useState([
    { id: "audit-init-1", tx: "TX_8291A" },
    { id: "audit-init-2", tx: "TX_8292B" },
  ]);
  const [activeRegion, setActiveRegion] = useState("DPDPA");

  const calcRate = useCallback((analytics, marketing) => {
    let base = 60.0;
    if (analytics) base += 21.4;
    if (marketing) base += 12.8;
    return Math.round(base * 10) / 10;
  }, []);

  const addLogStreamEvent = useCallback((type, regulation, ip, state = "success") => {
    logIdCounter += 1;
    const newRow = { id: `log-${logIdCounter}`, type, regulation, ip, time: "Just Now", state };
    setComplianceLogs((prev) => [newRow, ...prev].slice(0, 3));

    const txId = `TX_${Math.floor(1000 + Math.random() * 9000)}${String.fromCharCode(
      65 + Math.floor(Math.random() * 26)
    )}`;
    setAuditFeed((prev) => [{ id: `audit-${logIdCounter}`, tx: txId }, ...prev].slice(0, 2));
  }, []);

  const handleAnalyticsToggle = () => {
    const next = !analyticsChecked;
    setAnalyticsChecked(next);
    setOptInRate(calcRate(next, marketingChecked));
    addLogStreamEvent(next ? "Preference Enabled" : "Preference Disabled", "Analytics", "Local Node", next ? "success" : "warning");
  };

  const handleMarketingToggle = () => {
    const next = !marketingChecked;
    setMarketingChecked(next);
    setOptInRate(calcRate(analyticsChecked, next));
    addLogStreamEvent(next ? "Preference Enabled" : "Preference Disabled", "Marketing", "Local Node", next ? "success" : "warning");
  };

  const handleCookieAcceptAll = () => {
    setCookieChoice("accept");
    setAnalyticsChecked(true);
    setMarketingChecked(true);
    setOptInRate(calcRate(true, true));
    addLogStreamEvent("Consent Approved (Full)", "DPDPA", "127.0.0.1", "success");
  };

  const handleCookieRejectAll = () => {
    setCookieChoice("reject");
    setAnalyticsChecked(false);
    setMarketingChecked(false);
    setOptInRate(calcRate(false, false));
    addLogStreamEvent("Consent Rejected (All)", "DPDPA", "127.0.0.1", "warning");
  };

  // Simulated live requests every 6s
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIp = IP_LIST[Math.floor(Math.random() * IP_LIST.length)];
      const randomRegion = REGIONS[Math.floor(Math.random() * REGIONS.length)];
      const randomAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      const state = randomAction.includes("Rejected") ? "warning" : "success";
      addLogStreamEvent(randomAction, randomRegion, randomIp, state);
    }, 6000);
    return () => clearInterval(interval);
  }, [addLogStreamEvent]);

  const handleRegionBadgeClick = (region) => {
    setActiveRegion(region);
    addLogStreamEvent("Filtered Stream", region, "Admin Control", "success");
  };

  const handleHeroNodeEnter = (conn) => {
    setHoveredHeroNode(conn.lineId);
    setHighlightedDbSection(conn.to);
    setActiveView(`${conn.target} View`);
    setActiveViewHighlighted(true);
  };

  const handleHeroNodeLeave = () => {
    setHoveredHeroNode(null);
    setHighlightedDbSection(null);
    setActiveView("Overview Dashboard");
    setActiveViewHighlighted(false);
  };

  /* ---------------- Architecture ecosystem mapping ---------------- */
  const archCenterRef = useRef(null);
  const archSvgRef = useRef(null);
  const archNodeRefs = useRef({});
  const [archPaths, setArchPaths] = useState({});
  const [activeArchFlow, setActiveArchFlow] = useState(null);

  const drawArchiLines = useCallback(() => {
    if (window.innerWidth <= 768) return;
    const svgEl = archSvgRef.current;
    const centerEl = archCenterRef.current;
    if (!svgEl || !centerEl) return;

    const svgRect = svgEl.getBoundingClientRect();
    const centerRect = centerEl.getBoundingClientRect();
    const cx = centerRect.left + centerRect.width / 2 - svgRect.left;
    const cy = centerRect.top + centerRect.height / 2 - svgRect.top;

    const paths = {};
    Object.keys(ARCHI_DETAILS).forEach((flowName) => {
      const node = archNodeRefs.current[flowName];
      if (node) {
        const nodeRect = node.getBoundingClientRect();
        const nx = nodeRect.left + nodeRect.width / 2 - svgRect.left;
        const ny = nodeRect.top + nodeRect.height / 2 - svgRect.top;
        const dx = nx - cx;
        const dy = ny - cy;
        const controlX = cx + dx * 0.5;
        const controlY = cy + dy * 0.1;
        paths[flowName] = `M ${cx} ${cy} Q ${controlX} ${controlY} ${nx} ${ny}`;
      }
    });
    setArchPaths(paths);
  }, []);

  useEffect(() => {
    const t = setTimeout(drawArchiLines, 200);
    window.addEventListener("resize", drawArchiLines);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", drawArchiLines);
    };
  }, [drawArchiLines]);

  const [archPanel, setArchPanel] = useState({
    title: "Ecosystem Mapping",
    desc: "Hover over any node in the architecture map to visualize how consent data flows through iCMP securely and in real-time.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18" />
        <path d="M15 3v18" />
      </svg>
    ),
  });

  const handleArchNodeEnter = (flowName) => {
    setActiveArchFlow(flowName);
    const detail = ARCHI_DETAILS[flowName];
    if (detail) {
      setArchPanel({ title: detail.title, desc: detail.desc, icon: detail.icon });
    }
  };

  /* ---------------- FAQ accordions ---------------- */
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [faqMaxHeight, setFaqMaxHeight] = useState(null);
  const faqContentRefs = useRef({});

  const handleFaqClick = (index) => {
    setActiveFaqIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    if (activeFaqIndex !== null) {
      const el = faqContentRefs.current[activeFaqIndex];
      if (el) setFaqMaxHeight(el.scrollHeight);
    } else {
      setFaqMaxHeight(null);
    }
  }, [activeFaqIndex]);

  /* ---------------- Demo modal & toast ---------------- */
  const [modalOpen, setModalOpen] = useState(false);
  const [toastActive, setToastActive] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    size: "1-50",
  });

  const openModal = () => {
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = "";
  };

  const handleModalOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    closeModal();
    setToastActive(true);
    setTimeout(() => setToastActive(false), 4000);
    setFormData({ name: "", email: "", company: "", size: "1-50" });
  };

  /* ============================================================
     Render
     ============================================================ */
=======
/* ---------- NAV ---------- */
function Nav(){
>>>>>>> 7a314aec0b17b3ba2fd5c936a6d010f2b375fe12
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="logo"><span className="logo-mark"></span>iCMP</div>
        <nav className="nav-links">
          <a href="#dashboard">Platform</a>
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
        </nav>
        <a href="#contact" className="nav-cta">Request a demo</a>
      </div>
    </header>
  );
}

<<<<<<< HEAD
      {/* HEADER */}
      <header className={`header${scrolled ? " scrolled" : ""}`} id="header">
        <div className="container header-container flex justify-between items-center">
          <a href="#" className="logo-link">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#111111" />
              <circle cx="16" cy="16" r="8" stroke="#44BCF3" strokeWidth="3" strokeLinecap="round" strokeDasharray="20 10" />
              <circle cx="16" cy="16" r="2" fill="#44BCF3" />
            </svg>
            <span className="logo-text">
              i<span className="logo-accent">CMP</span>
            </span>
          </a>
          <button className="mobile-menu-btn md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
          <nav className={`nav${mobileMenuOpen ? " open" : ""}`}>
            <a href="#features" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#architecture" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Architecture</a>
            <a href="#pricing" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <a href="#faq" className="nav-link" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <Button className="btn btn-outline btn-demo-trigger rounded-full w-full md:w-auto" onClick={() => { openModal(); setMobileMenuOpen(false); }}>Book a Demo</Button>
            <Button asChild className="btn btn-accent btn-demo-trigger text-center flex items-center justify-center rounded-full w-full md:w-auto" style={{ textDecoration: 'none' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero dotted-bg">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-headline">
              Privacy Compliance,<br />
              <span>Simplified.</span>
            </h1>
            <p className="hero-subheadline">
              Automate consent management, meet global regulations, and build trust with every user interaction.
            </p>
            <button className="btn btn-accent btn-large btn-demo-trigger" onClick={openModal}>Book a Demo</button>
          </div>

          {/* Hero Interactive Canvas */}
          <div className="hero-canvas">
            {/* Connection Lines SVGs */}
            <svg className="canvas-lines" id="hero-lines" ref={heroLinesRef}>
              {HERO_CONNECTIONS.map((conn) => {
                const coords = heroLineCoords[conn.lineId] || { x1: 0, y1: 0, x2: 0, y2: 0 };
                const isActive = hoveredHeroNode === conn.lineId;
                return (
                  <line
                    key={conn.lineId}
                    id={conn.lineId}
                    className={`connector-line${isActive ? " active" : ""}`}
                    x1={coords.x1}
                    y1={coords.y1}
                    x2={coords.x2}
                    y2={coords.y2}
                  />
                );
              })}
            </svg>

            {/* 1. Cookie Consent Banner Card */}
            <div
              className="floating-card fc-cookie"
              id="node-cookie"
              onMouseEnter={() => handleHeroNodeEnter({ lineId: "line-cookie", to: "db-section-Overview", target: "Overview" })}
              onMouseLeave={handleHeroNodeLeave}
            >
              <span className="node-dot dot-br"></span>
              <div className="fc-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a10 10 0 1 0 10 10V4a2 2 0 0 0-2-2Z" />
                  <path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                  <path d="M8 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                  <path d="M16 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                </svg>
                Cookie Consent
              </div>
              <div className="cookie-mini-banner">
                <div className="cookie-mini-text">We value your privacy. Select your settings below.</div>
                <div className="cookie-mini-buttons">
                  <button
                    className={`cookie-mini-btn${cookieChoice === "accept" ? " active" : ""}`}
                    id="cookie-accept-all"
                    onClick={handleCookieAcceptAll}
                  >
                    Accept All
                  </button>
                  <button
                    className={`cookie-mini-btn${cookieChoice === "reject" ? " active" : ""}`}
                    id="cookie-reject-all"
                    onClick={handleCookieRejectAll}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>

            {/* 2. User Preferences */}
            <div
              className="floating-card fc-pref"
              id="node-pref"
              onMouseEnter={() => handleHeroNodeEnter({ lineId: "line-pref", to: "db-section-Analytics", target: "Analytics" })}
              onMouseLeave={handleHeroNodeLeave}
            >
              <span className="node-dot dot-r"></span>
              <div className="fc-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v8" />
                  <path d="M8 12h8" />
                </svg>
                User Preferences
              </div>
              <div className="pref-row">
                <span className="pref-name">Strictly Necessary</span>
                <label className="pref-switch">
                  <input type="checkbox" checked disabled readOnly />
                  <span className="pref-slider"></span>
                </label>
              </div>
              <div className="pref-row">
                <span className="pref-name">Performance &amp; Analytics</span>
                <label className="pref-switch">
                  <input
                    type="checkbox"
                    id="pref-analytics-toggle"
                    checked={analyticsChecked}
                    onChange={handleAnalyticsToggle}
                  />
                  <span className="pref-slider"></span>
                </label>
              </div>
              <div className="pref-row">
                <span className="pref-name">Marketing &amp; Target</span>
                <label className="pref-switch">
                  <input
                    type="checkbox"
                    id="pref-marketing-toggle"
                    checked={marketingChecked}
                    onChange={handleMarketingToggle}
                  />
                  <span className="pref-slider"></span>
                </label>
              </div>
            </div>

            {/* 3. Audit Logs */}
            <div
              className="floating-card fc-audit"
              id="node-audit"
              onMouseEnter={() => handleHeroNodeEnter({ lineId: "line-audit", to: "db-section-Logs", target: "Logs" })}
              onMouseLeave={handleHeroNodeLeave}
            >
              <span className="node-dot dot-tr"></span>
              <div className="fc-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M12 6v6l4 2" />
                </svg>
                Audit Logs
              </div>
              <div className="audit-mini-list" id="audit-mini-feed">
                {auditFeed.map((item) => (
                  <div className="audit-mini-item" key={item.id}>
                    <span>{item.tx}</span>
                    <span className="audit-mini-status">VERIFIED</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. DPDPA Compliance */}
            <div
              className="floating-card fc-global"
              id="node-global"
              onMouseEnter={() => handleHeroNodeEnter({ lineId: "line-global", to: "db-section-Monitoring", target: "Monitoring" })}
              onMouseLeave={handleHeroNodeLeave}
            >
              <span className="node-dot dot-bl"></span>
              <div className="fc-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                DPDPA Compliance
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div
                  className="global-badge-item active"
                  data-region="DPDPA"
                  onClick={() => handleRegionBadgeClick("DPDPA")}
                  style={{
                    padding: "8px",
                    fontSize: "0.75rem",
                    textAlign: "center",
                    fontWeight: 700,
                    borderRadius: "6px",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  DPDPA (India) Active
                </div>
                <div
                  style={{
                    fontSize: "0.625rem",
                    color: "var(--text-secondary)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    border: "1px solid var(--border-color)",
                    padding: "8px",
                    borderRadius: "var(--radius-sm)",
                    background: "#fafafa",
                    pointerEvents: "none",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Itemized Notice</span>
                    <span style={{ color: "#27c93f", fontWeight: "bold" }}>&#9679; READY</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Consent Manager</span>
                    <span style={{ color: "#27c93f", fontWeight: "bold" }}>&#9679; ENABLED</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Bilingual Notice</span>
                    <span style={{ color: "#27c93f", fontWeight: "bold" }}>&#9679; ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Analytics Card */}
            <div
              className="floating-card fc-analytics"
              id="node-analytics"
              onMouseEnter={() => handleHeroNodeEnter({ lineId: "line-analytics", to: "db-section-Analytics", target: "Analytics" })}
              onMouseLeave={handleHeroNodeLeave}
            >
              <span className="node-dot dot-l"></span>
              <div className="fc-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18" />
                  <path d="m19 9-5 5-4-4-3 3" />
                </svg>
                Consent Analytics
              </div>
              <div className="analytics-mini-chart">
                <svg viewBox="0 0 200 60" width="100%" height="100%">
                  <path d="M 0,50 Q 40,20 80,45 T 160,15 T 200,10" fill="none" stroke="#44BCF3" strokeWidth="2" />
                  <path d="M 0,50 Q 40,20 80,45 T 160,15 T 200,10 L 200,60 L 0,60 Z" fill="rgba(68, 188, 243, 0.05)" />
                  <line x1="0" y1="55" x2="200" y2="55" stroke="#EAEAEA" strokeDasharray="2 2" />
                </svg>
              </div>
            </div>

            {/* 6. Legal Compliance & Storage */}
            <div
              className="floating-card fc-legal"
              id="node-legal"
              onMouseEnter={() => handleHeroNodeEnter({ lineId: "line-legal", to: "db-section-Overview", target: "Overview" })}
              onMouseLeave={handleHeroNodeLeave}
            >
              <span className="node-dot dot-tl"></span>
              <div className="fc-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Data Protection
              </div>
              <div className="legal-list">
                <div className="legal-item"><span className="legal-dot"></span>SHA-256 Encrypted</div>
                <div className="legal-item"><span className="legal-dot"></span>Zero-Knowledge Proofs</div>
              </div>
            </div>

            {/* HERO DASHBOARD (Visual Centerpiece) */}
            <div className="dashboard-container" id="hero-dashboard">
              <div className="db-header">
                <div className="db-title-group">
                  <div className="db-dots">
                    <div className="db-dot"></div>
                    <div className="db-dot"></div>
                    <div className="db-dot"></div>
                  </div>
                  <span className="db-title-text">iCMP Cloud Platform v2.4</span>
                </div>
                <div
                  className="db-badge"
                  id="db-active-view"
                  style={activeViewHighlighted ? { background: "rgba(68, 188, 243, 0.15)" } : undefined}
                >
                  {activeView}
                </div>
              </div>
              <div className="db-content">
                {/* 1. Consent Overview Card */}
                <div
                  className="db-card"
                  id="db-section-Overview"
                  style={
                    highlightedDbSection === "db-section-Overview"
                      ? { borderColor: "#44BCF3", boxShadow: "0 0 16px rgba(68, 188, 243, 0.15)" }
                      : undefined
                  }
                >
                  <div className="db-card-header">
                    <span className="db-card-title">Total Active Websites</span>
                    <span className="db-trend">Live</span>
                  </div>
                  <div className="db-stat">248</div>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    Enterprise domain nodes mapping telemetry data.
                  </p>
                </div>

                {/* 2. Acceptance Rates Card */}
                <div
                  className="db-card"
                  id="db-section-Analytics"
                  style={
                    highlightedDbSection === "db-section-Analytics"
                      ? { borderColor: "#44BCF3", boxShadow: "0 0 16px rgba(68, 188, 243, 0.15)" }
                      : undefined
                  }
                >
                  <div className="db-card-header">
                    <span className="db-card-title">Opt-In Consent Rate</span>
                    <span className="db-trend">&#9650; 4.8%</span>
                  </div>
                  <div className="db-stat" id="db-optin-rate">{optInRate.toFixed(1)}%</div>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    Performance metrics based on user preference selections.
                  </p>
                </div>

                {/* 3. Compliance Monitoring */}
                <div
                  className="db-card db-full-width"
                  id="db-section-Monitoring"
                  style={
                    highlightedDbSection === "db-section-Monitoring"
                      ? { borderColor: "#44BCF3", boxShadow: "0 0 16px rgba(68, 188, 243, 0.15)" }
                      : undefined
                  }
                >
                  <div className="db-card-header">
                    <span className="db-card-title">Real-time Compliance Stream</span>
                    <span className="db-badge">Active Filters: {activeRegion}</span>
                  </div>
                  <div className="compliance-log" id="compliance-log-list">
                    {complianceLogs.map((log) => (
                      <div className="log-row" key={log.id}>
                        <div className="log-left">
                          <span className={`log-indicator${log.state === "warning" ? " warning" : ""}`}></span>
                          <span>{log.type} ({log.regulation})</span>
                        </div>
                        <span className="log-ip">{log.ip}</span>
                        <span className="log-time">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Audit Log Hash Chains */}
                <div
                  className="db-card db-full-width"
                  id="db-section-Logs"
                  style={
                    highlightedDbSection === "db-section-Logs"
                      ? { borderColor: "#44BCF3", boxShadow: "0 0 16px rgba(68, 188, 243, 0.15)" }
                      : undefined
                  }
                >
                  <div className="db-card-header">
                    <span className="db-card-title">Immutable Block Hash Ledger</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "monospace" }}>
                      SHA-256 Chain Verified
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "0.6875rem",
                      background: "#fafafa",
                      border: "1px solid var(--border-color)",
                      borderRadius: "6px",
                      padding: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--accent-color)" }}>[CHAIN-NODE-182]</span>{" "}
                      <span style={{ color: "#666" }}>d29837f48b...</span>{" "}
                      <span style={{ color: "#27c93f" }}>&#9679; SECURED</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--accent-color)" }}>[CHAIN-NODE-181]</span>{" "}
                      <span style={{ color: "#666" }}>f489aa21b1...</span>{" "}
                      <span style={{ color: "#27c93f" }}>&#9679; SECURED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need to Manage Consent at Scale</h2>
            <p>Enterprise-grade tools for collecting, validating, governing, and auditing user consent across global privacy regulations.</p>
          </div>

          <div className="features-grid">
            {/* Feature 1: Consent Lifecycle Management */}
            <div className="feature-card">
              <div className="feature-illustration-container dotted-bg">
                <svg width="200" height="120" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(10, 20)">
                    <circle cx="15" cy="40" r="10" fill="#fff" stroke="#eaeaea" strokeWidth="2" className="lc-node lc-node-1" />
                    <circle cx="55" cy="40" r="10" fill="#fff" stroke="#eaeaea" strokeWidth="2" className="lc-node lc-node-2" />
                    <circle cx="95" cy="40" r="10" fill="#fff" stroke="#eaeaea" strokeWidth="2" className="lc-node lc-node-3" />
                    <circle cx="135" cy="40" r="10" fill="#fff" stroke="#eaeaea" strokeWidth="2" className="lc-node lc-node-4" />
                    <circle cx="175" cy="40" r="10" fill="#fff" stroke="#eaeaea" strokeWidth="2" className="lc-node lc-node-5" />
                    <line x1="25" y1="40" x2="45" y2="40" stroke="#eaeaea" strokeWidth="2" strokeDasharray="3 3" />
                    <line x1="65" y1="40" x2="85" y2="40" stroke="#eaeaea" strokeWidth="2" strokeDasharray="3 3" />
                    <line x1="105" y1="40" x2="125" y2="40" stroke="#eaeaea" strokeWidth="2" strokeDasharray="3 3" />
                    <line x1="145" y1="40" x2="165" y2="40" stroke="#eaeaea" strokeWidth="2" strokeDasharray="3 3" />
                    <text x="15" y="65" fontFamily="Inter" fontSize="8" fontWeight="600" textAnchor="middle" fill="#111">Collect</text>
                    <text x="55" y="65" fontFamily="Inter" fontSize="8" fontWeight="500" textAnchor="middle" fill="#666">Validate</text>
                    <text x="95" y="65" fontFamily="Inter" fontSize="8" fontWeight="500" textAnchor="middle" fill="#666">Govern</text>
                    <text x="135" y="65" fontFamily="Inter" fontSize="8" fontWeight="500" textAnchor="middle" fill="#666">Audit</text>
                    <text x="175" y="65" fontFamily="Inter" fontSize="8" fontWeight="500" textAnchor="middle" fill="#666">Renew</text>
                  </g>
                </svg>
              </div>
              <h3>Consent Lifecycle</h3>
              <p>Collect, validate, renew, and audit consent through custom rulesets.</p>
            </div>

            {/* Feature 2: Cookie Consent Management */}
            <div className="feature-card">
              <div className="feature-illustration-container dotted-bg">
                <div className="cookie-card-ui">
                  <div style={{ fontSize: "0.625rem", fontWeight: 700, marginBottom: "4px" }}>Cookie Preferences</div>
                  <div style={{ fontSize: "0.5rem", color: "#666", marginBottom: "8px" }}>
                    We use essential and analytics cookies to optimize performance.
                  </div>
                  <div className="cookie-card-ui-actions">
                    <div className="cookie-card-ui-btn primary cc-btn-accept">Accept</div>
                    <div className="cookie-card-ui-btn cc-btn-reject">Reject</div>
                    <div className="cookie-card-ui-btn cc-btn-custom">Custom</div>
                  </div>
                </div>
              </div>
              <h3>Cookie Consent</h3>
              <p>Custom cookie banners tailored to your website's compliance requirements.</p>
            </div>

            {/* Feature 3: Consent Validation API */}
            <div className="feature-card">
              <div className="feature-illustration-container dotted-bg">
                <div className="api-console">
                  <div className="line"><span className="blue">POST</span> <span className="white">/v1/consent/validate</span></div>
                  <div className="line" style={{ color: "#888" }}>{`{ "user_id": "usr_9281a" }`}</div>
                  <div className="line"><span style={{ color: "#666" }}>&gt;&gt;</span> <span className="white">HTTP/1.1 200 OK</span></div>
                  <div className="line" style={{ color: "#888" }}>{`{ "valid": `}<span className="blue">true</span>{` }`}</div>
                </div>
              </div>
              <h3>Consent Validation API</h3>
              <p>Instantly confirm consent token validation states prior to loading script layers.</p>
            </div>

            {/* Feature 4: User Consent Dashboard */}
            <div className="feature-card">
              <div className="feature-illustration-container dotted-bg">
                <div className="db-mini">
                  <div className="db-mini-card">
                    <span style={{ fontSize: "0.5rem", color: "#666" }}>Compliance</span>
                    <span style={{ fontSize: "1rem", fontWeight: 700, color: "#44BCF3" }}>98.4%</span>
                  </div>
                  <div className="db-mini-card">
                    <span style={{ fontSize: "0.5rem", color: "#666" }}>DSAR SLA</span>
                    <span style={{ fontSize: "1rem", fontWeight: 700, color: "#111" }}>100%</span>
                  </div>
                  <div className="db-mini-card" style={{ gridColumn: "span 2" }}>
                    <svg viewBox="0 0 100 20" width="100%" height="20">
                      <path d="M0,15 L20,8 L40,12 L60,3 L80,10 L100,5" fill="none" stroke="#44BCF3" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3>Consent Dashboards</h3>
              <p>Full executive visual analytics suite measuring acceptance, rates, and scores.</p>
            </div>

            {/* Feature 5: Grievance & DSAR Management */}
            <div className="feature-card">
              <div className="feature-illustration-container dotted-bg">
                <div className="dsar-card-stack">
                  <div className="dsar-card-item">
                    <span>Access Request</span>
                    <span style={{ fontSize: "0.5625rem", background: "rgba(68,188,243,0.1)", color: "var(--accent-color)", padding: "2px 6px", borderRadius: "4px" }}>
                      In Progress
                    </span>
                  </div>
                  <div className="dsar-card-item">
                    <span>Deletion Request</span>
                    <span style={{ fontSize: "0.5625rem", background: "#fafafa", border: "1px solid var(--border-color)", color: "#666", padding: "2px 6px", borderRadius: "4px" }}>
                      Completed
                    </span>
                  </div>
                </div>
              </div>
              <h3>Grievances &amp; DSAR</h3>
              <p>Fulfill access, rectification, portability, and deletion requests instantly.</p>
            </div>

            {/* Feature 6: Immutable Audit Logs */}
            <div className="feature-card">
              <div className="feature-illustration-container dotted-bg">
                <div className="log-chain">
                  <div className="log-chain-node">H1</div>
                  <div className="log-chain-link"></div>
                  <div className="log-chain-node" style={{ borderColor: "var(--accent-color)", color: "var(--accent-color)" }}>H2</div>
                  <div className="log-chain-link"></div>
                  <div className="log-chain-node">H3</div>
                </div>
              </div>
              <h3>Immutable Audit Logs</h3>
              <p>Cryptographically linked hashes securing records against data tampering.</p>
            </div>

            {/* Feature 7: Role-Based Access Control */}
            <div className="feature-card">
              <div className="feature-illustration-container dotted-bg">
                <div className="role-hierarchy">
                  <div className="role-node admin"><span>Super Admin</span><span style={{ color: "#27c93f" }}>Full</span></div>
                  <div className="role-node admin"><span>Organisation Admin</span><span style={{ color: "#27c93f" }}>Full</span></div>
                  <div className="role-node"><span>Privacy Officer</span><span style={{ color: "var(--accent-color)" }}>Security</span></div>
                  <div className="role-node"><span>Auditor</span><span style={{ color: "#666" }}>View</span></div>
                </div>
              </div>
              <h3>RBAC</h3>
              <p>Assign granular workspace roles (Privacy Officer, Auditor, Editor, Viewer).</p>
            </div>

            {/* Feature 8: User Rights Management */}
            <div className="feature-card">
              <div className="feature-illustration-container dotted-bg">
                <div className="rights-matrix">
                  <div className="right-box" style={{ borderColor: "var(--accent-color)", color: "var(--accent-color)" }}>Erasure</div>
                  <div className="right-box">Portability</div>
                  <div className="right-box">Access</div>
                  <div className="right-box">Restrict</div>
                </div>
              </div>
              <h3>User Rights Management</h3>
              <p>Manage regional compliance triggers dynamically across active user bases.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (Connected Consent Architecture Ecosystem) */}
      <section className="section archi-section dotted-bg" id="architecture">
        <div className="container">
          <div className="section-header">
            <h2>Enterprise-Grade Consent Architecture</h2>
            <p>Built for scalability, security, and global compliance. Interact with components to view data flows.</p>
          </div>

          <div className="archi-layout">
            {/* Node Canvas */}
            <div className="archi-canvas-container">
              {/* Connection SVG */}
              <svg
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
                id="archi-svg"
                ref={archSvgRef}
              >
                {Object.keys(ARCHI_DETAILS).map((flowName) => (
                  <path
                    key={flowName}
                    id={`path-${flowName}`}
                    className={`connector-line${activeArchFlow === flowName ? " active" : ""}`}
                    d={archPaths[flowName] || ""}
                  />
                ))}
              </svg>

              {/* Core Node & Floating Component Nodes */}
              <div className="archi-cards-grid">
                {/* Central Node */}
                <div
                  className="archi-node archi-node-center"
                  id="arch-center"
                  ref={archCenterRef}
                  style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "150px", textAlign: "center" }}
                >
                  <span className="node-dot dot-t"></span>
                  <span className="node-dot dot-b"></span>
                  <span className="node-dot dot-l"></span>
                  <span className="node-dot dot-r"></span>
                  Website / App
                </div>

                {/* Surrounding Nodes */}
                <div
                  className={`archi-node${activeArchFlow === "banner" ? " active" : ""}`}
                  id="arch-banner"
                  data-flow="banner"
                  ref={(el) => (archNodeRefs.current.banner = el)}
                  onMouseEnter={() => handleArchNodeEnter("banner")}
                  style={{ top: "15%", left: "15%" }}
                >
                  <span className="node-dot dot-br"></span>Cookie Banner
                </div>
                <div
                  className={`archi-node${activeArchFlow === "db" ? " active" : ""}`}
                  id="arch-db"
                  data-flow="db"
                  ref={(el) => (archNodeRefs.current.db = el)}
                  onMouseEnter={() => handleArchNodeEnter("db")}
                  style={{ top: "15%", left: "60%" }}
                >
                  <span className="node-dot dot-b"></span>User Consent
                </div>
                <div
                  className={`archi-node${activeArchFlow === "pref" ? " active" : ""}`}
                  id="arch-pref"
                  data-flow="pref"
                  ref={(el) => (archNodeRefs.current.pref = el)}
                  onMouseEnter={() => handleArchNodeEnter("pref")}
                  style={{ top: "40%", left: "10%" }}
                >
                  <span className="node-dot dot-r"></span>Consent Preferences
                </div>
                <div
                  className={`archi-node${activeArchFlow === "audit" ? " active" : ""}`}
                  id="arch-audit"
                  data-flow="audit"
                  ref={(el) => (archNodeRefs.current.audit = el)}
                  onMouseEnter={() => handleArchNodeEnter("audit")}
                  style={{ top: "40%", left: "70%" }}
                >
                  <span className="node-dot dot-l"></span>Consent History
                </div>
                <div
                  className={`archi-node${activeArchFlow === "logs" ? " active" : ""}`}
                  id="arch-logs"
                  data-flow="logs"
                  ref={(el) => (archNodeRefs.current.logs = el)}
                  onMouseEnter={() => handleArchNodeEnter("logs")}
                  style={{ top: "65%", left: "15%" }}
                >
                  <span className="node-dot dot-tr"></span>Cryptographic Logs
                </div>
                <div
                  className={`archi-node${activeArchFlow === "rights" ? " active" : ""}`}
                  id="arch-rights"
                  data-flow="rights"
                  ref={(el) => (archNodeRefs.current.rights = el)}
                  onMouseEnter={() => handleArchNodeEnter("rights")}
                  style={{ top: "65%", left: "60%" }}
                >
                  <span className="node-dot dot-tl"></span>User Rights
                </div>
                <div
                  className={`archi-node${activeArchFlow === "dsar" ? " active" : ""}`}
                  id="arch-dsar"
                  data-flow="dsar"
                  ref={(el) => (archNodeRefs.current.dsar = el)}
                  onMouseEnter={() => handleArchNodeEnter("dsar")}
                  style={{ top: "80%", left: "35%" }}
                >
                  <span className="node-dot dot-t"></span>DSAR Portal
                </div>
                <div
                  className={`archi-node${activeArchFlow === "reports" ? " active" : ""}`}
                  id="arch-reports"
                  data-flow="reports"
                  ref={(el) => (archNodeRefs.current.reports = el)}
                  onMouseEnter={() => handleArchNodeEnter("reports")}
                  style={{ top: "25%", right: "5%" }}
                >
                  <span className="node-dot dot-bl"></span>Compliance Reports
                </div>
              </div>
            </div>

            {/* Details Sidebar Panel */}
            <div className="archi-detail-panel">
              <div className="archi-detail-icon" id="archi-panel-icon">
                {archPanel.icon}
              </div>
              <h3 className="archi-detail-title" id="archi-panel-title">{archPanel.title}</h3>
              <p className="archi-detail-desc" id="archi-panel-desc">{archPanel.desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="section" id="faq">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Find answers to common questions regarding integration, features, security, and global regulations.</p>
          </div>

          <div className="faq-grid">
            {FAQ_ITEMS.map((item, index) => {
              const isActive = activeFaqIndex === index;
              return (
                <div className={`faq-item${isActive ? " active" : ""}`} key={index}>
                  <div className="faq-header" onClick={() => handleFaqClick(index)}>
                    <span className="faq-question">{item.q}</span>
                    <span className="faq-toggle-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </div>
                  <div
                    className="faq-content"
                    ref={(el) => (faqContentRefs.current[index] = el)}
                    style={{ maxHeight: isActive && faqMaxHeight ? `${faqMaxHeight}px` : "0px" }}
                  >
                    <div className="faq-answer">{item.a}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section dotted-bg">
        <div className="container cta-grid">
          <div>
            <h2 style={{ fontSize: "3rem", lineHeight: 1.1, marginBottom: "24px", letterSpacing: "-0.03em" }}>
              Turn Privacy Compliance Into a Competitive Advantage
            </h2>
            <p style={{ fontSize: "1.125rem", lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: "40px" }}>
              Join organizations using iCMP to simplify compliance, manage consent, and build customer trust.
            </p>
            <button className="btn btn-accent btn-large btn-demo-trigger" onClick={openModal}>Book a Demo</button>
          </div>

          {/* Relationship visual layout with low opacity */}
          <div className="cta-visual-container">
            <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.3 }}>
              <line x1="60" y1="240" x2="240" y2="80" stroke="#44BCF3" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="60" y1="240" x2="240" y2="180" stroke="#44BCF3" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="60" y1="240" x2="240" y2="280" stroke="#44BCF3" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="60" y1="240" x2="240" y2="380" stroke="#44BCF3" strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>

            <div
              style={{
                position: "absolute",
                left: "20px",
                top: "215px",
                padding: "12px 18px",
                background: "#fff",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.8125rem",
                fontWeight: 700,
                boxShadow: "var(--shadow-sm)",
                zIndex: 2,
              }}
            >
              Consent Records
            </div>

            <div
              style={{
                position: "absolute",
                left: "240px",
                top: "60px",
                padding: "12px 18px",
                background: "#fff",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "#666",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              Audit Logs
            </div>
            <div
              style={{
                position: "absolute",
                left: "240px",
                top: "160px",
                padding: "12px 18px",
                background: "#fff",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "#666",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              User Rights
            </div>
            <div
              style={{
                position: "absolute",
                left: "240px",
                top: "260px",
                padding: "12px 18px",
                background: "#fff",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "#666",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              Compliance Reports
            </div>
            <div
              style={{
                position: "absolute",
                left: "240px",
                top: "360px",
                padding: "12px 18px",
                background: "#fff",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "#666",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              Analytics
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-info">
              <a href="#" className="logo-link">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="8" fill="#111111" />
                  <circle cx="16" cy="16" r="8" stroke="#44BCF3" strokeWidth="3" strokeLinecap="round" strokeDasharray="20 10" />
                  <circle cx="16" cy="16" r="2" fill="#44BCF3" />
                </svg>
                <span className="logo-text">i<span className="logo-accent">CMP</span></span>
              </a>
              <p className="footer-tagline">Automating global user consent management and privacy protection at enterprise scale.</p>
              <div className="footer-badges">
                <span className="footer-badge">GDPR Ready</span>
                <span className="footer-badge">Enterprise Secure</span>
                <span className="footer-badge">API First</span>
                <span className="footer-badge">Audit Ready</span>
              </div>
            </div>

            <div className="footer-col">
              <h4>Product</h4>
              <ul className="footer-links">
                <li><a href="#features" className="footer-link">Features</a></li>
                <li><a href="#pricing" className="footer-link">Pricing</a></li>
                <li><a href="#" className="footer-link">Integrations</a></li>
                <li><a href="#" className="footer-link">API Documentation</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Solutions</h4>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">Enterprise</a></li>
                <li><a href="#" className="footer-link">SaaS Platforms</a></li>
                <li><a href="#" className="footer-link">Healthcare Compliance</a></li>
                <li><a href="#" className="footer-link">Financial Services</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Resources</h4>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">Documentation</a></li>
                <li><a href="#" className="footer-link">Compliance Guide</a></li>
                <li><a href="#" className="footer-link">Privacy Blog</a></li>
                <li><a href="#" className="footer-link">Support Hub</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">About Us</a></li>
                <li><a href="#" className="footer-link">Careers</a></li>
                <li><a href="#" className="footer-link">Trust Center</a></li>
                <li><a href="#" className="footer-link">Contact Sales</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span className="footer-copyright">&copy; 2026 iCMP Inc. All rights reserved.</span>
            <div style={{ display: "flex", gap: "24px" }}>
              <a href="#" className="footer-link" style={{ fontSize: "0.8125rem" }}>Terms of Service</a>
              <a href="#" className="footer-link" style={{ fontSize: "0.8125rem" }}>Privacy Policy</a>
              <a href="#" className="footer-link" style={{ fontSize: "0.8125rem" }}>Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>

      {/* BOOK A DEMO MODAL */}
      <div className={`modal-overlay${modalOpen ? " active" : ""}`} id="demo-modal" onClick={handleModalOverlayClick}>
        <div className="modal-container">
          <button className="modal-close" id="modal-close-btn" onClick={closeModal}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <h3 className="modal-title">Book an iCMP Demo</h3>
          <p className="modal-desc">Schedule a 15-minute product overview with one of our compliance specialists.</p>

          <form id="demo-form" onSubmit={handleDemoSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="demo-name">Full Name</label>
              <input
                className="form-input"
                type="text"
                id="demo-name"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="demo-email">Work Email</label>
              <input
                className="form-input"
                type="email"
                id="demo-email"
                placeholder="john@enterprise.com"
                required
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="demo-company">Company</label>
              <input
                className="form-input"
                type="text"
                id="demo-company"
                placeholder="Acme Corp"
                required
                value={formData.company}
                onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="demo-size">Company Size</label>
              <select
                className="form-input"
                id="demo-size"
                value={formData.size}
                onChange={(e) => setFormData((p) => ({ ...p, size: e.target.value }))}
              >
                <option value="1-50">1 - 50 employees</option>
                <option value="51-500">51 - 500 employees</option>
                <option value="501-5000">501 - 5000 employees</option>
                <option value="5001+">5000+ employees (Fortune 500)</option>
              </select>
            </div>
            <button className="btn btn-accent" style={{ width: "100%", padding: "14px" }} type="submit">
              Submit Request
            </button>
          </form>
=======
/* ---------- HERO ---------- */
function Hero(){
  return (
    <section className="hero">
      <div className="container">
        <span className="eyebrow"><span className="eyebrow-dot"></span>DPDP ready</span>
        <h1>Consent, captured once.<br/>Honored <em>everywhere</em>.</h1>
        <p>CMP gives every user a single source of truth for what they've agreed to — and gives your teams one dashboard to prove it.</p>
        <div className="hero-actions">
          <a href="#contact" className="btn-primary">Request a demo</a>
          <a href="#how" className="btn-secondary">See how it works</a>
>>>>>>> 7a314aec0b17b3ba2fd5c936a6d010f2b375fe12
        </div>
      </div>
    </section>
  );
}

/* ---------- DASHBOARD SHOWCASE ---------- */
function RadarChart(){
  // axes: Accepted(top) -90°, Rejected(right) 0°, Customized(bottom) 90°, Withdrawn(left) 180°
  const cx=190, cy=140, R=88;
  const axes = [
    {label:'Accepted', angle:-90, color:'#1AA260', value:0.46},
    {label:'Rejected', angle:0, color:'#F0285C', value:0.64},
    {label:'Customized', angle:90, color:'#F5A623', value:0.44},
    {label:'Withdrawn', angle:180, color:'#6B7B92', value:0.44},
  ];
  const pt = (angleDeg, frac)=>{
    const a = angleDeg * Math.PI/180;
    return [cx + Math.cos(a)*R*frac, cy + Math.sin(a)*R*frac];
  };
  const shapePts = axes.map(ax=>pt(ax.angle, ax.value));
  const shapeD = "M " + shapePts.map(p=>p.join(',')).join(' L ') + " Z";
  const gridLevels = [0.33,0.66,1];
  const labelPos = {
    'Accepted':{x:cx, y:cy-R-16, anchor:'middle'},
    'Rejected':{x:cx+R+14, y:cy+4, anchor:'start'},
    'Customized':{x:cx, y:cy+R+24, anchor:'middle'},
    'Withdrawn':{x:cx-R-14, y:cy+4, anchor:'end'},
  };
  return (
    <svg className="radar-svg" viewBox="0 0 380 280">
      {gridLevels.map((lv,i)=>{
        const gp = axes.map(ax=>pt(ax.angle, lv));
        const gd = "M " + gp.map(p=>p.join(',')).join(' L ') + " Z";
        return <path key={i} d={gd} className="radar-grid"/>;
      })}
      {axes.map((ax,i)=>{
        const [x2,y2] = pt(ax.angle, 1);
        return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} className="radar-axis-line"/>;
      })}
      <path d={shapeD} className="radar-shape"/>
      {axes.map((ax,i)=>{
        const [x,y] = shapePts[i];
        return <circle key={i} cx={x} cy={y} className="radar-pt" fill={ax.color} stroke={ax.color} style={{color:ax.color}}/>;
      })}
      {axes.map((ax,i)=>{
        const lp = labelPos[ax.label];
        return <text key={i} x={lp.x} y={lp.y} textAnchor={lp.anchor} className="radar-axis-label" fill={ax.color}>{ax.label}</text>;
      })}
    </svg>
  );
}

function BarChart2(){
  const groups = [
    {name:'acme.com', values:[20,72,28,42]},
    {name:'beta.com', values:[22,48,58,33]},
  ];
  const colors = ['#1AA260','#F0285C','#F5A623','#6B7B92'];
  const yTicks = [80,60,40,20,0];
  const maxV = 80;
  return (
    <div className="barchart-wrap">
      <div className="barchart-grid">
        <div className="barchart-yaxis">{yTicks.map(t=><span key={t}>{t}</span>)}</div>
        <div className="barchart-plot">
          {yTicks.map((t,i)=>(
            <div key={i} className="barchart-hline" style={{bottom:(t/maxV*100)+'%'}}></div>
          ))}
          <div className="barchart-groups">
            {groups.map((g,gi)=>(
              <div className="barchart-group" key={gi}>
                {g.values.map((v,vi)=>(
                  <div key={vi} className="bar2"
                    style={{height:(v/maxV*100)+'%', background:colors[vi], transitionDelay:(gi*0.12+vi*0.07)+'s'}}>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="barchart-xlabels">
        {groups.map((g,i)=><span key={i}>{g.name}</span>)}
      </div>
      <div className="barchart-legend">
        <span className="legend-item"><span className="legend-swatch" style={{background:'#1AA260'}}></span>Accepted All</span>
        <span className="legend-item"><span className="legend-swatch" style={{background:'#F5A623'}}></span>Customized</span>
        <span className="legend-item"><span className="legend-swatch" style={{background:'#F0285C'}}></span>Rejected All</span>
        <span className="legend-item"><span className="legend-swatch" style={{background:'#6B7B92'}}></span>Withdrawn</span>
      </div>
    </div>
  );
}

function Dashboard(){
  const [ref,vis] = useReveal();

  const navGroups = [
    {label:'General', items:[
      {icon:Icon.grid, label:'Dashboard', active:true},
      {icon:Icon.globe, label:'Websites'},
      {icon:Icon.scanner, label:'Scanner'},
    ]},
    {label:'Compliance', items:[
      {icon:Icon.audit, label:'Consent Logs'},
      {icon:Icon.versions, label:'Dialog Versions'},
      {icon:Icon.warning, label:'Grievances'},
      {icon:Icon.dataRights, label:'Data Rights'},
      {icon:Icon.renewal, label:'Renewal'},
      {icon:Icon.bell, label:'Notifications'},
      {icon:Icon.approvals, label:'Approvals'},
      {icon:Icon.validation, label:'Validation Logs'},
    ]},
    {label:'Reports', items:[
      {icon:Icon.audit, label:'Audit Logs'},
      {icon:Icon.analytics, label:'Analytics'},
      {icon:Icon.retention, label:'Data Retention'},
    ]},
  ];

  const stats = [
    {label:'Total websites', value:'2', icon:Icon.globe, color:'var(--icmp-slate)', iconBg:'#EEF1F5'},
    {label:'Active websites', value:'1', icon:Icon.pulse, color:'var(--icmp-green)', iconBg:'rgba(26,162,96,0.12)'},
    {label:'Total consents', value:'120', icon:Icon.db, color:'var(--icmp-orange)', iconBg:'rgba(245,166,35,0.14)'},
    {label:'Current plan', value:'Growth', icon:Icon.planIcon, color:'var(--icmp-purple)', iconBg:'var(--icmp-purple-dim)', plan:true},
  ];

  return (
    <section className="dash-section" id="dashboard">
      <div className="container">
        <div ref={ref} className={"dash-frame" + (vis ? " visible":"")}>

          <div className="dash-topbar">
            <div className="dash-top-left">
              <div className="dash-brand">
                <span className="dash-brand-mark"><Icon.shield/></span>
                iCMP
              </div>
              <button className="dash-collapse"><Icon.collapse/></button>
              <span className="dash-top-divider"></span>
              <span className="dash-title">Dashboard</span>
            </div>
            <div className="dash-top-right">
              <button className="dash-bell"><Icon.bell/></button>
              <div className="dash-avatar-wrap">
                <span className="dash-avatar">A</span>
                <Icon.chevronDown/>
              </div>
            </div>
          </div>

          <div className="dash-body">
            <aside className="dash-sidebar">
              {navGroups.map((grp,gi)=>(
                <React.Fragment key={gi}>
                  <div className="dash-nav-group-label">{grp.label}</div>
                  {grp.items.map((it,ii)=>(
                    <div key={ii} className={"dash-nav-item"+(it.active?" active":"")}>
                      <it.icon/>{it.label}
                    </div>
                  ))}
                </React.Fragment>
              ))}
              <div className="dash-sidebar-divider"></div>
              <div className="dash-nav-group-label">Administration</div>
              <div className="dash-plan-card">
                <div className="dash-plan-label">Current plan</div>
                <div className="dash-plan-value">Growth</div>
              </div>
            </aside>

            <main className="dash-main">
              <div className="dash-welcome">
                <h2>Welcome back, Admin User</h2>
                <p>Here's your consent management overview.</p>
              </div>

              <div className="dash-stats">
                {stats.map((s,i)=>(
                  <div key={i} className="stat-card" style={{'--stat-c':s.color, '--stat-icon-bg':s.iconBg}}>
                    <div className="stat-top">
                      <span className="stat-label">{s.label}</span>
                      <span className="stat-icon"><s.icon/></span>
                    </div>
                    <span className={"stat-value"+(s.plan?" plan":"")}>{s.value}</span>
                  </div>
                ))}
              </div>

              <div className="dash-panels">
                <div className="dash-panel">
                  <div className="panel-head">
                    <h4>Consent Overview</h4>
                    <p>Distribution of consent responses across all domains</p>
                  </div>
                  <div className="radar-wrap"><RadarChart/></div>
                  <div className="panel-foot">
                    <span className="panel-foot-icon"><Icon.check/></span>
                    <div className="panel-foot-text">
                      <strong>Active consent tracking</strong>
                      <span>Showing response summary for 120 total consent logs</span>
                    </div>
                  </div>
                </div>

                <div className="dash-panel">
                  <div className="panel-head">
                    <h4>Consent by Website</h4>
                    <p>Consent response distribution per domain</p>
                  </div>
                  <BarChart2/>
                  <div className="panel-foot">
                    <span className="panel-foot-icon"><Icon.trendUp/></span>
                    <div className="panel-foot-text">
                      <strong>Trending up based on active logs</strong>
                      <span>Tracking a total of 120 responses across 2 domains</span>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- HOW IT WORKS ---------- */
function LNode({nodeRef, badge, badgeColor, title, sub, rows, stage, hovered, onEnter, onLeave}){
  const [ref,vis] = useReveal();
  const setRefs = (el)=>{ ref.current = el; if(nodeRef) nodeRef.current = el; };
  return (
    <div ref={setRefs} className={"lnode"+(vis?" visible":"")} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <span className="lnode-badge" style={{background:badgeColor.bg, color:badgeColor.fg}}>{badge}</span>
      <div className="lnode-top">
        <span className="lnode-title">{title}</span>
        <span className="lnode-chevron"><Icon.chevron/></span>
      </div>
      <div className="lnode-sub">{sub}</div>
      <div className="lnode-divider"></div>
      <div className="lnode-rows">
        {rows.map((r,i)=>(
          <div className="lnode-row" key={i}><span>{r.k}</span><span className={r.live?"status-live":""}>{r.v}</span></div>
        ))}
      </div>
      {stage}
    </div>
  );
}

function HowItWorks(){
  const nodeRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const outerRef = useRef(null);
  const [geom, setGeom] = useState({segs:[], labels:[], w:0, h:0});
  const [hoverIdx, setHoverIdx] = useState(-1);

  const recompute = ()=>{
    const outer = outerRef.current;
    if(!outer) return;
    const oRect = outer.getBoundingClientRect();
    const pts = nodeRefs.map(r=>{
      const el = r.current;
      if(!el) return null;
      const rc = el.getBoundingClientRect();
      return {
        right:{x:rc.right-oRect.left, y:rc.top-oRect.top+rc.height/2},
        left:{x:rc.left-oRect.left, y:rc.top-oRect.top+rc.height/2},
      };
    });
    const segs=[]; const labels=[];
    for(let i=0;i<pts.length-1;i++){
      const a = pts[i], b = pts[i+1];
      if(!a || !b) continue;
      const dx = Math.max(40,(b.left.x-a.right.x)/2);
      const d = `M ${a.right.x} ${a.right.y} C ${a.right.x+dx} ${a.right.y}, ${b.left.x-dx} ${b.left.y}, ${b.left.x} ${b.left.y}`;
      segs.push(d);
      labels.push({x:(a.right.x+b.left.x)/2, y:(a.right.y+b.left.y)/2});
    }
    setGeom({segs, labels, w:oRect.width, h:oRect.height});
  };

  useEffect(()=>{
    recompute();
    const ro = new ResizeObserver(()=>recompute());
    if(outerRef.current) ro.observe(outerRef.current);
    window.addEventListener('resize', recompute);
    const t = setTimeout(recompute, 350);
    return ()=>{ ro.disconnect(); window.removeEventListener('resize', recompute); clearTimeout(t); };
  },[]);

  const nodes = [
    {
      badge:"Capture", badgeColor:{bg:"rgba(45,108,223,0.14)", fg:"#2D6CDF"},
      title:"Collect Consent", sub:"consent.collect",
      rows:[
        {k:"Channels", v:"Web · App · Store"},
        {k:"Status", v:"Capturing", live:true},
      ],
      stage:(
        <div className="lnode-stage">
          <div className="lstage-chips">
            <span className="lchip">Web</span><span className="lchip">App</span><span className="lchip">Store</span>
          </div>
          <div className="lscan"></div>
        </div>
      ),
    },
    {
      badge:"Rules Engine", badgeColor:{bg:"rgba(124,58,237,0.12)", fg:"#7C3AED"},
      title:"Validate & Control", sub:"consent.validate",
      rows:[
        {k:"Engine", v:"Rule-based"},
        {k:"Status", v:"Enforcing", live:true},
      ],
      stage:(
        <div className="lnode-stage">
          <div className="lstage-toggles">
            <div className="ltg-row">DPDP Act<span className="ltg"></span></div>
            <div className="ltg-row">Data Principal rights<span className="ltg"></span></div>
          </div>
        </div>
      ),
    },
    {
      badge:"Self-serve", badgeColor:{bg:"rgba(16,163,127,0.12)", fg:"#0F9D74"},
      title:"Manage Preferences", sub:"consent.preferences",
      rows:[
        {k:"Access", v:"Preference center"},
        {k:"Status", v:"Live", live:true},
      ],
      stage:(
        <div className="lnode-stage">
          <div className="lstage-sliders">
            <div className="lsl-track"><div className="lsl-fill" style={{'--w':'78%'}}></div></div>
            <div className="lsl-track"><div className="lsl-fill" style={{'--w':'48%'}}></div></div>
          </div>
        </div>
      ),
    },
    {
      badge:"Compliance Log", badgeColor:{bg:"rgba(217,164,6,0.14)", fg:"#B8860B"},
      title:"Audit & Compliance", sub:"consent.audit",
      rows:[
        {k:"Retention", v:"7 years"},
        {k:"Status", v:"Verified", live:true},
      ],
      stage:(
        <div className="lnode-stage">
          <div className="lstage-log">
            <div className="llog-row"><span className="llog-dot"></span>consent.granted</div>
            <div className="llog-row"><span className="llog-dot"></span>consent.withdrawn</div>
          </div>
        </div>
      ),
    },
  ];
  const linkNames = ["Link 1","Link 2","Link 3"];

  return (
    <section className="section" id="how">
      <div className="container">
        <div className="sec-head">
          <span className="sec-eyebrow">The lifecycle</span>
          <h2>How CMP works</h2>
          <p>After this flow, it works like this — and like this: one continuous record from first opt-in to audit-ready proof.</p>
        </div>

        <div className="flow-outer" ref={outerRef}>
          <svg className="flow-svg" viewBox={`0 0 ${geom.w} ${geom.h}`} preserveAspectRatio="none">
            {geom.segs.map((d,i)=>(<path key={'base'+i} d={d} className="flow-seg-base"/>))}
            {geom.segs.map((d,i)=>(
              <path key={'glow'+i} d={d}
                className={"flow-seg-glow"+((hoverIdx===i || hoverIdx===i+1)?" active":"")}/>
            ))}
          </svg>

          {geom.labels.map((p,i)=>(
            <span key={i} className={"link-label"+((hoverIdx===i || hoverIdx===i+1)?" active":"")}
              style={{left:p.x+'px', top:p.y+'px'}}>{linkNames[i]}</span>
          ))}

          <div className="flow">
            {nodes.map((n,i)=>(
              <LNode key={i} {...n} nodeRef={nodeRefs[i]}
                onEnter={()=>setHoverIdx(i)} onLeave={()=>setHoverIdx(-1)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FEATURES (bento) ---------- */
function BentoCard({className, title, desc, stage}){
  const [ref,vis] = useReveal();
  return (
    <div ref={ref} className={"bcard "+className+(vis?" reveal visible":" reveal")}>
      <div className="bc-head">
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
      <div className="bc-stage">{stage}</div>
    </div>
  );
}

function Features(){
  return (
    <section className="section" id="features">
      <div className="container">
        <div className="sec-head">
          <span className="sec-eyebrow">Platform</span>
          <h2>Built for every part of the consent lifecycle</h2>
          <p>Nine capabilities working from the same record, so nothing falls out of sync.</p>
        </div>

        <div className="bento">

          {/* CARD 1 — Consent capture scanning: live document scan with checks landing */}
          <BentoCard
            className=""
            title="Consent capture scanning"
            desc="Every form, banner, and document across your stack is continuously scanned to confirm consent is actually being recorded where it should be."
            stage={
              <div className="stage-capture">
                <div className="cap-top">
                  <span className="cap-status"><span className="cap-status-dot"></span>Scanning sources</span>
                  <span className="cap-pct">3/3 verified</span>
                </div>
                <div className="cap-beam"></div>
                <div className="cap-files">
                  <div className="cap-file">
                    <Icon.doc/><span className="cap-file-name">signup.json</span>
                    <span className="cap-file-check"><Icon.check/></span>
                  </div>
                  <div className="cap-file">
                    <Icon.doc/><span className="cap-file-name">checkout.html</span>
                    <span className="cap-file-check"><Icon.check/></span>
                  </div>
                  <div className="cap-file">
                    <Icon.doc/><span className="cap-file-name">mobile_sdk.log</span>
                    <span className="cap-file-check"><Icon.check/></span>
                  </div>
                </div>
              </div>
            }
          />

          {/* CARD 2 — Real-time validation: DPDP rule categories orbiting a shield hub */}
          <BentoCard
            className=""
            title="Real-time validation"
            desc="Every request is checked against DPDP Act rules before data ever moves downstream."
            stage={
              <div className="stage-validate">
                <span className="val-orbit-ring val-ring-1"></span>
                <span className="val-orbit-ring val-ring-2"></span>
                <span className="val-pulse-ring"></span>
                <div className="val-hub"><Icon.shield/></div>
                <span className="val-node val-orbit-a">Notice</span>
                <span className="val-node val-orbit-b">Consent</span>
                <span className="val-node val-orbit-c">Erasure</span>
              </div>
            }
          />

          {/* CARD 3 — Preference center: consent-score gauge that sweeps up on hover */}
          <BentoCard
            className=""
            title="Preference center"
            desc="A single self-serve screen where people adjust exactly what they've agreed to."
            stage={
              <div className="stage-gauge">
                <div className="gauge-wrap">
                  <svg viewBox="0 0 120 68">
                    <path className="gauge-track" d="M10 62 A50 50 0 0 1 110 62"/>
                    <path className="gauge-fill" d="M10 62 A50 50 0 0 1 110 62"/>
                  </svg>
                  <div className="gauge-needle"></div>
                </div>
                <div className="gauge-readout">82%</div>
                <div className="gauge-label">Consent score</div>
                <div className="gauge-pref-rows">
                  <span className="gauge-tag">Marketing</span>
                  <span className="gauge-tag">Analytics</span>
                </div>
              </div>
            }
          />

          {/* CARD 4 — Immutable audit trail: locked ledger with rows lighting up */}
          <BentoCard
            className=""
            title="Immutable audit trail"
            desc="Every grant, change, and withdrawal is timestamped and locked for regulators."
            stage={
              <div className="stage-audit">
                <span className="audit-lock"><Icon.lock/>Sealed</span>
                <div className="audit-line">
                  <div className="audit-spine"></div>
                  <div className="audit-row">
                    <span className="audit-time">09:42:11</span>
                    <span className="audit-event">consent.granted</span>
                  </div>
                  <div className="audit-row">
                    <span className="audit-time">09:44:03</span>
                    <span className="audit-event">preference.updated</span>
                  </div>
                  <div className="audit-row">
                    <span className="audit-time">09:51:27</span>
                    <span className="audit-event">consent.withdrawn</span>
                  </div>
                </div>
              </div>
            }
          />

          {/* CARD 5 — Nationwide coverage: dotted India map rippling per-region */}
          <BentoCard
            className=""
            title="Nationwide coverage"
            desc="One DPDP-compliant record, enforced consistently for users across every state you serve."
            stage={
              <div className="stage-map2">
                <div className="map-grid">
                  <span className="map-dot" style={{top:'18px', left:'24px'}}></span>
                  <span className="map-dot" style={{top:'8px', left:'78px'}}></span>
                  <span className="map-dot" style={{top:'40px', left:'52px'}}></span>
                  <span className="map-dot" style={{top:'30px', left:'118px'}}></span>
                  <span className="map-dot" style={{top:'58px', left:'140px'}}></span>
                </div>
                <div className="map-region-tags">
                  <span className="map-region-tag">DL</span>
                  <span className="map-region-tag">MH</span>
                  <span className="map-region-tag">KA</span>
                </div>
              </div>
            }
          />

          {/* CARD 6 — Developer-first APIs: live console issuing scoped requests */}
          <BentoCard
            className=""
            title="Developer-first APIs"
            desc="Read and write consent state directly from your apps with scoped keys, webhooks, and SDKs."
            stage={
              <div className="stage-api2">
                <div className="api-console">
                  <div className="api-console-top">
                    <span className="api-console-dot"></span><span className="api-console-dot"></span><span className="api-console-dot"></span>
                  </div>
                  <div className="api-line"><span className="api-method">GET</span><span>/v1/consent</span></div>
                  <div className="api-line"><span className="api-200">200</span><span>scope: read</span></div>
                  <div className="api-line"><span>key: sk_live_••••<span className="api-cursor"></span></span></div>
                </div>
              </div>
            }
          />

          {/* CARD 7 — Data subject requests: request queue resolving into done state */}
          <BentoCard
            className=""
            title="Data subject requests"
            desc="Access, deletion, and portability requests are logged, routed, and resolved on a tracked SLA clock."
            stage={
              <div className="stage-dsar">
                <div className="dsar-rows">
                  <div className="dsar-row">
                    <span className="dsar-type">Access</span>
                    <span className="dsar-bar-track"><span className="dsar-bar-fill" style={{'--w':'100%', transitionDelay:'0.05s'}}></span></span>
                    <span className="dsar-state done">Done</span>
                  </div>
                  <div className="dsar-row">
                    <span className="dsar-type">Deletion</span>
                    <span className="dsar-bar-track"><span className="dsar-bar-fill" style={{'--w':'70%', transitionDelay:'0.2s'}}></span></span>
                    <span className="dsar-state pending">In progress</span>
                  </div>
                  <div className="dsar-row">
                    <span className="dsar-type">Portability</span>
                    <span className="dsar-bar-track"><span className="dsar-bar-fill" style={{'--w':'40%', transitionDelay:'0.35s'}}></span></span>
                    <span className="dsar-state queued">Queued</span>
                  </div>
                </div>
                <div className="dsar-sla"><Icon.renewal/>Avg. resolution: 3.2 days</div>
              </div>
            }
          />

          {/* CARD 8 — Granular cookie categories: category switches lighting up in sequence */}
          <BentoCard
            className=""
            title="Granular cookie categories"
            desc="People choose exactly which cookie categories they allow, down to each individual vendor."
            stage={
              <div className="stage-cookie">
                <div className="cookie-cats">
                  <div className="cookie-cat">
                    <span className="cookie-dot necessary"></span>Necessary
                    <span className="cookie-lock"><Icon.lock/></span>
                  </div>
                  <div className="cookie-cat">
                    <span className="cookie-dot analytics"></span>Analytics
                    <span className="cookie-switch"></span>
                  </div>
                  <div className="cookie-cat">
                    <span className="cookie-dot marketing"></span>Marketing
                    <span className="cookie-switch"></span>
                  </div>
                  <div className="cookie-cat">
                    <span className="cookie-dot functional"></span>Functional
                    <span className="cookie-switch"></span>
                  </div>
                </div>
              </div>
            }
          />

          {/* CARD 9 — Webhooks & alerts: event firing into a notification bell */}
          <BentoCard
            className=""
            title="Webhooks &amp; alerts"
            desc="Get notified the instant a consent state changes, so downstream systems never drift out of sync."
            stage={
              <div className="stage-webhook">
                <div className="webhook-source">
                  <Icon.bell/>
                </div>
                <div className="webhook-path">
                  <span className="webhook-packet"></span>
                </div>
                <div className="webhook-targets">
                  <span className="webhook-target">Slack</span>
                  <span className="webhook-target">Email</span>
                  <span className="webhook-target">CRM</span>
                </div>
              </div>
            }
          />

        </div>
      </div>
    </section>
  );
}

/* ---------- CONTACT ---------- */
function Contact(){
  const [sent,setSent] = useState(false);
  const submit = (e)=>{ e.preventDefault(); setSent(true); };
  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="contact-wrap">
          <div className="contact-left">
            <h2>Talk to the consent team</h2>
            <p>Tell us about your compliance scope and we'll show you how CMP maps to it — usually within one business day.</p>
            <div className="contact-points">
              <div className="contact-point"><Icon.check/> Works alongside your existing CDP and CMP</div>
              <div className="contact-point"><Icon.check/> Deploys in days, not quarters</div>
              <div className="contact-point"><Icon.check/> SOC 2 Type II audited infrastructure</div>
            </div>
          </div>
          <form className="contact-right" onSubmit={submit}>
            <div className="form-field">
              <label>Work email</label>
              <input type="email" placeholder="you@company.com" required/>
            </div>
            <div className="form-field">
              <label>Company</label>
              <input type="text" placeholder="Company name" required/>
            </div>
            <div className="form-field">
              <label>Compliance scope</label>
              <select>
                <option>DPDP (India)</option>
                <option>Not sure yet</option>
              </select>
            </div>
            <div className="form-field">
              <label>What are you trying to solve?</label>
              <textarea rows="3" placeholder="e.g. centralizing consent across web and mobile"></textarea>
            </div>
            <button className="contact-submit" type="submit">Request a demo</button>
            {sent && <div className="form-success">✓ Thanks — a member of our team will reach out shortly.</div>}
          </form>
        </div>
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
function Footer(){
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo"><span className="logo-mark"></span>CMP</div>
            <p>The consent management platform for teams who need to prove compliance, not just claim it.</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h5>Platform</h5>
              <a href="#dashboard">Dashboard</a>
              <a href="#how">How it works</a>
              <a href="#features">Features</a>
            </div>
            <div className="footer-col">
              <h5>Compliance</h5>
              <a href="#">DPDP guide</a>
              <a href="#">Data rights guide</a>
            </div>
            <div className="footer-col">
              <h5>Company</h5>
              <a href="#contact">Contact us</a>
              <a href="#">Security</a>
              <a href="#">Trust center</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 CMP. All consent records, one source of truth.</span>
          <div className="footer-badges">
            <span className="footer-badge">SOC 2</span>
            <span className="footer-badge">DPDP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function App(){
  return (
    <React.Fragment>
      <GlobalStyles/>
      <Nav/>
      <Hero/>
      <Dashboard/>
      <HowItWorks/>
      <Features/>
      <Contact/>
      <Footer/>
    </React.Fragment>
  );
}

export default App;
