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
    var bodyParser = require('body-parser')
    const express = require('express')
    const app = express()
    const cors = require("cors")
    const fetch = require("node-fetch")
    var corsOptions = {
        origin : ['https://nivguin.feds.contact','https://penguinmod.com','https://studio.penguinmod.com'],
    }
    corsOptions.origin.push("https://base64.guru")



    app.use(cors(corsOptions))
    const nocache = require('nocache');
    app.use(nocache());
    app.use(bodyParser({limit: '6mb'}));

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

    var imageRegex = /^\/images\/(\w+\.(svg|png|jpg|jpeg|webm)$)/
    app.use((req,res,next)=>{
        try{
            if(imageRegex.test(req.path)==true){
                let pathh = path.resolve("express/public/images/"+imageRegex.exec(req.path)[1])
                if(fs.existsSync(pathh)){
                    res.sendFile(pathh)
                    return
                }
            }
        }catch(err){
            console.warn(err)
        }
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
        setData()
        // console.log(projects)
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
                return
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

    app.get('/api/project',(req,res)=>{
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
            res.status(500)
            res.json({error:true,message:"Something went wrong"})
        }
    })

    app.get('/api/projects',(req,res)=>{
        res.json(projects.projects.filter(e=>e.public==true))
    })

    app.get("/uploadPage",(req,res)=>{
        res.sendFile(path.resolve("./express/public/upload.html"))
    })
    app.get("/404",(req,res)=>{
        res.sendFile(path.resolve("./express/public/404.html"))
    })

    var sessions = {}
    var sessionCap = 100
    const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

    app.get("/api/code",(req,res)=>{
        try{
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
        res.json({code:code,id:sessionId})
        }catch(err){
            console.warn(err)
            res.status(500)
            res.json({error:true,message:"Something went wrong"})
        }
    })

    app.get("/api/auth",async (req,res)=>{
        try{
            if(!req.query.id){
                res.status(400)
                res.json({error:true,message:"Session ID wasn't given."})
                return
            }
            if(!sessions[req.query.id]){
                res.status(498)
                res.json({error:true,message:"Session ID is invalid or expired."})
                return
            }
            let data = await fetch("https://api.scratch.mit.edu/users/unluckycrafter/projects/992340601/comments")
            data = await data.json()
            for(let i = 0;i<(Object.keys(sessions).length+1);i++){
                if(typeof(data[i])=="undefined"){
                    res.status(498)
                    res.json({error:true,message:"Failed to find authorization code in comments."})
                    return
                }
                if(data[i].content.includes(sessions[req.query.id].code)){
                    sessions[req.query.id].username = data[i].author.username
                    res.json({error:false,message:"Authenticated as: '"+data[i].author.username+"' successfuly!"})
                    return
                }
            }

        }catch(err){
            console.warn(err)
            res.status(500)
            res.json({error:true,message:"Something went wrong"})
        }
        res.status(498)
        res.json({error:true,message:"Failed to find authorization code in comments."})
    })

    function minToMS(num){
        return num*60*1000
    }

    function flag(ip,url,reason){
        console.log(`IP: '${ip} flagged on url '${url}' for reason '${reason}'`)
    }

    function _decodeBase64ToUtf8(b64string) {
        var buffer;
        if (typeof Buffer.from === "function") {
            // Node 5.10+
            buffer = Buffer.from(b64string, 'base64');
        } else {
            // older Node versions
            buffer = new Buffer(b64string, 'base64');
        }
    
        return buffer;
    }

    var uploadLimit = {"ip":1234}
    var jsonParser = bodyParser.json()
    app.post("/api/share",jsonParser,(req,res)=>{
        var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        if(typeof(uploadLimit[ip])=="undefined"){
            uploadLimit[ip] = 0
            console.log(uploadLimit)
        }
        if(uploadLimit[ip]+minToMS(10)>=Date.now()){
            console.log(ip+" flagged for uploading projects to fast! ("+uploadLimit[ip]+minToMS(10)-Date.now()+" ms left.)")
            res.json({error:true,message:"You are sharing projects from your IP to fast! Please wait at least 10 minutes between uploads!"})
        }
        try{
            if(typeof(req.body.id)=="undefined"){
                res.status(400)
                res.json({error:true,message:"Session ID wasn't given."})
                return
            }
            if(typeof(req.body.file)=="undefined"){
                res.status(400)
                res.json({error:true,message:"You didn't provide a file!"})
                return
            }
            let id = req.body.id
            if(!sessions[id]){
                res.status(498)
                res.json({error:true,message:"Session ID is invalid or expired."})
                return
            }
            if(typeof(sessions[id].username)=="undefined"){
                res.status(401)
                res.json({error:true,message:"You haven't authenticated yet!"})
                return
            }
            if(req.body.name.length<=3||req.body.name.length>80){
                res.status(411)
                res.json({error:true,message:"Titles require at least 4 characters and no more than 80 characters"})
                return
            }
            if(req.body.description.length<=3||req.body.description.length>400){
                res.status(411)
                res.json({error:true,message:"Descriptions require at least 4 characters and no more than 400 characters"})
                return
            }
            if(/^data:application\/octet-stream;base64,(.+)$/.test(req.body.file)==false){
                flag(ip,req.url,"Managing to send an invalid file type despite client side validation.")
                res.status(400)
                res.json({error:true,message:"Invalid file!"})
                return
            }
            uploadLimit[ip] = Date.now()
            let projectFileId = (projects.projects.length+1)+genRanHex(5)
            let fileData = _decodeBase64ToUtf8(/^data:application\/octet-stream;base64,(.+)$/.exec(req.body.file)[1])
            let filePath = `./data/projects/${projectFileId}.pmp`
            fs.writeFileSync(filePath,fileData,"utf-8")
            projects.projects.unshift({
                "name":req.body.name,
                "author":sessions[id].username,
                "description":req.body.description,
                "date":Date.now(),
                "public":false,
                "file":projectFileId+".pmp",
                "img":"https://http.cat/503"
            })

            res.status(200)
            res.json({error:false,message:"Shared project succesfully!",file:projectFileId+'.pmp'})
            return
        }catch(err){
            console.warn(err)
            res.status(500)
            res.json({error:true,message:"Something went wrong"})
            return
        }
        res.status(500)
        res.json({error:true,message:"Server didn't supply response."})
    })
    



    //always should be last
    app.get('*', function(req, res){
        res.status(404);
        res.sendFile(path.resolve("./express/public/404.html"))
      });

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
}
