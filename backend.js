var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');
var cors = require('cors');

var db = require('mysql');
var connection = db.createConnection({
  user: 'root',
  password: 'Springfield1911',
  host: 'localhost',
  database: 'priismad_finalproject'
});

var app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(function(req, res, next) {
  if (req.headers.authorization) {
    var accId = jwt.decode(req.headers.authorization, 'final');
    if (typeof accId.accountId === 'number') {
      req.accountId = accId.accountId;
    } else {
      req.accountId = null;
    }
  }
  next();
});



app.post('/Signup', function(req, res) {
  var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(9));
    connection.query('INSERT INTO Accounts (name, email, password) VALUES ("' + req.body.name + '", "' + req.body.email + '", "' + hash + '")', function(err, result) {
      if (err) {
        console.log(err);
      }
      if (!result || result.length === 0) {
        res.status(404).send();
      }
      var payload = {
        accountId: result.insertId
      };
      var secret = 'final';
      res.send(jwt.encode(payload, secret));
    });
});

app.post('/Login', function(req, res) {
  connection.query('SELECT * FROM Accounts WHERE Accounts.email="' + req.body.email + '"', function(err, result) {
    if (err) {
      console.log(err);
    }
    if (!result || result.length === 0) {
      res.status(404).send();
    } else if (bcrypt.compareSync(req.body.password, result[0].password)){
      var payload = {
        accountId: result[0].id
      };
      var secret = 'final';
      res.send(jwt.encode(payload, secret));
    } else {
      res.status(404).send();
    }
  });
});

// get requests
app.get('/Projects', function(req, res) {
  connection.query('SELECT * FROM Projects WHERE Projects.accountId="' + req.accountId + '"', function(err, result) {
    if (err) {
      console.log(err);
    } else if (!result || result.length === 0) {
      res.send([]);
    } else {
      res.send(result);
    }
  });
});

app.get('/Projects/:id', function(req, res) {
  connection.query('SELECT * FROM Projects WHERE Projects.id="' + req.params.id + '" AND Projects.accountId="' + req.accountId + '"', function(err, result) {
    if (err) {
      console.log(err);
    } else if (!result || result.length === 0) {
      res.status(404).send();
      console.log("no result")
    } else {
      res.send(result[0]);
    }
  });
});

app.get('/Projects/:projectId/Tasks', function(req, res) {
  connection.query('SELECT Tasks.id as id, Tasks.projectId as projectId, Tasks.task as task, Tasks.priority as priority, Tasks.completed as completed, Projects.description as description FROM Tasks JOIN Projects ON Tasks.projectId=Projects.id WHERE Tasks.projectId="' + req.params.projectId + '" AND Projects.accountId="' + req.accountId + '"', function(err, result) {
    if (err) {
      console.log(err);
    }
    if (!result) {
      res.status(404).send();
    } else if (result.length === 0) {
      res.send([]);
    } else {
      res.send(result);
    }
  });
});

app.get('/Tasks/:taskId/Todo', function(req, res) {
  connection.query('SELECT * FROM Todo JOIN Tasks on Todo.tasksId=Tasks.id JOIN Projects ON Tasks.projectId=Projects.id WHERE Projects.accountId="' + req.accountId + '" AND Todo.tasksId="' + req.params.taskId + '"', function(err, result) {
    if (err) {
      console.log(err);
    }
    if (!result || result.length === 0) {
      res.status(404).send();
    } else {
      res.send(result);
    }
  });
});

app.get('/Projects/:projectId/Hours', function(req, res) {
  connection.query('SELECT * FROM Hours JOIN Projects ON Hours.projectId=Projects.id WHERE Projects.accountId="' + req.accountId + '" AND Hours.projectId="' + req.params.projectId + '"', function(err, result) {
    if (err) {
      console.log(err);
    }
    if (!result || result.length === 0) {
      res.status(404).send();
    } else {
      res.send(result);
    }
  });
});

