import { Component, OnInit } from '@angular/core';
import {UtilsService} from "../utils.service";

@Component({
  selector: 'app-text-analysis',
  templateUrl: './text-analysis.component.html',
  styleUrls: ['./text-analysis.component.css']
})
export class TextAnalysisComponent implements OnInit {

  /*
  text: the text given by the user - avoid changing it
  replacedText: text generated after replacing characters from the text
  highLightedText: the actual text displayed at the bottom of the screen as html
  highlightKeys: comma separated text from the user used to know what to highlight
   */
  text = '';
  replacedText = '';
  highLightedText = '';
  highlightKeys = '';

  /*
   completeDigraphDict: consider removing - would be used for letter matrix
   lettersData: letter frequency string for displaying the letter frequency table
   nGraphs: list of n-graph data, currently only has digraph and trigraph data
   transformKey: list of objects with letter, transformkey letter pairs
   */
  completeDigraphDict = {};
  lettersData = [];
  nGraphs = [];
  transformKey = [];

  /*
  showReplaceKey used for knowing current state of hiding the replaceKey
   */
  showReplaceKey = true;

  constructor(private utils: UtilsService) {
  }
  ngOnInit() {
  }


  /*
  1. generates a replaceKeyDict which says which particular letters need to be replaced
  2. using this.text, goes through by character and see if it exists in the replaceKeyDict and if so  replaces in new text
  3. generate new n-graphs from the replaced text
  4. hightlight the text
   */
  public replace(){
    //1
    var replaceKeyDict = {};
    for(var i =0; i < this.transformKey.length; i++){
      replaceKeyDict[this.transformKey[i].letter] = this.transformKey[i].replacementLetter;
    }

    //replace text is for what is displayed
    this.replacedText = '';

    //2
    for(var j = 0; j < this.text.length; j++){
      var char = this.text.charAt(j).toUpperCase();

      //replace char if necessary
      if(replaceKeyDict[char]){
        char = replaceKeyDict[char];
      }

      this.replacedText += char;

    }

    this.replacedText = this.utils.stripWhiteSpaceAndFormatting(this.replacedText);
    //3
    this.nGraphs = this.generateSortedNgraphsLists(this.replacedText, [2,3]);
    //4
    this.highlightText();
  }

  public highlightText(){
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

    //For every match found replace with a highlighted version
    return text.replace(new RegExp(keywords, "g"), function myFunction(x) {
      return "<span class='highlight-text'>" + x + "</span>";
    })
  }

  duplicateTransform(letterTransform){
    for(var i = 0; i < this.transformKey.length; i++){
      if(this.transformKey[i].replacementLetter == letterTransform.replacementLetter && this.transformKey[i].letter != letterTransform.letter){
        return true;
      }
    }
    return false;
  }

  /**
   * generates nGraphs of the sizes passed in into a list of ngraphs with sorted lists of entries
   *
   * @param text
   * @param ngraphSizes
   * @returns {Array}
   */
  generateSortedNgraphsLists(text, ngraphSizes){
    var nGraphLists = this.utils.generateNGramDictionary(text,ngraphSizes);
    var sortedNGraphs = [];

    //assuming the first one is a size 2
    this.completeDigraphDict = nGraphLists[0].grams;

    //iterate through ngraphs given back
    for(var i = 0; i < nGraphLists.length; i++){
      //generate ngraph object
      var g = {name : nGraphLists[i].size, entries : [] };
      //create and sort list of all of the ngraph dict
      for(var key in nGraphLists[i].grams){
        g.entries.push({name : key, frequency : (nGraphLists[i].grams[key] /  nGraphLists[i].grams[nGraphLists[i].mostFrequent]).toPrecision(3)} )
      }

      g.entries.sort(function (a,b) {
        return a.frequency > b.frequency ? -1 : 1
      });
      //take top 25 entries
      g.entries = g.entries.splice(0,25);

      //grab the reverse values
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

  /**
   *
   */
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
    for(var i = 0; i < alphabet.length; i++){
      this.lettersData.push({letter : alphabet[i], frequency : (letterFrequencyDict[alphabet[i]] / sum).toPrecision(3), count: letterFrequencyDict[alphabet[i]] })

      if(letterFrequencyDict[alphabet[i]] > 0){
        this.transformKey.push({letter: alphabet[i], replacementLetter : alphabet[i]})
      }
    }


    this.lettersData.sort(function (a,b) {
      return a.count > b.count ? -1 : 1
    });


    this.nGraphs = this.generateSortedNgraphsLists(copyText, [2,3]);
  }

}
