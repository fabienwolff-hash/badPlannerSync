function parseYouthCompetitions(calendar) {

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

    for (
      let column = LIGUE_CALENDAR_COLUMNS.MINIBAD;
      column <= LIGUE_CALENDAR_COLUMNS.JUNIOR;
      column++
    ) {

      const cell = row[column];

      if (!cell) {
        continue;
      }

		const mergedInfo =
		  findYouthMergedInfo(
			mergedIndex,
			sheetRow
		  );

      const competitionType =
        getCompetitionType(cell);

      if (!competitionType) {
        continue;
      }

      switch (competitionType) {

        case COMPETITION_TYPES.CDJ:

          competitions.push(
            parseCDJ(
              cell,
              row,
              currentMonth,
              mergedInfo
            )
          );

          break;

        case COMPETITION_TYPES.TDJ:

          competitions.push(
            parseTDJ(
              cell,
              row,
              currentMonth,
              mergedInfo
            )
          );

          break;
      }

    }

  });

  return competitions;
}

function parseChampionnatsDepartementauxJeunes(
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
    scope: SCOPES.DEPARTEMENTALE,
    label: "Championnats Départementaux Jeunes",

    startDate,
    endDate,

    rawData: cell
  });
}

function parsePromobadCompetitions(calendar) {

  const competitions = [];

  const data = calendar.values;

  let currentMonth = null;

  data.forEach((row) => {

    if (row[LIGUE_CALENDAR_COLUMNS.MONTH]) {
      currentMonth =
        row[LIGUE_CALENDAR_COLUMNS.MONTH];
    }

    const locationCell =
      row[LIGUE_CALENDAR_COLUMNS.PROMOBAD_LOCATION];

    const tableauCell =
      row[LIGUE_CALENDAR_COLUMNS.PROMOBAD_TABLEAU];

    if (!locationCell || !tableauCell) {
      return;
    }

    const locationInfo = extractCityAndDepartment(locationCell);

    if (!locationInfo) {
      return;
    }

    if (
      !isIlleEtVilainePromobad(
        locationInfo.department
      )
    ) {
      return;
    }

    if (
      !isYouthPromobad(tableauCell)
    ) {
      return;
    }

    const startDate = buildDate(
      SEASON_YEAR,
      currentMonth,
      Number(
        row[LIGUE_CALENDAR_COLUMNS.DATE]
      )
    );

    competitions.push(
      createCompetition({
        source: SOURCES.LIGUE_BRETAGNE,
        type: COMPETITION_TYPES.PROMOBAD,
        label: tableauCell,
        startDate,
        endDate: startDate,
        city: locationInfo.city,
		department: locationInfo.department,

        rawData:
          `${locationCell} | ${tableauCell}`
      })
    );

  });

  return competitions;
}

function parseCDJLabel(label) {

  const match = label.match(
    /^CDJ\s+(\d+)\s*-\s*(.+?)\s*-\s*(.+?)\s*-\s*(.+)$/
  );

  if (!match) {
    return null;
  }

  return {
    department: match[1],
    city: match[2].trim(),
    disciplines: match[3].trim(),
    rankingRange: match[4].trim()
  };
}

function parseCommitteeCDJLabel(
  label
) {

  const match =
    label.match(
      /^CDJ\s+n°(\d+)\s+(.+?)\s+\((.+)\)$/i
    );

  if (!match) {
    return null;
  }

  return {
    number: Number(match[1]),
    discipline: match[2].trim(),
    location: match[3].trim()
  };
}

function parseTDJLabel(label) {

  const normalized = label
    .replace(/\s+/g, ' ')
    .trim();

  let match = normalized.match(
    /^TDJ\s+(\d+)\s*-\s*(.+?)\s*-\s*(.+?)\s*-\s*(.+)$/
  );

  if (match) {
    return {
      department: match[1],
      city: match[2].trim(),
      disciplines: match[3].trim(),
      categoryOrRanking: match[4].trim()
    };
  }

  match = normalized.match(
    /^TDJ\s+(\d+)\s+(.+?)\s*-\s*(.+?)\s*-\s*(.+)$/
  );

  if (match) {
    return {
      department: match[1],
      city: match[2].trim(),
      disciplines: match[3].trim(),
      categoryOrRanking: match[4].trim()
    };
  }

  return null;
}

function parseCDJ(
  cell,
  row,
  currentMonth,
  mergedInfo
) {

  const categories = resolveYouthCategories(cell,mergedInfo);
 
  const startDate = buildDate(
    SEASON_YEAR,
    currentMonth,
    Number(row[LIGUE_CALENDAR_COLUMNS.DATE])
  );
  
	  const parsed = parseCDJLabel(cell);

	if (!parsed) {
	  return null;
	}

  return createCompetition({
    source: SOURCES.LIGUE_BRETAGNE,
    type: COMPETITION_TYPES.CDJ,

    city: parsed.city,
    department: parsed.department,

    categories,

    label: cell,

    startDate,
    endDate: startDate,

    rawData: cell
  });
}

function parseTDJ(
  cell,
  row,
  currentMonth,
  mergedInfo
) {

  const startDate = buildDate(
    SEASON_YEAR,
    currentMonth,
    Number(row[LIGUE_CALENDAR_COLUMNS.DATE])
  );

	const categories = resolveYouthCategories(cell,mergedInfo);
	
	const parsed = parseTDJLabel(cell);

	if (!parsed) {
	  return null;
	}

  return createCompetition({
    source: SOURCES.LIGUE_BRETAGNE,
    type: COMPETITION_TYPES.TDJ,

    city: parsed.city,
    department: parsed.department,

    categories,

    label: cell,

    startDate,
    endDate: startDate,

    rawData: cell
  });
}

function resolveYouthCategories(
  cell,
  mergedInfo
) {

  if (mergedInfo) {
    return extractCategoriesFromMergedColumns(
      mergedInfo.column,
      mergedInfo.numColumns
    );
  }

  return extractCategoriesFromAgeRange(
    cell
  );
}

function extractCommitteeLocation(
  value
) {

  const match =
    value.match(
      /\(Lieu\s*:\s*([^)]+)\)/i
    );

  if (match) {
    return match[1].trim();
  }

  return value.trim();
}

function isMultiDisciplineTdj(
  discipline,
  categoriesLabel
) {

  return (
    discipline.includes('S D') &&
    categoriesLabel.includes(':')
  );

}

function parseMultiDisciplineTdj(
  categoriesLabel
) {

  return categoriesLabel
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {

      const [
        discipline,
        categoryRange
      ] = line.split(':');

      return {
        discipline: discipline.trim(),
        categories:
          extractCategoriesFromAgeRange(
            categoryRange.trim()
          )
      };

    });

}