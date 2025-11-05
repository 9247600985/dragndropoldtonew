let counter = 1;
module.exports = [
    "/prosoftdata1/*",
    "/prosoftdata2/*",
    "/prosoftdata3/*"
  ].reduce(function (config, src) {
    let pathRewrite = {}; 
    pathRewrite["^/prosoftdata"+counter] = '/prosoftdata';
    config[src] = {
      "host": "thiragati-cloud"+counter+".herokuapp.com",
      "protocol": "https:",
      "port": 443,
      "pathRewrite": pathRewrite
    };
    counter++;
    console.log('config');
    console.log(config);    
    return config;
  }, {});