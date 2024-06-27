var menuBtn = document.querySelector("#m-icon")
var dropDown = document.querySelector("#drop-down")

menuBtn.addEventListener("click",()=>{
    dropDown.dataset["state"] = dropDown.dataset["state"]!=="clicked" ? "clicked" : "closed"
}
)
menuBtn.addEventListener("mouseover",()=>{
    if(dropDown.dataset["state"]==="closed"){
        dropDown.dataset["state"]="open"
    }
}
)
menuBtn.addEventListener("mouseleave",()=>{
    if(dropDown.dataset["state"]==="open"){
        dropDown.dataset["state"]="closed"
    }
}
)

var menu= document.querySelector('.menu')
menu.addEventListener('click',(e)=>{
    v= document.querySelectorAll('.menu li')
    v.forEach( x=> {
        x.removeAttribute("data-current")
    });
    e.target.dataset["current"]=""
})

var smallMenuContainer= document.querySelector('.menu-list')
let smallLis = smallMenuContainer.querySelectorAll("&>li")
// console.log(smallLis)
smallLis.forEach(li => {
    li.addEventListener("click", (e) => {
        if(li.dataset["current"]){
            li.removeAttribute("data-current");
            
            let innerul = li.querySelector("&>ul")
            if (innerul){
                innerul.style.height = "0px";
            }
            return;
        }
        smallLis.forEach(x => {
            x.removeAttribute("data-current");
            let y = x.querySelector("ul")
            if(y){
                y.style.height = "0px";
            }
            
        })
        let child = li.querySelector("ul");
        if(child){
            child.style.height = (child.scrollHeight * 2) + "px";
            // child.style.height = child.sectionHeight +"px"
        }
        li.setAttribute("data-current","true");
    })
})


