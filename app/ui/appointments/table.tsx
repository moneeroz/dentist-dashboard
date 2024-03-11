import { DeleteAppointment, UpdateAppointment } from './buttons';
import { formatDateTimeToLocal } from '@/app/lib/utils';
import { fetchFilteredAppointments } from '@/app/lib/data';
import { marhey } from '../fonts';

export default async function AppointmentsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const appointments = await fetchFilteredAppointments(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {appointments?.map((appointment) => (
              <div
                key={appointment.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{appointment.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{appointment.phone}</p>
                  </div>
                  <div>
                    <p className={`${marhey.className}`}>
                      {formatDateTimeToLocal(appointment.appointment_date)}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-sm font-medium">
                      د. {appointment.doctor}
                    </p>
                  </div>
                  <div>
                    <p>{appointment.reason}</p>
                  </div>

                  <div className="flex justify-end gap-2">
                    <UpdateAppointment id={appointment.id} />
                    <DeleteAppointment id={appointment.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-right text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  المريض
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  رقم التلفون
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  تاريخ الحجز
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  سبب الزيارة
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  الدكتور
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">تعديل</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {appointments?.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div>
                      <p>{appointment.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {appointment.phone}
                  </td>
                  <td
                    className={`${marhey.className} whitespace-nowrap px-3 py-3`}
                  >
                    {formatDateTimeToLocal(appointment.appointment_date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {appointment.reason}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {appointment.doctor}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateAppointment id={appointment.id} />
                      <DeleteAppointment id={appointment.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
