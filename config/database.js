if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://melcarniel:melgc123@ds215502.mlab.com:15502/vidjot-prod'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost:27017/vidjot-dev'}
}