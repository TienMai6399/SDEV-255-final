const express = require("express");
const { Server, request } = require("http");

const app = express();

const http = require("http").createServer(app);
var mongodb = require("mongodb");

var MongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectId;


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const expressFormidable = require("express-formidable");
app.use(expressFormidable());

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//const { userInfo } = require("os");
const author = require("./modules/author");
const jwtSecret = "jwtSecret18051999";
const course = require("./modules/course");


http.listen(process.env.PORT || 3000, function () {
    console.log("Server has been started at: " + (process.env.PORT || 3000));

    MongoClient.connect("mongodb://localhost:27017", function (error, client) {
        if (error) {
            console.error(error);
            return;
        }
        db = client.db("SDEV255");
        global.db = db;
        console.log("Database connected");
        course.init(app, express);


        app.post("/logout", author, async function (request, result) {
            const student = request.student
            await db.collection("students").findOneAndUpdate({
                _id: student._id
            }, {
                $set: {
                    accessToken: ""
                }
            })

            result.json({
                status: "success",
                message: "Logout successfully."
            })
        })


        app.post("/getUser", author, async function (request, result) {
            const student = request.student;
            result.json({
                status: "success",
                role: student.role,
                message: "Data has been fetched.",
                student: student
            })


        })

        app.post("/login", async function (request, result) {
            var email = request.fields.email;
            var password = request.fields.password;

            var student = await db.collection("students").findOne({
                email: email
            });
            if (student == null) {
                result.json({
                    status: "error",
                    message: "Email does not exists"
                });
                return;
            }
            bcrypt.compare(password, student.password, async function (error, isVerify) {
                if (isVerify) {
                    const accessToken = jwt.sign({
                        "studentID": student._id.toString()
                    }, jwtSecret);
                    await db.collection("students").findOneAndUpdate({
                        "email": email
                    }, {
                        $set: {
                            "accessToken": accessToken
                        }
                    });
                        result.json({
                            status: "success",
                            role: student.role,
                            message: "Login successfully",
                            accessToken: accessToken
                        });
                        return;


                }
                result.json({
                    status: "error",
                    message: "Password is not correct"
                })
            })
        });

        app.post("/registration", async function (request, result) {
            var firstname = request.fields.firstname;
            var lastname = request.fields.lastname;
            var email = request.fields.email;
            var password = request.fields.password;

            if (!firstname || !lastname || !email || !password) {
                result.json({
                    status: "error",
                    message: "Please enter all values"
                });
                return;
            }
            var student = await db.collection("students").findOne({
                email: email
            });

            if (student != null) {
                result.json({
                    status: "error",
                    message: "Email already exists"
                });
                return;
            }

            bcrypt.hash(password, 10, async function (error, hash) {
                await db.collection("students").insertOne({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: hash,
                    role: "student",
                    accessToken: "",
                });
                result.status(200).json({

                    status: "success",
                    message: "Student has been signed up"
                });

            });

        });
    });
});