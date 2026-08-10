function buildDate(
  seasonYear,
  monthName,
  day
) {


  const month = MONTHS[monthName];

  if (!month) {
    throw new Error(
      `Mois inconnu : ${monthName}`
    );
  }

  let year = seasonYear;

  if (month <= 8) {
    year += 1;
  }

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function addDays(dateString, days) {
  const date = new Date(dateString);

  date.setDate(date.getDate() + days);

  return Utilities.formatDate(
    date,
    Session.getScriptTimeZone(),
    "yyyy-MM-dd"
  );
}

function extractLines(cell) {
  return cell
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
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