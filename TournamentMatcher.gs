function readSnapshotCompetitions() {

  const competitions = [];

  competitions.push(
    ...readSheetCompetitions(
      SHEETS.SNAPSHOT_LIGUE
    )
  );

  competitions.push(
    ...readSheetCompetitions(
      SHEETS.SNAPSHOT_COMITE_35
    )
  );

  return competitions;

}

function readSheetCompetitions(
  sheetName
) {

  const sheet =
    SpreadsheetApp.getActive()
      .getSheetByName(
        sheetName
      );

  const values =
    sheet.getDataRange()
      .getValues();

  if (values.length <= 1) {
    return [];
  }

  return values
    .slice(1)
    .map(row => ({

      tournamentId: row[0],
      source: row[1],
      type: row[2],
      scope: row[3],
      label: row[4],
      startDate: row[5],
      endDate: row[6],
      region: row[7],
      department: row[8],
      city: row[9],

		categories:
		  typeof row[10] === 'string'
			? row[10]
				.split(';')
				.map(c => c.trim())
				.filter(Boolean)
			: [],

      rawData: row[11]

    }));

}

function groupCompetitionsByTournamentId(
  competitions
) {

  const groups = {};

  competitions.forEach(
    competition => {

      const key =
        competition.tournamentId;

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(
        competition
      );

    }
  );

  return groups;
}

function inspectMatches() {

  const competitions =
    readSnapshotCompetitions();

  const groups =
    groupCompetitionsByTournamentId(
      competitions
    );

  Object.entries(groups)
    .forEach(([key, values]) => {

      Logger.log(
        '================================'
      );

      Logger.log(key);

      values.forEach(
        competition => {

          Logger.log(
            JSON.stringify(
              competition
            )
          );

        }
      );

    });

}

function buildTournamentMatches(
  competitions
) {

  const groups =
    groupCompetitionsByTournamentId(
      competitions
    );

  return Object.entries(groups)
    .map(([tournamentId, entries]) => {

      const ligue =
        entries.find(
          c =>
            c.source ===
            SOURCES.LIGUE_BRETAGNE
        ) || null;

      const comite =
        entries.find(
          c =>
            c.source ===
            SOURCES.COMITE_35
        ) || null;

      if (!ligue) {

        return {
          tournamentId,
          type: entries[0].type,
          status:
            MATCH_STATUS.COMITE_ONLY,
          ligue,
          comite
        };

      }

      if (!comite) {

        return {
          tournamentId,
          type: entries[0].type,
          status:
            MATCH_STATUS.LIGUE_ONLY,
          ligue,
          comite
        };

      }

      const comparison =
        compareCompetitions(
          ligue,
          comite
        );

      const status =
        comparison.differences.length === 0
          ? MATCH_STATUS.MATCH
          : MATCH_STATUS.MATCH_WITH_DIFFERENCES;

      return {
        tournamentId,
        type: entries[0].type,

        status,

        ligue,
        comite,

        ...comparison
      };

    });

}

function inspectTournamentMatches() {

  const competitions =
    readSnapshotCompetitions();

  const matches =
    buildTournamentMatches(
      competitions
    );

  Logger.log(
    JSON.stringify(
      matches,
      null,
      2
    )
  );

}

