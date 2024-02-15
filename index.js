const inputElement = document.getElementById('prompt');
const terminalElement = document.getElementById('terminal');
const promptSpanElement = document.getElementById('prompt-span');

cwd = "/"
directories = 
    {
        "projects":
        {
            "boopy.txt":`github: https://github.com/ingobeans/boopy

            boopy is a free simple game engine for python with the goal to be quick to use and intuitive. 'tis based on pygame`,

            "auto-owl-watcher.txt":`github: https://github.com/ingobeans/Auto-OWL-Watcher

            a program which runs in the background and automatically streams overwatch league matches on youtube to generate owl tokens
            (probably dead now since they canceled owl)`,

            "wikipedia-chatgpt.txt":`github: https://github.com/ingobeans/wikipedia-ui-for-chatgpt
            
            a wikipedia looking frontend to access chatgpt`,
            
            "discord-character-bot.txt":`github: https://github.com/ingobeans/discord-character-bot
            
            discord chat bot which can be highly customizable characters defined by the user, uses the PAI-001 model or GPT-3.5 for chat completion.
            can also be combined with a webhook to allow it to customize avatar and username based on character preset`,
        },
        "info.txt": `my github: https://github.com/ingobeans
        i'm ingobeans! i make dumb apps and websites!`
    }

HELPMESSAGE = 
`help - prints help message
pwd - prints current working directory
cd <path> - change directory
theme <new theme> - set theme
cls - clear terminal
cat <path> - read file`

const THEMES = {
    "dark":["#242424","#c1c1c1","#151515","#34ee51","#999999","#ff7676","#7575ff"],
    "light":["#ececec","#1a1a1a","#ffffff","#2db943","#6a6a6a","#e33e3e","#2626ff"]
}

function setTheme(theme){
    var r = document.querySelector(':root');

    r.style.setProperty('--primaryColor', THEMES[theme][0]);
    r.style.setProperty('--textColor', THEMES[theme][1]);
    r.style.setProperty('--secondaryColor', THEMES[theme][2]);
    r.style.setProperty('--highlightColor', THEMES[theme][3]);
    r.style.setProperty('--mutedColor', THEMES[theme][4]);
    r.style.setProperty('--errorColor', THEMES[theme][5]);
    r.style.setProperty('--secondaryHighlightColor', THEMES[theme][6]);
}

function printOut(text,color="inherit"){
    if (text.includes("\n")){
        text = text.split("\n");
        text.forEach(message => {
            printOut(message);
        });
        return;
    }
    // if multiple lines, split to individual messages and print each individually

    var textElement = document.createElement("p");
    textElement.innerText = text;
    textElement.innerHTML = textElement.innerHTML.replace(/(https:\/\/\S+)/, '<a href="$1" target="_blank">$1</a>');
    // replace URLs with clickable URLs

    textElement.classList.add("text-output");
    textElement.style = "color: "+color;
    terminalElement.insertBefore(textElement, inputElement.parentElement);
    window.scrollTo(0, document.body.scrollHeight);
}

function printError(text){
    printOut(text,"var(--errorColor)");
}

function setPrefix(prefix){
    promptSpanElement.innerText = prefix;
    promptSpanElement.appendChild(inputElement);
}

function directoryExists(path) {
    const parts = path.split('/').filter(part => part !== '');

    let currentDir = directories;

    for (const part of parts) {
        if (currentDir[part] && typeof currentDir[part] === 'object') {
        currentDir = currentDir[part];
        } else {
        return false;
        }
    }

    return true;
}

function listDirectory(path) {
    const parts = path.split('/').filter(part => part !== '');
  
    let currentDir = directories;
  
    for (const part of parts) {
      if (currentDir[part] && typeof currentDir[part] === 'object') {
        currentDir = currentDir[part];
      } else {
        return null;
      }
    }
  
    const result = {
      directories: [],
      files: [],
      all: []
    };
    for (const [name, content] of Object.entries(currentDir)) {
        if (typeof content === 'object') {
          result.directories.push(name);
          result.all.push(name);
        } else {
          result.files.push(name);
          result.all.push(name);
        }
      }
    
      return result;
}

function removeLastPathComponent(path) {
    const pathArray = path.substring(0, path.length-1).split('/');
    pathArray.pop();
    const result = pathArray.join('/');

    return result;
}

function readFile(path) {
    const parts = path.split('/').filter(part => part !== '');

    let currentDir = directories;

    for (const part of parts.slice(0, -1)) {
        if (currentDir[part] && typeof currentDir[part] === 'object') {
            currentDir = currentDir[part];
        } else {
            return null;
        }
    }

    const fileName = parts[parts.length - 1];
    const fileContent = currentDir[fileName];

    return typeof fileContent === 'string' ? fileContent : null;
}

