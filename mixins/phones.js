import dials from '../dials.json'

export default {
  methods: {
    getPhoneDial (country) {
      /** @var {{dial_code:<String>}} locale */
      const locale = dials.find(({ code }) => code === country)

      if (!locale) {
        return '1'
      }

      return locale.dial_code.substr(1)
    },
    getPhoneDialFormat (value, country) {
      if (!value) {
        return ''
      }
      const dial = this.getPhoneDial(country).substr(0, 1)
      let number = this.phoneSanitize(value)
      if (dial !== value.substr(1, 1)) {
        number = `${dial}${number}`
      }
      return number
    },
    getPhoneLink (value, country) {
      if (!value) {
        return undefined
      }
      return `tel:+${this.getPhoneDialFormat(value, country)}`
    },
    getPhoneWhatsAppLink (value, country) {
      if (!value) {
        return undefined
      }
      return `https://wa.me/+${this.getPhoneDialFormat(value, country)}`
    },
    phoneSanitize (value) {
      return String(value).replace(/\W/gi, '')
    },
    phoneFormat (value) {
      if (!value) {
        return value
      }

      const phone = String(value)

      if (phone.length === 10) {
        return `(${phone.substr(0, 3)}) ${phone.substr(3, 3)}-${phone.substr(
          6,
          4
        )}`
      }

      if (phone.length === 11) {
        return `+${phone.substr(0, 1)} (${phone.substr(1, 3)}) ${phone.substr(
          4,
          3
        )}-${phone.substr(7, 3)}`
      }

      return phone
    }
  }
}