app.get('/Projects/:projectId/NetExpense', function(req, res) {
  connection.query('SELECT * FROM NetExpense JOIN Projects ON NetExpense.projectId=Projects.id WHERE Projects.accountId="' + req.accountId + '" AND NetExpense.projectId="' + req.params.projectId + '"', function(err, result) {
    if (err) {
      console.log(err);
    }
    if (!result || result.length === 0) {
      res.send([]);
    } else {
      res.send(result);
    }
  });
});

app.get('/Projects/:projectId/ExternalDocs', function(req, res) {
  connection.query('SELECT * FROM ExternalDocs JOIN Projects ON ExternalDocs.projectId=Projects.id WHERE Projects.accountId="' + req.accountId + '" AND ExternalDocs.projectId="' + req.params.projectId + '"', function(err, result) {
    if (err) {
      console.log(err);
    }
    if (!result || result.length === 0) {
      res.status(404).send();
    } else {
      res.send(result);
    }
  });
});

app.get('/Projects/:projectId/Notes', function(req, res) {
  connection.query('SELECT Projects.id as projectId, Notes.id as noteId, Notes.text as text FROM Notes JOIN Projects ON Notes.projectId=Projects.id WHERE Notes.projectId="' + req.params.projectId + '" AND Projects.accountId="' + req.accountId + '"', function(err, result) {
    if (err) {
      console.log(err);
    }
    if (!result || result.length === 0) {
      res.status(404).send();
    } else {
      console.log(result);
      res.send(result);
    }
  });
});
// post requests
app.post('/accounts', function(req, res) {
  connection.query('INSERT INTO Accounts (name, email, password) VALUES ("' + req.body.name + '", "' + req.body.email + '", "' + req.body.password + '")', function(err, result) {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.post('/Projects', function(req, res) {
  connection.query('INSERT INTO Projects (accountId, name, description, budget) VALUES ("' + req.accountId + '", "' + req.body.name + '", "' + req.body.description + '", "' + req.body.budget + '")', function(err, result) {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.post('/Projects/:projectId/Tasks', function(req, res) {
  console.log(req.accountId);
  connection.query('SELECT * FROM Projects WHERE Projects.accountId="' + req.accountId + '" AND Projects.id="' + req.params.projectId + '"', function(err, resultAuth) {
    console.log(resultAuth);
    if (err) {
      console.log(err);
    }
    if (resultAuth.length === 0) {
      res.status(404).send();
    } else {
      connection.query('INSERT INTO Tasks (projectId, task, priority) VALUES ("' + req.params.projectId + '", "' + req.body.task + '", "' + req.body.priority + '")', function(err, result) {
        if (err) {
          console.log(err);
        }
        res.send(result);
      });
    }
  });
});

app.post('/Tasks/:taskId/Todo', function(req, res) {
  connection.query('SELECT * FROM Tasks JOIN Projects ON Tasks.projectId=Projects.id WHERE Projects.accountId="' + req.accountId + '" AND Tasks.id="' + req.params.taskId + '"', function(err, resultAuth) {
    if (err) {
      console.log(err);
    }
    if (resultAuth.length === 0) {
      res.status(404).send();
    } else {
      connection.query('INSERT INTO Todo (tasksId, task, notes) VALUES ("' + req.params.taskId + '", "' + req.body.task + '", "' + req.body.notes + '")', function(err, result) {
        if (err) {
          console.log(err);
        }
        res.send(result);
      });
    }
  });
});

app.post('/Projects/:projectId/Hours', function(req, res) {
  connection.query('SELECT * FROM Projects WHERE Projects.accountId="' + req.accountId + '" AND Projects.id="' + req.params.projectId + '"', function(err, resultAuth) {
    if (err) {
      console.log(err);
    }
    if (resultAuth.length === 0) {
      res.status(404).send();
    } else {
      connection.query('INSERT INTO Hours (projectId, workerName, hours, completed) VALUES ("' + req.params.projectId + '", "' + req.body.workerName + '", "' + req.body.hours + '", "' + req.body.completed + '")', function(err, result) {
        if (err) {
          console.log(err);
        }
        res.send(result);
      });
    }
  });
});

app.post('/Projects/:projectId/NetExpense', function(req, res) {
  connection.query('SELECT * FROM Projects WHERE Projects.accountId="' + req.accountId + '" AND Projects.id="' + req.params.projectId + '"', function(err, resultAuth) {
    if (err) {
      console.log(err);
    }
    if (resultAuth.length === 0) {
      res.status(404).send();
    } else {
      connection.query('INSERT INTO NetExpense (projectId, expense, amount, payTo, notes) VALUES ("' + req.params.projectId + '", "' + req.body.expense + '", "' + req.body.amount + '", "' + req.body.payTo + '", "' + req.params.notes + '")', function(err, result) {
        if (err) {
          console.log(err);
        }
        res.send(result);
      });
    }
  });
});

app.post('/Projects/:projectId/ExternalDocs', function(req, res) {
  connection.query('SELECT * FROM Projects WHERE Projects.accountId="' + req.accountId + '" AND Projects.id="' + req.params.projectId + '"', function(err, resultAuth) {
    if (err) {
      console.log(err);
    }
    if (resultAuth.length === 0) {
      res.status(404).send();
    } else {
      connection.query('INSERT INTO ExternalDocs (projectId, document, website, documentation) VALUES ("' + req.params.projectId + '", "' + req.body.document + '", "' + req.body.website + '", "' + req.body.documentation + '")', function(err, result) {
        if (err) {
          console.log(err);
        }
        res.send(result);
      });
    }
  });
});

app.post('/Projects/:projectId/Notes', function(req, res) {
  connection.query('SELECT * FROM Projects WHERE Projects.accountId="' + req.accountId + '" AND Projects.id="' + req.params.projectId + '"', function(err, resultAuth) {
    if (err) {
      console.log(err);
    }
    if (resultAuth.length === 0) {
      res.status(404).send();
    } else {
      connection.query('INSERT INTO Notes (text, projectId) VALUES ("' + req.body.text + '", "' + req.params.projectId + '" )', function(err, result) {
        if (err) {
          console.log(err);
        }
        res.send(result);
      });
    }
  });
});

// DELETE REQUESTS

app.delete('/Projects/:projectId', function(req, res) {
  connection.query('DELETE FROM Projects WHERE Projects.accountId="' + req.accountId + '" AND Projects.id="' + req.params.projectId + '"', function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result.affectedRows === 0) {
      res.status(404).send();
    } else {
      res.send(result);
    }
  });
});

app.delete('/Projects/Tasks/:taskId', function(req, res) {
  connection.query('DELETE Tasks FROM Tasks JOIN Projects ON Tasks.projectId=Projects.id WHERE Projects.accountId="' + req.accountId + '" AND Tasks.id="' + req.params.taskId + '"', function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result.affectedRows === 0) {
      res.status(404).send();
    } else {
      res.send(result);
    }
  });
});

app.delete('/Tasks/:todoId', function(req, res) {
  connection.query('DELETE Todo FROM Todo JOIN Tasks ON Todo.tasksId=Tasks.id JOIN Projects ON Tasks.projectId=Projects.id WHERE Projects.accountId="' + req.accountId + '" AND Todo.id="' + req.params.todoId + '"', function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result.affectedRows === 0) {
      res.status(404).send();
    } else {
      res.send(result);
    }
  });
});

app.delete('/Projects/Hours/:hoursId', function(req, res) {
  connection.query('DELETE Hours FROM Hours JOIN Projects ON Hours.projectId=Projects.id WHERE Projects.accountId="' + req.accountId + '" AND Hours.id="' + req.params.hoursId + '"', function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result.affectedRows === 0) {
      res.status(404).send();
    } else {
      res.send(result);
    }
  });
});