function fileExists(path) {
    const parts = path.split('/').filter(part => part !== '');

    let currentDir = directories;

    for (const part of parts.slice(0, -1)) {
        if (currentDir[part] && typeof currentDir[part] === 'object') {
        currentDir = currentDir[part];
        } else {
        return false;
        }
    }

    const fileName = parts[parts.length - 1];
    return currentDir.hasOwnProperty(fileName) && typeof currentDir[fileName] === 'string';
}

function handleCommand(raw,keyword,args,argsArray){
    console.log(keyword, argsArray);
    printOut(">"+raw,"var(--mutedColor)");
    
    if (raw == ""){
        return;
    }

    switch (keyword){
        case "help":
            printOut(HELPMESSAGE);
            break;
        case "pwd":
            printOut(cwd);
            break;
        case "cat":
            if (argsArray.length != 1){
                printError("incorrect arguments");
                break;
            }
            var path = args.replace(/^\/+|\/+$/g, '');
            
            if (fileExists(cwd+path)){
                path = cwd+path;
            }else if (fileExists(path)){
            
            }else{
                printError("file '" + args + "' doesn't exist");
                break;
            }
            var contents = readFile(path);
            printOut(contents);
            
            break;
        case "theme":
            if (argsArray.length != 1){
                printOut("Available themes:");
                for (const theme in THEMES) {
                    printOut(theme, "var(--highlightColor)")
                };
                break;
            }
            localStorage.setItem("theme",argsArray[0]);
            setTheme(localStorage.getItem("theme"));
            break;
        case "cls":
            document.querySelectorAll('.text-output').forEach(e => e.remove());
            break;
        case "cd":
            if (argsArray.length != 1){
                printError("incorrect arguments");
                break;
            }
            var dir = "";
            var path = args.replace(/^\/+|\/+$/g, '');
            if (path == ".."){
                dir = removeLastPathComponent(cwd);
            }
            else if (directoryExists(path)){
                dir = path;
            } else if(directoryExists(cwd+path)) {
                dir = cwd+path;
            } else {
                printError("directory '" + args + "' doesn't exist");
                break;
            }

            dir += "/";

            cwd = dir;
            break;
        case "ls":
            var path = cwd;

            if (argsArray.length == 1){
                var targetDirectory = args.replace(/^\/+|\/+$/g, '') + "/";
                if (directoryExists(targetDirectory)){
                    path = targetDirectory;
                }else if (directoryExists(cwd + targetDirectory)){
                    path = targetDirectory;
                }else{
                    printError("'" + targetDirectory + "' doesn't exist");
                    break;
                }
            }

            contents = listDirectory(path);
            console.log(contents);
            
            contents["directories"].forEach(directory => {
                printOut(directory, "var(--secondaryHighlightColor)");
            });
            contents["files"].forEach(file => {
                printOut(file, "var(--highlightColor)");
            });
            break;
        default:
            printError("'tis an unrecognized command");
            break;
    }
}

let commandHistory = [];
let historyIndex = -1;

inputElement.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        let value = inputElement.value;
        let args = value.trim().split(" ");
        handleCommand(value, args.shift(), args.join(" "), args);
        inputElement.value = "";

        if (value != ""){
            commandHistory.unshift(value);
            historyIndex = -1; 
        }
    }
    
    // for history navigation:
    else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            inputElement.value = commandHistory[historyIndex];
            inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
        }
    } else if (event.key === "ArrowDown") {
        event.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            inputElement.value = commandHistory[historyIndex];
            inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
        } else if (historyIndex === 0) {
            historyIndex = -1;
            inputElement.value = "";
            // show empty input at top of history
        }
    }
    
    // for auto completions
    else if (event.key === "Tab") {
        event.preventDefault();
        let value = inputElement.value.split(" ")[inputElement.value.split(" ").length - 1]; // auto complete the last word in input only
        if (value == ""){
            return;
        }

        let directoryContents = listDirectory(cwd).all;

        for (const content of directoryContents) {
            if (content.startsWith(value)) {
                inputElement.value = inputElement.value.substring(0, inputElement.value.length - value.length) + content;
                break;
            }
        }
    }
});

function setFocusToPrompt() {
    inputElement.focus();
}

if (localStorage.getItem("theme") == null){
    localStorage.setItem("theme","dark");
}

setPrefix(">");
printOut("ingobeans terminal v1");
setTheme(localStorage.getItem("theme"));