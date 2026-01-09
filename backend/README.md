# CallFlow Backend API

Node.js + Express + PostgreSQL backend for CallFlow sales call tracking system.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Configure `.env` file with your database credentials

3. Run migrations to create tables:
```bash
npm run migrate
```

4. Start development server:
```bash
npm run dev
```

5. Start production server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires auth)

### Calls
- `GET /api/calls` - Get all calls (filtered by role)
- `GET /api/calls/:id` - Get call details
- `POST /api/calls` - Create new call
- `PUT /api/calls/:id` - Update call
- `DELETE /api/calls/:id` - Delete call
- `POST /api/calls/:id/recording` - Upload call recording

### Contacts
- `GET /api/contacts` - Get all contacts
- `GET /api/contacts/:id` - Get contact details
- `POST /api/contacts` - Create contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Users
- `GET /api/users` - Get all users (admin/manager only)
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create user (admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Deactivate user (admin only)

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard stats
- `GET /api/analytics/calls-over-time` - Get calls over time chart data
- `GET /api/analytics/team-performance` - Get team performance metrics

## Environment Variables

```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=callflow_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE=50000000
UPLOAD_PATH=./uploads
```

## Default Admin User

After running migrations:
- Email: admin@callflow.com
- Password: admin123

**Important**: Change this password after first login!

## Database Schema

- **users** - User accounts with roles
- **contacts** - Customer/lead information
- **calls** - Call logs and details
- **call_recordings** - Audio file metadata
- **teams** - Sales team organization
- **team_members** - User-team relationships

## Technologies

- Node.js & Express
- PostgreSQL & Sequelize ORM
- JWT Authentication
- Multer for file uploads
- bcrypt for password hashing
