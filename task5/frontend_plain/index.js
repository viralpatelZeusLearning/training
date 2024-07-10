var canvaref = document.querySelector("#myCanvas");
var headerref = document.querySelector("#headers");
var inputref = document.querySelector(".inputtext");
var formref = document.querySelector("#file");

let file = null;
let columnWidth = 100;
let rowHeight = 30;
let selectedCell = null;
let starting = null;
let ending = null;

const dataColumns = [
  "Name",
  "email",
  "Age",
  "address line 1",
  "address line2",
  "addressline3",
  "role",
  "country",
  "state",
  "city",
  "phone no",
  "Nationality",
  "Gender",
  "2020 salary",
  "2021 salary",
  "2024 salary",
];
const rows = [
  {
    Name: "viral",
    email: "user@gmail.com",
    Age: 22,
  },
  {
    Name: "shreyas",
    Age: 24,
  },
  {
    Name: "manav",
    Age: 22,
  },
  {
    Name: "yash",
    Age: 20,
  },
  {
    Name: "Asher",
  },
  {
    Name: "shubham",
  },
  {
    Name: "nihal",
  },
  {
    Name: "viral",
  },
  {
    Name: "shreyas",
  },
  {
    Name: "manav",
  },
  {
    Name: "yash",
  },
  {
    Name: "Asher",
  },
  {
    Name: "shubham",
  },
  {
    Name: "nihal",
  },
  {
    Name: "viral",
  },
  {
    Name: "shreyas",
  },
  {
    Name: "manav",
  },
  {
    Name: "yash",
  },
  {
    Name: "Asher",
  },
  {
    Name: "shubham",
  },
  {
    Name: "nihal",
  },
  {
    Name: "viral",
  },
  {
    Name: "viral",
  },
  {
    Name: "shreyas",
  },
  {
    Name: "manav",
  },
  {
    Name: "yash",
  },
  {
    Name: "Asher",
  },
  {
    Name: "shubham",
  },
  {
    Name: "nihal",
  },
  {
    Name: "viral",
  },
  {
    Name: "shreyas",
  },
  {
    Name: "manav",
  },
  {
    Name: "yash",
  },
  {
    Name: "Asher",
  },
  {
    Name: "shubham",
  },
  {
    Name: "nihal",
  },
  {
    Name: "viral",
  },
  {
    Name: "shreyas",
  },
  {
    Name: "manav",
  },
  {
    Name: "yash",
  },
  {
    Name: "Asher",
  },
  {
    Name: "shubham",
  },
  {
    Name: "nihal",
  },
  {
    Name: "viral",
  },
];

const columnArr = [
  180, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
  100,
];
// let currIndex = 0;
// canvaref.width = dataColumns.length * columnWidth;

