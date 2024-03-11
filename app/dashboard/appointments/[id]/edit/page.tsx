import Form from '@/app/ui/appointments/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import {
  fetchPatients,
  fetchAppointmentById,
  fetchDoctors,
} from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Appointment',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const [appointment, patients, doctors] = await Promise.all([
    fetchAppointmentById(id),
    fetchPatients(),
    fetchDoctors(),
  ]);

  if (!appointment) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'الحجوزات', href: '/dashboard/appointments' },
          {
            label: 'تعديل الحجز',
            href: `/dashboard/appointments/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form appointment={appointment} patients={patients} doctors={doctors} />
    </main>
  );
}
