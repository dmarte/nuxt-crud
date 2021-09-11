import CrudAction from './CrudAction'

export default class CrudActionUpdate extends CrudAction {
  constructor () {
    super()
    this
      .name('update')
      .icon('mdi-pencil')
      .label('crud.actions.update')
      .route({ name: 'crud-module-update' })
      .setParamFromPrimaryKey()
      .setQueryFromRoute('fullPath', 'redirect')
      .inline()
      .hideWhenUpdating()
      .hideWhenCreating()
  }
}