app.delete('/Projects/NetExpense/:expenseId', function(req, res) {
  connection.query('DELETE NetExpense FROM NetExpense JOIN Projects ON NetExpense.projectId=Projects.id WHERE Projects.accountId="' + req.accountId + '" AND NetExpense.id="' + req.params.expenseId + '"', function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result.affectedRows === 0) {
      res.status(404).send();
    } else {
      res.send(result);
    }
  });
});

app.delete('/Projects/ExternalDocs/:docId', function(req, res) {
  connection.query('DELETE ExternalDocs FROM ExternalDocs JOIN Projects ON ExternalDocs.projectId=Projects.id WHERE Projects.accountId="' + req.accountId + '" AND ExternalDocs.id="' + req.params.docId + '"', function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result.affectedRows === 0) {
      res.status(404).send();
    } else {
      res.send(result);
    }
  });
});

app.delete('/Projects/Notes/:noteId', function(req, res) {
  connection.query('DELETE Notes FROM Notes JOIN Projects ON Notes.projectId=Projects.id WHERE Projects.accountId="' + req.accountId + '" AND Notes.id="' + req.params.noteId + '"', function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result.affectedRows === 0) {
      res.status(404).send();
    } else {
      res.send(result);
    }
  });
});

// PUT REQUESTS

