const inputElement = document.getElementById('prompt');
const terminalElement = document.getElementById('terminal');
const promptSpanElement = document.getElementById('prompt-span');

cwd = "/"
directories = 
    {
        "home":
        {
            "downloads": 
            {
                "dog.png":"<IMG DATA>",
                "cat.png":"<IMG DATA>",
                "stuff.txt":"dont forget to do laundry"
            }
            
        },
        "root":
        {
            "programs":
            {
                "ffmpeg":"<PROGRAM DATA>"
            },
            "userdata":
            {
                "microsoft":
                {
                    "config.ini":"<CONFIG FILE>"
                }
            }
        }
    }


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
    textElement.classList.add("text-output");
    textElement.style = "color: "+color;
    terminalElement.insertBefore(textElement, inputElement.parentElement);
    window.scrollTo(0, document.body.scrollHeight);
}

function printError(text){
    printOut(text,"rgb(255, 118, 118)");
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

function handleCommand(raw,keyword,args,argsArray){
    console.log(keyword, argsArray);
    printOut(">"+raw);
    
    if (raw == ""){
        return;
    }

    switch (keyword){
        case "help":
            printOut("no help 4 u");
            break;
        case "pwd":
            printOut(cwd);
            break;
        case "cd":
            if (argsArray.length != 1){
                printError("incorrect arguments");
                break;
            }
            var dir = ""
            if (directoryExists(args)){
                dir = args;
            } else if(directoryExists(cwd+args)) {
                dir = cwd+args;
            } else {
                printError("directory '" + args + "' doesn't exist");
                break;
            }

            if (!dir.endsWith("/")){
                dir += "/"
            }

            cwd = dir;
            break;
        case "ls":
            contents = listDirectory(cwd);
            console.log(contents);
            
            contents["directories"].forEach(directory => {
                printOut(directory, "rgb(117, 117, 255)");
            });
            contents["files"].forEach(file => {
                printOut(file, "rgb(89, 255, 89)");
            });
            break;
        default:
            printError("'"+keyword+"' tis not recognised as an internal command.");
            break;
    }
}

document.body.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        let value = inputElement.value;
        let args = value.trim().split(" ");
        handleCommand(value, args.shift(), args.join(" "), args);
        inputElement.value = "";
    };
});

function setFocusToPrompt() {
    inputElement.focus();
}

if (localStorage.getItem("theme") == null){
    localStorage.setItem("theme","dark");
}

setPrefix(">");
printOut("ingobeans terminal\n ");
setTheme("dark");