import {
  BanknotesIcon,
  ClockIcon,
  CalendarDaysIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { marhey } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';

const iconMap = {
  collected: BanknotesIcon,
  today: CalendarDaysIcon,
  pending: ClockIcon,
  tomorrow: CalendarIcon,
};

export default async function CardWrapper() {
  const {
    numberOfAppointmentsToday,
    numberOfAppointmentsTomorrow,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  return (
    <>
      <Card
        title="حجوزات اليوم"
        value={numberOfAppointmentsToday}
        type="today"
      />
      <Card
        title="حجوزات الغد"
        value={numberOfAppointmentsTomorrow}
        type="tomorrow"
      />
      <Card title="المدفوع" value={totalPaidInvoices} type="collected" />
      <Card title="الغير مدفوع" value={totalPendingInvoices} type="pending" />
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
  type: 'today' | 'tomorrow' | 'pending' | 'collected';
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
