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
    label: "Championnat Départemental",

    startDate,
    endDate,

    rawData: cell
  });
}

function parseCDJLabel(label) {

  let match = label.match(
    /^CDJ\s+(\d+)\s*-\s*(.+?)\s*-\s*(.+?)\s*-\s*(.+)$/
  );

  if (match) {
    return {
      department: match[1],
      city: match[2].trim(),
      disciplines: match[3].trim(),
      rankingRange: match[4].trim()
    };
  }

  match = label.match(
    /^CDJ\s+(\d+)\s+(.+?)\s*-\s*(.+?)\s*-\s*(.+)$/
  );

  if (match) {
    return {
      department: match[1],
      city: match[2].trim(),
      disciplines: match[3].trim(),
      rankingRange: match[4].trim()
    };
  }

  return rejectCompetition(SOURCES.LIGUE_BRETAGNE,label);

}

function parseCommitteeCDJLabel(
  label
) {

  const match =
    label.match(
      /^CDJ\s+n°(\d+)\s+(.+?)\s+\((.+)\)$/i
    );

  if (!match) {
    return rejectCompetition(SOURCES.COMITE_35,label);
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

  let match;
  //
  // TDJ 35 - Etrelles - S - R4 à NC
  //
  match = normalized.match(
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
   
  //
  // TDJ 35 Etrelles - S - R4 à NC
  //
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

 
  //
  // TDJ 56 - Kervignac - MBad à Jun
  //
  match = normalized.match(
    /^TDJ\s+(\d+)\s*-\s*(.+?)\s*-\s*(.+)$/
  );

  if (match) {
    return {
      department: match[1],
      city: match[2].trim(),
      disciplines: null,
      categoryOrRanking: match[3].trim()
    };
  }

  //
  // TDJ Parthenay de Bretagne - S - R5 à NC
  // TDJ Vitré (35) - S - R4 à NC
  //
  match = normalized.match(
    /^TDJ\s+(.+?)\s*-\s*(.+?)\s*-\s*(.+)$/
  );

  if (match) {
    return {
      department: null,
      city: match[1].trim(),
      disciplines: match[2].trim(),
      categoryOrRanking: match[3].trim()
    };
  }

  Logger.log(
    `Format TDJ inconnu : ${label}`
  );

  return rejectCompetition(SOURCES.COMITE_35,label);

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

	  Logger.log(
		`CDJ non parsé : ${cell}`
	  );

	  return null;
	}
	
	if (
	  !isIlleEtVilaineYouthCompetition(
		parsed
	  )
	) {
	  Logger.log(
		`CDJ non 35 : ${cell}`
	  );

	  return rejectCompetition(SOURCES.LIGUE_BRETAGNE,cell);
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
	
	if (
	  !isIlleEtVilaineYouthCompetition(
		parsed
	  )
	) {
	  Logger.log(
		`TDJ non 35 : ${cell}`
	  );

	  return rejectCompetition(SOURCES.LIGUE_BRETAGNE,cell);
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

function normalizeCommitteeCDJLabel(
  label
) {

  const closingParenthesisIndex =
    label.indexOf(')');

  if (
    closingParenthesisIndex === -1
  ) {
    return label;
  }

  return label.substring(
    0,
    closingParenthesisIndex + 1
  );
}