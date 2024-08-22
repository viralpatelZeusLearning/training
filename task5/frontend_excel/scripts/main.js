
import {Sheet} from './sheet.js'

export class Main{
    /**
     * @type {HTMLElement} option menu div
     */
    optionsdiv
    /**
     * @type {HTMLElement} it contains all sheet operations
     */
    sheetchange
    /**
     * @type {HTMLElement} Input feild of sheet div
     */
    sheetTabContainer
    /**
     * @type {HTMLElement} div to maintain multiple sheets tab
     */
    sheetsdiv
    /**
     * @type {Array<Sheet>} -array to maintain the number of sheets
     */
    sheets = []
    constructor(sheetcontainer){
        this.optionsdiv = document.createElement("div");
        this.optionsdiv.classList.add("options_menu")
        this.sheetcontainer = sheetcontainer
        this.sheetcontainer.appendChild(this.optionsdiv)
        this.sheetchange = document.createElement("div");
        this.sheetchange.classList.add("change_sheet");
        this.sheetchange.style.display="none"
        // let newbtn = document.createElement("button")
        // newbtn.textContent="+"
        // newbtn.addEventListener("click",()=>this.newSheet())
        let del = document.createElement("button")
        del.textContent="Remove File"
        del.addEventListener("click",()=>this.delSheet())
        let prev = document.createElement("button")
        prev.textContent="Prev File"
        prev.addEventListener("click",()=>this.prevSheet())
        let next = document.createElement("button")
        next.textContent="Next File"
        next.addEventListener("click",()=>this.nextSheet())

        let calc = document.createElement("button")
        calc.textContent="Calculate"
        let maths = this.calcaggregate()
        this.sheetcontainer.appendChild(maths)
        calc.addEventListener("click",()=>{
            //this.calcaggregate()
            this.recalc()
            maths.style.display="flex";graphdiv.style.display="none";textdiv.style.display="none";filediv.style.display="none";
            
        })
        let file = document.createElement("button")
        file.textContent="File"
        let filediv = this.fileOptionsdiv()
        filediv.style.display="flex"
        this.sheetcontainer.appendChild(filediv)
        let text = document.createElement("button")
        text.textContent="Text"
        let textdiv = this.textOptionsdiv()
        // textdiv.style.display="flex"
        this.sheetcontainer.appendChild(textdiv)

        let graph = document.createElement("button")
        graph.textContent="graph"
        let graphdiv = this.graphOptionsDiv()
        this.sheetcontainer.appendChild(graphdiv)

        text.addEventListener("click",()=>{
            textdiv.style.display="flex";graphdiv.style.display="none";maths.style.display="none";filediv.style.display="none";
        })

        graph.addEventListener("click",()=>{
            console.log(graphdiv.style.display);
            graphdiv.style.display="flex" ; textdiv.style.display="none";maths.style.display="none";filediv.style.display="none";
        })

        file.addEventListener("click",()=>{
            filediv.style.display="flex" ; textdiv.style.display="none";maths.style.display="none";graphdiv.style.display="none";
        })
        
        window.addEventListener("calcCustomEvent",()=>{
            this.recalc()
        })

        this.sheetTabContainer = document.createElement("div")
        this.sheetTabContainer.classList.add("sheetTabs")

        this.sheetsdiv = document.createElement("div")
        this.sheetsdiv.classList.add("sheets_Div")
        // let firstSheet = document.createElement("input")
        // firstSheet.classList.add("sheetTab")
        // firstSheet.value="Sheet 1";
        // firstSheet.setAttribute("readonly","")
        // firstSheet.setAttribute("data-current","")
        // firstSheet.setAttribute("data-index","0")

        // firstSheet.addEventListener("click",e=>this.sheetTabClickHandler(e))
        // firstSheet.addEventListener("dblclick",e=>this.sheetTabDoubleClickHandler(e))
        // firstSheet.addEventListener("keydown",e=>this.sheetTabKeyHandler(e))


        // this.sheetchange.appendChild(newbtn)
        this.sheetchange.appendChild(del)
        this.sheetchange.appendChild(prev)
        this.sheetchange.appendChild(next)
        this.sheetchange.appendChild(this.sheetsdiv)
        // this.sheetsdiv.appendChild(firstSheet)
        this.optionsdiv.appendChild(file)
        this.optionsdiv.appendChild(text)
        this.optionsdiv.appendChild(graph)
        this.optionsdiv.appendChild(calc)
        this.sheetcontainer.appendChild(this.sheetchange)

        // let sheet_1 = new Sheet(sheetcontainer)
        // this.sheets.push(sheet_1)
        // this.currentsheetIndex = 0
        // this.currsheet(0);
        // console.log(this.sheets[0].);
    }
    /**
     * current sheet index to load
     * @param {Number} i - current sheet index
     */
    currsheet(i){
        if(i>=0){
            this.sheets?.[this.currentsheetIndex]?.pagiantedandSheet?.remove()
            // this.sheetcontainer?.[0]?.remove()
            // console.log(this.sheets[i]);
            this.sheetcontainer.appendChild(this.sheets[i].pagiantedandSheet)
            // console.log(i,this.sheets);
            this.sheets[i].canvasize();
            this.sheets[i].rows();
            this.sheets[i].headers();
            this.sheets[i].table();
            this.currentsheetIndex = Number(i)
        }
    }
    /**
     * To add new sheets on add sheet button
     */
    newSheet(SheetId){
        let newSheet = new Sheet(SheetId)
        this.sheets.push(newSheet)
        this.currsheet(this.sheets.length -1)
        // console.log(this.sheets);
        let newSheetdiv = document.createElement("input")
        newSheetdiv.classList.add("sheetcontainer")
        newSheetdiv.setAttribute("readonly","")
        newSheetdiv.setAttribute("data-index",this.sheets.length-1)
        newSheetdiv.addEventListener("click",e=>this.sheetTabClickHandler(e))
        newSheetdiv.addEventListener("dblclick",e=>this.sheetTabDoubleClickHandler(e))
        newSheetdiv.addEventListener("keydown",e=>this.sheetTabKeyHandler(e))
        this.sheetsdiv.appendChild(newSheetdiv)
        let tab = this.sheetsdiv.querySelectorAll("input")
        tab[this.currentsheetIndex].click()
        // for(var i=0;i<this.sheets.length;i++){
        //     if(![...tab].map(x=>x.value).includes(`Sheet ${i+1}`)){
        //         break
        //     }
        // }
        // newSheetdiv.value=`Sheet ${i+1}`;
        newSheetdiv.value=`${SheetId}`
        this.sheetsdiv.scrollTo(this.sheetsdiv.scrollWidth,0)
    }
    /**
     * To delete sheet on remove sheet button
     */
    delSheet(){
        if (this.sheets.length>1){
            console.log(this.currentsheetIndex,"delete");
            this.sheets[this.currentsheetIndex].pagiantedandSheet.remove()
            this.sheets.splice(Number(this.currentsheetIndex),1)
            console.log(this.sheets);
            this.sheetsdiv.children[this.currentsheetIndex].remove()
            this.currsheet(this.currentsheetIndex-1)
            Array(...this.sheetsdiv.children).forEach((v,j)=>{
                // console.log(j);
                v.setAttribute("data-index",j)
            })
            this.sheetsdiv.querySelectorAll("input")[this.currentsheetIndex].click()
        }
        else{
            window.alert("There Should be atleast 1 sheet")
        }
    }
    /**
     * To move to previous sheet
     */
    prevSheet(){
        let tabs = this.sheetsdiv.querySelectorAll("input")
        tabs[this.currentsheetIndex].removeAttribute("data-current")
        if (this.currentsheetIndex>0){
            console.log(this.currentsheetIndex);
            this.currsheet(this.currentsheetIndex-1)
        }
        this.sheetsdiv.querySelectorAll("input")[this.currentsheetIndex].click()
    }
    /**
     * To move to next sheet 
     */
    nextSheet(){
        let tabs = this.sheetsdiv.querySelectorAll("input")
        tabs[this.currentsheetIndex].removeAttribute("data-current")
        if (this.currentsheetIndex<this.sheets.length-1){
            console.log(this.currentsheetIndex);
            this.currsheet(this.currentsheetIndex+1)
        }
        this.sheetsdiv.querySelectorAll("input")[this.currentsheetIndex].click()
    }
    /**
     * To move to sheet on the click
     * @param {PointerEvent} e 
     */
    sheetTabClickHandler(e){
        e.target.parentElement.querySelectorAll("input").forEach(t1=>{
            t1.removeAttribute("data-current")
            t1.setAttribute("readonly","")
          })
        e.target.setAttribute("data-current","true")
        this.currsheet(e.target.dataset["index"])
    }
    /**
     * To enable edit the sheet name
     * @param {PointerEvent} e 
     */
    sheetTabDoubleClickHandler(e){
        e.target.focus();
        e.target.removeAttribute("readonly")
    }
    /**
     * Enter to save the new name of the sheet
     * @param {KeyboardEvent} e 
     */
    sheetTabKeyHandler(e){
        if(e.key==="Enter"){
              e.target.setAttribute("readonly","")
        }
    }
    /**
     * function to wrap text in selected range
     */
    wraptextfeild(){
        // this.sheets[this.currentsheetIndex].wraptext()
        this.sheets[this.currentsheetIndex].wraprange()
        this.sheets[this.currentsheetIndex].canvasize();
        this.sheets[this.currentsheetIndex].rows();
        this.sheets[this.currentsheetIndex].headers();
        this.sheets[this.currentsheetIndex].table();
    }
    /**
     * Creates an graph options menu
     * @returns {HTMLElement} - provides an graph div
     */
    graphOptionsDiv(){
        this.graphOptions = document.createElement("div");
        this.graphOptions.classList.add("graphOptions")
        let bar = document.createElement("button")
        bar.classList.add("bar")
        bar.textContent="Bar"
        bar.addEventListener("click",()=>{
            this.sheets[this.currentsheetIndex].graph("bar")
        })
        let pie = document.createElement("button")
        pie.classList.add("pie")
        pie.addEventListener("click",()=>{
            this.sheets[this.currentsheetIndex].graph("pie")
        })
        pie.textContent="pie"
        let line = document.createElement("button")
        line.classList.add("line")
        line.textContent="Line"
        line.addEventListener("click",()=>{
            this.sheets[this.currentsheetIndex].graph("line")
        })
        let doughnut = document.createElement("button")
        doughnut.classList.add("doughnut")
        doughnut.textContent="doughnut"
        doughnut.addEventListener("click",()=>{
            this.sheets[this.currentsheetIndex].graph("doughnut")
        })
        this.graphOptions.appendChild(bar)
        this.graphOptions.appendChild(doughnut)  
        this.graphOptions.appendChild(pie)
        this.graphOptions.appendChild(line)
        
        return this.graphOptions
    }
    /**
     * To create an div for text options
     * @returns {HTMLElement} - text div options
     */
    textOptionsdiv(){
        this.textOptions = document.createElement("div");
        this.textOptions.classList.add("textOptions");

        let wrap = document.createElement("button")
        wrap.textContent="Wrap Text"
        wrap.addEventListener("click",()=>this.sheets[this.currentsheetIndex].wraprange())

        this.textOptions.appendChild(wrap)
        return this.textOptions
    }
    /**
     * To create a div for file upload option
     * @returns {HTMLElement} - upload file option
     */
    fileOptionsdiv(){
        this.fileOptions = document.createElement("div");
        this.fileOptions.classList.add("fileOptions");

        let fileUploadInput = document.createElement("input")
        fileUploadInput.type="file"
        fileUploadInput.accept=".csv"

        let fileName = document.createElement("form")
        fileName.classList.add("file")

        let search = document.createElement("button")
        search.classList.add("search_file")
        search.textContent="Search File"
        search.addEventListener("click",()=>{
            let searchPrompt = prompt("please Enter the File Name","fileName");
            if (searchPrompt != null){
                fetch(`/api/Status/findSheet?SheetId=${searchPrompt}`)
                .then(response =>response.text())
                .then(response => {
                    console.log(response);
                    if (response == "true"){
                        this.newSheet(searchPrompt);
                        this.sheetchange.style.display="flex"
                    }
                    else{
                        window.alert("Sheet Does not Exist")
                    }
                })
            }
        })

        let upload = document.createElement("button")
        upload.classList.add("Uploadfile")
        upload.textContent="Upload File"
        upload.addEventListener("click",(e)=>{
            e.preventDefault()
            let formuploadedfile = fileUploadInput.files[0];
            console.log(formuploadedfile)
            if (formuploadedfile !=null){
                let formData = new FormData();
                formData.append("file",formuploadedfile);
                console.log(formData);
                fetch('/api/Main/upload', {
                        method: 'POST',
                        body: formData
                        })
                        .then(response => {
                        if (response.ok) {
                            return response.text();
                        } else {
                            throw new Error('File upload failed');
                        }
                        })
                        .then(response=> {
                            let Pooling = setInterval(()=>{
                                fetch(`/api/Status/${response}`)
                                .then(response=>{
                                    if(response.ok){
                                        return response.text();
                                    }
                                    else{
                                        throw new Error("no Status")
                                    }
                                })
                                .then(data=>{
                                    console.log(data)
                                    if (data>=1){
                                        clearInterval(Pooling);
                                        this.newSheet(response)
                                        this.sheetchange.style.display="flex";
                                    }
                                })
                                .catch(err=>{
                                    console.log(err,"catch while status");
                                    clearInterval(Pooling);
                                })
                            },500)
                        })
                        // .then(data => {
                        // console.log('Server response:', data);
                        // })
                        .catch(error => {
                        console.error('Error uploading file:', error);
                        });
                }
            
            else{
                window.alert("Upload a file");
            }
        })
        this.fileOptions.appendChild(fileUploadInput);
        fileUploadInput.appendChild(fileName);
        this.fileOptions.appendChild(upload);
        this.fileOptions.appendChild(search);
        return this.fileOptions
    }
    /**
     * Creates an div to display aggregate values
     * @returns {HTMLElement} - aggregates function display div
     */
    calcaggregate(){
        this.calcOptions = document.createElement("div");
        this.calcOptions.classList.add("calcdiv");

        this.min = document.createElement("span")
        this.max = document.createElement("span")
        this.mean = document.createElement("span")
        this.sum = document.createElement("span")
        this.multiply = document.createElement("span")
        this.calcOptions.appendChild(this.min)
        this.calcOptions.appendChild(this.max)
        this.calcOptions.appendChild(this.mean)
        this.calcOptions.appendChild(this.sum)
        // this.calcOptions.appendChild(this.multiply)
        return this.calcOptions
    }
    //for calculation and call from sheets
    /**
     * Function to get values and display it
     */
    recalc(){
        if(!this.sheets[this.currentsheetIndex]){return}
        let val = this.sheets[this.currentsheetIndex].calculate()
        // console.log(this.sheets[this.currentsheetIndex]);
        this.min.textContent="Min:"+`${val?.[0] ? val[0] : "Null"}`
        this.max.textContent="Max:"+`${val?.[1] ? val[1] : "Null"}`
        this.mean.textContent="Mean:"+`${val?.[2] ? val[2] : "Null"}`
        this.sum.textContent="Sum:"+`${val?.[3] ? val[3] : "Null"}`
        // this.multiply.textContent="Multiply:"+`${val?.[4] ?val[4] : "Null"}`
    }
}