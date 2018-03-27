import defineModel from '../gaiagram/defineModel'

const schema = {
  make: {type: "string", index: true, required: true},
  year: {type: "number", index: true, required: true}
}

export default defineModel({ type: 'car', schema })
