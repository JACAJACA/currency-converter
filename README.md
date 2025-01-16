# Testowanie i Jakość Oprogramowania

## Autor
- Jacek Dusza

## Temat Projektu
- Currency Converter

## Opis Projektu
Projekt zakłada stworzenie intuicyjnej aplikacji webowej do szybkiego przeliczania walut z wykorzystaniem ExchangeRate-API, zapewniającego aktualność kursów. Użytkownicy będą mogli przeglądać historię swoich przeliczeń oraz zarządzać kontem (edycja profilu, zmiana hasła). Aplikacja będzie responsywna, dostępna na komputerach i urządzeniach mobilnych. Funkcje obejmują przeliczanie walut w czasie rzeczywistym oraz automatyczne pobieranie kursów z API.

## Uruchomienie Projektu
Klient: npm run dev
Serwer: node index.js

## Nagranie działania aplikacji
https://drive.google.com/file/d/1cGq5RqzD5whS5Jkh2wNQU_7nXjHMQ36V/view?usp=sharing

## Testy Jednostkowe

1. Powinien poprawnie renderować formularz.
2. Powinien wyświetlać przycisk wylogowania i obsługiwać kliknięcie.
3. Powinien wyświetlać poprawną wiadomość powitalną z nazwą użytkownika.
4. Powinien poprawnie renderować formularz rejestracji.
5. Powinien poprawnie renderować formularz logowania.
6. Powinien pokazać komunikat błędu, gdy logowanie nie powiedzie się.
7. Powinien wyłączyć przycisk logowania, gdy pola są puste.
8. Powinien renderować listę historii konwersji, gdy dane są dostępne.
9. Powinien pokazać komunikat, gdy nie ma dostępnej historii konwersji.
10. Powinien przekierować na stronę główną po pomyślnym zalogowaniu.

## Testy Integracyjne

