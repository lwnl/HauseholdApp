# Final Project: Haushalts-App

## Team

- Alper
- Liang
- Murat
- Sebastian

## Userstories

### Für die Lebensmittelüberwachung

- Die App soll mehrere Benutzer unterstützen. (Familie)
- Als Benutzer will ich neue Nahrungsmittel in einem Formular erfassen können.
- Als Benutzer will ich erfasste Nahrungsmittel bearbeiten (z.B. die Menge ändern) und löschen können.
- Als Benutzer möchte ich informiert werden, wenn ein Lebensmittel kurz vor Ablauf des Mindesthaltbarkeitsdatums ist.
- Als Benutzer möchte ich einen Grundstock an Lebensmitteln, welche immer vorhanden sein sollen definieren können.
- Als Benutzer möchte ich informiert werden, wenn eine gewisse Restmenge eines Lebensmittels unterschritten wird.
- Als Benutzer möchte ich aus diesem Grundstock eine automatische Einkaufsliste generiert haben.
- Alle Haushaltsmitglieder haben Zugriff auf die Einkaufsliste.
- Die Einkaufsliste soll auf alle Benutzer verteilt werden können. So dass z.B. die Mutter ihrem Kind auftragen kann, von unterwegs bestimmte Dinge mitzubringen.
- Die Einkaufsliste soll dabei mobil verfügbar sein.
- Als Benutzer möchte ich auch private Vorräte verwalten können.
- Als Benutzer möchte ich die vorhandenen Lebensmittel als Liste angezeigt bekommen außerdem soll für die Liste eine Suchfunktion vorhanden sein, so dass ich schnell ein bestimmtes Lebensmittel finden kann.
- Als Benutzer kann ich für bestimmte Zeiträume ( monatlich, vierteljährlich, jährlich) den Verbrauch von bestimmten Lebnensmitteln erfassen und darstellen lassen.


### Haushaltskassenbuch

- Als Benutzer möchte ich alle Einnahmen und Ausgaben des Haushalts erfassen können.
- Als Benutzer möchte ich eine Listendarstellung der Geldein-und Ausgänge haben und zwar mit Ausgabegrund (z.B. Miete, Strom, Gas, usw.).
- Als Benutzer möchte ich das Restbudget für den/das jeweilige(n) Monat/Quartal/Jahr angezeigt bekommen.
- Als Benutzer kann ich für bestimmte Zeiträume ( monatlich, vierteljährlich, jährlich) die Kosten für Lebensmittel oder andere bestimmte Posten erfassen und darstellen lassen.
- Als Benutzer möchte ich Rechnungen und Quittungen als Fotos hochladen können.

### Haushaltspinwand / "Kühlschrankmagnete"

- Benutzer / Familienmitglieder können sich kurze Mitteilungen an ein öffentliches Schwarzes Brett pinnen. 
- Dieses Schwarze Brett ist die Hauptseite der App.
- Warnungen der App über verderbliche Lebensmittel usw. erscheinen ebenfalls hier.


## Planung

### Vorarbeiten
- Erstellen eines Trello-Boards für die Task-Verwaltung
- Estellen eines Wireframes in Excallidraw um das grobe Layout und die Funktionen abzubilden.
- Ebenfalls in Excallidraw: Erstellen der Datenbank Struktur inkl. Dokumenten-Properties.

### Erstellen der Basis-Software
- Zunächst erstellen der Backend-Knoten für Benutzer- und Notiz-Verwaltung
- Erstellen einer Navigation im Frontend mit Register- und Login-Seite.
- Erstellen aller benötigter Schemas/Models für die Mongoose Datenbank.
- Erweitern der App um Lebensmittelverwaltung im Backend und Frontend.
- Lebensmittelverwaltung im Backend wird aufgespalten in Lebensmittel und Lebensmittel-Typ
- Lebensmittel-Typen stellen Basis für Lebensmittelverwaltung dar:
    - Name des Lebensmittels
    - Packungsgröße
    - Einheit (g, kg, Stk., Flaschen, usw.)
    - Kategorie (Obst, Gemüse, Fleisch, usw.)
    - Bild für die leichtere Zuordnung
- Lebensmittel-Typ wird dann auch für Einkaufsliste verwendet.
- Einkaufsliste wird in Back- und Frontend hinzugefügt.

- Wenn noch genügend Zeit übrig ist, kann die Basis-Konfiguration noch um das Kassenbuch erweitert werden.

## Ausführung

- Aufteilung des 4-Personen-Teams in 2 Teams zu je 2 Personen.
    - Team 1: Alper, Murat
    - Team 2: Liang, Sebastian
- Aufteilen der Tasks nach Frontend / Backend auf die 2 Teams

### Nice to have gegen Ende:

- Installieren von PWA für Smartphone-Anwendung
- Darauf aufbauend offline-Einkaufsliste.