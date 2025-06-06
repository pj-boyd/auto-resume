function autoFormat2() {
  unFormat();
  const resume = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Auto-Resume');
  const allData = resume.getRange('A1:F35').getDisplayValues();
  var dateIndex = [0];
  const maxRows = allData.length;
  const dates = SpreadsheetApp.newTextStyle().setItalic(true).build();
  const bold = SpreadsheetApp.newTextStyle().setBold(true).build();
  const header = SpreadsheetApp.newTextStyle().setFontSize(16).setBold(true).build();
  const regText = SpreadsheetApp.newTextStyle().setFontFamily('Default').setFontSize(12).setBold(false).setItalic(false).build();
  var k = Int16Array;
  var j = 0;
  const green = '#34a853';
  const headerHeight = 40;
  const titleHeight = 25;

  //Sets column widths
  //Finds cells in Column E that are not blank
  for(let i = 0; i < maxRows; i++)
  {
    k = allData[i][4].length;
    if(k>0){
      dateIndex.push(i+1);
    }
  }
  //Removes initialized 0
  dateIndex.reverse(); dateIndex.pop(); dateIndex.reverse();
  //Merges Columns E and F
  dateIndex.forEach(function(row){
    resume.getRange(row,5,1,2).merge();
  });
  // Removes the LinkedIn link from the set
  dateIndex.reverse(); dateIndex.pop(); dateIndex.reverse();
  //Formats date cells
  dateIndex.forEach(function(row){
    resume.getRange(row,5,1,2).setTextStyle(dates);
    resume.getRange(row,5,1,2).setHorizontalAlignment('right');
  });
  // Removes all values from dateIndex except one 0
  while(dateIndex.length > 1){
    dateIndex.pop();
  }
  dateIndex[0]=0;
  // Finds all dates in Column F
  for(let i = 0; i < maxRows; i++){
    k = allData[i][5].length;
    if(k>0){
      dateIndex.push(i+1);
    }
  }
  dateIndex.reverse();dateIndex.pop();dateIndex.reverse();
  // Formats date cells in Column F
  dateIndex.forEach(function(row){
    resume.getRange(row,6).setTextStyle(dates);
    resume.getRange(row,6).setHorizontalAlignment('right');
  })
  // Formats title block
  const myName = resume.getRange('A1:F1').merge();
  const myPhone = resume.getRange('A2:B2').merge();
  const myEmail = resume.getRange('C2:D2').merge();
  const myLinkedIn = resume.getRange('E2');
  const header1 = resume.getRange('A4:F4').merge();
  const myStatement = resume.getRange('A3:F3').merge()
  resume.setRowHeight(2,25);
  myPhone.setHorizontalAlignment('left').setVerticalAlignment('top').setTextStyle(bold);
  myName.setHorizontalAlignment('center').setTextStyle(header).setFontSize(24).setFontColor(green);
  myEmail.setHorizontalAlignment('center').setVerticalAlignment('top').setTextStyle(bold);
  myLinkedIn.setHorizontalAlignment('right').setVerticalAlignment('top').setTextStyle(bold);
  myStatement.setWrap(true).setHorizontalAlignment('center');
  header1.setTextStyle(header).setFontColor(green);
  resume.setRowHeight(4,headerHeight);
  //Locates PE Exam, FE Exam, and BSE
  var peExam; var feExam; var bachelors; var text1;
  for(let i=0; i < maxRows; i++){
    text1 = allData[i][0].substring(0,10);
    if(text1 == "Principles"){
      peExam = i+1;
    } 
    if(text1 == "Fundamenta"){
      feExam = i+1;
    } 
    if(text1 == "BSE in Eng"){
      bachelors = i+1;
    }
  }
  var dash;
  //Merges across the column for the PE, FE, and BSE
  if(peExam>1){resume.getRange(peExam,1,1,5).merge().setTextStyle(bold);
  text1 = resume.getRange(peExam,1).getDisplayValue();
  dash = text1.indexOf('-');
  var richTextEdu = SpreadsheetApp.newRichTextValue().setText(text1).setTextStyle(0,dash,bold).setTextStyle(dash+1,text1.length,regText).build();
  resume.getRange(peExam,1).setRichTextValue(richTextEdu);}
  if(feExam>1){resume.getRange(feExam,1,1,5).merge().setTextStyle(bold);
  text1 = resume.getRange(feExam,1).getDisplayValue();
  dash = text1.indexOf('-');
  richTextEdu = SpreadsheetApp.newRichTextValue().setText(text1).setTextStyle(0,dash,bold).setTextStyle(dash+1,text1.length,regText).build();
  resume.getRange(feExam,1).setRichTextValue(richTextEdu);}
  if(bachelors>1){resume.getRange(bachelors,1,1,5).merge().setTextStyle(bold);
  text1 = resume.getRange(bachelors,1).getDisplayValue();
  dash = text1.indexOf('-');
  richTextEdu = SpreadsheetApp.newRichTextValue().setText(text1).setTextStyle(0,dash,bold).setTextStyle(dash+1,text1.length,regText).build();
  resume.getRange(bachelors,1).setRichTextValue(richTextEdu);}
  //Counts included Skills & Programs rows
  var n = allData.length; var m = n;
  var check = true;

  //Counts white space after resume
  while (check==true&m>0){
    m--
    text1 = allData[m][0];
    check = isBlank(text1);
  }
  m++; m++;

  // Finds the Skills & Programs Header
  check = true;
  while (check==true & n>0){
    n--
    text1 = allData[n][0];
    check = isLetter(text1.substring(7,8));
    if(isBlank(text1.substring(7,8))){check = true;}
  }

  // Formats the Skills & Programs Header
  var snPHeader;
  n++;
  snPHeader = n;
  resume.getRange(snPHeader,1,1,6).merge().setTextStyle(header).setFontColor(green).setVerticalAlignment('bottom');
  resume.setRowHeight(snPHeader,headerHeight);
  
  // Formats skills & Programs
  n++;
  var colon;
  var skillSet = resume.getRange(n,1,m-n,1);
  var skillRange = skillSet.getDisplayValues();
  var rowNum;
  var richTextSkills;
  for(let i = 0;i<m-n;i++){
    rowNum = n+i;
    text1 = skillRange[i][0];
    colon = text1.indexOf(':');
    Logger.log("Colon at: "+colon+" Length: "+text1.length);
    if(colon<text1.length-1&colon>0){richTextSkills = SpreadsheetApp.newRichTextValue().setText(text1).setTextStyle(0,colon+1,bold).setTextStyle(colon+2,text1.length,regText).build();}
    else{richTextSkills = SpreadsheetApp.newRichTextValue().setText(text1).setTextStyle(0,text1.length,bold).build();}
    resume.getRange(rowNum,1,1,6).merge().setRichTextValue(richTextSkills).setWrap(true);
  }

  //Formats the Experience Section
  var expHeader;
  for(let i=bachelors;i<maxRows;i++){
    expHeader = i;
    text1 = allData[i][0];
    if(text1.substring(0,10)=='Experience') {i=maxRows;}
  }
  expHeader++;
  resume.getRange(expHeader,1,1,6).merge().setTextStyle(header).setFontColor(green);
  resume.setRowHeight(expHeader,headerHeight);
  
  //Finds Job Titles
  var jobRows = [0]; var jobs = 0;
  for(let i=expHeader; i<snPHeader-1;i++){
    text1 = allData[i][0];
    if(isLetter(text1.substring(0,1))){
      jobRows.push(i);
      jobs++;
    }
  }
  jobRows.reverse();jobRows.pop();jobRows.reverse();

  //Formats job title rows
  var jobRange;
  var comma; 
  var len;
  var arrLen;
  var textArr;
  var text2;
  for(let i=0;i<jobs;i++){
    rowNum = jobRows[i]+1;
    jobRange = resume.getRange(rowNum,1,1,4);
    textArr = jobRange.getDisplayValues();
    text1 = textArr[0].toString();
    arrLen = text1.length;
    text2 = text1.substring(0,arrLen-3);
    if(text2.indexOf(',')>0){comma = text2.indexOf(',');} else {comma = text2.indexOf('-');}
    len = text2.length;
    var richTextJobs = SpreadsheetApp.newRichTextValue().setText(text2).setTextStyle(0,comma,bold).setTextStyle(comma+1,len-1,regText).build();
    jobRange.merge();
    jobRange.setRichTextValue(richTextJobs).setWrap(true);
    resume.setRowHeight(rowNum,titleHeight);
  }
  //Formats rows in the "Experience" section that are not job titles
  var titleCheck = false;
  for(let i=0;i<snPHeader-expHeader-1;i++){
    j = expHeader+i;
    rowNum = j+1;
    for(let k=0;k<jobRows.length;k++){if(j == jobRows[k]){titleCheck=true;}}
    if(titleCheck==false){resume.getRange(rowNum,1,1,6).merge(); resume.getRange(rowNum,1).setWrap(true);}
    titleCheck = false;
  }

  //Counts included classes
  j = 0;
  for(let i=bachelors;i<maxRows;i++){
    text1 = allData[i][0];
    if(isLetter(text1.substring(0,1))==false){
      j++;
    } else if(text1.substring(0,10)=='Experience') {i=maxRows;}
  }
  var classes = halfRoundDown(j);
  var classList = resume.getRange(bachelors+1,1,j,1).getDisplayValues();
  // Moves classes from the lower half to Column E
  for(let i = 0; i<j-classes; i++){
    rowNum = bachelors+1+j-classes+i;
    text1 = classList[i+classes];
    rowNum = bachelors+1+i;
    resume.getRange(rowNum,4).setValue(text1);
  }

  var classRows = halfRoundUp(j);

  //Merges cells containig classes
  for(let i = 0;i<classRows;i++){
    rowNum = bachelors+1+i;
    resume.getRange(rowNum,1,1,3).merge();
    resume.getRange(rowNum,4,1,3).merge();
  }
  //Deletes redundant rows
  for(let i = 0;i<j-classRows;i++){
    rowNum = bachelors+1+j-classes;
    resume.deleteRow(rowNum);
  }
  //Sets column widths
  resume.setColumnWidths(1,4,112).setColumnWidth(5,132).setColumnWidth(6,93);
}

