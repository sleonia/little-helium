#!/bin/sh
set -e
cd "$(dirname "$0")"
APP="$HOME/Applications/Little Helium.app"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS"
cp Info.plist "$APP/Contents/"
swiftc -O main.swift -o "$APP/Contents/MacOS/LittleHelium"
codesign --force -s - "$APP"
/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -f "$APP"
echo "built $APP"
