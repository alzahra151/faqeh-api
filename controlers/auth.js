
const db = require("../models")
const ApiError = require("../helpers/apiError")
const ApiResponser = require("../helpers/apiResponser")
const { compareSync } = require("bcrypt")
const jwt = require("jsonwebtoken")

async function register(req, res, next) {
    let  {
        name,
        password,
        email,
        mobile,
        role,
        photo,
        address,
        gender
    } = req.body
    try {
        if (req.file) photo = `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`

        const user = await db.User.create({
            name,
            password,
            email,
            mobile,
            role,
            photo,
            address,
            gender
        })
        return new ApiResponser(res, { user })
    } catch (err) {
        next(err)
    }
}
async function login(req, res, next) {
    const { mobile, password } = req.body

    console.log("body",req.body)
    try {
        const user = await db.User.findOne({ where: { mobile: mobile } })
        if (!user) {
            throw new ApiError({ 'mobile': "not Found User" }, 401)
        } else {
            console.log(password, user.password )
            const verfiypassword = await compareSync(password, user.password)
            console.log(verfiypassword)
            if (!verfiypassword) {
                throw new ApiError({ 'password': "wrong pass" }, 401)
            } else {
                const token = jwt.sign({ id: user.id, role: user.role, user_type: user.user_type }
                    , `${process.env.SECRET_KEY}`,
                    {
                        expiresIn: "10d"
                    })
                console.log(token)
                await res.cookie("access_token", `bearer ${token}` , {
                   maxAge: 1000 * 60 * 60 * 24 * 365,
                   httpOnly: true,
                   secure: false, // Only use secure cookies in production
                   sameSite: "strict",
                });
                return new ApiResponser(res, { token })
            }
        }
    } catch (err) {
        next(err)
    }
}
async function getAllUsers(req,res,next) {
    try {
        const users = await db.User.findAll()
        res.status(200).json(users)
     } catch (error) {
        next(error)
    }
}
module.exports = {
    register,
    login,
    getAllUsers
}