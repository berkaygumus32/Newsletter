//jshint esversion: 6

// create and require express
const express = require('express');
// create and require bodyParser
const bodyParser = require('body-parser');
// create and require request
const request = require('request');
//create require https
const https = require("https");


const app = express();

// To use the static files create the below use method
// and create public folder for static files
app.use(express.static("public"));

// use the bodyParser with urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// Get method
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
    
});

// Post method
app.post('/', (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    //flatpack JSON    
    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/4629185a7f";

    const options = {
        method: "POST",
        auth: "berkay1:d5d494514d7763e0e6a4602c585688ef-us14"

    }

    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
            
        } else {
            res.sendFile(__dirname + '/failure.html')
        }

        
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.post("/success", (req, res) => {
    res.redirect('/');
});


app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000")
})

//API key from mailchimp
//d5d494514d7763e0e6a4602c585688ef-us14


// List ID
// 4629185a7f