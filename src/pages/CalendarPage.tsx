// src/pages/CalendarPage.tsx
import CalendarView from "../components/calendar/CalendarView";

export default function CalendarPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Appointment Calendar</h1>
      <CalendarView />
    </div>
  );
}