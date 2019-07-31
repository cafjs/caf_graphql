'use strict';

/**
 * Evaluates a GraphQL query with a resolver custom to this CA.
 *
 *
 * @module caf_graphql/plug_ca_graphql
 * @augments external:caf_components/gen_plug_ca
 */
// @ts-ignore: augments not attached to a class
const caf_comp = require('caf_components');
const myUtils = caf_comp.myUtils;
const genPlugCA = caf_comp.gen_plug_ca;

const gql = require('graphql');
const gqlTools = require('graphql-tools');

exports.newInstance = async function($, spec) {
    try {
        let executableSchema = null;
        let resolverMethod = null;
        let query = null;
        let lastResult = null;
        let resolverMethodBackup = null;
        let queryBackup = null;

        const that = genPlugCA.constructor($, spec);

        // transactional ops
        const target = {
        };

        that.__ca_setLogActionsTarget__(target);

        that.setResolverMethod = function(methodName) {
            resolverMethod = methodName;
            executableSchema = null;
        };

        that.setQuery = function(q) {
            query = q;
        };

        that.dirtyReset = function() {
            lastResult = null;
        };

        that.dirtyEvalQuery = function(self) {
            const makeSchema = async () => {
                let typeDefs = $._.$.graphql.getTypeDefs();
                let resolvers = {};
                if (resolverMethod) {
                    let err;
                    [err, resolvers] = await self[resolverMethod].apply(self,
                                                                        []);
                    if (err) {
                        throw err;
                    }
                }
                return gqlTools.makeExecutableSchema({
                    typeDefs,
                    resolvers
                });

            };
            return new Promise(async (resolve, reject) => {
                try {
                    if (!query) {
                        resolve(); // undefined, `null` reserved for "no change"
                    } else {
                        executableSchema = executableSchema ||
                            await makeSchema();
                        let ctx = {self: self};
                        let res = await gql.graphql(executableSchema, query,
                                                    self.state, ctx);
                        if (res.errors) {
                            reject(res.errors[0]);
                        } else {
                            if (lastResult && myUtils.deepEqual(res.data,
                                                                lastResult)) {
                                resolve(null);
                            } else {
                                lastResult = res.data;
                                resolve(res.data);
                            }
                        }
                    }
                } catch (err) {
                    reject(err);
                }
            });
        };

        const super__ca_begin__ =
                myUtils.superiorPromisify(that, '__ca_begin__');
        that.__ca_begin__ = async function(msg) {
            try {
                resolverMethodBackup = resolverMethod;
                queryBackup = query;
                await super__ca_begin__(msg);
                return [];
            } catch (err) {
                return [err];
            }
        };

        const super__ca_abort__ =
                myUtils.superiorPromisify(that, '__ca_abort__');
        that.__ca_abort__ = async function() {
            try {
                resolverMethod = resolverMethodBackup;
                query = queryBackup;
                await super__ca_abort__();
                return [];
            } catch (err) {
                return [err];
            }
        };

        const super__ca_resume__ =
                myUtils.superiorPromisify(that, '__ca_resume__');
        that.__ca_resume__ = async function(cp) {
            cp = cp || {};
            try {
                resolverMethod = cp.resolverMethod;
                query = cp.query;
                await super__ca_resume__(cp);
                return [];
            } catch (err) {
                return [err];
            }
        };

        const super__ca_prepare__ =
                myUtils.superiorPromisify(that, '__ca_prepare__');
        that.__ca_prepare__ = async function() {
            try {
                let data = await super__ca_prepare__();
                data.resolverMethod = resolverMethod;
                data.query = query;
                return [null, data];
            } catch (err) {
                return [err];
            }
        };

        return [null, that];
    } catch (err) {
        return [err];
    }
};
