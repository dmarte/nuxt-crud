import CrudField from './CrudField'

export default class CrudFieldHasMany extends CrudField {
  constructor (module, foreignKey) {
    super(`${module}.${foreignKey}`, 'CFieldHasMany')
    this.$options.settings.params.moduleName = module
    this.$options.settings.params.foreignKey = foreignKey
  }
}
