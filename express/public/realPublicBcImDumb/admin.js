(async()=>{
    document.getElementById("verifyProject").addEventListener("click",async()=>{
        createNotification("Opening Scratch project...",2000)
        window.open("https://scratch.mit.edu/projects/992340601/")
    })
    
    let codeEl = document.querySelector("#code")
    let code = await fetch("./api/code")
    code = await code.json()
    console.log(code)
    codeEl.textContent = code.code
    codeEl.innerHTML+=`<img src="./images/copy.svg" id="copyButton">`
    document.getElementById("copyButton").addEventListener("click",async()=>{
        navigator.clipboard.writeText(code.code)
        createNotification("Copied code to clipboard!",1000)
    })
    
    document.getElementById("hide").style.display="none"
    document.querySelector("#verifyButton").addEventListener("click",async()=>{
        createNotification("Authenticating...",1000)
        let auth = await fetch("./api/auth?id="+encodeURIComponent(code.id))
        auth = await auth.json()
        console.log(auth)
    
        createNotification(auth.message,2000)
        if(auth.error==true){
            return;
        }
        document.getElementById("hide").style.display="inline"
    })

    document.querySelector("#refreshLog").onclick = async()=>{
        let auth = await fetch("./api/log?id="+encodeURIComponent(code.id))
        auth = await auth.text()
        document.querySelector("#log").value = auth
    }
})()
