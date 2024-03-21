import { sql } from '@vercel/postgres';
import {
  PatientField,
  PatientsTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  DoctorField,
  AppointmentsTable,
  AppointmentForm,
  LatestAppointment,
  patientTable,
  YearlyRevenue,
  PatientForm,
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';
import { formatISO } from 'date-fns';

export async function fetchLatestAppointments() {
  noStore();

  try {
    const data = await sql<LatestAppointment>`
      SELECT appointments.reason, patients.name, patients.phone, doctors.name as doctor, appointments.id, appointments.appointment_date
      FROM appointments
      JOIN patients ON appointments.patient_id = patients.id
      JOIN doctors ON appointments.doctor_id = doctors.id
      ORDER BY appointments.appointment_date ASC
      LIMIT 5`;

    const latestAppointments = data.rows;

    return latestAppointments;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest appointments.');
  }
}
export async function fetchLatestInvoices() {
  noStore();

  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, patients.name, patients.phone, doctors.name as doctor, invoices.id
      FROM invoices
      JOIN patients ON invoices.patient_id = patients.id
      JOIN doctors ON invoices.doctor_id = doctors.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));

    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

const today = formatISO(new Date(), { representation: 'date' });

let date = new Date();
date.setDate(date.getDate() + 1);
const tomorrow = formatISO(date, { representation: 'date' });

export async function fetchCardData() {
  noStore();

  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const appointmentsTodayPromise = sql`SELECT COUNT(*) FROM appointments WHERE DATE(Appointment_date) = ${today}`;
    const appointmentsTomorrowPromise = sql`SELECT COUNT(*) FROM appointments WHERE DATE(Appointment_date) = ${tomorrow}`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices WHERE DATE(date) = ${today}`;

    const data = await Promise.all([
      appointmentsTodayPromise,
      appointmentsTomorrowPromise,
      invoiceStatusPromise,
    ]);

    const numberOfAppointmentsToday = Number(data[0].rows[0].count ?? '0');
    const numberOfAppointmentsTomorrow = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfAppointmentsToday,
      numberOfAppointmentsTomorrow,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredAppointments(
  query: string,
  currentPage: number,
) {
  noStore();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const appointments = await sql<AppointmentsTable>`
      SELECT
        appointments.id,
        appointments.reason,
        appointments.date,
        appointments.appointment_date,
        patients.name AS name,
        patients.phone,
        doctors.name AS doctor
      FROM appointments
      JOIN patients ON appointments.patient_id = patients.id
      JOIN doctors ON appointments.doctor_id = doctors.id
      WHERE
        patients.name ILIKE ${`%${query}%`} OR
        patients.phone ILIKE ${`%${query}%`} OR
        doctors.name ILIKE ${`%${query}%`} OR
        appointments.appointment_date::text ILIKE ${`%${query}%`} OR
        appointments.date::text ILIKE ${`%${query}%`} OR
        appointments.reason ILIKE ${`%${query}%`}
      ORDER BY appointments.appointment_date ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return appointments.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch appointments.');
  }
}

