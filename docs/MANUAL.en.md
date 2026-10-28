# Kantolyx 0.5.65 · GitHub Pages · User manual

Kantolyx is a browser-based polygon mesh modeler with an editable, parametric timeline. It is strongly inspired by TopMod. This guide covers the GitHub Pages application and its local project workflow.

## 1. Open the application and choose a language

Use the published HTTPS address of the repository. The application opens directly at the website root or repository subdirectory. Do not add `/web/` to the address. Publishing instructions are in [README.md](../README.md).

German is the default. Select **English** in the header to change the interface. The choice is remembered in this browser when browser storage is available. Switching language does not reload the page or alter the project, geometry, selection or unsaved edits. Existing spline, cutting-plane and repair drafts remain available. Switching language stops timeline playback. Project names and technical references are not translated.

## 2. First model

1. Choose **New**, select **Box**, and choose **Create project**.
2. Rotate the model until a face is clearly visible, then click that face.
3. Choose **Extrude faces**. A new timeline step appears at the bottom.
4. On the right, change **Length (+ outward / − inward)**. Try `0.5`.
5. Change **Cap scale** to `0.7` or the cap rotation to experiment with the shape.
6. Click an earlier timeline step to see its state and edit its parameters. Later steps are recalculated.
7. Choose **Save project** and keep the downloaded `.kantolyx` file.

## 3. Navigation: mouse, keyboard and touch

| Action | Mouse / keyboard | Touch |
| --- | --- | --- |
| Rotate | Drag with the left mouse button | Drag one finger |
| Pan | Drag with the middle button or Shift+drag | Move two fingers together |
| Zoom | Mouse wheel | Pinch or spread two fingers |
| Select a face | Click | Tap |
| Add or remove a face | Shift+click or enable multiple selection | Enable multiple selection and tap |
| Fit entire model | Fit model or Home | Fit model |
| Focus selection | Focus selection or F | Focus selection |
| Clear selection / cancel a preview | Escape in the model view | Use the corresponding Clear or Cancel button |

Rotation is continuous in both horizontal and vertical directions. Fit model centers the pivot on the whole model; Focus selection places it at the selected region. Default view restores orientation and framing. Show edges toggles the mesh edge overlay.

## 4. Starting solids

Choose a shape in the New dialog. The first timeline step also offers the base-solid type and its dimensions.

- **Box:** width, height and depth.
- **Tetrahedron, octahedron and icosahedron:** edge length.
- **Prism:** side count from 3 to 128, side length and height/thickness. The initial six-sided prism uses side length 2 and height 2.
- **Dodecahedron:** 12 pentagonal faces, adjustable edge length.
- **Sphere:** radius, circumferential segments and height divisions. Its latitude bands use quads, with triangles at the poles.
- **Torus / ring:** major radius to the tube center, tube radius and the two segment counts. Tube radius must be smaller than major radius.
- **Soccer ball:** 12 pentagons and 20 hexagons, adjustable edge length.

Changing only dimensions usually preserves face references. Changing the solid type or resolution can remove faces referenced by later operations. Repair those references if needed. New starts a fresh project and resets remembered tool parameters; it asks before discarding unsaved changes.

## 5. Selection and selection helpers

Choose **Faces**, **Edges** or **Vertices** in the selection controls. A click normally replaces the selection. Multiple selection lets you collect or deselect elements. Face group supports large face selections within the mesh limits; individual tools can have smaller limits.

Useful helpers include:

- **Select all faces:** all faces of the currently displayed model.
- **Select connected:** expand from the selection through shared edges.
- **Select coplanar:** collect adjacent faces in the same plane, stopping at creases.
- **Grow face selection:** add one neighboring row per click.
- **Select edge ring:** follow opposite edges across quads. It stops at triangles and other polygons and rejects a ring exceeding 32 selected edges rather than silently truncating it.
- **Clear selection:** remove the current selection.

