// import { isAutoAccept, setAutoAccept } from "./global.js";

async function isAutoAcceptPromise() {
    return (await chrome.storage.local.get("AutoAccept")).AutoAccept;
}

const setAutoAccept = (accept) => {
    let autoaccept = {}
    autoaccept["AutoAccept"] = accept;
    chrome.storage.local.set(autoaccept);
}

function updateButton(autoAccept) {
    if (autoAccept) {
        console.log("Auto accept On");
        chrome.action.setIcon({ path: "icons/on.png" });
    }
    else {
        console.log("Auto accept Off");
        chrome.action.setIcon({ path: "icons/off.png" });
    }
}

async function toggleautoaccepton() {
    let autoAccept = await isAutoAcceptPromise();
    setAutoAccept(!autoAccept);
    updateButton(!autoAccept);
}

console.log("Starting extension");
chrome.action.onClicked.addListener(toggleautoaccepton);

const _updateButton = async () => {
    let autoAccept = await isAutoAcceptPromise();
    if (autoAccept === undefined) {
        autoAccept = false;
        setAutoAccept(autoAccept);
    }
    updateButton(autoAccept);
}
_updateButton();