import { deleteAppointment } from '@/app/lib/actions';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function CreatePatient({ params }: { params?: string }) {
  return (
    <Link
      href={`/dashboard/patients/create${params ? `?type=${params}` : ''}`}
      className=" flex h-10 w-fit items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span> مريض جديد؟</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function CreateAppointment() {
  return (
    <Link
      href="/dashboard/appointments/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">حجز جديد</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateAppointment({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/appointments/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteAppointment({ id }: { id: string }) {
  const deleteAppointmentWithId = deleteAppointment.bind(null, id);

  return (
    <form action={deleteAppointmentWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