The selection list identifies the selected faces or elements. A bridge normally uses two end faces. Group extrusion can use many faces. A region extrusion requires faces connected through edges. Check each tool's tooltip for its prerequisites.

## 6. Timeline and parameter memory

Click a timeline icon to immediately display the state at that step. The right panel shows its editable parameters. Hover over a step for its name, parameters and status. **Show entire model** returns to the final state.

Editing an earlier step recalculates later steps. **Suppress** skips a step without deleting it; **Enable** restores it. **Delete** removes a step. **Delete timeline from here** deletes the selected step and its successors, preserving the base solid. Confirm the deletion when prompted.

A failed operation retains the last valid mesh and blocks dependent steps. Correct its parameters, suppress it, or repair its references. To reassign references, display the state before the failed operation, select the intended faces/edges/vertices, then return to the operation and choose its **Use selection …** action.

Within a project, tools reuse their last successfully applied or edited parameters. This includes extrusion length/scale/rotation, bridge segments and mapping, spline offsets and twist, subdivision levels, thicknesses, bevel width and point offsets. Face and vertex IDs are not reused as tool defaults. Merely selecting a timeline step does not change the defaults. Draft changes are remembered after applying them; canceled or invalid changes are not learned.

**New** restores default tool values. Opening a saved project reconstructs defaults from its valid enabled timeline steps. A temporary editing history and parameter values belonging only to deleted steps are not separately saved.

## 7. Extrusion and face shaping

### Individual faces and face groups

Select one or more faces and choose **Extrude faces**. Every selected face is extruded along its own normal. On the right, edit length, cap scale and cap rotation in the same step. The original face boundary remains the extrusion's base; scaling and rotation affect the cap.

Positive length extrudes outward; negative length moves inward. Allowed lengths are −1000 to −0.01 and 0.01 to 1000. Zero is rejected because it creates degenerate side walls. Cap scale is 0.05–10 and rotation is −180° to 180°.

For a recessed area on a box, try length `-0.5` and cap scale `0.7`. At scale 1, retracting a whole outside face may overlap the existing side walls. Extrusion does not automatically cut through or trim other geometry; choose depth and scale accordingly.

### Connected regions

Select faces connected through edges and choose **Extrude region**. All selected faces move by one common vector. Shared interior edges and vertices remain shared; new walls appear only along the region boundary, including inner boundary loops.

Edit length and direction X/Y/Z in the timeline. The direction is normalized and must point outward from all selected faces; use negative length for the inward displacement. A whole closed hull, disconnected patches, zero direction or branching boundaries are rejected. Newly created caps remain selected for another extrusion.

### Shape an existing face

**Scale / rotate face** changes an existing face about its center and normal without adding a separate extrusion. Adjacent faces deform with it. Large rotations or scale changes can cause intersections.

## 8. Straight and curved bridges

### Straight bridges

Select two separate suitable end faces and choose **Connect faces**. Opposite triangles or quads and triangle–quad pairs are supported, including lateral offsets. Faces must not share vertices. Adjust vertex mapping and segment count in the timeline if the correspondence is unsuitable.

Quad end faces can retain quad bridge walls; triangle ends retain triangular walls. Older triangular wall layouts can still be selected where offered. Mappings must produce a stable, noncollapsed connection.

### Curved bridges and splines

Select the two end faces and choose **Curved bridge**. The path is previewed before the bridge is applied.

- Drag the white center handle to bend the curve.
- Drag A/B along the end directions to change handle lengths.
- Rotate the view to adjust the path from another direction.
- Set center X/Y/Z factors numerically to make multiple bridges consistent.
- Add up to three extra path points at fixed path positions, then drag or edit their offsets.
- Set center twist for extra rotation about the path; it is zero at both ends.
- Use Automatic start if a suitable initial path is needed.

Center and extra-point offsets are relative to the distance between end-face centers and use fixed model axes. A factor of 0.1 means 10% of that distance. Curvature A/B factors range from 0.05 to 2; curved bridges use 3–32 segments, offsets −4 to 4 and twist −180° to 180°.

