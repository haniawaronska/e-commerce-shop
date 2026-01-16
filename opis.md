# SPECYFIKACJA FUNKCJONALNA DO ZBUDOWANIA FRONTENDU E-COMMERCE

## 1. OGÓLNY OPIS APLIKACJI

Aplikacja e-commerce z pełnym systemem zarządzania, wspierająca:
- Niezalogowanych użytkowników (przeglądanie katalogu)
- Zalogowanych użytkowników (koszyk, zamówienia)
- Administratorów (zarządzanie produktami, zamówieniami, użytkownikami)

**Technologie:** HTML5, EJS templates, CSS, formularze POST/GET

---

## 2. SYSTEM RÓL I AUTORYZACJA

### Role użytkowników:
1. **Anonimowy** - może przeglądać katalog i szczegóły produktów
2. **Zalogowany użytkownik** - dostęp do koszyka, składania zamówień, historii zamówień
3. **Administrator** - pełny dostęp + panel administratora

### Zabezpieczenia endpointów:
- `/cart/*`, `/orders/*` - wymagają zalogowania
- `/manager/*` - wymagają roli admin
- `/login`, `/register` - dostępne tylko dla niezalogowanych (redirect do `/catalog` jeśli zalogowany)

### Sesje:
- Przechowywanie: `userId`, `username`, `role`
- Czas życia: 24 godziny
- Wylogowanie: POST `/logout` niszczy sesję

---

## 3. NAWIGACJA GŁÓWNA

**Nawigacja dynamiczna** (widoczna na każdej stronie):

### Dla niezalogowanych:
```
Home | Catalog | Login | Register
```

### Dla zalogowanych użytkowników:
```
Home | Catalog | Cart | Orders | [Welcome, {username}!] | Logout
```

### Dla administratorów (dodatkowy link):
```
Home | Catalog | Cart | Orders | Admin Panel (czerwony kolor) | [Welcome, {username}!] | Logout
```

**Stylowanie nawigacji:**
- Tło: ciemnozielone (`rgb(71, 82, 22)`)
- Tekst: beżowy (`antiquewhite`)
- Hover: ciemniejszy odcień zieleni
- Admin Panel: czerwony kolor tekstu (`#ff6b6b`)
- Każdy link jako button/formularz inline dla Logout

---

## 4. STRONA GŁÓWNA (Home)

**Endpoint:** GET `/`

**Elementy:**
1. Nagłówek H1: "Welcome to E-Commerce Store"
2. Podtytuł: "Browse our products and start shopping!"
3. Duże przyciski akcji (zależne od stanu zalogowania):

**Dla niezalogowanych:**
- "Browse Catalog" → `/catalog`
- "Login" → `/login`
- "Register" → `/register`

**Dla zalogowanych:**
- "Browse Catalog" → `/catalog`
- "View Cart" → `/cart`

**Dla adminów (dodatkowy przycisk):**
- "Admin Panel" (czerwone tło) → `/manager`

**Stylowanie przycisków:**
- Font size: 18px
- Padding: 15px 30px
- Margin: 10px
- Zielone tło (admin panel czerwone)

---

## 5. KATALOG PRODUKTÓW

**Endpoint:** GET `/catalog`

**Elementy:**
1. **Formularz wyszukiwania** (GET `/catalog/search`):
   - Input tekstowy: `name="q"` placeholder "Search products..."
   - Przycisk "Search"

2. **Lista produktów** (grid/flex layout):
   - Każdy produkt jako karta:
     - Nazwa produktu (H3)
     - Cena: "Price: **{price} PLN**"
     - Przycisk "View Details" → `/product/{productId}`

**Wyświetlanie:**
- Karty produktów: białe tło, border, zaokrąglone rogi, padding 30px
- Responsive grid (auto-fit/auto-fill)

**Dane produktu:**
- `ID` (string)
- `name` (string)
- `price` (number)
- `status` (enum: active/inactive/deleted)

---

## 6. SZCZEGÓŁY PRODUKTU

**Endpoint:** GET `/product/:id`

**Elementy:**
1. Nazwa produktu (H1)
2. ID produktu: "ID: {productId}"
3. Status: "Status: **{status}**"
4. Cena (duży zielony tekst): "Price: {price} PLN"
5. Opis produktu (Lorem ipsum placeholder lub pole description)
6. Przycisk "Add to Cart" (formularz POST `/cart/add/{productId}`)

**Uwaga:** 
- Przycisk "Add to Cart" powinien być widoczny tylko dla zalogowanych
- Jeśli niezalogowany, wyświetl komunikat "Please login to add products to cart"

---

## 7. REJESTRACJA

