'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({'input': rs, 'output': {} });
const prefectureDataMap = new Map();    //key:都道府県、value：集計データオブジェクト
// イベント駆動型プログラミング
// ：あらかじめイベントが発生したときに実行される関数を設定しておいて、起こったイベントに応じて処理を行うこと
rl.on('line', (linestring) => {
  // console.log(linestring);
  const columns = linestring.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[2]);
  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture);
    if (!value) {
      value = {
        popu10:0,
        popu15:0,
        change:null
      };
    }
    if(year === 2010) {
      value.popu10 = popu;
    }else if (year === 2015) {
      value.popu15 = popu;
    }
    prefectureDataMap.set(prefecture,value);
      // console.log(year);
      // console.log(prefecture);
      // console.log(popu);

  }
} );
rl.on('close', () => {
  for (let [key,value] of prefectureDataMap) {
    value.change = value.popu15 / value.popu10;
  }
  // 並び替え。
  const rankingArray = Array.from(prefectureDataMap).sort((pair1,pair2) => {
    return pair2[1].change - pair1[1].change;
  });
  // 表示用に文字列を変換。
  // rankingArrayに格納されている、変化率順にソートされたデータについて、Map関数で文字列結合したものをrankingStringsに格納。
  // rankingStringsを表示させて終了する
  const rankingStrings = Array.from(rankingArray).map(([key,value]) => {
    return key + ':' + value.popu10 + '=> ' + value.popu15 + '：変化率：' + value.change;
  } );
  console.log(rankingStrings);
})
