const MAX_EVENT_LOG_SIZE = 1200;

var news = [];
var eventlog = [];
var eventlogScroll = 0;

function newNews(n, log, assetX)
{
  if(!isSimulating)
  {
    if(news.length == 0)
    {
      news.push([n, currentTime(), assetX]);
      if(log)
      {
        eventlog.push([n, currentTime(), assetX]);
      }
    }
    else
    {
      if(news[news.length - 1][0] !== n)
      {
        news.push([n, currentTime(), assetX]);
        if(log)
        {
          eventlog.push([n, currentTime(), assetX]);
        }
      }
    }
    if(eventlog.length > MAX_EVENT_LOG_SIZE)
    {
      eventlog.shift();
    }
  }
}