1. Powinien wyświetlać wynik konwersji po pomyślnym żądaniu konwersji.
2. Powinien wyświetlać komunikat błędu, jeśli konwersja nie powiedzie się.
3. Powinien obsługiwać wysyłanie formularza i wywołanie API.
4. Powinien przekierować na stronę logowania po kliknięciu przycisku wylogowania. [AuthIntegration.test.jsx](https://github.com/JACAJACA/currency-converter/blob/main/client/src/__tests__/AuthIntegration.test.jsx)
5. Powinien przekierować do historii konwersji po kliknięciu przycisku historii.
6. Powinien odświeżyć token i kontynuować żądanie po jego wygaśnięciu.
7. Powinien przekierować użytkownika na stronę logowania po pomyślnej rejestracji.
8. Powinien przekierować na stronę główną po pomyślnym zalogowaniu.
9. Powinien przekierować na stronę rejestracji po kliknięciu linku "Register".
10. Powinien wyświetlić komunikat błędu, jeśli odświeżenie tokenu nie powiedzie się.

## Dokumentacja API

To API dla aplikacji konwertera walut, którą samodzielnie stworzyłem, używa Node.js z frameworkiem Express do obsługi żądań HTTP, MongoDB jako bazę danych oraz komunikuje się z zewnętrznym API do konwersji walut. Oto opis endpointów:

1. Konwersja Waluty - POST /api/convert: Ten endpoint wykonuje konwersję walutową na podstawie danych podanych przez użytkownika. Wymaga autoryzacji przez JWT token, który musi być przesłany w nagłówku Authorization z prefiksem 'Bearer '. Użytkownik wysyła w ciele żądania informacje o walucie źródłowej, docelowej oraz kwocie do przeliczenia. Jeśli konwersja się powiedzie, API zwraca wynik konwersji wraz ze stopą wymiany. W przypadku błędu, zwracany jest odpowiedni komunikat błędu.
2. Historia Konwersji - GET /api/conversion-history: Endpoint ten pozwala na pobranie historii konwersji dla zalogowanego użytkownika. Również wymaga autoryzacji przez JWT token. Zwracana jest lista wpisów z historii konwersji, posortowana od najnowszych do najstarszych, zawierająca szczegóły każdej konwersji jak waluta źródłowa, docelowa, kwota, przeliczona kwota, stopa wymiany oraz data konwersji.
4. Logowanie Użytkownika - POST /login: Umożliwia autoryzację użytkownika, który podaje swój email i hasło. Po pomyślnym zalogowaniu, API generuje JWT token dostępu (ważny przez 1 godzinę) oraz token odświeżania (ważny przez 7 dni), które są zwracane wraz z danymi użytkownika. Jeśli dane logowania są niepoprawne, zwracany jest odpowiedni błąd.
4. Rejestracja Użytkownika - POST /register: Pozwala na zarejestrowanie nowego użytkownika w systemie. Użytkownik podaje swoje imię, email oraz hasło, które jest hashowane przed zapisaniem do bazy danych. Po sukcesie rejestracji, zwracane są dane zapisanego użytkownika.
5. Odświeżenie Tokena - POST /api/refresh-token: Używany do odświeżania tokena dostępu, kiedy wygasa. Użytkownik musi przesłać token odświeżania. Jeśli token jest ważny, API generuje nowy token dostępu oraz nowy token odświeżania, unieważniając stary token odświeżania i zapisując nowy w bazie danych.

Autoryzacja odbywa się poprzez JWT tokeny, które muszą być dołączone do nagłówków żądań. API używa ograniczenia szybkości (rate limiting) aby zapobiec nadużyciom, ustawiając limit na 100 żądań na 15 minut na adres IP. Konfiguracja CORS pozwala na komunikację z frontendem działającym na http://localhost:5173. Technologie użyte w projekcie to Node.js, Express, MongoDB z Mongoose, Axios do komunikacji z zewnętrznym API, JWT do autoryzacji, bcrypt do hashowania haseł oraz dotenv do zarządzania zmiennymi środowiskowymi.

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

### Przypadek Testowy 3: Poprawne Logowanie

**Kroki:**
1. Otwórz stronę logowania.
2. W polu "Email" wpisz "jan.kowalski@example.com" (użyj zarejestrowanego wcześniej konta).
3. W polu "Password" wpisz "SilneHaslo123!" (użyj hasła powiązanego z tym kontem).
4. Kliknij przycisk "Login".

**Oczekiwany wynik:**
- Po kliknięciu przycisku "Login", użytkownik powinien zostać zalogowany i przekierowany na stronę główną lub dashboard.
- Powinien pojawić się komunikat powitalny, np. "Witaj, Jan!" lub zmiana interfejsu wskazująca na zalogowanie.

### Przypadek Testowy 4: Logowanie z Niepoprawnym Hasłem

**Kroki:**
1. Otwórz stronę logowania.
2. W polu "Email" wpisz "jan.kowalski@example.com" (użyj zarejestrowanego wcześniej konta).
3. W polu "Password" wpisz "ZleHaslo789!" (użyj niepoprawnego hasła).
4. Kliknij przycisk "Login".

**Oczekiwany wynik:**
- Po kliknięciu przycisku "Login", powinien pojawić się komunikat błędu, np. "Niepoprawne hasło".
- Użytkownik nie powinien zostać zalogowany i powinien pozostać na stronie logowania.

### Przypadek Testowy 5: Logowanie z Nieistniejącym Kontem

**Kroki:**
1. Otwórz stronę logowania.
2. W polu "Email" wpisz "nieistniejace.konto@example.com" (użyj usługi email, która nie jest zarejestrowana).
3. W polu "Password" wpisz "DowolneHaslo!" (wpisz dowolne hasło, ponieważ konto nie istnieje).
4. Kliknij przycisk "Login".

**Oczekiwany wynik:**
- Po kliknięciu przycisku "Login", powinien pojawić się komunikat błędu informujący, że konto nie istnieje, np. "Nie znaleziono konta o podanym adresie email".
- Użytkownik nie powinien zostać zalogowany i powinien pozostać na stronie logowania.

### Przypadek Testowy 6: Poprawne Przeliczenie Waluty

**Kroki:**
1. Upewnij się, że jesteś zalogowany (jeśli nie, zaloguj się).
2. Na stronie głównej wybierz "USD" w polu "From Currency".
3. Wybierz "EUR" w polu "To Currency".
4. W polu "Amount" wpisz "100".
5. Kliknij przycisk "Convert".

**Oczekiwany wynik:**
- Powinien pojawić się wynik przeliczenia, np. "Converted Amount: X EUR" oraz "Conversion Rate: Y".
- Nie powinno być żadnych komunikatów błędów.

### Przypadek Testowy 7: Przeliczenie z Niepoprawnymi Danymi

**Kroki:**
1. Upewnij się, że jesteś zalogowany.
2. Wybierz "USD" w polu "From Currency".
3. Pozostaw pole "To Currency" puste.
4. W polu "Amount" wpisz "100".
5. Kliknij przycisk "Convert".

**Oczekiwany wynik:**
- Powinien pojawić się komunikat błędu, np. "Please select a currency to convert to" lub odpowiednik wskazujący na brak wyboru waluty docelowej.
- Wynik przeliczenia nie powinien być wyświetlony.

### Przypadek Testowy 8: Wylogowanie

**Kroki:**
1. Upewnij się, że jesteś zalogowany.
2. Znajdź przycisk "Logout" na stronie głównej.
3. Kliknij przycisk "Logout".

**Oczekiwany wynik:**
- Użytkownik powinien zostać wylogowany i przekierowany na stronę logowania.
- Powinien pojawić się komunikat o wylogowaniu, np. "You have been successfully logged out."

### Przypadek Testowy 9: Odświeżenie Tokenu po Wygaśięciu

**Kroki:**
1. Upewnij się, że jesteś zalogowany.
2. Poczekaj, aż token wygasa (możesz symulować to poprzez zmianę czasu w przeglądarce lub serwerze).
3. Spróbuj wykonać przeliczenie waluty, np. z "USD" na "EUR" z kwotą "50".

**Oczekiwany wynik:**
- Aplikacja powinna automatycznie spróbować odświeżyć token i wykonać przeliczenie waluty.
- Jeśli odświeżenie tokenu się powiedzie, powinien pojawić się wynik przeliczenia.
- Jeśli odświeżenie tokenu nie powiedzie się, użytkownik powinien zobaczyć komunikat błędu "Token refresh failed. Please log in again." i zostać przekierowany na stronę logowania.

### Przypadek Testowy 10: Wyświetlanie Historii Konwersji dla Zalogowanego Użytkownika

**Kroki:**
1. Upewnij się, że jesteś zalogowany do aplikacji.
2. Przejdź do sekcji historii konwersji, klikając przycisk "View Conversion History" na stronie głównej lub używając odpowiedniego linku nawigacyjnego.
3. Sprawdź, czy na stronie historii konwersji wyświetla się nagłówek "Conversion History".

**Oczekiwany wynik:**
- Jeśli użytkownik ma historię konwersji:
  - Powinna pojawić się lista z wpisami historii, gdzie każdy wpis zawiera:
    - Walutę źródłową i docelową (np. "From: USD, To: EUR").
    - Kwotę przed konwersją oraz po konwersji (np. "Amount: 100 USD, Converted: 85 EUR").
    - Stawkę konwersji (np. "Rate: 0.85").
    - Datę konwersji w formacie lokalnym (np. "Date: 16/01/2025, 14:47:00").
- Jeśli użytkownik nie ma historii konwersji:
  - Powinien pojawić się komunikat "No conversion history available."

- Uwaga: Test ten zakłada, że użytkownik ma już jakieś konwersje w historii. Jeśli nie, należy najpierw wykonać kilka konwersji, aby uzyskać dane do historii.

## Technologie Użyte w Projekcie

Projekt został w całości wykonany przeze mnie, wykorzystując **MERN stack**, który obejmuje następujące technologie:

- **MongoDB** - Wybrałem MongoDB jako bazę danych NoSQL, ponieważ pozwala na przechowywanie danych w formacie dokumentów JSON, co zapewnia elastyczność i skalowalność, idealną dla dynamicznych aplikacji webowych.
- **Express.js** - Użyłem Express.js jako framework webowy dla Node.js, ponieważ jest minimalistyczny i elastyczny, co ułatwiło mi tworzenie robustowych API oraz zarządzanie routingiem w aplikacji.
- **React** - Samodzielnie zbudowałem interfejs użytkownika, korzystając z Reacta, dzięki czemu mogłem tworzyć interaktywne komponenty UI, które dynamicznie reagują na zmiany w stanie aplikacji.
- **Node.js** - Backend aplikacji został napisany przeze mnie w Node.js, co pozwoliło mi na użycie JavaScriptu zarówno po stronie klienta, jak i serwera, zwiększając efektywność i spójność projektu.
- **ExchangeRate-API** - to popularne i niezawodne API do konwersji walut, które oferuje dane o kursach wymiany dla ponad 170 walut światowych. Jest łatwe w integracji, dostarcza aktualne i historyczne stawki wymiany w formacie JSON, co czyni je idealnym narzędziem dla aplikacji wymagających funkcjonalności konwersji walut.
