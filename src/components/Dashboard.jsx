import React, { useState } from 'react';
import { calculateMeals, getDayString } from '../utils/tracker';
import { toggleSkippedMeal, startNewRecharge, addRecharge, deletePlan } from '../services/db';
import CalendarView from './CalendarView';

export default function Dashboard({ userId, userData }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customStartDate, setCustomStartDate] = useState(getDayString(new Date()));
  
  const currentRecharge = userData?.currentRecharge;
  const skippedMeals = userData?.skippedMeals || [];
  
  const hasActivePlan = !!currentRecharge;
  const { remainingMeals, consumedMeals, projectedEndDate } = calculateMeals(
    currentRecharge?.startDate,
    currentRecharge?.totalMeals,
    skippedMeals
  );

  const selectedDateStr = getDayString(selectedDate);
  const isSunday = selectedDate.getDay() === 0;
  const isToday = getDayString(new Date()) === selectedDateStr;

  const handleToggle = (mealType, isSkipped) => {
    toggleSkippedMeal(userId, selectedDateStr, mealType, isSkipped);
  };

  const renderMealToggle = (mealType) => {
    const isSkipped = skippedMeals.includes(`${selectedDateStr}-${mealType}`);
    return (
      <div className="meal-toggle" key={mealType}>
        <span>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</span>
        <button 
          className={`toggle-btn ${!isSkipped ? 'active' : ''}`}
          onClick={() => handleToggle(mealType, isSkipped)}
        >
          {!isSkipped ? 'Received' : 'Skipped'}
        </button>
      </div>
    );
  };

  if (!hasActivePlan) {
    return (
      <div className="dashboard empty-state">
        <div className="glass-card">
          <h2>No Active Plan</h2>
          <p>Select a start date and begin tracking.</p>
          <div style={{marginBottom: '1.5rem', marginTop: '1rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)'}}>Start Date:</label>
            <input 
              type="date" 
              value={customStartDate} 
              onChange={(e) => setCustomStartDate(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--border)', 
                color: 'white', 
                padding: '0.75rem', 
                borderRadius: '0.5rem',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button className="btn primary" style={{width: '100%'}} onClick={() => startNewRecharge(userId, new Date(customStartDate).toISOString())}>
            Start New Plan (56 Meals)
          </button>
        </div>
      </div>
    );
  }

  const formattedSelectedDate = selectedDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div className="dashboard">
      {remainingMeals < 6 && (
        <div className="alert-box warning">
          <strong>Low Balance Alert:</strong> You only have {remainingMeals} meals remaining. Time to recharge soon!
        </div>
      )}

      <div className="stats-grid">
        <div className="glass-card stat">
          <label>Remaining</label>
          <h2>{remainingMeals}</h2>
        </div>
        <div className="glass-card stat">
          <label>Consumed</label>
          <h2>{consumedMeals}</h2>
        </div>
      </div>

      <div className="glass-card today-section">
        <h3>Meals for {isToday ? 'Today' : formattedSelectedDate}</h3>
        <p className="subtitle">Select a date on the calendar below to log past meals.</p>
        <div className="toggles-container">
          {isSunday ? (
            renderMealToggle('lunch') // Assuming Sunday is 1 meal (lunch)
          ) : (
            <>
              {renderMealToggle('lunch')}
              {renderMealToggle('dinner')}
            </>
          )}
        </div>
      </div>

      <CalendarView 
        startDate={currentRecharge.startDate} 
        projectedEndDate={projectedEndDate} 
        skippedMeals={skippedMeals}
        selectedDate={selectedDate}
        onSelectDay={(date) => {
          setSelectedDate(date);
        }}
      />

      <div className="actions-section">
        <button className="btn primary" onClick={() => addRecharge(userId, currentRecharge.totalMeals)}>
          Add Recharge (+56 Meals)
        </button>
        <button className="btn outline danger" onClick={async () => {
          if (window.confirm("Are you sure you want to reset and start fresh? This will delete your current plan and history.")) {
            try {
              await deletePlan(userId);
            } catch (error) {
              console.error("Failed to reset plan:", error);
              alert("Failed to reset plan. Please try again.");
            }
          }
        }}>
          Reset & Start Fresh
        </button>
      </div>
    </div>
  );
}
