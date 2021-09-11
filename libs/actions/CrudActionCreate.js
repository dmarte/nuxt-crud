import CrudAction from './CrudAction'

export default class CrudActionCreate extends CrudAction {
  constructor () {
    super()
    this
      .name('create')
      .icon('mdi-plus')
      .label('crud.actions.create')
      .route({ name: 'crud-module-create' })
      .setParamFromRoute('params.module', 'module')
      .setQueryFromRoute('fullPath', 'redirect')
      .standalone()
  }
}
