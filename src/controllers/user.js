const User = require("../models/user");
exports.signup = (req, res) => {
    User.findOne({email: req.body.email}, function(error, userFound) {
        if(error) {
            console.log(error);
        } 
        if (userFound) {
            console.log("found");
            res.status(200).json({
                message: "user already exists."
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
                username : Math.random().toString()
            })

            _user.save((err, data) => {
                if(err) {
                    return res.status(400).json({
                        message: "something went wrong"
                    })
                }
                if(data) {
                    return res.status(201).json({
                        message: "user created successfully."
                    })
                }
            })
        }
    });
}

