function parseLeagueCompetitions(
  calendar
) {

  return [
    ...parseNationalCompetitions(calendar),
    ...parseRegionalCompetitions(calendar),
    ...parsePromobadCompetitions(calendar),
    ...parseYouthCompetitions(calendar)
  ];
}

function parseNationalCompetitions(calendar) {

  const competitions = [];

  const data = calendar.values;

  const mergedIndex = buildMergedRangesIndex(
    calendar.mergedRanges
  );

  let currentMonth = null;

  data.forEach((row, index) => {

    const sheetRow = index + 1;

    if (row[LIGUE_CALENDAR_COLUMNS.MONTH]) {
      currentMonth =
        row[LIGUE_CALENDAR_COLUMNS.MONTH];
    }

    const cell =
      row[LIGUE_CALENDAR_COLUMNS.NATIONAL];

    if (!cell) {
      return;
    }
	
	const normalizedLabel = normalizeCompetitionLabel(cell);

	const competitionType =
	  getCompetitionType(normalizedLabel);
	
    if (!competitionType) {
      return;
    }

    const mergedInfo =
      getMergedInfo(
        mergedIndex,
        sheetRow,
        LIGUE_CALENDAR_COLUMNS.NATIONAL +
          SHEET_INDEX_OFFSET
      );

   switch (competitionType) {

	  case COMPETITION_TYPES.BAC:

		competitions.push(
		  parseBAC(
			cell,
			row,
			data,
			sheetRow,
			currentMonth,
			mergedInfo
		  )
		);

		break;

	  case COMPETITION_TYPES.BNP:

		competitions.push(
		  parseBNP(
			cell,
			row,
			data,
			sheetRow,
			currentMonth,
			mergedInfo
		  )
		);

		break;
		
	  case COMPETITION_TYPES.CEJ:

		  competitions.push(
			parseCEJ(
			  cell,
			  row,
			  data,
			  sheetRow,
			  currentMonth,
			  mergedInfo
			)
		  );

		  break;
		  
	case CALENDAR_COMPETITION_TYPES.QUALIFICATION_FRANCE_JEUNES:

		  competitions.push(
			parseQualificationFranceJeunes(
			  cell,
			  row,
			  data,
			  sheetRow,
			  currentMonth,
			  mergedInfo
			)
		  );

		  break;

	case CALENDAR_COMPETITION_TYPES.CHAMPIONNATS_FRANCE_JEUNES:

		  competitions.push(
			parseChampionnatsFranceJeunes(
			  cell,
			  row,
			  data,
			  sheetRow,
			  currentMonth,
			  mergedInfo
			)
		  );

		  break;	
	}

  });

  return competitions;
}

function parseRegionalCompetitions(calendar) {

  const competitions = [];

  const data = calendar.values;
  
  const mergedIndex = buildMergedRangesIndex(
    calendar.mergedRanges
  );

  let currentMonth = null;

  data.forEach((row, index) => {

    const sheetRow = index + 1;

    if (row[LIGUE_CALENDAR_COLUMNS.MONTH]) {
      currentMonth =
        row[LIGUE_CALENDAR_COLUMNS.MONTH];
    }

    const cell =
      row[LIGUE_CALENDAR_COLUMNS.REGIONAL];

    if (!cell) {
      return;
    }
 
	const normalizedLabel = normalizeCompetitionLabel(cell);
	
    const competitionType =
      getCompetitionType(normalizedLabel);

	if (!competitionType) {
	  return;
	}
	
	const mergedInfo =
		getMergedInfo(
		mergedIndex,
		sheetRow,
		LIGUE_CALENDAR_COLUMNS.REGIONAL +
		SHEET_INDEX_OFFSET
		);

	switch (competitionType) {

	  case COMPETITION_TYPES.TRJ:

		competitions.push(
		  ...parseTRJ(
			cell,
			row,
			data,
			sheetRow,
			currentMonth,
			mergedInfo
		  )
		);

		break;

	  case COMPETITION_TYPES.TIJ:

		competitions.push(
		  ...parseTIJ(
			SOURCES.LIGUE_BRETAGNE,
			cell,
			row,
			data,
			sheetRow,
			currentMonth,
			mergedInfo
		  )
		);

		break;
		
		case CALENDAR_COMPETITION_TYPES.CHAMPIONNAT_BRETAGNE_JEUNES:

		  competitions.push(
			parseChampionnatBretagneJeunes(
			  cell,
			  row,
			  data,
			  sheetRow,
			  currentMonth,
			  mergedInfo
			)
		  );

		  break;
		  
		case CALENDAR_COMPETITION_TYPES.CHAMPIONNATS_DEPARTEMENTAUX_JEUNES:

		  competitions.push(
			parseChampionnatsDepartementauxJeunes(
			  cell,
			  row,
			  data,
			  sheetRow,
			  currentMonth,
			  mergedInfo
			)
		  );

		  break;
		  
		case CALENDAR_COMPETITION_TYPES.INTERCLUB_REGIONAL:

		  competitions.push(
			parseFinaleRegionaleInterclubsJeunes(
			  cell,
			  row,
			  data,
			  sheetRow,
			  currentMonth,
			  mergedInfo
			)
		  );

		  break;
	}

  });

  return competitions;
}

