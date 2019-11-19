import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { JsonEditorOptions } from 'ang-jsoneditor';

import { ApiService, Res, Doc, Query, Session, SDKConfig } from 'ng-limp';

import { environment } from 'src/environments/environment';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	environment: any = environment;

	editorOptionsView: JsonEditorOptions;
	editorOptionsQuery: JsonEditorOptions;
	editorOptionsDoc: JsonEditorOptions;
	data: any;

	SDKConfig: SDKConfig = {
		api: environment.ws_api,
		anonToken: environment.anon_token,
		authAttrs: [],
		debug: true
	}

	authVars: any = {
		var: 'email',
		val: 'ADMIN@LIMP.MASAAR.COM',
		password: '__ADMIN',
		auth: null
	};

	showInit: boolean = true;
	showAuth: boolean = true;

	guardOn: boolean = true;

	doc: any = {1:2};
	callArgs: {
		sid: string;
		token: string;
		endpoint: string;
		query: Query;
		doc: any;
	} = {
		sid: 'f00000000000000000000012',
		token: environment.anon_token,
		endpoint: '',
		query: [],
		doc: {}
	};

	docFiles: Array<FileList> = [];

	output: Array<{ type: 'text' | 'json'; value: any; }> = [];

	constructor(private api: ApiService, private formBuilder: FormBuilder) {
		this.editorOptionsView = new JsonEditorOptions()
		this.editorOptionsView.modes = ['code', 'view'];
		this.editorOptionsView.mode = 'view';
		this.editorOptionsView.statusBar = false;
		this.editorOptionsQuery = new JsonEditorOptions()
		this.editorOptionsQuery.modes = ['code', 'view'];
		this.editorOptionsQuery.mode = 'code';
		this.editorOptionsQuery.statusBar = false;
		this.editorOptionsDoc = new JsonEditorOptions()
		this.editorOptionsDoc.modes = ['code', 'view'];
		this.editorOptionsDoc.mode = 'code';
		this.editorOptionsDoc.statusBar = false;
	}

	ngOnInit() { }

	updateAnonToken(): void {
		this.callArgs.token = environment.anon_token;
	}

	updateAuthAttrs($event: Event): void {
		this.SDKConfig.authAttrs = ($event.target as any).value.split(' ');
	}

	updateDocFiles(): void {
		this.docFiles = (JSON.stringify(this.callArgs.doc).match(/__file__/g) as any).fill(undefined);
	}

	init(): void {
		this.showAuth = true;
		this.api.init(this.SDKConfig)
			.pipe(
				catchError((err) => {
					if (err instanceof CloseEvent) {
						this.output.push({ type: 'text', value: 'Connection Closed.' });
					} else {
						this.output.push({ type: 'json', value: err });
					}
					return throwError(err);
				}),
				// retry(10)
			)
			.subscribe((res: Res<Doc>) => {
				if (res.args.code == 'CORE_CONN_OK') {
					this.showInit = false;
				}
				this.output.push({ type: 'json', value: res });

				document.querySelector('#output-console > button').scrollIntoView();
			}, (err) => {
				if (err instanceof CloseEvent) {
					this.output.push({ type: 'text', value: 'Connection Closed.' });
				} else {
					this.output.push({ type: 'json', value: err });
				}
			}, () => {
				console.log('complete');
			});
		this.api.authed$.subscribe((session: Session) => {
			if (session) {
				this.showAuth = this.guardOn = false;
				this.authVars.auth = session;
				this.callArgs.sid = session._id;
				this.callArgs.token = session.token;
			} else {
				this.showAuth = this.guardOn = true;
				this.callArgs.sid = 'f00000000000000000000012';
				this.callArgs.token = environment.anon_token;
			}
		});
	}

	auth(): void {
		this.logCall(`api.auth(${this.authVars.var}, ${this.authVars.val}, ${this.authVars.password})`);
		this.api.auth(this.authVars.var, this.authVars.val, this.authVars.password).subscribe((res: Res<Doc>) => {

		}, (err) => {
			this.output.push({ type: 'json', value: err });
		})
	}

	checkAuth(): void {
		this.logCall('api.checkAuth()');
		this.api.checkAuth()
			.subscribe((res: Res<Doc>) => {

			}, (err: Res<Doc>) => {
				this.output.push({ type: 'json', value: err });
			});
	}

	signout(): void {
		this.logCall('api.signout()');
		this.api.signout().subscribe();
	}

	updateFiles(obj: any, i: number = 0): void {
		if (!this.docFiles.length || i == this.docFiles.length) {
			return;
		}
		for (let attr of Object.keys(obj)) {
			if (obj[attr] instanceof Array) {
				this.updateFiles(obj[attr], i);
			} else if (obj[attr] instanceof Object) {
				this.updateFiles(obj[attr], i);
			} else {
				if (obj[attr] == '__file__') {
					this.output.push({ type: 'text', value: `Replacing __file__ attr in doc with file#${i}` });
					obj[attr] = this.docFiles[i];
					if (!obj[attr]) {
						this.output.push({ type: 'text', value: `File#${i} is null value. Stopping.` });
						throw Error('No file value');
					}
					i += 1;
					if (i == this.docFiles.length) return;
				}
			}
		}
	}

	call(): void {
		let query: any = JSON.parse(JSON.stringify(this.callArgs.query));
		let doc: any = JSON.parse(JSON.stringify(this.callArgs.doc));

		console.log('before files:', doc);
		this.updateFiles(doc);
		console.log('after files:', doc);

		this.logCall(`api.call(${this.callArgs.endpoint}, {query:${JSON.stringify(query)}, doc:${JSON.stringify(doc)}})`);
		this.api.call(this.callArgs.endpoint, {
			sid: this.callArgs.sid,
			token: this.callArgs.token,
			query: query,
			doc: doc
		}).subscribe((res) => {
			// this.output += JSON.stringify(res) + '\n';
		}, (err) => {
			// this.output += JSON.stringify(err) + '\n';
		});
	}

	logCall(call: string): void {
		this.output.push({ type: 'text', value: `===\nPushing call:\n${call}\n===\n` });
	}

}