const fs=require('fs');
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,AlignmentType,LevelFormat,HeadingLevel,BorderStyle,WidthType,ShadingType,PageNumber,Footer,PageBreak,TableOfContents}=require('docx');
const BRAND="0B4F8A",BRAND2="1769AA",LIGHT="EAF2F8",LINE="CCCCCC",GREY="6B7280",CODEBG="F3F4F6";
const border={style:BorderStyle.SINGLE,size:1,color:LINE},borders={top:border,bottom:border,left:border,right:border};
const CW=9360;
function H1(t){return new Paragraph({heading:HeadingLevel.HEADING_1,children:[new TextRun(t)]});}
function H2(t){return new Paragraph({heading:HeadingLevel.HEADING_2,children:[new TextRun(t)]});}
function P(t,opt={}){return new Paragraph({spacing:{after:130},children:[new TextRun({text:t,...opt})]});}
function bulletR(a){return new Paragraph({numbering:{reference:"b",level:0},spacing:{after:60},children:a.map(x=>new TextRun(x))});}
function step(a){return new Paragraph({numbering:{reference:"n",level:0},spacing:{after:90},children:(Array.isArray(a)?a:[a]).map(x=>new TextRun(x))});}
function code(lines){return new Paragraph({shading:{fill:CODEBG,type:ShadingType.CLEAR},border:{left:{style:BorderStyle.SINGLE,size:14,color:BRAND2}},spacing:{before:60,after:120},
 children:lines.flatMap((l,i)=>i===0?[new TextRun({text:l,font:"Consolas",size:18})]:[new TextRun({break:1,text:l,font:"Consolas",size:18})])});}
function callout(title,text){return new Table({width:{size:CW,type:WidthType.DXA},columnWidths:[CW],rows:[new TableRow({children:[
 new TableCell({borders:{left:{style:BorderStyle.SINGLE,size:18,color:BRAND2},top:border,bottom:border,right:border},width:{size:CW,type:WidthType.DXA},shading:{fill:LIGHT,type:ShadingType.CLEAR},margins:{top:100,bottom:100,left:160,right:140},
  children:[new Paragraph({spacing:{after:40},children:[new TextRun({text:title+"  ",bold:true,color:BRAND})]}),new Paragraph({children:[new TextRun({text})]})]})]})]});}
function cell(t,head,w,fill){const rs=Array.isArray(t)?t:[{text:String(t),bold:!!head,color:head?"FFFFFF":"1F2937"}];
 return new TableCell({borders,width:{size:w,type:WidthType.DXA},shading:{fill:fill||(head?BRAND:"FFFFFF"),type:ShadingType.CLEAR},margins:{top:70,bottom:70,left:110,right:110},children:[new Paragraph({children:rs.map(r=>new TextRun(r))})]});}
function table(headers,rows,w){return new Table({width:{size:CW,type:WidthType.DXA},columnWidths:w,rows:[new TableRow({tableHeader:true,children:headers.map((h,i)=>cell(h,true,w[i]))}),...rows.map((r,ri)=>new TableRow({children:r.map((c,i)=>cell(c,false,w[i],ri%2?"F5F8FB":"FFFFFF"))}))]});}
function spacer(){return new Paragraph({spacing:{after:40},children:[new TextRun("")]});}

const c=[];
c.push(new Paragraph({spacing:{before:1100,after:0},alignment:AlignmentType.CENTER,children:[new TextRun({text:"3rd Party Exchange & Sales Tracker",bold:true,size:44,color:BRAND})]}));
c.push(new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:60},children:[new TextRun({text:"Complete Step-by-Step Run Procedure",size:27,color:BRAND2})]}));
c.push(new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:520},children:[new TextRun({text:"From opening it today to publishing one shared live list for the whole team",size:20,color:GREY})]}));
c.push(new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"Amapola · Fokker 50 parts · prepared for Arun Raghavan",size:20})]}));
c.push(new Paragraph({children:[new PageBreak()]}));
c.push(H1("Contents"));
["Part 1 — Try it on your own PC (today, 5 minutes)","Part 2 — Publish it so everyone shares one live list","Part 3 — Turn on automatic 30-day reminder emails","Part 4 — How to use it day-to-day","Part 5 — Backups, roles & safety"].forEach(t=>c.push(new Paragraph({spacing:{after:80},children:[new TextRun({text:t,size:23})]})));
c.push(new Paragraph({children:[new PageBreak()]}));

c.push(H1("The files you have"));
c.push(bulletR([{text:"Exchange_Tracker_App_SHARED.html ",bold:true},{text:"— the application itself (this is the only file you publish)."}]));
c.push(bulletR([{text:"This procedure ",bold:true},{text:"— the runbook you are reading."}]));
c.push(bulletR([{text:"Questions_for_IT.docx ",bold:true},{text:"— hand this to IT to agree where the data is stored (see Part 2)."}]));

