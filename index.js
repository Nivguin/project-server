var fs = require('fs')
function tryCreateFile(dir,data){
    if(!fs.existsSync(dir)){
        fs.writeFileSync(dir,data,"utf-8")
        console.log(`Created file: "${dir}"`)
    }
}
function tryCreateDir(dir){
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir)
        console.log(`Created folder: "${dir}"`)
    }
}

(async()=>{
    tryCreateFile("./config.json",JSON.stringify({
        port:3000
    }))
    tryCreateDir("./data")
    tryCreateDir("./data/projects")
    tryCreateFile("./data/projects.json",JSON.stringify({
        projects:[]
    }))
    var config = JSON.parse(fs.readFileSync("./config.json","utf-8"))

    var express = require("./express/index.js")
    console.log(express)
    try{
        await express.express(config.port)
    }catch(err){
        console.warn(err)
    }
})()