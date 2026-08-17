function buildTournamentId(competition) {
  switch (competition.type) {

    case COMPETITION_TYPES.BAC:
      return buildNumberedTournamentId('BAC',competition);

    case COMPETITION_TYPES.BNP:
      return buildNumberedTournamentId('BNP',competition);

    case COMPETITION_TYPES.CEJ:
      return buildNumberedTournamentId('CEJ',competition);

    case COMPETITION_TYPES.TRJ:
      return buildTrjTournamentId(competition);

    case COMPETITION_TYPES.TIJ:
      return buildTijTournamentId(competition);
	  
	case COMPETITION_TYPES.CHAMPIONNAT:
		return buildChampionnatTournamentId(competition);
		
	case COMPETITION_TYPES.INTERCLUB:
		return buildInterclubTournamentId(competition);
		
	case COMPETITION_TYPES.PROMOBAD:
	    return buildPromobadTournamentId(competition);
		
	case COMPETITION_TYPES.CDJ:
	    return buildCdjTournamentId(competition);

	case COMPETITION_TYPES.TDJ:
	    return buildTdjTournamentId(competition);
		
    default:
      return null;
  }
}

function extractTournamentNumber(label) {
  const match = label.match(/(\d+)/);

  if (!match) {
    return "01";
  }

  return match[1].padStart(2, "0");
}

function buildNumberedTournamentId(
  prefix,
  competition
) {

  const month = getMonthFromDate(competition.startDate);

  const number = extractTournamentNumber(competition.label);

  return `${prefix}-${month}-${number}`;
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

  const number = extractTournamentNumber(
    competition.label
  );

  return `TIJ-${month}-N${Number(number)}`;
}

function buildChampionnatTournamentId(
  competition
) {

  const month = getMonthFromDate(
    competition.startDate
  );

  switch (competition.label) {

    case "Championnat France - Qualification":
      return `CHP-${month}-FRANCE-QLF`;

    case "Championnat France - Phase finale":
      return `CHP-${month}-FRANCE`;
	  
	case "Championnat Régional":
	  return `CHP-${month}-REGIONAL`;
	  
	case "Championnat Départemental":
	  return `CHP-${month}-DEPARTEMENTAL`;

    default:
      return `CHP-${month}`;
  }
}

function buildInterclubTournamentId(
  competition
) {
  const month = getMonthFromDate(
    competition.startDate
  );

  return `IC-${month}-REGIONAL`;
}

function buildPromobadTournamentId(
  competition
) {
  return buildCityBasedTournamentId(
    'PRO',
    competition
  );
}

function buildCityBasedTournamentId(
  prefix,
  competition
) {
  const month = getMonthFromDate(
    competition.startDate
  );

  const city = competition.city
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]/g, '-');

  return `${prefix}-${month}-${city}`;
}

function buildCdjTournamentId(
  competition
) {
  return buildCityBasedTournamentId(
    'CDJ',
    competition
  );
}

function buildTdjTournamentId(
  competition
) {
  return buildCityBasedTournamentId(
    'TDJ',
    competition
  );
}