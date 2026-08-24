let rulesCache = null;

function loadRules() {

  const sheet =
    SpreadsheetApp.getActive()
      .getSheetByName(
        SHEETS.BPS_RULES
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

      ruleType: row[0],
      key: row[1],
      value1: row[2],
      value2: row[3],
      comment: row[4]

    }));

}

function getRules() {

  if (!rulesCache) {
    rulesCache = loadRules();
  }

  return rulesCache;

}

function getRulesByType(
  ruleType
) {

  return getRules()
    .filter(
      rule =>
        rule.ruleType ===
        ruleType
    );

}

function loadCityReferences() {

  const references = {};

  getRulesByType(
    RULE_TYPES.CITY_REFERENCE
  )
  .forEach(rule => {

    references[rule.key] = {

      department:
        rule.value1,

      region:
        rule.value2

    };

  });

  return references;

}

function getCityAliases() {

  const aliases = {};

  getRulesByType(
    RULE_TYPES.CITY_ALIAS
  )
  .forEach(rule => {

    aliases[rule.key] =
      rule.value1;

  });

  return aliases;

}

function resolveCityAlias(
  city
) {

  const aliases =
    getCityAliases();

  return aliases[city] || city;

}