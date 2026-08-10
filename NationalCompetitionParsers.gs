function getCompetitionDates(
  row,
  data,
  sheetRow,
  mergedInfo
) {

  const startDay = Number(
    row[LIGUE_CALENDAR_COLUMNS.DATE]
  );

  let endDay = startDay;

  if (mergedInfo) {

    const endRow =
      sheetRow +
      mergedInfo.numRows -
      1;

    endDay = Number(
      data[endRow - 1][
        LIGUE_CALENDAR_COLUMNS.DATE
      ]
    );
  }

  return {
    startDay,
    endDay
  };
}

function parseBAC(
  cell,
  row,
  data,
  sheetRow,
  currentMonth,
  mergedInfo
) {

  const lines = cell
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const location = extractLocation(lines);

  const {
    startDay,
    endDay
  } = getCompetitionDates(
    row,
    data,
    sheetRow,
    mergedInfo
  );

return createCompetition({
  source: SOURCES.LIGUE_BRETAGNE,
  type: COMPETITION_TYPES.BAC,
  label: lines[0],
  month: currentMonth,
  startDay,
  endDay,
  location,
  rawData: cell
});
}


function parseBNP(
  cell,
  row,
  data,
  sheetRow,
  currentMonth,
  mergedInfo
) {

  const lines = cell
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const {
    startDay,
    endDay
  } = getCompetitionDates(
    row,
    data,
    sheetRow,
    mergedInfo
  );

return createCompetition({
  source: SOURCES.LIGUE_BRETAGNE,
  type: COMPETITION_TYPES.BNP,
  label: lines.join(' '),
  month: currentMonth,
  startDay,
  endDay,
  rawData: cell
});
}