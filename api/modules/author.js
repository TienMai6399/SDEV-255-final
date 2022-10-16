const jwt = require("jsonwebtoken");
const jwtSecret = "jwtSecret18051999";
 
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
 
module.exports = async function (request, result, next) {
    try {
        const accessToken = request.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(accessToken, jwtSecret);
        const studentId = decoded.studentId;
 
        const student = await db.collection("students").findOne({
            accessToken: accessToken
        });
 
        if (student == null) {
            result.status(401).json({
                status: "error",
                message: "User has been logged out."
            });
            return;
        }
 
        delete student.password;
        delete student.accessToken;
        delete student.createdAt;
 
        request.student = student;
        next();
    } catch (exp) {
        result.status(401).json({
            status: "error",
            message: "User has been logged out."
        });
    }
};