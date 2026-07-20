[🇬🇧 English](../README.md) ·
[🇧🇷 Português](README.pt-br.md) ·
[🇷🇺 Русский](README.ru.md) ·
[🇹🇭 ไทย](README.th.md) ·
🇩🇪 Deutsch ·
[🇫🇷 Français](README.fr.md) ·
[🇪🇸 Español](README.es.md) ·
[🇯🇵 日本語](README.ja.md)

> [!IMPORTANT]
> **Diese Übersetzung wurde maschinell erstellt und nicht von einem Muttersprachler geprüft.**
> Sie kann Fehler und Ungenauigkeiten enthalten. Das englische Original: [README.md](../README.md).
> Hilfe zur Verbesserung ist sehr willkommen — gerne einen PR oder ein Issue öffnen!

> [!NOTE]
> PoE2Dire ist ein inoffizielles Fan-Projekt und steht in keiner Verbindung zu Grinding Gear Games oder Path of Exile, wird von ihnen weder unterstützt noch gesponsert.

# PoE2Dire

Erweiterung, die die Patchnotes von Path of Exile (1 und 2) im Dota-2-Stil darstellt.
[Basiert auf diesem Reddit-Thread](https://www.reddit.com/r/PathOfExile2/comments/1tkazjr/can_someone_explain_to_me_why_ggg_doesnt_present/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button).

[Reddit-Thread](https://www.reddit.com/r/PathOfExile2/comments/1toxfei/dota2_style_patch_notes_browser_extension/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button) zur Erweiterung im Path-of-Exile-2-Subreddit.

<img width="1539" height="1157" alt="preview_update" src="https://github.com/user-attachments/assets/e5e48c44-386b-4df3-8ae6-9d21aa8b9f43" />
<img width="1201" height="1021" alt="showcase" src="https://github.com/user-attachments/assets/c41b4e58-084c-4a46-969e-76e239129df7" />


Die Erweiterung wird nur hier eingebunden:

```text
https://www.pathofexile.com/forum/*
https://br.pathofexile.com/forum/*
https://ru.pathofexile.com/forum/*
https://th.pathofexile.com/forum/*
https://de.pathofexile.com/forum/*
https://fr.pathofexile.com/forum/*
https://es.pathofexile.com/forum/*
https://jp.pathofexile.com/forum/*
```

Zusätzlich fordert sie Zugriff auf `poewiki.net` und `poe2wiki.net` für Beschreibungen und Bilder an.

Außerdem werden `cdn.poedb.tw` und `cdn.poe2db.tw` für schnelle Icon-Abfragen verwendet.


## Wie benutzt man es?

0. Für deinen Browser installieren: [Chrome](https://chromewebstore.google.com/detail/paekoknkbpfidmpabiikofkemegpfgnh?utm_source=item-share-cb)/[Firefox](https://addons.mozilla.org/en-US/firefox/addon/poe2dire/)
1. Öffne eine beliebige Patchnotes-Seite im Path-of-Exile-Forum ([diese ist gerade beliebt](https://www.pathofexile.com/forum/view-thread/3932540))
2. Klicke oben auf das PoE2Dire-Symbol, um es zu aktivieren <img width="114" height="79" alt="image" src="https://github.com/user-attachments/assets/2b800f16-d7a4-4f35-b4cc-65940e61ee31" /> (falls du es nicht siehst, musst du es anpinnen: klicke auf das Mosaik-Symbol, suche es dort und klicke darauf)
3. Fertig
4. Ein erneuter Klick deaktiviert es wieder, oder lade die Seite einfach neu.

Video-Beispiel: [https://www.youtube.com/watch?v=ES66rQrVNQY](https://www.youtube.com/watch?v=ES66rQrVNQY)


## Funktionen

- Fang einfach an zu tippen, um die Suche zu öffnen — einfach lostippen, mehr braucht es nicht.
- Eigenes Inhaltsverzeichnis — schön und einfach zu benutzen!
- Gegenstands- und Fertigkeitsbeschreibungen beim Überfahren mit der Maus — du weißt nicht mehr, was dieser einzigartige Gegenstand macht? Fahre mit der Maus darüber und sieh dir die Wiki-Beschreibung an!
- Schlüsselwort-Beschreibungen beim Überfahren — du bist neu und hast erst 5000 Stunden im Spiel? Kein Problem: fahre über unbekannte Wörter wie „aggregated“ und sieh, was sie bedeuten! (basiert auf der Schlüsselwort-Seite von poewiki — also nur PoE, PoE2-Spieler bitte noch nicht verwirren lassen)

## Installationsmöglichkeiten


> bitte hinterlasse eine Bewertung, damit mehr Leute die Erweiterung finden!


### Installation in Chrome

[Chrome WebStore](https://chromewebstore.google.com/detail/paekoknkbpfidmpabiikofkemegpfgnh?utm_source=item-share-cb)

### Installation in Firefox (funktioniert auch mit Firefox mobil)

[Firefox-Add-ons-Seite](https://addons.mozilla.org/en-US/firefox/addon/poe2dire/)

### Installation als Userscript

> [!CAUTION]
> Das ist für Leute, die wissen, was Userscripts sind

Ich hoffe, du weißt bereits, wie man ein Skript für seinen „Monkey“ installiert. Du kannst `PoE2Dire.user.js` von der Seite [GitHub Releases](https://github.com/aisatan/PoE2Dire/releases) herunterladen. Hier ein Video-Beispiel für ViolentMonkey: [https://www.youtube.com/watch?v=cgWVGSAxoEY](https://www.youtube.com/watch?v=cgWVGSAxoEY)

> Gerüchten zufolge: „Man kann auf der Installationsseite direkt auf die rohe .js-Datei verlinken.“

Kurz gesagt läuft es so ab:

1. Lade die Datei `PoE2Dire.user.js` von [GitHub Releases](https://github.com/aisatan/PoE2Dire/releases) herunter.
2. Öffne das Release-Asset `PoE2Dire.user.js`.
3. Installiere es in deinem Userscript-Manager.
4. Öffne auf einer Patchnotes-Seite im Path-of-Exile-Forum das Menü des Userscript-Managers und klicke auf `Toggle PoE2Dire`.

Ich habe das nur unter Firefox mit Tampermonkey und ViolentMonkey getestet. Wenn es bei dir nicht funktioniert, öffne gerne ein Issue.


### Habt ihr denn keine Handys?

Das ist für Handys oder Browser, wo du die Erweiterung nicht installieren kannst oder willst.

> [!NOTE]
> Manche mobilen Browser blockieren Bookmarklet-Skripte, es funktioniert also möglicherweise nicht bei allen. Getestet unter `Android` mit `Brave`. Wenn es bei dir nicht klappt, öffne gerne ein Issue — vielleicht hat jemand eine Lösung für deinen Fall.

> [!CAUTION]
> Dies lädt entfernten Code (`https://aisatan.github.io/PoE2Dire/PoE2Dire-bookmarklet.js`) herunter und **führt ihn** in deinem Browser aus.
> Es ist nicht erforderlich — aber ich **empfehle dringend**, sicherheitshalber den **Inkognito-Modus** zu verwenden.

Video der Installation auf meinem Handy (Brave-Browser):

https://github.com/user-attachments/assets/a034d803-7d16-443c-8e9b-e5f683d9e309

in besserer Qualität: https://youtube.com/shorts/AmYBZYfP4YY

Das Handy-Bookmarklet lädt den veröffentlichten Einzeldatei-Build von GitHub Pages:

```js
javascript:(function(){var s=document.createElement('script');s.src='https://aisatan.github.io/PoE2Dire/PoE2Dire-bookmarklet.js?poe2dire=' + Date.now();s.referrerPolicy='no-referrer';s.onerror=function(){alert('PoE2Dire failed to load. The page may block bookmarklet scripts.');};document.documentElement.appendChild(s);})();
```

So benutzt du es:

1. Erstelle ein Browser-Lesezeichen (irgendeine Seite reicht)
2. Bearbeite URL und Namen des Lesezeichens.
3. Füge den kompletten `javascript:`-Code von oben als Lesezeichen-URL ein.
4. Gib ihm einen leicht zugänglichen Namen, zum Beispiel `0000 poe2dire`
5. Öffne eine Patchnotes-Seite im Path-of-Exile-Forum.
6. Führe das Lesezeichen aus (in den meisten Browsern kannst du einfach den Namen eintippen, um es zu finden und zu starten)


## Funktioniert bei dir nicht?

Öffne gerne ein Issue auf GitHub. Ich gebe mein Bestes, es für dich zu beheben, aber ich verspreche nichts.


## Mitwirken

Bitte zögere nicht, Fragen zu stellen, einen PR oder ein Issue zu öffnen oder das Projekt zu forken.
Es fehlt an Dokumentation, aber der unordentliche JS-Code sollte klar genug zu verstehen sein.
Bedenke aber: meine jahrzehntelange Erfahrung mit hemdsärmeligem JS kann seltsam wirken, denn ich habe damit nie ein richtiges Projekt gebaut, sondern nur Skripte mit jQuery.


## Unterstützen 🌠

Bitte denke über eine dieser kleinen Unterstützungsmöglichkeiten nach:

⭐ Gib einen GitHub-Stern ⭐

☕ [Spendier mir einen Kaffee <3](https://buymeacoffee.com/aisatan) ☕

<img width="32" height="32" alt="blender_emoji_transparent_32" src="https://github.com/user-attachments/assets/02ac03f9-3dd0-4674-8ea2-03b38e0e1f81" />[An die Blender Foundation spenden](https://fund.blender.org/donate-once/)
<img width="32" height="32" alt="blender_emoji_transparent_32" src="https://github.com/user-attachments/assets/1e6fa180-211d-4658-9b4f-c549a336a75e" />
