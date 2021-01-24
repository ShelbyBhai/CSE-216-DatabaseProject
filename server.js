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
// app.get("/student/tutorials", (req, res) => {
//   res.render("tutorials");
// });

app.get("/student/tutorials/:stdId/:subId", (req, res) => {
  const client = new Client();
  client
    .connect()
    .then(() => {
      //console.log("1234567898888");
      const sql = `(select * from public."Videos" where "Videos"."Id" in (select "Is_Contained_In"."Tutorial_Id" from "Is_Contained_In" where "Is_Contained_In"."Subject_Id" = $1)) union (select "Description", "Link", "Id" from public."Articles" where "Articles"."Id" in (select "Is_Contained_In"."Tutorial_Id" from "Is_Contained_In" where "Is_Contained_In"."Subject_Id" = $1))`;
      const params = [req.params.subId];
      return client.query(sql, params);
    })
    .then(result => {
      console.log(result.rowCount, result.rows);
      res.render("tutorials",{
        //Learner_Id: req.params.Learner_Id,
        tutorials: result.rows
      });
    })
    .catch(err => {
      console.error("Error: ", err);
      res.status(500).send("Something Bad Happened!");
    });
});


app.get("/student/login", (req, res) => {
  res.render("student-login");
});

// app.post("/student/exam/:Learner_Id/:Subject_Id/:Question_Id", (req, res) => {
//   console.log("Ids: ", req.params);
//   console.log("Ids: ", req.body);
//   const client = new Client();
//   client
//     .connect()
//     .then(() => {
//       console.log("Connection complete!");
//       const sql = `select "Question_Answer"
//       from "Questions"
//       where "Subject_Id" = $1 and "Question_Id" = $2;`;
//       const params=[req.params.Subject_Id, req.params.Question_Id];
//       return client.query(sql, params);
//     })
//     .then(result => {
//       console.log(result.rowCount, result.rows);
      
//       if(result == req.body.userAns) {
        
//         // client
//         // .connect()
//         // .then(() => {
//         //   console.log("Connection complete!");
//           const sql2 = `INSERT INTO public."Evaluation"(
//             "Learner_Id", "Question_Id", "Is_Correct", "Learner_Answer")
//             VALUES ($1, $2, 'YES', $3);`;
//           const params2 = [req.params.Learner_Id ,req.params.Question_Id, req.body.userAns];
//           return client.query(sql2, params2)
//           // })
//         .then(() => {
//           client
//           .connect()
//           .then(() => {
//             console.log("Connection complete!");
//             const sql = `select *
//             from "Questions"
//             where "Subject_Id" = $1;`;
//             const params=[req.params.Subject_Id];
//             return client.query(sql, params);
//         })
//         .then(result => {
//           console.log("result", result);
//           return res.render("student-exam-page",{
//             Student_Id: req.params.Learner_Id,
//             Subject_Id: req.params.Subject_Id,
//             subjects: result.rows,
//             right: 1
//           });
//         });
//       });
//       } else {
//         const client2 = Client();
//         // client2
//         //   .connect()
//         //   .then(() => {
//             console.log("Connection complete!");
//             const sql = `select *
//             from "Questions"
//             where "Subject_Id" = $1;`;
//             const params=[req.params.Subject_Id];
//             return client2.query(sql, params)
//         // })
//         .then(result => {
//           console.log("result", result);
//           return res.render("student-exam-page",{
//             Student_Id: req.params.Learner_Id,
//             Subject_Id: req.params.Subject_Id,
//             subjects: result.rows,
//             wrong: 1
//           }); });
//       }
//     })
//     .catch(err => {
//       console.error("Error: ", err);
//       res.status(500).send("Something Bad Happened!");
//     });
// });

app.post("/student/exam/:Learner_Id/:Subject_Id/:Question_Id", async (req, res) => {
  console.log("Ids: ", req.params);
  console.log("Ids: ", req.body);
  const client = new Client();
  await client.connect();
  const sql = `select "Question_Answer"
      from "Questions"
      where "Subject_Id" = $1 and "Question_Id" = $2;`;
  const params=[req.params.Subject_Id, req.params.Question_Id];
  const rightAns = await client.query(sql, params);
  console.log(rightAns.rowCount, rightAns.rows);
  const sql2 = `select *
            from "Questions"
            where "Subject_Id" = $1;`;
  const params2=[req.params.Subject_Id];
  const ques = await client.query(sql2, params2);
  
  console.log(ques.rowCount, ques.rows);
      
    if(rightAns.rows[0].Question_Answer == req.body.userAns) {

      const sql3 = `INSERT INTO public."Evaluation"(
        "Learner_Id", "Question_Id", "Is_Correct", "Learner_Answer")
        VALUES ($1, $2, 'YES', $3);`;
      const params3 = [req.params.Learner_Id ,req.params.Question_Id, req.body.userAns];
      client.query(sql3, params3);

        return res.render("student-exam-page",{
          Student_Id: req.params.Learner_Id,
          Subject_Id: req.params.Subject_Id,
          subjects: ques.rows,
          right: 1
        });
    } else {
      return res.render("student-exam-page",{
        Student_Id: req.params.Learner_Id,
        Subject_Id: req.params.Subject_Id,
        subjects: ques.rows,
        wrong: 1
      });

    }
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
      console.log(result.rowCount, result.rows);
      if (result.rowCount == 0) {
        console.log("Wrong UserId!");
        res.redirect("/student/login");
      } else {
        console.log("User Logged In!");
        res.redirect(`/student/${req.body.Learner_Id}`);
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
      const params = [
        req.body.Learner_Id,
        req.body.Learner_Name,
        req.body.Password
      ];
      return client.query(sql, params);
    })
    .then(result => {
      console.log(result.rowCount, result.rows);

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
      const params = [req.body.Teacher_id, req.body.Password];
      return client.query(sql, params);
    })
    .then(result => {
      console.log(result.rowCount, result.rows);
      if (result.rowCount == 0) {
        console.log("Wrong UserId!");
        res.redirect("/teacher/login");
      } else {
        console.log("User Logged In!");
        res.redirect(`/teacher/${req.body.Teacher_id}`);
      }
    })
    .catch(err => {
      console.error("Error: ", err);
      res.status(500).send("Something Bad Happened!");
    });
});

