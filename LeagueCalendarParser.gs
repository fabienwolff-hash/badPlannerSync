function buildMergedRangesIndex(mergedRanges) {
  const index = {};

  mergedRanges.forEach(range => {
    const key = `${range.getRow()}-${range.getColumn()}`;

    index[key] = {
      row: range.getRow(),
      column: range.getColumn(),
      numRows: range.getNumRows(),
      numColumns: range.getNumColumns()
    };
  });

  return index;
}

function parseNationalCompetitions(calendar) {

  const competitions = [];

  const data = calendar.values;

  const mergedIndex = buildMergedRangesIndex(
    calendar.mergedRanges
  );

  let currentMonth = null;

  data.forEach((row, index) => {

    const sheetRow = index + 1;

    if (row[LIGUE_CALENDAR_COLUMNS.MONTH]) {
      currentMonth =
        row[LIGUE_CALENDAR_COLUMNS.MONTH];
    }

    const cell =
      row[LIGUE_CALENDAR_COLUMNS.NATIONAL];

    if (!cell) {
      return;
    }
	
    const firstLine =
      cell.split('\n')[0].trim();

    const competitionType =
      getCompetitionType(firstLine);

    if (!competitionType) {
      return;
    }

    const mergedInfo =
      getMergedInfo(
        mergedIndex,
        sheetRow,
        LIGUE_CALENDAR_COLUMNS.NATIONAL +
          SHEET_INDEX_OFFSET
      );

   switch (competitionType) {

	  case COMPETITION_TYPES.BAC:

		competitions.push(
		  parseBAC(
			cell,
			row,
			data,
			sheetRow,
			currentMonth,
			mergedInfo
		  )
		);

		break;

	  case COMPETITION_TYPES.BNP:

		competitions.push(
		  parseBNP(
			cell,
			row,
			data,
			sheetRow,
			currentMonth,
			mergedInfo
		  )
		);

		break;
		
	  case COMPETITION_TYPES.CEJ:

		  competitions.push(
			parseCEJ(
			  cell,
			  row,
			  data,
			  sheetRow,
			  currentMonth,
			  mergedInfo
			)
		  );

		  break;
	}

  });

  return competitions;
}

function parseRegionalCompetitions(calendar) {

  const competitions = [];

  const data = calendar.values;
  
  const mergedIndex = buildMergedRangesIndex(
    calendar.mergedRanges
  );

  let currentMonth = null;

  data.forEach((row, index) => {

    const sheetRow = index + 1;

    if (row[LIGUE_CALENDAR_COLUMNS.MONTH]) {
      currentMonth =
        row[LIGUE_CALENDAR_COLUMNS.MONTH];
    }

    const cell =
      row[LIGUE_CALENDAR_COLUMNS.REGIONAL];

    if (!cell) {
      return;
    }

    const firstLine =
      cell.split('\n')[0].trim();

    const competitionType =
      getCompetitionType(firstLine);

	if (!competitionType) {
	  return;
	}
	
	const mergedInfo =
		getMergedInfo(
		mergedIndex,
		sheetRow,
		LIGUE_CALENDAR_COLUMNS.REGIONAL +
		SHEET_INDEX_OFFSET
		);

	switch (competitionType) {

	  case COMPETITION_TYPES.TRJ:

		competitions.push(
		  ...parseTRJ(
			cell,
			row,
			data,
			sheetRow,
			currentMonth,
			mergedInfo
		  )
		);

		break;

	  case COMPETITION_TYPES.TIJ:

		competitions.push(
		  ...parseTIJ(
			cell,
			row,
			data,
			sheetRow,
			currentMonth,
			mergedInfo
		  )
		);

		break;
	}

  });

  return competitions;
}

function extractLocation(lines) {
  return lines[1]
    .replace('(', '')
    .replace(')', '')
    .trim();
}

function getMergedInfo(
  mergedIndex,
  row,
  column
) {
  return mergedIndex[
    `${row}-${column}`
  ] || null;
}

function getCompetitionType(label) {

  if (!label) {
    return null;
  }

  if (
    label.startsWith(
      CALENDAR_LABELS.BAC
    )
  ) {
    return COMPETITION_TYPES.BAC;
  }

  if (
    label.startsWith(
      CALENDAR_LABELS.CEJ
    )
  ) {
    return COMPETITION_TYPES.CEJ;
  }

  if (
    label.startsWith(
      CALENDAR_LABELS.TIJ
    )
  ) {
    return COMPETITION_TYPES.TIJ;
  }

  if (
    label.startsWith(
      CALENDAR_LABELS.TRJ
    )
  ) {
    return COMPETITION_TYPES.TRJ;
  }

  if (
    label.startsWith(
      CALENDAR_LABELS.BRASSAGE_NATIONAL
    )
  ) {
    return COMPETITION_TYPES.BNP;
  }

  return null;
}