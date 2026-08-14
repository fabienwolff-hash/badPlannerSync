function generateCommittee35Snapshot() {

  const calendar = loadCommittee35Calendar();
  const competitions = parseCommittee35Competitions(calendar);

  writeSnapshot(SHEETS.SNAPSHOT_COMITE_35,competitions);
}

function generateLeagueSnapshot() {

  const calendar = loadLeagueCalendar();
  const competitions = parseLeagueCompetitions(calendar);

  writeSnapshot(SHEETS.SNAPSHOT_LIGUE,competitions);
}

function writeSnapshot(
sheetName,
competitions
) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);

  sheet.clearContents();

  const headers = [
	'TournamentId',
    'Source',
    'Type',
    'Scope',
	'Title',
    'Label',
    'StartDate',
    'EndDate',
	'Region',
    'Department',
    'City',
    'Categories',
	'Disciplines',
    'RawData'
  ];

  sheet
    .getRange(1, 1, 1, headers.length)
    .setValues([headers]);
	
	const sortedCompetitions = [...competitions].sort(
	  (a, b) => {
		const dateComparison =
		  a.startDate.localeCompare(b.startDate);

		if (dateComparison !== 0) {
		  return dateComparison;
		}

		return a.tournamentId.localeCompare(
		  b.tournamentId
		);
	  }
	);

  const rows = sortedCompetitions.map(
    competition => [
	  competition.tournamentId || '',
      competition.source || '',
      competition.type || '',
      competition.scope || '',
      competition.title || '',
      competition.label || '',
      competition.startDate || '',
      competition.endDate || '',
	  competition.region || '',
      competition.department || '',
      competition.city || '',
      competition.categories
        ? competition.categories.join(';')
        : '',
	  competition.disciplines
        ? competition.disciplines.join(';')
        : '',
      competition.rawData || ''
    ]
  );

  if (rows.length > 0) {
    sheet
      .getRange(
        2,
        1,
        rows.length,
        headers.length
      )
      .setValues(rows);
  }
}