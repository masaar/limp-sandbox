import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgLimpModule } from 'ng-limp'

import { AppComponent } from './app.component';
import { KeysPipe, ValuesPipe } from './object.pipe';

@NgModule({
  declarations: [
	AppComponent,
	KeysPipe,
	ValuesPipe
  ],
  imports: [
	HttpModule,
	BrowserModule,
	FormsModule,
	ReactiveFormsModule,
	NgLimpModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
