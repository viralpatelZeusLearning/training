import {sheet} from './sheet.js'

let mainDiv = document.getElementById("maindiv")

let sheet_1 = new sheet(mainDiv)

// window.addEventListener("load",async (e)=>{
//     let data = await fetch("./tempData.json")
//     data = await data.json();
//     console.log(data);
// })