function buildDate(
  seasonYear,
  monthName,
  day
) {


  const month = MONTHS[monthName];

  if (!month) {
    throw new Error(
      `Mois inconnu : ${monthName}`
    );
  }

  let year = seasonYear;

  if (month <= 8) {
    year += 1;
  }

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function addDays(dateString, days) {
  const date = new Date(dateString);

  date.setDate(date.getDate() + days);

  return Utilities.formatDate(
    date,
    Session.getScriptTimeZone(),
    "yyyy-MM-dd"
  );
}

function getCompetitionDates(
  row,
  data,
  sheetRow,
  mergedInfo,
  currentMonth
) {

  const startDay = Number(
    row[LIGUE_CALENDAR_COLUMNS.DATE]
  );

  let endDay = startDay;

  if (mergedInfo) {

    const endRow =
      sheetRow +
      mergedInfo.numRows -
      1;

    endDay = Number(
      data[endRow - 1][
        LIGUE_CALENDAR_COLUMNS.DATE
      ]
    );
  }
  
  return {
    startDate: buildDate(
      SEASON_YEAR,
      currentMonth,
      startDay
    ),

    endDate: buildDate(
      SEASON_YEAR,
      currentMonth,
      endDay
    )
  };
}