import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchPatients, fetchDoctors, fetchInvoiceById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Invoice',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const [invoice, patients, doctors] = await Promise.all([
    fetchInvoiceById(id),
    fetchPatients(),
    fetchDoctors(),
  ]);

  if (!invoice) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'الفواتير', href: '/dashboard/invoices' },
          {
            label: 'تعديل الفاتوره',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} patients={patients} doctors={doctors} />
    </main>
  );
}
