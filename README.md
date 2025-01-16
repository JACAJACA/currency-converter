# Testowanie i Jakość Oprogramowania

## Autor
- Jacek Dusza]

## Temat Projektu
- Currency Converter

## Opis Projektu
Projekt zakłada stworzenie intuicyjnej aplikacji webowej do szybkiego przeliczania walut z wykorzystaniem ExchangeRate-API, zapewniającego aktualność kursów. Użytkownicy będą mogli przeglądać historię swoich przeliczeń oraz zarządzać kontem (edycja profilu, zmiana hasła). Aplikacja będzie responsywna, dostępna na komputerach i urządzeniach mobilnych. Funkcje obejmują przeliczanie walut w czasie rzeczywistym oraz automatyczne pobieranie kursów z API.

## Uruchomienie Projektu
Klient: npm run dev
Serwer: node index.js

## Przypadki Testowe dla Testera Manualnego (TestCase)

### Przypadek Testowy 1: Poprawne Rejestracja

**Kroki:**
1. Otwórz stronę rejestracji.
2. W polu "Name" wpisz "Jan Kowalski".
3. W polu "Email" wpisz "jan.kowalski@example.com".
4. W polu "Password" wpisz "SilneHaslo123!".
5. Kliknij przycisk "Register".

**Oczekiwany wynik:**
- Po kliknięciu przycisku "Register", użytkownik powinien być przekierowany na stronę logowania lub otrzymać komunikat potwierdzający pomyślną rejestrację.
- Powinien pojawić się komunikat o sukcesie, np. "Rejestracja zakończona sukcesem. Możesz się teraz zalogować."

### Przypadek Testowy 2: Rejestracja z Niepoprawnym Adresem Email

**Kroki:**
1. Otwórz stronę rejestracji.
2. W polu "Name" wpisz "Anna Nowak".
3. W polu "Email" wpisz "anna.nowak@example" (brak domeny, np. .com).
4. W polu "Password" wpisz "BezpieczneHaslo456!".
5. Kliknij przycisk "Register".

**Oczekiwany wynik:**
- Po kliknięciu przycisku "Register", powinien pojawić się błąd walidacji formatu email, np. "Proszę podać poprawny adres email".
- Użytkownik nie powinien być zarejestrowany i powinien pozostać na stronie rejestracji z możliwością poprawienia danych.