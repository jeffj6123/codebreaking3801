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
  maxFactor = 2;
  minFactor = 4;
  frequencies = [];
  constructor(private utils: UtilsService) { }

  ngOnInit() {
  }

  public analyize() {
    this.replacedText = this.utils.stripWhiteSpaceAndFormatting(this.text);
    this.highLightedText = this.replacedText;
    this.generateRepeatedSequenceDistances(this.replacedText, [3]);
    console.log("about to generate freqs")
    this.generateNthFrequencies();
  }


  public generateNthFrequencies(){
    var frequencies = [];
    var alphabet = this.utils.alphabet;
    for(var i = 0; i < this.keyLength; i++){
      console.log("generate analysis of offset" + i);
      var normalizedFrequencies = [];
      var iSize = this.generateNthString(this.keyLength, i);
      var letterFrequencyDict = this.utils.generateLetterCountDictionary(iSize);
      var sum = this.utils.countDict(letterFrequencyDict);
      //generate letters data and normalized letter frequency dict and transformKeyList
      for(var i = 0; i < alphabet.length; i++){
        normalizedFrequencies.push(letterFrequencyDict[i] / sum);
      }
      frequencies.push(normalizedFrequencies)
    }
    return frequencies;
  }

  public generateNthString(n, offset){
    var nthString = '';
    for(var i = offset; i < this.text.length; i += n){
      nthString += this.text.charAt(i);
    }
    return nthString;
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
    for(var c = this.minFactor; c < this.maxFactor; c++){
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

          var factors = [];
          for(var x = this.minFactor; x <= this.maxFactor; x++){
            var valid = false;
            for(var y = 0; y < spacing.length; y++){
              if(spacing[y] % x == 0){
                valid = true;
                break;
              }
            }
            if(valid){
              factors.push(x);
              this.factors[x - this.minFactor] += 1
            }
          }

          validRepeatedSequences.push({sequence: key, spacings : spacing, factors: factors})
        }
      }
      sequenceLengths[i].grams = validRepeatedSequences;
    }

    console.log(sequenceLengths);
  return sequenceLengths
}

}
