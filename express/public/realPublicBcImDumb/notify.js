function createNotification(text,time){
    let el = document.createElement("div")
    el.classList.add("notification")
    el.textContent = text
    document.querySelector("#notifications").appendChild(el)
    setTimeout(()=>{
        el.style.opacity = 0
        setTimeout(()=>{
            el.remove()
        },1000)
    },time)
}