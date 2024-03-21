import { fetchFilteredPatients } from '@/app/lib/data';
import { marhey } from '../fonts';
import Link from 'next/link';
import { DeletePatient, UpdatePatient } from './buttons';

export default async function PatientsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const patients = await fetchFilteredPatients(query, currentPage);

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {patients?.map((patient) => (
                  <div
                    key={patient.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div>
                            <Link
                              href={`/dashboard/patients/${patient.id}`}
                              className=" hover:text-blue-500"
                            >
                              {patient.name}
                            </Link>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{patient.phone}</p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <UpdatePatient id={patient.id} />
                        <DeletePatient id={patient.id} />
                      </div>
                    </div>
                    <div className="border-b py-4 text-sm">
                      <p className={`${marhey.className}`}>
                        {Number(patient.total_invoices).toLocaleString('ar')}{' '}
                        فواتير
                      </p>
                    </div>
                    <div className="flex w-full items-center justify-between pt-4">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">لم يتم الدفع</p>
                        <p className={`${marhey.className} font-medium`}>
                          {patient.total_pending}
                        </p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">تم الدفع</p>
                        <p className={`${marhey.className} font-medium`}>
                          {patient.total_paid}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-lg text-right text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      الاسم
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      رقم التلفون
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      إجمالي الفواتير
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      إجمالي المتبقي
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      إجمالي المدفوع
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">تعديل</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white text-gray-900">
                  {patients.map((patient) => (
                    <tr key={patient.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div>
                          <Link
                            href={`/dashboard/patients/${patient.id}`}
                            className=" hover:text-blue-500"
                          >
                            {patient.name}
                          </Link>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {patient.phone}
                      </td>
                      <td
                        className={`${marhey.className} whitespace-nowrap bg-white px-4 py-5 text-sm`}
                      >
                        {Number(patient.total_invoices).toLocaleString('ar')}
                      </td>
                      <td
                        className={`${marhey.className} whitespace-nowrap bg-white px-4 py-5 text-sm`}
                      >
                        {patient.total_pending}
                      </td>
                      <td
                        className={`${marhey.className} whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md`}
                      >
                        {patient.total_paid}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdatePatient id={patient.id} />
                          <DeletePatient id={patient.id} />
                        </div>
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
