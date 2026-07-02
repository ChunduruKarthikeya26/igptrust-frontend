import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import LogoImg from '../../upload/LOGOO.png';

const __CSS__ = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Barlow:wght@300;400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

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
  --body:'Barlow', 'Inter', sans-serif;
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
.nav-links{display:flex;gap:36px;font-size:14px;font-weight:500;color:var(--ink);}
.nav-links a{transition:color 0.25s ease;}
.nav-links a:hover{color:var(--accent);}
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
.section{padding:56px 0;}
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
/* ===== FEATURES SECTION DARK BACKGROUND WITH CLIPPED CORNERS ===== */
#features{
  background:transparent;
  position:relative;
  padding-left:0;
  padding-right:0;
}
#features::before{
  content:'';
  position:absolute;
  inset:0;
  background:#00012C;
  clip-path:polygon(
    28px 0%,
    calc(100% - 28px) 0%,
    100% 28px,
    100% calc(100% - 28px),
    calc(100% - 28px) 100%,
    28px 100%,
    0% calc(100% - 28px),
    0% 28px
  );
  z-index:0;
}
#features .container{
  position:relative;
  z-index:1;
}
/* Override sec-head text colors for dark background */
#features .sec-eyebrow{
  color:#7EAAFF;
}
#features .sec-head h2{
  color:#FFFFFF;
}
#features .sec-head p{
  color:rgba(255,255,255,0.55);
}

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
.bcard p{font-size:14px;font-weight:500;color:var(--ink-soft);line-height:1.6;max-width:46ch;}

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
.stage-validate{position:relative;height:100%;display:flex;align-items:center;justify-content:center;padding:20px;min-height:180px;}
.val-orbit-ring{
  position:absolute;border-radius:50%;border:1px dashed var(--line-strong);
}
.val-ring-1{width:84px;height:84px;}
.val-ring-2{width:116px;height:116px;}
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
  padding:5px 12px;height:24px;border-radius:7px;
  background:#fff;border:1px solid var(--line);
  display:flex;align-items:center;justify-content:center;
  font-family:var(--mono);font-size:9px;font-weight:700;color:var(--muted);white-space:nowrap;
  box-shadow:0 6px 14px -6px rgba(10,31,54,0.18);
  transition:border-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease;
}
.val-orbit-a{animation:orbitA 7s linear infinite;}
.val-orbit-b{animation:orbitB 9s linear infinite reverse;}
.val-orbit-c{animation:orbitC 11s linear infinite;}
@keyframes orbitA{ from{ transform:rotate(0deg) translateX(42px) rotate(0deg); } to{ transform:rotate(360deg) translateX(42px) rotate(-360deg); } }
@keyframes orbitB{ from{ transform:rotate(120deg) translateX(56px) rotate(-120deg); } to{ transform:rotate(480deg) translateX(56px) rotate(-480deg); } }
@keyframes orbitC{ from{ transform:rotate(240deg) translateX(56px) rotate(-240deg); } to{ transform:rotate(600deg) translateX(56px) rotate(-600deg); } }
.bcard:hover .val-node{border-color:var(--accent);color:var(--accent);box-shadow:0 10px 18px -6px rgba(45,108,223,0.35);}

.val-pulse-ring{position:absolute;width:46px;height:46px;border-radius:50%;border:1.5px solid var(--accent);opacity:0;animation:valpulse 1.8s ease-out infinite;}
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

