/**
 * Enhanced DateRangePicker Component
 * MUI-like design with single input and dual calendar view
 */

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight, X, CalendarDays } from 'lucide-react';
import Button from './Button';
import { cn } from '../../utils';

interface DateRangePickerProps {
  onDateChange?: (range: { start: string; end: string }) => void;
  className?: string;
  showPresets?: boolean;
  initialStartDate?: string;
  initialEndDate?: string;
  showLabel?: boolean;
  label?: string;
}

// Preset date ranges
const presets = [
  {
    label: 'Today',
    getValue: () => {
      const today = new Date();
      return {
        start: formatDateToYYYYMMDD(today),
        end: formatDateToYYYYMMDD(today),
      };
    },
  },
  {
    label: 'Yesterday',
    getValue: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        start: formatDateToYYYYMMDD(yesterday),
        end: formatDateToYYYYMMDD(yesterday),
      };
    },
  },
  {
    label: 'Last 7 Days',
    getValue: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 6); // Include today, so 6 days back
      return {
        start: formatDateToYYYYMMDD(start),
        end: formatDateToYYYYMMDD(end),
      };
    },
  },
  {
    label: 'Last 30 Days',
    getValue: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 29); // Include today, so 29 days back
      return {
        start: formatDateToYYYYMMDD(start),
        end: formatDateToYYYYMMDD(end),
      };
    },
  },
  {
    label: 'This Month',
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return {
        start: formatDateToYYYYMMDD(start),
        end: formatDateToYYYYMMDD(end),
      };
    },
  },
  {
    label: 'Last Month',
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return {
        start: formatDateToYYYYMMDD(start),
        end: formatDateToYYYYMMDD(end),
      };
    },
  },
  {
    label: 'This Year',
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), 11, 31);
      return {
        start: formatDateToYYYYMMDD(start),
        end: formatDateToYYYYMMDD(end),
      };
    },
  },
];

// Helper function to format date to YYYY-MM-DD in local time
function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper function to parse YYYY-MM-DD to Date in local time
function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Single Calendar Month Component
const CalendarMonth = ({ 
  date, 
  selectedStart, 
  selectedEnd, 
  onDateSelect,
  minDate,
  maxDate
}: { 
  date: Date; 
  selectedStart: string | null; 
  selectedEnd: string | null; 
  onDateSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  const isDateInRange = (day: number) => {
    if (!selectedStart || !selectedEnd) return false;
    const currentDate = new Date(year, month, day);
    const start = parseLocalDate(selectedStart);
    const end = parseLocalDate(selectedEnd);
    return currentDate > start && currentDate < end;
  };
  
  const isDateSelected = (day: number) => {
    const currentDate = formatDateToYYYYMMDD(new Date(year, month, day));
    return currentDate === selectedStart || currentDate === selectedEnd;
  };
  
  const isDateStart = (day: number) => {
    const currentDate = formatDateToYYYYMMDD(new Date(year, month, day));
    return currentDate === selectedStart;
  };
  
  const isDateEnd = (day: number) => {
    const currentDate = formatDateToYYYYMMDD(new Date(year, month, day));
    return currentDate === selectedEnd;
  };
  
  const isDateDisabled = (day: number) => {
    const currentDate = new Date(year, month, day);
    if (minDate && currentDate < minDate) return true;
    if (maxDate && currentDate > maxDate) return true;
    return false;
  };
  
  const handleDateClick = (day: number) => {
    if (isDateDisabled(day)) return;
    const selectedDate = new Date(year, month, day);
    onDateSelect(selectedDate);
  };
  
  const days = [];
  // Empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-10" />);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isInRange = isDateInRange(day);
    const isSelected = isDateSelected(day);
    const isStart = isDateStart(day);
    const isEnd = isDateEnd(day);
    const isDisabled = isDateDisabled(day);
    const today = new Date();
    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    
    days.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        disabled={isDisabled}
        className={cn(
          'h-10 w-10 rounded-full text-sm font-medium transition-all duration-200',
          'hover:bg-primary/20 hover:text-white',
          isDisabled && 'opacity-30 cursor-not-allowed',
          isToday && !isSelected && 'bg-white/10 text-primary font-semibold',
          isInRange && !isSelected && 'bg-primary/10 text-white',
          isSelected && 'bg-primary text-white font-semibold shadow-md',
          isStart && 'rounded-l-full',
          isEnd && 'rounded-r-full',
          !isSelected && !isInRange && !isDisabled && 'text-white/70 hover:text-white'
        )}
      >
        {day}
      </button>
    );
  }
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-0 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-white/60 py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0">
        {days}
      </div>
    </div>
  );
};

