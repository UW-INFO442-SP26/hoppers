import { forwardRef } from 'react'

export const CampusMap = forwardRef(function CampusMap(
  { selectedBuilding, startLocation },
  ref,
) {
  return (
    <div
      className="campus-map"
      ref={ref}
      aria-label={`Interactive OpenStreetMap route from ${startLocation.name} to ${selectedBuilding.name}`}
    ></div>
  )
})
