export function getDayString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateMeals(startDate, totalMeals, skippedMealsArray) {
  if (!startDate) return { remainingMeals: 0, projectedEndDate: null, consumedMeals: 0 };
  
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let generatedMeals = 0;
  let current = new Date(start);
  
  const now = new Date();
  const currentHour = now.getHours();

  // Calculate generated meals up to today
  while (current <= today) {
    const isSunday = current.getDay() === 0;
    const isToday = current.getTime() === today.getTime();

    let mealsForDay = 0;

    if (isToday) {
      if (currentHour >= 20) {
        mealsForDay = isSunday ? 1 : 2;
      } else if (currentHour >= 12) {
        mealsForDay = 1; // Lunch received
      }
    } else {
      mealsForDay = isSunday ? 1 : 2;
    }

    generatedMeals += mealsForDay;
    current.setDate(current.getDate() + 1);
  }
  
  const consumedMeals = generatedMeals - skippedMealsArray.length;
  const remainingMeals = totalMeals - consumedMeals;
  
  // Project end date
  let projected = new Date(today);
  let mealsToConsume = remainingMeals;
  
  while (mealsToConsume > 0) {
    projected.setDate(projected.getDate() + 1);
    if (projected.getDay() === 0) {
      mealsToConsume -= 1;
    } else {
      mealsToConsume -= 2;
    }
  }
  
  return {
    remainingMeals,
    consumedMeals,
    projectedEndDate: projected,
  };
}
