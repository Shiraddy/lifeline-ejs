const reading = {
  method: "GET",
  hostname: "reading-home-apis.p.rapidapi.com",
  port: null,
  path: "/readinghome/api/get_book_detail_rapiapi?id=100",
  headers: {
    Authorization:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImdodWxhbWFiYmFzMDQwOUBnbWFpbC5jb20iLCJ1c2VyX2lkIjoiMSJ9.LFxL6F3M0f028qNZ0E7XuHIwE0thuTpJtdvDFtICUPY",
    "X-RapidAPI-Key": "6aa49fe548mshb15e91fba5dcfe0p1c875bjsnc34566ffe4f8",
    "X-RapidAPI-Host": "reading-home-apis.p.rapidapi.com",
  },
};

const req = http.request(reading, function (res) {
  const chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.end();

//TEXT TO SPEECH
const text2speech = {
  method: "POST",
  hostname: "joj-text-to-speech.p.rapidapi.com",
  port: null,
  path: "/",
  headers: {
    "content-type": "application/json",
    "X-RapidAPI-Key": "6aa49fe548mshb15e91fba5dcfe0p1c875bjsnc34566ffe4f8",
    "X-RapidAPI-Host": "joj-text-to-speech.p.rapidapi.com",
  },
};

const speech = http.request(text2speech, function (res) {
  const chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.write(
  JSON.stringify({
    input: {
      text: "Mary and Samantha arrived at the bus station early but waited until noon for the bus.",
    },
    voice: {
      languageCode: "en-US",
      name: "en-US-News-L",
      ssmlGender: "FEMALE",
    },
    audioConfig: {
      audioEncoding: "MP3",
    },
  })
);
speech.end();

//Bionic Reading
const qs = require("querystring");
const http = require("https");

const options = {
  method: "POST",
  hostname: "bionic-reading1.p.rapidapi.com",
  port: null,
  path: "/convert",
  headers: {
    "content-type": "application/x-www-form-urlencoded",
    "X-RapidAPI-Key": "6aa49fe548mshb15e91fba5dcfe0p1c875bjsnc34566ffe4f8",
    "X-RapidAPI-Host": "bionic-reading1.p.rapidapi.com",
  },
};

const bio = http.request(options, function (res) {
  const chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

bio.write(
  qs.stringify({
    content:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    response_type: "html",
    request_type: "html",
    fixation: "1",
    saccade: "10",
  })
);
bio.end();
