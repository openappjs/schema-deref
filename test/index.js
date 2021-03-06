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
  anyOf: [{
    $ref: "http://example.org/Resource#",
  }, {
    $ref: "http://example.org/Document#",
  }]
}
var awesomeSchema = {
  id: "http://example.org/Awesome#",
  allOf: [{
    $ref: "http://example.org/Awesome#",
  }, {
    type: "object",
  }]
}
var superSchema = {
  id: "http://example.org/Super#",
  allOf: [{
    $ref: "http://example.org/Duper#",
  }, {
    type: "object",
  }]
}
var duperSchema = {
  id: "http://example.org/Duper#",
  allOf: [{
    $ref: "http://example.org/Super#",
  }, {
    type: "object",
  }]
}

var schemas = {};
schemas[personSchema.id] = personSchema;
schemas[groupSchema.id] = groupSchema;
schemas[resourceSchema.id] = resourceSchema;
schemas[documentSchema.id] = documentSchema;
schemas[agentSchema.id] = agentSchema;
schemas[thingSchema.id] = thingSchema;
schemas[awesomeSchema.id] = awesomeSchema;
schemas[superSchema.id] = superSchema;
schemas[duperSchema.id] = duperSchema;

test("require module", function (t) {
  schemaDeRef = require('../');
  t.ok(schemaDeRef);
  t.end();
});

test("non schemas throw", function (t) {
  [true, false, null, undefined, [1,2,3], "123", 123]
  .forEach(function (value) {
    t.throws(
      function () { schemaDeRef(schemas, value) },
      new Error("schema-is-schema: invalid schema"),
      value + " is not schema and throws error"
    );
  });
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
  t.deepEqual(schemaDeRef(schemas, {
    $ref: "http://example.org/Agent#",
  }), {
    id: agentSchema.id,
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
  t.deepEqual(schemaDeRef(schemas, {
    type: "array",
    items: {
      $ref: "http://example.org/Thing#",
    },
  }), {
    type: "array",
    items: {
      id: thingSchema.id,
      anyOf: [resourceSchema, documentSchema],
    },
  }, "array of anyOf resource or document schema is correctly recursively deref'd");
  t.end();
});

test("cyclic schemas", function (t) {
  t.deepEqual(
    schemaDeRef(schemas, awesomeSchema),
    awesomeSchema,
    "simple cyclic schema is correctly deref'd"
  );
  t.deepEqual(
    schemaDeRef(schemas, superSchema),
    {
      id: "http://example.org/Super#",
      allOf: [{
        id: "http://example.org/Duper#",
        allOf: [{
          $ref: "http://example.org/Super#",
        }, {
          type: "object",
        }]
      }, {
        type: "object",
      }]
    },
    "medium cyclic schema is correctly deref'd"
  );
  t.end();
})
