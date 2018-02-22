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
  vowelStandardDeviation = 0;

  columnIndexs = [];

  swap = -1;

  constructor(private utils: UtilsService) {
  }

  ngOnInit() {
  }

  analyze() {
    this.highLightedText = this.utils.stripWhiteSpaceAndFormatting(this.text).toUpperCase();
    console.log(this.highLightedText.length)
    console.log(this.factors(this.highLightedText.length))
    this.allFactors = this.factors(this.highLightedText.length)

  }

  changeGridSize(size) {
    console.log(this.splitTextToColumns(this.highLightedText, size))
    console.log(this.splitTextToRows(this.highLightedText, size))
    this.matrix = this.splitTextToRows(this.highLightedText, size)
    var vowelData = this.generateVowelCounts(this.matrix);
    this.vowelStandardDeviation = vowelData.stdDev
    this.vowels = vowelData.improvedVowelCountData;

    this.columnIndexs = [];
    for (var i = 1; i <= size; i++) {
      this.columnIndexs.push(i)
    }
  }

  factors(num) {
    var allFactors = [];

    for (var i = 0; i <= num; i++) {
      if (num % i === 0) {
        allFactors.push(i);
      }
    }
    return allFactors
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

    var average = total / vowelCounts.length;

    var improvedVowelCountData = [];
    for (var i = 0; i < vowelCounts.length; i++) {
      improvedVowelCountData.push({
        'count': vowelCounts[i], 'percentage': ((vowelCounts[i] / grid[i].length) * 100).toPrecision(3)
      })
    }


    var stdDev = this.standardDeviation(vowelCounts);
    console.log(stdDev)
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
      this.generateNewText();
      this.swap = -1;
    } else {
      this.swap = index;
    }
  }

  generateNewText(){
    var newText = '';
    for(var i = 0; i < this.matrix.length; i++){
      newText += this.matrix[i].join();
    }

    this.highLightedText = newText;
  }

}
