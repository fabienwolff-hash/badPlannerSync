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
    scope: SCOPES.NATIONALE,
    label: "Championnat France - Qualification",
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
    scope: SCOPES.NATIONALE,
    label: "Championnat France - Phase finale",
    startDate,
    endDate,
    city: locationInfo?.city,
    department: locationInfo?.department,
    rawData: cell
  });
}