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

    title: row[4],
    label: row[5],

    startDate: row[6],
    endDate: row[7],

    region: row[8],
	department: row[9] !== ''
		? String(parseInt(row[9], 10))
		: '',
	
    city: row[10],

    categories:
      typeof row[11] === 'string'
        ? row[11]
            .split(';')
            .map(c => c.trim())
            .filter(Boolean)
        : [],

    disciplines:
      typeof row[12] === 'string'
        ? row[12]
            .split(';')
            .map(d => d.trim())
            .filter(Boolean)
        : [],

    rawData: row[13]

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
	'SuggestedMatch',
	'Score',

    'Differences',

    'LigueFound',
    'ComiteFound',

    'LigueLabel',
    'ComiteLabel',

  'LigueStartDate',
  'LigueEndDate',

  'ComiteStartDate',
  'ComiteEndDate',

  'LigueCity',
  'ComiteCity',

  'LigueDepartment',
  'ComiteDepartment',

  'LigueRegion',
  'ComiteRegion',

  'LigueScope',
  'ComiteScope',

  'LigueCategories',
  'ComiteCategories'
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

		match.suggestedMatch || '',

		match.score || '',

      match.differences
        ? match.differences.join('; ')
        : '',

      !!match.ligue,

      !!match.comite,

      match.ligue?.label || '',

      match.comite?.label || '',

      match.ligue?.startDate || '',

      match.ligue?.endDate || '',

	  match.comite?.startDate || '',
	  
      match.comite?.endDate || '',

      match.ligue?.city || '',

      match.comite?.city || '',
	  
	  match.ligue?.department || '',

      match.comite?.department || '',
	  
	  match.ligue?.region || '',

      match.comite?.region || '',
	  
	  match.ligue?.scope || '',

      match.comite?.scope || '',
	  
	 (match.ligue?.categories || []).join(';'),

	 (match.comite?.categories || []).join(';')

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

  let matches =
    buildTournamentMatches(
      competitions
    );

  const overrides = loadMatchOverrides();

  matches =
    applyOverrides(
      matches,
      overrides
    );

  const potentialMatches =
    findPotentialMatches(
      matches
    );

  matches =
    enrichMatchesWithCandidates(
      matches,
      potentialMatches
    );

  writeTournamentMatches(
    matches
  );
}

