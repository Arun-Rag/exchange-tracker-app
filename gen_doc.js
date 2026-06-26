const fs=require('fs');
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,AlignmentType,
 LevelFormat,HeadingLevel,BorderStyle,WidthType,ShadingType,PageNumber,Header,Footer,
 TableOfContents,PageBreak}=require('docx');

const BRAND="0B4F8A", BRAND2="1769AA", LIGHT="EAF2F8", LINE="CCCCCC", GREY="6B7280";
const border={style:BorderStyle.SINGLE,size:1,color:LINE};
const borders={top:border,bottom:border,left:border,right:border};
const CW=9360;

function H1(t){return new Paragraph({heading:HeadingLevel.HEADING_1,children:[new TextRun(t)]});}
function H2(t){return new Paragraph({heading:HeadingLevel.HEADING_2,children:[new TextRun(t)]});}
function H3(t){return new Paragraph({heading:HeadingLevel.HEADING_3,children:[new TextRun(t)]});}
function P(t,opt={}){return new Paragraph({spacing:{after:140},children:[new TextRun({text:t,...opt})]});}
function runs(arr){return new Paragraph({spacing:{after:140},children:arr.map(a=>new TextRun(a))});}
function bullet(t){return new Paragraph({numbering:{reference:"b",level:0},spacing:{after:60},children:[new TextRun(t)]});}
function bulletR(arr){return new Paragraph({numbering:{reference:"b",level:0},spacing:{after:60},children:arr.map(a=>new TextRun(a))});}
function step(t,ref="n"){return new Paragraph({numbering:{reference:ref,level:0},spacing:{after:80},children:[new TextRun(t)]});}
function stepR(arr,ref="n"){return new Paragraph({numbering:{reference:ref,level:0},spacing:{after:80},children:arr.map(a=>new TextRun(a))});}

function cell(text,{head=false,w=CW/2,bold=false,fill=null}={}){
 const runsArr = Array.isArray(text)?text:[{text:String(text),bold:bold||head,color:head?"FFFFFF":"1F2937"}];
 return new TableCell({borders,width:{size:w,type:WidthType.DXA},
  shading:{fill:fill||(head?BRAND:"FFFFFF"),type:ShadingType.CLEAR},
  margins:{top:70,bottom:70,left:110,right:110},
  children:[new Paragraph({children:runsArr.map(r=>new TextRun(r)),spacing:{after:0}})]});
}
function table(headers,rows,widths){
 const w=widths||headers.map(()=>Math.floor(CW/headers.length));
 const head=new TableRow({tableHeader:true,children:headers.map((h,i)=>cell(h,{head:true,w:w[i]}))});
 const body=rows.map((r,ri)=>new TableRow({children:r.map((c,i)=>cell(c,{w:w[i],fill:ri%2?"F5F8FB":"FFFFFF"}))}));
 return new Table({width:{size:CW,type:WidthType.DXA},columnWidths:w,rows:[head,...body]});
}
function spacer(){return new Paragraph({spacing:{after:60},children:[new TextRun("")]});}
function callout(title,text){
 return new Table({width:{size:CW,type:WidthType.DXA},columnWidths:[CW],rows:[new TableRow({children:[
  new TableCell({borders:{left:{style:BorderStyle.SINGLE,size:18,color:BRAND2},top:border,bottom:border,right:border},
   width:{size:CW,type:WidthType.DXA},shading:{fill:LIGHT,type:ShadingType.CLEAR},
   margins:{top:100,bottom:100,left:160,right:140},
   children:[new Paragraph({spacing:{after:40},children:[new TextRun({text:title+"  ",bold:true,color:BRAND})]}),
             new Paragraph({children:[new TextRun({text:text})]})]})]})]});
}

const children=[];
// ---- Title ----
children.push(new Paragraph({spacing:{before:1200,after:0},alignment:AlignmentType.CENTER,
 children:[new TextRun({text:"3rd Party Exchange & Sales Tracker",bold:true,size:48,color:BRAND})]}));
children.push(new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:60},
 children:[new TextRun({text:"Build Guide — Microsoft Power Apps + SharePoint + Power Automate",size:26,color:BRAND2})]}));
children.push(new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:600},
 children:[new TextRun({text:"Amapola · Fokker 50 aircraft parts · outright & exchange sales",size:22,color:GREY})]}));
children.push(new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:40},
 children:[new TextRun({text:"Prepared for: Arun Raghavan",size:22})]}));