const DateRangePicker = ({
  onDateChange,
  className = '',
  showPresets = true,
  initialStartDate = '',
  initialEndDate = '',
  showLabel = true,
  label = 'Date Range',
}: DateRangePickerProps) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [leftMonth, setLeftMonth] = useState(new Date());
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Sync internal state with initial values when they change
  useEffect(() => {
    if (initialStartDate !== undefined) {
      setStartDate(initialStartDate);
    }
    if (initialEndDate !== undefined) {
      setEndDate(initialEndDate);
    }
  }, [initialStartDate, initialEndDate]);

  // Check if current dates match a preset
  useEffect(() => {
    if (!startDate || !endDate) {
      setSelectedPreset(null);
      return;
    }

    const currentStart = startDate;
    const currentEnd = endDate;

    for (const preset of presets) {
      const { start, end } = preset.getValue();
      if (start === currentStart && end === currentEnd) {
        setSelectedPreset(preset.label);
        return;
      }
    }
    setSelectedPreset(null);
  }, [startDate, endDate]);

  // Update left month when dates change to show relevant months
  useEffect(() => {
    if (startDate) {
      const date = parseLocalDate(startDate);
      setLeftMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  }, [startDate]);

  // Calculate calendar position
  const updateCalendarPosition = (buttonElement: HTMLButtonElement) => {
    if (buttonElement) {
      const rect = buttonElement.getBoundingClientRect();
      setCalendarPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: 680, // Fixed width for dual calendar view
      });
    }
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target) && 
          !(event.target as Element)?.closest('[data-calendar-portal]')) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update position when calendar opens or window resizes
  useEffect(() => {
    if (showCalendar && buttonRef.current) {
      updateCalendarPosition(buttonRef.current);
      const handleResize = () => {
        if (buttonRef.current) {
          updateCalendarPosition(buttonRef.current);
        }
      };
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize, true);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize, true);
      };
    }
  }, [showCalendar]);

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = parseLocalDate(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  const formatDateRange = () => {
    if (startDate && endDate) {
      return `${formatDisplayDate(startDate)} – ${formatDisplayDate(endDate)}`;
    }
    if (startDate) {
      return `${formatDisplayDate(startDate)} – ...`;
    }
    return 'Select date range';
  };

  const handlePresetClick = (preset: typeof presets[0]) => {
    const { start, end } = preset.getValue();
    setStartDate(start);
    setEndDate(end);
    setSelectedPreset(preset.label);
    // Update left month to show the start date
    const startDateObj = parseLocalDate(start);
    setLeftMonth(new Date(startDateObj.getFullYear(), startDateObj.getMonth(), 1));
    if (onDateChange) {
      onDateChange({ start, end });
    }
  };

  const handleDateSelect = (date: Date) => {
    const dateString = formatDateToYYYYMMDD(date);
    
    if (!startDate || (startDate && endDate) || (startDate && date < parseLocalDate(startDate))) {
      // Start new selection
      setStartDate(dateString);
      setEndDate('');
      setSelectedPreset(null);
    } else if (startDate && !endDate) {
      // Complete the range
      if (date >= parseLocalDate(startDate)) {
        setEndDate(dateString);
        setSelectedPreset(null);
        if (onDateChange) {
          onDateChange({ start: startDate, end: dateString });
        }
      } else {
        // If selected date is before start, make it the new start
        setStartDate(dateString);
        setEndDate('');
        setSelectedPreset(null);
      }
    }
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setSelectedPreset(null);
    if (onDateChange) {
      onDateChange({ start: '', end: '' });
    }
  };

  const navigateMonth = (direction: 'prev' | 'next', side: 'left' | 'right') => {
    if (side === 'left') {
      setLeftMonth((prev) => {
        const newDate = new Date(prev);
        if (direction === 'prev') {
          newDate.setMonth(prev.getMonth() - 1);
        } else {
          newDate.setMonth(prev.getMonth() + 1);
        }
        return newDate;
      });
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const rightMonth = new Date(leftMonth);
  rightMonth.setMonth(leftMonth.getMonth() + 1);

  return (
    <div ref={containerRef} className={cn('space-y-4 w-full', className)}>
      {/* Single Date Range Input */}
      <div className="w-full">
        {showLabel && (
          <label className="block text-sm font-medium text-white/90 mb-2">{label}</label>
        )}
        <div className="relative">
          <button
            ref={buttonRef}
            type="button"
            onClick={() => {
              const newState = !showCalendar;
              setShowCalendar(newState);
              if (newState && buttonRef.current) {
                setTimeout(() => updateCalendarPosition(buttonRef.current!), 0);
              }
            }}
            className={cn(
              'w-full px-4 py-3 pl-4 pr-12',
              'bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg',
              'text-white text-left',
              'transition-all duration-200',
              'hover:border-primary/50 focus:outline-none',
              showCalendar && 'border-primary ring-2 ring-primary/30',
              'flex items-center justify-between group cursor-pointer'
            )}
          >
            <span className={cn(
              'text-sm',
              (startDate || endDate) ? 'text-white' : 'text-white/50'
            )}>
              {formatDateRange()}
            </span>
            <CalendarDays className="absolute right-3 w-5 h-5 text-white/50 group-hover:text-primary transition-colors" />
          </button>
          
          {(startDate || endDate) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="w-4 h-4 text-white/50 hover:text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Calendar Popup */}
      {showCalendar && createPortal(
        <div 
          data-calendar-portal
          className="fixed z-[9999] bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-white/20 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden"
          style={{
            top: `${calendarPosition.top}px`,
            left: `${calendarPosition.left}px`,
            width: `${calendarPosition.width}px`,
          }}
        >
          {/* Quick Select Presets */}
          {showPresets && (
            <div className="px-6 pt-4 pb-3 border-b border-white/10">
              <div className="flex flex-wrap gap-2">
                {presets.map((preset, index) => {
                  const isSelected = selectedPreset === preset.label;
                  return (
                    <button
                      key={index}
                      onClick={() => handlePresetClick(preset)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                        isSelected 
                          ? 'bg-primary text-white shadow-md' 
                          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                      )}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dual Calendar View */}
          <div className="p-6">
            <div className="flex gap-8">
              {/* Left Calendar */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => navigateMonth('prev', 'left')}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group"
                  >
                    <ChevronLeft className="w-5 h-5 text-white/70 group-hover:text-primary transition-colors" />
                  </button>
                  <h3 className="text-white font-semibold text-sm">
                    {monthNames[leftMonth.getMonth()]} {leftMonth.getFullYear()}
                  </h3>
                  <div className="w-9" /> {/* Spacer for alignment */}
                </div>
                <CalendarMonth
                  date={leftMonth}
                  selectedStart={startDate}
                  selectedEnd={endDate}
                  onDateSelect={handleDateSelect}
                />
              </div>

              {/* Right Calendar */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9" /> {/* Spacer for alignment */}
                  <h3 className="text-white font-semibold text-sm">
                    {monthNames[rightMonth.getMonth()]} {rightMonth.getFullYear()}
                  </h3>
                  <button
                    onClick={() => navigateMonth('next', 'left')}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group"
                  >
                    <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-primary transition-colors" />
                  </button>
                </div>
                <CalendarMonth
                  date={rightMonth}
                  selectedStart={startDate}
                  selectedEnd={endDate}
                  onDateSelect={handleDateSelect}
                  minDate={startDate ? parseLocalDate(startDate) : undefined}
                />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default DateRangePicker;
