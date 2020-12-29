
module.exports.handler = (event, context) => {
    console.log("event")
    console.log(JSON.stringify(event))
    console.log("context")
    console.log(JSON.stringify(context))
    return Promise.resolve({
        isBase64Encoded: false,
        headers: {
          'Content-Type': 'text/html',
        },
        statusCode: 200,
        body: JSON.stringify("success")
    })
}
