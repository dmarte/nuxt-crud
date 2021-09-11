import CrudAction from './CrudAction'

export default class CrudActionIndex extends CrudAction {
  constructor () {
    super()
    this
      .name('index')
      .icon('mdi-view-list-outline')
      .label('crud.actions.index')
      .route({ name: 'crud-module-collection' })
      .standalone()
      .hideOnIndex()
      .hideWhenUpdating()
      .hideWhenCreating()
  }
}
