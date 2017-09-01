const tap = require('tap');
const moment = require('moment');
const parse = require('../lib/parse');
const decorate = require('../lib/decorate');
const importContents = require('../lib/importContents');

let fixtures = {
	_: 'test/fixtures',
	json: 'test/fixtures/foo.json',
	md: 'test/fixtures/baz.md',
	draftUnderscore: 'test/fixtures/_draft.json',
	draftDot: 'test/fixtures/.dsraft.md'
};

tap.test('should parse JSON file', function (t) {
	var foo = parse(fixtures.json);
	t.equal(foo.title, 'Foo', 'File content');
	t.end();
});

tap.test('should parse markdown file', function (t) {
	var baz = parse(fixtures.md);
	t.equal(baz.title, 'Baz', 'File content');
	t.equal(baz.main, '<p>This is an example paragraph.</p>\n', 'File content markdown');
	t.end();
});

tap.test('should ignore draft files', function (t) {
	var draftUnderscore = parse(fixtures.draftUnderscore);
	t.notOk(draftUnderscore, 'File with leading _ should be ignored');
	var draftDot = parse(fixtures.draftDot);
	t.notOk(draftDot, 'File with leading . should be ignored');
	t.end();
});

tap.test('should decorate file with properties', function (t) {
	var file = decorate(parse(fixtures.json), fixtures.json);
	t.equal(file.fileext, '.json', 'File extension');
	t.equal(file.filename, 'foo', 'File name');
	t.ok(moment.isMoment(file.date), 'File date is a moment object');
	t.equal(file.filepath, 'test/fixtures/foo.json', 'File path');
	t.equal(file.url, '/test/fixtures', 'File url');
	t.end();
});

tap.test('should import contents for test fixtures', function (t) {
	importContents({
		contentsDir: fixtures._
	}).then(function (contentTree) {
		t.deepEqual(Object.keys(contentTree.nested.ordered),
			['1.chikorita', '2.totodile', '3.cyndaquil']);
		t.deepEqual(Object.keys(contentTree.nested.unordered),
			['chikorita', 'cyndaquil', 'totodile']
		);
		t.end();
	}, function (err) {
		console.error(err);
		t.notOk(err, 'no error when importing contents');
		t.end();
	});
});
