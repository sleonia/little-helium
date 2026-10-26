const MINI_WIDTH = 1000;
const MINI_HEIGHT = 750;
const ALL_TYPES = { windowTypes: ["normal", "popup", "app"] };

chrome.windows.onCreated.addListener(async (win) => {
  if (win.type !== "app") return;
  const left = Math.round(win.left + (win.width - MINI_WIDTH) / 2);
  const top = Math.round(win.top + (win.height - MINI_HEIGHT) / 2);
  await chrome.windows.update(win.id, { width: MINI_WIDTH, height: MINI_HEIGHT, left, top });
}, ALL_TYPES);

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) return;
  const win = await chrome.windows.get(windowId).catch(() => null);
  if (win?.type === "normal") await chrome.storage.session.set({ lastNormalWindowId: windowId });
}, ALL_TYPES);

async function mainWindow() {
  const { lastNormalWindowId } = await chrome.storage.session.get("lastNormalWindowId");
  const remembered = lastNormalWindowId && (await chrome.windows.get(lastNormalWindowId).catch(() => null));
  if (remembered) return remembered;
  const [any] = await chrome.windows.getAll({ windowTypes: ["normal"] });
  return any ?? null;
}

async function expand(tab) {
  const main = await mainWindow();
  if (!main) {
    await chrome.windows.create({ url: tab.url, focused: true });
    await chrome.windows.remove(tab.windowId);
    return;
  }
  try {
    await chrome.tabs.move(tab.id, { windowId: main.id, index: -1 });
    await chrome.tabs.update(tab.id, { active: true });
  } catch {
    await chrome.tabs.create({ windowId: main.id, url: tab.url, active: true });
    await chrome.windows.remove(tab.windowId);
  }
  await chrome.windows.update(main.id, { focused: true });
}

function looksLikeUrl(text) {
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(text) || (!/\s/.test(text) && /\.[a-z]{2,}(?:[/:?#]|$)/i.test(text)) || /^localhost(?::\d+)?(?:\/|$)/.test(text);
}

async function navigate(tab, text) {
  if (looksLikeUrl(text)) {
    const url = /^[a-z][a-z0-9+.-]*:\/\//i.test(text) ? text : `https://${text}`;
    await chrome.tabs.update(tab.id, { url });
  } else {
    await chrome.search.query({ text, tabId: tab.id });
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tab = sender.tab;
  if (!tab) return;
  if (message.type === "isMini") {
    chrome.windows.get(tab.windowId).then((win) => sendResponse(win.type === "app"), () => sendResponse(false));
    return true;
  }
  if (message.type === "expand") expand(tab);
  if (message.type === "navigate") navigate(tab, message.text.trim());
});
