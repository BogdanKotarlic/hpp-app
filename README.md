# Hosted Payment Page (HPP) App

A modern, responsive payment interface built with **React**, **TypeScript**, **React Query**, and **Tailwind CSS**. Users can accept quotes, select a currency, view payment details, and complete payments via crypto.

## Features

- Quote acceptance with currency selection
- Live payment summary with countdown
- Expiry handling and redirection
- QR code and clipboard support
- Clean, Figma-matched UI
- Type-safe and testable architecture

## Installation

```bash
git clone https://github.com/BogdanKotarlic/hpp-app.git
cd hpp-app
npm install
```

## Running the App

```bash
npm start
```

Runs on http://localhost:3000

## Running Tests

```bash
npm test
```

## App Routes

- /payin/:uuid → Accept Quote page
- /payin/:uuid/pay → Payment page (with QR code, address)
- /payin/:uuid/expired → Expired page
