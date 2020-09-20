//Define required files 
const Discord = require('discord.js');
require('dotenv').config();
const { prefix } = require('./config.json');
require('isomorphic-fetch');
var unirest = require("unirest");

//Start new Discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();

//Client ready listener
client.once('ready', () => {
    console.log('Ready!');
})

//Login to Discord
client.login(process.env.DISCORD_BOT_TOKEN);

//Function to call OpenWeather API
function weather(zipCode, user) {
  let apiKey = process.env.OPENWEATHER_API_KEY;
  let url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      var name = data['name'];
      let tempK = data['main']['temp'];
      let feelLikeK = data['main']['feels_like'];
      var description = data['weather'][0]['description'];
      var tempF = Math.round((tempK -273.15) * (9 / 5) + 32).toString();
      var feelLikeF = Math.round((feelLikeK -273.15) * (9 / 5) + 32).toString();
      client.on('message', msg => {
        user.send(`Currently in ${name}: \n \t Conditions: ${description} \n \t Temperature: ${tempF} \n \t Feel Like: ${feelLikeF}`);
      });
    })
    .catch(err => {
      console.log(err);
      error = err;
      return error; 
    }); 

} 
    
//Discord message listener
client.on('message', msg => {
  client.user.setActivity('The Weather', { type: 'WATCHING' });

  let zipCode = parseInt(msg.content.substring(3));
  let zipLength = zipCode.toString().length;

  if (msg.content.startsWith(prefix)) {
    if (zipLength === 5 ) {
      const userId = msg['author']['id'];
      const user = client.users.cache.get(userId);
      const name = msg['author']['username'];
      
      weather(zipCode, user);
      if (typeof error !== 'undefined') {
        msg.reply('I was not able to get the forcast.')
      }
    } else if (msg.content === `${prefix} -h`) {
      msg.reply('Weather bot returns the current forcast for your zip code. \n Simply enter your zipcode after the prefix.');
    } else {
      msg.reply('Enter a vaild zip code.');
    }
  } 

});
