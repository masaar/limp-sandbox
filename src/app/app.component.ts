import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ApiService } from './shared/api.service';

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
	attrs: Array<[string, string]> = [];

	output: string = '';

	constructor(private api: ApiService, private formBuilder: FormBuilder) { }

	ngOnInit(): void {
		// this.api.requests.subscribe((msg) => {			
		// 	console.log("Response from websocket: " + JSON.stringify(msg));
		// }, (err) => {
		// 	console.log('ws err', err);
		// });
		this.api.init().subscribe((res) => {
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
		this.api.auth(this.authVars.var, this.authVars.val, this.authVars.password).subscribe((res) => {
			
			// this.authVars.auth = res.args.docs[0]
		}, (err) => {
			
		})
	}

	checkAuth(): void {
		this.api.checkAuth().subscribe();
	}

	signout(): void {
		this.api.signout().subscribe();
	}


	addFormAttr(): void {
		let attrName = prompt('attrName?');
		if (!attrName) return;
		let attrType = prompt('attrType?');
		if (!attrType) return;
		this.attrs.push([attrName, attrType]);
	}
	delFormAttr(): void {
		let attrIndex: any = prompt('attrIndex?')
		if (!attrIndex) return;
		// attrIndex = parseInt(attrIndex) - 1;
		this.attrs.splice(attrIndex, 1);
	}
	generateForm(): void {
		let form = {};
		for (let attr of this.attrs) {
			if (attr[1] == 'text') {
				form[attr[0]] = ['', Validators.required];
			} else if (attr[1] == 'locale') {
				form[`${attr[0]}.ar_AE`] = ['', Validators.required];
				form[`${attr[0]}.en_AE`] = ['', Validators.required];
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
			if (attr[1] == 'text') {
				doc[attr[0]] = this.form.value[attr[0]];
			} else if (attr[1] == 'locale') {
				doc[attr[0]] = {
					ar_AE: this.form.value[`${attr[0]}.ar_AE`],
					en_AE: this.form.value[`${attr[0]}.en_AE`]
				};
			} else if (attr[1] == 'list') {
				doc[attr[0]] = [];
			} else if (attr[1] == 'file') {
				doc[attr[0]] = this.formView.nativeElement.querySelector('input[type="file"]').files;
			} else if (attr[1] == 'boolean_false') {
				doc[attr[0]] = false;
			} else if (attr[1] == 'boolean_true') {
				doc[attr[0]] = true;
			}
		}
		console.log('doc is:', doc);
		this.api.call(endpoint, {
			doc: doc
		}).subscribe((res) => {
			// this.output += JSON.stringify(res) + '\n';
		}, (err) => {
			// this.output += JSON.stringify(err) + '\n';
		});
	}

	call(): void {
		let endpoint: any = prompt('endpoint?', );
		if (!endpoint) return;
		let query: any = prompt('query?', '{}');
		if (!query) return;
		let doc: any = prompt('doc?', '{}');
		if (!doc) return;

		this.api.call(endpoint, {
			query: JSON.parse(query),
			doc: JSON.parse(doc)
		}).subscribe((res) => {
			this.output += JSON.stringify(res) + '\n';
		}, (err) => {
			this.output += JSON.stringify(err) + '\n';
		});
	}

}