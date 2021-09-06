import CrudAction from './CrudAction'

export default class CrudActionUpdate extends CrudAction {
  constructor() {
    super()
    this
      .icon('mdi-pencil')
      .label('crud.actions.update')
      .route({ name: 'crud-module-update' })
      .setParamFromRoute('params.id', 'id')
      .setQueryFromRoute('fullPath', 'redirect')
      .hideWhenUpdating()
      .hideWhenCreating()
  }
}
