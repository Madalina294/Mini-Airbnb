# Teste Postman pentru Booking Service

**Base URL:** `http://localhost:3000/api/bookings`

**Notă:** Toate request-urile care necesită autentificare trebuie să includă header-ul:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 1. POST /api/bookings - Creează rezervare

**Method:** `POST`  
**URL:** `http://localhost:3000/api/bookings`  
**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "propertyId": "123e4567-e89b-12d3-a456-426614174000",
  "checkIn": "2024-06-15T14:00:00.000Z",
  "checkOut": "2024-06-20T11:00:00.000Z",
  "guests": 2,
  "guestName": "Ion Popescu",
  "guestEmail": "ion.popescu@example.com",
  "guestPhone": "+40712345678",
  "specialRequests": "Aș dori o cameră la etajul superior"
}
```

**Câmpuri obligatorii:**
- `propertyId` (UUID)
- `checkIn` (ISO date string)
- `checkOut` (ISO date string)
- `guests` (number, minim 1)

**Câmpuri opționale:**
- `guestName`
- `guestEmail`
- `guestPhone`
- `specialRequests`

**Răspuns succes (201):**
```json
{
  "success": true,
  "data": {
    "id": "abc123-def456-ghi789",
    "propertyId": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "user-uuid-here",
    "checkIn": "2024-06-15T14:00:00.000Z",
    "checkOut": "2024-06-20T11:00:00.000Z",
    "totalPrice": 500.00,
    "guests": 2,
    "status": "PENDING",
    "guestName": "Ion Popescu",
    "guestEmail": "ion.popescu@example.com",
    "guestPhone": "+40712345678",
    "specialRequests": "Aș dori o cameră la etajul superior",
    "createdAt": "2024-05-01T10:00:00.000Z",
    "updatedAt": "2024-05-01T10:00:00.000Z"
  }
}
```

---

## 2. GET /api/bookings/:id - Obține detalii rezervare

**Method:** `GET`  
**URL:** `http://localhost:3000/api/bookings/{bookingId}`  
**Headers:** (opțional - nu necesită autentificare)
```
Authorization: Bearer YOUR_JWT_TOKEN (opțional)
```

**Exemplu:**
```
GET http://localhost:3000/api/bookings/abc123-def456-ghi789
```

**Răspuns succes (200):**
```json
{
  "success": true,
  "data": {
    "id": "abc123-def456-ghi789",
    "propertyId": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "user-uuid-here",
    "checkIn": "2024-06-15T14:00:00.000Z",
    "checkOut": "2024-06-20T11:00:00.000Z",
    "totalPrice": 500.00,
    "guests": 2,
    "status": "PENDING",
    "guestName": "Ion Popescu",
    "guestEmail": "ion.popescu@example.com",
    "guestPhone": "+40712345678",
    "specialRequests": "Aș dori o cameră la etajul superior",
    "createdAt": "2024-05-01T10:00:00.000Z",
    "updatedAt": "2024-05-01T10:00:00.000Z"
  }
}
```

---

## 3. GET /api/bookings/my-bookings - Rezervările mele

**Method:** `GET`  
**URL:** `http://localhost:3000/api/bookings/my-bookings`  
**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Răspuns succes (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "abc123-def456-ghi789",
      "propertyId": "123e4567-e89b-12d3-a456-426614174000",
      "userId": "user-uuid-here",
      "checkIn": "2024-06-15T14:00:00.000Z",
      "checkOut": "2024-06-20T11:00:00.000Z",
      "totalPrice": 500.00,
      "guests": 2,
      "status": "PENDING",
      "createdAt": "2024-05-01T10:00:00.000Z",
      "updatedAt": "2024-05-01T10:00:00.000Z"
    }
  ]
}
```

---

## 4. GET /api/bookings/property/:propertyId - Rezervări pentru o proprietate

**Method:** `GET`  
**URL:** `http://localhost:3000/api/bookings/property/{propertyId}`  
**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Notă:** Doar proprietarul proprietății poate vedea rezervările.

