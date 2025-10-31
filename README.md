# Blazor ↔ Web Components Interop (JS Render API + CE Facade)

This project contains a **minimal, runnable demo** that shows two patterns:

1. **JS Render API** — Mount a Razor component from JavaScript with a **rich params** object and
   return a **rich payload** back to the host via a **DOM CustomEvent**.
2. **Custom Element facade** — A thin Web Component wrapper that internally uses the JS Render API,
   giving you a declarative `<immotheker-widget>` tag without relying on Blazor's experimental CE.

## Prerequisites
- .NET SDK 8 or 9 (this sample works with either version).
- A modern browser.

## Quick start
```bash
dotnet run
# open the shown URL (usually http://localhost:5xxx)
```

## What you'll see
- **Section A: JS Render API** — a `<div id="jsapiHost">` where JS calls `Blazor.rootComponents.add(...)`,
  passes a rich object (date/bool/number/nested), and listens for `rich:submit`.
- **Section B: Custom Element facade** — `<immotheker-widget component-id="rich">` that wraps the same
  component; you can set `el.params = { ... }` with a rich object and receive the same `rich:submit` event.

## Project Structure

- `Components/RichWidget.razor` — Razor component that **accepts** a rich `Params` object and
  **dispatches** a `CustomEvent` (rich payload) to the host element via JS interop.
- `Program.cs` — Registers the component for the JS Render API (`identifier: "rich"`).
- `wwwroot/index.html` — Host page showing both integration patterns.
- `wwwroot/js/interop.js` — Tiny helper to dispatch a DOM event from .NET onto the host element.
- `wwwroot/js/ce-blazor-wrapper.js` — Thin **custom element** facade that reuses the JS Render API under the hood.
- `wwwroot/app-jsapi.js` — Demo logic for mounting/updating via the JS Render API.
- `wwwroot/app-ce.js` — Demo logic for the custom element facade.
- `wwwroot/js/init.js` — Optional one-time `initializeComponent` callback (logs on startup).

## Notes
- This approach mirrors the official **JS Render API** guidance: register with
  `RegisterForJavaScript`, mount via `rootComponents.add`, and **dispose** the returned instance on teardown.
- Dates are sent as **ISO-8601 strings** to play nicely with .NET `DateTime`. Numbers are JSON numbers; if you
  require exact currency handling, consider sending **minor units** (cents) or strings and convert to `decimal` in .NET.
- The Custom Element here is a *facade*; it avoids current limitations of Blazor's experimental CE feature while
  keeping a declarative tag shape for consumers.
