function isYouthPromobad(tableau) {

  return PROMOBAD_AGE_MARKERS.some(
    marker => tableau.includes(marker)
  );
}

function extractLines(cell) {
  return cell
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
}

function buildNormalizedLabel(cell) {
  return extractLines(cell).join(' ');
}

function isIlleEtVilaineYouthCompetition(
  parsed
) {

  if (parsed.department) {
    return parsed.department === '35';
  }

  return true;
}

function isYouthPromobad(
  tableau
) {
  return PROMOBAD_AGE_MARKERS.some(
    marker => tableau.includes(marker)
  );
}


function extractCityAndDepartment(value) {

  const match =
    value.match(/^(.+?)\s*\((\d+)\)$/);

  if (!match) {
    return null;
  }

  return {
    city: match[1].trim(),
    department: match[2]
  };
}

function extractCity(lines) {
  return lines[1]
    .replace('(', '')
    .replace(')', '')
    .trim();
}

function extractDepartmentFromTRJLabel(label) {

  const match = label.match(/\((\d+)\)$/);

  if (!match) {
    return null;
  }

  return match[1];
}

function extractRegionFromTIJLabel(label) {

  const match =
    label.match(/^TIJ\s+\d+\s+(.+)$/i);

  if (!match) {
    return null;
  }

  return match[1].trim();
}



function extractCategoriesFromAgeRange(
  value
) {

if (value.includes('/')) {

  return value
    .split('/')
    .map(v => v.trim())
    .map(v => CATEGORY_LABEL_MAPPING[v])
    .filter(Boolean);

}	

  const match =
    value.match(
      /(MBad|Minibad|Pou|Poussin|Ben|Benjamin|Min|Minime|Cad|Cadet|Jun|Junior)\s+à\s+(MBad|Minibad|Pou|Poussin|Ben|Benjamin|Min|Minime|Cad|Cadet|Jun|Junior)/i
    );

  if (!match) {
    return [];
  }

  const start =
    CATEGORY_LABEL_MAPPING[
      match[1]
    ];

  const end =
    CATEGORY_LABEL_MAPPING[
      match[2]
    ];

  const startIndex =
    CATEGORY_ORDER.indexOf(start);

  const endIndex =
    CATEGORY_ORDER.indexOf(end);

  return CATEGORY_ORDER.slice(
    startIndex,
    endIndex + 1
  );
}

function extractCategoriesFromMergedColumns(
  startColumn,
  numColumns
) {

  const categories = [];

  const endColumn =
    startColumn + numColumns - 1;

  for (
    let column = startColumn;
    column <= endColumn;
    column++
  ) {

    const category =
      YOUTH_CATEGORIES_BY_COLUMN[column];

    if (category) {
      categories.push(category);
    }

  }

  return categories;
}

function getCompetitionType(label) {

  if (!label) {
    return null;
  }

  if (
	  label.startsWith(
		CALENDAR_LABELS.BAC
	  ) ||
	  label.startsWith(
		CALENDAR_LABELS.BRASSAGE_ACCESSION_CEJ
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
  
  if (
	  label.startsWith(CALENDAR_LABELS.QUALIFICATION_FRANCE)
	) {
	  return CALENDAR_COMPETITION_TYPES.QUALIFICATION_FRANCE_JEUNES;
	}

	if (
	  label.startsWith(CALENDAR_LABELS.CHAMPIONNATS_FRANCE)
	) {
	  return CALENDAR_COMPETITION_TYPES.CHAMPIONNATS_FRANCE_JEUNES;
	}
	
	if (
	  label.startsWith(CALENDAR_LABELS.CHAMPIONNAT_BRETAGNE)
	) {
	  return CALENDAR_COMPETITION_TYPES.CHAMPIONNAT_BRETAGNE_JEUNES;
	}
	
	if (
	  label.startsWith(CALENDAR_LABELS.CHAMPIONNATS_DEPARTEMENTAUX)
	) {
	  return CALENDAR_COMPETITION_TYPES.CHAMPIONNATS_DEPARTEMENTAUX_JEUNES;
	}
	
	if (
	  label.startsWith(CALENDAR_LABELS.FINALE_REGIONALE_INTERCLUBS)
	) {
	  return CALENDAR_COMPETITION_TYPES.INTERCLUB_REGIONAL;
	}

  if (label.startsWith('CDJ')) {
    return COMPETITION_TYPES.CDJ;
  }

  if (label.startsWith('TDJ')) {
    return COMPETITION_TYPES.TDJ;
  }

  return null;
}
