# Kantolyx 0.5.65 · GitHub Pages · Anleitung

Kantolyx ist ein Browser-Modellierer für Polygonnetze mit parametrischer Timeline. Das Werkzeug ist stark von TopMod inspiriert. Diese Anleitung beschreibt ausschließlich die GitHub-Pages-Anwendung und das Arbeiten mit lokalen Projektdateien.

## 1. Start und Sprache

Die veröffentlichte HTTPS-Adresse des Repositorys öffnen. Die Anwendung startet direkt im Hauptverzeichnis oder Repository-Unterpfad; kein `/web/` anhängen. Die Veröffentlichung ist in [README.md](../README.md) beschrieben.

Deutsch ist Standard. Oben **English** für Englisch wählen. Die Sprachwahl wird im Browser gespeichert, sofern der Browserspeicher verfügbar ist. Umschalten lädt die Seite nicht neu und verändert weder Projekt noch Auswahl oder ungespeicherte Änderungen. Offene Spline-, Schnitt- und Reparaturentwürfe bleiben bestehen; eine laufende Animation stoppt. Projektnamen und technische Referenzen bleiben unverändert.

## 2. Erstes Modell

1. **Neu → Quader → Projekt anlegen** wählen.
2. Den Quader drehen und eine gut sichtbare Fläche anklicken.
3. **Flächen extrudieren** wählen. Unten erscheint ein neuer Timeline-Schritt.
4. Rechts **Länge (+ außen / − innen)** beispielsweise auf `0,5` einstellen.
5. Mit Skalierung der Deckfläche, etwa `0,7`, und Drehwinkel experimentieren.
6. Einen früheren Timeline-Schritt anklicken, dessen Zustand ansehen und Parameter ändern. Nachfolgende Schritte werden neu berechnet.
7. **Projekt speichern** wählen und die heruntergeladene `.kantolyx`-Datei aufbewahren.

## 3. Ansicht bedienen

| Aktion | Maus / Tastatur | Touch |
| --- | --- | --- |
| Drehen | Links ziehen | Einen Finger ziehen |
| Verschieben / Pan | Mitte oder Umschalt+Ziehen | Zwei Finger gemeinsam bewegen |
| Zoomen | Mausrad | Zwei Finger auseinander-/zusammenziehen |
| Fläche wählen | Klick | Antippen |
| Auswahl ergänzen / abwählen | Umschalt+Klick oder Mehrfachauswahl | Mehrfachauswahl aktivieren, dann tippen |
| Modell einpassen | Modell einpassen oder Pos1 | Modell einpassen |
| Auswahl fokussieren | Auswahl fokussieren oder F | Auswahl fokussieren |
| Auswahl leeren / Vorschau abbrechen | Escape im Modellfenster | Passenden Leeren-/Abbrechen-Knopf verwenden |

Horizontal und vertikal kann endlos gedreht werden. Modell einpassen setzt den Drehpunkt in die Modellmitte; Auswahl fokussieren verlegt ihn zur Auswahl. Standardansicht setzt Orientierung und Bildausschnitt zurück. Kanten anzeigen schaltet die Netzlinien um.

## 4. Ausgangsformen

Im Neu-Dialog einen Grundkörper wählen. Art und Maße bleiben im ersten Timeline-Schritt editierbar.

- **Quader:** Breite, Höhe und Tiefe.
- **Tetraeder, Oktaeder, Ikosaeder:** Kantenlänge.
- **Prisma:** 3–128 Seiten, Seitenlänge und Höhe/Dicke. Startwerte: 6 Seiten, Seitenlänge 2, Höhe 2.
- **Dodekaeder:** 12 Fünfecke, Kantenlänge einstellbar.
- **Kugel:** Radius, Umfangssegmente und Höhenabschnitte; Viereckbänder und Dreiecke an den Polen.
- **Torus / Ring:** Ringradius bis zur Rohrmitte, kleinerer Rohr-Radius und Segmentzahlen in beiden Richtungen.
- **Fußball:** 12 Fünfecke und 20 Sechsecke mit einstellbarer Kantenlänge.

Reine Maßänderungen erhalten normalerweise die Flächenreferenzen. Andere Körperarten oder Auflösungen können spätere Bezüge ungültig machen. Diese neu zuordnen. Neu beginnt ein frisches Projekt und setzt Werkzeugvorgaben zurück; ungespeicherte Änderungen werden vorher abgefragt.

## 5. Auswahl

