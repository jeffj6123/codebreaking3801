import { Component, OnInit } from '@angular/core';
import {UtilsService} from "../utils.service";

@Component({
  selector: 'app-shift-cypher',
  templateUrl: './shift-cypher.component.html',
  styleUrls: ['./shift-cypher.component.css']
})
export class ShiftCypherComponent {

  constructor(private utils: UtilsService){

  }

  text = '';

  normalizedLetterFrequencyDict = {};

  lettersData = [];

  charactersToShow = 50;
  preserveWhiteSpace = false;

  deviations = [];

  public analyize(){

    var copyText = this.text;

    if(!this.preserveWhiteSpace){
      copyText = copyText.replace(/ /g,'')
    }

    var letterFrequencyDict = this.utils.generateLetterCountDictionary(copyText);

    var sum = this.utils.countDict(letterFrequencyDict);
    var alphabet = this.utils.alphabet;


    this.lettersData = [];
    this.normalizedLetterFrequencyDict = {};
    for(var i = 0; i < alphabet.length; i++){
      this.normalizedLetterFrequencyDict[alphabet[i]] = letterFrequencyDict[alphabet[i]] / sum;
      this.lettersData.push({letter : alphabet[i], frequency : letterFrequencyDict[alphabet[i]] / sum, count: letterFrequencyDict[alphabet[i]] })
    }

    this.lettersData.sort(function (a,b) {
      return a.count > b.count ? -1 : 1
    });

    this.generateDeviations(copyText);
  }

  public nextCharacterWrapAround(s){
    return s.replace(/([a-zA-Z])[^a-zA-Z]*$/, function(a){
      var c= a.charCodeAt(0);
      switch(c){
        case 90: return 'A';
        case 122: return 'a';
        default: return String.fromCharCode(++c);
      }
    });

  }

  public generateDeviations (text){
    this.deviations = [];

    for(var i = 0; i < 25; i++){
      var iteration = '';
      for(var j = 0; j < this.charactersToShow; j++){
        iteration += this.nextCharacterWrapAround(text.charAt(j));
      }
      this.deviations.push({shift : i + 1, text : iteration});
      text = iteration;
    }
  }


}
