var postcss = require('postcss');
 
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
 
});