c.push(H1("Part 1 — Try it on your own PC (today, 5 minutes)"));
c.push(P("You can use the app immediately, before any publishing. In this mode the data is saved only on your own computer — perfect for trying it out."));
c.push(step(["Save ",{text:"Exchange_Tracker_App_SHARED.html",bold:true}," to a folder you can find (e.g. Documents)."]));
c.push(step(["Right-click it → ",{text:"Open with → Microsoft Edge",bold:true},". (To always use Edge: Open with → Choose another app → Microsoft Edge → tick “Always”.)"]));
c.push(step(["The app opens. Bottom of the sidebar shows ",{text:"“Local • this PC”",bold:true}," and your 114 orders are already loaded."]));
c.push(step("Try adding an order, editing one, sending a test reminder. Everything you change is saved automatically on this PC."));
c.push(callout("This is single-PC only","In Part 1 each computer keeps its own copy. To get everyone on one shared live list, do Part 2."));

c.push(new Paragraph({children:[new PageBreak()]}));
c.push(H1("Part 2 — Publish it so everyone shares one live list"));
c.push(P("To let the whole team edit one shared list, the data must live in one online database, and the page must be reachable by a link. Because the company wants the data kept safely, agree the location with IT first."));

c.push(H2("Step 1 — Agree the data location with IT"));
c.push(P("Send IT the “Questions_for_IT.docx” brief. They will choose one of these — all keep the data on company-controlled infrastructure:"));
c.push(table(["Choice","What IT provides","Notes"],
 [["Company-hosted database","A PostgreSQL + PostgREST or a self-hosted Supabase, on company servers / Azure, with a URL and a key","Recommended for security. The app works with this directly."],
  ["Approved cloud database","A Supabase project in a company-approved account","Same steps as below, hosted by Supabase."],
  ["Microsoft 365 (SharePoint)","A SharePoint list in our tenant","Most governed. Tell us if IT picks this — the app’s data connection is then pointed at SharePoint instead (a small change we make for you)."]],
 [2300,4060,3000]));
c.push(callout("What you need from IT","Two things: (1) a database URL + key (or a SharePoint site), and (2) somewhere to publish the web page (an internal web/SharePoint page, or an approved host)."));

c.push(H2("Step 2 — Create the two database tables"));
c.push(P("Whoever owns the database (you or IT) runs this once. In Supabase: open SQL Editor → New query → paste → Run. (For a company PostgreSQL, IT runs the same SQL.)"));
c.push(code(["create table exchanges ( id int8 primary key, doc jsonb );",
 "create table app_meta ( k text primary key, v jsonb );",
 "",
 "alter table exchanges enable row level security;",
 "alter table app_meta  enable row level security;",
 "create policy app_all  on exchanges for all using (true) with check (true);",
 "create policy meta_all on app_meta  for all using (true) with check (true);"]));

c.push(H2("Step 3 — Connect the app to the database"));
c.push(step(["Get the ",{text:"URL",bold:true}," and the ",{text:"key",bold:true}," (in Supabase: Project Settings → API → Project URL and anon public key)."]));
c.push(step(["Open ",{text:"Exchange_Tracker_App_SHARED.html",bold:true}," in Notepad (right-click → Open with → Notepad). Near the top find:"]));
c.push(code(['const CONFIG={SUPABASE_URL:"",SUPABASE_KEY:""};']));
c.push(step("Paste your two values between the quotes and save the file:"));
c.push(code(['const CONFIG={SUPABASE_URL:"https://YOURPROJECT.supabase.co",',
 '              SUPABASE_KEY:"YOUR-ANON-KEY"};']));
c.push(step(["Open the file once. The sidebar should now read ",{text:"“Shared • live”",bold:true}," and your 114 orders upload to the database automatically on this first open."]));

c.push(H2("Step 4 — Publish the page (get the link)"));
c.push(P("Put the saved file where staff can open it by link:"));
c.push(bulletR([{text:"Company / SharePoint page (recommended): ",bold:true},{text:"IT hosts the single HTML file on an internal web page or SharePoint site so only staff can reach it."}]));
c.push(bulletR([{text:"Approved host: ",bold:true},{text:"if allowed, drag the file onto app.netlify.com/drop to get an instant web address."}]));

c.push(H2("Step 5 — Share it"));
c.push(step("Send the link to the team. Everyone opens it in Microsoft Edge — no install — and they all see and edit the same live list. Changes appear for others within ~20 seconds (or on Reload)."));

c.push(new Paragraph({children:[new PageBreak()]}));
c.push(H1("Part 3 — Turn on automatic 30-day reminder emails"));
c.push(P("Inside the app, anyone can send a reminder in one click (to the customer, CC thomas.carlborg@amapola.nu, mohsen.kharazi@amapola.nu, arun.raghavan@amapola.nu, plus any Extra CC on the order). To make reminders fire on their own at 30 days even when nobody has the app open, add one scheduled job in Power Automate (you have it with Microsoft 365):"));
c.push(step(["Power Automate → Create → ",{text:"Scheduled cloud flow",bold:true}," (e.g. daily 08:00)."]));
c.push(step(["Add ",{text:"HTTP – GET",bold:true}," to read the database, with header ",{text:"apikey: <your key>",bold:true},":"]));
c.push(code(["GET https://YOURPROJECT.supabase.co/rest/v1/exchanges?select=id,doc"]));
c.push(step(["Parse the result; keep orders where status is Open or Partial and the date is more than 30 days ago."]));
c.push(step(["For each, add ",{text:"Send an email (V2)",bold:true}," to the customer, CC the three colleagues (and the order’s Extra CC), listing the unit P/Ns."]));
c.push(callout("Prefer no scripts?","If you’d rather not run any flow, the Microsoft 365 / Power Apps route (Option 1) has this 30-day reminder built in as a guided click-through. Pick whichever suits how you want to run it."));

