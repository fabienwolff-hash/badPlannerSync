function parseTRJ(
  cell,
  row,
  data,
  sheetRow,
  currentMonth,
  mergedInfo
) {

const lines = extractLines(cell);

if (lines.length === 1) {
  return parseMinimalTRJ(
    lines,
    row,
    data,
    sheetRow,
    currentMonth,
    mergedInfo
  );
}

return parseDetailedTRJ(
  lines,
  row,
  data,
  sheetRow,
  currentMonth,
  mergedInfo
);
}

function parseMinimalTRJ(
  lines,
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

return [
  createCompetition({
    source: SOURCES.LIGUE_BRETAGNE,
    type: COMPETITION_TYPES.TRJ,
    label: lines[0],
    startDate,
    endDate,
    rawData: lines[0]
  })
];
}

function parseDetailedTRJ(
  lines,
  row,
  data,
  sheetRow,
  currentMonth,
  mergedInfo
) {

  const competitions = [];

  const label = lines[0];
  
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

  for (let i = 1; i < lines.length; i++) {

    const siteLine = lines[i];

    const match =
      siteLine.match(
        /^(.+?)\s*\((.+)\)$/
      );

    if (!match) {
      continue;
    }

    const city =
      match[1].trim();

    const categories =
      match[2]
        .split('-')
        .map(cat => cat.trim());

    competitions.push(
      createCompetition({
        source:
          SOURCES.LIGUE_BRETAGNE,

        type:
          COMPETITION_TYPES.TRJ,

        label,

		startDate,

		endDate,

        city,

        categories,

        rawData: siteLine
      })
    );
  }

  return competitions;
}