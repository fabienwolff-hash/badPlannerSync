function main() {

  rejectedCompetitions = {};

  rulesCache = null;

  syncTournamentMaster();

  generateLeagueSnapshot();

  generateCommittee35Snapshot();

  analyzeTournamentMatches();

const competitions =
  readSnapshotCompetitions();
  
  enrichCompetitions(competitions);

const masterCandidates =
  buildMasterCandidates(
    competitions
  );

const masterTournaments =
  readTournamentMaster();

analyzeMasterCandidates(
  masterCandidates,
  masterTournaments
);

writeMasterCandidates(
  masterCandidates
);

generateSummary();
}