import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import React from 'react';
import Form from '@/app/ui/patients/create-form';

export default function Page({
  searchParams,
}: {
  searchParams?: { type?: string };
}) {
  const type = searchParams?.type;
  console.log(type);

  const breadcrumbs =
    type === 'bookings'
      ? [
          { label: 'الحجوزات', href: '/dashboard/bookings' },
          {
            label: 'ادخل الحجز',
            href: '/dashboard/bookings/create',
          },
          {
            label: 'ادخل المريض ',
            href: '/dashboard/patients/create?type=bookings',
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
