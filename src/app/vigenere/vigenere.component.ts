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

  constructor(private utils: UtilsService) { }

  ngOnInit() {
  }

  public analyize() {
    this.generateRepeatedSequenceDistances(this.utils.stripWhiteSpaceAndFormatting(this.text), [3])
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

    for(var i =0; i < sequenceLengths.length; i++){
      var validRepeatedSequences = [];
      for(var key in sequenceLengths[i].grams){
        if(sequenceLengths[i].grams[key].length > 1){
          validRepeatedSequences.push({sequence: key, indexes : sequenceLengths[i].grams[key]})
        }
      }
      sequenceLengths[i].grams = validRepeatedSequences;
    }

    console.log(sequenceLengths);
  return sequenceLengths
}

}
