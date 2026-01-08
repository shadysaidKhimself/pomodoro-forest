# Pomodoro Forest 🌲

帶有白噪音的沉浸式番茄鐘 (Immersive Pomodoro with White Noise)

A focus timer application that gamifies productivity. Plant a seed, focus for 25 minutes, and watch it grow into a majestic tree. If you break focus, the tree withers.

## Stack
- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Effects**: canvas-confetti

## Core Logic & Rules

### Timer System
The timer uses a **Date-delta approach** rather than a simple decrement counter. This ensures accuracy even if the browser tab is throttled in the background.
- **Start**: Calculates `expectedEndTime = Date.now() + duration`.
- **Tick**: Updates UI based on `expectedEndTime - Date.now()`.
- **Focus Duration**: Default 25 minutes.

### Tree Evolution
The tree evolves visually based on the elapsed time of the current session:
1.  **Seed** 🌱 (0 - 8 mins)
2.  **Sprout** 🌿 (8 - 16 mins)
3.  **Sapling** 🌳 (16 - 25 mins)
4.  **Tree** 🌲 (25+ mins)
5.  **Success** 🎆 (Completion) - Fireworks!
6.  **Failure** 🥀 (Give Up) - Withered flower.

### States
- `IDLE`: Initial state, waiting to start.
- `RUNNING`: Timer active, tree growing.
- `PAUSED`: Timer frozen.
- `COMPLETED`: Session finished successfully.
- `FAILED`: User gave up manually.

## Design System
- **Background**: Deep Forest Green (`#1A2F1A`)
- **Accent**: Leaf Green (`#4CAF50`)
- **Text**: Creamy White (`#E8F5E9`)
- **Font**: Inter / System UI

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Future Agents Note
When modifying the timer logic, **DO NOT** revert to a simple `setInterval` decrement. The current `Date.now()` implementation is critical for background tab accuracy.