children.push(new Paragraph({alignment:AlignmentType.CENTER,
 children:[new TextRun({text:"Migrating from the “3rd Party Business” Access database",size:20,color:GREY,italics:true})]}));
children.push(new Paragraph({children:[new PageBreak()]}));

// ---- TOC ----
children.push(H1("Contents"));
children.push(new Paragraph({spacing:{after:90},children:[new TextRun({text:'1.  What we are building and why',size:23,color:"1F2937"})]}));
children.push(new Paragraph({spacing:{after:90},children:[new TextRun({text:'2.  The data model (SharePoint lists)',size:23,color:"1F2937"})]}));
children.push(new Paragraph({spacing:{after:90},children:[new TextRun({text:'3.  Import your existing 114 records',size:23,color:"1F2937"})]}));
children.push(new Paragraph({spacing:{after:90},children:[new TextRun({text:'4.  Build the Power App',size:23,color:"1F2937"})]}));
children.push(new Paragraph({spacing:{after:90},children:[new TextRun({text:'5.  Automatic reminder emails (with CC)',size:23,color:"1F2937"})]}));
children.push(new Paragraph({spacing:{after:90},children:[new TextRun({text:'6.  Failed fuel-nozzle charges',size:23,color:"1F2937"})]}));
children.push(new Paragraph({spacing:{after:90},children:[new TextRun({text:'7.  Go-live checklist',size:23,color:"1F2937"})]}));
children.push(new Paragraph({children:[new PageBreak()]}));

// ---- 1 Overview ----
children.push(H1("1. What we are building and why"));
children.push(P("Today your exchange sales live in a Microsoft Access file (“3rd Party Business.accdb”). That file works for one person at a time, has no automatic reminders, and uses a tick box that is easy to misread. This guide turns it into a shared, multi-user web and mobile application that several colleagues can use at once, that sends exchange-due reminders automatically, and that shows Open / Closed in plain words."));
children.push(P("We use three standard Microsoft 365 tools you already pay for:"));
children.push(bulletR([{text:"SharePoint Online lists ",bold:true},{text:"— the shared database. This is where all records live so everyone sees the same live data."}]));
children.push(bulletR([{text:"Power Apps ",bold:true},{text:"— the attractive screens your team uses on a PC, tablet or phone to add and update exchanges."}]));
children.push(bulletR([{text:"Power Automate ",bold:true},{text:"— the engine that emails the customer (and CC's your colleague) automatically when a core unit is overdue."}]));
children.push(callout("Why not just a website?","A true “live, multi-user” app needs a shared database behind it. SharePoint gives you that instantly inside your existing Microsoft 365 tenant — no servers to buy, security handled by your existing logins, and it works on Outlook for the reminder emails. This is the lowest-effort path to everything you asked for."));
children.push(P("This guide is written so you, or whoever sets it up, can follow it step by step without prior Power Apps experience. Estimated build time: half a day for the lists and import, half a day for the app and the reminder flow."));

children.push(H2("The four things you asked for, and where each is handled"));
children.push(table(
 ["Your requirement","Where it lives in the new app"],
 [["Know what I gave the customer vs. what they gave me","Two clearly separated sections on every record: “Unit sold to customer” (P/N, S/N, Sales Order) and “Core received from customer” (P/N, S/N)."],
  ["Match the returned core to a Repair Order (RO) and repair shop","RO Number, Repair Shop and Assembly Status fields, plus an RO lookup list."],
  ["Know which customers are DUE","A “Due” view that auto-lists every open record still waiting for a core — 33 right now."],
  ["Auto reminder email to customer, CC my colleague","A scheduled Power Automate flow; CC address is set once and reused."],
  ["Comment box for the sales unit","Multi-line Comment field on every record."],
  ["Sales price with currency","Sales Price (number) + Currency fields, shown as e.g. “USD 61,500”."],
  ["Failed-nozzle count and charge","Failed Nozzles (number) + Nozzle Charge fields for fuel-nozzle assemblies."],
  ["Clear Open / Closed instead of a tick","A single Order Status choice shown as a coloured “Open” or “Closed” label."]],
 [3400,5960]));
children.push(new Paragraph({children:[new PageBreak()]}));

// ---- 2 Data model ----
children.push(H1("2. The data model (SharePoint lists)"));
children.push(P("Create three lists in a new SharePoint site (or an existing team site). The main list is “Exchanges”; the other two are short pick-lists that keep customer and repair-shop names consistent."));

