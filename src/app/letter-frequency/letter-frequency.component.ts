import { Component, OnInit, Input,  OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import {UtilsService} from "../utils.service";

@Component({
  selector: 'app-letter-frequency',
  templateUrl: './letter-frequency.component.html',
  styleUrls: ['./letter-frequency.component.css']
})
export class LetterFrequencyComponent implements OnInit, OnChanges {

  @Input()
  letterFrequencyDict;



  barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
  };
  barChartLabels:string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  barChartType:string = 'bar';
  barChartLegend:boolean = true;

  barChartData:any[] = [{data:[], label:'Letter Frequency'}, {data:[], label:' standard Letter Frequency'}];

  constructor(private utils: UtilsService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.letterFrequencyDict = changes.letterFrequencyDict.currentValue;

    this.generateGraphs();

  }

  generateGraphs(){
    var standardLetterFrequencyDict = this.utils.standardLetterFrequencyDict;

    var alphabet = this.utils.alphabet.toUpperCase().split(',');

    var LetterFrequencyData = [];
    var standardLetterFrequencyData = [];

    for(var i = 0; i < alphabet.length; i++){
      LetterFrequencyData.push(this.letterFrequencyDict[alphabet[i]]);
      standardLetterFrequencyData.push(standardLetterFrequencyDict[alphabet[i]]);
    }

    this.barChartData = [{data:LetterFrequencyData, label:'Letter Frequency'}, {data:standardLetterFrequencyData, label:'standard Letter Frequency'} ];
  }

}