Choose **Apply** to add the bridge to the timeline. Cancel leaves the project unchanged. **Edit spline** reopens an existing bridge for path editing. A valid curve alone does not guarantee enough space for the full bridge thickness. Tight bends or unsuitable mappings can fold a cross-section; adjust the path, end faces or segment count.

## 9. Through-holes and hole punching

**Through-hole** uses two selected planar convex end faces, with 3–16 corners, to cut a passage through a solid. It supports concave solids within the operation's limits. Adjust hole size and mapping in the timeline. The opening retains a rim and receives inner walls.

**Punch holes** starts from 1–128 selected faces and searches for suitable opposite faces. Several interior rays check the nearest candidate. Similar triangular or quadrilateral contours can connect directly without a rim: the two faces are removed and inner walls are added. Slightly tilted or warped contours can be accepted within the matching tolerances. Unsuitable source faces are reported or skipped.

If punching fails, try a smaller, clearer source face, reduce overlapping selections, or use an explicitly chosen pair with Through-hole. A cut that would remove the entire affected solid is rejected. For long calculations, the application displays a waiting animation.

## 10. Plane cuts, face-ring removal and parts

**Plane cut** previews a cutting plane. Choose an axis preset, edit its normal and position, or drag its white handle. View the plane slightly from the side to move it along the normal. Choose which side or both parts to retain, then Apply. Concave bodies and existing holes are supported within the cut limits. Cancel leaves the timeline unchanged.

**Split at face ring** removes the selected face band and caps the resulting planar convex boundary loops. The result may stay connected or split into several parts. Select a complete suitable band on one solid; other solids remain unchanged. Nonplanar or nonconvex caps and branching boundaries are rejected.

**Delete part** removes an entire connected part referenced by the selected face, edge or vertex. At least one part must remain. Removing a face by itself is a separate operation in Manual repair.

## 11. Subdivision, remeshing and shaping

These tools create editable timeline steps. Unless the tool uses a selection, it acts on the entire displayed mesh.

| Tool | Use and requirements |
| --- | --- |
| Catmull-Clark | Smooths a closed polygon mesh into quads, 1–2 levels per step. |
| Doo-Sabin | Rounds face corners with a separate subdivision scheme, 1–2 levels. |
| Honeycomb | Refines a closed mesh into a pattern with three edges per vertex, 1–2 levels. |
| Triangulate | Splits selected faces, or the entire mesh without a selection, into triangles without moving existing vertices. |
| Loop | Smooths a closed triangle-only mesh, 1–2 levels; triangulate the entire model first. |
| Create dual mesh | Exchanges faces and vertices through the dual construction; edit its scale. |
| Subdivide faces | Local quad subdivision on selected planar convex faces, sharing new edge points with neighbors. |
| Subdivide edges | Split 1–32 selected edges into 2–16 divisions. |
| Dissolve edges | Merge coplanar adjacent faces across 1–32 selected internal edges. All internal edges of the merged patch must be selected. |
| Bevel edges | Flat bevel on selected edges of a convex outer hull with planar faces; apply before smoothing. |
| Truncate corners | Truncate all corners, with cut amount 0.01–0.49 of each edge length. |
| Truncate selection | Apply truncation to 1–32 selected vertices. |
| Move vertices | Translate 1–32 selected vertices by a common X/Y/Z offset. |
| Stellate faces | Create peaks from selected planar convex faces. Positive height points outward, negative inward. |
| Wire model | Create angular closed struts along edges of a planar convex-faced mesh; apply before smoothing. |

Repeated subdivision can grow a mesh quickly. Increase levels gradually and use suppression to compare results. Some local tools reject nonconvex or warped input even when another tool can handle it.

## 12. Shells and openings

**Shell / rind** adds an inner surface with editable wall thickness. With no selected opening faces it creates a closed hollow form. Up to two selected faces can be opened as part of the shell step.

