const express = require('express');
const router = express.Router();
const db = require("../Config/database.js");

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

// GET ALL TODO

router.get('/', (req, res) => {
    let sql = "SELECT * FROM todos";
    let params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({
                error: err.message});
            return;
        }
        res.json({
            message: "success",
            data: rows
        })
    });
});


// GET ALL TODOS THAT HAS STATUS = 3 (DONE)

router.get("/done/:user_id", (req, res, next) => {
    let sql = "SELECT * FROM todos WHERE status = 3 AND user_id = ?";
    let params = [req.params.user_id];
    db.all(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({
                error: err.message});
            return;
        }

        if (!row) {
            res.status(404).json({
                error: "Todo not found"});
            return;
        }
        res.json({
            message: "success",
            data: row
        })
    });
});

// GET TODO BY ID

router.get("/:user_id", (req, res, next) => {
    let sql = "SELECT * FROM todos WHERE user_id = ?";
    let params = [req.params.user_id];
    db.all(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({
                error: err.message});
            return;
        }

        if (!row) {
            res.status(404).json({
                error: "Todo not found"});
            return;
        }
        res.json({
            message: "success",
            data: row
        })
    });
});

//  CREATE NEW TODO

router.post("/new", (req, res, next) => {

    let errors = [];
    if (!req.body.title) {
        errors.push("No title specified");
    }
    if (!req.body.description) {
        errors.push("No description specified");
    }
    if (!req.body.status) {
        errors.push("No status specified");
    }
    if (!req.body.user_id) {
        errors.push("No user_id specified");
    }
    if (errors.length) {
        res.status(400).json({
            error: errors.join(",")});
        return;
    }

    let data = {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        user_id: req.body.user_id,
    }
    let sql ='INSERT INTO todos (title, description, status, user_id) VALUES (?,?,?,?)';
    let params = [data.title, data.description, data.status, data.user_id];

    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({
                error: err.message});
            return;
        }
        res.json({
            message: "success",
            data: data,
            id: this.lastID
        })
    });
});



// DELETE TODO

router.delete('/delete/:id', (req, res, next) => {
    db.get('SELECT * FROM todos WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            res.status(400).json({
                error: err.message});
            return;
        }
        if (!row) {
            res.status(404).json({
                error: "Todo not found"});
            return;
        }
        db.run('DELETE FROM todos WHERE id = ?', [req.params.id], (err, result) => {
            if (err) {
                res.status(400).json({
                    error: res.message});
                return;
            }
            res.json({
                message: `${row.title} deleted`,
                changes: this.changes
            })
        });
    });

});

module.exports = router;