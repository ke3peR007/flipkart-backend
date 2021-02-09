const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const user = require("../../models/user");
exports.signup = (req, res) => {
    User.findOne({email: req.body.email}, function(error, userFound) {
        if(error) {
            console.log(error);
        } 
        if (userFound) {
            console.log("found");
            res.status(200).json({
                message: "Admin already exists."
            });
        }
        else {
            const {firstName, 
            lastName,
            email,
            password,} = req.body;
            const _user = new User({
                firstName,
                lastName,
                email,
                password,
                username : Math.random().toString(),
                role: "admin"
            })

            _user.save((err, data) => {
                if(err) {
                    return res.status(400).json({
                        message: "something went wrong"
                    })
                }
                if(data) {
                    return res.status(201).json({
                        message: "Admin created successfully."
                    })
                }
            })
        }
    });
}



exports.signin = (req, res) => {
    User.findOne({email: req.body.email}, function(err, userFound) {
        if(err) {
            return res.status(400).json({
                message: err
            });
        }
        if(userFound) {

            if(userFound.authenticate(req.body.password) && userFound.role === "admin") {
                const token = jwt.sign({_id: userFound._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
                const {
                    _id,
                    firstName, 
                    lastName, 
                    email,
                    role, 
                    fullName} = userFound;
                res.status(200).json({
                    token,
                    user: {
                        _id,
                        firstName,
                        lastName,
                        email,
                        role,
                        fullName
                    }
                });
                
            } else {
                return res.status(400).json({
                    message: "invalid password"
                })
            }


        } else {
            return res.status(400).json({
                message: "something went wrong!"
            })
        }
    });
}


exports.requireSignin = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
    
}