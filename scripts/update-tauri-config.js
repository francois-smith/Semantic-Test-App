const fs = require("fs");
const path = require("path");

const version = process.argv[2];
const configPath = path.join(__dirname, "../src-tauri/tauri.conf.json");

const config = JSON.parse(fs.readFileSync(configPath));

config.package.version = version;
config.package.productName = `MyApp ${version}`;
config.tauri.windows[0].title = `MyApp ${version}`;

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log(`Updated tauri.conf.json with version ${version}`);
