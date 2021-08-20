export default class CrudResponse {
  /**
   * @param {Error|undefined} exception
   */
  constructor (exception = undefined) {
    this.$status = 200
    this.$message = ''
    this.$fields = {}
    this.$redirect = undefined

    this.parse(exception)
  }

  static get HTTP_FOUND () {
    return 302
  }

  static get HTTP_UNAUTHORIZED () {
    return 401
  }

  static get HTTP_NOT_FOUND () {
    return 404
  }

  static get HTTP_FORBIDDEN () {
    return 403
  }

  static get HTTP_UNPROCESSABLE_ENTITY () {
    return 422
  }

  static get HTTP_TOO_MANY_REQUESTS () {
    return 429
  }

  static get HTTP_SERVER_ERROR () {
    return 500
  }

  static get HTTP_METHOD_NOT_ALLOWED () {
    return 405
  }

  static get HTTP_FAIL_STATUS_CODES () {
    return [
      CrudResponse.HTTP_SERVER_ERROR,
      CrudResponse.HTTP_NOT_FOUND,
      CrudResponse.HTTP_UNPROCESSABLE_ENTITY,
      CrudResponse.HTTP_TOO_MANY_REQUESTS,
      CrudResponse.HTTP_UNAUTHORIZED,
      CrudResponse.HTTP_FORBIDDEN,
      CrudResponse.HTTP_METHOD_NOT_ALLOWED
    ]
  }

  /**
   * Get the response fail feedbacks.
   *
   * @returns {Object}
   */
  get feedbacks () {
    return this.$fields
  }

  /**
   * Check if the given response has failed.
   *
   * @returns {boolean}
   */
  get fail () {
    return (
      this.status === 0 ||
      CrudResponse.HTTP_FAIL_STATUS_CODES.includes(this.status)
    )
  }

  /**
   * Get the response status code.
   *
   * @returns {Number}
   */
  get status () {
    return this.$status
  }

  /**
   * Get the general response message given by the response.
   *
   * @returns {string}
   */
  get message () {
    return this.$message
  }

  /**
   * Get the URL that we should redirect base on a givn response.
   *
   * @returns {String|void}
   */
  get redirect () {
    return this.$redirect
  }

  /**
   * Used to determine if with given response
   * we should redirect to a new screen page.
   *
   * @returns {boolean}
   */
  get wantsRedirect () {
    return this.status === CrudResponse.HTTP_FOUND && !!this.$redirect
  }

  /**
   * TRUE when response is unauthorized because is unauthenticated.
   *
   * @returns {boolean}
   */
  get isSessionExpired () {
    if (this.status !== CrudResponse.HTTP_UNAUTHORIZED) {
      return false
    }

    return this.message === 'Unauthenticated.'
  }

  get isNotFound () {
    return this.status === CrudResponse.HTTP_NOT_FOUND
  }

  get isServerError () {
    return this.status === CrudResponse.HTTP_SERVER_ERROR
  }

  /**
   * Parse the given exception.
   *
   * @param {Error|Object} exception
   * @returns {CrudResponse}
   */
  parse (exception) {
    if (typeof exception === 'undefined') {
      return this
    }

    const resp = exception.response || {
      response: {
        status: 200,
        data: {}
      }
    }
    this.$status = resp.status ? exception.response.status : false
    this.$message = resp.statusText
      ? exception.response.statusText
      : exception.message || ''
    this.$fields = {}

    if (resp.data && resp.data.errors) {
      Object.keys(resp.data.errors).forEach((field) => {
        this.$fields[field] = resp.data.errors[field].pop()
      })
    }

    if (resp.data && resp.data.message) {
      this.$message = resp.data.message
    }

    if (resp.data && resp.data.redirect) {
      this.$redirect = resp.data.redirect
    }

    return this
  }

  /**
   * Reset the current response.
   *
   * @return {CrudResponse}
   */
  reset () {
    this.$status = false
    this.$message = ''
    this.$fields = {}
    return this
  }

  /**
   * Check if a given field has failed in the given response.
   *
   * @param {String} field
   * @returns {boolean}
   */
  has(field) {
    return !!this.$fields[field]
  }

  forget(field) {
    if (!this.has(field)) {
      return
    }
    this.$fields[field] = undefined
  }

  /**
   * Get the feedback message error for a given field.
   *
   * @param {String|Array} field
   * @returns {string}
   */
  feedback(field) {
    if (Array.isArray(field)) {
      for (const path of field) {
        const output = this.feedback(path)
        if (output) {
          return output
        }
      }
      return ''
    }
    return this.$fields[field] || ''
  }
}
