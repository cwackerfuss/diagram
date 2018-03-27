import blockstackDriver from '../gaiagram/adapters/blockstack'
import CollectionService from '../gaiagram/drivers/collection'

export default class Model {
  constructor({ type, storage, schema }) {
    this.type = type
    this.schema = schema
    this.storage = storage || new CollectionService({
      type, driver: blockstackDriver({ encrypt: true })
    })
  }

  compareMigrateModel(migrateModel) {

  }

  validate(item) {
    let validation = { hasError: false, errors: [] }
    Object.keys(this.schema).forEach(key => {
      // if schema states key is required, but item key is not present
      if (!!this.schema[key].required && !item[key]) {
        validation.hasError = true
        validation.errors.push({ key, error: `${ key } is required.`})
      }
      // if type does not match schema
      else if (this.schema[key].type !== typeof item[key]) {
        validation.hasError = true
        validation.errors.push({
          key,
          error: `Expected ${ key } to be a ${ this.schema[key].type }. Got a ${ typeof item[key] } instead.`
        })
      }
    })
    return validation
  }

  async find(ids) {
    if (typeof ids === 'object') {
      return await this.storage.getItemsFromIds(ids)
    } else {
      return await this.storage.getItem(ids)
    }
  }

  async findAll() {
    return await this.storage.getItems()
  }

  async add(item) {
    const validation = this.validate(item)
    if (validation.hasError) {
      console.error(validation.errors)
      return validation.errors
    } else {
      return await this.storage.createItem(item)
    }
  }

  async update(item) {
    return await this.storage.updateItem(item)
  }

  async remove(id) {
    return await this.storage.deleteItem(id)
  }
}
