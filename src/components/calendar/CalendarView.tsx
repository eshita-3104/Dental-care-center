import { useState } from 'react';
import { usePatients } from '../../context/PatientContext';
import type { Incident } from '../../types';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns';
import Modal from '../common/Modal';

// Hook to manage calendar state and day calculations
function useCalendar(initialDate = new Date()) {
  const [baseDate, setBaseDate] = useState(initialDate);
  const firstOfMonth = startOfMonth(baseDate);
  const lastOfMonth = endOfMonth(baseDate);
  const days = eachDayOfInterval({
    start: startOfWeek(firstOfMonth),
    end: endOfWeek(lastOfMonth),
  });

  const prevMonth = () => setBaseDate(subMonths(baseDate, 1));
  const nextMonth = () => setBaseDate(addMonths(baseDate, 1));

  return { baseDate, days, prevMonth, nextMonth };
}

export default function CalendarView() {
  const { patients, incidents, isLoading } = usePatients();
  const { baseDate, days, prevMonth, nextMonth } = useCalendar();
  const [selected, setSelected] = useState<Date | null>(null);

  // Group incidents by date string
  const appointmentsByDate = new Map<string, Incident[]>();
  incidents.forEach(i => {
    if (!i?.appointmentDate) return;
    const key = format(parseISO(i.appointmentDate), 'yyyy-MM-dd');
    const list = appointmentsByDate.get(key) || [];
    list.push(i);
    appointmentsByDate.set(key, list);
  });

  const openDay = (day: Date) => {
    if (!isSameMonth(day, baseDate)) return; // ignore days outside month
    setSelected(day);
  };

  const renderDay = (day: Date) => {
    const key = format(day, 'yyyy-MM-dd');
    const appts = appointmentsByDate.get(key) || [];
    const isToday = isSameDay(day, new Date());
    const isOtherMonth = !isSameMonth(day, baseDate);

    return (
      <div
        key={day.toISOString()}
        onClick={() => openDay(day)}
        className={[
          'p-2 border rounded-md h-32 flex flex-col cursor-pointer transition',
          isOtherMonth ? 'bg-gray-50 text-gray-400' : 'bg-white',
          isToday ? 'border-blue-500 border-2' : 'border-gray-200 hover:bg-blue-50',
        ].join(' ')}
      >
        <span className="font-medium">{format(day, 'd')}</span>
        <div className="mt-1 flex-grow overflow-auto text-xs space-y-1">
          {appts.map(a => (
            <div key={a.id} className="bg-blue-100 text-blue-800 p-1 rounded truncate">
              {a.title}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="px-3 py-1 bg-gray-200 rounded">Prev</button>
        <h2 className="text-xl font-bold">{format(baseDate, 'MMMM yyyy')}</h2>
        <button onClick={nextMonth} className="px-3 py-1 bg-gray-200 rounded">Next</button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="font-bold text-center text-gray-500 text-sm">
            {d}
          </div>
        ))}
        {days.map(renderDay)}
      </div>

      {selected && (
        <Modal
          isOpen
          onClose={() => setSelected(null)}
          title={`Appointments for ${format(selected, 'PPP')}`}
        >
          {appointmentsByDate.get(format(selected, 'yyyy-MM-dd'))?.length ? (
            <ul className="space-y-3">
              {appointmentsByDate.get(format(selected, 'yyyy-MM-dd'))!.map(a => (
                <li key={a.id} className="border-b pb-2">
                  <p className="font-bold">{a.title}</p>
                  <p className="text-sm text-gray-600">
                    Patient: {patients.find(p => p.id === a.patientId)?.name ?? 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Time: {format(parseISO(a.appointmentDate), 'p')}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No appointments for this day.</p>
          )}
        </Modal>
      )}
    </div>
  );
}
