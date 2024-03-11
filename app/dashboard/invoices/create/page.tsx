import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchPatients, fetchDoctors } from '@/app/lib/data';
import { Metadata } from 'next';
import { formatISO } from 'date-fns';

export const metadata: Metadata = {
  title: 'Create Invoice',
};

export default async function Page() {
  const patients = await fetchPatients();
  const doctors = await fetchDoctors();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'الفواتير', href: '/dashboard/invoices' },
          {
            label: 'ادخل فاتوره',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form patients={patients} doctors={doctors} />
    </main>
  );
}
