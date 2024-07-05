import React from "react";
import "./canvatable.scss";
import { useEffect } from "react";
import { useRef } from "react";
const dataColumns = [
  "Name",
  "email",
  "Age",
  "Header",
  "year",
  "date",
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
];
const Canvatable = () => {
  const canvaref = useRef();
  const inputref = useRef();
  var ctx;
  let columnWidth = 100;
  let rowHeight = 30;
  let selectedCell = null;
  let starting = null;
  let ending=null;
  async function table() {
    console.log("table");
    ctx.restore();
    ctx.clearRect(0, 0, canvaref.current.width, canvaref.current.height);
    // let columnWidth = Math.floor(canvaref.current.width/dataColumns.length);
    console.log(columnWidth);
    // let rowHeight = Math.floor(canvaref.current.height/rows.length);

    //header data and table
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
      ctx.lineTo(i * columnWidth, canvaref.current.height);
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
          inputref.current.style.display="block";
          inputref.current.style.left=(columnWidth*i)+"px";
          inputref.current.style.top=(rowHeight*(j+1)) +"px";
          inputref.current.value=rows[j][dataColumns[i]];
          inputref.current.style.width=columnWidth + "px";
          inputref.current.style.height=rowHeight +"px";  
        }
        
        if (starting && ending && starting.row<=j && j<=ending.row && starting.col<=i && i<=ending.col){
          ctx.fillStyle="skyblue";
          ctx.fillRect(i*columnWidth,(j+1)*rowHeight,columnWidth,rowHeight);
        }
        ctx.fillStyle="black"
        ctx.fillText(
          rows[j][dataColumns[i]],
          i * columnWidth + 10,
          (j + 2) * rowHeight - 10
        );
        ctx.moveTo(i * columnWidth, 0);
        ctx.lineTo(i * columnWidth, canvaref.current.height);
        ctx.stroke();
        ctx.restore();
      }
    }
    ctx.save();

    // console.log(selectedCell);
  }
  function handleKeyInputEnter(e){
    // console.log(e.target, e.key);
    if(e.key==="Enter"){
      let newValue = e.target.value;
      rows[selectedCell.row][dataColumns[selectedCell.col]] = newValue;
      e.target.style.display="none";
      selectedCell = null;
      table();
    }
    else if(e.key==="Escape"){
      inputref.current.style.display="none";
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
      inputref.current.style.display = "none"
      table();
    }
  }
  function handleClick(e) {
    e = e.nativeEvent;
    let xcord = Math.floor(e.offsetX / columnWidth); //horizontal mouse click control
    let ycord = Math.floor(e.offsetY / rowHeight); //vertocal mouse roll
    if (ycord > 0) {
      ycord--;
      // console.log("cell position : " + ycord + " " + xcord);
      // console.log("Cell data : ", rows[ycord][dataColumns[xcord]]);
      selectedCell= { row: ycord, col: xcord };
      table();
    }
  }
  function handlemouseDown(e){
    e=e.nativeEvent;
    let xcord = Math.floor(e.offsetX / columnWidth);
    let ycord = Math.floor(e.offsetY / rowHeight);
    if (ycord>0){
      ycord--;
      starting= { row: ycord, col: xcord };
      console.log("starting",starting);
    }
    table();
  }
  function handlemouseUp(e){
    e=e.nativeEvent;
    let mcord = Math.floor(e.offsetX / columnWidth);
    let ncord = Math.floor(e.offsetY / rowHeight);
    if (ncord>0){
      ncord--;
      ending= { row: ncord, col: mcord };
      console.log("ending",ending)
    }
    table();
  }
  
  useEffect(() => {
    canvaref.current.width = dataColumns.length * columnWidth;
    canvaref.current.height = rows.length * rowHeight;
    ctx = canvaref.current.getContext("2d");
    table();
    window.addEventListener("keydown",handlekeyInputEscape);
  }, []);
  return (
    <div className="table">
      <canvas id="myCanvas" ref={canvaref} onMouseDown={(e)=>{handlemouseDown(e,)}} onMouseUp={(e)=>{handlemouseUp(e,)}} onClick={handleClick}></canvas>
      <input type="text" ref={inputref} onKeyDown={(e)=>{handleKeyInputEnter(e,)}} />
    </div>
  );
};
export default Canvatable;
