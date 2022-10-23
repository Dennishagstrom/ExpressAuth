const express = require('express');
const router = express.Router();
const db = require("../Config/database.js");
const md5 = require("md5");

router.use(express.json())
router.use(express.urlencoded({ extended: true }))


// GET ALL USERS

router.get("/users", (req, res, next) => {
    let sql = "SELECT * FROM users"
    let params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({
                error:err.message});
            return;
        }
        res.json({
            message: "success",
            data: rows
        })
    });
});

// GET USER BY ID

router.get("/user/:id", (req, res, next) => {
    let sql = "SELECT * FROM users WHERE id = ?"
    let params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({
                error:err.message});
            return;
        }
        if (!row) {
            res.status(404).json({"error":"User not found"});
            return;
        }
        res.json({
            message:"success",
            data: row
        })
    });
});

// REGISTER NEW USER

router.post("/register", (req, res, next) => {
    let errors=[]
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (!req.body.phone){
        errors.push("No phone specified");
    }
    if (errors.length){
        res.status(400).json({
            error:errors.join(",")});
        return;
    }
    let data = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password : md5(req.body.password)
    }
    let sql ='INSERT INTO users (name, email, phone, password) VALUES (?,?,?,?)'
    let params =[data.name, data.email, data.phone, data.password]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            message: "success",
            data: data,
            id: this.lastID
        })
    });
})

// UPDATE USER

router.patch("/user/:id", (req, res, next) => {
    let data = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password : req.body.password ? md5(req.body.password) : null
    }
    db.run(
        `UPDATE users set
           name = COALESCE(?,name), 
           email = COALESCE(?,email), 
           phone = COALESCE(?,phone),
           password = COALESCE(?,password) 
           WHERE id = ?`,
        [data.name, data.email, data.phone, data.password, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({
                    error: res.message})
                return;
            }
            res.json({
                message: `Updated user ${data.name} successfully`,
                data: data,
                changes: this.changes
            })
        });
})

// DELETE USER

router.delete("/delete/:id", (req, res, next) => {

    db.get(`SELECT * FROM users WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) {
            res.status(400).json({
                error: err.message});
            return;
        }
        if (!row) {
            res.status(404).json({
                error: "User not found"});
            return;
        }
        db.run(`DELETE FROM users WHERE id = ?`, req.params.id, function (err, result) {
            if (err){
                res.status(400).json({
                    error: res.message})
                return;
            }
            res.json({
                message: `User ${row.name} deleted successfully`})
        });
    }
)});



// USER LOG-IN

router.post("/authenticate", (req, res, next) => {
    let errors=[]

    if (!req.body.password){
        errors.push("No password specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (errors.length){
        res.status(400).json({
            error: errors.join(",")});
        return;
    }

    let sql = `SELECT * FROM users WHERE email = "${req.body.email}" AND password = "${md5(req.body.password)}"`
    let isAuth = false;
    db.all(sql, function (err, rows) {
        if (err) {
            res.status(400).json({
                error: err.message});
            return;
        }

        rows.forEach((row) => {
            if (row.email === req.body.email && row.password === md5(req.body.password)) {
                isAuth = true;
            }
            if (isAuth) {
                res.json({
                    message: "success",
                    data: row
                })
            }
        });
        if(!isAuth) {
            res.status(400).json({
                error: "Invalid username or password"});
        }

    });
});

module.exports = router;