function writeTournamentMatches(
  matches
) {

  const sheet =
    SpreadsheetApp.getActive()
      .getSheetByName(
        SHEETS.TOURNAMENT_MATCHES
      );

  sheet.clearContents();

  const headers = [
    'TournamentId',
    'Type',
    'Status',

    'DateMatch',
    'CityMatch',
    'CategoriesMatch',

    'Differences',

    'LigueFound',
    'ComiteFound',

    'LigueLabel',
    'ComiteLabel',

    'LigueStartDate',
    'ComiteStartDate',

    'LigueCity',
    'ComiteCity'
  ];

  sheet
    .getRange(
      1,
      1,
      1,
      headers.length
    )
    .setValues([headers]);

  const rows = matches.map(
    match => [

      match.tournamentId,

      match.type,

      match.status,

      match.dateMatch ?? '',

      match.cityMatch ?? '',

      match.categoriesMatch ?? '',

      match.differences
        ? match.differences.join('; ')
        : '',

      !!match.ligue,

      !!match.comite,

      match.ligue?.label || '',

      match.comite?.label || '',

      match.ligue?.startDate || '',

      match.comite?.startDate || '',

      match.ligue?.city || '',

      match.comite?.city || ''

    ]
  );

  if (rows.length) {

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

function analyzeTournamentMatches() {

  const competitions =
    readSnapshotCompetitions();

  const matches =
    buildTournamentMatches(
      competitions
    );

  writeTournamentMatches(
    matches
  );

const potentialMatches =
  findPotentialMatches(
    matches
  );

Logger.log(
  JSON.stringify(
    potentialMatches,
    null,
    2
  )
);

}

function compareCompetitions(
  ligue,
  comite
) {

const dateMatch =
  normalizeDate(
    ligue.startDate
  ) ===
  normalizeDate(
    comite.startDate
  );

const cityMatch =
  !ligue.city ||
  !comite.city
    ? true
    : normalizeMatchValue(
        ligue.city
      ) === normalizeMatchValue(
        comite.city
      );

const categoriesMatch =
  ligue.categories.length === 0 ||
  comite.categories.length === 0
    ? true
    : JSON.stringify(
        ligue.categories
      ) === JSON.stringify(
        comite.categories
      );

  const differences = [];

  if (!dateMatch) {
    differences.push('Date');
  }

  if (!cityMatch) {
    differences.push('City');
  }

  if (!categoriesMatch) {
    differences.push('Categories');
  }

  return {
    dateMatch,
    cityMatch,
    categoriesMatch,
    differences
  };

}

function normalizeMatchValue(
  value
) {

  return String(value || '')
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .replace(
      /[^A-Z0-9]/gi,
      ''
    )
    .toUpperCase();

}


function normalizeDate(
  value
) {

  if (!value) {
    return '';
  }

  return Utilities.formatDate(
    new Date(value),
    Session.getScriptTimeZone(),
    'yyyy-MM-dd'
  );

}

function findPotentialMatches(
  matches
) {

  const ligueOnly =
    matches.filter(
      match =>
        match.status ===
        MATCH_STATUS.LIGUE_ONLY
    );

  const comiteOnly =
    matches.filter(
      match =>
        match.status ===
        MATCH_STATUS.COMITE_ONLY
    );

  const candidates = [];

  ligueOnly.forEach(
    ligueMatch => {

      comiteOnly.forEach(
        comiteMatch => {

          if (
            ligueMatch.type !==
            comiteMatch.type
          ) {
            return;
          }

          candidates.push(
            buildPotentialMatch(
              ligueMatch,
              comiteMatch
            )
          );

        }
      );

    }
  );

  return candidates.filter(
    candidate =>
      candidate.score >= 50
  );

}

function buildPotentialMatch(
  ligueMatch,
  comiteMatch
) {

  const score = calculateMatchScore(
    ligueMatch,
    comiteMatch
  );

  return {

    type:
      ligueMatch.type,

    score,

    ligueTournamentId:
      ligueMatch.tournamentId,

    comiteTournamentId:
      comiteMatch.tournamentId,

    ligueDate:
      ligueMatch.ligue.startDate,

    comiteDate:
      comiteMatch.comite.startDate,

    ligueCity:
      ligueMatch.ligue.city,

    comiteCity:
      comiteMatch.comite.city

  };

}

function calculateMatchScore(
  ligueMatch,
  comiteMatch
) {

  let score = 0;

  const ligue =
    ligueMatch.ligue;

  const comite =
    comiteMatch.comite;

  if (
    normalizeDate(
      ligue.startDate
    ) ===
    normalizeDate(
      comite.startDate
    )
  ) {
    score += 50;
  }

  if (
    normalizeMatchValue(
      ligue.city
    ).includes(
      normalizeMatchValue(
        comite.city
      )
    )
    ||
    normalizeMatchValue(
      comite.city
    ).includes(
      normalizeMatchValue(
        ligue.city
      )
    )
  ) {
    score += 40;
  }

  return score;

}