// import jsonwebtoken
const jwt = require('jsonwebtoken')

const db = require('./db')

users = {
    1000: { acno: 1000, uname: "Ramu", password: "1000", balance: 5000, transaction: [] },
    1001: { acno: 1001, uname: "Raju", password: "1001", balance: 5000, transaction: [] },
    1002: { acno: 1002, uname: "Ravi", password: "1002", balance: 5000, transaction: [] }
}

const register = (acno, password, uname) => {

    return db.User.findOne({ acno }).then(user => {
        if (user) {
            return {
                statusCode: 401,
                status: false,
                message: "account already exists..please login!!"
            }
        }
        else {
            const newUser = new db.User({
                acno,
                uname,
                password,
                balance: 0,
                transaction: []
            })
            newUser.save()
            return {
                statusCode: 200,
                status: true,
                message: "account successfully created!!"
            }
        }
    })
}

const login = (acno, password) => {
    return db.User.findOne({
        acno,
        password
    }).then(user => {
        if (user) {
            currentAcno = acno
            currentUserName = user.uname

            // token generation
            const token = jwt.sign({
                currentAcc: acno
            }, 'supersecretkey123')

            return {
                statusCode: 200,
                status: true,
                message: "Login success",
                currentAcno,
                currentUserName,
                token
            }

        }

        return {
            statusCode: 401,
            status: false,
            message: "Invalid credentials"
        }

    })



}

const deposit = (acno, password, amt) => {
    let amount = parseInt(amt)
    return db.User.findOne({
        acno,
        password
    }).then(user => {
        if (user) {
            user.balance = user.balance + amount
            user.transaction.push({
                amount: amount,
                type: "Credit"
            })
            user.save()
            return {
                statusCode: 200,
                status: true,
                message: amount + " credited. new balance is:" + user.balance
            }
        }
        return {
            statusCode: 401,
            status: false,
            message: "invalid credentials"
        }
    })
}








// const deposite =(acno, password, amt) =>
// {
//     var amount = parseInt(amt)
//     let db=users
    
//         if (acno in db) {
//             if(password = db[acno]["password"])
//                 {
//                     db[acno]["balance"] = db[acno]["balance"] + amount
//                      db[acno].transaction.push({
//                          amount: amount,
//                          type: "Credit"
//                      })
//                      return{
//                         statusCode: 200,
//                         status: true,
//                         message: amount + " credited. new balance is:" + db[acno]["balance"]
//                      }
                     
                 
//              }
//              else{
//                 return {
//                     statusCode: 401,
//                     status: false,
//                     message: "incorrect password"
//                 } 
//              }

            
//         }else{
//             return{
//                 statusCode: 401,
//                 status: false,
//                 message: "account doesnot exists" 
//             }

//         }
// }






const withdraw = (req, acno, password, amt) => {
    let amount = parseInt(amt)
    return db.User.findOne({
        acno,
        password
    }).then(user => {
        if (req.currentAcc != acno) {
            return {
                statusCode: 401,
                status: false,
                message: "permission denied"
            }
        }
        if (user) {
            if (user.balance > amount) {
                user.balance = user.balance - amount
                user.transaction.push({
                    amount: amount,
                    type: "Debit"
                })
                user.save()
                return {
                    statusCode: 200,
                    status: true,
                    message: amount + " debited. new balance is:" + user.balance
                }
            }
            else {
                return {
                    statusCode: 401,
                    status: false,
                    message: "insufficient balance"
                }
            }
           
        }
        else{
            return {
                statusCode: 401,
                status: false,
                message: "invalid credentials"
            }  
        }
    })
}



const getTransaction = (req) => {
    acno=req.currentAcc
    return db.User.findOne({
        acno
    }).then(user=>{
    if (user) {
        return {
            statusCode: 200,
            status: true,
            transaction: user.transaction
        }
    }
    else {
        return {
            statusCode: 401,
            status: false,
            message: "invalid credentials"
        }
    }
})
}
const deleteAcc =  (acno)=>{
    return db.User.deleteOne({acno}).then(user=>{
     if (user)
     {
        return {
            statusCode: 200,
            status: true,
            message: "Account deleted successfully"
        }   
     }
     else{
        return {
            statusCode: 401,
            status: false,
            message: "request denied"
        }
     }
    })
}

// const deleteAcc = (acno) => {
  
//     return db.User.deleteOne({acno}).then(user=>{
//       if (user) {
//         return {
//           statusCode: 200,
//           status: true,
//           message:"Account Deleted Successfully!!"
//         }
//       } else {
//         return {
//           statusCode: 401,
//           status: false,
//           message: "Operation Denied"
//         }
//       }
//     })
//     }

//   exporting
module.exports = {
    register,
    login,
    deposit,
    withdraw,
    getTransaction,
    deleteAcc
}