


const errorHandler = (err, req, res, next) => {
    return res.status(400).send(err)
}

export default errorHandler