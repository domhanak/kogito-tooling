import { EditorView, WebView, ExtensionsViewItem, By, WebElement } from 'vscode-extension-tester';
import { Dialog, Marketplace } from 'vscode-uitests-tooling';
import * as path from 'path';
import { assert } from 'chai';
import * as pjson from '../../package.json';
import { aComponentWithText } from './extension-test-utils';

describe('Kogito Tooling Extension Test Suite', () => {

	const RESOURCES: string = path.resolve('src', 'ui-test', 'resources');
	const DEMO_BPMN: string = 'demo.bpmn';
	const DEMO_DMN: string = 'demo.dmn'

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

	describe("BPMM Editor is loading", () => {

		let webview : WebView;

		before(async function () {
			this.timeout(25000)
			await Dialog.openFile(path.join(RESOURCES, DEMO_BPMN));
			webview = new WebView(new EditorView(), By.linkText(DEMO_BPMN));
			await webview.switchToFrame();
		});

		after(async () => {
			await webview.switchBack();
			await new EditorView().closeAllEditors();
		})

		it('Open demo.bpmn file in BPMN Editor', async () => {
			const kogitoFrame: WebElement = await webview.findWebElement(By.id('org.kie.workbench.common.stunner.kogito.KogitoBPMNEditor'))
			assert.isDefined(kogitoFrame);
			const palette: WebElement =  await webview.findWebElement(By.className("kie-palette"));
			const properties: WebElement = await webview.findWebElement(By.className("qe-docks-item-E-DiagramEditorPropertiesScreen"));
			const explorer: WebElement = await webview.findWebElement(By.className("qe-docks-item-E-ProjectDiagramExplorerScreen"))
			assert.isTrue(await palette.isDisplayed() && await palette.isEnabled());
			assert.isTrue(await properties.isDisplayed() && await properties.isEnabled());
			assert.isTrue(await explorer.isDisplayed() && await explorer.isEnabled());

			const exploreDiagramButton = await explorer.findElement(By.xpath('//button[@data-title=\'Explore Diagram\']'));
			assert.isTrue(await exploreDiagramButton.isDisplayed() && await exploreDiagramButton.isEnabled())
			await exploreDiagramButton.click();
			assert.isTrue(await explorer.findElement(By.xpath(aComponentWithText('demo'))).isDisplayed());
			assert.isTrue(await explorer.findElement(By.xpath(aComponentWithText('Start'))).isDisplayed());
			assert.isTrue(await explorer.findElement(By.xpath(aComponentWithText('End'))).isDisplayed());			
		});
	})

	describe("DMN Editor is loading", () => {

		let webview : WebView;

		before(async function () {
			this.timeout(25000)
			await Dialog.openFile(path.join(RESOURCES, DEMO_DMN));
			webview = new WebView(new EditorView(), By.linkText(DEMO_DMN));
			await webview.switchToFrame();
		});

		after(async () => {
			await webview.switchBack()
			await new EditorView().closeAllEditors();
		})

		it('Open demo.dmn file in DMN Editor', async () => {
			const kogitoFrame: WebElement = await webview.findWebElement(By.id('org.kie.workbench.common.dmn.showcase.DMNKogitoRuntimeWebapp'))
			assert.isDefined(kogitoFrame);
			const palette: WebElement =  await webview.findWebElement(By.className("kie-palette"));
			const properties: WebElement = await webview.findWebElement(By.className("qe-docks-item-E-DiagramEditorPropertiesScreen"));
			const explorer: WebElement = await webview.findWebElement(By.className("qe-docks-item-E-DMNProjectDiagramExplorerScreen"));
			const navigator: WebElement = await webview.findWebElement(By.className("qe-docks-item-E-org.kie.dmn.decision.navigator"));
			assert.isTrue(await palette.isDisplayed() && await palette.isEnabled());
			assert.isTrue(await properties.isDisplayed() && await properties.isEnabled());
			assert.isTrue(await explorer.isDisplayed() && await explorer.isEnabled());
			assert.isTrue(await navigator.isDisplayed() && await navigator.isEnabled());

			const exploreDiagramButton = await explorer.findElement(By.xpath('//button[@data-title=\'Decision Navigator\']'));
			assert.isTrue(await exploreDiagramButton.isDisplayed() && await exploreDiagramButton.isEnabled());
		});
	})
});