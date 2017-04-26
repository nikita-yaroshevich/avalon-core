export default {
    entry: 'index.js',
    dest: 'bundles/avl-core.umd.tmp',
    format: 'umd',
    external: [
        '@angular/core',
        '@angular/common',
        '@angular/http',
        'lodash',
        'core-js/es6/reflect',
        'core-js/es7/reflect',
        'rxjs/Rx',
        'inflection'
    ],
    globals: {
        '@angular/core': 'ng.core',
        '@angular/common': 'ng.common',
        'rxjs': 'rxjs',
        'lodash': 'lodash',
        'core-js': 'core-js',
        'inflection': 'inflection'
    },
    moduleName: 'avl.core'
}
