'use client';

import React from 'react';
import Calendar from 'react-calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import './AppCalendar.scss';

dayjs.locale('ko');

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface AppCalendarProps {
  onChange: (value: Value) => void;
  value: Value;
}

export default function AppCalendar({ onChange, value }: AppCalendarProps) {
  return (
    <div className="app-calendar-wrapper">
      <Calendar
        onChange={onChange}
        value={value}
        locale="ko-KR"
        next2Label={null}
        prev2Label={null}
        prevLabel={<ChevronLeft size={20} />}
        nextLabel={<ChevronRight size={20} />}
        formatDay={(locale, date) => dayjs(date).format('D')}
        calendarType="gregory"
      />
    </div>
  );
}
export type { Value, ValuePiece };
