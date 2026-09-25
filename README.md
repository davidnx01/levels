# LEVEL — Hookah Bar & Lounge Bratislava

Statická homepage (HTML / CSS / JS, bez build kroku a bez externých závislostí).

## Štruktúra

```
index.html              # celá stránka + inline SVG sprite (logo, ikony)
css/fonts.css           # @font-face deklarácie (self-hosted woff2)
css/style.css           # dizajnové tokeny + všetky komponenty
js/main.js              # navigácia, scrollspy, otváracie hodiny, accordion, taby
assets/logo.svg         # vektorizované logo LEVEL (biele)
assets/logo-orange.svg  # logo v primárnej oranžovej #ff5c00
assets/topo.svg         # vrstevnicová textúra (hero, rezervácia, mapa)
assets/fonts/*.woff2    # Jost, Inter, JetBrains Mono (latin + latin-ext)
```

## Dizajnové tokeny

Všetky farby, typografia a rozostupy sú v `:root` v `css/style.css`.
Primárna farba `--brand: #ff5c00` je prevzatá z existujúcej identity.

## Otváracie hodiny

Jediný zdroj pravdy je pole `HOURS` v `js/main.js` (index 0 = nedeľa,
hodnota `end` nad 24 znamená zatváranie po polnoci). Skript z neho počíta
stav „otvorené / zatvorené", dnešné hodiny v info páse a zvýraznenie
dnešného dňa v tabuľke. Hodiny v `index.html` a v pätičke treba pri zmene
upraviť tiež.

## Čo ešte doplniť

- [ ] Telefónne číslo — teraz je všade placeholder `+421 000 000 000`
      (`tel:` odkazy, WhatsApp `wa.me/421000000000`, pätička, kontakt).
- [ ] Originál loga vo vektore, ak existuje — súčasné `assets/logo.svg`
      je vektorizované z rastrového podkladu 150 × 150 px.
- [ ] Fotografie (hero, galéria) — zámerne zatiaľ nepoužité.
- [ ] Presná formulácia parkovania a roku založenia v hero eyebrow.

## Spustenie

Stačí otvoriť `index.html` v prehliadači. Pre správne načítanie fontov
odporúčam lokálny server:

```bash
python3 -m http.server 8000
```
