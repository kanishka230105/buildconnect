# 🏗️ BuildConnect

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

**BuildConnect** is a collaborative platform designed to streamline communication, manage workflows, and bridge the gap between all stakeholders in construction and project builds. Whether you are managing construction tasks, collaborating with contractors, or tracking milestones, BuildConnect brings everyone onto the same page.

---

## 🚀 Features

- **Collaborative Workspaces:** Centralized dashboard for developers, contractors, and project owners.
- **Milestone Tracking:** Visualize project progress with interactive timelines and task management.
- **Real-Time Communication:** Direct updates and instant alerts for project status changes.
- **Resource Management:** Keep track of materials, budgets, and personnel in one place.

---

## 🛠️ Tech Stack (Suggested)

Here is a recommended starting point for the development of BuildConnect:

- **Frontend:** React / Next.js / TypeScript
- **Styling:** Tailwind CSS / Vanilla CSS
- **Backend:** Node.js / Express
- **Database:** PostgreSQL / MongoDB
- **Real-time:** WebSockets / Socket.io

---

## 📦 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (v18.x or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sharmadhrv/buildconnect.git
   cd buildconnect
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add your configurations:
   ```env
   PORT=3000
   DATABASE_URL=your-database-connection-url
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```text
buildconnect/
├── public/             # Static assets (images, icons, etc.)
├── src/                # Source code files
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page views and layouts
│   ├── styles/         # Styling and design system configuration
│   └── utils/          # Helper functions and hooks
├── .gitignore          # Files to exclude from git
├── LICENSE             # Project license details
└── README.md           # Project documentation
```

---

## 🗺️ Roadmap

- [ ] Interactive Gantt Chart / Timeline view
- [ ] Role-based access control (Admin, Contractor, Client)
- [ ] Automated daily digest emails and push notifications
- [ ] Mobile-responsive client application

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [LICENSE](file:///k:/buildconnect/LICENSE) for more information.

---

## 💅 Recent UI/UX Polish & Refactoring Updates

We have recently refactored and polished the UI/UX, implemented metric navigation, and refactored dynamic document states. Here is a summary of the updates:

### 1. Scrollable Builder Bid Review Modal
* **File:** [Modal.tsx](file:///k:/buildconnect/frontend/components/ui/Modal.tsx)
* **Adjustment:** Added `max-h-[calc(100vh-2rem)]` and `overflow-y-auto` to the modal container to prevent tall cost breakdown tables or negotiation forms from overflowing the screen.

### 2. High-Contrast Global Buttons & Overrides
* **File:** [globals.css](file:///k:/buildconnect/frontend/app/globals.css)
* **Adjustment:** Fixed the light-theme contrast bug where text color of buttons containing `.text-white` would render as slate on cream background. Enforced white text for primary, secondary, and danger buttons. Added `.text-slate-200` to the dark-slate overrides to prevent light gray text visibility issues on white cards.
* **File:** [Badge.tsx](file:///k:/buildconnect/frontend/components/ui/Badge.tsx)
* **Adjustment:** Adjusted `sm` badge line-height from `leading-3` to `leading-normal` to prevent vertical text clipping.

### 3. Sidebar Layout & Alignment Sizing (All Roles)
* **Files:** [builder/layout.tsx](file:///k:/buildconnect/frontend/app/builder/layout.tsx), [contractor/layout.tsx](file:///k:/buildconnect/frontend/app/contractor/layout.tsx), [admin/layout.tsx](file:///k:/buildconnect/frontend/app/admin/layout.tsx)
* **Adjustment:** Reconfigured vertical padding and margins on widgets. Added `leading-normal` to the Brand title inside the sidebar to ensure the "Build Connect" header text and the Trust Score badges render fully without truncation.

### 4. Admin Dashboard Cream/Slate Theme Integration
* **File:** [admin/layout.tsx](file:///k:/buildconnect/frontend/app/admin/layout.tsx)
* **Adjustment:** Swapped dark-theme colors (`bg-slate-950`, `text-slate-100`) for the premium cream and slate theme (`bg-brand-cream`, `text-brand-slate`) and matched the sidebar branding styling with the other roles.
* **File:** [admin/dashboard/page.tsx](file:///k:/buildconnect/frontend/app/admin/dashboard/page.tsx)
* **Adjustment:** Adapted tab borders and active text color to use the brand orange (`border-brand-orange text-brand-orange`). Wrapped component in a `<Suspense>` block and implemented search parameters parsing (`?tab=...`) to switch tabs dynamically. Replaced count values with high-contrast text colors.

### 5. Interactive Responsive Metric Cards
* **Files:** [builder/dashboard/page.tsx](file:///k:/buildconnect/frontend/app/builder/dashboard/page.tsx), [contractor/dashboard/page.tsx](file:///k:/buildconnect/frontend/app/contractor/dashboard/page.tsx), [admin/dashboard/page.tsx](file:///k:/buildconnect/frontend/app/admin/dashboard/page.tsx)
* **Adjustment:** Fluidly aligned metric card layouts using `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4` (and `xl:grid-cols-5` for admin overview). Wrapped each KPI card in a Next.js `<Link>` element targeting its dedicated dashboard sub-route (or tab url) with hover animations (`cursor-pointer hover:scale-[1.01] transition-all`).

### 6. Localized Onboarding Wizard Confirmation States
* **File:** [contractor/profile/page.tsx](file:///k:/buildconnect/frontend/app/contractor/profile/page.tsx)
* **Adjustment:** Removed global top-of-screen alert banners. Introduced separate inline state variables (`businessSuccess/Error`, `specialtiesSuccess/Error`, `verificationSuccess/Error`) rendered cleanly beside their respective action buttons.

### 7. Read-Only Approved Profile States & Warning Flags
* **File:** [contractor/profile/page.tsx](file:///k:/buildconnect/frontend/app/contractor/profile/page.tsx)
* **Adjustment:** If the contractor's profile is already verified and approved, it renders active details as read-only labels and list badges. An "Edit Profile" action button toggles form inputs and displays a warning: `"Editing your details will tag modifications as Pending Admin Approval without displacing existing verified details."`

### 8. Identity & Trade Certification Upload Summary Card
* **File:** [contractorRepository.ts](file:///k:/buildconnect/backend/repositories/contractorRepository.ts)
* **Adjustment:** Modified backend queries in `getProfile` to join and return the contractor's uploaded verification documents.
* **File:** [contractor/profile/page.tsx](file:///k:/buildconnect/frontend/app/contractor/profile/page.tsx)
* **Adjustment:** Prefills state with documents. If documents exist, displays a "Verification Summary" Info Card displaying: Masked Aadhaar (`XXXX-XXXX-1234`), Masked PAN (`ABCXXXXX99`), unmasked Trade License ID, and Verification Status. The upload drop boxes are replaced by small row element cards with a direct "View" document action. An "Update Verification Documents" button is provided to toggle back to the upload forms.