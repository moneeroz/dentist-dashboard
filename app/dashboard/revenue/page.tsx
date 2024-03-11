import { fetchDoctors, fetchYearRevenue } from '@/app/lib/data';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { marhey } from '@/app/ui/fonts';
import CardWrapper from '@/app/ui/revenue/cards';
import Filter from '@/app/ui/revenue/filter';
import RevenueChart from '@/app/ui/revenue/revenue-chart';
import {
  CardsSkeleton,
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
} from '@/app/ui/skeletons';
import { auth } from '@/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Revenue',
};

export default async function Page({
  searchParams,
}: {
  searchParams: { month: string; year: string; doctor?: string };
}) {
  const { month, year, doctor } = searchParams;

  const data = await fetchYearRevenue();

  const doctors = await fetchDoctors();

  const session = await auth();
  const role = session?.user?.role;

  if (role === 'user') {
    redirect('/dashboard/revenue/access-denied');
  }

  return (
    <main>
      <h1 className={`${marhey.className} mb-4 text-xl md:text-2xl`}>الملخص</h1>
      <Filter doctors={doctors} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper month={month} year={year} doctor={doctor} />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart data={data} />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}
