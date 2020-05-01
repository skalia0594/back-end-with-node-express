This is project to creaate API call with node and express.

run config.json file



Test cases:

go to browser and search

http://localhost:3000/api/ping     ====> status: 200
http://localhost:3000/api/posts     ====> status: 400
http://localhost:3000/api/posts?tags=his     ====> status: 200  (0 record)
http://localhost:3000/api/posts?tags=history    ====> status: 200
http://localhost:3000/api/posts?tags=history,tech  ====> status: 200
http://localhost:3000/api/posts?tags=history,te  ====> status: 200 (0 record)
http://localhost:3000/api/posts?tags=his,te  ====> status: 200 (0 record)
http://localhost:3000/api/posts?tags=history,tech&sortBy     ====> status: 200
http://localhost:3000/api/posts?tags=history,tech&sortBy=lik   ====> status: 400
http://localhost:3000/api/posts?tags=history,tech&sortBy=likes    ====> status: 200
http://localhost:3000/api/posts?tags=history,tech&sortBy=likes&direction=de    ====> status: 400
http://localhost:3000/api/posts?tags=history,tech&sortBy=likes&direction=desc   ====> status: 200