import { Component, OnInit } from '@angular/core';
import {UtilsService} from "../utils.service";

@Component({
  selector: 'app-ngrams',
  templateUrl: './ngrams.component.html',
  styleUrls: ['./ngrams.component.css']
})
export class NgramsComponent implements OnInit {


  text = '';

  nGrams = [];

  constructor(private utils: UtilsService) {
  }
  ngOnInit() {
  }

  public analyize(){

    var copyText = this.text;

    copyText = copyText.replace(/\r?\n?/g, '');
    copyText = copyText.trim();

    // var nGramsList = this.utils.generateNGramDictionary(copyText,[2,3]);
    var nGramsList = [];

    this.nGrams = [];

    for(var i = 0; i < nGramsList.length; i++){
      var g = {name : nGramsList[i].size, entries : [] };
      for(var j = 0; j < nGramsList[i].grams.length; j++){
        g.entries.push({name : nGramsList[i].size, frequency : nGramsList[i].grams[j] /  nGramsList[i].grams[nGramsList[i].mostFrequent]})
      }

      g.entries.sort(function (a,b) {
        return a.frequency > b.frequency ? -1 : 1
      });

      this.nGrams.push(g);
    }


    // console.log(this.utils.generateNGramDictionary(copyText,[2,3]));
  }

}
