const express = require('express');
const router = express.Router();
const ADODB = require('node-adodb');
require('dotenv').config();
const MSConnection = ADODB.open(process.env.DBPATH);

router.get('/',(req,res,next)=>{
    MSConnection
   .query('SELECT ID,Ticket_Date,Ticket_Shift,TicketType,TicketNumber,Bug_ID,Ms_TicketNumber,StartDateandTime,Ticket_Category,Ticket_SubCategory,Ticket_Priority,Ticket_Owner,Ticket_Team_Type,Ticket_State,Customer_Name,IncidentShortSummary,IncidentDetail,AnalysisWorkNotes,ResolutionNotes,Ticket_EndDateTime,Ticket_Age FROM TicketMaster ORDER BY Ticket_Date DESC')
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

router.post('/',(req,res,next)=>{
    //var maxRowCount = 0;
    var duplicateFlag = 0;
    const ticketmastercreated = {
        ID:req.body.ID,
        TicketNumber:req.body.TicketNumber
    }

    //duplicate resouce http error code check 409 
    MSConnection
    .query("SELECT COUNT(1) AS ROWCOUNT FROM TicketMaster WHERE TicketNumber='"+req.body.TicketNumber+"'")
    .then(duplicatedata => {
        duplicateFlag = duplicatedata[0].ROWCOUNT
        if(duplicateFlag > 0){
            //console.log(duplicateFlag);
                res.status(409).json({
                    error:409,
                    message:"Ticket Number Already available. kindly add your entry in resoultion history"
                })
        }
        else{
            //Get Max Row Count  
            // MSConnection
            // .query('(SELECT (MAX(ID)+1) AS ROW FROM TicketMaster)')
            // .then(snodata => {
            // maxRowCount = snodata[0].ROW;
            // console.log(maxRowCount);
            MSConnection
            .execute("INSERT INTO TicketMaster (Ticket_Date,Ticket_Shift,TicketType,TicketNumber,Bug_ID,Ms_TicketNumber,StartDateandTime,Ticket_Category,Ticket_SubCategory,Ticket_Priority,Ticket_Owner,Ticket_Team_Type,Ticket_State,Customer_Name,IncidentShortSummary,IncidentDetail,AnalysisWorkNotes,ResolutionNotes,Ticket_EndDateTime,Ticket_Age) VALUES ('"+req.body.Ticket_Date+"','"+req.body.Ticket_Shift+"','"+req.body.TicketType+"','"+req.body.TicketNumber+"','"+req.body.Bug_ID+"','"+req.body.Ms_TicketNumber+"','"+req.body.StartDateandTime+"','"+req.body.Ticket_Category+"','"+req.body.Ticket_SubCategory+"','"+req.body.Ticket_Priority+"','"+req.body.Ticket_Owner+"','"+req.body.Ticket_Team_Type+"','"+req.body.Ticket_State+"','"+req.body.Customer_Name.replace(/'/g, "''")+"','"+req.body.IncidentShortSummary.replace(/'/g, "''")+"','"+req.body.IncidentDetail.replace(/'/g, "''")+"','"+req.body.AnalysisWorkNotes.replace(/'/g, "''")+"','"+req.body.ResolutionNotes.replace(/'/g, "''")+"','"+req.body.Ticket_EndDateTime+"','"+req.body.Ticket_Age+"')")
            .then(data => {
                res.status(201).json({
                    error:201,
                    success : 1,
                    newMaster:ticketmastercreated
                })
                })
            .catch(error => {
                console.error(error);
                res.status(500).json({
                    message:error.message
                })
            // });
            })
            .catch(error => {
            console.error(error);
            res.status(500).json({
                message:error.message
            })
        });
        }
    });
    
});

router.get('/duplicate/:ticketmasterID',(req,res,next)=>{
    var duplicateFlag = 0;
    const id = req.params.ticketmasterID;
    MSConnection
   .query("SELECT COUNT(1) AS ROWCOUNT FROM TicketMaster WHERE TicketNumber='"+id+"'")
   .then(data => {
     //res.status(200).json(data);
     duplicateFlag = data[0].ROWCOUNT
        if(duplicateFlag > 0){
            //console.log(duplicateFlag);
                res.status(409).json({
                    error:409,
                    message:"Ticket Number Already available. kindly add your entry in resoultion history"
                })
        }else{
            res.status(200).json({
                error:200,
                message:"Ticket Number Not Available"
            })
        }
   })
   .catch(error => {
     console.error(error);
     res.status(500).json({
         message:error.message
     })
  });
});


router.get('/:ticketmasterID',(req,res,next)=>{
    const id = req.params.ticketmasterID;
    MSConnection
   .query("SELECT ID,Ticket_Date,Ticket_Shift,TicketType,TicketNumber,Bug_ID,Ms_TicketNumber,StartDateandTime,Ticket_Category,Ticket_SubCategory,Ticket_Priority,Ticket_Owner,Ticket_Team_Type,Ticket_State,Customer_Name,IncidentShortSummary,IncidentDetail,AnalysisWorkNotes,ResolutionNotes,Ticket_EndDateTime,Ticket_Age FROM TicketMaster WHERE ID="+req.params.ticketmasterID+"")
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

router.patch('/:ticketmasterID',(req,res,next)=>{
//console.log("Backend edit data-->"+JSON.stringify(req.body));
    const ticketmastercreupdated = {
        ID:req.params.ticketmasterID,
    }
    MSConnection
    .execute("UPDATE TicketMaster SET Ticket_Date = '"+req.body.Ticket_Date+"',Ticket_Shift = '"+req.body.Ticket_Shift+"' , TicketType = '"+req.body.TicketType+"' , TicketNumber =  '"+req.body.TicketNumber+"' , Bug_ID =  '"+req.body.Bug_ID+"' , Ms_TicketNumber =  '"+req.body.Ms_TicketNumber+"' ,  StartDateandTime = '"+req.body.StartDateandTime+"' ,Ticket_Category = '"+req.body.Ticket_Category+"',Ticket_SubCategory = '"+req.body.Ticket_SubCategory+"', Ticket_Priority = '"+req.body.Ticket_Priority+"' ,Ticket_Owner = '"+req.body.Ticket_Owner+"',Ticket_Team_Type = '"+req.body.Ticket_Team_Type+"' , Ticket_State = '"+req.body.Ticket_State+"' ,Customer_Name = '"+req.body.Customer_Name.replace(/'/g, "''")+"', IncidentShortSummary = '"+req.body.IncidentShortSummary.replace(/'/g, "''")+"' , IncidentDetail = '"+req.body.IncidentDetail.replace(/'/g, "''")+"' , AnalysisWorkNotes = '"+req.body.AnalysisWorkNotes.replace(/'/g, "''")+"' , ResolutionNotes = '"+req.body.ResolutionNotes.replace(/'/g, "''")+"' , Ticket_EndDateTime = '"+req.body.Ticket_EndDateTime+"' , Ticket_Age = '"+req.body.Ticket_Age+"'  WHERE ID="+req.params.ticketmasterID+"")
    .then(data => {
        res.status(200).json({
            success : 1,
            updateMaster:ticketmastercreupdated
        })
      })
    .catch(error => {
        console.error(error);
        res.status(500).json({
            message:error.message
        })
     });
});

router.delete('/:ticketmasterID',(req,res,next)=>{
    const ticketmasterdeleted = {
        ID:req.params.ticketmasterID,
    }
    MSConnection
    .execute("DELETE FROM TicketMaster WHERE ID IN("+req.params.ticketmasterID+")")
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