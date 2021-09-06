import CrudAction from './CrudAction'

export default class CrudActionIndex extends CrudAction {
  constructor() {
    super()
    this.icon('mdi-view-list-outline')
      .label('crud.actions.index')
      .route({ name: 'crud-module-collection' })
      .standalone()
      .hideOnIndex()
      .hideWhenUpdating()
      .hideWhenCreating()
  }
}
