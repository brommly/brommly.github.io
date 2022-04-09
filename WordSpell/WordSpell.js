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
    DONE  = new Set();

    localStorage.setItem("n1-sp", n1);
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
    CUR_STR = "";
    CUR_BV  = 0;
    while(numWords < 10) {
        CUR_STR = RandomStr();
        CUR_BV  = 0;
        for(var i = 0; i < n1; i++) {
            CUR_BV = CUR_BV | (1 << (CUR_STR.charCodeAt(i) - a));
        }
        numWords = getNumWords(CUR_BV, BV_COUNT);
    }
    NUM = getNumWords(CUR_BV, BV_TOTAL);
    return CUR_STR;
}

function OnLoad() {
    var n1s = localStorage.getItem("n1-sp");
    if (n1s === null) {
        n1 = 8;
    } else {
        n1 = parseInt(n1s);
    }
    document.getElementById("sizeBtn").innerHTML = ` &nbsp; ${n1} &nbsp; `;
    Init();
}

function RandomStr() {
    var abet = "abcdefghijklmnopqrstuvwxyz";
    var str = "";
    for(var i = 0; i < n1; i++) {
    	var r    = Math.random();
    	str += abet[Math.floor(abet.length * r)];
    }
    return str;
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

    // Sort completed words and display
    var wEle = document.getElementById("WordBox");
    var tmp  = wEle.innerHTML + "<br>" + ele.value;
    wEle.innerHTML = tmp.split(/<br>/).filter(s => s.length > 0).map(s => s.trim()).sort().join("<br>");

    // Add to set of completed and clear input
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


var CUR_STR = "";
var CUR_BV  = 0;

var DONE   = new Set();
var NUM    = 0;
var LEVEL  = 0;
var SCORE  = 0;

var n1 = 8;

document.addEventListener("DOMContentLoaded", OnLoad);
