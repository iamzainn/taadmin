'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function DateRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Get initial dates from URL if they exist
  const initialStartDate = searchParams.get('startDate');
  const initialEndDate = searchParams.get('endDate');

  const [date, setDate] = useState<DateRange | undefined>(() => {
    if (initialStartDate && initialEndDate) {
      return {
        from: new Date(initialStartDate),
        to: new Date(initialEndDate),
      };
    }
    return undefined;
  });

  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);

    startTransition(() => {
      const params = new URLSearchParams(searchParams);

      if (selectedDate?.from) {
        params.set('startDate', format(selectedDate.from, 'yyyy-MM-dd'));
      } else {
        params.delete('startDate');
      }

      if (selectedDate?.to) {
        params.set('endDate', format(selectedDate.to, 'yyyy-MM-dd'));
      } else {
        params.delete('endDate');
      }

      router.push(`?${params.toString()}`);
    });
  };

  const handleRemoveFilter = () => {
    setDate(undefined);
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.delete('startDate');
      params.delete('endDate');
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {(date?.from || date?.to) && (
        <Button
          variant="outline"
          size="icon"
          onClick={handleRemoveFilter}
          disabled={isPending}
          title="Remove date filter"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}