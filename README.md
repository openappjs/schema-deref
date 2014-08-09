# schema-deref

returns json-schema with any $ref's de-referenced

## install

with [npm](http://npmjs.org), do:

```
npm i --save schema-deref
```

## example

```
var schemaDeRef = require('schema-deref');

var resourceSchema = {
  id: "http://example.org/Resource#",
  properties: {
    name: {
      type: "string",
    },
  },
};

var personSchema = {
  id: "http://example.org/Person#",
  properties: {
    name: {
      type: "string",
    },
    resources: {
      type: 'array',
      items: {
        $ref: "http://example.org/Resource#",
      },
    },
  },
};

var schemas = {};
schemas[resourceSchema.id] = resourceSchema;
schemas[personSchema.id] = personSchema;

var derefd = schemaDeRef(schemas, personSchema);

console.log(JSON.stringify(derefd, null, 2));
```

## license

AGPLv3
