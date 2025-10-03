# Complaint Portal API

A simple HTTP API server for managing complaints.

## Running the server

```bash
go run .
```

Server runs on port 8081.

## API Endpoints

- `POST /register` - Register new user
- `POST /login` - Login with secret code  
- `POST /submitComplaint` - Submit a complaint
- `POST /getAllComplaintsForUser` - Get user complaints
- `POST /getAllComplaintsForAdmin` - Get all complaints (admin only)
- `POST /viewComplaint` - View specific complaint
- `POST /resolveComplaint` - Resolve complaint (admin only)

## Testing

Default admin secret code: `ADMIN123`

Example request:
```bash
curl -X POST http://localhost:8081/login \
  -H "Content-Type: application/json" \
  -d '{"secret_code":"ADMIN123"}'
```