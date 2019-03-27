import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ApiService, Res, Doc } from 'ng-limp';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	environment: any = environment;

	authVars: any = {
		var: 'email',
		val: 'ADMIN@LIMP.MASAAR.COM',
		password: '__ADMIN',
		auth: null
	};

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

	output: string = '';

	constructor(private api: ApiService, private formBuilder: FormBuilder) { }

	ngOnInit(): void {
		this.api.debug = true;
	}

	init(): void {
		this.api.init(environment.ws_api, environment.anon_token).subscribe((res) => {
			this.output += JSON.stringify(res) + '\n';
		}, (err) => {
			this.output += JSON.stringify(err) + '\n';
			if (err instanceof CloseEvent) {
				console.log('connection closed');
				// this.ngOnInit();
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
			// this.authVars.auth = res.args.docs[0]
			this.callArgs.sid = res.args.docs[0]._id;
			this.callArgs.token = res.args.docs[0].token;
		}, (err) => {
			
		})
	}

	addQueryAttr(): void {
		let attr = prompt('attr?');
		if (!attr) return;
		this.callArgs.query[attr] = { val: '', val2: '', oper: '', type: 'str' }
	}
	delQueryAttr(attr: string): void {
		delete this.callArgs.query[attr];
	}

	addDocAttr(): void {
		let attr = prompt('attr?');
		if (!attr) return;
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
		this.api.checkAuth().subscribe();
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
			delete query[attr].type;
		}
		for (let attr of Object.keys(doc)) {
			if (!doc[attr].val) {
				alert(`empty val for doc attr: ${attr}`);
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
		this.output += `===\nPushing call:\n${call}\n===\n`;
	}

}