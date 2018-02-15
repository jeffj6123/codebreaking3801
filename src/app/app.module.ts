import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import {UtilsService} from "./utils.service";

import { FormsModule }   from '@angular/forms';


import { ShiftCypherComponent } from './shift-cypher/shift-cypher.component';

import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LetterFrequencyComponent } from './letter-frequency/letter-frequency.component';
import { NgramsComponent } from './ngrams/ngrams.component';
import { TextAnalysisComponent } from './text-analysis/text-analysis.component';
import { NgraphGraphComponent } from './ngraph-graph/ngraph-graph.component';
import { VigenereComponent } from './vigenere/vigenere.component';
import { PlayfairComponent } from './playfair/playfair.component';

const appRoutes: Routes = [

  {path: 'shiftcipher', component: ShiftCypherComponent},
  {path: 'textanalysis', component: TextAnalysisComponent},
  {path: 'vigenerecracker', component: VigenereComponent},
  {path: 'playfair', component: PlayfairComponent},

  {path: '', component: LandingPageComponent},
  {path: '**', component: LandingPageComponent}

];

@NgModule({
  declarations: [
    AppComponent,
    ShiftCypherComponent,
    LandingPageComponent,
    LetterFrequencyComponent,
    NgramsComponent,
    TextAnalysisComponent,
    NgraphGraphComponent,
    VigenereComponent,
    PlayfairComponent
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    FormsModule,
    RouterModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [
    UtilsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
