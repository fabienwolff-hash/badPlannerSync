function generateSummary() {

  const sheet =
    SpreadsheetApp.getActive()
      .getSheetByName(
        SHEETS.BPS_SUMMARY
      );

  sheet.clearContents();

  let row = 1;

  row = addSection(
    sheet,
    row,
    'BPS SUMMARY'
  );

  sheet
    .getRange(row, 1)
    .setValue('Execution');

  sheet
    .getRange(row, 2)
    .setValue(new Date());

  row += 2;

  sheet
    .getRange(row++, 1)
    .setFormula(
      buildSheetLink(
        SHEETS.TOURNAMENT_MASTER_CANDIDATES,
        'Voir TOURNAMENT_MASTER_CANDIDATES'
      )
    );

  sheet
    .getRange(row++, 1)
    .setFormula(
      buildSheetLink(
        SHEETS.TOURNAMENT_MATCHES,
        'Voir TOURNAMENT_MATCHES'
      )
    );

  sheet
    .getRange(row++, 1)
    .setFormula(
      buildSheetLink(
        SHEETS.TOURNAMENT_MASTER,
        'Voir TOURNAMENT_MASTER'
      )
    );

  row += 2;

  row =
    appendMasterSummary(
      sheet,
      row
    );

  row += 2;

  row =
    appendMatchSummary(
      sheet,
      row
    );

  row += 2;

  row =
    appendRejectionSummary(
      sheet,
      row
    );

}

function appendRejectionSummary(
  sheet,
  row
) {

  row = addSection(
    sheet,
    row,
    'REJECTIONS'
  );

  const rejections =
    Object.values(
      rejectedCompetitions || {}
    );

  sheet
    .getRange(row, 1)
    .setValue('Count');

  sheet
    .getRange(row, 2)
    .setValue(
      rejections.length
    );

  row += 2;

  sheet
    .getRange(row, 1, 1, 2)
    .setValues([
      ['Source', 'Label']
    ])
    .setFontWeight('bold');

  row++;

  rejections.forEach(
    rejection => {

      sheet
        .getRange(row, 1, 1, 2)
        .setValues([
          [
            rejection.source,
            rejection.label
          ]
        ]);

      row++;

    }
  );

  return row;

}

function appendMatchSummary(
  sheet,
  row
) {

  row = addSection(
    sheet,
    row,
    'MATCHING ISSUES'
  );

  const matches =
    readTournamentMatches();

  const counts = {};

  matches.forEach(match => {

    counts[match.Status] =
      (counts[match.Status] || 0)
      + 1;

  });

  Object.entries(counts)
    .forEach(([status, count]) => {

      sheet
        .getRange(row, 1)
        .setValue(status);

      sheet
        .getRange(row, 2)
        .setValue(count);

      row++;

    });

  row++;

  sheet
    .getRange(row, 1, 1, 2)
    .setValues([
      ['TournamentId', 'Status']
    ])
    .setFontWeight('bold');

  row++;

  matches.forEach(match => {

    if (
      match.Status ===
        MATCH_STATUS.MATCH
      ||
      match.Status ===
        MATCH_STATUS.MATCH_OVERRIDE
    ) {
      return;
    }

    sheet
      .getRange(row, 1, 1, 2)
      .setValues([
        [
          match.TournamentId,
          match.Status
        ]
      ]);

    row++;

  });

  return row;

}

function appendMasterSummary(
  sheet,
  row
) {

  row = addSection(
    sheet,
    row,
    'MASTER ACTIONS'
  );

  const candidateSheet =
    SpreadsheetApp.getActive()
      .getSheetByName(
        SHEETS.TOURNAMENT_MASTER_CANDIDATES
      );

  const values =
    candidateSheet
      .getDataRange()
      .getValues();

  const counts = {};

  values
    .slice(1)
    .forEach(rowData => {

      const action =
        rowData[15];

      counts[action] =
        (counts[action] || 0) + 1;

    });

  Object.entries(counts)
    .forEach(([action, count]) => {

      sheet
        .getRange(row, 1)
        .setValue(action);

      sheet
        .getRange(row, 2)
        .setValue(count);

      row++;

    });

  row++;

  sheet
    .getRange(row, 1, 1, 3)
    .setValues([
      ['TournamentId', 'Action', 'Reason']
    ])
    .setFontWeight('bold');

  row++;

  values
    .slice(1)
    .forEach(rowData => {

      const action =
        rowData[15];

      if (
        action !== 'CREATE' &&
        action !== 'UPDATE'
      ) {
        return;
      }

      sheet
        .getRange(row, 1, 1, 3)
        .setValues([
          [
            rowData[0],
            action,
            rowData[16]
          ]
        ]);

      row++;

    });

  return row;

}

function addSection(
  sheet,
  row,
  title
) {

  sheet
    .getRange(row, 1)
    .setValue(title)
    .setFontWeight('bold')
    .setFontSize(14)
    .setBackground('#1F4E78')
    .setFontColor('white');

  return row + 2;

}

function addSubSection(
  sheet,
  row,
  title
) {

  sheet
    .getRange(row, 1)
    .setValue(title)
    .setFontWeight('bold')
    .setBackground('#D9EAD3');

  return row + 1;

}

function buildSheetLink(
  sheetName,
  label
) {

  const sheet =
    SpreadsheetApp.getActive()
      .getSheetByName(
        sheetName
      );

  return `=HYPERLINK("#gid=${sheet.getSheetId()}";"${label}")`;

}
``