children.push(H2("List A — Exchanges (main list)"));
children.push(P("This holds one row per exchange/sales line. Create these columns exactly (the Title column is renamed to Customer)."));
children.push(table(
 ["Column name","Type","Notes"],
 [["Customer","Choice (or Lookup to Customers list)","The owner / company. Use the cleaned names: Advantage, Amapola, BusyBee, CC&Sons, I-Fly, Jetways, Kush, Newworld Choices, Sky Cap, Skyward Express, Tanzania, Aerosum, Aerojet, Orion."],
  ["Date","Date","When the exchange was raised."],
  ["Sold P/N","Single line of text","Part number we SUPPLIED to the customer."],
  ["Sold S/N","Single line of text","Serial number we supplied."],
  ["Sales Order No","Single line of text","Your SO number (e.g. SO52923)."],
  ["Sales Price","Number","Numeric price only."],
  ["Currency","Choice","USD, EUR. Default USD."],
  ["Core P/N","Single line of text","Part number the customer must return."],
  ["Core S/N","Single line of text","Serial number of the returned core."],
  ["Exchange Status","Choice","Waiting for Exchange Unit / Exchange Received / Received – awaiting RO / RO Assigned."],
  ["RO Number","Single line of text","Repair Order, e.g. RO660263."],
  ["Repair Shop","Choice (or Lookup)","Action Aero, AEG, Baltic, Global, etc."],
  ["Assy Status","Single line of text","Free text repair note."],
  ["Repair Quote Price","Number","Shop quote, numeric."],
  ["Failed Nozzles","Number","For fuel-nozzle assemblies: how many nozzles failed."],
  ["Nozzle Charge","Number","Amount to charge the customer for failed nozzles."],
  ["Ownership","Single line of text","Whose property the unit is (e.g. Amapola Property)."],
  ["Comment","Multiple lines of text","The sales-unit comment box."],
  ["Order Status","Choice","Open / Closed. Default Open."],
  ["Reminder Sent","Date","Set automatically by the flow; stops duplicate reminders."]],
 [2100,2100,5160]));
children.push(callout("About “Due”","You do not create a “Due” column. “Due” is simply: Order Status = Open AND Exchange Status is still “Waiting for Exchange Unit” (or “Received – awaiting RO”). We build a filtered view for it in Section 4, so it is always live and never needs manual updating."));

children.push(H2("List B — Customers (pick-list)"));
children.push(P("One column (Title = customer name) plus an optional “Contact Email” column — the reminder flow uses this to know where to send. Pre-fill it with the email address for each company."));
children.push(H2("List C — Repair Shops (pick-list)"));
children.push(P("One column (Title = shop name): Action Aero, AEG, Baltic, Global, Collin, VSE, Parker, AllClear, APF, Amapola, In-house."));
children.push(new Paragraph({children:[new PageBreak()]}));

// ---- 3 Import ----
children.push(H1("3. Import your existing 114 records"));
children.push(P("I have already cleaned your Access data into a ready-to-import spreadsheet, “Exchanges_clean.csv”, delivered alongside this guide. It contains 114 real records (the 67 blank rows were dropped), with customer names standardised, prices separated from notes, failed-nozzle counts extracted, and the tick box converted to Open / Closed."));
children.push(H2("Steps"));
children.push(step("Open the Exchanges list in SharePoint."));
children.push(stepR(["Click ",{text:"Edit in grid view",bold:true},", or use ",{text:"Import from Excel",bold:true}," if you first save the CSV as .xlsx."]));
children.push(step("Map each spreadsheet column to the matching list column from Section 2 (the headers already line up)."));
children.push(step("Import. SharePoint creates one item per row."));
children.push(stepR(["Spot-check 3–4 records against the Access file — especially the six nozzle records (Advantage ×1, ×4, ×1; CC&Sons ×1, ×1; Tanzania ×5)."]));
children.push(callout("Note on prices","Where the original cell mixed a price with a sentence (e.g. “Q.P $1325 + $410 4 EA fail nozzle claim”), the numeric Sales Price / Repair Quote field is left blank and the full original text is preserved so nothing is lost — you can fill the clean number in later. 53 sales prices and 30 repair quotes imported as clean numbers automatically."));
children.push(new Paragraph({children:[new PageBreak()]}));

// ---- 4 The app ----
children.push(H1("4. Build the Power App"));
children.push(P("From the Exchanges list, choose Integrate → Power Apps → Create an app. Power Apps generates a working three-screen app (browse, detail, edit) connected to your list. Then tailor it as below."));

