import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';

import { ApiService, Res, Doc } from 'ng-limp';

import { environment } from 'src/environments/environment';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	environment: any = environment;

	editorOptions: JsonEditorOptions;
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

	form: FormGroup = new FormGroup({});
	formReady: boolean = false;
	@ViewChild('formView') formView: any;
	attrModel!: 'locale' | 'str' | 'int' | 'access' | 'file' | 'geo';
	attrs: Array<[string, string]> = [];
	attrs_templates: { [key: string]: Array<[string, string]> } = {
		blog: [
			['title', 'locale'],
			['content', 'locale'],
			['status', 'status'],
			['cat', 'str'],
			['access', 'access']
		],
		blog_cat: [
			['title', 'locale'],
			['desc', 'locale']
		],
		staff: [
			['photo', 'file'],
			['name', 'locale'],
			['jobtitle', 'locale'],
			['bio', 'locale'],
		]
	};

	callArgs: any = {
		sid: 'f00000000000000000000012',
		token: environment.anon_token,
		endpoint: '',
		query: {},
		doc: {}
	};

	output: Array<{type: 'text' | 'json'; value: any;}> = [];

	constructor(private api: ApiService, private formBuilder: FormBuilder) {
		this.editorOptions = new JsonEditorOptions()
    this.editorOptions.modes = ['code', 'view']; // set all allowed modes
	this.editorOptions.mode = 'view'; //set only one mode
	this.editorOptions.statusBar = false;
      
      this.data = {"products":[{"name":"car","product":[{"name":"honda","model":[{"id":"civic","name":"civic"},{"id":"accord","name":"accord"},{"id":"crv","name":"crv"},{"id":"pilot","name":"pilot"},{"id":"odyssey","name":"odyssey"}]}]}]}
	}

	ngOnInit(): void {
		this.api.debug = true;
	}

	init(): void {
		this.api.init(environment.ws_api, environment.anon_token)
		.pipe(
			catchError((err) => {
				if (err instanceof CloseEvent) {
					this.output.push({type:'text', value:'Connection Closed.'});
				} else {
					this.output.push({type:'json', value:err});
				}
				return throwError(err);
			}),
			retry(10)
		)
		.subscribe((res: Res<Doc>) => {
			if (res.args.code == 'CORE_CONN_OK') {
				this.showInit = false;
			}
			this.output.push({type:'json', value:res});
			
			document.querySelector('#output-console > button').scrollIntoView();
		}, (err) => {
			if (err instanceof CloseEvent) {
				this.output.push({type:'text', value:'Connection Closed.'});
			} else {
				this.output.push({type:'json', value:err});
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

	addQueryAttr(attr?: string): void {
		if (!attr) {
			attr = prompt('attr [,attr,attr...] ?');
		}
		if (!attr) return;
		if (attr.indexOf(',') != -1) {
			for (let attr_item of attr.split(',')) {
				this.addQueryAttr(attr_item.trim());
			}
			return;
		}
		this.callArgs.query[attr] = { val: '', val2: '', oper: '', type: 'str', strict: null }
	}
	delQueryAttr(attr: string): void {
		delete this.callArgs.query[attr];
	}

	addDocAttr(attr?: string): void {
		if (!attr) {
			attr = prompt('attr [,attr,attr...] ?');
		}
		if (!attr) return;
		if (attr.indexOf(',') != -1) {
			for (let attr_item of attr.split(',')) {
				this.addDocAttr(attr_item.trim());
			}
			return;
		}
		this.callArgs.doc[attr] = { val: '', type: 'str' }
	}
	updateDocAttr(attr: string, type: string): void {
		if (type == 'locale') {
			this.callArgs.doc[attr].val = {
				ar_AE: '',
				en_AE: ''
			};
		} else {
			this.callArgs.doc[attr].val = '';
		}
	}
	delDocAttr(attr: string): void {
		delete this.callArgs.doc[attr];
	}

	checkAuth(): void {
		this.logCall('api.checkAuth()');
		this.api.checkAuth()
		.subscribe((res: Res<Doc>) => {
			this.showAuth = false;
			this.callArgs.sid = this.api.session._id;
			this.callArgs.token = this.api.session.token;
		}, (err: Res<Doc>) => {
			this.output.push({type:'json', value:err});
		});
	}

	signout(): void {
		this.logCall('api.signout()');
		this.api.signout().subscribe();
	}


	populateAttrs(template: string): void {
		this.attrs = this.attrs_templates[template];
		this.generateForm();
	}
	addFormAttr(): void {
		let attrName = prompt('attrName?');
		if (!attrName) return;
		// let attrType = prompt('attrType?');
		// if (!attrType) return;
		this.form = null;
		this.attrs.push([attrName, this.attrModel]);
	}
	delFormAttr(attrIndex?: number): void {
		if (attrIndex == undefined) {
			attrIndex = parseInt(prompt('attrIndex?'))
			if (!attrIndex) return;
		}
		// attrIndex = parseInt(attrIndex) - 1;
		this.attrs.splice(attrIndex, 1);
	}
	generateForm(): void {
		let form = {};
		for (let attr of this.attrs) {
			if (attr[1] == 'str') {
				form[attr[0]] = ['', Validators.required];
			} else if (attr[1] == 'int') {
					form[attr[0]] = [0, Validators.required];
			} else if (attr[1] == 'locale') {
				form[`${attr[0]}.ar_AE`] = ['', Validators.required];
				form[`${attr[0]}.en_AE`] = ['', Validators.required];
			} else if (attr[1] == 'geo') {
				form[`${attr[0]}.lat`] = ['', Validators.required];
				form[`${attr[0]}.lng`] = ['', Validators.required];
			} else if (attr[1] == 'file') {
				form[attr[0]] = [undefined, Validators.required];
			}
		}
		this.formReady = true;
		this.form = this.formBuilder.group(form);
	}
	submitForm(): void {
		let endpoint = prompt('endpoint?');
		if (!endpoint) return;
		let query: any = prompt('query?', '{}');
		if (!query) query = {};
		else query = JSON.parse(query);
		let doc = {};
		for (let attr of this.attrs) {
			if (attr[1] == 'str') {
				doc[attr[0]] = this.form.value[attr[0]];
			} else if (attr[1] == 'int') {
				doc[attr[0]] = this.form.value[attr[0]];
			} else if (attr[1] == 'locale') {
				doc[attr[0]] = {
					ar_AE: this.form.value[`${attr[0]}.ar_AE`],
					en_AE: this.form.value[`${attr[0]}.en_AE`]
				};
			} else if (attr[1] == 'geo') {
				doc[attr[0]] = {
					type: "Point",
					coordinates: [ this.form.value[`${attr[0]}.lat`] , this.form.value[`${attr[0]}.lng`] ]
				}
			} else if (attr[1] == 'list') {
				doc[attr[0]] = [];
			} else if (attr[1] == 'file') {
				doc[attr[0]] = this.formView.nativeElement.querySelector('input[type="file"]').files;
			} else if (attr[1] == 'boolean_false') {
				doc[attr[0]] = false;
			} else if (attr[1] == 'boolean_true') {
				doc[attr[0]] = true;
			} else if (attr[1] == 'access') {
				doc[attr[0]] = {anon: true, users:[], groups:[]};
			} else if (attr[1] == 'status') {
				doc[attr[0]] = 'published';
			}
		}
		this.logCall(`api.call(${endpoint}, {doc:${JSON.stringify(doc)}})`);
		this.api.call(endpoint, {
			query: query,
			doc: doc
		}).subscribe((res) => {
			// this.output += JSON.stringify(res) + '\n';
		}, (err) => {
			// this.output += JSON.stringify(err) + '\n';
		});
	}

	call(): void {
		let query: any = JSON.parse(JSON.stringify(this.callArgs.query));
		let doc: any = JSON.parse(JSON.stringify(this.callArgs.doc));
		for (let attr of Object.keys(query)) {
			if (!query[attr].val) {
				alert(`empty val for query attr: ${attr}`);
			}
			if (query[attr].oper == '$bet' && !query[attr].val2) {
				alert(`empty val2 for query attr: ${attr}`);
			}
			if (query[attr].oper == '$eq') {
				delete query[attr].oper;
			}
			if (query[attr].strict == 'false') {
				query[attr].strict = false;
			} else {
				delete query[attr].strict;
			}
			if (['username_hash', 'email_hash', 'phone_hash'].indexOf(query[attr].type) != -1) {
				query[attr].val = this.api.generateAuthHash(query[attr].type.replace('_hash', ''), query[attr].val, query[attr].password)
				delete query[attr].password;
			} else if (query[attr].type == 'json') {
				query[attr].val = JSON.parse(query[attr].val);
			}
			if (['$search', '$skip', '$limit', '$extn', '$attrs'].indexOf(attr) != -1) {
				query[attr] = query[attr].val;
			} else {
				delete query[attr].type;
			}
		}
		for (let attr of Object.keys(doc)) {
			if (!doc[attr].val) {
				if (doc[attr].type == 'file') {
					doc[attr].val = (window.document.querySelector(`#file-${attr}`) as any).files;
				} else {
					alert(`empty val for doc attr: ${attr}`);
				}
			}
			if (doc[attr].type == 'json') {
				doc[attr].val = JSON.parse(doc[attr].val);
			} else if (['username_hash', 'email_hash', 'phone_hash'].indexOf(doc[attr].type) != -1) {
				doc[attr].val = this.api.generateAuthHash(doc[attr].type.replace('_hash', ''), doc[attr].val, doc[attr].password)
			}
			doc[attr] = doc[attr].val;
		}
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
		this.output.push({type:'text', value: `===\nPushing call:\n${call}\n===\n`});
	}

}