import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ApiService } from 'ng-limp';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

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

	output: string = '';

	constructor(private api: ApiService, private formBuilder: FormBuilder) { }

	ngOnInit(): void {
		// this.api.requests.subscribe((msg) => {			
		// 	console.log("Response from websocket: " + JSON.stringify(msg));
		// }, (err) => {
		// 	console.log('ws err', err);
		// });
		this.api.debug = true;
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
		this.authVars.var = prompt('authVar?', this.authVars.var);
		if (!this.authVars.var) return;
		this.authVars.val = prompt('authVal?', this.authVars.val);
		if (!this.authVars.val) return;
		this.authVars.password = prompt('password?', this.authVars.password);
		if (!this.authVars.password) return;
		
		this.logCall(`api.auth(${this.authVars.var}, ${this.authVars.val}, ${this.authVars.password})`);
		this.api.auth(this.authVars.var, this.authVars.val, this.authVars.password).subscribe((res) => {
			
			// this.authVars.auth = res.args.docs[0]
		}, (err) => {
			
		})
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
			doc: doc
		}).subscribe((res) => {
			// this.output += JSON.stringify(res) + '\n';
		}, (err) => {
			// this.output += JSON.stringify(err) + '\n';
		});
	}

	call(endpoint?: string): void {
		if (!endpoint) {
			endpoint = prompt('endpoint?');
			if (!endpoint) return;
		}
		let query: any = prompt('query?', '{}');
		if (!query) return;
		let doc: any = prompt('doc?', '{}');
		if (!doc) return;

		this.logCall(`api.call(${endpoint}, {query:${query}, doc:${doc}})`);
		this.api.call(endpoint, {
			query: JSON.parse(query),
			doc: JSON.parse(doc)
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