import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence
} from 'motion/react';
import {
  Shield,
  ArrowRight,
  Lock,
  CheckCircle,
  Server,
  UserCheck,
  Globe,
  Activity,
  FileText,
  Cpu,
  Check,
  Calendar,
  X,
  Menu,
  Database,
  Eye,
  Sparkles,
  BarChart3,
  Zap,
  Workflow,
  Fingerprint,
  HelpCircle,
  Send,
  LockKeyhole,
  FileCheck,
  RefreshCw,
  BellRing,
  Layers,
  Orbit,
  Twitter,
  Instagram,
  Facebook
} from 'lucide-react';
import LogoImg from '../../upload/logo1.png';

const MainLanding = () => {
  // Navigation active state
  const [activeNav, setActiveNav] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  // Logo animation state
  const [showLogoO, setShowLogoO] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogoO(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Smart Navbar Scroll Logic
  const { scrollY } = useScroll();
  const [navVisible, setNavVisible] = useState(true);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (mobileMenuOpen) return;
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 50) {
      setNavVisible(false);
    } else {
      setNavVisible(true);
    }
  });

  // Demo form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    size: '10-99',
    useCase: 'Consent Management'
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setDemoSubmitted(false);
      setIsDemoModalOpen(false);
      setFormData({ name: '', email: '', company: '', size: '10-99', useCase: 'Consent Management' });
    }, 2500);
  };

  // Why IGP Trust Scroll Hooks
  const whySectionRef = useRef(null);
  const { scrollYProgress: whyScrollProgress } = useScroll({
    target: whySectionRef,
    offset: ["start start", "end end"]
  });

  // ─── Why IGP Trust scroll timeline ──────────────────────────────────────────
  // Phase 0: 0.00 – 0.25 → Title & Text fades in
  // Phase 1: 0.25 – 0.50 → Card 1 slides in
  // Phase 2: 0.50 – 0.75 → Card 2 slides in
  // Phase 3: 0.75 – 1.00 → Card 3 slides in

  const whyTitleX = useTransform(whyScrollProgress, [0, 0.15, 0.25], ["calc(50vw - max(0px, 50vw - 640px) - 18rem)", "calc(50vw - max(0px, 50vw - 640px) - 18rem)", "0px"]);
  const complianceX = useTransform(whyScrollProgress, [0, 0.15, 0.25], ["8.5rem", "8.5rem", "0rem"]);
  const eyebrowX = useTransform(whyScrollProgress, [0, 0.15, 0.25], ["12.5rem", "12.5rem", "0rem"]);
  const whyBodyOpacity = useTransform(whyScrollProgress, [0, 0.15, 0.25], [0, 0, 1]);
  const whyBodyY = useTransform(whyScrollProgress, [0, 0.15, 0.25], [20, 20, 0]);

  // Card 1
  const whyCard1Y = useTransform(whyScrollProgress, [0.25, 0.50], ["100vh", "0vh"]);
  const whyCard1Scale = useTransform(whyScrollProgress, [0.50, 0.75, 1.0], [1, 0.95, 0.90]);
  const whyCard1Top = useTransform(whyScrollProgress, [0.50, 0.75, 1.0], [0, -20, -40]);
  const whyCard1Opacity = useTransform(whyScrollProgress, [0.25, 0.50], [0, 1]);
  const whyCard1CoverOpacity = useTransform(whyScrollProgress, [0.50, 0.60], [0, 1]);

  // Card 2
  const whyCard2Y = useTransform(whyScrollProgress, [0.50, 0.75], ["100vh", "0vh"]);
  const whyCard2Scale = useTransform(whyScrollProgress, [0.75, 1.0], [1, 0.95]);
  const whyCard2Top = useTransform(whyScrollProgress, [0.75, 1.0], [0, -20]);
  const whyCard2Opacity = useTransform(whyScrollProgress, [0.50, 0.75], [0, 1]);
  const whyCard2CoverOpacity = useTransform(whyScrollProgress, [0.75, 0.85], [0, 1]);

  // Card 3
  const whyCard3Y = useTransform(whyScrollProgress, [0.75, 1.0], ["100vh", "0vh"]);
  const whyCard3Opacity = useTransform(whyScrollProgress, [0.75, 1.0], [0, 1]);

  // Our Products Scroll Hooks
  const productsSectionRef = useRef(null);
  const { scrollYProgress: productsScrollProgress } = useScroll({
    target: productsSectionRef,
    offset: ["start start", "end end"]
  });

  // ─── Products scroll: 5-phase timeline ──────────────────────────────────────
  // Phase 0: 0.00 – 0.25  → Header visible (no cards yet)
  // Phase 1: 0.25 – 0.50  → Card 1 slides in from below, stays (covered by Card 2)
  // Phase 2: 0.50 – 0.75  → Card 2 slides in from below on top of Card 1
  // Phase 3: 0.75 – 1.00  → Card 3 slides in from below on top of Cards 1–2
  // All cards are always opacity:1 — no transparency, pure slide-stack reveal

  // Header: fades out + slides up before Card 1 appears
  const titleOpacity = useTransform(productsScrollProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const titleY = useTransform(productsScrollProgress, [0.15, 0.25], [0, -60]);

  // Card y-slides only — each card stays at 0 once it arrives
  const productY0 = useTransform(productsScrollProgress, [0.25, 0.35], ['100vh', '0vh']);
  const productY1 = useTransform(productsScrollProgress, [0.50, 0.60], ['100vh', '0vh']);
  const productY2 = useTransform(productsScrollProgress, [0.75, 0.85], ['100vh', '0vh']);

  // Interactive dashboard animations
  const [dataFlowOffset, setDataFlowOffset] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setDataFlowOffset(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#111827] font-sans antialiased selection:bg-[#0466C8]/10 selection:text-[#0466C8]">

      {/* 0. Navigation Bar */}
      <motion.div
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: navVisible ? 0 : -100, opacity: navVisible ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      >
        <nav className="pointer-events-auto w-full bg-white/95 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 md:px-12 py-4">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={LogoImg} alt="Logo" className="h-8 w-auto object-contain" />
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-10">
            <a
              href="#why-igp"
              onClick={() => setActiveNav('why')}
              className={`text-[11px] font-bold uppercase tracking-widest transition-colors hover:text-[#111827] ${activeNav === 'why' ? 'text-[#111827]' : 'text-gray-500'}`}
            >
              About
            </a>
            <div className="relative group">
              <a
                href="#products"
                onClick={() => setActiveNav('products')}
                className={`text-[11px] font-bold uppercase tracking-widest transition-colors hover:text-[#111827] py-4 ${activeNav === 'products' ? 'text-[#111827]' : 'text-gray-500'}`}
              >
                Products
              </a>
              {/* Dropdown Menu */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 w-56 z-50">
                <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 p-2 overflow-hidden flex flex-col">
                  <a href="#products" className="px-4 py-3 text-sm text-slate-600 font-semibold hover:text-[#0466C8] hover:bg-slate-50 rounded-xl transition-colors text-left flex items-center gap-3">
                    <Shield className="w-4 h-4 text-[#0466C8]" /> Consent Management
                  </a>
                  <a href="#products" className="px-4 py-3 text-sm text-slate-600 font-semibold hover:text-[#0466C8] hover:bg-slate-50 rounded-xl transition-colors text-left flex items-center gap-3">
                    <Database className="w-4 h-4 text-[#0466C8]" /> Data Discovery
                  </a>
                  <a href="#products" className="px-4 py-3 text-sm text-slate-600 font-semibold hover:text-[#0466C8] hover:bg-slate-50 rounded-xl transition-colors text-left flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-[#0466C8]" /> DSAR Automation
                  </a>
                </div>
              </div>
            </div>
            <a
              href="#features"
              onClick={() => setActiveNav('features')}
              className={`text-[11px] font-bold uppercase tracking-widest transition-colors hover:text-[#111827] ${activeNav === 'features' ? 'text-[#111827]' : 'text-gray-500'}`}
            >
              Features
            </a>
          </div>

          {/* Right Side - Button & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="px-6 py-2.5 text-[11px] font-bold text-white bg-[#111827] hover:bg-black rounded-full transition-all tracking-widest uppercase"
              >
                Book Demo
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#111827] hover:bg-black/5 rounded-full transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </motion.div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && navVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-[90px] left-4 right-4 z-40 bg-[#ccdbfd]/90 backdrop-blur-lg border border-white/40 rounded-3xl shadow-2xl p-6 flex flex-col gap-4 md:hidden"
          >
            <a
              href="#why-igp"
              onClick={() => { setActiveNav('why'); setMobileMenuOpen(false); }}
              className="text-base font-bold text-[#111827] hover:text-slate-700 py-2 border-b border-black/10"
            >
              Why IGP Trust
            </a>
            <a
              href="#products"
              onClick={() => { setActiveNav('products'); setMobileMenuOpen(false); }}
              className="text-base font-bold text-[#111827] hover:text-slate-700 py-2 border-b border-black/10"
            >
              Products
            </a>
            <a
              href="#features"
              onClick={() => { setActiveNav('features'); setMobileMenuOpen(false); }}
              className="text-base font-bold text-[#111827] hover:text-slate-700 py-2 border-b border-black/10"
            >
              Key Features
            </a>
            <button
              onClick={() => { setIsDemoModalOpen(true); setMobileMenuOpen(false); }}
              className="w-full py-3 text-center text-sm font-bold text-white bg-[#111827] hover:bg-slate-800 rounded-full shadow-sm mt-2"
            >
              Book a Demo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#55a6ff] via-[#a6d1ff] to-white min-h-screen w-full border-b border-[#E5E7EB] flex flex-col items-center justify-center text-center">
        {/* Subtle circular grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at center, black 0%, transparent 50%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 50%)'
          }}
        />

        <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center">

          {/* Top Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-1.5 py-1.5 pr-4 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-600 mb-8 cursor-pointer hover:shadow-md transition-shadow"
          >
            <span className="bg-[#111827] text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
              New
            </span>
            Make your users feel special with Consent Feature
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl font-semibold text-[#111827] tracking-tight leading-[1.1] mb-6"
          >
            Build Trust Through <br className="hidden sm:block" />
            <span className="text-[#64b5f6]">
              <span>C</span>
              <span className="relative inline-flex items-center justify-center">
                <motion.span
                  animate={{ opacity: showLogoO ? 0 : 1 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                >
                  o
                </motion.span>
                <motion.img
                  src={LogoImg}
                  alt="Logo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showLogoO ? 1 : 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute h-[1.8em] w-auto object-contain translate-y-[0.05em]"
                  style={{ pointerEvents: showLogoO ? 'auto' : 'none' }}
                />
              </span>
              <span>m</span><span>p</span><span>l</span><span>i</span><span>a</span><span>n</span><span>c</span><span>e</span><span>.</span>
            </span>
          </motion.h1>
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-slate-600 leading-relaxed max-w-2xl mb-10"
          >
            Great organizations deserve a system that does it all, from managing consent and smooth
            DSR workflows to helping you market and track compliance.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex items-center gap-4"
          >
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="px-6 py-3 rounded-full font-bold text-white bg-[#111827] hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group"
            >

              Get an Invite
            </button>
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="px-6 py-3 rounded-full font-bold text-[#111827] bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex items-center gap-3 group"
            >
              <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                <img src="https://i.pravatar.cc/100?img=11" alt="Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              Book a Call
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. Why IGP Trust Section */}
      <section
        id="why-igp"
        ref={whySectionRef}
        className="relative bg-[#0466C8] text-white min-h-[400vh]"
      >
        {/* Beautiful Subtle Grid Pattern with Dots */}
        <div
          className="absolute inset-0 pointer-events-none opacity-80"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1.5px, transparent 0),
              linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        <div className="sticky top-0 h-screen flex items-center max-w-7xl mx-auto px-6 w-full overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full">

            {/* Left Column - Sticky Content */}
            <motion.div
              style={{ x: whyTitleX }}
              className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left z-10"
            >
              <motion.span style={{ x: eyebrowX }} className="block self-start text-[#FFFFFF]/70 text-xs font-extrabold tracking-wider mb-4 border-b border-white/20 pb-1 w-fit">
                Why IGP Trust?
              </motion.span>
              <h2 className="text-4xl sm:text-[42px] lg:text-[46px] xl:text-5xl font-semibold text-white tracking-tight leading-tight mb-6 inline-flex flex-col items-center lg:items-start">
                <span className="block">Engineered for Enterprise</span>
                <motion.span style={{ x: complianceX }} className="block self-start mt-1">
                  <span>C</span>
                  <span className="relative inline-flex items-center justify-center">
                    <motion.span
                      animate={{ opacity: showLogoO ? 0 : 1 }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                    >
                      o
                    </motion.span>
                    <motion.img
                      src={LogoImg}
                      alt="Logo"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: showLogoO ? 1 : 0 }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                      className="absolute h-[0.7em] w-auto object-contain translate-y-[0.05em]"
                      style={{ pointerEvents: showLogoO ? 'auto' : 'none' }}
                    />
                  </span>
                  <span>m</span><span>p</span><span>l</span><span>i</span><span>a</span><span>n</span><span>c</span><span>e</span><span>.</span>
                </motion.span>
              </h2>
              <motion.div style={{ opacity: whyBodyOpacity, y: whyBodyY }}>
                <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-md">
                  Managing privacy doesn't have to mean managing chaos. We automate the operational complexity of data governance and compliance, so you can build customer trust.
                </p>
              </motion.div>
            </motion.div>

            {/* Right Column - Scroll-Driven changing cards */}
            <div className="lg:col-span-5 relative w-full h-[400px] flex items-center justify-center">

              {/* Card 1 */}
              <motion.div
                style={{
                  y: whyCard1Y,
                  scale: whyCard1Scale,
                  marginTop: whyCard1Top,
                  opacity: whyCard1Opacity,
                }}
                className="absolute inset-0 bg-white text-[#111827] p-8 rounded-2xl shadow-2xl border border-blue-50/10 flex flex-col gap-4 w-full h-fit origin-top overflow-hidden"
              >
                {/* Solid white cover — hides text when card goes to back */}
                <motion.div
                  style={{ opacity: whyCard1CoverOpacity }}
                  className="absolute inset-0 bg-white rounded-2xl z-10 pointer-events-none"
                />
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shadow-sm">
                    <Shield className="w-6 h-6 text-[#0466C8]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#111827]">Built by Security & Compliance Experts</h3>
                </div>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Combining deep expertise in privacy, cybersecurity, and risk management to help organizations navigate an increasingly complex regulatory landscape.
                </p>
                <div className="h-px bg-slate-100 my-2" />
                <ul className="flex flex-col gap-2">
                  {["Deep privacy expertise", "Cybersecurity best practices", "Risk management focus"].map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                style={{
                  y: whyCard2Y,
                  scale: whyCard2Scale,
                  marginTop: whyCard2Top,
                  opacity: whyCard2Opacity,
                }}
                className="absolute inset-0 bg-white text-[#111827] p-8 rounded-2xl shadow-2xl border border-blue-50/10 flex flex-col gap-4 w-full h-fit origin-top overflow-hidden"
              >
                {/* Solid white cover — hides text when card goes to back */}
                <motion.div
                  style={{ opacity: whyCard2CoverOpacity }}
                  className="absolute inset-0 bg-white rounded-2xl z-10 pointer-events-none"
                />
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shadow-sm">
                    <Zap className="w-6 h-6 text-[#0466C8]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#111827]">Designed for Today's Digital Enterprises</h3>
                </div>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Unlike legacy solutions, iGP Trust is built with modern workflows, automation, and user experience at its core, making trust management simpler and more efficient.
                </p>
                <div className="h-px bg-slate-100 my-2" />
                <ul className="flex flex-col gap-2">
                  {["Modern workflow automation", "Intuitive user experience", "Efficient trust management"].map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                style={{
                  y: whyCard3Y,
                  opacity: whyCard3Opacity,
                }}
                className="absolute inset-0 bg-white text-[#111827] p-8 rounded-2xl shadow-2xl border border-blue-50/10 flex flex-col gap-4 w-full h-fit origin-top"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shadow-sm">
                    <Workflow className="w-6 h-6 text-[#0466C8]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#111827]">Privacy, Security & Risk — Unified</h3>
                </div>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Manage consent, cybersecurity assessments, and third-party risk from a connected ecosystem designed to reduce complexity and improve governance.
                </p>
                <div className="h-px bg-slate-100 my-2" />
                <ul className="flex flex-col gap-2">
                  {["Unified consent management", "Cybersecurity assessments", "Third-party risk governance"].map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </motion.div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. Our Products Section */}
      <section
        id="products"
        ref={productsSectionRef}
        className="relative bg-white min-h-[400vh] border-b border-[#E5E7EB]"
      >
        <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-hidden w-full">

          {/* ── Header: appears first, fades out before any card ── */}
          <motion.div
            style={{ opacity: titleOpacity, y: titleY }}
            className="absolute inset-0 flex flex-col items-center justify-center z-[5] pointer-events-none"
          >
            <span className="text-[#0466C8] text-xs font-semibold tracking-wider mb-3 px-3 py-1 bg-blue-50 rounded-full inline-block">
              Products Ecosystem
            </span>
            <h2 className="text-4xl sm:text-5xl font-semibold text-[#111827] tracking-tight mt-2">
              Our Products
            </h2>
            <p className="text-base text-[#6B7280] mt-3 text-center max-w-md px-6">
              Explore our core platform modules built to address distinct compliance challenges.
            </p>
          </motion.div>

          {/* ── Full-screen card stack — each card manages its own lifecycle ── */}
          <div className="relative w-full h-full">

            {/* Card 1: CMP */}
            <motion.div
              style={{ y: productY0 }}
              className="absolute inset-0 w-full h-full bg-[#3e92cc] flex flex-col justify-center items-center z-10 p-12"
            >
              <div className="w-full h-full flex flex-col gap-8 justify-center">

                {/* Top section: left placeholder card + right heading */}
                <div className="flex flex-col lg:flex-row gap-8 items-stretch flex-1 min-h-0">

                  {/* Left: Image / visual placeholder card — larger, fills height */}
                  <div className="lg:w-[65%] h-full min-h-[240px] bg-white/10 border border-white/20 rounded-none flex items-center justify-center backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4 text-white/40">
                      <Globe className="w-28 h-28 text-white/30" />
                    </div>
                  </div>

                  {/* Right: Heading + description — vertically centered */}
                  <div className="lg:w-[45%] flex flex-col justify-start gap-5">
                    <h3 className="text-2xl md:text-3xl font-semibold text-white leading-tight tracking-tight">
                      Consent Management Platform<br />Built for Modern Enterprises
                    </h3>
                    <p className="text-sm text-blue-100 leading-relaxed max-w-sm">
                      Automate consent collection, preference management, audit logging, and user rights requests across every touchpoint.
                    </p>
                  </div>
                </div>

                {/* Bottom section: 4 feature columns */}
                <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-white/20 pt-6 gap-0">

                  {/* Feature 1: Consent Collection */}
                  <div className="group flex flex-col gap-4 p-5 min-h-[180px] rounded-xl border border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-lg hover:shadow-black/10 hover:bg-white/10 cursor-pointer">
                    <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center text-white text-sm font-black transition-transform duration-300 group-hover:scale-110 shrink-0">1</div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-white text-sm leading-snug mb-2">Consent Collection</h4>
                      <div className="h-0.5 bg-white w-8 transition-all duration-500 ease-out group-hover:w-full" />
                    </div>
                    <p className="text-xs text-blue-100 leading-relaxed flex-1">
                      Collect consents across web, mobile, and offline channels with ease.
                    </p>
                    <button
                      onClick={() => setIsDemoModalOpen(true)}
                      className="flex items-center gap-1.5 text-xs font-bold text-white transition-all duration-200 group-hover:gap-2.5 mt-auto"
                    >
                      More Detailed <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>

                  {/* Feature 2: Preference Management */}
                  <div className="group flex flex-col gap-4 p-5 min-h-[180px] rounded-xl border border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-lg hover:shadow-black/10 hover:bg-white/10 cursor-pointer">
                    <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center text-white text-sm font-black transition-transform duration-300 group-hover:scale-110 shrink-0">2</div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-white text-sm leading-snug mb-2">Preference Management</h4>
                      <div className="h-0.5 bg-white w-8 transition-all duration-500 ease-out group-hover:w-full" />
                    </div>
                    <p className="text-xs text-blue-100 leading-relaxed flex-1">
                      Empower users to manage their privacy preferences.
                    </p>
                    <button
                      onClick={() => setIsDemoModalOpen(true)}
                      className="flex items-center gap-1.5 text-xs font-bold text-white transition-all duration-200 group-hover:gap-2.5 mt-auto"
                    >
                      More Detailed <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>

                  {/* Feature 3: Audit & Compliance */}
                  <div className="group flex flex-col gap-4 p-5 min-h-[180px] rounded-xl border border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-lg hover:shadow-black/10 hover:bg-white/10 cursor-pointer">
                    <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center text-white text-sm font-black transition-transform duration-300 group-hover:scale-110 shrink-0">3</div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-white text-sm leading-snug mb-2">Audit & Compliance</h4>
                      <div className="h-0.5 bg-white w-8 transition-all duration-500 ease-out group-hover:w-full" />
                    </div>
                    <p className="text-xs text-blue-100 leading-relaxed flex-1">
                      Maintain immutable audit logs and ensure regulatory compliance.
                    </p>
                    <button
                      onClick={() => setIsDemoModalOpen(true)}
                      className="flex items-center gap-1.5 text-xs font-bold text-white transition-all duration-200 group-hover:gap-2.5 mt-auto"
                    >
                      More Detailed <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>

                  {/* Feature 4: User Rights (DSAR) */}
                  <div className="group flex flex-col gap-4 p-5 min-h-[180px] rounded-xl border border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-lg hover:shadow-black/10 hover:bg-white/10 cursor-pointer">
                    <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center text-white text-sm font-black transition-transform duration-300 group-hover:scale-110 shrink-0">4</div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-white text-sm leading-snug mb-2">User Rights (DSAR)</h4>
                      <div className="h-0.5 bg-white w-8 transition-all duration-500 ease-out group-hover:w-full" />
                    </div>
                    <p className="text-xs text-blue-100 leading-relaxed flex-1">
                      Streamline DSAR workflows and respond to user requests faster.
                    </p>
                    <button
                      onClick={() => setIsDemoModalOpen(true)}
                      className="flex items-center gap-1.5 text-xs font-bold text-white transition-all duration-200 group-hover:gap-2.5 mt-auto"
                    >
                      More Detailed <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>

                </div>
              </div>
            </motion.div>

            {/* Card 2: Data Mapping — White theme */}
            <motion.div
              style={{ y: productY1 }}
              className="absolute inset-0 w-full h-full bg-white flex flex-col justify-center items-center z-20 p-12"
            >
              <div className="w-full h-full flex flex-col gap-8 justify-center">

                {/* Top section */}
                <div className="flex flex-col lg:flex-row gap-8 items-stretch flex-1 min-h-0">

                  {/* Left: Image placeholder */}
                  <div className="lg:w-[65%] h-full min-h-[280px] bg-[#EAF4FF] border border-[#0466C8]/10 rounded-none flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <Database className="w-28 h-28 text-[#0466C8]/20" />
                    </div>
                  </div>

                  {/* Right: Heading + description */}
                  <div className="lg:w-[45%] flex flex-col justify-start gap-5">
                    <h3 className="text-2xl md:text-3xl font-semibold text-[#111827] leading-tight tracking-tight">
                      Data Mapping & Discovery<br />Platform
                    </h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed max-w-sm">
                      Automatically discover and categorize personal data across databases and cloud systems. Real-time sync, cross-database scanning, and custom data classification.
                    </p>
                  </div>
                </div>

                {/* Bottom: 4 feature columns */}
                <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-[#E5E7EB] pt-6 gap-0">

                  <div className="group flex flex-col gap-4 p-5 min-h-[180px] rounded-xl border border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-[#E5E7EB] hover:shadow-lg hover:shadow-[#0466C8]/8 hover:bg-[#EAF4FF] cursor-pointer">
                    <div className="w-8 h-8 rounded-md bg-[#0466C8] flex items-center justify-center text-white text-sm font-black transition-transform duration-300 group-hover:scale-110 shrink-0">1</div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-[#0466C8] text-sm leading-snug mb-2">Automated Discovery</h4>
                      <div className="h-0.5 bg-[#0466C8] w-8 transition-all duration-500 ease-out group-hover:w-full" />
                    </div>
                    <p className="text-xs text-[#6B7280] leading-relaxed flex-1">
                      Scan databases and cloud buckets to uncover uncatalogued personal data stores.
                    </p>
                    <button onClick={() => setIsDemoModalOpen(true)} className="flex items-center gap-1.5 text-xs font-bold text-[#0466C8] transition-all duration-200 group-hover:gap-2.5 mt-auto">
                      More Detailed <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>

                  <div className="group flex flex-col gap-4 p-5 min-h-[180px] rounded-xl border border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-[#E5E7EB] hover:shadow-lg hover:shadow-[#0466C8]/8 hover:bg-[#EAF4FF] cursor-pointer">
                    <div className="w-8 h-8 rounded-md bg-[#0466C8] flex items-center justify-center text-white text-sm font-black transition-transform duration-300 group-hover:scale-110 shrink-0">2</div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-[#0466C8] text-sm leading-snug mb-2">Real-Time Sync</h4>
                      <div className="h-0.5 bg-[#0466C8] w-8 transition-all duration-500 ease-out group-hover:w-full" />
                    </div>
                    <p className="text-xs text-[#6B7280] leading-relaxed flex-1">
                      Keep data inventories up to date with continuous cross-database synchronization.
                    </p>
                    <button onClick={() => setIsDemoModalOpen(true)} className="flex items-center gap-1.5 text-xs font-bold text-[#0466C8] transition-all duration-200 group-hover:gap-2.5 mt-auto">
                      More Detailed <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>

                  <div className="group flex flex-col gap-4 p-5 min-h-[180px] rounded-xl border border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-[#E5E7EB] hover:shadow-lg hover:shadow-[#0466C8]/8 hover:bg-[#EAF4FF] cursor-pointer">
                    <div className="w-8 h-8 rounded-md bg-[#0466C8] flex items-center justify-center text-white text-sm font-black transition-transform duration-300 group-hover:scale-110 shrink-0">3</div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-[#0466C8] text-sm leading-snug mb-2">Data Classification</h4>
                      <div className="h-0.5 bg-[#0466C8] w-8 transition-all duration-500 ease-out group-hover:w-full" />
                    </div>
                    <p className="text-xs text-[#6B7280] leading-relaxed flex-1">
                      Automatically tag and classify sensitive PII fields across all connected sources.
                    </p>
                    <button onClick={() => setIsDemoModalOpen(true)} className="flex items-center gap-1.5 text-xs font-bold text-[#0466C8] transition-all duration-200 group-hover:gap-2.5 mt-auto">
                      More Detailed <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>

                  <div className="group flex flex-col gap-4 p-5 min-h-[180px] rounded-xl border border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-[#E5E7EB] hover:shadow-lg hover:shadow-[#0466C8]/8 hover:bg-[#EAF4FF] cursor-pointer">
                    <div className="w-8 h-8 rounded-md bg-[#0466C8] flex items-center justify-center text-white text-sm font-black transition-transform duration-300 group-hover:scale-110 shrink-0">4</div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-[#0466C8] text-sm leading-snug mb-2">Visual Flow Maps</h4>
                      <div className="h-0.5 bg-[#0466C8] w-8 transition-all duration-500 ease-out group-hover:w-full" />
                    </div>
                    <p className="text-xs text-[#6B7280] leading-relaxed flex-1">
                      Visualize how personal data flows through APIs and third-party integrations.
                    </p>
                    <button onClick={() => setIsDemoModalOpen(true)} className="flex items-center gap-1.5 text-xs font-bold text-[#0466C8] transition-all duration-200 group-hover:gap-2.5 mt-auto">
                      More Detailed <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>

                </div>
              </div>
            </motion.div>

            {/* Card 3: DSAR Automation — Blue theme */}
            <motion.div
              style={{ y: productY2 }}
              className="absolute inset-0 w-full h-full bg-[#3e92cc] flex flex-col justify-center items-center z-30 p-12"
            >
              <div className="w-full h-full flex flex-col gap-8 justify-center">

                {/* Top section */}
                <div className="flex flex-col lg:flex-row gap-8 items-stretch flex-1 min-h-0">

                  {/* Left: Image placeholder */}
                  <div className="lg:w-[65%] h-full min-h-[280px] bg-white/10 border border-white/20 rounded-none flex items-center justify-center backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4 text-white/40">
                      <UserCheck className="w-28 h-28 text-white/30" />
                    </div>
                  </div>

                  {/* Right: Heading + description */}
                  <div className="lg:w-[45%] flex flex-col justify-start gap-5">
                    <h3 className="text-2xl md:text-3xl font-semibold text-white leading-tight tracking-tight">
                      DSAR Automation<br />Portal for Enterprises
                    </h3>
                    <p className="text-sm text-blue-100 leading-relaxed max-w-sm">
                      Fulfill data subject access requests securely and within regulatory timeframes. Automated identity verification, secure file delivery, and custom templates.
                    </p>
                  </div>
                </div>

                {/* Bottom: 4 feature columns */}
                <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-white/20 pt-6 gap-0">

                  <div className="group flex flex-col gap-4 p-5 min-h-[180px] rounded-xl border border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-lg hover:shadow-black/10 hover:bg-white/10 cursor-pointer">
                    <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center text-white text-sm font-black transition-transform duration-300 group-hover:scale-110 shrink-0">1</div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-white text-sm leading-snug mb-2">Identity Verification</h4>
                      <div className="h-0.5 bg-white w-8 transition-all duration-500 ease-out group-hover:w-full" />
                    </div>
                    <p className="text-xs text-blue-100 leading-relaxed flex-1">
                      Validate requestor identity securely using multiple trust vectors before releasing data.
                    </p>
                    <button onClick={() => setIsDemoModalOpen(true)} className="flex items-center gap-1.5 text-xs font-bold text-white transition-all duration-200 group-hover:gap-2.5 mt-auto">
                      More Detailed <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>

                  <div className="group flex flex-col gap-4 p-5 min-h-[180px] rounded-xl border border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-lg hover:shadow-black/10 hover:bg-white/10 cursor-pointer">
                    <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center text-white text-sm font-black transition-transform duration-300 group-hover:scale-110 shrink-0">2</div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-white text-sm leading-snug mb-2">Secure File Delivery</h4>
                      <div className="h-0.5 bg-white w-8 transition-all duration-500 ease-out group-hover:w-full" />
                    </div>
                    <p className="text-xs text-blue-100 leading-relaxed flex-1">
                      Encrypted storage and secure download portal with strict expiry policies.
                    </p>
                    <button onClick={() => setIsDemoModalOpen(true)} className="flex items-center gap-1.5 text-xs font-bold text-white transition-all duration-200 group-hover:gap-2.5 mt-auto">
                      More Detailed <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>

                  <div className="group flex flex-col gap-4 p-5 min-h-[180px] rounded-xl border border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-lg hover:shadow-black/10 hover:bg-white/10 cursor-pointer">
                    <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center text-white text-sm font-black transition-transform duration-300 group-hover:scale-110 shrink-0">3</div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-white text-sm leading-snug mb-2">Custom Templates</h4>
                      <div className="h-0.5 bg-white w-8 transition-all duration-500 ease-out group-hover:w-full" />
                    </div>
                    <p className="text-xs text-blue-100 leading-relaxed flex-1">
                      Build branded DSAR response workflows with custom templates per regulation.
                    </p>
                    <button onClick={() => setIsDemoModalOpen(true)} className="flex items-center gap-1.5 text-xs font-bold text-white transition-all duration-200 group-hover:gap-2.5 mt-auto">
                      More Detailed <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>

                  <div className="group flex flex-col gap-4 p-5 min-h-[180px] rounded-xl border border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-lg hover:shadow-black/10 hover:bg-white/10 cursor-pointer">
                    <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center text-white text-sm font-black transition-transform duration-300 group-hover:scale-110 shrink-0">4</div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-white text-sm leading-snug mb-2">Deadline Tracking</h4>
                      <div className="h-0.5 bg-white w-8 transition-all duration-500 ease-out group-hover:w-full" />
                    </div>
                    <p className="text-xs text-blue-100 leading-relaxed flex-1">
                      Automated SLA tracking ensures every request is resolved within legal timeframes.
                    </p>
                    <button onClick={() => setIsDemoModalOpen(true)} className="flex items-center gap-1.5 text-xs font-bold text-white transition-all duration-200 group-hover:gap-2.5 mt-auto">
                      More Detailed <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>

                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 4. Key Features Section */}
      <section id="features" className="bg-white py-24 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-xl mx-auto">
            <span className="text-[#0466C8] text-xs font-semibold uppercase tracking-wider mb-3 px-3 py-1 bg-blue-50 rounded-full inline-block">
              Core Capabilities
            </span>
            <h2 className="text-4xl font-semibold text-[#111827] tracking-tight">
              Platform Features
            </h2>
            <p className="text-base text-[#6B7280] mt-3">
              Powerful, granular capabilities designed to meet the rigorous demands of enterprise privacy teams.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            {/* Feature 1 (Large) */}
            <div className="xl:col-span-2 bg-white border border-[#E5E7EB] hover:border-[#0466C8]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[2rem] p-8 flex flex-col group relative overflow-hidden h-full">

              {/* Top: Text Content */}
              <div className="mb-4 relative z-10">
                <h3 className="text-[22px] font-bold text-[#111827] leading-tight tracking-tight">
                  Consent Management
                </h3>
              </div>

              {/* Middle: Floating Visual */}
              <div className="flex-1 flex items-center justify-center py-6 relative z-10 w-full">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F8FAFC] rounded-xl" />
                <div className="relative bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-2xl p-5 w-full max-w-[280px] transform transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 group-hover:shadow-[0_10px_25px_-5px_rgba(4,102,200,0.15)]">
                  {/* Animated workflow visual */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-[#EAF4FF] flex items-center justify-center">
                      <Workflow className="w-5 h-5 text-[#0466C8] transition-transform duration-500 group-hover:rotate-[360deg]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Consent Flow</div>
                      <div className="text-[10px] text-slate-500">Active Workflow</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 relative">
                    {/* Vertical line connecting nodes */}
                    <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-slate-100" />

                    <div className="flex items-center gap-3 relative">
                      <div className="w-[24px] h-[24px] rounded-full bg-[#0466C8] flex items-center justify-center border-4 border-white shrink-0 z-10 transition-transform duration-500 group-hover:scale-110">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1 bg-[#F8FAFC] rounded-lg px-3 py-2 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-700">1. Collection</span>
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Done</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 relative">
                      <div className="w-[24px] h-[24px] rounded-full bg-slate-200 group-hover:bg-[#0466C8] transition-colors duration-500 delay-150 flex items-center justify-center border-4 border-white shrink-0 z-10">
                        <div className="w-2 h-2 rounded-full bg-white opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                        <Check className="w-3 h-3 text-white absolute opacity-0 group-hover:opacity-100 transition-opacity delay-300" />
                      </div>
                      <div className="flex-1 bg-[#F8FAFC] rounded-lg px-3 py-2 flex justify-between items-center group-hover:shadow-sm transition-all duration-500 relative overflow-hidden">
                        <span className="text-[10px] font-bold text-slate-700 relative z-10">2. Maintenance</span>
                        <span className="text-[9px] font-bold text-[#0466C8] bg-[#EAF4FF] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity delay-300 relative z-10">Active</span>
                        <div className="absolute inset-0 bg-[#0466C8]/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-[1s] ease-out" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom: Description */}
              <div className="mt-4 relative z-10">
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Collect, track, update, and manage user consent throughout its entire lifecycle.
                </p>
              </div>
            </div>

            {/* Feature 2 (Small) */}
            <div className="xl:col-span-1 bg-white border border-[#E5E7EB] hover:border-[#0466C8]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[2rem] p-8 flex flex-col group relative overflow-hidden h-full">
              <div className="mb-4 relative z-10">
                <h3 className="text-[22px] font-bold text-[#111827] leading-snug tracking-tight">User Rights & Preference Center</h3>
              </div>

              <div className="flex-1 flex items-center justify-center py-6 relative z-10 min-h-[160px]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F8FAFC] rounded-xl" />
                <div className="relative bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-2xl p-4 w-full max-w-[220px] transform transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 group-hover:shadow-[0_10px_25px_-5px_rgba(4,102,200,0.15)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#EAF4FF] flex items-center justify-center relative overflow-hidden">
                      <UserCheck className="w-4 h-4 text-[#0466C8] relative z-10 transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-800">User Profile</div>
                      <div className="text-[9px] text-slate-500">Privacy Settings</div>
                    </div>
                  </div>
                  <div className="bg-[#F8FAFC] rounded-xl p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-600">Marketing</span>
                      <div className="w-8 h-4 bg-slate-200 rounded-full relative transition-colors duration-500 group-hover:bg-emerald-500">
                        <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-500 group-hover:translate-x-4 flex items-center justify-center">
                          <Check className="w-2 h-2 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity delay-200" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-600">Analytics</span>
                      <div className="w-8 h-4 bg-slate-200 rounded-full relative transition-colors duration-500 delay-150 group-hover:bg-[#0466C8]">
                        <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-500 delay-150 group-hover:translate-x-4 flex items-center justify-center">
                          <Check className="w-2 h-2 text-[#0466C8] opacity-0 group-hover:opacity-100 transition-opacity delay-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 relative z-10">
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Enable users to easily review, modify, and manage their privacy preferences and consent choices.
                </p>
              </div>
            </div>

            {/* Feature 3 (Small) */}
            <div className="xl:col-span-1 bg-white border border-[#E5E7EB] hover:border-[#0466C8]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[2rem] p-8 flex flex-col group relative overflow-hidden h-full">
              <div className="mb-4 relative z-10">
                <h3 className="text-[22px] font-bold text-[#111827] leading-snug tracking-tight">Vulnerability Assessment & Pentesting</h3>
              </div>

              <div className="flex-1 flex items-center justify-center py-6 relative z-10 min-h-[160px]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F8FAFC] rounded-xl" />
                <div className="relative bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-2xl p-4 w-full max-w-[220px] transform transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 group-hover:shadow-[0_10px_25px_-5px_rgba(4,102,200,0.15)] overflow-hidden">

                  {/* Scanning laser effect */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-[#0466C8] shadow-[0_2px_8px_rgba(4,102,200,0.8)] -translate-y-2 opacity-0 group-hover:opacity-100 transition-all duration-[1.5s] ease-in-out group-hover:translate-y-[120px] z-20" />

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#EAF4FF] flex items-center justify-center transition-colors duration-500 group-hover:bg-emerald-50">
                      <Shield className="w-4 h-4 text-[#0466C8] transition-colors duration-500 group-hover:text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-800">System Core</div>
                      <div className="text-[9px] text-slate-500 transition-colors duration-500 group-hover:text-emerald-600">Active Pentest</div>
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] rounded-xl p-3 flex flex-col gap-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-600">Ports Checked</span>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 group-hover:text-emerald-600 transition-colors duration-500 delay-300">
                        <CheckCircle className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity delay-500" />
                        <span>Pass</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-600">Vulnerabilities</span>
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-600 transition-colors duration-500 delay-700">0 Found</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 relative z-10">
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Discover and validate security gaps before they can be exploited by attackers.
                </p>
              </div>
            </div>

            {/* Feature 4 (Large) */}
            <div className="xl:col-span-2 bg-white border border-[#E5E7EB] hover:border-[#0466C8]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[2rem] p-8 flex flex-col group relative overflow-hidden h-full">

              {/* Top: Text Content */}
              <div className="mb-4 relative z-10">
                <h3 className="text-[22px] font-bold text-[#111827] leading-tight tracking-tight">
                  Actionable Security Recommendations
                </h3>
              </div>

              {/* Middle: Floating Visual */}
              <div className="flex-1 flex items-center justify-center py-6 relative z-10 w-full">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F8FAFC] rounded-xl" />
                <div className="relative bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-2xl p-5 w-full max-w-[280px] transform transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 group-hover:shadow-[0_10px_25px_-5px_rgba(4,102,200,0.15)]">

                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-[#EAF4FF] flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-[#0466C8]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Priority Fixes</div>
                      <div className="text-[10px] text-slate-500 transition-colors duration-500 group-hover:text-emerald-600">Pending Resolutions</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {/* Animated checklist item */}
                    <div className="bg-[#F8FAFC] rounded-xl p-3 border border-rose-100/50 group-hover:border-emerald-100/50 transition-colors duration-700">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 w-4 h-4 rounded-full border-2 border-slate-300 group-hover:border-emerald-500 group-hover:bg-emerald-500 transition-colors duration-500 delay-150 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-white opacity-0 group-hover:opacity-100 transition-opacity delay-300" />
                        </div>
                        <div className="flex flex-col gap-1 w-full relative">
                          <span className="text-[11px] font-bold text-slate-700 group-hover:text-slate-400 transition-colors duration-500 delay-150">
                            Patch CVE-2023-1234
                          </span>
                          {/* Strikethrough line animation */}
                          <div className="absolute top-[8px] left-0 h-[1.5px] bg-slate-400 w-0 group-hover:w-[120px] transition-all duration-500 delay-150 ease-out" />

                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[9px] text-slate-500">Web Server</span>
                            <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded group-hover:opacity-0 transition-opacity duration-300">
                              Critical
                            </span>
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity delay-500">
                              Resolved
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom: Description */}
              <div className="mt-4 relative z-10">
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Receive prioritized remediation guidance to address risks and improve your security posture.
                </p>
              </div>
            </div>

            {/* Feature 5 (Small) */}
            <div className="xl:col-span-1 bg-white border border-[#E5E7EB] hover:border-[#0466C8]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[2rem] p-8 flex flex-col group relative overflow-hidden h-full">
              <div className="mb-4 relative z-10">
                <h3 className="text-[22px] font-bold text-[#111827] leading-snug tracking-tight">Vendor Risk Assessments</h3>
              </div>

              <div className="flex-1 flex items-center justify-center py-6 relative z-10 min-h-[160px]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F8FAFC] rounded-xl" />
                <div className="relative bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-2xl p-4 w-full max-w-[220px] transform transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 group-hover:shadow-[0_10px_25px_-5px_rgba(4,102,200,0.15)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#EAF4FF] flex items-center justify-center">
                      <FileText className="w-4 h-4 text-[#0466C8] transition-transform duration-500 group-hover:rotate-12" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-800">Cloud Provider Inc</div>
                      <div className="text-[9px] text-slate-500">Security Audit</div>
                    </div>
                  </div>
                  <div className="bg-[#F8FAFC] rounded-xl p-3">
                    <div className="text-[9px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Compliance Score</div>
                    <div className="flex gap-1.5 items-end h-8">
                      <div className="flex-1 bg-slate-200 rounded-t-sm h-[20%] relative overflow-hidden transition-all duration-700 ease-out group-hover:h-[60%] group-hover:bg-[#0466C8]/60" />
                      <div className="flex-1 bg-slate-200 rounded-t-sm h-[30%] relative overflow-hidden transition-all duration-700 delay-100 ease-out group-hover:h-[80%] group-hover:bg-[#0466C8]/80" />
                      <div className="flex-1 bg-slate-200 rounded-t-sm h-[10%] relative overflow-hidden transition-all duration-700 delay-200 ease-out group-hover:h-[100%] group-hover:bg-[#0466C8]">
                        {/* A+ popup */}
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity delay-700">A+</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 relative z-10">
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Evaluate third-party vendors against security, privacy, and compliance requirements before engagement.
                </p>
              </div>
            </div>

            {/* Feature 6 (Small) */}
            <div className="xl:col-span-1 bg-white border border-[#E5E7EB] hover:border-[#0466C8]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[2rem] p-8 flex flex-col group relative overflow-hidden h-full">
              <div className="mb-4 relative z-10">
                <h3 className="text-[22px] font-bold text-[#111827] leading-snug tracking-tight">Continuous Risk Monitoring</h3>
              </div>

              <div className="flex-1 flex items-center justify-center py-6 relative z-10 min-h-[160px]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F8FAFC] rounded-xl" />
                <div className="relative bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-2xl p-4 w-full max-w-[220px] transform transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 group-hover:shadow-[0_10px_25px_-5px_rgba(4,102,200,0.15)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#EAF4FF] flex items-center justify-center relative">
                      <Eye className="w-4 h-4 text-[#0466C8] relative z-10" />
                      <div className="absolute inset-0 border-2 border-[#0466C8] rounded-full scale-100 opacity-0 group-hover:animate-ping" style={{ animationDuration: '1.5s' }} />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-800">Live Monitor</div>
                      <div className="text-[9px] text-slate-500">Global Ecosystem</div>
                    </div>
                  </div>

                  {/* Terminal-like log window */}
                  <div className="bg-slate-900 rounded-xl p-3 flex flex-col gap-2 h-[68px] overflow-hidden relative">
                    {/* Inner container slides up on hover */}
                    <div className="absolute top-3 left-3 right-3 flex flex-col gap-2 transition-transform duration-700 ease-out group-hover:-translate-y-[28px]">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-[9px] font-mono text-emerald-400 truncate">AWS eu-west-1 nominal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-[9px] font-mono text-emerald-400 truncate">Vendor API synced</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 animate-pulse" />
                        <span className="text-[9px] font-mono text-rose-400 truncate">Risk: Policy change</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 relative z-10">
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Track vendor risks continuously to detect changes and emerging threats across your ecosystem.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="bg-white border-t border-[#E8E1D5] py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">

          {/* Left Column - Brand info */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <img src={LogoImg} alt="Logo" className="h-10 w-auto object-contain" />
            </div>
            <p className="text-sm text-[#7A6B63] leading-relaxed max-w-sm mt-2">
              Help organizations manage privacy operations, automate compliance workflows, and build trust.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#twitter" className="text-[#8C7A70] hover:text-[#5C4033] transition-colors"><Twitter className="w-5 h-5 fill-current" /></a>
              <a href="#instagram" className="text-[#8C7A70] hover:text-[#5C4033] transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#facebook" className="text-[#8C7A70] hover:text-[#5C4033] transition-colors"><Facebook className="w-5 h-5 fill-current" /></a>
            </div>
          </div>

          <div className="lg:col-span-1 hidden lg:block"></div>

          {/* Column 2 - Products */}
          <div className="lg:col-span-2 flex flex-col gap-5 mt-4 lg:mt-0">
            <h4 className="text-xs font-bold text-[#5C4033] uppercase tracking-widest">Products</h4>
            <div className="flex flex-col gap-4">
              <a href="#products" className="text-[13px] text-[#7A6B63] hover:text-[#5C4033] transition-colors">Consent Management</a>
              <a href="#products" className="text-[13px] text-[#7A6B63] hover:text-[#5C4033] transition-colors">Data Discovery</a>
              <a href="#products" className="text-[13px] text-[#7A6B63] hover:text-[#5C4033] transition-colors">DSAR Automation</a>
              <a href="#products" className="text-[13px] text-[#7A6B63] hover:text-[#5C4033] transition-colors">AI Governance Shield</a>
            </div>
          </div>

          {/* Column 3 - Solutions */}
          <div className="lg:col-span-2 flex flex-col gap-5 mt-4 lg:mt-0">
            <h4 className="text-xs font-bold text-[#5C4033] uppercase tracking-widest">Solutions</h4>
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-[13px] text-[#7A6B63] hover:text-[#5C4033] transition-colors">Privacy Operations</a>
              <a href="#features" className="text-[13px] text-[#7A6B63] hover:text-[#5C4033] transition-colors">Compliance Management</a>
              <a href="#features" className="text-[13px] text-[#7A6B63] hover:text-[#5C4033] transition-colors">Governance</a>
              <a href="#features" className="text-[13px] text-[#7A6B63] hover:text-[#5C4033] transition-colors">Security Architecture</a>
            </div>
          </div>

          {/* Column 4 - Legal (Replaces Resources) */}
          <div className="lg:col-span-2 flex flex-col gap-5 mt-4 lg:mt-0">
            <h4 className="text-xs font-bold text-[#5C4033] uppercase tracking-widest">Support</h4>
            <div className="flex flex-col gap-4">
              <a href="#privacy" className="text-[13px] text-[#7A6B63] hover:text-[#5C4033] transition-colors">Help Center</a>
              <a href="#terms" className="text-[13px] text-[#7A6B63] hover:text-[#5C4033] transition-colors">Contact Support</a>
              <a href="#cookies" className="text-[13px] text-[#7A6B63] hover:text-[#5C4033] transition-colors">System Status</a>
              <a href="#contact" className="text-[13px] text-[#7A6B63] hover:text-[#5C4033] transition-colors">FAQs</a>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="pt-6 border-t border-[#D5C9B3] flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-[#8C7A70]">
            <span>© 2026 IGP Trust. All rights reserved.</span>
            <div className="flex items-center gap-6">
              <a href="#privacy" className="hover:text-[#5C4033] transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-[#5C4033] transition-colors">Terms of Service</a>
              <a href="#cookies" className="hover:text-[#5C4033] transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Book a Demo Modal */}
      <AnimatePresence>
        {isDemoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDemoModalOpen(false)}
              className="absolute inset-0 bg-[#111827]/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl p-8 border border-slate-200/80 shadow-2xl overflow-hidden z-10 text-left"
            >

              {/* Close Button */}
              <button
                onClick={() => setIsDemoModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <AnimatePresence mode="wait">
                {!demoSubmitted ? (
                  <motion.div
                    key="form-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0466C8]/10 flex items-center justify-center">
                        <Calendar className="w-4.5 h-4.5 text-[#0466C8]" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#0466C8]">Schedule Consultation</span>
                    </div>

                    <h3 className="text-2xl font-semibold text-[#111827] mb-2">Book a Platform Demo</h3>
                    <p className="text-sm text-[#6B7280] mb-6 leading-relaxed">
                      Speak with our enterprise solutions architects and learn how to simplify compliance operations.
                    </p>

                    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-[#111827] uppercase">Your Name</label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="bg-slate-50 border border-slate-200 focus:border-[#0466C8] focus:ring-1 focus:ring-[#0466C8] px-4 py-2.5 rounded-lg text-sm transition-all outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-[#111827] uppercase">Work Email</label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@company.com"
                            className="bg-slate-50 border border-slate-200 focus:border-[#0466C8] focus:ring-1 focus:ring-[#0466C8] px-4 py-2.5 rounded-lg text-sm transition-all outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#111827] uppercase">Company Name</label>
                        <input
                          type="text"
                          name="company"
                          required
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="Acme Corp"
                          className="bg-slate-50 border border-slate-200 focus:border-[#0466C8] focus:ring-1 focus:ring-[#0466C8] px-4 py-2.5 rounded-lg text-sm transition-all outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-[#111827] uppercase">Company Size</label>
                          <select
                            name="size"
                            value={formData.size}
                            onChange={handleInputChange}
                            className="bg-slate-50 border border-slate-200 focus:border-[#0466C8] focus:ring-1 focus:ring-[#0466C8] px-4 py-2.5 rounded-lg text-sm transition-all outline-none"
                          >
                            <option value="1-9">1 - 9 employees</option>
                            <option value="10-99">10 - 99 employees</option>
                            <option value="100-499">100 - 499 employees</option>
                            <option value="500+">500+ employees</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-[#111827] uppercase">Primary Product Need</label>
                          <select
                            name="useCase"
                            value={formData.useCase}
                            onChange={handleInputChange}
                            className="bg-slate-50 border border-slate-200 focus:border-[#0466C8] focus:ring-1 focus:ring-[#0466C8] px-4 py-2.5 rounded-lg text-sm transition-all outline-none"
                          >
                            <option value="Consent Management">Consent Management (CMP)</option>
                            <option value="Data Discovery">Data Discovery & Sync</option>
                            <option value="DSAR Automation">DSAR Request Portal</option>
                            <option value="AI Shield">AI Governance Shield</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-4 py-3 rounded-lg font-bold text-white bg-[#0466C8] hover:bg-[#0355A8] shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        Request Demonstration
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center mb-6 shadow-sm">
                      <Check className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-black text-[#111827] mb-2">Request Received!</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed max-w-sm mb-6">
                      Thanks for requesting a demo. Our team will contact you at <span className="font-semibold text-slate-800">{formData.email}</span> shortly.
                    </p>
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0466C8] bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                      <BellRing className="w-3.5 h-3.5 animate-bounce" /> Connecting you with an expert...
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MainLanding;