const express = require('express');
const router = express.Router();
const db = require("../Config/database");
const md5 = require("md5");

router.use(express.json())
router.use(express.urlencoded({ extended: true }))


router.get("/users", (req, res, next) => {
    let sql = "select * from user"
    let params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

router.get("user/:id", (req, res, next) => {
    let sql = "select * from user where id = ?"
    let params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":row
        })
    });
});

router.post("/user", (req, res, next) => {
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
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    let data = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password : md5(req.body.password)
    }
    let sql ='INSERT INTO user (name, email, phone, password) VALUES (?,?,?,?)'
    let params =[data.name, data.email, data.phone, data.password]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

router.delete("/user/:id", (req, res, next) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", rows: this.changes})
        });
});

module.exports = router;