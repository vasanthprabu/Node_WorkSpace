const express = require('express');
const router = express.Router();
const ADODB = require('node-adodb');
require('dotenv').config();
const MSConnection = ADODB.open(process.env.DBPATH);
const excel = require('exceljs');

//Get All Ticket Master Data -->Start
router.get('/:date',(req,res,next)=>{
  const dates = req.params.date;
  const fromtodate = dates.split(",");
  //console.log("Date params ->"+fromtodate[0]+"-----"+fromtodate[1]);
    MSConnection
   .query("SELECT TicketMaster.ID,Ticket_Date,Ticket_Shift,TicketType,TicketMaster.TicketNumber,ResolutionHistory.StartDateandTime,Ticket_Category,Ticket_SubCategory,Ticket_Priority,ResolutionHistory.Owner,ResolutionHistory.TeamType,ResolutionHistory.Ticket_Status,Customer_Name,IncidentShortSummary,IncidentDetail,ResolutionHistory.WorkNotes,ResolutionNotes,ResolutionHistory.EndDateandTime,Ticket_Age FROM TicketMaster  INNER JOIN [ResolutionHistory] ON TicketMaster.TicketNumber = ResolutionHistory.TicketNumber WHERE ResolutionHistory.StartDateandTime  BETWEEN '"+fromtodate[0]+"' AND '"+fromtodate[1]+"'")
   .then(data => {
    const jsonTicketMaster = JSON.parse(JSON.stringify(data));
    let workbook = new excel.Workbook(); //creating workbook
    let worksheet = workbook.addWorksheet('DailyTicketReport'); //creating worksheet
    //  WorkSheet Header
    worksheet.columns = [
        { header: 'ID', key: 'ID', width: 10 },
        { header: 'Ticket Date', key: 'Ticket_Date', width: 20 },
        { header: 'Ticket Shift', key: 'Ticket_Shift', width: 30},
        { header: 'TicketType', key: 'TicketType', width: 10},
        { header: 'Ticket Number', key: 'TicketNumber', width: 30},
        { header: 'StartDateandTime', key: 'StartDateandTime', width: 30},
        { header: 'Ticket Category', key: 'Ticket_Category', width: 30},
        { header: 'Ticket SubCategory', key: 'Ticket_SubCategory', width: 30},
        { header: 'Ticket Priority', key: 'Ticket_Priority', width: 30},
        { header: 'Owner', key: 'Ticket_Owner', width: 30},
        { header: 'Team Type', key: 'Ticket_Team_Type', width: 10},
        { header: 'Ticket Status', key: 'Ticket_State', width: 15},
        { header: 'Customer Name', key: 'Customer_Name', width: 30},
        { header: 'Incident Short Summary', key: 'IncidentShortSummary', width: 30},
        { header: 'Incident Detail', key: 'IncidentDetail', width: 30},
        { header: 'Analysis Work Notes', key: 'AnalysisWorkNotes', width: 30},
        { header: 'Ticket EndDateTime', key: 'Ticket_EndDateTime', width: 20},
        { header: 'Ticket Age', key: 'Ticket_Age', width: 5},
    ];
    // Add Array Rows
    //console.log(jsonTicketMaster);

    worksheet.addRows(jsonTicketMaster);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + 'DailyTicketSummaryReport.xlsx');
        return workbook.xlsx.write(res)
                      .then(function() {
                        res.status(200).end();
                      });

    //asy fucntion -->
    // UpdateResolutionHistAsync(jsonTicketMaster)
    // .then(()=>{
    //     worksheet.addRows(jsonTicketMaster);
    //     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    //     res.setHeader('Content-Disposition', 'attachment; filename=' + 'DailyTicketReport.xlsx');
    //     return workbook.xlsx.write(res)
    //                   .then(function() {
    //                     res.status(200).end();
    //                   });
    //    })
    //    .catch(error => {
    //      console.error(error);
    //      res.status(500).json({
    //          message:error.message
    //      })
    //   });
    })

    
});

//Get All Ticket Master Data -->End

//Get Resolution History Data -->Start
router.get('/:ticketNumber',(req,res,next)=>{
    MSConnection
   .query("SELECT ID,StartDateandTime,EndDateandTime,TeamType,Ticket_Status,Owner,WorkNotes,Remarks WHERE TicketNumber='"+ticketNumber+"'")
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

//Get Resoultion History Data -->End

async function UpdateResolutionHistAsync(jsonTicketMaster){
    var formatHistNotes = "";
    for (i = 0; i < jsonTicketMaster.length; i++) {
        formatHistNotes = "";
        const snodata = await MSConnection
        .query("SELECT StartDateandTime,EndDateandTime,Owner,WorkNotes FROM ResolutionHistory  WHERE TicketNumber='"+jsonTicketMaster[i].TicketNumber+"'")
               if(snodata.length == 0){
                   //console.log("If "+snodata.length);
                   jsonTicketMaster[i].AnalysisWorkNotes ='';
                }
                else
                {
                  // console.log("Else "+snodata.length);
                   for (j = 0; j < snodata.length; j++) {
                       //console.log(1+j+") ["+snodata[j].StartDateandTime+" ] - ["+snodata[j].EndDateandTime+"]"+" - "+snodata[j].Owner+" : "+snodata[j].WorkNotes);
                       formatHistNotes += 1+j+") ["+snodata[j].StartDateandTime+" ] - ["+snodata[j].EndDateandTime+"]"+" - "+snodata[j].Owner+" : "+snodata[j].WorkNotes;
                   }
                   jsonTicketMaster[i].AnalysisWorkNotes = formatHistNotes;
                }

   }
   return Promise.resolve();
}

module.exports = router;