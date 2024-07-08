var canvaref = document.querySelector("#myCanvas");
var inputref = document.querySelector(".inputtext");
var formref = document.querySelector("#file");

let file = null;
let ctx = myCanvas.getContext("2d");
let columnWidth = 100;
let rowHeight = 30;
let selectedCell = null;
let starting = null;
let ending=null;

const dataColumns = [
    "Name",
    "email",
    "Age",
    "year",
    "pay",
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
    "2021 salary",
    "2024 salary"
];
const rows = [
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
    }
];

const columnArr = [120,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100];
canvaref.width = dataColumns.length * columnWidth;
canvaref.height = rows.length * rowHeight;
ctx = canvaref.getContext("2d");
table();
console.log(rows.length);
function handleSubmit(e){
  file = e.target.files[0];
  console.log(file);
}

async function table() {
    console.log("table");
    ctx.restore();
    ctx.clearRect(0, 0, canvaref.width, canvaref.height);
    // let columnWidth = Math.floor(canvaref.current.width/dataColumns.length);
    console.log(columnWidth);
    // let rowHeight = Math.floor(canvaref.current.height/rows.length);

    //header data and table
    for (let i = 0; i < columnWidth; i++) {
      ctx.beginPath();
      ctx.save();
      ctx.rect(i * columnWidth, 0, columnWidth, rowHeight); //x position y position width height
      ctx.clip();
      ctx.fillStyle = "black";
      ctx.font = `bold ${15}px Arial`;
      ctx.fillText(dataColumns[i], i * columnWidth + 10, rowHeight - 10);
      ctx.restore();
      ctx.moveTo(i * columnWidth, 0);
      ctx.lineTo(i * columnWidth, canvaref.height);
      ctx.stroke();
    }

    //cell data
    for (let i = 0; i < dataColumns.length; i++) {
      for (let j = 0; j < rows.length; j++) {
        // console.log(i,j,rows[j][dataColumns[i]]);
        ctx.beginPath();
        ctx.save();
        ctx.rect(i * columnWidth, (j + 1) * rowHeight, columnWidth, rowHeight);
        ctx.clip();
        ctx.font = `${15}px Arial`;
        // console.log(selectedCell);
        if(selectedCell && selectedCell.col === i && selectedCell.row===j){
          // console.log(inputref);
          inputref.style.display="block";
          inputref.style.left=((columnWidth*i)+8)+"px";
          inputref.style.top=((rowHeight*(j+1))+8) +"px";
          inputref.value=rows[j][dataColumns[i]];
          inputref.style.width=columnWidth + "px";
          inputref.style.height=rowHeight +"px";  
        }
        
        //range selection
        else if (starting && ending && starting.row<=j && j<=ending.row && starting.col<=i && i<=ending.col){
          // console.log("seklsdedf");
          ctx.fillStyle="skyblue";
          ctx.fillRect(i*columnWidth,(j+1)*rowHeight,columnWidth,rowHeight);
          selectedCell=null;
          // inputref.style.display='none';
        }

        else if (starting && ending && starting.row>=j && j>=ending.row && starting.col>=i && i>=ending.col){
          // console.log("61216216262");
          ctx.fillStyle="skyblue";
          ctx.fillRect(i*columnWidth,(j+1)*rowHeight,columnWidth,rowHeight);
          selectedCell=null;
          // inputref.style.display='none';
        }
        ctx.fillStyle="black"
        ctx.fillText(
          rows[j][dataColumns[i]],
          i * columnWidth + 10,
          (j + 2) * rowHeight - 10
        );
        ctx.moveTo(i * columnWidth, 0);
        ctx.lineTo(i * columnWidth, canvaref.height);
        ctx.stroke();
        ctx.restore();
      }
    }
    ctx.save();
}

function handleClick(e) {
  e = e || window.Event;
  let xcord = Math.floor(e.offsetX / columnWidth); //horizontal mouse click control
  let ycord = Math.floor(e.offsetY / rowHeight); //vertocal mouse roll
  if (ycord > 0) {
    ycord--;
    console.log("cell position : " + ycord + " " + xcord);
    console.log("Cell data : ", rows[ycord][dataColumns[xcord]]);
    selectedCell= { row: ycord, col: xcord };
    table();
  }
  starting=null;
  ending=null;
}

function handleKeyInputEnter(e){
  console.log(selectedCell);
    if(e.key==="Enter"){
        let newValue = e.target.value;
        // console.log(selectedCell);
        rows[selectedCell.row][dataColumns[selectedCell.col]] = newValue;
        e.target.style.display="none";
        selectedCell = null;
        table();
      }
      else if(e.key==="Escape"){
        inputref.style.display="none";
        selectedCell = null;
        starting=null;
        ending=null;
        table();
      }
}
function handlekeyInputEscape(e){
    console.log(e.target,e.key);
    if(e.key==="Escape"){
      // e.target.style.display="none";
      selectedCell = null;
      starting=null;
      ending=null;
      inputref.style.display = "none"
      table();
    }
}

function handlemouseDown(e){
    e = e || window.Event;
    let xcord = Math.floor(e.offsetX / columnWidth);
    let ycord = Math.floor(e.offsetY / rowHeight);
    if (ycord>0){
      ycord--;
      starting= { row: ycord, col: xcord };
      console.log("starting",starting);
    }
    table();
    function handlemouseUp(e){
        e = e || window.Event;
        let mcord = Math.floor(e.offsetX / columnWidth);
        let ncord = Math.floor(e.offsetY / rowHeight);
        if (ncord>0){
          ncord--;
          ending= { row: ncord, col: mcord };
          console.log("ending",ending)
        }
        table();
    }
    e.target.addEventListener("mouseup",handlemouseUp);
}

formref.addEventListener("change",handleSubmit);
canvaref.addEventListener("mousedown", handlemouseDown);
canvaref.addEventListener("click", handleClick);
inputref.addEventListener("keydown", handleKeyInputEnter);
document.addEventListener("keydown", handlekeyInputEscape);

canvaref.width = dataColumns.length * columnWidth;
canvaref.height = rows.length * rowHeight;
ctx = canvaref.getContext("2d");
table();