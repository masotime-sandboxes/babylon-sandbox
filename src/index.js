import Promise from 'bluebird';
import fs from 'fs';
import generate from 'babel-generator';

Promise.promisifyAll(fs);
const babylon = require('babylon'); // module-exports plugin doesn't seem to work on this?

async function main() {

	await ensureOutputDir();

	const code = await fs.readFileAsync('./src/test.jsx', 'utf8');
	const ast = babylon.parse(code, {
		sourceType: 'module',
		plugins: [ 'jsx' ]
	});

	await fs.writeFileAsync('./output/ast.json', JSON.stringify(ast, null, 4));

	const { code: recoded } = generate(ast, { }, code);
	await fs.writeFileAsync('./output/recoded.js', recoded);

}

// unimportant
async function ensureOutputDir() {
	try {
		await fs.statAsync('output');	
	} catch (err) {
		await fs.mkdirAsync('output');
	}
}

async function execute() {
	try {
		await main();
	} catch (err) {
		console.error(err.stack || err);
	}
}

execute();