app.put('/Accounts', function(req, res) {
  var query = [];
  Object.keys(req.body).forEach(function(item) {
    if (item === 'name' || item === 'email' || item === 'pasword') {
      query.push(item + '="' + req.body[item] + '"');
    }
  });
  connection.query('UPDATE Accounts SET ' + query.join(', ') + ' WHERE Accounts.id="' + req.accountId + '"', function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result.affectedRows === 0) {
      res.status(404).send();
    } else {
      res.send(result);
    }
  });
});

app.put('/Projects/:projectId', function(req, res) {
  var query = [];
  Object.keys(req.body).forEach(function(item) {
    if (item === 'accountId' || item === 'name' || item === 'description') {
      query.push(item + '="' + req.body[item] + '"');
    }
  });
  connection.query('UPDATE Projects SET ' + query.join(', ') + ' WHERE Projects.accountId="' + req.accountId + '" AND Projects.id="' + req.params.projectId + '"', function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result.affectedRows === 0) {
      res.status(404).send();
    } else {
      res.send(result);
    }
  });
});

app.put('/Projects/Tasks/:taskId', function(req, res) {
  console.log(req.body)
  var query = [];
  Object.keys(req.body).forEach(function(item) {
    if (item === 'projectId' || item === 'task' || item === 'priority' || item === 'completed') {
      query.push(item + '="' + req.body[item] + '"');
    }
  });
  connection.query('UPDATE Tasks JOIN Projects ON Tasks.projectId=Projects.id SET ' + query.join(', ') + ' WHERE Projects.accountId="' + req.accountId + '" AND Tasks.id="' + req.params.taskId + '"', function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result.affectedRows === 0) {
      res.status(404).send();
    } else {
      res.send(result);
    }
  });
});

app.put('/Tasks/Todo/:todoId', function(req, res) {
  connection.query('SELECT * FROM Todo JOIN Tasks ON Todo.tasksId=Tasks.id JOIN Projects ON Tasks.projectId=Projects.id WHERE Todo.id="' + req.params.todoId + '" AND Projects.accountId="' + req.accountId + '"', function(err, resultAuth) {
    if (err) {
      console.log(err);
    }
    if (resultAuth.length === 0) {
      res.status(404).send();
    } else {
      var query = [];
      Object.keys(req.body).forEach(function(item) {
        if (item === 'taskId' || item === 'task' || item === 'notes') {
          query.push(item + '="' + req.body[item] + '"');
        }
      });
      connection.query('UPDATE Todo SET ' + query.join(', ') + ' WHERE Todo.id = "' + req.params.todoId + '"', function(err, result) {
        if (err) {
          console.log(err);
        }
        if (result.affectedRows === 0) {
          res.status(404).send();
        } else {
          res.send(result);
        }
      });
    }
  });
});