Zwischen **Flächen**, **Kanten** und **Punkte** wählen. Ein normaler Klick ersetzt die Auswahl. Mehrfachauswahl sammelt Elemente; Flächengruppe erlaubt größere Flächenauswahlen innerhalb der Netzgrenzen. Einzelne Werkzeuge haben kleinere Auswahlgrenzen.

**Alle Flächen wählen** markiert das angezeigte Modell. **Zusammenhängend wählen** folgt gemeinsamen Kanten. **Koplanar wählen** sammelt ebene Nachbarflächen und stoppt an Knicken. **Flächenauswahl erweitern** ergänzt pro Klick eine Nachbarreihe. **Kantenring wählen** folgt gegenüberliegenden Viereckkanten und stoppt an Dreiecken und anderen Polygonen; mehr als 32 Kanten werden abgelehnt statt abgeschnitten. **Auswahl leeren** entfernt Markierungen.

Brücken verwenden zwei Endflächen. Gruppenextrusion kann viele Flächen bearbeiten. Regionsextrusion benötigt über Kanten zusammenhängende Flächen. Die Tooltips nennen weitere Voraussetzungen.

## 6. Timeline und Werkzeugvorgaben

Ein Klick auf ein Timeline-Icon zeigt sofort den Zustand dieses Schritts. Rechts dessen Parameter ändern; beim Überfahren erscheinen Name, Werte und Status. **Gesamtes Modell anzeigen** kehrt zum Endzustand zurück.

Änderungen früherer Schritte berechnen die Nachfolger neu. **Unterdrücken** überspringt einen Schritt; **Aktivieren** schaltet ihn wieder ein. **Löschen** entfernt den einzelnen Schritt. **Timeline ab hier löschen** entfernt den gewählten Schritt und alle Nachfolger nach Bestätigung; der Grundkörper bleibt erhalten.

Bei einem Fehler bleibt das letzte gültige Netz sichtbar; abhängige Schritte werden blockiert. Parameter korrigieren, Schritt unterdrücken oder Bezug reparieren: Zustand vor dem betroffenen Schritt anzeigen, passende Flächen/Kanten/Punkte auswählen, zum Schritt zurückkehren und **Auswahl als …** verwenden.

Innerhalb eines Projekts werden zuletzt erfolgreich übernommene oder geänderte Werkzeugparameter weitergereicht: Extrusionslänge/Skalierung/Winkel, Brückenstufen und Zuordnung, Spline-Werte, Unterteilungsstufen, Dicken, Fasen und Punktversatz. Referenz-IDs werden nicht als Vorgaben übernommen. Bloßes Anklicken eines Schritts verändert die Vorgaben nicht. Vorschauwerte zählen erst nach Übernehmen; abgebrochene oder ungültige Änderungen werden nicht gelernt.

Neu setzt Werkzeugwerte zurück. Öffnen rekonstruiert Vorgaben aus gültigen aktiven Timeline-Schritten. Eine vorübergehende Bearbeitungshistorie oder Werte ausschließlich gelöschter Schritte werden nicht gesondert gespeichert.

## 7. Extrudieren und Flächen formen

**Flächen extrudieren** extrudiert jede markierte Fläche entlang ihrer eigenen Normalen. Länge, Skalierung und Drehwinkel der Deckfläche gehören zum selben Schritt. Der Fußrand bleibt unverändert.

Positive Länge geht nach außen, negative nach innen. Erlaubt sind −1000 bis −0,01 und 0,01 bis 1000. Null ist wegen degenerierter Seitenwände ausgeschlossen. Skalierung: 0,05–10; Winkel: −180° bis 180°.

Für eine Vertiefung am Quader beispielsweise Länge `−0,5` und Skalierung `0,7` wählen. Bei Skalierung 1 können neue Seitenwände vorhandene Wände überlagern. Extrusion schneidet andere Geometrie nicht automatisch aus; Tiefe und Auswahl entsprechend wählen.

**Region extrudieren** verschiebt zusammenhängende Flächen um denselben Vektor. Innere Kanten und gemeinsame Punkte bleiben erhalten; neue Seiten entstehen nur am Rand, auch an inneren Randringen. Rechts Länge und Richtung X/Y/Z ändern. Die Richtung wird normiert und muss aus allen gewählten Flächen herauszeigen; für Innenversatz eine negative Länge verwenden. Vollständige geschlossene Hüllen, getrennte Regionen, Nullrichtung und verzweigte Ränder sind nicht geeignet. Neue Deckflächen bleiben für die nächste Extrusion ausgewählt.

