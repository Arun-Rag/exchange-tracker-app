const fs=require('fs');
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,AlignmentType,LevelFormat,HeadingLevel,BorderStyle,WidthType,ShadingType,PageNumber,Footer}=require('docx');
const BRAND="0B4F8A",BRAND2="1769AA",LIGHT="EAF2F8",LINE="CCCCCC",GREY="6B7280";
const border={style:BorderStyle.SINGLE,size:1,color:LINE},borders={top:border,bottom:border,left:border,right:border};
const CW=9360;
function H1(t){return new Paragraph({heading:HeadingLevel.HEADING_1,children:[new TextRun(t)]});}
function P(t,opt={}){return new Paragraph({spacing:{after:140},children:[new TextRun({text:t,...opt})]});}
function bulletR(arr){return new Paragraph({numbering:{reference:"b",level:0},spacing:{after:70},children:arr.map(a=>new TextRun(a))});}
function q(arr){return new Paragraph({numbering:{reference:"n",level:0},spacing:{after:110},children:arr.map(a=>new TextRun(a))});}
function callout(title,text){return new Table({width:{size:CW,type:WidthType.DXA},columnWidths:[CW],rows:[new TableRow({children:[
 new TableCell({borders:{left:{style:BorderStyle.SINGLE,size:18,color:BRAND2},top:border,bottom:border,right:border},
  width:{size:CW,type:WidthType.DXA},shading:{fill:LIGHT,type:ShadingType.CLEAR},margins:{top:100,bottom:100,left:160,right:140},
  children:[new Paragraph({spacing:{after:40},children:[new TextRun({text:title+"  ",bold:true,color:BRAND})]}),new Paragraph({children:[new TextRun({text})]})]})]})]});}
function cell(text,head,w,fill){const rs=Array.isArray(text)?text:[{text:String(text),bold:!!head,color:head?"FFFFFF":"1F2937"}];
 return new TableCell({borders,width:{size:w,type:WidthType.DXA},shading:{fill:fill||(head?BRAND:"FFFFFF"),type:ShadingType.CLEAR},margins:{top:70,bottom:70,left:110,right:110},children:[new Paragraph({children:rs.map(r=>new TextRun(r))})]});}
function table(headers,rows,w){const head=new TableRow({tableHeader:true,children:headers.map((h,i)=>cell(h,true,w[i]))});
 const body=rows.map((r,ri)=>new TableRow({children:r.map((cc,i)=>cell(cc,false,w[i],ri%2?"F5F8FB":"FFFFFF"))}));
 return new Table({width:{size:CW,type:WidthType.DXA},columnWidths:w,rows:[head,...body]});}

const c=[];
c.push(new Paragraph({spacing:{after:40},children:[new TextRun({text:"Shared Exchange & Sales Tracker — Hosting request for IT",bold:true,size:32,color:BRAND})]}));
c.push(new Paragraph({spacing:{after:200},children:[new TextRun({text:"From: Arun Raghavan · 3rd Party Sales (Fokker 50 parts)",size:20,color:GREY})]}));

c.push(H1("What we want to do"));
c.push(P("We have a small web‑based application (a single HTML page) that our sales team uses to track 3rd‑party exchange and outright sales — what we ship to a customer, the core unit due back, repair orders, partial returns, prices and 30‑day reminder emails. Today it runs on one PC. We want to publish it so the whole team opens one web link in Microsoft Edge and works on the same live data. For security, we would prefer the data to be stored on company‑controlled infrastructure rather than a third‑party free service."));

c.push(H1("What the app technically needs"));
c.push(bulletR([{text:"Web hosting ",bold:true},{text:"for one static HTML file (no server-side code) — somewhere staff can reach it by link in Edge."}]));
c.push(bulletR([{text:"A database with a simple web (REST) API ",bold:true},{text:"that the page can read from and write to. The app currently speaks the PostgreSQL / PostgREST REST style (the same API used by Supabase), so a company-hosted Postgres + PostgREST or a self-hosted Supabase needs little or no change. Other databases are fine too — the app’s small data layer can be adjusted to match whatever you provide."}]));
c.push(bulletR([{text:"Roughly this much data: ",bold:true},{text:"a few hundred records today, growing slowly — very light load, a handful of simultaneous users."}]));
c.push(callout("Sensitivity","The data is commercially sensitive (customer names, part/serial numbers, prices, contact emails) but not regulated personal data. We’d like it kept inside the company and access limited to staff."));

