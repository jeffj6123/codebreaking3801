import { UtilsService } from '../utils.service';

interface NgraphEntry {
  name: String,
  frequency: number,
  reverseKey: string,
  reverseFrequency: number
}

export class Ngraph {

  size: number;
  entries : NgraphEntry[] = [];
  numberOfEntries: number;

  constructor(size: number, entries: NgraphEntry[]){
    this.size = size;
    this.entries = entries;
  }
}

class NgraphFactory {

  constructor(text: string, sizes: number[]){
    var nGraphLists = UtilsService.generateNGramDictionary(text,sizes);
    var sortedNGraphs = [];

    for(var i = 0; i < nGraphLists.length; i++){
      var entries = [];
      for(var key in nGraphLists[i].grams){
        entries.push({name : key, frequency : (nGraphLists[i].grams[key] /  nGraphLists[i].grams[nGraphLists[i].mostFrequent]).toPrecision(3)} )
      }

      entries.sort(function (a,b) {
        return a.frequency > b.frequency ? -1 : 1
      });

      entries = entries.splice(0,25);

      for(var j = 0; j < entries.length; j++){
        var reverseKey = entries[j].name.split("").reverse().join(""); //man I hate this
        var reverse = nGraphLists[i].grams[reverseKey] ? nGraphLists[i].grams[reverseKey] : 0;
        entries[j].reverseKey = reverseKey;
        entries[j].reverseFrequency = (reverse /  nGraphLists[i].grams[nGraphLists[i].mostFrequent]).toPrecision(3);
      }

      var ngraph = new Ngraph(nGraphLists[i].size, entries);
      sortedNGraphs.push(ngraph);
    }
  }



}
