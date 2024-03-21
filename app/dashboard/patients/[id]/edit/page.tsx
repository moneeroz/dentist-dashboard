import Form from '@/app/ui/patients/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchPatientById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Patient',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const patient = await fetchPatientById(id);

  if (!patient) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'المرضى', href: '/dashboard/patients' },
          {
            label: 'تعديل المريض',
            href: `/dashboard/patients/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form patient={patient} />
    </main>
  );
}