**Fläche skalieren / drehen** formt eine vorhandene Fläche um ihren Mittelpunkt und ihre Normale. Nachbarflächen werden mitverformt; es entsteht keine zusätzliche Extrusion. Große Änderungen können Überschneidungen erzeugen.

## 8. Gerade und gekrümmte Brücken

Zwei getrennte geeignete Endflächen markieren. **Flächen verbinden** erzeugt eine gerade Brücke zwischen gegenüberliegenden Dreiecken oder Vierecken, auch gemischt und seitlich versetzt. Die Endflächen dürfen keine Punkte teilen. Zuordnung und Segmentzahl bleiben editierbar.

Viereckige Endflächen können viereckige Brückenwände behalten; dreieckige Endflächen behalten dreieckige Wände. Wo angeboten ist auch die bisherige dreieckige Wandaufteilung wählbar. Die Zuordnung muss eine stabile Verbindung ohne zusammenfallende Querschnitte ergeben.

**Gekrümmte Brücke** öffnet zuerst eine Pfadvorschau:

1. Weiße Mitte ziehen, um den Verlauf zu biegen.
2. A/B entlang der Endrichtungen verschieben.
3. Ansicht drehen, um aus einer anderen Richtung zu formen.
4. Mitte X/Y/Z numerisch eingeben, um mehrere Brücken gleich einzustellen.
5. Bis zu drei zusätzliche Pfadpunkte hinzufügen und deren Versatz ziehen oder eingeben.
6. Bei Bedarf Mitte verdrehen; an beiden Enden ist diese Zusatzdrehung null.
7. Automatischer Start sucht einen geeigneten Anfangsverlauf. Danach **Übernehmen** oder **Abbrechen**.

Versatzfaktoren beziehen sich auf den Abstand der Endflächenmittelpunkte und auf feste Modellachsen: 0,1 bedeutet 10 % dieses Abstands. Krümmung A/B: 0,05–2; gekrümmte Brücken: 3–32 Segmente; Versatz: −4 bis 4; Verdrehung: −180° bis 180°.

**Spline bearbeiten** öffnet eine vorhandene Brücke erneut. Ein gültiger Spline garantiert noch keinen Platz für die gesamte Brückendicke. Bei engen Biegungen oder umklappenden Querschnitten Verlauf, Endflächen, Zuordnung oder Segmentzahl ändern.

## 9. Durchbruch und Loch stanzen

**Durchbruch** verwendet zwei gewählte ebene konvexe Endflächen mit 3–16 Ecken. Es entsteht ein Durchgang mit Rand und inneren Tunnelwänden, auch durch konkave Körper innerhalb der Grenzen des Werkzeugs. Lochgröße und Zuordnung bleiben in der Timeline einstellbar.

**Loch stanzen** startet bei 1–128 ausgewählten Flächen und sucht passende Gegenflächen. Mehrere Innenstrahlen prüfen den nächsten Kandidaten. Ähnliche Dreiecke/Vierecke können direkt ohne Rand verbunden werden: die Endflächen verschwinden und Innenwände werden ergänzt. Leicht schräge oder verzogene Konturen sind innerhalb der Toleranzen möglich. Ungeeignete Startflächen werden gemeldet oder übersprungen.

Bei Fehlern kleinere eindeutige Startflächen oder weniger überlappende Markierungen wählen; alternativ das Flächenpaar ausdrücklich mit Durchbruch festlegen. Ein Eingriff, der den gesamten betroffenen Körper entfernen würde, wird abgelehnt. Längere Berechnungen zeigen eine Warteanimation.

## 10. Ebenenschnitte, Flächenringe und Teile

**Ebenenschnitt** zeigt eine Vorschau. Achsenknopf wählen, Normale und Position ändern oder den weißen Griff ziehen. Für Bewegung entlang der Normalen die Ebene etwas seitlich betrachten. Gewünschte Seite oder beide Teile behalten und Übernehmen wählen. Konkave Körper und bestehende Öffnungen sind innerhalb der Schnittgrenzen möglich. Abbrechen verändert die Timeline nicht.

**Am Flächenring trennen** entfernt das markierte Flächenband und verschließt die entstehenden ebenen konvexen Randringe. Das Ergebnis darf zusammenhängend bleiben oder in mehrere Teile zerfallen. Den vollständigen passenden Ring auf einem Körper wählen; andere Körper bleiben erhalten. Nicht ebene oder konkave Endkappen und verzweigte Ränder werden abgelehnt.