**Endpoint:** 
- GET `/register` - wyświetla formularz
- POST `/register` - przetwarza rejestrację

**Formularz (POST `/register`):**
```
Pola:
- username (text, required)
- email (email, required)
- password (password, required)

Przycisk: "Zarejestruj się"
```

**Walidacja:**
- Wszystkie pola wymagane
- Hasło min. 6 znaków
- Wyświetlanie błędów na czerwono ponad formularzem

**Link:** "Masz już konto? Zaloguj się" → `/login`

**Style:**
- Formularz: max-width 500px, wycentrowany
- Białe tło, padding 20px, border

---

## 8. LOGOWANIE

**Endpoint:**
- GET `/login` - wyświetla formularz
- POST `/login` - przetwarza logowanie

**Formularz (POST `/login`):**
```
Pola:
- username (text, required)
- password (password, required)

Przycisk: "Zaloguj się"
```

**Wyświetlanie błędów:** Czerwony tekst ponad formularzem

**Link:** "Nie masz konta? Zarejestruj się" → `/register`

**Po sukcesie:** Redirect do `/catalog`

---

## 9. KOSZYK

**Endpoint:** GET `/cart` (wymaga zalogowania)

**Scenariusz 1 - Pusty koszyk:**
- "Your cart is empty."
- Przycisk "Go to Catalog" → `/catalog`

**Scenariusz 2 - Koszyk z produktami:**

**Tabela:**
| Product | Unit Price | Quantity | Total | Actions |
|---------|-----------|----------|-------|---------|
| {name}  | {price} PLN | {qty} | {total} PLN | [Remove] |

**Stopka tabeli:**
- **Total: {cartTotal} PLN**

**Akcje (formularze POST):**
1. "Remove" - POST `/cart/remove/{productId}` (dla każdego produktu)
2. "Clear Cart" - POST `/cart/clear` (przycisk pod tabelą)
3. "Place Order" - POST `/cart/checkout` (zielony przycisk)

**Dodatkowy link:** "Continue Shopping" → `/catalog`

**Struktura danych koszyka:**
```
Cart {
  ID: string
  userID: string
  items: [
    {
      productId: string
      productName: string
      quantity: number
      unitPrice: number
      totalPrice: number (computed)
    }
  ]
  totalValue: number (computed)
}
```

---

## 10. ZAMÓWIENIA UŻYTKOWNIKA

### 10.1 Lista zamówień
**Endpoint:** GET `/orders` (wymaga zalogowania)

**Tabela:**
| Order ID | Date | Total Amount | Status |
|----------|------|--------------|--------|
| [link]   | {date} | {amount} PLN | {status} |

- Order ID jako link → `/orders/{orderId}`
- Date formatowany: `toDateString()`
- Status: open / completed / canceled

**Pusty stan:** "You have no orders."

### 10.2 Szczegóły zamówienia
**Endpoint:** GET `/orders/:id` (wymaga zalogowania + sprawdzenie czy zamówienie należy do użytkownika)

**Tabela produktów:**
| Product | Unit Price | Quantity | Total |
|---------|-----------|----------|-------|
| {name}  | {price} PLN | {qty} | {total} PLN |

**Stopka:**
- **Total Amount: {orderTotal} PLN**

**Struktura Order:**
```
Order {
  ID: string
  userID: string
  items: [
    {
      productId: string
      productName: string
      quantity: number
      unitPrice: number
      totalPrice: number (computed)
    }
  ]
  totalAmount: number
  status: OrderStatus (open/completed/canceled)
  createdAt: Date
}
```

---

## 11. PANEL ADMINISTRATORA

**Nawigacja admina** (widoczna w panelu):
```
Home | Products | Orders | Users
```

### 11.1 Zarządzanie produktami
**Endpoint:** GET `/manager` (wymaga roli admin)

**Elementy:**
1. Przycisk "+ Add New Product" (zielony) → `/manager/add`
2. Tabela produktów:

| ID | Name | Price | Actions |
|----|------|-------|---------|
| {id} | {name} | {price} PLN | [Edit] [Delete] |

**Akcje:**
- "Edit" → GET `/manager/edit/{id}`
- "Delete" → POST `/manager/delete/{id}` (czerwony przycisk z potwierdzeniem)

### 11.2 Dodawanie/edycja produktu
**Endpointy:**
- GET `/manager/add` - formularz dodawania
- POST `/manager/add` - zapisanie nowego produktu
- GET `/manager/edit/:id` - formularz edycji
- POST `/manager/edit/:id` - aktualizacja produktu

**Formularz:**
```
Pola:
- ID Product (text, required, readonly przy edycji)
- Name (text, required)
- Price (number, required)

Przycisk: "Save" (zielony)
```

