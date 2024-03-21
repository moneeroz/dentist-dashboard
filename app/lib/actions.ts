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
  appointment_date: z.string({
    required_error: '.Please select a appointment date',
  }),
  reason: z.string({ required_error: '.Please enter a reason for the visit' }),
  name: z.string().min(3, { message: '.Please enter the patient name' }),
  phone: z.string().optional(),
});

export type State = {
  errors?: {
    patientId?: string[];
    doctorId?: string[];
    amount?: string[];
    status?: string[];
    appointment_date?: string[];
    reason?: string[];
    name?: string[];
    phone?: string[];
  };
  message?: string | null;
};

const CreateInvoice = FormSchema.omit({
  id: true,
  date: true,
  appointment_date: true,
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
  appointment_date: true,
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

const CreateAppointment = FormSchema.omit({
  id: true,
  date: true,
  amount: true,
  status: true,
  name: true,
  phone: true,
});

export const createAppointment = async (
  prevState: State,
  formData: FormData,
) => {
  // Validate form fields using Zod
  const validatedFields = CreateAppointment.safeParse({
    patientId: formData.get('patientId'),
    doctorId: formData.get('doctorId'),
    appointment_date: formData.get('appointment_date'),
    reason: formData.get('reason'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '.Missing Fields. Failed to Create Appointment',
    };
  }

  // Prepare data for insertion into the database
  const { patientId, doctorId, appointment_date, reason } =
    validatedFields.data;

  const appointmentDate = formatISO(new Date(appointment_date));

  const date = formatISO(new Date());

  // Insert data into the database
  try {
    await sql`
      INSERT INTO appointments (patient_id, doctor_id, appointment_date, reason, date)
      VALUES (${patientId}, ${doctorId}, ${appointmentDate}, ${reason}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: '.Database Error: Failed to Create Appointment',
    };
  }

  // Revalidate the cache for the appointments page and redirect the user
  revalidatePath('/dashboard/appointments');
  redirect('/dashboard/appointments');
};

const UpdateAppointment = FormSchema.omit({
  id: true,
  date: true,
  amount: true,
  status: true,
  name: true,
  phone: true,
});

export const updateAppointment = async (
  id: string,
  prevState: State,
  formData: FormData,
) => {
  const validatedFields = UpdateAppointment.safeParse({
    patientId: formData.get('patientId'),
    doctorId: formData.get('doctorId'),
    appointment_date: formData.get('appointment_date'),
    reason: formData.get('reason'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '.Missing Fields. Failed to Update Appointment',
    };
  }

  const { patientId, doctorId, appointment_date, reason } =
    validatedFields.data;

  const appointmentDate = formatISO(new Date(appointment_date));

  try {
    await sql`
      UPDATE Appointments
      SET patient_id = ${patientId}, doctor_id = ${doctorId}, appointment_date = ${appointmentDate}, reason = ${reason}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: '.Database Error: Failed to Update Appointment' };
  }

  revalidatePath('/dashboard/appointments');
  redirect('/dashboard/appointments');
};

export const deleteAppointment = async (id: string) => {
  try {
    await sql`DELETE FROM Appointments WHERE id = ${id}`;
    revalidatePath('/dashboard/appointments');
    return { message: 'Deleted Appointment.' };
  } catch (error) {
    return { message: '.Database Error: Failed to Delete Appointment' };
  }
};

const CreatePatient = FormSchema.omit({
  id: true,
  patientId: true,
  doctorId: true,
  amount: true,
  status: true,
  appointment_date: true,
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
  if (!phone) {
    try {
      await sql`
        INSERT INTO Patients (name, created_at)
        VALUES (${name}, ${created_at})
      `;
    } catch (error) {
      // If a database error occurs, return a more specific error.
      return {
        message: '.Database Error: Failed to Create Patient',
      };
    }
  } else {
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
  }

  // Revalidate the cache for the create page and redirect the user
  const type = formData.get('type');

  if (!type) {
    revalidatePath('/dashboard/patients');
    redirect('/dashboard/patients');
  }
  revalidatePath(`/dashboard/${type}/create`);
  redirect(`/dashboard/${type}/create`);
};
const UpdatePatient = FormSchema.omit({
  id: true,
  patientId: true,
  doctorId: true,
  amount: true,
  status: true,
  appointment_date: true,
  reason: true,
  date: true,
});

export const updatePatient = async (
  id: string,
  prevState: State,
  formData: FormData,
) => {
  // Validate form fields using Zod
  const validatedFields = UpdatePatient.safeParse({
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

  // update data in the database

  try {
    await sql`
      UPDATE Patients
      SET name = ${name}, phone = ${phone}
      WHERE id = ${id}
      `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: '.Database Error: Failed to Create Patient',
    };
  }

  // Revalidate the cache for the create page and redirect the user
  revalidatePath(`/dashboard/patients`);
  redirect(`/dashboard/patients`);
};

export const deletePatient = async (id: string) => {
  try {
    await sql`DELETE FROM Patients WHERE id = ${id}`;
    revalidatePath('/dashboard/patients');
    return { message: 'Deleted Patient.' };
  } catch (error) {
    return { message: '.Database Error: Failed to Delete Patient' };
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
