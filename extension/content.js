(() => {
  let isMini = false;
  let bar = null;

  chrome.runtime.sendMessage({ type: "isMini" }).then((mini) => { isMini = mini; }, () => {});

  const style = new CSSStyleSheet();
  style.replaceSync(`
    :host { all: initial; position: fixed; top: 8px; left: 50%; transform: translateX(-50%);
            width: min(720px, calc(100vw - 32px)); z-index: 2147483647; }
    input { box-sizing: border-box; width: 100%; padding: 10px 14px; border-radius: 10px;
            border: 1px solid rgba(0,0,0,.15); background: #fff; color: #111;
            font: 14px -apple-system, system-ui, sans-serif; outline: none;
            box-shadow: 0 8px 28px rgba(0,0,0,.25); }
    @media (prefers-color-scheme: dark) {
      input { background: #2a2a2c; color: #eee; border-color: rgba(255,255,255,.15); }
    }
  `);

  function closeBar() {
    const current = bar;
    bar = null;
    current?.remove();
  }

  function openBar() {
    if (bar) return bar.shadowRoot.querySelector("input").select();
    bar = document.createElement("little-helium-bar");
    const root = bar.attachShadow({ mode: "open" });
    root.adoptedStyleSheets = [style];
    const input = document.createElement("input");
    input.value = location.href;
    input.spellcheck = false;
    input.addEventListener("keydown", (event) => {
      event.stopPropagation();
      if (event.key === "Escape") closeBar();
      if (event.key === "Enter" && input.value.trim()) {
        chrome.runtime.sendMessage({ type: "navigate", text: input.value });
        closeBar();
      }
    });
    input.addEventListener("blur", closeBar);
    root.append(input);
    document.documentElement.append(bar);
    input.focus();
    input.select();
  }

  window.addEventListener("keydown", (event) => {
    if (!isMini || !event.metaKey || event.shiftKey || event.altKey || event.ctrlKey) return;
    if (event.code !== "KeyL" && event.code !== "KeyO") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.code === "KeyL") openBar();
    else chrome.runtime.sendMessage({ type: "expand" });
  }, true);
})();