`;

function GlobalStyles() {
  return <style dangerouslySetInnerHTML={{ __html: __CSS__ }} />;
}


/* ---------- generic reveal-on-scroll hook ---------- */
function useReveal() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setVis(true); });
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

/* ---------- ICONS ---------- */
const Icon = {
  scan: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M4 7V5a1 1 0 0 1 1-1h2M20 7V5a1 1 0 0 0-1-1h-2M4 17v2a1 1 0 0 0 1 1h2M20 17v2a1 1 0 0 1-1 1h-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M4 12h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>),
  shield: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M9.5 12l1.8 1.8L14.5 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  sliders: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M4 6h10M17 6h3M7 18h13M4 18h0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><circle cx="14" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.6" /><circle cx="6" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.6" /></svg>),
  log: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M5 4h14v16H5z" stroke="currentColor" strokeWidth="1.6" /><path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>),
  globe: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M3 12h18M12 3a13 13 0 0 1 0 18 13 13 0 0 1 0-18z" stroke="currentColor" strokeWidth="1.6" /></svg>),
  key: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="8" cy="15" r="4" stroke="currentColor" strokeWidth="1.6" /><path d="M11 12l9-9M16 7l3 3M13 10l2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>),
  doc: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M6 2h9l3 3v17H6z" stroke="currentColor" strokeWidth="1.4" /><path d="M9 11h6M9 14h6M9 17h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>),
  arrowDown: (p) => (<svg viewBox="0 0 14 34" fill="none" {...p}><path d="M7 0v28M1 22l6 8 6-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  arrowRight: (p) => (<svg viewBox="0 0 34 14" fill="none" {...p}><path d="M0 7h28M22 1l8 6-8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  chevron: (p) => (<svg viewBox="0 0 12 8" fill="none" {...p}><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  check: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M5 12l5 5 9-10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  mail: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M4 5h16v14H4z" stroke="currentColor" strokeWidth="1.6" /><path d="M4 6l8 7 8-7" stroke="currentColor" strokeWidth="1.6" /></svg>),
  pin: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.6" /></svg>),
  chat: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M4 5h16v11H9l-5 4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>),
  lock: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.6" /></svg>),
  /* dashboard-specific icon set */
  grid: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" /><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" /><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" /><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" /></svg>),
  collapse: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" /><path d="M9 4v16" stroke="currentColor" strokeWidth="1.6" /></svg>),
  scanner: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" /><path d="M5 9V6a1 1 0 0 1 1-1h3M19 9V6a1 1 0 0 0-1-1h-3M5 15v3a1 1 0 0 0 1 1h3M19 15v3a1 1 0 0 1-1 1h-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>),
  versions: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><rect x="4" y="8" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M8 8V5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-3" stroke="currentColor" strokeWidth="1.6" /></svg>),
  warning: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 4l9 16H3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M12 10v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="currentColor" /></svg>),
  dataRights: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" /><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>),
  renewal: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M18 4v4h-4M6 20v-4h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  bell: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M6 10a6 6 0 1 1 12 0c0 3 1 5 1.5 6H4.5C5 15 6 13 6 10z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>),
  approvals: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M8.5 12.5l2.2 2.2L16 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  validation: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M8.5 12l2 2 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  audit: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M6 2h9l3 3v17H6z" stroke="currentColor" strokeWidth="1.4" /><path d="M9 11h6M9 14h6M9 17h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>),
  analytics: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M4 20V10M11 20V4M18 20v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>),
  retention: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M8 9h8M8 12h8M8 15h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>),
  pulse: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M3 12h4l2 6 4-14 2 8h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  db: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" /><path d="M4 10h16M4 15h16" stroke="currentColor" strokeWidth="1.7" /></svg>),
  planIcon: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" /><path d="M4 10h16" stroke="currentColor" strokeWidth="1.7" /></svg>),
  trendUp: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M3 16l6-6 4 4 8-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 5h5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  chevronDown: (p) => (<svg viewBox="0 0 12 8" fill="none" {...p}><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  mobile: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><rect x="6" y="2" width="12" height="20" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M12 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>),
  store: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>),
  user: (p) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" /></svg>),
};

/* ---------- NAV ---------- */
function Nav() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="logo">iCMP</div>
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

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section className="relative pt-24 pb-32 overflow-hidden bg-[#f4f7fb] flex flex-col items-center">
      {/* Mesh Gradient Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] bg-[#b4c5ff] rounded-full mix-blend-multiply filter blur-[120px] opacity-70 pointer-events-none"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[70%] bg-[#c6b4ff] rounded-full mix-blend-multiply filter blur-[120px] opacity-70 pointer-events-none"></div>

      {/* White fade at bottom to blend into the dashboard seamlessly */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#f4f7fb] via-[#f4f7fb]/80 to-transparent z-10 pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">

        {/* Headline */}
        <h1 className="text-[2.5rem] sm:text-5xl md:text-[3rem] font-bold text-[#111827] tracking-tight leading-[1.1] mb-8 max-w-4xl mx-auto">
          Simplify Consent. Strengthen Trust.<br />Stay <span className="text-[#2563eb]">Compliance-Ready.</span>
        </h1>

        {/* Subtext */}
        <div className="flex flex-col gap-4 max-w-3xl mx-auto mb-10 text-[15.5px] text-[#5C7188] font-medium leading-relaxed">
          <p>
            iCMP is a secure technical platform that helps organisations manage user consent, cookie preferences, consent withdrawals, grievances, audit records, and compliance workflows through one unified system.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-5">
          <a href="#contact" className="bg-gradient-to-r from-[#6b82ff] to-[#405cf5] text-white font-medium text-[15px] px-8 py-3.5 rounded-full shadow-[0_8px_20px_rgba(64,92,245,0.3)] hover:shadow-[0_8px_25px_rgba(64,92,245,0.45)] transition-all hover:-translate-y-0.5">
            Request a demo
          </a>
          <a href="#how" className="text-gray-600 font-medium text-[15px] px-6 py-3.5 hover:text-[#111827] transition-colors rounded-full hover:bg-white/40">
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- DASHBOARD SHOWCASE ---------- */
function RadarChart() {
  const cx = 190, cy = 140, R = 88;
  const axes = [
    { label: 'Accepted', angle: -90, color: '#1AA260', value: 0.46 },
    { label: 'Rejected', angle: 0, color: '#F0285C', value: 0.64 },
    { label: 'Customized', angle: 90, color: '#F5A623', value: 0.44 },
    { label: 'Withdrawn', angle: 180, color: '#6B7B92', value: 0.44 },
  ];
  const pt = (angleDeg, frac) => {
    const a = angleDeg * Math.PI / 180;
    return [cx + Math.cos(a) * R * frac, cy + Math.sin(a) * R * frac];
  };
  const shapePts = axes.map(ax => pt(ax.angle, ax.value));
  const shapeD = "M " + shapePts.map(p => p.join(',')).join(' L ') + " Z";
  const gridLevels = [0.33, 0.66, 1];
  const labelPos = {
    'Accepted': { x: cx, y: cy - R - 16, anchor: 'middle' },
    'Rejected': { x: cx + R + 14, y: cy + 4, anchor: 'start' },
    'Customized': { x: cx, y: cy + R + 24, anchor: 'middle' },
    'Withdrawn': { x: cx - R - 14, y: cy + 4, anchor: 'end' },
  };
  return (
    <svg className="radar-svg" viewBox="0 0 380 280">
      {gridLevels.map((lv, i) => {
        const gp = axes.map(ax => pt(ax.angle, lv));
        const gd = "M " + gp.map(p => p.join(',')).join(' L ') + " Z";
        return <path key={i} d={gd} className="radar-grid" />;
      })}
      {axes.map((ax, i) => {
        const [x2, y2] = pt(ax.angle, 1);
        return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} className="radar-axis-line" />;
      })}
      <path d={shapeD} className="radar-shape" />
      {axes.map((ax, i) => {
        const [x, y] = shapePts[i];
        return <circle key={i} cx={x} cy={y} className="radar-pt" fill={ax.color} stroke={ax.color} style={{ color: ax.color }} />;
      })}
      {axes.map((ax, i) => {
        const lp = labelPos[ax.label];
        return <text key={i} x={lp.x} y={lp.y} textAnchor={lp.anchor} className="radar-axis-label" fill={ax.color}>{ax.label}</text>;
      })}
    </svg>
  );
}

function BarChart2() {
  const groups = [
    { name: 'acme.com', values: [20, 72, 28, 42] },
    { name: 'beta.com', values: [22, 48, 58, 33] },
  ];
  const colors = ['#1AA260', '#F0285C', '#F5A623', '#6B7B92'];
  const yTicks = [80, 60, 40, 20, 0];
  const maxV = 80;
  return (
    <div className="barchart-wrap">
      <div className="barchart-grid">
        <div className="barchart-yaxis">{yTicks.map(t => <span key={t}>{t}</span>)}</div>
        <div className="barchart-plot">
          {yTicks.map((t, i) => (
            <div key={i} className="barchart-hline" style={{ bottom: (t / maxV * 100) + '%' }}></div>
          ))}
          <div className="barchart-groups">
            {groups.map((g, gi) => (
              <div className="barchart-group" key={gi}>
                {g.values.map((v, vi) => (
                  <div key={vi} className="bar2"
                    style={{ height: (v / maxV * 100) + '%', background: colors[vi], transitionDelay: (gi * 0.12 + vi * 0.07) + 's' }}>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="barchart-xlabels">
        {groups.map((g, i) => <span key={i}>{g.name}</span>)}
      </div>
      <div className="barchart-legend">
        <span className="legend-item"><span className="legend-swatch" style={{ background: '#1AA260' }}></span>Accepted All</span>
        <span className="legend-item"><span className="legend-swatch" style={{ background: '#F5A623' }}></span>Customized</span>
        <span className="legend-item"><span className="legend-swatch" style={{ background: '#F0285C' }}></span>Rejected All</span>
        <span className="legend-item"><span className="legend-swatch" style={{ background: '#6B7B92' }}></span>Withdrawn</span>
      </div>
    </div>
  );
}

function Dashboard() {
  const [ref, vis] = useReveal();

  const navGroups = [
    {
      label: 'General', items: [
        { icon: Icon.grid, label: 'Dashboard', active: true },
        { icon: Icon.globe, label: 'Websites' },
        { icon: Icon.scanner, label: 'Scanner' },
      ]
    },
    {
      label: 'Compliance', items: [
        { icon: Icon.audit, label: 'Consent Logs' },
        { icon: Icon.versions, label: 'Dialog Versions' },
        { icon: Icon.warning, label: 'Grievances' },
        { icon: Icon.dataRights, label: 'Data Rights' },
        { icon: Icon.renewal, label: 'Renewal' },
        { icon: Icon.bell, label: 'Notifications' },
        { icon: Icon.approvals, label: 'Approvals' },
        { icon: Icon.validation, label: 'Validation Logs' },
      ]
    },
    {
      label: 'Reports', items: [
        { icon: Icon.audit, label: 'Audit Logs' },
        { icon: Icon.analytics, label: 'Analytics' },
        { icon: Icon.retention, label: 'Data Retention' },
      ]
    },
  ];

  const stats = [
    { label: 'Total websites', value: '2', icon: Icon.globe, color: 'var(--icmp-slate)', iconBg: '#EEF1F5' },
    { label: 'Active websites', value: '1', icon: Icon.pulse, color: 'var(--icmp-green)', iconBg: 'rgba(26,162,96,0.12)' },
    { label: 'Total consents', value: '120', icon: Icon.db, color: 'var(--icmp-orange)', iconBg: 'rgba(245,166,35,0.14)' },
    { label: 'Current plan', value: 'Growth', icon: Icon.planIcon, color: 'var(--icmp-purple)', iconBg: 'var(--icmp-purple-dim)', plan: true },
  ];

  return (
    <section className="dash-section relative bg-[#f4f7fb] pt-4" id="dashboard">

      {/* Glowing Mesh Gradient behind the Dashboard */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[90%] md:w-[75%] h-[80%] flex justify-center pointer-events-none opacity-80 z-0">
        <div className="w-[50%] h-full bg-[#b4c5ff] rounded-full mix-blend-multiply filter blur-[100px] md:blur-[150px]"></div>
        <div className="w-[50%] h-full bg-[#e8b4ff] rounded-full mix-blend-multiply filter blur-[100px] md:blur-[150px] -ml-[15%]"></div>
      </div>

      <div className="container relative z-10">
        <div ref={ref} className={"dash-frame" + (vis ? " visible" : "")}>

          <div className="dash-topbar">
            <div className="dash-top-left">
              <div className="dash-brand">
                <span className="dash-brand-mark"><Icon.shield /></span>
                iCMP
              </div>
              <button className="dash-collapse"><Icon.collapse /></button>
              <span className="dash-top-divider"></span>
              <span className="dash-title">Dashboard</span>
            </div>
            <div className="dash-top-right">
              <button className="dash-bell"><Icon.bell /></button>
              <div className="dash-avatar-wrap">
                <span className="dash-avatar">A</span>
                <Icon.chevronDown />
              </div>
            </div>
          </div>

          <div className="dash-body">
            <aside className="dash-sidebar">
              {navGroups.map((grp, gi) => (
                <React.Fragment key={gi}>
                  <div className="dash-nav-group-label">{grp.label}</div>
                  {grp.items.map((it, ii) => (
                    <div key={ii} className={"dash-nav-item" + (it.active ? " active" : "")}>
                      <it.icon />{it.label}
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
                <p><span className="font-medium text-[#4c5e76]">Here's your consent management overview.</span></p>
              </div>

              <div className="dash-stats">
                {stats.map((s, i) => (
                  <div key={i} className="stat-card" style={{ '--stat-c': s.color, '--stat-icon-bg': s.iconBg }}>
                    <div className="stat-top">
                      <span className="stat-label">{s.label}</span>
                      <span className="stat-icon"><s.icon /></span>
                    </div>
                    <span className={"stat-value" + (s.plan ? " plan" : "")}>{s.value}</span>
                  </div>
                ))}
              </div>

              <div className="dash-panels">
                <div className="dash-panel">
                  <div className="panel-head">
                    <h4>Consent Overview</h4>
                    <p><span className="font-medium text-[#4c5e76]">Distribution of consent responses across all domains</span></p>
                  </div>
                  <div className="radar-wrap"><RadarChart /></div>
                  <div className="panel-foot">
                    <span className="panel-foot-icon"><Icon.check /></span>
                    <div className="panel-foot-text">
                      <strong>Active consent tracking</strong>
                      <span className="font-medium text-[#4c5e76]">Showing response summary for 120 total consent logs</span>
                    </div>
                  </div>
                </div>

                <div className="dash-panel">
                  <div className="panel-head">
                    <h4>Consent by Website</h4>
                    <p><span className="font-medium text-[#4c5e76]">Consent response distribution per domain</span></p>
                  </div>
                  <BarChart2 />
                  <div className="panel-foot">
                    <span className="panel-foot-icon"><Icon.trendUp /></span>
                    <div className="panel-foot-text">
                      <strong>Trending up based on active logs</strong>
                      <span className="font-medium text-[#4c5e76]">Tracking a total of 120 responses across 2 domains</span>
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
function LNode({ nodeRef, num, badge, title, sub, stageContent, onEnter, onLeave }) {
  const [ref, vis] = useReveal();
  const setRefs = (el) => { ref.current = el; if (nodeRef) nodeRef.current = el; };
  return (
    <div ref={setRefs} className={"relative bg-white border border-gray-100 rounded-[20px] p-4 xl:p-5 flex flex-col w-[240px] xl:w-[260px] shrink-0 z-20 transition-all duration-700 ease-out " + (vis ? "opacity-100 translate-y-0 shadow-[0_12px_40px_rgba(0,0,0,0.06)]" : "opacity-0 translate-y-8")} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#eff6ff] text-[#2563eb] flex items-center justify-center font-bold text-[12px]">
            {num}
          </div>
          <span className="font-bold text-[#111827] text-[13px] xl:text-[14px] tracking-tight">{title}</span>
        </div>
        <span className="bg-[#eff6ff] text-[#2563eb] text-[8px] xl:text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider whitespace-nowrap hidden sm:block">
          {badge}
        </span>
      </div>

      {/* Sub */}
      <div className="font-mono text-[10px] xl:text-[11px] text-gray-400 mb-4 xl:mb-5 font-medium tracking-tight">
        {sub}
      </div>

      {/* Stage Content */}
      <div className="flex-1 flex flex-col">
        {stageContent}
      </div>
    </div>
  );
}

function HowItWorks() {
  const nodeRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const outerRef = useRef(null);
  const [geom, setGeom] = useState({ pts: [], segs: [], labels: [], w: 0, h: 0 });
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const recompute = () => {
    const outer = outerRef.current;
    if (!outer) return;
    const oRect = outer.getBoundingClientRect();
    const pts = nodeRefs.map(r => {
      const el = r.current;
      if (!el) return null;
      const rc = el.getBoundingClientRect();
      return {
        right: { x: rc.right - oRect.left, y: rc.top - oRect.top + rc.height / 2 },
        left: { x: rc.left - oRect.left, y: rc.top - oRect.top + rc.height / 2 },
      };
    });
    const segs = []; const labels = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      if (!a || !b) continue;
      const dx = Math.max(40, (b.left.x - a.right.x) / 2);
      const d = `M ${a.right.x} ${a.right.y} C ${a.right.x + dx} ${a.right.y}, ${b.left.x - dx} ${b.left.y}, ${b.left.x} ${b.left.y}`;
      segs.push(d);
      labels.push({ x: (a.right.x + b.left.x) / 2, y: (a.right.y + b.left.y) / 2 });
    }
    setGeom({ pts, segs, labels, w: oRect.width, h: oRect.height });
  };

  useEffect(() => {
    recompute();
    const ro = new ResizeObserver(() => recompute());
    if (outerRef.current) ro.observe(outerRef.current);
    window.addEventListener('resize', recompute);
    const t = setTimeout(recompute, 350);
    return () => { ro.disconnect(); window.removeEventListener('resize', recompute); clearTimeout(t); };
  }, []);

  const Stage1 = ({ isActive }) => (
    <React.Fragment>
      <div className="flex items-start gap-0 mb-3 border border-gray-100 rounded-xl overflow-hidden">
        <div className="flex flex-col gap-1 flex-1 px-2.5 py-2">
          <span className="text-[8.5px] text-gray-400 font-semibold uppercase tracking-wider">Channels</span>
          <span className="text-[9.5px] text-[#111827] font-semibold leading-tight">Web &bull; App &bull; Store</span>
        </div>
        <div className="w-px self-stretch bg-gray-100"></div>
        <div className="flex flex-col gap-1 flex-1 px-2.5 py-2">
          <span className="text-[8.5px] text-gray-400 font-semibold uppercase tracking-wider">Status</span>
          <div className={"inline-flex items-center gap-1 text-[8.5px] font-semibold px-1.5 py-0.5 rounded-full w-fit transition-all duration-500 " + (isActive ? "bg-[#2563eb] text-white shadow-[0_0_10px_rgba(37,99,235,0.35)]" : "bg-[#eff6ff] text-[#2563eb]")}>
            <span className={"w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-500 " + (isActive ? "bg-white animate-pulse" : "bg-[#2563eb]")} /> Capturing
          </div>
        </div>
      </div>
      {/* Stage 1 animated area: Consent forms flowing in from channels */}
      <div className="mt-3 relative overflow-hidden rounded-xl border border-gray-100 bg-[#f8fafc] p-3 flex flex-col gap-2" style={{ minHeight: '130px' }}>
        {/* Channel source pills */}
        <div className="flex gap-1.5 mb-1">
          {[{ lbl: 'Web', col: '#2563eb', delay: '0s' }, { lbl: 'App', col: '#7c3aed', delay: '0.15s' }, { lbl: 'Store', col: '#0891b2', delay: '0.3s' }].map((ch, ci) => (
            <div key={ci} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[8px] font-bold"
              style={{ background: ch.col, animation: isActive ? `channel-bounce 1.6s ease-in-out ${ch.delay} infinite` : 'none' }}>
              <span className="w-1 h-1 rounded-full bg-white/70" />{ch.lbl}
            </div>
          ))}
          <div className="ml-auto text-[8px] text-gray-400 font-medium flex items-center gap-0.5">
            <span className={"w-1.5 h-1.5 rounded-full " + (isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-300')} />
            {isActive ? 'Live' : 'Idle'}
          </div>
        </div>
        {/* Floating consent form cards */}
        {[
          { label: 'Cookie Consent', from: 'web.acme.com', delay: '0s', icon: '🍪' },
          { label: 'Email Opt-in', from: 'app.acme.com', delay: '0.4s', icon: '📧' },
          { label: 'Data Processing', from: 'store.acme.com', delay: '0.8s', icon: '📋' },
        ].map((form, fi) => (
          <div key={fi}
            className="bg-white rounded-lg border px-2.5 py-1.5 flex items-center gap-2 shadow-sm"
            style={{
              borderColor: isActive ? '#bfdbfe' : '#f1f5f9',
              animation: isActive ? `float-up 0.6s ease-out ${form.delay} both` : 'none',
              opacity: isActive ? 1 : 0.5,
            }}>
            <span className="text-[11px]">{form.icon}</span>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[8.5px] font-bold text-[#111827] truncate">{form.label}</span>
              <span className="text-[7.5px] text-gray-400 truncate">{form.from}</span>
            </div>
            <div className={"w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 " + (isActive ? 'bg-green-500 scale-110' : 'bg-gray-200')}>
              <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                <path d={isActive ? 'M2 5l2 2 4-4' : 'M3 3h4M3 5h4M3 7h2'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );

  const Stage2 = ({ isActive }) => (
    <React.Fragment>
      <div className="flex items-start gap-0 mb-3 border border-gray-100 rounded-xl overflow-hidden">
        <div className="flex flex-col gap-1 flex-1 px-2.5 py-2">
          <span className="text-[8.5px] text-gray-400 font-semibold uppercase tracking-wider">Engine</span>
          <span className="text-[9.5px] text-[#111827] font-semibold leading-tight">Rule-based</span>
        </div>
        <div className="w-px self-stretch bg-gray-100"></div>
        <div className="flex flex-col gap-1 flex-1 px-2.5 py-2">
          <span className="text-[8.5px] text-gray-400 font-semibold uppercase tracking-wider">Status</span>
          <div className={"inline-flex items-center gap-1 text-[8.5px] font-semibold px-1.5 py-0.5 rounded-full w-fit transition-all duration-500 " + (isActive ? "bg-[#2563eb] text-white shadow-[0_0_10px_rgba(37,99,235,0.35)]" : "bg-[#eff6ff] text-[#2563eb]")}>
            <span className={"w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-500 " + (isActive ? "bg-white animate-pulse" : "bg-[#2563eb]")} /> Enforcing
          </div>
        </div>
      </div>
      {/* Stage 2 animated area: Rules engine scanning & routing */}
      <div className="mt-3 relative overflow-hidden rounded-xl border bg-[#f8fafc] p-3 flex flex-col gap-2.5" style={{ borderColor: isActive ? '#bfdbfe' : '#f1f5f9', minHeight: '130px' }}>
        {/* Incoming data packet */}
        <div className="flex items-center gap-2">
          <div className={"px-2 py-1 rounded-lg border text-[8px] font-bold transition-all duration-500 " + (isActive ? 'bg-[#eff6ff] border-[#bfdbfe] text-[#2563eb]' : 'bg-white border-gray-100 text-gray-400')}>
            consent.json
          </div>
          {/* Animated scan bar */}
          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden relative">
            <div className="absolute left-0 top-0 h-full bg-[#2563eb] rounded-full"
              style={{ width: isActive ? '100%' : '0%', transition: 'width 1.2s ease-in-out' }} />
          </div>
          <div className={"text-[8px] font-bold px-1.5 py-0.5 rounded-full transition-all duration-700 " + (isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400')}>OK</div>
        </div>
        {/* Rule checks */}
        {[
          { rule: 'DPDP Act §7', result: 'Pass', delay: '0s' },
          { rule: 'Consent Validity', result: 'Pass', delay: '0.25s' },
          { rule: 'Purpose Limitation', result: 'Pass', delay: '0.5s' },
        ].map((r, ri) => (
          <div key={ri} className="flex items-center gap-2"
            style={{ animation: isActive ? `slide-right 0.45s ease-out ${r.delay} both` : 'none', opacity: isActive ? 1 : 0.4 }}>
            <div className={"w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 " + (isActive ? 'bg-green-500' : 'bg-gray-200')}>
              <svg className="w-2 h-2 text-white" viewBox="0 0 8 8" fill="none">
                <path d="M1.5 4l1.5 1.5 3.5-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[8.5px] font-semibold text-[#111827] flex-1">{r.rule}</span>
            <span className={"text-[8px] font-bold px-1.5 py-0.5 rounded-full " + (isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400')}>{r.result}</span>
          </div>
        ))}
        {/* Output signal */}
        <div className={"flex items-center gap-1.5 mt-1 pt-2 border-t transition-all duration-500 " + (isActive ? 'border-[#bfdbfe]' : 'border-gray-100')}>
          <div className={"w-2 h-2 rounded-full shrink-0 transition-all duration-700 " + (isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-300')} />
          <span className={"text-[8px] font-bold transition-colors duration-500 " + (isActive ? 'text-green-700' : 'text-gray-400')}>Consent enforced — data flow approved</span>
        </div>
      </div>
    </React.Fragment>
  );

  const Stage3 = ({ isActive }) => (
    <React.Fragment>
      <div className="flex items-start gap-0 mb-3 border border-gray-100 rounded-xl overflow-hidden">
        <div className="flex flex-col gap-1 flex-1 px-2.5 py-2">
          <span className="text-[8.5px] text-gray-400 font-semibold uppercase tracking-wider">Access</span>
          <span className="text-[9.5px] text-[#111827] font-semibold leading-tight">Preference Center</span>
        </div>
        <div className="w-px self-stretch bg-gray-100"></div>
        <div className="flex flex-col gap-1 flex-1 px-2.5 py-2">
          <span className="text-[8.5px] text-gray-400 font-semibold uppercase tracking-wider">Status</span>
          <div className={"inline-flex items-center gap-1 text-[8.5px] font-semibold px-1.5 py-0.5 rounded-full w-fit transition-all duration-500 " + (isActive ? "bg-[#16a34a] text-white shadow-[0_0_10px_rgba(22,163,74,0.35)]" : "bg-[#f0fdf4] text-[#16a34a]")}>
            <span className={"w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-500 " + (isActive ? "bg-white animate-pulse" : "bg-[#16a34a]")} /> Live
          </div>
        </div>
      </div>
      {/* Stage 3 animated area: Preference center with live toggles & sliders */}
      <div className={"mt-3 rounded-xl border overflow-hidden transition-all duration-500 " + (isActive ? 'border-[#bfdbfe] shadow-md' : 'border-gray-100 shadow-sm')} style={{ minHeight: '130px' }}>
        {/* Header bar */}
        <div className="bg-white px-3 py-2 flex items-center justify-between border-b border-gray-100">
          <span className="text-[8.5px] font-bold text-[#111827]">My Privacy Preferences</span>
          <span className={"text-[7.5px] font-semibold px-1.5 py-0.5 rounded-full transition-all duration-500 " + (isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400')}>Self-service</span>
        </div>
        <div className="bg-[#f8fafc] px-3 py-2.5 flex flex-col gap-3">
          {[
            { lb: 'Marketing', on: true, type: 'toggle', delay: '0s' },
            { lb: 'Analytics', on: true, type: 'slider', pct: 85, delay: '0.15s' },
            { lb: 'Personalization', on: true, type: 'toggle', delay: '0.3s' },
            { lb: 'Third-party Sharing', on: false, type: 'toggle', delay: '0.45s' },
          ].map((pf, pi) => (
            <div key={pi} className="flex items-center justify-between gap-2"
              style={{ animation: isActive ? `slide-right 0.4s ease-out ${pf.delay} both` : 'none', opacity: isActive ? 1 : 0.5 }}>
              <span className="text-[8.5px] font-semibold text-[#111827] flex-1 truncate">{pf.lb}</span>
              {pf.type === 'slider' ? (
                <div className="w-16 h-1 bg-gray-200 rounded-full relative">
                  <div className="absolute left-0 top-0 h-full bg-[#2563eb] rounded-full"
                    style={{ width: isActive ? `${pf.pct}%` : '55%', transition: 'width 1.1s ease-in-out 0.3s' }} />
                  <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#2563eb] rounded-full border-2 border-white shadow"
                    style={{ left: isActive ? `calc(${pf.pct}% - 5px)` : 'calc(55% - 5px)', transition: 'left 1.1s ease-in-out 0.3s' }} />
                </div>
              ) : (
                <div className={"rounded-full relative shrink-0 transition-all duration-600 " + (pf.on && isActive ? 'w-8 h-4 bg-[#2563eb] shadow-[0_0_8px_rgba(37,99,235,0.25)]' : pf.on ? 'w-7 h-4 bg-[#2563eb]' : 'w-7 h-4 bg-gray-300')}>
                  <div className={"absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all duration-500 " + ((pf.on) ? 'right-0.5' : 'left-0.5')} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );

  const Stage4 = ({ isActive }) => (
    <React.Fragment>
      <div className="flex items-start gap-0 mb-3 border border-gray-100 rounded-xl overflow-hidden">
        <div className="flex flex-col gap-1 flex-1 px-2.5 py-2">
          <span className="text-[8.5px] text-gray-400 font-semibold uppercase tracking-wider">Retention</span>
          <span className="text-[9.5px] text-[#111827] font-semibold leading-tight">7 Years</span>
        </div>
        <div className="w-px self-stretch bg-gray-100"></div>
        <div className="flex flex-col gap-1 flex-1 px-2.5 py-2">
          <span className="text-[8.5px] text-gray-400 font-semibold uppercase tracking-wider">Status</span>
          <div className={"inline-flex items-center gap-1 text-[8.5px] font-semibold px-1.5 py-0.5 rounded-full w-fit transition-all duration-500 " + (isActive ? "bg-[#16a34a] text-white shadow-[0_0_10px_rgba(22,163,74,0.35)]" : "bg-[#f0fdf4] text-[#16a34a]")}>
            <span className={"w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-500 " + (isActive ? "bg-white animate-pulse" : "bg-[#16a34a]")} /> Verified
          </div>
        </div>
      </div>
      {/* Stage 4 animated area: Audit log entries appearing and being sealed */}
      <div className={"mt-3 rounded-xl border overflow-hidden transition-all duration-500 " + (isActive ? 'border-[#bfdbfe] shadow-lg' : 'border-gray-100 shadow-sm')} style={{ minHeight: '130px' }}>
        {/* Sealed header */}
        <div className={"px-3 py-2 flex items-center justify-between border-b transition-all duration-500 " + (isActive ? 'bg-[#2563eb] border-[#1d4ed8]' : 'bg-white border-gray-100')}>
          <span className={"text-[8.5px] font-bold transition-colors duration-500 " + (isActive ? 'text-white' : 'text-[#111827]')}>Immutable Audit Trail</span>
          <span className={"text-[7.5px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 transition-all duration-700 " + (isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400')}
            style={{ animation: isActive ? 'lock-seal 0.6s ease-out 0.2s both' : 'none' }}>
            🔒 Sealed
          </span>
        </div>
        <div className="bg-[#f8fafc] px-3 py-2.5 flex flex-col gap-2">
          {[
            { event: 'consent.granted', time: '10:24:01', color: '#16a34a', delay: '0s' },
            { event: 'preference.updated', time: '10:24:38', color: '#2563eb', delay: '0.3s' },
            { event: 'consent.renewed', time: '10:25:12', color: '#2563eb', delay: '0.6s' },
            { event: 'audit.log.sealed', time: '10:26:00', color: '#7c3aed', delay: '0.9s' },
          ].map((lg, li) => (
            <div key={li} className="flex items-center gap-2"
              style={{ animation: isActive ? `audit-pop 0.4s ease-out ${lg.delay} both` : 'none', opacity: isActive ? 1 : 0.35 }}>
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: lg.color }} />
              <span className="text-[8px] font-mono font-semibold flex-1 text-[#111827]">{lg.event}</span>
              <span className="text-[7.5px] text-gray-400 font-mono shrink-0">{lg.time}</span>
            </div>
          ))}
        </div>
        {/* Tamper proof badge */}
        <div className={"px-3 py-1.5 border-t flex items-center gap-1.5 transition-all duration-700 " + (isActive ? 'bg-[#f0fdf4] border-green-100' : 'bg-white border-gray-100')}>
          <div className={"w-2 h-2 rounded-full shrink-0 transition-all duration-500 " + (isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300')} />
          <span className={"text-[7.5px] font-bold tracking-wide transition-colors duration-500 " + (isActive ? 'text-green-700' : 'text-gray-400')}>GDPR · DPDP · ISO 27001 · Tamper-proof</span>
        </div>
      </div>
    </React.Fragment>
  );

  const StageFns = [Stage1, Stage2, Stage3, Stage4];

  const nodeMeta = [
    { num: "1", badge: "Capture", title: "Collect Consent", sub: "consent.collect" },
    { num: "2", badge: "Rules Engine", title: "Validate & Control", sub: "consent.validate" },
    { num: "3", badge: "Self-Service", title: "Manage Preferences", sub: "consent.preferences" },
    { num: "4", badge: "Compliance Log", title: "Audit & Compliance", sub: "consent.audit" },
  ];

  return (
    <section className="relative pt-14 pb-14 overflow-hidden" id="how">
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <div className="relative z-10 w-full px-4 sm:px-6 md:px-[48px]">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="bg-[#eff6ff] text-[#2563eb] text-[12px] font-semibold px-3 py-1.5 rounded-full  tracking-wider shadow-sm border border-[#bfdbfe]">Governance</span>
          <h2 className="text-4xl sm:text-5xl font-semibold text-[#111827] tracking-tight mt-6">How iCMP works</h2>
          <p className="text-base text-[#374151] mt-4 font-medium">iCMP helps organisations move from unclear and manual consent practices to a structured digital consent governance framework.</p>
        </div>

        {/* Step indicator dots */}
        <div className="flex justify-center gap-2 mb-6">
          {[0, 1, 2, 3].map(i => (
            <button key={i} onClick={() => setActiveStep(i)} className={"h-1.5 rounded-full transition-all duration-500 cursor-pointer " + (activeStep === i ? "bg-[#2563eb] w-12" : "bg-gray-200 hover:bg-gray-300 w-8")} />
          ))}
        </div>

        <div className="relative" ref={outerRef}>
          <style>{`
            @keyframes line-flow { to { stroke-dashoffset: -1000; } }
            .flow-line { stroke-dasharray: 8 6; animation: line-flow 25s linear infinite; }
            @keyframes card-glow {
              0%,100% { box-shadow: 0 12px 40px rgba(0,0,0,0.06); }
              50% { box-shadow: 0 0 30px rgba(37,99,235,0.15), 0 12px 40px rgba(0,0,0,0.06); }
            }
            .card-active { animation: card-glow 2s ease-in-out infinite; border-color: #bfdbfe !important; }
            @keyframes float-up { 0%{opacity:0;transform:translateY(18px) scale(0.95)} 60%{opacity:1;transform:translateY(-3px) scale(1.01)} 100%{opacity:1;transform:translateY(0) scale(1)} }
            @keyframes slide-right { 0%{opacity:0;transform:translateX(-14px)} 100%{opacity:1;transform:translateX(0)} }
            @keyframes consent-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
            @keyframes rule-scan { 0%{width:0%} 100%{width:100%} }
            @keyframes audit-pop { 0%{opacity:0;transform:translateX(-10px)} 100%{opacity:1;transform:translateX(0)} }
            @keyframes lock-seal { 0%{transform:scale(0.7) rotate(-12deg);opacity:0} 70%{transform:scale(1.1) rotate(3deg);opacity:1} 100%{transform:scale(1) rotate(0deg);opacity:1} }
            @keyframes pref-slide { 0%{width:55%} 100%{width:85%} }
            @keyframes channel-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
          `}</style>

          <svg className="hidden xl:block absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible" viewBox={`0 0 ${geom.w} ${geom.h}`} preserveAspectRatio="none">
            {geom.segs.map((d, i) => (
              <path key={'base' + i} d={d} fill="none" stroke="#2563eb" strokeWidth="1.5" className="flow-line" />
            ))}
            {geom.pts && geom.pts.map((p, i) => {
              if (!p) return null;
              return (
                <g key={'pts' + i}>
                  {i !== geom.pts.length - 1 && <circle cx={p.right.x} cy={p.right.y} r="4" fill="#2563eb" />}
                  {i !== 0 && <circle cx={p.left.x} cy={p.left.y} r="4" fill="#2563eb" />}
                </g>
              );
            })}
          </svg>

          <div className="relative z-20 flex flex-col xl:flex-row gap-6 xl:gap-0 overflow-x-hidden xl:overflow-x-visible xl:justify-between xl:min-h-[720px] xl:pb-0 pb-6 pt-6 xl:px-0 items-center xl:items-start">
            {nodeMeta.map((n, i) => {
              const offsets = ["xl:mt-0", "xl:mt-[420px]", "xl:mt-0", "xl:mt-[420px]"];
              const isActive = activeStep === i;
              const StageComp = StageFns[i];
              return (
                <div key={i} className={`w-full xl:w-auto transition-all duration-500 ${offsets[i]}`}>
                  <div
                    ref={el => { if (nodeRefs[i]) nodeRefs[i].current = el; }}
                    className={"relative bg-white border rounded-[20px] p-4 xl:p-5 flex flex-col w-full max-w-sm mx-auto xl:w-[290px] xl:mx-0 xl:shrink-0 z-20 transition-all duration-700 ease-out cursor-pointer hover:shadow-[0_16px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1 " + (isActive ? "card-active scale-[1.02]" : "border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.06)]")}
                    onClick={() => setActiveStep(i)}
                  >
                    {/* Row 1: step number + badge */}
                    <div className="flex items-center justify-between mb-2">
                      <div className={"w-6 h-6 rounded-full flex items-center justify-center font-bold text-[12px] transition-all duration-500 shrink-0 " + (isActive ? "bg-[#2563eb] text-white shadow-[0_0_10px_rgba(37,99,235,0.3)] scale-110" : "bg-[#eff6ff] text-[#2563eb]")}>
                        {n.num}
                      </div>
                      <span className={"text-[8px] font-bold px-2 py-0.5 rounded-full tracking-wider whitespace-nowrap transition-all duration-500 " + (isActive ? "bg-[#2563eb] text-white shadow-sm" : "bg-[#eff6ff] text-[#2563eb]")}>
                        {n.badge}
                      </span>
                    </div>
                    {/* Row 2: title + sub */}
                    <span className="font-bold text-[#111827] text-[14px] tracking-tight leading-snug mb-1">{n.title}</span>
                    <div className={"font-mono text-[10px] mb-3 font-medium tracking-tight transition-colors duration-500 " + (isActive ? "text-[#2563eb]" : "text-gray-400")}>
                      {n.sub}
                    </div>
                    {/* Animated stage content */}
                    <div className="flex-1 flex flex-col">
                      <StageComp isActive={isActive} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FEATURES (bento) ---------- */
function BentoCard({ className, title, desc, stage }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} className={"bcard " + className + (vis ? " reveal visible" : " reveal")}>
      <div className="bc-head">
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
      <div className="bc-stage">{stage}</div>
    </div>
  );
}

function Features() {
  return (
    <section className="section" id="features">
      <div className="container">
        <div className="sec-head">
          <span className="sec-eyebrow">Capabilities</span>
          <h2>What iCMP Helps Organisations Do</h2>
          <p><span className="text-[#ffffff] font-normal">Capabilities working together to ensure compliant and transparent consent management.</span></p>
        </div>

        <div className="bento">

          <BentoCard
            className=""
            title="Purpose-Based Consent Management"
            desc="Collect consent separately for each processing purpose so users clearly understand what they are agreeing to."
            stage={
              <div className="stage-capture">
                <div className="cap-top">
                  <span className="cap-status"><span className="cap-status-dot"></span><span className="font-bold text-[#c1121f]">Purpose Scan</span></span>
                  <span className="cap-pct">3/3 verified</span>
                </div>
                <div className="cap-beam"></div>
                <div className="cap-files">
                  <div className="cap-file">
                    <Icon.doc /><span className="cap-file-name"><span className="font-semibold text-[#000000]">marketing.json</span></span>
                    <span className="cap-file-check"><Icon.check /></span>
                  </div>
                  <div className="cap-file">
                    <Icon.doc /><span className="cap-file-name"><span className="font-semibold text-[#000000]">analytics.json</span></span>
                    <span className="cap-file-check"><Icon.check /></span>
                  </div>
                  <div className="cap-file">
                    <Icon.doc /><span className="cap-file-name"><span className="font-semibold text-[#000000]">profiling.json</span></span>
                    <span className="cap-file-check"><Icon.check /></span>
                  </div>
                </div>
              </div>
            }
          />

          <BentoCard
            className=""
            title="Cookie Consent Management"
            desc="Display cookie consent banners, manage cookie categories, and allow users to control non-essential cookies through a preference centre."
            stage={
              <div className="stage-cookie">
                <div className="cookie-cats">
                  <div className="cookie-cat">
                    <span className="cookie-dot necessary"></span>Necessary
                    <span className="cookie-lock"><Icon.lock /></span>
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

          <BentoCard
            className=""
            title="Consent Withdrawal"
            desc="Enable users to withdraw consent through a simple and transparent process, with confirmation and audit tracking."
            stage={
              <div className="stage-gauge">
                <div className="gauge-wrap">
                  <svg viewBox="0 0 120 68">
                    <path className="gauge-track" d="M10 62 A50 50 0 0 1 110 62" />
                    <path className="gauge-fill" d="M10 62 A50 50 0 0 1 110 62" />
                  </svg>
                  <div className="gauge-needle"></div>
                </div>
                <div className="gauge-readout">0%</div>
                <div className="gauge-label font-semibold text-[#c1121f]">Withdrawn State</div>
                <div className="gauge-pref-rows">
                  <span className="gauge-tag font-semibold text-[#000000]">Opted Out</span>
                  <span className="gauge-tag font-semibold text-[#000000]">Audit Logged</span>
                </div>
              </div>
            }
          />

          <BentoCard
            className=""
            title="User Consent Dashboard"
            desc="Allow users to view consent history, update preferences, withdraw consent, raise requests, and track grievance status."
            stage={
              <div className="stage-validate">
                <span className="val-orbit-ring val-ring-1"></span>
                <span className="val-orbit-ring val-ring-2"></span>
                <span className="val-pulse-ring"></span>
                <div className="val-hub"><Icon.shield /></div>
                <span className="val-node val-orbit-a">History</span>
                <span className="val-node val-orbit-b">Grievance</span>
                <span className="val-node val-orbit-c">Withdraw</span>
              </div>
            }
          />

          <BentoCard
            className=""
            title="Grievance Redressal"
            desc="Support structured grievance submission, complaint routing, status tracking, escalation, and resolution workflows."
            stage={
              <div className="stage-dsar">
                <div className="dsar-rows">
                  <div className="dsar-row">
                    <span className="dsar-type">Submission</span>
                    <span className="dsar-bar-track"><span className="dsar-bar-fill" style={{ '--w': '100%', transitionDelay: '0.05s' }}></span></span>
                    <span className="dsar-state done">Received</span>
                  </div>
                  <div className="dsar-row">
                    <span className="dsar-type">Routing</span>
                    <span className="dsar-bar-track"><span className="dsar-bar-fill" style={{ '--w': '70%', transitionDelay: '0.2s' }}></span></span>
                    <span className="dsar-state pending">En Route</span>
                  </div>
                  <div className="dsar-row">
                    <span className="dsar-type">Escalation</span>
                    <span className="dsar-bar-track"><span className="dsar-bar-fill" style={{ '--w': '40%', transitionDelay: '0.35s' }}></span></span>
                    <span className="dsar-state queued">Monitored</span>
                  </div>
                </div>
                <div className="dsar-sla font-semibold text-[#111827]"><Icon.renewal />Avg. Resolution: 3.2 Days</div>
              </div>
            }
          />

          <BentoCard
            className=""
            title="Audit-Ready Records"
            desc="Maintain records of consent actions, withdrawals, updates, validations, admin changes, and system events for compliance evidence."
            stage={
              <div className="stage-audit">
                <span className="audit-lock"><Icon.lock />Sealed</span>
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

          <BentoCard
            className=""
            title="Role-Based Access Control"
            desc="Manage access through defined roles such as Administrator, DPO, Auditor, Compliance Officer, Operator, and User."
            stage={
              <div className="flex flex-col gap-2 p-4 justify-center h-full">
                <div className="flex justify-between items-center bg-white border border-gray-100 rounded-lg p-2 shadow-sm">
                  <span className="font-mono text-[9px] font-bold text-[#111827]">Administrator</span>
                  <span className="bg-green-100 text-green-700 text-[8px] font-bold px-2 py-0.5 rounded-full">Full Access</span>
                </div>
                <div className="flex justify-between items-center bg-white border border-gray-100 rounded-lg p-2 shadow-sm">
                  <span className="font-mono text-[9px] font-bold text-[#111827]">DPO / Auditor</span>
                  <span className="bg-blue-100 text-blue-700 text-[8px] font-bold px-2 py-0.5 rounded-full">Read & Export</span>
                </div>
                <div className="flex justify-between items-center bg-white border border-gray-100 rounded-lg p-2 shadow-sm">
                  <span className="font-mono text-[9px] font-bold text-[#111827]">Compliance Officer</span>
                  <span className="bg-purple-100 text-purple-700 text-[8px] font-bold px-2 py-0.5 rounded-full">Grievances Only</span>
                </div>
              </div>
            }
          />

          <BentoCard
            className=""
            title="Compliance Insights"
            desc="Provide consent activity visibility, grievance tracking, reports, and audit-ready exports for compliance and governance teams."
            stage={
              <div className="flex flex-col gap-3 p-4 justify-center h-full">
                <div className="flex items-center justify-between border-b pb-2 border-gray-100">
                  <span className="text-[10px] font-bold text-[#111827]">Compliance Status</span>
                  <span className="text-green-500 font-bold text-[9px] flex items-center gap-1">● 98.4% Compliant</span>
                </div>
                <div className="flex gap-2">
                  <div className="bg-[#f8fafc] border border-gray-100 rounded-lg p-2 flex-1 text-center">
                    <span className="text-[8px] text-gray-400 font-semibold block">Grievance SLA</span>
                    <span className="text-sm font-bold text-[#2563eb]">100% Met</span>
                  </div>
                  <div className="bg-[#f8fafc] border border-gray-100 rounded-lg p-2 flex-1 text-center">
                    <span className="text-[8px] text-gray-400 font-semibold block">Audit Exports</span>
                    <span className="text-sm font-bold text-green-600">Ready</span>
                  </div>
                </div>
              </div>
            }
          />

          <BentoCard
            className=""
            title="Developer-First APIs"
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

        </div>
      </div>
    </section>
  );
}

/* ---------- CONTACT ---------- */
function Contact() {
  const [sent, setSent] = useState(false);
  const submit = (e) => { e.preventDefault(); setSent(true); };
  return (
    <section className="bg-white py-24 border-t border-gray-100" id="contact">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          {/* LEFT SIDE */}
          <div className="flex flex-col pr-0 lg:pr-12">
            <h2 className="text-[34px] md:text-5xl lg:text-[3.8rem] font-semibold text-[#111827] tracking-tight leading-[1.1] mb-6">Built for Responsible<br />Data Governance</h2>
            <div className="flex flex-col gap-5 text-[#5C7188] text-base mb-12 max-w-xl leading-relaxed font-medium">
              <p>
                iCMP is suitable for organisations that collect or process personal data and need a structured way to manage consent, cookie preferences, grievances, audit records, and compliance workflows.
              </p>
              <p className="text-[14.5px] text-[#5C7188]/85">
                The platform supports business, compliance, technology, and audit teams by bringing consent governance capabilities into one secure and manageable environment.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 text-[#2563eb]">
                  <Icon.shield className="w-5 h-5" />
                </div>
                <span className="text-[#111827] font-semibold text-[14.5px]">Designed for DPDP 2023 Principles</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 text-[#2563eb]">
                  <Icon.sliders className="w-5 h-5" />
                </div>
                <span className="text-[#111827] font-semibold text-[14.5px]">Centralised Consent and Cookie Preferences</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 text-[#2563eb]">
                  <Icon.log className="w-5 h-5" />
                </div>
                <span className="text-[#111827] font-semibold text-[14.5px]">Audit-Ready Records and Workflow Integrations</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (FORM) */}
          <div className="bg-[#f6f6f6] rounded-[2rem] p-8 md:p-12">
            <form onSubmit={submit} className="flex flex-col gap-5">
              <div>
                <label className="block text-[13px] font-medium text-gray-600 mb-2">Work email</label>
                <input type="email" placeholder="you@company.com" required className="w-full bg-white border border-transparent focus:border-gray-200 focus:ring-4 focus:ring-gray-100 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 outline-none transition-all shadow-sm" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-600 mb-2">Company</label>
                <input type="text" placeholder="Company name" required className="w-full bg-white border border-transparent focus:border-gray-200 focus:ring-4 focus:ring-gray-100 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 outline-none transition-all shadow-sm" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-600 mb-2">Compliance scope</label>
                <select className="w-full bg-white border border-transparent focus:border-gray-200 focus:ring-4 focus:ring-gray-100 rounded-xl px-4 py-3.5 text-gray-900 outline-none transition-all appearance-none cursor-pointer shadow-sm">
                  <option>DPDP (India)</option>
                  <option>Not sure yet</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-600 mb-2">What are you trying to solve?</label>
                <textarea rows="3" placeholder="e.g. centralizing consent across web and mobile" className="w-full bg-white border border-transparent focus:border-gray-200 focus:ring-4 focus:ring-gray-100 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 outline-none transition-all resize-none shadow-sm"></textarea>
              </div>
              <div className="mt-4">
                <button type="submit" className="inline-flex items-center justify-center gap-2 bg-[#1f2328] hover:bg-black text-white font-medium rounded-xl px-6 py-3.5 transition-colors shadow-sm text-[15px]">
                  Request a demo
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </button>
              </div>
              {sent && <div className="text-[13px] font-medium text-green-600 mt-2">✓ Thanks — a member of our team will reach out shortly.</div>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  return (
    <footer className="bg-[#F4F5F6] py-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row justify-between gap-12 lg:gap-24">

        {/* Left Column - Brand info */}
        <div className="flex flex-col gap-4 max-w-[280px]">
          <div className="text-2xl font-bold text-[#111827] tracking-tight">iCMP</div>
          <p className="text-[13px] text-[#6B7280] leading-relaxed font-medium mt-1">
            The consent management platform for teams who need to prove compliance, not just claim it.
          </p>
        </div>

        {/* Right Columns */}
        <div className="flex flex-wrap md:flex-nowrap gap-12 md:gap-20 lg:gap-24">
          {/* Column 2 */}
          <div className="flex flex-col gap-5">
            <h4 className="text-[13px] font-bold text-[#111827]">Platform</h4>
            <div className="flex flex-col gap-3.5">
              <a href="#dashboard" className="text-[13px] font-medium text-[#6B7280] hover:text-[#111827] transition-colors">Dashboard</a>
              <a href="#how" className="text-[13px] font-medium text-[#6B7280] hover:text-[#111827] transition-colors">How it works</a>
              <a href="#features" className="text-[13px] font-medium text-[#6B7280] hover:text-[#111827] transition-colors">Features</a>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-5">
            <h4 className="text-[13px] font-bold text-[#111827]">Compliance</h4>
            <div className="flex flex-col gap-3.5">
              <a href="#" className="text-[13px] font-medium text-[#6B7280] hover:text-[#111827] transition-colors">DPDP guide</a>
              <a href="#" className="text-[13px] font-medium text-[#6B7280] hover:text-[#111827] transition-colors">Data rights guide</a>
            </div>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col gap-5">
            <h4 className="text-[13px] font-bold text-[#111827]">Company</h4>
            <div className="flex flex-col gap-3.5">
              <a href="#contact" className="text-[13px] font-medium text-[#6B7280] hover:text-[#111827] transition-colors">Contact us</a>
              <a href="#" className="text-[13px] font-medium text-[#6B7280] hover:text-[#111827] transition-colors">Security</a>
              <a href="#" className="text-[13px] font-medium text-[#6B7280] hover:text-[#111827] transition-colors">Trust center</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

function App() {
  return (
    <React.Fragment>
      <GlobalStyles />
      <Nav />
      <Hero />
      <Dashboard />
      <HowItWorks />
      <Features />
      <Contact />
      <Footer />
    </React.Fragment>
  );
}

export default App;
