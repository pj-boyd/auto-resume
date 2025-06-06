const ss = SpreadsheetApp.getActiveSpreadsheet();
const resume = ss.getSheetByName('Auto-Resume');
const ranking = ss.getSheetByName('Ranking');

function unFormat() {
  const allData = resume.getRange('A1:F35');
  const source1 = resume.getRange('A1'); const source2 = resume.getRange('A1:A4'); const source3 = resume.getRange('A5'); const source4 = resume.getRange('B4:F4');
  const defaultStyle = SpreadsheetApp.newTextStyle().setBold(false).setItalic(false).setFontSize(11).setFontFamily('Default').build();
  const dest1 = resume.getRange('A1:A4'); const dest2 = resume.getRange('A1:F4'); const dest3 = resume.getRange('A5:A35'); const dest4 = resume.getRange('B4:F35');
  resume.setHiddenGridlines(false);
  allData.breakApart();
  allData.setWrap(false);
  allData.setTextStyle(defaultStyle);
  allData.setHorizontalAlignment('left');
  source1.setFormula('=Filter!A1');
  source1.autoFill(dest1,SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);
  source2.autoFill(dest2,SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);
  source3.setFormula('=IF(Filter!G5="",Filter!A5,Filter!G5)');
  source3.autoFill(dest3,SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);
  source4.autoFill(dest4,SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);
  allData.setFontColor('black');
  resume.setRowHeights(1,35,21);
  resume.setColumnWidths(1,6,100);
}

function fullReset(){
  unFormat();
  clearChecks();
  resetLines();
}

function clearChecks(){
  const allChecks = resume.getRange('H2:X4');
  allChecks.uncheck();
}

function resetLines(){
  const eduLines = ranking.getRange('I7');
  const expLines = ranking.getRange('I30');
  const skillLines = ranking.getRange('I48');

  eduLines.setValue(10);
  expLines.setValue(18);
  skillLines.setValue(3);
}
