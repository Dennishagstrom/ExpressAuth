const sqlite3 = require('sqlite3').verbose()
const md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Error opening the database
        console.error(err.message)
        throw err
    }else{
        console.log('Connected to the SQLite database.')

        // CREATE USERS TABLE

        db.run(`CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name varchar, 
            email varchar UNIQUE,
            phone varchar,
            password text, 
            CONSTRAINT email_unique UNIQUE (email)
            )`,
            (err) => {
                if (err) {
                    // Table already exists
                }else{
                    // Create rows into table
                    let insertUser = 'INSERT INTO users (name, email, phone, password) VALUES (?,?,?,?)'
                    db.run(insertUser, ["Dennis","dennis@gait.no", "46462841", md5("test123")])
                    db.run(insertUser, ["Linus","linus@gait.no", "41310939", md5("test456")])
                }
            });

        // CREATE TODOS TABLE

        db.run(`CREATE TABLE todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                title varchar, 
                description varchar,
                status INTEGER,
                FOREIGN KEY (user_id) REFERENCES users (id)
                )`,
                (err) => {
                    if (err) {
                        // Table already exists
                    } else {
                        // Table just created, creating some rows
                        let insertTodo = 'INSERT INTO todos (user_id, title, description, status) VALUES (?,?,?,?)'
                        db.run(insertTodo, [1, "Todo 1", "Todo 1 description", 1])
                        db.run(insertTodo, [1, "Todo 2", "Todo 2 description", 2])
                        db.run(insertTodo, [2, "Todo 3", "Todo 3 description", 3])

                    }
                });
    }
});




module.exports = db