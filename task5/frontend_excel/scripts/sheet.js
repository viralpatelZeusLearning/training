import { Graphcomponent } from "./graph.js";

// let data = await fetch("./tempData.json")
// data = await data.json();
// data = window.localStorage.getItem("data") ? JSON.parse(window.localStorage.getItem("data")) : data
// console.log(data);

export class Sheet{
    /**
     * @type {HTMLElement} -Parent and Top most div
     */
    containerdiv
    /**
     * @type {HTMLCanvasElement} -header canvas
     */
    headerref
    /**
     * @type {HTMLCanvasElement} - row canvas
     */
    rowref
    /**
     * @type {HTMLCanvasElement} - table canvas
     */
    canvaref
    /**
     * @type {HTMLElement} -Top most div of table canvas
     */
    containertable
    /**
     * @type {HTMLElement} - parent element of an table canvas
     */
    childdiv
    /**
     * @type {HTMLElement} - parent element of an input element
     */
    inputdiv
    /**
     * @type {HTMLFormElement} - form for the find and replace boc
     */
    findDiv
    /**
     * @type {Object}
     */
    data
    // columnArr = [180, 120, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 150, 100];
    /**
     * @type {Array <Number>} - array of columns size
     */
    columnsize= Array(20).fill(100);
    /**
     * sheet id is the file id to store and search
     * @type {string}
    */
    sheetId
    /**
     * page no is for the pagination and the data to load
     * @type {number}
     */
    pageNumber
    /**
     * page size is no of data to load
     * @type {number}
     */
    PageSize
    /**
     * @type {Array <Number>} - array of row sizes
     */
    rowsize=Array(this.PageSize).fill(30);
    /**
     * some default configs
     */
    config={
        fontSize:15,
        fontStyle:"Segoe UI",
        rowHeight : 30,
        rowWidth : 50,
        rowlimit : 1048576,
        collimit : 16383,
        dashOffset : 0,
        prevValue:"",
        // drawgraph:null,
        countFind : 0,
        /**
         * @type {[[Number,Number]]} - stores row and column of data that is present
         */
        findarr :[],
    }
    /**
     * @type {(null | Number)} - to check the marchants
     */
    marchloop = null;
    /**@type {{col:Number , row:Number , columnstart:Number , rowstart:Number}} */
    selectedcell= {col:0,row:0,columnstart:0,rowstart:0};
    /**
     * @type {(null|{col:Number , row:Number , columnstart:Number , rowstart:Number})} - col,row are index and columnstart and rowstart are pixel values*/
    starting  = {col:0,row:0,columnstart:0,rowstart:0};
    /**@type {(null|{col:Number , row:Number , columnstart:Number , rowstart:Number})} - col,row are index and columnstart and rowstart are pixel values*/
    ending = {col:0,row:0,columnstart:0,rowstart:0};
    //constructor(div)
    constructor(SheetId){
        // this.columnsize = window.localStorage.getItem("column") ? JSON.parse(window.localStorage.getItem("column")) : Array(10).fill(100)
        // this.rowsize = window.localStorage.getItem("rows") ? JSON.parse(window.localStorage.getItem("rows")) : Array(25).fill(30)
        // this.data = JSON.parse(JSON.stringify(data));
        this.data = {}
        this.sheetId = SheetId
        this.pageNumber = 0
        this.PageSize = 1000
        this.keyList = ["email_id","name","country","state","city","telephone_no","address_line_1","address_line_2","date_of_birth","fy_2019_20","fy_2020_21","fy_2021_22","fy_2022_23","fy_2023_24"]
        // let rowslimit = Object.keys(this.data)
        // this.rowsize = Array(Math.max(rowslimit[rowslimit.length-1],2e5)+1).fill(30)
        // this.rowsize=Array(1e5).fill(30)
        this.rowsize = Array(40).fill(30)
        this.pagiantedandSheet = document.createElement("div");
        this.pagiantedandSheet.classList.add("paginatedandSheetdiv");
        this.pagination = document.createElement("div");
        this.pagination.classList.add("pagination");
        this.containerdiv = document.createElement("div");
        this.btn = document.createElement("div");
        this.btn.setAttribute("data-dot","")
        this.headerref = document.createElement("canvas");
        this.rowref = document.createElement("canvas");
        this.containertable = document.createElement("div");
        this.childdiv = document.createElement("div");
        this.inputdiv = document.createElement("div");
        this.inputdiv.innerHTML = "<input type='text'>"
        // this.inputtext = document.createElement("input");
        // this.graphdiv = document.createElement("div");
        // this.graphref = document.createElement("canvas")
        this.canvaref  = document.createElement("canvas");
        
        
        this.containerdiv.classList.add("containerDiv");
        this.btn.classList.add("btn");
        this.headerref.classList.add("header");
        this.rowref.classList.add("row");
        this.containertable.classList.add("containertable");
        this.childdiv.classList.add("childDiv");
        this.inputdiv.classList.add("inputDiv");
        // this.inputtext.classList.add("textinput")
        // this.graphdiv.classList.add("graphdiv");
        this.canvaref.classList.add("table");
        // this.graphref.classList.add("graphref");
        
        this.ctxheaders = this.headerref.getContext("2d");
        this.ctx = this.canvaref.getContext("2d");
        this.ctxrow = this.rowref.getContext("2d");
        
        // div.appendChild(this.containerdiv);
        this.pagiantedandSheet.appendChild(this.containerdiv);
        this.pagiantedandSheet.appendChild(this.pagination);
        this.childdiv.appendChild(this.canvaref);
        this.containerdiv.appendChild(this.btn);
        this.containerdiv.appendChild(this.headerref);
        this.containerdiv.appendChild(this.rowref);
        this.containerdiv.appendChild(this.containertable);
        this.containertable.appendChild(this.childdiv);
        this.childdiv.appendChild(this.inputdiv);
        // this.childdiv.appendChild(this.graphdiv);
        // this.graphdiv.appendChild(this.graphref)
        
        this.childdiv.appendChild(this.findandReplaceForm())
        // this.inputdiv.appendChild(this.inputtext)
        
        this.canvasize();
        this.headers();
        this.rows();
        this.table();
        this.CreateCache();
        window.addEventListener("resize",()=>{
            this.CreateCache();
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
        this.containerdiv.addEventListener("scroll",()=>{
            // console.log("scroll");
            document.activeElement.blur();
            this.CreateCache();
            this.lazyLoadPage();
            this.checkcolumn();
            this.checkrow();
            this.canvasize();
            this.headers();
            if (!this.marchloop){
                this.table();
            }
            this.rows();
        })
    
        // this.canvaref.addEventListener("click",(e)=>{
        //     this.handleclick(e);
        //     this.headers();
        //     this.rows();
        //     if (!this.marchloop){
        //         this.table();
        //     }
        // })
    
        this.canvaref.addEventListener("pointerdown",(e)=>{
            this.handlemouseDown(e);
            this.canvapointerclick(e);
            this.headers();
            this.rows();
            if (!this.marchloop){
                this.table();
            }
        })
        
        this.inputdiv.querySelector("input").addEventListener("keyup",(e)=>{
            this.handleKeyInputEnter(e)
            
        })
        // this.inputdiv.querySelector("input").addEventListener("blur",(e)=>{
        //     this.InputblurHandler(e)
            
        // })
        this.canvaref.addEventListener("dblclick",(e)=>{
            this.editfeild(e);
        })
    
        this.headerref.addEventListener("pointerdown",(e)=>{
            this.changesize(e);
        })
    
        this.headerref.addEventListener("pointermove",
            this.moveheader
        )
    
        this.rowref.addEventListener("pointermove",
            this.moverow
        )
    
        this.rowref.addEventListener("pointerdown",(e)=>{
            this.changerowsize(e);
        })
    
        this.headerref.addEventListener("dblclick",(e)=>{
            this.headerclick(e);
        })
        
        this.findDiv.addEventListener("submit",(e)=>{
            e.preventDefault()
        })

        window.addEventListener("keydown",(e)=>{
            // console.log(e.target);
            if (e.target.nodeName != "BODY"){return}
            if (!this.containerdiv.parentElement){return}
            this.keyhandler(e);
            this.headers();
        })

        
        this.loadData(SheetId);
        // this.PaginationModel()
    }
    /**
     * to delete entire rows from db api
     * @param {Array} EmId -array of email id to delete multiple rows
     */
    deleteSingleRow(EmId){
        // console.log("inside delete",EmId);
        // let M = EmId.map(e=>`&EmailId=${e}`).join('')
        // console.log(`/api/Main?${M}&SheetId=${this.sheetId}`);
        fetch(`/api/Main?SheetId=${this.sheetId}`,
        {method : "DELETE", headers:{"Content-Type":"application/json"},body:JSON.stringify(EmId)})
        .then(response => {
            console.log(response);
            Object.keys(this.data).filter(x=>Number(x) >= (this.pageNumber>0 ? this.pageNumber-1 : 0)*this.PageSize).forEach(x=> delete this.data[x])
            this.loadData(this.sheetId,this.pageNumber)
            if (this.pageNumber>=0) this.loadData(this.sheetId,this.pageNumber-1)
        })
        // await this.loadData(this.sheetId,this.pageNumber)
    }
    /**
     * to fetch data from db
     * @param {string} sheetId - file id to fetch
     * @param {number} page_no - pagination no to get
     * @returns 
     */
    async FetchDatafromDb(sheetId , page_no=0){
        // sheetId="dtchdkf5.w2z.csv"
        // console.log("in fetching func");
        let columnmap = new Map()
        columnmap.set("email_id",0);
        columnmap.set("name",1);
        columnmap.set("country",2);
        columnmap.set("state",3);
        columnmap.set("city",4);
        columnmap.set("telephone_no",5);
        columnmap.set("address_line_1",6);
        columnmap.set("address_line_2",7);
        columnmap.set("date_of_birth",8);
        columnmap.set("fy_2019_20",9);
        columnmap.set("fy_2020_21",10);
        columnmap.set("fy_2021_22",11);
        columnmap.set("fy_2022_23",12);
        columnmap.set("fy_2023_24",13);
        
        let v = await fetch(`/api/Main/${sheetId}?page_no=${page_no}`)
        let mainData = await v.json()
        // console.log(mainData);
        let parsedData = {}
        try{
            for(let i=0;i<mainData.data.length;i++){
                parsedData[i] = {}
                Object.keys(mainData.data[i]).forEach(j=>{
                    if (columnmap.get(j.toLowerCase())!= undefined){
                        parsedData[i][columnmap.get(j.toLowerCase())] = {}
                        parsedData[i][columnmap.get(j.toLowerCase())]["text"] = mainData.data[i][j]; 
                    }
                    else if (j.toLowerCase() == "row_id"){
                        parsedData[i]["row_id"] = mainData.data[i][j]
                    }
                })
            }
            if (this.rowsize.length < mainData.count){
                this.rowsize = Array(mainData.count).fill(30)
            }
            // console.log(parsedData);
        }
        catch{
            console.log("No Data");
        }
        return parsedData;
    }
    /**
     * To Load Sheet Data
     * @param {string} SheetId - file id 
     * @param {number} page_no - pagination no
     */
    async loadData(SheetId , page_no=0){
        let newData = await this.FetchDatafromDb(SheetId , page_no);
        let currRow = page_no * this.PageSize
        Object.keys(newData).forEach((element,index) => {
            this.data[currRow+index] = newData[element]
        });
        // this.data = await this.FetchDatafromDb(SheetId,page_no)
        this.canvasize();
        this.headers();
        this.rows();
        this.table();
        this.CreateCache();
    }
    /**
     * to move to next page , prev page and random page
     */
    PaginationModel(){
        let prevBtn = document.createElement("button")
        prevBtn.textContent="Prev"
        let nxtBtn = document.createElement("button")
        nxtBtn.textContent="Next"
        let moveTo = document.createElement("input")
        moveTo.value=0
        let goToPrev = ()=>{
            let currval = Number(moveTo.value)-1
            console.log(currval);
            if (currval>=0){
                this.loadData(this.sheetId,currval)
                moveTo.value=currval
                this.pageNumber = currval
            }
        }
        let goToNxt = () =>{
            let currval = Number(moveTo.value)+1
            console.log(currval)
            this.loadData(this.sheetId,currval)
            moveTo.value=currval
            this.pageNumber = currval
        }
        let moveToValue = (e) => {
            if (e.key == "Enter"){
                if (isNaN(Number(moveTo.value))){
                    moveTo.value = 0;
                    this.loadData(this.sheetId,moveTo.value);
                    this.pageNumber = Number(moveTo.value)
                }
                else{
                    // moveTo.value = e.target.value;
                    this.loadData(this.sheetId,Number(moveTo.value));
                    this.pageNumber = Number(moveTo.value)
                }
            }
        }
        prevBtn.addEventListener("click",goToPrev)
        nxtBtn.addEventListener("click",goToNxt)
        moveTo.addEventListener("keydown",moveToValue)
        this.pagination.appendChild(prevBtn)
        this.pagination.appendChild(moveTo)
        this.pagination.appendChild(nxtBtn)
    }
    /**
     * Lazy loading current page 
     */
    lazyLoadPage(){
        // let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclickCache(e)
        let currCenterRow = this.handleclickCache({offsetX:0, offsetY: this.containerdiv.clientHeight}).ycordinate
        let pgNo = Math.floor(currCenterRow/this.PageSize)
        // console.clear();
        console.log(pgNo)
        if(this.pageNumber>pgNo){
            //load previous page
            console.log("load previous page", pgNo)
            this.loadData(this.sheetId,pgNo)
            this.loadData(this.sheetId, pgNo-1 >=0 ? pgNo-1 : 0)
            .then(()=>{
                Object.keys(this.data).filter(x=>Number(x) >= (pgNo+1)*this.PageSize && (Number(x) > Math.max(this.starting.row,this.ending.row) || Number(x) < Math.min(this.starting.row,this.ending.row))).forEach(x=>delete this.data[x])
            })
        }
        else if(this.pageNumber<pgNo){
            // load next page
            console.log("load next page", pgNo)
            this.loadData(this.sheetId, pgNo-1)
            this.loadData(this.sheetId, pgNo)
            .then(()=>{
                // console.log((this.pageNumber-1)*this.PageSize)
                Object.keys(this.data).filter(x => Number(x) < (this.pageNumber-1)*this.PageSize && (Number(x) > Math.max(this.starting.row,this.ending.row) || Number(x) < Math.min(this.starting.row,this.ending.row))).forEach(x=>delete this.data[x])
            })
        }
        this.pageNumber = pgNo
    }
    /**
     * load next page
     */
    LoadNextpg(){
        if(this.data[this.pageNumber*this.PageSize]!=undefined){
            this.pageNumber++;
            this.loadData(this.sheetId, this.pageNumber);
            console.log(this.data[this.pageNumber*this.PageSize])
            console.log("loaded next page", this.pageNumber)
            this.rowsize = this.rowsize.concat(Array(this.PageSize).fill(this.config.rowHeight))
        }
    }
    /**
     * To calculate the height and width of all 3 canvas 
     */
    canvasize(){
    
        // this.childdiv.style.width = Math.max(this.columnsize.reduce((prev, curr) => prev + curr, 0), window.innerWidth) +"px";
        this.childdiv.style.width = this.columnsize.reduce((prev, curr) => prev + curr, 0) + "px";
        this.childdiv.style.height = (this.rowsize.length ) * this.config.rowHeight +"px";
        // console.log(this.containertable.parentElement.clientHeight, this.containertable.parentElement.clientWidth);
        // this.canvaref.width = Math.max(this.columnsize.reduce((prev, curr) => prev + curr, 0), window.innerWidth);
        // this.canvaref.height = (this.rowsize.length ) * this.rowHeight;
        this.canvaref.width = (this.containerdiv.clientWidth - this.config.rowWidth)*window.devicePixelRatio ;
        this.canvaref.height = (this.containerdiv.clientHeight - this.config.rowHeight)*window.devicePixelRatio ;
    
        this.headerref.width = this.canvaref.width 
        this.headerref.height = this.config.rowHeight * window.devicePixelRatio;
    
        this.rowref.width=this.config.rowWidth * window.devicePixelRatio;
        this.rowref.height = this.canvaref.height ;
        // this.rowref.height = this.rowsize

        let {width} = this.headerref.getBoundingClientRect()
        let {height} = this.rowref.getBoundingClientRect()
        this.canvaref.style.width =`${width}px`
        this.canvaref.style.height = `${height}px` 
    }
    /**
     * Function to convert column Index to Column Name
     * @param {Number} n - Number to conver it to an char 
     * @returns - provides the char in string format
     */
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
    /**
     * Header canvas renderer function
     */
    headers() {
        this.ctxheaders.save();
        this.ctxheaders.setTransform(1, 0, 0, 1, 0, 0);
        this.ctxheaders.clearRect(0, 0, this.canvaref.width, this.canvaref.height);
        this.ctxheaders.scale(window.devicePixelRatio,window.devicePixelRatio)
        this.ctxheaders.translate(-this.containerdiv.scrollLeft, 0)
        let {columnstart ,  xcordinate } = this.firstCellCache ? this.firstCellCache : this.handleclick({offsetX:0 , offsetY:0})
        let sumcol = columnstart
        for (let i = xcordinate; sumcol<=(this.containerdiv.clientWidth + this.containerdiv.scrollLeft) && i<this.columnsize.length; i++) {
            this.ctxheaders.save();
            this.ctxheaders.beginPath();
            this.ctxheaders.rect(sumcol-0.5, 0, this.columnsize[i], this.config.rowHeight); //x position y position width height
            this.ctxheaders.strokeStyle="#cbd5d0";
            this.ctxheaders.stroke();
            if (this.starting && this.ending && 
                Math.min(this.starting.col, this.ending.col) <= i && 
                i <= Math.max(this.starting.col, this.ending.col)){ 
                if (this.ending.rowstart == Infinity){
                    this.ctxheaders.save();
                    this.ctxheaders.fillStyle="#107c41";
                    this.ctxheaders.fill();
                }
                else{
                    this.ctxheaders.save();
                    this.ctxheaders.fillStyle="#caead8";
                    this.ctxheaders.fill();
                }
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
            this.ctxheaders.font = ` ${this.config.fontSize}px ${this.config.fontStyle}`;
          //   this.ctxheaders.fillText(this.dataColumns[i].toUpperCase(), x + 4, this.rowHeight - 5);
            this.ctxheaders.textAlign="center";
            this.ctxheaders.fillText(this.keyList[i] ? this.keyList[i] : Sheet.headerdata(i), sumcol + (this.columnsize[i]/2) - 5,this.config.rowHeight - 5);
            this.ctxheaders.restore();
            sumcol += this.columnsize[i];
          }
          
          if (this.starting && this.ending){
            this.ctxheaders.save()
            let [x,,w,] = this.marchants()
            let startpixel = Math.max(this.containerdiv.scrollLeft,x)
            let newwidth = Math.min(this.containerdiv.clientWidth, x>this.containerdiv.scrollLeft ? w : w-this.containerdiv.scrollLeft+x)
                // console.log(x,w);
            this.ctxheaders.beginPath();
            if (startpixel<this.containerdiv.scrollLeft+this.containerdiv.clientWidth && newwidth>0){
                // console.log("drawing");
                this.ctxheaders.moveTo(startpixel-1.5,this.config.rowHeight);
                this.ctxheaders.lineTo(startpixel+newwidth+0.5,this.config.rowHeight);
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
    /**
     * Row canvas renderer function
     */
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
        //     this.ctxrow.font =`bold ${15}px Segoe UI`;
        //     this.ctxrow.textAlign="right";
        //     this.ctxrow.fillText(i,this.rowref.width-4,i*this.rowHeight-4)
        //     this.ctxrow.restore();
        //     this.ctxrow.moveTo(0,i*this.rowHeight);
        //     this.ctxrow.lineTo(0,this.rowref.width);
        //     this.ctxrow.strokeStyle="00000055";
        //     this.ctxrow.stroke();
        // }
        // this.ctxrow.restore();
        let { rowstart  , ycordinate} = this.firstCellCache ? this.firstCellCache : this.handleclick({offsetX:0 , offsetY:0})
        for(let i=ycordinate; rowstart<=(this.containerdiv.clientHeight + this.containerdiv.scrollTop);i++){
            this.ctxrow.save();
            this.ctxrow.beginPath();
            this.ctxrow.rect(0,rowstart-0.5,this.config.rowWidth,this.rowsize[i]);
            this.ctxrow.strokeStyle="#cbd5d0";
            this.ctxrow.lineWidth=1
            this.ctxrow.stroke();
            if (this.starting && this.ending && 
                Math.min(this.starting.row, this.ending.row) <= i && 
                i <= Math.max(this.starting.row, this.ending.row) ){
                    if (this.ending.columnstart == Infinity){
                        this.ctxrow.save();
                        this.ctxrow.fillStyle="#107c41";
                        this.ctxrow.fill();
                    }
                    else{
                        this.ctxrow.save();
                        this.ctxrow.fillStyle="#caead8";
                        this.ctxrow.fill()
                    }
                // await new Promise(r=>setTimeout(r,100))
            }
            this.ctxrow.fillStyle="black";
            this.ctxrow.font =` ${this.config.fontSize}px ${this.config.fontStyle}`;
            this.ctxrow.textAlign="right";
            this.ctxrow.fillText( i,this.config.rowWidth-4,this.rowsize[i]+rowstart -5)
            // this.ctxrow.fillText(this.pageNumber * this.PageSize + i,this.config.rowWidth-4,this.rowsize[i]+rowstart -5)
            this.ctxrow.restore();
            rowstart += this.rowsize[i];
        }
        if (this.starting && this.ending){
            this.ctxrow.save()
            let [,y,,h] = this.marchants()
            let startrowpixel = Math.max(this.containerdiv.scrollTop,y)
            let newHeight = Math.min(this.containerdiv.clientHeight,y>this.containerdiv.scrollTop ? h : h-this.containerdiv.scrollTop +y)
            this.ctxrow.beginPath();
            if (startrowpixel<this.containerdiv.scrollTop+this.containerdiv.clientHeight && newHeight>0){
                // console.log("drawing");
                this.ctxrow.moveTo(this.config.rowWidth,startrowpixel-2);
                this.ctxrow.lineTo(this.config.rowWidth,startrowpixel+newHeight);
            }
                // this.ctxrow.moveTo(this.rowHeight,y-2);
                // this.ctxrow.lineTo(this.rowHeight,y+h);
            this.ctxrow.lineWidth=4;
            this.ctxrow.strokeStyle="#107c41";
            this.ctxrow.stroke();
            this.ctxrow.restore();
        }
        
    }
    //cell data all excel
    /**
     * Table canvas renderer function
     */
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
        //     this.ctx.font = `${15}px Segoe UI`;
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
        
        let {columnstart , rowstart , xcordinate , ycordinate} = this.firstCellCache ? this.firstCellCache : this.handleclick({offsetX:0 , offsetY:0})
        let colstart =  columnstart;
        for (let i= xcordinate; colstart< (this.containerdiv.clientWidth+this.containerdiv.scrollLeft);i++){
            let rowsend = rowstart;
            for(let j=ycordinate; rowsend< (this.containerdiv.clientHeight+this.containerdiv.scrollTop);j++){
                this.ctx.beginPath();
                this.ctx.save();
                this.ctx.rect(colstart-0.5,rowsend-0.5,this.columnsize[i],this.rowsize[j]);
                this.ctx.clip();
                // console.log(i,j,"drawing");
                // this.ctx.fillText(!this.data[j] || !this.data[j][i] ? " ": this.data[j][i].text ,rowsend + 4, (j + 1) * this.rowsize[j] - 5);
                // console.log(data[j][i]);
                // console.log(i,j,data[j]?data[j][i]:"nope");
                // console.log(rowsend+5 , colstart+this.rowsize[i]-5);
                // this.ctx.fillText(data[j] && data[j][i] ? data[j][i].text : " " , colstart + 5, rowsend + this.rowsize[i] - 5)
                if (this.selectedcell && this.selectedcell.col == i && this.selectedcell.row == j){
                    this.ctx.strokeStyle = "#107c41"
                    this.ctx.lineWidth = 2
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
                    this.ctx.font = `${this.config.fontSize}px ${this.config.fontStyle}`;
                    let base = 0
                    for(let v of this.data[j][i].wrappedarr.slice().reverse()){
                        this.ctx.fillText(v, colstart+5 , rowsend-base+this.rowsize[j])
                        base+=this.config.fontSize
                    }
                }
                else{
                    this.ctx.fillStyle = "black";
                    this.ctx.font = `${this.config.fontSize}px ${this.config.fontStyle}`;
                    this.ctx.fillText(this.data[j] && this.data[j][i]?.text ? this.data[j][i].text : " " , colstart + 5, rowsend + this.rowsize[j] - 5)
                }
                // this.ctx.strokeStyle="#cbd5d0";
                // this.ctx.stroke();
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
        let sumColSizes=columnstart;
        for(let c=xcordinate; sumColSizes<=(this.containerdiv.scrollLeft+this.containerdiv.clientWidth) && c<this.columnsize.length; c++){
            // console.log("col");
            this.ctx.beginPath();
            this.ctx.save();
            this.ctx.moveTo(sumColSizes+this.columnsize[c] - 0.5, this.containerdiv.scrollTop);
            this.ctx.lineTo(sumColSizes+this.columnsize[c] - 0.5, this.canvaref.height/window.devicePixelRatio+this.containerdiv.scrollTop);
            this.ctx.strokeStyle = "#cbd5d0";
            this.ctx.stroke();
            this.ctx.restore();
            sumColSizes+=this.columnsize[c];
        }
        let sumRowsizes=rowstart;
        for(let r=ycordinate; sumRowsizes<=(this.containerdiv.scrollTop+this.containerdiv.clientHeight) && r<this.rowsize.length;r++){
            // console.log("row");
            this.ctx.beginPath();
            this.ctx.save();
            this.ctx.moveTo(this.containerdiv.scrollLeft, sumRowsizes+this.rowsize[r] - 0.5);
            this.ctx.lineTo(this.canvaref.width/window.devicePixelRatio + this.containerdiv.scrollLeft, sumRowsizes+this.rowsize[r] - 0.5);
            this.ctx.strokeStyle = "#cbd5d0";
            this.ctx.stroke();
            this.ctx.restore();
            sumRowsizes+=this.rowsize[r];
        }
        // this.columnsize.reduce((prev,curr)=>{
        //     this.ctx.beginPath();
        //     this.ctx.save();
        //     this.ctx.moveTo(prev + curr - 0.5, this.containerdiv.scrollTop);
        //     this.ctx.lineTo(prev + curr - 0.5, this.canvaref.height/window.devicePixelRatio+this.containerdiv.scrollTop);
        //     this.ctx.strokeStyle = "#cbd5d0";
        //     this.ctx.stroke();
        //     this.ctx.restore();
        //     return prev + curr;
        // },0)

        // this.rowsize.reduce((prev,curr)=>{
        //     this.ctx.beginPath();
        //     this.ctx.save();
        //     this.ctx.moveTo(this.containerdiv.scrollLeft, prev + curr - 0.5);
        //     this.ctx.lineTo(this.canvaref.width/window.devicePixelRatio + this.containerdiv.scrollLeft, prev + curr - 0.5);
        //     this.ctx.strokeStyle = "#cbd5d0";
        //     this.ctx.stroke();
        //     this.ctx.restore();
        //     return prev + curr;
        // },0)
        if(this.starting && this.ending ){
            let [x,y,w,h] = this.marchants()
            // console.log("drawing box",x,y,w,h);
            let startpixel = Math.max(this.containerdiv.scrollLeft  , x)
            let startrowpixel = Math.max(this.containerdiv.scrollTop , y)
            let newwidth = Math.min(this.containerdiv.clientWidth, x>this.containerdiv.scrollLeft ? w : w-this.containerdiv.scrollLeft+x)
            let newHeight = Math.min(this.containerdiv.clientHeight,y>this.containerdiv.scrollTop ? h : h-this.containerdiv.scrollTop +y)
            // if (isNaN(newHeight)){debugger}
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.strokeStyle = "#107c41"
            this.ctx.lineWidth = 2
            if(this.config.dashOffset!=0){
                this.ctx.setLineDash([4, 4]);
                this.ctx.lineDashOffset = this.config.dashOffset;
                this.config.dashOffset+=1;
                if(this.config.dashOffset>8){this.config.dashOffset=1;}
                this.marchloop=window.requestAnimationFrame(()=>{
                    this.table();
                    // this.marchants();
                });                        
            }
            if (newwidth>0 && newHeight>0 && startpixel<this.containerdiv.scrollLeft+this.containerdiv.clientWidth && startrowpixel<this.containerdiv.scrollTop+this.containerdiv.clientHeight){
                // console.log(newwidth>0 && newHeight>0 && startpixel<this.containerdiv.scrollLeft+this.containerdiv.clientWidth && startrowpixel<this.containerdiv.scrollTop+this.containerdiv.clientHeight);
                this.ctx.strokeRect(startpixel-0.5,startrowpixel-0.5,newwidth-0.5,newHeight-1);
            }
            
            this.ctx.restore();
        }
    }
    
    //for column scroll
    /**
     * Check if scroll left reached till end then add 5 columns of 100px each
     */
    checkcolumn(){
        let stat = (this.containerdiv.scrollWidth - this.containerdiv.clientWidth - this.containerdiv.scrollLeft > 10 ? false : true)
        if (stat){
            // console.log("scrolling");
            // this.columnsize = [...this.columnsize, ...Array(5).fill(100)];
            this.columnsize = this.columnsize.concat(Array(5).fill(100))
            this.canvasize();
            this.headers();
            if (!this.marchloop){
                window.requestAnimationFrame(()=>this.table());
            }
            this.rows();
        }
    }
    //for row scroll
    /**
     * Check if scroll bottom reached end then add 20 rows of 30px 
     */
    checkrow(){
        let stat = (this.containerdiv.scrollHeight - this.containerdiv.clientHeight - this.containerdiv.scrollTop > 25 ? false : true)
        // console.log(stat);
        if (stat){
            // console.log("scrolling",this.lazyLoadPage());
            // this.FetchDatafromDb(this.sheetId,this.pageNumber+=1)
            // .then(scrollData =>{
            //     // let currentPageRow = Math.max(Object.keys(scrollData).length,Object.keys(this.data).length)+1;
            //     let currentPageRow = Object.keys(this.data).length
            //     // console.log(currentPageRow);
            //     Object.keys(scrollData).forEach((key , I)=>{
            //         this.data[currentPageRow + I] = scrollData[key]
            //     })
            // })
            this.LoadNextpg()
            this.rowsize = this.rowsize.concat(Array(this.PageSize).fill(this.config.rowHeight))
            this.canvasize()
            this.rows();
            this.headers();
            if (!this.marchloop){
                window.requestAnimationFrame(()=>this.table());
            }
            // this.rowsize = [...this.rowsize, ...Array(20).fill(30)];
        }
    }
    
    //click function for select cell to get position of selected
    /**
     * To calculate the co-ordinates of clicked cell and pixel values
     * This Event Listner is added on canvas table
     * @param {PointerEvent} e - default event
     * @returns {{columnstart:Number , rowstart:Number , xcordinate:Number , ycordinate:Number}} - x,y index and pixel values from left and top
     */
    handleclick(e){
        // console.log("normal");
        // console.log(e.offsetX,e.offsetY);
        let xcord=0;
        let colposition =0;
        let rowposition =0;
        let off = e.offsetX;    
        for (xcord ; xcord < this.columnsize.length; xcord++) {
            // console.log("xcord",this.containerdiv.scrollLeft);
            if (off + this.containerdiv.scrollLeft <= colposition + this.columnsize[xcord]) {
                break;
            // xcord = Math.floor(e.offsetX - columnArr[i]);
            }
            colposition += this.columnsize[xcord]
            // colposition = colposition / this.columnsize[xcord]
        }
        // console.log(colposition);
        let ycord=0;
        let offy = e.offsetY;
        for(ycord;ycord<this.rowsize.length;ycord++){
            if (offy + this.containerdiv.scrollTop <=rowposition + this.rowsize[ycord]){
                break;
            }
            rowposition += this.rowsize[ycord]
        }
        // console.log(colposition,rowposition , xcord, ycord);
        return {columnstart:colposition,rowstart:rowposition , xcordinate:xcord , ycordinate:ycord}
    }
    /**
     * creating a cache cell
     * to get the cordinats and pixel values of cell from the top of view port
     */
    CreateCache(){
        // console.log("updatind cache");
        let xcord=0;
        let colposition =0;
        let rowposition =0;
        for (xcord ; xcord < this.columnsize.length; xcord++) {
            // console.log("xcord",this.containerdiv.scrollLeft);
            if (this.containerdiv.scrollLeft <= colposition + this.columnsize[xcord]) {
                break;
            // xcord = Math.floor(e.offsetX - columnArr[i]);
            }
            colposition += this.columnsize[xcord]
            // colposition = colposition / this.columnsize[xcord]
        }
        // console.log(colposition);
        let ycord=0;
        for(ycord;ycord<this.rowsize.length;ycord++){
            if (this.containerdiv.scrollTop <=rowposition + this.rowsize[ycord]){
                break;
            }
            rowposition += this.rowsize[ycord]
        }
        this.firstCellCache = {xcordinate:xcord,ycordinate:ycord,columnstart:colposition,rowstart:rowposition}
        // console.log(this.firstCellCache);
    }
    /**
     * To calculate the cell position from the top of view port 
     */
    handleclickCache(e){
        
        let xcord=this.firstCellCache.xcordinate;
        let ycord=this.firstCellCache.ycordinate;
        let colposition =this.firstCellCache.columnstart;
        let rowposition =this.firstCellCache.rowstart;
        let off = e.offsetX;    
        for (xcord ; xcord < this.columnsize.length; xcord++) {
            // console.log("xcord",this.containerdiv.scrollLeft);
            if (off + this.containerdiv.scrollLeft <= colposition + this.columnsize[xcord]) {
                break;
            // xcord = Math.floor(e.offsetX - columnArr[i]);
            }
            colposition += this.columnsize[xcord]
            // colposition = colposition / this.columnsize[xcord]
        }
        // console.log(colposition);
        let offy = e.offsetY;
        for(ycord;ycord<this.rowsize.length;ycord++){
            if (offy + this.containerdiv.scrollTop <=rowposition + this.rowsize[ycord]){
                break;
            }
            rowposition += this.rowsize[ycord]
        }
        return {columnstart:colposition,rowstart:rowposition , xcordinate:xcord , ycordinate:ycord}
    }
    //click selected cell data change and position
    /**
     * To set the selected cell position
     * This Event Listner is added on canvas table
     * @param {PointerEvent} e - default event
     */
    canvapointerclick(e){
        if (e.shiftKey == true){
            this.starting=JSON.parse(JSON.stringify(this.selectedcell))
            let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclickCache(e)
            // console.log(e.target);
            this.ending = {col:xcordinate , row:ycordinate ,columnstart:columnstart,rowstart:rowstart}
        }
        else{
            let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclickCache(e)
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
    /**
     * To call the input feild on double click and set its  value and position
     * This Event Listner is added on canvas table
     */
    editfeild(){
        // console.log("double clk");
        this.config.prevValue = ""
        this.inputdiv.style.display = "block"
        this.inputdiv.style.left=(this.selectedcell.columnstart + this.config.rowWidth)  + "px"
        this.inputdiv.style.top=(this.selectedcell.rowstart + this.config.rowHeight) + "px"
        this.inputdiv.style.width = this.columnsize[this.selectedcell.col]  - 1 + "px"
        this.inputdiv.style.height = this.rowsize[this.selectedcell.row] - 2 + "px"
        let inputref = this.inputdiv.querySelector("input")
        inputref.font= `${this.config.fontSize}px ${this.config.fontStyle}`;
        inputref.value = this.data[this.selectedcell.row] && this.data[this.selectedcell.row][this.selectedcell.col] ? this.data[this.selectedcell.row][this.selectedcell.col]['text'] : "" ; 
        this.config.prevValue = this.data?.[this.selectedcell.row]?.[this.selectedcell.col]?.['text'] || null
        inputref.focus();
        if (!this.marchloop){
            window.requestAnimationFrame(()=>this.table());
        }
    }

    // }
    
    //key Input box enters and escape
    /**
     * To set the input box display , remove and store value
     * This Event Listner is added on Input Box
     * @param {KeyboardEvent} e - default event
     */
    handleKeyInputEnter(e) {
        if (e.key === "Enter") {
            // this.loadData(this.sheetId,this.pageNumber)
            let newValue = {text:e.target.value};
            // console.log(selectedCell);
            if(this.data[this.selectedcell.row]!=undefined){
                console.log("row exists")
                let del = {}
                del[this.data[this.selectedcell.row][0]["text"]] = {}
                del[this.data[this.selectedcell.row][0]["text"]][this.keyList[this.selectedcell.col]] = e.target.value
                let final = JSON.stringify(del)
                // console.log(final)
                fetch(`/api/Main/Update?SheetId=${this.sheetId}`,
                    {method:"PATCH",headers:{"Content-Type":"application/json"},body:final}
                )
                .then(response =>{
                    if(this.data[this.selectedcell.row][this.selectedcell.col]){
                        this.data[this.selectedcell.row][this.selectedcell.col]['text'] = e.target.value;
                    }
                    else{
                        this.data[this.selectedcell.row][this.selectedcell.col] = newValue;
                    }
                    if (this.data[this.selectedcell.row][this.selectedcell.col].wrap){
                        this.wraptext();
                    }
                    if (!this.marchloop){
                        window.requestAnimationFrame(()=>this.table());
                    }
                    console.log(response);
                })
                .catch(err =>{
                    throw err;
                })
                // console.log(del);
                
                del = {}
                // if (!this.marchloop){
                //     window.requestAnimationFrame(()=>this.table());
                // }
            }
            else {
                console.log("row not exists")

                if (this.selectedcell.col == 0){
                    let newRow = Math.max(...Object.keys(this.data).map(r => Number(r)))
                    let newRowId = this.data[newRow].row_id
                    console.log(newRow , newRowId);
                    let upd = {"email_Id":e.target.value,"sheet_Id":this.sheetId, "row_Id":newRowId+1}
                    // console.log(upd);
                    fetch(`/api/Main/singleRowPost`,
                        {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(upd)}
                    )
                    .then(response =>{
                        console.log(response);
                        if (response.status == 400){
                            window.alert("Enter an valid Email")
                        }
                        Object.keys(this.data).filter(x=>Number(x) >= (this.pageNumber>0 ? this.pageNumber-1 : 0)*this.PageSize).forEach(x=> delete this.data[x])
                        this.loadData(this.sheetId,this.pageNumber)
                        if (this.pageNumber>=0) this.loadData(this.sheetId,this.pageNumber-1)
                        // else{
                        //     let newrow = {}
                        //     this.data[this.selectedcell.row] = newrow;
                        //     this.data[this.selectedcell.row][this.selectedcell.col] = newValue;
                        // }
                    this.loadData(this.sheetId,this.pageNumber)
                    if (!this.marchloop){
                        window.requestAnimationFrame(()=>this.table());
                    }
                })
                .catch(err=>{
                    throw err;
                })
                upd = {}
                // if (!this.marchloop){
                //     window.requestAnimationFrame(()=>this.table());
                // }
            }}
            this.inputdiv.style.display="none";
            // this.find()
            // window.localStorage.setItem("data",JSON.stringify(data))
            // window.localStorage.setItem("column",JSON.stringify(this.columnsize))
            // window.localStorage.setItem("rows",JSON.stringify(this.rowsize))
        }
        else if (e.key === "Escape"){
            this.inputdiv.style.display = "none"
            if (this.config.prevValue == null){
                if (this.data[this.selectedcell.row]){
                    delete this.data[this.selectedcell.row][this.selectedcell.col];
                }
                else{
                    delete this.data[this.selectedcell.row];
                }
            }
            else{
                this.data[this.selectedcell.row][this.selectedcell.col]['text'] = this.config.prevValue?this.config.prevValue:"";
            }
        }
        else{
            // let newValue = {text:e.target.value};
            // if(this.data[this.selectedcell.row]){
            //     if(this.data[this.selectedcell.row][this.selectedcell.col]){
            //         this.data[this.selectedcell.row][this.selectedcell.col]['text'] = e.target.value;
            //     }
            //     else{
            //         this.data[this.selectedcell.row][this.selectedcell.col] = newValue;
            //     }
            // }
            // else{
            //     let newrow = {}
            //     this.data[this.selectedcell.row] = newrow;
            //     this.data[this.selectedcell.row][this.selectedcell.col] = newValue;
            // }
        }
        if (!this.marchloop){
            window.requestAnimationFrame(()=>this.table());
        }
    }
    
    //key handlers
    /**
     * key board events for left, top, bottom ,right ,copy, paste ,find, delete data ,Escape 
     * This Event Listner is added on Window
     * @param {KeyboardEvent} e - default event
     * @returns - If the select is Input Box then return as both can triggered
     */
    keyhandler(e){
        // console.log(this.selectedcell.row,"key pressed");
        // e.preventDefault()
        // if (e.target == this.inputdiv.querySelector("input")){return}
        if (e.key==="ArrowLeft"){
            if (e.shiftKey === true){
                // e.preventDefault()
                // console.log("shift pressed");
                this.starting.col = this.selectedcell.col;
                this.starting.row = this.selectedcell.row;
                if (this.ending === null){
                    this.ending.row = this.selectedcell.row;
                    this.ending.col = this.selectedcell.col;
                }
                else{
                    if (this.ending.col>0){
                        this.ending.col = this.ending.col -1;
                        this.ending.columnstart = this.ending.columnstart - this.columnsize[this.ending.col]
                    }
                    // console.log(this.selectedcell.columnstart);
                    if(this.containerdiv.scrollLeft>this.ending.columnstart){
                        this.containerdiv.scrollTo(this.ending.columnstart,this.containerdiv.scrollTop)
                    }
                    this.marchloop=null
                    // if (!this.marchloop){
                    //     window.requestAnimationFrame(()=>this.table());
                    // }
                    // this.headers();
                }
            }
            else{
                e.preventDefault();
                // this.starting=null;
                this.config.dashOffset=0
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
                    if(this.containerdiv.scrollLeft>this.selectedcell.columnstart - 2*this.columnsize[this.selectedcell.col]){
                        this.containerdiv.scrollTo(this.selectedcell.columnstart,this.containerdiv.scrollTop)
                        // this.CreateCache();
                    }
                    // console.log("left");
                    this.marchloop=null
                    // this.rows()
                }
            }
            this.headers();
            if (!this.marchloop){
                window.requestAnimationFrame(()=>this.table());
            }
        }
        else if (e.key === "ArrowRight"){
            if (this.selectedcell.col == this.columnsize.length-1 || this.ending.col == this.columnsize.lenth-1){return}
            if (e.shiftKey === true){
                // console.log("shift pressed");
                this.starting.col = this.selectedcell.col
                this.starting.row = this.selectedcell.row;
                if (this.ending === null){
                    this.ending.row = this.selectedcell.row;
                    this.ending.col = this.selectedcell.col;
                }
                else{
                    this.ending.col = this.ending.col +1;
                    this.ending.columnstart = this.ending.columnstart + this.columnsize[this.ending.col]
                    // console.log(this.ending.columnstart,this.containerdiv.clientWidth,this.containerdiv.scrollLeft);
                    if(this.containerdiv.scrollLeft+this.containerdiv.clientWidth<this.ending.columnstart+2*this.columnsize[this.ending.col]){
                        this.containerdiv.scrollTo(this.ending.columnstart+2*this.columnsize[this.ending.col]-this.containerdiv.clientWidth,this.containerdiv.scrollTop)
                    }
                    this.marchloop=null
                    if (!this.marchloop){
                        window.requestAnimationFrame(()=>this.table());
                    }
                }
            }
            else{
                this.starting=null;
                e.preventDefault();
                this.config.dashOffset=0
                this.inputdiv.style.display="none";
                this.selectedcell.col = this.selectedcell.col +1;
                this.selectedcell.columnstart = this.selectedcell.columnstart + this.columnsize[this.selectedcell.col]
                // console.log(this.containerdiv.scrollLeft,this.selectedcell.col);
                this.starting=JSON.parse(JSON.stringify(this.selectedcell))
                this.ending=JSON.parse(JSON.stringify(this.selectedcell))
                if(this.selectedcell.columnstart<this.containerdiv.scrollLeft || this.containerdiv.scrollLeft+this.containerdiv.clientWidth<this.selectedcell.columnstart+ 2*this.columnsize[this.selectedcell.col]){
                    this.containerdiv.scrollTo(this.selectedcell.columnstart+2*this.columnsize[this.selectedcell.col]-this.containerdiv.clientWidth,this.containerdiv.scrollTop)
                }
                // else if (this.containerdiv.scrollLeft+this.containerdiv.clientWidth>this.selectedcell.columnstart){
                //     this.containerdiv.scrollTo(this.selectedcell.columnstart+this.containerdiv.clientWidth,this.containerdiv.scrollTop)
                // }
                this.marchloop=null
                if (!this.marchloop){
                    window.requestAnimationFrame(()=>this.table());
                }
                this.headers();
                this.rows()
            } 
        }
        else if(e.key === "ArrowUp"){
            if (e.shiftKey === true){
                // console.log("shift pressed");
                this.starting.col = this.selectedcell.col
                this.starting.row = this.selectedcell.row;
                if (this.ending === null){
                    this.ending.row = this.selectedcell.row;
                    this.ending.col = this.selectedcell.col;
                }
                else{
                    if (this.ending.row>0){
                        this.ending.row = this.ending.row - 1;
                        this.ending.rowstart = this.ending.rowstart - this.rowsize[this.ending.row]
                    }
                    if(this.containerdiv.scrollTop>this.ending.rowstart - this.rowsize[this.ending.row]){
                        // console.log("up");
                        this.containerdiv.scrollTo(this.containerdiv.scrollLeft,this.ending.rowstart)
                    }
                    this.marchloop=null
                    if (!this.marchloop){
                        window.requestAnimationFrame(()=>this.table());
                    }
                }
                this.rows()
                // console.log(this.selectedcell,this.starting,this.ending);
            }
            else{
                e.preventDefault();
                // this.starting=null;
                this.config.dashOffset=0
                this.inputdiv.style.display="none";
                if (this.selectedcell.row!=0){
                    this.selectedcell.row = this.selectedcell.row -1;
                    this.selectedcell.rowstart = this.selectedcell.rowstart - this.rowsize[this.selectedcell.row]
                    this.starting=JSON.parse(JSON.stringify(this.selectedcell))
                    this.ending=JSON.parse(JSON.stringify(this.selectedcell))
                    // console.log(this.containerdiv.scrollLeft,this.selectedcell.col);
                    if(this.containerdiv.scrollTop>this.selectedcell.rowstart- this.rowsize[this.selectedcell.row]){
                        this.containerdiv.scrollTo(this.containerdiv.scrollLeft,this.selectedcell.rowstart)
                    }
                    this.marchloop=null
                    if (!this.marchloop){
                        window.requestAnimationFrame(()=>this.table());
                    }
                    this.headers();
                    this.rows()
                }
            }
        }
        else if (e.key === "ArrowDown"){
            if (e.shiftKey === true){
                // console.log("shift pressed");
                this.starting.col = this.selectedcell.col
                this.starting.row = this.selectedcell.row;
                if (this.ending === null){
                    this.ending.row = this.selectedcell.row;
                    this.ending.col = this.selectedcell.col;
                }
                else{
                    this.ending.row = this.ending.row + 1;
                    this.ending.rowstart = this.ending.rowstart + this.rowsize[this.ending.row]
                    if(this.containerdiv.scrollTop+this.containerdiv.clientHeight<this.ending.rowstart + 2*this.rowsize[this.ending.row]){
                        this.containerdiv.scrollTo(this.containerdiv.scrollLeft,this.ending.rowstart+2*this.rowsize[this.ending.row]-this.containerdiv.clientHeight)
                    }
                    this.marchloop=null
                    if (!this.marchloop){
                        window.requestAnimationFrame(()=>this.table());
                    }
                }
                this.headers();
                this.rows()
            }
            else{
                e.preventDefault();
                this.starting=null;
                this.config.dashOffset=0
                this.inputdiv.style.display="none";
                this.selectedcell.rowstart = this.selectedcell.rowstart + this.rowsize[this.selectedcell.row]
                this.selectedcell.row = this.selectedcell.row +1;
                this.starting=JSON.parse(JSON.stringify(this.selectedcell))
                this.ending=JSON.parse(JSON.stringify(this.selectedcell))
                // console.log(this.containerdiv.scrollLeft,this.selectedcell.col);
                if(this.selectedcell.rowstart<this.containerdiv.scrollTop || this.containerdiv.scrollTop+this.containerdiv.clientHeight<this.selectedcell.rowstart + 2*this.rowsize[this.selectedcell.row]){
                    this.containerdiv.scrollTo(this.containerdiv.scrollLeft,this.selectedcell.rowstart+2*this.rowsize[this.selectedcell.row]-this.containerdiv.clientHeight)
                }
                this.marchloop=null
                if (!this.marchloop){
                    window.requestAnimationFrame(()=>this.table());
                }
                this.rows();
            }
            
        }
        else if (e.key.toLowerCase() === "c" && e.ctrlKey){
            // console.log("ctrl c");
            e.preventDefault()
            if (this.ending.columnstart == Infinity || this.ending.rowstart == Infinity){
                window.alert("To Large Text to Copy")
            }
            else{
                this.config.dashOffset=1;
                if (!this.marchloop){
                    window.requestAnimationFrame(()=>this.table());
                }
                this.clipboard();
            }
        }
        else if (e.key.toLowerCase() === "v"  && e.ctrlKey){
            e.preventDefault()
            this.paste()
        }
        else if (e.key.toLocaleLowerCase() === "x" && e.ctrlKey){
            e.preventDefault()
            if (this.ending.columnstart == Infinity || this.ending.rowstart == Infinity){
                window.alert("To Large Text to Copy")
            }
            else{
                this.config.dashOffset=1;
                let del = {}
                for(let i = Math.min(this.starting.row,this.ending.row);i<=Math.max(this.starting.row,this.ending.row);i++){
                    if (this.data[i]){
                        del[this.data[i][0]["text"]] = {}
                        for(let j = Math.min(this.starting.col,this.ending.col);j<=Math.max(this.starting.col,this.ending.col);j++){
                            del[this.data[i][0]["text"]][this.keyList[j]] = null 
                        }
                    }
                }
                let final = JSON.stringify(del)
                // console.log(final)
                fetch(`/api/Main/Update?SheetId=${this.sheetId}`,
                    {method:"PATCH",headers:{"Content-Type":"application/json"},body:final}
                )
                .then(response =>{
                    console.log(response);
                })
                .catch(err =>{
                    throw err;
                })
                // console.log(del);
                del = {}
                if (!this.marchloop){
                    window.requestAnimationFrame(()=>this.table());
                }
                this.clipboard();
                this.delete();
            }
        }
        else if (e.key.toLowerCase() === "f" && e.ctrlKey){
            e.preventDefault()
            this.findDiv.style.display="grid"
            document.querySelector(".replacelabel").style.display="none"
            document.querySelector(".replaceBtn").style.display="none"
            document.querySelector(".replaceInput").style.display="none"
            document.querySelector(".findInput").focus()
        }
        else if (e.key.toLowerCase() === "h" && e.ctrlKey){
            e.preventDefault()
            this.findDiv.style.display="grid"
            document.querySelector(".replacelabel").style.display="block"
            document.querySelector(".replaceBtn").style.display="block"
            document.querySelector(".replaceInput").style.display="block"
            document.querySelector(".findInput").focus()
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
                        window.requestAnimationFrame(()=>this.table());
                    }
                this.rows()
                }
            }
            else{
                this.config.dashOffset=0
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
                    window.requestAnimationFrame(()=>this.table());
                }
                this.rows()
            }
        }
        else if (e.key === "Delete"){
            // let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclick(e)
            // this.selectedcell= {col:xcordinate,row:ycordinate,columnstart:columnstart,rowstart:rowstart};
            // console.log(this.starting);
            // data[this.starting.row][this.starting.col].text = ""
            
            if (this.ending.columnstart == Infinity){
                this.delete();
                let del = []
                for (let i = Math.min(this.starting.row,this.ending.row);i<=Math.max(this.starting.row,this.ending.row) && this.data[i];i++){
                    del.push(this.data[i][0]["text"])
                }
                this.deleteSingleRow(del)
                del = []
            }
            else{
                this.delete();
                let del = {}
                for(let i = Math.min(this.starting.row,this.ending.row);i<=Math.max(this.starting.row,this.ending.row);i++){
                    if (this.data[i]){
                        del[this.data[i][0]["text"]] = {}
                        for(let j = Math.min(this.starting.col,this.ending.col);j<=Math.max(this.starting.col,this.ending.col);j++){
                            del[this.data[i][0]["text"]][this.keyList[j]] = null 
                        }
                    }
                }
                let final = JSON.stringify(del)
                // console.log(final)
                fetch(`/api/Main/Update?SheetId=${this.sheetId}`,
                    {method:"PATCH",headers:{"Content-Type":"application/json"},body:final}
                )
                .then(response =>{
                    console.log(response);
                    if (!this.marchloop){
                        window.requestAnimationFrame(()=>this.table());
                    }
                })
                .catch(err =>{
                    throw err;
                })
                // console.log(del);
                del = {}
            }
            // console.log("delete");
        }
        else if (e.key === "Escape"){
            this.findDiv.style.display = "none"
            this.findDiv.style.left = "30%"
            this.findDiv.style.top = "30%"
            // this.graphdiv.style.display="none"
            this.config.countFind=0
            this.config.dashOffset=0
            this.marchloop=null
            if (!this.marchloop){
                window.requestAnimationFrame(()=>this.table());
            }
        }
        // else if (e.key.charCodeAt()>=33 && e.key.charCodeAt()<=126 && !e.ctrlKey && e.location == 3){
        else if (`abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[];"':./\\<>?|`.includes(e.key.toLowerCase())){
            this.config.prevValue = this.data[this.selectedcell.row]?.[this.selectedcell.col]?.['text']
            // console.log(this.config.prevValue);
            this.inputdiv.style.display = "block"
            this.inputdiv.style.left=(this.selectedcell.columnstart + this.config.rowWidth)  + "px"
            this.inputdiv.style.top=(this.selectedcell.rowstart + this.config.rowHeight) + "px"
            this.inputdiv.style.width = this.columnsize[this.selectedcell.col]  - 1 + "px"
            this.inputdiv.style.height = this.rowsize[this.selectedcell.row] - 2 + "px"
            let inputref = this.inputdiv.querySelector("input")
            inputref.font= `${this.config.fontSize}px ${this.config.fontStyle}`;
            inputref.value = "" 
            inputref.focus();
            if (!this.marchloop){
                window.requestAnimationFrame(()=>this.table());
            }
            // console.log(e.key.charCodeAt());
        }
        if (this.starting.col == 0 || this.starting.row == 0){
            this.btn.setAttribute("data-dot","")
        }
        else{
            this.btn.removeAttribute("data-dot")
        }
    }
    /**
     * delete the data of selected range
     */
    delete(){
        if (this.starting && this.ending){
            for (let i = Math.min(this.starting.col,this.ending.col); i <= Math.max(this.starting.col,this.ending.col); i++){
                for (let j = Math.min(this.starting.row,this.ending.row); j <= Math.max(this.starting.row,this.ending.row); j++) {
                    if(this.data[j]?.[i]?.text && i!=0){
                        this.data[j][i].text=""
                    }
                }
            }
        }
        if (!this.marchloop){
            window.requestAnimationFrame(()=>this.table());
        }
    }
    //range selection
    /**
     * range selection pointer down , move and up 
     * Pointer down Event is added on canvas and move and up is on Window
     * @param {PointerEvent} e - default event
     */
    handlemouseDown(e){
        // e.preventDefault()
        // let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclick(e)
        let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclickCache(e)
        this.starting = {col:xcordinate , row:ycordinate , columnstart:columnstart , rowstart:rowstart}
        // console.log(this.starting);
        
        this.ending = {col:xcordinate , row:ycordinate , columnstart:columnstart , rowstart:rowstart};
        this.config.dashOffset=0;
        this.marchloop=null;
        
        // console.log(this.starting);
        // e.target.addEventListener("pointerdown",handlemouseDown);
        // let temp1, temp2;
        /**
         * mouse move function for range selection
         * @param {PointerEvent} i - default e event 
         */
        let handleMouseMove=(i)=>{
            i.preventDefault()
            let newX = e.offsetX+i.clientX-e.clientX
            let newY = e.offsetY+i.clientY-e.clientY
            // let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclick({offsetX:newX,offsetY:newY})
            let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclickCache({offsetX:newX,offsetY:newY})
            if (this.ending == null || (this.ending.row != ycordinate || this.ending.col != xcordinate)){
                this.ending = { row: ycordinate, col: xcordinate ,columnstart:columnstart,rowstart:rowstart};
                if (!this.marchloop){
                    this.table()
                }
                this.headers()
                this.rows()
            }
            if(this.containerdiv.scrollLeft>=this.ending.columnstart-50){ //scroll left
                this.containerdiv.scrollBy(-this.columnsize[this.ending.col],0)
            }
            else if(this.containerdiv.scrollLeft+this.containerdiv.clientWidth<=this.ending.columnstart+this.columnsize[this.ending.col]+50){ //scroll right
                this.containerdiv.scrollBy(+this.columnsize[this.ending.col],0)
            }
            else if(this.containerdiv.scrollTop>=this.ending.rowstart-50){ //up
                this.containerdiv.scrollBy(0,-this.rowsize[this.ending.row])
            }
            // console.log(this.containerdiv.scrollTop+this.containerdiv.clientHeight,this.ending.rowstart+this.rowsize[this.ending.row]);
            else if(this.containerdiv.scrollTop+this.containerdiv.clientHeight<=this.ending.rowstart+this.rowsize[this.ending.row]+50){
                this.containerdiv.scrollBy(0,+this.rowsize[this.ending.row])
            }

            if (this.starting.col == 0 || this.starting.row == 0 || this.ending.col == 0 || this.ending.row == 0){
                this.btn.setAttribute("data-dot","")
            }
            else{
                this.btn.removeAttribute("data-dot")
            }
            
            // console.log(this.ending);
        }
        
            // e.target.addEventListener("mousemove",handleMouseMove)
        // let temp1 = handleMouseMove.bind(this)
        window.addEventListener("pointermove",handleMouseMove);
        /**
         * pointer up event for range selection
         * @param {PointerEvent} j - default e event
         */
        let handlemouseup=(j)=>{
            // j.preventDefault()
            let newX = e.offsetX+j.clientX-e.clientX
            let newY = e.offsetY+j.clientY-e.clientY
            let {columnstart , rowstart , xcordinate , ycordinate} = this.handleclickCache({offsetX:newX,offsetY:newY})
            // console.log(e.target);
            window.removeEventListener("pointermove",handleMouseMove);
            this.ending = {col:xcordinate , row:ycordinate ,columnstart:columnstart,rowstart:rowstart}

            if (this.starting.col == 0 || this.starting.row == 0 || this.ending.col == 0 || this.ending.row == 0){
                this.btn.setAttribute("data-dot","")
            }
            else{
                this.btn.removeAttribute("data-dot")
            }
            // console.log("final ending",this.ending);
            if(!this.marchloop) {this.marchants();}
            // if (this.starting.col == this.ending.col){this.calculate();}
            window.removeEventListener("pointerup",handlemouseup)
            let aggregateEvent = new CustomEvent("calcCustomEvent",{detail:this.calculate()})
            window.dispatchEvent(aggregateEvent)
        }
        // let temp2 = handlemouseup.bind(this)
        window.addEventListener("pointerup",handlemouseup);   
        // e.target.removeEventListener("pointerdown",this.handlemouseDown)
    }
    
    // column resize move pointer function 
    /**
     * pointer move to continusly check if reach the boundry or not for cursor change
     * This is event Listner is added on Header canvas
     * @param {PointerEvent} e -default event
     */
    moveheader=(e)=>{
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
    
        let firstcell = this.handleclickCache({offsetX:0,offsetY:0})
        let x = e.offsetX + this.containerdiv.scrollLeft;
        let boundry = firstcell.columnstart + this.columnsize[firstcell.xcordinate]
        // console.log(x,this.headerref.clientWidth+this.containerdiv.scrollLeft,columnstart);
        for(let i = firstcell.xcordinate ; boundry< this.containerdiv.clientWidth+this.containerdiv.scrollLeft && i<this.columnsize.length;i++,boundry+=this.columnsize[i]){
            if (Math.abs(x-boundry) <=10){
                e.target.style.cursor = "col-resize";
                break;
            }
            else{
                e.target.style.cursor = "url(./assets/columnselect.cur),default";
            }
        }
    }
    /**
     * To resize the column and to check if selected infinity and resize it
     * Pointer down Event is added on canvas table and move and up event are added on Window
     * @param {PointerEvent} edown - default event
     * @returns - if selected infinity then return else perform further
     */
    changesize(edown){
        edown.preventDefault()
        this.headerref.removeEventListener("pointermove",this.moveheader)
        let firstcell = this.handleclickCache({offsetX:0,offsetY:0})
        let x = edown.offsetX + this.containerdiv.scrollLeft;
        let boundry = firstcell.columnstart + this.columnsize[firstcell.xcordinate]
        let doresize=false
        let prevWidth = 0
        // let colsizearr = 0
        // console.log(x,this.headerref.clientWidth+this.containerdiv.scrollLeft,columnstart);
        for(var i = firstcell.xcordinate ; boundry< this.containerdiv.clientWidth+this.containerdiv.scrollLeft && i<this.columnsize.length && (boundry<x || Math.abs(boundry-x)<=10);i++,boundry+=this.columnsize[i]){
            if (Math.abs(x-boundry) <=10){
                edown.target.style.cursor = "col-resize";
                // console.log("boundry",boundry);
                doresize = true
                break;
            }
            else{
                edown.target.style.cursor = "url(./assets/columnselect.cur),default";
            }
        }   
        // console.log("col resize",boundry);
        if (!doresize){
            // this.selectInfinity = true
            // console.log(i,x,ycordinate);
            this.inputdiv.style.display="none";
            this.config.dashOffset=0
            this.selectedcell.row = 0
            if (edown.shiftKey == true){
                this.ending.col = i
                this.ending.columnstart = boundry - this.columnsize[i]
                this.starting.row = 0;
                this.ending.row = this.config.rowlimit;
                this.starting.rowstart = 0;
                this.ending.rowstart = Infinity;
                this.headers()
                if (!this.marchloop){
                    window.requestAnimationFrame(()=>this.table());
                }
                this.rows()
                return  
            }
            this.selectedcell.col = i
            this.starting.col = i;
            this.ending.col = i;
            this.starting.columnstart = boundry - this.columnsize[i]
            this.ending.columnstart = boundry - this.columnsize[i];
            this.starting.row = 0;
            this.ending.row = this.config.rowlimit;
            this.starting.rowstart = 0;
            this.ending.rowstart = Infinity;
            // this.selectedCell = JSON.parse(JSON.stringify(this.starting))
            let count =0
            // console.log("bound",boundry);
            /**
             * pointer move function for multiple infinity column select
             * @param {PointerEvent} em - default e event
             */
            let moveinfinity = (em)=>{
                em.preventDefault()
                if ((edown.offsetX+em.clientX-edown.clientX+this.containerdiv.scrollLeft)>=(boundry)){
                    count+=1
                    boundry +=this.columnsize[i+count]
                    this.ending.columnstart = this.ending.columnstart+this.columnsize[i+count]
                    this.ending.col = i+count
                    // console.log(this.containerdiv.scrollLeft+this.containerdiv.clientWidth, boundry )
                }
                if(this.containerdiv.scrollLeft+this.containerdiv.clientWidth <= boundry +100){ //scroll right
                    this.containerdiv.scrollBy(+100,0)
                }
                if ((edown.offsetX+em.clientX-edown.clientX+this.containerdiv.scrollLeft)<(boundry - this.columnsize[i+count])){
                    // console.log("move left");
                    // console.log("dec",em.offsetX+this.containerdiv.scrollLeft);
                    boundry -=this.columnsize[i+count]
                    count-=1
                    this.ending.col = i+count
                    this.ending.columnstart -= this.columnsize[i+count]
                    // console.log(this.containerdiv.scrollLeft,this.ending.columnstart);
                }
                if(this.containerdiv.scrollLeft>=this.ending.columnstart){
                    this.containerdiv.scrollBy(-100,0)
                }
                this.headers()
                this.rows()
                if (!this.marchloop){
                    window.requestAnimationFrame(()=>this.table());
                }
            }
            /**
             * pointer up event for multiple column infinity select
             */
            let upinfinity =()=>{
                this.headerref.addEventListener("pointermove",this.moveheader)
                window.removeEventListener("pointerup",upinfinity);
                window.removeEventListener("pointermove",moveinfinity);
            }
            window.addEventListener("pointermove",moveinfinity)
            window.addEventListener("pointerup",upinfinity)
            this.headers();
            this.rows();
            if (!this.marchloop){
                window.requestAnimationFrame(()=>this.table());
            }
            return
        }
        else{
            let minx = boundry - this.columnsize[i]
            /**
             * pointer move event for column resize
             * @param {PointerEvent} emove - default e event
             */
            let resize = (emove) =>{
                emove.preventDefault()
                // let deltaX = emove.clientX - edown.clientX
                // console.log(deltaX);
                if ((this.columnsize[i]+emove.movementX>=20) && (emove.offsetX+this.containerdiv.scrollLeft >=minx)){
                    // console.log(emove.movementX);
                    this.columnsize[i]+=emove.movementX/window.devicePixelRatio
                    prevWidth = this.columnsize[i]
                    // console.log(this.columnsize[i]);
                    if (!this.marchloop){
                        window.requestAnimationFrame(()=>this.table());
                    }
                    this.headers();
                }
            }
            /**
             * pointer up event for column resize
             */
            let resizeup = () =>{
                this.headerref.addEventListener("pointermove",this.moveheader)
                // console.log(prevWidth);
                if (this.starting.col != this.ending.col && i>=Math.min(this.starting.col,this.ending.col) && i<=Math.max(this.starting.col,this.ending.col) && this.ending.rowstart == Infinity){
                    for(let i=Math.min(this.starting.col,this.ending.col);i<=Math.max(this.starting.col,this.ending.col);i++){
                        this.columnsize[i] = prevWidth 
                    }
                    this.wraptextforcol(i)
                }
                // console.log(this.columnsize);
                if (!this.marchloop){
                    window.requestAnimationFrame(()=>this.table());
                }
                this.headers()
                this.wraptextforcol(i)
                window.removeEventListener("pointerup",resizeup);
                window.removeEventListener("pointermove",resize);
            }
            window.addEventListener("pointermove",resize)
            window.addEventListener("pointerup",resizeup);
        }
        
    }
    
    // row resize
    /**
     * pointer move to continusly check if reached row boundry or not and change cursor
     * This is event is added on Row canvas
     * @param {PointerEvent} e - default event
     */
    moverow=(e)=>{
        let firstcell =  this.handleclickCache({offsetX:0,offsetY:0})
        let x = e.offsetY + this.containerdiv.scrollTop;
        let boundry = firstcell.rowstart + this.rowsize[firstcell.ycordinate]
        // console.log(x,this.headerref.clientWidth+this.containerdiv.scrollLeft,columnstart);
        for(let i = firstcell.ycordinate ; boundry< this.containerdiv.clientHeight+this.containerdiv.scrollTop && i<this.rowsize.length;i++,boundry+=this.rowsize[i]){
            if (Math.abs(x-boundry) <=10){
                e.target.style.cursor = "row-resize";
                break;
            }
            else{
                e.target.style.cursor = "url(./assets/rowselect.cur),default";
            }
        }
    }
    /**
     * To resize the row and check if selected infinity and resize it
     * Pointer down Event is added on canvas table and move and up event are added on Window
     * @param {PointerEvent} edown - default event
     * @returns - if selected infinity then return else perform further
     */
    changerowsize(edown){
        // console.log("down");
        edown.preventDefault()
        this.rowref.removeEventListener("pointermove",this.moverow)
        let firstcell =  this.handleclickCache({offsetX:0,offsetY:0})
        let x = edown.offsetY + this.containerdiv.scrollTop;
        let boundry = firstcell.rowstart + this.rowsize[firstcell.ycordinate]
        let doresize = false
        let prevHeight = 0
        // console.log(x,this.headerref.clientWidth+this.containerdiv.scrollLeft,columnstart);
        for(var i = firstcell.ycordinate ; boundry< this.containerdiv.clientHeight+this.containerdiv.scrollTop && i<this.rowsize.length && (boundry<x || Math.abs(boundry-x)<=10);i++,boundry+=this.rowsize[i]){
            if (Math.abs(x-boundry) <=10){
                edown.target.style.cursor = "row-resize";
                doresize = true
                break;
            }
            else{
                edown.target.style.cursor = "url(./assets/rowselect.cur),default";
            }
        }
        let miny = boundry - this.rowsize[i]
        if (!doresize){
            this.inputdiv.style.display="none"; 
            this.config.dashOffset=0
            this.selectedcell.col = 0
            if (edown.shiftKey == true){
                this.ending.row=i
                this.ending.rowstart = boundry - this.rowsize[i]
                this.starting.col = 0
                this.ending.col = this.config.collimit
                this.starting.columnstart=0
                this.ending.columnstart=Infinity
                this.headers()
                if (!this.marchloop){
                    window.requestAnimationFrame(()=>this.table());
                }
                this.rows()
                return
            }
            this.selectedcell.row = i
            // this.selectrowInfinity=true
            this.starting.col = 0
            this.ending.col = this.config.collimit
            this.starting.columnstart=0
            this.ending.columnstart=Infinity
            this.starting.row=i
            this.ending.row=i
            this.starting.rowstart = boundry - this.rowsize[i]
            this.ending.rowstart = boundry - this.rowsize[i]
            // this.selectedCell = JSON.parse(JSON.stringify(this.starting))
            let count =0
            /**
             * pointer move for multiple infinity row select
             * @param {PointerEvent} em -default e event 
             */
            let moveinfinity = (em)=>{
                em.preventDefault()
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
                if(this.containerdiv.scrollTop>=this.ending.columnstart){
                    this.containerdiv.scrollBy(0,-100)
                }
                this.rows()
                this.headers()
                if (!this.marchloop){
                    window.requestAnimationFrame(()=>this.table());
                }
            }
            /**
             * pointer up event for multiple infinity row select
             */
            let upinfinity =()=>{
                this.rowref.addEventListener("pointermove",this.moverow)
                window.removeEventListener("pointerup",upinfinity);
                window.removeEventListener("pointermove",moveinfinity);
            }
            window.addEventListener("pointermove",moveinfinity)
            window.addEventListener("pointerup",upinfinity)
            this.headers();
            this.rows();
            if (!this.marchloop){
                window.requestAnimationFrame(()=>this.table());
            }
            return
        }
        /**
         * pointer move event for row resize
         * @param {PointerEvent} e - default event 
         */
        let rowresize = (e) =>{
            e.preventDefault()
            if ((this.rowsize[i]+e.movementY>=5) && (e.offsetY+this.containerdiv.scrollTop>=miny)){
                this.rowsize[i] = this.rowsize[i] + e.movementY/window.devicePixelRatio
                prevHeight = this.rowsize[i]
                if (!this.marchloop){
                    window.requestAnimationFrame(()=>this.table());
                }
                this.rows();
            }   
            // console.log("move");
        }
        /**
         * pointer up event for row resize
         */
        let rowresizeup = () =>{
            this.rowref.addEventListener("pointermove",this.moverow)
            // console.log(prevHeight);
            if (this.starting.row != this.ending.row && i<=Math.max(this.starting.row,this.ending.row) && i>=Math.min(this.starting.row,this.ending.row) && this.ending.columnstart==Infinity){
                for(let j=Math.min(this.starting.row,this.ending.row);j<=Math.max(this.starting.row,this.ending.row);j++){
                    // console.log("height",prevHeight);
                    this.rowsize[j] = prevHeight
                }
            }
            // console.log(this.rowsize);
            if (!this.marchloop){
                window.requestAnimationFrame(()=>this.table());
            }
            this.rows()
            window.removeEventListener("pointerup",rowresizeup);
            window.removeEventListener("pointermove",rowresize);
        }
        window.addEventListener("pointermove",rowresize)
        window.addEventListener("pointerup",rowresizeup);
    }
    
    //getting select position from top left and width and height of selected data
    /**
     * It calculates the border of the range box and its position and width and height of box
     * @returns {[Number , Number , Number , Number]} - It gives the position of the box and width and height of the selected box to add marchants on border
     */
    marchants(){
        // console.log("calling march ants");
        // await new Promise(r=>setTimeout(r,1))
        if(this.starting && this.ending){
            // console.clear();
            // console.log(this.starting,this.ending);


            // let posX = Math.min(this.starting.columnstart,this.ending.columnstart);
            // let posY = Math.min(this.starting.rowstart,this.ending.rowstart);
            // let width = Math.max(this.ending.columnstart,this.starting.columnstart)-posX+this.columnsize[this.ending.col];
            // let height = Math.max(this.ending.rowstart,this.starting.rowstart)-posY+this.rowsize[this.ending.row];

            // return [posX, posY, width, height];

            let [posX,posY,rectWidth, rectHeight] = [0,0,0,0];
            let i=0;
            while(i<Math.min(this.starting.col, this.ending.col)){
              posX+=this.columnsize[i];
            //   console.log(posX , "mic col pixel");
              i++;
            }
            while(i<=Math.max(this.starting.col, this.ending.col) && i<this.columnsize.length){
                    rectWidth+=this.columnsize[i];
                    // console.log(rectWidth,"mac col pixel");
                    i++;
                
            }
            i=0;
            while(i<Math.min(this.starting.row, this.ending.row)){
                posY+=this.rowsize[i];
                i++;
            }
            while(i<=Math.max(this.starting.row, this.ending.row) && i<this.rowsize.length){
                    rectHeight+=this.rowsize[i];
                    // console.log(rectHeight , "max row pixel");
                    i++;
                
            }
            return [posX,posY,rectWidth, rectHeight]
            
        }
    }
    
    //copy clipboard
    /**
     * To copy the text and used navigator.clipboard to writeText
     */
    clipboard(){
        if (this.starting && this.ending){
            let text="";
            for (let i = Math.min(this.starting.row,this.ending.row); i <= Math.max(this.starting.row,this.ending.row); i++) {
                for (var j = Math.min(this.starting.col,this.ending.col); j < Math.max(this.starting.col,this.ending.col); j++){
                  // console.log(i,j);
                  text +=`${(this.data[i] && this.data[i][j] ? this.data[i][j].text : "")}\t`;
                }
                text +=`${(this.data[i] && this.data[i][j] ? this.data[i][j].text : "")}`;   
                text += `\n`
            }
            navigator.clipboard.writeText(text.trimEnd())
        }
    }
    //paste clipboard
    /**
     * To paste a data in the cells used navigator.readText check text if it has \t then move to next cell and \n move to next row
     */
    async paste(){
        // this.starting.row = 0
        // this.starting.col=0
        // this.ending.row = 0
        // this.ending.col =0
        let copiedText = await navigator.clipboard.readText()
        let count = this.ending.col
        let t = ""
        let reqBody = {};
        // let Update = fetch(`/api/Main/Upload?SheetId=${this.sheetId}`,
        //     {method:"PATCH",headers:{"Content-Type":"application/json"},body:t}
        // )
        reqBody[this.data[this.ending.row][0]['text']] = {}
        for (let i=0;i<copiedText.length;i++){
            // debugger
            // console.log(i, copiedText[i]);
            if (copiedText[i] == "\t"){
                if(this.data[this.ending.row]){
                    if(this.data[this.ending.row][this.ending.col]){
                        this.data[this.ending.row][this.ending.col]['text'] =t;
                    }
                    else{
                        this.data[this.ending.row][this.ending.col] = {text:t};
                    }
                }
                else{
                    this.data[this.ending.row]={};
                    this.data[this.ending.row][this.ending.col]={}
                    this.data[this.ending.row][this.ending.col]['text'] = t;
                }
                console.log(this.keyList[this.ending.col], t);
                reqBody[this.data[this.ending.row][0]['text']][this.keyList[this.ending.col]] = t
                // reqBody[this.data[this.ending.row][this.keyList[this.ending.col]]['text']] = {}
                t =""
                this.ending.col +=1
            }
            else if(copiedText[i] == "\n" ){
                if(this.data[this.ending.row]){
                    if(this.data[this.ending.row][this.ending.col]){
                        this.data[this.ending.row][this.ending.col]['text'] =t;
                    }
                    else{
                        this.data[this.ending.row][this.ending.col] = {text:t};
                    }
                }
                else{
                    this.data[this.ending.row]={};
                    this.data[this.ending.row][this.ending.col]={}
                    this.data[this.ending.row][this.ending.col]['text'] = t;
                }
                reqBody[this.data[this.ending.row][0]['text']][this.keyList[this.ending.col]] = t
                t =""
                this.ending.col = count
                this.ending.row+=1
                reqBody[this.data[this.ending.row][0].text] = {}
            }
            else{
                // console.log(selectedCell);
                t+=copiedText[i]
            }
        }
        console.log(reqBody);
        if(this.data[this.ending.row]){
            if(this.data[this.ending.row][this.ending.col]){
                this.data[this.ending.row][this.ending.col]['text'] =t;
            }
            else{
                this.data[this.ending.row][this.ending.col] = {text:t};
            }
        }
        else{
            this.data[this.ending.row]={};
            this.data[this.ending.row][this.ending.col]={}
            this.data[this.ending.row][this.ending.col]['text'] = t;
        }
        // reqBody[this.data[this.ending.row][0].text] = {}
        reqBody[this.data[this.ending.row][0]['text']][this.keyList[this.ending.col]] = t
        if (!this.marchloop){
            window.requestAnimationFrame(()=>this.table());
        }
        this.headers()
        this.rows()
        let finalbody = JSON.stringify(reqBody);
        fetch(`/api/Main/Update?SheetId=${this.sheetId}`,
            {method:"PATCH",headers:{"Content-Type":"application/json"},body:finalbody}
        )
        .catch(err =>{
            throw err;
        })
    }
    
    //calculations aggregate functions
    /**
     * To calculate aggregate values of selected range data
     * @returns {[Number , Number , Number , Number , Number]} - provides min , max , mean , sum and multiply values
     */
    calculate(){ 
        // console.log("starting",this.starting,"ending",this.ending);
        let arr = []
        let min;
        let max;
        let mean;
        let sum;
        let multiply;
        // if (this.starting.col == this.ending.col){
        let start = Math.min(this.starting.row , this.ending.row);
        let end = Math.max(this.starting.row , this.ending.row);
        for(let i = start ; i<=end ; i++){
            for(let j = Math.min(this.starting.col , this.ending.col); j<=Math.max(this.starting.col , this.ending.col);j++){
                if (this.data[i] && this.data[i][j] && !isNaN(Number(this.data[i][j].text))){
                    arr.push(Number(this.data[i][j].text))
                }
            }
        }
        min = Math.min(...arr);
        max = Math.max(...arr);
        mean = arr.reduce((prev, curr) => prev + curr,0) / arr.length;
        sum = mean * arr.length
        // if (arr.length>0){
        //     multiply = arr.reduce((prev, curr) => prev * curr)
        // }
        
        // console.log(arr,multiply);
        // console.log(min==Infinity?0:min,max==-Infinity?0:max,isNaN(mean)?0:mean,isNaN(sum)?0:sum);
        return[min==Infinity?0:min,max==-Infinity?0:max,isNaN(mean)?0:mean,isNaN(sum)?0:sum,isNaN(multiply)?0:multiply];
    
        // }

        // console.log(arr);
    }
    
    //doubleclick on header resize
    /**
     * To resize the column size according to long text
     * @param {PointerEvent} e - default event
     * @returns - break if not resized the column
     */
    headerclick(e){
        let firstcell =  this.handleclickCache({offsetX:0,offsetY:0})
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
        this.ctx.font=`${this.config.fontSize}px ${this.config.fontStyle}`
        let tempdatacolumn = (Object.keys(this.data).filter(x=>this.data[x][i] && !this.data[x][i].wrap)).map(x=>Math.ceil(this.ctx.measureText(this.data[x][i].text).width))   
        if (tempdatacolumn.length===0){return}
        this.columnsize[i] = Math.max(...tempdatacolumn) + 5 
        // console.log(this.columnsize[i]);
        this.ctx.restore()
        this.wraptextforcol(i)
        if (!this.marchloop){
            window.requestAnimationFrame(()=>this.table());
        }
        this.headers();
        // console.log(tempdatacolumn);
        // console.log(this.ctx.measureText(tempdatacolumn));
        // this.ctx.measureText()
        
    }
    
    //text wrap
    /**
     * To Wrap a currently selected cell 
     * used measureText Width and compare it with size of column and break it
     */
    wraptext(){
        let s1="";
        let w=this.config.fontSize; //font size
        let wrappedarr = []
        this.ctx.save()
        this.ctx.font=`${this.config.fontSize}px ${this.config.fontStyle}`;
        if (this.data[this.selectedcell.row] && this.data[this.selectedcell.row][this.selectedcell.col]?.text){
            for(let x of this.data[this.selectedcell.row][this.selectedcell.col].text){
                w+=this.ctx.measureText(x).width
                if(w > (this.columnsize[this.selectedcell.col])-5){
                    this.data[this.selectedcell.row][this.selectedcell.col]["wrap"]=true 
                    // console.log(s1)
                    wrappedarr.push(s1)
                    s1=""
                    w=this.config.fontSize;
                }
                s1+=x
            }
            wrappedarr.push(s1)
            this.data[this.selectedcell.row][this.selectedcell.col].wrappedarr = wrappedarr; 
            // let val = s1.split("\n").length
            // this.rowsize[this.selectedcell.row] = Math.max(val *15,this.rowsize[this.selectedcell.row]);
            this.rowsize[this.selectedcell.row] = Math.max(wrappedarr.length *this.config.fontSize,this.rowsize[this.selectedcell.row]);
            // this.ctxrow([this.selectedcell.row] = val * this.rowsize[this.selectedcell.row])
            this.ctx.restore()
        }
        this.rows()
        if (!this.marchloop){
            window.requestAnimationFrame(()=>this.table());
        }
    }

    //wrap range data
    /**
     * To wrap all cells with text wrap true in a current selected range
     */
    wraprange(){
        // (this.starting && this.ending && 
        //     Math.min(this.starting.row, this.ending.row) <= j && 
        //     j <= Math.max(this.starting.row, this.ending.row) && 
        //     Math.min(this.starting.col, this.ending.col) <= i && 
        //     i <= Math.max(this.starting.col, this.ending.col
        this.ctx.save()
        this.ctx.font=`${this.config.fontSize}px ${this.config.fontStyle}`;
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
        if (!this.marchloop){
            window.requestAnimationFrame(()=>this.table());
        }
    }
    
    //column resize wrap text
    /**
     * To wrap all cells with text wrap true in a specific column
     * @param {Number} xcordinate - the column number to get wrapped
     */
    wraptextforcol(xcordinate){
        let rows = Object.keys(this.data).filter(x=>this.data[x][xcordinate]?.wrap)
        rows.forEach(r=>{
            let s1="";
            let w=this.config.fontSize;
            let wrappedarr = []
            this.ctx.save()
            this.ctx.font=`${this.config.fontSize}px ${this.config.fontStyle}`;
            for(let x of this.data[r][xcordinate].text){
                w+=this.ctx.measureText(x).width
                if(w > (this.columnsize[xcordinate])-5){
                    // console.log(s1)
                    wrappedarr.push(s1)
                    s1=""
                    w=this.config.fontSize;
                }
                s1+=x
            }
            wrappedarr.push(s1)
            this.data[r][xcordinate].wrappedarr = wrappedarr; 
            // console.log(s1);
            // console.log(s1.split("\n").length);
            // let val = s1.split("\n").length
            // this.rowsize[this.selectedcell.row] = Math.max(val *15,this.rowsize[this.selectedcell.row]);
            this.rowsize[r] = Math.max(wrappedarr.length *this.config.fontSize,this.rowsize[r]);
            
            // this.ctxrow([this.selectedcell.row] = val * this.rowsize[this.selectedcell.row])
            this.ctx.restore()
        })
        if (!this.marchloop){
            window.requestAnimationFrame(()=>this.table());
        }
    }
    
    //find data form creation
    /**
     * creation of find and replace box 
     * @returns {HTMLElement} - Find and replace box
     */
    findandReplaceForm(){
        this.findDiv = document.createElement("form")
        let headerLabel = document.createElement("h3")
        headerLabel.textContent="Find and Replace"
        let findRadio = document.createElement("span")
        findRadio.textContent="Find"
        let replaceRadio = document.createElement("span")
        replaceRadio.textContent="Replace"
        let findlabel = document.createElement("label")
        findlabel.textContent = "Search Text"
        let findInput = document.createElement("input")
        let replacelabel = document.createElement("label")
        replacelabel.textContent = "Replace"
        let replaceInput = document.createElement("input")
        let findBtn = document.createElement("button")
        findBtn.textContent = "Find Next"
        let replaceBtn = document.createElement("button")
        replaceBtn.textContent = "Replace With"

        this.findDiv.classList.add("findDiv");
        findRadio.classList.add("findRadio")
        replaceRadio.classList.add("replaceRadio")
        findInput.classList.add("findInput");
        findInput.name="findText"
        replacelabel.classList.add("replacelabel")
        replaceInput.classList.add("replaceInput")
        replaceInput.name = "replaceText"
        findBtn.classList.add("findBtn")
        replaceBtn.classList.add("replaceBtn")

        // this.childdiv.appendChild(this.findDiv);
        this.findDiv.appendChild(headerLabel)
        this.findDiv.appendChild(findRadio)
        this.findDiv.appendChild(replaceRadio)
        this.findDiv.appendChild(findlabel);
        this.findDiv.appendChild(findInput);
        this.findDiv.appendChild(replacelabel);
        this.findDiv.appendChild(replaceInput);
        this.findDiv.appendChild(findBtn);
        this.findDiv.appendChild(replaceBtn);
        
        replaceBtn.style.display="none"
        replaceInput.style.display="none"
        replacelabel.style.display="none"

        findBtn.addEventListener("click",(e)=>{
            // this.find(e.target.form.findText.value)
            this.findFromDb(e.target.form.findText.value)
            .next()
            .then(response => {
                console.log(response);
            })
        })

        // findInput.addEventListener("change",()=>{
        //     this.config.countFind = 0
        //     /**
        //      * @type {string} - pev text stored in the cell
        //      */
        //     // this.prevtext = e.target.form.findText.value
        //     // this.redo = true
        //     // console.log(prevtext);
        // })
        replaceInput.addEventListener("change",(e)=>{
            /**
             * @type {string} - new text that should replace with old one
             */
            this.newText = e.target.form.replaceText.value
            // console.log(newText);
        })
        findRadio.addEventListener("click",()=>{
            replaceBtn.style.display="none"
            replaceInput.style.display="none"
            replacelabel.style.display="none"
            replaceRadio.style.textDecoration="none"
            findRadio.style.textDecoration="underline"
            findRadio.style.textDecorationSkipInk="none"
            findRadio.style.textDecorationThickness="3px"
            findRadio.style.textDecorationColor="#107c41"
        })
        replaceRadio.addEventListener("click",()=>{
            replaceBtn.style.display="block"
            replaceInput.style.display="block"
            replacelabel.style.display="block"
            findRadio.style.textDecoration="none"
            replaceRadio.style.textDecoration="underline"
            replaceRadio.style.textDecorationSkipInk="none"
            replaceRadio.style.textDecorationThickness="3px"
            replaceRadio.style.textDecorationColor="#107c41"
        })
        replaceBtn.addEventListener("click",()=>{
            this.replace()
        })
        headerLabel.addEventListener("pointerdown",(e)=>{this.findPointerDown(e)})
        return this.findDiv
    }
    /**
     * To find text within sheets and highlight the cells
     * @param {string} findtext - the text that needs to be find 
     * @param {object} padeData - data in which to find text
     */
    find(findtext , pageData = this.data){
        // let datarow = Object.entries(this.data).map(v=>[v[0],Object.entries(v[1])])
        // console.log(datarow);
        // let finalarr = datarow.map(x=>{
        //     x[1]=x[1].filter(y=>JSON.stringify(y[1]).replaceAll("\\n","").includes(findtext)) 
        //     return x 
        // }    
        // ).filter(x=>x[1].length)

        let r,c
        // if (this.redo === true){
            let findarr=[]
            for(r of Object.keys(pageData)){
                for(c of Object.keys(pageData[r])){
                    if (c != "row_id" && JSON.stringify(pageData[r][c].text).includes(findtext)){
                        findarr.push([r,c])
                    }
                }
            }
        return findarr;
            /* console.log(this.config.findarr,r,c);
        //     this.redo = false
        // }
        
        // console.log(this.findarr);
        // if (this.config.findarr.length>=1){
        //     console.log(this.config.findarr , this.config.countFind);
        //     this.starting.row = Number(this.config.findarr[this.config.countFind][0])
        //     this.starting.col = Number(this.config.findarr[this.config.countFind][1])
        //     this.ending.row = Number(this.config.findarr[this.config.countFind][0])
        //     this.ending.col = Number(this.config.findarr[this.config.countFind][1])
        //     this.config.countFind= (this.config.countFind + 1) % this.config.findarr.length
        //     // this.finalarr=[]
        // }
        // else{
        //     window.alert("No Element Found")
        // }
        
        // this.ending.columnstart=0
        // this.starting.columnstart=0
        // for (let i=0;i<this.ending.col;i++){
        //     this.starting.columnstart+=this.columnsize[i]
        //     this.ending.columnstart+=this.columnsize[i]
        // }
        // this.ending.rowstart=0
        // this.starting.rowstart=0
        // for(let i=0;i<this.ending.row;i++){
        //     this.starting.rowstart+=this.rowsize[i]
        //     this.ending.rowstart+=this.rowsize[i]
        // }
        // // console.log(this.config.findarr);
        // this.containerdiv.scrollTo({left:this.ending.columnstart-30,top:this.ending.rowstart-30,behavior:"smooth"})
        // // console.log(this.starting,this.ending);
        // if (!this.marchloop){
        //     window.requestAnimationFrame(()=>this.table());
        // }
        // this.headers()
        // this.rows()
        // return finalarr
        // console.log(finalarr.map(v=>v[1][0]));*/
    }
    /**
     * function to scroll till the page and select the cell
     * @param {number} row - row number of the selected cell
     * @param {number} col - col number of the selected cell
     */
    findColor(row,col){
        this.starting.row = row
        this.ending.row = row
        this.starting.col = col
        this.ending.col = col
        this.ending.columnstart=0
        this.starting.columnstart=0
        for (let i=0;i<this.ending.col;i++){
            this.starting.columnstart+=this.columnsize[i]
            this.ending.columnstart+=this.columnsize[i]
        }
        this.ending.rowstart=0
        this.starting.rowstart=0
        console.log(this.rowsize[16]);
        for(let i=0;i<this.ending.row;i++){
            this.starting.rowstart+=this.rowsize[i]
            this.ending.rowstart+=this.rowsize[i]
        }
        // console.log(arr);
        this.containerdiv.scrollTo({left:this.ending.columnstart-30,top:this.ending.rowstart-30,behavior:"smooth"})
        // console.log(this.starting,this.ending);
        if (!this.marchloop){
            window.requestAnimationFrame(()=>this.table());
        }
        this.headers()
        this.rows()
    }
    /**
     * Generator for next find 
     * @param {string} - text to search 
     */
    async *findFromDb(text){
        console.log("from db text");
        if(this.prevtext!=text){
            // new search
            this.config.findarr=[]
            console.log("insdie find from db func");
            this.prevtext = text;
            // this.searchObject.currentPage=0;
            if(!this.data[0]){
                let pageData = await this.FetchDatafromDb(this.sheetId, 0);
                console.log(pageData);
                let newArr = this.find(text, pageData)
                // this.find(text, pageData)
                // console.log(pageArr);
                this.config.findarr = newArr;
                this.config.countFind = 0;
                console.log("searching in pg:0 from db");
                // console.log(pageArr)
                if(this.config.countFind < this.config.findarr.length){
                    let elem = this.config.findarr[this.config.countFind++]
                    this.findColor(elem[0], elem[1])
                    // yield this.config.findarr[this.config.countFind++]
                    yield elem
                }
            }
            else{
                let newArr = this.find(text, this.data);
                // let pageArr = this.find(text, this.data);

                console.log("searching in pg:0 from local");
                // console.log(pageArr)
                this.config.findarr = newArr;
                this.config.countFind = 0;
                if(this.config.countFind < newArr.length){
                    let elem = this.config.findarr[this.config.countFind++]
                    this.findColor(elem[0], elem[1])
                    // yield this.config.findarr[this.config.countFind++]
                    yield elem
                }
            }
        }
        else{
            //continued search
            console.log("inside else");
            if(this.config.countFind < this.config.findarr.length){
                let elem = this.config.findarr[this.config.countFind++]
                this.findColor(elem[0], elem[1])
                // yield this.config.findarr[this.config.countFind++]
                yield elem
            }
            else{
                // need to fetch another page
                console.log("need to fetch next page data") 
                do {
                    this.pageNumber+=1;
                    console.log(this.pageNumber);
                    let pageData = await this.FetchDatafromDb(this.sheetId, this.pageNumber);
                    let currRow = this.pageNumber*this.PageSize;
                    let newPageData = {};
                    Object.keys(pageData).forEach((element,index) => {
                        newPageData[currRow+index] = pageData[element]
                    });
                    console.log(newPageData);
                    // this.config.countFind = 0
                    var newArr = this.find(text, newPageData)
                }while(newArr.length == 0);
                this.config.findarr = this.config.findarr.concat(newArr);
                // this.config.countFind = this.config.findarr.length-1
                if(this.config.countFind < this.config.findarr.length){
                    let elem = this.config.findarr[this.config.countFind++]
                    this.findColor(elem[0], elem[1])
                    // yield this.config.findarr[this.config.countFind++]
                    yield elem
                }
                // yield this.config.findarr[this.config.countFind++]
 
            }
 
        }
        // yield "hi";
    }
    //replace
    /**
     * replaced the searched data
     */
    replace(){
        if (this.config.findarr.length>=1){
            let row = this.config.findarr[this.config.findarr.length>1 ? this.config.countFind-1 : this.config.countFind][0]
            // console.log(row);
            let col = this.config.findarr[this.config.findarr.length>1 ? this.config.countFind-1 : this.config.countFind][1]
            this.data[row][col].text=this.data[row][col].text.replaceAll(this.prevtext,this.newText)
            this.config.countFind-=1
            this.config.findarr.splice(this.config.countFind,1)
            let final = {}
            final[this.data[this.ending.row][0]['text']] = {}
            final[this.data[this.ending.row][0]['text']][this.keyList[this.ending.col]]  = this.newText
            console.log(final);
            let rep = JSON.stringify(final)
            console.log(rep);
            fetch(`/api/Main/Update?SheetId=${this.sheetId}`,
                {method:"PATCH",headers:{"Content-Type":"application/json"},body:rep}
            )
            .then(response =>{
                if(this.data[this.starting.row][this.starting.col]){
                    this.data[this.starting.row][this.starting.col]['text'] = this.newText;
                }
                console.log(response);
            })
            .catch(err =>{
                throw err;
            })
        }
        else{
            window.alert("No Element Found")
        }
        if (!this.marchloop){
            window.requestAnimationFrame(()=>this.table());
        }
        this.headers()
        this.rows()
    }
    
    //drag find and replace div
    /**
     * To move the find and replace box Down is on the header of the box move and up pointer are on window
     * @param {PointerEvent} edown - default e event
     */
    findPointerDown(edown){
        edown.preventDefault()
        var oLeft = edown.pageX - this.findDiv.getBoundingClientRect().x
        var oTop  = edown.pageY - this.findDiv.getBoundingClientRect().y
        // console.log(oLeft,oTop);
        /**
         * pointer move event to move the find and replace box
         * @param {PointerEvent} emove - default e event
         */
        let findPointerMove = (emove) =>{
            // console.log("triggerd");
            this.findDiv.style.top = emove.pageY - oTop +"px"
            // console.log(this.findDiv.style.left,this.containerdiv.clientWidth);
            this.findDiv.style.left = emove.pageX - oLeft +"px"
            // this.findDiv.style.right = emove.pageX + oLeft
            // this.findDiv.style.bottom = emove.pageY + oTop
        }
        window.addEventListener("pointermove",findPointerMove)
        /**
         * pointer up event for moving find and replace box
         */
        let findPointerUp = () =>{
            if (Number(this.findDiv.style.top.replace("px",""))<=0 ){this.findDiv.style.top = "10%"}
            else if (Number(this.findDiv.style.left.replace("px",""))<=0 ){this.findDiv.style.left = "10%"}
            else if (Number(this.findDiv.style.left.replace("px",""))>=this.containerdiv.clientWidth-100){this.findDiv.style.left="80%"}
            else if (Number(this.findDiv.style.top.replace("px",""))>=this.containerdiv.clientHeight-100){this.findDiv.style.top="80%"}
            window.removeEventListener("pointermove",findPointerMove)
            window.removeEventListener("pointerup",findPointerUp)
            // eup.target.removeEventListener("pointerdown",(e)=>{this.findPointerDown(e)})
        }
        window.addEventListener("pointerup",findPointerUp)
    }
    //graph function
    /**
     * calculates the value of the graph (avg)
     * @param {{String}} type - the type of graph that needs to be created
     */
    graph(type){
        // if(this.config.drawgraph)this.config.drawgraph.destroy()
        let dataarr=[]
        let arr=new Set()
        let singlecol = 0
        let sum = 0
        let count = 0
            for (let i=Math.min(this.starting.col,this.ending.col) ; i<=Math.max(this.ending.col,this.starting.col);i++){
                for (let j=Math.min(this.starting.row,this.ending.row);j<=Math.max(this.ending.row,this.starting.row);j++){
                    // console.log(sum);
                    // console.log(j,i);
                    if (this.data[j] && this.data[j][i] && Number(this.data[j][i].text)){
                        sum+=Number(this.data[j][i].text)
                        count+=1
                        arr.add(Sheet.headerdata(i))
                        singlecol+=1
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
        // console.log(arr);
        if (arr.size == 1){
            let c = [singlecol][0]
            arr=new Set()
            dataarr=[]
            for (let i=Math.min(this.starting.row,this.ending.row);i<=Math.max(this.starting.row,this.ending.row);i++){
                if (this.data[i] && this.data[i][c] && Number(this.data[i][c].text)){
                    dataarr.push(Number(this.data[i][c].text))
                    // count+=1
                    arr.add(i)
                }
            }
        }
        // console.log(dataarr);
        new Graphcomponent(dataarr,arr,type,this.childdiv) 
    }
}