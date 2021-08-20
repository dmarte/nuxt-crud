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

### Modules
nuxt-crud uses classes like `CrudModule` to create a module with the name that should be used as endpoint to render the forms and make API calls. 
> It is important to notice that the module `name` is used to determine the API endpoints.
> 
> E.g. Module `fields` will try to get the api endpoint `/api/fields`.
```javascript
// In your nuxt.config.js
{
  modules: [
    // Register the module "fields"
    new CrudModule('fields')
      // Open the form as full screen.
      .fullscreen()
      // Add new field ID
      .field(
        new CrudFieldId('id')
          // Make the field sortable on index
          .sortable()
          // Hide the fields on forms
          .hideOnForms()
      )
      // You can chain multiple fields
      .field(new CrudFieldText('label').sortable())
      .field(new CrudFieldText('name').sortable())
      .field(new CrudFieldText('hint').hideOnIndex())
      .field(new CrudFieldText('placeholder').hideOnIndex())
      .field(new CrudFieldKeyValue('rules').hideOnIndex())
  ]
}
```
