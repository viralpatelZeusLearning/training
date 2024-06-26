var menuBtn = document.querySelector("#m-icon")
var dropDown = document.querySelector("#drop-down")

menuBtn.addEventListener("click",()=>{
    dropDown.dataset["state"] = dropDown.dataset["state"]==="closed" ? "open" : "closed"
}
)
