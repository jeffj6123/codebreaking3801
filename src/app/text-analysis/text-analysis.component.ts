import { Component, OnInit } from '@angular/core';
import {UtilsService} from "../utils.service";

@Component({
  selector: 'app-text-analysis',
  templateUrl: './text-analysis.component.html',
  styleUrls: ['./text-analysis.component.css']
})
export class TextAnalysisComponent implements OnInit {

  text = '';
  replacedText = '';
  normalizedLetterFrequencyDict = {};

  lettersData = [];

  nGrams = [];

  transformKey = [];

  constructor(private utils: UtilsService) {
  }
  ngOnInit() {
  }


  public replace(){
    var replaceKeyDict = {};
    for(var i =0; i < this.transformKey.length; i++){
      replaceKeyDict[this.transformKey[i].letter] = {replacement:this.transformKey[i].replacementLetter, highlight : this.transformKey[i].highlight};
    }

    //replace text is for what is displayed
    this.replacedText = '';

    //nonformattedReplacedText is for determing
    var nonFormattedReplacedText = '';

    for(var j = 0; j < this.text.length; j++){
      var char = this.text.charAt(j).toUpperCase();
      var highlight = false;

      //replace char if necessary
      if(replaceKeyDict[char]){
        highlight = replaceKeyDict[char].highlight;
        char = replaceKeyDict[char].replacement;
      }

      //replaceText
      var replaceText = char
      if(highlight){
        replaceText = "<span class='highlight-text'>" + char + '</span>';
      }

      nonFormattedReplacedText += char;
      this.replacedText += replaceText;



    }

    nonFormattedReplacedText = nonFormattedReplacedText.replace(/\W+/g, "");

    nonFormattedReplacedText = nonFormattedReplacedText.trim();

    var nGramsList = this.utils.generateNGramDictionary(nonFormattedReplacedText,[2,3]);


    var nGrams = [];

    for(var i = 0; i < nGramsList.length; i++){
      var g = {name : nGramsList[i].size, entries : [] };
      for(var key in nGramsList[i].grams){
        g.entries.push({name : key, frequency : (nGramsList[i].grams[key] /  nGramsList[i].grams[nGramsList[i].mostFrequent]).toPrecision(3)} )
      }

      g.entries.sort(function (a,b) {
        return a.frequency > b.frequency ? -1 : 1
      });
      g.entries = g.entries.splice(0,25);
      for(var j = 0; j < g.entries.length; j++){
        var reverseKey = g.entries[j].name.split("").reverse().join("");
        var reverse = nGramsList[i].grams[reverseKey] ? nGramsList[i].grams[reverseKey] : 0;
        g.entries[j].reverseKey = reverseKey;
        g.entries[j].reverseFrequency = (reverse /  nGramsList[i].grams[nGramsList[i].mostFrequent]).toPrecision(3);

      }


      nGrams.push(g);
    }
    this.nGrams = nGrams;

  }

  public analyize(){

    this.replacedText = '';

    var copyText = this.text;

    //remove white space
    copyText = copyText.replace(/\W+/g, "");

    copyText = copyText.trim();

    copyText = copyText.toUpperCase();

    var letterFrequencyDict = this.utils.generateLetterFrequencyDictionary(copyText);

    var sum = this.utils.countDict(letterFrequencyDict);
    var alphabet = this.utils.alphabet.toUpperCase().split(',');
    //generate letters data and normalized letter frequency dict and transformKeyList
    this.transformKey = [];
    this.lettersData = [];
    this.normalizedLetterFrequencyDict = {};
    for(var i = 0; i < alphabet.length; i++){
      this.normalizedLetterFrequencyDict[alphabet[i]] = letterFrequencyDict[alphabet[i]] / sum;
      this.lettersData.push({letter : alphabet[i], frequency : letterFrequencyDict[alphabet[i]] / sum, count: letterFrequencyDict[alphabet[i]] })

      this.transformKey.push({letter: alphabet[i], replacementLetter : alphabet[i], hightlight : false})
    }



    this.lettersData.sort(function (a,b) {
      return a.count > b.count ? -1 : 1
    });

    var nGramsList = this.utils.generateNGramDictionary(copyText,[2,3]);


    var nGrams = [];

    for(var i = 0; i < nGramsList.length; i++){
      var g = {name : nGramsList[i].size, entries : [] };
      for(var key in nGramsList[i].grams){
        g.entries.push({name : key, frequency : (nGramsList[i].grams[key] /  nGramsList[i].grams[nGramsList[i].mostFrequent]).toPrecision(3)} )
      }

      g.entries.sort(function (a,b) {
        return a.frequency > b.frequency ? -1 : 1
      });
      g.entries = g.entries.splice(0,25);
      for(var j = 0; j < g.entries.length; j++){
        var reverseKey = g.entries[j].name.split("").reverse().join("");
        var reverse = nGramsList[i].grams[reverseKey] ? nGramsList[i].grams[reverseKey] : 0;
        g.entries[j].reverseKey = reverseKey;
        g.entries[j].reverseFrequency = (reverse /  nGramsList[i].grams[nGramsList[i].mostFrequent]).toPrecision(3);

      }


      nGrams.push(g);
    }

    this.nGrams = nGrams;
  }

}
