let highLighterButton = document.getElementById('highlightButton')

highLighterButton.addEventListener('click', async () => {
    try {
        let [tab] = await chrome.tabs.query({active: true, currentWindow: true})

        await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ["content.js"]
        })
    } catch (error) {
        console.error("Failed to execute Script", error);
    }

})