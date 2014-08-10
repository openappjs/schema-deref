var traverse = require('traverse');

var isSchema = require('schema-is-schema');

module.exports = function schemaDeRef(schemas, schema) {
  // ensure schema
  isSchema(schema, { throw: true });

  return traverse.map(schema, function (scope) {
    if (scope.$ref) {
      this.update(schemas[scope.$ref]);
    }
  });
};
