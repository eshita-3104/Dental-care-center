import type { Patient } from '../../types';
import { Link } from 'react-router-dom';

interface PatientTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (patientId: string) => void;
}

export default function PatientTable({ patients, onEdit, onDelete }: PatientTableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <tbody className="bg-white divide-y divide-gray-200">
          {patients.map((patient) => (
            <tr key={patient.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link to={`/patients/${patient.id}`} className="text-sm font-medium text-sky-600 hover:text-sky-900">
                  {patient.name}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                <button onClick={() => onEdit(patient)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                <button onClick={() => onDelete(patient.id)} className="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}