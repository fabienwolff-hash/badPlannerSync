function loadLeagueCalendar() {
  const spreadsheet = SpreadsheetApp.openById(
    CONFIG.LIGUE_SPREADSHEET_ID
  );

  const sheet = spreadsheet.getSheetByName(
    CONFIG.LIGUE_SHEET_NAME
  );

  const range = sheet.getDataRange();

  return {
    values: range.getDisplayValues(),
    mergedRanges: range.getMergedRanges()
  };
}