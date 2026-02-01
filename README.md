# SecureVault Pro

A full-stack password management application implementing AES-256 encryption, built with React, Vite, and Laravel to demonstrate practical cybersecurity implementation and modern web development practices.

## Overview

SecureVault Pro addresses the growing challenge of secure credential management in an increasingly digital world. The application provides military-grade encryption for password storage while maintaining an intuitive user experience through a modern React interface.

## Core Features

### Security Implementation
- **AES-256 Encryption** - All sensitive data encrypted at rest using Laravel's cryptographic services
- **Secure Authentication** - bcrypt password hashing with Laravel Breeze
- **CSRF Protection** - Token-based protection on all state-changing operations
- **SQL Injection Prevention** - Parameterized queries through Eloquent ORM
- **XSS Protection** - React's automatic content escaping
- **Comprehensive Audit Logging** - Complete activity tracking with IP addresses and user agents

### User Features
- Encrypted credential storage (passwords, usernames, URLs, notes)
- Cryptographically secure password generator
- Password visibility toggle with secure display
- One-click clipboard functionality
- Real-time interface updates without page refresh
- Audit log viewer with action filtering
- Fully responsive design for all devices

## Technology Stack

### Frontend Architecture
- **React 18** - Component-based UI with hooks for state management
- **Vite** - Next-generation frontend build tool for optimal performance
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Axios** - Promise-based HTTP client for API communication

### Backend Architecture
- **Laravel 11** - Modern PHP framework following MVC architecture
- **PHP 8.1+** - Latest PHP features and type safety
- **MySQL** - Relational database with optimized indexing
- **Laravel Breeze** - Lightweight authentication scaffolding

## Installation

### System Requirements
- PHP 8.1 or higher
- Composer 2.0+
- Node.js 18+ with npm
- MySQL 8.0+
- Git

### Quick Start

```bash
# Clone repository
git clone https://github.com/yourusername/securevault-pro.git
cd securevault-pro

# Install dependencies
composer install
npm install

# Environment setup
cp .env.example .env
php artisan key:generate

# Configure database in .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Build assets and start server
npm run dev
php artisan serve
```

Access the application at `http://localhost:8000`

## Architecture

### Encryption Flow
```
User Input → Validation → AES-256 Encryption → Database Storage
Database Retrieval → Decryption → Authorization Check → Secure Display
```

### Security Layers
1. **Application Layer** - Input validation, CSRF tokens, authentication middleware
2. **Database Layer** - Encrypted data storage, parameterized queries, user-scoped access
3. **Transport Layer** - HTTPS enforcement (production), secure headers

## Database Schema

### vault_items
Stores encrypted user credentials with the following structure:
- Primary key and user foreign key relationship
- Encrypted fields: username, password, notes
- Plain text fields: title, url
- Automatic timestamps

### audit_logs
Tracks all user activities for security monitoring:
- Action type and detailed description
- IP address and user agent information
- Timestamps for temporal analysis
- Indexed for query performance

## Security Implementation Details

### Data Encryption
Utilizes Laravel's encryption service implementing AES-256-CBC:
```php
// Encryption
$encrypted = Crypt::encryptString($sensitiveData);

// Decryption
$decrypted = Crypt::decryptString($encrypted);
```

### Authentication & Authorization
- Session-based authentication with secure cookie configuration
- Middleware-enforced authorization checks
- User-scoped database queries preventing unauthorized access
- Password requirements enforced through validation rules

### Audit System
Non-blocking audit logging capturing:
- User registration and authentication events
- CRUD operations on vault items
- Request metadata (IP, user agent, timestamp)
- Action descriptions for compliance tracking

## Development

### Running in Development Mode
```bash
# Terminal 1 - Frontend hot reload
npm run dev

# Terminal 2 - Backend server
php artisan serve
```

