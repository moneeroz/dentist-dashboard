'use client';

import { PatientField, DoctorField } from '@/app/lib/definitions';
import Link from 'next/link';
import { DocumentTextIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createAppointment } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import Select from 'react-select';

import { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';

import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { CreatePatient } from './buttons';

type options = {
  value: string;
  label: string;
};

export default function Form({
  patients,
  doctors,
}: {
  patients: PatientField[];
  doctors: DoctorField[];
}) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createAppointment, initialState);

  const [value, setValue] = useState<Date | null>(new Date());

  const options: options[] = patients.map((patient) => {
    return { value: patient.id, label: patient.name };
  });

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Patient Name */}
        <div className="mb-4">
          <label htmlFor="patient" className="mb-2 block text-sm font-medium">
            اختار مريض
          </label>
          <div className="relative">
            <Select
              id="patient"
              name="patientId"
              options={options}
              aria-describedby="patient-error"
              placeholder="حدد المريض..."
            />
          </div>
          <div id="patient-error" aria-live="polite" aria-atomic="true">
            {state.errors?.patientId &&
              state.errors.patientId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* New Patient */}
        <div className="mb-4">
          <CreatePatient params="appointments" />
        </div>

        {/* Doctor Name */}
        <div className="mb-4">
          <label htmlFor="doctor" className="mb-2 block text-sm font-medium">
            اختار دكتور
          </label>
          <div className="relative">
            <select
              id="doctor"
              name="doctorId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="doctor-error"
            >
              <option value="" disabled>
                حدد الدكتور
              </option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="doctor-error" aria-live="polite" aria-atomic="true">
            {state.errors?.doctorId &&
              state.errors.doctorId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Visit Reason */}
        <div className="mb-4">
          <label htmlFor="reason" className="mb-2 block text-sm font-medium">
            نوع الزيارة
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="reason"
                name="reason"
                type="text"
                placeholder="ادخل سبب الزيارة"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="reason-error"
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="reason-error" aria-live="polite" aria-atomic="true">
            {state.errors?.amount &&
              state.errors.amount.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Appointment Date and Time */}

        <div className="mb-4">
          <label
            htmlFor="appointment_date"
            className="mb-2 block text-sm font-medium"
          >
            تاريخ الزيارة
          </label>
          <div className="relative mt-2 rounded-md">
            <DateTimePicker
              id="appointment_date"
              name="appointment_date"
              onChange={setValue}
              value={value}
              format="a  m:h  d-M-y"
              locale="ar"
              minDate={new Date()}
              aria-describedby="appointment_date-error"
            />
          </div>

          <div
            id="appointment-date-error"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.errors?.appointment_date &&
              state.errors.appointment_date.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/appointments"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          قم بالإلغاء
        </Link>
        <Button type="submit">إنشاء الحجز</Button>
      </div>
    </form>
  );
}
