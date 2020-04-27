import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { SinglePlayerComponent } from './single-player/single-player.component';

@NgModule({
   declarations: [
      AppComponent,
      SinglePlayerComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      StorageServiceModule,
      FormsModule,
      ReactiveFormsModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
