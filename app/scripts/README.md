# Admin Setup and Database Constraints

This directory contains scripts for creating admin users and validating database constraints.

## Files

- `create-admin.js` - Creates an admin user with proper database constraints
- `validate-schema.js` - Validates database schema and constraints
- `README.md` - This documentation file

## Admin User Creation

### Running the Admin Creation Script

```bash
cd scripts
node create-admin.js
```

### Admin User Details

The script creates an admin user with the following default credentials:
- **Email**: shabahatsyed101@gmail.com
- **Password**: hello123
- **Role**: admin
- **Subscription**: lifetime

### Database Constraints

The admin user is created with the following database constraints:

#### User Schema Constraints

1. **Name Field**:
   - Required
   - Maximum 60 characters
   - Cannot be empty
   - Automatically trimmed

2. **Email Field**:
   - Required
   - Must be unique
   - Must be valid email format
   - Automatically converted to lowercase
   - Automatically trimmed

3. **Password Field**:
   - Required
   - Minimum 6 characters
   - Automatically hashed with bcrypt (cost: 12)

4. **Role Field**:
   - Required
   - Enum: ['user', 'admin']
   - Default: 'user'

5. **Subscription Field**:
   - Required
   - Enum: ['free', 'pro', 'lifetime']
   - Default: 'free'

6. **Timestamps**:
   - `createdAt`: Immutable, set on creation
   - `updatedAt`: Automatically updated on save

#### Database Indexes

The following indexes are created for optimal performance:

1. **Email Index**: Unique index on email field
2. **Role Index**: Index on role field for quick admin queries
3. **Subscription Index**: Index on subscription field
4. **Created At Index**: Descending index on createdAt for sorting

#### Validation Rules

1. **Email Validation**: Regex pattern for valid email format
2. **Password Validation**: Minimum length check
3. **Name Validation**: Non-empty string check
4. **Role Validation**: Enum value check
5. **Subscription Validation**: Enum value check

## Schema Validation

### Running the Validation Script

```bash
cd scripts
node validate-schema.js
```

### What the Validation Script Tests

1. **Database Indexes**: Verifies all required indexes exist
2. **Admin User**: Checks if admin user exists with proper privileges
3. **User Statistics**: Counts total users, admins, and regular users
4. **Subscription Distribution**: Shows distribution across subscription types
5. **Schema Constraints**: Tests all validation rules:
   - Invalid email format
   - Short password
   - Invalid role
   - Invalid subscription
   - Empty name

## Admin User Features

### Privileges

- **Role**: admin (full access)
- **Subscription**: lifetime (unlimited access)
- **Access**: Can access admin dashboard and all features

### Security

- **Password**: Automatically hashed with bcrypt
- **Email**: Unique constraint prevents duplicates
- **Validation**: All fields validated before save

### Database Methods

The User model includes these utility methods:

1. **comparePassword(candidatePassword)**: Compares password with hashed version
2. **findAdmins()**: Static method to find all admin users

## Usage Examples

### Creating a New Admin

```javascript
const User = require('../src/models/User');

const newAdmin = await User.create({
  name: 'New Admin',
  email: 'admin@example.com',
  password: 'securepassword',
  role: 'admin',
  subscription: 'lifetime'
});
```

### Finding Admin Users

```javascript
const admins = await User.findAdmins();
console.log(`Found ${admins.length} admin users`);
```

### Validating User Data

```javascript
const user = new User({
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: 'user'
});

try {
  await user.save();
  console.log('User saved successfully');
} catch (error) {
  console.log('Validation error:', error.message);
}
```

## Troubleshooting

### Common Issues

1. **Duplicate Email Error**: Email already exists in database
2. **Validation Error**: Data doesn't meet schema requirements
3. **Connection Error**: MongoDB not running or wrong connection string

### Solutions

1. **For duplicate email**: Use a different email or update existing user
2. **For validation errors**: Check data format and requirements
3. **For connection errors**: Ensure MongoDB is running and connection string is correct

## Security Notes

- Admin passwords are automatically hashed
- Email addresses are validated and normalized
- All user input is validated before database operations
- Database indexes prevent duplicate emails
- Role-based access control is enforced

## Maintenance

- Run validation script periodically to ensure constraints are working
- Monitor admin user count and privileges
- Update admin credentials as needed
- Backup database regularly