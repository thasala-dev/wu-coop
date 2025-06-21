"use client";

import * as React from "react";
import ReactDatePicker from "react-datepicker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { th } from "date-fns/locale";
import { cn } from "@/lib/utils";
import "react-datepicker/dist/react-datepicker.css";

export interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date | null) => void;
  onMonthChange?: (date: Date) => void;
  mode?: "single" | "range";
  locale?: any;
  className?: string;
  disabled?: boolean;
  initialFocus?: boolean;
  monthsShown?: number;
  showOutsideDays?: boolean;
  formatters?: {
    formatWeekdayName?: (day: Date) => string;
  };
}

function Calendar({
  selected,
  onSelect,
  className,
  locale = th,
  disabled = false,
  monthsShown = 1,
  ...props
}: CalendarProps) {
  // Custom header to add Thai localization
  const CustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: any) => {
    const months = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];

    // Convert to Buddhist year (CE + 543)
    const year = date.getFullYear() + 543;
    const month = date.getMonth();

    return (
      <div className="flex items-center justify-between px-2 py-1">
        <button
          type="button"
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
          className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-medium">
          {months[month]} {year}
        </div>
        <button
          type="button"
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
          className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  // Custom day names
  const dayNames = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

  return (
    <div className={cn("p-3", className)}>
      <ReactDatePicker
        selected={selected}
        onChange={(date) => onSelect?.(date)}
        inline
        locale={locale}
        disabled={disabled}
        monthsShown={monthsShown}
        renderCustomHeader={CustomHeader}
        dayClassName={() => "text-sm hover:bg-gray-100 rounded-full"}
        weekDayClassName={() => "text-gray-500 text-xs py-2"}
        formatWeekDay={(day) => dayNames[new Date(day).getDay()]}
        calendarClassName="bg-white"
        fixedHeight
        showPopperArrow={false}
      />
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
