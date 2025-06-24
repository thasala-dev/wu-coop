"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import ReactDatePicker from "react-datepicker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { th } from "date-fns/locale";
import { cn } from "@/lib/utils";
import "react-datepicker/dist/react-datepicker.css";
import "./calendar-custom.css";

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

// Thai month names
const thaiMonths = [
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

// Thai day names
const thaiDayNames = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

// Define types for the custom header props
type CustomHeaderProps = {
  date: Date;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
  changeMonth: (month: number) => void;
  changeYear: (year: number) => void;
};

// Custom header as a standalone React component with proper types
const CustomHeader: React.FC<CustomHeaderProps> = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  changeMonth,
  changeYear,
}) => {
  // State for dropdowns - now properly used in a component
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  // Current date values
  const currentYear = date.getFullYear();
  const buddhistYear = currentYear + 543;
  const month = date.getMonth();

  // Generate year options (10 years before and after current year)
  const yearOptions = useMemo(() => {
    return Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  }, [currentYear]);

  return (
    <div className="flex items-center justify-between px-2 py-1">
      <div
        role="button"
        tabIndex={prevMonthButtonDisabled ? -1 : 0}
        onClick={prevMonthButtonDisabled ? undefined : decreaseMonth}
        aria-disabled={prevMonthButtonDisabled}
        className={cn(
          "p-1 rounded-md hover:bg-emerald-100 cursor-pointer",
          prevMonthButtonDisabled && "opacity-50 pointer-events-none"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </div>
      <div className="flex items-center space-x-1 relative">
        {/* Month dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setMonthOpen(!monthOpen);
              setYearOpen(false);
            }}
            className="text-sm font-medium hover:bg-emerald-100 px-2 py-1 rounded-md cursor-pointer"
          >
            {thaiMonths[month]}
          </button>
          {monthOpen && (
            <div className="absolute z-10 top-full mt-1 left-0 bg-white border border-emerald-200 rounded-md shadow-md max-h-64 overflow-y-auto">
              <div className="grid grid-cols-3 p-2 gap-1 w-52">
                {thaiMonths.map((monthName, idx) => (
                  <div
                    key={monthName}
                    className={cn(
                      "px-2 py-1 text-xs text-center rounded-md cursor-pointer hover:bg-emerald-100",
                      month === idx && "bg-emerald-200 font-bold"
                    )}
                    onClick={() => {
                      changeMonth(idx);
                      setMonthOpen(false);
                    }}
                  >
                    {monthName}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Year dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setYearOpen(!yearOpen);
              setMonthOpen(false);
            }}
            className="text-sm font-medium hover:bg-emerald-100 px-2 py-1 rounded-md cursor-pointer"
          >
            {buddhistYear}
          </button>
          {yearOpen && (
            <div className="absolute z-10 top-full mt-1 left-0 bg-white border border-emerald-200 rounded-md shadow-md max-h-40 overflow-y-auto">
              <div className="flex flex-col p-1 w-20">
                {yearOptions.map((year) => (
                  <div
                    key={year}
                    className={cn(
                      "px-2 py-1 text-xs text-center rounded-md cursor-pointer hover:bg-emerald-100",
                      currentYear === year && "bg-emerald-200 font-bold"
                    )}
                    onClick={() => {
                      changeYear(year);
                      setYearOpen(false);
                    }}
                  >
                    {year + 543}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        role="button"
        tabIndex={nextMonthButtonDisabled ? -1 : 0}
        onClick={nextMonthButtonDisabled ? undefined : increaseMonth}
        aria-disabled={nextMonthButtonDisabled}
        className={cn(
          "p-1 rounded-md hover:bg-emerald-100 cursor-pointer",
          nextMonthButtonDisabled && "opacity-50 pointer-events-none"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </div>
    </div>
  );
};

// Define the Calendar component
function Calendar({
  selected,
  onSelect,
  className,
  locale = th,
  disabled = false,
  monthsShown = 1,
  ...props
}: CalendarProps) {
  // Create a modified version of the locale with our day names
  const modifiedLocale = useMemo(() => {
    return {
      ...locale,
      options: {
        ...locale.options,
        weekStartsOn: 0, // Start week on Sunday (0)
      },
    };
  }, [locale]);

  // Custom component for day headers
  const CustomDayHeader = useMemo(() => {
    return (
      <div className="custom-day-header-row">
        {thaiDayNames.map((day, index) => (
          <div key={index} className="custom-day-header">
            {day}
          </div>
        ))}
      </div>
    );
  }, []);

  // Effect to manually update day names after rendering
  useEffect(() => {
    // Function to inject day names directly into the DOM elements
    const updateDayNames = () => {
      const dayNameElements = document.querySelectorAll(
        ".react-datepicker__day-name"
      );
      if (dayNameElements.length === 7) {
        dayNameElements.forEach((element, index) => {
          if (element instanceof HTMLElement) {
            // Force day name visibility through innerHTML
            element.innerHTML = thaiDayNames[index];
          }
        });
      }
    };

    // Run once on mount and whenever calendar re-renders
    updateDayNames();

    // Set up a small delay to ensure the calendar has rendered
    const timer = setTimeout(updateDayNames, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn("p-2", className)}>
      <ReactDatePicker
        selected={selected}
        onChange={(date) => onSelect?.(date)}
        inline
        locale={modifiedLocale}
        disabled={disabled}
        monthsShown={monthsShown}
        renderCustomHeader={(props) => <CustomHeader {...props} />}
        dayClassName={() => "text-sm hover:bg-emerald-100 rounded-full"}
        weekDayClassName={() => "text-emerald-700 text-xs font-medium"}
        formatWeekDay={(dayName) => {
          // Get correct day index and return the Thai day name
          const dayIndex = new Date(dayName).getDay();
          return thaiDayNames[dayIndex] || "?"; // Fallback to "?" if undefined
        }}
        renderDayContents={(day) => <span>{day}</span>}
        calendarClassName="bg-emerald-50"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        yearDropdownItemNumber={15}
        fixedHeight
        showPopperArrow={false}
      />
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
