import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

export default function CalendarView({ startDate, projectedEndDate, skippedMeals = [], selectedDate, onSelectDay }) {
  const printRef = useRef();
  const today = new Date();

  // State for the interactive UI (one month at a time)
  const [viewMonth, setViewMonth] = useState(selectedDate ? selectedDate.getMonth() : today.getMonth());
  const [viewYear, setViewYear] = useState(selectedDate ? selectedDate.getFullYear() : today.getFullYear());

  const handleShare = async () => {
    const element = printRef.current;
    
    // Temporarily make the hidden capture container visible for html2canvas
    element.style.position = 'relative';
    element.style.left = '0';
    element.style.display = 'block';
    
    const canvas = await html2canvas(element, {
      backgroundColor: '#0f172a', // Match app background
      scale: 2
    });
    
    // Hide it again
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.display = 'none';
    
    const dataUrl = canvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.download = 'tiffin-tracker-calendar.png';
    link.href = dataUrl;
    link.click();
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getMonthsInRange = () => {
    if (!startDate || !projectedEndDate) {
      return [{ month: today.getMonth(), year: today.getFullYear() }];
    }
    
    const start = new Date(startDate);
    const end = new Date(projectedEndDate);
    
    const months = [];
    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    
    while (current <= end) {
      months.push({
        month: current.getMonth(),
        year: current.getFullYear()
      });
      current.setMonth(current.getMonth() + 1);
    }
    return months;
  };

  const monthsInRange = getMonthsInRange();

  const isBeforeStart = (day, month, year) => {
    if (!day) return true;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const startStr = startDate ? startDate.split('T')[0] : '';
    return dateStr < startStr;
  };

  const isFuture = (day, month, year) => {
    if (!day) return false;
    const date = new Date(year, month, day);
    const todayZero = new Date();
    todayZero.setHours(0, 0, 0, 0);
    return date > todayZero;
  };

  const getSkippedStatus = (day, month, year) => {
    if (!day || isBeforeStart(day, month, year)) return null;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const count = skippedMeals.filter(sm => sm.startsWith(dateStr)).length;
    
    if (count === 2) return 'both';
    if (count === 1) {
      const date = new Date(year, month, day);
      if (date.getDay() === 0) return 'both'; // Sunday only has 1 meal
      return 'one';
    }
    return null;
  };

  const isToday = (day, month, year) => {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const getConsumedMeals = (day, month, year) => {
    if (!day || isBeforeStart(day, month, year) || isFuture(day, month, year)) return null;
    const date = new Date(year, month, day);
    const isSunday = date.getDay() === 0;
    
    let defaultMeals = isSunday ? 1 : 2;
    
    if (isToday(day, month, year)) {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        defaultMeals = 0;
      } else if (currentHour < 20) {
        defaultMeals = 1;
      }
    }
    
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const skippedCount = skippedMeals.filter(sm => sm.startsWith(dateStr)).length;
    
    const consumed = defaultMeals - skippedCount;
    return consumed > 0 ? `-${consumed}` : '0';
  };

  const isSelected = (day, month, year) => {
    return selectedDate && day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
  };

  const isStartOrEnd = (day, month, year) => {
    if (!day) return false;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const startStr = startDate ? startDate.split('T')[0] : '';
    const endStr = projectedEndDate ? projectedEndDate.toISOString().split('T')[0] : '';
    
    if (dateStr === startStr) return 'start';
    if (dateStr === endStr) return 'end';
    return null;
  };

  // Helper to render a month grid
  const renderMonthGrid = (month, year) => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const daysArray = [];
    for (let i = 0; i < firstDayIndex; i++) daysArray.push(null);
    for (let i = 1; i <= totalDays; i++) daysArray.push(i);

    return (
      <div key={`${year}-${month}`} className="month-block" style={{marginBottom: '1.5rem'}}>
        <h4 className="month-title">{monthNames[month]} {year}</h4>
        
        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="grid-header">{day}</div>
          ))}
          
          {daysArray.map((day, index) => {
            const beforeStart = isBeforeStart(day, month, year);
            const skippedStatus = getSkippedStatus(day, month, year);
            const current = isToday(day, month, year);
            const selected = isSelected(day, month, year);
            const status = isStartOrEnd(day, month, year);
            const consumed = getConsumedMeals(day, month, year);
            
            let skippedClass = '';
            if (skippedStatus === 'both') skippedClass = 'skipped-all';
            if (skippedStatus === 'one') skippedClass = 'skipped-one';
            
            return (
              <div 
                key={index} 
                className={`grid-day ${!day ? 'empty' : (beforeStart ? 'disabled' : 'clickable')} ${skippedClass} ${current ? 'today' : ''} ${selected ? 'selected' : ''} ${status ? status : ''}`}
                onClick={() => {
                  if (day && !beforeStart && onSelectDay) {
                    onSelectDay(new Date(year, month, day));
                  }
                }}
              >
                <span className="day-number">{day}</span>
                {day && !beforeStart && consumed && <span className="consumed-count">{consumed}</span>}
                {status === 'start' && <span className="badge">Start</span>}
                {status === 'end' && <span className="badge">End</span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-section">
      {/* 1. Interactive UI (Visible to user, one month at a time) */}
      <div className="glass-card calendar-grid-card">
        <div className="calendar-header">
          <div className="month-nav">
            <button className="nav-btn" onClick={handlePrevMonth}>&lt;</button>
            <h3>{monthNames[viewMonth]} {viewYear}</h3>
            <button className="nav-btn" onClick={handleNextMonth}>&gt;</button>
          </div>
          <div className="legend">
            <span className="legend-item"><span className="dot skipped-all"></span> Both Skipped</span>
            <span className="legend-item"><span className="dot skipped-one"></span> One Skipped</span>
            <span className="legend-item"><span className="dot today-dot"></span> Today</span>
          </div>
        </div>
        
        {renderMonthGrid(viewMonth, viewYear)}

        <div className="skipped-meals-list">
          <h4>Skipped Meals History</h4>
          {skippedMeals.length === 0 ? (
            <p className="subtitle">No meals skipped yet.</p>
          ) : (
            <ul>
              {skippedMeals.sort().map(sm => {
                const dateStr = sm.substring(0, 10);
                const meal = sm.substring(11);
                const dateObj = new Date(dateStr);
                const formattedDate = dateObj.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                });
                return (
                  <li key={sm}>
                    <span className="skipped-date">{formattedDate}</span>
                    <span className="skipped-type">{meal.charAt(0).toUpperCase() + meal.slice(1)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* 2. Capture Container (Hidden/Off-screen, contains all months in plan) */}
      <div 
        ref={printRef} 
        className="glass-card calendar-grid-card" 
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          display: 'none',
          width: '100%', // Match width or specify a fixed width for the image
          maxWidth: '500px' // Example max width
        }}
      >
        <div className="calendar-top-header">
          <h3>Meal Plan Report</h3>
          <div className="legend">
            <span className="legend-item"><span className="dot skipped-all"></span> Both Skipped</span>
            <span className="legend-item"><span className="dot skipped-one"></span> One Skipped</span>
            <span className="legend-item"><span className="dot today-dot"></span> Today</span>
          </div>
        </div>

        {monthsInRange.map(({ month, year }) => renderMonthGrid(month, year))}

        <div className="skipped-meals-list">
          <h4>Skipped Meals History</h4>
          {skippedMeals.length === 0 ? (
            <p className="subtitle">No meals skipped yet.</p>
          ) : (
            <ul>
              {skippedMeals.sort().map(sm => {
                const dateStr = sm.substring(0, 10);
                const meal = sm.substring(11);
                const dateObj = new Date(dateStr);
                const formattedDate = dateObj.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                });
                return (
                  <li key={sm}>
                    <span className="skipped-date">{formattedDate}</span>
                    <span className="skipped-type">{meal.charAt(0).toUpperCase() + meal.slice(1)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      
      <button className="btn outline" onClick={handleShare} style={{marginTop: '1rem', width: '100%'}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        Share Calendar Image
      </button>
    </div>
  );
}
