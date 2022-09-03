const aliases = (prefix = `src`) => ({
  '@fuse': `${prefix}/@fuse`,
  '@history': `${prefix}/@history`,
  '@lodash': `${prefix}/@lodash`,
  '@mock-api': `${prefix}/@mock-api`,
  'app/redux': `${prefix}/app/redux`,
  'app/logica': `${prefix}/app/logica`,
  'app/auth': `${prefix}/app/auth`,
  'app/shared-components': `${prefix}/app/shared-components`,
  'app/configs': `${prefix}/app/configs`,
  'app/theme-layouts': `${prefix}/app/theme-layouts`,
  'app/AppContext': `${prefix}/app/AppContext`,
  'constantes': `${prefix}/constantes`,
});

module.exports = aliases;
