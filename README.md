# serverless-save-url-as
Lambda-based micro-service to save a given URL as a JPEG, PNG, PDF, etc.



# TODO

- [ ] use S3 object ACLs to and sign access token for accessing object instead of relying simply on object key obfuscation http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
- [ ] set S3 object expiration if set to non-zero value in config.json
- [ ] fix up support for CORS
