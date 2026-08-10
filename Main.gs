function main() {

  const calendar =
    loadLeagueCalendar();

  const competitions = [

    ...parseNationalCompetitions(
      calendar
    ),

    ...parseRegionalCompetitions(
      calendar
    ),
	
	...parsePromobadCompetitions(
	  calendar
	),

	...parseYouthCompetitions(
	  calendar
	)

  ];

  writeSnapshot(
    competitions
  );
}