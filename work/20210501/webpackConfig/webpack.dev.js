const common = require('./webpack.common.js');

const portfinder = require('portfinder');

const devConfig = Object.assign(common, {
  mode:'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    host: '0.0.0.0',
    port:process.env.PORT || 8085,
    disableHostCheck: true,
    useLocalIp: true
  }
});


module.exports =  new Promise((resolve, reject) => {
  //查找端口号
  portfinder.getPort((err, port) => {

    if(err){
      reject(err);
      return;
    }

    //端口被占用时就重新设置evn和devServer的端口
    devConfig.devServer.port = process.env.PORT = port;

    resolve(devConfig);

  });

});