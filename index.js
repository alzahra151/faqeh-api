require("dotenv").config();
const port = process.env.PORT || 3000;
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./models");
const routes = require("./routes");
const bodyParser=require('body-parser')
//const translationMiddleware = require("./translations");
const ErrorHandler = require("./middleware's/errorHandler");
const bcrypt = require('bcrypt')
const { compareSync } = require("bcrypt")
// create app
const app = express();
app.use(cors());
app.use(helmet());
app.use(cookieParser());

app.set(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
 app.use(bodyParser.json());
//app.use(translationMiddleware);

app.use(routes);

app.use("*", (req, res, next) => {
    const error = new Error("METHOD NOT ALLOWED!!");
    next(error);
    // next(throw nee Er)
});

app.use(ErrorHandler);
// create server***
const server = http.createServer(app);

async function connectToDatabase() {
    try {
        await db.sequelize.authenticate();
        await db.sequelize.sync({ force: false, alter: true });
        console.log("database connected successfully");
    } catch (error) {
        console.log("error during connecting to database");
        console.log(error);
        server.close();
    }
}
async function hashEmployeePassword(employee) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds, "a"); // Generates salt synchronously
    employee.password = bcrypt.hashSync(employee.password, salt); // Hashes password synchronously
    return employee;
}

(async () => {
    const employee = { password: "alzahra123" };
    console.log(employee.password)
    const hashedEmployee = await hashEmployeePassword(employee);
    const verfiypassword = await compareSync(JSON.stringify(employee.password), hashedEmployee.password)
    console.log(hashedEmployee.password ,verfiypassword) ; // Prints hashed password
})();

server.listen(port, "0.0.0.0", () => {
    console.log("application running");
    connectToDatabase();
});
