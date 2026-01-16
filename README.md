# E-Commerce Application

Aplikacja e-commerce z pełnym systemem zarządzania, zbudowana w TypeScript z Express.js i MongoDB.

## 🚀 Technologie

- **Backend:** Node.js, Express.js, TypeScript
- **Baza danych:** MongoDB + Mongoose
- **Template Engine:** EJS
- **Session Management:** express-session
- **Architektura:** Clean Architecture (Domain, Application, Infrastructure, UI)

## 📋 Wymagania

- Node.js (v14+)
- MongoDB Atlas account lub lokalna instancja MongoDB
- npm lub yarn

## 🔧 Instalacja

1. Sklonuj repozytorium:
```bash
git clone <your-repo-url>
cd weppo
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Skonfiguruj zmienne środowiskowe:
   - Skopiuj `.env.example` do `.env`
   - Uzupełnij dane MongoDB i session secret

4. Zbuduj projekt:
```bash
npm run build
```

5. Uruchom aplikację:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📁 Struktura projektu

```
src/
├── Application/       # Logika aplikacji (Services)
├── Domain/           # Modele domenowe i interfejsy repozytoriów
├── Infrastructure/   # Implementacje repozytoriów (Mongo, InMemory)
├── UI/              # Express routes i middleware
└── views/           # Szablony EJS
```

## 👤 System ról

- **Anonimowy:** przeglądanie katalogu
- **Użytkownik:** koszyk, zamówienia
- **Administrator:** panel zarządzania produktami, zamówieniami, użytkownikami

## 🔒 Bezpieczeństwo

- Sesje z timeoutem 24h
- Middleware autoryzacji dla chronionych endpointów
- Role-based access control

## 📝 Licencja

ISC
