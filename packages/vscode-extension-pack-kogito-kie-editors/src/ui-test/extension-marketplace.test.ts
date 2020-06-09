import { EditorView, WebView, ExtensionsViewItem, WebDriver, VSBrowser, By, until } from 'vscode-extension-tester';
import { Dialog, StatusBarExt, Marketplace } from 'vscode-uitests-tooling';
import * as path from 'path';
import { assert } from 'chai';
import * as pjson from '../../package.json';

describe('Kogito Tooling Extension Test Suite', () => {

	const RESOURCES: string = path.resolve('src', 'ui-test', 'resources');
	const DEMO_BPMN: string = 'demo.bpmn';

	describe('Extensions view', () => {

		let marketplace: Marketplace;
		let item: ExtensionsViewItem;

		before(async function () {
			this.timeout(10000);
			marketplace = await Marketplace.open();
		});

		after(async () => {
			await marketplace.close();
			await new EditorView().closeAllEditors();
		});

		it('Find extension', async function () {
			this.timeout(10000);
			item = await marketplace.findExtension(`@installed ${pjson.displayName}`) as ExtensionsViewItem;
		});

		it('Extension is installed', async function () {
			this.timeout(5000);
			const installed = await item.isInstalled();
			assert.isTrue(installed);
		});

		it('Verify display name', async function () {
			this.timeout(5000);
			const title = await item.getTitle();
			assert.equal(title, `${pjson.displayName}`);
		});

		it('Verify description', async function () {
			this.timeout(5000);
			const desc = await item.getDescription();
			assert.equal(desc, `${pjson.description}`);
		});

		it('Verify version', async function () {
			this.timeout(5000);
			const version = await item.getVersion();
			assert.equal(version, `${pjson.version}`);
		});
	});

	describe("Editor loading", () => {

		before(async function () {
			this.timeout(20000)
			await Dialog.openFile(path.join(RESOURCES, DEMO_BPMN));
		});

		it('Open demo.bpmn file in EditorView', async function () {
			this.timeout(45000);
			const editor = await new EditorView().openEditor(DEMO_BPMN);
			const editorName = editor.getTitle();
			assert.equal(editorName, DEMO_BPMN);
			const webview = new WebView(new EditorView(), DEMO_BPMN);
			await webview.switchToFrame();
			const element = await webview.findWebElement(By.name("canvas"));
			this.timeout(20000);
		});
	})
});