**Teil löschen** entfernt einen gesamten zusammenhängenden Teil, der über Fläche, Kante oder Punkt markiert wurde. Mindestens ein Teil muss erhalten bleiben. Einzelne Flächen werden stattdessen in der manuellen Reparatur entfernt.

## 11. Unterteilen, Remeshing und Formen

Alle Werkzeuge erzeugen editierbare Timeline-Schritte. Ohne eigene Auswahl wirken die globalen Werkzeuge auf das angezeigte Netz.

| Werkzeug | Zweck und Voraussetzung |
| --- | --- |
| Catmull-Clark | Geschlossenes Polygonnetz zu Vierecken glätten, 1–2 Stufen. |
| Doo-Sabin | Flächenecken mit eigenem Verfahren abrunden, 1–2 Stufen. |
| Honeycomb | Netz mit drei Kanten pro Punkt und Wabenmuster verfeinern, 1–2 Stufen. |
| Triangulieren | Auswahl oder ohne Auswahl das gesamte Netz ohne Punktverschiebung triangulieren. |
| Loop | Geschlossenes reines Dreiecksnetz glätten, 1–2 Stufen; vorher gesamtes Modell triangulieren. |
| Dualnetz bilden | Flächen und Punkte durch die Dualkonstruktion austauschen; Größenfaktor editierbar. |
| Flächen unterteilen | Lokale Viereckunterteilung auf ebenen konvexen Flächen mit gemeinsamen neuen Kantenpunkten. |
| Kanten unterteilen | 1–32 Kanten in 2–16 Abschnitte teilen. |
| Kanten auflösen | Ebene Nachbarflächen über 1–32 innere Kanten zusammenführen; alle inneren Kanten des Bereichs markieren. |
| Kanten abschrägen | Flache Fase an Kanten einer konvexen Außenhülle mit ebenen Flächen; vor dem Glätten anwenden. |
| Ecken abschneiden | Alle Ecken abschneiden, Schnittstärke 0,01–0,49 der Kantenlänge. |
| Auswahl abschneiden | 1–32 ausgewählte Punkte lokal abschneiden. |
| Punkte verschieben | 1–32 Punkte gemeinsam um X/Y/Z versetzen. |
| Spitzen formen | Spitzen auf ebenen konvexen Flächen; Höhe positiv nach außen, negativ nach innen. |
| Drahtmodell | Geschlossene kantige Streben entlang der Kanten; ebene konvexe Flächen, vor dem Glätten anwenden. |

Wiederholte Unterteilung vergrößert das Netz schnell. Stufen schrittweise erhöhen und mit Unterdrücken vergleichen. Lokale Werkzeuge können nicht konvexe oder verzogene Eingaben ablehnen, obwohl ein anderes Werkzeug sie bearbeiten kann.

## 12. Schale und Öffnungen

**Schale / Rind** ergänzt eine Innenhülle mit Wandstärke. Ohne Öffnungsflächen entsteht eine geschlossene Hohlform. Bis zu zwei markierte Flächen können direkt im Schalenschritt geöffnet werden.

**Schale öffnen** entfernt gewählte Außenflächen einer bestehenden Schale und verbindet Innen- und Außenrand. Für größere Gruppen Flächengruppe einschalten; bis 32 Flächen pro Öffnungsschritt. Öffnungen vor Glättung oder Remeshing anlegen, solange die Innenzuordnung noch erhalten ist.

Bei kurzen Kanten oder komplexen Ecken die Dicke reduzieren oder das Netz vereinfachen. Die Wandstärke ist an komplexen Ecken nur angenähert. Öffnungsgruppen dürfen sich entlang von Kanten verbinden, aber nicht nur an einem Punkt berühren. Mindestens eine gepaarte Wandfläche muss erhalten bleiben.

## 13. Manuelle Reparatur (experimentell)

1. **Manuell reparieren** öffnet einen Entwurf.
2. Im Flächenmodus Flächen antippen und **Markierte Flächen entfernen** wählen. Innenflächen erscheinen orange, offene Randkanten gelb.
3. **Eckpunkte verbinden** wählen und die vorhandenen Punkte einer neuen Fläche der Reihe nach anklicken. Mindestens eine vorhandene offene Randkante mitverwenden.
4. Den ersten Punkt erneut anklicken oder **Fläche erzeugen** wählen.
5. Alle Löcher schließen und **Reparatur übernehmen** wählen.

