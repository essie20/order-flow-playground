# 🚲 Order Flow Playground

A high-fidelity order flow simulator built with **React 19**, **TypeScript**, and **Tailwind CSS v4**. This project demonstrates professional frontend engineering patterns including explicit state machines, idempotent API interactions, and robust error handling for asynchronous operations.

> **Disclaimer**: This project was developed as part of a technical exercise using **Antigravity**, an agentic AI coding assistant designed by the Google DeepMind team.

## 🚀 Key Features

- **🛒 Smart Cart System**: Real-time quantity management, persistent storage via `localStorage`, and derived state calculations.
- **📈 Live Order Tracking**: A deterministic time-based status simulator (Created → Confirmed → Preparing → Ready → Delivered).
- **🔗 URL-Synced State**: Tracking state is synchronized with URL query parameters (`?orderId=...`), allowing for persistent session tracking across refreshes.
- **🛡️ Idempotent Operations**: Prevents duplicate order creation through client-side generated idempotency keys and backend validation.
- **🏗️ Mock Backend Layer**: Full API mocking using **Mock Service Worker (MSW)** with persistent storage in **IndexedDB**.
- **🐞 Chaos Engineering Panel**: A built-in debug panel to simulate real-world networking issues (latency, 500 errors) to test application resilience.
- **♿ Accessibility First**: Built with semantic HTML, `aria-live` regions for status updates, and focus management for critical state transitions.

## 🛠️ Tech Stack

- **Core**: React 19 (Hooks, Context API, useReducer)
- **Tooling**: Vite 7 + TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 (Modern CSS-only configuration)
- **State Management**: 
  - **Client**: `useReducer` + Context API
  - **Server**: TanStack Query v5 (Auto-polling, retries, caching)
- **Mocking**: MSW (Mock Service Worker) + IndexedDB (for persistence)
- **Utility**: `clsx` + `tailwind-merge` for dynamic classes

## 🏗️ Engineering Highlights

### Explicit State Machine
The order status flow is modeled as a strict state machine to prevent "impossible" UI states. Only valid transitions (e.g., `PREPARING` → `READY`) are processed.

### Persistence Strategy
While the application state survives refreshes via `localStorage`, the simulated backend state (orders) is preserved in `IndexedDB`. This ensures that even if you refresh while an order is "Preparing", the status continues correctly rather than resetting.

### Resilience Testing (Debug Panel)
The integrated Debug Panel allows developers to:
1. **Injected Latency**: Add artificial delay (0-5s) to simulate slow 3G/4G connections.
2. **Failure Injection**: Set a cumulative failure rate (0-100%) to verify that the UI correctly handles and recovers from API errors (500 Internal Server Error).

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
# Clone the repository
git clone https://github.com/essie20/order-flow-playground.git

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production
```bash
npm run build
```


---
Built with ❤️ and Antigravity.