function compareCompetitions(
  ligue,
  comite
) {

const dateMatch =
  formatDate(
    ligue.startDate
  ) ===
  formatDate(
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

  const candidates = {};

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

          const candidate =
            buildPotentialMatch(
              ligueMatch,
              comiteMatch
            );

          if (
            candidate.score >= 50
          ) {

            candidates[
              ligueMatch.tournamentId
            ] = candidate;

          }

        }
      );

    }
  );

  return candidates;

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
    formatDate(
      ligue.startDate
    ) ===
    formatDate(
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

function loadMatchOverrides() {

  return getRulesByType(
    RULE_TYPES.MATCH_OVERRIDE
  )
    .map(rule => ({

      ligueTournamentId:
        rule.key,

      comiteTournamentId:
        rule.value1

    }));

}

function findOverride(
  ligueTournamentId,
  comiteTournamentId,
  overrides
) {

  return overrides.find(
    override =>
      override.ligueTournamentId ===
        ligueTournamentId
      &&
      override.comiteTournamentId ===
        comiteTournamentId
  );

}

function applyOverrides(
  matches,
  overrides
) {

  const processedIds =
    new Set();

  const result = [];

  overrides.forEach(
    override => {

      const ligueMatch =
        matches.find(
          match =>
            match.tournamentId ===
            override.ligueTournamentId
        );

      const comiteMatch =
        matches.find(
          match =>
            match.tournamentId ===
            override.comiteTournamentId
        );

      if (
        !ligueMatch ||
        !comiteMatch
      ) {
        return;
      }

      result.push({

        tournamentId:
          ligueMatch.tournamentId,

        type:
          ligueMatch.type,

        status:
          MATCH_STATUS.MATCH_OVERRIDE,

        ligue:
          ligueMatch.ligue,

        comite:
          comiteMatch.comite,

        suggestedMatch:
          override.comiteTournamentId,

        score: 100

      });

      processedIds.add(
        override.ligueTournamentId
      );

      processedIds.add(
        override.comiteTournamentId
      );

    }
  );

  matches.forEach(
    match => {

      if (
        processedIds.has(
          match.tournamentId
        )
      ) {
        return;
      }

      result.push(match);

    }
  );

  return result;

}


function enrichMatchesWithCandidates(
  matches,
  potentialMatches
) {

  return matches.map(
    match => {

      const candidate =
        potentialMatches[
          match.tournamentId
        ];

      if (!candidate) {
        return match;
      }

      return {

        ...match,

        status:
          MATCH_STATUS.POTENTIAL_MATCH,

        suggestedMatch:
          candidate.comiteTournamentId,

        score:
          candidate.score

      };

    }
  );

}

function syncTournamentMaster() {

  const sourceSpreadsheet =
    SpreadsheetApp.openById(
    BADPLANNER_CONFIG.SPREADSHEET_ID
  );

  const sourceSheet = sourceSpreadsheet.getSheetByName(
    BADPLANNER_CONFIG.SHEET_NAME
  ); 
  
  const targetSheet = SpreadsheetApp.getActive().getSheetByName(SHEETS.TOURNAMENT_MASTER);
  
  const values =
    sourceSheet
      .getDataRange()
      .getValues();

  targetSheet.clearContents();

  if (values.length > 0) {

    targetSheet
      .getRange(
        1,
        1,
        values.length,
        values[0].length
      )
      .setValues(values);

  }

}

function writeMasterCandidates(
  candidates
) {

  const sheet =
    SpreadsheetApp.getActive()
      .getSheetByName(
        SHEETS.TOURNAMENT_MASTER_CANDIDATES
      );

  sheet.clearContents();

  sheet
    .getRange(
      1,
      1,
      1,
      MASTER_TOURNAMENT_HEADERS.length
    )
    .setValues([
      MASTER_TOURNAMENT_HEADERS
    ]);

  const rows =
    candidates.map(
      candidate => [

        candidate.tournamentId,
        candidate.type,
        candidate.scope,
        candidate.title,
        candidate.region,
        candidate.department,
        candidate.city,
        candidate.gymnasium,
        candidate.startDate,
        candidate.endDate,
        candidate.categories,
        candidate.disciplines,
        candidate.registrationOpenDate,
        candidate.registrationCloseDate,
        candidate.eventUrl,
		candidate.masterAction || '',
		candidate.masterReason || ''

      ]
    );

if (rows.length) {

  sheet
    .getRange(
      2,
      6,
      rows.length,
      1
    )
    .setNumberFormat('@');

  sheet
    .getRange(
      2,
      1,
      rows.length,
      MASTER_TOURNAMENT_HEADERS.length
    )
    .setValues(rows);

}

}

function readTournamentMatches() {

  const sheet =
    SpreadsheetApp.getActive()
      .getSheetByName(
        SHEETS.TOURNAMENT_MATCHES
      );

  const values =
    sheet.getDataRange()
      .getValues();

  if (values.length <= 1) {
    return [];
  }

  const headers = values[0];

  return values
    .slice(1)
    .map(row => {

      const match = {};

      headers.forEach(
        (header, index) => {

          match[header] = row[index];

        }
      );

      return match;

    });

}

function buildTitle(
  tournament
) {

  switch (tournament.type) {

    case COMPETITION_TYPES.BAC: {

      const match =
        tournament.label.match(
          /^BAC\s*(\d+)?$/i
        );

      const number =
        match?.[1] || '1';

      return `BAC N°${number}`;

    }

    case COMPETITION_TYPES.BNP: {

      const match =
        tournament.label.match(
          /(\d+)/
        );

      return match
        ? `BNP N°${match[1]}`
        : tournament.label;

    }

    case COMPETITION_TYPES.CEJ: {

      const match =
        tournament.label.match(
          /^CEJ\s+(\d+)$/i
        );

      return match
        ? `CEJ N°${match[1]}`
        : tournament.label;

    }

    case COMPETITION_TYPES.TIJ: {

      const match =
        tournament.label.match(
          /^TIJ\s+(\d+)/i
        );

      return match
        ? `TIJ N°${match[1]}`
        : tournament.label;

    }

    case COMPETITION_TYPES.TRJ: {

      const match =
        tournament.label.match(
          /^TRJ\s+([SD])(\d+)/i
        );

      if (!match) {
        return tournament.label;
      }

      const discipline =
        match[1].toUpperCase() === 'S'
          ? 'Simple'
          : 'Double';

      return `TRJ N°${match[2]} ${discipline}`;

    }
	
	case COMPETITION_TYPES.TDJ: {

	  const match =
		tournament.label.match(
		  /^TDJ\s+35\s*-?\s*([^-]+)\s*-/
		);

	  if (!match) {
		return tournament.label;
	  }

	  return `TDJ ${match[1].trim()}`;

	}
	
    case COMPETITION_TYPES.CHAMPIONNAT:
	  return tournament.label;   

    case COMPETITION_TYPES.INTERCLUB:
      return 'Finale Régionale';

    default:
      return '';
  }
}

function buildCategories(
  tournament
) {

  switch (tournament.type) {

    case COMPETITION_TYPES.BAC:
      return [
        'Benjamin',
        'Minime',
        'Cadet'
      ];

    case COMPETITION_TYPES.BNP:
      return [
        'Poussin'
      ];

    case COMPETITION_TYPES.CEJ:
      return [
        'Benjamin',
        'Minime',
        'Cadet'
      ];

    case COMPETITION_TYPES.TIJ:
      return [
        'Poussin',
        'Benjamin',
        'Minime',
        'Cadet'
      ];
	  
	case COMPETITION_TYPES.CHAMPIONNAT:

	  if (
		tournament.scope === SCOPES.NATIONALE
	  ) {

		return [
		  'Benjamin',
		  'Minime',
		  'Cadet',
		  'Junior'
		];

	  }

	  return [
		'Poussin',
		'Benjamin',
		'Minime',
		'Cadet'
	  ];

    case COMPETITION_TYPES.TRJ:

      if (
        tournament.categories &&
        tournament.categories.length
      ) {
        return tournament.categories;
      }

      return [
        'Poussin',
        'Benjamin',
        'Minime'
      ];

    default:

      return tournament.categories || [];

  }

}

function buildDepartmentalDisciplines(
  competition
) {

  const parts =
    competition.label
      .split('-')
      .map(part => part.trim().toUpperCase());

  const discipline =
    parts.find(part =>
      [
        'S',
        'S SI',
        'DH',
        'DD',
        'DH DD'
      ].includes(part)
    );

  if (!discipline) {
    return [];
  }

  switch (discipline) {

    case 'S':
    case 'S SI':
      return ['Simple'];

    case 'DH':
    case 'DD':
    case 'DH DD':
      return ['Double'];

    default:
      return [];

  }

}


function buildDisciplines(
  tournament
) {

  switch (tournament.type) {

    case COMPETITION_TYPES.BAC:
      return [
        'Simple'
      ];

    case COMPETITION_TYPES.BNP:
      return [
        'Simple'
      ];

    case COMPETITION_TYPES.CEJ:
	case COMPETITION_TYPES.CHAMPIONNAT:
	  return [
		'Simple',
		'Double',
		'Mixte'
	  ];

    case COMPETITION_TYPES.TRJ: {

      const match =
        tournament.label.match(
          /^TRJ\s+([SD])/i
        );

      if (
        match &&
        match[1].toUpperCase() === 'S'
      ) {
        return [
          'Simple'
        ];
      }

      return [
        'Double',
        'Mixte'
      ];

    }
	
	case COMPETITION_TYPES.TDJ:
		return buildDepartmentalDisciplines(tournament);
	
    case COMPETITION_TYPES.TIJ:
    default:
      return [];

  }

}

function buildMasterCandidate(
  competition
) {

  return {

    tournamentId:
      competition.tournamentId,

    type:
      competition.type,

    scope:
      competition.scope || '',

    title:
      competition.title || '',

    region:
      competition.region || '',

    department:
      competition.department || '',

    city:
      competition.city || '',

    gymnasium: '',

    startDate:
      competition.startDate,

    endDate:
      competition.endDate,

    categories:
      (competition.categories || [])
        .join(';'),

    disciplines:
      (competition.disciplines || [])
        .join(';'),

    registrationOpenDate: '',

    registrationCloseDate: '',

    eventUrl: ''

  };

}

function isMasterCompetition(
  competition
) {

  if (
    competition.scope ===
    SCOPES.DEPARTEMENTALE
  ) {

    return (
      competition.source ===
      SOURCES.COMITE_35
    );

  }

  return (
    competition.source ===
    SOURCES.LIGUE_BRETAGNE
  );

}

function buildMasterCandidates(
  competitions
) {

  return competitions
    .filter(
      isMasterCompetition
    )
    .map(
      buildMasterCandidate
    );

}

function enrichCompetitions(
  competitions
) {

  competitions.forEach(
	enrichCompetition
  );

  buildTIJDisciplines(
    competitions
  );

  return competitions;

}

function enrichCompetition(
  competition
) {

  enrichLocation(
    competition
  );

}

function buildTIJDisciplines(
  competitions
) {

  const grouped = {};

  competitions
    .filter(
      c =>
        c.type ===
        COMPETITION_TYPES.TIJ
    )
    .forEach(c => {

      if (!grouped[c.tournamentId]) {
        grouped[c.tournamentId] = [];
      }

      grouped[c.tournamentId].push(c);

    });

  Object.values(grouped)
    .forEach(group => {

      group.sort(
        (a, b) =>
          a.startDate - b.startDate
      );

      if (group[0]) {
        group[0].disciplines =
          ['Simple'];
      }

      if (group[1]) {
        group[1].disciplines =
          [
            'Double',
            'Mixte'
          ];
      }

    });

}

function analyzeMasterCandidates(
  candidates,
  masterTournaments
) {

  candidates.forEach(
    candidate => {

      const matches =
        masterTournaments.filter(
          tournament =>
			String(tournament.tournamentId).toUpperCase() ===
			String(candidate.tournamentId).toUpperCase()
        );

      if (matches.length === 0) {

        candidate.masterAction =
          'CREATE';

        candidate.masterReason =
          'TournamentId not found';

        return;

      }

      if (matches.length === 1) {

        compareMasterCandidate(
          candidate,
          matches[0]
        );

        return;

      }

      const matchingTournament =
        matches.find(
          tournament =>
            sameDate(
              tournament.startDate,
              candidate.startDate
            )
            &&
            tournament.categories ===
              candidate.categories
        );

      if (!matchingTournament) {

        candidate.masterAction =
          'CREATE';

        candidate.masterReason =
          'No matching occurrence';

        return;

      }

      compareMasterCandidate(
        candidate,
        matchingTournament
      );

    }
  );

}

function compareMasterCandidate(
  candidate,
  master
) {

  const differences = [];
  
  Logger.log(candidate);
  Logger.log(master);
  if (
    candidate.title !== master.title
  ) {
    differences.push('Title');
  }

  if (
    String(candidate.region).toUpperCase() !== String(master.region).toUpperCase()
  ) {
    differences.push('Region');
  }

  if (
    candidate.department !==
    master.department
  ) {
    differences.push('Department');
  }

  if (
    candidate.city !== master.city
  ) {
    differences.push('City');
  }

  if (
    candidate.categories !==
    master.categories
  ) {
    differences.push('Categories');
  }

  if (
    candidate.disciplines !==
    master.disciplines
  ) {
    differences.push('Disciplines');
  }

  if (differences.length === 0) {

    candidate.masterAction =
      'UNCHANGED';

    candidate.masterReason =
      '';

    return;

  }

  candidate.masterAction =
    'UPDATE';

  candidate.masterReason =
    differences.join('; ');

}

function readTournamentMaster() {

  const sheet =
    SpreadsheetApp.getActive()
      .getSheetByName(
        SHEETS.TOURNAMENT_MASTER
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
      type: row[1],
      scope: row[2],
      title: row[3],

      region: row[4],
	  department: normalizeDepartment(row[5]),
      city: row[6],

      gymnasium: row[7],

      startDate: row[8],
      endDate: row[9],

      categories: row[10] || '',
      disciplines: row[11] || ''

    }));

}

let cityReferencesCache = null;

function getCityReferences() {

  if (!cityReferencesCache) {
    cityReferencesCache =
      loadCityReferences();
  }

  return cityReferencesCache;

}


function enrichLocation(
  competition
) {

  if (!competition.city) {
    return;
  }
  
  const reference = getCityReferences()[competition.city];
  

  if (!reference) {
    return;
  }

  if (!competition.department) {
    competition.department =
      reference.department;
  }

  if (!competition.region) {
    competition.region =
      reference.region;
  }

}

function normalizeDepartment(value) {

  if (
    value === '' ||
    value === null ||
    value === undefined
  ) {
    return '';
  }

  return String(value)
    .replace(/\.0$/, '')
    .padStart(2, '0');

}