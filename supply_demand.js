const NewsAPI = require('newsapi');
//import NewsAPI from "newsapi";
const newsapi = new NewsAPI('17e3007b2e614b839579e938f14c942b');
//import googleTrends from "google-trends-api"
const googleTrends = require('google-trends-api');
const begin_date = new Date("04/06/2022");
const till_date = new Date("04/09/2022");
const word = "Bitcoin"

getNewsTicker(word, begin_date, till_date);

async function getNewsTicker(keyword, start_date, end_date){
  const supply_promise = supply_query(keyword, start_date, end_date);
  const supply = await supply_promise;

  if (start_date == null){
    //start_date = new Date((Date.now()));
    start_date = new Date("2022-03-22");
  }
  if (end_date == null){
    //end_date = new Date(Date.get());
    end_date = new Date("2022-04-21");
  }
  

  supply_json = JSON.stringify(supply);
  console.log(supply_json);

  const demand_promise = demand_query(keyword, start_date, end_date);
  demand = await demand_promise;
  demand_json = JSON.stringify(demand);
  console.log(demand_json);

  const line_json = supply_json.concat(demand_json);

  //sources = await source_query(keyword)
  //console.log(sources);

  //source_json = JSON.stringify(source_query());

  return JSON.stringify("LINE: " + line_json);
}

async function demand_query(keyword, start_date, to_date){
  trend_results = await googleTrends.interestOverTime({keyword: keyword, startTime: start_date/*new Date(Date.now() - (30 * 24 * 60 * 60 * 1000))*/});
  trend = JSON.parse(trend_results);
  var result = new Array();
  let dateOne = new Date(start_date);
  let dateTwo = new Date(to_date);
  count = 0;
  for(var i = dateOne; i<= dateTwo; i.setDate(i.getDate()+1)) {
    //console.log(new Date(trend.default.timelineData[count].formattedTime).toISOString().split('T')[0]);
    cur_date = new Date(trend.default.timelineData[count].formattedTime).toISOString().split('T')[0];
    result.push({
      date: cur_date,
      value: trend.default.timelineData[count].value[0],
      type: "damand"
    });
  }
  return result;
}
async function supply_query(keyword, start_date, to_date){
  //var arr_name:datatype[][]
  var result = new Array();
  let count = 0;
  let dateOne = new Date(start_date);
  let dateTwo = new Date(to_date);
  let highest = 0;
  
  console.log("start date:" + start_date);
  console.log("end date: " + to_date);
  for(var i = dateOne; i<= dateTwo; i.setDate(i.getDate()+1)){
    //tomorrow = new Date(i+1);
    today = await newsapi.v2.everything({
      q: keyword,
      from: i.toISOString().split('T')[0],
      to: i.toISOString().split('T')[0],
      sortBy: 'popularity',
      pageSize: 3
    });
    obj = {q: keyword,
    from: i.toISOString().split('T')[0],
    to: i.toISOString().split('T')[0],
    sortBy: 'popularity',
    pageSize: 3}
    console.log(obj);
    //today = await today_promise;
    if (highest < today.totalResults) {highest = today.totalResults;}
    date = i.toISOString().split('T')[0];
    result.push({
      date: date,
      value: today.totalResults,
      type: "supply"
    });
    console.log(today.totalResults)
  }
  //result.map(item=>({...item,value:item.value/highest*100}))
  return result.map(item=>({...item,value:item.value/highest*100}));
}

//console.log(histogram(testCase));
/*
async function source_query(keyword) {
  sources_promise = newsapi.v2.sources({
    category: keyword,
    language: 'en',
    country: 'us'
  })
    
  let source = await sources_promise;

  return sources_promise.reduce((result, entry, index) => {
    if (!result[source.sources.id]) {
      result[source.sources.id] = 0;
    }
    result[source.sources.id]++;
    return result;
  }, {});
}*/

function histogram(data) {
  return data.reduce((result, entry, index) => {
    let date = new Date(entry.timestamp).toISOString().split('T')[0];

    if (!result[date]) {
      result[date] = 0;
    }
    result[date]++;
    return result;
  }, {});
}



/*
async function source_query(Source_id){
  const sourceMap = array.map(publisher=>publisher.id)

  sources_promise = newsapi.v2.sources({
    category: keyword,
    language: 'en',
    country: 'us'
  });

  source_string = await sources_promise;

  const arrayMap = source.map(s=>s.id)

  listOfAllIds.from(new Set(arrayMap))


  let mostPopular = {arrayName: null, howMany: null}
  let leastPopular = {arrayName: null, howMany: null}

  listOfAllIds.forEach((id, index) => {
    const times = myArray.filter(x => x == id).length;
    if (times > mostPopular.howMany) {
      mostPopular = {arrayName: id, howMany: times}
    }

    if (times < leastPopular.howMany) {
      mostPopular = {arrayName: id, howMany: times}
    }
  })
}*/
