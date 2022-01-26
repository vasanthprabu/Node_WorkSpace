const express = require('express');
const router = express.Router();
const ADODB = require('node-adodb');
var moment = require('moment'); // require
require('dotenv').config();
const MSConnection = ADODB.open(process.env.DBPATH);

router.get('/',(req,res,next)=>{
    MSConnection
   .query('SELECT ID,StartDateandTime,EndDateandTime,TeamType,Ticket_Status,Owner,WorkNotes,Edit_Flag FROM ResolutionHistory')
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

router.post('/:ticketNumber',(req,res,next)=>{
   // var maxRowCount = 0;
    //var RowCount = 0;
    var DeleteCount = 0;
    var successCount = 0;
    var formatedStartDate = '';
    var formatedEndDate = '';
    //Get Max Row Count 
    console.log(req.body.length);
    //RowCount = getResolutionHistRowCount(req.params.ticketNumber);
    ResolutionHistRowDelete(req.params.ticketNumber)
    .then(()=>{
        console.log("Delete record trancated !!!");
        InsertResolutionHistAsync(req.params.ticketNumber,req.body)
            .then(()=>{
                res.status(200).json({
                    successCount:1,
                    message:"Analysis History Added successfully !!!"
                }) 
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({
                    message:error.message
                })
            });
       })
       .catch(error => {
         console.error(error);
         res.status(500).json({
             message:error.message
         })
      });
    
});

router.get('/:ticketNumber',(req,res,next)=>{
    const id = req.params.ticketNumber;
    console.log("params value",id)
    MSConnection
   .query("SELECT ID,StartDateandTime,EndDateandTime,Ticket_Status,TeamType,Owner,WorkNotes,Edit_Flag FROM ResolutionHistory WHERE TicketNumber='"+id+"'")
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

    const ticketmastercreupdated = {
        ID:req.params.ticketmasterID,
    }
    MSConnection
    .execute("UPDATE TicketMaster SET Ticket_Date = '"+req.body.Ticket_Date+"',Ticket_Shift = '"+req.body.Ticket_Shift+"' , TicketType = '"+req.body.TicketType+"' , TicketNumber =  '"+req.body.TicketNumber+"' ,  StartDateandTime = '"+req.body.StartDateandTime+"' ,  Ticket_Priority = '"+req.body.Ticket_Priority+"' ,Ticket_Owner = '"+req.body.Ticket_Owner+"',Ticket_Team_Type = '"+req.body.Ticket_Team_Type+"' , Ticket_State = '"+req.body.Ticket_State+"' ,Customer_Name = '"+req.body.Customer_Name+"', IncidentShortSummary = '"+req.body.IncidentShortSummary+"' , IncidentDetail = '"+req.body.IncidentDetail+"' , AnalysisWorkNotes = '"+req.body.AnalysisWorkNotes+"' , ResolutionNotes = '"+req.body.ResolutionNotes+"' , Ticket_EndDateTime = '"+req.body.Ticket_EndDateTime+"' , Ticket_Age = '"+req.body.Ticket_Age+"'  WHERE ID="+req.params.ticketmasterID+"")
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
    .execute("DELETE FROM ResolutionHistory WHERE TicketNumber='"+req.params.ticketmasterID+"'")
    .then(data => {
        res.status(200).json({
            success : data,
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
 
 function getResolutionHistRowCount(ticketNumber) {
    var RowCount = 0
    MSConnection
    .query("SELECT COUNT(1) AS ROWCOUNT FROM ResolutionHistory  WHERE TicketNumber='"+ticketNumber+"'")
    .then(snodata => {
      console.log(JSON.stringify(snodata[0].ROWCOUNT))
      RowCount = snodata[0].ROWCOUNT;
    return RowCount;
    })
    .catch(error =>{
        console.error(error);
    })  
  }

  async function ResolutionHistRowDelete(ticketNumber) {
    var DeleteCount = 0
    MSConnection
    .execute("DELETE FROM ResolutionHistory WHERE TicketNumber='"+ticketNumber+"'") 
    return Promise.resolve();
  }

  async function InsertResolutionHistAsync(ticketParams,jsonResolutionHistory){
    var formatedStartDate = '';
    var formatedEndDate = '';
    var formatedWorkNotes = '';
    var formatedticketstatus = '';
    var formatedteamtype = '';
    var formatedowner = '';
    for (i = 0; i < jsonResolutionHistory.length; i++) {
        formatedStartDate = moment(jsonResolutionHistory[i].StartDateandTime).format('YYYY-MM-DDTHH:mm:ss');
        formatedEndDate = moment(jsonResolutionHistory[i].EndDateandTime).format('YYYY-MM-DDTHH:mm:ss');
        
        if(typeof jsonResolutionHistory[i].WorkNotes === 'undefined'){
          formatedWorkNotes ="";
        }
        else{
         
          formatedWorkNotes = jsonResolutionHistory[i].WorkNotes.replace(/'/g, "''")
        }
        if(typeof jsonResolutionHistory[i].TeamType === 'undefined'){
          formatedteamtype ="";
        }
        else{
          
          formatedteamtype = jsonResolutionHistory[i].TeamType;
        }
        if(typeof jsonResolutionHistory[i].Ticket_Status === 'undefined'){
          formatedticketstatus = "";
        }else{
          formatedticketstatus = jsonResolutionHistory[i].Ticket_Status;
        }
        if(typeof jsonResolutionHistory[i].Owner === 'undefined'){
          formatedowner = "";
        }else{
          formatedowner = jsonResolutionHistory[i].Owner;
        }
        MSConnection
        .execute("INSERT INTO ResolutionHistory (TicketNumber,StartDateandTime,EndDateandTime,TeamType,Ticket_Status,Owner,WorkNotes,Edit_Flag) VALUES ('"+ticketParams+"','"+formatedStartDate+"','"+formatedEndDate+"','"+formatedteamtype+"','"+formatedticketstatus+"','"+formatedowner+"','"+formatedWorkNotes+"','E')");
 } 
   return Promise.resolve();
}


module.exports = router;