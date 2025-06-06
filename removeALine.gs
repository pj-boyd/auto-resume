function removeALine() {
  const rank = SpreadsheetApp.getActive().getSheetByName('Ranking');
  var inclRank = new Int8Array(rank.getRange('H4:H84').getValues());
  var rawLines = SpreadsheetApp.getActive().getSheetByName('Background').getRange('A4:O84').getValues();
  var max = findMax(inclRank);
  var section = rawLines[max][14];
  const eduLines = rank.getRange('I7');
  const expLines = rank.getRange('I30');
  const skillLines = rank.getRange('I48');
  var current = 0;
  switch(section){
    case "Edu":
    current = eduLines.getValue();
    eduLines.setValue(current-1);
    break;

    case "Exp":
    current = expLines.getValue();
    expLines.setValue(current-1);
    break;

    case "Skills":
    current = skillLines.getValue();
    skillLines.setValue(current-1);
    break;

    default:
    break;
  }

  autoFormat2();
}

function findMax(arr){
  var max = 0;
  arr.forEach(function(jeff){
    if(jeff>max){max = jeff;}
  })

  return max;
}

function soloHeader(arr,k,j){
  var solo = false;
  var len = arr.length;
  var next = true;
  var count = 0;
  var type = arr[k][13];
  var header = new Boolean;
  //Checks if the target line is a header. Iterates to the next line if it is, skips the next loop if not
  if(type=="Header"){header=true; k++;}else{next=false; header=false;}
  //Iterates through lines until the next header or the end of the array is encountered. Counts titles.
  while(next&header){
    type = arr[k][13];
    if(type=="Title"){count++;}
    else if (type == "Header"){next=false;}
    if(k>len){next=false;}
  }
  //If there are at least 2 titles between headers, returns false
  if(count<j){solo=true;}else{solo=false;}
  return solo;
}

function soloTitle(arr,k,j){
  var solo = false;
  var len = arr.length;
  var next = true;
  var count = 0;
  var type = arr[k][13];
  var title = new Boolean;
  //Checks if the target line is a title. Iterates to the next line if it is, skips the next loop if not
  if(type=="Title"){title=true; k++;}else{next=false; title=false;}
  //Iterates through lines until the next title, header, or the end of the array is encountered. Counts titles.
  while(next&title){
    type = arr[k][13];
    if(type=="Bullet"){count++;}
    else if (type == "Header"){next=false;}
    else if (type == "Title"){next=false;}
    if(k>len){next=false;}
  }
  //If there are at least 2 bullets between titles, returns false
  if(count<j){solo=true;}else{solo=false;}
  return solo;
}
