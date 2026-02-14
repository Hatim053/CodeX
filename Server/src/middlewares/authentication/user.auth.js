import admin from '../../firebase/admin.config.js';


async function authenticateUser(req , res , next) {
    const authHeader = req.headers.authorization;
    if(!authHeader?.startsWith("Bearer ")) {
        return res
        .status(401)
        .json({
            status : 401,
            message : 'token not provided',
        })
    }
    const tokenId = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(tokenId);
        req.user = decoded;
        next();
    } catch (error) {
        return res
        .status(401)
        .json({
            status : 401,
            message : 'user authentication failed',
            error : error,
        })
    }
}


export default authenticateUser;