const fs = require('fs');

function omit(obj, properties = []) {
  return Object.keys(obj).reduce((stack, key) => {
    if (properties.indexOf(key) === -1) {
      return { ...stack, [key]: obj[key] };
    }

    return stack;
  }, {});
}

// Bump version number based on current package.json's version
const parentPackageJsonString = fs.readFileSync(
  `${process.cwd()}/package.json`,
  'utf8'
);
const parentPackageJson = JSON.parse(parentPackageJsonString);
const buildPackageJson = {
  ...omit(parentPackageJson, ['private', 'scripts', 'devDependencies']),
  main: 'index.js',
};

fs.writeFileSync(
  `${process.cwd()}/dist/package.json`,
  JSON.stringify(buildPackageJson, null, 2),
  'utf8'
);

const readme = fs.readFileSync(`${process.cwd()}/README.md`, 'utf8');
fs.writeFileSync(`${process.cwd()}/dist/README.md`, readme);
