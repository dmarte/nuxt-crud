import CrudFieldSelect from './CrudFieldSelect'

export default class CrudFieldTypes extends CrudFieldSelect {
  constructor(name) {
    super(name)
    this.options([
      {
        text: 'field.CFieldHidden',
        value: 'CFieldHidden'
      },
      {
        text: 'field.CFieldKeyValue',
        value: 'CFieldKeyValue'
      },
      {
        text: 'field.CFieldNumber',
        value: 'CFieldNumber'
      },
      {
        text: 'field.CFieldSelect',
        value: 'CFieldSelect'
      },
      {
        text: 'field.CFieldAutocomplete',
        value: 'CFieldAutocomplete'
      },
      {
        text: 'field.CFieldCheckbox',
        value: 'CFieldCheckbox'
      },
      {
        text: 'field.CFieldCountry',
        value: 'CFieldCountry'
      },
      {
        text: 'field.CFieldText',
        value: 'CFieldText'
      },
      {
        text: 'field.CFieldTextarea',
        value: 'CFieldTextarea'
      },
    ])
  }
}
