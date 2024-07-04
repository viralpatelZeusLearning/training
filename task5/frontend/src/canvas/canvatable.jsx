import React from 'react';
import './canvatable.scss'
import { useEffect } from 'react';
import { useRef } from 'react';
const dataColumns=["Name","email","Age","Header","year","date","pay","address line 1","address line2","addressline3","role","country","state","city","phone no"];
const rows =[{
    Name:"viral"
  },{
    Name:"shreyas"
  },{
    Name:"manav"
  },{
    Name:"yash"
  },{
    Name:"Asher"
  },{
    Name:"shubham"
  },{
    Name:"nihal"
  },{
    Name:"viral"
  },{
    Name:"shreyas"
  },{
    Name:"manav"
  },{
    Name:"yash"
  },{
    Name:"Asher"
  },{
    Name:"shubham"
  },{
    Name:"nihal"
  },{
    Name:"viral"
  },{
    Name:"shreyas"
  },{
    Name:"manav"
  },{
    Name:"yash"
  },{
    Name:"Asher"
  },{
    Name:"shubham"
  },{
    Name:"nihal"
  },{
    Name:"viral"
  },]
const Canvatable = () => {
    const canvaref = useRef()
    var ctx;
    let columnWidth =100 ; 
    let rowHeight =30 ;
    function table(){
        console.log("table");
        // let columnWidth = Math.floor(canvaref.current.width/dataColumns.length);
        console.log(columnWidth);
        // let rowHeight = Math.floor(canvaref.current.height/rows.length);


        //header data and table
        for(let i=0;i<columnWidth;i++){
          ctx.save();
          ctx.rect(i*columnWidth,0,columnWidth,rowHeight);
          ctx.clip()
          ctx.fillStyle="black";    
          ctx.font=`bold ${15}px Arial`
          ctx.fillText(dataColumns[i] , i*columnWidth+10,rowHeight-10);
          ctx.restore();
          ctx.moveTo(i*columnWidth,0);
          ctx.lineTo(i*columnWidth,canvaref.current.height);
          ctx.stroke();
          
        }
        //for data travel and creation
        for(let i=0; i<dataColumns.length; i++){
            for(let j=0; j<rows.length; j++){
              console.log(i,j,rows[j][dataColumns[i]]);
              ctx.save();
              ctx.rect(i*columnWidth, (j+1)*rowHeight, columnWidth, rowHeight);
              ctx.clip();
              ctx.font = `${15}px Arial`
              ctx.fillStyle = "black"
              ctx.fillText(rows[j][dataColumns[i]], i*columnWidth+10  , (j+2)*rowHeight-10 );
              ctx.restore();
              ctx.moveTo(i*columnWidth,0);
              ctx.lineTo(i*columnWidth,canvaref.current.height);
              ctx.stroke();
            }
        }
    }

    useEffect(() => {
        canvaref.current.width = dataColumns.length * columnWidth;
        canvaref.current.height = rows.length * rowHeight;
        ctx=canvaref.current.getContext("2d");
        table();
    }, []);
    return (
        <div className='table'>
            <canvas id="myCanvas" ref={canvaref}></canvas>
        </div>
    );
}

export default Canvatable;
