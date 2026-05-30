# AvtoDeli — Sistem za naročilnice

Preprost interni sistem za prodajalno avtodelov. Kartoteka strank, evidenca vozil, naročilnice in ponudbe z PDF izvozom.

## Lokalni zagon

```bash
npm install
npm start
```

Odpri: http://localhost:3000  
Privzeta prijava: **admin / admin123** ← **Takoj po prvem zagonu spremeni geslo!**

## Namestitev na Render

1. Ustvari nov **Web Service** in poveži GitHub repozitorij
2. Nastavitve:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** Node
3. Dodaj **Environment Variables**:
   - `SESSION_SECRET` = (naključen dolg niz, npr. generiran na https://randomkeygen.com)
   - `DB_PATH` = `/data/avtoparts.db` *(samo če imaš Render Disk)*

### ⚠️ Persist baza na Render

SQLite datoteka se ob redeploy-u **zbriše**, razen če dodaš **Render Disk**:
- V Render dashboardu → tvoj service → **Disks** → Add Disk
- Mount path: `/data`
- Nato nastavi `DB_PATH=/data/avtoparts.db` v Environment Variables

## Funkcionalnosti

- ✅ Prijava z geslom (spremenljivo)
- ✅ Kartoteka strank (šifra, kontakt, podjetje)
- ✅ Evidenca vozil (VIN, marka, model, motor, km)
- ✅ Naročilnice in ponudbe z avtomatsko številčenjem (N-2025-0001)
- ✅ Urejanje postavk (katalog številka, naziv, količina, cena, DDV, popust)
- ✅ Pretvorba ponudbe v naročilnico
- ✅ PDF tiskanje / izvoz
- ✅ Statusi: Osnutek → Potrjena → Poslana → Dokončana

## Struktura

```
server.js          — Express strežnik
db.js              — SQLite baza + shema
routes/
  auth.js          — Prijava/odjava
  stranke.js       — CRUD stranke
  vozila.js        — CRUD vozila
  narocilnice.js   — CRUD naročilnice + ponudbe
  pdf.js           — PDF generiranje
public/
  index.html       — SPA frontend
  css/main.css
  js/app.js
```
