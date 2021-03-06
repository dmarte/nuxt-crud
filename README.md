# nuxt-crud

NuxtJS module to generate CRUD screens within seconds.

## How it works?

1. Build your API endpoints to fetch.
1. Configure your Nuxt project with the [required dependencies](#dependencies-required-and not installed by the modules.)
1. You configure your desired modules in your `nuxt.config.js`
1. Run your app (`npm run dev`)

### Required dependencies

This module has a big dependency on many other modules to render the UI, below you will find the list of nuxt modules you need to configure before using this module.

1. [nuxt-moment](https://github.com/nuxt-community/moment-module)
1. [nuxt-vuetify](https://github.com/nuxt-community/vuetify-module)
1. [nuxt-axios](https://axios.nuxtjs.org/)
1. [nuxt-i18n](https://i18n.nuxtjs.org/)
1. [nuxt-vuex](https://nuxtjs.org/docs/2.x/directory-structure/store)

### Important

1. Each module name MUST BE IN ENGLISH.
1. Each module name MUST BE IN PLURAL FORM (Eg. `fields`).

## What's inside?
1. [Install](#install)
1. [Extend the router](#extend-the-router)
1. [Define your modules](#define-your-modules)
1. [Add fields to your module](#add-fields-to-your-modules)
1. [Test your module](#test-your-module)
1. [Create custom fields](#create-custom-fields)
1. [Field label translation](#field-label-translations)

## Install

Install from the command line:

```shell
npm install dmarte/nuxt-crud
```

Install via package.json:

```json
{
  "dependencies": {
    "@dmarte/nuxt-crud": "github:dmarte/nuxt-crud"
  }
}
```

### Install the module on Nuxt
```javascript
// in your nuxt.config.js
{
  modules: [
    // ...
    '@dmarte/nuxt-crud'
  ]
}
```

### Extend the router
Now it's time to extend your routes to fetch the modules.

```javascript
// In your nuxt.config.js
{
  router: {
      extendRoutes: (routes, resolve) => {
      routes.push({
        path: '/c/:module',
        component: resolve(__dirname, 'node_modules/@dmarte/nuxt-crud/pages/index'),
        props: {
          module: route => route.params.module
        },
        children: [
          {
            path: '',
            name: 'crud-module-collection',
            component: resolve(__dirname, 'node_modules//@dmarte/nuxt-crud/pages/collection')
          }
        ]
      })
    }
  }
}
```

### Define your modules

CRUD MODULES are used to build the basic UI needed (index, forms, detail page).

> It is important to notice the module `name` is used to determine the API endpoints to make the requests.
>
> E.g. Module `fields` will try to get the api endpoint `{API_URL}/api/fields`.
>
> Also the name will define the _module friendly url_ `{FRONT_URL}/c/fields`

To define a module you must create an instance of `CrudModule` class.

```javascript
// In your nuxt.config.js
{
  crud: {
    modules: [
      // Register the module "fields"
      new CrudModule('fields'),
    ],
    api: {
      // This prefix will be prepended to all endpoints
      prefix: '/api/'
    }
  }
}
```

> NOTE: We use a module named "fields" but you can use whatever name you want, just be sure to use `slug-case` convention for the name.

### Add fields to your modules

Fields represent the `input` schema that define how the data abstracted and displayed within the different UI views (index, forms and detail pages).
> Don't forgot to import your needed classes.
```javascript
import CrudModule from '@dmarte/nuxt-crud/libs/CrudModule'
{
  // In your nuxt.config.js
  crud: {
    modules: [
      // Register the module "fields"
      new CrudModule('fields')
        // Use this method to change the
        // field name used as primary key.
        .primaryKey('id')
        // Add a new field type ID
        .field(
          // The class that define the field type
          new CrudFieldId(
            // The name of the field that will be sended to the API
            'id'
          )
        )
        // Add multiple field types chained
        .field(new CrudFieldText('name'))
        // Select type with the collection of options available
        .field(
          new CrudFieldSelect('items')
            .options([{ 
              value: 'val',
              // NOTE: If you want your "text" value be translated
              // you can specify the translation key here and the module 
              // will translate that label
              text: 'label' 
            }])
        )
        // A hidden (or fixed) value that should by sent to the server but not show any
        // field on the form view
        .field(new CrudFieldHidden('hidden_value').value(1))
        .field(
          // Define a field (could by any kind of field)
          new CrudFieldHidden('user_id')
            // Set the default value from a vuex state
            .valueFromVuexState('auth.user.data.id')
            // or set the value from a vuex getter
            .valueFromVuexGetter('service/KIND_GENERIC')
        )
        // Numeric field
        .field(new CrudFieldNumber('amount').value(0))
        // Key-Value field type
        // this field will sent a JSON object {<key> : <value>} to the server
        // with the given field name.
        .field(new CrudFieldKeyValue('key_value_field'))
        // Field type textarea
        .field(new CrudFieldTextarea('text_area_name'))
        // Field select for remote fetching
        .field(
          // Create a selector that fill its content from an API endpoint
          new CrudFieldSelectRemote('services')
            // Define the origin to fetch the data
            .origin('services')
            // Set the path where should take the text label for each option.
            .mapTextFrom('name')
            // Set the path where should take the value for each option.
            .mapValueFrom('id')
            // How many items per page should be displayed
            .perPage(10)
            // Add any additional custom query string needed in the fetch request
            // in a form of JSON object
            // PLEASE NOTICE that the following JSON object is just an example on what you can do.
            .query({ paginator: false })
            // Set a dynamic parameter that should be taken from Vuex State.
            .queryFromVuexState(
              // First the name of the key that should be send to the API
              'user_id',
              // Now the vuex state path as dot notation
              'auth.user.data.id'
            )
            .queryFromVuexGetter(
              // First the name of the key that should be send to the API
              'kind',
              // Next the vuex getter path to be used
              'service/KINDS'
            )
            // If your response is wrapped into a property of the response
            // you can set the path to get the collection here
            .mapResponse('data')
        )
    ]
  }
}
```

### Test your module
You can now get the render of your module at `{YOUR_FRONT_URL}/c/{MODULE_NAME}`.
> Please note that `fields` is just the `slug-case` name we use in this example, the part after `c` could be any `slug-case` name you defined when created a `new CrudModule('name')`.

## Create custom fields

You can create your own fields to render on UI. Just need to create a class that extends to `CrudField` class and then implement the desired component to be rendered.

```javascript
// my_custom_field.js
export default class MyCustomField extends CrudField {
  /**
   * @param {String} fieldName
   */
  constructor(fieldName) {
    super(
      fieldName, // The field name as should be send to the API
      'MyCustomVueComponent' // The name of your registered Vue component that represent the field.
    )
  }
}

// nuxt.config.js
import CrudModule from '@dmarte/nuxt-crud/libs/CrudModule'
{
  modules: [
    new CrudModule('my-custom-module').field(new MyCustomField('field_name')),
  ]
}
```

Then after in your `.vue` component file make sure to extend the component to use the mixin `field` included in this package.

```vue
<template>
  <input
    type="text"
    :name="name"
    :id="id"
    :value="value"
    @change="whenChange"
  />
</template>
<script>
import field from '@dmarte/nuxt-crud/mixins/field'

export default {
  name: 'MyCustomVueComponent',
  mixins: [field],
}
</script>
```

> **PLEASE NOTE**
>
> When you use the `field` mixin in a component the following properties are available to you:
> `id`, `name`,`label`,`value`,`placeholder`,`disabled`,`response<CrudResponse>`
>
> Also the method `whenChange` should be used to notify the render engine that field was changed.

# Visibility
You can control the field visibility in different scenarios.
```javascript
// In your nuxt.config.js
{
  crud: {
    modules: [
      new CrudModule('fields')
        // Here component is the parent module that will 
        .field(
          new CrudFieldSelect('component')
            // Define the possible values
          .options([{value: 'one', text: 'Value One'}, {value: 'two', text: 'Value Two'}, {value: 'three', text: 'Value three'}])
        )
        // Next create any type of field (in this case we use the field text)
        .field(
          new CrudFieldText('name')
            // Then we limit the visibility on the parent field "component" has one of the two possible values (one or two).
            // It will take an array witht the list of possible values to compare
            // NOTE: At the moment THIS ONLY WILL WORK WITH ARRAY OF PRIMITIVE DATA TYPES NOT WITH OBJECTS NOR ARRAY.
          .visibleWhen('component', ['one', 'two'])
        )
        .field(
          new CrudFieldText('id')
            .hideOnIndex()
            .hideWhenCreating()
            .hideWhenUpdating()
            .hideOnDetail()
            .hideOnForms()
            .onlyOnForms()
            .onlyWhenCreating()
            .onlyWhenUpdating()
            .onlyOnDetail()
        )
    ]
  }
}
```

#### Field label translations

CRUD module will try to find a translation label for a given field name in the following order: 
1. `${fieldName}`
1. `attribute.${fieldName}`
1. `crud.module.${moduleName}.attribute.${fieldName}`

If no exists any translation it will return the field label as it is.

#### Module translations

You can translate the title used for the module if you create the key in your translation file using the following convention:
`crud.module.${moduleName}.title`. 

Also, you can set the `singular` and `plural` version of the module using pipe `|` divisor.

```json
{
  "crud.module.fields.title": "Campos adicionales|Campo adicional"
}
```
#### Form translations
To translate the title of the form you must have the keys in your translation files as following:
```json
{
  "crud.actions.update": "Edit {resource}",
  "crud.actions.create": "Create {resource}"
}
```
> Please note that `{resource}` is a placeholder that hold the `singular` form of the module name.
> 
> Eg. "`Edit {resource}`" will be "`Edit field`" when updating, when creating will be "`Create field`".
