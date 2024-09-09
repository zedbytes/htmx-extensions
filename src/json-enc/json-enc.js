(function() {
  let api
  htmx.defineExtension('json-enc', {
    init: function(apiRef) {
      api = apiRef
    },

    onEvent: function(name, evt) {
      if (name === 'htmx:configRequest') {
        evt.detail.headers['Content-Type'] = 'application/json'
      }
    },

    encodeParameters: function(xhr, parameters, elt) {
      xhr.overrideMimeType('text/json')

      const vals = api.getExpressionVars(elt)
      const object = {}

      function setNestedValue(obj, path, value) {
        const keys = path.split('.')
        let current = obj
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            current[keys[i]] = {}
          }
          current = current[keys[i]]
        }
        current[keys[keys.length - 1]] = value
      }

      parameters.forEach(function(value, key) {
        // FormData encodes values as strings, restore hx-vals/hx-vars with their initial types
        const typedValue = Object.hasOwn(vals, key) ? vals[key] : value

        if (key.includes('.')) {
          setNestedValue(object, key, typedValue)
        } else if (Object.hasOwn(object, key)) {
          if (!Array.isArray(object[key])) {
            object[key] = [object[key]]
          }
          object[key].push(typedValue)
        } else {
          object[key] = typedValue
        }
      })

      return JSON.stringify(object)
    }
  })
})()