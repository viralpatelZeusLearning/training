// import { Sheet } from "./sheet";

// class Graphcomponent{
//     constructor(){
        
//     }
//     graphContainer(){
//         this.graphdiv = document.createElement("div");
//         this.graphref = document.createElement("canvas")
//         this.graphdiv.classList.add("graphdiv");
//         this.graphref.classList.add("graphref");
//         this.childdiv.appendChild(this.graphdiv);
//         this.graphdiv.appendChild(this.graphref)
//         this.graphref.parentElement.style.display="block"
//         this.drawgraph = new Chart(this.graphref, {
//             type: 'pie',
//             data: {
//               labels: [...arr],
//               datasets: [{
//                 data: dataarr,
//                 borderWidth: 1
//               }]
//             },
//             options: {
//               scales: {
//                 y: {
//                   beginAtZero: true
//                 }
//               }
//             }
//         });
//     }
// }