app.get("/teacher/signup", (req, res) => {
  res.render("teacher-signup");
});

app.post("/teacher/signup", (req, res) => {
  console.log("post body", req.body);

  const client = new Client();
  client
    .connect()
    .then(() => {
      console.log("Connection complete!");
      const sql = `INSERT INTO public."Teacher" ("Teacher_Id", "Teacher_Name", "Password") VALUES ($1, $2, $3);`;
      const params = [
        req.body.Teacher_Id,
        req.body.Teacher_Name,
        req.body.Password
      ];
      return client.query(sql, params);
    })
    .then(result => {
      console.log(result.rowCount, result.rows);

      console.log("User Signed Up!");
      res.redirect("/");
    })
    .catch(err => {
      console.error("Error: ", err);
      res.status(500).send("Something Bad Happened!");
    });
});

app.get("/student/exam/:stdId/:subId", (req, res) => {
  console.log("Ids: ", req.params);
  const client = new Client();
  client
    .connect()
    .then(() => {
      console.log("Connection complete!");
      const sql = `select *
      from "Questions"
      where "Subject_Id" = $1;`;
      const params=[req.params.subId];
      return client.query(sql, params);
    })
    .then(result => {
      console.log(result.rowCount, result.rows);
      res.render("student-exam-page",{
        Student_Id: req.params.stdId,
        Subject_Id: req.params.subId,
        subjects: result.rows
      });
    })
    .catch(err => {
      console.error("Error: ", err);
      res.status(500).send("Something Bad Happened!");
    });
});

app.get("/teacher/:Teacher_Id", (req, res) => {
  console.log("Teacher Id: ", req.params.Teacher_Id);
  const client = new Client();
  client
    .connect()
    .then(() => {
      console.log("Connection complete!");
      const sql = `select "Learner_Id","Progress" from "Joins" where "Joins"."Teacher_Id" = $1`;
      const params=[req.params.Teacher_Id];
      return client.query(sql, params);
    })
    .then(result => {
      console.log(result.rowCount, result.rows);
      res.render("teacher-page",{
        Teacher_Id: req.params.Teacher_Id,
        subjects: result.rows
      });
    })
    .catch(err => {
      console.error("Error: ", err);
      res.status(500).send("Something Bad Happened!");
    });
  });

  

///////////// new codes
app.get("/student/:Learner_Id", (req, res) => {
  const client = new Client();
  client
    .connect()
    .then(() => {
      console.log("Connection complete!");
      const sql = `SELECT * FROM "Subject"`;
      return client.query(sql);
    })
    .then(result => {
      console.log(result.rowCount, result.rows);
      res.render("student-page",{
        Learner_Id: req.params.Learner_Id,
        subjects: result.rows
      });
    })
    .catch(err => {
      console.error("Error: ", err);
      res.status(500).send("Something Bad Happened!");
    });
});

app.get("/student/progress/:stdId", (req, res) => {
  console.log("in Get /student/progress/:stdId", req.body);
  
  const client = new Client();
  client
    .connect()
    .then(() => {
      console.log("Connection complete!");
      const sql = `select V."Class_Id" ,s."Subject_Name",j."Progress"
      from "KHAN_ACADEMY".public."Virtual_Classroom" as V,"KHAN_ACADEMY".public."Subject" as s,"KHAN_ACADEMY".public."Joins" j
      where V."Teacher_Id"=j."Teacher_Id" and s."Subject_Id"=V."Subject_Id" and j."Learner_Id"=$1;`;
      const params = [req.params.stdId];
      return client.query(sql,params);
    })
    .then(result => {
      console.log(result.rowCount, result.rows);
      res.render("student-progress-page",{
        Learner_Id: req.params.stdId,
        subjects: result.rows
      });
    })
    .catch(err => {
      console.error("Error: ", err);
      res.status(500).send("Something Bad Happened!");
    });
});
///////////////
/*app.get("/student/tutorials", (req, res) => {
  const client = new Client();
  client
    .connect()
    .then(() => {
      console.log("1234567898888");
      const sql = `SELECT * FROM "is_Contained_in"`;
      return client.query(sql);
    })
    .then(result => {
      console.log(result.rowCount, result.rows);
      res.render("tutorials",{
        //Learner_Id: req.params.Learner_Id,
        tutorials: result.rows
      });
    })
    .catch(err => {
      console.error("Error: ", err);
      res.status(500).send("Something Bad Happened!");
    });
});
*/

///////////////////

const port = process.env.PORT | 3000;
app.listen(port, () => {
  console.log(`Listening to port: ${port}...`);
});
