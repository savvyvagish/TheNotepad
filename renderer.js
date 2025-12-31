const { ipcRenderer } = require("electron");

const editor = document.getElementById("editor");

// Keyboard shortcuts
document.addEventListener("keydown", async (e) => {
  // SAVE
  if ((e.metaKey || e.ctrlKey) && e.key === "s") {
    e.preventDefault();
    ipcRenderer.invoke("save-file", editor.value);
  }

  // OPEN
  if ((e.metaKey || e.ctrlKey) && e.key === "o") {
    e.preventDefault();
    const content = await ipcRenderer.invoke("open-file");
    if (content !== null) editor.value = content;
  }
});

// Window controls
document.querySelectorAll(".controls span").forEach(btn => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    ipcRenderer.send("window-control", action);
  });
});