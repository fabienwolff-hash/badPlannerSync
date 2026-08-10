function createCompetition(data) {

  const competition = {
    source: data.source,
    type: data.type,
    scope: data.scope || TYPE_SCOPE_MAPPING[data.type],
    label: data.label,
    startDate: data.startDate,
    endDate: data.endDate,
    rawData: data.rawData,

    ...(data.location && {
      location: data.location
    }),

    ...(data.city && {
      city: data.city
    }),

    ...(data.categories && {
      categories: data.categories
    })
  };

  competition.tournamentId =
    buildTournamentId(competition);

  return competition;
}