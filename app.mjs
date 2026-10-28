import {APP_VERSION,PRIMITIVE_NAMES,newProject,evaluate,validateProject,meshTopology,toOBJ,normal,dot,planeCut,booleanTunnel,punchFaces,punchPlan,extrudeRegion,regionDirection,regionExtrudeCaps,extrudeGroup,splitFaceBand,removeParts,packFaceGroups,groupExtrudeCaps,expandFaceSelection,selectEdgeRing,selectFaces,retainFaces,bridgePair,bridge,tunnel,bestTunnelOffset,generalTunnel,bestGeneralTunnelOffset,mixedBridge,bestMixedBridgeOffset,curvedBridge,curvedBridgeSections,curvedBridgePreview,closestCurvedBridgeOffset,bestCurvedBridgeOffset,dragCurveHandle,curvedBridgePair,autoCurvedBridgeParams,subdivide,manualPatch,meshBoundary,triangulateFaces,loopSubdivide,honeycomb,dooSabin,dual,dissolveEdges,bevelEdges,subdivideFaces,splitEdges,truncateVertices,moveVertices,truncate,stellate,wireModel,shell,openShell,openingSource,defaultShellThickness,transformFace,bestBridgeOffset,viewBounds,navigationGesture} from './kernel.mjs';
// Interface localization is independent of project data and mesh evaluation.
let uiLanguage='de';
try{if(localStorage.getItem('kantolyx.language')==='en')uiLanguage='en';}catch{}
const ENGLISH_MESSAGES = {
  "Manuelle Reparatur": "Manual repair",
  "Loop-Subdivision": "Loop subdivision",
  "Triangulieren": "Triangulate",
  "Loch stanzen": "Punch holes",
  "Brücke": "Bridge",
  "Region extrudieren": "Extrude region",
  "Kanten auflösen": "Dissolve edges",
  "Dreieck–Viereck-Spline": "Triangle–quad spline",
  "Verdrehte Spline-Brücke": "Twisted spline bridge",
  "Verdrehte Dreiecks-Spline": "Twisted triangle spline",
  "Mehrpunkt-Spline": "Multipoint spline",
  "Dreiecks-Mehrpunkt-Spline": "Multipoint triangle spline",
  "Ebenenschnitt": "Plane cut",
  "Durchbruch (Volumenschnitt)": "Through-hole (solid cut)",
  "Am Ring trennen": "Split at ring",
  "Teil löschen": "Delete part",
  "Flächen extrudieren": "Extrude faces",
  "Quader": "Box",
  "Durchbruch": "Through-hole",
  "Dreieck–Viereck-Brücke": "Triangle–quad bridge",
  "Dreiecksbrücke": "Triangle bridge",
  "Dreiecks-Spline": "Triangle spline",
  "Gekrümmte Dreiecksbrücke": "Curved triangle bridge",
  "Spline-Brücke": "Spline bridge",
  "Gekrümmte Brücke": "Curved bridge",
  "Kanten abschrägen": "Bevel edges",
  "Flächen unterteilen": "Subdivide faces",
  "Kanten unterteilen": "Subdivide edges",
  "Punkte verschieben": "Move vertices",
  "Ausgewählte Ecken": "Selected corners",
  "Ecken abschneiden": "Truncate corners",
  "Spitzen": "Stellate",
  "Drahtmodell": "Wire model",
  "Dualnetz": "Dual mesh",
  "Schale / Rind": "Shell / rind",
  "Öffnung": "Opening",
  "Fläche formen": "Shape face",
  "Seitenzahl (3–128)": "Sides (3–128)",
  "Seitenlänge": "Side length",
  "Höhe / Dicke": "Height / thickness",
  "Umfangssegmente (3–128)": "Circumferential segments (3–128)",
  "Höhenabschnitte (2–128)": "Height divisions (2–128)",
  "Ringradius (bis Rohrmitte)": "Major radius (to tube center)",
  "Rohr-Radius": "Tube radius",
  "Ringsegmente (3–128)": "Ring segments (3–128)",
  "Rohrsegmente (3–128)": "Tube segments (3–128)",
  "Kantenlänge": "Edge length",
  "{0} Seiten · Seitenlänge {1} · Höhe {2}": "{0} sides · Side length {1} · Height {2}",
  "Radius {0} · {1} × {2} Abschnitte": "Radius {0} · {1} × {2} divisions",
  "Ringradius {0} · Rohr-Radius {1} · {2} × {3} Segmente": "Major radius {0} · Tube radius {1} · {2} × {3} segments",
  "12 Fünfecke + 20 Sechsecke · Kantenlänge {0}": "12 pentagons + 20 hexagons · Edge length {0}",
  "Kantenlänge {0}": "Edge length {0}",
  "Es läuft bereits eine Brückensuche.": "A bridge search is already running.",
  "Passender Brückenverlauf wird gesucht …": "Searching for a suitable bridge path …",
  "Suche verworfen, weil das Projekt inzwischen geändert wurde.": "Search discarded because the project has changed.",
  "Kurve ziehen. Das Netz wird erst bei „Übernehmen“ erzeugt und geprüft.": "Drag the curve. The mesh is generated and checked when you choose “Apply”.",
  "Pfadpunkt {0} · {1} %": "Path point {0} · {1} %",
  " (Faktor)": " (factor)",
  "Punkt entfernen": "Remove point",
  "Brücke aus dem Vorschaupfad übernommen.": "Bridge created from the preview path.",
  "Ebene verschoben – Schnitt wird beim Loslassen berechnet.": "Plane moved — the cut will be calculated when you release it.",
  "Vorschau gültig. Erst Übernehmen ändert die Timeline.": "Valid preview. The timeline changes only when you choose Apply.",
  "{0} Punkte · {1} Flächen · {2} Hüllen · Genus gesamt {3} · Vorschau": "{0} vertices · {1} faces · {2} shells · Total genus {3} · Preview",
  "Ebenenschnitt übernommen.": "Plane cut applied.",
  "Vorschau bis Schritt {0}": "Preview through step {0}",
  "{0} entfernt · {1} neue Flächen": "{0} removed · {1} new faces",
  " Flächen": " faces",
  "Gesamtes Netz": "Entire mesh",
  "{0} Startflächen · automatische Gegenfläche": "{0} source faces · Automatic opposite face",
  " Flächen · ": " faces · ",
  "{0}Länge {1} · Faktor {2} · {3}°": "{0}Length {1} · Scale {2} · {3}°",
  "{0} Kanten · Flächen zusammenführen": "{0} edges · Merge faces",
  "{0} Bezugsmarkierungen": "{0} reference selections",
  "Ebene {0}/{1}/{2} · Position {3}": "Plane {0}/{1}/{2} · Position {3}",
  "Lochgröße {0}": "Hole size {0}",
  "{0} Flächen · Länge {1}": "{0} faces · Length {1}",
  "Lochgröße {0} · Zuordnung {1}": "Hole size {0} · Mapping {1}",
  "Zuordnung {0}": "Mapping {0}",
  "{0} Segmente · Zuordnung {1}": "{0} segments · Mapping {1}",
  " · Mitte X/Y/Z ": " · Center X/Y/Z ",
  "{0} Segmente · A {1} / B {2} · Zuordnung {3}{4}": "{0} segments · A {1} / B {2} · Mapping {3}{4}",
  "{0} Stufe(n)": "{0} level(s)",
  "{0} Kanten · Breite {1}": "{0} edges · Width {1}",
  "{0} Flächen · lokale Vierecke": "{0} faces · Local quads",
  "{0} Kanten · {1} Abschnitte": "{0} edges · {1} divisions",
  "{0} Punkte · X {1} / Y {2} / Z {3}": "{0} vertices · X {1} / Y {2} / Z {3}",
  "{0} Ecken · Schnittstärke {1}": "{0} corners · Cut amount {1}",
  "Schnittstärke {0}": "Cut amount {0}",
  "Höhe {0} · {1} Fläche(n)": "Height {0} · {1} face(s)",
  "Strebenstärke {0}": "Strut thickness {0}",
  "{0} Öffnungsfläche(n)": "{0} opening face(s)",
  "Wandstärke {0} · {1} Öffnungsfläche(n)": "Wall thickness {0} · {1} opening face(s)",
  "Größenfaktor {0}": "Scale {0}",
  "Faktor {0} · {1}°": "Scale {0} · {1}°",
  "Länge {0}": "Length {0}",
  "Unterdrückt": "Suppressed",
  "Nach der aktuellen Vorschau": "After the current preview",
  "Schnittseite": "Cut side",
  "Beide Teile behalten": "Keep both parts",
  "Seite in Normalenrichtung": "Side along normal",
  "Gegenüberliegende Seite": "Opposite side",
  "Grundkörper": "Base solid",
  "Grundkörper gewechselt. Spätere Flächenbezüge gegebenenfalls neu zuordnen.": "Base solid changed. Reassign later face references if necessary.",
  "Länge (+ außen / − innen)": "Length (+ outward / − inward)",
  "Skalierung Deckfläche": "Cap scale",
  "Drehwinkel Deckfläche (Grad)": "Cap rotation (degrees)",
  "Richtung X": "Direction X",
  "Richtung Y": "Direction Y",
  "Richtung Z": "Direction Z",
  "Ebenennormale X": "Plane normal X",
  "Ebenennormale Y": "Plane normal Y",
  "Ebenennormale Z": "Plane normal Z",
  "Ebenenposition": "Plane position",
  "Lochgröße (Faktor)": "Hole size (factor)",
  "Breite": "Width",
  "Höhe": "Height",
  "Tiefe": "Depth",
  "Eckpunkt-Zuordnung (0–3)": "Vertex mapping (0–3)",
  "Eckpunkt-Zuordnung (0–{0})": "Vertex mapping (0–{0})",
  "Segmente (1–16)": "Segments (1–16)",
  "Krümmung A (Faktor)": "Curvature A (factor)",
  "Krümmung B (Faktor)": "Curvature B (factor)",
  "Segmente (3–32)": "Segments (3–32)",
  "Verdrehung Mitte (Grad)": "Center twist (degrees)",
  "Stufen (1–2)": "Levels (1–2)",
  "Fasenbreite": "Bevel width",
  "Abschnitte (2–16)": "Divisions (2–16)",
  "Versatz X": "Offset X",
  "Versatz Y": "Offset Y",
  "Versatz Z": "Offset Z",
  "Schnittstärke (0,01–0,49)": "Cut amount (0.01–0.49)",
  "Spitzenhöhe (±)": "Peak height (±)",
  "Strebenstärke": "Strut thickness",
  "Wandstärke": "Wall thickness",
  "Größenfaktor (0,1–4)": "Scale (0.1–4)",
  "Skalierung (Faktor)": "Scale (factor)",
  "Drehwinkel (Grad)": "Rotation (degrees)",
  "Länge": "Length",
  "Positiv: nach außen. Negativ: nach innen. Betrag mindestens 0,01; null ist nicht erlaubt.": "Positive: outward. Negative: inward. Minimum magnitude 0.01; zero is not allowed.",
  "Mitte {0} (Faktor)": "Center {0} (factor)",
  "A/B: Grifflängen entlang der Flächennormalen. Mitte X/Y/Z: zusätzliche Verschiebung der Kurvenmitte entlang der festen Modellachsen, relativ zum Abstand der Endflächenmittelpunkte. 0 = keine Zusatzverschiebung; 0,1 = 10 % dieses Abstands. Gleiche Werte sind unabhängig von der Ansicht.": "A/B: handle lengths along face normals. Center X/Y/Z: extra displacement of the curve center along the fixed model axes, relative to the distance between end-face centers. 0 = no extra displacement; 0.1 = 10% of this distance. Values are independent of the view.",
  " zusätzliche Pfadpunkte. Über Spline bearbeiten ziehen oder X/Y/Z ändern.": " extra path points. Drag them using Edit spline or change X/Y/Z.",
  " Außenflächen. Für Änderungen den Zustand vor diesem Schritt anzeigen, Flächengruppe markieren und „Auswahl als Öffnung“ wählen. Unterdrücken schließt nur diesen Öffnungsschritt.": " outer faces. To change them, show the state before this step, select faces and choose “Use selection as opening”. Suppressing closes only this opening step.",
  "Innenversatz; an komplexen Ecken nur angenäherte Wandstärke. Öffnungsflächen: ": "Inward offset; wall thickness is approximate at complex corners. Opening faces: ",
  "keine (geschlossene Hohlform)": "none (closed hollow solid)",
  ". Zum Ändern den Zustand vor der Schale anzeigen und bis zu zwei Flächen auswählen.": ". To change them, show the state before the shell and select up to two faces.",
  "Faktor 1 und 0° lassen die Fläche unverändert. Drehung um ihren Mittelpunkt und ihre Ausgangsnormale; angrenzende Flächen werden mitverformt.": "Scale 1 and 0° leave the face unchanged. Rotation is about its center and original normal; adjacent faces deform with it.",
  "Brückenwand": "Bridge walls",
  "Vierecke": "Quads",
  "Dreiecke (bisherig)": "Triangles (legacy)",
  "Bezugsfläche: ": "Reference face: ",
  "Timeline ab hier löschen": "Delete timeline from here",
  "{0} Timeline-Schritt(e) ab dieser Stelle löschen? Der Grundkörper bleibt erhalten.": "Delete {0} timeline step(s) from here? The base solid will remain.",
  "{0} Timeline-Schritt(e) gelöscht.": "{0} timeline step(s) deleted.",
  "Alle Schritte nach dem Grundkörper löschen.": "Delete all steps after the base solid.",
  "Diesen Schritt und alle folgenden löschen.": "Delete this step and all following steps.",
  "Aktivieren": "Enable",
  "Unterdrücken": "Suppress",
  "Löschen": "Delete",
  "Diesen Schritt löschen? Abhängige Schritte können dadurch ihre Bezugsfläche verlieren.": "Delete this step? Dependent steps may lose their reference face.",
  "Manuell weiterbearbeiten": "Continue manual repair",
  "Schnittebene bearbeiten": "Edit cutting plane",
  "Auswahl als Bezug": "Use selection as reference",
  "Auswahl als Triangulierungsflächen": "Use selection for triangulation",
  "Gesamtes Netz triangulieren": "Triangulate entire mesh",
  "Auswahl als Stanzflächen": "Use selection as punch faces",
  "Auswahl als Extrusionsflächen": "Use selection as extrusion faces",
  "Auswahlpaar als Bezug": "Use selected pair as reference",
  "Auswahl als Unterteilungsflächen": "Use selection as subdivision faces",
  "Auswahl als Bezugskanten": "Use selection as reference edges",
  "Auswahl als Bezugspunkte": "Use selection as reference vertices",
  "Auswahl als Spitzenflächen": "Use selection as stellation faces",
  "Auswahl als Öffnung": "Use selection as opening",
  "Auswahl als Öffnungen": "Use selection as openings",
  "Öffnungen schließen": "Close openings",
  "Spline bearbeiten": "Edit spline",
  "Verlauf wird gesucht …": "Searching for a path …",
  "Automatisch einstellen": "Set automatically",
  "Gültiger Startpunkt gefunden. Alle Werte bleiben rechts editierbar.": "Valid starting point found. All values remain editable on the right.",
  "Änderungen werden auf die folgenden Schritte angewendet.": "Changes will be applied to the following steps.",
  "Brückenverlauf wird gesucht …": "Searching for a bridge path …",
  "Ein Dreieck oder Viereck pro Endfläche auswählen.": "Select a triangle or quad for each end face.",
  "Zwischen ebenen Dreiecken und Vierecken, auch gemischt und bei anderer Ausrichtung. Spline-Vorschau ziehen, dann Brückennetz übernehmen.": "Between planar triangles and quads, including mixed types and different orientations. Drag the spline preview, then apply the bridge mesh.",
  "Außenflächen einer bestehenden Schale auswählen; für größere Gruppen „Flächengruppe“ einschalten.": "Select outer faces of an existing shell; enable “Face group” for larger groups.",
  "Loop glättet das gesamte geschlossene Dreiecksnetz. 1–2 Stufen in der Timeline.": "Loop smooths the entire closed triangle mesh. Set 1–2 levels in the timeline.",
  "Zuerst das gesamte Modell triangulieren: Auswahl leeren, dann Triangulieren wählen.": "Triangulate the entire model first: clear the selection, then choose Triangulate.",
  " Hüllen · Genus gesamt ": " shells · Total genus ",
  "Genus ": "Genus ",
  "{0} Punkte · {1} Flächen · {2}{3}": "{0} vertices · {1} faces · {2}{3}",
  " · Schnittvorschau (nicht übernommen)": " · Cut preview (not applied)",
  " · Pfadvorschau (nicht übernommen)": " · Path preview (not applied)",
  " · Fehler: letzter gültiger Zustand sichtbar": " · Error: showing last valid state",
  "Flächen": "Faces",
  "Kanten": "Edges",
  "Punkte": "Vertices",
  "{0} von {1} {2} ausgewählt": "{0} of {1} {2} selected",
  "Keine Auswahl": "No selection",
  "Fläche {0} abwählen": "Deselect face {0}",
  "Flächengruppe aktiv: Antippen ergänzt oder entfernt beliebig viele Flächen innerhalb der Netzgrenzen.": "Face group enabled: tap to add or remove any number of faces within mesh limits.",
  "Zwei ${label} ausgewählt: gerade oder gekrümmte Brücke wählen.": "Two ${label} selected: choose a straight or curved bridge.",
  "Mehrfachauswahl aktiv: Klicken ergänzt eine Fläche oder wählt sie ab.": "Multiple selection enabled: click to add or remove a face.",
  "Umschalt+Klick ergänzt die zweite Fläche oder wählt eine Fläche ab.": "Shift+click adds a second face or deselects a face.",
  "Mehrfachauswahl: bis zu 32 Elemente per Antippen sammeln; Umschalt+Klick ergänzt ebenfalls.": "Multiple selection: tap to collect up to 32 elements; Shift+click also adds elements.",
  "Flächengruppe: ": "Face group: ",
  "Mehrfachauswahl: ": "Multiple selection: ",
  "{0} Flächen ausgewählt.": "{0} faces selected.",
  "{0} Kanten ausgewählt. Ring läuft über gegenüberliegende Viereckkanten; Ende an Dreiecken und anderen Polygonen.": "{0} edges selected. The ring follows opposite quad edges and stops at triangles and other polygons.",
  "Auswahl fokussiert. Drehpunkt liegt jetzt im Zentrum der Auswahl.": "Selection focused. The pivot is now at its center.",
  "Ebene verschieben": "Move plane",
  "Mitte": "Center",
  "Zum Verschieben die Ansicht etwas seitlich drehen oder Position numerisch ändern.": "Rotate the view slightly to the side to move it, or enter the position numerically.",
  "Es sind bereits {0} Flächen ausgewählt. Abwählen oder für Öffnungen „Flächengruppe“ einschalten.": "{0} faces already selected. Deselect some or enable “Face group” for openings.",
  "Maximal 32 Elemente auswählen.": "Select no more than 32 elements.",
  "Bezugsfläche fehlt.": "Reference face is missing.",
  "Markierte Flächen entfernt und entstandene Ränder geschlossen.": "Selected faces removed and resulting boundaries capped.",
  "Markierte zusammenhängende Teile gelöscht.": "Selected connected parts deleted.",
  "Region gemeinsam extrudiert. Länge und Richtung rechts ändern.": "Region extruded together. Change length and direction on the right.",
  "Formschritt angelegt. Rechts Skalierung und Drehwinkel einstellen.": "Shape step created. Set scale and rotation on the right.",
  "Berechnungsworker nicht verfügbar.": "Calculation worker unavailable.",
  "Keine passende Stanzfläche: ": "No suitable punch face: ",
  "Lochstanzen wird berechnet … Bitte warten.": "Calculating hole punching … Please wait.",
  "Berechnung verworfen: Das Projekt wurde inzwischen geändert.": "Calculation discarded: the project has changed.",
  " unpassende Fläche(n) übersprungen: ": " unsuitable face(s) skipped: ",
  "{0} Loch/Löcher gestanzt.{1}": "{0} hole(s) punched.{1}",
  "Durchbruch angelegt. Lochgröße rechts ändern.": "Through-hole created. Change the hole size on the right.",
  "Dreieck–Viereck-Brücke angelegt. Zuordnung rechts ändern.": "Triangle–quad bridge created. Change the mapping on the right.",
  "Brücke angelegt. Zuordnung und Segmente lassen sich rechts ändern.": "Bridge created. Change mapping and segments on the right.",
  "Modell geglättet. Rechts lässt sich die Stufenzahl auf 1 oder 2 einstellen.": "Model smoothed. Set the level count to 1 or 2 on the right.",
  "Linienzug: ": "Polyline: ",
  " Punkte. ": " points. ",
  "Löcher vor dem Übernehmen schließen.": "Close holes before applying.",
  "Netz geschlossen.": "Mesh closed.",
  "{0} offene Randkanten · {1} Flächen entfernt · {2} neue Flächen. {3}{4}": "{0} open boundary edges · {1} faces removed · {2} new faces. {3}{4}",
  "Punkt schon im Linienzug. Zum Schließen den ersten Punkt anklicken.": "Point already in the polyline. Click the first point to close it.",
  "Maximal 32 Punkte pro neuer Fläche.": "Maximum 32 points per new face.",
  "Neue Flächen über „Letzten Eingriff zurück“ entfernen.": "Remove new faces using “Undo last repair”.",
  "Geschlossene manuelle Reparatur in die Timeline übernommen.": "Closed manual repair added to the timeline.",
  "Trianguliert. Ohne Auswahl wird das gesamte Netz trianguliert; danach Loop möglich.": "Triangulated. Without a selection the entire mesh is triangulated; Loop can then be used.",
  "Loop-Subdivision angewendet. Stufen 1–2 rechts einstellen.": "Loop subdivision applied. Set 1–2 levels on the right.",
  "Honeycomb angewendet. Stufen 1–2 rechts ändern; weitere Honeycomb-Schritte verfeinern das Wabenmuster.": "Honeycomb applied. Set 1–2 levels on the right; further Honeycomb steps refine the pattern.",
  "Doo-Sabin angewendet. Rechts lässt sich die Stufenzahl auf 1 oder 2 einstellen.": "Doo-Sabin applied. Set the level count to 1 or 2 on the right.",
  "Öffnung als eigener Schritt angelegt. Unterdrücken schließt diesen Schritt; die Wandstärke bleibt an der Schale.": "Opening added as a separate step. Suppress it to close it; wall thickness remains on the shell.",
  "Schale angelegt. Wandstärke und Öffnungen bleiben am Timeline-Schritt änderbar.": "Shell created. Wall thickness and openings remain editable in the timeline step.",
  "Geschlossene Hohlform angelegt. Für eine Öffnung vor dem Schalenschritt Flächen auswählen und „Auswahl als Öffnungen“ verwenden.": "Closed hollow solid created. For openings, select faces before the shell step and use “Use selection as openings”.",
  "Flächen lokal unterteilt. Neue Punkte lassen sich im Punktmodus verschieben.": "Faces subdivided locally. Move new points in vertex mode.",
  "Fase angelegt. Breite rechts einstellen.": "Bevel created. Set its width on the right.",
  "Kanten aufgelöst und ebene Nachbarflächen zusammengeführt.": "Edges dissolved and planar neighboring faces merged.",
  "Kanten unterteilt. Abschnitte rechts einstellen; neue Punkte im Punktmodus auswählen.": "Edges subdivided. Set divisions on the right; select new points in vertex mode.",
  "Ausgewählte Ecken abgeschnitten. Schnittstärke rechts ändern.": "Selected corners truncated. Change the cut amount on the right.",
  "Punktverschiebung angelegt. Versatz X/Y/Z rechts einstellen.": "Vertex move created. Set X/Y/Z offsets on the right.",
  "Ecken abgeschnitten. Schnittstärke rechts als Anteil der Kantenlänge ändern.": "Corners truncated. Set the cut amount as a fraction of edge length on the right.",
  "Spitzen angelegt. Höhe rechts ändern: positiv nach außen, negativ nach innen.": "Peaks created. Change height on the right: positive outward, negative inward.",
  "Drahtmodell angelegt. Strebenstärke rechts ändern; anschließend bei Bedarf glätten.": "Wire model created. Change strut thickness on the right; smooth afterwards if needed.",
  "Dualnetz angelegt. Rechts bleibt der Größenfaktor änderbar.": "Dual mesh created. Scale remains editable on the right.",
  "■ Stoppen": "■ Stop",
  "▶ Abspielen": "▶ Play",
  "Wiedergabe stoppen; angezeigter Schritt bleibt sichtbar.": "Stop playback; the displayed step remains visible.",
  "Timeline vom Anfang bis zum Ende abspielen.": "Play the timeline from start to finish.",
  " (unterdrückt)": " (suppressed)",
  " · Auswahl vor dem Schritt": " · Selection before step",
  "Wiedergabe am fehlerhaften Schritt angehalten.": "Playback stopped at the failed step.",
  "Nicht gespeicherte Änderungen verwerfen?": "Discard unsaved changes?",
  "Vorschau oder manuelle Reparatur zuerst übernehmen oder abbrechen.": "Apply or cancel the preview or manual repair first.",
  "Projektdatei wurde zum Download übergeben.": "Project file sent to download.",
  "Exportiert wurde der aktuell sichtbare Zustand.": "The currently visible state was exported.",
  "Projektdatei ist zu groß (max. 2 MB).": "Project file is too large (maximum 2 MB).",
  "Unbenannt": "Untitled",
  "Projekt geladen. Bitte die markierten Bezugsfehler beheben.": "Project loaded. Please fix the highlighted reference errors.",
  "Öffnen fehlgeschlagen: ": "Failed to open: ",
  "Öffnen": "Open",
  "Bitte warten …": "Please wait …",
  "Bereit.": "Ready.",
  "Bitte einen Projektnamen eingeben.": "Please enter a project name.",
  "Kantolyx · Parametrisches Mesh-Labor": "Kantolyx · Parametric mesh lab",
  "Vollständiges Changelog aller Versionen öffnen": "Open the complete version history",
  "Neu": "New",
  "Projekt öffnen": "Open project",
  "Projekt speichern": "Save project",
  "OBJ exportieren": "Export OBJ",
  "Informationen zur Entstehung von Kantolyx": "Information about how Kantolyx was developed",
  "Über Kantolyx": "About Kantolyx",
  "MODELLIEREN": "MODELING",
  "Werkzeuge": "Tools",
  "Körper an einer einstellbaren Ebene schneiden, auch konkave oder bereits durchbrochene Modelle. Die Seite in Richtung der Normalen bleibt erhalten.": "Cut solids with an adjustable plane, including concave models and models with holes. The side along the normal is retained.",
  "Markierte Flächen entfernen und alle entstandenen ebenen konvexen Ränder schließen. Der Körper darf zusammenhängend bleiben. Andere Körper bleiben erhalten.": "Remove selected faces and cap all resulting planar convex boundaries. The solid may remain connected. Other solids are retained.",
  "Über Fläche, Kante oder Punkt markierte zusammenhängende Teile vollständig löschen. Mindestens ein Teil bleibt erhalten.": "Delete entire connected parts selected through a face, edge or vertex. At least one part must remain.",
  "Eine oder mehrere Flächen auswählen; jede wird einzeln entlang ihrer Normalen extrudiert. Länge, Skalierung und Drehung der Deckfläche im selben Timeline-Schritt einstellen. Negative Länge versetzt nach innen.": "Select one or more faces; each is extruded along its own normal. Set length, cap scale and rotation in the same timeline step. Negative length moves inward.",
  "Zusammenhängende Flächen gemeinsam verschieben, mit Seitenwänden nur am Regionsrand. Länge und gemeinsame Richtung in der Timeline editierbar. Positive Länge nach außen, negative nach innen.": "Move connected faces together, with side walls only along the region boundary. Edit length and common direction in the timeline. Positive length moves outward, negative inward.",
  "Eine Fläche auswählen. Faktor und Winkel bleiben in der Timeline änderbar.": "Select a face. Scale and angle remain editable in the timeline.",
  "Fläche skalieren / drehen": "Scale / rotate face",
  "Experimentell: Flächen entfernen, Innenseiten orange ansehen und offene Ränder durch Verbinden vorhandener Eckpunkte manuell schließen. Erst geschlossenes Netz übernehmen.": "Experimental: remove faces, view orange inner surfaces and manually close open boundaries by connecting existing vertices. Apply only a closed mesh.",
  "Manuell reparieren": "Manual repair",
  "1–128 Flächen mit konvexer Kontur wählen. Mehrere Innenstrahlen bestätigen die nächste passende Gegenfläche, auch leicht schräg/verzogen. Ähnliche Dreiecke/Vierecke direkt ohne Rand verbinden. Unpassende Flächen werden gemeldet.": "Select 1–128 faces with convex outlines. Several internal rays confirm the nearest suitable opposite face, including slightly tilted or warped faces. Similar triangles/quads connect directly without a rim. Unsuitable faces are reported.",
  "Zwei ebene konvexe Endflächen mit 3–16 Ecken wählen. Volumenschnitt auch durch konkave oder bereits durchbrochene Körper. Öffnungen mit Rand und innerer Tunnelwand; Lochgröße in der Timeline änderbar.": "Select two planar convex end faces with 3–16 corners. Solid cut through concave solids or solids with existing holes. Openings have a rim and inner tunnel wall; edit hole size in the timeline.",
  "Gerade Brücke zwischen gegenüberliegenden Dreiecken oder Vierecken, auch Dreieck–Viereck und seitlich versetzt.": "Straight bridge between opposite triangles or quads, including triangle–quad pairs and lateral offsets.",
  "Flächen verbinden": "Connect faces",
  "Catmull-Clark auf dem gesamten Netz. 1–2 Stufen, nachträglich in der Timeline änderbar.": "Catmull-Clark on the entire mesh. Set 1–2 levels, editable later in the timeline.",
  "Catmull-Clark glätten": "Catmull-Clark smooth",
  "Ausgewählte Flächen in Dreiecke aufteilen; ohne Auswahl das gesamte Netz. Keine Punktverschiebung. Auch nicht ebene Polygone mit einfacher Projektion.": "Split selected faces into triangles; with no selection, triangulate the entire mesh. Vertices do not move. Supports nonplanar polygons with a simple projection.",
  "Zuerst das gesamte Netz triangulieren. Loop glättet Dreiecksnetze mit 1–2 Stufen.": "Triangulate the entire mesh first. Loop smooths triangle meshes with 1–2 levels.",
  "Loop glätten": "Loop smooth",
  "Honeycomb nach Akleman/Srinivasan: drei Kanten pro Punkt, zunehmendes Wabenmuster. 1–2 Stufen als Timeline-Schritt.": "Honeycomb after Akleman/Srinivasan: three edges per vertex and an increasingly refined honeycomb pattern. 1–2 levels per timeline step.",
  "Rundet Flächenecken ab. Eigenständiger Timeline-Schritt mit 1–2 Stufen.": "Rounds face corners. Separate timeline step with 1–2 levels.",
  "Doo-Sabin glätten": "Doo-Sabin smooth",
  "Ersetzt Flächen durch ihre Mittelpunkte und Punkte durch umgebende Flächen. Größenfaktor bleibt in der Timeline änderbar.": "Replaces faces with their centers and vertices with surrounding faces. Scale remains editable in the timeline.",
  "Erzeugt das Dualnetz des gesamten geschlossenen Modells.": "Creates the dual mesh of the entire closed model.",
  "Dualnetz bilden": "Create dual mesh",
  "Ausgewählte ebene, konvexe Flächen in Vierecke unterteilen. Neue Kantenpunkte werden mit Nachbarflächen geteilt; die Form bleibt erhalten.": "Subdivide selected planar convex faces into quads. New edge points are shared with neighboring faces; the shape is preserved.",
  "Ausgewählte Kanten einer konvexen Außenhülle mit ebenen Flächen abschrägen. Eine flache Fase, Breite in Modellkoordinaten editierbar.": "Bevel selected edges of a convex outer hull with planar faces. Flat bevel with editable width in model coordinates.",
  "Im Kantenmodus 1–32 innere Kanten ebener Flächen wählen. Flächen zu einem einfachen konkaven Polygon zusammenführen; Knicke und Löcher werden abgelehnt.": "In edge mode, select 1–32 internal edges between planar faces. Merge faces into a simple concave polygon; creases and holes are rejected.",
  "Im Kantenmodus 1–32 innere Kanten ebener Flächen wählen. Flächen zu einem einfachen Polygon zusammenführen; Knicke und Löcher werden abgelehnt.": "In edge mode, select 1–32 internal edges between planar faces. Merge faces into a simple polygon; creases and holes are rejected.",
  "Im Kantenmodus 1–32 Kanten wählen. In 2–16 gleiche Abschnitte teilen; neue Punkte anschließend verschieben.": "In edge mode, select 1–32 edges. Split into 2–16 equal divisions, then move the new vertices.",
  "Im Punktmodus 1–32 Ecken auswählen. Nur diese Ecken abschneiden; Schnittstärke und Bezugspunkte bleiben in der Timeline änderbar.": "In vertex mode, select 1–32 corners. Truncate only these corners; cut amount and reference vertices remain editable in the timeline.",
  "Auswahl abschneiden": "Truncate selection",
  "Im Punktmodus 1–32 Punkte auswählen. Gemeinsamen Versatz X/Y/Z als Timeline-Schritt einstellen.": "In vertex mode, select 1–32 vertices. Set a common X/Y/Z offset as a timeline step.",
  "Alle Ecken abschneiden. Schnittstärke als Anteil jeder Kantenlänge: 0,25 entspricht 25 % von jedem Ende. In der Timeline änderbar.": "Truncate all corners. Cut amount is a fraction of each edge length: 0.25 means 25% from each end. Editable in the timeline.",
  "Ausgewählte ebene, konvexe Flächen zu Spitzen formen. Höhe positiv nach außen, negativ nach innen; in der Timeline änderbar.": "Turn selected planar convex faces into peaks. Positive height points outward, negative inward; editable in the timeline.",
  "Spitzen formen": "Stellate faces",
  "Erzeugt geschlossene kantige Streben entlang der Kanten. Für ebene, konvexe Flächen; vor dem Glätten anwenden. Strebenstärke bleibt in der Timeline änderbar.": "Creates closed angular struts along edges. For planar convex faces; apply before smoothing. Strut thickness remains editable in the timeline.",
  "Erzeugt eine Innenhülle mit Wandstärke. Bis zu zwei ausgewählte Flächen werden zu Öffnungen mit verbundenem Rand; ohne Auswahl entsteht eine geschlossene Hohlform.": "Creates an inner shell with wall thickness. Up to two selected faces become rimmed openings; with no selection, creates a closed hollow solid.",
  "Schale mit editierbarer Wandstärke und optionalen Öffnungen erzeugen.": "Create a shell with editable wall thickness and optional openings.",
  "Ausgewählte Außenflächen einer bestehenden Schale öffnen und die Innen-/Außenränder verbinden. Flächengruppen bis 32 Flächen.": "Open selected outer faces of an existing shell and connect inner/outer boundaries. Groups of up to 32 faces.",
  "Schale öffnen": "Open shell",
  "AUSWAHL": "SELECTION",
  "Auswahlmodus": "Selection mode",
  "Flächen auswählen": "Select faces",
  "Kanten auswählen und unterteilen": "Select and subdivide edges",
  "Punkte auswählen und mit Punkte verschieben bearbeiten": "Select vertices and edit them using Move vertices",
  "Mehrfachauswahl: aus": "Multiple selection: off",
  "Flächengruppe für Öffnungen und Spitzen: Flächen durch Antippen oder Umschalt+Klick sammeln. Brücken verwenden weiterhin zwei Flächen.": "Face group for openings and peaks: collect faces by tapping or Shift+clicking. Bridges still use two faces.",
  "Flächengruppe: aus": "Face group: off",
  "Ausgewählte Flächen": "Selected faces",
  "Alle Flächen des angezeigten Modells auswählen.": "Select all faces of the displayed model.",
  "Alle Flächen wählen": "Select all faces",
  "Ausgehend von der Auswahl alle über Kanten verbundenen Flächen wählen. Bei einem geschlossenen Einzelkörper ist das die ganze Oberfläche.": "Starting at the selection, select all faces connected through edges. On a single closed solid this selects the entire surface.",
  "Zusammenhängend wählen": "Select connected",
  "Angrenzende Flächen in derselben Ebene wählen. Stoppt an Knicken; hilfreich für Regionsextrusion und Kanten auflösen.": "Select adjacent faces in the same plane. Stops at creases; useful for region extrusion and dissolving edges.",
  "Koplanar wählen": "Select coplanar",
  "Alle direkt über eine Kante angrenzenden Flächen ergänzen. Erneutes Drücken erweitert um eine weitere Reihe.": "Add all faces sharing an edge with the selection. Press again to grow by another row.",
  "Flächenauswahl erweitern": "Grow face selection",
  "Gegenüberliegende Kanten durch Vierecksflächen verfolgen. Stoppt an Dreiecken und anderen Polygonen; höchstens 32 Kanten, keine gekürzte Teilauswahl.": "Follow opposite edges across quads. Stops at triangles and other polygons; maximum 32 edges, without a truncated partial selection.",
  "Kantenring wählen": "Select edge ring",
  "Esc im Modellfenster: Auswahl leeren.": "Esc in the model view: clear selection.",
  "Auswahl leeren": "Clear selection",
  "ANSICHT": "VIEW",
  "Passt das gesamte Modell ein und setzt den Drehpunkt in seine Mitte. Tastenkürzel: Pos1.": "Fit the entire model and place the pivot at its center. Shortcut: Home.",
  "Modell einpassen": "Fit model",
  "Passt die ausgewählten Flächen ein und setzt den Drehpunkt dorthin. Tastenkürzel: F.": "Fit the selected faces and move the pivot there. Shortcut: F.",
  "Auswahl fokussieren": "Focus selection",
  "Setzt Orientierung und Bildausschnitt zurück. Maus: links ziehen = drehen; Mitte oder Umschalt+Ziehen = pannen; Mausrad = zoomen; Klick = Fläche wählen; Umschalt+Klick = ergänzen oder abwählen. Touch: ein Finger dreht, zwei Finger verschieben und zoomen.": "Reset orientation and framing. Mouse: left drag = rotate; middle or Shift+drag = pan; wheel = zoom; click = select face; Shift+click = add or deselect. Touch: one finger rotates, two fingers pan and zoom.",
  "Standardansicht": "Default view",
  "Blendet die Kanten des Netzes ein oder aus.": "Show or hide mesh edges.",
  "Kanten anzeigen": "Show edges",
  "ENTWICKLUNGSSTAND": "DEVELOPMENT STATUS",
  "Etappe 10e / Lokale Flächen": "Stage 10e / Local faces",
  "Extrusion · Brücke · Glätten · Historie": "Extrusion · Bridge · Smoothing · History",
  "ORTHOGRAFISCH / NETZ": "ORTHOGRAPHIC / MESH",
  "3D-Modell. Mit der Maus drehen und Flächen auswählen. Umschalt und Klick ergänzt eine zweite Fläche. Escape leert die Auswahl. Mittlere Maustaste oder Umschalt und Ziehen verschiebt die Ansicht. F fokussiert die Auswahl. Touch: ein Finger dreht, zwei Finger verschieben und zoomen; Antippen wählt eine Fläche.": "3D model. Rotate and select faces with the mouse. Shift+click adds a second face. Escape clears the selection. Middle drag or Shift+drag pans. F focuses the selection. Touch: one finger rotates, two fingers pan and zoom; tap selects a face.",
  "Keine Fläche ausgewählt": "No face selected",
  "1 Finger: drehen · 2 Finger: zoomen / verschieben": "1 finger: rotate · 2 fingers: zoom / pan",
  "EXPERIMENT · MANUELLE REPARATUR": "EXPERIMENT · MANUAL REPAIR",
  "Flächen und Löcher": "Faces and holes",
  "Innen orange, offene Randkanten gelb. Flächen antippen und entfernen. Danach Eckpunkte der neuen Fläche der Reihe nach verbinden; erster Punkt oder „Fläche erzeugen“ schließt den Linienzug. Bestehende Randkante mitverwenden.": "Inner surfaces are orange, open boundary edges yellow. Tap faces and remove them. Then connect the new face vertices in order; the first point or “Create face” closes the polyline. Include an existing boundary edge.",
  "Flächen wählen": "Select faces",
  "Eckpunkte verbinden": "Connect vertices",
  "Markierte Flächen entfernen": "Remove selected faces",
  "Fläche erzeugen": "Create face",
  "Letzte Linie zurück": "Undo last line",
  "Letzten Eingriff zurück": "Undo last repair",
  "Reparatur zurücksetzen": "Reset repair",
  "Reparatur übernehmen": "Apply repair",
  "Abbrechen": "Cancel",
  "SCHNITTEBENE · VORSCHAU": "CUTTING PLANE · PREVIEW",
  "Schnitt einstellen": "Adjust cut",
  "Weißen Griff ziehen. Zum Verschieben entlang der Normalen die Ebene etwas seitlich ansehen. Während des Ziehens folgt die Ebene; beim Loslassen wird das Ergebnis berechnet.": "Drag the white handle. View the plane slightly from the side to move it along its normal. The plane follows while dragging; the result is calculated on release.",
  "Ebene senkrecht zur X-Achse durch Modellmitte": "Plane perpendicular to the X axis through the model center",
  "Ebene senkrecht zur Y-Achse durch Modellmitte": "Plane perpendicular to the Y axis through the model center",
  "Ebene senkrecht zur Z-Achse durch Modellmitte": "Plane perpendicular to the Z axis through the model center",
  "Normale X": "Normal X",
  "Normale Y": "Normal Y",
  "Normale Z": "Normal Z",
  "Behalten": "Keep",
  "Beide Teile": "Both parts",
  "Übernehmen": "Apply",
  "BRÜCKENPFAD · VORSCHAU": "BRIDGE PATH · PREVIEW",
  "Kurve formen": "Shape curve",
  "Den weißen Mittelpunkt mit der Maus rund ziehen. A/B entlang der Endrichtungen ziehen. Ansicht drehen, um aus einer anderen Richtung zu formen.": "Drag the white center point to bend the curve. Drag A/B along the end directions. Rotate the view to shape it from another direction.",
  "Krümmung A": "Curvature A",
  "Krümmung B": "Curvature B",
  "Segmente": "Segments",
  "Zuordnung": "Mapping",
  "Mitte X (Faktor)": "Center X (factor)",
  "Mitte Y (Faktor)": "Center Y (factor)",
  "Mitte Z (Faktor)": "Center Z (factor)",
  "Mitte X/Y/Z: Zusatzverschiebung entlang der festen Modellachsen, relativ zum Abstand der Endflächenmittelpunkte. 0,1 = 10 % dieses Abstands; 0 = unverändert. Gleiche Werte gelten unabhängig von der Ansicht.": "Center X/Y/Z: extra displacement along the fixed model axes, relative to the distance between end-face centers. 0.1 = 10% of this distance; 0 = unchanged. Values are independent of the view.",
  "Zusätzliche Drehung um den Brückenpfad: Maximum in der Mitte, null an beiden Anschlüssen.": "Extra rotation around the bridge path: maximum at the center, zero at both ends.",
  "Bis zu drei zusätzliche Punkte an festen Stellen des Pfads hinzufügen.": "Add up to three extra points at fixed positions along the path.",
  "Pfadpunkt": "Path point",
  "Automatischer Start": "Automatic start",
  "Mitte zurücksetzen": "Reset center",
  "Esc im Modellfenster: abbrechen. Vorschau verändert das Projekt erst beim Übernehmen. Der Spline allein garantiert noch keine passende Brückendicke.": "Esc in the model view: cancel. The preview changes the project only when applied. The spline alone does not guarantee a suitable bridge thickness.",
  "SCHRITT BEARBEITEN": "EDIT STEP",
  "HISTORIE": "HISTORY",
  "Schritt anklicken: Parameter ändern.": "Click a step to edit its parameters.",
  "Ein Klick zeigt sofort den Zustand dieses Schritts.": "Click to immediately show the state at that step.",
  "Spätere Schritte werden bei Änderungen neu berechnet.": "Later steps are recalculated when parameters change.",
  "Gesamtes Modell anzeigen": "Show entire model",
  "Alpha: Selbstüberschneidungen werden noch nicht erkannt. Kein maßhaltiger CAD-Volumenkern.": "Alpha: self-intersections are not yet detected. Not a dimensionally precise CAD solid kernel.",
  "PARAMETRISCHE TIMELINE": "PARAMETRIC TIMELINE",
  "Timeline-Wiedergabe": "Timeline playback",
  "Timeline vom Anfang bis Ende abspielen": "Play timeline from start to finish",
  "Zeit pro Schritt": "Time per step",
  "Zeit pro Schritt; die letzten 20 % zeigen die Auswahl vor dem nächsten Schritt.": "Time per step; the final 20% shows the selection before the next step.",
  "1 Sekunde": "1 second",
  "2 Sekunden": "2 seconds",
  "3 Sekunden": "3 seconds",
  "4 Sekunden": "4 seconds",
  "5 Sekunden": "5 seconds",
  "Modell während der Wiedergabe langsam drehen": "Slowly rotate the model during playback",
  "Drehen": "Rotate",
  "Modellierschritte — Details beim Überfahren oder per Bildschirmleser": "Modeling steps — details on hover or via screen reader",
  "Über Kantolyx schließen": "Close About Kantolyx",
  "Kantolyx wurde mit OpenAI ChatGPT/Codex entwickelt. Der Programmcode wurde überwiegend durch KI erzeugt. Konzept, Funktionsanforderungen und praktische Erprobung erfolgten durch die Projektleitung.": "Kantolyx was developed with OpenAI ChatGPT/Codex. Most of the program code was generated by AI. The project lead provided the concept, feature requirements and practical testing.",
  "Die Lizenzentscheidung für Kantolyx ist noch offen. Dieser Hinweis beschreibt die Entstehung und ist keine Nutzungslizenz.": "The license for Kantolyx has not yet been chosen. This note describes its development and is not a usage license.",
  "Kantolyx · Vollständiges Changelog": "Kantolyx · Complete changelog",
  "Changelog schließen": "Close changelog",
  "Neues Projekt": "New project",
  "Prisma · Seitenzahl frei wählbar": "Prism · Adjustable number of sides",
  "Dodekaeder · 12 Fünfecke": "Dodecahedron · 12 pentagons",
  "Kugel": "Sphere",
  "Torus / Ring": "Torus / ring",
  "Fußball · 12 Fünfecke + 20 Sechsecke": "Soccer ball · 12 pentagons + 20 hexagons",
  "Tetraeder · 4 Flächen": "Tetrahedron · 4 faces",
  "Oktaeder · 8 Flächen": "Octahedron · 8 faces",
  "Ikosaeder · 20 Flächen": "Icosahedron · 20 faces",
  "Körperart und Maße bleiben im ersten Timeline-Schritt änderbar. Ein späterer Wechsel der Körperart kann Flächenbezüge verlieren.": "Solid type and dimensions remain editable in the first timeline step. Changing the solid type later may invalidate face references.",
  "Projekt anlegen": "Create project",
  "Schließen": "Close",
  "Verbindung wird aufgebaut …": "Connecting …",
  "Projektname": "Project name",
  "Zum Beispiel: Henkelstudie": "For example: handle study",
  "Als neues Projekt speichern": "Save as new project",
  "Modell wird berechnet … Bitte warten.": "Calculating model … Please wait.",
  "Prisma": "Prism",
  "Tetraeder": "Tetrahedron",
  "Oktaeder": "Octahedron",
  "Ikosaeder": "Icosahedron",
  "Dodekaeder": "Dodecahedron",
  "Fußball": "Soccer ball",
  "an": "on",
  "aus": "off",
  "Sprache": "Language",
  "Sprache der Oberfläche": "Interface language",
  "Fläche ist degeneriert.": "Face is degenerate.",
  "{0}: erlaubt sind 0,01 bis {1}.": "{0}: allowed range is 0.01 to {1}.",
  "Extrusionslänge: erlaubt sind −1000 bis −0,01 oder 0,01 bis 1000. Positiv = außen, negativ = innen.": "Extrusion length: allowed ranges are −1000 to −0.01 or 0.01 to 1000. Positive = outward, negative = inward.",
  "Prisma: Seitenzahl muss ganzzahlig zwischen 3 und 128 liegen.": "Prism: the number of sides must be an integer from 3 to 128.",
  "Umfangssegmente: ganze Zahl von 3 bis 128.": "Circumferential segments: integer from 3 to 128.",
  "Querschnitts-/Höhenabschnitte: ganze Zahl von {0} bis 128.": "Cross-section/height divisions: integer from {0} to 128.",
  "Torus: Rohr-Radius muss kleiner als Ringradius sein, damit die Öffnung frei bleibt.": "Torus: tube radius must be smaller than the major radius to keep the opening clear.",
  "Unbekannter Grundkörper.": "Unknown base solid.",
  "Bezugsfläche fehlt. Fläche neu zuordnen oder vorherigen Schritt aktivieren.": "Reference face missing. Reassign the face or enable the previous step.",
  "Ungültige Flächengruppe für Extrusion.": "Invalid face group for extrusion.",
  "Extrusion benötigt eindeutige Flächen (maximal 32.000).": "Extrusion requires unique faces (maximum 32,000).",
  "Extrusionsfläche fehlt. Gruppe vor diesem Schritt neu auswählen und zuordnen.": "Extrusion face missing. Reselect and reassign the group before this step.",
  "Gruppenextrusion überschreitet 32.000 Flächen oder 64.000 Punkte.": "Group extrusion exceeds 32,000 faces or 64,000 vertices.",
  "Regionsextrusion: eine Richtung X/Y/Z ungleich null angeben (±1000).": "Region extrusion: enter a nonzero X/Y/Z direction (±1000).",
  "Keine gemeinsame Extrusionsrichtung. Eine offene Flächenregion auswählen.": "No common extrusion direction. Select an open face region.",
  "Extrusionsfläche fehlt. Region vor diesem Schritt neu zuordnen.": "Extrusion face missing. Reassign the region before this step.",
  "Regionsextrusion benötigt über Kanten zusammenhängende Flächen.": "Region extrusion requires faces connected through edges.",
  "Extrusionsrichtung muss aus allen ausgewählten Flächen herauszeigen. Region verkleinern oder Richtung ändern.": "The extrusion direction must point outward from every selected face. Reduce the region or change the direction.",
  "Regionsextrusion benötigt einen offenen Rand.": "Region extrusion requires an open boundary.",
  "Regionsrand verzweigt sich oder berührt sich an einem Punkt. Auswahl ändern.": "The region boundary branches or touches itself at a point. Change the selection.",
  "Regionsextrusion überschreitet 32.000 Flächen oder 64.000 Punkte.": "Region extrusion exceeds 32,000 faces or 64,000 vertices.",
  "Kollision der Regionspunkte.": "Region vertex ID collision.",
  "Kollision der Regionsflächen.": "Region face ID collision.",
  "Eine gültige eindeutige Auswahl für Trennen/Löschen angeben.": "Provide a valid unique selection for splitting/deleting.",
  "Bezugspunkt des Körperteils fehlt. Auswahl neu zuordnen.": "Part reference vertex missing. Reassign the selection.",
  "Kein zusammenhängender Körperteil ausgewählt.": "No connected part selected.",
  "Mindestens ein Körperteil muss erhalten bleiben. Zuerst trennen oder die Auswahl verkleinern.": "At least one part must remain. Split first or reduce the selection.",
  "Fläche des Trennrings fehlt. Ring vor dem Schritt neu zuordnen.": "Split ring face missing. Reassign the ring before this step.",
  "Den Flächenring auf genau einem Körper auswählen. Andere Körper werden unverändert erhalten.": "Select the face ring on exactly one solid. Other solids remain unchanged.",
  "Mindestens eine Fläche des betroffenen Körpers muss erhalten bleiben.": "At least one face of the affected solid must remain.",
  "Die Teile berühren sich noch an Punkten. Einen vollständigen Flächenstreifen auswählen.": "The parts still touch at vertices. Select a complete strip of faces.",
  "Trennrand verzweigt sich. Vollständigen Flächenring auswählen.": "Split boundary branches. Select a complete face ring.",
  "Kein geschlossener Schnittendrand gefunden.": "No closed cut-end boundary found.",
  "Ungültiger Schnittendrand.": "Invalid cut-end boundary.",
  "Schnittende ist degeneriert.": "Cut end is degenerate.",
  "Schnittenden müssen eben sein. Anderen Flächenring wählen.": "Cut ends must be planar. Choose another face ring.",
  "Schnittenden müssen konvex sein.": "Cut ends must be convex.",
  "Kollision der Schnittflächenreferenzen.": "Cut face reference collision.",
  "Trennen überschreitet 32.000 Flächen.": "Splitting exceeds 32,000 faces.",
  "Skalierung: erlaubt sind Faktoren von 0,05 bis 10.": "Scale: allowed factors are 0.05 to 10.",
  "Drehwinkel: erlaubt sind −180 bis 180 Grad.": "Rotation: allowed range is −180 to 180 degrees.",
  "Zwei unterschiedliche Flächen auswählen.": "Select two different faces.",
  "Bezugsfläche der Brücke fehlt. Das Flächenpaar neu zuordnen.": "Bridge reference face missing. Reassign the face pair.",
  "Gerade Brücken benötigen zwei Dreiecke oder zwei Vierecke. Unterschiedliche Eckenzahlen werden noch nicht unterstützt.": "Straight bridges require two triangles or two quads. Different corner counts are not supported for this type.",
  "Die Flächen dürfen keine gemeinsamen Eckpunkte besitzen.": "The faces must not share vertices.",
  "Die Flächen liegen zu dicht beieinander.": "The faces are too close together.",
  "Die Flächen müssen mit ihren Außenseiten annähernd parallel zueinander zeigen. Seitlicher Versatz ist erlaubt.": "The outer sides must face each other approximately in parallel. Lateral offsets are allowed.",
  "Die Flächenebenen müssen mit positivem Abstand aufeinander zu zeigen. Koplanare oder voneinander wegzeigende Flächen sind nicht geeignet.": "The face planes must face each other with positive separation. Coplanar faces or faces pointing away from each other are unsuitable.",
  "Gemischte Brücken benötigen ein Dreieck und ein Viereck.": "Mixed bridges require one triangle and one quad.",
  "Schnittfläche ist entartet und lässt sich nicht triangulieren.": "Cut face is degenerate and cannot be triangulated.",
  "Fläche zu komplex für automatische Triangulierung.": "Face too complex for automatic triangulation.",
  "Schnittfläche überschneidet sich in der Projektion.": "Cut face intersects itself in projection.",
  "Fläche lässt sich nicht eindeutig triangulieren.": "Face cannot be triangulated unambiguously.",
  "Triangulierung erzeugt eine entartete Fläche.": "Triangulation creates a degenerate face.",
  "Volumenschnitt zu komplex. Gröberes Netz oder einfacheren Schnitt verwenden.": "Solid cut too complex. Use a coarser mesh or a simpler cut.",
  "Volumenschnitt benötigt ein einfacheres Netz.": "Solid cut requires a simpler mesh.",
  "Volumenschnitt: degenerierte Fläche.": "Solid cut: degenerate face.",
  "Volumenschnitt benötigt ebene Flächen. Nicht ebene Flächen vorher triangulieren.": "Solid cut requires planar faces. Triangulate nonplanar faces first.",
  "Fläche lässt sich nicht eindeutig triangulieren. Schnitt nicht angewendet.": "Face cannot be triangulated unambiguously. Cut not applied.",
  "Der Schnitt würde das ganze Modell entfernen.": "The cut would remove the entire model.",
  "Volumenschnitt überschreitet 32.000 Flächen.": "Solid cut exceeds 32,000 faces.",
  "Kollision der Schnittpunkte.": "Cut vertex ID collision.",
  "Schnittnetz zu komplex für sichere Kantenverbindung.": "Cut mesh too complex for safe edge stitching.",
  "Schnitt erzeugt einen mehrdeutigen Rand. Position oder Lochgröße leicht ändern.": "Cut creates an ambiguous boundary. Adjust the position or hole size slightly.",
  "Loch stanzen: höchstens 128 Startflächen pro Schritt wählen.": "Punch holes: select no more than 128 source faces per step.",
  "Stanzfläche fehlt. Startflächen vor dem Schritt neu zuordnen.": "Punch face missing. Reassign source faces before this step.",
  "Loch stanzen benötigt nicht entartete Flächen.": "Hole punching requires nondegenerate faces.",
  "Startfläche benötigt 3–16 Ecken.": "Source face requires 3–16 corners.",
  "Startfläche muss konvex sein.": "Source face must be convex.",
  "Keine gegenüberliegende Fläche gefunden.": "No opposite face found.",
  "Keine eindeutige passende Gegenfläche: mehrere Innenstrahlen, ähnliche Kontur und höchstens 25° Neigungsabweichung erforderlich.": "No unambiguous suitable opposite face: multiple internal rays, a similar outline and at most 25° tilt difference are required.",
  "Die ganze Fläche würde den gesamten betroffenen Körper entfernen. Eine kleinere Teilfläche wählen.": "The entire face would remove the whole affected solid. Choose a smaller partial face.",
  "Überlappende Stanzziele. Diese Flächen einzeln stanzen.": "Overlapping punch targets. Punch these faces individually.",
  "Stanzenden dürfen keine gemeinsamen Punkte haben.": "Punch ends must not share vertices.",
  "Stanzkontur klappt um. Andere Flächen wählen.": "Punch outline folds over. Choose other faces.",
  "Stanzung überschreitet 32.000 Flächen.": "Hole punching exceeds 32,000 faces.",
  "Loch stanzen: ": "Punch holes: ",
  "Lochgröße: 0,05–0,95.": "Hole size: 0.05–0.95.",
  "Zwei unterschiedliche Durchbruchsflächen wählen.": "Choose two different through-hole faces.",
  "Durchbruchsfläche fehlt. Flächenpaar neu zuordnen.": "Through-hole face missing. Reassign the face pair.",
  "Durchbruchsflächen mit 3–16 Ecken wählen.": "Choose through-hole faces with 3–16 corners.",
  "Die Außenflächen müssen den Durchbruch nach innen begrenzen.": "The outer faces must bound the through-hole toward the interior.",
  "Schnittseite: positive, negative oder both.": "Cut side: positive, negative or both.",
  "Schnittebene: endliche Werte zwischen -1000 und 1000 angeben.": "Cutting plane: enter finite values between -1000 and 1000.",
  "Schnittrichtung darf nicht Null sein.": "Cut direction must not be zero.",
  "Beidseitiger Schnitt überschreitet die Netzgrenzen.": "Two-sided cut exceeds mesh limits.",
  "Die Schnittebene würde das ganze Modell entfernen.": "The cutting plane would remove the entire model.",
  "Die Schnittebene trifft das Modell nicht.": "The cutting plane does not intersect the model.",
  "Lochgröße: Faktor 0,05 bis 0,95 angeben.": "Hole size: enter a factor from 0.05 to 0.95.",
  "Durchbruch: Zuordnung 0–3 angeben.": "Through-hole: enter mapping 0–3.",
  "Zwei unterschiedliche Durchbruchsflächen auswählen.": "Select two different through-hole faces.",
  "Durchbruchsfläche fehlt. Vor dem Schritt neu zuordnen.": "Through-hole face missing. Reassign it before this step.",
  "Durchbruch benötigt zwei Vierecke ohne gemeinsame Eckpunkte.": "Through-hole requires two quads without shared vertices.",
  "Durchbruch benötigt gegenüberliegende parallele Außenflächen durch den Körper.": "Through-hole requires opposite parallel outer faces across the solid.",
  "Durchbruch benötigt eine zusammenhängende konvexe Außenhülle.": "Through-hole requires a connected convex outer hull.",
  "Durchbruch unterstützt zunächst konvexe Außenhüllen mit ebenen Flächen.": "This through-hole type supports convex outer hulls with planar faces.",
  "Durchbruch überschreitet 32.000 Flächen oder 64.000 Punkte.": "Through-hole exceeds 32,000 faces or 64,000 vertices.",
  "Kollision der Durchbruchsreferenzen.": "Through-hole reference collision.",
  "Durchbruch-Zuordnung klappt um. Andere Zuordnung wählen.": "Through-hole mapping folds over. Choose another mapping.",
  "Durchbruch: Zuordnung 0–15 angeben.": "Through-hole: enter mapping 0–15.",
  "Durchbruch unterstützt Flächen mit 3–16 Ecken.": "Through-hole supports faces with 3–16 corners.",
  "Zuordnung passt nicht zur zweiten Fläche.": "Mapping does not match the second face.",
  "Die Flächen müssen einen Innenraum zwischen sich einschließen.": "The faces must enclose an interior between them.",
  "Durchbruch hat eine degenerierte Querschnittsecke.": "Through-hole has a degenerate cross-section corner.",
  "Durchbruch-Zuordnung lässt den Tunnel zusammenfallen oder umklappen. Andere Zuordnung wählen.": "Through-hole mapping makes the tunnel collapse or fold over. Choose another mapping.",
  "Durchbruch-Zuordnung klappt eine Tunnelwand um. Andere Zuordnung wählen.": "Through-hole mapping folds a tunnel wall over. Choose another mapping.",
  "Keine stabile Tunnelwand für diese Zuordnung. Andere Zuordnung oder kleinere Lochgröße wählen.": "No stable tunnel wall for this mapping. Choose another mapping or a smaller hole size.",
  "Kein stabiler Durchbruch möglich: ebene konvexe Flächen einer konvexen Außenhülle auswählen.": "No stable through-hole possible: select planar convex faces of a convex outer hull.",
  "Kein gerader Durchbruch möglich: zwei gegenüberliegende Vierecke einer konvexen Außenhülle auswählen.": "No straight through-hole possible: select two opposite quads of a convex outer hull.",
  "Gemischte Brücke: Zuordnung 0–3 angeben.": "Mixed bridge: enter mapping 0–3.",
  "Gemischte Brücke überschreitet 32.000 Flächen.": "Mixed bridge exceeds 32,000 faces.",
  "Keine stabile Dreieck–Viereck-Zuordnung. Andere Zuordnung oder Endflächen wählen.": "No stable triangle–quad mapping. Choose another mapping or end faces.",
  "Keine stabile gerade Brücke zwischen diesen Flächen gefunden.": "No stable straight bridge found between these faces.",
  "Der Brückentyp passt nicht zu den Endflächen. Das Flächenpaar neu zuordnen.": "Bridge type does not match the end faces. Reassign the face pair.",
  "Eckpunkt-Zuordnung 0–{0} und Segmente 1–16 angeben.": "Enter vertex mapping 0–{0} and 1–16 segments.",
  "Diese Eckpunkt-Zuordnung lässt die Brücke zusammenfallen oder umklappen. Andere Zuordnung wählen.": "This vertex mapping makes the bridge collapse or fold over. Choose another mapping.",
  "Die Brücke würde mit einer vorhandenen Fläche zusammenfallen. Weiter außen liegende Armsegmente auswählen.": "The bridge would coincide with an existing face. Select arm segments farther outward.",
  "Brückenwand: Dreiecke oder Vierecke wählen.": "Bridge walls: choose triangles or quads.",
  "Gekrümmte Brücke: Zuordnung 0–{0} und Segmente 3–32 angeben.": "Curved bridge: enter mapping 0–{0} and 3–32 segments.",
  "Krümmung A/B: erlaubt sind Faktoren von 0,05 bis 2.": "Curvature A/B: allowed factors are 0.05 to 2.",
  "Kurvenmitte: drei endliche Faktoren zwischen −4 und 4 angeben.": "Curve center: enter three finite factors between −4 and 4.",
  "Verdrehung: -180 bis 180 Grad angeben.": "Twist: enter -180 to 180 degrees.",
  "Bis zu drei zusätzliche Pfadpunkte mit X/Y/Z-Faktoren von -4 bis 4 angeben.": "Enter up to three extra path points with X/Y/Z factors from -4 to 4.",
  "Kurvenverlauf oder Querschnitt ist degeneriert. Krümmung oder Flächenpaar ändern.": "Curve path or cross-section is degenerate. Change the curvature or face pair.",
  "Gemischte Kurve benötigt ein getrenntes Dreieck und Viereck.": "Mixed curve requires a separate triangle and quad.",
  "Kollision der gemischten Kurvenpunkte.": "Mixed curve vertex ID collision.",
  "Gemischter Kurvenrand ist degeneriert.": "Mixed curve boundary is degenerate.",
  "Gekrümmte Brücken benötigen zwei ebene, konvexe Dreiecke oder zwei Vierecke. Unterschiedliche Eckenzahlen werden noch nicht unterstützt.": "Curved bridges require two planar convex triangles or two quads. Different corner counts are not supported for this type.",
  "Gekrümmte Brücken benötigen ebene Endflächen. Andere Flächen wählen.": "Curved bridges require planar end faces. Choose other faces.",
  "Endflächen müssen konvexe, nicht zusammengefallene Dreiecke oder Vierecke sein.": "End faces must be convex, noncollapsed triangles or quads.",
  "Ungültige Ansicht für die Kurvenbearbeitung.": "Invalid view for curve editing.",
  "Pfadpunkt fehlt.": "Path point missing.",
  "Unbekannter Kurvengriff.": "Unknown curve handle.",
  "Gemischte Kurve benötigt einen eigenen Brückenschritt.": "Mixed curve requires its own bridge step.",
  "Gemischte Kurve benötigt Dreieck und Viereck.": "Mixed curve requires a triangle and a quad.",
  "Kurve hat einen Stillstand oder eine Spitze. Krümmung oder Flächenpaar ändern.": "Curve has a stationary point or cusp. Change the curvature or face pair.",
  "Kurve knickt um oder hat eine Spitze. Krümmung oder Flächenpaar ändern.": "Curve folds back or has a cusp. Change the curvature or face pair.",
  "Querschnitt fällt zusammen. Andere Eckpunkt-Zuordnung wählen.": "Cross-section collapses. Choose another vertex mapping.",
  "Krümmung ist für diesen Querschnitt zu eng. Krümmung A/B oder Endflächen ändern.": "Curvature is too tight for this cross-section. Change curvature A/B or end faces.",
  "Brückensegmente klappen um. Mehr Segmente oder andere Krümmung/Zuordnung wählen.": "Bridge segments fold over. Use more segments or a different curvature/mapping.",
  "Gemischte Kurve überschreitet 32.000 Flächen oder 64.000 Punkte.": "Mixed curve exceeds 32,000 faces or 64,000 vertices.",
  "Automatische Brückensuche abgebrochen.": "Automatic bridge search canceled.",
  "Im geprüften Bereich wurde kein gültiger Verlauf gefunden. Endflächen verkleinern, andere Flächen wählen oder die Krümmung manuell ändern.": "No valid path found in the tested range. Reduce end-face size, choose other faces or adjust curvature manually.",
  "Manuelle Reparatur: höchstens 128 Flächen entfernen.": "Manual repair: remove no more than 128 faces.",
  "Manuelle Reparatur: bis 32 neue Flächen mit jeweils 3–32 unterschiedlichen Eckpunkten.": "Manual repair: up to 32 new faces, each with 3–32 unique vertices.",
  "Entfernte Bezugsfläche fehlt. Reparatur neu bearbeiten.": "Removed reference face missing. Edit the repair again.",
  "Mindestens eine bestehende Fläche erhalten; zum Rückholen letzten Eingriff zurücknehmen.": "Keep at least one existing face; use Undo last repair to restore it.",
  "Eckpunkt der neuen Fläche fehlt. Reparatur neu bearbeiten.": "New face vertex missing. Edit the repair again.",
  "Eine Fläche mit diesen Eckpunkten existiert bereits.": "A face with these vertices already exists.",
  "Diese Kante hat bereits zwei Flächen. Nur offene Ränder verbinden.": "This edge already has two faces. Connect only open boundaries.",
  "Die neue Fläche muss mindestens eine vorhandene offene Randkante verwenden.": "The new face must use at least one existing open boundary edge.",
  "Eckpunktreihenfolge passt nicht zu den offenen Rändern. Punkte entlang der Fläche wählen.": "Vertex order does not match the open boundaries. Select points in order around the face.",
  "Neue Fläche ist entartet.": "New face is degenerate.",
  "Neue Fläche existiert bereits.": "New face already exists.",
  "Reparatur überschreitet 32.000 Flächen.": "Repair exceeds 32,000 faces.",
  "Reparatur erzeugt nur punktweise verbundene Flächenfächer.": "Repair creates face fans connected only at vertices.",
  "Triangulierungsfläche fehlt. Auswahl vor dem Schritt neu zuordnen.": "Triangulation face missing. Reassign the selection before this step.",
  "Triangulierung überschreitet 32.000 Flächen.": "Triangulation exceeds 32,000 faces.",
  "Kollision der Triangulierungsreferenzen.": "Triangulation reference collision.",
  "Loop: erlaubt sind 1 oder 2 Stufen.": "Loop: 1 or 2 levels allowed.",
  "Loop benötigt ein reines Dreiecksnetz. Zuerst das gesamte Modell triangulieren.": "Loop requires a triangle-only mesh. Triangulate the entire model first.",
  "Loop überschreitet 32.000 Flächen. Stufe reduzieren.": "Loop exceeds 32,000 faces. Reduce the level count.",
  "Loop benötigt ein Netz ohne isolierte Punkte.": "Loop requires a mesh without isolated vertices.",
  "Loop überschreitet 64.000 Punkte.": "Loop exceeds 64,000 vertices.",
  "Kollision der Loop-Referenzen.": "Loop reference collision.",
  "Loop benötigt geschlossene zusammenhängende Flächenfächer ohne berührende Punkte.": "Loop requires closed connected face fans without vertex-only contacts.",
  "Subdivision: erlaubt sind 1 oder 2 Stufen.": "Subdivision: 1 or 2 levels allowed.",
  "Subdivision überschreitet die Grenze von {0} Flächen. Stufe reduzieren oder früheren Schritt unterdrücken.": "Subdivision exceeds the limit of {0} faces. Reduce levels or suppress an earlier step.",
  "Kollision der Subdivision-Referenzen.": "Subdivision reference collision.",
  "Subdivision benötigt geschlossene Mannigfaltigkeiten ohne isolierte oder berührende Fächer.": "Subdivision requires closed manifolds without isolated or touching face fans.",
  "Subdivision: mehrere Flächenfächer berühren denselben Punkt.": "Subdivision: multiple face fans touch the same vertex.",
  "Honeycomb: erlaubt sind 1 oder 2 Stufen.": "Honeycomb: 1 or 2 levels allowed.",
  "Kollision der Honeycomb-Referenzen.": "Honeycomb reference collision.",
  "Honeycomb überschreitet 32.000 Flächen oder 64.000 Punkte. Stufe reduzieren.": "Honeycomb exceeds 32,000 faces or 64,000 vertices. Reduce levels.",
  "Honeycomb benötigt ein Netz ohne isolierte Punkte.": "Honeycomb requires a mesh without isolated vertices.",
  "Honeycomb benötigt geschlossene zusammenhängende Flächenfächer ohne berührende Punkte.": "Honeycomb requires closed connected face fans without vertex-only contacts.",
  "Doo-Sabin: erlaubt sind 1 oder 2 Stufen.": "Doo-Sabin: 1 or 2 levels allowed.",
  "Kollision der Doo-Sabin-Referenzen.": "Doo-Sabin reference collision.",
  "Doo-Sabin überschreitet die Grenze von {0} Flächen. Stufe reduzieren oder früheren Schritt unterdrücken.": "Doo-Sabin exceeds the limit of {0} faces. Reduce levels or suppress an earlier step.",
  "Doo-Sabin benötigt geschlossene, zusammenhängende Flächenfächer ohne berührende Punkte.": "Doo-Sabin requires closed connected face fans without vertex-only contacts.",
  "Dualnetz: Größenfaktor von 0,1 bis 4 angeben.": "Dual mesh: enter a scale from 0.1 to 4.",
  "Kollision der Dualnetz-Referenzen.": "Dual mesh reference collision.",
  "Dualnetz benötigt ein nicht leeres, geschlossenes Netz.": "Dual mesh requires a nonempty closed mesh.",
  "Dualnetz: isolierte Punkte entfernen.": "Dual mesh: remove isolated vertices.",
  "Dualnetz überschreitet die Grenze von {0} Punkten oder Flächen.": "Dual mesh exceeds the limit of {0} vertices or faces.",
  "Dualnetz benötigt geschlossene, zusammenhängende Flächenfächer ohne berührende Punkte.": "Dual mesh requires closed connected face fans without vertex-only contacts.",
  "Wandstärke: erlaubt sind 0,0001 bis 1000.": "Wall thickness: allowed range is 0.0001 to 1000.",
  "Schale: null bis zwei unterschiedliche Öffnungsflächen angeben.": "Shell: specify zero to two different opening faces.",
  "Schale: widersprüchliche Ecknormalen. Netz glätten oder vereinfachen.": "Shell: inconsistent vertex normals. Smooth or simplify the mesh.",
  "Schale: Ecke lässt keinen stabilen Innenversatz zu. Netz glätten oder vereinfachen.": "Shell: corner does not allow a stable inward offset. Smooth or simplify the mesh.",
  "Schale: Eckversatz ist zu groß. Netz glätten oder vereinfachen.": "Shell: corner offset too large. Smooth or simplify the mesh.",
  "Schale benötigt eine zusammenhängende geschlossene Außenhülle.": "Shell requires a connected closed outer hull.",
  "Öffnungsfläche fehlt. Öffnungen vor dem Schalenschritt neu auswählen und zuordnen.": "Opening face missing. Reselect and reassign openings before the shell step.",
  "Öffnungen dürfen sich nur entlang gemeinsamer Kanten verbinden, nicht nur an einem Punkt berühren.": "Openings may connect along shared edges, but must not touch only at a vertex.",
  "Schale überschreitet die Grenze von 32.000 Flächen oder 64.000 Punkten.": "Shell exceeds the limit of 32,000 faces or 64,000 vertices.",
  "Kollision der Schalen-Referenzen.": "Shell reference collision.",
  "Schale benötigt geschlossene, zusammenhängende Flächenfächer ohne berührende Punkte.": "Shell requires closed connected face fans without vertex-only contacts.",
  "Wandstärke ist für lokale Kanten zu groß. Dicke reduzieren oder gröberes Netz verwenden.": "Wall thickness is too large for local edges. Reduce thickness or use a coarser mesh.",
  "Innenhülle klappt um. Wandstärke reduzieren.": "Inner shell folds over. Reduce wall thickness.",
  "Innenkante fällt zusammen oder klappt um. Wandstärke reduzieren.": "Inner edge collapses or folds over. Reduce wall thickness.",
  "Schale benötigt eine nach außen orientierte Hülle mit gültigem Innenraum. Wandstärke oder Netz prüfen.": "Shell requires an outward-oriented hull with a valid interior. Check wall thickness or mesh.",
  "Fasenbreite: erlaubt sind 0,0001 bis 1000.": "Bevel width: allowed range is 0.0001 to 1000.",
  "Bevel benötigt eine zusammenhängende konvexe Außenhülle.": "Bevel requires a connected convex outer hull.",
  "Bevel unterstützt zunächst ebene Flächen einer konvexen Außenhülle. Vor dem Glätten anwenden.": "Bevel supports planar faces of a convex outer hull. Apply before smoothing.",
  "Fasenkante fehlt. Vor dem Schritt auswählen und neu zuordnen.": "Bevel edge missing. Reselect and reassign it before this step.",
  "Bevel benötigt eine räumliche Kante zwischen zwei unterschiedlichen Flächen.": "Bevel requires a spatial edge between two distinct faces.",
  "Kollision der Fasenreferenzen.": "Bevel reference collision.",
  "Fase fällt zusammen. Breite reduzieren.": "Bevel collapses. Reduce width.",
  "Fasenbreite entfernt eine ganze Fläche. Breite reduzieren.": "Bevel width removes an entire face. Reduce width.",
  "Fasenkanten überlappen oder Fase fällt zusammen. Breite reduzieren.": "Bevel edges overlap or bevel collapses. Reduce width.",
  "Bevel überschreitet 32.000 Flächen oder 64.000 Punkte.": "Bevel exceeds 32,000 faces or 64,000 vertices.",
  "Unterteilungsfläche fehlt. Vor dem Schritt Flächen auswählen und neu zuordnen.": "Subdivision face missing. Reselect and reassign faces before this step.",
  "Lokale Unterteilung überschreitet 32.000 Flächen oder 64.000 Punkte.": "Local subdivision exceeds 32,000 faces or 64,000 vertices.",
  "Kollision der lokalen Unterteilungsreferenzen.": "Local subdivision reference collision.",
  "Nachbarfläche hat keine stabile Orientierung.": "Neighboring face has no stable orientation.",
  "Kanten auflösen: 1–32 unterschiedliche Bezugskanten angeben.": "Dissolve edges: specify 1–32 different reference edges.",
  "Bezugskante fehlt. Kanten vor dem Schritt neu auswählen.": "Reference edge missing. Reselect edges before this step.",
  "Kanten auflösen: angrenzende Flächen müssen in derselben Ebene liegen.": "Dissolve edges: adjacent faces must lie in the same plane.",
  "Alle inneren Kanten der zusammengeführten Fläche auswählen.": "Select all internal edges of the merged face.",
  "Kanten auflösen: ein einfacher Rand mit 3–256 Punkten ist erforderlich.": "Dissolve edges: a simple boundary with 3–256 vertices is required.",
  "Kanten auflösen: verzweigter Rand ist nicht möglich.": "Dissolve edges: branching boundaries are not supported.",
  "Kanten auflösen: ungültiger Rand.": "Dissolve edges: invalid boundary.",
  "Kanten auflösen: Flächen mit Löchern oder mehreren Rändern sind nicht möglich.": "Dissolve edges: faces with holes or multiple boundaries are not supported.",
  "Kanten auflösen: Rand berührt oder überschneidet sich selbst.": "Dissolve edges: boundary touches or intersects itself.",
  "Kanten auflösen: Fläche ist entartet.": "Dissolve edges: face is degenerate.",
  "Kollision der Flächenreferenzen.": "Face reference collision.",
  "Kantenunterteilung: 2–16 Abschnitte angeben.": "Edge subdivision: specify 2–16 divisions.",
  "Kantenunterteilung: 1–32 unterschiedliche Kanten angeben.": "Edge subdivision: specify 1–32 different edges.",
  "Bezugskante fehlt. Vor dem Schritt Kanten auswählen und neu zuordnen.": "Reference edge missing. Reselect and reassign edges before this step.",
  "Kantenunterteilung überschreitet 64.000 Punkte oder 32.000 Flächen.": "Edge subdivision exceeds 64,000 vertices or 32,000 faces.",
  "Kollision der Kantenpunkt-Referenzen.": "Edge vertex reference collision.",
  "Punktverschiebung: 1–32 unterschiedliche Punkte angeben.": "Move vertices: specify 1–32 different vertices.",
  "Punktversatz X/Y/Z: erlaubt sind -1000 bis 1000.": "Vertex offset X/Y/Z: allowed range is -1000 to 1000.",
  "Bezugspunkt fehlt. Vor dem Schritt Punkte auswählen und neu zuordnen.": "Reference vertex missing. Reselect and reassign vertices before this step.",
  "Punktverschiebung lässt eine Kante zusammenfallen. Versatz ändern.": "Moving vertices collapses an edge. Change the offset.",
  "Schnittstärke: Faktor 0,01 bis 0,49 angeben.": "Cut amount: enter a factor from 0.01 to 0.49.",
  "Kollision der Schnitt-Referenzen.": "Truncation reference collision.",
  "Abschneiden benötigt ein geschlossenes Netz ohne isolierte Punkte.": "Truncation requires a closed mesh without isolated vertices.",
  "Abschneiden überschreitet 32.000 Flächen oder 64.000 Punkte.": "Truncation exceeds 32,000 faces or 64,000 vertices.",
  "Abschneiden benötigt zusammenhängende geschlossene Flächenfächer an jeder Ecke.": "Truncation requires connected closed face fans at every corner.",
  "Lokales Abschneiden: 1–32 unterschiedliche Punkte angeben.": "Local truncation: specify 1–32 different vertices.",
  "Schnittecke fehlt. Vor dem Schritt Punkte auswählen und neu zuordnen.": "Truncation vertex missing. Reselect and reassign vertices before this step.",
  "Spitzenhöhe: erlaubt sind -1000 bis 1000.": "Peak height: allowed range is -1000 to 1000.",
  "Spitzen: 1–32 unterschiedliche Flächen angeben.": "Stellation: specify 1–32 different faces.",
  "Spitzenfläche fehlt. Vor dem Schritt auswählen und neu zuordnen.": "Stellation face missing. Reselect and reassign it before this step.",
  "Spitzen überschreiten 32.000 Flächen oder 64.000 Punkte.": "Stellation exceeds 32,000 faces or 64,000 vertices.",
  "Kollision der Spitzen-Referenzen.": "Stellation reference collision.",
  "Spitzen benötigen ebene, konvexe Ausgangsflächen. Vor dem Glätten anwenden.": "Stellation requires planar convex source faces. Apply before smoothing.",
  "Spitzen benötigen konvexe Flächen mit innenliegendem Mittelpunkt.": "Stellation requires convex faces with an interior center point.",
  "Strebenstärke: erlaubt sind 0,0001 bis 1000.": "Strut thickness: allowed range is 0.0001 to 1000.",
  "Drahtmodell überschreitet 32.000 Flächen oder 64.000 Punkte.": "Wire model exceeds 32,000 faces or 64,000 vertices.",
  "Kollision der Drahtmodell-Referenzen.": "Wire model reference collision.",
  "Drahtmodell benötigt ebene, konvexe Flächen. Drahtmodell vor dem Glätten anlegen.": "Wire model requires planar convex faces. Create it before smoothing.",
  "Drahtmodell benötigt konvexe Flächen.": "Wire model requires convex faces.",
  "Drahtmodell: zu spitze Flächenecke.": "Wire model: face corner too sharp.",
  "Strebenstärke zu groß: eine Öffnung fällt zusammen. Stärke reduzieren.": "Strut thickness too large: an opening collapses. Reduce thickness.",
  "Strebenstärke zu groß für diese Fläche.": "Strut thickness too large for this face.",
  "Öffnung: gültigen Schalenschritt angeben.": "Opening: specify a valid shell step.",
  "Öffnung: 1–32 unterschiedliche Außenflächen angeben.": "Opening: specify 1–32 different outer faces.",
  "Für eine Öffnung 1–32 Außenflächen auswählen.": "Select 1–32 outer faces for an opening.",
  "Außenflächen derselben Schale mit unveränderter Innenzuordnung auswählen. Öffnungen vor Glättung oder Remeshing anlegen.": "Select outer faces of the same shell with unchanged inner mapping. Create openings before smoothing or remeshing.",
  "Öffnungsbezug fehlt oder Außen-/Innenfläche wurde verändert. Flächengruppe vor dem Öffnungsschritt neu zuordnen.": "Opening reference missing or outer/inner face changed. Reassign the face group before the opening step.",
  "Öffnung: mehrdeutiger vorhandener Rand.": "Opening: ambiguous existing boundary.",
  "Öffnung: ungültige Flächengruppe.": "Opening: invalid face group.",
  "Kollision der Öffnungsreferenzen.": "Opening reference collision.",
  "Öffnungsgruppen dürfen sich nicht nur an einem Punkt berühren. Gruppe erweitern oder andere Flächen wählen.": "Opening groups must not touch only at a vertex. Expand the group or choose other faces.",
  "Mindestens eine gepaarte Wandfläche der Schale muss erhalten bleiben.": "At least one paired wall face of the shell must remain.",
  "Öffnung überschreitet die Grenze von 32.000 Flächen.": "Opening exceeds the limit of 32,000 faces.",
  "Ungültige Fläche.": "Invalid face.",
  "Ungültiger Punkt.": "Invalid vertex.",
  "Das Netz ist nicht geschlossen und konsistent orientiert.": "The mesh is not closed and consistently oriented.",
  "Nicht unterstütztes Projektformat.": "Unsupported project format.",
  "Erlaubt sind 1 bis 200 Schritte.": "1 to 200 steps allowed.",
  "Ungültige oder doppelte Schritt-ID.": "Invalid or duplicate step ID.",
  "Parameter fehlen.": "Parameters missing.",
  "Ungültiger Aktivierungsstatus.": "Invalid enabled status.",
  "Unbekannte oder falsch angeordnete Operation.": "Unknown or incorrectly ordered operation.",
  "Skalierung/Drehwinkel benötigen den geformten Extrusionsschritt extrude_shape.": "Scale/rotation require the shaped extrusion step extrude_shape.",
  "Flächenreferenz fehlt.": "Face reference missing.",
  "Zwei gemischte Kurvenbezüge angeben.": "Specify two mixed curve references.",
  "Zwei Durchbruchsbezüge angeben.": "Specify two through-hole references.",
  "Zwei unterschiedliche Durchbruchsbezüge angeben.": "Specify two different through-hole references.",
  "Zwei unterschiedliche Brückenbezüge angeben.": "Specify two different bridge references.",
  "Zusätzliche Pfadpunkte fehlen.": "Extra path points missing.",
  "Zusätzliche Pfadpunkte benötigen einen Mehrpunkt-Spline-Schritt.": "Extra path points require a multipoint spline step.",
  "Verdrehung benötigt einen eigenen Twist-Schritt.": "Twist requires its own twist step.",
  "Freie Kurvenmitte fehlt.": "Free curve center missing.",
  "Eine freie Kurvenmitte benötigt einen Spline-Brückenschritt.": "A free curve center requires a spline bridge step.",
  "Ungültige Brückenparameter.": "Invalid bridge parameters.",
  "Der Grundkörper muss aktiv bleiben.": "The base solid must remain enabled.",
  "Vorherigen Fehler beheben.": "Fix the previous error.",
  "Unbekannte Auswahlhilfe.": "Unknown selection helper.",
  "Vorher vorhandene Flächen auswählen.": "Select existing faces first.",
  "Koplanare Auswahl benötigt ebene Startflächen.": "Coplanar selection requires planar source faces.",
  "Flächenauswahl überschreitet 32.000 Flächen.": "Face selection exceeds 32,000 faces.",
  "Vorher vorhandene Kanten auswählen.": "Select existing edges first.",
  "Kantenring überschreitet die Auswahlgrenze von 32 Kanten. Auswahl bleibt unverändert.": "Edge ring exceeds the selection limit of 32 edges. Selection remains unchanged.",
  "Höchstens 32 Kanten auswählen.": "Select no more than 32 edges.",
  "Auswahlgrenze: 2–32000 Flächen angeben.": "Selection limit: specify 2–32000 faces.",
  "Am Flächenring trennen": "Split at face ring",
  "Zwei Flächen ausgewählt: gerade oder gekrümmte Brücke wählen.": "Two faces selected: choose a straight or curved bridge.",
  " · aktuell": " · current",
  "⌒ Gekrümmte Brücke": "⌒ Curved bridge",
  "Parameter sind zu tief verschachtelt.": "Parameters are nested too deeply.",
  "Ungültiger numerischer Parameter.": "Invalid numeric parameter.",
  "Nicht unterstützte Parameterstruktur.": "Unsupported parameter structure.",
  "Projektname muss 1 bis 100 Zeichen enthalten.": "Project name must contain 1 to 100 characters.",
  "Unbekanntes Projektformat.": "Unknown project format.",
  "Ungültiger Schritt.": "Invalid step.",
  "Ungültiger numerischer Parameter: {0}": "Invalid numeric parameter: {0}",
  "Ungültige Parameter für Kugel/Torus.": "Invalid sphere/torus parameters.",
  "Ungültiger Radius.": "Invalid radius.",
  "Ungültige Segmentzahl.": "Invalid segment count.",
  "Rohr-Radius muss kleiner als Ringradius sein.": "Tube radius must be smaller than the major radius.",
  "Ungültiges Prisma: Seitenzahl 3 bis 128.": "Invalid prism: side count must be 3 to 128.",
  "Ungültige Prismahöhe.": "Invalid prism height.",
  "Ungültiger Grundkörper.": "Invalid base solid.",
  "Ungültige Kantenlänge.": "Invalid edge length.",
  "Ungültige Bezugsfläche.": "Invalid reference face.",
  "Ungültige Flächenbezüge.": "Invalid face references.",
  "Ungültige Anwendungsversion.": "Invalid application version.",
  "Projekt nicht gefunden.": "Project not found.",
  "Kantolyx ist stark von TopMod und dessen topologischem Modellieransatz inspiriert.": "Kantolyx is strongly inspired by TopMod and its approach to topological modeling.",
  "TopMod – ursprüngliche Projektseite (Texas A&M University)": "TopMod – original project website (Texas A&M University)"
};
const uiEscape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const uiPatterns=Object.entries(ENGLISH_MESSAGES).filter(([key])=>/\{\d+\}/.test(key)).map(([key,value])=>{
  const indices=[];let last=0,pattern='';
  for(const match of key.matchAll(/\{(\d+)\}/g)){pattern+=uiEscape(key.slice(last,match.index))+'([\\s\\S]*?)';indices.push(Number(match[1]));last=match.index+match[0].length;}
  return {expression:new RegExp('^'+pattern+uiEscape(key.slice(last))+'$'),value,indices};
});
const uiSubstitute=(text,values)=>text.replace(/\{(\d+)\}/g,(_,index)=>String(values[Number(index)]??''));
function uiText(message,...values){
  if(Array.isArray(message)&&Object.hasOwn(message,'raw')){
    const key=message.reduce((text,part,index)=>text+(index?'{'+(index-1)+'}':'')+part,'');
    return uiSubstitute(uiLanguage==='en'?(ENGLISH_MESSAGES[key]??key):key,values);
  }
  const text=String(message??'');if(uiLanguage!=='en')return text;
  if(Object.hasOwn(ENGLISH_MESSAGES,text))return ENGLISH_MESSAGES[text];
  const trimmed=text.trim();if(trimmed!==text&&Object.hasOwn(ENGLISH_MESSAGES,trimmed))return text.slice(0,text.indexOf(trimmed))+ENGLISH_MESSAGES[trimmed]+text.slice(text.indexOf(trimmed)+trimmed.length);
  const symbol=/^([＋✂−／✎▣⇄⌒◈△⬡◇⊞◩↗▧]\s*)(.+)$/.exec(text);
  if(symbol)return symbol[1]+uiText(symbol[2]);
  for(const item of uiPatterns){const match=item.expression.exec(text);if(match){const args=[];item.indices.forEach((index,i)=>{args[index]=ENGLISH_MESSAGES[match[i+1]]??match[i+1];});return uiSubstitute(item.value,args);}}
  // Model errors can be prefixed by a user-facing operation name.
  for(const prefix of ['Keine passende Stanzfläche: ','Loch stanzen: ','Öffnen fehlgeschlagen: ']){
    if(text.startsWith(prefix))return ENGLISH_MESSAGES[prefix]+uiText(text.slice(prefix.length));
    const english=ENGLISH_MESSAGES[prefix];if(text.startsWith(english))return english+uiText(text.slice(english.length));
  }
  return text;
}
const uiStaticBindings=[];
function captureInterfaceText(node){
  if(!node)return;
  if(node.nodeType===3){if(node.nodeValue?.trim())uiStaticBindings.push({node,text:node.nodeValue});return;}
  if(node.nodeType!==1)return;
  if(['SCRIPT','STYLE'].includes(node.tagName)||node.id==='changelog-content')return;
  for(const attribute of ['title','aria-label','aria-description','placeholder'])if(node.hasAttribute(attribute))uiStaticBindings.push({node,attribute,text:node.getAttribute(attribute)});
  for(const child of node.childNodes)captureInterfaceText(child);
}
function translateInterfaceText(){
  for(const item of uiStaticBindings){const text=uiText(item.text);if(item.attribute)item.node.setAttribute(item.attribute,text);else item.node.nodeValue=text;}
  if(document.documentElement)document.documentElement.lang=uiLanguage;
}
captureInterfaceText(document.documentElement);translateInterfaceText();
const $=id=>document.getElementById(id);
const isStraight=s=>['quad_bridge','bridge','triangle_bridge'].includes(s.type);
const isCurve=s=>['mixed_curve_bridge','curved_bridge','spline_bridge','triangle_curved_bridge','triangle_spline_bridge','multi_spline_bridge','triangle_multi_spline_bridge','twist_spline_bridge','triangle_twist_spline_bridge'].includes(s.type);
const isTriangleCurve=s=>['triangle_curved_bridge','triangle_spline_bridge','triangle_multi_spline_bridge','triangle_twist_spline_bridge'].includes(s.type);
const curveType=(params,corners)=>corners===12?'mixed_curve_bridge':params.twist?(corners===3?'triangle_twist_spline_bridge':'twist_spline_bridge'):params.pathPoints?.length?(corners===3?'triangle_multi_spline_bridge':'multi_spline_bridge'):corners===3?(params.bow?.some(v=>v!==0)?'triangle_spline_bridge':'triangle_curved_bridge'):(params.bow?.some(v=>v!==0)?'spline_bridge':'curved_bridge');
const stepName=s=>s.type==='manual_patch'?uiText('Manuelle Reparatur'):s.type==='loop'?uiText('Loop-Subdivision'):s.type==='triangulate_faces'?uiText('Triangulieren'):s.type==='punch_faces'?uiText('Loch stanzen'):s.type==='honeycomb'?'Honeycomb':s.type==='quad_bridge'?uiText('Brücke'):s.type==='extrude_region'?uiText('Region extrudieren'):s.type==='dissolve_edges'?uiText('Kanten auflösen'):s.type==='mixed_curve_bridge'?uiText('Dreieck–Viereck-Spline'):s.type==='twist_spline_bridge'?uiText('Verdrehte Spline-Brücke'):s.type==='triangle_twist_spline_bridge'?uiText('Verdrehte Dreiecks-Spline'):s.type==='multi_spline_bridge'?uiText('Mehrpunkt-Spline'):s.type==='triangle_multi_spline_bridge'?uiText('Dreiecks-Mehrpunkt-Spline'):s.type==='plane_cut'?uiText('Ebenenschnitt'):s.type==='boolean_tunnel'?uiText('Durchbruch (Volumenschnitt)'):s.type==='split_face_band'?uiText('Am Ring trennen'):s.type==='remove_parts'?uiText('Teil löschen'):s.type==='extrude_group'?uiText('Flächen extrudieren'):s.type==='cube'?uiText('Quader'):s.type==='primitive'?uiText(PRIMITIVE_NAMES[s.params.kind]):['tunnel','tunnel_general'].includes(s.type)?uiText('Durchbruch'):s.type==='mixed_bridge'?uiText('Dreieck–Viereck-Brücke'):s.type==='triangle_bridge'?uiText('Dreiecksbrücke'):s.type==='bridge'?uiText('Brücke'):isCurve(s)?(isTriangleCurve(s)?(s.type==='triangle_spline_bridge'?uiText('Dreiecks-Spline'):uiText('Gekrümmte Dreiecksbrücke')):(s.type==='spline_bridge'?uiText('Spline-Brücke'):uiText('Gekrümmte Brücke'))):s.type==='subdivide'?'Catmull-Clark':s.type==='doo_sabin'?'Doo-Sabin':s.type==='bevel_edges'?uiText('Kanten abschrägen'):s.type==='subdivide_faces'?uiText('Flächen unterteilen'):s.type==='split_edges'?uiText('Kanten unterteilen'):s.type==='move_vertices'?uiText('Punkte verschieben'):s.type==='truncate_vertices'?uiText('Ausgewählte Ecken'):s.type==='truncate'?uiText('Ecken abschneiden'):s.type==='stellate'?uiText('Spitzen'):s.type==='wire_model'?uiText('Drahtmodell'):s.type==='dual'?uiText('Dualnetz'):s.type==='shell'?uiText('Schale / Rind'):s.type==='shell_open'?uiText('Öffnung'):s.type==='face_transform'?uiText('Fläche formen'):'Extrusion';
const primitiveFields=p=>p.kind==='prism'?[['sides',uiText('Seitenzahl (3–128)')],['size',uiText('Seitenlänge')],['height',uiText('Höhe / Dicke')]]:p.kind==='sphere'?[['radius','Radius'],['segments',uiText('Umfangssegmente (3–128)')],['rings',uiText('Höhenabschnitte (2–128)')]]:p.kind==='torus'?[['radius',uiText('Ringradius (bis Rohrmitte)')],['tubeRadius',uiText('Rohr-Radius')],['segments',uiText('Ringsegmente (3–128)')],['rings',uiText('Rohrsegmente (3–128)')]]:[['size',uiText('Kantenlänge')]];
const primitiveDetails=p=>p.kind==='prism'?uiText`${p.sides} Seiten · Seitenlänge ${p.size} · Höhe ${p.height}`:p.kind==='sphere'?uiText`Radius ${p.radius} · ${p.segments} × ${p.rings} Abschnitte`:p.kind==='torus'?uiText`Ringradius ${p.radius} · Rohr-Radius ${p.tubeRadius} · ${p.segments} × ${p.rings} Segmente`:p.kind==='soccerball'?uiText`12 Fünfecke + 20 Sechsecke · Kantenlänge ${p.size}`:uiText`Kantenlänge ${p.size}`;
const timelineIcons={
  cube:'<path d="m12 3 8 4v10l-8 4-8-4V7zM4 7l8 4 8-4M12 11v10"/>',
  dodecahedron:'<path d="m12 2 9 7-3 12H6L3 9zM12 6l6 4-2 7H8l-2-7zM12 2v4M3 9l3 1m12 0 3-1M6 21l2-4m8 0 2 4"/>',
  sphere:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6h14M5 18h14"/>',
  torus:'<ellipse cx="12" cy="12" rx="10" ry="7"/><ellipse cx="12" cy="10" rx="5" ry="2"/><path d="M7 10c0 5 10 5 10 0"/>',
  soccerball:'<circle cx="12" cy="12" r="10"/><path d="m12 7 5 4-2 6H9l-2-6zM12 7V2m5 9 5-2m-7 8 3 3m-9-3-3 3m1-9L2 9"/>',
  prism:'<path d="m5 7 7-4 7 4v10l-7 4-7-4zM5 7l7 4 7-4M12 11v10"/>',
  tetrahedron:'<path d="m12 3 9 16H3zM12 3v12m-9 4 9-4 9 4"/>',
  octahedron:'<path d="m12 2 9 10-9 10-9-10zM3 12l9-4 9 4-9 4zM12 2v6m0 8v6"/>',
  icosahedron:'<path d="m12 2 9 7-3 11H6L3 9zM12 2 8 9h8zM3 9l5 0-2 11m15-11h-5l2 11M8 9l4 8 4-8M6 20l6-3 6 3"/>',
  extrude:'<path d="M5 14v6h14v-6M5 14h14M12 14V3m-4 4 4-4 4 4"/>',
  triangle_bridge:'<path d="m3 8 4 8H1zm17 0 4 8h-8zM5 10h13M7 16h9"/>',
  tunnel:'<path d="M3 3h18v18H3zM7 7h10v10H7zM7 7l4 4h6M11 11v6"/>',
  mixed_bridge:'<path d="M2 5h6v14H2zM16 3l6 9-6 9V3M8 5l8-2M8 19l8 2"/>',
  bridge:'<path d="M3 8v9h4V8zm14 0v9h4V8zM7 10h10m-10 5h10"/>',
  triangle_curved_bridge:'<path d="M3 19v-6a9 9 0 0 1 18 0v6M1 19l2-5 3 5zm17 0 3-5 2 5z"/>',
  triangle_spline_bridge:'<path d="M4 18C4 3 20 21 20 6M1 21l3-6 3 6zM17 9l3-6 3 6z"/><circle cx="12" cy="12" r="2"/>',
  curved_bridge:'<path d="M3 19v-6a9 9 0 0 1 18 0v6m-18-3h5v-3a4 4 0 0 1 8 0v3h5"/>',
  spline_bridge:'<path d="M4 18C4 3 20 21 20 6"/><circle cx="4" cy="18" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="20" cy="6" r="2"/>',
  dissolve_edges:'<path d="M3 3h18v18H3zM9 12h6"/>',
  bevel_edges:'<path d="M3 3h12l6 6v12H3zM15 3v6h6"/>',
  subdivide_faces:'<path d="M3 3h18v18H3zM12 3v18M3 12h18"/>',
  split_edges:'<path d="M3 12h18M3 8v8m9-8v8m9-8v8"/>',
  move_vertices:'<path d="M12 2v20M2 12h20m-6-4 4 4-4 4M8 6l4-4 4 4"/>',
  truncate_vertices:'<path d="M3 3h13l5 5v13H3zM16 3v5h5"/>',
  truncate:'<path d="M8 3h8l5 5v8l-5 5H8l-5-5V8zM8 3v5H3m13-5v5h5M3 16h5v5m8 0v-5h5"/>',
  stellate:'<path d="M3 20 12 3l9 17H3l9-6 9 6M12 3v11"/>',
  wire_model:'<path d="M3 3h18v18H3zM7 7h10v10H7zM3 3l4 4m14-4-4 4m4 14-4-4M3 21l4-4"/>',
  shell_open:'<path d="M3 3h18v18H3zM7 7h10v10H7zM3 3l4 4m14-4-4 4m4 14-4-4M3 21l4-4"/>',
  shell:'<path d="M3 4h18v16H3zM7 4v12h10V4M3 20l4-4m14 4-4-4"/>',
  dual:'<path d="m12 2 10 10-10 10L2 12zM12 2v20M2 12h20M7 7l10 10M17 7 7 17"/>',
  manual_patch:'<path d="M3 3h18v18H3zM3 21 21 3M3 3l18 18"/>',
  triangulate_faces:'<path d="M3 3h18v18H3zM3 21 21 3"/>',
  loop:'<path d="m12 3 9 18H3zM7.5 12h9L12 21z"/>',
  honeycomb:'<path d="m8 3 4 7-4 7H0l-4-7 4-7zm12 0 4 7-4 7h-8" transform="translate(2 2) scale(.8)"/>',
  doo_sabin:'<path d="M8 3h8l5 5v8l-5 5H8l-5-5V8z"/><rect x="8" y="8" width="8" height="8"/>',
  subdivide:'<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M3 12h18M12 3v18"/>',
  face_transform:'<path d="m12 7 5 5-5 5-5-5zM4 10a8 8 0 0 1 14-4m0-4v4h-4m6 8a8 8 0 0 1-14 4m0 4v-4h4"/>'
};
// Reusable numeric/shape parameters belong to this document, never to a selection.
const parameterFields={
  extrude:['distance','scale','angle'],extrude_region:['nx','ny','nz'],
  bridge:['segments','offset','wallFaces'],curved_bridge:['segments','bendA','bendB','offset','bow','pathPoints','twist','wallFaces'],mixed_bridge:['offset'],
  dual:['scale'],face_transform:['scale','angle'],boolean_tunnel:['size'],tunnel:['size','offset'],tunnel_general:['size','offset'],
  plane_cut:['nx','ny','nz','position','side'],subdivide:['levels'],doo_sabin:['levels'],honeycomb:['levels'],loop:['levels'],
  shell:['thickness'],wire_model:['thickness'],bevel_edges:['width'],split_edges:['segments'],
  truncate:['amount'],stellate:['height'],move_vertices:['x','y','z']
};
let parameterEpoch=-1,toolMemory=new Map(),parameterSnapshots=new Map();
function parameterFamily(step){
  if(step.type==='cube'||step.type==='primitive')return 'root:'+(step.type==='cube'?'cube':step.params.kind);
  if(isCurve(step))return 'curved_bridge';
  if(isStraight(step))return 'bridge';
  if(['extrude','extrude_shape','extrude_group'].includes(step.type))return 'extrude';
  if(step.type==='truncate_vertices')return 'truncate';
  if(['tunnel','tunnel_general'].includes(step.type))return 'boolean_tunnel';
  return step.type;
}
function reusableParameters(step){
  const family=parameterFamily(step),fields=family.startsWith('root:')?Object.keys(step.params).filter(k=>k!=='kind'):parameterFields[family]||[],values={};
  for(const key of fields)if(step.params[key]!==undefined)values[key]=structuredClone(step.params[key]);
  if(family==='extrude'){values.scale??=1;values.angle??=0;}
  if(family==='curved_bridge'){values.bow??=[0,0,0];values.pathPoints??=[];values.twist??=0;if(isTriangleCurve(step)||step.type==='mixed_curve_bridge')delete values.wallFaces;}
  if(['bridge','curved_bridge'].includes(family)&&!isTriangleCurve(step)&&step.type!=='triangle_bridge'&&step.type!=='mixed_curve_bridge')values.wallFaces??='triangles';
  if(family==='bridge'&&step.type==='triangle_bridge')delete values.wallFaces;
  const records=[[family,values]];
  if(['bridge','curved_bridge'].includes(family)){const shared={};for(const key of ['segments','offset','wallFaces'])if(Object.hasOwn(values,key))shared[key]=values[key];records.push(['bridge-common',shared]);}
  if(step.type==='extrude_region')records.push(['extrude',{distance:step.params.distance}]);
  return records;
}
function syncToolMemory(change){
  const fresh=parameterEpoch!==documentEpoch;
  if(fresh){parameterEpoch=documentEpoch;toolMemory=new Map();parameterSnapshots=new Map();}
  if(!fresh&&!change)return;
  const present=new Set();
  project.steps.forEach((step,i)=>{
    present.add(step.id);const records=reusableParameters(step),signature=JSON.stringify([step.enabled!==false,records]);
    if((fresh||parameterSnapshots.get(step.id)!==signature)&&result.states[i]?.status==='ok')for(const [key,values] of records)if(Object.keys(values).length)toolMemory.set(key,{...toolMemory.get(key),...structuredClone(values)});
    parameterSnapshots.set(step.id,signature);
  });
  for(const id of parameterSnapshots.keys())if(!present.has(id))parameterSnapshots.delete(id);
}
function toolParams(type,base){
  const step={type,params:base},family=parameterFamily(step),saved=toolMemory.get(family)||{},fields=family.startsWith('root:')?Object.keys(base).filter(k=>k!=='kind'):parameterFields[family]||[],params=structuredClone(base);
  for(const key of fields)if(Object.hasOwn(saved,key))params[key]=structuredClone(saved[key]);
  if(type==='extrude_region'&&toolMemory.has('extrude'))params.distance=toolMemory.get('extrude').distance;
  if(['bridge','curved_bridge'].includes(family)&&toolMemory.has('bridge-common')){const shared=toolMemory.get('bridge-common');for(const key of ['segments','offset','wallFaces'])if(Object.hasOwn(shared,key))params[key]=structuredClone(shared[key]);params.segments=Math.max(family==='bridge'?1:3,Math.min(family==='bridge'?16:32,params.segments));}
  return params;
}
let referenceSelection=null;
let selectionMode='face',selectedElements=[],elementCandidates=[],selectionContext='';
const edgeId=(a,b)=>JSON.stringify([a,b].sort());
const activeSelection=()=>selectionMode==='face'?selectedFaces:selectedElements;
let project=newProject(),chosen=0,viewEnd=null,selectedFaces=[],result,dirty=false;
let calculationBusy=false,preparedEvaluation=null,manualDraft=null,timelinePlayback=null;
let documentEpoch=0,changeSerial=0;
let yaw=-0.55,pitch=0.42,zoom=1,center=[0,0,0],radius=2,polygons=[],pan=[0,0],roll=0;
const canvas=$('view'),ctx=canvas.getContext('2d');
let timer,curveSearchBusy=false,curveDraft=null,curveHandles=[],cutDraft=null,cutGrip=null;
function notice(message) { $('notice').textContent=uiText(message);$('notice').style.display='block';clearTimeout(timer);timer=setTimeout(()=>$('notice').style.display='none',7000); }
async function searchCurve(mesh,targets,stepId,preferred,scopeCurrent=()=>true){
  if(curveSearchBusy){const error=new Error(uiText('Es läuft bereits eine Brückensuche.'));error.name='AbortError';throw error;}
  const epoch=documentEpoch,serial=changeSerial,controller=new AbortController();
  const current=()=>documentEpoch===epoch&&changeSerial===serial&&scopeCurrent();
  curveSearchBusy=true;update();notice(uiText('Passender Brückenverlauf wird gesucht …'));
  try{
    const params=await autoCurvedBridgeParams(mesh,targets,{stepId,preferred,signal:controller.signal,onProgress:()=>{if(!current())controller.abort();}});
    if(!current()){const error=new Error(uiText('Suche verworfen, weil das Projekt inzwischen geändert wurde.'));error.name='AbortError';throw error;}
    return params;
  }finally{curveSearchBusy=false;update();}
}
function cancelCurveDraft(restore=true){
  const draft=curveDraft;curveDraft=null;curveHandles=[];$('curve-editor').hidden=true;document.querySelector('.properties').classList.remove('curve-editing');
  if(restore&&draft&&draft.epoch===documentEpoch&&draft.serial===changeSerial){selectedFaces=draft.selection;viewEnd=draft.viewEnd;}
}
function refreshCurveDraft(){
  if(!curveDraft)return;const d=curveDraft;d.preview=curvedBridgePreview(d.mesh,d.targets,d.params);
  for(const key of ['bendA','bendB','segments','offset'])$('curve-'+key).value=d.params[key];
  $('curve-offset').max=String(d.preview.a.vertices.length-1);
  for(let i=0;i<3;i++)$('curve-mid-'+i).value=d.params.bow?.[i]??0;
  $('curve-twist').value=d.params.twist??0;d.sections=null;d.sectionError='';if(d.params.twist)try{d.sections=curvedBridgeSections(d.mesh,d.targets,d.params);}catch(e){d.sectionError=e.message;}
  renderPathPoints();
  $('curve-status').textContent=uiText(d.error)||uiText(d.sectionError)||uiText('Kurve ziehen. Das Netz wird erst bei „Übernehmen“ erzeugt und geprüft.');
  $('curve-status').classList.toggle('warning',Boolean(d.error||d.sectionError));$('curve-apply').disabled=curveSearchBusy||Boolean(d.sectionError);$('curve-auto').disabled=curveSearchBusy;
  draw();
}
function beginCurveDraft(mesh,targets,id,params,index=null){
  selectionMode="face";selectedElements=[];
  curvedBridgePreview(mesh,targets,params);cancelCurveDraft(false);
  curveDraft={mesh,targets:[...targets],id,params:structuredClone(params),index,epoch:documentEpoch,serial:changeSerial,chosen,selection:[...selectedFaces],viewEnd,revision:0,error:''};
  selectedFaces=[...targets];$('curve-editor').hidden=false;document.querySelector('.properties').classList.add('curve-editing');update();refreshCurveDraft();
}
$('curve-cancel').onclick=()=>{cancelCurveDraft();update();};
$('curve-reset').onclick=()=>{if(!curveDraft)return;delete curveDraft.params.bow;curveDraft.revision++;curveDraft.error='';refreshCurveDraft();};
for(let i=0;i<3;i++)$('curve-mid-'+i).onchange=()=>{
  const d=curveDraft;if(!d)return;const prior=d.params.bow;
  d.params.bow=[...(prior??[0,0,0])];d.params.bow[i]=$('curve-mid-'+i).valueAsNumber;
  try{curvedBridgePreview(d.mesh,d.targets,d.params);d.revision++;d.error='';refreshCurveDraft();}
  catch(e){if(prior===undefined)delete d.params.bow;else d.params.bow=prior;refreshCurveDraft();notice(e.message);}
};
for(const key of ['bendA','bendB','segments','offset'])$('curve-'+key).onchange=()=>{
  const d=curveDraft;if(!d)return;const prior=d.params[key];d.params[key]=$('curve-'+key).valueAsNumber;
  try{curvedBridgePreview(d.mesh,d.targets,d.params);d.revision++;d.error='';refreshCurveDraft();}
  catch(e){d.params[key]=prior;$('curve-'+key).value=prior;notice(e.message);}
};
function renderPathPoints(){
  const d=curveDraft,container=$('curve-points');container.replaceChildren();if(!d)return;
  (d.params.pathPoints||[]).forEach((q,index)=>{
    const row=document.createElement('div');row.className='path-point';const title=document.createElement('p');title.textContent=uiText`Pfadpunkt ${index+1} · ${q.t*100} %`;row.append(title);
    for(let axis=0;axis<3;axis++){const label=document.createElement('label');label.textContent='XYZ'[axis]+uiText(' (Faktor)');const input=document.createElement('input');input.type='number';input.min='-4';input.max='4';input.step='0.01';input.value=q.offset[axis];input.onchange=()=>{const previous=q.offset[axis];q.offset[axis]=input.valueAsNumber;try{curvedBridgePreview(d.mesh,d.targets,d.params);d.error='';d.revision++;refreshCurveDraft();}catch(e){q.offset[axis]=previous;refreshCurveDraft();notice(e.message);}};label.append(input);row.append(label);}
    const remove=document.createElement('button');remove.textContent=uiText('Punkt entfernen');remove.onclick=()=>{d.params.pathPoints=d.params.pathPoints.filter(p=>p.t!==q.t);d.revision++;d.error='';refreshCurveDraft();};row.append(remove);container.append(row);
  });$('curve-add-point').disabled=curveSearchBusy||(d.params.pathPoints?.length||0)>=3;
}
$('curve-add-point').onclick=()=>{const d=curveDraft;if(!d||curveSearchBusy)return;const points=d.params.pathPoints||[],t=[.25,.75,.375].find(t=>!points.some(p=>p.t===t));if(t===undefined)return;d.params.pathPoints=[...points,{t,offset:[0,0,0]}].sort((a,b)=>a.t-b.t);d.revision++;d.error='';refreshCurveDraft();};
$('curve-twist').onchange=()=>{const d=curveDraft;if(!d)return;const prior=d.params.twist;d.params.twist=$('curve-twist').valueAsNumber;try{curvedBridgePreview(d.mesh,d.targets,d.params);d.revision++;d.error='';refreshCurveDraft();}catch(e){if(prior===undefined)delete d.params.twist;else d.params.twist=prior;refreshCurveDraft();notice(e.message);}};
$('curve-auto').onclick=async()=>{
  const d=curveDraft;if(!d)return;const revision=d.revision;
  try{const params=await searchCurve(d.mesh,d.targets,d.id,structuredClone(d.params),()=>curveDraft===d&&d.revision===revision);if(curveDraft!==d)return;d.params=params;d.revision++;d.error='';refreshCurveDraft();}
  catch(e){if(curveDraft===d){d.error=e.message;refreshCurveDraft();}}
};
$('curve-apply').onclick=()=>{
  const d=curveDraft;if(!d||curveSearchBusy)return;
  try{
    const params=structuredClone(d.params);if(!params.twist)delete params.twist;if(params.pathPoints?.length||params.twist){params.bow=params.bow||[0,0,0];}else{delete params.pathPoints;if(!params.bow?.some(v=>v!==0))delete params.bow;}
    const step={id:d.id,type:curveType(params,d.preview.a.vertices.length),enabled:true,targets:[...d.targets],params};
    curvedBridge(d.mesh,step);
    if(d.index===null){project.steps.push(step);chosen=project.steps.length-1;}
    else{Object.assign(project.steps[d.index],{type:step.type,targets:step.targets,params:step.params});chosen=d.index;}
    cancelCurveDraft(false);viewEnd=null;selectedFaces=[];update(true);notice(uiText('Brücke aus dem Vorschaupfad übernommen.'));
  }catch(e){d.error=e.message;refreshCurveDraft();}
};
function cancelCutDraft(){cutDraft=null;cutGrip=null;$('cut-editor').hidden=true;document.querySelector('.properties').classList.remove('cut-editing');cancelNavigation();}
function refreshCutDraft(compute=true){
  const d=cutDraft;if(!d)return;
  if(compute){try{d.output=planeCut(d.mesh,{id:d.id,params:d.params});d.error='';d.pending=false;}catch(e){d.output=null;d.error=e.message;d.pending=false;}}
  for(const key of ['nx','ny','nz','position'])$('cut-'+key).value=d.params[key];$('cut-side').value=d.params.side||'positive';
  $('cut-status').textContent=d.pending?uiText('Ebene verschoben – Schnitt wird beim Loslassen berechnet.'):uiText(d.error)||uiText('Vorschau gültig. Erst Übernehmen ändert die Timeline.');
  $('cut-apply').disabled=Boolean(d.error)||d.pending||!d.output;const stats=meshTopology(d.output||d.mesh);$('stats').textContent=uiText`${stats.vertices} Punkte · ${stats.faces} Flächen · ${stats.components} Hüllen · Genus gesamt ${stats.genus} · Vorschau`;draw();
}
function beginCutDraft(mesh,params,index=null){
  cancelNavigation();cancelCurveDraft(false);cutDraft={mesh,params:structuredClone(params),index,id:index===null?'s'+crypto.randomUUID():project.steps[index].id,epoch:documentEpoch,serial:changeSerial,chosen,output:null,error:'',pending:false};
  $('cut-editor').hidden=false;document.querySelector('.properties').classList.add('cut-editing');update();refreshCutDraft();
}
$('cut-cancel').onclick=()=>{cancelCutDraft();update();};
for(const key of ['nx','ny','nz','position'])$('cut-'+key).onchange=()=>{if(!cutDraft)return;cutDraft.params[key]=$('cut-'+key).valueAsNumber;refreshCutDraft();};
$('cut-side').onchange=()=>{if(!cutDraft)return;cutDraft.params.side=$('cut-side').value;refreshCutDraft();};
for(const [axis,n] of [['x',[1,0,0]],['y',[0,1,0]],['z',[0,0,1]]])$('cut-axis-'+axis).onclick=()=>{if(!cutDraft)return;const c=viewBounds(Object.values(cutDraft.mesh.vertices)).center;[cutDraft.params.nx,cutDraft.params.ny,cutDraft.params.nz]=n;cutDraft.params.position=dot(n,c);refreshCutDraft();};
$('cut-apply').onclick=()=>{
  const d=cutDraft;if(!d)return;refreshCutDraft();if(d.error||!d.output)return;
  if(d.epoch!==documentEpoch||d.serial!==changeSerial){cancelCutDraft();update();return;}
  const step={id:d.id,type:'plane_cut',enabled:true,params:structuredClone(d.params)};if(d.index===null){project.steps.push(step);chosen=project.steps.length-1;}else{step.enabled=project.steps[d.index].enabled!==false;project.steps[d.index]=step;chosen=d.index;}
  cancelCutDraft();viewEnd=null;selectedFaces=[];selectedElements=[];update(true);notice(uiText('Ebenenschnitt übernommen.'));
};
function download(name,text,type) { const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000); }
function update(change=false) {
  cancelNavigation();
  if(timelinePlayback&&(change||timelinePlayback.project!==project||timelinePlayback.epoch!==documentEpoch||timelinePlayback.serial!==changeSerial||timelinePlayback.index!==chosen||curveDraft||cutDraft||manualDraft||calculationBusy))stopTimelinePlayback();
  if(manualDraft&&(change||manualDraft.epoch!==documentEpoch||manualDraft.serial!==changeSerial||manualDraft.chosen!==chosen||manualDraft.viewEnd!==viewEnd))cancelManualDraft(false);
  if(cutDraft&&(change||cutDraft.epoch!==documentEpoch||cutDraft.serial!==changeSerial||cutDraft.chosen!==chosen))cancelCutDraft();
  if(change){referenceSelection=null;dirty=true;changeSerial++;}
  if(curveDraft&&(curveDraft.epoch!==documentEpoch||curveDraft.serial!==changeSerial||curveDraft.chosen!==chosen))cancelCurveDraft(false);
  const context=`${documentEpoch}/${changeSerial}/${viewEnd}`;if(context!==selectionContext){selectedElements=[];selectionContext=context;}
  const ready=preparedEvaluation?.project===project&&preparedEvaluation.end===(viewEnd??project.steps.length-1)&&preparedEvaluation.chosen===chosen?preparedEvaluation:null;
  result=ready?ready.value:evaluate(project,viewEnd??project.steps.length-1);preparedEvaluation=null;syncToolMemory(change);
  if(selectionMode!=='face')selectedFaces=[];
  if(selectionMode==='vertex')selectedElements=selectedElements.filter(id=>Object.hasOwn(result.mesh.vertices,id));
  if(selectionMode==='edge'){const edges=new Set(result.mesh.faces.flatMap(f=>f.vertices.map((a,i)=>edgeId(a,f.vertices[(i+1)%f.vertices.length]))));selectedElements=selectedElements.filter(id=>edges.has(id));}
  selectedFaces=retainFaces(selectedFaces,curveDraft?.mesh||result.mesh);
  const singleFace=selectedFaces.length===1?selectedFaces[0]:null;
  $('model-name').textContent=project.name+(dirty?' •':'');
  $('history-info').textContent=viewEnd===null?uiText`${project.steps.length} Schritte · Endzustand`:uiText`Vorschau bis Schritt ${viewEnd+1}`;
  $('timeline').replaceChildren();
  project.steps.forEach((s,i)=>{
    const state=result.states[i];
    const b=document.createElement('button');b.className='step'+(i===chosen?' active':'')+(state?.status==='error'||state?.status==='blocked'?' error':'')+(s.enabled===false?' suppressed':'')+(viewEnd!==null&&i>viewEnd?' past':'');
    const details= s.type==='manual_patch'?uiText`${s.params.removed?.flat(2).length||0} entfernt · ${s.params.patches?.length||0} neue Flächen`:s.type==='triangulate_faces'?(s.params.groups?s.params.groups.flat(2).length+uiText(' Flächen'):uiText('Gesamtes Netz')):s.type==='punch_faces'?uiText`${s.params.groups.flat(2).length} Startflächen · automatische Gegenfläche`:['extrude','extrude_shape','extrude_group'].includes(s.type)?uiText`${s.type==='extrude_group'?s.params.groups.flat(2).length+uiText(' Flächen · '):''}Länge ${s.params.distance} · Faktor ${s.params.scale??1} · ${s.params.angle??0}°`:s.type==='dissolve_edges'?uiText`${s.params.edges.length} Kanten · Flächen zusammenführen`:['split_face_band','remove_parts'].includes(s.type)?uiText`${s.params.groups.flat(2).length} Bezugsmarkierungen`:s.type==='plane_cut'?uiText`Ebene ${s.params.nx}/${s.params.ny}/${s.params.nz} · Position ${s.params.position}`:s.type==='boolean_tunnel'?uiText`Lochgröße ${s.params.size}`:['extrude_region','extrude_group'].includes(s.type)?uiText`${s.params.groups.flat(2).length} Flächen · Länge ${s.params.distance}`:s.type==='cube'?`${s.params.width} × ${s.params.height} × ${s.params.depth}`:s.type==='primitive'?primitiveDetails(s.params):['tunnel','tunnel_general'].includes(s.type)?uiText`Lochgröße ${s.params.size} · Zuordnung ${s.params.offset}`:s.type==='mixed_bridge'?uiText`Zuordnung ${s.params.offset}`:isStraight(s)?uiText`${s.params.segments} Segmente · Zuordnung ${s.params.offset}`:isCurve(s)?uiText`${s.params.segments} Segmente · A ${s.params.bendA} / B ${s.params.bendB} · Zuordnung ${s.params.offset}${s.params.bow?uiText(' · Mitte X/Y/Z ')+s.params.bow.join(' / '):''}`:['loop','honeycomb','subdivide','doo_sabin'].includes(s.type)?uiText`${s.params.levels} Stufe(n)`:s.type==='bevel_edges'?uiText`${s.params.edges.length} Kanten · Breite ${s.params.width}`:s.type==='subdivide_faces'?uiText`${s.params.faces.length} Flächen · lokale Vierecke`:s.type==='split_edges'?uiText`${s.params.edges.length} Kanten · ${s.params.segments} Abschnitte`:s.type==='move_vertices'?uiText`${s.params.vertices.length} Punkte · X ${s.params.x} / Y ${s.params.y} / Z ${s.params.z}`:s.type==='truncate_vertices'?uiText`${s.params.vertices.length} Ecken · Schnittstärke ${s.params.amount}`:s.type==='truncate'?uiText`Schnittstärke ${s.params.amount}`:s.type==='stellate'?uiText`Höhe ${s.params.height} · ${s.params.faces.length} Fläche(n)`:s.type==='wire_model'?uiText`Strebenstärke ${s.params.thickness}`:s.type==='shell_open'?uiText`${s.params.faces.length} Öffnungsfläche(n)`:s.type==='shell'?uiText`Wandstärke ${s.params.thickness} · ${s.params.openings.length} Öffnungsfläche(n)`:s.type==='dual'?uiText`Größenfaktor ${s.params.scale}`:s.type==='face_transform'?uiText`Faktor ${s.params.scale} · ${s.params.angle}°`:uiText`Länge ${s.params.distance}`;
    const status=uiText(state?.message)||(s.enabled===false?uiText('Unterdrückt'):viewEnd!==null&&i>viewEnd?uiText('Nach der aktuellen Vorschau'):'');
    const info=`${i+1}. ${stepName(s)}\n${details}${status?'\n'+status:''}`;
    b.title=info;b.setAttribute('aria-label',info.replaceAll('\n',': '));b.setAttribute('aria-pressed',String(i===chosen));
    const icon=document.createElement('span');icon.className='step-icon';icon.setAttribute('aria-hidden','true');
    icon.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+timelineIcons[s.type==='primitive'?s.params.kind:s.type==='punch_faces'?'tunnel':s.type==='quad_bridge'?'bridge':s.type==='mixed_curve_bridge'?'spline_bridge':['tunnel_general','boolean_tunnel'].includes(s.type)?'tunnel':s.type==='plane_cut'?'truncate':['multi_spline_bridge','twist_spline_bridge'].includes(s.type)?'spline_bridge':['triangle_multi_spline_bridge','triangle_twist_spline_bridge'].includes(s.type)?'triangle_spline_bridge':['extrude_shape','extrude_region','extrude_group'].includes(s.type)?'extrude':['split_face_band','remove_parts'].includes(s.type)?'truncate':s.type]+'</svg>';
    const number=document.createElement('span');number.className='step-number';number.textContent=String(i+1);number.setAttribute('aria-hidden','true');b.append(icon,number);
    b.onclick=()=>{stopTimelinePlayback();referenceSelection={faces:[...selectedFaces],elements:[...selectedElements],mode:selectionMode};chosen=i;viewEnd=i===project.steps.length-1?null:i;selectionContext=`${documentEpoch}/${changeSerial}/${viewEnd}`;update();};$('timeline').append(b);
  });
  const step=project.steps[chosen];
  $('step-title').textContent=`${chosen+1}. ${stepName(step)}`;
  $('params').replaceChildren();
  if(step.type==='plane_cut'){
    const label=document.createElement('label');label.className='field';label.textContent=uiText('Schnittseite');const select=document.createElement('select');
    for(const [value,text] of [['both',uiText('Beide Teile behalten')],['positive',uiText('Seite in Normalenrichtung')],['negative',uiText('Gegenüberliegende Seite')]]){const option=document.createElement('option');option.value=value;option.textContent=text;select.append(option);}select.value=step.params.side||'positive';select.onchange=()=>{step.params.side=select.value;update(true);};label.append(select);$('params').append(label);
  }
  if(chosen===0){
    const label=document.createElement('label');label.className='field';label.textContent=uiText('Grundkörper');
    const select=document.createElement('select');select.setAttribute('aria-label',uiText('Grundkörper'));
    for(const [value,title] of Object.entries(PRIMITIVE_NAMES)){const option=document.createElement('option');option.value=value;option.textContent=uiText(title);select.append(option);}
    select.value=step.type==='cube'?'cube':step.params.kind;
    select.onchange=()=>{
      const kind=select.value,base=newProject(kind).steps[0];step.type=base.type;step.params=toolParams(base.type,base.params);viewEnd=null;selectedFaces=[];update(true);
      notice(uiText('Grundkörper gewechselt. Spätere Flächenbezüge gegebenenfalls neu zuordnen.'));
    };
    label.append(select);$('params').append(label);
  }
  for(const [key,title] of ['extrude','extrude_shape','extrude_group'].includes(step.type)?[['distance',uiText('Länge (+ außen / − innen)')],['scale',uiText('Skalierung Deckfläche')],['angle',uiText('Drehwinkel Deckfläche (Grad)')]]:step.type==='extrude_region'?[['distance',uiText('Länge (+ außen / − innen)')],['nx',uiText('Richtung X')],['ny',uiText('Richtung Y')],['nz',uiText('Richtung Z')]]:step.type==='plane_cut'?[['nx',uiText('Ebenennormale X')],['ny',uiText('Ebenennormale Y')],['nz',uiText('Ebenennormale Z')],['position',uiText('Ebenenposition')]]:step.type==='boolean_tunnel'?[['size',uiText('Lochgröße (Faktor)')]]:step.type==='cube'?[['width',uiText('Breite')],['height',uiText('Höhe')],['depth',uiText('Tiefe')]]:step.type==='primitive'?primitiveFields(step.params):['tunnel','tunnel_general'].includes(step.type)?[['size',uiText('Lochgröße (Faktor)')],['offset',uiText('Eckpunkt-Zuordnung (0–3)')]]:step.type==='mixed_bridge'?[['offset',uiText('Eckpunkt-Zuordnung (0–3)')]]:isStraight(step)?[['offset',uiText`Eckpunkt-Zuordnung (0–${step.type==='triangle_bridge'?2:3})`],['segments',uiText('Segmente (1–16)')]]:isCurve(step)?[['bendA',uiText('Krümmung A (Faktor)')],['bendB',uiText('Krümmung B (Faktor)')],['segments',uiText('Segmente (3–32)')],['offset',uiText`Eckpunkt-Zuordnung (0–${step.type==='mixed_curve_bridge'?11:isTriangleCurve(step)?2:3})`],['twist',uiText('Verdrehung Mitte (Grad)')]]:['loop','honeycomb','subdivide','doo_sabin'].includes(step.type)?[['levels',uiText('Stufen (1–2)')]]:step.type==='bevel_edges'?[['width',uiText('Fasenbreite')]]:step.type==='split_edges'?[['segments',uiText('Abschnitte (2–16)')]]:step.type==='move_vertices'?[['x',uiText('Versatz X')],['y',uiText('Versatz Y')],['z',uiText('Versatz Z')]]:['truncate','truncate_vertices'].includes(step.type)?[['amount',uiText('Schnittstärke (0,01–0,49)')]]:step.type==='stellate'?[['height',uiText('Spitzenhöhe (±)')]]:step.type==='wire_model'?[['thickness',uiText('Strebenstärke')]]:['manual_patch','triangulate_faces','punch_faces','dissolve_edges','shell_open','subdivide_faces','split_face_band','remove_parts'].includes(step.type)?[]:step.type==='shell'?[['thickness',uiText('Wandstärke')]]:step.type==='dual'?[['scale',uiText('Größenfaktor (0,1–4)')]]:step.type==='face_transform'?[['scale',uiText('Skalierung (Faktor)')],['angle',uiText('Drehwinkel (Grad)')]]:[['distance',uiText('Länge')]]) {
    const label=document.createElement('label');label.className='field';label.textContent=title;
    const input=document.createElement('input');input.type='number';input.min=step.type==='face_transform'?(key==='scale'?'0.05':'-180'):['loop','honeycomb','subdivide','doo_sabin'].includes(step.type)?'1':isStraight(step)?(key==='offset'?'0':'1'):'0.01';input.max=step.type==='face_transform'?(key==='scale'?'10':'180'):['loop','honeycomb','subdivide','doo_sabin'].includes(step.type)?'2':isStraight(step)?(key==='offset'?(step.type==='triangle_bridge'?'2':'3'):'16'):'1000';input.step=step.type==='face_transform'?(key==='scale'?'0.05':'1'):['loop','honeycomb','bridge','triangle_bridge','subdivide','doo_sabin'].includes(step.type)?'1':'0.1';input.value=key==='twist'?(step.params.twist??0):['extrude','extrude_shape','extrude_group'].includes(step.type)&&key==='scale'?(step.params.scale??1):['extrude','extrude_shape','extrude_group'].includes(step.type)&&key==='angle'?(step.params.angle??0):step.params[key];
    if(['extrude','extrude_shape','extrude_group','extrude_region'].includes(step.type)&&key==='distance'){input.min='-1000';input.title=uiText('Positiv: nach außen. Negativ: nach innen. Betrag mindestens 0,01; null ist nicht erlaubt.');}
    if(['extrude','extrude_shape','extrude_group'].includes(step.type)&&key!=='distance'){input.min=key==='scale'?'0.05':'-180';input.max=key==='scale'?'10':'180';input.step=key==='scale'?'0.05':'1';}
    if(step.type==='primitive'&&['sphere','torus'].includes(step.params.kind)&&['segments','rings'].includes(key)){input.min=step.params.kind==='sphere'&&key==='rings'?'2':'3';input.max='128';input.step='1';}
    if(step.type==='primitive'&&step.params.kind==='prism'&&key==='sides'){input.min='3';input.max='128';input.step='1';}
    if(step.type==='extrude_region'&&key!=='distance'){input.min='-1000';input.max='1000';input.step='0.1';}
    if(step.type==='plane_cut'){input.min='-1000';input.max='1000';input.step='0.1';}
    if(step.type==='boolean_tunnel'){input.min='0.05';input.max='0.95';input.step='0.05';}
    if(['tunnel','tunnel_general'].includes(step.type)){input.min=key==='size'?'0.05':'0';input.max=key==='size'?'0.95':String(step.type==='tunnel_general'?Math.max(0,(result.mesh.faces.find(f=>f.id===step.targets[1])||evaluate(project,chosen-1).mesh.faces.find(f=>f.id===step.targets[1]))?.vertices.length-1||0):3);input.step=key==='size'?'0.05':'1';}
    if(step.type==='mixed_bridge'){input.min='0';input.max='3';input.step='1';}
    if(step.type==='bevel_edges'){input.min='0.0001';input.max='1000';input.step='0.01';}
    if(step.type==='split_edges'){input.min='2';input.max='16';input.step='1';}
    if(step.type==='move_vertices'){input.min='-1000';input.max='1000';input.step='0.1';}
    if(['truncate','truncate_vertices'].includes(step.type)){input.min='0.01';input.max='0.49';input.step='0.01';}
    if(step.type==='stellate'){input.min='-1000';input.max='1000';input.step='0.1';}
    if(['shell','wire_model'].includes(step.type)){input.min='0.0001';input.max='1000';input.step='0.01';}
    if(step.type==='dual'){input.min='0.1';input.max='4';input.step='0.1';}
    if(isCurve(step)){
      input.min=key==='offset'?'0':key==='segments'?'3':'0.05';input.max=key==='offset'?(step.type==='mixed_curve_bridge'?'11':isTriangleCurve(step)?'2':'3'):key==='segments'?'32':'2';input.step=['offset','segments'].includes(key)?'1':'0.05';
    }
    if(key==='twist'){input.min='-180';input.max='180';input.step='5';}
    input.onchange=()=>{const old=step.params[key],oldType=step.type,oldBow=step.params.bow;step.params[key]=input.valueAsNumber;try{if(step.type==='extrude'&&(step.params.distance<0||((step.params.scale??1)!==1||(step.params.angle??0)!==0)))step.type='extrude_shape';if(key==='twist'){if(step.params.twist)step.params.bow=step.params.bow||[0,0,0];step.type=curveType(step.params,step.type==='mixed_curve_bridge'?12:isTriangleCurve(step)?3:4);}validateProject(project);update(true);}catch(e){step.params[key]=old;step.type=oldType;if(oldBow===undefined)delete step.params.bow;else step.params.bow=oldBow;input.value=old??(key==='scale'?1:0);notice(e.message);}};
    label.append(input);$('params').append(label);
  }
  if(isCurve(step)){
    for(let i=0;i<3;i++){
      const label=document.createElement('label');label.className='field';label.textContent=uiText`Mitte ${'XYZ'[i]} (Faktor)`;
      const input=document.createElement('input');input.type='number';input.min='-4';input.max='4';input.step='0.01';input.value=step.params.bow?.[i]??0;
      input.onchange=()=>{
        const prior=step.params.bow,type=step.type;step.params.bow=[...(prior??[0,0,0])];step.params.bow[i]=input.valueAsNumber;
        step.type=curveType(step.params,step.type==='mixed_curve_bridge'?12:isTriangleCurve(step)?3:4);
        if(step.type.endsWith('curved_bridge'))delete step.params.bow;
        try{validateProject(project);update(true);}
        catch(e){step.type=type;if(prior===undefined)delete step.params.bow;else step.params.bow=prior;input.value=prior?.[i]??0;notice(e.message);}
      };
      label.append(input);$('params').append(label);
    }
    const p=document.createElement('p');p.className='hint';p.textContent=uiText('A/B: Grifflängen entlang der Flächennormalen. Mitte X/Y/Z: zusätzliche Verschiebung der Kurvenmitte entlang der festen Modellachsen, relativ zum Abstand der Endflächenmittelpunkte. 0 = keine Zusatzverschiebung; 0,1 = 10 % dieses Abstands. Gleiche Werte sind unabhängig von der Ansicht.');$('params').append(p);
  }
  if(step.params.pathPoints?.length){const p=document.createElement('p');p.className='hint';p.textContent=step.params.pathPoints.length+uiText(' zusätzliche Pfadpunkte. Über Spline bearbeiten ziehen oder X/Y/Z ändern.');$('params').append(p);}
  if(step.type==='shell_open'){const p=document.createElement('p');p.className='hint';p.textContent=step.params.faces.length+uiText(' Außenflächen. Für Änderungen den Zustand vor diesem Schritt anzeigen, Flächengruppe markieren und „Auswahl als Öffnung“ wählen. Unterdrücken schließt nur diesen Öffnungsschritt.');$('params').append(p);}
  if(step.type==='shell'){const p=document.createElement('p');p.className='hint';p.textContent=uiText('Innenversatz; an komplexen Ecken nur angenäherte Wandstärke. Öffnungsflächen: ')+(step.params.openings.join(' · ')||uiText('keine (geschlossene Hohlform)'))+uiText('. Zum Ändern den Zustand vor der Schale anzeigen und bis zu zwei Flächen auswählen.');$('params').append(p);}
  if(step.type==='face_transform'){const p=document.createElement('p');p.className='hint';p.textContent=uiText('Faktor 1 und 0° lassen die Fläche unverändert. Drehung um ihren Mittelpunkt und ihre Ausgangsnormale; angrenzende Flächen werden mitverformt.');$('params').append(p);}
  if((isStraight(step)&&step.type!=='triangle_bridge')||(isCurve(step)&&!isTriangleCurve(step)&&step.type!=='mixed_curve_bridge')){
    const label=document.createElement('label');label.className='field';label.textContent=uiText('Brückenwand');const select=document.createElement('select');
    for(const [value,text] of [['quads',uiText('Vierecke')],['triangles',uiText('Dreiecke (bisherig)')]]){const option=document.createElement('option');option.value=value;option.textContent=text;select.append(option);}select.value=step.params.wallFaces||'triangles';select.onchange=()=>{if(step.type==='bridge')step.type='quad_bridge';step.params.wallFaces=select.value;viewEnd=null;update(true);};label.append(select);$('params').append(label);
  }
  if(step.targets){const p=document.createElement('p');p.className='hint bridge-references';p.textContent='A: '+step.targets[0]+' · B: '+step.targets[1];$('params').append(p);}
  if(step.target) {const p=document.createElement('p');p.className='hint';p.textContent=uiText('Bezugsfläche: ')+step.target;$('params').append(p);}
  const actions=document.createElement('div');actions.className='actions';
  const action=(text,fn)=>{const b=document.createElement('button');b.textContent=text;b.onclick=fn;actions.append(b);return b;};
  const deleteTail=action(uiText('Timeline ab hier löschen'),()=>{
    const start=Math.max(1,chosen),count=project.steps.length-start;
    if(count<1||!confirm(uiText`${count} Timeline-Schritt(e) ab dieser Stelle löschen? Der Grundkörper bleibt erhalten.`))return;
    cancelCurveDraft(false);project.steps.splice(start);chosen=start-1;viewEnd=null;selectedFaces=[];selectedElements=[];update(true);
    notice(uiText`${count} Timeline-Schritt(e) gelöscht.`);
  });
  deleteTail.title=chosen===0?uiText('Alle Schritte nach dem Grundkörper löschen.'):uiText('Diesen Schritt und alle folgenden löschen.');
  deleteTail.disabled=project.steps.length<=Math.max(1,chosen);
  if(chosen>0) {
    action(step.enabled===false?uiText('Aktivieren'):uiText('Unterdrücken'),()=>{step.enabled=step.enabled===false;viewEnd=null;update(true);});
    action(uiText('Löschen'),()=>{if(confirm(uiText('Diesen Schritt löschen? Abhängige Schritte können dadurch ihre Bezugsfläche verlieren.'))){project.steps.splice(chosen,1);chosen=Math.max(0,chosen-1);viewEnd=null;update(true);}});
    const repairFaces=referenceSelection?.faces||selectedFaces,repairElements=referenceSelection?.elements||selectedElements,repairMode=referenceSelection?.mode||selectionMode,repairSingle=repairFaces.length===1?repairFaces[0]:null;
    const before=ready?.before??evaluate(project,chosen-1);
    if(step.type==='manual_patch'){const edit=action(uiText('Manuell weiterbearbeiten'),()=>beginManualDraft(before.mesh,step.params,chosen));edit.disabled=before.failed||Boolean(curveDraft||cutDraft||manualDraft);}
    if(step.type==='plane_cut'){const edit=action(uiText('Schnittebene bearbeiten'),()=>beginCutDraft(before.mesh,step.params,chosen));edit.disabled=before.failed||Boolean(curveDraft||cutDraft||manualDraft);}
    if(['split_face_band','remove_parts'].includes(step.type)){
      const repair=action(uiText('Auswahl als Bezug'),()=>{try{const refs=step.type==='split_face_band'?repairFaces:partSelection(before.mesh,repairMode,repairFaces,repairElements);const candidate={...step,params:{groups:packFaceGroups(refs)}};(step.type==='split_face_band'?splitFaceBand:removeParts)(before.mesh,candidate);step.params=candidate.params;viewEnd=null;update(true);}catch(e){notice(e.message);}});repair.disabled=before.failed||(step.type==='split_face_band'?repairFaces.length<1:repairFaces.length+repairElements.length<1);
    }else if(step.type==='triangulate_faces'){
      const repair=action(uiText('Auswahl als Triangulierungsflächen'),()=>{try{const candidate={...step,params:{groups:packFaceGroups(repairFaces)}};triangulateFaces(before.mesh,candidate);step.params=candidate.params;viewEnd=null;update(true);}catch(e){notice(e.message);}});repair.disabled=before.failed||repairMode!=='face'||repairFaces.length<1;
      const all=action(uiText('Gesamtes Netz triangulieren'),()=>{try{triangulateFaces(before.mesh,{...step,params:{}});step.params={};viewEnd=null;update(true);}catch(e){notice(e.message);}});all.disabled=before.failed;
    }else if(step.type==='punch_faces'){
      const repair=action(uiText('Auswahl als Stanzflächen'),async()=>{if(calculationBusy)return;const candidate=structuredClone(project),index=chosen;candidate.steps[index].params={groups:packFaceGroups(repairFaces)};await runPunchCalculation(candidate,before,index);});repair.disabled=before.failed||repairMode!=='face'||repairFaces.length<1||repairFaces.length>128;
    }else if(['extrude_region','extrude_group'].includes(step.type)){
      const repair=action(uiText('Auswahl als Extrusionsflächen'),()=>{try{const candidate={...step,params:{...step.params,groups:packFaceGroups(repairFaces)}};(step.type==='extrude_region'?extrudeRegion:extrudeGroup)(before.mesh,candidate);step.params=candidate.params;viewEnd=null;update(true);}catch(e){notice(e.message);}});repair.disabled=before.failed||repairFaces.length<1;
    }else if(step.type==='boolean_tunnel'){
      const repair=action(uiText('Auswahlpaar als Bezug'),()=>{try{const candidate={...step,targets:[...repairFaces]};booleanTunnel(before.mesh,candidate);step.targets=candidate.targets;viewEnd=null;update(true);}catch(e){notice(e.message);}});repair.disabled=repairFaces.length!==2||before.failed;
    }else if(['tunnel','tunnel_general'].includes(step.type)){
      const repair=action(uiText('Auswahlpaar als Bezug'),()=>{try{const offset=(step.type==='tunnel_general'?bestGeneralTunnelOffset:bestTunnelOffset)(before.mesh,repairFaces,step.params.size);step.targets=[...repairFaces];step.params.offset=offset;viewEnd=null;update(true);}catch(e){notice(e.message);}});repair.disabled=repairFaces.length!==2||before.failed;
    }else if(step.type==='mixed_bridge'){
      const repair=action(uiText('Auswahlpaar als Bezug'),()=>{try{const offset=bestMixedBridgeOffset(before.mesh,repairFaces);step.targets=[...repairFaces];step.params={offset};viewEnd=null;update(true);}catch(e){notice(e.message);}});repair.disabled=repairFaces.length!==2||before.failed;
    }else if(isStraight(step)||isCurve(step)){
      const repair=action(uiText('Auswahlpaar als Bezug'),async()=>{
        const pair=[...repairFaces];
        try{
          const params=isCurve(step)?await searchCurve(before.mesh,pair,step.id,step.params):{...step.params,offset:bestBridgeOffset(before.mesh,pair)};
          if(isStraight(step))step.type=bridgePair(before.mesh,pair)[0].vertices.length===3?'triangle_bridge':'bridge';
          else step.type=curveType(params,curvedBridgePair(before.mesh,pair).a.vertices.length);
          step.targets=pair;step.params=params;viewEnd=null;update(true);
        }catch(e){notice(e.message);}
      });
      repair.disabled=curveSearchBusy||repairFaces.length!==2||before.failed||!repairFaces.every(id=>before.mesh?.faces.some(f=>f.id===id));
    }else if(step.type==='subdivide_faces'){
      const repair=action(uiText('Auswahl als Unterteilungsflächen'),()=>{try{const candidate={...step,params:{faces:[...repairFaces]}};subdivideFaces(before.mesh,candidate);step.params=candidate.params;viewEnd=null;update(true);}catch(e){notice(e.message);}});
      repair.disabled=before.failed||repairMode!=='face'||repairFaces.length<1||!repairFaces.every(id=>before.mesh?.faces.some(f=>f.id===id));
    }else if(['dissolve_edges','split_edges','bevel_edges'].includes(step.type)){
      const repair=action(uiText('Auswahl als Bezugskanten'),()=>{try{const candidate={...step,params:{...step.params,edges:repairElements.map(id=>JSON.parse(id))}};(step.type==='dissolve_edges'?dissolveEdges:step.type==='bevel_edges'?bevelEdges:splitEdges)(before.mesh,candidate);step.params=candidate.params;viewEnd=null;update(true);}catch(e){notice(e.message);}});
      repair.disabled=before.failed||repairMode!=='edge'||repairElements.length<1;
    }else if(['move_vertices','truncate_vertices'].includes(step.type)){
      const repair=action(uiText('Auswahl als Bezugspunkte'),()=>{try{const candidate={...step,params:{...step.params,vertices:[...repairElements]}};(step.type==='truncate_vertices'?truncateVertices:moveVertices)(before.mesh,candidate);step.params=candidate.params;viewEnd=null;update(true);}catch(e){notice(e.message);}});
      repair.disabled=before.failed||repairMode!=='vertex'||repairElements.length<1||!repairElements.every(id=>Object.hasOwn(before.mesh?.vertices||{},id));
    }else if(step.type==='stellate'){
      const repair=action(uiText('Auswahl als Spitzenflächen'),()=>{try{const candidate={...step,params:{...step.params,faces:[...repairFaces]}};stellate(before.mesh,candidate);step.params=candidate.params;viewEnd=null;update(true);}catch(e){notice(e.message);}});
      repair.disabled=before.failed||repairFaces.length<1||repairFaces.length>32||!repairFaces.every(id=>before.mesh?.faces.some(f=>f.id===id));
    }else if(step.type==='shell_open'){
      const repair=action(uiText('Auswahl als Öffnung'),()=>{try{const source=openingSource(before.mesh,repairFaces);step.params={source,faces:[...repairFaces]};viewEnd=null;update(true);}catch(e){notice(e.message);}});
      repair.disabled=before.failed||repairFaces.length<1||repairFaces.length>32||!repairFaces.every(id=>before.mesh?.faces.some(f=>f.id===id));
    }else if(step.type==='shell'){
      const repair=action(uiText('Auswahl als Öffnungen'),()=>{step.params.openings=[...repairFaces];viewEnd=null;update(true);});
      repair.disabled=before.failed||repairFaces.length>2||!repairFaces.every(id=>before.mesh?.faces.some(f=>f.id===id));
      const close=action(uiText('Öffnungen schließen'),()=>{step.params.openings=[];viewEnd=null;update(true);});close.disabled=step.params.openings.length===0;
    }else if(['extrude','extrude_shape','face_transform'].includes(step.type)){
      const repair=action(uiText('Auswahl als Bezug'),()=>{step.target=repairSingle;viewEnd=null;update(true);});
      repair.disabled=!repairSingle||before.failed||!before.mesh?.faces.some(f=>f.id===repairSingle);
    }
  }
  if(isCurve(step)){
    const repairFaces=referenceSelection?.faces||selectedFaces,repairElements=referenceSelection?.elements||selectedElements,repairMode=referenceSelection?.mode||selectionMode,repairSingle=repairFaces.length===1?repairFaces[0]:null;
    const before=evaluate(project,chosen-1);
    if(step.type==='plane_cut'){const edit=action(uiText('Schnittebene bearbeiten'),()=>beginCutDraft(before.mesh,step.params,chosen));edit.disabled=before.failed||Boolean(curveDraft||cutDraft||manualDraft);}
    const edit=action(uiText('Spline bearbeiten'),()=>{try{beginCurveDraft(before.mesh,step.targets,step.id,step.params,chosen);}catch(e){notice(e.message);}});edit.disabled=curveSearchBusy||before.failed||Boolean(curveDraft||cutDraft||manualDraft);
    const auto=action(curveSearchBusy?uiText('Verlauf wird gesucht …'):uiText('Automatisch einstellen'),async()=>{
      try{const params=await searchCurve(before.mesh,[...step.targets],step.id,step.params);step.params=params;viewEnd=null;update(true);notice(uiText('Gültiger Startpunkt gefunden. Alle Werte bleiben rechts editierbar.'));}
      catch(e){notice(e.message);}
    });
    auto.disabled=curveSearchBusy||before.failed||!before.mesh||Boolean(curveDraft||cutDraft||manualDraft);
  }
  $('step-actions').replaceChildren(actions);
  $('step-message').textContent=uiText(result.states[chosen]?.message)||uiText('Änderungen werden auf die folgenden Schritte angewendet.');
  $('end').disabled=viewEnd===null;
  $('plane-cut').disabled=Boolean(curveDraft||cutDraft||manualDraft)||result.failed||viewEnd!==null||project.steps.length>=200;
  $('split-band').disabled=Boolean(curveDraft||cutDraft||manualDraft)||result.failed||selectedFaces.length<1||viewEnd!==null||project.steps.length>=200;
  $('remove-part').disabled=Boolean(curveDraft||cutDraft||manualDraft)||result.failed||activeSelection().length<1||viewEnd!==null||project.steps.length>=200;
  $('extrude').disabled=Boolean(curveDraft||cutDraft||manualDraft)||selectedFaces.length<1||result.failed||viewEnd!==null||project.steps.length>=200;
  $('extrude-region').disabled=Boolean(curveDraft||cutDraft||manualDraft)||selectedFaces.length<1||result.failed||viewEnd!==null||project.steps.length>=200;
  $('face-transform').disabled=Boolean(curveDraft||cutDraft||manualDraft)||!singleFace||result.failed||viewEnd!==null||project.steps.length>=200;
  $('curved-bridge').textContent=curveSearchBusy?uiText('Brückenverlauf wird gesucht …'):uiText('⌒ Gekrümmte Brücke');
  const degrees=selectedFaces.map(id=>result.mesh?.faces.find(f=>f.id===id)?.vertices.length);
  const curveUnsupported=degrees.length===2&&(![3,4].includes(degrees[0])||![3,4].includes(degrees[1]));
  const curveHelp=curveUnsupported?uiText('Ein Dreieck oder Viereck pro Endfläche auswählen.'):uiText('Zwischen ebenen Dreiecken und Vierecken, auch gemischt und bei anderer Ausrichtung. Spline-Vorschau ziehen, dann Brückennetz übernehmen.');
  $('curved-bridge').title=curveHelp;$('curved-bridge').setAttribute('aria-description',curveHelp);
  $('curved-bridge').disabled=Boolean(curveDraft||cutDraft||manualDraft)||curveSearchBusy||curveUnsupported||selectedFaces.length!==2||result.failed||viewEnd!==null||project.steps.length>=200;
  $('tunnel').disabled=Boolean(curveDraft||cutDraft||manualDraft)||selectedFaces.length!==2||result.failed||viewEnd!==null||project.steps.length>=200;
  $('punch-faces').disabled=Boolean(curveDraft||cutDraft||manualDraft)||selectionMode!=='face'||selectedFaces.length<1||selectedFaces.length>128||result.failed||viewEnd!==null||project.steps.length>=200;
  $('bridge').disabled=Boolean(curveDraft||cutDraft||manualDraft)||selectedFaces.length!==2||result.failed||viewEnd!==null||project.steps.length>=200;
  let openingReady=false,openingHelp=uiText('Außenflächen einer bestehenden Schale auswählen; für größere Gruppen „Flächengruppe“ einschalten.');
  if(!result.failed&&selectedFaces.length)try{openingSource(result.mesh,selectedFaces);openingReady=true;}catch(e){openingHelp=e.message;}
  $('shell-open').title=openingHelp;$('shell-open').setAttribute('aria-description',openingHelp);
  $('shell-open').disabled=Boolean(curveDraft||cutDraft||manualDraft)||!openingReady||viewEnd!==null||project.steps.length>=200;
  $('shell').disabled=Boolean(curveDraft||cutDraft||manualDraft)||result.failed||selectedFaces.length>2||viewEnd!==null||project.steps.length>=200;
  $('subdivide-faces').disabled=Boolean(curveDraft||cutDraft||manualDraft)||result.failed||selectionMode!=='face'||selectedFaces.length<1||selectedFaces.length>32||viewEnd!==null||project.steps.length>=200;
  $('bevel-edges').disabled=Boolean(curveDraft||cutDraft||manualDraft)||result.failed||selectionMode!=='edge'||selectedElements.length<1||viewEnd!==null||project.steps.length>=200;
  $('split-edges').disabled=Boolean(curveDraft||cutDraft||manualDraft)||result.failed||selectionMode!=='edge'||selectedElements.length<1||viewEnd!==null||project.steps.length>=200;
  $('dissolve-edges').disabled=Boolean(curveDraft||cutDraft||manualDraft)||result.failed||selectionMode!=='edge'||selectedElements.length<1||viewEnd!==null||project.steps.length>=200;
  $('truncate-vertices').disabled=Boolean(curveDraft||cutDraft||manualDraft)||result.failed||selectionMode!=='vertex'||selectedElements.length<1||viewEnd!==null||project.steps.length>=200;
  $('move-vertices').disabled=Boolean(curveDraft||cutDraft||manualDraft)||result.failed||selectionMode!=='vertex'||selectedElements.length<1||viewEnd!==null||project.steps.length>=200;
  $('truncate').disabled=Boolean(curveDraft||cutDraft||manualDraft)||result.failed||viewEnd!==null||project.steps.length>=200;
  $('stellate').disabled=Boolean(curveDraft||cutDraft||manualDraft)||result.failed||selectedFaces.length<1||selectedFaces.length>32||viewEnd!==null||project.steps.length>=200;
  $('wire-model').disabled=Boolean(curveDraft||cutDraft||manualDraft)||result.failed||viewEnd!==null||project.steps.length>=200;
  $('dual').disabled=Boolean(curveDraft||cutDraft||manualDraft)||result.failed||viewEnd!==null||project.steps.length>=200;
  $('doo-sabin').disabled=Boolean(curveDraft||cutDraft||manualDraft)||result.failed||viewEnd!==null||project.steps.length>=200;
  $('honeycomb').disabled=Boolean(curveDraft||cutDraft||manualDraft)||result.failed||viewEnd!==null||project.steps.length>=200;
  $('triangulate').disabled=Boolean(curveDraft||cutDraft||manualDraft)||result.failed||selectionMode!=='face'||viewEnd!==null||project.steps.length>=200;
  $('new').disabled=Boolean(manualDraft);$('open').disabled=Boolean(manualDraft);
  $('manual-edit').disabled=Boolean(curveDraft||cutDraft||manualDraft)||result.failed||viewEnd!==null||project.steps.length>=200;
  const triangleMesh=result.mesh?.faces.every(f=>f.vertices.length===3);
  $('loop').disabled=Boolean(curveDraft||cutDraft||manualDraft)||result.failed||!triangleMesh||viewEnd!==null||project.steps.length>=200;
  $('loop').title=triangleMesh?uiText('Loop glättet das gesamte geschlossene Dreiecksnetz. 1–2 Stufen in der Timeline.'):uiText('Zuerst das gesamte Modell triangulieren: Auswahl leeren, dann Triangulieren wählen.');
  $('subdivide').disabled=Boolean(curveDraft||cutDraft||manualDraft)||result.failed||viewEnd!==null||project.steps.length>=200;
  renderSelection();
  if(result.mesh){const stats=meshTopology(curveDraft?.mesh||result.mesh);$('stats').textContent=uiText`${stats.vertices} Punkte · ${stats.faces} Flächen · ${stats.components>1?stats.components+uiText(' Hüllen · Genus gesamt '):uiText('Genus ')}${stats.genus}`;}
  if(cutDraft)$('history-info').textContent+=uiText(' · Schnittvorschau (nicht übernommen)');
  if(curveDraft)$('history-info').textContent+=uiText(' · Pfadvorschau (nicht übernommen)');
  if(result.failed) $('history-info').textContent+=uiText(' · Fehler: letzter gültiger Zustand sichtbar');
  refreshPlaybackControls();
  if(manualDraft)refreshManualDraft();else if(curveDraft)refreshCurveDraft();else draw();
}
let multiSelect=false,selectionLimit=2;
function renderSelection(){
  const items=activeSelection(),limit=selectionMode==='face'?selectionLimit:32,label=selectionMode==='face'?uiText('Flächen'):selectionMode==='edge'?uiText('Kanten'):uiText('Punkte');
  for(const mode of ['face','edge','vertex']){$('select-'+mode).setAttribute('aria-pressed',String(selectionMode===mode));$('select-'+mode).disabled=Boolean(curveDraft||cutDraft||manualDraft);}
  $('group-select').hidden=selectionMode!=='face';$('all-faces').hidden=selectionMode!=='face';$('all-faces').disabled=Boolean(curveDraft||cutDraft||manualDraft);
  for(const id of ['select-connected','select-coplanar','grow-selection']){$(id).hidden=selectionMode!=='face';$(id).disabled=Boolean(curveDraft||cutDraft||manualDraft)||result.failed||selectedFaces.length===0;}
  $('select-ring').hidden=selectionMode!=='edge';$('select-ring').disabled=Boolean(curveDraft||cutDraft||manualDraft)||result.failed||selectedElements.length===0;
  $('selection').textContent=items.length?uiText`${items.length} von ${limit} ${label} ausgewählt`:uiText('Keine Auswahl');
  $('selection-count').textContent=`${items.length} / ${limit}`;
  $('selected-faces').replaceChildren();
  items.forEach((id,i)=>{
    const row=document.createElement('li');row.className='selected-face '+(i===0?'face-a':'face-b');
    const badge=document.createElement('span');badge.className='face-badge';badge.textContent=i<2?'AB'[i]:String(i+1);
    const name=document.createElement('span');name.className='face-id';name.textContent=selectionMode==='edge'?JSON.parse(id).join(' ↔ '):id;
    const remove=document.createElement('button');remove.textContent='×';remove.setAttribute('aria-label',uiText`Fläche ${i<2?'AB'[i]:String(i+1)} abwählen`);remove.onclick=()=>{if(selectionMode==='face')selectedFaces=selectedFaces.filter(face=>face!==id);else selectedElements=selectedElements.filter(x=>x!==id);update();};
    row.append(badge,name,remove);$('selected-faces').append(row);
  });
  $('clear-selection').disabled=items.length===0;
  $('focus-selection').disabled=items.length===0;
  $('multi-select').title=selectionLimit>2?uiText('Flächengruppe aktiv: Antippen ergänzt oder entfernt beliebig viele Flächen innerhalb der Netzgrenzen.'):items.length===2?uiText('Zwei Flächen ausgewählt: gerade oder gekrümmte Brücke wählen.'):multiSelect?uiText('Mehrfachauswahl aktiv: Klicken ergänzt eine Fläche oder wählt sie ab.'):uiText('Umschalt+Klick ergänzt die zweite Fläche oder wählt eine Fläche ab.');
  $('multi-select').setAttribute('aria-description',$('multi-select').title);
  $('multi-select').disabled=selectionMode==='face'&&selectionLimit>2;
  if(selectionMode!=='face')$('multi-select').title=uiText('Mehrfachauswahl: bis zu 32 Elemente per Antippen sammeln; Umschalt+Klick ergänzt ebenfalls.');
  $('group-select').setAttribute('aria-pressed',String(selectionLimit>2));$('group-select').textContent=uiText('Flächengruppe: ')+(selectionLimit>2?uiText('an'):uiText('aus'));
  $('multi-select').setAttribute('aria-pressed',String(multiSelect));
  $('multi-select').textContent=uiText('Mehrfachauswahl: ')+(multiSelect?uiText('an'):uiText('aus'));
}
for(const mode of ['face','edge','vertex'])$('select-'+mode).onclick=()=>{if(curveDraft||cutDraft||manualDraft)return;selectionMode=mode;selectedFaces=[];selectedElements=[];update();};
$('clear-selection').onclick=()=>{referenceSelection=null;selectedFaces=[];selectedElements=[];update();};
$('all-faces').onclick=()=>{if(curveDraft||cutDraft||manualDraft||selectionMode!=='face')return;selectionLimit=32000;multiSelect=true;selectedFaces=result.mesh.faces.map(f=>f.id);update();};
for(const [id,mode] of [['select-connected','connected'],['select-coplanar','coplanar'],['grow-selection','grow']])$(id).onclick=()=>{
  if($(id).disabled||selectionMode!=='face')return;
  try{const next=expandFaceSelection(result.mesh,selectedFaces,mode);selectedFaces=next;selectionLimit=32000;multiSelect=true;referenceSelection=null;update();notice(uiText`${next.length} Flächen ausgewählt.`);}catch(e){notice(e.message);}
};
$('select-ring').onclick=()=>{
  if($('select-ring').disabled||selectionMode!=='edge')return;
  try{const next=selectEdgeRing(result.mesh,selectedElements.map(id=>JSON.parse(id)));selectedElements=next.map(e=>edgeId(...e));multiSelect=true;referenceSelection=null;update();notice(uiText`${next.length} Kanten ausgewählt. Ring läuft über gegenüberliegende Viereckkanten; Ende an Dreiecken und anderen Polygonen.`);}catch(e){notice(e.message);}
};
$('group-select').onclick=()=>{selectionLimit=selectionLimit===2?32000:2;multiSelect=true;selectedFaces=selectedFaces.slice(0,selectionLimit);update();};
$('multi-select').onclick=()=>{multiSelect=!multiSelect;update();};
canvas.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();stopTimelinePlayback();if(manualDraft){manualDraft.faces=[];manualDraft.path=[];refreshManualDraft();return;}if(cutDraft)cancelCutDraft();else if(curveDraft)cancelCurveDraft();else {selectedFaces=[];selectedElements=[];}update();}});
function frame(points){cancelNavigation();const bounds=viewBounds(points);center=bounds.center;radius=bounds.radius;zoom=1;pan=[0,0];draw();}
function fit(){if(result?.mesh)frame(manualDraft?Object.values(manualDraft.mesh.vertices):cutDraft?Object.values(cutDraft.mesh.vertices):curveDraft?[...Object.values(curveDraft.mesh.vertices),...curveDraft.preview.points,...Object.values(curveDraft.preview.handles)]:Object.values(result.mesh.vertices));}
function focusSelection(){if(curveDraft){fit();return;}if(!activeSelection().length)return;const ids=new Set(selectionMode==='vertex'?selectedElements:selectionMode==='edge'?selectedElements.flatMap(id=>JSON.parse(id)):result.mesh.faces.filter(f=>selectedFaces.includes(f.id)).flatMap(f=>f.vertices));frame([...ids].map(id=>result.mesh.vertices[id]));notice(uiText('Auswahl fokussiert. Drehpunkt liegt jetzt im Zentrum der Auswahl.'));}
function rotate(p){const x=p[0]*Math.cos(yaw)+p[2]*Math.sin(yaw),z=-p[0]*Math.sin(yaw)+p[2]*Math.cos(yaw),y=p[1]*Math.cos(pitch)-z*Math.sin(pitch),depth=p[1]*Math.sin(pitch)+z*Math.cos(pitch);return [x*Math.cos(roll)-y*Math.sin(roll),x*Math.sin(roll)+y*Math.cos(roll),depth];}
function draw(){
  const w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
  if(!w||!h||!result?.mesh)return;
  if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const scale=Math.min(w,h)*0.32*zoom/radius;
  const projectPoint=p=>{const v=rotate(p.map((n,i)=>n-center[i]));return [w/2+pan[0]+v[0]*scale,h/2+pan[1]-v[1]*scale,v[2]];};
  // Orthographic navigation grid.
  ctx.strokeStyle='#5b798218';ctx.lineWidth=1;
  for(let i=-6;i<=6;i++){for(const points of [[[i*radius/2,-radius,-3*radius],[i*radius/2,-radius,3*radius]],[[-3*radius,-radius,i*radius/2],[3*radius,-radius,i*radius/2]]]){const [a,b]=points.map(p=>projectPoint(p.map((v,j)=>v+center[j])));ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}}
  const playbackFaces=new Set(timelinePlayback?.previewFaces||[]);
  const visibleMesh=manualDraft?manualDraft.mesh:cutDraft?(cutDraft.output||cutDraft.mesh):(curveDraft?.mesh||result.mesh);
  polygons=visibleMesh.faces.map(f=>{const pts=f.vertices.map(id=>projectPoint(visibleMesh.vertices[id]));return {f,pts,z:pts.reduce((s,p)=>s+p[2],0)/pts.length,n:rotate(normal(visibleMesh,f))};}).filter(p=>manualDraft||p.n[2]>0.000001).sort((a,b)=>a.z-b.z);
  elementCandidates=[];
  for(const {f,pts,n} of polygons){
    ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
    const selected=manualDraft?manualDraft.faces.indexOf(f.id):cutDraft?-1:selectedFaces.indexOf(f.id),light=0.48+0.5*Math.max(0,dot(n,[-.3,.6,.74]));
    ctx.fillStyle=selected===0?`rgb(${90*light+30},${190*light+35},${162*light+35})`:selected>=1?`rgb(${220*light+30},${145*light+30},${65*light+30})`:`rgb(${116*light+20},${146*light+25},${160*light+25})`;
    if(playbackFaces.has(f.id))ctx.fillStyle='#ffca75';
    if(manualDraft&&n[2]<0)ctx.fillStyle=selected>=0?'#edca86':'#b77952';
    if(cutDraft&&cutDraft.output)ctx.fillStyle=f.id.includes('_opposite')?'#bb9369':'#70a69b';
    ctx.fill();
    if($('wire').checked||selected>=0){ctx.strokeStyle=selected===0?'#b1ffe5':selected>=1?'#ffd19a':'#192b34';ctx.lineWidth=selected>=0?2.5:1.2;ctx.setLineDash(selected>=1?[6,3]:[]);ctx.stroke();ctx.setLineDash([]);}
    if(selected>=0){const cx=pts.reduce((sum,p)=>sum+p[0],0)/pts.length,cy=pts.reduce((sum,p)=>sum+p[1],0)/pts.length;ctx.font='bold 14px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=4;ctx.strokeStyle='#15252b';ctx.strokeText(selected<2?'AB'[selected]:String(selected+1),cx,cy);ctx.fillStyle='#fff';ctx.fillText(selected<2?'AB'[selected]:String(selected+1),cx,cy);ctx.textAlign='start';ctx.textBaseline='alphabetic';}
    if(!curveDraft&&!cutDraft&&(manualDraft?manualDraft.mode==='vertex':selectionMode!=='face')){
      const elementMode=manualDraft?'vertex':selectionMode;
      for(let i=0;i<pts.length;i++){
        const a=pts[i],b=pts[(i+1)%pts.length],id=elementMode==='vertex'?f.vertices[i]:edgeId(f.vertices[i],f.vertices[(i+1)%pts.length]),on=manualDraft?manualDraft.path.includes(id):selectedElements.includes(id);
        elementCandidates.push({id,a,b:elementMode==='vertex'?a:b});ctx.strokeStyle=on?'#ffca75':'#263b46';ctx.fillStyle=on?'#ffca75':'#c2dce6';ctx.lineWidth=on?4:1.5;
        ctx.beginPath();if(elementMode==='vertex'){ctx.arc(a[0],a[1],on?6:4,0,Math.PI*2);ctx.fill();ctx.stroke();}else{ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
      }
    }

  }
  if(manualDraft){
    const d=manualDraft;ctx.strokeStyle='#ffbd65';ctx.lineWidth=3;for(const [a,b] of d.boundary){const p=projectPoint(d.mesh.vertices[a]),q=projectPoint(d.mesh.vertices[b]);ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();}
    if(d.mode==='vertex'){
      if(d.path.length){ctx.beginPath();d.path.forEach((id,i)=>{const p=projectPoint(d.mesh.vertices[id]);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);});ctx.strokeStyle='#a9ffe3';ctx.lineWidth=3;ctx.stroke();}
    }
  }
  cutGrip=null;
  if(cutDraft){const d=cutDraft,raw=[d.params.nx,d.params.ny,d.params.nz],span=Math.hypot(...raw);
    if(span>1e-8&&raw.every(Number.isFinite)&&Number.isFinite(d.params.position)){
      const n=raw.map(v=>v/span),bounds=viewBounds(Object.values(d.mesh.vertices)),c=bounds.center.map((v,i)=>v+n[i]*(d.params.position-dot(n,bounds.center))),helper=Math.abs(n[0])<.8?[1,0,0]:[0,1,0],u=[n[1]*helper[2]-n[2]*helper[1],n[2]*helper[0]-n[0]*helper[2],n[0]*helper[1]-n[1]*helper[0]],ul=Math.hypot(...u),unit=u.map(v=>v/ul),v=[n[1]*unit[2]-n[2]*unit[1],n[2]*unit[0]-n[0]*unit[2],n[0]*unit[1]-n[1]*unit[0]],r=bounds.radius*1.15;
      const corners=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>projectPoint(c.map((x,i)=>x+r*(a*unit[i]+b*v[i]))));ctx.beginPath();corners.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();ctx.fillStyle=d.error?'#f3996b33':'#7ecfff33';ctx.fill();ctx.strokeStyle=d.error?'#ffb077':'#a1dfff';ctx.lineWidth=2;ctx.stroke();
      const origin=projectPoint(c),tip=projectPoint(c.map((x,i)=>x+n[i]*bounds.radius*.55)),screen=rotate(n);cutGrip={x:tip[0],y:tip[1],sx:screen[0],sy:-screen[1],scale};ctx.beginPath();ctx.moveTo(origin[0],origin[1]);ctx.lineTo(tip[0],tip[1]);ctx.stroke();ctx.beginPath();ctx.arc(tip[0],tip[1],10,0,Math.PI*2);ctx.fillStyle='#ecfaff';ctx.fill();ctx.strokeStyle='#173545';ctx.stroke();ctx.fillStyle='#e9faff';ctx.font='12px system-ui';ctx.fillText(uiText('Ebene verschieben'),tip[0]+14,tip[1]-10);
    }
  }
  curveHandles=[];
  if(curveDraft?.preview){
    const d=curveDraft,p=d.preview,line=(points,color,width=1,dashed=false)=>{ctx.beginPath();points.map(projectPoint).forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dashed?[5,5]:[]);ctx.stroke();ctx.setLineDash([]);};
    line([p.ca,p.cb],'#b7cbd577',1,true);line([p.ca,p.handles.a],'#91e8cc',1,true);line([p.cb,p.handles.b],'#ffd19a',1,true);
    if(d.sections){for(const section of d.sections)line([...section,section[0]],'#c7b7ff99',1);line(d.sections.map(section=>section[0]),'#e0bcff',2);}
    line(p.points,'#10232b',6);line(p.points,d.error||d.sectionError?'#ffb077':'#bcfff0',3);
    for(const [key,label,color] of [['a','A','#91e8cc'],['b','B','#ffd19a'],['mid',uiText('Mitte'),'#f4f9ff'],...(d.params.pathPoints||[]).map((q,i)=>[`p:${q.t}`,'P'+(i+1),'#bfc9ff'])]){
      const q=projectPoint(p.handles[key]);curveHandles.push({key,x:q[0],y:q[1]});ctx.beginPath();ctx.arc(q[0],q[1],key==='mid'?9:7,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();ctx.strokeStyle='#122b35';ctx.lineWidth=2;ctx.stroke();ctx.font='bold 12px system-ui';ctx.fillStyle=color;ctx.fillText(label,q[0]+12,q[1]-10);
    }
  }
  ctx.lineWidth=1;
  const origin=[w-48,h-60];for(const [v,color,label] of [[[1,0,0],'#e79987','X'],[[0,1,0],'#a5dbaa','Y'],[[0,0,1],'#86bce3','Z']]){const p=rotate(v);ctx.strokeStyle=color;ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(...origin);ctx.lineTo(origin[0]+p[0]*28,origin[1]-p[1]*28);ctx.stroke();ctx.font='10px system-ui';ctx.fillText(label,origin[0]+p[0]*36,origin[1]-p[1]*36);}
}
// Screen-space picking with interpolated depth; hidden elements cannot win.
function pickElement(x,y,tolerance){
  const hidden=(x,y,z)=>polygons.some(({pts})=>{
    for(let i=1;i<pts.length-1;i++){
      const [a,b,c]=[pts[0],pts[i],pts[i+1]],den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);if(Math.abs(den)<1e-9)continue;
      const u=((b[1]-c[1])*(x-c[0])+(c[0]-b[0])*(y-c[1]))/den,v=((c[1]-a[1])*(x-c[0])+(a[0]-c[0])*(y-c[1]))/den;
      if(u>=-1e-7&&v>=-1e-7&&u+v<=1+1e-7&&u*a[2]+v*b[2]+(1-u-v)*c[2]>z+radius*1e-6)return true;
    }return false;
  });
  let best=null,distance=tolerance,depth=-Infinity;
  for(const {id,a,b} of elementCandidates){const dx=b[0]-a[0],dy=b[1]-a[1],len=dx*dx+dy*dy,t=len?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/len)):0,q=[a[0]+t*dx,a[1]+t*dy,a[2]+t*(b[2]-a[2])],d=Math.hypot(x-q[0],y-q[1]);if(d>distance+1e-7||hidden(...q))continue;if(d<distance-1e-7||q[2]>depth){best=id;distance=d;depth=q[2];}}
  return best;
}
let drag=null;
const touchPoints=new Map();let touchGesture=null;
function endDrag(){drag=null;canvas.style.cursor='';}
function cancelNavigation(){endDrag();touchPoints.clear();touchGesture=null;}
function beginTouchGesture(){
  const [a,b]=[...touchPoints.values()];
  touchGesture={mid:[(a[0]+b[0])/2,(a[1]+b[1])/2],distance:Math.hypot(b[0]-a[0],b[1]-a[1]),zoom,pan:[...pan]};
}
function moveTouchGesture(){
  const [a,b]=[...touchPoints.values()],mid=[(a[0]+b[0])/2,(a[1]+b[1])/2],distance=Math.hypot(b[0]-a[0],b[1]-a[1]),g=touchGesture;
  // Rebase nearly coincident fingers rather than dividing by a tiny distance.
  if(g.distance<8||distance<8){beginTouchGesture();return;}
  zoom=Math.max(.15,Math.min(8,g.zoom*distance/g.distance));const ratio=zoom/g.zoom;
  // Keep the model point under the initial finger midpoint under the new one.
  pan=mid.map((v,i)=>v-[canvas.clientWidth/2,canvas.clientHeight/2][i]-ratio*(g.mid[i]-[canvas.clientWidth/2,canvas.clientHeight/2][i]-g.pan[i]));
  draw();
}
function releaseTouch(id){
  if(!touchPoints.delete(id))return false;
  if(touchGesture){
    endDrag();
    if(touchPoints.size>=2)beginTouchGesture();
    else{
      touchGesture=null;
      if(touchPoints.size){const [pointerId,local]=touchPoints.entries().next().value,bounds=canvas.getBoundingClientRect(),point=[local[0]+bounds.left,local[1]+bounds.top];drag={id:pointerId,button:0,mode:'orbit',start:[...point],last:[...point],moved:true};}
    }
  }
  return true;
}
canvas.onpointerdown=e=>{
  stopTimelinePlayback();
  if(e.pointerType==='touch'){
    if(!touchPoints.size&&drag)return;
    const bounds=canvas.getBoundingClientRect();touchPoints.set(e.pointerId,[e.clientX-bounds.left,e.clientY-bounds.top]);
    e.preventDefault();canvas.focus({preventScroll:true});canvas.setPointerCapture(e.pointerId);
    if(touchPoints.size>=2){if(drag?.mode==='cut')refreshCutDraft();endDrag();beginTouchGesture();return;}
  }else if(touchPoints.size)return;
  if(drag)return;
  if(cutDraft&&cutGrip&&e.button===0&&!e.shiftKey){const bounds=canvas.getBoundingClientRect(),x=e.clientX-bounds.left,y=e.clientY-bounds.top;if(Math.hypot(cutGrip.x-x,cutGrip.y-y)<20){
    if(cutGrip.sx**2+cutGrip.sy**2<.02){notice(uiText('Zum Verschieben die Ansicht etwas seitlich drehen oder Position numerisch ändern.'));return;}
    e.preventDefault();canvas.focus({preventScroll:true});canvas.setPointerCapture(e.pointerId);drag={id:e.pointerId,mode:'cut',start:[e.clientX,e.clientY],position:cutDraft.params.position,grip:{...cutGrip}};return;
  }}
  if(curveDraft&&e.button===0&&!e.shiftKey){
    const bounds=canvas.getBoundingClientRect(),x=e.clientX-bounds.left,y=e.clientY-bounds.top;
    const hit=[...curveHandles].reverse().find(h=>Math.hypot(h.x-x,h.y-y)<15);
    if(hit){e.preventDefault();canvas.focus({preventScroll:true});canvas.setPointerCapture(e.pointerId);drag={id:e.pointerId,mode:'curve',handle:hit.key,start:[e.clientX,e.clientY],params:structuredClone(curveDraft.params),preview:curveDraft.preview,view:{yaw,pitch,roll,scale:Math.min(canvas.clientWidth,canvas.clientHeight)*.32*zoom/radius}};return;}
  }
  const mode=navigationGesture(e.button,e.shiftKey);if(!mode)return;
  e.preventDefault();canvas.focus({preventScroll:true});canvas.setPointerCapture(e.pointerId);
  drag={id:e.pointerId,button:e.button,mode,additive:e.shiftKey||multiSelect,start:[e.clientX,e.clientY],last:[e.clientX,e.clientY],moved:false};
};
canvas.onpointermove=e=>{
  if(touchPoints.has(e.pointerId)){
    const bounds=canvas.getBoundingClientRect();touchPoints.set(e.pointerId,[e.clientX-bounds.left,e.clientY-bounds.top]);
    if(touchGesture){e.preventDefault();moveTouchGesture();return;}
  }
  if(!drag||drag.id!==e.pointerId)return;
  if(drag.mode==='cut'){if(!cutDraft){endDrag();return;}const g=drag.grip,dx=e.clientX-drag.start[0],dy=e.clientY-drag.start[1];cutDraft.params.position=drag.position+(dx*g.sx+dy*g.sy)/(g.scale*(g.sx*g.sx+g.sy*g.sy));cutDraft.pending=true;refreshCutDraft(false);return;}
  if(drag.mode==='curve'){
    if(!curveDraft){endDrag();return;}
    curveDraft.params=dragCurveHandle(drag.params,drag.preview,drag.handle,e.clientX-drag.start[0],e.clientY-drag.start[1],drag.view);curveDraft.revision++;curveDraft.error='';canvas.style.cursor='grabbing';refreshCurveDraft();return;
  }
  const previous=drag.moved?drag.last:drag.start;
  if(Math.hypot(e.clientX-drag.start[0],e.clientY-drag.start[1])>4)drag.moved=true;
  if(drag.moved){const dx=e.clientX-previous[0],dy=e.clientY-previous[1];
    if(drag.mode==='pan'){pan[0]+=dx;pan[1]+=dy;canvas.style.cursor='grabbing';}
    else{yaw+=dx*.008;pitch=(pitch+dy*.008)%(Math.PI*2);canvas.style.cursor='move';}draw();
  }
  drag.last=[e.clientX,e.clientY];
};
canvas.onpointerup=e=>{
  const multi=Boolean(touchGesture);releaseTouch(e.pointerId);if(multi)return;
  if(!drag||drag.id!==e.pointerId)return;
  if(drag.mode==='cut'){endDrag();refreshCutDraft();return;}
  if(drag.mode==='curve'){endDrag();return;}
  if(!drag.moved&&drag.button===0&&manualDraft){
    const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
    if(manualDraft.mode==='vertex'){const id=pickElement(x,y,e.pointerType==='touch'?16:10);if(id)manualPickVertex(id);}
    else{let picked=null;for(const {f,pts} of polygons){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();if(ctx.isPointInPath(x*(canvas.width/canvas.clientWidth),y*(canvas.height/canvas.clientHeight)))picked=f.id;}if(picked){manualDraft.faces=manualDraft.faces.includes(picked)?manualDraft.faces.filter(f=>f!==picked):[...manualDraft.faces,picked];refreshManualDraft();}}
    endDrag();return;
  }
  if(!drag.moved&&drag.button===0&&!curveDraft&&!cutDraft){
    const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;let picked=null;
    if(selectionMode==='face'){
    for(const {f,pts} of polygons){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();if(ctx.isPointInPath(x*(canvas.width/canvas.clientWidth),y*(canvas.height/canvas.clientHeight)))picked=f.id;}
    const next=selectFaces(selectedFaces,picked,drag.additive,selectionLimit);selectedFaces=next.faces;
    if(next.limitReached)notice(uiText`Es sind bereits ${selectionLimit} Flächen ausgewählt. Abwählen oder für Öffnungen „Flächengruppe“ einschalten.`);
    }else{picked=pickElement(x,y,e.pointerType==='touch'?16:10);const next=selectFaces(selectedElements,picked,drag.additive,32);selectedElements=next.faces;if(next.limitReached)notice(uiText('Maximal 32 Elemente auswählen.'));}
    update();
  }
  endDrag();
};
function cancelPointer(e){const wasCut=drag?.id===e.pointerId&&drag.mode==='cut';if(wasCut&&cutDraft?.pending)refreshCutDraft();const multi=Boolean(touchGesture);releaseTouch(e.pointerId);if(!multi&&drag?.id===e.pointerId)endDrag();}
canvas.onpointercancel=cancelPointer;canvas.onlostpointercapture=cancelPointer;
window.addEventListener('blur',()=>{if(cutDraft?.pending)refreshCutDraft();cancelNavigation();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopTimelinePlayback();if(cutDraft?.pending)refreshCutDraft();cancelNavigation();}});
canvas.addEventListener('auxclick',e=>{if(e.button===1)e.preventDefault();});
canvas.addEventListener('wheel',e=>{stopTimelinePlayback();e.preventDefault();if(drag?.mode==='curve')return;zoom=Math.min(8,Math.max(.15,zoom*Math.exp(-e.deltaY*.001)));draw();},{passive:false});
$('wire').onchange=draw;$('fit').onclick=fit;$('focus-selection').onclick=focusSelection;
$('version-link').textContent=APP_VERSION+' · ALPHA';
$('version-link').onclick=e=>{e?.preventDefault();$('changelog-dialog').showModal();};
$('changelog-close').onclick=()=>$('changelog-dialog').close();
$('about-version').textContent=`Version ${APP_VERSION} · Alpha`;
$('about').onclick=()=>{stopTimelinePlayback();$('about-dialog').showModal();};
$('about-close').onclick=()=>$('about-dialog').close();
if(globalThis.location?.hash==='#changelog')$('changelog-dialog').showModal();
$('reset-view').onclick=()=>{yaw=-.55;pitch=.42;roll=0;fit();};
canvas.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='f'){e.preventDefault();if(activeSelection().length)focusSelection();else fit();}else if(e.key==='Home'){e.preventDefault();fit();}});
function partSelection(mesh,mode,faces,elements){if(mode==='face')return [...new Set(faces.map(id=>{const f=mesh.faces.find(f=>f.id===id);if(!f)throw new Error(uiText('Bezugsfläche fehlt.'));return f.vertices[0];}))];if(mode==='edge')return [...new Set(elements.flatMap(id=>JSON.parse(id)))];return [...elements];}
$('plane-cut').onclick=()=>{if($('plane-cut').disabled)return;const bounds=viewBounds(Object.values(result.mesh.vertices));beginCutDraft(result.mesh,toolParams('plane_cut',{nx:0,ny:1,nz:0,position:bounds.center[1],side:'both'}));};
$('split-band').onclick=()=>{
  if($('split-band').disabled)return;try{const step={id:'s'+crypto.randomUUID(),type:'split_face_band',enabled:true,params:{groups:packFaceGroups(selectedFaces)}};splitFaceBand(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;selectedFaces=[];update(true);notice(uiText('Markierte Flächen entfernt und entstandene Ränder geschlossen.'));}catch(e){notice(e.message);}
};
$('remove-part').onclick=()=>{
  if($('remove-part').disabled)return;try{const refs=partSelection(result.mesh,selectionMode,selectedFaces,selectedElements),step={id:'s'+crypto.randomUUID(),type:'remove_parts',enabled:true,params:{groups:packFaceGroups(refs)}};removeParts(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;selectedFaces=[];update(true);notice(uiText('Markierte zusammenhängende Teile gelöscht.'));}catch(e){notice(e.message);}
};
$('extrude').onclick=()=>{if($('extrude').disabled)return;try{const group=selectedFaces.length>1,step={id:'s'+crypto.randomUUID(),type:group?'extrude_group':'extrude',enabled:true,params:toolParams('extrude',{distance:1})};if(!group&&(step.params.distance<0||(step.params.scale??1)!==1||(step.params.angle??0)!==0))step.type='extrude_shape';if(group){step.params.groups=packFaceGroups(selectedFaces);extrudeGroup(result.mesh,step);}else step.target=selectedFaces[0];project.steps.push(step);chosen=project.steps.length-1;selectedFaces=group?groupExtrudeCaps(step):[step.id+'/cap'];update(true);}catch(e){notice(e.message);}};
$('extrude-region').onclick=()=>{
  if($('extrude-region').disabled)return;
  try{const [nx,ny,nz]=regionDirection(result.mesh,selectedFaces),step={id:'s'+crypto.randomUUID(),type:'extrude_region',enabled:true,params:{...toolParams('extrude_region',{distance:1,nx,ny,nz}),groups:packFaceGroups(selectedFaces)}};
    extrudeRegion(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;selectedFaces=regionExtrudeCaps(step);selectionLimit=32000;update(true);notice(uiText('Region gemeinsam extrudiert. Länge und Richtung rechts ändern.'));
  }catch(e){notice(e.message);}
};
$('face-transform').onclick=()=>{
  if($('face-transform').disabled)return;
  try{
    const step={id:'s'+crypto.randomUUID(),type:'face_transform',enabled:true,target:selectedFaces[0],params:toolParams('face_transform',{scale:1,angle:0})};
    transformFace(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;update(true);
    notice(uiText('Formschritt angelegt. Rechts Skalierung und Drehwinkel einstellen.'));
  }catch(e){notice(e.message);}
};
// The worker is packaged inside this existing asset; no extra runtime files.
const punchWorkerSource=`self.onmessage=async({data:d})=>{
  let loaded=false;
  try{
    const k=await import(d.kernelUrl);loaded=true;
    const step=d.candidate.steps[d.index],plan=k.punchPlan(d.before.mesh,step.params.groups.flat(2));
    if(!plan.cuts.length)throw new Error('Keine passende Stanzfläche: '+(plan.skipped[0]?.message||''));
    if(step.enabled===false)k.punchFaces(d.before.mesh,step);
    const value=k.evaluate(d.candidate),state=value.states[d.index];
    if(state?.status==='error'||state?.status==='blocked')throw new Error(state.message);
    self.postMessage({ok:true,value,stats:{cuts:plan.cuts.length,skipped:plan.skipped.length,message:plan.skipped[0]?.message||''}});
  }catch(e){self.postMessage({ok:false,error:e.message,unavailable:!loaded});}
};`;
async function punchCalculation(candidate,before,index){
  if(typeof Worker==='function'&&typeof Blob==='function'&&typeof URL==='function'){
    try{return await new Promise((resolve,reject)=>{
      let worker,url;const clean=()=>{worker?.terminate();if(url)URL.revokeObjectURL(url);};
      try{url=URL.createObjectURL(new Blob([punchWorkerSource],{type:'text/javascript'}));worker=new Worker(url,{type:'module'});
        worker.onmessage=({data})=>{clean();if(data.ok)resolve(data);else reject(Object.assign(new Error(data.error),{unavailable:data.unavailable}));};
        worker.onerror=()=>{clean();reject(Object.assign(new Error(uiText('Berechnungsworker nicht verfügbar.')),{unavailable:true}));};
        worker.onmessageerror=worker.onerror;worker.postMessage({candidate,before,index,kernelUrl:new URL('./kernel.mjs',document.baseURI).href});
      }catch(e){clean();reject(Object.assign(e,{unavailable:true}));}
    });}catch(e){if(!e.unavailable)throw e;}
  }
  // Older/restricted browsers still paint the dialog before the synchronous fallback.
  if(typeof requestAnimationFrame==='function')await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const step=candidate.steps[index],plan=punchPlan(before.mesh,step.params.groups.flat(2));if(!plan.cuts.length)throw new Error(uiText('Keine passende Stanzfläche: ')+(plan.skipped[0]?.message||''));
  if(step.enabled===false)punchFaces(before.mesh,step);const value=evaluate(candidate),state=value.states[index];if(state?.status==='error'||state?.status==='blocked')throw new Error(state.message);
  return {value,stats:{cuts:plan.cuts.length,skipped:plan.skipped.length,message:plan.skipped[0]?.message||''}};
}
async function runPunchCalculation(candidate,before,index){
  if(calculationBusy)return;const epoch=documentEpoch,serial=changeSerial,original=project,dialog=$('calculation-dialog'),wasDisabled=$('punch-faces').disabled;let committed=false;
  calculationBusy=true;$('punch-faces').disabled=true;$('calculation-label').textContent=uiText('Lochstanzen wird berechnet … Bitte warten.');dialog.showModal();
  try{
    // A paint opportunity makes the waiting state visible even for startup work.
    if(typeof requestAnimationFrame==='function')await new Promise(resolve=>requestAnimationFrame(resolve));
    const answer=await punchCalculation(candidate,before,index);
    if(documentEpoch!==epoch||changeSerial!==serial||project!==original){notice(uiText('Berechnung verworfen: Das Projekt wurde inzwischen geändert.'));return;}
    project=candidate;chosen=index;viewEnd=null;selectedFaces=[];calculationBusy=false;
    preparedEvaluation={project,end:project.steps.length-1,chosen,value:answer.value,before};update(true);committed=true;
    const stats=answer.stats;notice(uiText`${stats.cuts} Loch/Löcher gestanzt.${stats.skipped?' '+stats.skipped+uiText(' unpassende Fläche(n) übersprungen: ')+uiText(stats.message):''}`);
  }catch(e){notice(e.message);}finally{calculationBusy=false;dialog.close();if(!committed)$('punch-faces').disabled=wasDisabled||selectedFaces.length<1||selectedFaces.length>128||result.failed||viewEnd!==null;}
}
$('calculation-dialog').addEventListener('cancel',e=>e.preventDefault());
$('punch-faces').onclick=async()=>{
  if(calculationBusy||$('punch-faces').disabled)return;
  const step={id:'s'+crypto.randomUUID(),type:'punch_faces',enabled:true,params:{groups:packFaceGroups(selectedFaces)}},candidate={...project,steps:[...project.steps,step]};
  await runPunchCalculation(candidate,result,candidate.steps.length-1);
};
$('tunnel').onclick=()=>{
  if($('tunnel').disabled)return;
  try{const targets=[...selectedFaces],step={id:'s'+crypto.randomUUID(),type:'boolean_tunnel',enabled:true,targets,params:toolParams('boolean_tunnel',{size:.5})};booleanTunnel(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;selectedFaces=[];update(true);notice(uiText('Durchbruch angelegt. Lochgröße rechts ändern.'));}catch(e){notice(e.message);}
};
$('bridge').onclick=()=>{
  if($('bridge').disabled)return;
  try{
    const pair=selectedFaces.map(id=>result.mesh.faces.find(f=>f.id===id));
    if(pair.length===2&&pair.every(f=>f&&[3,4].includes(f.vertices.length))&&pair[0].vertices.length!==pair[1].vertices.length){const step={id:'s'+crypto.randomUUID(),type:'mixed_bridge',enabled:true,targets:[...selectedFaces],params:toolParams('mixed_bridge',{offset:bestMixedBridgeOffset(result.mesh,selectedFaces)})};mixedBridge(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;selectedFaces=[];update(true);notice(uiText('Dreieck–Viereck-Brücke angelegt. Zuordnung rechts ändern.'));return;}
    const step={id:'s'+crypto.randomUUID(),type:bridgePair(result.mesh,selectedFaces)[0].vertices.length===3?'triangle_bridge':'quad_bridge',enabled:true,targets:[...selectedFaces],params:toolParams('bridge',{offset:bestBridgeOffset(result.mesh,selectedFaces),segments:3,wallFaces:'quads'})};
    step.params.offset%=pair[0].vertices.length;if(step.type==='triangle_bridge')step.params.wallFaces='triangles';
    bridge(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;selectedFaces=[];update(true);notice(uiText('Brücke angelegt. Zuordnung und Segmente lassen sich rechts ändern.'));
  }catch(e){notice(e.message);}
};
$('curved-bridge').onclick=()=>{
  if($('curved-bridge').disabled)return;
  try{const corners=curvedBridgePair(result.mesh,selectedFaces).a.vertices.length,params=toolParams('curved_bridge',{segments:12,bendA:.5,bendB:.5,offset:closestCurvedBridgeOffset(result.mesh,selectedFaces),wallFaces:'quads'});params.offset%=corners;if(corners!==4)params.wallFaces='triangles';if(!toolMemory.has('curved_bridge')&&!toolMemory.has('bridge-common'))try{params.offset=bestCurvedBridgeOffset(result.mesh,selectedFaces,params);}catch{}beginCurveDraft(result.mesh,[...selectedFaces],'s'+crypto.randomUUID(),params);}
  catch(e){notice(e.message);}
};
$('subdivide').onclick=()=>{
  if($('subdivide').disabled)return;
  try{
    const step={id:'s'+crypto.randomUUID(),type:'subdivide',enabled:true,params:toolParams('subdivide',{levels:1})};
    subdivide(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;selectedFaces=[];update(true);
    notice(uiText('Modell geglättet. Rechts lässt sich die Stufenzahl auf 1 oder 2 einstellen.'));
  }catch(e){notice(e.message);}
};
function cancelManualDraft(restore=true){const d=manualDraft;if(!d)return;manualDraft=null;$('manual-editor').hidden=true;document.querySelector('.properties').classList.remove('manual-editing');if(restore){selectionMode=d.oldMode;selectedFaces=d.oldFaces;selectedElements=d.oldElements;}else{selectedFaces=[];selectedElements=[];}}
function beginManualDraft(mesh,params={},index=null){
  if(curveDraft||cutDraft||manualDraft)return;manualDraft={base:mesh,mesh,id:index===null?'s'+crypto.randomUUID():project.steps[index].id,index,params:structuredClone(params),faces:[],path:[],mode:'face',history:[],epoch:documentEpoch,serial:changeSerial,chosen,viewEnd,oldMode:selectionMode,oldFaces:[...selectedFaces],oldElements:[...selectedElements]};
  selectedFaces=[];selectedElements=[];$('manual-editor').hidden=false;document.querySelector('.properties').classList.add('manual-editing');update();refreshManualDraft();
}
function refreshManualDraft(){const d=manualDraft;if(!d)return;
  try{d.mesh=manualPatch(d.base,{id:d.id,params:d.params},{allowOpen:true});d.boundary=meshBoundary(d.mesh);d.error='';try{manualPatch(d.base,{id:d.id,params:d.params});d.closed=true;}catch(e){d.closed=false;d.error=e.message;}
  }catch(e){d.error=e.message;d.closed=false;d.boundary=d.boundary||[];}
  $('manual-status').textContent=uiText`${d.boundary.length} offene Randkanten · ${d.params.removed?.flat(2).length||0} Flächen entfernt · ${d.params.patches?.length||0} neue Flächen. ${d.path.length?uiText('Linienzug: ')+d.path.length+uiText(' Punkte. '):''}${d.boundary.length?uiText('Löcher vor dem Übernehmen schließen.'):uiText(d.error)||uiText('Netz geschlossen.')}`;
  $('manual-remove').disabled=!d.faces.length||d.mode!=='face';$('manual-create').disabled=d.path.length<3;$('manual-back').disabled=!d.path.length;$('manual-undo').disabled=!d.history.length;$('manual-apply').disabled=!d.closed||d.path.length>0||!(d.params.removed?.length||d.params.patches?.length);
  $('manual-mode-face').setAttribute('aria-pressed',String(d.mode==='face'));$('manual-mode-vertex').setAttribute('aria-pressed',String(d.mode==='vertex'));draw();
}
function manualChange(params){const d=manualDraft;try{manualPatch(d.base,{id:d.id,params},{allowOpen:true});d.history.push(structuredClone(d.params));d.params=params;d.faces=[];d.path=[];refreshManualDraft();}catch(e){notice(e.message);}}
function manualPickVertex(id){const d=manualDraft;if(!d||!Object.hasOwn(d.mesh.vertices,id))return;if(id===d.path[0]&&d.path.length>=3){$('manual-create').onclick();return;}if(d.path.includes(id)){notice(uiText('Punkt schon im Linienzug. Zum Schließen den ersten Punkt anklicken.'));return;}if(d.path.length>=32){notice(uiText('Maximal 32 Punkte pro neuer Fläche.'));return;}d.path.push(id);refreshManualDraft();}
$('manual-edit').onclick=()=>{if(!$('manual-edit').disabled)beginManualDraft(result.mesh);};
for(const mode of ['face','vertex'])$('manual-mode-'+mode).onclick=()=>{if(!manualDraft)return;manualDraft.mode=mode;manualDraft.faces=[];manualDraft.path=[];refreshManualDraft();};
$('manual-remove').onclick=()=>{const d=manualDraft;if(!d||!d.faces.length)return;const generated=new Set(d.faces.filter(id=>!d.base.faces.some(f=>f.id===id)));if(generated.size){notice(uiText('Neue Flächen über „Letzten Eingriff zurück“ entfernen.'));return;}const removed=[...new Set([...(d.params.removed?.flat(2)||[]),...d.faces])];manualChange({...d.params,removed:packFaceGroups(removed)});};
$('manual-create').onclick=()=>{const d=manualDraft;if(d&&d.path.length>=3)manualChange({...d.params,patches:[...(d.params.patches||[]),[...d.path]]});};
$('manual-back').onclick=()=>{if(manualDraft){manualDraft.path.pop();refreshManualDraft();}};
$('manual-undo').onclick=()=>{const d=manualDraft;if(!d||!d.history.length)return;d.params=d.history.pop();d.faces=[];d.path=[];refreshManualDraft();};
$('manual-reset').onclick=()=>{if(manualDraft)manualChange({});};
$('manual-cancel').onclick=()=>{cancelManualDraft();update();};
$('manual-apply').onclick=()=>{const d=manualDraft;if(!d||!d.closed||d.path.length||$('manual-apply').disabled)return;try{manualPatch(d.base,{id:d.id,params:d.params});const step={id:d.id,type:'manual_patch',enabled:d.index===null?true:project.steps[d.index].enabled!==false,params:structuredClone(d.params)};if(d.index===null){project.steps.push(step);chosen=project.steps.length-1;}else{project.steps[d.index]=step;chosen=d.index;}cancelManualDraft(false);viewEnd=null;update(true);notice(uiText('Geschlossene manuelle Reparatur in die Timeline übernommen.'));}catch(e){notice(e.message);}};
$('triangulate').onclick=()=>{
  if($('triangulate').disabled)return;
  try{const step={id:'s'+crypto.randomUUID(),type:'triangulate_faces',enabled:true,params:selectedFaces.length?{groups:packFaceGroups(selectedFaces)}:{}};triangulateFaces(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;selectedFaces=[];update(true);notice(uiText('Trianguliert. Ohne Auswahl wird das gesamte Netz trianguliert; danach Loop möglich.'));}catch(e){notice(e.message);}
};
$('loop').onclick=()=>{
  if($('loop').disabled)return;
  try{const step={id:'s'+crypto.randomUUID(),type:'loop',enabled:true,params:toolParams('loop',{levels:1})};loopSubdivide(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;selectedFaces=[];update(true);notice(uiText('Loop-Subdivision angewendet. Stufen 1–2 rechts einstellen.'));}catch(e){notice(e.message);}
};
$('honeycomb').onclick=()=>{
  if($('honeycomb').disabled)return;
  try{const step={id:'s'+crypto.randomUUID(),type:'honeycomb',enabled:true,params:toolParams('honeycomb',{levels:1})};honeycomb(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;selectedFaces=[];update(true);notice(uiText('Honeycomb angewendet. Stufen 1–2 rechts ändern; weitere Honeycomb-Schritte verfeinern das Wabenmuster.'));}catch(e){notice(e.message);}
};
$('doo-sabin').onclick=()=>{
  if($('doo-sabin').disabled)return;
  try{
    const step={id:'s'+crypto.randomUUID(),type:'doo_sabin',enabled:true,params:toolParams('doo_sabin',{levels:1})};
    dooSabin(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;selectedFaces=[];update(true);
    notice(uiText('Doo-Sabin angewendet. Rechts lässt sich die Stufenzahl auf 1 oder 2 einstellen.'));
  }catch(e){notice(e.message);}
};
$('shell-open').onclick=()=>{
  if($('shell-open').disabled)return;
  try{
    const step={id:'s'+crypto.randomUUID(),type:'shell_open',enabled:true,params:{source:openingSource(result.mesh,selectedFaces),faces:[...selectedFaces]}};
    openShell(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;selectedFaces=[];update(true);notice(uiText('Öffnung als eigener Schritt angelegt. Unterdrücken schließt diesen Schritt; die Wandstärke bleibt an der Schale.'));
  }catch(e){notice(e.message);}
};
$('shell').onclick=()=>{
  if($('shell').disabled)return;
  try{
    const step={id:'s'+crypto.randomUUID(),type:'shell',enabled:true,params:{...toolParams('shell',{thickness:defaultShellThickness(result.mesh)}),openings:[...selectedFaces]}};
    shell(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;selectedFaces=[];update(true);
    notice(step.params.openings.length?uiText('Schale angelegt. Wandstärke und Öffnungen bleiben am Timeline-Schritt änderbar.'):uiText('Geschlossene Hohlform angelegt. Für eine Öffnung vor dem Schalenschritt Flächen auswählen und „Auswahl als Öffnungen“ verwenden.'));
  }catch(e){notice(e.message);}
};
$('subdivide-faces').onclick=()=>{
  if($('subdivide-faces').disabled)return;
  const step={id:'s'+crypto.randomUUID(),type:'subdivide_faces',enabled:true,params:{faces:[...selectedFaces]}};
  try{subdivideFaces(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;selectedFaces=[];update(true);notice(uiText('Flächen lokal unterteilt. Neue Punkte lassen sich im Punktmodus verschieben.'));}catch(e){notice(e.message);}
};
$('bevel-edges').onclick=()=>{
  if($('bevel-edges').disabled)return;
  const step={id:'s'+crypto.randomUUID(),type:'bevel_edges',enabled:true,params:{edges:selectedElements.map(id=>JSON.parse(id)),...toolParams('bevel_edges',{width:defaultShellThickness(result.mesh)})}};
  try{bevelEdges(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;update(true);notice(uiText('Fase angelegt. Breite rechts einstellen.'));}catch(e){notice(e.message);}
};
$('dissolve-edges').onclick=()=>{
  if($('dissolve-edges').disabled)return;
  const step={id:'s'+crypto.randomUUID(),type:'dissolve_edges',enabled:true,params:{edges:selectedElements.map(id=>JSON.parse(id))}};
  try{dissolveEdges(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;update(true);notice(uiText('Kanten aufgelöst und ebene Nachbarflächen zusammengeführt.'));}catch(e){notice(e.message);}
};
$('split-edges').onclick=()=>{
  if($('split-edges').disabled)return;
  const step={id:'s'+crypto.randomUUID(),type:'split_edges',enabled:true,params:{edges:selectedElements.map(id=>JSON.parse(id)),...toolParams('split_edges',{segments:2})}};
  try{splitEdges(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;update(true);notice(uiText('Kanten unterteilt. Abschnitte rechts einstellen; neue Punkte im Punktmodus auswählen.'));}catch(e){notice(e.message);}
};
$('truncate-vertices').onclick=()=>{
  if($('truncate-vertices').disabled)return;
  const step={id:'s'+crypto.randomUUID(),type:'truncate_vertices',enabled:true,params:{vertices:[...selectedElements],...toolParams('truncate_vertices',{amount:.25})}};
  try{truncateVertices(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;update(true);notice(uiText('Ausgewählte Ecken abgeschnitten. Schnittstärke rechts ändern.'));}catch(e){notice(e.message);}
};
$('move-vertices').onclick=()=>{
  if($('move-vertices').disabled)return;
  const step={id:'s'+crypto.randomUUID(),type:'move_vertices',enabled:true,params:{vertices:[...selectedElements],...toolParams('move_vertices',{x:0,y:0,z:0})}};
  try{moveVertices(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;update(true);notice(uiText('Punktverschiebung angelegt. Versatz X/Y/Z rechts einstellen.'));}catch(e){notice(e.message);}
};
$('truncate').onclick=()=>{
  if($('truncate').disabled)return;
  try{const step={id:'s'+crypto.randomUUID(),type:'truncate',enabled:true,params:toolParams('truncate',{amount:.25})};truncate(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;selectedFaces=[];update(true);notice(uiText('Ecken abgeschnitten. Schnittstärke rechts als Anteil der Kantenlänge ändern.'));}catch(e){notice(e.message);}
};
$('stellate').onclick=()=>{
  if($('stellate').disabled)return;
  try{const step={id:'s'+crypto.randomUUID(),type:'stellate',enabled:true,params:{...toolParams('stellate',{height:defaultShellThickness(result.mesh)*5}),faces:[...selectedFaces]}};stellate(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;selectedFaces=[];update(true);notice(uiText('Spitzen angelegt. Höhe rechts ändern: positiv nach außen, negativ nach innen.'));}catch(e){notice(e.message);}
};
$('wire-model').onclick=()=>{
  if($('wire-model').disabled)return;
  try{const step={id:'s'+crypto.randomUUID(),type:'wire_model',enabled:true,params:toolParams('wire_model',{thickness:defaultShellThickness(result.mesh)})};wireModel(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;selectedFaces=[];update(true);notice(uiText('Drahtmodell angelegt. Strebenstärke rechts ändern; anschließend bei Bedarf glätten.'));}catch(e){notice(e.message);}
};
$('dual').onclick=()=>{
  if($('dual').disabled)return;
  try{
    const step={id:'s'+crypto.randomUUID(),type:'dual',enabled:true,params:toolParams('dual',{scale:1})};
    dual(result.mesh,step);project.steps.push(step);chosen=project.steps.length-1;selectedFaces=[];update(true);
    notice(uiText('Dualnetz angelegt. Rechts bleibt der Größenfaktor änderbar.'));
  }catch(e){notice(e.message);}
};
// Resolve only stored input references against the mesh before the upcoming operation.
function playbackInputFaces(step,mesh){
  if(!step||step.enabled===false)return [];
  const params=step.params||{},references=new Set([step.target,...(step.targets||[]),...(params.faces||[]),...(params.openings||[]),...(params.groups||[]).flat(2),...(params.removed||[]).flat(2)]);
  const vertices=new Set(params.vertices||[]),edges=new Set((params.edges||[]).map(([a,b])=>edgeId(a,b)));
  return mesh.faces.filter(f=>references.has(f.id)||f.vertices.some(v=>vertices.has(v)||(step.type==='remove_parts'&&references.has(v)))||f.vertices.some((v,i)=>edges.has(edgeId(v,f.vertices[(i+1)%f.vertices.length])))).map(f=>f.id);
}
const playbackDelay=()=>[1000,2000,3000,4000,5000].includes(Number($('timeline-delay').value))?Number($('timeline-delay').value):3000;
function clearPlaybackPreview(p){if(p){p.previewFaces=[];p.previewIndex=null;}}
function refreshPlaybackControls(){
  const active=Boolean(timelinePlayback),blocked=Boolean(curveDraft||cutDraft||manualDraft||calculationBusy);
  $('timeline-play').textContent=active?uiText('■ Stoppen'):uiText('▶ Abspielen');$('timeline-play').setAttribute('aria-pressed',String(active));
  $('timeline-play').disabled=!active&&(blocked||project.steps.length<2||typeof requestAnimationFrame!=='function');
  $('timeline-play').title=active?uiText('Wiedergabe stoppen; angezeigter Schritt bleibt sichtbar.'):uiText('Timeline vom Anfang bis zum Ende abspielen.');
  $('timeline-delay').disabled=blocked;$('timeline-rotate').disabled=blocked;
  const label=$('playback-step');label.hidden=!active;
  const index=timelinePlayback?.previewIndex??chosen;
  label.textContent=active?`${index+1} / ${project.steps.length} · ${stepName(project.steps[index])}${project.steps[index].enabled===false?uiText(' (unterdrückt)'):''}${timelinePlayback.previewIndex!==null?uiText(' · Auswahl vor dem Schritt'):''}`:'';
}
function stopTimelinePlayback(){
  const p=timelinePlayback;timelinePlayback=null;if(p&&typeof cancelAnimationFrame==='function')cancelAnimationFrame(p.frame);refreshPlaybackControls();if(p)draw();
}
function timelinePlaybackFrame(time){
  const p=timelinePlayback;if(!p)return;
  if(p.project!==project||p.epoch!==documentEpoch||p.serial!==changeSerial||p.index!==chosen||document.hidden||curveDraft||cutDraft||manualDraft||calculationBusy){stopTimelinePlayback();return;}
  const dt=Math.max(0,Math.min(.1,(time-p.lastFrame)/1000));p.lastFrame=time;
  if($('timeline-rotate').checked){yaw=(yaw+dt*.12)%(Math.PI*2);draw();}
  const delay=playbackDelay();
  if(chosen<project.steps.length-1&&time-p.shownAt>=delay){
    clearPlaybackPreview(p);chosen++;p.index=chosen;viewEnd=chosen===project.steps.length-1?null:chosen;selectedFaces=[];selectedElements=[];referenceSelection=null;update();
    if(timelinePlayback!==p)return;p.shownAt=performance.now();
    if(result.failed){stopTimelinePlayback();notice(uiText('Wiedergabe am fehlerhaften Schritt angehalten.'));return;}
  }
  if(chosen<project.steps.length-1&&time-p.shownAt>=delay*.8&&p.previewIndex===null){
    const faces=playbackInputFaces(project.steps[chosen+1],result.mesh);
    if(faces.length){p.previewFaces=faces;p.previewIndex=chosen+1;refreshPlaybackControls();draw();}
  }
  if(chosen===project.steps.length-1&&!$('timeline-rotate').checked){stopTimelinePlayback();return;}
  p.frame=requestAnimationFrame(timelinePlaybackFrame);
}
$('timeline-play').onclick=()=>{
  if(timelinePlayback){stopTimelinePlayback();return;}
  if($('timeline-play').disabled||curveDraft||cutDraft||manualDraft||calculationBusy)return;
  cancelNavigation();chosen=0;viewEnd=0;selectedFaces=[];selectedElements=[];referenceSelection=null;
  const now=performance.now();timelinePlayback={project,epoch:documentEpoch,serial:changeSerial,index:0,shownAt:now,lastFrame:now,frame:null,previewFaces:[],previewIndex:null};update();timelinePlayback.shownAt=performance.now();timelinePlayback.lastFrame=timelinePlayback.shownAt;timelinePlayback.frame=requestAnimationFrame(timelinePlaybackFrame);
};
$('timeline-rotate').onchange=()=>{if(timelinePlayback&&chosen===project.steps.length-1&&!$('timeline-rotate').checked)stopTimelinePlayback();};
$('timeline-delay').value='3000';$('timeline-delay').onchange=()=>{if(!['1000','2000','3000','4000','5000'].includes($('timeline-delay').value))$('timeline-delay').value='3000';if(timelinePlayback){timelinePlayback.shownAt=performance.now();clearPlaybackPreview(timelinePlayback);refreshPlaybackControls();draw();}};
$('end').onclick=()=>{stopTimelinePlayback();if(cutDraft)cancelCutDraft();viewEnd=null;update();};
$('new').onclick=()=>{stopTimelinePlayback();$('new-kind').value='cube';$('new-dialog').showModal();};
$('new-cancel').onclick=()=>$('new-dialog').close();
$('new-create').onclick=()=>{
  if(dirty&&!confirm(uiText('Nicht gespeicherte Änderungen verwerfen?')))return;
  project=newProject($('new-kind').value);documentEpoch++;changeSerial=0;chosen=0;viewEnd=null;selectedFaces=[];dirty=false;$('new-dialog').close();update();fit();
};
$('save').onclick=()=>{if(curveDraft||cutDraft||manualDraft){notice(uiText('Vorschau oder manuelle Reparatur zuerst übernehmen oder abbrechen.'));return;}download('projekt.kantolyx',JSON.stringify({...project,format:'kantolyx-project',appVersion:APP_VERSION},null,2),'application/json');dirty=false;update();notice(uiText('Projektdatei wurde zum Download übergeben.'));};
$('obj').onclick=()=>{if(curveDraft||cutDraft||manualDraft){notice(uiText('Vorschau oder manuelle Reparatur zuerst übernehmen oder abbrechen.'));return;}download('modell.obj',toOBJ(result.mesh),'text/plain');if(result.failed||viewEnd!==null)notice(uiText('Exportiert wurde der aktuell sichtbare Zustand.'));};
$('open').onclick=()=>{stopTimelinePlayback();$('file').click();};
$('file').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>2_000_000)throw new Error(uiText('Projektdatei ist zu groß (max. 2 MB).'));const p=JSON.parse(await file.text());validateProject(p);evaluate(p);if(dirty&&!confirm(uiText('Nicht gespeicherte Änderungen verwerfen?')))return;project={...p,name:typeof p.name==='string'?p.name.slice(0,100):uiText('Unbenannt')};documentEpoch++;changeSerial=0;chosen=0;viewEnd=null;selectedFaces=[];dirty=false;update();fit();if(result.failed)notice(uiText('Projekt geladen. Bitte die markierten Bezugsfehler beheben.'));}catch(err){notice(uiText('Öffnen fehlgeschlagen: ')+err.message);}finally{e.target.value='';}};

// Standalone GitHub Pages edition: local project files only.
$('language-select').value=uiLanguage;
$('language-select').onchange=()=>{
  const next=$('language-select').value==='en'?'en':'de';if(next===uiLanguage)return;
  stopTimelinePlayback();uiLanguage=next;
  try{localStorage.setItem('kantolyx.language',uiLanguage);}catch{}
  translateInterfaceText();$('language-select').value=uiLanguage;
  $('notice').textContent='';$('notice').style.display='none';
  $('about-version').textContent=uiText`Version ${APP_VERSION} · Alpha`;
  update();if(cutDraft)refreshCutDraft(false);
};
update();fit();
