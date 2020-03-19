const assert = require('assert');

function eval() {
  // Do not use eval!!!
  return;
}
function tokenize(expr) {
  let results = [];
  const tokenRegExp = /\s*([A-Za-z]+|[0-9]+|\S)\s*/g;

  let m;
  while ((m = tokenRegExp.exec(expr)) !== null) results.push(m[1]);
  return results;
}

function isNumber(token) {
  return token !== undefined && token.match(/^[0-9]+$/) !== null;
}
function isName(token) {
  return token !== undefined && token.match(/^[A-Za-z]+$/) !== null;
}
function parse(expr) {
  const tokens = tokenize(expr);
  let position = 0;
  function peek() {
    return tokens[position];
  }
  function consume(token) {
    assert.strictEqual(token, tokens[position]);
    position++;
  }
  function parsePrimaryExpr() {
    var t = peek();

    if (isNumber(t)) {
      consume(t);
      return { type: 'number', value: t };
    } else if (isName(t)) {
      consume(t);
      return { type: 'name', id: t };
    } else if (t === '(') {
      consume(t);
      var expr = parseExpr();
      if (peek() !== ')') throw new SyntaxError('expected )');
      consume(')');
      return expr;
    } else {
      throw new SyntaxError('expected a number, a variable, or parentheses');
    }
  }
  function parseMulExpr() {
    var expr = parsePrimaryExpr();
    var t = peek();
    while (t === '*' || t === '/') {
      consume(t);
      var rhs = parsePrimaryExpr();
      expr = { type: t, left: expr, right: rhs };
      t = peek();
    }
    return expr;
  }
  function parseExpr() {
    var expr = parseMulExpr();
    var t = peek();
    while (t === '+' || t === '-') {
      consume(t);
      var rhs = parseMulExpr();
      expr = { type: t, left: expr, right: rhs };
      t = peek();
    }
    return expr;
  }
  var result = parseExpr();
  if (position !== tokens.length)
    throw new SyntaxError("unexpected '" + peek() + "'");

  return result;
}
function expressionCalculator(code) {
    var variables = Object.create(null);
    variables.e = Math.E;
    variables.pi = Math.PI;

    function evaluate(obj) {
        switch (obj.type) {
        case "number":  return parseInt(obj.value);
        case "name":  return variables[obj.id] || 0;
        case "+":  return evaluate(obj.left) + evaluate(obj.right);
        case "-":  return evaluate(obj.left) - evaluate(obj.right);
        case "*":  return evaluate(obj.left) * evaluate(obj.right);
        case "/":  return evaluate(obj.left) / evaluate(obj.right);
        }
    }
    return evaluate(parse(code));
}


module.exports = {
    expressionCalculator
}
// console.log(evaluateAsFloat('(2 + 2)*2'));
