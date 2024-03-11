'use client';

import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createPatient } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { useState } from 'react';
import clsx from 'clsx';

export default function Form() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createPatient, initialState);

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <label
        onClick={toggleVisibility}
        className="mb-2 block text-sm font-medium transition-colors hover:cursor-pointer hover:text-blue-500"
      >
        مريض جديد؟
      </label>
      <div className={clsx({ hidden: !isVisible })}>
        <div className="flex gap-5">
          {/* name */}
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              اسم المريض
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="ادخل اسم المريض"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="name-error"
                />
                <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state.errors?.name &&
                state.errors.name.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          {/* phone */}
          <div className="mb-4">
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              رقم التلفون
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="ادخل رقم التلفون"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="phone-error"
                />
                <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div id="phone-error" aria-live="polite" aria-atomic="true">
              {state.errors?.phone &&
                state.errors.phone.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          <div className="mr-2 mt-7 ">
            <Button formAction={dispatch}>إضافة المريض</Button>
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          )}
        </div>
      </div>
    </>
  );
}
