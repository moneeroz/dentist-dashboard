'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { formatISO } from 'date-fns';

const FormSchema = z.object({
  id: z.string(),
  patientId: z.string({ invalid_type_error: '.Please select a patient' }),
  doctorId: z.string({ invalid_type_error: '.Please select a doctor' }),
  amount: z.coerce
    .number()
    .gt(0, { message: '.Amount must be greater than 0' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: '.Please select an invoice status',
  }),
  date: z.string(),
  booking_date: z.string({ required_error: '.Please select a booking date' }),
  reason: z.string({ required_error: '.Please enter a reason for the visit' }),
  name: z.string().min(3, { message: '.Please enter the patient name' }),
  phone: z
    .string()
    .min(1, { message: '.Please enter the patient phone number' }),
});

export type State = {
  errors?: {
    patientId?: string[];
    doctorId?: string[];
    amount?: string[];
    status?: string[];
    booking_date?: string[];
    reason?: string[];
    name?: string[];
    phone?: string[];
  };
  message?: string | null;
};

const CreateInvoice = FormSchema.omit({
  id: true,
  date: true,
  booking_date: true,
  name: true,
  phone: true,
});

export const createInvoice = async (prevState: State, formData: FormData) => {
  // Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    patientId: formData.get('patientId'),
    doctorId: formData.get('doctorId'),
    amount: formData.get('amount'),
    reason: formData.get('reason'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '.Missing Fields. Failed to Create Invoice',
    };
  }

  // Prepare data for insertion into the database
  const { patientId, doctorId, amount, reason, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = formatISO(new Date());

  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (patient_id, doctor_id, amount, reason, status, date)
      VALUES (${patientId}, ${doctorId}, ${amountInCents}, ${reason}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: '.Database Error: Failed to Create Invoice',
    };
  }

  // Revalidate the cache for the invoices page and redirect the user
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
};

const UpdateInvoice = FormSchema.omit({
  id: true,
  date: true,
  booking_date: true,
  name: true,
  phone: true,
});

export const updateInvoice = async (
  id: string,
  prevState: State,
  formData: FormData,
) => {
  const validatedFields = UpdateInvoice.safeParse({
    patientId: formData.get('patientId'),
    doctorId: formData.get('doctorId'),
    amount: formData.get('amount'),
    reason: formData.get('reason'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '.Missing Fields. Failed to Update Invoice',
    };
  }

  const { patientId, doctorId, amount, reason, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET patient_id = ${patientId}, doctor_id = ${doctorId}, amount = ${amountInCents}, reason = ${reason}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: '.Database Error: Failed to Update Invoice' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
};

export const deleteInvoice = async (id: string) => {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: '.Database Error: Failed to Delete Invoice' };
  }
};
const CreateBooking = FormSchema.omit({
  id: true,
  date: true,
  amount: true,
  status: true,
  name: true,
  phone: true,
});

export const createBooking = async (prevState: State, formData: FormData) => {
  // Validate form fields using Zod
  const validatedFields = CreateBooking.safeParse({
    patientId: formData.get('patientId'),
    doctorId: formData.get('doctorId'),
    booking_date: formData.get('booking_date'),
    reason: formData.get('reason'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '.Missing Fields. Failed to Create Booking',
    };
  }

  // Prepare data for insertion into the database
  const { patientId, doctorId, booking_date, reason } = validatedFields.data;

  const bookingDate = formatISO(new Date(booking_date));

  const date = formatISO(new Date());

  // Insert data into the database
  try {
    await sql`
      INSERT INTO bookings (patient_id, doctor_id, booking_date, reason, date)
      VALUES (${patientId}, ${doctorId}, ${bookingDate}, ${reason}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: '.Database Error: Failed to Create Booking',
    };
  }

  // Revalidate the cache for the bookings page and redirect the user
  revalidatePath('/dashboard/bookings');
  redirect('/dashboard/bookings');
};

const UpdateBooking = FormSchema.omit({
  id: true,
  date: true,
  amount: true,
  status: true,
  name: true,
  phone: true,
});

export const updateBooking = async (
  id: string,
  prevState: State,
  formData: FormData,
) => {
  const validatedFields = UpdateBooking.safeParse({
    patientId: formData.get('patientId'),
    doctorId: formData.get('doctorId'),
    booking_date: formData.get('booking_date'),
    reason: formData.get('reason'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '.Missing Fields. Failed to Update Booking',
    };
  }

  const { patientId, doctorId, booking_date, reason } = validatedFields.data;

  const bookingDate = formatISO(new Date(booking_date));

  try {
    await sql`
      UPDATE Bookings
      SET patient_id = ${patientId}, doctor_id = ${doctorId}, booking_date = ${bookingDate}, reason = ${reason}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: '.Database Error: Failed to Update Booking' };
  }

  revalidatePath('/dashboard/bookings');
  redirect('/dashboard/bookings');
};

export const deleteBooking = async (id: string) => {
  try {
    await sql`DELETE FROM Bookings WHERE id = ${id}`;
    revalidatePath('/dashboard/bookings');
    return { message: 'Deleted Booking.' };
  } catch (error) {
    return { message: '.Database Error: Failed to Delete Booking' };
  }
};

const CreatePatient = FormSchema.omit({
  id: true,
  patientId: true,
  doctorId: true,
  amount: true,
  status: true,
  booking_date: true,
  reason: true,
  date: true,
});

export const createPatient = async (prevState: State, formData: FormData) => {
  // Validate form fields using Zod
  const validatedFields = CreatePatient.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '.Missing Fields. Failed to Create Patient',
    };
  }

  // Prepare data for insertion into the database
  const { name, phone } = validatedFields.data;

  const created_at = formatISO(new Date());

  // Insert data into the database
  try {
    await sql`
      INSERT INTO Patients (name, phone, created_at)
      VALUES (${name}, ${phone}, ${created_at})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: '.Database Error: Failed to Create Patient',
    };
  }

  // Revalidate the cache for the create page and redirect the user
  const type = formData.get('type');

  if (type === 'bookings') {
    revalidatePath(`/dashboard/bookings/create`);
    redirect(`/dashboard/bookings/create`);
  } else {
    revalidatePath(`/dashboard/invoices/create`);
    redirect(`/dashboard/invoices/create`);
  }
};

export const authenticate = async (
  prevState: string | undefined,
  formData: FormData,
) => {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return '.Invalid credentials';
        default:
          return '.Something went wrong';
      }
    }
    throw error;
  }
};
