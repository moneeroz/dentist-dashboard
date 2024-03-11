'use client';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { months } from '@/app/lib/months';
import { Doctor } from '@/app/lib/definitions';

export default function Filter({ doctors }: { doctors: Doctor[] }) {
  // Initialize state with URL search params or defaults
  const searchParams = useSearchParams();
  const initialMonth =
    searchParams.get('month') || (new Date().getMonth() + 1).toString();
  const initialYear =
    searchParams.get('year') || new Date().getFullYear().toString();

  // Use useState to manage month and year based on URL params or current date
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [doctor, setDoctor] = useState('');

  const pathname = usePathname();
  const { replace } = useRouter();

  // Update the URL when month or year changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('month', month);
    params.set('year', year);
    if (doctor) {
      params.set('doctor', doctor);
    }
    replace(`${pathname}?${params.toString()}`);
  }, [month, year, doctor, pathname, replace]);

  // Handlers for changes in month and year
  const handleYearChange = useDebouncedCallback((year) => {
    setYear(year);
  }, 300);

  const handleMonthChange = useDebouncedCallback((month) => {
    setMonth(month);
  }, 300);

  const handleDoctorChange = useDebouncedCallback((doctor) => {
    setDoctor(doctor);
  }, 300);

  return (
    <div className="mb-8 flex flex-wrap gap-5">
      <div>
        <label htmlFor="year" className="ml-2 text-sm font-medium">
          العام
        </label>
        <input
          id="year"
          name="year"
          type="text"
          value={year}
          onChange={(e) => handleYearChange(e.target.value)}
          className="w-32 rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2"
        />
      </div>
      <div>
        <label htmlFor="month" className=" ml-2 text-sm font-medium">
          الشهر
        </label>
        <select
          name="month"
          id="month"
          value={month}
          onChange={(e) => handleMonthChange(e.target.value)}
          className="cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="doctor" className=" ml-2 text-sm font-medium">
          الدكتور
        </label>
        <select
          name="doctor"
          id="doctor"
          value={doctor}
          onChange={(e) => handleDoctorChange(e.target.value)}
          className="cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
        >
          <option value="">الكل</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
