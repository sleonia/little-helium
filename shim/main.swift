import AppKit

let heliumURL = URL(fileURLWithPath: "/Applications/Helium.app")

final class AppDelegate: NSObject, NSApplicationDelegate {
    func applicationDidFinishLaunching(_ notification: Notification) {
        if CommandLine.arguments.contains("--make-default") {
            let bundleURL = Bundle.main.bundleURL
            for scheme in ["http", "https"] {
                NSWorkspace.shared.setDefaultApplication(at: bundleURL, toOpenURLsWithScheme: scheme) { error in
                    if let error { NSLog("set default for \(scheme) failed: \(error)") }
                }
            }
        }
    }

    func application(_ application: NSApplication, open urls: [URL]) {
        for url in urls { openMini(url) }
    }

    private func openMini(_ url: URL) {
        let config = NSWorkspace.OpenConfiguration()
        config.arguments = ["--app=\(url.absoluteString)"]
        config.createsNewApplicationInstance = true
        config.activates = true
        NSWorkspace.shared.openApplication(at: heliumURL, configuration: config) { _, error in
            if let error { NSLog("open in Helium failed: \(error)") }
        }
    }
}

let delegate = AppDelegate()
NSApplication.shared.delegate = delegate
NSApplication.shared.run()
