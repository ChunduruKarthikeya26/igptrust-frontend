<div align="center">

  <!-- Animated Floating Logo -->
  <a href="https://vitejs.dev/">
    <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/React-Dark.svg" alt="iCMP Logo" width="120" style="margin-bottom: 20px; animation: float 3s ease-in-out infinite;" />
  </a>

  <h1> iGP Trust Frontend </h1>

  <!-- Animated Typing Subtitle -->
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=22&pause=1000&color=61DAFB&center=true&vCenter=true&width=600&lines=Intelligent+Consent+Management;Lightning+Fast+React+%2B+Vite;Fluid+Framer+Motion+Animations;Pixel-Perfect+Tailwind+CSS" alt="Typing SVG" />
  </a>

  <p align="center">
    <strong>The ultimate, highly-interactive Consent Management Platform built for the modern web.</strong>
  </p>

  <p align="center">
    <!-- Clickable Dynamic Badges -->
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite"></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
    <a href="https://www.framer.com/motion/"><img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion"></a>
  </p>

  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" alt="divider" />
</div>

## 🌌 The iCMP Visual Experience

**iCMP** isn't just a dashboard; it's a completely immersive visual experience. By combining the blindingly fast rendering speed of Vite with the fluidity of Framer Motion, every interaction feels alive and responsive.

<details>
  <summary><b>✨ Click to reveal: Why iCMP feels so good to use</b></summary>
  
  <br/>
  
  * 🌊 **Fluid Micro-interactions:** Buttons that spring, metric cards that hover, and dynamic charts.
  * 🎭 **Seamless Transitions:** Zero layout shifts. Page changes are choreographed and buttery smooth.
  * 🎨 **Vibrant Aesthetics:** Tailored pastel gradients, glassmorphism UI components, and deep dark modes.
</details>

<details>
  <summary><b>⚙️ Click to reveal: Core Architecture</b></summary>

  <br/>

  * **Core Engine:** React 18 + Vite for instantaneous Hot Module Replacement (HMR).
  * **Styling:** TailwindCSS with dynamic utility classes and custom color tokens.
  * **Animations:** Framer Motion for scroll-based reveals, layout animations, and gesture physics.
  * **Routing:** React Router DOM for seamless, instantaneous page transitions.
</details>

---

<div align="center">
  <h3>👀 See it in Action</h3>
  <!-- CRITICAL: Place your animated demo GIF here -->
  <p><i>Drop your stunning, high-framerate screen recording here (assets/demo.gif) to showcase your UI animations!</i></p>
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" alt="divider" />
</div>

---

## 🚀 Quick Start

Launch the **iCMP Frontend** development environment locally with hot-module replacement to instantly view animation tweaks and style changes.

### 📋 Prerequisites
* **Node.js** (v18+)
* **npm** or **yarn**

### 🔥 Ignite the React + Vite Environment
Clone the repository and open your terminal:

