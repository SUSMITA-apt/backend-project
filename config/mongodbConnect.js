const mongoose = require('mongoose')

const mongodbConnect = ()=>{
    return mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log('Mongodb Connected!')
    })
}

module.exports = mongodbConnect;