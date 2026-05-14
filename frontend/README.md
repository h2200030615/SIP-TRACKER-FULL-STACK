# SIP Tracker and Portfolio Valuation Frontend

A modern, responsive frontend for the SIP Tracker and Portfolio Valuation System built with Next.js, React, and Tailwind CSS.

## Features

- 📊 **Dashboard** - Overview of portfolio, investments, and key metrics
- 👥 **Investor Management** - Add, edit, and delete investors
- 📈 **Mutual Fund Management** - Manage mutual fund database
- 💳 **SIP Registration** - Register and manage Systematic Investment Plans
- 📋 **Transaction History** - Track all SIP transactions
- 💼 **Portfolio Valuation** - View complete portfolio with valuations
- 🔐 **Authentication** - Secure login system with token management
- 📱 **Responsive Design** - Works seamlessly on mobile and desktop
- 📊 **Data Visualization** - Charts and graphs for better insights

## Tech Stack

- **Framework**: Next.js 14
- **UI Framework**: React 18
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/
│   ├── UI.jsx              # Reusable UI components (Button, Input, etc.)
│   ├── Layout.jsx          # Navbar and Sidebar components
│   └── Common.jsx          # Common components (Table, Modal, etc.)
├── pages/
│   ├── index.jsx           # Home/Landing page
│   ├── login.jsx           # Login page
│   ├── dashboard.jsx       # Dashboard with stats and charts
│   ├── investors.jsx       # Investor management
│   ├── funds.jsx           # Mutual fund management
│   ├── sips.jsx            # SIP registration
│   ├── transactions.jsx    # Transaction history
│   ├── portfolio.jsx       # Portfolio valuation
│   ├── _app.jsx            # Next.js app wrapper
│   └── _document.jsx       # Custom document
├── services/
│   ├── apiClient.js        # Axios client with interceptors
│   └── index.js            # API endpoints
├── utils/
│   ├── helpers.js          # Utility functions
│   └── middleware.js       # Auth middleware and HOCs
└── styles/
    └── globals.css         # Global styles
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The frontend integrates with 4 main APIs:

### 1. **Investors API**
- `GET /api/investors` - Get all investors
- `GET /api/investors/:id` - Get investor by ID
- `POST /api/investors` - Create new investor
- `PUT /api/investors/:id` - Update investor
- `DELETE /api/investors/:id` - Delete investor

### 2. **Funds API**
- `GET /api/funds` - Get all funds
- `GET /api/funds/:id` - Get fund by ID
- `POST /api/funds` - Create new fund
- `PUT /api/funds/:id` - Update fund
- `DELETE /api/funds/:id` - Delete fund

### 3. **SIPs API**
- `GET /api/sips` - Get all SIPs
- `GET /api/sips/:id` - Get SIP by ID
- `POST /api/sips` - Register new SIP
- `PUT /api/sips/:id` - Update SIP
- `DELETE /api/sips/:id` - Delete SIP

### 4. **Transactions API**
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `GET /api/transactions?sipId=:sipId` - Get transactions by SIP
- `GET /api/transactions?investorId=:investorId` - Get transactions by investor

## Authentication

- Login using email and password
- Token stored in localStorage
- Protected routes using `withAuth` middleware
- Automatic redirect to login on token expiry

## Demo Credentials

```
Email: admin@example.com
Password: password123
```

## Features

### 1. Dashboard
- Summary cards with key metrics
- Charts showing SIP contributions by month
- Portfolio distribution pie chart
- Quick statistics

### 2. Investor Management
- Add new investors with complete details
- Edit existing investor information
- Delete investors
- View investor details in modal
- Pagination support

### 3. Fund Management
- Add mutual funds with NAV
- Categorize by type (Equity, Debt, etc.)
- Risk level classification
- Edit and delete funds

### 4. SIP Registration
- Select investor and fund
- Set SIP amount and frequency
- Choose execution and date range
- Track SIP status

### 5. Transaction History
- View all SIP transactions
- Filter by investor
- Status badges (Success, Pending, Failed)
- Transaction statistics

### 6. Portfolio Valuation
- View complete portfolio by investor
- Holdings with units, invested amount, current value
- Profit/loss calculation
- Return percentage

## Styling

- Custom Tailwind configuration with primary blue/green theme
- Responsive grid layouts
- Smooth transitions and animations
- Professional fintech design
- Dark sidebar with navigation

## Error Handling

- Try-catch blocks for API calls
- User-friendly error messages
- Alert components for feedback
- Loading states for better UX

## Future Enhancements

- Dark mode support
- PDF export for reports
- Advanced filtering and search
- Data analytics
- Real-time portfolio updates
- Mobile app
- Email notifications

## Support

For issues or questions, please contact the development team.

## License

© 2026 SIP Tracker. All rights reserved.
