/**
 * DateRangePicker Component
 * Select date range for filters with preset options
 */

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import Input from './Input';
import Button from './Button';
import { cn } from '../../utils/cn';



const DateRangePicker = ({
  onDateChange,
  className = '',
  showPresets = true,
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Preset date ranges
  const presets = [
    {
      label: 'Today',
      getValue: () => {
        const today = new Date();
        return {
          start: today.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0],
        };
      },
    },
    {
      label: 'Yesterday',
      getValue: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return {
          start: yesterday.toISOString().split('T')[0],
          end: yesterday.toISOString().split('T')[0],
        };
      },
    },
    {
      label: 'Last 7 Days',
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
        };
      },
    },
    {
      label: 'Last 30 Days',
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
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
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
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
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
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
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
        };
      },
    },
  ];

  // Handle preset click
  const handlePresetClick = (preset) => {
    const { start, end } = preset.getValue();
    setStartDate(start);
    setEndDate(end);
    if (onDateChange) {
      onDateChange({ start, end });
    }
  };

  // Handle manual date change
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (endDate && onDateChange) {
      onDateChange({ start: newStartDate, end: endDate });
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    if (startDate && onDateChange) {
      onDateChange({ start: startDate, end: newEndDate });
    }
  };

  // Clear dates
  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    if (onDateChange) {
      onDateChange({ start: '', end: '' });
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Date inputs */}
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm text-white/70 mb-2">Start Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
            <Input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              max={endDate || undefined}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-sm text-white/70 mb-2">End Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
            <Input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              min={startDate || undefined}
              className="pl-10"
            />
          </div>
        </div>
        {(startDate || endDate) && (
          <Button variant="ghost" size="small" onClick={handleClear}>
            Clear
          </Button>
        )}
      </div>

      {/* Preset buttons */}
      {showPresets && (
        <div>
          <label className="block text-sm text-white/70 mb-2">Quick Select</label>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset, index) => (
              <Button
                key={index}
                variant="ghost"
                size="small"
                onClick={() => handlePresetClick(preset)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