function parsePromobadCompetitions(calendar) {

  const competitions = [];

  const data = calendar.values;

  let currentMonth = null;

  data.forEach((row) => {

    if (row[LIGUE_CALENDAR_COLUMNS.MONTH]) {
      currentMonth =
        row[LIGUE_CALENDAR_COLUMNS.MONTH];
    }

	const locationCell =
	  normalizeCompetitionLabel(
		row[LIGUE_CALENDAR_COLUMNS.PROMOBAD_LOCATION]
	  );

	const tableauCell =
	  normalizeCompetitionLabel(
		row[LIGUE_CALENDAR_COLUMNS.PROMOBAD_TABLEAU]
	  );

    if (!locationCell || !tableauCell) {
      return;
    }

    const locationInfo = extractCityAndDepartment(locationCell);

    if (!locationInfo) {
      return;
    }

    if (
      !isIlleEtVilaineYouthCompetition(
        locationInfo
      )
    ) {
      return;
    }

    if (
      !isYouthPromobad(tableauCell)
    ) {
      return;
    }

    const startDate = buildDate(
      SEASON_YEAR,
      currentMonth,
      Number(
        row[LIGUE_CALENDAR_COLUMNS.DATE]
      )
    );

    competitions.push(
      createCompetition({
        source: SOURCES.LIGUE_BRETAGNE,
        type: COMPETITION_TYPES.PROMOBAD,
        label: tableauCell,
        startDate,
        endDate: startDate,
        city: locationInfo.city,
		department: locationInfo.department,

        rawData:
          `${locationCell} | ${tableauCell}`
      })
    );

  });

  return competitions;
}

function parseYouthCompetitions(calendar) {

  const competitions = [];

  const data = calendar.values;

  const mergedIndex = buildMergedRangesIndex(
    calendar.mergedRanges
  );

  let currentMonth = null;

  data.forEach((row, index) => {

    const sheetRow = index + 1;

    if (row[LIGUE_CALENDAR_COLUMNS.MONTH]) {
      currentMonth =
        row[LIGUE_CALENDAR_COLUMNS.MONTH];
    }

    for (
      let column = LIGUE_CALENDAR_COLUMNS.MINIBAD;
      column <= LIGUE_CALENDAR_COLUMNS.JUNIOR;
      column++
    ) {
		
	  const cell = row[column];	
	  const normalizedLabel = normalizeCompetitionLabel(row[column]);

      if (!normalizedLabel) {
        continue;
      }

		const mergedInfo =
		  findYouthMergedInfo(
			mergedIndex,
			sheetRow
		  );

      const competitionType = getCompetitionType(normalizedLabel);

      if (!competitionType) {
        continue;
      }

      switch (competitionType) {

        case COMPETITION_TYPES.CDJ:

		const competitionCdj =
		  parseCDJ(
			normalizedLabel,
			row,
			currentMonth,
			mergedInfo
		  );

		if (!competitionCdj) {

		  Logger.log(
			`CDJ ignoré : ${normalizedLabel}`
		  );

		  break;
		}

		competitions.push(
		  competitionCdj
		);         

        break;

        case COMPETITION_TYPES.TDJ:


		const competitionTdj =
		  parseTDJ(
			normalizedLabel,
			row,
			currentMonth,
			mergedInfo
		  );

		if (!competitionTdj) {

		  Logger.log(
			`TDJ ignoré : ${normalizedLabel}`
		  );

		  break;
		}

		competitions.push(
		  competitionTdj
		);  

        break;
      }

    }

  });

  return competitions;
}