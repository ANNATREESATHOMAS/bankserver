const express= require('express')
const dataService= require('./services/data.serives')
const jwt = require('jsonwebtoken')
const cors=require('cors')

const app=express()
// app.get('/',(req,res)=>{
//     res.status(401).send("get request");
// })
// app.post('/',(req,res)=>{
//     res.send("post request")
// })
// app.put('/',(req,res)=>{
//     res.send("put request")
// })
// app.patch('/',(req,res)=>{
//     res.send("patch request")
// })
// app.delete('/',(req,res)=>{
//     res.send("delete request")
// })
// convert from json format to normal form
app.use(cors({
    origin:'http://localhost:4200'
}))

app.use(express.json())

// middleware application specific method 1
app.use((req,res,next)=>{
    console.log("application specific middleware");
    next()
})

// middleware application specific method 2
const logMiddleware=(req,res,next)=>{
    console.log("application specific middleware");
        next()
}
app.use(logMiddleware)

// Bank app
const jwtMiddleware=(req,res,next)=>{
    try{
        const token=req.headers["x-access-token"]
        const data=jwt.verify(token,'supersecretkey123')
        req.currentAcc=data.currentAcc
        next()
    }catch{
        res.json({
            statusCode:401,
            status:false,
            message:"please login first"
        })
    }
}
// register API

app.post('/register',(req,res)=>{
    dataService.register(req.body.acno,req.body.password,req.body.uname).then(result=>{ 
    res.status(result.statusCode).json(result)
})
})
// login API
app.post('/login',(req,res)=>{
    dataService.login(req.body.acno,req.body.password).then(result=>{
    res.status(result.statusCode).json(result)
})
})
app.post('/deposit',jwtMiddleware,(req,res)=>{
    dataService.deposit(req.body.acno,req.body.password,req.body.amt).then(result=>{
        res.status(result.statusCode).json(result)
    })
})


app.post('/withdraw',jwtMiddleware,(req,res)=>{
    dataService.withdraw(req,req.body.acno,req.body.password,req.body.amt).then(result=>{
        res.status(result.statusCode).json(result)
    })
})
app.post('/getTransaction',jwtMiddleware,(req,res)=>{
    dataService.getTransaction(req).then(result=>{
        res.status(result.statusCode).json(result)
    })
})

// app.delete('/deleteAcc/:acno',jwtMiddleware,(req,res)=>{
//     dataService.deleteAcc(req.params.acno).then(result=>{
//         res.status(result.statusCode).json(result)
//     })
// })


app.delete('/deleteAcc/:acno', jwtMiddleware, (req, res) => {
    dataService.deleteAcc(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})

app.listen(3000,()=>{
    console.log("server started at 3000")
})






// app.post('/deposite',(req,res) => {
//     const result= dataService.deposite(req.body.acno,req.body.password,req.body.amt)
//     res.status(result.statusCode).json(result)
// })
   
