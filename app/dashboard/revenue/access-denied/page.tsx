import { ArrowLeftIcon, NoSymbolIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5">
      <NoSymbolIcon className="h-44 w-44 text-gray-400" />
      <p className="mb-3 text-2xl">ليس لديك الصلاحيات لزيارة هذه الصفحة!</p>
      <Link
        href="/dashboard"
        className="flex items-center gap-5 rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
      >
        <span>العوده للرئيسية</span> <ArrowLeftIcon className="w-5 md:w-6" />
      </Link>
    </div>
  );
}
