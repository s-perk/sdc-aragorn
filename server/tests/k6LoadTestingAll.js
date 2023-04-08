const http = require('k6/http')
const {check, sleep} = require('k6')

module.exports = {
  options: {
    stages: [
      { duration: '5s', target: 10 },
      { duration: '20s', target: 20 },
      { duration: '2s', target: 0 }

    ],
  },
  default: function () {

    const pages = [
      '/qa/questions/?product_id=37325',
      '/qa/questions/131217/answers',
      // '/this-does-not-exist/',
    ]

    for (let page of pages) {
      const res = http.get('http://localhost:3000' + page);
      check(res, {
        'status was 200': (r) => r.status === 200,
        'duration was <= ': (r) => r.timings.duration <= 200
      });
      sleep(1);
    }
  }

}
