exports.ValidacionSchema = (schema) => (req, res, next) => {
    try {
        const parsed = schema.parse(req.body);
        next();
    } catch (error) {
        console.log(error)
        const formattedErrors = error.errors.map(err => ({
            msg: err.message,  // Cambiar "err.msg" a "err.message"
        }));

        res.status(400).json({ errors: formattedErrors });
    }

}

