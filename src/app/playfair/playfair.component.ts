import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-playfair',
  templateUrl: './playfair.component.html',
  styleUrls: ['./playfair.component.css']
})
export class PlayfairComponent implements OnInit {

  text = '';

  highLightedText = '';

  grid = this.generateGrid();

  row = false;
  swap = -1;

  constructor() { }

  ngOnInit() {
  }

  chunk(str, length) {
      return str.match(new RegExp('.{1,' + length + '}', 'g'));
  }

  decipherTuple(quickLookDictionary, text){
    var left = text.substr(0);
    var right = text.substr(1);

    var leftCoord = { x : -1, y : -1};
    var rightCoord = {x : -1, y : -1};


    if(quickLookDictionary[left]){

    }
    if(quickLookDictionary[right]){

    }

    //same row
    if(leftCoord.x > -1 && rightCoord.x > -1){

    }
    //same column

    //square
    return '--'
  }

  replace(){
    var replaceKey = {};
    for(var i = 0; i < this.grid.length; i++){
      for(var j = 0; j < this.grid[i].length; j++){
        if(this.grid[i][j] != '-'){
          replaceKey[ this.grid[i][j] ] = {x : i, y : j};
        }
      }
    }

    var chunks = this.chunk(this.text, 2);
    for(var i = 0; i < chunks.length; i++){
      this.decipherTuple(replaceKey, chunks[i]);
    }

  }

  generateGrid(){
    var hold = [];
    var x = 0;
    for(var i = 0; i < 5; i++){
      var row = [];
      for(var j = 0; j < 5; j++){
        row.push(x)
        x++;
      }
      hold.push(row)
    }
    return hold;
  }

  selectToShift(index, isRow){
    if(this.row == isRow){
      if(this.swap > -1){
        if(this.row){
          this.swapRow(this.swap, index)
        }else{
          this.swapColumn(this.swap, index)
        }

        this.swap = -1;
      }else{
        this.swap = index;
      }
    }else{
      this.row = isRow;
      this.swap = index;
    }

  }


  arrayRotate(arr, count) {
    count -= arr.length * Math.floor(count / arr.length);
    arr.push.apply(arr, arr.splice(0, count));
    return arr
  }

  shiftRow(row, shitAmount){
    this.arrayRotate(this.grid[row], shitAmount);
  }

  shiftColumnUp(index){
    var first = this.grid[0][index];
    for(var i = 0; i < this.grid.length - 1; i++){
      this.grid[i][index] = this.grid[i + 1][index]
    }
    this.grid[this.grid.length - 1][index] = first;
  }

  shiftColumnDown(index){
    var first = this.grid[this.grid.length - 1][index];
    for(var i = this.grid.length - 1; i > 0 ; i--){
      this.grid[i][index] = this.grid[i - 1][index]
    }
    this.grid[0][index] = first;
  }

  swapColumn(index1,index2){
    for(var i = 0; i < this.grid.length; i++){
      var hold = this.grid[i][index1];
      this.grid[i][index1] = this.grid[i][index2];
      this.grid[i][index2] = hold;
    }
  }

  swapRow(index1,index2){
    var hold =  this.grid[index1];
    this.grid[index1] = this.grid[index2];
    this.grid[index2] = hold;
  }

}
