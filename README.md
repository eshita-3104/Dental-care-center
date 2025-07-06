# Dental Center Management Dashboard

A comprehensive frontend application for ENTNT Dental Center, built with React and TypeScript. This dashboard allows administrators (dentists) to manage patients and their appointments (incidents), while providing a secure portal for patients to view their own records.

---

**Live Demo Link:** [**Your Deployed App Link Here**]

**GitHub Repository:** [**Your GitHub Repository Link Here**]

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
    git clone <your-repo-link>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd dental-dashboard
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

---

## Architecture & Technical Decisions

* **State Management**: I chose the **Context API** over a library like Redux because it's built into React and provides sufficient power for an application of this scale without adding extra dependencies. I separated concerns by creating distinct contexts for Authentication (`AuthContext`) and data (`PatientContext`). For managing CRUD operations, I leveraged the **`useReducer` hook**, which provides a more predictable and robust pattern for state transitions than multiple `useState` calls.

* **Data Persistence**: The project required using `localStorage`. I chose to use **`localforage`**, a library that provides a simple, promise-based API while using `localStorage` (or IndexedDB/WebSQL) under the hood. This improved code readability and abstracted away the synchronous nature of `localStorage`.

* **Component Structure**: I followed a clear component-based architecture, separating files by feature and type (`/pages`, `/components`, `/context`, `/api`). Reusable components like `<Modal />`, `<StatCard />`, and `<PatientTable />` were created to keep the code DRY and maintainable.

* **Responsiveness**: I implemented a **mobile-first** responsive design strategy using Tailwind CSS's breakpoint prefixes (`md:`, `lg:`). This ensures a great user experience on any device. The most complex responsive feature was the admin sidebar, which collapses into a hamburger menu on mobile screens.

---

## Challenges & Solutions

One of the most significant challenges was a series of environment and tooling issues during the initial setup of **Tailwind CSS**.

* **Problem**: The project automatically installed the brand new Tailwind CSS v4, which had tooling bugs with the official VS Code extension, preventing styles from being applied.
* **Solution**: After methodical debugging (verifying paths, clearing cache, updating npm), I made a strategic decision to **downgrade to the stable Tailwind CSS v3**. This is a common real-world practice to ensure project stability over using a bleeding-edge version. The final fix required creating a workspace-specific `.vscode/settings.json` file to explicitly force the editor to associate `.css` files with Tailwind, resolving the stubborn configuration issue.

This experience was a valuable lesson in debugging not just code, but also the development environment and tooling itself.
