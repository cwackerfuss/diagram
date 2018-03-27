export const migration1 = {
  up: (models) => ({
    ...models,
    car: {
      year: {
        type: 'number',
        index: true,
        required: true
      },
      color: {
        type: 'string',
        required: true
      }
    }
  }),
  down: (models) => {
    const updated = { ...models }
    delete(updated.car)
    return updated
  }
}

export const migration2 = {
  up: (models) => {
    const updated = {
      ...models,
      car: {
        ...models.car,
        make: {
          type: 'string',
          index: true,
          required: true,
          fill: item => item.year
        }
      }
    }
    delete(updated.car.color)
    return updated
  },
  down: (models) => {
    const updated = {
      ...models,
      car: {
        ...models.car,
        color: {
          type: 'string',
          required: true
        }
      }
    }
    delete(updated.car.make)
    return updated
  }
}

export default function() {
  let models = {}
  const migrations = [ migration1, migration2 ]
  migrations.forEach(migration => {
    models = migration.up(models)
  })
  return models;
}

export function downOne(models) {
  let newModels = { ...models }
  const migrations = [ migration2 ]
  migrations.forEach(migration => {
    newModels = migration.down(newModels)
  })
  console.log(newModels)
}
