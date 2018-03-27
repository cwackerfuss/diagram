import Model from '../gaiagram/Model'

export default function({ type, schema, storage }) {
  return new Model({ type, schema, storage })
}
