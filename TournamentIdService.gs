function buildTournamentId(competition) {
  switch (competition.type) {

    case COMPETITION_TYPES.BAC:
      return buildBacTournamentId(competition);

    case COMPETITION_TYPES.BNP:
      return buildBnpTournamentId(competition);

    case COMPETITION_TYPES.CEJ:
      return buildCejTournamentId(competition);

    case COMPETITION_TYPES.TRJ:
      return buildTrjTournamentId(competition);

    case COMPETITION_TYPES.TIJ:
      return buildTijTournamentId(competition);

    default:
      return null;
  }
}

function getMonthFromDate(date) {
  return date.substring(5, 7);
}

function extractNumber(label) {
  const match = label.match(/(\d+)/);

  if (!match) {
    return "01";
  }

  return match[1].padStart(2, "0");
}

function buildBacTournamentId(competition) {
  const month = getMonthFromDate(
    competition.startDate
  );

  const number = extractNumber(
    competition.label
  );

  return `BAC-${month}-${number}`;
}

function buildBnpTournamentId(competition) {
  const month = getMonthFromDate(
    competition.startDate
  );

  const number = extractNumber(
    competition.label
  );

  return `BNP-${month}-${number}`;
}

function buildCejTournamentId(competition) {
  const month = getMonthFromDate(
    competition.startDate
  );

  const number = extractNumber(
    competition.label
  );

  return `CEJ-${month}-${number}`;
}

function buildTrjTournamentId(competition) {
  const month = getMonthFromDate(
    competition.startDate
  );

  const match =
    competition.label.match(
      /TRJ\s+([SD]\d+)/i
    );

  if (!match) {
    return null;
  }

  return `TRJ-${month}-${match[1].toUpperCase()}`;
}

function buildTijTournamentId(competition) {
  const month = getMonthFromDate(
    competition.startDate
  );

  const number = extractNumber(
    competition.label
  );

  return `TIJ-${month}-N${Number(number)}`;
}