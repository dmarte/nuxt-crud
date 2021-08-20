# nuxt-crud

This module let you build fast and custom CRUD's UI modules. Is build with the intention to work together with [Laravel](https://laravel.com), but you can use it with any kind of backend you want. 

Dependencies required and not installed by the modules.
1. [nuxt-moment](https://github.com/nuxt-community/moment-module)
1. [nuxt-vuetify](https://github.com/nuxt-community/vuetify-module)
1. [nuxt-axios](https://axios.nuxtjs.org/)
1. [nuxt-i18n](https://i18n.nuxtjs.org/)   
1. Vuex enabled

## Important
1. Each module name MUST BE IN ENGLISH
1. Each module name MUST BE IN PLURAL (NOT SINGULAR) Eg. `fields`

### How the crud paths should be formatted.
|METHOD|PATH|DESCRIPTION|
|---|---|---|
|`post`|`/api/{module}`|Create a new resource.|

### Modules
nuxt-crud uses class `CrudModule` to create a module with the name of the module. 
> It is important to notice that the module `name` is used to determine the API endpoint and form views (if exists).
> 
> E.g. Module `fields` will try to get the api endpoint `/api/fields` and will try to load with form view `FormField`.
```javascript
{
  modules: [
    // Register the module "fields"
    new CrudModule('fields') 
      // Add new head
      .head(new CrudHead('id'))
  ]
}
```
