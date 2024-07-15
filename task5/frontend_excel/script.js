import {sheet} from './sheet.js'

let maindiv = document.querySelector("#mainDiv")
console.log(maindiv);
let sheet_1 = new sheet(maindiv)

// window.addEventListener("load",async (e)=>{
//     let data = await fetch("./tempData.json")
//     data = await data.json();
//     console.log(data);
// })