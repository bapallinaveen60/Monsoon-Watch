export const DB = {
  beginner: [],
  intermediate: [],
  advanced: [],
  master: []
}

function gen(level, prefix){
  for(let i=1;i<=20;i++){
    const id = `${prefix}${String(i).padStart(2,'0')}`
    const obj = {
      id,
      day: `Day ${i}`,
      title: `${level.charAt(0).toUpperCase()+level.slice(1)} scenario ${i}`,
      region: 'Region X',
      mapType: 'convective_burst',
      data: {TB_11:210, BTD1:-20, ΔBTD:5, stormH:12, rainRate:30},
      q: 'What is the correct forecast?',
      choices: [
        {id:'c1', text:'Option 1', correct:true, risk:'Low', rc:'#34d399', tag:'A'},
        {id:'c2', text:'Option 2', correct:false, risk:'Medium', rc:'#fbbf24', tag:'B'},
        {id:'c3', text:'Option 3', correct:false, risk:'High', rc:'#f87171', tag:'C'},
        {id:'c4', text:'Option 4', correct:false, risk:'Critical', rc:'#a78bfa', tag:'D'}
      ],
      ca: 'c1',
      expl: 'Explanation placeholder.',
      ref: 'Reference placeholder.'
    }
    DB[level].push(obj)
  }
}

gen('beginner','b')
gen('intermediate','i')
gen('advanced','a')
gen('master','m')
