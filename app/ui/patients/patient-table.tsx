import { marhey } from '@/app/ui/fonts';
import { formattedPatientTable } from '@/app/lib/definitions';
import InvoiceStatus from '../invoices/status';
import { formatDateToLocal } from '@/app/lib/utils';

export default async function PatientTable({
  patientInvoices,
}: {
  patientInvoices: formattedPatientTable[];
}) {
  return (
    <div className="w-full">
      <h1 className={`${marhey.className} mb-8 text-xl md:text-2xl`}>
        {patientInvoices[0]?.name}
      </h1>

      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {patientInvoices?.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div>
                            <p>{invoice.doctor}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {invoice.reason}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`${marhey.className} flex w-full items-center justify-between border-b py-5 text-sm`}
                    >
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">الإجمالي</p>
                        <p>{invoice.amount} </p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">الحالة</p>
                        <div className="w-fit">
                          <InvoiceStatus status={invoice.status} />
                        </div>
                      </div>
                    </div>

                    <div className="flex w-1/2 flex-col pt-5">
                      <p className="text-xs">التاريخ</p>
                      <p className={`${marhey.className} font-medium`}>
                        {formatDateToLocal(invoice.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-right text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      الدكتور
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      سبب الزيارة
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      المبلغ
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      التاريخ
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      الحالة
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {patientInvoices.map((invoice) => (
                    <tr key={invoice.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div>
                          <p>{invoice.doctor}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {invoice.reason}
                      </td>
                      <td
                        className={`${marhey.className} whitespace-nowrap bg-white px-4 py-5 text-sm`}
                      >
                        {invoice.amount}
                      </td>
                      <td
                        className={`${marhey.className} whitespace-nowrap bg-white px-4 py-5 text-sm`}
                      >
                        {formatDateToLocal(invoice.date)}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                        <InvoiceStatus status={invoice.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