**Exemplu:**
```
GET http://localhost:3000/api/bookings/property/123e4567-e89b-12d3-a456-426614174000
```

**Răspuns succes (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "abc123-def456-ghi789",
      "propertyId": "123e4567-e89b-12d3-a456-426614174000",
      "userId": "guest-uuid-here",
      "checkIn": "2024-06-15T14:00:00.000Z",
      "checkOut": "2024-06-20T11:00:00.000Z",
      "totalPrice": 500.00,
      "guests": 2,
      "status": "PENDING",
      "createdAt": "2024-05-01T10:00:00.000Z",
      "updatedAt": "2024-05-01T10:00:00.000Z"
    }
  ]
}
```

---

## 5. GET /api/bookings/search - Caută rezervări

**Method:** `GET`  
**URL:** `http://localhost:3000/api/bookings/search`  
**Headers:** (opțional)
```
Authorization: Bearer YOUR_JWT_TOKEN (opțional)
```

**Query Parameters (toate opționale):**
- `checkIn` - ISO date string (ex: `2024-06-15T14:00:00.000Z`)
- `checkOut` - ISO date string
- `userId` - UUID
- `propertyId` - UUID
- `status` - `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`
- `page` - number (default: 1)
- `limit` - number (default: 10, max: 100)

**Exemple:**

1. **Caută după status:**
```
GET http://localhost:3000/api/bookings/search?status=PENDING
```

2. **Caută pentru un user:**
```
GET http://localhost:3000/api/bookings/search?userId=user-uuid-here
```

3. **Caută pentru o proprietate:**
```
GET http://localhost:3000/api/bookings/search?propertyId=123e4567-e89b-12d3-a456-426614174000
```

4. **Caută cu paginare:**
```
GET http://localhost:3000/api/bookings/search?page=1&limit=20
```

5. **Caută combinat:**
```
GET http://localhost:3000/api/bookings/search?propertyId=123e4567-e89b-12d3-a456-426614174000&status=CONFIRMED&page=1&limit=10
```

**Răspuns succes (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "abc123-def456-ghi789",
      "propertyId": "123e4567-e89b-12d3-a456-426614174000",
      "userId": "user-uuid-here",
      "checkIn": "2024-06-15T14:00:00.000Z",
      "checkOut": "2024-06-20T11:00:00.000Z",
      "totalPrice": 500.00,
      "guests": 2,
      "status": "PENDING",
      "createdAt": "2024-05-01T10:00:00.000Z",
      "updatedAt": "2024-05-01T10:00:00.000Z"
    }
  ]
}
```

---

## 6. PUT /api/bookings/:id - Actualizează rezervare

**Method:** `PUT`  
**URL:** `http://localhost:3000/api/bookings/{bookingId}`  
**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Notă:** Doar proprietarul rezervării poate actualiza.

**Body (JSON) - toate câmpurile sunt opționale:**
```json
{
  "status": "CONFIRMED",
  "cancellationReason": "Schimbare de planuri"
}
```

**Statusuri valide:**
- `PENDING`
- `CONFIRMED`
- `CANCELLED`
- `COMPLETED`

**Exemplu:**
```
PUT http://localhost:3000/api/bookings/abc123-def456-ghi789
```

**Răspuns succes (200):**
```json
{
  "success": true,
  "data": {
    "id": "abc123-def456-ghi789",
    "propertyId": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "user-uuid-here",
    "checkIn": "2024-06-15T14:00:00.000Z",
    "checkOut": "2024-06-20T11:00:00.000Z",
    "totalPrice": 500.00,
    "guests": 2,
    "status": "CONFIRMED",
    "updatedAt": "2024-05-01T11:00:00.000Z"
  }
}
```

---

## 7. DELETE /api/bookings/:id - Șterge rezervare

**Method:** `DELETE`  
**URL:** `http://localhost:3000/api/bookings/{bookingId}`  
**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Notă:** Doar proprietarul rezervării poate șterge.

