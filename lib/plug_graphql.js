'use strict';
/**
 * Loads a GraphQL schema for the application.
 *
 *  Properties:
 *
 *       {schemaDir: string=, schemaFileName: string}
 *
 * where:
 *
 * * `schemaDir:` directory to find the schema descriptions. Defaults to the
 * path where the app `ca_methods.js` has been defined, e.g., `<app_dir>/lib`.
 * * `schemaFileName`: the name of the file containing the schema.
 *
 * @module caf_graphql/plug_graphql
 * @augments external:caf_components/gen_plug
 */
// @ts-ignore: augments not attached to a class
const assert = require('assert');
const caf_comp = require('caf_components');
const genPlug = caf_comp.gen_plug;

const path = require('path');
const gqlImport = require('graphql-import');

exports.newInstance = async function($, spec) {
    try {
        const that = genPlug.create($, spec);

        $._.$.log && $._.$.log.debug('New GraphQL plug');

        const schemaDir = spec.env.schemaDir ||
                  $.loader.__ca_firstModulePath__();

        assert.equal(typeof spec.env.schemaFileName, 'string',
                     "'spec.env.schemaFileName' is not a string");

        const fileName = path.resolve(schemaDir, spec.env.schemaFileName);
        const typeDefs = gqlImport.importSchema(fileName);

        that.getTypeDefs = function() {
            return typeDefs;
        };

        return [null, that];
    } catch (err) {
        return [err];
    }
};
