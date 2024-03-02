import { fetchPatientInvoices } from '@/app/lib/data';
import PatientTable from '@/app/ui/patients/patient-table';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Patient',
};

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const patientInvoices = await fetchPatientInvoices(params.id);

  console.log(patientInvoices);

  return (
    <main>
      <PatientTable patientInvoices={patientInvoices} />
    </main>
  );
}
