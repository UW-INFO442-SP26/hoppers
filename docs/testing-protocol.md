# HuskyPath Testing Protocol

Test the MVP in desktop Chrome and a mobile-sized Chrome viewport.

## Route Planner

Steps:
1. Open the app.
2. Keep the `Map` tab selected.
3. Set `Current Location` to `Mary Gates Hall`.
4. Set `To` to `Kane Hall`.
5. Press `Start Navigation`.

Expected result:
- The route title changes to `Mary Gates Hall to Kane Hall`.
- The map route, travel time, distance, directions, and Kane Hall details update.

## Report Pins

Steps:
1. Click or tap a place on the map.
2. Select an issue type.
3. Add a short note.
4. Press `Submit for review`.
5. Open the `MVP` tab.
6. Approve the pending report.
7. Return to the `Map` tab.

Expected result:
- The report appears in the local admin queue first.
- After approval, the report marker appears on the map.
- The marker remains after refresh because reports are stored in localStorage.

## MVP Evidence Tab

Steps:
1. Select the `MVP` tab in the header.
2. Play the route preview audio.
3. Read the personas, checklist, report queue, and testing flow.

Expected result:
- The native audio control works.
- The transcript appears below the audio control.
- The personas and checklist are readable on desktop and mobile.

## Accessibility Checks

Steps:
1. Press `Tab` from the top of the page.
2. Use the skip link.
3. Move between `Map` and `MVP` tabs with the keyboard.
4. Change start and destination using the keyboard.

Expected result:
- Focus states are visible.
- Controls have accessible labels.
- Route status updates are available through live status text.

## Known Limitations

- Report data is currently localStorage, not live Firebase.
- A future Firebase/Firestore version should store the same report fields: type, note, coordinates, status, and created time.
- Public routing can fail or return limited path detail. When this happens, the app displays a fallback preview route.
- OpenStreetMap may not contain every UW stair, ramp, indoor hallway, or entrance.
- Building amenities are prototype data, not an official UW feed.
