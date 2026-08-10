function parseTRJ(
  cell,
  row,
  data,
  sheetRow,
  currentMonth
) {

  const lines = cell
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  if (lines.length === 1) {
    return parseMinimalTRJ(
      lines,
      row,
      currentMonth
    );
  }

  return parseDetailedTRJ(
    lines,
    row,
    currentMonth
  );
}

function parseMinimalTRJ(
  lines,
  row,
  currentMonth
) {

  return [
    createCompetition({
      source: SOURCES.LIGUE_BRETAGNE,
      type: COMPETITION_TYPES.TRJ,
      label: lines[0],
      month: currentMonth,
      startDay: Number(
        row[LIGUE_CALENDAR_COLUMNS.DATE]
      ),
      endDay: Number(
        row[LIGUE_CALENDAR_COLUMNS.DATE]
      ),
      rawData: lines[0]
    })
  ];
}

function parseDetailedTRJ(
  lines,
  row,
  currentMonth
) {

  const competitions = [];

  const label = lines[0];

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

        month: currentMonth,

        startDay: Number(
          row[
            LIGUE_CALENDAR_COLUMNS.DATE
          ]
        ),

        endDay: Number(
          row[
            LIGUE_CALENDAR_COLUMNS.DATE
          ]
        ),

        city,

        categories,

        rawData: siteLine
      })
    );
  }

  return competitions;
}