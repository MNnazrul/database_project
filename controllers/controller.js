const all = require("../services/service");
const express = require("express");
const app = express();

app.set("view-engine", "ejs");

const asyncHandler = require("express-async-handler");
const path = require("path");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");

const search_from_admin = async (body) => {
    // return null;
    all.find_user_by_email_from_admin(body, (err, results) => {
        if (err || !results) return null;
        console.log("controller : ", results);
        return results;
    });
};

const search_from_users = asyncHandler(async (req, res) => {
    const body = req.body;
    all.find_user_by_email_or_username_from_users(body, (err, results) => {
        if (err) res.redirect("/signup");
        if (results) res.redirect("/signup");
    });
    return res.render("/");
});

const cntrlr = {
    search_from_admin,
    search_from_users,
};

module.exports = cntrlr;
