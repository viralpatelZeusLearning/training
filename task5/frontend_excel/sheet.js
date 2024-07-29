let data = await fetch("./tempData.json")
data = await data.json();
// data = window.localStorage.getItem("data") ? JSON.parse(window.localStorage.getItem("data")) : data
// console.log(data);

export class Sheet{
    // columnArr = [180, 120, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 150, 100];
    columnsize= Array(20).fill(100);
    rowsize=Array(35).fill(30);
    // dataColumns = [
    //     "Email ID",
    //     "Name",
    //     "Country",
    //     "State",
    //     "City",
    //     "Telephone number",
    //     "Address line 1",
    //     "Address line 2",
    //     "Date of Birth",
    //     "FY2019-20",
    //     "FY2020-21",
    //     "FY2021-22",
    //     "FY2022-23",
    //     "FY2023-24",
    //   ];
    // columnWidth = 100;
    rowHeight = 30;
    rowlimit = 1048576;
    collimit = 16383;
    selectInfinity = false
    // file = null;
    selectedcell= {col:0,row:0,columnstart:0,rowstart:0};
    starting  = {col:0,row:0,colstat:0,rowstat:0};
    ending = {col:0,row:0,colstat:0,rowstat:0};
    dashOffset = 0;
    marchloop = null;
    constructor(div){
        // this.columnsize = window.localStorage.getItem("column") ? JSON.parse(window.localStorage.getItem("column")) : Array(10).fill(100)
        // this.rowsize = window.localStorage.getItem("rows") ? JSON.parse(window.localStorage.getItem("rows")) : Array(25).fill(30)

        this.data = JSON.parse(JSON.stringify(data));
        this.containerdiv = document.createElement("div");
        this.btn = document.createElement("button");
        this.headerref = document.createElement("canvas");
        this.rowref = document.createElement("canvas");
        this.containertable = document.createElement("div");
        this.childdiv = document.createElement("div");
        this.inputdiv = document.createElement("div");
        this.inputdiv.innerHTML = "<input type='text'>"
        this.graphdiv = document.createElement("div");
        this.graphref = document.createElement("canvas")
        // this.inputtext = document.createElement("input");
        this.canvaref  = document.createElement("canvas");
    
        this.containerdiv.classList.add("containerDiv");
        this.btn.classList.add("btn");
        this.headerref.classList.add("header");
        this.rowref.classList.add("row");
        this.containertable.classList.add("containertable");
        this.childdiv.classList.add("childDiv");
        this.inputdiv.classList.add("inputDiv");
        // this.inputtext.classList.add("textinput")
        this.graphdiv.classList.add("graphdiv");
        this.graphref.classList.add("graphref");
        this.canvaref.classList.add("table");
    
        this.ctxheaders = this.headerref.getContext("2d");
        this.ctx = this.canvaref.getContext("2d");
        this.ctxrow = this.rowref.getContext("2d");
    
        // div.appendChild(this.containerdiv);
        this.childdiv.appendChild(this.canvaref);
        this.containerdiv.appendChild(this.btn);
        this.containerdiv.appendChild(this.headerref);
        this.containerdiv.appendChild(this.rowref);
        this.containerdiv.appendChild(this.containertable);
        this.containertable.appendChild(this.childdiv);
        this.childdiv.appendChild(this.inputdiv)
        this.childdiv.appendChild(this.graphdiv)
        this.graphdiv.appendChild(this.graphref)
        // this.inputdiv.appendChild(this.inputtext)
        
        this.canvasize();
        this.headers();
        this.rows();
        this.table();
        
        window.addEventListener("resize",()=>{
            this.canvasize();
            this.headers();
            if (!this.marchloop){
                this.table();
                }
            this.rows();
        })
        // this.containerdiv.addEventListener("scrollend",(e)=>{
        //     // console.log("scroll");
        //     this.checkcolumn();
        //     this.checkrow();
        //     // this.headers();
        //     // this.rows();
        // })
        this.containerdiv.addEventListener("scroll",(e)=>{
            // console.log("scroll");
            this.checkcolumn();
            this.checkrow();
            this.canvasize();
            this.headers();
            if (!this.marchloop){
                this.table();
                }
            this.rows();
        })
    
        this.canvaref.addEventListener("click",(e)=>{
            this.handleclick(e);
            // this.canvapointerclick(e);
            this.headers();
            this.rows();
            if (!this.marchloop){
                this.table();
                }
        })
    
        this.canvaref.addEventListener("pointerdown",(e)=>{
            this.handlemouseDown(e);
            this.canvapointerclick(e);
        })
        
        this.inputdiv.querySelector("input").addEventListener("keyup",(e)=>{
            this.handleKeyInputEnter(e)
            
        })
    
        this.canvaref.addEventListener("dblclick",(e)=>{
            this.editfeild(e);
        })
    
        this.headerref.addEventListener("pointerdown",(e)=>{
            this.changesize(e);
        })
    
        this.headerref.addEventListener("pointermove",(e)=>{
            this.moveheader(e);
        })
    
        this.rowref.addEventListener("pointermove",(e)=>{
            this.moverow(e);
        })
    
        this.rowref.addEventListener("pointerdown",(e)=>{
            this.changerowsize(e);
        })
    
        this.headerref.addEventListener("dblclick",(e)=>{
            this.headerclick(e);
        })
    
        window.addEventListener("keydown",(e)=>{
            if (!this.containerdiv.parentElement){return}
            this.keyhandler(e);
            this.headers();
        })
    }
    
