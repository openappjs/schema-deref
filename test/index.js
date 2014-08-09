var test = require('tape');

var schemaDeRef;

var personSchema = {
  id: "http://example.org/Person#",
};
var groupSchema = {
  id: "http://example.org/Group#",
};
var resourceSchema = {
  id: "http://example.org/Resource#",
};
var documentSchema = {
  id: "http://example.org/Document#",
};
var agentSchema = {
  id: "http://example.org/Agent#",
  oneOf: [{
    $ref: "http://example.org/Person#",
  }, {
    $ref: "http://example.org/Group#",
  }]
};
var thingSchema = {
  id: "http://example.org/Thing#",
  allOf: [{
    $ref: "http://example.org/Resource#",
  }, {
    $ref: "http://example.org/Document#",
  }]
}

var schemas = {};
schemas[personSchema.id] = personSchema;
schemas[groupSchema.id] = groupSchema;
schemas[resourceSchema.id] = resourceSchema;
schemas[documentSchema.id] = documentSchema;
schemas[agentSchema.id] = agentSchema;
schemas[thingSchema.id] = thingSchema;

test("require module", function (t) {
  schemaDeRef = require('../');
  t.ok(schemaDeRef);
  t.end();
});

test("non schemas", function (t) {
  t.equal(schemaDeRef(schemas, true), null, "true is not schema");
  t.equal(schemaDeRef(schemas, false), null, "false is not schema");
  t.equal(schemaDeRef(schemas, null), null, "null is not schema");
  t.equal(schemaDeRef(schemas, undefined), null, "undefined is not schema");
  t.equal(schemaDeRef(schemas, [1,2,3]), null, "array is not schema");
  t.equal(schemaDeRef(schemas, "123"), null, "string is not schema");
  t.equal(schemaDeRef(schemas, 123), null, "number is not schema");
  t.end();
});

test("empty schema", function (t) {
  t.deepEqual(schemaDeRef(schemas, {}), {}, "empty schema is correctly deref'd");
  t.end();
});

test("simple schemas", function (t) {
  t.deepEqual(schemaDeRef(schemas, {
    $ref: "http://example.org/Person#",
  }), personSchema, "person schema is correctly deref'd");
  t.end();
});

test("array items schemas", function (t) {
  t.deepEqual(schemaDeRef(schemas, {
    type: "array",
    items: {
      $ref: "http://example.org/Person#",
    },
  }), {
    type: "array",
    items: personSchema,
  }, "array of person schema is correctly deref'd");
  t.end();
});

test("allOf/anyOf/oneOf schemas", function (t) {
  t.deepEqual(schemaDeRef(schemas, {
    oneOf: [{
      $ref: "http://example.org/Person#",
    }, {
      $ref: "http://example.org/Group#",
    }],
  }), {
    oneOf: [personSchema, groupSchema],
  }, "oneOf person or group schema is correctly deref'd");
  t.end();
});

test("array items allOf/anyOf/oneOf schemas", function (t) {
  t.deepEqual(schemaDeRef(schemas, {
    type: "array",
    items: {
      anyOf: [{
        $ref: "http://example.org/Resource#",
      }, {
        $ref: "http://example.org/Document#",
      }],
    },
  }), {
    type: "array",
    items: {
      anyOf: [resourceSchema, documentSchema],
    },
  }, "array of anyOf resource or document schema is correctly deref'd");
  t.end();
});
