(async()=>{
    let projectSection = document.querySelector(".section-projects")
      try{
          document.getElementById("nivguin_projects").remove()
      }catch{}
  let np = document.createElement("div")
      np.id = "nivguin_projects"
      np.style.cssText = `
          width:64vw;
          border-radius:10px;
          border:#595959 solid 1px;
          height:30vh;
          padding:0.5vw;
          margin-bottom:1vh;
      `
      let npHeader = document.createElement("strong")
      npHeader.textContent = "Nivguin Projects"
      np.appendChild(npHeader)
  
      let npBreak = document.createElement("hr")
      npBreak.style.border = "343434 1px solid"
      np.appendChild(npBreak)
  
      let npProjectContainer = document.createElement("div")
      np.appendChild(npProjectContainer)
  
      function addProject(name="Not available",author="Not available",img="https://http.cat/503"){
          let projectEl = document.createElement("div")
          projectEl.style.cssText = `
              border:#343434 1px solid;
              height:25vh;
              width:18vw;
              padding-left:1vw;
              padding-right:1vw;
              padding-bottom:0.5vh;
              padding-top:0.5vh;
              
              border-radius:5px;
          `
          projectEl.innerHTML = "<img src='https://http.cat/503'><a href='https://http.cat/404'>503</a><br><span>None</span>"
          projectEl.querySelectorAll("img")[0].style.cssText = `
              height:80%
              display:block;
              margin:auto;
              height:80%;
              width:100%;
          `
          projectEl.querySelectorAll("img")[0].src=img
          
          projectEl.querySelectorAll("a")[0].textContent = name
                  projectEl.querySelectorAll("a")[0].style.cssText = `
              font-size:2vmin;
          `
  
          projectEl.querySelectorAll("span")[0].textContent = author
          projectEl.querySelectorAll("span")[0].style.cssText = `
              font-size:1.2vmin;
          `
  
          npProjectContainer.appendChild(projectEl)
      }
  addProject("Cheese simulator","Unluckycrafter")
  
      projectSection.appendChild(np)
  })()