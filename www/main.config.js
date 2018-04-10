window.AppPlayer = { Version: '1.20.21' };
System.config({
  baseURL: "./",
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },
  bundles: {
    "devextreme/js/dx.common.js": [
      "devextreme/js/dx.all.js"
    ]
  },
  production: true,
  buildConfig: {
    "paths": {
      "github:*": "jspm_packages/github/*",
      "npm:*": "jspm_packages/npm/*",
      "designerLayout/*": "../FrontEnd/designerLayout/*",
      "appPlayer/*": "../FrontEnd/appPlayer/distr/*",
      "modules/*": "../FrontEnd/modules/*",
      "appPlayerLib/*": "../lib/*"
    }
  },
  productionConfig: {
    "paths": {
      "appPlayerLib/*": "lib/*",
      "modules/*": "modules/*",
      "main-bundles/*": "bundles@1.20.21/*"
    },
    "bundles": {
      "main-bundles/appPlayer.js!loadIndicator": [
        "appPlayer/appPlayer.js"
      ],
      "main-bundles/libLoader.js!loadIndicator": [
        "appPlayer/libLoader.js"
      ],
      "main-bundles/devextremeLoader.js!loadIndicator": [
        "appPlayer/devextremeLoader.js"
      ],
      "main-bundles/layout.js!loadIndicator": [
        "designer-index.js",
        "designerLayout/designerLayout.js"
      ]
    }
  },
  devConfig: {
    "paths": {
      "github:*": "http://localhost:1337/jspm_packages/github/*",
      "npm:*": "http://localhost:1337/jspm_packages/npm/*",
      "designerLayout/*": "http://localhost:1337/frontEnd/designerLayout/*",
      "appPlayer/*": "http://localhost:1337/frontEnd/appPlayer/distr/*",
      "modules/*": "http://localhost:1337/frontEnd/modules/*",
      "appPlayerLib/*": "http://localhost:1337/lib/*"
    }
  },

  meta: {
    "index.js": {
      "deps": [
        "appPlayer/libLoader"
      ]
    },
    "designer-index.js": {
      "deps": [
        "appPlayer/appPlayer"
      ]
    },
    "designerLayout/designerLayout": {
      "deps": [
        "designerLayout/designerLayout.less!less",
        "designerLayout/designerLayout.html!text"
      ],
      "globals": {
        "jQuery": "jquery",
        "htmlTemplate": "designerLayout/designerLayout.html!text"
      }
    },
    "bootstrap/bootstrap": {
      "deps": [
        "jquery"
      ],
      "globals": {
        "jQuery": "jquery"
      }
    },
    "knockout/dist/knockout.debug.js": {
      "format": "global"
    },
    "dust/dust-full": {
      "format": "global"
    },
    "dust/dust-helpers": {
      "deps": [
        "dust/dust-full"
      ],
      "globals": {
        "dust": "dust/dust-full"
      }
    },
    "globalize/dist/globalize": {
      "format": "global",
      "globals": {
        "Cldr": "cldrjs"
      }
    },
    "appPlayer/libLoader": {
      "deps": [
        "knockout",
        "jquery",
        "dust/dust-full",
        "globalize",
        "bootstrap/bootstrap",
        "bootstrap/css/bootstrap.css!",
        "dust/dust-helpers"
      ]
    },
    "appPlayer/appPlayer": {
      "format": "global",
      "deps": [
        "appPlayer/libLoader",
        "appPlayer/devextremeLoader",
        "appPlayer/content/app-player.css!",
        "appPlayer/templates/viewcomponents.html!template"
      ]
    },
    "devextreme/layouts/*": {
      "format": "global",
      "globals": {
        "jQuery": "jquery"
      }
    }
  },

  map: {
    "babel": "npm:babel-core@5.8.38",
    "babel-runtime": "npm:babel-runtime@5.8.38",
    "bootstrap": "appPlayerLib/Scripts",
    "bootstrap/css": "appPlayerLib/Content",
    "core-js": "npm:core-js@1.2.7",
    "css": "github:systemjs/plugin-css@0.1.26",
    "devextreme": "appPlayerLib/devextreme",
    "devextreme/css": "appPlayerLib/devextreme/css",
    "devextreme/layouts": "appPlayerLib/devextreme/layouts",
    "dust": "appPlayerLib/dust",
    "filesaver": "github:eligrey/FileSaver.js@1.3.3",
    "globalize": "npm:globalize@1.3.0",
    "globalize/currency": "@empty",
    "globalize/date": "@empty",
    "globalize/message": "@empty",
    "globalize/number": "@empty",
    "jquery": "npm:jquery@2.1.1",
    "json": "github:systemjs/plugin-json@0.1.2",
    "jszip": "github:stuk/jszip@3.1.4",
    "knockout": "github:knockout/knockout@3.4.0",
    "less": "npm:systemjs-less-plugin@1.9.1",
    "less-browser": "github:less/less.js@2.7.2",
    "less.browser": "github:less/less.js@2.7.2",
    "template": "appPlayer/template.js",
    "text": "appPlayer/text.js",
    "traverse": "npm:traverse@0.6.6",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.4.1"
    },
    "github:jspm/nodelibs-buffer@0.1.1": {
      "buffer": "npm:buffer@5.0.8"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.10"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:jspm/nodelibs-vm@0.1.0": {
      "vm-browserify": "npm:vm-browserify@0.0.4"
    },
    "npm:assert@1.4.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "npm:util@0.10.3"
    },
    "npm:babel-runtime@5.8.38": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:buffer@5.0.8": {
      "base64-js": "npm:base64-js@1.2.1",
      "ieee754": "npm:ieee754@1.1.8"
    },
    "npm:core-js@1.2.7": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:globalize@1.3.0": {
      "cldrjs": "npm:cldrjs@0.4.8",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:jquery@2.1.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.10": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:vm-browserify@0.0.4": {
      "indexof": "npm:indexof@0.0.1"
    }
  }
});
