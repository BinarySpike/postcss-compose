var postcss = require('postcss');
var objectPath = require('object-path');

module.exports = postcss.plugin('postcss-compose', function (data, debug) {
    return function (css) {
        data = data || {}
        if (debug) console.log("Debug is true");

        function getData(parameter) {
            var myRegexp = /(\w+) in (\w+)/g
            var match = myRegexp.exec(parameter)
            console.log(match[0]) // abc
            console.log(match[1])
            console.log(match[2])
        }

        function processAtCompose(atRule) {
            atRule.walkAtRules('compose', (rule) => processAtCompose(rule))

            var myRegexp = /(\w+) in (\w+)/g
            var parameterMatches = myRegexp.exec(parameter)

            var context = {
                
            }

            getData(atRule.params)

            atRule.walkRules((rule) => processRule(atRule, rule))
            atRule.replaceWith(atRule.nodes)
        }

        function processRule(contextAtRule, rule) {
            var rules = []
            var parameters = contextAtRule.params.split(",").map(item => item.trim());
            parameters.forEach(parameter => {
                var newRule = rule.clone({ selector: rule.selector.replace('$(1)', parameter) })
                newRule.walkDecls(decl => processDecl(parameter, decl));
                newRule.walkAtRules(/^(?!compose).*$/, atRule => processOtherAtRule(parameter, atRule))
                rules.push(newRule)
            })
            rule.replaceWith(rules);
        }

        function processDecl(parameter, decl) {
            decl.value = decl.value.replace('$(1)', parameter);
        }

        function processOtherAtRule(parameter, atRule) {
            atRule.params = atRule.params.replace('$(1)', parameter)
        }

        css.walkAtRules('compose', atRule => processAtCompose(atRule))


    }
})
/*
module.exports = postcss.plugin('postcss-compose', function compose(options) {

    return function (css) {

        options = options || {};

        css.walkAtRules('compose', function (atrule) {
            var templates = atrule.params.split(",").map(item => item.trim());
            atrule.walkRules(function (rule) {
                if (rule.selector.includes('$(1)')) {
                    templates.forEach(function(template) {
                        var newRule = rule.clone({ selector: rule.selector.replace('$(1)', template) })
                        newRule.walkDecls(function (decl) {
                            decl.value = decl.value.replace('$(1)', template.replace('-','.'))
                        })
                        newRule.walkAtRules(function (atRule) {
                            atRule.params = atRule.params.replace('$(1)', template)
                        })
                        atrule.append(newRule);
                    })
                    rule.remove();
                }
            })
            atrule.walkRules(rule => css.append(rule));
            atrule.remove();
        })
    }

});*/