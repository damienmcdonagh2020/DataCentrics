var  pmysql = require('promise-mysql')

var pool

pmysql.createPool({
    connectionLimit : 3,
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'proj2022'
    })
    .then((p) => {
    pool = p
    })
    .catch((e) => {
    console.log("pool error:" + e)
    })



    var getEmployees = function () {
        return new Promise((resolve, reject) => {
            pool.query('select * from employee')
                .then((data) => {
                    resolve(data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    var getDepartments = function () {
        return new Promise((resolve, reject) => {
            pool.query('select * from dept')
                .then((data) => {
                    resolve(data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

 //Which employee to update
var updateEmployee = function (eid) {
    return new Promise((resolve, reject) => {
        var mySqlQuery = {
            sql: 'select * from employee where eid=?',
            values: [eid]
        }

        pool.query(mySqlQuery)
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// updates employees Data
var updatedEmployeeData = function (eid, ename, role, salary) {
    return new Promise((resolve, reject) => {
      var mySqlQuery = {
        sql: 'update employee set ename = ?, role = ?, salary = ? where eid = ?',
        values: [ename, role, salary, eid]
      }
  
      pool.query(mySqlQuery)
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  var departmentDeletion = function (did) {
    return new Promise((resolve, reject) => {
        var mySqlQuery = {
            sql: 'delete from dept where did = ?',
            values: [did]
        }

        pool.query(mySqlQuery)
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

   
module.exports = { getEmployees, getDepartments, updatedEmployeeData, updateEmployee, departmentDeletion}
 