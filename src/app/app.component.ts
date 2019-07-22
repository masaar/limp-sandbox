import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { JsonEditorOptions } from 'ang-jsoneditor';

import { ApiService, Res, Doc, callArgs } from 'ng-limp';

import { environment } from 'src/environments/environment';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	environment: any = environment;

	editorOptionsView: JsonEditorOptions;
	editorOptionsCode: JsonEditorOptions;
	data: any;

	authVars: any = {
		var: 'email',
		val: 'ADMIN@LIMP.MASAAR.COM',
		password: '__ADMIN',
		auth: null
	};

	showInit: boolean = true;
	showAuth: boolean = true;

	guardOn: boolean = true;

	callArgs: callArgs = {
		sid: 'f00000000000000000000012',
		token: environment.anon_token,
		endpoint: '',
		query: [],
		doc: {}
	};

	output: Array<{ type: 'text' | 'json'; value: any; }> = [];

	constructor(private api: ApiService, private formBuilder: FormBuilder) {
		this.editorOptionsView = new JsonEditorOptions()
		this.editorOptionsView.modes = ['code', 'view']; // set all allowed modes
		this.editorOptionsView.mode = 'view'; //set only one mode
		this.editorOptionsView.statusBar = false;
		this.editorOptionsCode = new JsonEditorOptions()
		this.editorOptionsCode.modes = ['code', 'view'];
		this.editorOptionsCode.mode = 'code';
		this.editorOptionsCode.statusBar = false;
	}

	ngOnInit(): void {
		this.api.debug = true;
	}

	init(): void {
		this.api.init(environment.ws_api, environment.anon_token)
			.pipe(
				catchError((err) => {
					if (err instanceof CloseEvent) {
						this.output.push({ type: 'text', value: 'Connection Closed.' });
					} else {
						this.output.push({ type: 'json', value: err });
					}
					return throwError(err);
				}),
				retry(10)
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
		this.api.authed$.subscribe((session: any) => {
			if (session) {
				this.guardOn = false;
				this.authVars.auth = session;
			} else {
				this.guardOn = true;
			}
		});
	}

	auth(): void {
		this.logCall(`api.auth(${this.authVars.var}, ${this.authVars.val}, ${this.authVars.password})`);
		this.api.auth(this.authVars.var, this.authVars.val, this.authVars.password).subscribe((res: Res<Doc>) => {
			this.showAuth = false;
			// this.authVars.auth = res.args.docs[0]
			this.callArgs.sid = res.args.docs[0]._id;
			this.callArgs.token = res.args.docs[0].token;
		}, (err) => {

		})
	}

	checkAuth(): void {
		this.logCall('api.checkAuth()');
		this.api.checkAuth()
			.subscribe((res: Res<Doc>) => {
				this.showAuth = false;
				this.callArgs.sid = this.api.session._id;
				this.callArgs.token = this.api.session.token;
			}, (err: Res<Doc>) => {
				this.output.push({ type: 'json', value: err });
			});
	}

	signout(): void {
		this.logCall('api.signout()');
		this.api.signout().subscribe();
	}

	call(): void {
		let query: any = JSON.parse(JSON.stringify(this.callArgs.query));
		let doc: any = JSON.parse(JSON.stringify(this.callArgs.doc));
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