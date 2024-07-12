var canvaref = document.querySelector("#myCanvas");
var headerref = document.querySelector("#headers");
var inputref = document.querySelector(".inputtext");
var formref = document.querySelector("#file");
var graph = document.querySelector(".graphbtn");
var ctxgraph = document.querySelector("#graph");

let file = null;
let columnWidth = 100;
let rowHeight = 30;
let selectedCell = null;
let starting ;
let ending ;
let dashOffset = 0;
let marchloop = null;

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
  "2020-salary",
  "2021-salary",
  "2024-salary",
];
const rows = [
  {
    Name: "viral",
    email: "user@gmail.com",
    Age: 22,
    "2020-salary": 20000,
    "2021-salary":25000,
  },
  {
    Name: "shreyas",
    Age: 24,
    "2020-salary": 20000,
    "2021-salary":25000,
  },
  {
    Name: "manav",
    Age: 22,
    "2020-salary": 20000,
    "2021-salary":25000,
  },
  {
    Name: "yash",
    Age: 20,
    "2020-salary": 20000,
    "2021-salary":25000,
  },
  {
    Name: "Asher",
    "2020-salary": 20000,
    "2021-salary":25000,
  },
  {
    Name: "shubham",
    "2020-salary": 20000,
    "2021-salary":25000,
  },
  {
    Name: "nihal",
    "2020-salary": 20000,
    "2021-salary":25000,
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

const columnArr = [180, 120, 120, 120, 120, 174, 120, 120, 120, 120, 120, 100, 100, 100, 100,100];
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
//header data and table
async function headers() {
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
    ctxheaders.font = `bold ${15}px Arial`;
    ctxheaders.fillText(dataColumns[i].toUpperCase(), x + 4, rowHeight - 10);
    ctxheaders.restore();
    ctxheaders.moveTo(columnArr[i] + x, 0);
    ctxheaders.lineTo(columnArr[i] + x, canvaref.height);
    ctxheaders.strokeStyle="#00000055";
    ctxheaders.stroke();
    x += columnArr[i];
  }
  ctxheaders.save();
}
//canva table and filling data
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
      ctx.font = `${15}px Arial`;
      //select cell and input box
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
      ctx.strokeStyle="#00000055";
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

//select cell click function
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

//enter and escape after a function in canva
function handleKeyInputEnter(e) {
  console.log(selectedCell);
  if (e.key === "Enter") {
    let newValue = e.target.value;
    // console.log(selectedCell);
    rows[selectedCell.row][dataColumns[selectedCell.col]] = newValue;
    e.target.style.display = "none";
    selectedCell = null;
    ending=null;
    table();
  }
  else if (e.key === "Escape") {
    inputref.style.display = "none";
    selectedCell = null;
    starting = null;
    ending = null;
    table();
  }
}

//escape outside the canva and for entire window
function handlekeyInputEscape(e) {
  console.log(e.target, e.key);
  if (e.key === "Escape") {
    // e.target.style.display="none";
    window.cancelAnimationFrame(marchloop);
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
      marchants();
    }
  }
}

//range selection mouse down and move and up function
function handlemouseDown(e) {
  e = e || window.Event;
  let xcord = changeCordinates(e);
  let ycord = Math.floor(e.offsetY / rowHeight);
  starting = { row: ycord, col: xcord };
  console.log("starting", starting);
  ending=null;
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

//pointer move for resize
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
    doresize=false;
    console.log(u);
    console.log(calledindex);
    if ((columnArr[calledindex] + u) > 30) {
      columnArr[calledindex] = ((columnArr[calledindex] + u))
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

//for calculations on the selected range
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

//clipboard copy in text
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

//animations for the copy function
function marchants(){
  if(starting && ending){
    console.log("march ants")
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.lineDashOffset = dashOffset;
    let [posX,posY,rectWidth, rectHeight] = [0,0,0,0];
    let i=0;
    while(i<Math.min(starting.col, ending.col)){
      posX+=columnArr[i];
      i++;
    }
    while(i<Math.max(starting.col+1, ending.col+1)){
      rectWidth+=columnArr[i];
      i++;
    }
    i=0;
    posY = rowHeight*(Math.min(starting.row, ending.row));
    rectHeight = (Math.abs(ending.row - starting.row)+1)*rowHeight;
    ctx.lineWidth=2.5;
    ctx.strokeStyle="rgb(86, 74, 190)";
    ctx.strokeRect(posX, posY, rectWidth, rectHeight);
    ctx.restore();
    dashOffset+=1;
    if(dashOffset>8){dashOffset=0;}
    
    marchloop=window.requestAnimationFrame(()=>{
      table();
      marchants();
    });
  }
}

//creating graph
var drawgraph = null;
var toogle = false;
function createGraph(){
  if (!toogle){
    console.log(starting,ending);
    arr=[]
    dataarr=[]
    let sum=0;
    for(let i=starting.col;i<=ending.col;i++){
      for(let j=starting.row;j<=ending.row;j++){
        sum += rows[j][dataColumns[i]];
      }
      avg = (sum/(Math.abs(starting.row-ending.row)+1))
      if (!isNaN(avg)){console.log(sum);
        dataarr.push(avg);
        arr.push(dataColumns[i]);
      }
      sum = 0;
    }
    if (arr.length == 0){
      return
    }
    console.log("arr",dataarr);
    console.log("arr",arr);
    ctxgraph.style.display="block";
    drawgraph = new Chart(ctxgraph, {
      type: 'bar',
      data: {
        labels: arr,
        datasets: [{
          data: dataarr,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    toogle = !toogle;
  }
  else{
    drawgraph.destroy();  
    ctxgraph.style.display="none";
  }
}

formref.addEventListener("change", handleSubmit);
canvaref.addEventListener("mousedown", handlemouseDown);
canvaref.addEventListener("click", handleClick);
inputref.addEventListener("keydown", handleKeyInputEnter);
headerref.addEventListener("pointermove", resize);
headerref.addEventListener("pointerdown", changesize);
graph.addEventListener("click",createGraph);
document.addEventListener("keydown", handlekeyInputEscape);

table();
