const http = require("http");

const postData = JSON.stringify({
  fullName: "Test User Registration",
  email: "test.registration@example.com",
  mobile: "9876543210",
  password: "TestPass123!",
  address: {
    street: "Test Street",
    city: "Test City",
    state: "Test State",
    pincode: "123456",
  },
});

const options = {
  hostname: "localhost",
  port: 5000,
  path: "/api/auth/register",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(postData),
  },
};

console.log("🧪 Testing registration API...");
console.log(
  "📤 Sending registration request to:",
  `http://${options.hostname}:${options.port}${options.path}`,
);

const req = http.request(options, (res) => {
  console.log(`📡 Status Code: ${res.statusCode}`);
  console.log(`📝 Headers:`, res.headers);

  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log("📨 Response Body:");
    try {
      const jsonData = JSON.parse(data);
      console.log(JSON.stringify(jsonData, null, 2));
    } catch (e) {
      console.log(data);
    }
  });
});

req.on("error", (e) => {
  console.error(`❌ Request Error: ${e.message}`);
});

req.write(postData);
req.end();
