import Form from '@/app/ui/appointments/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchPatients, fetchDoctors } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Appointment',
};

export default async function Page() {
  const patients = await fetchPatients();
  const doctors = await fetchDoctors();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'الحجوزات', href: '/dashboard/appointments' },
          {
            label: 'ادخل الحجز',
            href: '/dashboard/appointments/create',
            active: true,
          },
        ]}
      />
      <Form patients={patients} doctors={doctors} />
    </main>
  );
}
