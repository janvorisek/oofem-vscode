// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

/** Code that is used to associate diagnostic entries with code actions. */
export const EMOJI_MENTION = 'emoji_mention';

/** String to detect in the text document. */
const EMOJI = 'coords';

const COMMAND = 'code-actions-sample.command';

function createDiagnostic(doc: vscode.TextDocument, lineOfText: vscode.TextLine, lineIndex: number): vscode.Diagnostic {
	// find where in the line of that the 'emoji' is mentioned
	const index = lineOfText.text.indexOf(EMOJI);

	// create range that represents, where in the document the word is
	const range = new vscode.Range(lineIndex, index, lineIndex, index + EMOJI.length);

	const diagnostic = new vscode.Diagnostic(range, "When you say 'emoji', do you want to find out more?",
		vscode.DiagnosticSeverity.Error);
	diagnostic.code = EMOJI_MENTION;
	return diagnostic;
}

/**
 * Analyzes the text document for problems. 
 * This demo diagnostic problem provider finds all mentions of 'emoji'.
 * @param doc text document to analyze
 * @param emojiDiagnostics diagnostic collection
 */
export function refreshDiagnostics(doc: vscode.TextDocument, emojiDiagnostics: vscode.DiagnosticCollection): void {
	const diagnostics: vscode.Diagnostic[] = [];

	for (let lineIndex = 0; lineIndex < doc.lineCount; lineIndex++) {
		const lineOfText = doc.lineAt(lineIndex);
		if (lineOfText.text.includes(EMOJI)) {
			diagnostics.push(createDiagnostic(doc, lineOfText, lineIndex));
		}
	}

	emojiDiagnostics.set(doc.uri, diagnostics);
}

export function subscribeToDocumentChanges(context: vscode.ExtensionContext, emojiDiagnostics: vscode.DiagnosticCollection): void {
	if (vscode.window.activeTextEditor) {
		refreshDiagnostics(vscode.window.activeTextEditor.document, emojiDiagnostics);
	}
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(editor => {
			if (editor) {
				refreshDiagnostics(editor.document, emojiDiagnostics);
			}
		})
	);

	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(e => refreshDiagnostics(e.document, emojiDiagnostics))
	);

	context.subscriptions.push(
		vscode.workspace.onDidCloseTextDocument(doc => emojiDiagnostics.delete(doc.uri))
	);

}

/**
 * Provides code actions for converting :) to a smiley emoji.
 */
export class Emojizer implements vscode.CodeActionProvider {

	public static readonly providedCodeActionKinds = [
		vscode.CodeActionKind.QuickFix
	];

	public provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] | undefined {
		if (!this.isAtStartOfSmiley(document, range)) {
			return;
		}

		const replaceWithSmileyCatFix = this.createFix(document, range, '😺');

		const replaceWithSmileyFix = this.createFix(document, range, '😀');
		// Marking a single fix as `preferred` means that users can apply it with a
		// single keyboard shortcut using the `Auto Fix` command.
		replaceWithSmileyFix.isPreferred = true;

		const replaceWithSmileyHankyFix = this.createFix(document, range, '💩');

		const commandAction = this.createCommand();

		return [
			replaceWithSmileyCatFix,
			replaceWithSmileyFix,
			replaceWithSmileyHankyFix,
			commandAction
		];
	}

	private isAtStartOfSmiley(document: vscode.TextDocument, range: vscode.Range) {
		const start = range.start;
		const line = document.lineAt(start.line);
		return line.text[start.character] === ':' && line.text[start.character + 1] === ')';
	}

	private createFix(document: vscode.TextDocument, range: vscode.Range, emoji: string): vscode.CodeAction {
		const fix = new vscode.CodeAction(`Convert to ${emoji}`, vscode.CodeActionKind.QuickFix);
		fix.edit = new vscode.WorkspaceEdit();
		fix.edit.replace(document.uri, new vscode.Range(range.start, range.start.translate(0, 2)), emoji);
		return fix;
	}

	private createCommand(): vscode.CodeAction {
		const action = new vscode.CodeAction('Learn more...', vscode.CodeActionKind.Empty);
		action.command = { command: COMMAND, title: 'Learn more about emojis', tooltip: 'This will open the unicode emoji page.' };
		return action;
	}
}

/**
 * Provides code actions corresponding to diagnostic problems.
 */
export class Emojinfo implements vscode.CodeActionProvider {

	public static readonly providedCodeActionKinds = [
		vscode.CodeActionKind.QuickFix
	];

	provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.CodeAction[] {
		// for each diagnostic entry that has the matching `code`, create a code action command
		return context.diagnostics
			.filter(diagnostic => diagnostic.code === EMOJI_MENTION)
			.map(diagnostic => this.createCommandCodeAction(diagnostic));
	}

	private createCommandCodeAction(diagnostic: vscode.Diagnostic): vscode.CodeAction {
		const action = new vscode.CodeAction('Learn more...', vscode.CodeActionKind.QuickFix);
		action.command = { command: COMMAND, title: 'Learn more about emojis', tooltip: 'This will open the unicode emoji page.' };
		action.diagnostics = [diagnostic];
		action.isPreferred = true;
		return action;
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "oofem-input-file" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('oofem-input-file.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from oofem-input-file!');
	});

	context.subscriptions.push(disposable);

	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider('oofem-input', new Emojizer(), {
			providedCodeActionKinds: Emojizer.providedCodeActionKinds
		}));

	const emojiDiagnostics = vscode.languages.createDiagnosticCollection("emoji");
	context.subscriptions.push(emojiDiagnostics);

	subscribeToDocumentChanges(context, emojiDiagnostics);

	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider('oofem-input', new Emojinfo(), {
			providedCodeActionKinds: Emojinfo.providedCodeActionKinds
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(COMMAND, () => vscode.env.openExternal(vscode.Uri.parse('https://unicode.org/emoji/charts-12.0/full-emoji-list.html')))
	);
}

function decorate(editor: vscode.TextEditor) {
	let sourceCode = editor.document.getText()
	
	//
}

vscode.workspace.onWillSaveTextDocument(event => {
	const openEditor = vscode.window.visibleTextEditors.filter(
		editor => editor.document.uri === event.document.uri
	)[0]
	decorate(openEditor)
})

/*vscode.workspace.onDidOpenTextDocument((file) => {
	console.log(file.languageId)

	const editor = vscode.window.activeTextEditor;

	editor!.setDecorations(0,)
})*/

// This method is called when your extension is deactivated
export function deactivate() {}
