function getCompetitionDates(
  row,
  data,
  sheetRow,
  mergedInfo,
  currentMonth
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
    startDate: buildDate(
      SEASON_YEAR,
      currentMonth,
      startDay
    ),

    endDate: buildDate(
      SEASON_YEAR,
      currentMonth,
      endDay
    )
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

 const lines = extractLines(cell);
  const location = extractLocation(lines);

const {
  startDate,
  endDate
} = getCompetitionDates(
  row,
  data,
  sheetRow,
  mergedInfo,
  currentMonth
);

return createCompetition({
  source: SOURCES.LIGUE_BRETAGNE,
  type: COMPETITION_TYPES.BAC,
  label: lines[0],
  startDate,
  endDate,
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

const lines = extractLines(cell);

const {
  startDate,
  endDate
} = getCompetitionDates(
  row,
  data,
  sheetRow,
  mergedInfo,
  currentMonth
);

return createCompetition({
  source: SOURCES.LIGUE_BRETAGNE,
  type: COMPETITION_TYPES.BNP,
  label: lines.join(' '),
  startDate,
  endDate,
  rawData: cell
});
}

function parseCEJ(
  cell,
  row,
  data,
  sheetRow,
  currentMonth,
  mergedInfo
) {
  const lines = extractLines(cell);

  const location = extractLocation(lines);

  const {
    startDate,
    endDate
  } = getCompetitionDates(
    row,
    data,
    sheetRow,
    mergedInfo,
    currentMonth
  );

  return createCompetition({
    source: SOURCES.LIGUE_BRETAGNE,
    type: COMPETITION_TYPES.CEJ,
    label: lines[0],
    startDate,
    endDate,
    location,
    rawData: cell
  });
}