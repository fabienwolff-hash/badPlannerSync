function writeSnapshot(competitions) {
  const sheet = SpreadsheetApp.getActive()
    .getSheetByName(
      SHEETS.SNAPSHOT_CURRENT
    );

  sheet.clearContents();

  const headers = [
	'TournamentId',
    'Source',
    'Type',
    'Scope',
    'Label',
    'StartDate',
    'EndDate',
	'Region',
    'Department',
    'City',
    'Categories',
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
      competition.label || '',
      competition.startDate || '',
      competition.endDate || '',
	  competition.region || '',
      competition.department || '',
      competition.city || '',
      competition.categories
        ? competition.categories.join(';')
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