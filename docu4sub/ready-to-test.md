# Ready to Test Feature

## Feature

A-to-B campus route planner.

## Why This Is Testable

The feature has a clear start state, a clear user action, and a visible result. A tester can choose two campus locations, see the route update, and verify the directions without needing an account or extra setup.

## Test Steps

1. Open the deployed HuskyPath site.
2. Set `Current Location` to `Mary Gates Hall`.
3. Set `To` to `Kane Hall`.
4. Check that the main route title changes to `Mary Gates Hall to Kane Hall`.
5. Check that the map line, estimated time, distance, and step-by-step directions update.
6. Check that the building details panel shows `Kane Hall`.
7. Press `Swap`.
8. Check that the route changes to `Kane Hall to Mary Gates Hall`.

## Expected Result

The tester can create a route between two selectable UW campus locations and see the route preview update across the map, route summary, directions list, and building details.

## Current Limitations

- Accessible routing depends on available OpenStreetMap stair and path data.
- The app does not use live GPS yet.
- Building details are prototype data curated for the MVP.
