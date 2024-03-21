// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
};

export type Patient = {
  id: string;
  name: string;
  phone: string;
};

export type Doctor = {
  id: string;
  name: string;
};

export type Invoice = {
  id: string;
  patient_id: string;
  doctor_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type YearlyRevenue = {
  month: number;
  paid: number;
  pending: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  doctor: string;
  phone: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};
export type LatestAppointment = {
  id: string;
  name: string;
  doctor: string;
  phone: string;
  reason: string;
  appointment_date: string;
};

export type AppointmentsTable = {
  id: string;
  patient_id: string;
  doctor_id: string;
  name: string;
  doctor: string;
  phone: string;
  reason: string;
  appointment_date: string;
  date: string;
};

export type InvoicesTable = {
  id: string;
  patient_id: string;
  doctor_id: string;
  name: string;
  doctor: string;
  phone: string;
  date: string;
  reason: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type PatientsTableType = {
  id: string;
  name: string;
  phone: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedPatientsTable = {
  id: string;
  name: string;
  phone: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type patientTable = {
  id: string;
  name: string;
  doctor: string;
  reason: string;
  status: string;
  amount: number;
  date: string;
};
export type formattedPatientTable = {
  id: string;
  name: string;
  doctor: string;
  reason: string;
  status: string;
  amount: string;
  date: string;
};

export type PatientField = {
  id: string;
  name: string;
};

export type DoctorField = {
  id: string;
  name: string;
};

export type AppointmentForm = {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  reason: string;
};

export type PatientForm = {
  id: string;
  name: string;
  phone: string;
};

export type InvoiceForm = {
  id: string;
  patient_id: string;
  doctor_id: string;
  amount: number;
  reason: string;
  status: 'pending' | 'paid';
};
