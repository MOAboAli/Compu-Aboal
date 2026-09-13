import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

function monthMatrix(year, month) {
  const first = new Date(Date.UTC(year, month, 1));
  const startWeekday = first.getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function AppointmentCalendar({
  monthDate,
  onMonthChange,
  selectedDate,
  onSelectDate,
  unavailableMap,
  minBookableDate,
}) {
  const { t, i18n } = useTranslation();
  const year = monthDate.getUTCFullYear();
  const month = monthDate.getUTCMonth();
  const cells = useMemo(() => monthMatrix(year, month), [year, month]);
  const monthLabel = new Intl.DateTimeFormat(i18n.language?.startsWith('ar') ? 'ar-EG' : 'en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month, 1)));

  const weekdays = t('services.calendar.weekdays', { returnObjects: true });

  function shiftMonth(delta) {
    onMonthChange(new Date(Date.UTC(year, month + delta, 1)));
  }

  return (
    <div className="appointment-calendar">
      <div className="appointment-calendar-head">
        <button type="button" className="btn ghost" onClick={() => shiftMonth(-1)}>
          ‹
        </button>
        <h2>{monthLabel}</h2>
        <button type="button" className="btn ghost" onClick={() => shiftMonth(1)}>
          ›
        </button>
      </div>
      <div className="appointment-calendar-grid weekday">
        {(Array.isArray(weekdays) ? weekdays : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).map(
          (label) => (
            <span key={label}>{label}</span>
          )
        )}
      </div>
      <div className="appointment-calendar-grid">
        {cells.map((dateKey, index) => {
          if (!dateKey) return <span key={`empty-${index}`} className="cal-empty" />;
          const blocked = unavailableMap.get(dateKey);
          const tooSoon = minBookableDate && dateKey < minBookableDate;
          const disabled = Boolean(blocked) || tooSoon;
          const selected = selectedDate === dateKey;
          return (
            <button
              key={dateKey}
              type="button"
              className={[
                'cal-day',
                disabled ? 'is-disabled' : '',
                selected ? 'is-selected' : '',
                blocked?.reason === 'holiday' ? 'is-holiday' : '',
                blocked?.reason === 'booked' ? 'is-booked' : '',
                blocked?.reason === 'unavailable' ? 'is-unavailable' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              disabled={disabled}
              title={blocked?.label || (tooSoon ? t('services.calendar.tooSoon') : '')}
              onClick={() => onSelectDate(dateKey)}
            >
              {Number(dateKey.slice(-2))}
            </button>
          );
        })}
      </div>
      <div className="appointment-calendar-legend">
        <span>
          <i className="legend available" /> {t('services.calendar.available')}
        </span>
        <span>
          <i className="legend holiday" /> {t('services.calendar.holiday')}
        </span>
        <span>
          <i className="legend unavailable" /> {t('services.calendar.unavailable')}
        </span>
        <span>
          <i className="legend booked" /> {t('services.calendar.booked')}
        </span>
      </div>
    </div>
  );
}
