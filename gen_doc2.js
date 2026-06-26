const fs=require('fs');
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,AlignmentType,
 LevelFormat,HeadingLevel,BorderStyle,WidthType,ShadingType,PageNumber,Footer,PageBreak}=require('docx');
const BRAND="0B4F8A",BRAND2="1769AA",LIGHT="EAF2F8",LINE="CCCCCC",GREY="6B7280",CODEBG="F3F4F6";
const border={style:BorderStyle.SINGLE,size:1,color:LINE},borders={top:border,bottom:border,left:border,right:border};
const CW=9360;
function H1(t){return new Paragraph({heading:HeadingLevel.HEADING_1,children:[new TextRun(t)]});}
function H2(t){return new Paragraph({heading:HeadingLevel.HEADING_2,children:[new TextRun(t)]});}
function P(t,opt={}){return new Paragraph({spacing:{after:140},children:[new TextRun({text:t,...opt})]});}
function bulletR(arr){return new Paragraph({numbering:{reference:"b",level:0},spacing:{after:60},children:arr.map(a=>new TextRun(a))});}
function step(arr,ref="n"){return new Paragraph({numbering:{reference:ref,level:0},spacing:{after:90},children:(Array.isArray(arr)?arr:[arr]).map(a=>new TextRun(a))});}
function code(lines){return new Paragraph({shading:{fill:CODEBG,type:ShadingType.CLEAR},border:{left:{style:BorderStyle.SINGLE,size:14,color:BRAND2}},spacing:{before:60,after:120},
 children:lines.flatMap((l,i)=>i===0?[new TextRun({text:l,font:"Consolas",size:18})]:[new TextRun({break:1,text:l,font:"Consolas",size:18})])});}
function callout(title,text){return new Table({width:{size:CW,type:WidthType.DXA},columnWidths:[CW],rows:[new TableRow({children:[
 new TableCell({borders:{left:{style:BorderStyle.SINGLE,size:18,color:BRAND2},top:border,bottom:border,right:border},
  width:{size:CW,type:WidthType.DXA},shading:{fill:LIGHT,type:ShadingType.CLEAR},margins:{top:100,bottom:100,left:160,right:140},
  children:[new Paragraph({spacing:{after:40},children:[new TextRun({text:title+"  ",bold:true,color:BRAND})]}),new Paragraph({children:[new TextRun({text})]})]})]})]});}
function cell(text,head,w,fill){const rs=Array.isArray(text)?text:[{text:String(text),bold:!!head,color:head?"FFFFFF":"1F2937"}];
 return new TableCell({borders,width:{size:w,type:WidthType.DXA},shading:{fill:fill||(head?BRAND:"FFFFFF"),type:ShadingType.CLEAR},margins:{top:70,bottom:70,left:110,right:110},children:[new Paragraph({children:rs.map(r=>new TextRun(r))})]});}
function table(headers,rows,w){const head=new TableRow({tableHeader:true,children:headers.map((h,i)=>cell(h,true,w[i]))});
 const body=rows.map((r,ri)=>new TableRow({children:r.map((c,i)=>cell(c,false,w[i],ri%2?"F5F8FB":"FFFFFF"))}));
 return new Table({width:{size:CW,type:WidthType.DXA},columnWidths:w,rows:[head,...body]});}

const c=[];
c.push(new Paragraph({spacing:{before:1100,after:0},alignment:AlignmentType.CENTER,children:[new TextRun({text:"3rd Party Exchange & Sales Tracker",bold:true,size:46,color:BRAND})]}));
c.push(new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:60},children:[new TextRun({text:"OPTION 2 — Publish the web app with a shared online database",size:26,color:BRAND2})]}));
c.push(new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:500},children:[new TextRun({text:"Amapola · everyone uses one live list, in Microsoft Edge, from a web link",size:21,color:GREY})]}));
c.push(new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"Prepared for: Arun Raghavan",size:21})]}));
c.push(new Paragraph({children:[new PageBreak()]}));

