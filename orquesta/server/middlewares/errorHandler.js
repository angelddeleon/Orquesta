const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    console.log(next)
    res.status(500).json({ message: "Algo salió mal en el servidor" });
};

module.exports = errorHandler;