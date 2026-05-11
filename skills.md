# Skills - Tiffin Tracker

Useful commands and operations for maintaining this project.

## Development

- **Start Dev Server**: `npm run dev`
- **Build Production**: `npm run build`

## Testing

- **Run unit tests**: `npm test`
- **Run tests with coverage**: `npm run test:coverage`
- **Run mutation tests**: `npm run test:mutation`

## Firebase & Deployment

- **Automated Deployment**: Pushing to `main` triggers GitHub Actions to deploy to GitHub Pages and deploy Firestore rules.
- **Manual Deploy Hosting**: `firebase deploy --only hosting` (Note: CD is preferred)
- **Manual Deploy Firestore Rules**: `firebase deploy --only firestore`


## Common Tasks

- **Adding a new component**: Place in `src/components/` and use existing styles.
- **Modifying calculations**: Edit `src/utils/tracker.js` and ensure visual checks are done across the calendar and dashboard.
- **Updating styles**: Add to `src/index.css` respecting the glassmorphic design system.
