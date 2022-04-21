import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchModule } from './search/search.module';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HomeComponent } from './shared/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from './_modal';
import { FormsModule } from '@angular/forms';
import { TopicPageComponent } from './topic-page/topic-page.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent, HomeComponent, TopicPageComponent],
  imports: [BrowserModule, AppRoutingModule, SearchModule, BrowserAnimationsModule, ModalModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
