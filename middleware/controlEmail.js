const validator = require('validator')

//Si l'utilisateur saissie un mail valide
module.exports = (req, res, next) => {
    const {email} = req.body;
    if(validator.isEmail(email)) next() 
    else res.status(400).json({error : `l'email ${email} est invalide`})
}