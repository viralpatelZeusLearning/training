let data = await fetch("./tempData.json")
data = await data.json();
// console.log(data);

export class sheet{
    // columnArr = [180, 120, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 150, 100];
    columnsize= Array(10).fill(100);
    rowsize=Array(25).fill(30);
    dataColumns = [
        "Email ID",
        "Name",
        "Country",
        "State",
        "City",
        "Telephone number",
        "Address line 1",
        "Address line 2",
        "Date of Birth",
        "FY2019-20",
        "FY2020-21",
        "FY2021-22",
        "FY2022-23",
        "FY2023-24",
      ];
    columnWidth = 100;
    rowHeight = 30;
    // file = null;
    selectedcell = null;
    starting ;
    ending =null;
    dashOffset = 0;
    marchloop = null;
    constructor(div){
        this.containerdiv = document.createElement("div");
        this.btn = document.createElement("button");
        this.headerref = document.createElement("canvas");
        this.rowref = document.createElement("canvas");
        this.containertable = document.createElement("div");
        this.childdiv = document.createElement("div");
        this.inputdiv = document.createElement("div");
        this.inputtext = document.createElement("input");
        this.canvaref  = document.createElement("canvas");

        this.containerdiv.classList.add("containerDiv");
        this.btn.classList.add("btn");
        this.headerref.classList.add("header");
        this.rowref.classList.add("row");
        this.containertable.classList.add("containertable");
        this.childdiv.classList.add("childDiv");
        this.inputdiv.classList.add("inputDiv");
        this.inputtext.classList.add("textinput")
        this.canvaref.classList.add("table");

        this.ctxheaders = this.headerref.getContext("2d");
        this.ctx = this.canvaref.getContext("2d");
        this.ctxrow = this.rowref.getContext("2d");

        div.appendChild(this.containerdiv);
        this.childdiv.appendChild(this.canvaref);
        this.containerdiv.appendChild(this.btn);
        this.containerdiv.appendChild(this.headerref);
        this.containerdiv.appendChild(this.rowref);
        this.containerdiv.appendChild(this.containertable);
        this.containertable.appendChild(this.childdiv);
        this.childdiv.appendChild(this.inputdiv)
        this.inputdiv.appendChild(this.inputtext)
        
        this.canvasize();
        this.headers();
        this.rows();
        this.table();

        // this.containerdiv.addEventListener("scrollend",(e)=>{
        //     console.log("scroll");
        //     this.checkcolumn();
        //     this.checkrow();
        //     this.headers();
        //     this.table();
        //     this.rows();
        // })
        this.containerdiv.addEventListener("scroll",(e)=>{
            console.log("scroll");
            this.checkcolumn();
            this.checkrow();
            this.headers();
            this.table();
            this.rows();
        })

        this.canvaref.addEventListener("click",(e)=>{
            this.handleclick(e);
            this.canvapointerclick(e);
            this.table();
        })

        this.canvaref.addEventListener("pointerdown",(e)=>{
            this.handlemouseDown(e);
        })
        
        this.canvaref.addEventListener("dblclick",(e)=>{
            this.editfeild(e);
        })

        window.addEventListener("keydown",(e)=>{
            this.handleKeyInputEnter(e);
        })
    }

