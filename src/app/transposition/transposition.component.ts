import {Component, OnInit} from '@angular/core';
import {UtilsService} from "../utils.service";

@Component({
  selector: 'app-transposition',
  templateUrl: './transposition.component.html',
  styleUrls: ['./transposition.component.css']
})
export class TranspositionComponent implements OnInit {

  text = '';
  highLightedText = '';
  allFactors = [];

  matrix = [];
  vowels = [];
  vowelStandardDeviation = '';
  averageVowels = '';

  columnIndexs = [];

  swap = -1;

  digraphs = [];
  trigraphs = [];

  canLock = false;
  lockStates = [];

  constructor(private utils: UtilsService) {
  }

  ngOnInit() {
  }

  analyze() {
    this.text = this.text.toUpperCase();
    this.highLightedText = this.utils.stripWhiteSpaceAndFormatting(this.text).toUpperCase();
    this.allFactors = this.utils.factors(this.highLightedText.length);

    this.matrix = [];

  }

  changeGridSize(size) {
    this.text = this.text.toUpperCase();

    this.text = this.utils.stripWhiteSpaceAndFormatting(this.text);
    this.matrix = this.splitTextToRows(this.text, size);
    var vowelData = this.generateVowelCounts(this.matrix);
    this.vowelStandardDeviation = vowelData.stdDev;
    this.vowels = vowelData.improvedVowelCountData;
    this.generateNewText();
    this.columnIndexs = [];
    for (var i = 1; i <= size; i++) {
      this.columnIndexs.push(i)
    }
  }



  splitTextToColumns(text, size) {
    var length = text.length;
    var columns = [];
    for (var i = 0; i < size; i++) {
      columns.push(text.substring((i / size) * length, ((i + 1 ) / size) * length))
    }

    return columns;
  }

  splitTextToRows(text, size) {
    var length = text.length / size;
    var rows = [];

    for (var i = 0; i < length; i++) {
      rows.push([])
    }

    for (var i = 0; i < text.length; i++) {
      rows[i % length].push(text.charAt(i))
    }

    return rows;
  }

  countVowels(listOfLetters) {
    var vowels = ['A', 'E', 'I', 'O', 'U'];
    var vowelCount = 0;
    for (var i = 0; i < listOfLetters.length; i++) {
      if (vowels.includes(listOfLetters[i])) {
        vowelCount++;
      }
    }
    return vowelCount;
  }

  generateVowelCounts(grid) {
    var vowelCounts = [];
    var total = 0;

    for (var i = 0; i < grid.length; i++) {
      var c = this.countVowels(grid[i]);
      vowelCounts.push(c);
      total += c
    }

    this.averageVowels = (total / vowelCounts.length).toPrecision(3);

    var improvedVowelCountData = [];
    for (var i = 0; i < vowelCounts.length; i++) {
      improvedVowelCountData.push({
        'count': vowelCounts[i], 'percentage': ((vowelCounts[i] / grid[i].length) * 100).toPrecision(3)
      })
    }


    var stdDev = this.standardDeviation(vowelCounts).toPrecision(4);
    return {'improvedVowelCountData': improvedVowelCountData, 'stdDev': stdDev};
  }

  standardDeviation(values) {
    var avg = this.average(values);

    var squareDiffs = values.map(function (value) {
      var diff = value - avg;
      var sqrDiff = diff * diff;
      return sqrDiff;
    });

    var avgSquareDiff = this.average(squareDiffs);

    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
  }

  average(data) {
    var sum = data.reduce(function (sum, value) {
      return sum + value;
    }, 0);

    var avg = sum / data.length;
    return avg;
  }

  swapColumn(array, index1, index2) {
    var hold = array[index1];
    array[index1] = array[index2];
    array[index2] = hold;

  }

  arrayRotate(arr, count) {
    count -= arr.length * Math.floor(count / arr.length);
    arr.push.apply(arr, arr.splice(0, count));
    return arr
  }

  shift(shiftAmount) {
    var movableColumns = [];
    this.arrayRotate(this.columnIndexs, shiftAmount);
    for (var i = 0; i < this.matrix.length; i++) {
      this.arrayRotate(this.matrix[i], shiftAmount);
    }
    this.generateNewText();

  }

  selectToShift(index) {
    if (this.swap > -1) {
      for (var i = 0; i < this.matrix.length; i++) {
        this.swapColumn(this.matrix[i], this.swap, index);
      }
      this.swapColumn(this.columnIndexs, this.swap, index);
      this.swapColumn(this.lockStates, this.swap, index);

      this.generateNewText();
      this.swap = -1;
    } else {
      this.swap = index;
    }
  }

  generateNewText(){
    var newText = '';
    for(var i = 0; i < this.matrix.length; i++){
      newText += this.matrix[i].join('');
    }

    this.highLightedText = newText;
    var ngrams = this.utils.generateNGramDictionary(this.highLightedText, [2,3])
    this.digraphs = this.utils.sortNgramDictToList(ngrams[0].grams).slice(0,15);
    this.trigraphs = this.utils.sortNgramDictToList(ngrams[1].grams).slice(0,15);

  }

  getLockState(){
    return this.lockStates[this.swap];
  }

  ChangeColumnLockState(){
    this.lockStates[this.swap] = !this.lockStates[this.swap];
    this.swap = -1;
  }
}
