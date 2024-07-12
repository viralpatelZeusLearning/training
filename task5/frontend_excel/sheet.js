let data = await fetch("./tempData.json")
data = await data.json();
console.log(data);

export class sheet{
    columnArr = [180, 120, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 150, 100];
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
    file = null;
    columnWidth = 100;
    rowHeight = 30;
    selectedCell = null;
    starting ;
    ending ;
    dashOffset = 0;
    marchloop = null;
    constructor(div){
        this.btn = document.createElement("button");
        this.headerref = document.createElement("canvas");
        this.rowref = document.createElement("canvas");
        this.container = document.createElement("div");
        this.canvaref  = document.createElement("canvas");

        this.btn.classList.add("btn");
        this.headerref.classList.add("header");
        this.rowref.classList.add("row");
        this.container.classList.add("container");
        this.canvaref.classList.add("table");

        this.ctxheaders = this.headerref.getContext("2d");
        this.ctx = this.canvaref.getContext("2d");
        this.ctxrow = this.rowref.getContext("2d");

        this.canvasize();
        this.headers();
        this.rows();
        this.table();

        this.container.appendChild(this.canvaref);
        div.appendChild(this.btn);
        div.appendChild(this.headerref);
        div.appendChild(this.rowref);
        div.appendChild(this.container);
    }
    canvasize(){
        this.headerref.width = Math.max( this.columnArr.reduce((prev, curr) => prev + curr, 0), window.innerWidth );
        this.headerref.height = this.rowHeight;

        this.canvaref.width = Math.max(this.columnArr.reduce((prev, curr) => prev + curr, 0), window.innerWidth);
        this.canvaref.height = (data.length ) * this.rowHeight;

        this.rowref.width=30
        this.rowref.height = (data.length)*this.rowHeight
    }
    headers() {
        this.ctxheaders.save();
        this.ctxheaders.clearRect(0, 0, this.canvaref.width, this.canvaref.height);
        let x = 0;
        for (let i = 0; i <this.columnArr.length; i++) {
          this.ctxheaders.beginPath();
          this.ctxheaders.save();
          this.ctxheaders.rect(x, 0, this.columnArr[i], this.rowHeight); //x position y position width height
          this.ctxheaders.clip();
          this.ctxheaders.fillStyle = "black";
          this.ctxheaders.font = `bold ${15}px Arial`;
          this.ctxheaders.fillText(this.dataColumns[i].toUpperCase(), x + 4, this.rowHeight - 5);
          this.ctxheaders.restore();
          this.ctxheaders.moveTo(this.columnArr[i] + x, 0);
          this.ctxheaders.lineTo(this.columnArr[i] + x, this.canvaref.height);
          this.ctxheaders.strokeStyle="#00000055";
          this.ctxheaders.stroke();
          x += this.columnArr[i];
        }
        this.ctxheaders.restore();
        
    }
    rows(){
        this.ctxrow.save();
        this.ctxrow.clearRect(0, 0, this.rowref.width, this.rowref.height);
        for(let i= 1;i<=data.length;i++){
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
    table(){
    //cell data
    var sum = 0;
    for (let i = 0; i < this.dataColumns.length; i++) {
        for (let j = 0; j < data.length; j++) {
        // console.log(i,j,rows[j][dataColumns[i]]);
        this.ctx.beginPath();
        this.ctx.save();
        this.ctx.rect(sum, j * this.rowHeight, this.columnArr[i], this.rowHeight);
        this.ctx.clip();
        this.ctx.font = `${15}px Arial`;
        this.ctx.fillStyle = "black";
        this.ctx.fillText(data[j][this.dataColumns[i]], sum + 4, (j + 1) * this.rowHeight - 5);
        this.ctx.moveTo(sum, 0);
        this.ctx.lineTo(sum, this.canvaref.height);
        this.ctx.strokeStyle="#00000055";
        this.ctx.stroke();
        this.ctx.restore();
    }
    sum += this.columnArr[i];
    }
    
}
}