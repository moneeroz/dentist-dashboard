import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import React from 'react';
import Form from '@/app/ui/patients/create-form';

export default function Page({
  searchParams,
}: {
  searchParams?: { type?: string };
}) {
  const type = searchParams?.type;

  const breadcrumbs =
    type === 'appointments'
      ? [
          { label: 'الحجوزات', href: '/dashboard/appointments' },
          {
            label: 'ادخل الحجز',
            href: '/dashboard/appointments/create',
          },
          {
            label: 'ادخل المريض ',
            href: '/dashboard/patients/create?type=appointments',
            active: true,
          },
        ]
      : [
          { label: 'الفواتير', href: '/dashboard/invoices' },
          {
            label: 'ادخل فاتوره',
            href: '/dashboard/invoices/create',
          },
          {
            label: 'ادخل المريض ',
            href: '/dashboard/patients/create?type=invoices',
            active: true,
          },
        ];

  return (
    <main>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Form type={type} />
    </main>
  );
}
