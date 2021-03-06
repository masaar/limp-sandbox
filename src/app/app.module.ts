import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgJsonEditorModule } from 'ang-jsoneditor'; 

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
	BrowserModule,
	FormsModule,
	ReactiveFormsModule,
	NgJsonEditorModule,
	NgLimpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
