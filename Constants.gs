const TYPE_SCOPE_MAPPING = {
  Promobad: "Départementale",
  CDJ: "Départementale",
  TDJ: "Départementale",
  TRJ: "Régionale",
  TIJ: "Inter-Régionale",
  BAC: "Nationale",
  BNP: "Nationale",
  CEJ: "Nationale",
};

const SHEETS = {
  SNAPSHOT_CURRENT: "SNAPSHOT_CURRENT",
  SNAPSHOT_PREVIOUS: "SNAPSHOT_PREVIOUS",
  PENDING_CHANGES: "PENDING_CHANGES",
  CONFIG: "CONFIG"
};

const CONFIG = {
  LIGUE_SPREADSHEET_ID:
    PropertiesService.getScriptProperties().getProperty(
      "LEAGUE_SPREADSHEET_ID"
    ),

  LIGUE_SHEET_NAME:
    "CALENDRIER SPORTIF 2026-2027"
};

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

const COMPETITION_TYPES = {
  BAC: "BAC",
  BNP: "BNP",
  CEJ: "CEJ",
  TIJ: "TIJ",
  TRJ: "TRJ",
  TDJ: "TDJ",
  CDJ: "CDJ",
  PROMOBAD: "Promobad"
};

const SOURCES = {
  LIGUE_BRETAGNE: "LIGUE_BRETAGNE"
};

const CALENDAR_LABELS = {
  BAC: "BAC",
  CEJ: "CEJ",
  TIJ: "TIJ",
  TRJ: "TRJ",
  BRASSAGE_NATIONAL: "Brassage National"
};

const SHEET_INDEX_OFFSET = 1;