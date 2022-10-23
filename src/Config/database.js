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
                    let insert = 'INSERT INTO users (name, email, phone, password) VALUES (?,?,?,?)'
                    db.run(insert, ["admin","admin@example.com", "48462763", md5("admin123456")])
                    db.run(insert, ["user","user@example.com", "46273873", md5("user123456")])
                }
            });
    }
});


module.exports = db