function halfRoundUp(num){
  var i;
  if(num%2 == 0){
    i = num/2;
  } else {
    num++;
    i = num/2;
  }
  return i;
}
function halfRoundDown(num){
  var i;
  if(num%2 == 0){
    i = num/2;
  } else {
    num--;
    i = num/2;
  }
  return i;
}

function test(){
  const letter = 'a';
  const notLetter = '&';
  const space = ' ';
  const nSet = null;
  var check = false;
  check = isBlank(letter);
  Logger.log(letter+' '+check);
  check = isBlank(space);
  Logger.log(space+' '+check);
  check = isBlank(nSet);
  Logger.log(nSet+' '+check);
}


function print(){
  const url1 = 'https://docs.google.com/spreadsheets/d/';
  const url2 = '/export?format=pdf';
  const txtGID = '&gid=';
  const txtRange = '&range=';
  const txtPaper = '&size=letter&portrait=true';
  //Gets the ID of the spreadsheet
  var ss = SpreadsheetApp.getActive();
  var ssID = ss.getId();

  var sheet1 = ss.getSheetByName('Auto-Resume');
  var coName = sheet1.getRange('I6').getValue();
  var posTitle = sheet1.getRange('I7').getValue();
  var ssTitle = ("Resume  - Boyd - "+coName);
  ss.rename(ssTitle);
  ss.renameActiveSheet(posTitle);
  var id1 = sheet1.getSheetId();
  var row1 = sheet1.getLastRow();
  var rng1 = 'A1:F'+row1;
  var rng2 = sheet1.getRange(rng1);
  sheet1.setHiddenGridlines(true);
  var url0 = url1+ssID+url2+txtGID+id1+txtRange+rng1+txtPaper;
  var html = HtmlService.createHtmlOutput("<script>window.open('"+url0+"','_blank'); google.script.host.close();</script>");
  SpreadsheetApp.getUi().showModalDialog(html,'Generating PDF');

  ss.rename("Resume - Boyd - 032025");
  ss.renameActiveSheet("Auto-Resume");
}

function isBlank(str){
  const space = ' ';
  const doubleSpace = " ";
  const blank = '';
  const doubleBlank = "";

  var blankCheck = false;
  if(isNull(str)){blankCheck = true; return blankCheck;}
  else if(str == space){blankCheck = true; return blankCheck;}
  else if(str == doubleSpace){blankCheck = true; return blankCheck;}
  else if(str == blank){blankCheck = true; return blankCheck;}
  else if(str == doubleBlank){blankCheck = true; return blankCheck;}

  return blankCheck;
}

function isNull(str){
  var nullCheck = false;
  if(str == null){nullCheck = true; return nullCheck;}
  return nullCheck;
}

function isLetter(str){
  const lower = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
  const upper = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']; 
  var letterCheck = false;

  lower.forEach(function(letter){
    if(str == letter){letterCheck = true; return letterCheck;}
  })
  upper.forEach(function(letter){
    if(str == letter){letterCheck = true; return letterCheck;}
  })
  return letterCheck;
}
