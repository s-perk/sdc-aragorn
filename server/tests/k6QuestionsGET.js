const http = require('k6/http')
const {check, sleep} = require('k6')

module.exports = {
  options: {
    stages: [
      { duration: '20s', target: 1 },
      { duration: '10s', target: 10 },
      { duration: '10s', target: 50 }

    ],
    thresholds: {
      http_req_duration: ['p(90)<20', 'p(95)<50', 'p(100)<200']
    }
  },
  default: function () {

    const pages = [
      // '/qa/questions/?product_id=37325',
      '/qa/questions/131217/answers',
      // '/this-does-not-exist/',
    ]

    for (let page of pages) {
      const res = http.get('http://localhost:3000' + page);
      check(res, {
        'status was 200': (r) => r.status === 200,
        'duration was <= 20ms': (r) => r.timings.duration <= 20,
        'duration was <= 50ms': (r) => r.timings.duration <= 50,
        'duration was <= 200ms': (r) => r.timings.duration <= 200,
      });
      sleep(1);
    }
  }

}
