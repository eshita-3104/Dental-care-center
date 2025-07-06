import { useMemo } from 'react';
import { usePatients } from '../context/PatientContext';
import { isFuture, parseISO, compareAsc, format} from 'date-fns';
import StatCard from '../components/dashboard/StatCard';
import type { Incident } from '../types';

export default function DashboardPage() {
  const { patients, incidents, isLoading } = usePatients();

  const dashboardStats = useMemo(() => {
    if (isLoading || !incidents || !patients) {
      return {
        totalPatients: 0,
        upcomingAppointments: 0,
        totalRevenue: 0,
        nextAppointments: [],
      };
    }

    const upcoming = incidents
      .filter(i => i && i.appointmentDate) 
      .filter(i => {
        try {
          return isFuture(parseISO(i.appointmentDate));
        } catch (error) {
          return false;
        }
      })
      .sort((a, b) => compareAsc(parseISO(a.appointmentDate), parseISO(b.appointmentDate)));

    const revenue = incidents
  .filter(i => i.status === 'Completed' && i.cost)
  .reduce((sum, i) => sum + Number(i.cost || 0), 0); // Use Number() to force addition
      
    const statusCounts = incidents.reduce((acc, incident) => {
        acc[incident.status] = (acc[incident.status] || 0) + 1;
        return acc;
      }, {} as Record<Incident['status'], number>);
 

    return {
      totalPatients: patients.length,
      upcomingAppointments: upcoming.length,
      totalRevenue: revenue.toFixed(2),
      nextAppointments: upcoming.slice(0, 5),
      statusCounts,
    };
  }, [patients, incidents, isLoading]);

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }
  
  const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
  const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
  const DollarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 12v.01M12 12a2 2 0 010 4m0-4a2 2 0 000 4m0-4v.01M12 12a2 2 0 010 4m0-4a2 2 0 000 4m-4-2v.01M16 12v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600 mb-6">Welcome back, Admin! Here are your key metrics.</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> {/* Changed to 4 columns */}
        <StatCard title="Total Patients" value={dashboardStats.totalPatients} icon={<UsersIcon />} />
        <StatCard title="Upcoming Appointments" value={dashboardStats.upcomingAppointments} icon={<CalendarIcon />} />
        <StatCard title="Total Revenue" value={`$${dashboardStats.totalRevenue}`} icon={<DollarIcon />} />
        {/* New Status Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm font-medium text-gray-500 mb-2">Treatment Status</p>
            <div className="space-y-1 text-lg font-bold">
                <p className="text-yellow-600">Scheduled: {dashboardStats.statusCounts?.Scheduled || 0}</p>
                <p className="text-green-600">Completed: {dashboardStats.statusCounts?.Completed || 0}</p>
                <p className="text-red-600">Cancelled: {dashboardStats.statusCounts?.Cancelled || 0}</p>
            </div>
        </div>
      </div>

      {/* Upcoming Appointments List */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Next Appointments</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <ul className="divide-y divide-gray-200">
            {dashboardStats.nextAppointments.length > 0 ? (
              dashboardStats.nextAppointments.map(apt => (
                <li key={apt.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{apt.title}</p>
                    <p className="text-sm text-gray-500">
                      Patient: {patients.find(p => p.id === apt.patientId)?.name || 'Unknown'}
                    </p>
                  </div>
                  <div className="text-right">
                     <p className="font-medium text-gray-800">{format(parseISO(apt.appointmentDate), 'PP')}</p>
                     <p className="text-sm text-gray-500">{format(parseISO(apt.appointmentDate), 'p')}</p>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming appointments.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}