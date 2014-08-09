var traverse = require('traverse');

var isSchema = require('schema-is-schema');

module.exports = function schemaDeRef(schemas, schema) {
  // if not schema, then not relation
  if (isSchema(schema) !== true) return null;

  return traverse.map(schema, function (scope) {
    if (scope.$ref) {
      this.update(schemas[scope.$ref]);
    }
  });
};
