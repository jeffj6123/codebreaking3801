import { Component, OnInit } from '@angular/core';
import {UtilsService} from "../utils.service";

@Component({
  selector: 'app-vigenere',
  templateUrl: './vigenere.component.html',
  styleUrls: ['./vigenere.component.css']
})
/**
 * General explanation for how it takes the text input and makes its initial guess
 * 1. text is taken and stored in text and a key length is taken as keyLength
 * 2. text is stripped of white space and set to uppercase
 * 3. text is stored in replacedText so all manipulations are stored there
 * 4. replacedText is used to generate a list of frequencies for each index of the key size
 * 5. list of frequencies is then used to compare to standard frequency and find which rotation of each frequency has the least
 *    amount of deviation from the standard frequency.
 * 6. shift the frequencies to the best fit as determined in step 5
 */
export class VigenereComponent implements OnInit {
  /*
   text: the text given by the user - avoid changing it
   replacedText: text generated after replacing characters from the text
   highLightedText: the actual text displayed to the right of the screen as html
   keyLength: currently selected keylength guess
   factors: list of numbers which is from minFactor(inclusive) to maxFactor(inclusive)
   frequencies: list of lists(since only strings of length are checked for spacing its effectively just a reference in the way currently) containing frequencies of letters for each index of the key
   shiftIndexes: keeps track of how shifted each index is and what letter that gives for the key
   sequences: all of the sequences found in the string
   currentlyHighLightedIndex: keeps track of which index of the key is currently meant to be highlighted
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

  /*
  showKey : knows if formmatting or key should be shown
   keySizeBlocks
   highlighting
   */
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
    //this.frequencies = this.generateNthFrequencies(this.replacedText);
    this.groupText();
  }

  public setKeySize(size){
    this.keyLength = size;
    this.frequencies = this.generateNthFrequencies(this.replacedText);
    this.highLightedText = this.replacedText;
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

  /**
   * takes in a character, letter and a number, shift and will shift the character by that much in either direction
   * NOTE: returns as an uppercase character
   * @param letter
   * @param shift
   * @returns {string}
   */
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

  /**
   * takes in an amount to shift by and what offset from 0. I.E if shifting every 3rd character starting at the 2nd char
   * in the string. this manipulates replacedText and then calls groupText to update highlightedText to display the changes
   * @param shift
   * @param offset
   */
  shiftText(shift, offset){

    //turn into a list because its easier to iterate over and change every nth element
    var splitS = this.replacedText.split('');

    for (var i = offset; i < splitS.length-1; i+=this.keyLength) {
      splitS[i] = this.shiftLetter(splitS[i], shift);
    }
    //turn back into a string
    this.replacedText = splitS.join("");

    this.groupText();
  }

  /**
   * meant to be called in the html and correspond with the < > arrow keys for rotating that frequency list by count
   * @param index
   * @param count
   */
  shiftFrequnecy(index, count) {
    //change highlightedIndex
    this.currentlyHighlightedIndex = index;

    //call shift text to update the characters of this index
    this.shiftText(-1 * count, index);

    //keep track of this info
    this.shiftIndexes[index].shift += count;
    this.shiftIndexes[index].currentChar = this.shiftLetter(this.shiftIndexes[index].currentChar, count);

    //now here we need to make a new array of the rotated frequency list by count and reassign to this.frequencies
    //because it is an input for the letter-frequency component and the only way for it to know a change happened is when a memory location of a property changes of the object
    var arr = [].concat(this.frequencies[index]);
    count -= arr.length * Math.floor(count / arr.length);
    arr.push.apply(arr, arr.splice(0, count));

    this.frequencies[index] = arr;
  }

  /**
   * This is responsible for taking the text and parsing it into multiple strings for each index of the key and then
   * generating the letter frequency for each string and then flattening that into a ordered letter frequency array.
   * It also initializes the shiftIndexes, which keep track of how much you have rotated the arrays
   *
   * ALSO if not commented out will initialize the positions of the shift indexes in an attempt to help you solve it
   * @param text
   * @returns {Array}
   */
  public generateNthFrequencies(text){
    //initialize book keeping
    this.shiftIndexes = [];
    var frequencies = [];
    var modStrings = [];
    for(var x = 0; x < this.keyLength; x++){
      modStrings.push('');
      this.shiftIndexes.push({currentChar : 'A', shift : 0});
    }
    //split the text into multiple strings for each index of the key
    var alphabet = this.utils.alphabet;
    for(var i = 0; i < text.length; i++) {
      var mod = i % this.keyLength;
      modStrings[mod] += text.charAt(i);

    }

    //now generate frequences for each index into a list
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


    //comment out if you dont want it to attempt to auto solve it for you.
        //get a list of standard letter frequency
        // var standardLetterFrequencyDict = this.utils.standardLetterFrequencyDict;
        // var alphabet = this.utils.alphabet;
        // var standardLetterFrequencyData = [];
        // for(var i = 0; i < alphabet.length; i++){
        //   standardLetterFrequencyData.push(standardLetterFrequencyDict[alphabet[i]]);
        // }
        // //go through and let auto fit make its best guess and then shift that index of the key to its guess
        // for(var i = 0; i < frequencies.length; i++){
        //   var shift = this.autoFit(frequencies[i],standardLetterFrequencyData);
        //   this.shiftFrequnecy(i, shift )
        // }
        //end auto solve

    return frequencies;
  }

  /**
   * Generates an array of objects {sequence: string, spacings: [number], factors: {number} }
   * sizes is a list of numbers for what sizes of the sequences to look for, currently just size 3 is used
   * spacings is the distance between every occurence so POW(number of spacings) for a formula for how many to expect
   * factors is a dictionary of key pairs which are just meant for quick look up on if the sequence spacings has that as a factor
   * @param text
   * @param sizes
   * @returns {Array}
   */
  generateRepeatedSequenceDistances(text, sizes: any[]){
    //make the base objects for the sequences
  var sequenceLengths = [];
  for(var i =0; i < sizes.length; i++){
    sequenceLengths.push({size: sizes[i], grams:{}})
  }
  var textLength = text.length;

  //iterate through the text length and then iterate over each sequence length
  for(i = 0; i < textLength; i++){
    for(var j = 0; j < sequenceLengths.length; j++){
      //basically while its not at the end of the string add it
      if(textLength - i - sequenceLengths[j].size >= 0){
        var g = text.substring(i, i + sequenceLengths[j].size);

        //maintain a list of the locations at which it is seen
        if(sequenceLengths[j].grams[g]){
          sequenceLengths[j].grams[g].push(i)
        }else{
          sequenceLengths[j].grams[g] = [i]
        }
      }
    }
  }

    //here is where the factors list is created
    this.factors = [];
    for(var c = this.minFactor; c <= this.maxFactor; c++){
      this.factors.push({size: c, count : 0})
    }
    //iterate over each sequence size
    for(var i =0; i < sequenceLengths.length; i++){
      var validRepeatedSequences = [];
      //for each sequence if it occurs more then once then generate POW set of differences
      for(var key in sequenceLengths[i].grams){
        var ref = sequenceLengths[i].grams[key];
        if(ref.length > 1){
          var spacing = [];
          //calculate power set of differences
          for(var x = 0; x < ref.length; x++){
            for(var y = x; y < ref.length - 1; y++)
            spacing.push(ref[y + 1] - ref[x])
          }

          //check if any spacings that was just generated has a number which is divisble by each factor
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
      //sort the sequences so that the table displays them by how spacings it has first
      validRepeatedSequences.sort(function (a,b) {
        return a.spacings.length > b.spacings.length ? -1 : 1
      });

      sequenceLengths[i].grams = validRepeatedSequences;
    }
    return sequenceLengths
  }

  /**
   * helper function for rotating arrays
   * @param arr
   * @param count
   * @returns {any}
   */
  arrayRotate(arr, count) {
    count -= arr.length * Math.floor(count / arr.length)
    arr.push.apply(arr, arr.splice(0, count))
    return arr
  }

  /**
   * neat function which actually does the guessing and is very simple.
   * take in a frequency list and a reference frequency list(should be standard frequency)
   * @param frequency
   * @param reference
   * @returns {number}
   */
  autoFit(frequency, reference){
    //initialize bookkeeping to some large value so it will get properly set
    var lowestIndex = 0;
    var indexValue = 1000;

    //make new reference
    var arr = [].concat(frequency);

    /*
    Now the logic is as follows:
    1. Compare each column and take absolute difference and make a running sum
    2. rotate the frequency and repeat step 1 until having shifted to the length of the frequency
      2.1 if the sum is less then the smallest sum found so far, keep track of it
    3. return the lowest sum found
     */
    for(var j = 0; j < frequency.length; j++){
      var value = 0;
      for(var i = 0; i < frequency.length; i++){
        value += Math.abs(arr[i] - reference[i]);
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
