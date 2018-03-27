export const initGaiagram = () => ({
  migrations: [],
  models: {},
  registerModel: function(model) {
    if (!!this.models[model.type]) {
      console.error('That model type already exists.')
    } else {
      this.models[model.type] = model
    }
  },
  dropModel: function(type) {
    if (!this.models[type]) {
      console.error('This model type does not exist.')
    } else {
      delete(this.models[type])
    }
  }
})
