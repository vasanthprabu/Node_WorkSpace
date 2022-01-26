const express = require('express');
const router = express.Router();
const ADODB = require('node-adodb');
require('dotenv').config();
const MSConnection = ADODB.open(process.env.DBPATH);

router.get('/',(req,res,next)=>{
    MSConnection
   .query('SELECT ID,Date_Raised,Bug_Id,Snow_No,Type,Status,Hotfix_Date,Production_Date,Description,Comments FROM BugReport ORDER BY Date_Raised DESC')
   .then(data => {
     res.status(200).json(data)
   })
   .catch(error => {
     console.error(error);
     res.status(500).json({
         message:error.message
     })
  });
});

router.post('/',(req,res,next) =>{
    var duplicateFlag = 0;
    var hotfixdate = '';
    var proddate = '';
    if(req.body.Hotfix_Date !== null)
    hotfixdate = req.body.Hotfix_Date;
    if(req.body.Production_Date !== null)
    proddate = req.body.Production_Date;

    MSConnection
    .query("SELECT COUNT(1) AS ROWCOUNT FROM BugReport WHERE Bug_Id='"+req.body.Bug_Id+"'")
    .then(duplicatedata => {
        duplicateFlag = duplicatedata[0].ROWCOUNT
        if(duplicateFlag > 0){
            //console.log(duplicateFlag);
                res.status(409).json({
                    error:409,
                    message:"Ticket Number Already available. kindly add your entry in resoultion history"
                })
        }
        else
        {
            MSConnection
            .execute("INSERT INTO BugReport (Date_Raised,Bug_Id,Snow_No,Type,Status,Hotfix_Date,Production_Date,Description,Comments) VALUES ('"+req.body.Date_Raised+"','"+req.body.Bug_Id+"','"+req.body.Snow_No+"','"+req.body.Type+"','"+req.body.Status+"','"+hotfixdate+"','"+proddate+"','"+req.body.Description.replace(/'/g, "''")+"','"+req.body.Comments.replace(/'/g, "''")+"')")
            .then(data => {
                res.status(201).json({
                    error:201,
                    success : 1,
                    newMaster:"New maintenance created"
                })
                })
            .catch(error => {
                console.error(error);
                res.status(500).json({
                    message:error.message
                })
            // });
            })

        }
    });
})

router.patch('/:bugID',(req,res,next)=>{
    var hotfixdate = '';
    var proddate = '';
    var comments = '';
    if(req.body.Hotfix_Date !== null)
    hotfixdate = req.body.Hotfix_Date;
    if(req.body.Production_Date !== null)
    proddate = req.body.Production_Date;
    if(req.body.Comments !== null)
    comments = req.body.Comments.replace(/'/g, "''");
        const ticketmastercreupdated = {
            ID:req.params.bugID,
        }
        MSConnection
        .execute("UPDATE BugReport SET Date_Raised = '"+req.body.Date_Raised+"', Bug_Id = '"+req.body.Bug_Id+"' , Snow_No = '"+req.body.Snow_No+"' , Type =  '"+req.body.Type+"', Status =  '"+req.body.Status+"', Hotfix_Date =  '"+hotfixdate+"', Production_Date =  '"+proddate+"', Description =  '"+req.body.Description.replace(/'/g, "''")+"', Comments =  '"+comments+"'  WHERE ID="+req.params.bugID+"")
        .then(data => {
            res.status(200).json({
                success : 1,
                updateMaster:ticketmastercreupdated
            })
          })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message:error.message
            })
         });
    });
    
    router.delete('/:bugID',(req,res,next)=>{
        const ticketmasterdeleted = {
            ID:req.params.bugID,
        }
        MSConnection
        .execute("DELETE FROM BugReport WHERE ID IN("+req.params.bugID+")")
        .then(data => {
            res.status(200).json({
                success : 1,
                deleteMaster:ticketmasterdeleted
            })
          })
        .catch(error => {
            console.error(error);
            res.status(500).json({
                message:error.message
            })
         });
     });

module.exports = router;