c.push(H1("Questions to ask IT"));
c.push(q([{text:"Hosting: ",bold:true},{text:"Where can we host a single internal web page that staff open in Edge — an internal web server / IIS, a SharePoint site page, or our company Azure?"}]));
c.push(q([{text:"Database: ",bold:true},{text:"Can you provide a company-controlled database with a web API — e.g. a PostgreSQL instance with PostgREST, a self-hosted Supabase, or should the data live in a SharePoint list / Dataverse inside our Microsoft 365 tenant?"}]));
c.push(q([{text:"Sign-in: ",bold:true},{text:"Can the app sit behind our Microsoft 365 / Entra ID single sign-on so only Amapola staff can open it (instead of a shared key)?"}]));
c.push(q([{text:"Data location: ",bold:true},{text:"Are there rules on which country / tenant this data must be stored in?"}]));
c.push(q([{text:"Backups: ",bold:true},{text:"Who backs the database up, and how often?"}]));
c.push(q([{text:"Approved services: ",bold:true},{text:"Is a third-party cloud (e.g. Supabase / Netlify) acceptable for this, or must it stay on company / Microsoft infrastructure?"}]));
c.push(q([{text:"Ownership: ",bold:true},{text:"Who maintains and owns the hosting and database after it’s set up?"}]));

c.push(H1("Three hosting patterns IT can choose"));
c.push(table(["Pattern","Where data lives","Best when"],
 [["A. Inside Microsoft 365","SharePoint list (or Dataverse) in our own tenant","Strongest fit for security & governance — data stays where IT already controls it, with built-in logins and backups. Least new infrastructure."],
  ["B. Company-hosted database","PostgreSQL + PostgREST or self-hosted Supabase on our servers / Azure","We want to keep this exact web app and host the database ourselves, behind company sign-in."],
  ["C. Company Azure","Azure Static Web App + Azure database","We already use Azure and want it all in our cloud subscription."]],
 [2200,3380,3780]));
c.push(P("Any of the three keeps the data on company-controlled infrastructure. Pattern A is usually the safest and lowest-effort because it reuses the Microsoft 365 we already have.",{italics:true,color:GREY}));

c.push(H1("What we need back from IT"));
c.push(bulletR([{text:"A place to publish the web page ",bold:true},{text:"(a link staff can open in Edge), and"}]));
c.push(bulletR([{text:"Either a database endpoint + secure credentials, or a SharePoint site/list ",bold:true},{text:"for the data — plus, ideally, sign-in via our Microsoft 365 accounts."}]));
c.push(P("Once IT confirms the choice, the application’s data connection can be pointed at it (a small configuration change) and we go live. Our existing 114 records load in automatically.",{}));

const doc=new Document({creator:"Amapola",title:"Hosting request for IT",
 styles:{default:{document:{run:{font:"Arial",size:21}}},paragraphStyles:[
  {id:"Heading1",name:"Heading 1",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:26,bold:true,color:BRAND,font:"Arial"},paragraph:{spacing:{before:260,after:130},outlineLevel:0}}]},
 numbering:{config:[
  {reference:"b",levels:[{level:0,format:LevelFormat.BULLET,text:"•",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:560,hanging:280}}}}]},
  {reference:"n",levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:560,hanging:280}}}}]}]},
 sections:[{properties:{page:{size:{width:12240,height:15840},margin:{top:1440,right:1440,bottom:1440,left:1440}}},
  footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"Amapola · Shared Exchange Tracker — hosting request for IT      Page ",size:16,color:GREY}),new TextRun({children:[PageNumber.CURRENT],size:16,color:GREY})]})]})},
  children:c}]});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync("Questions_for_IT.docx",b);console.log("docx bytes:",b.length);});