c.push(new Paragraph({children:[new PageBreak()]}));
c.push(H1("Part 4 — How to use it day-to-day"));
c.push(H2("Create an exchange order with several units"));
c.push(step(["Click ",{text:"New exchange",bold:true}," (top of the sidebar)."]));
c.push(step(["Fill ",{text:"Order details",bold:true},": Customer (pick, or type a new name to add it), Date, Sales Order No, Return status (Open / Partial / Closed), Ownership, and ",{text:"Extra CC emails",bold:true}," if this order needs extra people copied."]));
c.push(step(["Under ",{text:"Units in this order",bold:true},", fill the first unit: P/N, S/N, Qty, Description, sales price, core P/N & S/N, exchange status, stock location (e.g. Kenya), RO, repair shop, repair quote, failed nozzles, nozzle charge."]));
c.push(step(["Click ",{text:"+ Add another unit",bold:true}," for each additional unit on the same order. Remove a unit with the × on its card."]));
c.push(step(["Add a whole-order Comment if needed, then ",{text:"Save order",bold:true},"."]));
c.push(H2("Add a customer and email"));
c.push(step(["Sidebar → ",{text:"Customers",bold:true}," → + Add customer → type name and email → Save. (Emails are where reminders are sent.) You can also add a customer just by typing a new name in the order form."]));
c.push(H2("Partial returns & status"));
c.push(P("Set an order to Partial when some units are back and some are still owed (e.g. stored at another location). Use the Stock location field on a unit to note where it is held. Closed = fully done."));
c.push(H2("Reminders & overdue"));
c.push(bulletR([{text:"Overdue: ",bold:true},{text:"orders past 30 days with cores still owed are flagged red, listed in the Overdue view, and shown in a banner when you open the app."}]));
c.push(bulletR([{text:"One reminder: ",bold:true},{text:"open an order → Send reminder. Your email opens pre-filled to the customer, CC the three colleagues plus the order’s Extra CC, listing the units."}]));
c.push(bulletR([{text:"All overdue: ",bold:true},{text:"open the Overdue view → Send overdue reminders → it opens them one at a time (click “Send next” after each)."}]));
c.push(H2("Find things & see totals"));
c.push(P("Use the search box (P/N, S/N, customer, RO, SO), the customer filter, and the sidebar views (Overdue / Open / Partial / Closed / Nozzle claims). The top cards show live totals."));

c.push(H1("Part 5 — Backups, roles & safety"));
c.push(bulletR([{text:"Backup anytime: ",bold:true},{text:"sidebar → Backup downloads a full copy (orders + customers + settings). Restore loads one back."}]));
c.push(bulletR([{text:"Settings: ",bold:true},{text:"change the CC list, the overdue days (default 30) and the default per-nozzle charge."}]));
c.push(bulletR([{text:"Who does what: ",bold:true},{text:"anyone with the link can view and edit; IT owns the database and hosting; keep the link internal to Amapola."}]));
c.push(bulletR([{text:"Safety: ",bold:true},{text:"with the company-hosted/approved database the data stays under company control and is backed up by IT; the app also keeps an offline copy and the Backup button gives you a manual copy any time."}]));
c.push(spacer());
c.push(P("Quick path if you just want it shared fast: Part 1 to try it → give IT the brief (Part 2 Step 1) → once they hand you a URL + key, do Part 2 Steps 3–5 → optionally Part 3 for auto-emails.",{italics:true,color:GREY}));

const doc=new Document({creator:"Amapola",title:"Exchange Tracker — complete run procedure",
 styles:{default:{document:{run:{font:"Arial",size:21}}},paragraphStyles:[
  {id:"Heading1",name:"Heading 1",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:28,bold:true,color:BRAND,font:"Arial"},paragraph:{spacing:{before:260,after:140},outlineLevel:0}},
  {id:"Heading2",name:"Heading 2",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:23,bold:true,color:BRAND2,font:"Arial"},paragraph:{spacing:{before:180,after:100},outlineLevel:1}}]},
 numbering:{config:[
  {reference:"b",levels:[{level:0,format:LevelFormat.BULLET,text:"•",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:560,hanging:280}}}}]},
  {reference:"n",levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:560,hanging:280}}}}]}]},
 sections:[{properties:{page:{size:{width:12240,height:15840},margin:{top:1440,right:1440,bottom:1440,left:1440}}},
  footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"Amapola · Exchange Tracker — run procedure      Page ",size:16,color:GREY}),new TextRun({children:[PageNumber.CURRENT],size:16,color:GREY})]})]})},
  children:c}]});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync("Exchange_Tracker_Run_Procedure.docx",b);console.log("docx bytes:",b.length);});
