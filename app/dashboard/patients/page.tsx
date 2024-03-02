import { fetchFilteredPatients } from '@/app/lib/data';
import PatientsTable from '@/app/ui/patients/table';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Patients',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';

  const patients = await fetchFilteredPatients(query);

  return (
    <main>
      <PatientsTable patients={patients} />
    </main>
  );
}
