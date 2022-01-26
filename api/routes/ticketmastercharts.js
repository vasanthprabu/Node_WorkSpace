const express = require('express');
const router = express.Router();
const ADODB = require('node-adodb');
require('dotenv').config();
const MSConnection = ADODB.open(process.env.DBPATH);

//Report 1 - By Ticket Shift group by
router.get('/shift/:date',(req,res,next)=>{
    const dates = req.params.date;
    const fromtodate = dates.split(",");
    MSConnection
    .query("SELECT count(TicketNumber) as TotalTicket,count(IIf(Ticket_Shift = 'AMERICAS', 1, NULL)) as AMERICAS,count(IIf(Ticket_Shift = 'APAC', 1, NULL)) as APAC,count(IIf(Ticket_Shift = 'EMEIA', 1, NULL)) as EMEIA FROM TicketMaster WHERE Ticket_Shift  BETWEEN '"+fromtodate[0]+"' AND '"+fromtodate[1]+"'")
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

//Report 2 - By Ticket status group by
router.get('/status/:date',(req,res,next)=>{
    const dates = req.params.date;
    const fromtodate = dates.split(",");
    MSConnection
    .query("SELECT count(IIf(Ticket_Shift = 'AMERICAS', 1, NULL)) as AMERICAS,count(IIf(Ticket_Shift = 'APAC', 1, NULL)) as APAC,count(IIf(Ticket_Shift = 'EMEIA', 1, NULL)) as EMEIA,count(IIf(TicketType = 'CASE', 1, NULL)) as TYPECASE,count(IIf(TicketType = 'INCIDENT', 1, NULL)) as TYPEINCIDENT,count(IIf(Ticket_State = 'Assigned to L1', 1, NULL)) as L1Count,count(IIf(Ticket_State = 'Assigned to L2', 1, NULL)) as L2Count,count(IIf(Ticket_State = 'Open', 1, NULL)) as OpenCount,count(IIf(Ticket_State = 'Closed', 1, NULL)) as ClosedCount,count(IIf(Ticket_State = 'On Hold', 1, NULL)) as OnHoldCount,count(IIf(Ticket_State = 'Assigned to CSO Eng', 1, NULL)) as CSOCount,count(IIf(Ticket_State = 'Pending Vendor', 1, NULL)) as VendorCount,count(IIf(Ticket_State = 'Awaiting Info', 1, NULL)) as AwitingCount,count(IIf(Ticket_State = 'Cancelled', 1, NULL)) as CancelledCount,count(IIf(Ticket_SubCategory = 'Bulk Upload', 1, NULL)) as bulkupd,count(IIf(Ticket_SubCategory = 'Company Enrolment', 1, NULL)) as compenrol,count(IIf(Ticket_SubCategory = 'User Enrolment', 1, NULL)) as userenrol,count(IIf(Ticket_SubCategory = 'Domain Enrolment', 1, NULL)) as domainenrol,count(IIf(Ticket_SubCategory = 'Application Provisioning', 1, NULL)) as approvision,count(IIf(Ticket_SubCategory = 'Delete User', 1, NULL)) as deluser,count(IIf(Ticket_SubCategory = 'CP Sync', 1, NULL)) as cpsync,count(IIf(Ticket_SubCategory = 'Compatibility Issue', 1, NULL)) as compissue,count(IIf(Ticket_SubCategory = 'Opt In', 1, NULL)) as optin,count(IIf(Ticket_SubCategory = 'MFA/OTP', 1, NULL)) as mftotp,count(IIf(Ticket_SubCategory = 'Data Collection', 1, NULL)) as datacoll,count(IIf(Ticket_SubCategory = 'Invite Redemption', 1, NULL)) as inviteredem,count(IIf(Ticket_SubCategory = 'Tenant Restriction', 1, NULL)) as tenantrest,count(IIf(Ticket_SubCategory = 'Email and UPN different', 1, NULL)) as emailupn,count(IIf(Ticket_SubCategory = 'National Cloud', 1, NULL)) as natcloud,count(IIf(Ticket_SubCategory = 'User Deletion', 1, NULL)) as userdel,count(IIf(Ticket_SubCategory = 'Domain Checks', 1, NULL)) as domainchk,count(IIf(Ticket_SubCategory = 'Azure', 1, NULL)) as azure,count(IIf(Ticket_SubCategory = 'Alertsite', 1, NULL)) as alertsite,count(IIf(Ticket_SubCategory = 'BigEye', 1, NULL)) as bigeye,count(IIf(Ticket_SubCategory = 'HP BPM', 1, NULL)) as hpbpm FROM TicketMaster WHERE Ticket_Date  BETWEEN '"+fromtodate[0]+"' AND '"+fromtodate[1]+"'")
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



//Report 3 - By Ticket Age group by

router.get('/age/:date',(req,res,next)=>{
    const dates = req.params.date;
    const fromtodate = dates.split(",");
    MSConnection
    .query("SELECT Ticket_Age FROM TicketMaster WHERE Ticket_Date  BETWEEN '"+fromtodate[0]+"' AND '"+fromtodate[1]+"'")
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
    res.status(201).json({
        message :'Handling POST Request here'
    });
});

router.get('/:ticketmasterchartID',(req,res,next)=>{
    const id = req.params.ticketmasterchartID;
    //console.log("ticket master id here -->"+id);
    if(id == 1){
        res.status(200).json({
            message :'We discovered special id',
            id:id
        });
    }
    else
    {
        res.status(200).json({
            message :'Handling GET Request by id'
        });
    }
});

router.get('/:ticketmasterchartID',(req,res,next)=>{
    const id = req.params.ticketmasterchartID;
    //console.log("ticket master id here -->"+id);
    if(id == 1){
        res.status(200).json({
            message :'We discovered special id',
            id:id
        });
    }
    else{
        res.status(200).json({
            message :'Handling GET Request by id'
        });
    }
});


router.patch('/:ticketmasterchartID',(req,res,next)=>{
   res.status(200).json({
       message:'Update request here'
   })
});

router.delete('/:ticketmasterchartID',(req,res,next)=>{
    res.status(200).json({
        message:'Delete request here'
    })
 });
 

module.exports = router;