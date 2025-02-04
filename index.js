const dirTree = require('directory-tree');
const fs = require('fs');

console.log('running dhpagani version');

const scriptTypes = ['preinstall', 'postinstall', 'preuninstall', 'postuninstall','install'];
const reports = [];

const walkModules = ((path = 'node_modules') => {

  dirTree(path, {extensions:/\.json$/}, (item) => {

    if (item.name === 'package.json') {
      let pkg = JSON.parse(fs.readFileSync(item.path, 'utf8'));
      if (!pkg.scripts) return;
      let scripts =pkg.scripts;
      scripts.forEach((script,v) => {
        if (scriptTypes.includes(script)) {
          console.log(script,v)
          reports.push({name: pkg.name, script: script})
        }
      });

    }

  });

});

process.on('exit', () => {
  if (!reports.length) {
    console.log('No potentially unsafe scripts found.');
  } else {
    console.log('\x1b[31m', 'Potentially unsafe scripts found. These should be reviewed for safety', '\x1b[0m');
    reports.forEach((report) => {
      console.log(`Module name: ${report.name} Type: ${report.script}`);
    });
  }

});

module.exports = { walkModules };
