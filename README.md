# Caf.js

Co-design permanent, active, stateful, reliable cloud proxies with your web app and gadgets.

See https://www.cafjs.com

## Library for Continuous Queries with GraphQL

[![Build Status](https://travis-ci.org/cafjs/caf_graphql.svg?branch=master)](https://travis-ci.org/cafjs/caf_graphql)

This repository contains a `Caf.js` library that implements continuous queries with GraphQL.

## Dependencies Warning

To eliminate expensive dependencies for apps in the workspace that do not need `caf_graphql`, the packages `graphql@^14.4.2`, `graphql-import@^0.7.1`, and `graphql-tools^4.0.5` have been declared as optional dependencies even though they are always needed.

Applications that depend on `caf_graphql` should also include these dependencies in package.json as normal dependencies.


## API

See {@link module:caf_graphql/proxy_graphql}

## Configuration

### framework.json

See {@link module:caf_graphql/plug_graphql}

### ca.json

See {@link module:caf_graphql/plug_ca_graphql}
