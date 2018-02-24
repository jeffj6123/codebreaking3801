import { Component, OnInit } from '@angular/core';
import {UtilsService} from "../utils.service";
import { ApplicationRef } from '@angular/core'
import { ViewEncapsulation } from '@angular/core'

@Component({
  selector: 'app-playfair',
  templateUrl: './playfair.component.html',
  styleUrls: ['./playfair.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class PlayfairComponent implements OnInit {

  text = '';
  textCopy = '';
  highLightedText = '';

  grid = this.generateGrid();

  row = false;
  swap = -1;

  constructor(private utils: UtilsService, private applicationRef : ApplicationRef) {}
  ngOnInit() {
  }


  analyze(){
    this.textCopy = this.utils.stripWhiteSpaceAndFormatting(this.text);
    this.highLightedText = this.textCopy;
    this.grid = this.generateGrid();

  }

  chunk(str, length) {
      return str.match(new RegExp('.{1,' + length + '}', 'g'));
  }


  decipherTuple(grid,quickLookDictionary, text){
    var left = text.charAt(0);
    var right = text.charAt(1);
    var leftCoord = { x : -2, y : -2};
    var rightCoord = {x : -3, y : -3};


    if(left in quickLookDictionary){
        leftCoord = quickLookDictionary[left];
    }else{
      return '--'
    }
    if(right in quickLookDictionary){
      rightCoord = quickLookDictionary[right];
    }else{
      return '--'
    }
    console.log(text)
    console.log(leftCoord)
    console.log(rightCoord)
    //same row
    if(leftCoord.y === rightCoord.y){
      var leftPos = leftCoord.x === 0 ? 4 :  leftCoord.x - 1 ;
      var rightPos = rightCoord.x === 0 ? 4 :  rightCoord.x - 1 ;
      console.log('new coords' + leftPos + ' ' + rightPos)
      var newLeft = grid[leftCoord.y][leftPos];
      var newRight = grid[leftCoord.y][rightPos];

      var front = newLeft.length === 0 ? '-' : newLeft;
      var back = newRight.length === 0 ? '-' : newRight;

      return front + back;
    }
    //same column
    else if(leftCoord.x === rightCoord.x){
      var leftPos = leftCoord.y === 0 ? 4 :  leftCoord.y - 1;
      var rightPos = rightCoord.y === 0 ? 4 :  rightCoord.y - 1;
      console.log("new coords" );
      var newLeft = grid[leftPos][leftCoord.x];
      var newRight = grid[rightPos][leftCoord.x];

      var front = newLeft.length === 0 ? '-' : newLeft;
      var back = newRight.length === 0 ? '-' : newRight;

      return front + back;
    }
    //square

    else{
      var corner1 = grid[leftCoord.x][rightCoord.y];
      var corner2 = grid[rightCoord.x][leftCoord.y];

      var front = corner1.length === 0 ? '-' : corner1;
      var back = corner2.length === 0 ? '-' : corner2;

      return front + back;
    }
  }

  replace(){
    console.log(this.grid)
    var replaceKey = {};
    for(var i = 0; i < this.grid.length; i++){
      for(var j = 0; j < this.grid[i].length; j++){
        if(this.grid[j][i] != '-'){
          replaceKey[ this.grid[j][i].toUpperCase() ] = {x : i, y : j};
        }
      }
    }

    var replacedText = '';
    var chunks = this.chunk(this.textCopy, 2);
    for(var i = 0; i < chunks.length; i++){
      var decipheredChunk = this.decipherTuple(this.grid, replaceKey, chunks[i]);
      replacedText += "<div class='playfair-block'>" +  chunks[i] + "<div>" + decipheredChunk + "</div></div>"
    }
    this.highLightedText = replacedText;
    console.log(replacedText)
    //this.applicationRef.tick();
  }

  generateGrid(){
    var hold = [];
    var x = 0;
    for(var i = 0; i < 5; i++){
      var row = [];
      for(var j = 0; j < 5; j++){
        row.push('-');
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
