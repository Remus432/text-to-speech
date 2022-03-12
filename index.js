const express = require("express")
const cors = require("cors")
const textToSpeech = require("@google-cloud/text-to-speech")
const app = express()

const PORT = process.env.PORT || 8080

const fs = require("fs")
const util = require("util")

const client = new textToSpeech.TextToSpeechClient()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const convertTextToSpeech = async (text) => {
  const reqConfig = {
    input: { text },
    voice: { 
      languageCode: "en-US",
      name: "en-US-Wavenet-G"
     },
    audioConfig: { 
      audioEncoding: "LINEAR16",
      speakingRate:  0.95,
      pitch: -2
    }
  }

  // Text-to-Speech Request
  const [response] = await client.synthesizeSpeech(reqConfig)
  // Write binary data into file
  const writeFile = util.promisify(fs.writeFile)
  await writeFile ("output.mp3", response.audioContent, "binary")
  console.log("Audio content written")
}

app.get("/", (req, res) => {
  convertTextToSpeech("  It is easy to sit up and take notice, what's difficult is getting up and taking action  ")
  res.send("Hello World")
})

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})