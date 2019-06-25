var postcss = require('postcss');
var objectPath = require('object-path');

module.exports = postcss.plugin('postcss-compose', function (data, debug) {
    return function (css) {
        data = data || {}
        if (debug) console.log("Debug is true");

        function processAtCompose(atRule) {
            atRule.walkAtRules('compose', (rule) => processAtCompose(rule))

            var myRegexp = /(\w+) in (\w+)/g
            var parameterMatches = myRegexp.exec(atRule.params)

            var context = {
                parameterName: parameterMatches[1],
                inObject: parameterMatches[2],
            }

            if (objectPath.get(data, context.inObject) == undefined) {
                throw atRule.error('configured data does not contain this data', { word: context.inObject })
            }

            var parameters = objectPath.get(data, context.inObject)
            Object.keys(parameters).forEach(key => {
                context.name = key;
                var value = {}
                objectPath.set(value, context.parameterName, parameters[key])
                context.value = value

                var newAtRule = atRule.cloneBefore();

                processRules(context, newAtRule);

                newAtRule.replaceWith(newAtRule.nodes);
            })
            atRule.remove();
        }

        function strReplace(str, context, rule) {
            var re = new RegExp("\\$\\((" + context.parameterName + "(\\..*)*)\\)", "g");
            var output = str.replace(re, (match, p1) =>
            {
                // p1 contains inner match which is style.foo.bar
                if (p1 == context.parameterName) return context.name
                var output = objectPath.get(context.value, p1)
                if (output == undefined) throw rule.error(`Property not found from ${context.inObject}`, {word: match})
                return output;
            })
            return output;
        }

        function processRules(context, parent) {
            parent.walkRules(rule => {
                rule.selector = strReplace(rule.selector, context, rule);
                rule.walkDecls(decl => {
                    decl.value = strReplace(decl.value, context, decl)
                })
                rule.walkAtRules(/^(?!compose).*$/, atRule => {
                    atRule.params = strReplace(atRule.params, context, atRule)
                })
            })
            parent.replaceWith(parent.nodes);
        }

        css.walkAtRules('compose', atRule => processAtCompose(atRule))
    }
})