const inputElement = document.getElementById('prompt');
const terminalElement = document.getElementById('terminal');
const promptSpanElement = document.getElementById('prompt-span');

cwd = "/"
directories = 
    {
        "projects":
        {
            "test.txt":"test file",
            "test2.txt":"test file no. 2",
            "test3.txt":"test file no. 3",
            "test4.txt":"test file no. 4"
        },
        "info.txt": `github: https://github.com/ingobeans`
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
    const parts = path.split('/').filter(part => part !== ''); // Split path into parts and remove empty parts
  
    let currentDir = directories;
  
    for (const part of parts) {
      if (currentDir[part] && typeof currentDir[part] === 'object') {
        currentDir = currentDir[part];
      } else {
        return null; // Directory doesn't exist
      }
    }
  
    const result = {
      directories: [],
      files: []
    };
    for (const [name, content] of Object.entries(currentDir)) {
        if (typeof content === 'object') {
          result.directories.push(name);
        } else {
          result.files.push(name);
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
            contents = listDirectory(cwd);
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
});

function setFocusToPrompt() {
    inputElement.focus();
}

if (localStorage.getItem("theme") == null){
    localStorage.setItem("theme","dark");
}

setPrefix(">");
printOut("ingobeans terminal\n ");
setTheme(localStorage.getItem("theme"));