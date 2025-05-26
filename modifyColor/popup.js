//finds the button with id changeColor
let colorChangeButton = document.getElementById('changeColor')
let colorChanged = false;

//eventListener for the button
colorChangeButton.addEventListener("click", async () => {
    //current active tab
    try{
        let [tab] = await chrome.tabs.query({active: true, currentWindow: true})
        const scriptFile = colorChanged ? "contentChange.js" : "content.js"

        await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files:[scriptFile]
        })
    
        colorChanged = !colorChanged;
        updateButtonText();
    }catch(error){
        console.error("Failed to execute script: ", error)
    }
}) 

function updateButtonText() {
    colorChangeButton.textContent = colorChanged ? "Reset Color" : "Change to red";
}