### Building for Production
```bash
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

### Code Standards
- PSR-12 coding standards for PHP
- ESLint configuration for JavaScript
- Component-based React architecture
- RESTful API conventions
- Comprehensive error handling

## API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User authentication
- `POST /logout` - Session termination

### Vault Management
- `GET /vault` - Retrieve user's encrypted items
- `POST /vault` - Create new encrypted item
- `PUT /vault/{id}` - Update existing item
- `DELETE /vault/{id}` - Delete item

### Audit Logs
- `GET /audit-logs` - Retrieve user's activity history

All endpoints require authentication and include CSRF protection.

## Project Structure

```
securevault-pro/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── VaultController.php
│   │   │   ├── AuditLogController.php
│   │   │   └── Auth/
│   │   └── Middleware/
│   └── Models/
│       ├── VaultItem.php
│       ├── AuditLog.php
│       └── User.php
├── database/
│   └── migrations/
│       ├── create_vault_items_table.php
│       └── create_audit_logs_table.php
├── resources/
│   ├── js/
│   │   ├── app.jsx
│   │   └── components/
│   │       ├── SecureVault.jsx
│   │       └── auditlog.jsx
│   ├── css/
│   │   └── app.css
│   └── views/
│       └── dashboard.blade.php
├── routes/
│   └── web.php
├── .env.example
├── composer.json
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Key Implementation Decisions

### Why React + Vite
- Vite provides significantly faster development experience compared to traditional bundlers
- Hot Module Replacement works reliably
- Optimized production builds with code splitting
- Modern tooling aligned with current industry practices

### Why Laravel
- Built-in encryption services implementing industry standards
- Comprehensive security features out of the box
- Eloquent ORM preventing SQL injection vulnerabilities
- Extensive ecosystem and documentation

### Database Design Choices
- Separate encryption for each sensitive field allowing granular access control
- Indexed foreign keys for query performance
- Cascade deletes maintaining referential integrity
- Nullable fields providing flexibility in data entry

## Security Considerations

### Environment Configuration
- Encryption keys stored in environment variables, never in version control
- Database credentials isolated in .env file
- Debug mode disabled in production
- Secure session configuration

### Input Validation
- Server-side validation on all user inputs
- Type checking and sanitization
- Length restrictions preventing buffer attacks
- URL validation on web addresses

### Output Encoding
- React's automatic XSS protection through JSX
- Proper content type headers
- No direct HTML interpolation

## Testing

### Manual Testing Checklist
- User registration and authentication flow
- Vault item creation with encryption verification
- Vault item retrieval and decryption
- Edit and delete operations
- Audit log generation and viewing
- Password generator functionality
- Clipboard operations

### Database Verification
```sql
-- Verify encrypted storage
SELECT username, password FROM vault_items;
-- Should show encrypted strings like "eyJpdiI6..."

-- Verify audit logging
SELECT * FROM audit_logs ORDER BY created_at DESC;
-- Should show all user activities
```

## Troubleshooting

### Common Issues

**Issue: 419 Page Expired**
```bash
php artisan config:clear
php artisan cache:clear
# Refresh browser and try again
```

**Issue: Encryption key not found**
```bash
php artisan key:generate
```

**Issue: Vite not building**
```bash
rm -rf node_modules
npm install
npm run dev
```

## Future Enhancements

### Planned Features
- Two-factor authentication implementation
- Password strength indicator
- Biometric authentication support
- Password breach detection via API integration
- Secure credential sharing between users
- Browser extension for autofill
- Mobile applications (iOS/Android)

### Research Opportunities
- Performance analysis of encryption operations at scale
- User experience studies on security vs convenience tradeoffs
- Comparative analysis of encryption algorithms
- Behavioral patterns in password management

## Performance Optimization

- Database queries optimized with eager loading
- Indexed columns for frequently queried fields
- React component memoization where applicable
- Vite's automatic code splitting
- Asset optimization in production builds

## Deployment Considerations

### Production Checklist
- Set `APP_ENV=production` in .env
- Set `APP_DEBUG=false` in .env
- Configure proper database credentials
- Enable HTTPS/SSL
- Set secure session configuration
- Configure proper file permissions
- Implement backup strategy
- Set up monitoring and logging

## Contributing

This project was developed as an educational initiative to demonstrate practical implementation of cybersecurity concepts in modern web applications. The codebase is structured for clarity and maintainability.

## License

MIT License - Open for educational and research purposes

## Technical Documentation

For detailed information about specific implementations:
- Encryption implementation: See `VaultController.php`
- Authentication flow: See `Auth/` directory
- React state management: See `components/SecureVault.jsx`
- Audit system: See `AuditLogController.php`

## Acknowledgments

Built using modern web technologies and security best practices. Special attention given to:
- OWASP security guidelines
- Laravel security documentation
- React best practices
- Current industry standards for credential management

---

This project demonstrates practical application of cybersecurity principles in full-stack web development, showcasing both technical implementation skills and understanding of security fundamentals essential for advanced studies and professional practice in information security.
