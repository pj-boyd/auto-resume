var maxIncl = 0;
var total = 0;
function addALine() {
  unFormat();
  const rank = SpreadsheetApp.getActive().getSheetByName('Ranking');
  var inclRank = new Int8Array(rank.getRange('H4:H84').getValues());
  var rawLines = SpreadsheetApp.getActive().getSheetByName('Background').getRange('A4:O84').getValues();
  //Counts the number of lines currently included
  inclRank.forEach(function(rk){
    if(rk>0){total++;}
    if(rk>maxIncl){maxIncl = rk}});

  //Determines the lowest missing rank, if the maximum included rank is greater than the total lines included
  var target = targetFinder(inclRank,0);
  var k = nextToAdd(rawLines,target);
  if(k<0){console.error("No additional lines to add"); return;}

  var type = rawLines[k][13];

  var section = rawLines[k][14];

  var lines = linesToAdd(rawLines,k);
  var oldTarget = target;
  //If the target would not actually add a line, chooses a new target until at least one line is added
  while(lines == 0){
    Logger.log("Previous target was a skill that should already be included. Choosing new Target.");
    target = targetFinder(inclRank,oldTarget);
    k = nextToAdd(rawLines,target);
    lines = linesToAdd(rawLines,k);
  }
  var current = 0;
  const eduLines = rank.getRange('I7');
  const expLines = rank.getRange('I30');
  const skillLines = rank.getRange('I48');
  switch(section){
    case "Edu":
    current = eduLines.getValue();
    eduLines.setValue(current+lines);
    break;

    case "Exp":
    current = expLines.getValue();
    expLines.setValue(current+lines);
    break;

    case "Skills":
    current = skillLines.getValue();
    skillLines.setValue(current+lines);
  }
  autoFormat2();
}

function targetFinder(arr,target){
  var included = true;
  //If a non-zero target has already been selected, iterates the target by 1 and skips the loop.
  if(target>0){target++;included=false;}
  //Iterates target up until a target rank is found that isn't already included
  while(included){
    included = false;
    arr.forEach(function(jeff){
      if(jeff==target){included=true;target++;}
    })
  }
  Logger.log("Current target rank: "+target);
  //Returns the lowest target rank that isn't already included
  return target;
}

function nextToAdd(arr,target){
  Logger.log("Entered nextToAdd. Target: "+target);
  var k = 0;
  var found = false;
  var loopBool = true;
  var limits = true;
  var rawRank = [];
  var len = arr.length;
  //Builds an one-dimensional array of just the rankings
  for(let i = 0; i<len;i++){
    rawRank.push(arr[i][9]);
  }
  //Iterates the target up one until a matching rank is found
  Logger.log(target);
  while(loopBool&limits){
    found = contains(rawRank,target);
    Logger.log("Target: "+target+"nextToAdd found target? "+found);
    if(found == false){target++;}else{k=rawRank.indexOf(target);loopBool = false;}
    if(target>len){limits = false;k = -1;}
  }

  Logger.log("Exit nextToAdd. Found? "+found+" Adding row: "+(k+4));
  //Returns the index of the rank closest to the target
  return k;
}

function linesToAdd(arr,k){
  var x;
  //Confirms that the target is not already included. If it is, selects a new target until the new target isn't already included
  var included = arr[k][7];
  while (included){
    k = nextToAdd(arr,targetFinder(arr,k));
    included = checkIncluded(arr,k);
  }
  var type = arr[k][13];
  var section = arr[k][14];
  var titleCheck = false;
  var headerCheck = false;
  var upIndex = 0;
  var solo = new Boolean;
  Logger.log("Entered linesToAdd. Section: "+section+" Type: "+type);

  switch(type){
    case "Header":
    //If the Experience header was missing, adds 5 lines. Otherwise, adds 3 lines.
    if(section == "Exp"){x=7;}else{x=3;}
    break;

    case "Title":
    //Checks if the header for the title is included
    [headerCheck,upIndex] = checkHeader(arr,k);
    Logger.log("Header check complete: "+headerCheck);
    solo = soloHeader(arr,upIndex);
    Logger.log("Solo check complete: "+solo);
    //If the header for the target line is present, and it's a solo header:
    if(headerCheck&solo){
      //If it's a solo header in the Experience section, adds 6 lines, otherwise adds 2
      if(section == "Exp"){x=6;}else{x=2;}
    //If the header is not a solo header, adds
    } else{
      if(section == "Exp"){x=3;}else{x=1;}
    }
    break;

    case "Bullet":
    [titleCheck,upIndex] = checkTitle(arr,k);
    if(arr[upIndex][14]=="Header"){solo = soloHeader(arr,upIndex);}else{solo = soloHeader(arr,upIndex);}
    switch(section){
      case "Edu":
      x=2;
      break;

      case "Exp":
      if(solo){x=2;}else{x=1;}
      break;

      case "Skills":
      if(ranking.getRange('I48').getValue()<4){x=1;}
      else{x=0;}
      Logger.log("Add "+x+" lines");
      break;

      default:
      x=1;
      break;
    }
    break;

    default:
    x = 1;
    break;
  }
  Logger.log("Exit linesToAdd. Adding "+x+" lines");
  return x;
}

function checkIncluded(arr,k){
  var included = included = arr[k][7];
  return included;
}
function soloHeader(arr,k){
  Logger.log("Entered soloHeader");
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
    else if (type == ""){next=false;}
    if(k>len){next=false;}
  }
  Logger.log("Exit soloHeader");
  //If there are at least 2 titles between headers, returns false
  if(count<2){solo=true;}else{solo=false;}
  return solo;
}

function soloTitle(arr,k){
  Logger.log("Entered soloTitle");
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
    Logger.log(type);
    if(type=="Bullet"){count++;}
    else if (type == "Header"){next=false;}
    else if (type == ""){next=false;}
    else if (type == "Title"){next=false;}
    if(k>len){next=false;}
  }
  //If there are at least 2 bullets between titles, returns false
  if(count<2){solo=true;}else{solo=false;}
  Logger.log("Exit soloTitle");
  return solo;
}


function checkHeader(arr,k){
  Logger.log("Entered checkHeader");
  var limit = true;
  var loopBool = true;
  var testType = "Header";
  var included = false;
  var test;

  while(limit&loopBool){
    test = arr[k][13];
    if(test==testType){loopBool=false;}else{k--;}
    if(k<0){limit=false;}
    Logger.log("k");
  }
  if(limit){
    included = arr[k][7];
  }else{included = false;}
  Logger.log("Exit checkHeader");
  var results = [included,k];
  return results;
}

function checkTitle(arr,k){
  var limit = true;
  var loopBool = true;
  var testType = "Title";
  var included = false;
  var test;

  while(limit&loopBool){
    test = arr[k][13];
    if(test==testType){loopBool=false;}else{k--;}
    if(k<0){limit=false;}
  }
  if(limit){
    included = arr[k][7];
  }

  var results = [included,k]
  return results;
}

function contains(arr = Int8Array, num1){
  var match = false;
  var len = arr.length;
  var num;
  for(let i = 0; i<len; i++){
  num = arr[i];
  if(num == num1){match = true;}
  //if(match == true){Logger.log("Found match: "+num+"="+num1);}
  }
  return match;
}
