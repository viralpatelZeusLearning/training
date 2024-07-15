let data = await fetch("./tempData.json")
data = await data.json();
console.log(data);

export class sheet{
    // columnArr = [180, 120, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 150, 100];
    columnsize= Array(14).fill(100);
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
    // selectedCell = null;
    // starting ;
    // ending ;
    // dashOffset = 0;
    // marchloop = null;
    constructor(div){
        this.containerdiv = document.createElement("div");
        this.btn = document.createElement("button");
        this.headerref = document.createElement("canvas");
        this.rowref = document.createElement("canvas");
        this.containertable = document.createElement("div");
        this.childdiv = document.createElement("div");
        this.canvaref  = document.createElement("canvas");

        this.containerdiv.classList.add("containerDiv");
        this.btn.classList.add("btn");
        this.headerref.classList.add("header");
        this.rowref.classList.add("row");
        this.containertable.classList.add("containertable");
        this.childdiv.classList.add("childDiv")
        this.canvaref.classList.add("table");

        this.ctxheaders = this.headerref.getContext("2d");
        this.ctx = this.canvaref.getContext("2d");
        this.ctxrow = this.rowref.getContext("2d");

        div.appendChild(this.containerdiv);
        this.containertable.appendChild(this.childdiv);
        this.childdiv.appendChild(this.canvaref);
        this.containerdiv.appendChild(this.btn);
        this.containerdiv.appendChild(this.headerref);
        this.containerdiv.appendChild(this.rowref);
        this.containerdiv.appendChild(this.containertable);
        
        this.canvasize();
        this.headers();
        this.rows();
        this.table();

        this.containerdiv.addEventListener("scrollend",(e)=>{
            console.log("scroll");
            this.checkcolumn();
            this.checkrow();
            this.headers();
            this.table();
            this.rows();
        })

        this.canvaref.addEventListener("click",(e)=>{
            console.log(e.offsetX,e.offsetY);
            let xcord;
            let colposition =0;
            let rowposition =0;
            let off = e.offsetX;
            for (xcord = 0; xcord < this.columnsize.length; xcord++) {
                // console.log("xcord",this.containerdiv.scrollLeft);
                if (off + this.containerdiv.scrollLeft <= colposition) {
                break;
                // xcord = Math.floor(e.offsetX - columnArr[i]);
                }
                colposition += this.columnsize[xcord]
            }
            let ycord;
            let offy = e.offsetY;
            for(ycord=0;ycord<this.rowsize.length;ycord++){
                if (offy + this.containerdiv.scrollTop <=rowposition){
                    break;
                }
                rowposition += this.rowsize[ycord]
            }
            console.log(colposition,rowposition);
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
        let x = 0;
        // console.log(this.columnsize.length);
        for (let i = 0; i <this.columnsize.length; i++) {
          this.ctxheaders.beginPath();
          this.ctxheaders.save();
          this.ctxheaders.rect(x, 0, this.columnsize[i], this.rowHeight); //x position y position width height
          this.ctxheaders.clip();
          this.ctxheaders.fillStyle = "black";
          this.ctxheaders.font = `bold ${15}px Arial`;
        //   this.ctxheaders.fillText(this.dataColumns[i].toUpperCase(), x + 4, this.rowHeight - 5);
        this.ctxheaders.fillText(sheet.headerdata(i), x + 4,this.rowHeight - 5);
          this.ctxheaders.restore();
          this.ctxheaders.moveTo(this.columnsize[i] + x, 0);
          this.ctxheaders.lineTo(this.columnsize[i] + x, this.canvaref.height);
          this.ctxheaders.strokeStyle="#00000055";
          this.ctxheaders.stroke();
          x += this.columnsize[i];
        }
        this.ctxheaders.restore();
        
    }
    //numbering on rows
    rows(){
        this.ctxrow.save();
        this.ctxrow.clearRect(0, 0, this.rowref.width, this.rowref.height);
        this.ctxrow.setTransform(1, 0, 0, 1, 0, 0);
        this.ctxrow.translate(0, -this.containerdiv.scrollTop)
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
    }
    //cell data
    table(){
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
            this.ctx.moveTo(sum, 0);
            this.ctx.lineTo(sum, this.canvaref.height);
            this.ctx.strokeStyle="#00000055";
            this.ctx.stroke();
            this.ctx.font = `${15}px Arial`;
            this.ctx.fillStyle = "black";
            // console.log(data[j][this.dataColumns[i]]);
            // this.ctx.fillText(data[j][this.dataColumns[i]], sum + 4, (j + 1) * this.rowHeight - 5);
            this.ctx.restore();
        }
        colcount+=1;
        console.log(count);
        sum += this.columnsize[i];
        }
        console.log(colcount);
    }

    //for column scroll
    checkcolumn(e){
        let stat = (this.containerdiv.scrollWidth - this.containerdiv.clientWidth - this.containerdiv.scrollLeft > 14 ? false : true)
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
    
}