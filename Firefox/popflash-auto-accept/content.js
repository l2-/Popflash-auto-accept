const stringtomatch = "MATCH FOUND. ACCEPT!";
// const stringtomatch = "NEED 1 POPFLASH SUPPORTER...";

function log(msg) {
    console.log("Popflash-auto-accept:", msg);
}

async function isAutoAcceptPromise() {
    return (await browser.storage.local.get("AutoAccept")).AutoAccept;
}

let buttons = [];

function shouldClick(element, autoAccept) {
    return element.textContent.toLowerCase().startsWith(stringtomatch.toLowerCase()) && autoAccept;
}

function onStorageChanged(changes, area) {
    if (area == "local" && changes["AutoAccept"] !== undefined) {
        let autoAccept = changes.AutoAccept.newValue;
        if (autoAccept) {
            for (let button of buttons) {
                if (shouldClick(button, autoAccept)) {
                    log("Send it");
                    button.click();
                }
            }
        }
    }
}

function changeListener(element) {
    var observer = new MutationObserver(async function (mutations) {
        log("Button text:" + element.textContent)

        let autoAccept = await isAutoAcceptPromise();
        if (shouldClick(element, autoAccept)) {
            log("Send it");
            element.click();
        }
    });

    observer.observe(element, {
        attributes: true
    });
}

function listenToChildren(element, checkself) {
    let found = findButton();
    if (found == false) {
        if (element.children.length > 0) {
            for (let child of element.children) {
                recursiveListener(child);
            }
        }
        else if (checkself) {
            recursiveListener(element);
        }
        else {
            log("?????????", found);
        }
    }
}

function recursiveListener(element) {
    var observer = new MutationObserver(function (mutations) {
        listenToChildren(element, false);
    });

    observer.observe(element, {
        childList: true
    });
}

function findButton() {
    const elements = document.getElementsByClassName("queue-button");
    let found = false;
    if (elements.length > 0) {
        for (let element of elements) {
            log("Hooked to button:" + element.textContent);
            buttons.push(element);
            changeListener(element);
            found = true;
        }
    }

    if (found == false) log("No Popflash Queue Button Found!");
    return found;
}

const scrimcontainer = document.getElementById("scrim-container");
listenToChildren(scrimcontainer, true);

browser.storage.onChanged.addListener(onStorageChanged)

log("End of script");