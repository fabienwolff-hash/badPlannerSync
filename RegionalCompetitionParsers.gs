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

if (
  lines.length === 3 &&
  lines[1].startsWith('(') &&
  lines[1].endsWith(')')
) {

  const categories =
    lines[1]
      .replace(/[()]/g, '')
      .split('-')
      .map(cat => cat.trim());

  const city =
    lines[2].trim();

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

      rawData:
        lines.slice(1).join(' ')
    })
  );

  return competitions;
}


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
  source,
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
      source,
      type: COMPETITION_TYPES.TIJ,
      label: cell.trim(),
      startDate,
      endDate: startDate,
	  region,
      rawData: cell
    }),

    createCompetition({
      source,
      type: COMPETITION_TYPES.TIJ,
      label: cell.trim(),
      startDate: addDays(startDate, 1),
      endDate: addDays(startDate, 1),
	  region,
      rawData: cell
    })

  ];
}

function parseChampionnatBretagneJeunes(
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
    scope: SCOPES.REGIONALE,
    label: "Championnat Régional",

    startDate,
    endDate,

    rawData: cell
  });
}

function parseFinaleRegionaleInterclubsJeunes(
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
    type: COMPETITION_TYPES.INTERCLUB,
    scope: SCOPES.REGIONALE,
    label: 'Finale Régionale Interclubs Jeunes',

    startDate,
    endDate,

    rawData: cell
  });
}