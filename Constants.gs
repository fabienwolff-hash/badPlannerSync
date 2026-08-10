// =================================================
// Configuration
// =================================================

const SEASON_YEAR = 2026;

const LIGUE_CALENDAR_CONFIG = {
  LIGUE_SPREADSHEET_ID:
    PropertiesService.getScriptProperties().getProperty(
      "LEAGUE_SPREADSHEET_ID"
    ),

  LIGUE_SHEET_NAME:
    "CALENDRIER SPORTIF 2026-2027"
};

// =================================================
// Feuilles BPS
// =================================================

const SHEETS = {
  SNAPSHOT_CURRENT: "SNAPSHOT_CURRENT",
  SNAPSHOT_PREVIOUS: "SNAPSHOT_PREVIOUS",
  PENDING_CHANGES: "PENDING_CHANGES",
  CONFIG: "CONFIG"
};

// =================================================
// Sources
// =================================================

const SOURCES = {
  LIGUE_BRETAGNE: "LIGUE_BRETAGNE"
};

// =================================================
// Types métier BPS
// =================================================

const COMPETITION_TYPES = {
  BAC: "BAC",
  BNP: "BNP",
  CEJ: "CEJ",
  TIJ: "TIJ",
  TRJ: "TRJ",
  TDJ: "TDJ",
  CDJ: "CDJ",
  PROMOBAD: "Promobad",
  CHAMPIONNAT: "Championnat",
  INTERCLUB: "Interclub"
};

// =================================================
// Elements détectés dans le calendrier Ligue
// =================================================

const CALENDAR_COMPETITION_TYPES = {
  QUALIFICATION_FRANCE_JEUNES: "QUALIFICATION_FRANCE_JEUNES",
  CHAMPIONNATS_FRANCE_JEUNES: "CHAMPIONNATS_FRANCE_JEUNES",
  CHAMPIONNAT_BRETAGNE_JEUNES: "CHAMPIONNAT_BRETAGNE_JEUNES",
  CHAMPIONNATS_DEPARTEMENTAUX_JEUNES: "CHAMPIONNATS_DEPARTEMENTAUX_JEUNES",
  INTERCLUB_REGIONAL: "INTERCLUB_REGIONAL"
};

const CALENDAR_LABELS = {
  BAC: "BAC",
  CEJ: "CEJ",
  TIJ: "TIJ",
  TRJ: "TRJ",
  BRASSAGE_NATIONAL: "Brassage National",
  QUALIFICATION_FRANCE: "Qualification France",
  CHAMPIONNATS_FRANCE: "Championnats de France",
  CHAMPIONNAT_BRETAGNE: "Championnat de Bretagne",
  CHAMPIONNATS_DEPARTEMENTAUX: "Championnats Départementaux",
  FINALE_REGIONALE_INTERCLUBS: "Finale Régionale Interclubs"
};

// =================================================
// Libellés volontairement ignorés dans le calendrier Ligue
// =================================================

/**
* Labels volontairement ignorés.
* Utilisés pour distinguer un événement connu
* mais non supporté d'un événement inconnu.
*/
//On ignore Intercomité Bretagne car on ne sait pas a quoi ça correspond
const IGNORED_CALENDAR_LABELS = [
	'Limite Régionaux jeunes',
	'Intercomité Bretagne'
	];
	
// =================================================
// Colonnes du calendrier Ligue
// =================================================

const LIGUE_CALENDAR_COLUMNS = {
  MONTH: 0, // A
  DATE: 2, // C

  NATIONAL: 7,      // H
  REGIONAL: 8,      // I

  PROMOBAD_LOCATION: 13, // N
  PROMOBAD_TABLEAU: 14,  // O

  MINIBAD: 15, // P
  POUSSIN: 16, // Q
  BENJAMIN: 17, // R
  MINIME: 18, // S
  CADET: 19, // T
  JUNIOR: 20 // U
};

const SHEET_INDEX_OFFSET = 1;

// =================================================
// Mapping Type → Scope
// =================================================

const SCOPES = {
  DEPARTEMENTALE: "Départementale",
  REGIONALE: "Régionale",
  INTER_REGIONALE: "Inter-Régionale",
  NATIONALE: "Nationale"
};

const TYPE_SCOPE_MAPPING = {
  Promobad: SCOPES.DEPARTEMENTALE,
  CDJ: SCOPES.DEPARTEMENTALE,
  TDJ: SCOPES.DEPARTEMENTALE,
  TRJ: SCOPES.REGIONALE,
  TIJ: SCOPES.INTER_REGIONALE,
  BAC: SCOPES.NATIONALE,
  BNP: SCOPES.NATIONALE,
  CEJ: SCOPES.NATIONALE,
};

// =================================================
// Gestion des dates
// =================================================

const MONTHS = {
  Janvier: 1,
  Février: 2,
  Mars: 3,
  Avril: 4,
  Mai: 5,
  Juin: 6,
  Juillet: 7,
  Août: 8,
  Septembre: 9,
  Octobre: 10,
  Novembre: 11,
  Décembre: 12
};

// =================================================
// Catégories jeunes
// =================================================

const YOUTH_CATEGORIES_BY_COLUMN = {
  17: "Minibad",
  18: "Poussin",
  19: "Benjamin",
  20: "Minime",
  21: "Cadet",
  22: "Junior"
};

const PROMOBAD_AGE_MARKERS = [
  "MBad",
  "Pou",
  "Ben",
  "Min",
  "Cad",
  "Jun"
];

const CATEGORY_ORDER = [
  'Minibad',
  'Poussin',
  'Benjamin',
  'Minime',
  'Cadet',
  'Junior'
];

const CATEGORY_LABEL_MAPPING = {
  MBad: 'Minibad',
  Pou: 'Poussin',
  Ben: 'Benjamin',
  Min: 'Minime',
  Cad: 'Cadet',
  Jun: 'Junior'
};