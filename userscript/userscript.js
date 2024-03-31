// ==UserScript==
// @name         Nivguin Projects
// @namespace    https://nivguin.feds.contact
// @version      1.0.0
// @description  Adds nivguin projects to PenguinMod home page.
// @author       Unluckycrafter
// @match        https://penguinmod.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=penguinmod.com
// @grant        none
// @license GNU GPL
// ==/UserScript==

(function() {
    'use strict';

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
		npProjectContainer.style.cssText = `
			margin:0;
			padding:0;
			width:100%;
			height:100%;
			overflow-x:scroll;
			overflow-y:hidden;

			display: flex;
    		flex-direction: row;
		`
      np.appendChild(npProjectContainer)

      function addProject(link,name="Not available",author="Not available",img="https://http.cat/503"){
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
				margin-left:1vw;
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
 projectEl.querySelectorAll("a")[0].href=link

          projectEl.querySelectorAll("span")[0].textContent = author
          projectEl.querySelectorAll("span")[0].style.cssText = `
              font-size:1.2vmin;
          `

          npProjectContainer.appendChild(projectEl)
      }

      var data = await fetch("https://nivguin.feds.contact/api/projects")
      data = await data.json()
      data.forEach((e)=>{
        addProject("https://studio.penguinmod.com/?project_url="+encodeURIComponent("https://nivguin.feds.contact/projectFile/"+e.file),e.name,e.author)
      })

      projectSection.appendChild(np)
  })()
})();