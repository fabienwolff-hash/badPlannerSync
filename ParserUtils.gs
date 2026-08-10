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

function isIlleEtVilainePromobad(
  department
) {
  return department === '35';
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

  const match =
    value.match(
      /(MBad|Pou|Ben|Min|Cad|Jun)\s+à\s+(MBad|Pou|Ben|Min|Cad|Jun)/i
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