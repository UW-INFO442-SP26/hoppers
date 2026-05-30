export const reportTypes = [
  {
    id: 'stairs',
    label: 'Stairs',
    description: 'Stairs or step-heavy path that may affect accessibility.',
  },
  {
    id: 'construction',
    label: 'Construction',
    description: 'Temporary closure, fencing, or blocked walkway.',
  },
  {
    id: 'hazard',
    label: 'Path hazard',
    description: 'Pothole, slippery surface, poor lighting, or other issue.',
  },
]

export const getReportType = (typeId) =>
  reportTypes.find((type) => type.id === typeId) ?? reportTypes[0]
