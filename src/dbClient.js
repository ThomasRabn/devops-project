var redis = require("redis");
const configure = require('./configure')

const config = configure()
var client = redis.createClient({
  host: process.env.REDIS_URL || config.redis.host,
  port: config.redis.port,
  retry_strategy: () => {
    return new Error("Retry time exhausted")
  }
})

process.on('SIGINT', function() {
  client.quit();
});

module.exports = client
