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

var announceicon = document.querySelector(".announce")
var announcementlist = document.querySelector(".anouncement")
announceicon.addEventListener("click",()=>{
    announcementlist.dataset["state"] = announcementlist.dataset["state"]!=="clicked" ? "clicked" : "closed"
})
announceicon.addEventListener("mouseover" ,()=>{
    if(announcementlist.dataset["state"]==="closed"){
        announcementlist.dataset["state"]="open"
    }
})
announceicon.addEventListener("mouseleave",()=>{
    if(announcementlist.dataset["state"]==="open"){
        announcementlist.dataset["state"]="closed"
    }
})
var notifyicon = document.querySelector(".notifyicon")
var notifylist = document.querySelector(".notify")
notifyicon.addEventListener("click",()=>{
    notifylist.dataset["state"] = notifylist.dataset["state"]!=="clicked" ? "clicked" : "closed"
})
notifyicon.addEventListener("mouseover" ,()=>{
    if(notifylist.dataset["state"]==="closed"){
        notifylist.dataset["state"]="open"
    }
})
notifyicon.addEventListener("mouseleave",()=>{
    if(notifylist.dataset["state"]==="open"){
        notifylist.dataset["state"]="closed"
    }
})

import c from './data.json' with {type:"json"}
// console.log(c);
//          course data from json function
function createCourse(c){
    
    let contentCard = document.createElement("div");
    contentCard.classList.add("content-card")
    
    if (c.expired) {
        contentCard.dataset["expired"] = true;
    }

    let card = document.createElement("div");
    card.classList.add("card")
  
    let imgDiv = document.createElement("div");
    imgDiv.classList.add("image")
    let img = document.createElement("img")
    img.src = c.courseImg
    // img.alt = c.courseTitle
    imgDiv.appendChild(img)
    card.appendChild(imgDiv)
  
    let content = document.createElement("div")
    content.classList.add("content")
  
    let cardContent = document.createElement("div")
    cardContent.classList.add("card-content-head")
    if(c.favourite){cardContent.dataset["starred"]=true}
    let h = document.createElement("h3")
    h.textContent = c.courseTitle
    cardContent.appendChild(h)
   
    let starSpan = document.createElement("span")
    starSpan.classList.add("material-symbols-outlined")
    starSpan.textContent=("star")
    cardContent.appendChild(starSpan)
    content.appendChild(cardContent)
  
    let info = document.createElement("div")
    info.classList.add("info")
    let subjectGradeSpan = document.createElement("span")
    
    info.innerHTML = `<span>${c.subject}</span><span>|</span><span>Grade ${c.classGrade} <span>+${c.specialGrade}</span></span>`
    
  content.appendChild(info)
  
  let infoB = document.createElement("div")
  infoB.classList.add("info")
  if(c.units || c.lessons || c.topics){
    infoB.innerHTML=`
                            <span class="no">${c.units}</span>
                            <span>Units</span>
                            <span class="no">${c.lessons} </span>
                            <span>Lessons</span>
                            <span class="no">${c.topics} </span>
                            <span>Topics</span>
                        `
  }
   content.appendChild(infoB)
    let selection = document.createElement("select")
    selection.name = "class"
    selection.classList.add("class-selection")
    if(c.class){
      selection.innerHTML = `<option value="${c.class}">${c.class}</option>`
    }
    else{
      selection.innerHTML = `<option value="">No Classes</option>`
    }
    content.appendChild(selection)
    content.appendChild(document.createElement("br"))
   
    if(c.numberOfStudents || c.time){
      let studentsSchedule = document.createElement("span")
      // studentsSchedule.classList.add("students-schedule")
      if(c.numberOfStudents){studentsSchedule.innerHTML = studentsSchedule.innerHTML + `${c.numberOfStudents} students`}
      if(c.numberOfStudents && c.time){studentsSchedule.innerHTML = studentsSchedule.innerHTML + `<span>&#124;</span>`}
      if(c.time){studentsSchedule.innerHTML = studentsSchedule.innerHTML + `${c.time.startDate} - ${c.time.endDate}`}
     
      content.appendChild(studentsSchedule)
    }
    card.appendChild(content)
    
    let interactables = document.createElement("div")
    interactables.classList.add("content-icons")
    if(c.preview){contentCard.dataset["visible"]=true}
    if(c.manage){contentCard.dataset["calendar"]=true}
    if(c.grade){contentCard.dataset["shop"]=true}
    if(c.report){contentCard.dataset["chart"]=true}
    interactables.innerHTML = `<span class="material-symbols-outlined" ${c.preview ? '' : 'data-unstared'}>
                        <img src="../home-page/icons/icons/preview.svg">
                    </span>
                    <span class="material-symbols-outlined" ${c.manage ? '' : 'data-unstared'}>
                        <img src="../home-page/icons/icons/manage course.svg">
                    </span>
                    <span class="material-symbols-outlined" ${c.grade ? '' : 'data-unstared'}>
                        <img src="../home-page/icons/icons/grade submissions.svg">  
                    </span>
                    <span class="material-symbols-outlined chart-icon" ${c.report ? '' : 'data-unstared'}>
                        <img src="../home-page/icons/icons/reports.svg">
                    </span>`
    
    contentCard.appendChild(card)
    contentCard.appendChild(interactables)
   return contentCard;
}
c.course.forEach( (x)=>{
    // console.log(x);
    document.querySelector("main").appendChild(createCourse(x))
})
//   document.body.appendChild(createCourse(c.course[0]));
// document.body.appendChild(createCourse(course));
// console.log(createCourse(course))

//          announcement function

function createAnnouncementCard(c) {
    let container = `
      <div class="content" data-state=${c.new}><div><span>${
      c.name
    }</span><span></span></div><p>${c.content}</p>`;
    if (c.course) {
      container = container + `<span>Course: ${c.course}</span>`;
    }
    container = container + `<div>`;
    if (c.attachments) {
      container =
        container +
        `<span class="attachmentlogo"></span><span>${c.attachments} files attached</span>`;
    }
    container = container +`<span class="timestamp">${c.timestamp}</span></div>`
  
    let temp = document.createElement("div");
    temp.innerHTML = container;
    return temp.querySelector("div");
}
console.log(createAnnouncementCard(c.announcements[0]))
// document.querySelector(".anouncement").appendChild(createAnnouncementCard(c))
c.announcements.forEach((x)=>{
    document.querySelector(".anouncement").appendChild(createAnnouncementCard(x))
})

//          Notification function

function createNotificationCard(c) {
    let container = `
      <div class="content" data-state=${c.new}><div><span>${
      c.name
    }</span><span></span></div><p>${c.content}</p>`;
    if (c.course) {
      container = container + `<span>Course: ${c.course}</span>`;
    }
    container = container + `<div>`;
    if (c.attachments) {
      container =
        container +
        `<span class="attachments">${c.attachments}</span>`;
    }
    container = container + `<span class="timestamp">${c.timestamp}</span></div>`
  
    let temp = document.createElement("div");
    temp.innerHTML = container;
    return temp.querySelector("div");
}
console.log(createNotificationCard(c.notifications[0]))
// document.querySelector(".anouncement").appendChild(createAnnouncementCard(c))
c.notifications.forEach((x)=>{
    document.querySelector(".notify").appendChild(createNotificationCard(x))
})