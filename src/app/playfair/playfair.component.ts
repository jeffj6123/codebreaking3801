import { Component, OnInit } from '@angular/core';
import {UtilsService} from "../utils.service";
import { ApplicationRef } from '@angular/core'
import { ViewEncapsulation, ChangeDetectorRef  } from '@angular/core'

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

  grid = [];

  row = false;
  swap = -1;

  showDecipheredText = false;
  decipheredText = '';

  constructor(private utils: UtilsService, private applicationRef : ApplicationRef, private cdr:ChangeDetectorRef) {}
  ngOnInit() {
  }

  changeShowDecipheredText(){
    this.showDecipheredText = ! this.showDecipheredText;
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

    //same row
    if(leftCoord.y === rightCoord.y){
      var leftPos = leftCoord.x === 0 ? 4 :  leftCoord.x - 1 ;
      var rightPos = rightCoord.x === 0 ? 4 :  rightCoord.x - 1 ;
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
      var newLeft = grid[leftPos][leftCoord.x];
      var newRight = grid[rightPos][leftCoord.x];

      var front = newLeft.length === 0 ? '-' : newLeft;
      var back = newRight.length === 0 ? '-' : newRight;

      return front + back;
    }
    //square

    else{
      var corner1 = grid[leftCoord.y][rightCoord.x];
      var corner2 = grid[rightCoord.y][leftCoord.x];

      var front = corner1.length === 0 ? '-' : corner1;
      var back = corner2.length === 0 ? '-' : corner2;

      return front + back;
    }
  }

  replace(x = -1,y = -1){
    setTimeout( () => {

    var changedChar = '  ';
    if(x >= 0 && y >= 0){
      changedChar = this.grid[x][y];
    }

    var validChar = this.utils.isLetter(changedChar);

    var replaceKey = {};
    for(var i = 0; i < this.grid.length; i++){
      for(var j = 0; j < this.grid[i].length; j++){
        if(this.grid[j][i].toUpperCase() === changedChar.toUpperCase() && (j !== x  || i !== y)){
          this.grid[j][i] = '-';
        }

        if(this.grid[j][i] != '-'){
          replaceKey[ this.grid[j][i].toUpperCase() ] = {x : i, y : j};
        }
        document.getElementById(i + '  ' + j)['value'] = this.grid[i][j];
      }
    }

      var decipheredText = ''
      var replacedText = '';
      var chunks = this.chunk(this.textCopy, 2);
      for (var i = 0; i < chunks.length; i++) {
        var decipheredChunk = this.decipherTuple(this.grid, replaceKey, chunks[i]).toUpperCase();
        decipheredText += decipheredChunk

        if (validChar &&
          (decipheredChunk.charAt(0) === changedChar.toUpperCase() ||
            decipheredChunk.charAt(1) === changedChar.toUpperCase() ||
          chunks[i].charAt(0) === changedChar.toUpperCase() ||
          chunks[i].charAt(1) === changedChar.toUpperCase() ) &&
          (this.utils.isLetter(decipheredChunk.charAt(0)) || this.utils.isLetter(decipheredChunk.charAt(1)))
          ) {
          decipheredChunk = "<span class='selected-text'>" + decipheredChunk + "</span>"
          }
        replacedText += "<div class='playfair-block'>" + chunks[i] + "<div>" + decipheredChunk + "</div></div>"
      }
      this.decipheredText = decipheredText
      this.highLightedText = replacedText;
    }, 0);

  }



  generateGrid(){
    var hold = [];
    var x = 0;
    for(var i = 0; i < 5; i++){
      var row = [];
      for(var j = 0; j < 5; j++){
        row.push('');
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

  fullRotate(shiftAmount){
    for(var i = 0; i < this.grid.length; i ++){
      this.shiftRow(i, shiftAmount);
    }
    this.replace();
  }

  shiftRow(row, shitAmount){
    this.arrayRotate(this.grid[row], shitAmount);

    this.replace();
  }

  fullShiftUp(){
    for(var i = 0; i < this.grid.length; i++){
      this.shiftColumnUp(i)
    }
  }

  fullShiftDown(){
    for(var i = 0; i < this.grid.length; i++){
      this.shiftColumnDown(i)
    }
  }

  shiftColumnUp(index){
    var first = this.grid[0][index];
    for(var i = 0; i < this.grid.length - 1; i++){
      this.grid[i][index] = this.grid[i + 1][index]
    }
    this.grid[this.grid.length - 1][index] = first;
    this.replace();

  }

  shiftColumnDown(index){
    var first = this.grid[this.grid.length - 1][index];
    for(var i = this.grid.length - 1; i > 0 ; i--){
      this.grid[i][index] = this.grid[i - 1][index]
    }
    this.grid[0][index] = first;
    this.replace();

  }

  swapColumn(index1,index2){
    for(var i = 0; i < this.grid.length; i++){
      var hold = this.grid[i][index1];
      this.grid[i][index1] = this.grid[i][index2];
      this.grid[i][index2] = hold;
    }
    this.replace();

  }

  swapRow(index1,index2){
    var hold =  this.grid[index1];
    this.grid[index1] = this.grid[index2];
    this.grid[index2] = hold;

    this.replace();

  }

  importKey(key, fill){
    var importedKey = this.utils.uniqueString(key.toUpperCase());
    var splitKey = importedKey.split('');

    var alphabet = 'a,b,c,d,e,f,g,h,i,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'.toUpperCase().split(',');
    if(fill){
      for(var i = 0; i < alphabet.length; i++){
        if(!splitKey.includes(alphabet[i])){
            splitKey.push(alphabet[i]);
        }
      }
    }
    this.grid = this.generateGrid();

    for(var i = 0; i < 5; i++){
      for(var j = 0; j < 5; j++){
        this.grid[i][j] = splitKey[i * 5 + j];
      }
    }
    this.replace();

  }

}
