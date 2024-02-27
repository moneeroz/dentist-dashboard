import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import { LatestBooking } from '@/app/lib/definitions';
import { fetchLatestBookings } from '@/app/lib/data';
import { formatDateTimeToLocal } from '@/app/lib/utils';
export default async function LatestBookings() {
  const latestBookings: LatestBooking[] = await fetchLatestBookings();

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        آخر الحجوزات
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {latestBookings.map((booking, i) => {
            return (
              <div
                key={booking.id}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className="flex items-center">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {booking.name}
                    </p>
                    <p className=" text-sm text-gray-700 sm:block">
                      {booking.doctor} - ({booking.reason})
                    </p>
                  </div>
                </div>
                <p
                  className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                >
                  {formatDateTimeToLocal(booking.booking_date)}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">تم التحديث للتو</h3>
        </div>
      </div>
    </div>
  );
}
