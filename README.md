# Little Helium

A Little Arc clone for [Helium](https://helium.computer/) on macOS.

Links opened from other apps land in a small tabless Helium window instead of a tab in your main window, so the main window never jumps in front of what you were doing. It's the same Helium session, so logins and extensions work.

## How it works

`Little Helium.app` registers as the default browser and forwards every URL to Helium as `--app=<url>`, which opens it in a Chromium app window.

## Install

```sh
shim/build.sh
open -a "$HOME/Applications/Little Helium.app" --args --make-default
```

macOS asks to confirm the default browser change. To undo, pick Helium again in System Settings → Desktop & Dock → Default web browser.
