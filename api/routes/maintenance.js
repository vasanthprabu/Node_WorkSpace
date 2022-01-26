const express = require('express');
const router = express.Router();
require('dotenv').config();
const date = require('date-and-time');
const now = new Date();
const maintenance = require("../model/maintenance");
const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
    maintenance.find()
      .select("ID Object_Name Object_Key Object_Value Object_User Object_Date")
      .exec()
      .then(docs => {
        const response = {
          count: docs.length,
          maintenance: docs.map(doc => {
            return {
              ID: doc.ID,
              Object_Name: doc.Object_Name,
              Object_Key: doc.Object_Key,
              Object_Value: doc.Object_Value,
              Object_User: doc.Object_User,
              Object_Date: doc.Object_Date,
              request: {
                type: "GET",
                url: "http://localhost:3200/maintenance/" + doc._id
              }
            };
          })
        };
        res.status(200).json(response);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

// router.post('/',(req,res,next) =>{
//     var item = {
//         ID:req.body.ID,
//         Object_Name:req.body.Object_Name,
//         Object_Key:req.body.Object_Key,
//         Object_Value:req.body.Object_Value,
//         Object_User:req.body.Object_User,
//         Object_Date:date.format(now, 'DD/MM/YYYY HH:mm:ss')
//     }
//     MongoClient.connect(url,function(error,client){
//         assert.equal(null,error);
//         const db = client.db('klanmarketplace');
//         db.collection('maintenance').insertOne(item,function(err,result){
//             assert.equal(null,err);
//             console.log("item inserted");
//             db.close();
//         })
//     })
// })

router.post("/", (req, res, next) => {
    const maintenanceDAO = new maintenance({
         _id: new mongoose.Types.ObjectId(),
        ID:req.body.ID,
        Object_Name:req.body.Object_Name,
        Object_Key:req.body.Object_Key,
        Object_Value:req.body.Object_Value,
        Object_User:req.body.Object_User,
        Object_Date:date.format(now, 'DD/MM/YYYY HH:mm:ss')
    });
    maintenanceDAO
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Created maintenance successfully",
          createdMaintenance: {
              _id: result._id,
              request: {
                  type: 'POST',
                  url: "http://localhost:3000/maintenance/" + result._id
              }
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
  


// router.post('/',(req,res,next) =>{
//     var duplicateFlag = 0;
//     MSConnection
//     .query("SELECT COUNT(1) AS ROWCOUNT FROM Maintenance WHERE Object_Key='"+req.body.Object_Value+"'")
//     .then(duplicatedata => {
//         duplicateFlag = duplicatedata[0].ROWCOUNT
//         if(duplicateFlag > 0){
//             //console.log(duplicateFlag);
//                 res.status(409).json({
//                     error:409,
//                     message:"Ticket Number Already available. kindly add your entry in resoultion history"
//                 })
//         }
//         else
//         {
//             MSConnection
//             .execute("INSERT INTO Maintenance (Object_Name,Object_Key,Object_Value,Object_User,Object_Date) VALUES ('"+req.body.Object_Name+"','"+req.body.Object_Value+"','"+req.body.Object_Value+"','"+req.body.Object_User+"','"+req.body.Object_Date+"')")
//             .then(data => {
//                 res.status(201).json({
//                     error:201,
//                     success : 1,
//                     newMaster:"New maintenance created"
//                 })
//                 })
//             .catch(error => {
//                 console.error(error);
//                 res.status(500).json({
//                     message:error.message
//                 })
//             // });
//             })

//         }
//     });
// })

// router.patch('/:maintenanceID',(req,res,next)=>{
//     //console.log("Backend edit data-->"+JSON.stringify(req.body));
//         const ticketmastercreupdated = {
//             ID:req.params.maintenanceID,
//         }
//         MSConnection
//         .execute("UPDATE Maintenance SET Object_Key = '"+req.body.Object_Value+"',Object_Value = '"+req.body.Object_Value+"' , Object_User = '"+req.body.Object_User+"' , Object_Date =  '"+req.body.Object_Date+"'  WHERE ID="+req.params.maintenanceID+"")
//         .then(data => {
//             res.status(200).json({
//                 success : 1,
//                 updateMaster:ticketmastercreupdated
//             })
//           })
//         .catch(error => {
//             console.error(error);
//             res.status(500).json({
//                 message:error.message
//             })
//          });
//     });
    
//     router.delete('/:maintenanceID',(req,res,next)=>{
//         const ticketmasterdeleted = {
//             ID:req.params.maintenanceID,
//         }
//         MSConnection
//         .execute("DELETE FROM Maintenance WHERE ID IN("+req.params.maintenanceID+")")
//         .then(data => {
//             res.status(200).json({
//                 success : 1,
//                 deleteMaster:ticketmasterdeleted
//             })
//           })
//         .catch(error => {
//             console.error(error);
//             res.status(500).json({
//                 message:error.message
//             })
//          });
//      });

module.exports = router;