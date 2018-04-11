var jwt = require('jsonwebtoken');

var Utils = {
   verifyToken: verifyToken,

}

 function verifyToken(token) {

    try {
        return jwt.verify(token, AuthService.JWT_SECRET_KEY);
    } catch (err) {
        console.error(err);
        return false;
    }
}
