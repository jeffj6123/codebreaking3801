import { Component, OnInit } from '@angular/core';
import {UtilsService} from "../utils.service";

@Component({
  selector: 'app-vigenere',
  templateUrl: './vigenere.component.html',
  styleUrls: ['./vigenere.component.css']
})
export class VigenereComponent implements OnInit {
  /*
   text: the text given by the user - avoid changing it
   replacedText: text generated after replacing characters from the text
   highLightedText: the actual text displayed at the bottom of the screen as html
   highlightKeys: comma separated text from the user used to know what to highlight
   */
  text = '';
  replacedText = '';
  highLightedText = '';
  keyLength = 3;
  factors = [];
  maxFactor = 20;
  minFactor = 2;
  frequencies = [];
  shiftIndexes = [];
  sequences = [];
  currentlyHighlightedIndex = 0;

  showKey = true;

  keySizeBlocks = true;
  highlighting = true;

  constructor(private utils: UtilsService) { }

  ngOnInit() {
  }

  public analyize() {
    this.replacedText = this.utils.stripWhiteSpaceAndFormatting(this.text);
    this.highLightedText = this.replacedText;
    this.sequences = this.generateRepeatedSequenceDistances(this.replacedText, [3]);
    this.frequencies = this.generateNthFrequencies(this.replacedText);
    this.groupText();
  }

  public reformat() {
    this.groupText();
  }


  groupText(){
    var padding = 0;
    var text = this.replacedText;
    if(this.keySizeBlocks) {
      text = text.match(new RegExp('.{1,' + this.keyLength + '}', 'g')).join(' ');
      padding = 1;
    }

    if(this.highlighting) {
      var newText = '';
      for (var i = 0; i < text.length; i++) {
        if (i % (this.keyLength + padding) != this.currentlyHighlightedIndex) {
          newText += text.charAt(i);
        } else {
          newText += "<span class='highlight-text'>" + text.charAt(i) + "</span>";
        }
      }
        text = newText
      }
    this.highLightedText = "<div class='replaced-text'>" + text + "</div>";

  }

  shiftLetter(letter, shift){
    letter = letter.toUpperCase();
    var letterCode = letter.charCodeAt(0);
    letterCode += shift;
    letterCode -= 65;
    if(letterCode < 0){
      letterCode = 26 + letterCode;
    }
    letterCode = letterCode % 26;
    letterCode += 65;
    return String.fromCharCode(letterCode);
  }

  shiftText(shift, offset){

    var splitS = this.replacedText.split('');

    for (var i = offset; i < splitS.length-1; i+=this.keyLength) {
      splitS[i] = this.shiftLetter(splitS[i], shift);
    }
    this.replacedText = splitS.join("");

    this.groupText();
  }

  shiftFrequnecy(index, count) {
    this.currentlyHighlightedIndex = index;
    this.shiftText(-1 * count, index);
    this.shiftIndexes[index].shift += count;
    this.shiftIndexes[index].currentChar = this.shiftLetter(this.shiftIndexes[index].currentChar, count);
    var arr = [].concat(this.frequencies[index]);
    count -= arr.length * Math.floor(count / arr.length);
    arr.push.apply(arr, arr.splice(0, count));

    this.frequencies[index] = arr;
  }

  public generateNthFrequencies(text){
    this.shiftIndexes = [];
    var frequencies = [];
    var modStrings = [];
    for(var x = 0; x < this.keyLength; x++){
      modStrings.push('');
      this.shiftIndexes.push({currentChar : 'A', shift : 0});
    }
    var alphabet = this.utils.alphabet;
    for(var i = 0; i < text.length; i++) {
      var mod = i % this.keyLength;
      modStrings[mod] += text.charAt(i);

    }

    for(var x = 0; x < modStrings.length; x++){
      var normalizedFrequencies = [];
      var letterFrequencyDict = this.utils.generateLetterCountDictionary(modStrings[x]);
      var sum = this.utils.countDict(letterFrequencyDict);
      //generate letters data and normalized letter frequency dict and transformKeyList
      for(var i = 0; i < alphabet.length; i++){
        normalizedFrequencies.push(letterFrequencyDict[alphabet[i]] / sum);
      }
      frequencies.push(normalizedFrequencies)
    }

    var standardLetterFrequencyDict = this.utils.standardLetterFrequencyDict;
    var alphabet = this.utils.alphabet;
    var standardLetterFrequencyData = [];
    for(var i = 0; i < alphabet.length; i++){
      standardLetterFrequencyData.push(standardLetterFrequencyDict[alphabet[i]]);
    }

    for(var i = 0; i < frequencies.length; i++){
      var shift = this.autoFit(frequencies[i],standardLetterFrequencyData);
      this.shiftFrequnecy(i, shift )
    }

    return frequencies;
  }

  generateRepeatedSequenceDistances(text, sizes: any[]){
  var sequenceLengths = [];
  for(var i =0; i < sizes.length; i++){
    sequenceLengths.push({size: sizes[i], grams:{}})
  }
  var textLength = text.length;

  for(i = 0; i < textLength; i++){
    for(var j = 0; j < sequenceLengths.length; j++){
      if(textLength - i - sequenceLengths[j].size >= 0){
        var g = text.substring(i, i + sequenceLengths[j].size);

        if(sequenceLengths[j].grams[g]){
          sequenceLengths[j].grams[g].push(i)
        }else{
          sequenceLengths[j].grams[g] = [i]
        }
      }
    }
  }

    this.factors = [];
    for(var c = this.minFactor; c <= this.maxFactor; c++){
      this.factors.push({size: c, count : 0})
    }

    for(var i =0; i < sequenceLengths.length; i++){
      var validRepeatedSequences = [];
      for(var key in sequenceLengths[i].grams){
        var ref = sequenceLengths[i].grams[key];
        if(ref.length > 1){
          var spacing = [];
          for(var x = 0; x < ref.length; x++){
            for(var y = x; y < ref.length - 1; y++)
            spacing.push(ref[y + 1] - ref[x])
          }

          var factors = {};
          for(var x = this.minFactor; x <= this.maxFactor; x++){
            var valid = false;
            for(var y = 0; y < spacing.length; y++){
              if(spacing[y] % x == 0){
                valid = true;
                break;
              }
            }
            if(valid){
              factors[x] = true;
              this.factors[x - this.minFactor].count += 1
            }
          }
          validRepeatedSequences.push({sequence: key, spacings : spacing, factors: factors})
        }
      }
      validRepeatedSequences.sort(function (a,b) {
        return a.spacings.length > b.spacings.length ? -1 : 1
      });

      sequenceLengths[i].grams = validRepeatedSequences;
    }
    console.log(validRepeatedSequences)

    return sequenceLengths
  }


  arrayRotate(arr, count) {
    count -= arr.length * Math.floor(count / arr.length)
    arr.push.apply(arr, arr.splice(0, count))
    return arr
  }

  autoFit(frequency, reference){
    var lowestIndex = 0;
    var indexValue = 1000;

    var arr = [].concat(frequency);

    for(var j = 0; j < frequency.length; j++){
      var value = 0;
      for(var i = 0; i < frequency.length; i++){
        value += Math.abs(arr[i] - reference[i]);
        //console.log(arr[i].toString() + ' ' + reference[i] +  ' ' + value)
      }
      if(value < indexValue){
        lowestIndex = j;
        indexValue = value
      }

      arr = this.arrayRotate(arr, 1)
    }
    console.log( String.fromCharCode(65 + lowestIndex));
    return lowestIndex;
  }

}