**Logika:**
- Przy dodawaniu: generuj nowy ObjectId dla ID
- Przy edycji: ID read-only, pokazuj aktualne wartości

### 11.3 Zarządzanie zamówieniami
**Endpoint:** GET `/manager/orders` (wymaga admin)

**Tabela:**
| Order ID | User ID | Date | Total Amount | Status | Edit |
|----------|---------|------|--------------|--------|------|
| {id} | {userId} | {date} | {amount} PLN | {status} | [Finalize] [Cancel] |

**Akcje:**
- "Finalize" - POST `/manager/orders/finalize/{id}` 
  - Wyświetlaj tylko gdy status === 'open'
  - Zmienia status na 'completed'
- "Cancel" - POST `/manager/orders/cancel/{id}`
  - Zawsze widoczny
  - Zmienia status na 'canceled'

**Logika warunkowa:**
```
if (order.status === 'open') {
  // pokaż przycisk Finalize
}
// zawsze pokaż przycisk Cancel
```

### 11.4 Zarządzanie użytkownikami
**Endpoint:** GET `/manager/users` (wymaga admin)

**Tabela:**
| User ID | Email | Role | Edit |
|---------|-------|------|------|
| {id} | {email} | {role} [Change to Admin/User] | [Delete] |

**Akcje:**
1. Zmiana roli - POST `/manager/users/role/{id}`
   - Hidden input: `name="newRole" value="{newRole}"`
   - Przycisk dynamiczny:
     - Jeśli role === 'user': "Change to Admin"
     - Jeśli role === 'admin': "Change to User"

2. Usuwanie - POST `/manager/users/delete/{id}` (czerwony przycisk)

---

## 12. ENDPOINTY API (KOMPLETNA LISTA)

### Publiczne (bez autoryzacji):
```
GET  /                      - strona główna
GET  /catalog               - katalog produktów
GET  /catalog/search?q=...  - wyszukiwanie produktów
GET  /product/:id           - szczegóły produktu
GET  /register              - formularz rejestracji
POST /register              - rejestracja użytkownika
GET  /login                 - formularz logowania
POST /login                 - logowanie
```

### Dla zalogowanych:
```
POST /logout                - wylogowanie
GET  /cart                  - koszyk
POST /cart/add/:productId   - dodaj do koszyka (quantity=1)
POST /cart/remove/:productId - usuń z koszyka
POST /cart/clear            - wyczyść koszyk
POST /cart/checkout         - złóż zamówienie z koszyka
GET  /orders                - lista zamówień użytkownika
GET  /orders/:id            - szczegóły zamówienia
```

### Dla administratorów:
```
GET  /manager                        - panel produktów
GET  /manager/add                    - formularz dodawania produktu
POST /manager/add                    - zapisz nowy produkt
GET  /manager/edit/:id               - formularz edycji produktu
POST /manager/edit/:id               - aktualizuj produkt
POST /manager/delete/:id             - usuń produkt
GET  /manager/orders                 - wszystkie zamówienia
POST /manager/orders/finalize/:id    - finalizuj zamówienie
POST /manager/orders/cancel/:id      - anuluj zamówienie
GET  /manager/users                  - lista użytkowników
POST /manager/users/role/:id         - zmień rolę użytkownika
POST /manager/users/delete/:id       - usuń użytkownika
```

---

## 13. STYLOWANIE CSS

### Kolory:
- Tło strony: `rgb(255, 248, 239)` (jasnobeżowy)
- Nawigacja: `rgb(71, 82, 22)` (ciemnozielony)
- Nawigacja hover: `rgb(54, 61, 24)`
- Przyciski: `rgb(15, 46, 20)` (zielony)
- Przyciski hover: `rgb(14, 65, 27)`
- Przyciski delete: `rgba(228, 0, 0, 0.842)` (czerwony)
- Admin Panel link: `#ff6b6b` (czerwony)
- Tekst nawigacji: `antiquewhite`

### Główne klasy CSS:
```css
.nawigacja - główna nawigacja (flex, space-around)
.nav-link - linki nawigacji (padding 40px 100px)
.container - główny kontener treści (width: 1000px, center)
.product-card - karty produktów (border, padding 30px, max-width 600px)
.btn - przyciski (padding 10px 15px, border-radius 5px)
.btn-primary - przyciski główne akcji
.btn-success - przycisk checkout (zielony)
.btn-danger - przyciski delete (czerwone)
.btn-secondary - przycisk clear cart
.cart-table - tabela koszyka
.orders-table - tabela zamówień
.search-form - formularz wyszukiwania
```

