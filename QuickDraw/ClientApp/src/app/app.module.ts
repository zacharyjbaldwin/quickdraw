import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DisplayNameModalComponent } from './shared/display-name-modal/display-name-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal'
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    DisplayNameModalComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ModalModule.forRoot(),
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
