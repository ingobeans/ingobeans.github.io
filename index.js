const inputElement = document.getElementById('prompt');
const terminalElement = document.getElementById('terminal');

const THEMES = {
    "dark":["#242424","#c1c1c1","#151515","#34ee51"],
    "light":["#ececec","#1a1a1a","#ffffff","#34ee51"]
}

function setTheme(theme){
    var r = document.querySelector(':root');

    r.style.setProperty('--primaryColor', THEMES[theme][0]);
    r.style.setProperty('--textColor', THEMES[theme][1]);
    r.style.setProperty('--secondaryColor', THEMES[theme][2]);
    r.style.setProperty('--highlightColor', THEMES[theme][3]);
}

function printOut(text){
    var textElement = document.createElement("p");
    textElement.innerText = text;
    textElement.classList.add("text-output");
    terminalElement.insertBefore(textElement, inputElement);
}

function handleCommand(keyword,args){
    console.log(keyword, args);
    printOut("received your command!")
}

document.body.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        let value = inputElement.value;
        let args = value.trim().split(" ");
        handleCommand(args.shift(),args);
        inputElement.value = "";
    };
});

if (localStorage.getItem("theme") == null){
    localStorage.setItem("theme","dark");
}
setTheme("dark");