    canvasize(){
    
        this.childdiv.style.width = Math.max(this.columnsize.reduce((prev, curr) => prev + curr, 0), window.innerWidth) +"px";
        this.childdiv.style.height = (this.rowsize.length ) * this.rowHeight +"px";
        // console.log(this.containertable.parentElement.clientHeight, this.containertable.parentElement.clientWidth);
        // this.canvaref.width = Math.max(this.columnsize.reduce((prev, curr) => prev + curr, 0), window.innerWidth);
        // this.canvaref.height = (this.rowsize.length ) * this.rowHeight;
        this.canvaref.width = (this.containerdiv.clientWidth - this.rowHeight)*window.devicePixelRatio ;
        this.canvaref.height = (this.containerdiv.clientHeight - this.rowHeight)*window.devicePixelRatio ;
    
        this.headerref.width = this.canvaref.width 
        this.headerref.height = this.rowHeight * window.devicePixelRatio;
    
        this.rowref.width=this.rowHeight * window.devicePixelRatio;
        this.rowref.height = this.canvaref.height ;
        // this.rowref.height = this.rowsize

        let {width} = this.headerref.getBoundingClientRect()
        let {height} = this.rowref.getBoundingClientRect()
        this.canvaref.style.width =`${width}px`
        this.canvaref.style.height = `${height}px` 
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
        this.ctxheaders.setTransform(1, 0, 0, 1, 0, 0);
        this.ctxheaders.clearRect(0, 0, this.canvaref.width, this.canvaref.height);
        this.ctxheaders.scale(window.devicePixelRatio,window.devicePixelRatio)
        this.ctxheaders.translate(-this.containerdiv.scrollLeft, 0)
        let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclick({offsetX:0 , offsetY:0})
        let sumcol = columnstart
        for (let i = xcordinate; sumcol<=(this.containerdiv.clientWidth + this.containerdiv.scrollLeft) && i<this.columnsize.length; i++) {
            this.ctxheaders.save();
            this.ctxheaders.beginPath();
            this.ctxheaders.rect(sumcol-0.5, 0, this.columnsize[i], this.rowHeight); //x position y position width height
            this.ctxheaders.strokeStyle="#cbd5d0";
            this.ctxheaders.stroke();
            if (this.starting && this.ending && 
                Math.min(this.starting.col, this.ending.col) <= i && 
                i <= Math.max(this.starting.col, this.ending.col)){
                this.ctxheaders.save();
                this.ctxheaders.fillStyle="#caead8";
                this.ctxheaders.fill();
                // let [x,y,w,h] = this.marchants()
                // // console.log(x,w);
                // this.ctxheaders.beginPath();
                // this.ctxheaders.moveTo(x,this.rowHeight);
                // this.ctxheaders.lineTo(x+w,this.rowHeight);
                // this.ctxheaders.lineWidth=4;
                // this.ctxheaders.strokeStyle="#107c41";
                // this.ctxheaders.stroke();
                // this.ctxheaders.restore();
            }
            // this.ctxheaders.clip();
            this.ctxheaders.fillStyle = "black";
            this.ctxheaders.font = `bold ${15}px Arial`;
          //   this.ctxheaders.fillText(this.dataColumns[i].toUpperCase(), x + 4, this.rowHeight - 5);
            this.ctxheaders.fillText(Sheet.headerdata(i), sumcol + 4,this.rowHeight - 5);
            this.ctxheaders.restore();
            sumcol += this.columnsize[i];
          }
          if (this.starting && this.ending){
            this.ctxheaders.save()
            let [x,y,w,h] = this.marchants()
            let startpixel = Math.max(this.containerdiv.scrollLeft,x)
            let newwidth = Math.min(this.containerdiv.clientWidth, x>this.containerdiv.scrollLeft ? w : w-this.containerdiv.scrollLeft+x)
                // console.log(x,w);
            this.ctxheaders.beginPath();
            if (startpixel<this.containerdiv.scrollLeft+this.containerdiv.clientWidth && newwidth>0){
                // console.log("drawing");
                this.ctxheaders.moveTo(startpixel-1.5,this.rowHeight);
                this.ctxheaders.lineTo(startpixel+newwidth+0.5,this.rowHeight);
            }
            // this.ctxheaders.moveTo(x-1.5,this.rowHeight);
            // this.ctxheaders.lineTo(x+w+0.5,this.rowHeight);
            this.ctxheaders.lineWidth=4;
            this.ctxheaders.strokeStyle="#107c41";
            this.ctxheaders.stroke();
            this.ctxheaders.restore();
          }
          this.ctxheaders.restore();
        
    }
    //numbering on rows
    rows(){
        this.ctxrow.save();
        this.ctxrow.setTransform(1, 0, 0, 1, 0, 0);
        this.ctxrow.clearRect(0, 0, this.rowref.width, this.rowref.height);
        this.ctxrow.scale(window.devicePixelRatio,window.devicePixelRatio)
        this.ctxrow.translate(0, -this.containerdiv.scrollTop)
        // for(let i= 1;i<=this.rowsize.length;i++){
        //     this.ctxrow.save();
        //     this.ctxrow.beginPath();
        //     this.ctxrow.rect(0,i*this.rowHeight,this.rowref.width,this.rowHeight);
        //     this.ctxrow.fillStyle="black";
        //     this.ctxrow.font =`bold ${15}px Arial`;
        //     this.ctxrow.textAlign="right";
        //     this.ctxrow.fillText(i,this.rowref.width-4,i*this.rowHeight-4)
        //     this.ctxrow.restore();
        //     this.ctxrow.moveTo(0,i*this.rowHeight);
        //     this.ctxrow.lineTo(0,this.rowref.width);
        //     this.ctxrow.strokeStyle="00000055";
        //     this.ctxrow.stroke();
        // }
        // this.ctxrow.restore();
        let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclick({offsetX:0 , offsetY:0})
        for(let i=ycordinate; rowstart<=(this.containerdiv.clientHeight + this.containerdiv.scrollTop);i++){
            this.ctxrow.save();
            this.ctxrow.beginPath();
            this.ctxrow.rect(0,rowstart-0.5,this.rowHeight,this.rowsize[i]);
            this.ctxrow.strokeStyle="#cbd5d0";
            this.ctxrow.lineWidth=1
            this.ctxrow.stroke();
            if (this.starting && this.ending && 
                Math.min(this.starting.row, this.ending.row) <= i && 
                i <= Math.max(this.starting.row, this.ending.row) ){
                this.ctxrow.save();
                this.ctxrow.fillStyle="#caead8";
                this.ctxrow.fill()
                // await new Promise(r=>setTimeout(r,100))
                // let [x,y,w,h] = this.marchants()
                // this.ctxrow.beginPath();
                // this.ctxrow.moveTo(this.rowHeight,y-5);
                // this.ctxrow.lineTo(this.rowHeight,y+h+2);
                // this.ctxrow.lineWidth=4;
                // this.ctxrow.strokeStyle="#107c41";
                // this.ctxrow.stroke();
                // this.ctxrow.restore();
            }
            this.ctxrow.fillStyle="black";
            this.ctxrow.font =`bold ${15}px Arial`;
            this.ctxrow.textAlign="right";
            this.ctxrow.fillText(i,this.rowHeight-4,this.rowsize[i]+rowstart -5)
            this.ctxrow.restore();
            rowstart += this.rowsize[i];
        }
        if (this.starting && this.ending){
            this.ctxrow.save()
            let [x,y,w,h] = this.marchants()
            let startrowpixel = Math.max(this.containerdiv.scrollTop,y)
            let newHeight = Math.min(this.containerdiv.clientHeight,y>this.containerdiv.scrollTop ? h : h-this.containerdiv.scrollTop +y)
            this.ctxrow.beginPath();
            if (startrowpixel<this.containerdiv.scrollTop+this.containerdiv.clientHeight && newHeight>0){
                // console.log("drawing");
                this.ctxrow.moveTo(this.rowHeight,startrowpixel-2);
                this.ctxrow.lineTo(this.rowHeight,startrowpixel+newHeight);
            }
                // this.ctxrow.moveTo(this.rowHeight,y-2);
                // this.ctxrow.lineTo(this.rowHeight,y+h);
            this.ctxrow.lineWidth=4;
            this.ctxrow.strokeStyle="#107c41";
            this.ctxrow.stroke();
            this.ctxrow.restore();
        }
        
    }
    //cell data
    table(){
        // console.log("redraw");
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvaref.width, this.canvaref.height);
        this.ctx.scale(window.devicePixelRatio,window.devicePixelRatio)
        this.ctx.translate(-this.containerdiv.scrollLeft, -this.containerdiv.scrollTop)
            // this.ctx.clearRect(0, 0, this.canvaref.width, this.canvaref.height);
        // var sum = 0;
        // let colcount = 0;
        // for (let i = 0; i < this.columnsize.length; i++) {
        //     let count = 0;
        //     for (let j = 0; j < this.rowsize.length; j++) {
        //     // console.log(i,j,rows[j][dataColumns[i]]);
        //     count +=1;
        //     this.ctx.beginPath();
        //     this.ctx.save();
        //     this.ctx.rect(sum, j * this.rowHeight, this.columnsize[i], this.rowHeight);
        //     this.ctx.clip();
    
