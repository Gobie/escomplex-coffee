# Software complexity analysis for CoffeeScript projects.
# CoffeeScript-specific wrapper around escomplex.

'use strict'

coffee = require 'coffee-script'
escomplex = require 'escomplex'
async = require 'async'
walker = require './walker'

# Public function `analyse`.
#
# Returns an object detailing the complexity of CoffeeScript source code.
#
# @param source {object|array}  The source code to analyse for complexity.
# @param [options] {object}     Options to modify the complexity calculation.
# @param next {function}        Callback to call with error or report.
analyse = (source, options, next) ->
  options ||= {}

  if Array.isArray source
    return async.reduce source, [], (memo, s, next) ->
      getAst s.code, options.ignoreErrors, (e, ast) ->
        return next e if e
        memo.push { ast: ast, path: s.path }
        next null, memo
    , (e, sources) ->
      return next e if e
      escomplex.analyse sources, walker, options, next

  getAst source, options.ignoreErrors, (e, ast) ->
    return next e if e
    escomplex.analyse ast, walker, options, next

exports.analyse = analyse

getAst = async.ensureAsync (source, ignoreErrors, next) ->
  return next() if source.length == 0
  ast = null
  try
    ast = coffee.nodes(source)
  catch e
    return next() if ignoreErrors
    return next e

  lastExp = ast.expressions[ast.expressions.length - 1]
  ast.loc = {
    start: {
      line: ast.locationData.first_line
    },
    end: {
      line: (lastExp ? ast).locationData.last_line
    }
  }
  next null, ast
