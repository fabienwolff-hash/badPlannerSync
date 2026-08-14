function createCompetition(data) {

  const competition = {

    source: data.source,

    type: data.type,

    scope:
      data.scope ||
      TYPE_SCOPE_MAPPING[data.type],

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

  //
  // Région par défaut
  //
  if (!competition.region && competition.department) {

    switch (competition.scope) {

      case SCOPES.DEPARTEMENTALE:
      case SCOPES.REGIONALE:

        competition.region = 'Bretagne';
        break;

    }

  }

  competition.title =
    buildTitle(competition);

  if (
    !competition.categories ||
    !competition.categories.length
  ) {

    competition.categories =
      buildCategories(
        competition
      );

  }

  competition.disciplines =
    buildDisciplines(
      competition
    );

  competition.tournamentId =
    buildTournamentId(
      competition
    );

  return competition;

}