c.push(H1("What this option is"));
c.push(P("This keeps the exact web app you already have — the same dashboard, forms, overdue flags and reminders — but moves its data out of each person’s browser and into one shared online database. Everyone then opens the same web link in Microsoft Edge and works on the same live list at the same time. No spreadsheets, no Microsoft Excel."));
c.push(P("It uses two free services:"));
c.push(bulletR([{text:"Supabase ",bold:true},{text:"— a free hosted database that holds the shared records."}]));
c.push(bulletR([{text:"A static web host (e.g. Netlify) ",bold:true},{text:"— gives the app a web address everyone can open. (You can also host it on your own company web server or a SharePoint page.)"}]));
c.push(callout("Good to know","The file delivered as “Exchange_Tracker_App_SHARED.html” already contains the shared-database code. It runs in safe local mode until you paste in your database keys (Step 2); the moment the keys are present it switches to the shared live list automatically, and on first run it uploads your 114 records for you."));

c.push(H1("Step 1 — Create the shared database (Supabase)"));
c.push(step("Go to supabase.com, sign up (free), and click New project. Give it a name, set a database password, pick the closest region, and wait ~2 minutes for it to be ready."));
c.push(step("Open the SQL Editor (left menu) → New query, paste the script below, and click Run. It creates the two tables the app needs and allows the app to read/write them."));
c.push(code(["create table exchanges ( id int8 primary key, doc jsonb );",
 "create table app_meta ( k text primary key, v jsonb );",
 "",
 "alter table exchanges enable row level security;",
 "alter table app_meta  enable row level security;",
 "",
 "create policy app_all on exchanges for all using (true) with check (true);",
 "create policy meta_all on app_meta  for all using (true) with check (true);"]));
c.push(P("That’s the whole database. You never need to touch it again — the app fills and updates it."));

c.push(H1("Step 2 — Connect the app to the database"));
c.push(step(["In Supabase, go to ",{text:"Project Settings → API",bold:true},". Copy two things: the ",{text:"Project URL",bold:true}," and the ",{text:"anon public",bold:true}," key."]));
c.push(step(["Open ",{text:"Exchange_Tracker_App_SHARED.html",bold:true}," in Notepad (right-click → Open with → Notepad). Near the very top of the script find this line:"]));
c.push(code(['const CONFIG={SUPABASE_URL:"",SUPABASE_KEY:""};']));
c.push(step("Paste your two values between the quotes, for example:"));
c.push(code(['const CONFIG={SUPABASE_URL:"https://abcd1234.supabase.co",',
 '              SUPABASE_KEY:"eyJhbGciOiJIUzI1NiIsInR5cCI6..."};']));
c.push(step("Save the file. Open it once yourself — it should say “Shared • live” at the bottom of the sidebar and show all 114 records (uploaded automatically on this first run)."));

c.push(H1("Step 3 — Publish the link for everyone"));
c.push(P("Now put the connected file online so colleagues open a link instead of a file. The easiest free way:"));
c.push(step(["Go to ",{text:"app.netlify.com/drop",bold:true}," and drag the saved HTML file onto the page. Netlify instantly gives you a web address (you can rename it, e.g. amapola-exchanges.netlify.app)."]));
c.push(step("Share that link with your team. Everyone opens it in Microsoft Edge — no install — and they all see and edit the same live list."));
c.push(callout("Other hosting choices","Any static host works: Microsoft Azure Static Web Apps, a SharePoint site page, GitHub Pages, or your own company web server / intranet. The only requirement is that it serves the single HTML file over a web link (https)."));

