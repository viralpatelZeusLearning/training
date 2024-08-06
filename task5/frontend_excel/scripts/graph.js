// import { Sheet } from "./sheet";
// import "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.bundle.min.js"
// import Chart from "chart.js"
// import Chart from "https://cdn.jsdelivr.net/npm/chart.js"
// import Chart from "chart.js/auto"
// const Chart = await import ("https://cdn.jsdelivr.net/npm/chart.js")
import ("https://cdn.jsdelivr.net/npm/chart.js")
export class Graphcomponent{
  /**
   * @type {HTMLElement} - Main Graph Div
   */
  graphdiv
  /**
   * @type {HTMLCanvasElement} - graph canvas
   */
  graphref
  /**
   * @type {HTMLElement} - close button
   */
  closebtn
    /**
     * To create an graph
     * @param {Array <Number>} dataarr -array of avg of selected columns
     * @param {Array <string>} arr - array of labels
     * @param {string} type - type of graph
     * @param {HTMLElement} childdiv - parent element
     */
    constructor(dataarr,arr,type,childdiv){
        this.graphContainer(dataarr,arr,type,childdiv)
    }
    /**
     * To create an graph
     * @param {Array <Number>} dataarr -array of avg of selected columns
     * @param {Array <string>} arr - array of labels
     * @param {string} type - type of graph
     * @param {HTMLElement} childdiv - parent element
     */
    graphContainer(dataarr,arr,type,childdiv){
      this.graphdiv = document.createElement("div");
      this.graphref = document.createElement("canvas");
      this.closebtn = document.createElement("button")

      this.graphdiv.classList.add("graphdiv");
      this.graphref.classList.add("graphref");
      this.closebtn.classList.add("closebtn")
      this.closebtn.textContent="x"

      childdiv.appendChild(this.graphdiv);
      this.graphdiv.appendChild(this.graphref)
      this.graphdiv.appendChild(this.closebtn)
      this.graphref.parentElement.style.display="block"

      this.drawgraph = new window.Chart(this.graphref, {
          type: `${type}`,
          data: {
            labels: [...arr],
            datasets: [{
              data: dataarr,
              borderWidth: 1
            }]
          },
          options: {
              responsive:true,
              maintainAspectRatio:false,
            scales: {
              y: {
                beginAtZero: true
              }
            },
            plugins:{
              legend:{
                  display:type=="pie"?true:false
              }
            }
          }
      });
      this.graphref.addEventListener("pointerdown",(e)=>this.graphPointerDown(e))
      this.closebtn.addEventListener("click",()=>this.graphdiv.remove())
    }
    //graph move
    /**
     * To move the graph  using pointer function
     * @param {PointerEvent} edown - default event e
     */
    graphPointerDown(edown){
        edown.preventDefault()
        var oLeft = edown.pageX - this.graphdiv.getBoundingClientRect().x
        var oTop  = edown.pageY - this.graphdiv.getBoundingClientRect().y
        console.log(oLeft,oTop);
        // let heightOffset = this.graphdiv.parentElement.getBoundingClientRect().y
        /**
         * pointer move event for moving the graph
         * @param {PointerEvent} emove - default event
         */
        let graphPointerMove = (emove) =>{
            // console.log("triggerd");
            // var l = edown.pageX - this.graphdiv.getBoundingClientRect().x
            // var t  = edown.pageY - this.graphdiv.getBoundingClientRect().y
            // console.log(l,t);
            this.graphdiv.style.top = emove.pageY - oTop +"px"
            // console.log(this.graphdiv.style.top,this.containerdiv.clientWidth);
            this.graphdiv.style.left = emove.pageX - oLeft +"px"
            // this.findDiv.style.right = emove.pageX + oLeft
            // this.findDiv.style.bottom = emove.pageY + oTop
        }
        window.addEventListener("pointermove",graphPointerMove)
        /**
         * pointer up event for moving graph container
         */
        let graphPointerUp = () =>{
          if (Number(this.graphdiv.style.top.replace("px",""))<=0 ){this.graphdiv.style.top = "10%"}
          else if (Number(this.graphdiv.style.left.replace("px",""))<=0 ){this.graphdiv.style.left = "10%"}
          else if (Number(this.graphdiv.style.left.replace("px",""))>=document.body.clientWidth-100){this.graphdiv.style.left="80%"}
          else if (Number(this.graphdiv.style.top.replace("px",""))>=document.body.clientHeight-100){this.graphdiv.style.top="80%"}
            window.removeEventListener("pointermove",graphPointerMove)
            window.removeEventListener("pointerup",graphPointerUp)
            // eup.target.removeEventListener("pointerdown",(e)=>{this.findPointerDown(e)})
        }
        window.addEventListener("pointerup",graphPointerUp)
    }
}