**Open shell** opens selected outer faces of an existing shell and joins the inner and outer boundaries. Use face-group selection for larger groups, up to 32 faces per opening step. Create these openings before smoothing or remeshing changes the face pairing.

Thickness can fail near short edges or complex corners: reduce it or simplify the mesh. Offset thickness is approximate at complex corners. Opening groups may meet along shared edges but must not touch only at a vertex. At least one paired wall face must remain.

## 13. Manual repair (experimental)

1. Choose **Manual repair** to enter a draft.
2. In face mode, select faces and choose **Remove selected faces**. Inner surfaces are orange and open boundary edges yellow.
3. Choose **Connect vertices** and select the existing vertices of a replacement face in order. Include at least one existing open boundary edge.
4. Click the first point again or choose **Create face** to close the polyline.
5. Repeat until all holes are closed. Choose **Apply repair** to add the result to the timeline.

Use Undo last line, Undo last repair or Reset repair to correct the draft. Cancel discards it. The draft is not saved as part of the project until applied. Apply is available only for a valid closed result. A new patch uses 3–32 different existing vertices; up to 32 new faces and 128 removed faces are allowed per repair step. Arbitrary new vertices cannot yet be inserted with this tool.

## 14. Timeline animation

Choose **Play** at the bottom to replay the construction from the base solid. Step times are 1, 2, 3, 4 or 5 seconds; the default is 3 seconds.

During the final 20% before the next step, the stored input faces are highlighted gold on the preceding model. At 3 seconds per step this is 0.6 seconds. The caption names the upcoming operation and says Selection before step. The preview is included in the step time, not added to it.

Input faces are reconstructed from the step. For vertex/edge tools, adjacent faces are highlighted. Suppressed steps, missing references and global operations without stored selections do not produce a selection highlight. Normal surface visibility still applies; rotate to see hidden faces.

Enable Rotate for slow model rotation during playback. At the end the final model continues rotating until stopped or Rotate is disabled. Clicking a step, editing geometry, interacting with the model view or hiding the tab stops playback. Playback does not modify the project.

## 15. Save, open, export and examples

- **Save project:** download `.kantolyx` with the complete timeline and parameters. Keep backups of important work. There is no automatic project saving.
- **Open project:** choose a downloaded `.kantolyx` file. Unsaved edits trigger a discard confirmation. The current file limit is 2 MB.
- **Export OBJ:** download the currently displayed mesh, including a historical timeline state if that is what is visible. OBJ contains geometry, not the parametric timeline.
- **Examples:** use Open project to load a file from `examples/`. Save your experiments under a new local filename.

Supported example topics include bridges, curved handles, shells, holes, local shaping and subdivision. Example filenames are currently German; their stored geometry and timeline work in either interface language.

## 16. Limits and troubleshooting

Kantolyx is an alpha mesh modeler rather than a precision CAD solid kernel. General self-intersections are not detected everywhere. Operations can overlap existing surfaces even when the mesh connectivity is valid.

Projects allow up to 200 timeline steps. Many generated meshes are limited to 32,000 faces and 64,000 vertices; individual tools can impose smaller limits. A failed step keeps the preceding valid state. Reduce subdivision, simplify the input, adjust parameters or suppress unnecessary steps if a limit is reached.

If a website update appears stale, reload the page and check the linked version number. If modules fail to load, confirm that `index.html`, `app.mjs`, `kernel.mjs` and `style.css` are at the selected Pages publishing root and open the published HTTPS address. See README for publication settings.

## 17. Credits and license status

Kantolyx is strongly inspired by [TopMod and its topological modeling approach](https://people.tamu.edu/~ergun/research/topology/download.html). The About dialog includes this acknowledgement.

Kantolyx was developed with OpenAI ChatGPT/Codex. Most program code was generated by AI. The project lead supplied the concept, feature requirements and practical testing.

A usage license has not yet been selected; see [LICENSE-STATUS.md](../LICENSE-STATUS.md). These development notes are not a usage license. The release history is in [CHANGELOG.md](../CHANGELOG.md) and in the application's version dialog.
