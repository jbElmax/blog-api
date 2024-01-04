const jwt = require('jsonwebtoken');

const verifyJWT = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.sendStatus(401);

    const token = authHeader.split(' ')[1];
    jwt.verify(token,process.env.SECRET,
        (err,decoded)=>{
            if(err) return res.status(403).json('forbidden');
            next();
        }
    )
}

module.exports = {
    verifyJWT
};