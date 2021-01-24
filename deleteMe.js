const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
require("dotenv").config();

const app = express();

const mustache = mustacheExpress();
mustache.cache = null;
app.engine("mustache", mustache);
app.set("view engine", "mustache");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

// app.get("/books", (req, res) => {
//   const client = new Client();
//   client
//     .connect()
//     .then(() => {
//       console.log("Connection complete!");
//       return client.query(`SELECT * FROM "Virtual_Classroom"`);
//     })
//     .then(results => {
//       console.log("results: ", results);
//       res.render("book-list", {
//         books: results.rows
//       });
//     })
//     .catch(err => {
//       console.error("Error: ", err);
//       res.status(500).send("Something Bad Happened!");
//     });
// });

// app.get("/book/add", (req, res) => {
//   res.render("book-form");
// });

// app.post("/book/add", (req, res) => {
//   console.log("post body", req.body);

//   const client = new Client();
//   client
//     .connect()
//     .then(() => {
//       console.log("Connection complete!");
//       const sql = "INSERT INTO books (title, authors) VALUES ($1, $2)";
//       const params = [req.body.title, req.body.authors];
//       return client.query(sql, params);
//     })
//     .then(result => {
//       console.log("result: ", result);
//       res.redirect("/books");
//     })
//     .catch(err => {
//       console.error("Error: ", err);
//       res.status(500).send("Something Bad Happened!");
//     });
// });

// app.post("/book/delete/:id", (req, res) => {
//   console.log("deleting id", req.params.id);

//   const client = new Client();
//   client
//     .connect()
//     .then(() => {
//       const sql = "DELETE FROM books WHERE book_id = $1;";
//       const params = [req.params.id];
//       return client.query(sql, params);
//     })
//     .then(results => {
//       console.log("delete results: ", results);
//       res.redirect("/books");
//     })
//     .catch(err => {
//       console.error("Error: ", err);
//       res.redirect("/books");
//     });
// });

// app.get("/book/edit/:id", (req, res) => {
//   const client = new Client();
//   client
//     .connect()
//     .then(() => {
//       const sql = "SELECT * FROM books WHERE book_id = $1;";
//       const params = [req.params.id];
//       return client.query(sql, params);
//     })
//     .then(results => {
//       if (results.rowCount === 0) {
//         res.redirect("/books");
//         return;
//       }

//       console.log("results: ", results);
//       res.render("book-edit", {
//         book: results.rows[0]
//       });
//     })
//     .catch(err => {
//       console.error("Error: ", err);
//       res.redirect("/books");
//     });
// });

// app.post("/book/edit/:id", (req, res) => {
//   const client = new Client();
//   client
//     .connect()
//     .then(() => {
//       const sql =
//         "UPDATE books SET title = $1, authors = $2 WHERE book_id = $3";
//       const params = [req.body.title, req.body.authors, req.params.id];
//       client.query(sql, params);
//     })
//     .then(results => {
//       console.log("update results", results);
//       res.redirect("/books");
//     })
//     .catch(err => {
//       console.error("Error: ", err);
//       res.redirect("/books");
//     });
// });

/// ********** route codes **********************

app.get("/student/login", (req, res) => {
  res.render("student-login");
});

app.post("/student/login", (req, res) => {
  console.log("post body", req.body);

  const client = new Client();
  client
    .connect()
    .then(() => {
      console.log("Connection complete!");
      const sql = `SELECT * FROM "Learners" WHERE "Learners"."Learner_Id" = $1 and "Learners"."Password" = $2`;
      const params = [req.body.Learner_Id, req.body.Password];
      return client.query(sql, params);
    })
    .then(result => {
      console.log("result: ", result);
      if(result.rowCount == 0) {
        console.log("Wrong UserId!");
        res.redirect("/student/login");
      } else {
        console.log("User Logged In!");
        res.redirect("/");
      }
    })
    .catch(err => {
      console.error("Error: ", err);
      res.status(500).send("Something Bad Happened!");
    });
});

app.get("/student/signup", (req, res) => {
  res.render("student-signup");
});

app.post("/student/signup", (req, res) => {
  console.log("post body", req.body);

  const client = new Client();
  client
    .connect()
    .then(() => {
      console.log("Connection complete!");
      const sql = `INSERT INTO public."Learners" ("Learner_Id", "Learner_Name", "Password") VALUES ($1, $2, $3);`;
      const params = [req.body.Learner_Id, req.body.Learner_Name, req.body.Password];
      return client.query(sql, params);
    })
    .then(result => {
      console.log("result: ", result);
      
      console.log("User Signed Up!");
      res.redirect("/");
    
    })
    .catch(err => {
      console.error("Error: ", err);
      res.status(500).send("Something Bad Happened!");
    });
});


app.get("/teacher/login", (req, res) => {
  res.render("teacher-login");
});

app.post("/teacher/login", (req, res) => {
  console.log("post body", req.body);
  
  const client = new Client();
  client
  .connect()
  .then(() => {
    console.log("Connection complete!");
    const sql = `SELECT * FROM "Teacher" WHERE "Teacher"."Teacher_Id" = $1 and "Teacher"."Password" = $2`;
    const params = [req.body.Teacher_id  , req.body.Password];
    return client.query(sql, params);
  })
  .then(result => {
    console.log("result: ", result);
    if(result.rowCount == 0) {
      console.log("Wrong UserId!");
      res.redirect("/teacher/login");
    } else {
      console.log("User Logged In!");
      res.redirect("/");
    }
  })
  .catch(err => {
    console.error("Error: ", err);
    res.status(500).send("Something Bad Happened!");
  });
});

///////////// new codes
///////////////

const port = process.env.PORT | 3000;
app.listen(port, () => {
  console.log(`Listening to port: ${port}...`);
});
