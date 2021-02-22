
module.exports.handler = (event, context) => {
    return Promise.resolve({
        isBase64Encoded: false,
        headers: {
          'Content-Type': 'text/html',
        },
        statusCode: 200,
        body: "success"
    })
}