c.push(H1("Step 4 — Automatic 30-day reminder emails"));
c.push(P("Inside the app, anyone can send a reminder in one click (to the customer, CC thomas.carlborg@amapola.nu, mohsen.kharazi@amapola.nu and arun.raghavan@amapola.nu), and the app flags everything overdue the moment it’s opened."));
c.push(P("For reminders that fire on their own at 30 days even when nobody has the app open, add one small scheduled job. Because you have Microsoft 365, the simplest is a Power Automate flow:"));
c.push(step(["Create a ",{text:"Scheduled cloud flow",bold:true}," (e.g. daily 08:00)."]));
c.push(step(["Add ",{text:"HTTP",bold:true}," → GET your Supabase rows, using the URL and a header ",{text:"apikey: <anon key>",bold:true},":"]));
c.push(code(["GET https://abcd1234.supabase.co/rest/v1/exchanges?select=id,doc"]));
c.push(step(["Parse the result, keep rows where doc/OrderStatus is Open or Partial and the date is more than 30 days ago, then for each add ",{text:"Send an email (V2)",bold:true}," to the customer with the three CC addresses."]));
c.push(callout("Fully managed alternative","If you would rather not run any scripts at all, Option 1 (Power Apps + SharePoint) has this 30-day reminder built in as a guided step. The two options can’t both be the live system at once — pick whichever you prefer after reviewing both."));

c.push(H1("Security & cost"));
c.push(bulletR([{text:"Cost: ",bold:true},{text:"Supabase and Netlify both have free tiers that comfortably cover a tool of this size. No licence to buy."}]));
c.push(bulletR([{text:"Access: ",bold:true},{text:"The anon key sits inside the web page, so anyone who has the link can read and edit. Keep the link internal to Amapola. The simple policies above are fine for an internal team tool; if you later need named logins, Supabase supports adding sign-in."}]));
c.push(bulletR([{text:"Backups: ",bold:true},{text:"The app’s Backup button still works and downloads a full copy any time; Supabase also keeps its own automatic backups."}]));

c.push(H1("How it compares to Option 1"));
c.push(table(["",[{text:"Option 1 — Power Apps",bold:true,color:"FFFFFF"}],[{text:"Option 2 — this guide",bold:true,color:"FFFFFF"}]],
 [["Where it lives","Inside Microsoft 365","Supabase + a web host"],
  ["Look & feel","Rebuilt in Power Apps","Exactly the app you have now"],
  ["Auto 30-day emails","Built-in guided step","Add a small scheduled job"],
  ["Setup effort","Half a day","~1 hour"],
  ["Who maintains it","Microsoft 365 / IT","You / whoever set it up"],
  ["Extra cost","None","None (free tiers)"]],[2400,3480,3480]));
c.push(P("Both put everyone on one shared live list, opened in Edge. Review them and pick the one that fits how you’d rather run it.",{italics:true,color:GREY}));

const doc=new Document({creator:"Amapola",title:"Option 2 — Shared web app deployment guide",
 styles:{default:{document:{run:{font:"Arial",size:21}}},paragraphStyles:[
  {id:"Heading1",name:"Heading 1",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:29,bold:true,color:BRAND,font:"Arial"},paragraph:{spacing:{before:280,after:150},outlineLevel:0}},
  {id:"Heading2",name:"Heading 2",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:24,bold:true,color:BRAND2,font:"Arial"},paragraph:{spacing:{before:200,after:110},outlineLevel:1}}]},
 numbering:{config:[
  {reference:"b",levels:[{level:0,format:LevelFormat.BULLET,text:"•",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:560,hanging:280}}}}]},
  {reference:"n",levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:560,hanging:280}}}}]}]},
 sections:[{properties:{page:{size:{width:12240,height:15840},margin:{top:1440,right:1440,bottom:1440,left:1440}}},
  footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"Amapola · 3rd Party Exchange & Sales Tracker — Option 2 (Shared web app)      Page ",size:16,color:GREY}),new TextRun({children:[PageNumber.CURRENT],size:16,color:GREY})]})]})},
  children:c}]});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync("Option2_Shared_WebApp_Guide.docx",b);console.log("docx bytes:",b.length);});
