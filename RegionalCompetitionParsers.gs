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

const department =
  extractDepartmentFromTRJLabel(
    lines[0]
  );

return [
  createCompetition({
    source: SOURCES.LIGUE_BRETAGNE,
    type: COMPETITION_TYPES.TRJ,
    label: lines[0],
    startDate,
    endDate,
	department,
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

function parseTIJ(
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
  
  const region =
  extractRegionFromTIJLabel(
    cell.trim()
  );

  return [

    createCompetition({
      source: SOURCES.LIGUE_BRETAGNE,
      type: COMPETITION_TYPES.TIJ,
      label: cell.trim(),
      startDate,
      endDate: startDate,
	  region,
      rawData: cell
    }),

    createCompetition({
      source: SOURCES.LIGUE_BRETAGNE,
      type: COMPETITION_TYPES.TIJ,
      label: cell.trim(),
      startDate: addDays(startDate, 1),
      endDate: addDays(startDate, 1),
	  region,
      rawData: cell
    })

  ];
}