function main() {

  const calendar =
    loadLeagueCalendar();

  const competitions = [

    ...parseNationalCompetitions(
      calendar
    ),

    ...parseRegionalCompetitions(
      calendar
    )

  ];

  writeSnapshot(
    competitions
  );
}