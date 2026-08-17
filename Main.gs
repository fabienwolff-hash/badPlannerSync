function main() {

  rejectedCompetitions = {};

  rulesCache = null;

  syncTournamentMaster();

  generateLeagueSnapshot();

  //generateCommittee35Snapshot();

  analyzeTournamentMatches();

const competitions =
  readSnapshotCompetitions();
  
  enrichCompetitions(competitions);

const masterCandidates =
  competitions.map(
    buildMasterCandidate
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