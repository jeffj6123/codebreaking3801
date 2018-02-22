import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  alphabet = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'.toUpperCase().split(',');
  standard_letter_frequency = `A,.08167
B,.01492
C,.02782
D,.04253
E,.12702
F,.02288
G,.02015
H,.06094
I,.06966
J,.00153
K,.00772
L,.04025
M,.02406
N,.06749
O,.07507
P,.01929
Q,.00095
R,.05987
S,.06327
T,.09056
U,.02758
V,.00978
W,.02360
X,.00150
Y,.01974
Z,.00074`;
  standardLetterFrequencyDict = this.generateStandardLetterFrequencyDict(this.standard_letter_frequency);

  constructor() {}


  /**
   * generates a dictionary of letter, frequency pairs which sum to 1,
   * where the format is character,frequency \n
   * @param standardLetterFrequency
   * @returns {{}}
   */
  public generateStandardLetterFrequencyDict(standardLetterFrequency){

    var list = standardLetterFrequency.split('\n');
    var dict = {};
    for(var i = 0; i < list.length; i++){
      var splitString = list[i].split(',');
      dict[splitString[0]] = parseFloat(splitString[1])
    }

    return dict;
  };

  /**
   * generate a dictionary where each key is a character from the alphabet with a default value of 0.
   * @param alphabet
   * @returns {{}}
   */
  public generateLetterDictionary(alphabet){
    var emptyLetterDict = {};
    for(var i = 0; i < alphabet.length; i++){
      emptyLetterDict[alphabet[i]] = 0;
    }
    return emptyLetterDict
  };

  /**
   * generates a dictionary of letter frequency counts from a text from an approved
   * list of characters with the default being english alphabet
   * @param text
   * @param alphabet
   * @returns {{}}
   */
  public generateLetterCountDictionary(text, alphabet = this.alphabet){
    var lettersCountDict = this.generateLetterDictionary(alphabet);
    for(var i = 0; i < text.length; i++){
      var char = text.charAt(i).toUpperCase();
      if(char in lettersCountDict){
        lettersCountDict[char] += 1;
      }
    }
    return lettersCountDict;
  };

  /**
   * Generates a sum from a dictionary of just key : number
   * @param dict
   * @returns {number}
   */
  public countDict(dict){
    var count = 0;
    for(let key in dict){
      count += dict[key]
    }
    return count;
  }

  /**
   * Generates an ordered(decreasing frequency) letter frequency list, which sums to 1 of given text of the
   * characters in the alphabet with the default being the standard english alphabet.
   * @param text
   * @param alphabet
   * @returns {Array}
   */
  public generateOrderedLetterFrequencyList(text, alphabet = this.alphabet) {
    var lettersCountDict = this.generateLetterCountDictionary(text, alphabet);

    var orderedList = [];

    var count = this.countDict(lettersCountDict)

    for(var key in lettersCountDict){
      orderedList.push({
        letter : key,
        count : lettersCountDict[key],
        frequency : (lettersCountDict[key] / count).toPrecision(5)
      })
    }
    return orderedList;
  };

  public generateNGramDictionary(text, nSizes: any[]){
    var nGrams = [];
    for(var i =0; i < nSizes.length; i++){
      nGrams.push({size: nSizes[i], grams:{}, mostFrequent : null})
    }
    var textLength = text.length;

    for(i = 0; i < textLength; i++){
      for(var j = 0; j < nGrams.length; j++){
        if(textLength - i - nGrams[j].size >= 0){
          var g = text.substring(i, i + nGrams[j].size);

          if(nGrams[j].grams[g]){
            nGrams[j].grams[g] += 1
          }else{
            nGrams[j].grams[g] = 1
          }
          //if set check, otherwise initialize
          if(nGrams[j].mostFrequent){
            if(nGrams[j].grams[g] > nGrams[j].grams[nGrams[j].mostFrequent]){
              nGrams[j].mostFrequent = g;
            }

          }else{
            nGrams[j].mostFrequent = g;
          }

        }
      }
    }

    return nGrams
  }

  public sortNgramDictToList(ngramDict){

    var ngrams = [];
    for(let key in ngramDict){
      ngrams.push({name : key, count: ngramDict[key]})
    }
    ngrams.sort(function(a,b){
      return a.count > b.count ? -1 : 1
    })
    return ngrams
  }
  /**
   * stripes whitespace and new line characters
   * @param text
   * @returns {string}
   */
  public stripWhiteSpaceAndFormatting(text){
    return text.replace(/\W+/g, "").trim();
  }

  public factors(num) {
    var allFactors = [];

    for (var i = 0; i <= num; i++) {
      if (num % i === 0) {
        allFactors.push(i);
      }
    }
    return allFactors
  }

}
