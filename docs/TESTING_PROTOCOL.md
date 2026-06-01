# Husky Path Testing Protocol

## Overview

This testing protocol explains how to test the main features of Husky Path. Husky Path is our MVP for helping UW students navigate campus more clearly and with less stress.

Please test the app in Google Chrome on both desktop and mobile. Users do not need to log in or download anything to use the main features.

## Test Setup

- Browser: Google Chrome
- Devices:
  - Laptop or desktop
  - Phone, or mobile view in Chrome DevTools
- Internet connection: Required
- Login: Not required
- Plugins or app downloads: Not required

---

## 1. Open the Website

### Steps

1. Open the Husky Path website link in Google Chrome.
2. Wait for the page to load.
3. Check that the main page, map/interface, and navigation controls appear.
4. Make sure the app does not ask users to log in before using the main features.

### Expected Result

The website should load normally. Users should be able to tell that Husky Path is a UW campus navigation tool.

### Known Bugs / Workarounds

If the map or page loads slowly, wait a few seconds or refresh the page.

---

## 2. Check the Browser Title and Favicon

### Steps

1. Open the site in desktop Google Chrome.
2. Look at the browser tab.
3. Check that the tab has a Husky Path related title.
4. Check that the tab has a custom icon instead of the default blank icon.

### Expected Result

The browser tab should show a clear title and a custom favicon.

### Known Bugs / Workarounds

If the favicon does not show right away, refresh the page.

---

## 3. Search or Choose a Campus Location

### Steps

1. Click or tap the location search/input area.
2. Type or choose a UW campus location.
3. Select one of the available locations.
4. Check that the selected place shows up on the page or map.

### Expected Result

Users should be able to choose a UW campus location and understand which place they selected.

### Known Bugs / Workarounds

The MVP only includes a limited set of UW locations right now. If one building does not show up, try another location that is already included in the app.

---

## 4. View a Route

### Steps

1. Choose a starting point.
2. Choose a destination.
3. Start or display the route.
4. Check that a route appears on the map/interface.
5. Look at any route information, such as walking time, distance, or route summary.

### Expected Result

The app should show a route between the selected locations. Users should be able to understand the general walking direction.

### Known Bugs / Workarounds

Sometimes the routing API may not work correctly. If that happens, the app may show a fallback route. The fallback route still gives a general direction, but it may not perfectly follow the exact campus paths.

---

## 5. Check Campus Place Information

### Steps

1. Select a campus place.
2. Look at the information shown for that place.
3. Check that the place name and any notes are readable.
4. If there are accessibility or route-related notes, review them before starting the route.

### Expected Result

Users should be able to see basic information about a campus location before navigating there.

### Known Bugs / Workarounds

Some places may not have detailed information yet. If details are missing, users can still use the map and route feature for basic navigation.

---

## 6. Check Accessibility-Related Information

### Steps

1. Choose a route or campus location.
2. Look for any accessibility-related information, such as entrance notes, stairs, ramps, or easier walking paths.
3. Check that the information is easy to notice and read.

### Expected Result

When accessibility information is available, users should be able to find it without digging too much.

### Known Bugs / Workarounds

Accessibility data is still limited in this MVP. Users should treat it as prototype information and double-check important accessibility needs with official UW resources.

---

## 7. Check Visual or Media Elements

### Steps

1. Open the website.
2. Check that the app’s visual or media elements load correctly, such as icons, images, map visuals, or other embedded elements.
3. Make sure these elements do not block the main navigation features.

### Expected Result

The visual or media elements should load normally and support the app experience.

### Known Bugs / Workarounds

If an icon, image, or embedded element does not load, refresh the page and check the internet connection.

---

## 8. Test Responsive Design

### Steps

1. Open the site on desktop Chrome.
2. Resize the browser window.
3. Open Chrome DevTools and test a mobile screen size.
4. Check that the text, buttons, and map/interface still fit the screen.

### Expected Result

The app should still be usable on both desktop and mobile screen sizes. Important buttons and text should not disappear or overlap.

### Known Bugs / Workarounds

If the screen feels crowded on a very small phone size, rotate the phone or try a slightly larger mobile viewport.

---

## 9. Test Mouse and Touch Interaction

### Steps

1. Use a mouse to click buttons, inputs, and map controls.
2. Use a phone or mobile view to tap the same features.
3. Check that the main actions work in both ways.

### Expected Result

The app should work with both mouse clicks and touch taps.

### Known Bugs / Workarounds

If a button is hard to tap on mobile, try tapping the center of the button.

---

## 10. Test Keyboard and Screen Reader Accessibility

### Steps

1. Use the Tab key to move through the page.
2. Check that important buttons and inputs can be reached.
3. Make sure buttons and inputs have understandable labels.
4. If possible, test the page with a screen reader.

### Expected Result

Users should be able to understand the main purpose of the app and use the key controls without relying only on visuals.

### Known Bugs / Workarounds

Map-based interfaces can be harder to use with only a keyboard or screen reader. The main workaround is to use the labeled search and route controls when possible.

---

## Final Notes

Husky Path is still an MVP, so it focuses on the main idea of UW-specific campus navigation. Features like real-time construction alerts, indoor navigation, and fully verified accessibility routing would be future improvements.
