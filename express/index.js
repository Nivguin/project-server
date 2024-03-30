function tryCreateFile(dir,data){
    if(!fs.existsSync(dir)){
        fs.writeFileSync(dir,data,"utf-8")
    }
}
function tryCreateDir(dir){
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir)
    }
}
exports.express = async(port)=>{
    const fs = require("fs")
    const path = require("path")
    const express = require('express')
    const app = express()
    const cors = require("cors")

    app.use(cors())

    var ipBan = []
    app.use((req,res,next)=>{
        var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
        if(ipBan.includes(ip)){
            res.send("Go fuck yourself and stop fucking with my server, thanks.")
            return
        }
        console.log(ip+" : "+new Date()+" : "+req.url+" : "+req.headers.origin)
        next()
    })

    var projects = {}

    function getData(){
        projects = Object.assign(projects,JSON.parse(fs.readFileSync("./data/projects.json","utf-8")))
    }
    function setData(){
        fs.writeFileSync("./data/projects.json",JSON.stringify(projects),"utf-8")
    }
    setInterval(()=>{
        getData()
        setData()
        // console.log("fetching data")
    },3000)
    getData()
    
    app.use((req,res,next)=>{
        if(req.path.startsWith("/projectFile/")){
            try{
                let file = /(^(\w+)\.(pm)p?$)/.exec(req.path.replace("/projectFile/","").replaceAll("/",""))[0]
                // console.log(file)
                if(!fs.existsSync("./data/projects/"+file)){
                    throw new Error("Project file: '"+file+"' doesn't exist.")
                }
                // console.log("E")
                let fileData = fs.readFileSync(path.resolve("./data/projects/"+file))
                res.setHeader('Content-Type', 'application/zip');
                res.send(fileData)
            }catch(err){
                console.warn(err)
                res.status(404)
                res.json({error:true,message:"Failed to get project :/"})
            }
        }
        next()
    })

    app.get('/', (req, res) => {
      res.send('Hello World!')
    })

    app.get('/project',(req,res)=>{
        try{
            let project = projects.projects[parseFloat(req.query.id)-1]
            if(typeof(project)=="undefined"){
                res.status(404)
                res.json({error:true,message:"Project ID doesn't exist!"})
            }
            res.status(200)
            res.json(project)
        }catch(err){
            console.warn(err)
        }
    })

    app.get('/projects',(req,res)=>{
        res.json(projects.projects.filter(e=>e.public==true))
    })

    app.get("/uploadPage",(req,res)=>{
        res.sendFile(path.resolve("./express/public/upload.html"))
    })

    var sessions = {}
    const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

    app.get("/code",(req,res)=>{
        let sessionId = genRanHex(32)
        while(sessions[sessionId]){
            sessionId = genRanHex(32)
        }
        sessions[sessionId] = {}
        let code = genRanHex(6)
        while(Object.values(sessions).find(e=>e.code==code&&typeof(e.username)=="undefined")){
            code = genRanHex(8)
        }
        sessions[sessionId].code = code
        
        res.send(code)
    })

    
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
}
