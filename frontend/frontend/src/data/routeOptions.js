export const routeOptions = [
  {
    id: 'fastest',
    label: 'Fastest',
    detail: 'Best when you have a short class transition.',
    tags: ['Direct', 'Fastest walk'],
    costingOptions: {
      walking_speed: 5.1,
    },
  },
  {
    id: 'accessible',
    label: 'Accessible',
    detail: 'Penalizes stairs and steep routes when pedestrian data allows it.',
    tags: ['Stair penalty', 'Lower hills'],
    costingOptions: {
      step_penalty: 900,
      use_hills: 0,
      walking_speed: 4.0,
    },
  },
  {
    id: 'sheltered',
    label: 'Simplest',
    detail: 'Prefers main walkways and avoids sketchier shortcuts.',
    tags: ['Main paths', 'Paved'],
    costingOptions: {
      alley_factor: 5,
      driveway_factor: 4,
      walkway_factor: 0.8,
      walking_speed: 4.4,
    },
  },
]
