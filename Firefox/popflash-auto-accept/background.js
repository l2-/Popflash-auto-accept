// import { isAutoAccept, setAutoAccept } from "./global.js";

async function isAutoAcceptPromise() {
    return (await browser.storage.local.get("AutoAccept")).AutoAccept;
}

const setAutoAccept = (accept) => {
    let autoaccept = {}
    autoaccept["AutoAccept"] = accept;
    browser.storage.local.set(autoaccept);
}

function updateButton(autoAccept) {
    if (autoAccept) {
        console.log("Auto accept On");
        browser.browserAction.setIcon({ path: "icons/on.png" });
    }
    else {
        console.log("Auto accept Off");
        browser.browserAction.setIcon({ path: "icons/off.png" });
    }
}

async function toggleautoaccepton() {
    let autoAccept = await isAutoAcceptPromise();
    setAutoAccept(!autoAccept);
    updateButton(!autoAccept);
}

console.log("Starting extension");
browser.browserAction.onClicked.addListener(toggleautoaccepton);

const _updateButton = async () => {
    let autoAccept = await isAutoAcceptPromise();
    updateButton(autoAccept);
}
_updateButton();