var fs = require('fs')
  , express = require('express')
  , app = express()
  , port = process.argv[2]
  , filePath = process.argv[3]

if (!port) {
  console.error('Must specify a port')
  process.exit(1)
}

if (!filePath) {
  console.error('Must specify a file path')
  process.exit(1)
}

var filePathParts = filePath.split('/')
  , fileName = filePathParts[filePathParts.length - 1]

app.get('/' + fileName, function (req, res) {
  var fileStream = fs.createReadStream(filePath)
  fileStream.pipe(res)
})

app.listen(port, function () {
  if (process.send) {
    process.send({ ready: true })
  }
})

process.on('message', function (msg) {
  if (msg.close) {
    process.exit(0)
  }
})
