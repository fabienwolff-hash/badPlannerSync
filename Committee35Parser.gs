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

    const normalizedLabel =
      buildNormalizedLabel(cell);

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
              'Qualification France Jeunes',

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
              'Championnats de France Jeunes',

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

  return competitions;
}

function parseCommitteeDepartmentalCompetitions(
  calendar
) {

  const competitions = [];

  return competitions;
}

function parseCommitteePromobadCompetitions(
  calendar
) {

  const competitions = [];

  return competitions;
}

function parseCommitteeTdjCompetitions(
  calendar
) {

  const competitions = [];

  return competitions;
}