            // if(this.selectedcell && this.selectedcell.col === i && this.selectedcell.row === j){
            //     console.log("selected in draw");
            //     this.ctx.lineWidth=4;
            //     this.ctx.strokeStyle="green";
            // }
            // else if (this.starting && this.ending && 
            //     Math.min(this.starting.row, this.ending.row) <= j && 
            //     j <= Math.max(this.starting.row, this.ending.row) && 
            //     Math.min(this.starting.col, this.ending.col) <= i && 
            //     i <= Math.max(this.starting.col, this.ending.col)){
            //         this.ctx.fillStyle = "hsl(204, 77%, 90%)";
            //         this.ctx.fillRect(sum, j * this.rowHeight, this.columnsize[i], this.rowHeight)
            //     }
            // else{
            //     this.ctx.strokeStyle="#00000055";
            // }
        //     this.ctx.moveTo(sum, 0);
        //     this.ctx.lineTo(sum, this.canvaref.height);
        //     this.ctx.stroke();
        //     this.ctx.font = `${15}px Arial`;
        //     this.ctx.fillStyle = "black";
        //     // console.log(data[j][this.dataColumns[i]]);
        //     this.ctx.fillText(data[j] && data[j][i] ? data[j][i].text : " " ,sum + 4, (j + 1) * this.rowHeight - 5);
        //     this.ctx.restore();
        // }
        // colcount+=1;
        // console.log(count);
        // sum += this.columnsize[i];
        // }
        // console.log(colcount);
        
        let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclick({offsetX:0 , offsetY:0})
        let colstart =  columnstart;
        // console.log(this.starting,this.ending);
        // if (this.selectInfinity == true || this.selectrowInfinity == true){
        //     this.ctx.save()
        //     this.ctx.beginPath()
        //     let rectStartX = Math.min(this.starting.colstat, this.ending.colstat)
        //     let rectStartY = Math.min(this.starting.rowstat, this.ending.rowstat)
        //     let rectEndX = Math.max(this.starting.colstat, this.ending.colstat) +
        //     this.columnsize[(Math.max(this.starting.col, this.ending.col))<=this.columnsize.length ? Math.max(this.starting.col, this.ending.col) : 0]
        //     let rectEndY = Math.max(this.starting.rowstat, this.ending.rowstat) +
        //     this.rowsize[(Math.max(this.starting.row, this.ending.row))<=this.rowsize.length ? Math.max(this.starting.row, this.ending.row) : 0]
        //     // rectEndY = isNaN(rectEndY) ? this.tableDiv.scrollTop+this.tableDiv.clientHeight : rectEndY
        //     rectStartX = Math.max(this.containerdiv.scrollLeft, rectStartX)
        //     rectStartY = Math.max(this.containerdiv.scrollTop, rectStartY)
        //     rectEndX = Math.max(Math.min(this.containerdiv.scrollLeft+this.containerdiv.clientWidth,rectEndX), rectStartX-2)
        //     rectEndY = Math.max(Math.min(this.containerdiv.scrollTop+this.containerdiv.clientHeight, rectEndY), rectStartY-2)
        //     this.ctx.strokeStyle = "#107c41"
        //     this.ctx.lineWidth = 3
        //     this.ctx.fillStyle = "#e7f1ec";
        //     // console.log(rectStartX,rectStartY,(rectEndX-rectStartX),(rectEndY-rectStartY));
        //     this.ctx.rect(rectStartX,rectStartY,(rectEndX-rectStartX),(rectEndY-rectStartY))
        //     this.ctx.stroke()
        //     this.ctx.fill()
        //     this.ctx.restore()
        // }
        for (let i= xcordinate; colstart< (this.containerdiv.clientWidth+this.containerdiv.scrollLeft);i++){
            let rowsend = rowstart;
            for(let j=ycordinate; rowsend< (this.containerdiv.clientHeight+this.containerdiv.scrollTop);j++){
                this.ctx.beginPath();
                this.ctx.save();
                this.ctx.rect(colstart-0.5,rowsend-0.5,this.columnsize[i],this.rowsize[j]);
                this.ctx.clip();
                // console.log(i,j);
                // this.ctx.fillText(!this.data[j] || !this.data[j][i] ? " ": this.data[j][i].text ,rowsend + 4, (j + 1) * this.rowsize[j] - 5);
                // console.log(data[j][i]);
                // console.log(i,j,data[j]?data[j][i]:"nope");
                // console.log(rowsend+5 , colstart+this.rowsize[i]-5);
                // this.ctx.fillText(data[j] && data[j][i] ? data[j][i].text : " " , colstart + 5, rowsend + this.rowsize[i] - 5)
                if (this.selectedcell && this.selectedcell.col == i && this.selectedcell.row == j){
                    // this.ctx.strokeStyle = "#107c41"
                    // this.ctx.lineWidth = 2
                }
                else if (this.starting && this.ending && 
                    Math.min(this.starting.row, this.ending.row) <= j && 
                    j <= Math.max(this.starting.row, this.ending.row) && 
                    Math.min(this.starting.col, this.ending.col) <= i && 
                    i <= Math.max(this.starting.col, this.ending.col)){
                        this.ctx.fillStyle = "#e7f1ec";
                        this.ctx.fillRect(colstart,rowsend,this.columnsize[i],this.rowsize[j])
                    }
                if (this.data[j] && this.data[j][i] && this.data[j][i].wrap){
                    this.ctx.textBaseline="bottom";
                    this.ctx.fillStyle = "black";
                    this.ctx.font = `${15}px Arial`;
                    let base = 0
                    for(let v of this.data[j][i].wrappedarr.slice().reverse()){
                        this.ctx.fillText(v, colstart+5 , rowsend-base+this.rowsize[j])
                        base+=15
                    }
                }
                else{
                    this.ctx.fillStyle = "black";
                    this.ctx.font = `${15}px Arial`;
                    this.ctx.fillText(this.data[j] && this.data[j][i] ? this.data[j][i].text : " " , colstart + 5, rowsend + this.rowsize[j] - 5)
                }
                this.ctx.strokeStyle="#cbd5d0";
                this.ctx.stroke();
                // this.ctx.moveTo(colstart,0);
                // this.ctx.lineTo(colstart,this.canvaref.height);
                // this.ctx.strokeStyle="#00000055";
                // if(i==1 && j==0){console.log(i,j, colstart + 5, rowsend + this.rowsize[i] - 5);}
                
                // // this.ctx.fillText(data[j][this.dataColumns[i]] === undefined ? " " :data[j][this.dataColumns[i]] , colstart + this.columnsize[i] + 4, rowsend + this.rowsize[j] - 5);
                
                this.ctx.restore();
                rowsend+=this.rowsize[j];
            }
            colstart+=this.columnsize[i];
        }
       