ctx = canvaref.getContext("2d");
let ctxheaders = headerref.getContext("2d");
headers();
table();
console.log(rows.length);
function handleSubmit(e) {
  file = e.target.files[0];
  console.log(file);
}
async function headers() {
  //header data and table
  headerref.width = Math.max(
    columnArr.reduce((prev, curr) => prev + curr, 0),
    window.innerWidth
  );
  headerref.height = rowHeight;
  ctxheaders.restore();
  ctxheaders.clearRect(0, 0, canvaref.width, canvaref.height);
  let x = 0;
  for (let i = 0; i < columnArr.length; i++) {
    ctxheaders.beginPath();
    ctxheaders.save();
    ctxheaders.rect(x, 0, columnArr[i], rowHeight); //x position y position width height
    ctxheaders.clip();
    ctxheaders.fillStyle = "black";
    ctxheaders.font = `bold ${15}px Quicksand`;
    ctxheaders.fillText(dataColumns[i].toUpperCase(), x + 4, rowHeight - 10);
    ctxheaders.restore();
    ctxheaders.moveTo(columnArr[i] + x, 0);
    ctxheaders.lineTo(columnArr[i] + x, canvaref.height);
    ctxheaders.stroke();
    x += columnArr[i];
  }
  ctxheaders.save();
}
async function table() {
  // console.log("table");
  canvaref.width = Math.max(
    columnArr.reduce((prev, curr) => prev + curr, 0),
    window.innerWidth
  );
  canvaref.height = (rows.length + 1) * rowHeight;
  ctx.restore();
  ctx.clearRect(0, 0, canvaref.width, canvaref.height);

  //cell data
  var sum = 0;
  for (let i = 0; i < dataColumns.length; i++) {
    for (let j = 0; j < rows.length; j++) {
      // console.log(i,j,rows[j][dataColumns[i]]);
      ctx.beginPath();
      ctx.save();
      ctx.rect(sum, j * rowHeight, columnArr[i], rowHeight);
      ctx.clip();
      ctx.font = `${15}px Quicksand`;
      if (
        selectedCell &&
        selectedCell.col === i &&
        selectedCell.row === j
      ) {
        console.log("select",selectedCell);
        inputref.style.display = "block";
        inputref.style.left = sum + 8 + "px";
        inputref.style.top = rowHeight * (j + 1) + "px";
        inputref.value = rows[j][dataColumns[i]];
        inputref.style.width = columnArr[i] + "px";
        inputref.style.height = rowHeight + "px";
      }
      //range selection
      else if (
        starting &&
        ending &&
        Math.min(starting.row, ending.row) <= j &&
        j <= Math.max(starting.row, ending.row) &&
        Math.min(starting.col, ending.col) <= i &&
        i <= Math.max(starting.col, ending.col)
      ) {
        ctx.fillStyle = "rgb(178, 218, 245)";
        ctx.fillRect(sum, j * rowHeight, columnArr[i], rowHeight);
        selectedCell=null;
      } 

      ctx.fillStyle = "black";
      ctx.fillText(rows[j][dataColumns[i]], sum + 4, (j + 1) * rowHeight - 10);
      ctx.moveTo(sum, 0);
      ctx.lineTo(sum, canvaref.height);
      ctx.stroke();
      ctx.restore();
    }
    sum += columnArr[i];
    // console.log(sum);
  }
  ctx.save();
}

function changeCordinates(e) {
  let xcord;
  let off = e.offsetX;
  for (xcord = 0; xcord < columnArr.length; xcord++) {
    // console.log("xcord");
    off = off - columnArr[xcord];
    if (off <= 0) {
      break;
      // xcord = Math.floor(e.offsetX - columnArr[i]);
    }
  }
  return xcord;
}

function handleClick(e) {
  e = e || window.Event;
  // let xcord = Math.floor(e.offsetX / columnWidth); //horizontal mouse click control
  let xcord = changeCordinates(e);
  let ycord = Math.floor(e.offsetY / rowHeight); //vertocal mouse roll
  // console.log(ycord);
  console.log("cell position : " + ycord + " " + xcord);
  console.log("Cell data : ", rows[ycord][dataColumns[xcord]]);
  selectedCell = { row: ycord, col: xcord };
  console.log("slecet data", selectedCell);
  table();
  // starting = null;
  // ending = null;
}

function handleKeyInputEnter(e) {
  console.log(selectedCell);
  if (e.key === "Enter") {
    let newValue = e.target.value;
    // console.log(selectedCell);
    rows[selectedCell.row][dataColumns[selectedCell.col]] = newValue;
    e.target.style.display = "none";
    selectedCell = null;
    table();
  } else if (e.key === "Escape") {
    inputref.style.display = "none";
    selectedCell = null;
    starting = null;
    ending = null;
    table();
  }
}
function handlekeyInputEscape(e) {
  console.log(e.target, e.key);
  if (e.key === "Escape") {
    // e.target.style.display="none";
    selectedCell = null;
    starting=null;
    ending=null;
    inputref.style.display = "none";
    table();
  }
  else if(e.key==="c" && e.ctrlKey){
    if(e.target != inputref){
      console.log("copy");
      copyRangeClipboard()
    }
  }
}

