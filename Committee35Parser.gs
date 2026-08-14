function parseCommittee35Competitions(
  calendar
) {

  return [

    ...parseCommitteeNationalCompetitions(
      calendar
    ),

    ...parseCommitteeRegionalCompetitions(
      calendar
    ),

    ...parseCommitteeDepartmentalCompetitions(
      calendar
    ),

    ...parseCommitteePromobadCompetitions(
      calendar
    ),

    ...parseCommitteeTdjCompetitions(
      calendar
    )

  ];
}

function parseCommitteeNationalCompetitions(
  calendar
) {

  const competitions = [];

  const data = calendar.values;

  const mergedIndex = buildMergedRangesIndex(
    calendar.mergedRanges
  );

  let currentMonth = null;

  data.forEach((row, index) => {

    const sheetRow = index + 1;

    if (
      row[
        COMMITTEE35_CALENDAR_COLUMNS.MONTH
      ]
    ) {
      currentMonth =
        row[
          COMMITTEE35_CALENDAR_COLUMNS.MONTH
        ];
    }

    const cell =
      row[
        COMMITTEE35_CALENDAR_COLUMNS.NATIONAL
      ];

    if (!cell) {
      return;
    }

    const normalizedLabel = normalizeCompetitionLabel(cell);

    const competitionType =
      getCompetitionType(
        normalizedLabel
      );

    if (!competitionType) {
      return;
    }

    const mergedInfo =
      getMergedInfo(
        mergedIndex,
        sheetRow,
        COMMITTEE35_CALENDAR_COLUMNS.NATIONAL +
          SHEET_INDEX_OFFSET
      );

    const {
      startDate,
      endDate
    } = getCompetitionDates(
      row,
      data,
      sheetRow,
      mergedInfo,
      currentMonth
    );

    switch (competitionType) {

      case COMPETITION_TYPES.CEJ:

        competitions.push(
          createCompetition({
            source: SOURCES.COMITE_35,
            type: COMPETITION_TYPES.CEJ,

            label: normalizedLabel,

            startDate,
            endDate,

            rawData: cell
          })
        );

        break;

      case COMPETITION_TYPES.BNP:

        competitions.push(
          createCompetition({
            source: SOURCES.COMITE_35,
            type: COMPETITION_TYPES.BNP,

            label: normalizedLabel,

            startDate,
            endDate,

            rawData: cell
          })
        );

        break;
		
	  case COMPETITION_TYPES.BAC:

		competitions.push(
			createCompetition({
			  source: SOURCES.COMITE_35,
			  type: COMPETITION_TYPES.BAC,

			  label: normalizedLabel,

			  startDate,
			  endDate,

			  rawData: cell
			})
		  );

		break;

      case CALENDAR_COMPETITION_TYPES.QUALIFICATION_FRANCE_JEUNES:

        competitions.push(
          createCompetition({
            source: SOURCES.COMITE_35,

            type: COMPETITION_TYPES.CHAMPIONNAT,

            scope: SCOPES.NATIONALE,

            label:
              'Championnat France - Qualification',

            startDate,
            endDate,

            rawData: cell
          })
        );

        break;

      case CALENDAR_COMPETITION_TYPES.CHAMPIONNATS_FRANCE_JEUNES:

        competitions.push(
          createCompetition({
            source: SOURCES.COMITE_35,

            type: COMPETITION_TYPES.CHAMPIONNAT,

            scope: SCOPES.NATIONALE,

            label:
              'Championnat France - Phase finale',

            startDate,
            endDate,

            rawData: cell
          })
        );

        break;
    }

  });

  return competitions;
}

