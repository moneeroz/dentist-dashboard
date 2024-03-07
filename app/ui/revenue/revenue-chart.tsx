'use client';

import { CalendarIcon } from '@heroicons/react/24/outline';
import { marhey } from '@/app/ui/fonts';
import { YearlyRevenue } from '@/app/lib/definitions';

import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { months } from '@/app/lib/months';

export default function RevenueChart({ data }: { data: YearlyRevenue[] }) {
  const chartData = data.map((item) => {
    return {
      month: months[item.month - 1].label,
      مدفوع: item.paid,
      متبقي: item.pending,
    };
  });
  months;

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${marhey.className} mb-4 text-xl md:text-2xl`}>
        آخر الإيرادات
      </h2>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="h-[400px]">
          <ResponsiveContainer
            width="100%"
            height="96%"
            className="bg-white pt-4"
          >
            <BarChart
              width={500}
              height={300}
              data={chartData}
              margin={{
                top: 5,
                right: -20,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis
                dataKey="month"
                fontSize={14}
                tickLine={false}
                stroke="#888888"
              />
              <div className="mx-52" />
              <YAxis
                tickLine={false}
                fontSize={12}
                stroke="#888888"
                className=" mx-52"
                tickMargin={30}
                orientation="right"
              />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="مدفوع"
                fill="#64b5f6"
                activeBar={<Rectangle fill="#4dd0e1" stroke="purple" />}
              />
              <Bar
                dataKey="متبقي"
                fill="#e57373"
                activeBar={<Rectangle fill="pink" stroke="blue" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">آخر ١٢ شهر</h3>
        </div>
      </div>
    </div>
  );
}