function handlemouseDown(e) {
  e = e || window.Event;
  let xcord = changeCordinates(e);
  let ycord = Math.floor(e.offsetY / rowHeight);
  starting = { row: ycord, col: xcord };
  console.log("starting", starting);
  table();

  let temp1, temp2;
  function mouseMoveHandler(e) {
    let iMove = changeCordinates(e);
    let jMove = Math.floor(e.offsetY / rowHeight);
    // console.log(jMove, iMove);
    if (temp1 !== jMove || temp2 !== iMove) {
      temp1 = jMove;
      temp2 = iMove;
      ending = { row: jMove, col: iMove };
      table();
    }
  }

  e.target.addEventListener("mousemove", mouseMoveHandler);
  function handlemouseUp(e) {
    e.target.removeEventListener("mousemove", mouseMoveHandler);
    e = e || window.Event;
    let mcord = changeCordinates(e);
    let ncord = Math.floor(e.offsetY / rowHeight);
    ending = { row: ncord, col: mcord };
    console.log("ending", ending);
    table();
    calculate(starting, ending);
  }
  e.target.addEventListener("mouseup", handlemouseUp);
}

//pointer move
function resize(e) {
  let x = e.offsetX;
  for (let i = 0; i < columnArr.length; i++) {
    if (Math.abs(x - columnArr[i]) < 5) {
      e.target.style.cursor = "col-resize";
      break;
    } else {
      e.target.style.cursor = "default";
    }
    x -= columnArr[i];
  }
}

function changesize(edown) {
  headerref.removeEventListener("pointermove", resize);
  let x = edown.offsetX;
  for (let i = 0; i < columnArr.length; i++) {
    if (Math.abs(x - columnArr[i]) < 5) {
      edown.target.style.cursor = "col-resize";
      doresize = true;
      calledindex = i;
      break;
    } else {
      edown.target.style.cursor = "default";
    }
    x -= columnArr[i];
  }
  if (!doresize) {
    return;
  }
  function change(eup) {
    let v = eup.offsetX;
    let u = v - edown.offsetX;
    console.log(u);
    console.log(calledindex);
    if ((columnArr[calledindex] = columnArr[calledindex] + u) > 50) {
      table();
      headers();
    } else {
      console.log("none");
    }
    eup.target.removeEventListener("pointerup", change);
    headerref.addEventListener("pointermove", resize);
  }
  headerref.addEventListener("pointerup", change);
}

function calculate(starting, ending) {
  let arr = [];
  let min;
  let max;
  let mean;
  if (starting.col == ending.col) {
    let start = Math.min(starting.row , ending.row);
    let end = Math.max(starting.row , ending.row)
    for (let i = start; i <= end; i++) {
      arr.push(rows[i][dataColumns[starting.col]]);
    }
    min = Math.min(...arr);
    max = Math.max(...arr);
    mean = arr.reduce((prev, curr) => prev + curr, 0) / arr.length;
    console.log(min, max, mean);
    let minvalue = document.querySelector(".mindata");
    let maxvalue = document.querySelector(".maxdata");
    let meanvalue = document.querySelector(".meandata");
    minvalue.textContent = min;
    maxvalue.textContent = max;
    meanvalue.textContent = mean;
    console.log(arr);
  }
}


function copyRangeClipboard(){
  if (starting && ending){
    let text = "";
    for (let i = Math.min(starting.row,ending.row); i <= Math.max(starting.row,ending.row); i++) {
      for (let j = Math.min(starting.col,ending.col); j <= Math.max(starting.col,ending.col); j++){
        // console.log(i,j);
        text +=`${(rows[i][dataColumns[j]])},\t`;
      }
      text += `\n`
    }
    navigator.clipboard.writeText(text);
  }
}

formref.addEventListener("change", handleSubmit);
canvaref.addEventListener("mousedown", handlemouseDown);
canvaref.addEventListener("click", handleClick);
inputref.addEventListener("keydown", handleKeyInputEnter);
document.addEventListener("keydown", handlekeyInputEscape);
headerref.addEventListener("pointermove", resize);
headerref.addEventListener("pointerdown", changesize);

table();
