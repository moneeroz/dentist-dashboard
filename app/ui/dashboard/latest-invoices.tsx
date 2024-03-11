import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { marhey } from '@/app/ui/fonts';
import { LatestInvoice } from '@/app/lib/definitions';
import { fetchLatestInvoices } from '@/app/lib/data';
export default async function LatestInvoices() {
  const latestInvoices: LatestInvoice[] = await fetchLatestInvoices();

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${marhey.className} mb-4 text-xl md:text-2xl`}>
        آخر الفواتير
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {latestInvoices.map((invoice, i) => {
            return (
              <div
                key={invoice.id}
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
                      {invoice.name}
                    </p>
                    <p className=" text-sm text-gray-700 sm:block">
                      {invoice.doctor}
                    </p>
                  </div>
                </div>
                <p
                  className={`${marhey.className} truncate text-sm font-medium md:text-base`}
                >
                  {invoice.amount}
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
