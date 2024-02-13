const inputElement = document.getElementById('prompt');

var writableKeys = "qwertyuiopasdfghjklzxcvbnm<,.-'+1234567890 "

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

function handleCommand(keyword,args){
    
}

document.body.addEventListener('keydown', function(event) {
    event.preventDefault();
    if (event.key === "Enter") {
        let value = inputElement.value;
        let args = value.trim().split(" ");
        handleCommand(args.shift(),args);
        inputElement.value = "";
    };
    if (writableKeys.includes(event.key)){
        inputElement.value+=event.key
    }
    if (event.key === "Backspace"){
        inputElement.value = inputElement.value.slice(0,inputElement.value.length-1);
    }
});

if (localStorage.getItem("theme") == null){
    localStorage.setItem("theme","dark");
}
setTheme("dark");