export async function fetchAppointmentsPages(query: string) {
  noStore();

  try {
    const count = await sql`SELECT COUNT(*)
    FROM appointments
    JOIN patients ON appointments.patient_id = patients.id
    JOIN doctors ON appointments.doctor_id = doctors.id
    WHERE
      patients.name ILIKE ${`%${query}%`} OR
      patients.phone ILIKE ${`%${query}%`} OR
      doctors.name ILIKE ${`%${query}%`} OR
      appointments.appointment_date::text ILIKE ${`%${query}%`} OR
      appointments.date::text ILIKE ${`%${query}%`} OR
      appointments.reason ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of appointments.');
  }
}

export async function fetchAppointmentById(id: string) {
  noStore();

  try {
    const data = await sql<AppointmentForm>`
      SELECT
        appointments.id,
        appointments.patient_id,
        appointments.appointment_date,
        appointments.reason
      FROM appointments
      WHERE appointments.id = ${id};
    `;

    const appointments = data.rows;

    return appointments[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch appointment.');
  }
}

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.reason,
        invoices.status,
        patients.name AS name,
        patients.phone,
        doctors.name AS doctor
      FROM invoices
      JOIN patients ON invoices.patient_id = patients.id
      JOIN doctors ON invoices.doctor_id = doctors.id
      WHERE
        patients.name ILIKE ${`%${query}%`} OR
        patients.phone ILIKE ${`%${query}%`} OR
        doctors.name ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.reason ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();

  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN patients ON invoices.patient_id = patients.id
    JOIN doctors ON invoices.doctor_id = doctors.id
    WHERE
      patients.name ILIKE ${`%${query}%`} OR
      patients.phone ILIKE ${`%${query}%`} OR
      doctors.name ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.reason ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();

  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.patient_id,
        invoices.amount,
        invoices.reason,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchPatients() {
  noStore();

  try {
    const data = await sql<PatientField>`
      SELECT
        id,
        name
      FROM patients
      ORDER BY name ASC
    `;

    const patients = data.rows;
    return patients;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all patients.');
  }
}

export async function fetchFilteredPatients(
  query: string,
  currentPage: number,
) {
  noStore();
  const ITEMS_PER_PAGE = 8;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<PatientsTableType>`
		SELECT
		  patients.id,
		  patients.name,
		  patients.phone,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM patients
		LEFT JOIN invoices ON patients.id = invoices.patient_id
		WHERE
		  patients.name ILIKE ${`%${query}%`} OR
        patients.phone ILIKE ${`%${query}%`}
		GROUP BY patients.id, patients.name, patients.phone
		ORDER BY patients.name ASC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
	  `;

    const patients = data.rows.map((patient) => ({
      ...patient,
      total_pending: formatCurrency(patient.total_pending),
      total_paid: formatCurrency(patient.total_paid),
    }));

    return patients;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch patient table.');
  }
}
export async function fetchPatientsPages(query: string) {
  noStore();

  const ITEMS_PER_PAGE = 8;
  try {
    const count = await sql`SELECT COUNT(*)
    FROM patients
    WHERE
      patients.name ILIKE ${`%${query}%`} OR
      patients.phone ILIKE ${`%${query}%`}
     
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

// fetch patient invoices by patient id

export async function fetchPatientInvoices(id: string) {
  noStore();

  try {
    const data = await sql<patientTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.reason,
        invoices.status,
        doctors.name AS doctor,
        patients.name AS name
      FROM invoices
      JOIN doctors ON invoices.doctor_id = doctors.id
      JOIN patients ON invoices.patient_id = patients.id
      WHERE invoices.patient_id = ${id}      
      ORDER BY invoices.date DESC
    `;

    const invoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch patient invoices.');
  }
}

export async function fetchPatientById(id: string) {
  noStore();

  try {
    const data = await sql<PatientForm>`
      SELECT
        patients.id,
        patients.name,
        patients.phone
      FROM patients
      WHERE patients.id = ${id};
    `;

    const patients = data.rows;

    return patients[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch appointment.');
  }
}

export async function fetchRevenueCardData(
  month: string,
  year: string,
  doctor?: string,
) {
  noStore();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.

    let invoiceCountQuery = `SELECT
        COUNT(*) FROM invoices
        WHERE
        EXTRACT(MONTH FROM date) = $1
        AND
        EXTRACT(YEAR FROM date) = $2`;

    let invoiceCountParams = [month, year];

    if (doctor) {
      invoiceCountQuery += ` AND doctor_id=$3`;
      invoiceCountParams.push(doctor);
    }

    let invoiceStatusQuery = `SELECT
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
        FROM invoices
        WHERE
        EXTRACT(MONTH FROM date) = $1
        AND
        EXTRACT(YEAR FROM date) = $2`;

    let params = [month, year];

    if (doctor) {
      invoiceStatusQuery += ` AND doctor_id=$3`;
      params.push(doctor);
    }

    const patientCountPromise = sql`SELECT
         COUNT(*) FROM patients
         WHERE 
          EXTRACT(MONTH FROM created_at) = ${month}
         AND
          EXTRACT(YEAR FROM created_at) = ${year}`;
    const data = await Promise.all([
      sql.query(invoiceCountQuery, invoiceCountParams),
      patientCountPromise,
      sql.query(invoiceStatusQuery, params),
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfPatients = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfPatients,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

export async function fetchYearRevenue() {
  noStore();

  try {
    const data = await sql<YearlyRevenue>`
    SELECT
    EXTRACT(MONTH FROM date) AS month,
    SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS paid,
    SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS pending
    FROM
    invoices
    WHERE
    date >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY
    month
    ORDER BY
    month DESC;
    `;

    const revenue = data.rows.map((row) => ({
      month: Number(row.month),
      paid: row.paid / 100,
      pending: row.pending / 100,
    }));

    return revenue;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchDoctors() {
  noStore();

  try {
    const data = await sql<DoctorField>`
      SELECT
        id,
        name
      FROM doctors
      ORDER BY name ASC
    `;

    const doctors = data.rows;
    return doctors;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all doctors.');
  }
}

export async function getUser(email: string) {
  noStore();

  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