app.put('/Projects/Hours/:hourId', function(req, res) {
  connection.query('SELECT * FROM Hours JOIN Projects ON Hours.projectId=Projects.id WHERE Projects.accountId="' + req.accountId + '" AND Hours.id="' + req.params.hourId + '"', function(err, resultAuth) {
    if (err) {
      console.log(err);
    }
    if (resultAuth.length === 0) {
      res.status(404).send();
    } else {
      var query = [];
      Object.keys(req.body).forEach(function(item) {
        if (item === 'projectId' || item === 'workerName' || item === 'hours' || item === 'completed') {
          query.push(item + '="' + req.body[item] + '"');
        }
      });
      connection.query('UPDATE Hours SET ' + query.join(', ') + ' WHERE Hours.id="' + req.params.hourId + '"', function(err, result) {
        if (err) {
          console.log(err);
        }
        if (result.affectedRows === 0) {
          res.status(404).send();
        } else {
          res.send(result);
        }
      });
    }
  });
});

app.put('/Projects/NetExpense/:expenseId', function(req, res) {
  connection.query('SELECT * FROM NetExpense JOIN Projects ON NetExpense.projectId=Projects.id WHERE NetExpense.id="' + req.params.expenseId + '" AND Projects.accountId="' + req.accountId + '"', function(err, resultAuth) {
    if (err) {
      console.log(err);
    }
    if (resultAuth.length === 0) {
      res.status(404).send();
    } else {
      var query = [];
      Object.keys(req.body).forEach(function(item) {
        if (item === 'projectId' || item === 'expense' || item === 'amount' || item === 'payTo' || item === 'notes') {
          query.push(item + '="' + req.body[item] + '"');
        }
      });
      connection.query('UPDATE NetExpense SET ' + query.join(', ') + ' WHERE NetExpense.id="' + req.params.expenseId + '"', function(err, result) {
        if (err) {
          console.log(err);
        }
        res.send(result);
      });
    }
  });
});

app.put('/Projects/ExternalDocs/:docId', function(req, res) {
  connection.query('SELECT * FROM ExternalDocs JOIN Projects ON ExternalDocs.projectId=Projects.id WHERE ExternalDocs.id="' + req.params.docId + '" AND Projects.accountId="' + req.accountId + '"', function(err, resultAuth) {
    if (err) {
      console.log(err);
    }
    if (resultAuth.length === 0) {
      res.status(404).send();
    } else {
      var query = [];
      Object.keys(req.body).forEach(function(item) {
        if (item === 'website' || item === 'document' || item === 'documentation') {
          query.push(item + '="' + req.body[item] + '"');
        }
      });
      connection.query('UPDATE ExternalDocs SET ' + query.join(', ') + ' WHERE ExternalDocs.id="' + req.params.docId + '"', function(err, result) {
        if (err) {
          console.log(err);
        }
        if (result.affectedRows === 0) {
          res.status(404).send();
        } else {
          res.send(result);
        }
      });
    }
  });
});

app.put('/Projects/Notes/:noteId', function(req, res) {
  connection.query('SELECT * FROM Notes JOIN Projects ON Notes.projectId=Projects.id WHERE Notes.id="' + req.params.noteId + '" AND Projects.accountId="' + req.accountId + '"', function(err, resultAuth) {
    if (err) {
      console.log(err);
    }
    if (resultAuth.length === 0) {
      res.status(404).send();
    } else {
      var query = [];
      Object.keys(req.body).forEach(function(item) {
        if (item === 'text') {
          query.push(item + '="' + req.body[item] + '"');
        }
      });
      connection.query('UPDATE Notes SET ' + query[0] + ' WHERE Notes.id="' + req.params.noteId + '"', function(err, result) {
        if (err) {
          console.log(err);
        }
        if (result.affectedRows === 0) {
          console.log(result);
          res.status(404).send();
        } else {
          res.send(result);
        }
      });
    }
  });
});

app.get('/', function(req, res) {
  res.send('<p>loggin form</p>');
});

var server = app.listen(3001, 'localhost', function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
