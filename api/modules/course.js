const { ObjectID } = require("bson");
const { ObjectId } = require("mongodb");
const author = require("./author");

module.exports = {

    init: function (app, express) {
        const router = express.Router();
        router.post("/fetch", author, async function (request, result) {
            const course = await db.collection("courses").find({}).toArray();

            result.json({
                status: "success",
                message: "Course has been fetched.",
                courses: course
            });
        }),
            router.post("/cart", author, async function (request, result) {
                const student = request.student
                const cart = await db.collection("cart").find({
                    studentid: ObjectID(student._id)
                }).toArray();


                result.json({
                    status: "success",
                    message: "Course has been fetched.",
                    carts: cart
                });
            }),
            router.post("/add", author, async function (request, result) {
                const subject = request.fields.subject;
                const course = request.fields.course;
                const title = request.fields.title;
                const instructor = request.fields.instructor;
                const credits = request.fields.credits;
                const coursedes = request.fields.coursedes;

                await db.collection("courses").insertOne({
                    subject: subject,
                    course: course,
                    title: title,
                    instructor: instructor,
                    credits: credits,
                    coursedes: coursedes
                });


                result.json({
                    status: "success",
                    message: "Course has been added."
                });
            });
        router.post("/addtocart", author, async function (request, result) {
            const courseid = request.fields.courseid;
            const student = request.student;
            const cour = await db.collection("courses").findOne({
                _id:  ObjectID(courseid)
            });
            await db.collection("cart").insertOne({
                studentid: student._id,
                courseid: cour._id,
                subject: cour.subject,
                course: cour.course,
                title: cour.title,
                instructor: cour.instructor,
                credits: cour.credits,
                coursedes: cour.coursedes
            });



            result.json({
                status: "success",
                message: "Course has been added to cart."
            });
        });
        router.post("/delete", author, async function (request, result) {
            const cartid = request.fields.cartid;        
            await db.collection("cart").deleteOne({
                _id: ObjectID(cartid)
            
            });
         
            result.json({
                status: "success",
                message: "Course has been deleted."
            });
        });
        router.post("/deletecourse", author, async function (request, result) {
            const courseid = request.fields.courseid;        
            await db.collection("courses").deleteOne({
                _id: ObjectID(courseid)
            
            });
         
            result.json({
                status: "success",
                message: "course has been deleted."
            });
        });

        app.use("/course", router);
    }
};