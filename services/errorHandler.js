function errorHandler (err, req, res, next) {
    logger.error(`Error Logged ${err.message}`)
    res.status(500)
    res.render('error', { error: err })
}

//export modules
module.exports = {
    errorHandler
}