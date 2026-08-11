function main() {
  generateLeagueSnapshot();
  generateCommittee35Snapshot();
}

function inspectCommitteeCalendar() {

  const committeeCalendar =
  loadCommittee35Calendar();

Logger.log(
  JSON.stringify(
    parseCommitteeTdjCompetitions(
      committeeCalendar
    )
  )
);
}