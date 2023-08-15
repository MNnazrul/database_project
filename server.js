const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 3000;
const path = require("path");
const bodyParser = require("body-parser");
const cntrlr = require("./controllers/controller");
const asyncHandler = require("express-async-handler");
const all = require("./services/service");
const { genSaltSync, hashSync, compareSync, compare } = require("bcrypt");
const pool = require("./config/dbconnection");

const app = express();
app.use(express.static("assets"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view-engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.post("/by", (req, res) => {});

app.get("/", (req, res) => {
    res.render("login.ejs");
});

app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

app.post("/registration", async (req, res) => {
    const body = req.body;
    console.log(body);

    if (body.password != body.confirm_password) res.redirect("/signup");
    else {
        all.find_user_by_email_or_username_from_registration(
            body,
            (err, results) => {
                if (err) res.redirect("/signup");
                else if (results) res.redirect("/signup");
                else {
                    body.password = hashSync(body.password, genSaltSync(10));
                    console.log(body.password);
                    all.insert_into_registration(body, (err, results) => {
                        if (err) res.redirect("/signup");
                        else if (!results) res.redirect("/signup");
                        else res.redirect("/");
                    });
                }
            }
        );
    }
});

// full_name: 'john doe',
//   user_name: 'john.doe',
//   email: 'admin@gmail.com',
//   phone: '01738430336',
//   address: 'Sylhet',
//   category: 'admin',
//   shop_category: 'Super Shop',
//   password: '1111',
//   confirm_password: '1111'

app.get("/users", (req, res) => {
    let rows;
    all.requested_users((err, result1) => {
        if (err) res.redirect("/dashboard");
        rows = result1;
        res.render("users.ejs", { rows });
    });
});

app.get("/addRow", (req, res) => {
    const receivedSerializedData = req.query.data;
    const body = JSON.parse(receivedSerializedData);
    console.log(body);
    all.delete_from_registration(body, (err, results) => {
        if (err) res.redirect("/users");
        else if (results) {
            all.insert_into_users(body, (err, result1) => {
                res.redirect("/users");
            });
        }
    });
});

app.post("/dashboard", (req, res) => {
    const body = req.body;

    console.log(body);
    console.log(body.role);

    all.find_user_by_email_from_users(body, (err, results) => {
        if (err || !results) res.redirect("/");
        else if (results) {
            const rstl = compareSync(body.password, results.password);
            if (!rstl) res.redirect("/");
            else res.render("dashboard.ejs");
        }
    });
});

app.listen(port, () => {
    console.log(`running at port ${port}`);
});
