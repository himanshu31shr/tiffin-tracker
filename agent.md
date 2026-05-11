# Agent Context - Tiffin Tracker

This file provides context for AI assistants working on the Tiffin Tracker project.

## Project Overview

Tiffin Tracker is a React application built with Vite and Firebase. It helps users track their meal subscriptions.

## Key Features & Logic

- **Meals per Day**: 2 meals on Mon-Sat (Lunch & Dinner), 1 meal on Sunday (Lunch only).
- **Delivery Times**: Lunch is received at 12 PM, Dinner at 8 PM.
- **Deduction Logic**:
    - Before 12 PM: 0 meals deducted for today.
    - 12 PM - 8 PM: 1 meal deducted.
    - After 8 PM: 2 meals deducted (or 1 on Sunday).
- **Skips**: Users can toggle skips for past dates. Skips reduce the consumed meal count and extend the projected end date.
- **Data Model**: Stored in Firestore under `users/{userId}`.
    - `currentRecharge`: `{ totalMeals, startDate, ... }`
    - `skippedMeals`: Array of strings in format `YYYY-MM-DD-mealType`.

## Guidelines for Edits

- Maintain the "premium" dark glassmorphic design system defined in `index.css`.
- Ensure state updates in UI match the calculations in `src/utils/tracker.js`.
- Always check the time-based deduction logic when modifying meal calculations.
