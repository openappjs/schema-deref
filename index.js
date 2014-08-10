var Set = require('es6-set');
var traverse = require('traverse');

var isSchema = require('schema-is-schema');

module.exports = function schemaDeRef(schemas, schema) {
  // ensure schema
  isSchema(schema, { throw: true });

  var reached = new Set();
  if (schema.id) {
    reached.add(schema.id);
  }

  return traverse.map(schema, function (scope) {
    if (scope.$ref && !reached.has(scope.$ref)) {
      reached.add(scope.$ref);
      this.update(schemas[scope.$ref]);
    }
  });
};
