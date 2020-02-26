const express = require('express');
const fs = require('fs');
const AWS = require('aws-sdk');

const app = express();

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY
});



app.get('/upload', (req, res) => {
    const testfile = {
        path: './credentials.csv'
    }
    function uploadFile(file, key, bucketname) {
        
        
        stream = fs.createReadStream(file.path);
        
        params = {
            Bucket: bucketname,
            Key: key,
            Body: stream
        }
        
        s3.upload(params, function(err, data) {
            if(err) {
                console.log(err);
            }
            
            console.log('Successfully uploaded package. key:' + key);
            console.log(data);
        });
        
    }
    uploadFile(testfile, Math.random().toString().slice(14) + '.csv', 'zw-test1');
})



app.get('/showobjects', (req, res) => {
    var params2 = {
      Bucket: 'zw-test1'
    };
    s3.listObjects(params2, function(err, data) {
      // ^^^^^aka, "show me all the items in this bucket"
      if (err) console.log(err, err.stack);
      // an error occurred
      else console.log(data);
    });
})

app.get('/download', function(req, res, next) {
  // download the file via aws s3 here
  var fileKey = '81185.csv'

  console.log('Trying to download file', fileKey);
  var options = {
    Bucket: 'zw-test1',
    Key: fileKey
  };

  res.attachment(fileKey);
  var fileStream = s3.getObject(options).createReadStream();
  fileStream.pipe(res);
});

app.listen(5000);
