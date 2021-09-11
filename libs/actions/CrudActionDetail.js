import CrudAction from './CrudAction'

export default class CrudActionDetail extends CrudAction {
  constructor () {
    super()
    this
      .name('detail')
      .icon('mdi-eye')
      .route({ name: 'crud-module-detail' })
      .setParamFromPrimaryKey()
      .inline()
      .hideOnDetail()
      .hideWhenUpdating()
      .hideWhenUpdating()
  }
}
