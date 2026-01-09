# CallFlow Frontend

React web dashboard with Material-UI for managing sales calls and team.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Update `.env` with your backend API URL:
```
VITE_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Features

- **Dashboard** - View call statistics, charts, and team performance
- **Calls Management** - View, create, update, and delete call logs
- **Contacts Management** - Manage customer contacts and leads
- **Team Management** - Add and manage team members (admin only)
- **Reports** - View detailed reports and analytics
- **Profile** - View and update user profile

## Login Credentials

Default admin:
- Email: admin@callflow.com
- Password: admin123

## User Roles

1. **Admin** - Full access to all features
2. **Manager** - Can view team data and analytics
3. **Sales Rep** - Can only manage own calls and contacts

## Technologies

- React 18
- Material-UI (MUI) v5
- React Router v6
- Axios for API calls
- Recharts for analytics
- Vite for bundling

## Pages

- `/login` - Login page
- `/signup` - Registration page
- `/dashboard` - Main dashboard with statistics
- `/calls` - Calls management
- `/contacts` - Contacts management
- `/team` - Team management (admin/manager)
- `/reports` - Reports and analytics (admin/manager)
- `/profile` - User profile

## Components Structure

```
src/
├── components/
│   ├── Auth/ - Login and Signup
│   ├── Layout/ - Sidebar, Header, Layout
│   ├── Dashboard/ - Dashboard widgets
│   └── Calls, Contacts, Team components
├── pages/ - Main page components
├── services/ - API service functions
├── context/ - React Context (Auth)
└── theme/ - Material-UI theme
```
