function createCompetition(data) {

  const competition = {
    source: data.source,
    type: data.type,
    scope: data.scope || TYPE_SCOPE_MAPPING[data.type],
    label: data.label,
    startDate: data.startDate,
    endDate: data.endDate,
    rawData: data.rawData,

    ...(data.city && {
      city: data.city
    }),
	
	...(data.region && {
	  region: data.region
	}),

	...(data.department && {
	  department: data.department
	}),

    ...(data.categories && {
      categories: data.categories
    })
  };

  competition.tournamentId =
    buildTournamentId(competition);

  return competition;
}