```bash
cd frontend

# Install all required UI dependencies
npm install

# Start the blazingly fast Vite HMR server
npm run dev
chundurukarthikeya26-igptrust-frontend/
├── README.md
└── frontend/
    ├── components.json
    ├── consent_routes.txt
    ├── dashboard_content.txt
    ├── grievances_content.txt
    ├── grievances_routes.txt
    ├── index.html
    ├── jsconfig.json
    ├── main_content.txt
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vercel.json
    ├── vite.config.js
    ├── src/
    │   ├── api.js
    │   ├── App.jsx
    │   ├── index.css
    │   ├── main.jsx
    │   ├── api/                 # API service modules
    │   │   ├── audit.js
    │   │   ├── auth.js
    │   │   ├── axios.js
    │   │   ├── consents.js
    │   │   ├── cookies.js
    │   │   ├── export.js
    │   │   ├── grievances.js
    │   │   ├── mockAdapter.js
    │   │   ├── notifications.js
    │   │   ├── portal.js
    │   │   ├── retention.js
    │   │   └── websites.js
    │   ├── app/
    │   │   └── dashboard/
    │   │       └── data.json
    │   ├── components/          # Reusable, animated UI components
    │   │   ├── app-sidebar.jsx
    │   │   ├── BottomNav.jsx
    │   │   ├── chart-area-interactive.jsx
    │   │   ├── CodeSection.jsx
    │   │   ├── data-table.jsx
    │   │   ├── EnhancedTrendsTab.jsx
    │   │   ├── FormSection.jsx
    │   │   ├── header.jsx
    │   │   ├── LanguageSwitcher.jsx
    │   │   ├── nav-documents.jsx
    │   │   ├── nav-main.jsx
    │   │   ├── nav-secondary.jsx
    │   │   ├── nav-user.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── ReconsentBanner.jsx
    │   │   ├── RegisterCodeSection.jsx
    │   │   ├── RegisterForm.jsx
    │   │   ├── section-cards.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── site-header.jsx
    │   │   ├── StatsCard.jsx
    │   │   ├── WebsiteSelector.jsx
    │   │   └── ui/              # Core Design System components (shadcn/ui based)
    │   │       ├── avatar.jsx
    │   │       ├── badge.jsx
    │   │       ├── bar-chart-custom.jsx
    │   │       ├── bar-chart-interactive.jsx
    │   │       ├── breadcrumb.jsx
    │   │       ├── button.jsx
    │   │       ├── card.jsx
    │   │       ├── chart-tooltip-advanced.jsx
    │   │       ├── chart.jsx
    │   │       ├── checkbox.jsx
    │   │       ├── dialog.jsx
    │   │       ├── drawer.jsx
    │   │       ├── dropdown-menu.jsx
    │   │       ├── input.jsx
    │   │       ├── label.jsx
    │   │       ├── radar-chart.jsx
    │   │       ├── select.jsx
    │   │       ├── separator.jsx
    │   │       ├── sheet.jsx
    │   │       ├── sidebar.jsx
    │   │       ├── skeleton.jsx
    │   │       ├── sonner.jsx
    │   │       ├── table.jsx
    │   │       ├── tabs.jsx
    │   │       ├── toggle-group.jsx
    │   │       ├── toggle.jsx
    │   │       └── tooltip.jsx
    │   ├── context/             # Global Context Providers
    │   │   ├── AuthContext.jsx
    │   │   └── WebsiteContext.jsx
    │   ├── hooks/
    │   │   └── use-mobile.js
    │   ├── i18n/                # Internationalization
    │   │   ├── index.js
    │   │   └── locales/
    │   │       ├── bn.json
    │   │       ├── en.json
    │   │       ├── gu.json
    │   │       ├── hi.json
    │   │       ├── kn.json
    │   │       ├── ml.json
    │   │       ├── mr.json
    │   │       ├── ta.json
    │   │       └── te.json
    │   ├── lib/
    │   │   └── utils.js
    │   └── pages/               # Full Application Route Views
    │       ├── Analytics.jsx
    │       ├── AuditLogs.jsx
    │       ├── ConsentLogs.jsx
    │       ├── ConsentValidation.jsx
    │       ├── CookieManager.jsx
    │       ├── Dashboard.jsx
    │       ├── data.json
    │       ├── DataRetention.jsx
    │       ├── DataRightsInbox.jsx
    │       ├── DialogVersions.jsx
    │       ├── FeedbackPage.jsx
    │       ├── GrievanceRoutingSettings.jsx
    │       ├── Grievances.jsx
    │       ├── GrievanceTrack.jsx
    │       ├── Login.jsx
    │       ├── Notifications.jsx
    │       ├── PendingApprovals.jsx
    │       ├── ReconsentPage.jsx
    │       ├── Register.jsx
    │       ├── RenewalPage.jsx
    │       ├── Scanner.jsx
    │       ├── Settings.jsx
    │       ├── Team.jsx
    │       ├── Templates.jsx
    │       ├── WebsiteDetail.jsx
    │       ├── Websites.jsx
    │       └── portal/
    │           ├── PortalDashboard.jsx
    │           ├── PortalGrievance.jsx
    │           ├── PortalLogin.jsx
    │           └── PortalRights.jsx
    └── utils/
        └── dateUtils.js
        
