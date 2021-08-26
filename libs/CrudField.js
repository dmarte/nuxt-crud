import CrudHead from './CrudHead'

export default class CrudField extends CrudHead {
  constructor(name, type) {
    super()
    this.name(name)
    this.label(name)
    this.component(type)
    this.value(null)
  }
}
