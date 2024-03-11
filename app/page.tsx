import Logo from '@/app/ui/logo';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { marhey } from './ui/fonts';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <Logo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p
            className={`${marhey.className} text-xl text-gray-800 antialiased md:text-3xl md:leading-normal`}
          >
            <strong>عيادة الرميمة.</strong> لطب وجراحة{' '}
            <span className="text-blue-500">الأسنان</span>
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>تسجيل الدخول</span> <ArrowLeftIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image
            src="/dentist.jpg"
            width={1000}
            height={760}
            className="hidden rounded-lg md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
          <Image
            src="/dentist.jpg"
            width={580}
            height={620}
            className="block rounded-lg md:hidden"
            alt="Screenshots of the dashboard project showing mobile version"
          />
        </div>
      </div>
    </main>
  );
}
