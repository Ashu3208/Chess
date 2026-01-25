# Refresh Token Implementation Guide

## Overview

This application now uses a **dual-token authentication system** with Access Tokens and Refresh Tokens for improved security and user experience.

## How It Works

### Token Types

1. **Access Token** (Short-lived: 15 minutes)
   - Used for authenticating API requests
   - Stored in cookie: `ACCESS_TOKEN`
   - Automatically refreshed when expired
   - Contains user info: `_id`, `email`, `username`

2. **Refresh Token** (Long-lived: 7 days)
   - Used to obtain new access tokens
   - Stored in cookie: `REFRESH_TOKEN`
   - Stored in database (up to 5 per user)
   - Revoked on logout or security events

### Authentication Flow

```
1. User logs in/registers
   ↓
2. Server generates:
   - Access Token (15 min expiry)
   - Refresh Token (7 days expiry)
   ↓
3. Both tokens stored in cookies
   ↓
4. Access Token used for API requests
   ↓
5. When Access Token expires (401 error):
   - Client automatically calls /user/refresh-token
   - Server validates Refresh Token
   - New Access Token issued
   - Original request retried
   ↓
6. On logout:
   - Refresh Token revoked in database
   - Both tokens cleared from cookies
```

## Server-Side Implementation

### User Model (`server/database/models/user.js`)

- `generateAccessToken()` - Creates short-lived access token
- `generateRefreshToken()` - Creates long-lived refresh token
- `addRefreshToken()` - Stores refresh token (max 5 per user)
- `removeRefreshToken()` - Revokes specific refresh token
- `clearAllRefreshTokens()` - Revokes all tokens (for security)

### Endpoints (`server/routes/userRouter.js`)

- `POST /user/login` - Returns `{ accessToken, refreshToken }`
- `POST /user/register` - Returns `{ accessToken, refreshToken }`
- `POST /user/refresh-token` - Takes `refreshToken`, returns new `accessToken`
- `POST /user/logout` - Revokes refresh token
- `GET /user/valid` - Protected route, validates access token

### Auth Middleware (`server/middleware/auth.js`)

- Validates access token on protected routes
- Returns detailed error messages:
  - `TOKEN_EXPIRED` - Access token expired (client should refresh)
  - `INVALID_TOKEN` - Token is malformed
  - `Authorization header missing` - No token provided

## Client-Side Implementation

### Axios Interceptor (`client/src/utilities/axiosConfig.js`)

Automatically handles:
- Adding access token to all requests
- Detecting 401 errors (expired tokens)
- Refreshing tokens automatically
- Retrying failed requests with new token
- Queueing requests during refresh
- Redirecting to login if refresh fails

### Usage

```javascript
// Use axiosInstance instead of axios for authenticated requests
import axiosInstance from "../utilities/axiosConfig";

// All requests automatically include access token
const response = await axiosInstance.get("/user/valid");
```

### User Context (`client/src/context/userState.jsx`)

- `getCurrUser()` - Fetches current user (uses axiosInstance)
  - **Auto-login**: If refresh token exists but access token is expired/missing, automatically refreshes and logs user in
  - Runs on app load to restore user session
- `logout()` - Revokes refresh token and clears cookies

## Environment Variables

Add to your `.env` file:

```env
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here  # Optional, defaults to JWT_SECRET + '_refresh'
```

## Security Features

1. **Token Rotation**: New access tokens on each refresh
2. **Token Revocation**: Refresh tokens can be revoked (logout, security breach)
3. **Limited Token Storage**: Max 5 refresh tokens per user
4. **Automatic Cleanup**: Expired tokens automatically rejected
5. **HttpOnly Cookies**: Consider using httpOnly cookies for production (requires server-side cookie setting)

## Migration Notes

### Old System
- Single token stored as `TOKEN` cookie
- No expiration handling
- No logout revocation

### New System
- Two tokens: `ACCESS_TOKEN` and `REFRESH_TOKEN`
- Automatic token refresh
- Proper logout with token revocation

## Best Practices

1. **Never store tokens in localStorage** - Use httpOnly cookies in production
2. **Use HTTPS** - Always in production
3. **Rotate secrets** - Change JWT secrets periodically
4. **Monitor token usage** - Log suspicious refresh patterns
5. **Implement rate limiting** - Prevent token refresh abuse

## Testing

1. Login/Register - Should receive both tokens
2. Make authenticated request - Should work
3. Wait 15+ minutes - Access token should auto-refresh
4. Logout - Refresh token should be revoked
5. Try to use revoked token - Should fail

## Troubleshooting

### "Token expired" errors
- Check if refresh token exists in cookies
- Verify JWT_REFRESH_SECRET matches server
- Check token expiry times in User model

### "Refresh token revoked" errors
- User logged out or token was cleared
- User has more than 5 active refresh tokens
- Security event triggered token revocation

### Auto-refresh not working
- Verify axiosInstance is used (not axios)
- Check browser console for errors
- Verify refresh-token endpoint is accessible