children.push(H2("Screen 1 — Dashboard / Browse"));
children.push(bulletR([{text:"Status labels, not ticks. ",bold:true},{text:"Show Order Status as a coloured pill: green “Closed”, amber “Open”, red “Due”. (Due = Open and still waiting for the core.)"}]));
children.push(bulletR([{text:"Top counters. ",bold:true},{text:"Add four cards across the top: Open, Closed, Due, and Failed nozzles to claim — the same headline numbers as the prototype."}]));
children.push(bulletR([{text:"Search & filter. ",bold:true},{text:"A search box over P/N, S/N, customer, RO and SO; plus filter buttons All / Due / Open / Closed / Nozzle claims."}]));
children.push(H2("Screen 2 — Record detail"));
children.push(P("Lay the detail screen out in three clearly labelled blocks so the two sides of the exchange are never confused:"));
children.push(bulletR([{text:"Unit sold to customer: ",bold:true},{text:"Sold P/N, Sold S/N, Sales Order No, Sales Price + Currency."}]));
children.push(bulletR([{text:"Core received from customer: ",bold:true},{text:"Core P/N, Core S/N, Exchange Status, Ownership."}]));
children.push(bulletR([{text:"Repair: ",bold:true},{text:"RO Number, Repair Shop, Assy Status, Repair Quote, Failed Nozzles, Nozzle Charge."}]));
children.push(P("Below that, the multi-line Comment box, and a “Send reminder now” button (Section 5)."));
children.push(H2("Screen 3 — The Due view"));
children.push(P("Add a screen whose gallery is filtered to the due records. In the gallery Items property use:"));
children.push(new Paragraph({shading:{fill:"F3F4F6",type:ShadingType.CLEAR},border:{left:{style:BorderStyle.SINGLE,size:14,color:BRAND2}},spacing:{before:60,after:60},
 children:[new TextRun({text:'Filter(Exchanges, \'Order Status\'.Value = "Open" && (\'Exchange Status\'.Value = "Waiting for Exchange Unit" || \'Exchange Status\'.Value = "Received – awaiting RO"))',font:"Consolas",size:18})]}));
children.push(P("This list updates itself — the moment someone marks a core as received or closes the order, it drops off the Due screen."));
children.push(new Paragraph({children:[new PageBreak()]}));

// ---- 5 Reminder flow ----
children.push(H1("5. Automatic reminder emails (with CC)"));
children.push(P("This is built in Power Automate. It runs on a schedule, finds every customer who is due, and emails them — copying your colleague — without anyone clicking a button."));
children.push(H2("Build the scheduled flow"));
children.push(step("In Power Automate, create a new flow → Scheduled cloud flow. Set it to run, say, every Monday at 08:00."));
children.push(stepR(["Add ",{text:"Get items",bold:true}," (SharePoint). Point it at the Exchanges list. In Filter Query, paste:"]));
children.push(new Paragraph({shading:{fill:"F3F4F6",type:ShadingType.CLEAR},border:{left:{style:BorderStyle.SINGLE,size:14,color:BRAND2}},spacing:{before:60,after:120},
 children:[new TextRun({text:"OrderStatus eq 'Open' and ExchangeStatus eq 'Waiting for Exchange Unit'",font:"Consolas",size:18})]}));
children.push(stepR(["Add ",{text:"Apply to each",bold:true}," over the returned items, and inside it add ",{text:"Send an email (V2)",bold:true}," (Office 365 Outlook)."]));
children.push(stepR(["Configure the email:"]));
children.push(new Paragraph({numbering:{reference:"sub",level:0},spacing:{after:50},children:[new TextRun("To: the customer’s Contact Email (from the Customers list).")]}));
children.push(new Paragraph({numbering:{reference:"sub",level:0},spacing:{after:50},children:[new TextRun({text:"CC: your colleague’s address — set once here, e.g. colleague@amapola.nu.",})]}));
children.push(new Paragraph({numbering:{reference:"sub",level:0},spacing:{after:50},children:[new TextRun("Subject: Reminder: exchange core due — [Sold P/N] (SO [Sales Order No]).")]}));
children.push(new Paragraph({numbering:{reference:"sub",level:0},spacing:{after:50},children:[new TextRun("Body: a short, polite reminder pulling in Sold P/N, Sold S/N, Sales Order No and Core P/N (template below).")]}));
children.push(stepR(["After the email, add an ",{text:"Update item",bold:true}," step that writes today’s date into ",{text:"Reminder Sent",bold:true},". Then add a condition at the top of the loop to skip anyone reminded in the last 7 days, so customers are not spammed."]));
children.push(H2("Suggested email body"));
var emailLines=["Dear [Customer],","This is a reminder regarding the exchange order below.","Unit we supplied \u2014 Part No: [Sold P/N], Serial No: [Sold S/N], Sales Order: [Sales Order No].","We are still awaiting your exchange core unit (P/N [Core P/N]). Kindly advise the dispatch / tracking details at your earliest convenience.","Best regards,","Amapola \u2014 3rd Party Sales"];
children.push(new Paragraph({shading:{fill:"F8FAFC",type:ShadingType.CLEAR},spacing:{before:60,after:60},
 children:emailLines.flatMap(function(l,i){return i===0?[new TextRun({text:l,italics:true,size:20})]:[new TextRun({break:1,text:l,italics:true,size:20})];})}));
