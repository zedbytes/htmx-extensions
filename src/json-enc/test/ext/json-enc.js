describe('json-enc extension', function() {
  beforeEach(function() {
    this.server = makeServer()
    clearWorkArea()
  })
  afterEach(function() {
    this.server.restore()
    clearWorkArea()
  })

  it('handles basic get properly', function() {
    var jsonResponseBody = JSON.stringify({})
    this.server.respondWith('GET', '/test', jsonResponseBody)
    var div = make('<div hx-get="/test" hx-ext="json-enc">click me</div>')
    div.click()
    this.server.respond()
    this.server.lastRequest.response.should.equal('{}')
  })

  it('handles basic post properly', function() {
    var jsonResponseBody = JSON.stringify({})
    this.server.respondWith('POST', '/test', jsonResponseBody)
    var div = make("<div hx-post='/test' hx-ext='json-enc'>click me</div>")
    div.click()
    this.server.respond()
    this.server.lastRequest.response.should.equal('{}')
  })

  it('handles basic put properly', function() {
    var jsonResponseBody = JSON.stringify({})
    this.server.respondWith('PUT', '/test', jsonResponseBody)
    var div = make('<div hx-put="/test" hx-ext="json-enc">click me</div>')
    div.click()
    this.server.respond()
    this.server.lastRequest.response.should.equal('{}')
  })

  it('handles basic patch properly', function() {
    var jsonResponseBody = JSON.stringify({})
    this.server.respondWith('PATCH', '/test', jsonResponseBody)
    var div = make('<div hx-patch="/test" hx-ext="json-enc">click me</div>')
    div.click()
    this.server.respond()
    this.server.lastRequest.response.should.equal('{}')
  })

  it('handles basic delete properly', function() {
    var jsonResponseBody = JSON.stringify({})
    this.server.respondWith('DELETE', '/test', jsonResponseBody)
    var div = make('<div hx-delete="/test" hx-ext="json-enc">click me</div>')
    div.click()
    this.server.respond()
    this.server.lastRequest.response.should.equal('{}')
  })

  it('handles post with form parameters', function() {
    this.server.respondWith('POST', '/test', function(xhr) {
      var values = JSON.parse(xhr.requestBody)
      values.should.have.keys('username', 'password')
      values.username.should.be.equal('joe')
      values.password.should.be.equal('123456')
      var ans = { passwordok: values.password == '123456' }
      xhr.respond(200, {}, JSON.stringify(ans))
    })

    var html = make('<form hx-post="/test" hx-ext="json-enc" > ' +
            '<input type="text"  name="username" value="joe"> ' +
            '<input type="password"  name="password" value="123456"> ' +
        '<button  id="btnSubmit">Submit</button> ')

    byId('btnSubmit').click()
    this.server.respond()
    this.server.lastRequest.response.should.equal('{"passwordok":true}')
  })

  it('handles put with form parameters', function() {
    this.server.respondWith('PUT', '/test', function(xhr) {
      var values = JSON.parse(xhr.requestBody)
      values.should.have.keys('username', 'password')
      values.username.should.be.equal('joe')
      values.password.should.be.equal('123456')
      var ans = { passwordok: values.password == '123456' }
      xhr.respond(200, {}, JSON.stringify(ans))
    })

    var html = make('<form hx-put="/test" hx-ext="json-enc" > ' +
            '<input type="text"  name="username" value="joe"> ' +
            '<input type="password"  name="password" value="123456"> ' +
        '<button  id="btnSubmit">Submit</button> ')

    byId('btnSubmit').click()
    this.server.respond()
    this.server.lastRequest.response.should.equal('{"passwordok":true}')
  })

  it('handles patch with form parameters', function() {
    this.server.respondWith('PATCH', '/test', function(xhr) {
      var values = JSON.parse(xhr.requestBody)
      values.should.have.keys('username', 'password')
      values.username.should.be.equal('joe')
      values.password.should.be.equal('123456')
      var ans = { passwordok: values.password == '123456' }
      xhr.respond(200, {}, JSON.stringify(ans))
    })

    var html = make('<form hx-patch="/test" hx-ext="json-enc" > ' +
            '<input type="text"  name="username" value="joe"> ' +
            '<input type="password"  name="password" value="123456"> ' +
        '<button  id="btnSubmit">Submit</button> ')

    byId('btnSubmit').click()
    this.server.respond()
    this.server.lastRequest.response.should.equal('{"passwordok":true}')
  })

  it('handles delete with form parameters', function() {
    const defaults = htmx.config.methodsThatUseUrlParams
    htmx.config.methodsThatUseUrlParams = ['get']
    this.server.respondWith('DELETE', '/test', function(xhr) {
      var values = JSON.parse(xhr.requestBody)
      values.should.have.keys('username', 'password')
      values.username.should.be.equal('joe')
      values.password.should.be.equal('123456')
      var ans = { passwordok: values.password == '123456' }
      xhr.respond(200, {}, JSON.stringify(ans))
    })

    var html = make('<form hx-delete="/test" hx-ext="json-enc" > ' +
            '<input type="text"  name="username" value="joe"> ' +
            '<input type="password"  name="password" value="123456"> ' +
        '<button  id="btnSubmit">Submit</button> ')

    byId('btnSubmit').click()
    this.server.respond()
    this.server.lastRequest.response.should.equal('{"passwordok":true}')
    htmx.config.methodsThatUseUrlParams = defaults
  })

  it('handles hx-vals properly', function() {
    var values = {}
    this.server.respondWith('POST', '/test', function(xhr) {
      values = JSON.parse(xhr.requestBody)
      xhr.respond(200, {}, 'clicked')
    })

    make(`<form hx-ext="json-enc" hx-post="/test" hx-vals="js:{'obj': {'x': 123}, 'number': 5000, 'numberString': '5000'}">
             <button id="btn" type="submit">Submit</button>
          </form>`)
    var btn = byId('btn')
    btn.click()
    this.server.respond()

    values.number.should.equal(5000)
    values.numberString.should.equal('5000')
    chai.assert.deepEqual(values.obj, {'x': 123})
  })

  it('handles multiple values per key', function() {
    this.server.respondWith('POST', '/test', function(xhr) {
      var values = JSON.parse(xhr.requestBody)
      values.should.have.keys('foo', 'bar')
      values.foo.should.be.instanceOf(Array)
      values.foo.length.should.equal(3)
      values.foo[0].should.equal('A')
      values.foo[1].should.equal('B')
      values.foo[2].should.equal('C')
      values.bar.should.equal('D')
      xhr.respond(200, {}, 'OK')
    })

    var form = make('<form hx-post="/test" hx-ext="json-enc" > ' +
      '<input type="text" name="foo" value="A">' +
      '<input type="text" name="foo" value="B">' +
      '<input type="text" name="foo" value="C">' +
      '<input type="text" name="bar" value="D">' +
      '<button id="btnSubmit">Submit</button>' +
      '</form>')

    byId('btnSubmit').click()
    this.server.respond()
    form.innerHTML.should.equal('OK')
  })

  it('handles multiple select', function() {
    this.server.respondWith('POST', '/test', function(xhr) {
      var values = JSON.parse(xhr.requestBody)
      values.should.have.keys('foo', 'bar')
      values.foo.should.be.instanceOf(Array)
      values.foo.length.should.equal(2)
      values.foo[0].should.equal('A')
      values.foo[1].should.equal('C')
      values.bar.should.equal('D')
      xhr.respond(200, {}, 'OK')
    })

    var form = make('<form hx-post="/test" hx-ext="json-enc" > ' +
      '<select multiple="multiple" name="foo">' +
      '<option value="A" selected="selected">A</option>\n' +
      '<option value="B">B</option>\n' +
      '<option value="C" selected="selected">C</option>' +
      '</select>' +
      '<input type="text" name="bar" value="D">' +
      '<button id="btnSubmit">Submit</button>' +
      '</form>')

    byId('btnSubmit').click()
    this.server.respond()
    form.innerHTML.should.equal('OK')
  })

  it('handles deeply nested JSON structures properly', function() {
    this.server.respondWith('POST', '/test', function(xhr) {
      var values = JSON.parse(xhr.requestBody)
      values.should.have.key('user')
      values.user.should.have.keys('firstName', 'lastName', 'address')
      values.user.firstName.should.equal('John')
      values.user.lastName.should.equal('Doe')
      values.user.address.should.have.keys('street', 'city', 'postcode')
      values.user.address.street.should.equal('123 Main St')
      values.user.address.city.should.equal('Anytown')
      values.user.address.postcode.should.have.keys('format', 'pin')
      values.user.address.postcode.format.should.equal('AA-9999')
      values.user.address.postcode.pin.should.equal('12345')
      xhr.respond(200, {}, 'OK')
    })
  
    var form = make(`
      <form hx-post="/test" hx-ext="json-enc">
        <input type="text" name="user.firstName" value="John">
        <input type="text" name="user.lastName" value="Doe">
        <input type="text" name="user.address.street" value="123 Main St">
        <input type="text" name="user.address.city" value="Anytown">
        <input type="text" name="user.address.postcode.format" value="AA-9999">
        <input type="text" name="user.address.postcode.pin" value="12345">
        <button id="btnSubmit">Submit</button>
      </form>
    `)
  
    byId('btnSubmit').click()
    this.server.respond()
    form.innerHTML.should.equal('OK')
  })

  it('handles conflicts in nested structures with precedence to direct assignments', function() {
    this.server.respondWith('POST', '/test', function(xhr) {
      var values = JSON.parse(xhr.requestBody)
      values.should.have.key('user')
      values.user.should.have.keys('name', 'address')
      values.user.name.should.equal('John Doe')
      values.user.address.should.equal('123 Main St')  // Direct assignment takes precedence
      values.user.should.not.have.nested.property('address.street')  // Nested property should not exist
      values.user.should.not.have.nested.property('address.city')    // Nested property should not exist
      xhr.respond(200, {}, 'OK')
    })
  
    var form = make(`
      <form hx-post="/test" hx-ext="json-enc">
        <input type="text" name="user.name" value="John Doe">
        <input type="text" name="user.address" value="123 Main St">
        <input type="text" name="user.address.street" value="Elm Street">
        <input type="text" name="user.address.city" value="Springfield">
        <button id="btnSubmit">Submit</button>
      </form>
    `)
  
    byId('btnSubmit').click()
    this.server.respond()
    form.innerHTML.should.equal('OK')
  })
})
