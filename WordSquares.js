function Absrt(x) {
	return Math.sqrt(Math.abs(x)) * Math.sign(x);
}

function CenterClick() {
	if ((y == 0) || confirm("New Game?")) {
		Init();
	}
}

function CreateBoard(n1, n2) {
	var strBuf = [];
	strBuf.push('<div style="display: table; width: 20%; margin: auto auto;">');
	var c = 0;
	for (var i = 0; i < n1; i++) {
	    strBuf.push('  <div style="display: table-row;">');
	    for (var j = 0; j < n2; j++) {
				strBuf.push(`    <div style="display: table-cell;" class="GridCell">`);
				strBuf.push(`        <input id="Grid${ZeroPad(i)}${ZeroPad(j)}" class="GridInput" value="" size="1" maxlength="1"/>`);
	      strBuf.push(`    </div>`)
	    }
	    strBuf.push('  </div>')
	}
	strBuf.push('</div>')

	return strBuf.join('\n');
}

function CheckCell(e) {

  e.preventDefault();

  var ael = document.activeElement
  var aid = ael.id;

  if (!aid.startsWith("Grid")) {
  	return true;
  }

  y = parseInt(aid.slice(4, 6));
  x = parseInt(aid.slice(6, 8));

  // Grid cell is not highlighted
  if ((x !== x) || (y !== y) || (x < 0) || (y < 0))
  	return true;

  if ((ael.value === ANSWER[y][x]) || (ael.value.length === 0)) {
  	ael.style.backgroundColor = "#F5F5F5";
  }
  else {
  	ael.style.backgroundColor = "#FF7070";
  }

  return false;
}

function CheckGrid() {

	var ael = document.activeElement
  var aid = ael.id;

  if (!aid.startsWith("Grid")) {
  	return false;
  }

  y = parseInt(aid.slice(4, 6));
  x = parseInt(aid.slice(6, 8));

  var c = 0;
	for (var i = 0; i < n2; i++) {
		var ele = document.getElementById(`Grid${ZeroPad(y)}${ZeroPad(i)}`);
		if        (ele.value === ANSWER[i]) {
			ele.style.backgroundColor = "#70FF70";
			c += 1;
		} else if (ANSWER.includes(ele.value))
			ele.style.backgroundColor = "#F5F5F5";
		else {
			ele.style.backgroundColor = "#FF7070";
			badSet.add(ele.value);
		}
	}

	return c === n2;
}

function HandleKeydown(e) {
  var ael = document.activeElement
  var aid = ael.id;

  if (done) {
  	return true;
  }

  if (!aid.startsWith("Grid")) {
  	return true;
  }

  y = parseInt(aid.slice(4, 6));
  x = parseInt(aid.slice(6, 8));

  // Type an upper case alpha
  if (e.keyCode > 64 && e.keyCode < 91) {
  	ael.value = String.fromCharCode(e.keyCode);
  	if (badSet.has(String.fromCharCode(e.keyCode))) {
  		ael.style.backgroundColor = "#AA7070";
  	} else {
  		ael.style.backgroundColor = "#505050";
  	}
  	x = x + 1;
  }

  // Typed a lowercase alpha char
  else if (e.keyCode > 96 && e.keyCode < 123) {
  	ael.value = String.fromCharCode(e.keyCode - 32);
  	if (badSet.has(String.fromCharCode(e.keyCode))) {
  		ael.style.backgroundColor = "#AA7070";
  	} else {
  		ael.style.backgroundColor = "#505050";
  	}
  	x = x + 1;
  }

  else if ((13 === e.keyCode) && IsWord()) {	        	// Enter key; check & move down
  	if (CheckGrid()) {
  		alert(["GREAT JOB!"]);
  		done = true;
  	} else if ((y + 1) >= n1) {
  		alert("GAME OVER!");
  		done = true;
  	} else {
  		y = y + 1;
  		x = 0;
  	}
  } else if (37 == e.keyCode) {		// Left
  	x = x - 1;
  } else if (38 === e.keyCode) {	// Up
  	//y = y - 1;
  } else if (39 === e.keyCode) {    // Right
  	x = x + 1;
  } else if (e.keyCode === 46) {    // Delete
  	ael.value = '';
  } else if (e.keyCode === 8) {     // Backspace
  	ael.style.backgroundColor = "#505050";
  	ael.value = '';
  	x = x - 1;
  }

  x = Math.min(n2 - 1, Math.max(0, x));

  var ele = document.getElementById(`Grid${ZeroPad(y)}${ZeroPad(x)}`);

  e.preventDefault();
  ele.focus();
  return false;
}

function Init() {
	document.addEventListener("keydown", HandleKeydown);

	var cont = document.getElementById("contents");
	n1 = n2 + 1;
	cont.innerHTML = CreateBoard(n1, n2);

	SetFontSize(2 + Absrt(5 - n2) * 0.4)

	done = false;
	x = y = 0;

	var Wn2 = WORDS[n2];
	var r = Math.random()
	ANSWER = Wn2[Math.floor(Wn2.length * r * r)].toUpperCase();

	badSet = new Set();

	localStorage.setItem("n1", n1)
}

function IsWord() {
	var str = "";
  for (var i = 0; i < n2; i++) {
		str += document.getElementById(`Grid${ZeroPad(y)}${ZeroPad(i)}`).value;
	}

	return WORDS[n2].includes(str);
}

function LeftClick() {
	if ((y == 0) || confirm("New Game?")) {
		n2 = Math.max(n2 - 1, 3);
		document.getElementById("sizeBtn").innerHTML = ` &nbsp; ${n2} &nbsp; `;
		Init();
	}
}

function OnLoad() {
	var n1s = localStorage.getItem("n1");
	if (n1s === null) {
		n1 = 6
		n2 = 5
	} else {
		n1 = parseInt(n1s);
		n2 = n1 - 1
	}
	document.getElementById("sizeBtn").innerHTML = ` &nbsp; ${n2} &nbsp; `;
	Init();
}

function RightClick() {
	if ((y == 0) || confirm("New Game?")) {
		n2 = Math.min(n2 + 1, 10);
		document.getElementById("sizeBtn").innerHTML = ` &nbsp; ${n2} &nbsp; `;
		Init();
	}
}

function SetFontSize(x) {
	var elements = document.getElementsByClassName('GridInput');

	for (var i = 0; i < elements.length; i++) {
		elements[i].style.fontSize = `${x}em`;
	}
}

function ZeroPad(x) {
	return ('00' + x).slice(-2)
}

var ANSWER = "";
var done   = false;
var badSet = new Set();

var n1 = 6;
var n2 = 5;

document.addEventListener("DOMContentLoaded", OnLoad);
