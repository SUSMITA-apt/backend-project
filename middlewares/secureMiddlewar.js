const jwt = require('jsonwebtoken')


const securemiddleware = async (req, res) => {
    const token = req.headers.authorization
    if (!token) {
        return res.json({
            success: false,
            message: 'invalid token'
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
        if (err) {
            return res.json({
                success: false,
                message: 'token invalid!'
            })
        }

        let userid = decoded.id
        let existing = await User.findOne({ _id: userid })

        if (!existing) {
            return res.json({
                success: false,
                message: 'invalid token'
            })
        }
        next()
    })
}

module.exports = securemiddleware