**Exemplu:**
```
DELETE http://localhost:3000/api/bookings/abc123-def456-ghi789
```

**Răspuns succes (200):**
```json
{
  "success": true,
  "message": "Booking deleted successfully"
}
```

---

## 8. POST /api/bookings/:id/cancel - Anulează rezervare

**Method:** `POST`  
**URL:** `http://localhost:3000/api/bookings/{bookingId}/cancel`  
**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Notă:** Doar proprietarul rezervării poate anula.

**Body (JSON) - opțional:**
```json
{
  "reason": "Schimbare de planuri, nu mai pot veni"
}
```

**Exemplu:**
```
POST http://localhost:3000/api/bookings/abc123-def456-ghi789/cancel
```

**Răspuns succes (200):**
```json
{
  "success": true,
  "data": {
    "id": "abc123-def456-ghi789",
    "propertyId": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "user-uuid-here",
    "checkIn": "2024-06-15T14:00:00.000Z",
    "checkOut": "2024-06-20T11:00:00.000Z",
    "totalPrice": 500.00,
    "guests": 2,
    "status": "CANCELLED",
    "cancellationReason": "Schimbare de planuri, nu mai pot veni",
    "cancelledAt": "2024-05-01T12:00:00.000Z",
    "updatedAt": "2024-05-01T12:00:00.000Z"
  }
}
```

---

## 9. POST /api/bookings/:id/confirm - Confirmă rezervare

**Method:** `POST`  
**URL:** `http://localhost:3000/api/bookings/{bookingId}/confirm`  
**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Notă:** Doar proprietarul proprietății (host-ul) poate confirma rezervări.

**Exemplu:**
```
POST http://localhost:3000/api/bookings/abc123-def456-ghi789/confirm
```

**Răspuns succes (200):**
```json
{
  "success": true,
  "data": {
    "id": "abc123-def456-ghi789",
    "propertyId": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "user-uuid-here",
    "checkIn": "2024-06-15T14:00:00.000Z",
    "checkOut": "2024-06-20T11:00:00.000Z",
    "totalPrice": 500.00,
    "guests": 2,
    "status": "CONFIRMED",
    "confirmedAt": "2024-05-01T13:00:00.000Z",
    "updatedAt": "2024-05-01T13:00:00.000Z"
  }
}
```

---

## Erori comune

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "message": "Token is required",
    "statusCode": 401
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "message": "Booking not found",
    "statusCode": 404
  }
}
```

### 409 Conflict (Proprietate indisponibilă)
```json
{
  "success": false,
  "error": {
    "message": "Property is not available for the selected dates",
    "statusCode": 409
  }
}
```

### 400 Bad Request (Validare)
```json
{
  "success": false,
  "error": {
    "message": "Validation failed: [{\"field\":\"checkIn\",\"message\":\"Invalid check-in date\"}]",
    "statusCode": 400
  }
}
```

---

## Flux recomandat de testare

1. **Login** - Obține token JWT de la `/api/auth/login`
2. **Creează rezervare** - `POST /api/bookings` (cu token)
3. **Vezi rezervările mele** - `GET /api/bookings/my-bookings` (cu token)
4. **Vezi detalii rezervare** - `GET /api/bookings/{id}`
5. **Confirmă rezervare** - `POST /api/bookings/{id}/confirm` (cu token de host)
6. **Caută rezervări** - `GET /api/bookings/search?status=CONFIRMED`
7. **Anulează rezervare** - `POST /api/bookings/{id}/cancel` (cu token)

---

## Variabile Postman utile

Poți crea variabile în Postman pentru a reutiliza valorile:

- `{{baseUrl}}` = `http://localhost:3000`
- `{{token}}` = Token-ul JWT obținut la login
- `{{bookingId}}` = ID-ul rezervării create
- `{{propertyId}}` = ID-ul proprietății

**Exemplu de URL cu variabile:**
```
{{baseUrl}}/api/bookings/{{bookingId}}
```

