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

  Logger.log(
    JSON.stringify(
      competitions,
      null,
      2
    )
  );
}