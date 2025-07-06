# Dental Center Management Dashboard

A comprehensive frontend application for ENTNT Dental Center, built with React and TypeScript. This dashboard allows administrators (dentists) to manage patients and their appointments (incidents), while providing a secure portal for patients to view their own records.

---

**Live Demo Link:** [**https://dental-care-center.vercel.app/**]

**GitHub Repository:** [**https://github.com/eshita-3104/Dental-care-center.git**]

---

## Core Features

* **Simulated User Authentication**: Role-based access control for **Admin** and **Patient** users with session persistence.
* **Patient Management (Admin)**: Full CRUD (Create, Read, Update, Delete) functionality for patient records.
* **Appointment/Incident Management (Admin)**: Manage multiple incidents per patient, including post-appointment details like cost, treatment notes, and file uploads.
* **File Uploads**: A complete UI for "uploading" files (Invoices, X-Rays) and saving them as base64 strings in `localforage`.
* **Dynamic Calendar View**: A responsive monthly calendar that visually displays all scheduled appointments. Clicking a day opens a modal with that day's schedule.
* **KPI Dashboard**: A landing page for admins showing key metrics like total patients, upcoming appointments, total revenue, and treatment status breakdowns.
* **Secure Patient Portal**: A read-only view for patients to see their own upcoming appointments, history, costs, and download attached files.
* **Fully Responsive Design**: The UI is optimized for all devices, from mobile phones to desktops, using a mobile-first approach.

---

## Tech Stack

* **Framework**: React (with Vite)
* **Language**: TypeScript
* **Routing**: React Router
* **State Management**: React Context API with the `useReducer` hook for scalable state logic.
* **Styling**: Tailwind CSS
* **Date Management**: `date-fns`
* **Local Storage**: `localforage` for a cleaner, promise-based API over `localStorage`.

---

## Local Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/eshita-3104/Dental-care-center.git
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

---

## Architecture & Technical Decisions
* **State Management (Context API + useReducer)**: For managing the application's state, I chose React's built-in Context API over an external library like Redux. This decision was based on the project's scale; Context provides sufficient power for sharing global state (like user authentication and data) without the added boilerplate and dependencies of a larger library. To handle complex state transitions for CRUD operations, I leveraged the useReducer hook. By centralizing all data mutations (Add, Update, Delete) into a pure reducer function, the state logic became more predictable, scalable, and easier to debug than it would be with scattered useState calls.

* **Data Persistence (localforage**): The project required using client-side storage. Instead of interacting with the raw localStorage API—which is synchronous and only stores strings—I chose to use localforage. This library acts as a smart, asynchronous wrapper that provides a simple, promise-based API. It intelligently uses the best available storage method in the browser (preferring IndexedDB and falling back to localStorage), and it handles the serialization of complex objects automatically. This led to cleaner, more readable data-fetching code and prevented potential performance issues from blocking the main thread.

* **Component & Folder Structure**: I implemented a clear, scalable folder structure based on separation of concerns. Top-level pages reside in /pages, globally reusable UI elements in /components/common, feature-specific components in /components/feature, state logic in /context, and data-access logic in /api. This organization makes the codebase intuitive to navigate and maintain. Furthermore, I focused on creating reusable components like <Modal /> and <StatCard />. This approach not only keeps the code DRY (Don't Repeat Yourself) but also ensures a consistent UI and simplifies future updates.

* **Responsive Design (Mobile-First)**: I adopted a mobile-first responsive design strategy using Tailwind CSS. All base styles were written for the smallest screen size by default. I then used Tailwind's responsive prefixes (md:, lg:) to progressively enhance the layout for larger screens. The most complex responsive component was the AdminLayout, which uses a combination of React state and CSS transforms to render an interactive, slide-in navigation drawer on mobile that seamlessly transitions to a static, visible sidebar on desktops.

---

## Challenges & Solutions

One of the most significant challenges was a series of environment and tooling issues during the initial setup of **Tailwind CSS**.

* **Problem**: The project automatically installed the brand new Tailwind CSS v4, which had tooling bugs with the official VS Code extension, preventing styles from being applied.
* **Solution**: After methodical debugging (verifying paths, clearing cache, updating npm), I made a strategic decision to **downgrade to the stable Tailwind CSS v3**. This is a common real-world practice to ensure project stability over using a bleeding-edge version. The final fix required creating a workspace-specific `.vscode/settings.json` file to explicitly force the editor to associate `.css` files with Tailwind, resolving the stubborn configuration issue.

* Managing Stale State & Ensuring Data Consistency:
* **Problem**: After a CRUD operation on one page (e.g., updating an appointment's status), other components across the app (like the Dashboard KPIs) would display outdated information until a manual page refresh.
* **Solution**: I engineered the global state management (Context API + useReducer) so that all data mutation functions first update the persistent storage (localforage) and then immediately dispatch an action to the central store. This updated the "in-memory" state, causing all subscribed components to re-render instantly with fresh data and ensuring a reactive, consistent user experience.

This experience was a valuable lesson in debugging not just code, but also the development environment and tooling itself.