### Layout:
- Body: width 1000px, wycentrowane (`margin: 0 auto`)
- Formularze: max-width 500px, wycentrowane
- Karty produktów: max-width 600px, margin auto
- Tabele: width 100%, border-collapse

---

## 14. PRZEPŁYWY UŻYTKOWNIKA

### Niezalogowany użytkownik:
1. Wchodzi na `/` → widzi przyciski Catalog, Login, Register
2. Przegląda `/catalog` → klika "View Details" → `/product/:id`
3. Próba "Add to Cart" → komunikat "Please login"
4. Register → wypełnia formularz → auto-login → redirect `/catalog`
5. Login → wypełnia formularz → redirect `/catalog`

### Zalogowany użytkownik:
1. Przegląda catalog → dodaje produkty do koszyka (POST `/cart/add/:id`)
2. Przegląda koszyk `/cart` → widzi produkty, może usuwać lub czyścić
3. "Place Order" → POST `/cart/checkout` → koszyk zamieniony na zamówienie → redirect `/orders`
4. Przegląda zamówienia `/orders` → klika Order ID → `/orders/:id` → widzi szczegóły
5. Logout → POST `/logout` → redirect `/`

### Administrator:
1. W nawigacji widzi "Admin Panel" (czerwony) → `/manager`
2. Panel produktów:
   - "+ Add New Product" → formularz → POST `/manager/add` → redirect `/manager`
   - "Edit" → formularz z danymi → POST `/manager/edit/:id` → redirect `/manager`
   - "Delete" → POST `/manager/delete/:id` → redirect `/manager`
3. Panel zamówień `/manager/orders`:
   - Widzi wszystkie zamówienia wszystkich użytkowników
   - "Finalize" (tylko dla open) → status zmienia się na completed
   - "Cancel" → status zmienia się na canceled
4. Panel użytkowników `/manager/users`:
   - Widzi listę użytkowników z email i rolą
   - "Change to Admin/User" → POST zmienia rolę
   - "Delete" → POST usuwa użytkownika

---

## 15. OBSŁUGA BŁĘDÓW

### Walidacja formularzy:
- Rejestracja: 
  - Wszystkie pola wymagane → "Wszystkie pola są wymagane"
  - Hasło < 6 znaków → "Hasło musi mieć co najmniej 6 znaków"
  - Duplikat username/email → wyświetl błąd z serwisu
- Login:
  - Błędne dane → wyświetl komunikat

### Komunikaty błędów:
- Wyświetlaj jako paragraf `<p style="color: red;">{error}</p>` nad formularzem
- Przekazywanie przez render: `res.render('view', { error: 'message' })`
- Sprawdzanie w EJS: `<% if (typeof error !== 'undefined') { %>`

### Błędy 404/403:
- Produkt nie znaleziony → 404 "Produkt nie znaleziony"
- Zamówienie nie należy do użytkownika → 403 "Access denied"
- Zamówienie nie istnieje → 404 "Order not found"

---

## 16. DODATKOWE WYMAGANIA

### Bezpieczeństwo:
- Hashowanie haseł: SHA256 z solą (crypto.createHmac)
- Secret sesji: `'TAJNY-KLUCZ-2024'`
- HttpOnly cookies
- Sprawdzanie własności zasobów (user może widzieć tylko swoje zamówienia)

### Responsywność:
- Główny kontener: 1000px centered
- Formularze: max-width 500px
- Karty produktów: max-width 600px
- Tabele: 100% width

### Inicjalizacja danych:
Przy pierwszym uruchomieniu dodaj przykładowe produkty:
- "Laptop" - 5000 PLN
- "Wireless Mouse" - 100 PLN
- "Mechanical Keyboard" - 300 PLN

### Sesja:
- Lifetime: 24h
- Dane: `userId`, `username`, `role`
- Middleware `attachUser` ustawia `res.locals.user` i `res.locals.isAuthenticated`

---

## 17. MODELE DANYCH (STRUKTURA)

### User:
```
ID: string
username: string
email: string
password: string (hashed)
role: 'user' | 'admin'
```

### Product:
```
ID: string
name: string
price: number
status: 'active' | 'inactive' | 'deleted'
tags: string[]
description?: string
```

### Cart:
```
ID: string
userID: string
items: CartItem[]
totalValue: number (computed)

CartItem:
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number (computed)
```

### Order:
```
ID: string
userID: string
items: OrderItem[]
totalAmount: number
status: 'open' | 'completed' | 'canceled'
createdAt: Date

OrderItem:
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number (computed)
```

---

To jest kompletna specyfikacja. AI powinno zbudować frontend z wszystkimi stronami, formularzami, tabelami, nawigacją i stylami zgodnie z tym opisem.
