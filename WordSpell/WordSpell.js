function Absrt(x) {
    return Math.sqrt(Math.abs(x)) * Math.sign(x);
}

function Back() {
    var ele = document.getElementById('WordInput');
    ele.value = ele.value.slice(0, Math.max(0, ele.value.length - 1));
}

function CenterClick() {
    if ((DONE.size == 0) || confirm("New Game?")) {
        Init();
    }
}

function CreateBoard(n1) {
    var chars = MakeInstance();
    strBuf = [''];
    var c  = 0;
    var b1 = 0;
    var b2 = 0;
    if (window.innerWidth > window.innerHeight) {
        b1 = 2;
        b2 = (n1 / 2);
    } else {
        b1 = (n1 / 2);
        b2 = 2;
    }
    for (var i = 0; i < b1; i++) {
        strBuf.push('          <div style="display: table-row;">');
        for (var j = 0; j < b2; j++) {
	        var cij = chars[c];
	        c += 1;
	        strBuf.push(`            <div style="display: table-cell;" class="GridCell">`);
	        strBuf.push(`                <button class="GridBtn" onclick="TypeChar('${cij}')">${cij}</button>`);
	        strBuf.push(`            </div>`)
        }
        strBuf.push('          </div>\n       ')
    }
    return strBuf.join('\n');
}

function getNumWords(bv, BV_MAP) {
    var nWords = 0;
    for (var bvi in BV_MAP) {
        if ((bv & bvi) == bvi) {
            nWords += BV_MAP[bvi];
        }
    }
    return nWords;
}

function Clear() {
    var ele = document.getElementById('WordInput');

    ele.value = "";
}

function Init() {
    var cont = document.getElementById("contents");
    cont.innerHTML = CreateBoard(n1);

    SCORE = 0;
    LEVEL = 0;

    localStorage.setItem("n1", n1);
    UpdateText();
}

function LeftClick() {
    if ((DONE.size == 0) || confirm("New Game?")) {
        n1 = Math.max(n1 - 2, 4);
        document.getElementById("sizeBtn").innerHTML = ` &nbsp; ${n1} &nbsp; `;
        Init();
    }
}

function MakeInstance() {
    var a = 97;
    var numWords = 0;
    var str = "";
    while(numWords < 10) {
        str = "";
        var bv  = 0;
        for(var i = 0; i < n1; i++) {
            str += RandomAlpha();
            bv  |= str.charCodeAt(i) - a;
        }

        numWords = getNumWords(bv, BV_COUNT);
    }
    NUM = getNumWords(bv, BV_TOTAL);
    return str;
}

function OnLoad() {
    var n1s = localStorage.getItem("n1");
    if (n1s === null) {
        n1 = 8;
    } else {
        n1 = parseInt(n1s);
    }
    document.getElementById("sizeBtn").innerHTML = ` &nbsp; ${n1} &nbsp; `;
    Init();
}

function RandomAlpha() {
    var abet = "abcdefghijklmnopqrstuvwxyz";
    var r    = Math.random();
    return abet[Math.floor(abet.length * r)]
}

function RightClick() {
    if ((DONE.size == 0) || confirm("New Game?")) {
        n1 = Math.min(n1 + 2, 10);
        document.getElementById("sizeBtn").innerHTML = ` &nbsp; ${n1} &nbsp; `;
        Init();
    }
}

function Try() {
    var ele = document.getElementById('WordInput');

    if (!WORDS.has(ele.value) || DONE.has(ele.value)) {
        return;
    }

    var wEle = document.getElementById("WordBox");
    wEle.innerHTML += "<br/>" + ele.value;

    DONE.add(ele.value);
    ele.value = "";

    UpdateText();

    if        ((SCORE >= NUM)         && (LEVEL < 6)) {
        alert("PERFECT SCORE");
        LEVEL += 1;
    } else if ((SCORE >= (NUM * 0.9)) && (LEVEL < 5)) {
        alert("AMAZING");
        LEVEL += 1;
    } else if ((SCORE >= (NUM * 0.8)) && (LEVEL < 4)) {
        alert("BRILLIANT");
        LEVEL += 1;
    } else if ((SCORE >= (NUM * 0.7)) && (LEVEL < 3)) {
        alert("CHARMING");
        LEVEL += 1;
    } else if ((SCORE >= (NUM * 0.6)) && (LEVEL < 2)) {
        alert("DAZZLING");
        LEVEL += 1;
    } else if ((SCORE >= (NUM * 0.5)) && (LEVEL < 1)) {
        alert("HALFWAY THERE");
        LEVEL += 1;
    }
}

function TypeChar(c) {
    var ele = document.getElementById('WordInput');

    ele.value += c;
}

function UpdateText() {
    var ele = document.getElementById("WordText");
    ele.innerHTML = `Words: ${DONE.size}`;

    var score = 0;
    DONE.forEach(x => score += x.length);
    ele = document.getElementById("ScoreText");
    ele.innerHTML = `Score: ${score}`;

    if (LEVEL == 6) {
        ele.innerHTML = "Score: HIGH SCORE";
    }
}

function ZeroPad(x) {
    return ('00' + x).slice(-2)
}

var DONE   = new Set();
var done   = false;
var NUM    = 0;
var LEVEL  = 0;
var SCORE  = 0;

var n1 = 8;

document.addEventListener("DOMContentLoaded", OnLoad);
