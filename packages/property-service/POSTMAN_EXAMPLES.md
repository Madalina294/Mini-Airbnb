# Property Service - Postman Examples

## Setup
- **Base URL (API Gateway):** `http://localhost:3000`
- **Base URL (Property Service direct):** `http://localhost:3002`

---

## 1. POST /api/properties - Creează proprietate

**URL:** `POST http://localhost:3000/api/properties`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "title": "Apartament modern în centru",
  "description": "Apartament frumos cu 2 camere, complet mobilat, în centrul orașului. Perfect pentru o familie sau un grup de prieteni.",
  "price": 150.50,
  "address": "Strada Principală nr. 10",
  "city": "București",
  "country": "România",
  "bedrooms": 2,
  "bathrooms": 1,
  "maxGuests": 4,
  "facilities": ["WiFi", "Parking", "Air Conditioning", "Kitchen"],
  "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
}
```

**Răspuns așteptat:** 201 Created

---

## 2. GET /api/properties/search - Căutare proprietăți

**URL:** `GET http://localhost:3000/api/properties/search`

**Query Parameters (opțional):**
- `city=București`
- `country=România`
- `minPrice=100`
- `maxPrice=200`
- `bedrooms=2`
- `status=AVAILABLE`
- `page=1`
- `limit=10`

**Exemplu complet:**
```
GET http://localhost:3000/api/properties/search?city=București&minPrice=100&maxPrice=200&bedrooms=2&page=1&limit=10
```

**Răspuns așteptat:** 200 OK

---

## 3. GET /api/properties/:id - Găsește proprietate

**URL:** `GET http://localhost:3000/api/properties/{propertyId}`

**Exemplu:**
```
GET http://localhost:3000/api/properties/123e4567-e89b-12d3-a456-426614174000
```

**Răspuns așteptat:** 200 OK

---

## 4. GET /api/properties/my-properties - Proprietățile mele

**URL:** `GET http://localhost:3000/api/properties/my-properties`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Răspuns așteptat:** 200 OK

---

## 5. PUT /api/properties/:id - Actualizează proprietate

**URL:** `PUT http://localhost:3000/api/properties/{propertyId}`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (JSON) - toate câmpurile sunt opționale:**
```json
{
  "title": "Titlu actualizat",
  "price": 200.00,
  "status": "RESERVED",
  "description": "Descriere actualizată"
}
```

**Răspuns așteptat:** 200 OK

---

## 6. DELETE /api/properties/:id - Șterge proprietate

**URL:** `DELETE http://localhost:3000/api/properties/{propertyId}`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Răspuns așteptat:** 200 OK

---

## Obținere Token (pentru testare)

**Register:**
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "host@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Login:**
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "host@example.com",
  "password": "password123"
}
```

**Salvează token-ul din răspuns:** `response.data.token`

---

## Teste de eroare

### Test 1: Creează fără token
```
POST http://localhost:3000/api/properties
Content-Type: application/json

{
  "title": "Test"
}
```
**Așteptat:** 401 Unauthorized

### Test 2: Creează cu date invalide
```
POST http://localhost:3000/api/properties
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "title": "",
  "price": -100
}
```
**Așteptat:** 400 Bad Request

### Test 3: Găsește proprietate inexistentă
```
GET http://localhost:3000/api/properties/invalid-id-12345
```
**Așteptat:** 404 Not Found

