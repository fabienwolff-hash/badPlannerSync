function main() {

  rejectedCompetitions = {};

  normalizationRulesCache = null;

  syncTournamentMaster();

  generateLeagueSnapshot();

  //generateCommittee35Snapshot();

  analyzeTournamentMatches();

  writeRejectedCompetitions();

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
}