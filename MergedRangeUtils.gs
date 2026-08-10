function buildMergedRangesIndex(mergedRanges) {
  const index = {};

  mergedRanges.forEach(range => {
    const key = `${range.getRow()}-${range.getColumn()}`;

    index[key] = {
      row: range.getRow(),
      column: range.getColumn(),
      numRows: range.getNumRows(),
      numColumns: range.getNumColumns()
    };
  });

  return index;
}


function findYouthMergedInfo(
  mergedIndex,
  row
) {

  for (
    let column =
      LIGUE_CALENDAR_COLUMNS.POUSSIN +
      SHEET_INDEX_OFFSET;

    column <=
      LIGUE_CALENDAR_COLUMNS.JUNIOR +
      SHEET_INDEX_OFFSET;

    column++
  ) {

    const mergedInfo =
      getMergedInfo(
        mergedIndex,
        row,
        column
      );

    if (mergedInfo) {
      return mergedInfo;
    }
  }

  return null;
}

function getMergedInfo(
  mergedIndex,
  row,
  column
) {
  return mergedIndex[
    `${row}-${column}`
  ] || null;
}