function parseCommitteeRegionalCompetitions(
  calendar
) {

  const competitions = [];

  const data = calendar.values;

  const mergedIndex = buildMergedRangesIndex(
    calendar.mergedRanges
  );

  let currentMonth = null;

  data.forEach((row, index) => {

    const sheetRow = index + 1;

    if (
      row[
        COMMITTEE35_CALENDAR_COLUMNS.MONTH
      ]
    ) {
      currentMonth =
        row[
          COMMITTEE35_CALENDAR_COLUMNS.MONTH
        ];
    }

    const cell =
      row[
        COMMITTEE35_CALENDAR_COLUMNS.REGIONAL
      ];

    if (!cell) {
      return;
    }

	const normalizedLabel = normalizeCompetitionLabel(cell);

    const competitionType =
      getCompetitionType(
        normalizedLabel
      );

    if (!competitionType) {
      return;
    }

    const mergedInfo =
      getMergedInfo(
        mergedIndex,
        sheetRow,
        COMMITTEE35_CALENDAR_COLUMNS.REGIONAL +
          SHEET_INDEX_OFFSET
      );

    const {
      startDate,
      endDate
    } = getCompetitionDates(
      row,
      data,
      sheetRow,
      mergedInfo,
      currentMonth
    );

    switch (competitionType) {

      case COMPETITION_TYPES.TRJ:

        competitions.push(
          createCompetition({
            source: SOURCES.COMITE_35,

            type: COMPETITION_TYPES.TRJ,

            label: normalizedLabel,

            department:
              extractDepartmentFromTRJLabel(
                normalizedLabel
              ),

            startDate,
            endDate,

            rawData: cell
          })
        );

        break;

	case COMPETITION_TYPES.TIJ:

	  competitions.push(
		...parseTIJ(
		  SOURCES.COMITE_35,
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
          createCompetition({
            source: SOURCES.COMITE_35,

            type: COMPETITION_TYPES.CHAMPIONNAT,

            scope: SCOPES.DEPARTEMENTALE,

            label:
              'Championnat Départemental',

            startDate,
            endDate,

            rawData: cell
          })
        );

        break;

      case CALENDAR_COMPETITION_TYPES.CHAMPIONNAT_BRETAGNE_JEUNES:

        competitions.push(
          createCompetition({
            source: SOURCES.COMITE_35,

            type: COMPETITION_TYPES.CHAMPIONNAT,

            scope: SCOPES.REGIONALE,

            label:
              'Championnat Régional',

            startDate,
            endDate,

            rawData: cell
          })
        );

        break;

      case CALENDAR_COMPETITION_TYPES.INTERCLUB_REGIONAL:

        competitions.push(
          createCompetition({
            source: SOURCES.COMITE_35,

            type: COMPETITION_TYPES.INTERCLUB,

            scope: SCOPES.REGIONALE,

            label:
              'Finale Régionale Interclubs Jeunes',

            startDate,
            endDate,

            rawData: cell
          })
        );

        break;

    }

  });

  return competitions;
}

function parseCommitteeDepartmentalCompetitions(
  calendar
) {

  const competitions = [];

  const data = calendar.values;

  const mergedIndex = buildMergedRangesIndex(
    calendar.mergedRanges
  );

  let currentMonth = null;

  data.forEach((row, index) => {

    const sheetRow = index + 1;

    const monthValue =
      row[
        COMMITTEE35_CALENDAR_COLUMNS.MONTH
      ];

    if (MONTHS[monthValue]) {
      currentMonth = monthValue;
    }

    const cell =
      row[
        COMMITTEE35_CALENDAR_COLUMNS.DEPARTMENTAL
      ];

    if (!cell) {
      return;
    }

	const normalizedLabel = normalizeCommitteeCDJLabel(normalizeCompetitionLabel(cell));
	  
	const parsed = parseCommitteeCDJLabel(normalizedLabel);

	if (!parsed) {
	  return rejectCompetition(SOURCES.COMITE_35,cell);
	}

    //
    // On ignore tout ce qui n'est pas
    // CDJ / ICJ / Finale Promobad
    //
    if (
      !normalizedLabel.startsWith('CDJ') &&
      !normalizedLabel.startsWith('ICJ') &&
      !normalizedLabel.startsWith(
        'Finale Promobad'
      )
    ) {
      return;
    }

    const mergedInfo =
      getMergedInfo(
        mergedIndex,
        sheetRow,
        COMMITTEE35_CALENDAR_COLUMNS.DEPARTMENTAL +
          SHEET_INDEX_OFFSET
      );

    const {
      startDate,
      endDate
    } = getCompetitionDates(
      row,
      data,
      sheetRow,
      mergedInfo,
      currentMonth
    );

    //
    // CDJ
    //
    if (
      normalizedLabel.startsWith('CDJ')
    ) {

      competitions.push(
        createCompetition({
          source: SOURCES.COMITE_35,

          type: COMPETITION_TYPES.CDJ,

          department: '35',
		  city: parsed.location,

          label: normalizedLabel,

          startDate,
          endDate,

          rawData: cell
        })
      );

      return;
    }

    //
    // ICJ
    //
    if (
      normalizedLabel.startsWith('ICJ')
    ) {

      competitions.push(
        createCompetition({
          source: SOURCES.COMITE_35,

          type: COMPETITION_TYPES.INTERCLUB,

          scope: SCOPES.DEPARTEMENTALE,

          department: '35',

          label: normalizedLabel,

          startDate,
          endDate,

          rawData: cell
        })
      );

      return;
    }

    //
    // Finale Promobad
    //
    if (
      normalizedLabel.startsWith(
        'Finale Promobad'
      )
    ) {

      competitions.push(
        createCompetition({
          source: SOURCES.COMITE_35,

          type: COMPETITION_TYPES.PROMOBAD,

          department: '35',
		  city: parsed.location,

          label: normalizedLabel,

          startDate,
          endDate,

          rawData: cell
        })
      );
    }

  });

  return competitions;
}

function parseCommitteePromobadCompetitions(
  calendar
) {

  const competitions = [];

  const data = calendar.values;

  let currentMonth = null;

  data.forEach((row) => {

    const monthValue =
      row[
        COMMITTEE35_CALENDAR_COLUMNS.MONTH
      ];

    if (MONTHS[monthValue]) {
      currentMonth = monthValue;
    }

    const location =
      row[
        COMMITTEE35_CALENDAR_COLUMNS.PROMOBAD_LOCATION
      ];

    const discipline =
      row[
        COMMITTEE35_CALENDAR_COLUMNS.PROMOBAD_DISCIPLINE
      ];

    const categoriesLabel =
      row[
        COMMITTEE35_CALENDAR_COLUMNS.PROMOBAD_CATEGORIES
      ];

    if (
      !location ||
      !discipline ||
      !categoriesLabel
    ) {
      return;
    }
	
	if (
		location === 'Lieu' ||
		discipline === 'Discipline' ||
		categoriesLabel === 'Catégories'
		) {
		return;
		}

	if (!currentMonth) {
		return;
	}

    const startDate = buildDate(
      SEASON_YEAR,
      currentMonth,
      Number(
        row[
          COMMITTEE35_CALENDAR_COLUMNS.DATE
        ]
      )
    );

    competitions.push(
      createCompetition({
        source: SOURCES.COMITE_35,

        type: COMPETITION_TYPES.PROMOBAD,

        department: '35',

        city: extractCommitteeLocation(location),

        categories:
          extractCategoriesFromAgeRange(
            categoriesLabel
          ),

        label:
          `${location} - ${discipline}`,

        startDate,
        endDate: startDate,

        rawData:
          `${location} | ${discipline} | ${categoriesLabel}`
      })
    );

  });

  return competitions;
}

function parseCommitteeTdjCompetitions(
  calendar
) {

  const competitions = [];

  const data = calendar.values;

  let currentMonth = null;

  data.forEach((row) => {

    const monthValue =
      row[
        COMMITTEE35_CALENDAR_COLUMNS.MONTH
      ];

    if (MONTHS[monthValue]) {
      currentMonth = monthValue;
    }

    const city =
      row[
        COMMITTEE35_CALENDAR_COLUMNS.TDJ_LOCATION
      ];

    const discipline =
      row[
        COMMITTEE35_CALENDAR_COLUMNS.TDJ_DISCIPLINE
      ];

    const categoriesLabel =
      row[
        COMMITTEE35_CALENDAR_COLUMNS.TDJ_CATEGORIES
      ];

    if (
      !city ||
      !discipline ||
      !categoriesLabel ||
      !currentMonth
    ) {
      return;
    }

    const startDate = buildDate(
      SEASON_YEAR,
      currentMonth,
      Number(
        row[
          COMMITTEE35_CALENDAR_COLUMNS.DATE
        ]
      )
    );

    if (
      isMultiDisciplineTdj(
        discipline,
        categoriesLabel
      )
    ) {

      const parsedDisciplines =
        parseMultiDisciplineTdj(
          categoriesLabel
        );

      parsedDisciplines.forEach(
        parsed => {

          competitions.push(
            createCompetition({
              source: SOURCES.COMITE_35,

              type: COMPETITION_TYPES.TDJ,

              department: '35',

              city: city.trim(),

              categories:
                parsed.categories,

              label:
                `${city} - ${parsed.discipline}`,

              startDate,
              endDate: startDate,

              rawData:
                `${city} | ${discipline} | ${categoriesLabel}`
            })
          );

        }
      );

      return;
    }

    competitions.push(
      createCompetition({
        source: SOURCES.COMITE_35,

        type: COMPETITION_TYPES.TDJ,

        department: '35',

        city: city.trim(),

        categories:
          extractCategoriesFromAgeRange(
            categoriesLabel
          ),

        label:
          `${city} - ${discipline}`,

        startDate,
        endDate: startDate,

        rawData:
          `${city} | ${discipline} | ${categoriesLabel}`
      })
    );

  });

  return competitions;
}


function normalizeCommitteeCDJLabel(
  label
) {

  const closingParenthesisIndex =
    label.indexOf(')');

  if (
    closingParenthesisIndex === -1
  ) {
    return label;
  }

  return label.substring(
    0,
    closingParenthesisIndex + 1
  );
}