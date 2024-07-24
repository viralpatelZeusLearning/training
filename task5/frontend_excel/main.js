import {Sheet} from './sheet.js'

export class Main{
    sheets = []
    constructor(sheetcontainer){
        this.optionsdiv = document.createElement("div");
        this.optionsdiv.classList.add("options_menu")
        this.sheetcontainer = sheetcontainer
        this.sheetcontainer.appendChild(this.optionsdiv)

        this.new = document.createElement("button")
        this.new.textContent="+"
        this.new.addEventListener("click",()=>this.newSheet())
        this.prev = document.createElement("button")
        this.prev.textContent="←"
        this.prev.addEventListener("click",()=>this.prevSheet())
        this.next = document.createElement("button")
        this.next.textContent="→"
        this.next.addEventListener("click",()=>this.nextSheet())
        this.wrap = document.createElement("button")
        this.wrap.textContent="Wrap Text"
        this.wrap.addEventListener("click",()=>this.wraptextfeild())
        this.calc = document.createElement("button")
        this.calc.textContent="Calculate"
        this.calc.addEventListener("click",()=>this.calcaggregate())
        this.min = document.createElement("span")
        this.max = document.createElement("span")
        this.mean = document.createElement("span")
        this.sum = document.createElement("span")

        this.optionsdiv.appendChild(this.new)
        this.optionsdiv.appendChild(this.prev)
        this.optionsdiv.appendChild(this.next)
        this.optionsdiv.appendChild(this.wrap)
        this.optionsdiv.appendChild(this.calc)
        this.optionsdiv.appendChild(this.min)
        this.optionsdiv.appendChild(this.max)
        this.optionsdiv.appendChild(this.mean)
        this.optionsdiv.appendChild(this.sum)

        let sheet_1 = new Sheet(sheetcontainer)
        this.sheets.push(sheet_1)
        this.currentsheetIndex = 0
        this.currsheet(0);
    }
    currsheet(i){
        if(i>=0){
            this.sheets[this.currentsheetIndex].containerdiv.remove()
            console.log(this.sheets[i]);
            this.sheetcontainer.appendChild(this.sheets[i].containerdiv)
            console.log(i,this.sheets);
            this.sheets[i].canvasize();
            this.sheets[i].rows();
            this.sheets[i].headers();
            this.sheets[i].table();
            this.currentsheetIndex = i
        }
    }
    newSheet(){
        let newSheet = new Sheet(this.sheetcontainer)
        this.sheets.push(newSheet)
        this.currsheet(this.sheets.length -1)
        console.log(this.sheets);
    }
    prevSheet(){
        if (this.currentsheetIndex>0){
            console.log(this.currentsheetIndex);
            this.currsheet(this.currentsheetIndex-1)
        }
    }
    nextSheet(){
        if (this.currentsheetIndex<this.sheets.length-1){
            console.log(this.currentsheetIndex);
            this.currsheet(this.currentsheetIndex+1)
        }
    }
    calcaggregate(){
        let val = this.sheets[this.currentsheetIndex].calculate()
        console.log(val[0]);
        this.min.textContent="Min:"+`${val[0]}`
        this.max.textContent="Max:"+`${val[1]}`
        this.mean.textContent="Mean:"+`${val[2]}`
        this.sum.textContent="Sum:"+`${val[3]}`
    }
    wraptextfeild(){
        // this.sheets[this.currentsheetIndex].wraptext()
        this.sheets[this.currentsheetIndex].wraprange()
        this.sheets[this.currentsheetIndex].canvasize();
        this.sheets[this.currentsheetIndex].rows();
        this.sheets[this.currentsheetIndex].headers();
        this.sheets[this.currentsheetIndex].table();
    }
}