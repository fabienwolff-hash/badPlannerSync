function createCompetition(data) {
  return {
    source: data.source,
    type: data.type,

    scope:
      TYPE_SCOPE_MAPPING[data.type] ||
      null,

    label: data.label,

    month: data.month,
    startDay: data.startDay,
    endDay: data.endDay,

    rawData: data.rawData,

    ...(data.location && {
      location: data.location
    }),

    ...(data.categories && {
      categories: data.categories
    }),

    ...(data.city && {
      city: data.city
    })
  };
}