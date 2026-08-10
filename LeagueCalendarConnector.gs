function loadLeagueCalendar() {
  const spreadsheet = SpreadsheetApp.openById(
    LIGUE_CALENDAR_CONFIG.LIGUE_SPREADSHEET_ID
  );

  const sheet = spreadsheet.getSheetByName(
    LIGUE_CALENDAR_CONFIG.LIGUE_SHEET_NAME
  );

  const range = sheet.getDataRange();

  return {
    values: range.getDisplayValues(),
    mergedRanges: range.getMergedRanges()
  };
}