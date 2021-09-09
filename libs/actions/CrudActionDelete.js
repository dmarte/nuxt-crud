import CrudAction from './CrudAction'

export default class CrudActionDelete extends CrudAction {
  constructor () {
    super()
    this
      .icon('mdi-delete-outline')
      .label('crud.actions.destroy')
      .emits('destroy')
      .inline()
      .setParamFromPrimaryKey()
      .hideWhenUpdating()
      .hideWhenCreating()
      .withConfirmation()
  }
}
