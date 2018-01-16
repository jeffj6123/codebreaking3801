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
  highLightedText = '';

  highlightKeys = '';

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
      replaceKeyDict[this.transformKey[i].letter] = this.transformKey[i].replacementLetter;
    }

    //replace text is for what is displayed
    this.replacedText = '';

    //nonformattedReplacedText is for determing
    var nonFormattedReplacedText = '';

    for(var j = 0; j < this.text.length; j++){
      var char = this.text.charAt(j).toUpperCase();

      //replace char if necessary
      if(replaceKeyDict[char]){
        char = replaceKeyDict[char];
      }

      this.replacedText += char;

    }

    this.replacedText = this.utils.stripWhiteSpaceAndFormatting(this.replacedText);

    this.nGrams = this.generateSortedNgraphsLists(this.replacedText, [2,3]);

    this.highlightText();
  }

  public highlightText(){
    console.log(this.replacedText)
    this.highLightedText = this.highlight(this.replacedText);
  }

  /**
   * Highlights search phrases within the given text.
   * @param text - the text to highlight phrases in
   * @returns {string} - text with HTML classes that highlight selected phrases
   */
  highlight(text: string): string {
    var keywordsSplit = this.highlightKeys.split(',');
    keywordsSplit.sort((a,b) => {
      return a.length > b.length ? -1 : 1;
    });
    //First change the keywords to now be a string with words separated with | per reg exp
    let keywords = keywordsSplit.join('|').toUpperCase();

    console.log(text)
    console.log(keywords)
    //For every match found replace with a highlighted version
    return text.replace(new RegExp(keywords, "gi"), function myFunction(x) {
      return "<span class='highlight-text'>" + x + "</span>";
    })
  }

  duplicateTransform(letterTransform){
    for(var i = 0; i < this.transformKey.length; i++){
      if(this.transformKey[i].replacementLetter == letterTransform.replacementLetter && this.transformKey[i].letter != letterTransform.letter){
        console.log(letterTransform)
        console.log(this.transformKey[i])
        return true;
      }

    }
    return false;
  }

  generateSortedNgraphsLists(text, ngraphSizes){
    var nGraphLists = this.utils.generateNGramDictionary(text,ngraphSizes);
    var sortedNGraphs = [];

    for(var i = 0; i < nGraphLists.length; i++){
      var g = {name : nGraphLists[i].size, entries : [] };
      for(var key in nGraphLists[i].grams){
        g.entries.push({name : key, frequency : (nGraphLists[i].grams[key] /  nGraphLists[i].grams[nGraphLists[i].mostFrequent]).toPrecision(3)} )
      }

      g.entries.sort(function (a,b) {
        return a.frequency > b.frequency ? -1 : 1
      });
      g.entries = g.entries.splice(0,25);
      for(var j = 0; j < g.entries.length; j++){
        var reverseKey = g.entries[j].name.split("").reverse().join(""); //man I hate this
        var reverse = nGraphLists[i].grams[reverseKey] ? nGraphLists[i].grams[reverseKey] : 0;
        g.entries[j].reverseKey = reverseKey;
        g.entries[j].reverseFrequency = (reverse /  nGraphLists[i].grams[nGraphLists[i].mostFrequent]).toPrecision(3);

      }
      sortedNGraphs.push(g);
    }
    return sortedNGraphs;
  }

  public analyize(){
    var copyText = this.text;

    //remove white space
    copyText = this.utils.stripWhiteSpaceAndFormatting(copyText);
    copyText = copyText.toUpperCase();

    //set replace text which is used as a base for highlight
    this.replacedText = copyText;
    //set hightlight for output text
    this.highlightText();

    var letterFrequencyDict = this.utils.generateLetterCountDictionary(copyText);

    var sum = this.utils.countDict(letterFrequencyDict);
    var alphabet = this.utils.alphabet;
    //generate letters data and normalized letter frequency dict and transformKeyList
    this.transformKey = [];
    this.lettersData = [];
    this.normalizedLetterFrequencyDict = {};
    for(var i = 0; i < alphabet.length; i++){
      this.normalizedLetterFrequencyDict[alphabet[i]] = letterFrequencyDict[alphabet[i]] / sum;
      this.lettersData.push({letter : alphabet[i], frequency : letterFrequencyDict[alphabet[i]] / sum, count: letterFrequencyDict[alphabet[i]] })

      if(letterFrequencyDict[alphabet[i]] > 0){
        this.transformKey.push({letter: alphabet[i], replacementLetter : alphabet[i]})
      }
    }


    this.lettersData.sort(function (a,b) {
      return a.count > b.count ? -1 : 1
    });


    this.nGrams = this.generateSortedNgraphsLists(copyText, [2,3]);
  }

}
