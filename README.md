# Planner

Personal, single-user iOS planner. Captures tasks from screenshots and notebook photos,
prioritizes them with the Eisenhower matrix, suggests 30-minute slots around calendar
events, and keeps you going with light gamification.

Built with Expo (React Native + TypeScript). Runs in **Expo Go** through Phase 3; moves
to EAS Build + TestFlight when native features are needed.

## Current phase: 0 — hello world

What this build proves on the device:

1. JavaScript runs (tap counter)
2. Local storage persists across restarts (AsyncStorage)
3. Local notifications can be scheduled (expo-notifications)

## Run it on your phone (Windows PC + iPhone/iPad on the same Wi-Fi)

Prerequisites, once: Node.js LTS on the PC, Expo Go on the device.

1. Clone this repo with GitHub Desktop and open the folder in a terminal
   (File Explorer → right-click empty area → *Open in Terminal*).
2. `npm install` — first time only, or whenever `package.json` changes.
3. `npx expo start`
4. Scan the QR code with the Camera app → Expo Go opens the project.

If the device can't connect (common on corporate/guest Wi-Fi), stop the server with
`Ctrl+C` and run `npx expo start --tunnel` instead.

## Phase 0 test checklist

- [ ] Hello-world screen loads in Expo Go.
- [ ] "Tap me" increments the counter.
- [ ] Close Expo Go completely (swipe it away), reopen the project: counter value survived.
- [ ] "Test notification": allow permission, then lock the phone — a notification arrives after ~5 s.

## Phases

- **0** Hello world in Expo Go, GitHub repo ← you are here
- **1** Local core: tasks, Eisenhower view, 30-min slot suggestions, manual replanning,
  local notifications, streaks/XP, JSON backup to the Files app
- **2** Apple Calendar (incl. synced work calendar) + Reminders
- **3** Capture: Shortcuts OCR → paste → parser → review screen
- **4** Decision point: real build (EAS/TestFlight), share-sheet capture, on-device AI
- **5** Topic grouping, project progress, efficiency metrics

## Commands

```bash
npm install          # install dependencies
npx expo start       # dev server + QR code
npx tsc --noEmit     # typecheck
npx expo-doctor      # diagnose dependency/config issues
```
