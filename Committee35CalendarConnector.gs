function loadCommittee35Calendar() {

  const spreadsheet = SpreadsheetApp.openById(
    COMMITTEE35_CALENDAR_CONFIG.SPREADSHEET_ID
  );

  const sheet = spreadsheet.getSheetByName(
    COMMITTEE35_CALENDAR_CONFIG.SHEET_NAME
  );

  const range = sheet.getDataRange();

  return {
    values: range.getDisplayValues(),
    mergedRanges: range.getMergedRanges()
  };
}