        if(this.starting && this.ending ){
            let [x,y,w,h] = this.marchants()
            // console.log("drawing box",x,y,w,h);
            let startpixel = Math.max(this.containerdiv.scrollLeft  , x)
            let startrowpixel = Math.max(this.containerdiv.scrollTop , y)
            let newwidth = Math.min(this.containerdiv.clientWidth, x>this.containerdiv.scrollLeft ? w : w-this.containerdiv.scrollLeft+x)
            let newHeight = Math.min(this.containerdiv.clientHeight,y>this.containerdiv.scrollTop ? h : h-this.containerdiv.scrollTop +y)
            // if (isNaN(newHeight)){debugger}
            console.log(startpixel,startrowpixel,newwidth,newHeight);
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.strokeStyle = "#107c41"
            this.ctx.lineWidth = 2
            if(this.dashOffset!=0){
                this.ctx.setLineDash([4, 4]);
                this.ctx.lineDashOffset = this.dashOffset;
                this.dashOffset+=1;
                if(this.dashOffset>8){this.dashOffset=1;}
                this.marchloop=window.requestAnimationFrame(()=>{
                    this.table();
                    // this.marchants();
                });                        
            }
            if (newwidth>0 && newHeight>0 && startpixel<this.containerdiv.scrollLeft+this.containerdiv.clientWidth && startrowpixel<this.containerdiv.scrollTop+this.containerdiv.clientHeight){
                // console.log(startpixel,startrowpixel,newwidth,newHeight);
                this.ctx.strokeRect(startpixel-0.5,startrowpixel-0.5,newwidth-0.5,newHeight-1);
            }
            
            this.ctx.restore();
        }
    }
    
    //for column scroll
    checkcolumn(e){
        let stat = (this.containerdiv.scrollWidth - this.containerdiv.clientWidth - this.containerdiv.scrollLeft > 10 ? false : true)
        if (stat){
            // console.log("scrolling");
            this.columnsize = [...this.columnsize, ...Array(5).fill(100)];
            this.canvasize();
            this.headers();
            if (!this.marchloop){
                this.table();
                }
            this.rows();
        }
    }
    //for row scroll
    checkrow(e){
        let stat = (this.containerdiv.scrollHeight - this.containerdiv.clientHeight - this.containerdiv.scrollTop > 25 ? false : true)
        // console.log(stat);
        if (stat){
            // console.log("scrolling");
            this.rowsize = [...this.rowsize, ...Array(20).fill(30)];
            this.canvasize()
            this.rows();
            this.headers();
            if (!this.marchloop){
                this.table();
                }
        }
    }
    
    //click function for select cell to get position of selected
    handleclick(e){
        // console.log(e.offsetX,e.offsetY);
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
        // console.log(colposition,rowposition , xcord, ycord);
        return {columnstart:colposition,rowstart:rowposition , xcordinate:xcord , ycordinate:ycord}
    }
    
    //click color change and selected cell data change and position
    canvapointerclick(e){
        if (e.shiftKey == true){
            this.starting=JSON.parse(JSON.stringify(this.selectedcell))
            let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclick(e)
            // console.log(e.target);
            this.ending = {col:xcordinate , row:ycordinate ,colstat:columnstart,rowstat:rowstart}
        }
        else{
            let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclick(e)
            this.selectedcell = {col:xcordinate , row:ycordinate , columnstart:columnstart , rowstart:rowstart}
            this.inputdiv.style.display = "none";
            // this.selectInfinity=false
            // this.selectrowInfinity=false
        }
        
        // this.starting=null
        // this.ending=null
        // console.log("Cell data : ", data[ycordinate][xcordinate]);
        // console.log(this.selectedcell);
    }
    
    //edit feild dblclick function
    editfeild(e){
        // console.log("double clk");
        this.inputdiv.style.display = "block"
        this.inputdiv.style.left=(this.selectedcell.columnstart + this.rowHeight)  + "px"
        this.inputdiv.style.top=(this.selectedcell.rowstart + this.rowHeight) + "px"
        this.inputdiv.style.width = this.columnsize[this.selectedcell.col]  - 1 + "px"
        this.inputdiv.style.height = this.rowsize[this.selectedcell.row] - 2 + "px"
        let inputref = this.inputdiv.querySelector("input")
        inputref.font= `${15}px Arial`;
        inputref.value = this.data[this.selectedcell.row] && this.data[this.selectedcell.row][this.selectedcell.col] ? this.data[this.selectedcell.row][this.selectedcell.col]['text'] : "" ; 
        inputref.focus();
        if (!this.marchloop){
            this.table();
            }
    }
    
    //key input enters and escape
    handleKeyInputEnter(e) {
        if (e.key === "Enter") {
            let newValue = {text:e.target.value};
          // console.log(selectedCell);
            if(this.data[this.selectedcell.row]){
                if(this.data[this.selectedcell.row][this.selectedcell.col]){
                    this.data[this.selectedcell.row][this.selectedcell.col]['text'] = e.target.value;
                }
                else{
                    this.data[this.selectedcell.row][this.selectedcell.col] = newValue;
                }
            }
            else{
                let newrow = {}
                this.data[this.selectedcell.row] = newrow;
                this.data[this.selectedcell.row][this.selectedcell.col] = newValue;
            }
            this.inputdiv.style.display="none";
            if (this.data[this.selectedcell.row][this.selectedcell.col].wrap){
                this.wraptext();
            }
            // this.find()
            // window.localStorage.setItem("data",JSON.stringify(data))
            // window.localStorage.setItem("column",JSON.stringify(this.columnsize))
            // window.localStorage.setItem("rows",JSON.stringify(this.rowsize))
        }
        else if (e.key === "Escape"){
            this.inputdiv.style.display = "none"
        }
        if (!this.marchloop){
            this.table();
        }
    }
    
    //key handlers
    keyhandler(e){
        // console.log(this.selectedcell.row,"key pressed");
        if (e.target == this.inputdiv.querySelector("input")){return}
        else if (e.key==="ArrowLeft"){
            if (e.shiftKey === true){
                // console.log("shift pressed");
                this.starting = {"col":this.selectedcell.col};
                this.starting.row = this.selectedcell.row;
                if (this.ending === null){
                    this.ending.row = this.selectedcell.row;
                    this.ending.col = this.selectedcell.col;
                }
                else{
                    if (this.ending.col>0){
                        this.ending.col = this.ending.col -1;
                        this.selectedcell.columnstart = this.selectedcell.columnstart - this.columnsize[this.selectedcell.col]
                    }
                    if(this.containerdiv.scrollLeft>this.selectedcell.columnstart){
                        this.containerdiv.scrollBy(-this.columnsize[this.selectedcell.col],0)
                    }
                    this.marchloop=null
                    if (!this.marchloop){
                        this.table();
                        }
                    }
            }
            else{
                e.preventDefault();
                // this.starting=null;
                this.dashOffset=0
                this.inputdiv.style.display="none";
                if (this.selectedcell.col == 0){
                    this.selectedcell.col=0
                }
                else{
                    this.selectedcell.col = this.selectedcell.col -1;
                    this.selectedcell.columnstart = this.selectedcell.columnstart - this.columnsize[this.selectedcell.col]
                    // console.log(this.containerdiv.scrollLeft,this.selectedcell.col);
                    
                    this.starting=JSON.parse(JSON.stringify(this.selectedcell))
                    this.ending=JSON.parse(JSON.stringify(this.selectedcell))
                    if(this.containerdiv.scrollLeft>this.selectedcell.columnstart){
                        this.containerdiv.scrollBy(-this.columnsize[this.selectedcell.col],0)
                    }
                    // console.log("left");
                    this.marchloop=null
                    if (!this.marchloop){
                        this.table();
                        }
                    this.headers();
                }
            }
        }
        else if (e.key === "ArrowRight"){
            if (e.shiftKey === true){
                // console.log("shift pressed");
                this.starting = {"col":this.selectedcell.col};
                this.starting.row = this.selectedcell.row;
                if (this.ending === null){
                    this.ending.row = this.selectedcell.row;
                    this.ending.col = this.selectedcell.col;
                }
                else{
                    this.ending.col = this.ending.col +1;
                    this.selectedcell.columnstart = this.selectedcell.columnstart + this.columnsize[this.selectedcell.col]
                    if(this.containerdiv.scrollLeft+this.containerdiv.clientWidth<this.selectedcell.columnstart+this.columnsize[this.selectedcell.col]){
                        this.containerdiv.scrollBy(+this.columnsize[this.selectedcell.col],0)
                    }
                    this.marchloop=null
                    if (!this.marchloop){
                        this.table();
                        }
                    }
            }
            else{
                this.starting=null;
                e.preventDefault();
                this.dashOffset=0
                this.inputdiv.style.display="none";
                this.selectedcell.col = this.selectedcell.col +1;
                this.selectedcell.columnstart = this.selectedcell.columnstart + this.columnsize[this.selectedcell.col]
                    // console.log(this.containerdiv.scrollLeft,this.selectedcell.col);
                    this.starting=JSON.parse(JSON.stringify(this.selectedcell))
                    this.ending=JSON.parse(JSON.stringify(this.selectedcell))
                if(this.containerdiv.scrollLeft+this.containerdiv.clientWidth<this.selectedcell.columnstart+this.columnsize[this.selectedcell.col]){
                    this.containerdiv.scrollBy(+this.columnsize[this.selectedcell.col],0)
                }
                this.marchloop=null
                if (!this.marchloop){
                    this.table();
                    }
                this.headers();
            } 
        }
        else if(e.key === "ArrowUp"){
            if (e.shiftKey === true){
                // console.log("shift pressed");
                this.starting = {"col":this.selectedcell.col};
                this.starting.row = this.selectedcell.row;
                if (this.ending === null){
                    this.ending.row = this.selectedcell.row;
                    this.ending.col = this.selectedcell.col;
                }
                else{
                    if (this.ending.row>0){
                        this.ending.row = this.ending.row - 1;
                        this.selectedcell.rowstart = this.selectedcell.rowstart - this.rowsize[this.selectedcell.row]
                    }
                    if(this.containerdiv.scrollTop>this.selectedcell.rowstart){
                        this.containerdiv.scrollBy(0,-this.rowsize[this.selectedcell.row])
                    }
                    this.marchloop=null
                    if (!this.marchloop){
                        this.table();
                        }
                    }
                this.rows()
                // console.log(this.selectedcell,this.starting,this.ending);
            }
            else{
                e.preventDefault();
                // this.starting=null;
                this.dashOffset=0
                this.inputdiv.style.display="none";
                if (this.selectedcell.row!=0){
                    this.selectedcell.row = this.selectedcell.row -1;
                    this.selectedcell.rowstart = this.selectedcell.rowstart - this.rowsize[this.selectedcell.row]
                    this.starting=JSON.parse(JSON.stringify(this.selectedcell))
                    this.ending=JSON.parse(JSON.stringify(this.selectedcell))
                    // console.log(this.containerdiv.scrollLeft,this.selectedcell.col);
                    if(this.containerdiv.scrollTop>this.selectedcell.rowstart){
                        this.containerdiv.scrollBy(0,-this.rowsize[this.selectedcell.row])
                    }
                    this.marchloop=null
                    if (!this.marchloop){
                        this.table();
                        }
                this.rows()
                }
            }
        }
        else if (e.key === "ArrowDown"){
            if (e.shiftKey === true){
                // console.log("shift pressed");
                this.starting = {"col":this.selectedcell.col};
                this.starting.row = this.selectedcell.row;
                if (this.ending === null){
                    this.ending.row = this.selectedcell.row;
                    this.ending.col = this.selectedcell.col;
                }
                else{
                    this.ending.row = this.ending.row + 1;
                    this.selectedcell.rowstart = this.selectedcell.rowstart + this.rowsize[this.selectedcell.row]
                    if(this.containerdiv.scrollTop+this.containerdiv.clientHeight<this.selectedcell.rowstart+this.rowsize[this.selectedcell.row]){
                        this.containerdiv.scrollBy(0,+this.rowsize[this.selectedcell.row])
                    }
                    this.marchloop=null
                    if (!this.marchloop){
                        this.table();
                        }
                }
                this.rows()
            }
            else{
                this.starting=null;
                e.preventDefault();
                this.dashOffset=0
                this.inputdiv.style.display="none";
                this.selectedcell.rowstart = this.selectedcell.rowstart + this.rowsize[this.selectedcell.row]
                this.selectedcell.row = this.selectedcell.row +1;
                this.starting=JSON.parse(JSON.stringify(this.selectedcell))
                this.ending=JSON.parse(JSON.stringify(this.selectedcell))
                // console.log(this.containerdiv.scrollLeft,this.selectedcell.col);
                if(this.containerdiv.scrollTop+this.containerdiv.clientHeight<this.selectedcell.rowstart+this.rowsize[this.selectedcell.row]){
                    this.containerdiv.scrollBy(0,+this.rowsize[this.selectedcell.row])
                }
                this.marchloop=null
                if (!this.marchloop){
                    this.table();
                    }
                this.rows();
            }
            
        }
        else if (e.key === "c" && e.ctrlKey){
            // console.log("ctrl c");
            this.dashOffset=1;
            if (!this.marchloop){
                this.table();
                }
            this.clipboard();
        }
        else if (e.key === "Enter"){
            if (e.shiftKey == true ){
                if (this.selectedcell.row!=0){
                    this.selectedcell.row = this.selectedcell.row -1;
                    this.selectedcell.rowstart = this.selectedcell.rowstart - this.rowsize[this.selectedcell.row]
                    this.starting=JSON.parse(JSON.stringify(this.selectedcell))
                    this.ending=JSON.parse(JSON.stringify(this.selectedcell))
                    // console.log(this.containerdiv.scrollLeft,this.selectedcell.col);
                    if(this.containerdiv.scrollTop>this.selectedcell.rowstart){
                        this.containerdiv.scrollBy(0,-this.rowsize[this.selectedcell.row])
                    }
                    this.marchloop=null
                    if (!this.marchloop){
                        this.table();
                        }
                this.rows()
                }
            }
            else{
                this.dashOffset=0
                this.selectedcell.rowstart = this.selectedcell.rowstart + this.rowsize[this.selectedcell.row]
                this.selectedcell.row = this.selectedcell.row +1;
                this.starting=JSON.parse(JSON.stringify(this.selectedcell))
                this.ending=JSON.parse(JSON.stringify(this.selectedcell))
                    // console.log(this.containerdiv.scrollLeft,this.selectedcell.col);
                if(this.containerdiv.scrollTop+this.containerdiv.clientHeight<this.selectedcell.rowstart+this.rowsize[this.selectedcell.row]){
                    this.containerdiv.scrollBy(0,+this.rowsize[this.selectedcell.row])
                }
                this.marchloop=null
                if (!this.marchloop){
                    this.table();
                    }
                this.rows()
            }
        }
        else if (e.key === "Delete"){
            // let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclick(e)
            // this.selectedcell= {col:xcordinate,row:ycordinate,columnstart:columnstart,rowstart:rowstart};
            // console.log(this.starting);
            // data[this.starting.row][this.starting.col].text = ""
            if (this.starting && this.ending){
                for(let i=this.starting.col;i<=this.ending.col;i++){
                    for(let j=this.starting.row;j<=this.ending.row;j++){
                        if(this.data[j]?.[i]?.text){
                            this.data[j][i].text=""
                        }
                    }
                }
            }
            this.table()
            console.log("delete");
        }
    }
    
    //range selection
    handlemouseDown(e){
        let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclick(e)
        this.starting = {col:xcordinate , row:ycordinate , colstat:columnstart , rowstat:rowstart}
        console.log(this.starting);
        this.ending = null;
        this.dashOffset=0;
        this.marchloop=null;

        // console.log(this.starting);
        // e.target.addEventListener("pointerdown",handlemouseDown);
        // let temp1, temp2;
        function handleMouseMove(i){
            let newX = e.offsetX+i.clientX-e.clientX
            let newY = e.offsetY+i.clientY-e.clientY
            let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclick({offsetX:newX,offsetY:newY})
            this.ending = { row: ycordinate, col: xcordinate ,colstat:columnstart,rowstat:rowstart};
            if(this.containerdiv.scrollLeft>=this.ending.colstat-50){ //scroll left
                this.containerdiv.scrollBy(-this.columnsize[this.ending.col],0)
            }
            if(this.containerdiv.scrollLeft+this.containerdiv.clientWidth<=this.ending.colstat+this.columnsize[this.ending.col]+50){ //scroll right
                this.containerdiv.scrollBy(+this.columnsize[this.ending.col],0)
            }
            if(this.containerdiv.scrollTop>=this.ending.rowstat-50){ //up
                this.containerdiv.scrollBy(0,-this.rowsize[this.ending.row])
            }
            // console.log(this.containerdiv.scrollTop+this.containerdiv.clientHeight,this.ending.rowstat+this.rowsize[this.ending.row]);
            if(this.containerdiv.scrollTop+this.containerdiv.clientHeight<=this.ending.rowstat+this.rowsize[this.ending.row]+50){
                this.containerdiv.scrollBy(0,+this.rowsize[this.ending.row])
            }
            if (!this.marchloop){
                this.table();
                }
            this.headers()
            this.rows()
            // console.log(this.ending);
        }
        
            // e.target.addEventListener("mousemove",handleMouseMove)
        let temp1 = handleMouseMove.bind(this)
        window.addEventListener("pointermove",temp1);
    
        function handlemouseup(j){
            
            let newX = e.offsetX+j.clientX-e.clientX
            let newY = e.offsetY+j.clientY-e.clientY
            let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclick({offsetX:newX,offsetY:newY})
            // console.log(e.target);
            window.removeEventListener("pointermove",temp1);
            this.ending = {col:xcordinate , row:ycordinate ,colstat:columnstart,rowstat:rowstart}
            // console.log("final ending",this.ending);
            if(!this.marchloop) {this.marchants();}
            this.calculate();
            window.removeEventListener("pointerup",temp2)
        }
        let temp2 = handlemouseup.bind(this)
        window.addEventListener("pointerup",temp2);   
        // e.target.removeEventListener("pointerdown",this.handlemouseDown)
    }
    
    // column resize move pointer function 
    moveheader(e){
        // console.log("always check");
        // let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclick({offsetX:0 , offsetY:0})
        // let x = e.offsetX + this.containerdiv.scrollLeft;
        // // console.log(x,this.headerref.clientWidth+this.containerdiv.scrollLeft,columnstart);
        // for(let i = columnstart ; x<(this.headerref.clientWidth+this.containerdiv.scrollLeft);i+=this.columnsize[ycordinate]){
        //     if (Math.abs(x-this.columnsize[ycordinate]) <5){
        //         e.target.style.cursor = "col-resize";
        //         break;
        //     }
        //     else{
        //         e.target.style.cursor = "default";
        //     }
        //     x -=this.columnsize[ycordinate];
        //     ycordinate++
        // }
    
        let firstcell = this.handleclick({offsetX:0 , offsetY:0})
        let x = e.offsetX + this.containerdiv.scrollLeft;
        let boundry = firstcell.columnstart + this.columnsize[firstcell.xcordinate]
        // console.log(x,this.headerref.clientWidth+this.containerdiv.scrollLeft,columnstart);
        for(let i = firstcell.xcordinate ; boundry< this.containerdiv.clientWidth+this.containerdiv.scrollLeft && i<this.columnsize.length;i++,boundry+=this.columnsize[i]){
            if (Math.abs(x-boundry) <=10){
                e.target.style.cursor = "col-resize";
                break;
            }
            else{
                e.target.style.cursor = "default";
            }
        }
    }
    changesize(edown){
        // console.log("down");
        // console.log(this.handleclick({offsetX:0 , offsetY:0}));
        // let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclick({offsetX:0 , offsetY:0})
        // let x = edown.offsetX + this.containerdiv.scrollLeft;
        // // console.log(x);
        // let boundry = columnstart + this.columnsize[ycordinate]
        // let doresize = false;
        // for(var i = columnstart ; x<(this.headerref.clientWidth+this.containerdiv.scrollLeft) ;i+=this.columnsize[ycordinate]){
        //     if (Math.abs(x-this.columnsize[ycordinate]) <=15){
        //         // console.log(x-this.columnsize[i]);
        //         edown.target.style.cursor = "col-resize";
        //         doresize=true
        //         // console.log(i);
        //         break;
        //     }
        //     else{
        //         edown.target.style.cursor = "default";
        //     }
        //     x -=this.columnsize[ycordinate];
        //     ycordinate++
        // }
        let firstcell = this.handleclick({offsetX:0 , offsetY:0})
        let x = edown.offsetX + this.containerdiv.scrollLeft;
        let boundry = firstcell.columnstart + this.columnsize[firstcell.xcordinate]
        let doresize=false
        // let colsizearr = 0
        // console.log(x,this.headerref.clientWidth+this.containerdiv.scrollLeft,columnstart);
        for(var i = firstcell.xcordinate ; boundry< this.containerdiv.clientWidth+this.containerdiv.scrollLeft && i<this.columnsize.length && (boundry<x || Math.abs(boundry-x)<=10);i++,boundry+=this.columnsize[i]){
            if (Math.abs(x-boundry) <=10){
                edown.target.style.cursor = "col-resize";
                console.log("boundry",boundry);
                doresize = true
                break;
            }
            else{
                edown.target.style.cursor = "default";
            }
        }   
        // console.log("jashfjhd",boundry);
        if (!doresize){
            // this.selectInfinity = true
            // console.log(i,x,ycordinate);
            this.selectedcell.row = 0
            if (edown.shiftKey == true){
                this.ending.col = i
                this.ending.colstat = boundry - this.columnsize[i]
                this.starting.row = 0;
                this.ending.row = this.rowlimit;
                this.starting.rowstat = 0;
                this.ending.rowstat = Infinity;
                this.headers()
                this.table()
                this.rows()
                return  
            }
            this.selectedcell.col = i
            this.starting.col = i;
            this.ending.col = i;
            this.starting.colstat = boundry - this.columnsize[i]
            this.ending.colstat = boundry - this.columnsize[i];
            this.starting.row = 0;
            this.ending.row = this.rowlimit;
            this.starting.rowstat = 0;
            this.ending.rowstat = Infinity;
            // this.selectedCell = JSON.parse(JSON.stringify(this.starting))
            let count =0
            // console.log("bound",boundry);
            let moveinfinity = async (em)=>{
                if ((edown.offsetX+em.clientX-edown.clientX+this.containerdiv.scrollLeft)>=(boundry)){
                    count+=1
                    boundry +=this.columnsize[i+count]
                    this.ending.colstat = this.ending.colstat+this.columnsize[i+count]
                    this.ending.col = i+count
                    console.log(this.containerdiv.scrollLeft+this.containerdiv.clientWidth, boundry +100)
                }
                if(this.containerdiv.scrollLeft+this.containerdiv.clientWidth <= boundry +100){ //scroll right
                    this.containerdiv.scrollBy(+100,0)
                }
                if ((edown.offsetX+em.clientX-edown.clientX+this.containerdiv.scrollLeft)<(boundry - this.columnsize[i+count])){
                    console.log("move left");
                    // console.log("dec",em.offsetX+this.containerdiv.scrollLeft);
                    boundry -=this.columnsize[i+count]
                    count-=1
                    this.ending.col = i+count
                    this.ending.colstat -= this.columnsize[i+count]
                    // console.log(this.containerdiv.scrollLeft,this.ending.colstat);
                }
                if(this.containerdiv.scrollLeft>=this.ending.colstat){
                    this.containerdiv.scrollBy(-100,0)
                }
                this.headers()
                this.rows()
                this.table()
            }
            let upinfinity =()=>{
                window.removeEventListener("pointerup",upinfinity);
                window.removeEventListener("pointermove",moveinfinity);
            }
            window.addEventListener("pointermove",moveinfinity)
            window.addEventListener("pointerup",upinfinity)
            this.headers();
            this.rows();
            if (!this.marchloop){
                this.table();
            }
            return
        }
        else{
            let minx = boundry - this.columnsize[i]
            let resize = (emove) =>{
                if ((this.columnsize[i]+emove.movementX>=20) && (emove.offsetX+this.containerdiv.scrollLeft >=minx)){
                    this.columnsize[i]+=emove.movementX/window.devicePixelRatio
                    // console.log(this.columnsize[i]);
                    if (!this.marchloop){
                        this.table();
                    }
                    this.headers();
                }
                
            }
            let resizeup = (eup) =>{
                this.wraptextforcol(i)
                window.removeEventListener("pointerup",resizeup);
                window.removeEventListener("pointermove",resize);
            }
            window.addEventListener("pointermove",resize)
            window.addEventListener("pointerup",resizeup);
        }
        
    }
    
    // row resize
    moverow(e){
        let firstcell = this.handleclick({offsetX:0 , offsetY:0})
        let x = e.offsetY + this.containerdiv.scrollTop;
        let boundry = firstcell.rowstart + this.rowsize[firstcell.ycordinate]
        // console.log(x,this.headerref.clientWidth+this.containerdiv.scrollLeft,columnstart);
        for(let i = firstcell.ycordinate ; boundry< this.containerdiv.clientHeight+this.containerdiv.scrollTop && i<this.rowsize.length;i++,boundry+=this.rowsize[i]){
            if (Math.abs(x-boundry) <=5){
                e.target.style.cursor = "row-resize";
                break;
            }
            else{
                e.target.style.cursor = "default";
            }
        }
    }
    changerowsize(edown){
        // console.log("down");
        let firstcell = this.handleclick({offsetX:0 , offsetY:0})
        let x = edown.offsetY + this.containerdiv.scrollTop;
        let boundry = firstcell.rowstart + this.rowsize[firstcell.ycordinate]
        let doresize = false
        // console.log(x,this.headerref.clientWidth+this.containerdiv.scrollLeft,columnstart);
        for(var i = firstcell.ycordinate ; boundry< this.containerdiv.clientHeight+this.containerdiv.scrollTop && i<this.rowsize.length && (boundry<x || Math.abs(boundry-x)<=10);i++,boundry+=this.rowsize[i]){
            if (Math.abs(x-boundry) <=10){
                edown.target.style.cursor = "row-resize";
                doresize = true
                break;
            }
            else{
                edown.target.style.cursor = "default";
            }
        }
        let miny = boundry - this.rowsize[i]
        if (!doresize){ 
            this.selectedcell.col = 0
            if (edown.shiftKey == true){
                this.ending.row=i
                this.ending.rowstat = boundry - this.rowsize[i]
                this.starting.col = 0
                this.ending.col = this.collimit
                this.starting.colstat=0
                this.ending.colstat=Infinity
                this.headers()
                this.table()
                this.rows()
                return
            }
            this.selectedcell.row = i
            // this.selectrowInfinity=true
            this.starting.col = 0
            this.ending.col = this.collimit
            this.starting.colstat=0
            this.ending.colstat=Infinity
            this.starting.row=i
            this.ending.row=i
            this.starting.rowstat = boundry - this.rowsize[i]
            this.ending.rowstat = boundry - this.rowsize[i]
            // this.selectedCell = JSON.parse(JSON.stringify(this.starting))
            let count =0
            let moveinfinity = (em)=>{
                if ((edown.offsetY+em.clientY-edown.clientY+this.containerdiv.scrollTop)>=(boundry)){
                    count+=1
                    boundry +=this.rowsize[i+count]
                    // this.columnsize[i] = this.columnsize[i+count]
                    this.ending.row = i+count
                }
                if(this.containerdiv.scrollTop+this.containerdiv.clientHeight <= boundry +100){ //scroll right
                    this.containerdiv.scrollBy(0,+100)
                }
                if ((edown.offsetY+em.clientY-edown.clientY+this.containerdiv.scrollTop)<=(boundry - this.rowsize[i+count])){
                    boundry -=this.rowsize[i+count]
                    count-=1
                    // this.columnsize[i] = this.columnsize[i+count]
                    this.ending.row = i+count
                }
                if(this.containerdiv.scrollTop>=this.ending.colstat){
                    this.containerdiv.scrollBy(0,-100)
                }
                this.rows()
                this.headers()
                this.table()
            }
            let upinfinity =()=>{
                window.removeEventListener("pointerup",upinfinity);
                window.removeEventListener("pointermove",moveinfinity);
            }
            window.addEventListener("pointermove",moveinfinity)
            window.addEventListener("pointerup",upinfinity)
            this.headers();
            this.rows();
            if (!this.marchloop){
                this.table();
            }
            return
        }
        let rowresize = (e) =>{
            if ((this.rowsize[i]+e.movementY>=5) && (e.offsetY+this.containerdiv.scrollTop>=miny)){
                this.rowsize[i] = this.rowsize[i] + e.movementY/window.devicePixelRatio
                if (!this.marchloop){
                    this.table();
                }
                this.rows();
            }
            // console.log("move");
        }
        let rowresizeup = (eup) =>{
            // console.log("up");
            
            window.removeEventListener("pointerup",rowresizeup);
            window.removeEventListener("pointermove",rowresize);
        }
        window.addEventListener("pointermove",rowresize)
        window.addEventListener("pointerup",rowresizeup);
    }
    
    //getting select position from top left and width and height of selected data
    marchants(){
        // console.log("calling march ants");
        // await new Promise(r=>setTimeout(r,1))
        if(this.starting && this.ending){
            // console.log("march ants");
            let [posX,posY,rectWidth, rectHeight] = [0,0,0,0];
            let i=0;
            while(i<Math.min(this.starting.col, this.ending.col)){
              posX+=this.columnsize[i];
              i++;
            }
            while(i<Math.max(this.starting.col+1, this.ending.col+1)&& i<this.columnsize.length){
                    rectWidth+=this.columnsize[i];
                    i++;
                
            }
            i=0;
            while(i<Math.min(this.starting.row, this.ending.row)){
                posY+=this.rowsize[i];
                i++;
            }
            while(i<Math.max(this.starting.row+1, this.ending.row+1)&&i<this.rowsize.length){
                    rectHeight+=this.rowsize[i];
                    i++;
                
            }
            return [posX,posY,rectWidth, rectHeight]
            
        }
    }
    
    //copy clipboard
    clipboard(){
        if (this.starting && this.ending){
            let text="";
            for (let i = Math.min(this.starting.row,this.ending.row); i <= Math.max(this.starting.row,this.ending.row); i++) {
                for (let j = Math.min(this.starting.col,this.ending.col); j <= Math.max(this.starting.col,this.ending.col); j++){
                  // console.log(i,j);
                  text +=`${(this.data[i] && this.data[i][j] ? this.data[i][j].text : " ")}\t`;
                }
                text += `\n`
            }
            navigator.clipboard.writeText(text.trim())
        }
    }
    
    //calculations aggregate functions
    calculate(){ 
        console.log("starting",this.starting,"ending",this.ending);
        let arr = []
        let min;
        let max;
        let mean;
        let sum;
        if (this.starting.col == this.ending.col){
            let start = Math.min(this.starting.row , this.ending.row);
            let end = Math.max(this.starting.row , this.ending.row);
            for(let i = start ; i<=end ; i++){
                if (this.data[i] && this.data[i][this.starting.col] && !isNaN(Number(this.data[i][this.starting.col].text))){
                    arr.push(Number(this.data[i][this.starting.col].text))
                }
                
            }
            min = Math.min(...arr);
            max = Math.max(...arr);
            mean = arr.reduce((prev, curr) => prev + curr,0) / arr.length;
            sum = mean * arr.length
            // console.log(min==Infinity?0:min,max==-Infinity?0:max,isNaN(mean)?0:mean,isNaN(sum)?0:sum);
            return[min==Infinity?0:min,max==-Infinity?0:max,isNaN(mean)?0:mean,isNaN(sum)?0:sum];
    
        }
        // console.log(arr);
    }
    
    //doubleclick on header resize
    headerclick(e){
        let firstcell = this.handleclick({offsetX:0 , offsetY:0})
        let x = e.offsetX + this.containerdiv.scrollLeft;
        let boundry = firstcell.columnstart + this.columnsize[firstcell.xcordinate]
        let doresize=false
        // console.log(x,this.headerref.clientWidth+this.containerdiv.scrollLeft,columnstart);
        for(var i = firstcell.xcordinate ; boundry< this.containerdiv.clientWidth+this.containerdiv.scrollLeft && i<this.columnsize.length && (boundry<x || Math.abs(boundry-x)<=10);i++,boundry+=this.columnsize[i]){
            if (Math.abs(x-boundry) <=10){
                e.target.style.cursor = "col-resize";
                doresize = true
                break;
            }
            else{
                e.target.style.cursor = "default";
            }
        }   
        if (!doresize){return}
            this.ctx.save()
            this.ctx.font=`${15}px Arial`
            let tempdatacolumn = (Object.keys(this.data).filter(x=>this.data[x][i] && !this.data[x][i].wrap)).map(x=>Math.ceil(this.ctx.measureText(this.data[x][i].text).width))   
            if (tempdatacolumn.length===0){return}
            this.columnsize[i] = Math.max(...tempdatacolumn) + 5 
            // console.log(this.columnsize[i]);
            this.ctx.restore()
            if (!this.marchloop){
            this.table();
            }
            this.headers();
            console.log(tempdatacolumn);
            // console.log(this.ctx.measureText(tempdatacolumn));
            // this.ctx.measureText()
        
        // this.wraptextforcol(ycordinate)
    }
    
    //text wrap
    wraptext(){
        let s1="";
        let w=15; //font size
        let wrappedarr = []
        this.ctx.save()
        this.ctx.font=`${15}px Arial`;
        if (this.data[this.selectedcell.row] && this.data[this.selectedcell.row][this.selectedcell.col]?.text){
            for(let x of this.data[this.selectedcell.row][this.selectedcell.col].text){
                w+=this.ctx.measureText(x).width
                if(w > (this.columnsize[this.selectedcell.col])-5){
                    this.data[this.selectedcell.row][this.selectedcell.col]["wrap"]=true 
                    // console.log(s1)
                    wrappedarr.push(s1)
                    s1=""
                    w=15;
                }
                s1+=x
            }
            wrappedarr.push(s1)
            this.data[this.selectedcell.row][this.selectedcell.col].wrappedarr = wrappedarr; 
            // let val = s1.split("\n").length
            // this.rowsize[this.selectedcell.row] = Math.max(val *15,this.rowsize[this.selectedcell.row]);
            this.rowsize[this.selectedcell.row] = Math.max(wrappedarr.length *15,this.rowsize[this.selectedcell.row]);
            this.rows()
            // this.ctxrow([this.selectedcell.row] = val * this.rowsize[this.selectedcell.row])
            this.ctx.restore()
        }
    }

    //wrap range data
    wraprange(){
        // (this.starting && this.ending && 
        //     Math.min(this.starting.row, this.ending.row) <= j && 
        //     j <= Math.max(this.starting.row, this.ending.row) && 
        //     Math.min(this.starting.col, this.ending.col) <= i && 
        //     i <= Math.max(this.starting.col, this.ending.col
        this.ctx.save()
        this.ctx.font=`${15}px Arial`;
        for(let i=Math.min(this.starting.row, this.ending.row) ; i<=Math.max(this.starting.row, this.ending.row);i++){
            if (this.data[i]){
                for(let j=Math.min(this.starting.col, this.ending.col);j<=Math.max(this.starting.col, this.ending.col);j++){
                    if (this.data[i][j]){
                        this.data[i][j].wrap = true
                    }
                }
            }
        }
        for(let j=Math.min(this.starting.col, this.ending.col);j<=Math.max(this.starting.col, this.ending.col);j++){
            this.wraptextforcol(j)
        }
        this.rows()
        this.table()
    }
    
    //column resize wrap text
    wraptextforcol(xcordinate){
        let rows = Object.keys(this.data).filter(x=>this.data[x][xcordinate]?.wrap)
        rows.forEach(r=>{
            let s1="";
            let w=15;
            let wrappedarr = []
            this.ctx.save()
            this.ctx.font=`${15}px Arial`;
            for(let x of this.data[r][xcordinate].text){
                w+=this.ctx.measureText(x).width
                if(w > (this.columnsize[xcordinate])-5){
                    // console.log(s1)
                    wrappedarr.push(s1)
                    s1=""
                    w=15;
                }
                s1+=x
            }
            wrappedarr.push(s1)
            this.data[r][xcordinate].wrappedarr = wrappedarr; 
            // console.log(s1);
            // console.log(s1.split("\n").length);
            // let val = s1.split("\n").length
            // this.rowsize[this.selectedcell.row] = Math.max(val *15,this.rowsize[this.selectedcell.row]);
            this.rowsize[r] = Math.max(wrappedarr.length *15,this.rowsize[r]);
            
            // this.ctxrow([this.selectedcell.row] = val * this.rowsize[this.selectedcell.row])
            this.ctx.restore()
        })
    }
    
    //find data
    find(findtext){
        let datarow = Object.entries(this.data).map(v=>[v[0],Object.entries(v[1])])
        console.log(datarow);
        let finalarr = datarow.map(x=>{
            x[1]=x[1].filter(y=>JSON.stringify(y[1]).replaceAll("\\n","").includes(findtext)) 
            return x 
        }
        ).filter(x=>x[1].length)
        console.log(finalarr);
        let rowpos = (finalarr.map(v=>v[0]));
        let colpos = (finalarr.map(v=>v[1][0][0]));
        console.log(finalarr,rowpos[0],colpos[0]);
        this.starting.row = Number(rowpos[0])
        this.starting.col = Number(colpos[0])
        this.ending.row = Number(rowpos[0])
        this.ending.col = Number(colpos[0])
        this.ending.colstat=0
        this.starting.colstat=0
        for (let i=0;i<this.ending.col;i++){
            this.starting.colstat+=this.columnsize[i]
            this.ending.colstat+=this.columnsize[i]
        }
        this.ending.rowstat=0
        this.starting.rowstat=0
        for(let i=0;i<this.ending.row;i++){
            this.starting.rowstat+=this.rowsize[i]
            this.ending.rowstat+=this.rowsize[i]
        }
        console.log(this.starting,this.ending);
        this.containerdiv.scrollTo(this.ending.colstat,this.ending.rowstat)
        this.table()
        this.headers()
        this.rows()
        // console.log(finalarr.map(v=>v[1][0]));
    }
    
    //graph function
    drawgraph=null;
    graph(){
        if(this.drawgraph)this.drawgraph.destroy()
        let dataarr=[]
        // let arr=[]
        let sum = 0
        let count = 0
        for (let i=this.starting.col ; i<=this.ending.col;i++){
            for (let j=this.starting.row;j<=this.ending.row;j++){
                console.log(sum);
                console.log(j,i);
                if (this.data[j] && this.data[j][i] && Number(this.data[j][i].text)){
                    sum+=Number(this.data[j][i].text)
                    count+=1
                }
            }
            let avg = (sum/count)
            if (!isNaN(avg)){
                dataarr.push(avg)
                // arr.push(data[i].text)
            }
            sum=0
            count=0
        }
        let arr = dataarr.map((x,v)=>Sheet.headerdata(this.starting.col + v))
        console.log(dataarr);
        this.drawgraph = new Chart(this.canvaref, {
            type: 'pie',
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
        // else{
        //   drawgraph.destroy();  
        //   ctxgraph.style.display="none";
        // }
    }
}