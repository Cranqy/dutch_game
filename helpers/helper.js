const { MongoClient, ServerApiVersion } = require('mongodb');
const randomstring = require('randomstring');
const path = require('node:path');
const dotenv = require('dotenv').config({path:path.join(__dirname,'../.env')});
const uri = `mongodb+srv://crunk_user:${process.env.MONGO_PASSWORD}@cluster0.07m6w.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
exports.UpdateUserScore = async function() {
  console.log("Running:");
  client.connect().then(console.log("Connected"));

  client.close();
}
/*exports.UP = async function()
{
  let doc = [];
 console.log("Adding words");
  await new Promise((res,rej) => {
  
  for(let w in WORD_LIST)
  {
    console.log("The word is " + WORD_LIST[w]);
    let rec = {word:WORD_LIST[w][0],translations:WORD_LIST[w][1]};
    doc.push(rec);
  }
  res("done");
})
  
  await client.connect().then(console.log("Connected"));
  await client.db("cloudy_words").collection("words").insertMany(doc).then((result) => console.log("Inserted all words"));
}
*/
exports.getGameWords = async (req,res) =>{

  console.log("Getting game words");
  await client.connect().then(console.log("Connected"));

  let list = client.db("cloudy_words").collection("words").find();
  let parsed_list = await list.toArray();
  res.send(parsed_list);
}

exports.createSession = async (req, res) => {

  const { username, password } = req.body;
  await client.connect().catch((error) => console.log());
  let reg_user = await client.db("cloudy_words").collection("users").findOne({ user_id: username }).then((doc) => doc).catch(er =>console.log(er));
  if (!reg_user) 
  {
    return res.send('Not a registered user');
  }
  if ((reg_user.user_id == username) && (reg_user.user_password == password)) {
    let sess = req.session;
    let sid = randomstring.generate();
    sess.s_id = sid;
    req.session = sess;
      await client.db('cloudy_words').collection('sessions').insertOne(sess).then(res => console.log("inserted")).catch(err => console.log("Couldnt insert session"));
    res.cookie('s_id', sid, {maxAge: (60000 *24)});
    return res.redirect('/auth/admin');

  }
  else {
    return res.send("incorrect password");
  }
}

exports.verifySession = async (req,res,next) =>{

  if(!req.cookies.s_id) { return res.redirect('/auth/login')};

  await client.connect().catch((error) => console.log(error));
  try
  {
    let session = await client.db("cloudy_words").collection("sessions").findOne({s_id:req.cookies.s_id}).then((s) => s.s_id).catch(err => console.log("No session"));
    if(session == req.cookies.s_id) {return next();}

    return res.redirect('/auth/login');
  }
  catch(error)
  {
    console.log("error finding session.redirecting");
    return res.redirect('/');
  }

}

exports.insertWord = async(req,res,next) =>{

await client.connect().catch((error) => console.log(error));
let { word, translations, unit } = req.body;
let word_doc = {word:word,translations:translations.split(','),unit:unit};
await client.db("cloudy_words").collection("words").insertOne(word_doc).then(v => {return next();}).catch(err => {return next()});

}
exports.getWordTables = async (req,res,next) =>{

  console.log("Preparing to send");
  //GRAB WORDS FROM DB AND SEND AS PROPER JSON
  await client.connect().catch((error) => console.log(error));
  
  let word_collection = await client.db('cloudy_words').collection('words').find();
  let ob = await word_collection.toArray();
  res.send(ob);
}

exports.saveTable = async (req,res) =>{

  let altered_words = req.body;
  let backup;
  if(!altered_words) {return;}

  await client.connect().then(() => console.log("preparing to save new words to db"));
  let temp_backup = await client.db("cloudy_words").collection("words").find();
  backup = await temp_backup.toArray();
  if(!backup) {return res.send({message:"Trouble backing up database. Save cancelled."});}

  await client.db("cloudy_words").collection("words_backup").deleteMany({}).then(async (res) =>{

    await client.db("cloudy_words").collection("words_backup").insertMany(backup).then(() => console.log("Backup successful"));
  })

  await client.db("cloudy_words").collection("words").deleteMany({}).then(async (result) => {

    await client.db("cloudy_words").collection("words").insertMany(altered_words).then(res => console.log("inserted docs"));
  }).then((v) => res.send({message: `Last saved on: ${new Date()}`}));
  
}