children.push(callout("Manual “send now” too","The same email logic can sit behind a button on the detail screen for one-off reminders. In the prototype this opens Outlook pre-filled with the customer and CC; in production the Power Automate version sends it directly."));
children.push(new Paragraph({children:[new PageBreak()]}));

// ---- 6 Nozzles ----
children.push(H1("6. Failed fuel-nozzle charges"));
children.push(P("A fuel nozzle assembly is a group of individual nozzles; when some fail you need to record how many and bill the customer. The app handles this with two fields and a small calculation."));
children.push(bulletR([{text:"Failed Nozzles ",bold:true},{text:"— enter the count (your data shows cases of 1, 4 and 5 failed nozzles)."}]));
children.push(bulletR([{text:"Nozzle Charge ",bold:true},{text:"— the amount billed. You can either type it, or have the app calculate Failed Nozzles × a standard per-nozzle rate (your records suggest roughly USD 1,200 per nozzle)."}]));
children.push(P("On the dashboard, the “Failed nozzles to claim” counter sums this across all open records so nothing slips through unbilled. Today that total is 13 nozzles across 6 records."));

children.push(H1("7. Go-live checklist"));
children.push(step("Three SharePoint lists created with the columns in Section 2.",));
children.push(step("114 records imported and spot-checked.",));
children.push(step("Power App published and shared with your team (Share → add colleagues).",));
children.push(step("Reminder flow turned on and tested with one due record.",));
children.push(step("Customer Contact Emails filled in on the Customers list.",));
children.push(step("Colleague CC address confirmed in the flow.",));
children.push(spacer());
children.push(P("Once live, several people can use the app at the same time on PC, tablet or phone, every change is shared instantly, the Due list maintains itself, and overdue customers are chased automatically. The accompanying HTML prototype shows exactly how the finished screens should look and behave.",{italics:true,color:GREY}));

const doc=new Document({
 creator:"Amapola",title:"3rd Party Exchange & Sales Tracker — Build Guide",
 styles:{default:{document:{run:{font:"Arial",size:21}}},
  paragraphStyles:[
   {id:"Heading1",name:"Heading 1",basedOn:"Normal",next:"Normal",quickFormat:true,
    run:{size:30,bold:true,color:BRAND,font:"Arial"},paragraph:{spacing:{before:280,after:160},outlineLevel:0}},
   {id:"Heading2",name:"Heading 2",basedOn:"Normal",next:"Normal",quickFormat:true,
    run:{size:25,bold:true,color:BRAND2,font:"Arial"},paragraph:{spacing:{before:200,after:120},outlineLevel:1}},
   {id:"Heading3",name:"Heading 3",basedOn:"Normal",next:"Normal",quickFormat:true,
    run:{size:22,bold:true,color:"1F2937",font:"Arial"},paragraph:{spacing:{before:140,after:80},outlineLevel:2}},
  ]},
 numbering:{config:[
   {reference:"b",levels:[{level:0,format:LevelFormat.BULLET,text:"•",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:560,hanging:280}}}}]},
   {reference:"n",levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:560,hanging:280}}}}]},
   {reference:"sub",levels:[{level:0,format:LevelFormat.LOWER_LETTER,text:"%1)",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:1000,hanging:300}}}}]},
 ]},
 sections:[{
  properties:{page:{size:{width:12240,height:15840},margin:{top:1440,right:1440,bottom:1440,left:1440}}},
  footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,
    children:[new TextRun({text:"Amapola · 3rd Party Exchange & Sales Tracker — Build Guide      Page ",size:16,color:GREY}),
              new TextRun({children:[PageNumber.CURRENT],size:16,color:GREY})]})]})},
  children}]
});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync("PowerApps_Build_Guide.docx",b);console.log("docx bytes:",b.length);});
