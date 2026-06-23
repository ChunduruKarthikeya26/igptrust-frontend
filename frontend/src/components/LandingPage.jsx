import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

/* ============================================================
   iCMP — Intelligent Consent Management Platform
   Single-file React conversion of index.html + styles.css + app.js
   All design, markup, classes and behavior preserved 1:1.
   ============================================================ */

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
`;

/* ============================================================
   Static data (ported from app.js)
   ============================================================ */

const HERO_CONNECTIONS = [
  { from: "node-cookie", to: "db-section-Overview", lineId: "line-cookie" },
  { from: "node-pref", to: "db-section-Analytics", lineId: "line-pref" },
  { from: "node-audit", to: "db-section-Logs", lineId: "line-audit" },
  { from: "node-global", to: "db-section-Monitoring", lineId: "line-global" },
  { from: "node-analytics", to: "db-section-Analytics", lineId: "line-analytics" },
  { from: "node-legal", to: "db-section-Overview", lineId: "line-legal" },
];

const ARCHI_DETAILS = {
  banner: {
    title: "Cookie Consent Banner",
    desc: "The visitor-facing gateway that dynamically serves cookie choice components based on the user's precise geographic coordinates.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 1 0 10 10V4a2 2 0 0 0-2-2Z" />
        <circle cx="12" cy="8" r="1" />
        <circle cx="9" cy="12" r="1" />
        <circle cx="15" cy="12" r="1" />
        <circle cx="12" cy="16" r="1" />
      </svg>
    ),
  },
  db: {
    title: "User Consent database",
    desc: "High-availability data stores compiling user tokens and configurations securely with low-latency access.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
      </svg>
    ),
  },
  pref: {
    title: "Consent Preferences",
    desc: "Allows granular tracking categorization (Analytics, Necessary, Targeting) giving users custom options matching regional regulations.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="2" y1="14" x2="6" y2="14" />
        <line x1="10" y1="8" x2="14" y2="8" />
        <line x1="18" y1="16" x2="22" y2="16" />
      </svg>
    ),
  },
  audit: {
    title: "Consent History",
    desc: "Visual timeline showing each subject's history of opt-ins, modifications, expirations, and withdrawal instances.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 8v4l3 3" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  logs: {
    title: "Cryptographic Logs",
    desc: "Immutable, cryptographically signed consent transactions validating data integrity to regulators during audits.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  rights: {
    title: "User Rights Registry",
    desc: "Automates user preference management (Access, Correction, Portability, and Objection) securely.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  dsar: {
    title: "DSAR Requests",
    desc: "Fulfill regulatory Access or Deletion requests seamlessly from a unified, automated dashboard.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  reports: {
    title: "Compliance Reports",
    desc: "Consolidates documentation automatically into formatted compliance profiles for auditors, CPOs, and legal panels.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
};

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
  return (
    <div className="icmp-root">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

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
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      <div className={`toast${toastActive ? " active" : ""}`} id="toast">
        <svg className="toast-success-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span id="toast-message">Demo Request Submitted Successfully!</span>
      </div>
    </div>
  );
}