    canvasize(){

        this.childdiv.style.width = Math.max(this.columnsize.reduce((prev, curr) => prev + curr, 0), window.innerWidth) +"px";
        this.childdiv.style.height = (this.rowsize.length ) * this.rowHeight +"px";
        // console.log(this.containertable.parentElement.clientHeight, this.containertable.parentElement.clientWidth);
        // this.canvaref.width = Math.max(this.columnsize.reduce((prev, curr) => prev + curr, 0), window.innerWidth);
        // this.canvaref.height = (this.rowsize.length ) * this.rowHeight;
        this.canvaref.width = this.containerdiv.clientWidth - this.rowHeight;
        this.canvaref.height = this.containerdiv.clientHeight - this.rowHeight;

        this.headerref.width = this.canvaref.width;
        this.headerref.height = this.rowHeight;

        this.rowref.width=30
        this.rowref.height = this.canvaref.height;
        // this.rowref.height = this.rowsize
    }
    static headerdata(n){
        let str = "";
        do {
          if(str.length>0){
            // console.log(Math.floor((n-1)/26))
            str = String.fromCharCode(65 + Math.floor((n-1)%26)) + str
            n = Math.floor((n-1)/26)
          }
          else{
            str = String.fromCharCode(65 + Math.floor(n%26)) + str
            n = Math.floor(n/26)
          }
        } while (n > 0);
        return str;
    }
    //header data fill
    headers() {
        this.ctxheaders.save();
        this.ctxheaders.clearRect(0, 0, this.canvaref.width, this.canvaref.height);
        this.ctxheaders.setTransform(1, 0, 0, 1, 0, 0);
        this.ctxheaders.translate(-this.containerdiv.scrollLeft, 0)
        let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclick({offsetX:0 , offsetY:0})
        let sumcol = columnstart
        for (let i = xcordinate; sumcol<=(this.containerdiv.clientWidth + this.containerdiv.scrollLeft); i++) {
            this.ctxheaders.beginPath();
            this.ctxheaders.save();
            this.ctxheaders.rect(sumcol, 0, this.columnsize[i], this.rowHeight); //x position y position width height
            this.ctxheaders.clip();
            this.ctxheaders.fillStyle = "black";
            this.ctxheaders.font = `bold ${15}px Arial`;
          //   this.ctxheaders.fillText(this.dataColumns[i].toUpperCase(), x + 4, this.rowHeight - 5);
            this.ctxheaders.fillText(sheet.headerdata(i), sumcol + 4,this.rowHeight - 5);
            this.ctxheaders.restore();
            this.ctxheaders.moveTo(this.columnsize[i] + sumcol, 0);
            this.ctxheaders.lineTo(this.columnsize[i] + sumcol, this.canvaref.height);
            this.ctxheaders.strokeStyle="#00000055";
            this.ctxheaders.stroke();
            sumcol += this.columnsize[i];
          }
          this.ctxheaders.restore();
        
    }
    //numbering on rows
    rows(){
        this.ctxrow.save();
        this.ctxrow.clearRect(0, 0, this.rowref.width, this.rowref.height);
        this.ctxrow.setTransform(1, 0, 0, 1, 0, 0);
        this.ctxrow.translate(0, -this.containerdiv.scrollTop)
        let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclick({offsetX:0 , offsetY:0})
        for(let i= 1;i<=this.rowsize.length;i++){
            this.ctxrow.save();
            this.ctxrow.beginPath();
            this.ctxrow.rect(0,i*this.rowHeight,this.rowref.width,this.rowHeight);
            this.ctxrow.fillStyle="black";
            this.ctxrow.font =`bold ${15}px Arial`;
            this.ctxrow.textAlign="right";
            this.ctxrow.fillText(i,this.rowref.width-4,i*this.rowHeight-4)
            this.ctxrow.restore();
            this.ctxrow.moveTo(0,i*this.rowHeight);
            this.ctxrow.lineTo(0,this.rowref.width);
            this.ctxrow.strokeStyle="00000055";
            this.ctxrow.stroke();
        }
        this.ctxrow.restore();
        // for(let i=ycordinate; rowstart<=(this.containerdiv.clientHeight + this.containerdiv.scrollTop);i++){
        //     this.ctxrow.save();
        //     this.ctxrow.beginPath();
        //     this.ctxrow.rect(0,i*rowstart,this.rowref.width,this.rowHeight);
        //     this.ctxrow.fillStyle="black";
        //     this.ctxrow.font =`bold ${15}px Arial`;
        //     this.ctxrow.textAlign="right";
        //     this.ctxrow.fillText(i,this.rowref.width-4,i*this.rowHeight-4)
        //     this.ctxrow.restore();
        //     this.ctxrow.moveTo(0,i*this.rowsize[i]);
        //     this.ctxrow.lineTo(0,this.rowref.width);
        //     this.ctxrow.strokeStyle="00000055";
        //     this.ctxrow.stroke();
        // }
    }
    //cell data
    table(){
        console.log("redraw");
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvaref.width, this.canvaref.height);
        this.ctx.translate(-this.containerdiv.scrollLeft, -this.containerdiv.scrollTop)
            // this.ctx.clearRect(0, 0, this.canvaref.width, this.canvaref.height);
        var sum = 0;
        let colcount = 0;
        for (let i = 0; i < this.columnsize.length; i++) {
            let count = 0;
            for (let j = 0; j < this.rowsize.length; j++) {
            // console.log(i,j,rows[j][dataColumns[i]]);
            count +=1;
            this.ctx.beginPath();
            this.ctx.save();
            this.ctx.rect(sum, j * this.rowHeight, this.columnsize[i], this.rowHeight);
            this.ctx.clip();

            if(this.selectedcell && this.selectedcell.col === i && this.selectedcell.row === j){
                console.log("selected in draw");
                this.ctx.lineWidth=4;
                this.ctx.strokeStyle="green";
            }
            else if (this.starting && this.ending && 
                Math.min(this.starting.row, this.ending.row) <= j && 
                j <= Math.max(this.starting.row, this.ending.row) && 
                Math.min(this.starting.col, this.ending.col) <= i && 
                i <= Math.max(this.starting.col, this.ending.col)){
                    this.ctx.fillStyle = "hsl(204, 77%, 90%)";
                    this.ctx.fillRect(sum, j * this.rowHeight, this.columnsize[i], this.rowHeight)
                }
            else{
                this.ctx.strokeStyle="#00000055";
            }
            this.ctx.moveTo(sum, 0);
            this.ctx.lineTo(sum, this.canvaref.height);
            this.ctx.stroke();
            this.ctx.font = `${15}px Arial`;
            this.ctx.fillStyle = "black";
            // console.log(data[j][this.dataColumns[i]]);
            this.ctx.fillText(data[j] && data[j][i] ? data[j][i].text : " " ,sum + 4, (j + 1) * this.rowHeight - 5);
            this.ctx.restore();
        }
        colcount+=1;
        console.log(count);
        sum += this.columnsize[i];
        }
        console.log(colcount);
        // let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclick({offsetX:0 , offsetY:0})
        // let colstart =  columnstart;
        // for (let i= ycordinate; colstart< (this.containerdiv.clientWidth+this.containerdiv.scrollLeft);i++){
        //     let rowsend = rowstart;
        //     for(let j=xcordinate; rowsend< (this.containerdiv.clientHeight+this.containerdiv.scrollTop);j++){
        //         this.ctx.beginPath();
        //         this.ctx.save();
        //         this.ctx.rect(colstart,rowsend,this.columnsize[i],this.rowsize[j]);
        //         this.ctx.clip();
        //         // this.ctx.moveTo(colstart,0);
        //         // this.ctx.lineTo(colstart,this.canvaref.height);
        //         this.ctx.strokeStyle="#00000055";
        //         this.ctx.stroke();
        //         this.ctx.fillStyle = "black";
        //         this.ctx.font = `${15}px Arial`;
        //         // this.ctx.fillText(data[j][this.dataColumns[i]] === undefined ? " " :data[j][this.dataColumns[i]] , colstart + this.columnsize[i] + 4, rowsend + this.rowsize[j] - 5);
        //         this.ctx.restore();
        //         rowsend+=this.rowsize[j];
        //     }
        //     colstart+=this.columnsize[i];
        // }
    }

    //for column scroll
    checkcolumn(e){
        let stat = (this.containerdiv.scrollWidth - this.containerdiv.clientWidth - this.containerdiv.scrollLeft > 10 ? false : true)
        if (stat){
            console.log("scrolling");
            this.columnsize = [...this.columnsize, ...Array(5).fill(100)];
            this.canvasize()
            this.headers();
            this.table();
        }
    }
    //for row scroll
    checkrow(e){
        let stat = (this.containerdiv.scrollHeight - this.containerdiv.clientHeight - this.containerdiv.scrollTop > 25 ? false : true)
        console.log(stat);
        if (stat){
            console.log("scrolling");
            this.rowsize = [...this.rowsize, ...Array(20).fill(30)];
            this.canvasize()
            this.rows();
            this.table();
        }
    }

    //click function for select cell
    handleclick(e){
        console.log(e.offsetX,e.offsetY);
        let xcord;
        let colposition =0;
        let rowposition =0;
        let off = e.offsetX;    
        for (xcord = 0; xcord < this.columnsize.length; xcord++) {
            // console.log("xcord",this.containerdiv.scrollLeft);
            if (off + this.containerdiv.scrollLeft <= colposition + this.columnsize[xcord]) {
            break;
            // xcord = Math.floor(e.offsetX - columnArr[i]);
            }
            colposition += this.columnsize[xcord]
            // colposition = colposition / this.columnsize[xcord]
        }
        let ycord;
        let offy = e.offsetY;
        for(ycord=0;ycord<this.rowsize.length;ycord++){
            if (offy + this.containerdiv.scrollTop <=rowposition + this.rowsize[ycord]){
                break;
            }
            rowposition += this.rowsize[ycord]
        }
        console.log(colposition,rowposition , xcord, ycord);
        return {columnstart:colposition,rowstart:rowposition , xcordinate:xcord , ycordinate:ycord}
    }

    //click color change
    canvapointerclick(e){
        let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclick(e)
        this.selectedcell = {col:xcordinate , row:ycordinate , columnstart:columnstart , rowstart:rowstart}
        this.inputdiv.style.display = "none";
        // this.starting=null
        // console.log("Cell data : ", data[ycordinate][xcordinate]);
        console.log(this.selectedcell);
    }

    //edit feild
    editfeild(e){
        console.log("double clk");
        this.inputdiv.strokeStyle="red"
        this.inputdiv.style.display = "block"
        this.inputdiv.style.left=this.selectedcell.columnstart + this.rowHeight  + "px"
        this.inputdiv.style.top=this.selectedcell.rowstart + this.rowHeight + "px"
        this.inputdiv.style.width = this.columnsize[this.selectedcell.col]  + "px"
        this.inputdiv.style.height = this.rowsize[this.selectedcell.row] + "px"
        this.inputtext.focus();
        this.inputtext.value = data[this.selectedcell.row] && data[this.selectedcell.col][this.selectedcell.row] ? data[this.selectedcell.row][this.selectedcell.col].text : " " ; 
    }

    //key input enters called
    handleKeyInputEnter(e) {
        this.starting=null;
        e.preventDefault();
        console.log(this.selectedcell.row,"key pressed");
        if (e.key==="ArrowLeft"){
            if (this.selectedcell.col == 0){
                this.selectedcell.col=0
            }
            else{
                this.selectedcell.col -=1
                console.log("left");
                this.table();
            }
        }
        else if (e.key === "ArrowRight"){
            this.selectedcell.col+=1;
            this.table();
        }
        else if(e.key === "ArrowUp" && this.selectedcell.row!=0){
            this.selectedcell.row-=1;
            this.table();
        }
        else if (e.key === "ArrowDown"){
            this.selectedcell.row+=1;
            this.table();
        }
        // if (e.key === "Enter") {
        //   let newValue = e.target.value;
        //   // console.log(selectedCell);
        //   data[this.selectedcell.col][this.selectedcell.row] = newValue;
        //   selectedCell = null;
        //   ending=null;
        // }
        // else if (e.key === "Escape") {
        //   inputref.style.display = "none";
        //   selectedCell = null;
        //   starting = null;
        //   ending = null;
        // }
    }


    //range selection
    handlemouseDown(e){
        let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclick(e)
        this.starting = {col:xcordinate , row:ycordinate}
        this.ending = null;
        console.log(this.starting);
        // e.target.addEventListener("pointerdown",handlemouseDown);
        // let temp1, temp2;
        function handleMouseMove(i){
            let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclick(i)
            this.ending = { row: ycordinate, col: xcordinate };
            this.table();
            console.log(this.ending);
        }
        console.log(this);
            // e.target.addEventListener("mousemove",handleMouseMove)
        let temp1 = handleMouseMove.bind(this)
        e.target.addEventListener("pointermove",temp1);

        function handlemouseup(j){
            let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclick(j)
            // console.log(e.target);
            e.target.removeEventListener("pointermove",temp1);
            this.ending = {col:xcordinate , row:ycordinate}
            console.log("final ending",this.ending);
        }
        let temp2 = handlemouseup.bind(this)
        e.target.addEventListener("pointerup",temp2);    
        e.target.removeEventListener("pointerdown",this.handlemouseDown)
    }
    

}