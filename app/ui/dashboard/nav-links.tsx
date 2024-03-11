'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  CalendarDaysIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const userLinks = [
  { name: 'الرئيسيه', href: '/dashboard', icon: HomeIcon },
  {
    name: 'الحجوزات',
    href: '/dashboard/appointments',
    icon: CalendarDaysIcon,
  },
  {
    name: 'الفواتير',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'المرضى', href: '/dashboard/patients', icon: UserGroupIcon },
];

const adminLinks = [
  ...userLinks,
  { name: 'الدخل المالي', href: '/dashboard/revenue', icon: BanknotesIcon },
];

export default function NavLinks({
  role,
}: {
  role: 'admin' | 'user' | undefined;
}) {
  const pathname = usePathname();

  const links = role === 'admin' ? adminLinks : userLinks;

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
