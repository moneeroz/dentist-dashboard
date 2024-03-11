import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { marhey } from '@/app/ui/fonts';
import { fetchRevenueCardData } from '@/app/lib/data';

const iconMap = {
  collected: BanknotesIcon,
  patients: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default async function CardWrapper({
  month,
  year,
  doctor,
}: {
  month: string;
  year: string;
  doctor?: string;
}) {
  const {
    numberOfInvoices,
    numberOfPatients,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchRevenueCardData(month, year, doctor);

  return (
    <>
      <Card title="المدفوع" value={totalPaidInvoices} type="collected" />
      <Card title="الغير مدفوع" value={totalPendingInvoices} type="pending" />
      <Card title="إجمالي الفواتير" value={numberOfInvoices} type="invoices" />
      <Card title="إجمالي المرضى" value={numberOfPatients} type="patients" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'patients' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${marhey.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value.toLocaleString('ar')}
      </p>
    </div>
  );
}
