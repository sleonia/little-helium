# Little Helium

A Little Arc clone for [Helium](https://helium.computer/) on macOS.

Links opened from other apps land in a small tabless Helium window instead of a tab in your main window, so the main window never jumps in front of what you were doing. It's the same Helium session, so logins and extensions work.

## How it works

- `shim/` — `Little Helium.app` registers as the default browser and forwards every URL to Helium as `--app=<url>`, which opens it in a Chromium app window.
- `extension/` — a Helium extension for those app windows: sizes new ones to 1000×750, ⌘L shows a URL bar (⌘C copies, Enter navigates or searches, Esc closes), ⌘O moves the page into the main window.

## Install

```sh
shim/build.sh
open -a "$HOME/Applications/Little Helium.app" --args --make-default
```

Then load `extension/` in `helium://extensions` → Developer mode → Load unpacked.

macOS asks to confirm the default browser change. To undo, pick Helium again in System Settings → Desktop & Dock → Default web browser.
