var express = require('express')
var app = express()
var mySqlDAO = require('./mySqlDAO')
let ejs = require('ejs');
var app = express()
app.set('view engine', 'ejs')
var mySqlDAO = require('./mySqlDAO');
const bodyParser = require('body-parser');

app.get('/', (req, res) => {
  //Sends to home page
  res.sendFile(__dirname + '/home.html')
})

app.get('/employees',(req,res) =>{
  mySqlDAO.getEmployees()
  .then((result) => {
    //res.send(data)('file1', { employeeList: result })
    res.render('file1', {employeeList: result})
  })
  .catch((error)=>{
   if(error.errno == 1146){
    res.send("invalid table"+ error.sqlMessage)
   }
   else{
    res.send(error)
   }
  })
})

app.get('/department', (req, res) => {
  mySqlDAO.getDepartments()
      .then((result) => {
          res.render('file2', { departmentList: result })
      })
      .catch((error) => {
          res.send(error)
      })
})

//http://localhost:3004/employees/edit/:eid - Gets updateEmployee EJS
app.get('/employees/edit/:eid', (req, res) => {
  //Populates form with employee details
  mySqlDAO.updateEmployee(req.params.eid)
      .then((result) => {
          res.render('file3', { updateEmployee: result })
      })
      .catch((error) => {
          console.log(error)

      })
})

app.use(bodyParser.json());

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//Updates employee mySQL with edited data
app.post('/employees/edit/:eid', (req, res) => {
  mySqlDAO.updatedEmployeeData(req.params.eid, req.body.ename, req.body.role, req.body.salary)
      .then((result) => {
          res.redirect("/employees")
      })
      .catch((error) => {
          console.log(error)
      })
})

//Deletes Department with DID
app.get('/department/delete/:did', (req, res) => {
    mySqlDAO.departmentDeletion(req.params.did)
        .then((result) => {
            //Checks what happens in mySql
            //Id rows are affected then Dept has been deleted
            if (result.affectedRows == 0) {
                res.send("<h2> Dept: " + req.params.did + " can't be deleted.</h2>" + "<a href='/'>Home</a>")
            } else {
                res.send("<h2> Dept: " + req.params.did + " Got Deleted.</h2>" + "<a href='/'>Home</a>")
            }
        })
        .catch((error) => {
            //If an ER_ROW_IS_REFERENCED_2 error occurs means that there is a employee referencing that particular dept 
            if (error.code == "ER_ROW_IS_REFERENCED_2") {
                res.send("<h2>Department ID: " + req.params.did + " cannot be deleted as there a employee is in this department.</h2>" + "<a href='/'>Home</a>")
            }
            console.log(error)
        })
})

app.listen(3004, () => {
    console.log("listening on port 3004")
})