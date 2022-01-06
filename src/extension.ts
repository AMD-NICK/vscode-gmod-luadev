'use strict';

// Imports /////////////////////////////////////////////////////////////////////

import * as path from "path";
import * as vscode from "vscode";

import fetch from 'node-fetch';
var crypto = require('crypto');

// Functions ///////////////////////////////////////////////////////////////////

function send( realm: string, client?: string ): void {

	// Parameter Defaults //

	if ( client == null ) client = "";

	// Common //

	const config = vscode.workspace.getConfiguration( "gmod-luadev" )
	const document = vscode.window.activeTextEditor.document;

	// Document Title //

	const document_title =
		config.get( "hidescriptname", false )
			? "_"
			: path.basename( document.uri.fsPath );

	const postUrl = config.get("posturl", "https://httpbin.org/post");
	const hashSalt = config.get("hashsalt", "changeme");

	const code = document.getText();
	const hash = crypto.createHash('sha256').update(hashSalt + code).digest('hex');
	const data = {source: document_title, code: code, hash: hash, realm: realm}

	fetch(postUrl, {
		method: 'POST',
		body:    JSON.stringify(data),
		headers: { 'Content-Type': 'application/json' },
	});
}

function getPlayerList(): void {

	// #todo

	// const config = vscode.workspace.getConfiguration( "gmod-luadev" )

	// const socket = new net.Socket();
	// socket.connect( config.get( "port", 27099 ) );
	// socket.write( "requestPlayers\n" );
	// socket.setEncoding( "utf8" );
	// socket.on( "data", function ( data: string ): void {

	// 	const clients = data.split( "\n" );
	// 	clients.sort();

	// 	vscode.window.showQuickPick(
	// 		clients,
	// 		{
	// 			placeHolder: "Select Client to send to"
	// 		}
	// 	).then( function ( client: string ): void {
	// 		// Dialogue cancelled
	// 		if ( client == null ) return;
	// 		// Send to client
	// 		send( "client", client );
	// 	});

	// });

}

// Exports /////////////////////////////////////////////////////////////////////
export function activate( context: vscode.ExtensionContext ): void {
	const command = vscode.commands.registerCommand;

	context.subscriptions.push(
		command( "gmod-luadev.server", () => send( "sv" ) ),
		command( "gmod-luadev.shared", () => send( "sh" ) ),
		command( "gmod-luadev.clients", () => send( "cl" ) ),
		command( "gmod-luadev.self", () => send( "self" ) ),
		command( "gmod-luadev.client", getPlayerList )
	);

}
