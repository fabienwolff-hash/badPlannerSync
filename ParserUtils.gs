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

function extractLines(cell) {
  return cell
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
}