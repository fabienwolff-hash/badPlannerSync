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
  const city = extractCity(lines);

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
  city,
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

  const city = extractCity(lines);

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
    city,
    rawData: cell
  });
}

function parseQualificationFranceJeunes(
  cell,
  row,
  data,
  sheetRow,
  currentMonth,
  mergedInfo
) {

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
    type: COMPETITION_TYPES.CHAMPIONNAT,
    scope: "Nationale",
    label: "Qualification France Jeunes",
    startDate,
    endDate,
    rawData: cell
  });
}

function parseChampionnatsFranceJeunes(
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

  const locationInfo =
    extractCityAndDepartment(
      lines[2]
    );

  return createCompetition({
    source: SOURCES.LIGUE_BRETAGNE,
    type: COMPETITION_TYPES.CHAMPIONNAT,
    scope: "Nationale",
    label: "Championnats de France Jeunes",
    startDate,
    endDate,
    city: locationInfo?.city,
    department: locationInfo?.department,
    rawData: cell
  });
}