Letzte Linie zurück, Letzten Eingriff zurück und Reparatur zurücksetzen korrigieren den Entwurf; Abbrechen verwirft ihn. Der Entwurf wird erst beim Übernehmen gespeichert. Übernehmen ist nur für ein gültiges geschlossenes Netz möglich. Pro Schritt sind bis 128 entfernte und 32 neue Flächen mit jeweils 3–32 unterschiedlichen vorhandenen Punkten erlaubt. Beliebige neue Eckpunkte können mit diesem Werkzeug noch nicht eingefügt werden.

## 14. Animation

Unten **Abspielen** wählen. Die Konstruktion läuft vom Grundkörper bis zum Ende. Pro Schritt sind 1, 2, 3, 4 oder 5 Sekunden wählbar; Standard ist 3.

Während der letzten 20 % vor dem nächsten Schritt erscheinen dessen gespeicherte Bezugsflächen goldfarben am noch unveränderten Modell. Bei 3 Sekunden sind das 0,6 Sekunden. Die Beschriftung nennt den kommenden Schritt mit Auswahl vor dem Schritt. Die Vorschau ist Teil der Schrittzeit und verlängert sie nicht.

Bei Punkt-/Kantenwerkzeugen werden angrenzende Flächen hervorgehoben. Unterdrückte Schritte, fehlende Referenzen und globale Operationen ohne gespeicherte Auswahl erhalten keine Markierung. Verdeckte Flächen bleiben verdeckt; bei Bedarf drehen.

**Drehen** rotiert das Modell langsam und lässt am Ende das fertige Modell weiterdrehen, bis gestoppt oder Drehen abgeschaltet wird. Timeline-Klick, Geometrieänderung, Eingriff im Modellfenster oder ausgeblendeter Tab stoppen die Wiedergabe. Das Projekt wird durch die Animation nicht verändert.

## 15. Speichern, Öffnen, Export und Beispiele

**Projekt speichern** lädt `.kantolyx` mit der vollständigen Timeline herunter. Wichtige Arbeiten regelmäßig sichern; es gibt keine automatische Projektsicherung. **Projekt öffnen** lädt die Datei wieder; ungespeicherte Änderungen werden vorher abgefragt. Dateigrenze: 2 MB.

**OBJ exportieren** lädt das aktuell sichtbare Netz herunter, also gegebenenfalls einen historischen Zustand. OBJ enthält Geometrie, aber keine parametrische Timeline.

Die Dateien unter `examples/` über Projekt öffnen laden. Eigene Versuche unter neuem Dateinamen aufbewahren. Beispiele behandeln Brücken, gekrümmte Henkel, Schalen, Öffnungen, lokale Formen und Unterteilung. Die Dateinamen sind derzeit Deutsch; Geometrie und Timeline funktionieren in beiden Sprachen.

## 16. Grenzen und Fehlersuche

Kantolyx ist ein Alpha-Netzmodellierer, kein maßhaltiger CAD-Volumenkern. Allgemeine Selbstüberschneidungen werden nicht überall erkannt. Flächen können sich überlagern, obwohl die Netzverbindungen gültig sind.

Projekte erlauben bis 200 Schritte. Viele Operationen begrenzen das Ergebnis auf 32.000 Flächen und 64.000 Punkte; einzelne Werkzeuge haben kleinere Grenzen. Bei Fehlern bleibt der vorherige gültige Zustand sichtbar. Stufen reduzieren, Eingaben vereinfachen, Werte ändern oder nicht benötigte Schritte unterdrücken.

Bei scheinbar veralteter Anzeige die Seite neu laden und die verlinkte Versionsnummer prüfen. Bei Ladefehlern kontrollieren, ob `index.html`, `app.mjs`, `kernel.mjs` und `style.css` direkt im gewählten Pages-Veröffentlichungsordner liegen. Die veröffentlichte HTTPS-Adresse verwenden. Einstellungen stehen im README.

## 17. Würdigung und Lizenzstatus

Kantolyx ist stark von [TopMod und dessen topologischem Modellieransatz](https://people.tamu.edu/~ergun/research/topology/download.html) inspiriert. Der Über-Dialog enthält diese Würdigung.

Kantolyx wurde mit OpenAI ChatGPT/Codex entwickelt. Der Programmcode wurde überwiegend durch KI erzeugt. Konzept, Funktionsanforderungen und praktische Erprobung erfolgten durch die Projektleitung.

Die Nutzungslizenz ist noch nicht festgelegt; siehe [LICENSE-STATUS.md](../LICENSE-STATUS.md). Die Entstehungshinweise sind keine Nutzungslizenz. Versionsverlauf unter [CHANGELOG.md](../CHANGELOG.md) und über die Versionsnummer in der Anwendung.
